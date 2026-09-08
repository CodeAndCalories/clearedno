// Unsubscribe endpoint. Two audiences live in two different tables:
//
//   app users        profiles.digest_opted_out — identified by ?u=<user_id>
//   outreach leads   outreach_leads.unsubscribed — identified by ?email=<addr>
//
// GET  is the legacy one-click link already sitting in cold-outreach emails
//      that have been sent ("To unsubscribe: .../api/unsubscribe?email=").
//      Those messages promised one click, so GET still acts immediately; it
//      now finishes on the /unsubscribe page instead of a wall of plain text.
//
// POST backs the confirm button on /unsubscribe and RFC 8058 one-click
//      (List-Unsubscribe-Post), which sends "List-Unsubscribe=One-Click" as
//      the body with the identifier in the query string.
//
// Everything an email links to lands on /unsubscribe, so a recipient always
// gets a page that says what happened rather than raw text or JSON.
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Opts the identified recipient out of bulk email.
 *
 * A user id is a UUID the recipient could not have guessed, which is what
 * keeps this endpoint from being a way to unsubscribe other people. An email
 * address is guessable, but it only ever reaches outreach_leads — a row that
 * exists solely because we cold-emailed that address in the first place.
 *
 * Returns the scopes actually applied. An email that matches no outreach row
 * updates nothing; we still report success, because the recipient's intent
 * ("stop emailing me") is satisfied either way and telling a stranger whether
 * an address is in our list would leak more than it helps.
 */
async function applyUnsubscribe({
  userId,
  email,
}: {
  userId?: string | null;
  email?: string | null;
}): Promise<{ ok: boolean; scopes: string[] }> {
  const scopes: string[] = [];

  if (userId && UUID_RE.test(userId)) {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ digest_opted_out: true })
      .eq("user_id", userId);

    if (error) {
      console.error("[unsubscribe] profiles update failed:", error.message);
      return { ok: false, scopes };
    }
    scopes.push("digest");
  }

  if (email) {
    const { error } = await supabaseAdmin
      .from("outreach_leads")
      .update({ unsubscribed: true })
      .eq("email", email);

    if (error) {
      console.error("[unsubscribe] outreach_leads update failed:", error.message);
      return { ok: false, scopes };
    }
    scopes.push("outreach");
  }

  return { ok: scopes.length > 0, scopes };
}

/** Send the recipient to the page that explains what just happened. */
function toPage(req: NextRequest, params: Record<string, string>) {
  const url = new URL("/unsubscribe", req.nextUrl.origin);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  // 303 so a POSTed form becomes a GET on the result page and a refresh
  // cannot resubmit it.
  return NextResponse.redirect(url, 303);
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  // No address to act on — show the page's "we need the link" state rather
  // than a 400 the recipient can do nothing with.
  if (!email) return toPage(req, {});

  const { ok } = await applyUnsubscribe({ email });
  return ok ? toPage(req, { done: "1" }) : toPage(req, { error: "1" });
}

export async function POST(req: NextRequest) {
  // Identifiers may arrive in the query string (one-click) or the form body
  // (our confirm button). Read both; the body wins where they disagree.
  let userId = req.nextUrl.searchParams.get("u");
  let email = req.nextUrl.searchParams.get("email");

  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { u?: string; email?: string };
      userId = body.u ?? userId;
      email = body.email ?? email;
    } else {
      const form = await req.formData();
      userId = (form.get("u") as string | null) ?? userId;
      email = (form.get("email") as string | null) ?? email;
    }
  } catch {
    // A one-click POST can arrive with an empty or unparseable body. The
    // query string still identifies the recipient, so keep going.
  }

  if (!userId && !email) return toPage(req, {});

  const { ok } = await applyUnsubscribe({ userId, email });
  return ok ? toPage(req, { done: "1" }) : toPage(req, { error: "1" });
}
