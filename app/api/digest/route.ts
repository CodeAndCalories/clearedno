// POST /api/digest
// Sends the weekly permit digest to all opted-in users.
// Called by the GitHub Actions weekly-digest.yml workflow every Monday at 8am CST.
//
// Authorization: Bearer token via DIGEST_SECRET env var.
// Rate-limit aware: sends one email per user, pauses between sends.
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendDigestEmail } from "@/lib/email-app";
import type { DigestPermit } from "@/app/emails/digest";
import type { PermitStatus, StatusHistoryEntry } from "@/types";

export const runtime = "nodejs";

// Weeks lookback window for detecting status changes
const DAYS_LOOKBACK = 7;

function weekOfString(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

/** Returns true if the status_history array has a change within the last N days */
function getRecentStatusChange(
  statusHistory: StatusHistoryEntry[],
  currentStatus: PermitStatus
): PermitStatus | null {
  if (!Array.isArray(statusHistory) || statusHistory.length < 2) return null;

  const cutoff = Date.now() - DAYS_LOOKBACK * 24 * 60 * 60 * 1000;
  // Walk history newest-to-oldest. If the latest entry (= current status) changed
  // within the window, report the one before it as the previous status.
  const sorted = [...statusHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const latest = sorted[0];
  if (!latest) return null;

  const latestTime = new Date(latest.timestamp).getTime();
  if (latestTime < cutoff) return null; // last change was older than the window

  // Find what status was in place just before this change
  const previous = sorted[1];
  if (!previous || previous.status === currentStatus) return null;

  return previous.status as PermitStatus;
}

/** Delay helper — keeps us well within Resend free-tier rate limits */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  // Simple bearer-token auth so only the GitHub Actions workflow can call this
  const secret = process.env.DIGEST_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const weekOf = weekOfString();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  // Fetch all active users (trialing or active subscription) who haven't opted out
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, user_id, full_name, digest_opted_out")
    .in("subscription_status", ["trialing", "active"])
    .eq("digest_opted_out", false);

  if (profilesError) {
    console.error("[digest] Failed to fetch profiles:", profilesError.message);
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, errors: 0, weekOf });
  }

  for (const profile of profiles) {
    try {
      // Fetch the user's email from auth.users
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);
      const userEmail = userData?.user?.email;
      if (!userEmail) { skipped++; continue; }

      // Fetch their active permits
      const { data: permitsData } = await supabaseAdmin
        .from("permits")
        .select("permit_number, address, city, state, status, last_checked, status_history")
        .eq("user_id", profile.user_id)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!permitsData || permitsData.length === 0) { skipped++; continue; }

      // Build digest permit list, tagging any that changed this week
      const digestPermits: DigestPermit[] = permitsData.map((p) => {
        const previous = getRecentStatusChange(
          (p.status_history ?? []) as StatusHistoryEntry[],
          p.status as PermitStatus
        );
        return {
          permit_number: p.permit_number,
          address: p.address,
          city: p.city,
          state: p.state,
          status: p.status as PermitStatus,
          last_checked: p.last_checked,
          previous_status: previous,
        };
      });

      const changedCount = digestPermits.filter((p) => p.previous_status).length;

      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard`;

      await sendDigestEmail({
        to: userEmail,
        userName: profile.full_name ?? "there",
        permits: digestPermits,
        changedCount,
        weekOf,
        unsubscribeUrl,
      });

      // Note: alerts table requires permit_id (FK NOT NULL) so we skip logging
      // weekly_summary there. The sent count in this response is the audit trail.

      sent++;

      // Pace sends: Resend free tier allows ~100/day; 200ms between sends is safe
      await sleep(200);
    } catch (err) {
      console.error(
        `[digest] Failed to send to user ${profile.user_id}:`,
        err instanceof Error ? err.message : err
      );
      errors++;
    }
  }

  console.log(`[digest] Done. sent=${sent} skipped=${skipped} errors=${errors}`);
  return NextResponse.json({ sent, skipped, errors, weekOf });
}
