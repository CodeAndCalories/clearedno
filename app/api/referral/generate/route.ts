// POST /api/referral/generate
//
// Generates a unique 8-character referral code for the authenticated user
// and saves it to their profile. If they already have a code, returns the
// existing one. Idempotent — safe to call multiple times.
//
// Returns: { code: string, url: string }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Generates a random alphanumeric code of the given length.
// Uses uppercase letters + digits, avoiding ambiguous chars (0/O, 1/I/l).
function generateCode(length = 8): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Generates a unique code by retrying if a collision occurs (extremely rare).
async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode(8);
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();

    if (!data) return code; // No collision — code is unique
  }
  throw new Error("Could not generate a unique referral code after 10 attempts");
}

export async function POST(): Promise<NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the user's current profile to check for existing code
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from("profiles")
    .select("id, referral_code")
    .eq("user_id", user.id)
    .single();

  if (fetchError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Return existing code if already generated
  if (profile.referral_code) {
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://www.clearedno.com";
    return NextResponse.json({
      code: profile.referral_code,
      url:  `${baseUrl}/signup?ref=${profile.referral_code}`,
    });
  }

  // Generate and save a new unique code
  let code: string;
  try {
    code = await generateUniqueCode();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Code generation failed" },
      { status: 500 }
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ referral_code: code })
    .eq("id", profile.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://www.clearedno.com";
  return NextResponse.json({
    code,
    url: `${baseUrl}/signup?ref=${code}`,
  });
}
