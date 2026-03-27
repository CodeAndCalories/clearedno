export const dynamic = "force-dynamic";

// POST /api/referral/generate
// Generates a unique 8-char referral code for the logged-in user.
// Returns { code, url } — idempotent (returns existing code if already set).
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has a code
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("referral_code")
    .eq("user_id", user.id)
    .single();

  if (profile?.referral_code) {
    const code = profile.referral_code as string;
    return NextResponse.json({
      code,
      url: `https://www.clearedno.com/signup?ref=${code}`,
    });
  }

  // Generate a unique 8-char hex code (up to 10 attempts)
  let code = "";
  for (let i = 0; i < 10; i++) {
    const candidate = randomBytes(4).toString("hex").toUpperCase();
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("referral_code", candidate)
      .maybeSingle();
    if (!existing) {
      code = candidate;
      break;
    }
  }

  if (!code) {
    return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 });
  }

  await supabaseAdmin
    .from("profiles")
    .update({ referral_code: code })
    .eq("user_id", user.id);

  return NextResponse.json({
    code,
    url: `https://www.clearedno.com/signup?ref=${code}`,
  });
}
