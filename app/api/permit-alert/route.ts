import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Public endpoint — captures an email lead from a permit detail page and stores
// it in permit_alerts for the $79 tracker upsell. No auth (anonymous visitors).

// Basic email validation — reject obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email as string | undefined)?.trim().toLowerCase() ?? "";
  const city = (body.city as string | undefined)?.trim() || null;
  const projectType = (body.projectType as string | undefined)?.trim() || null;

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("permit_alerts").insert({
    email,
    city,
    project_type: projectType,
  });

  if (error) {
    console.error("permit_alerts insert error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
