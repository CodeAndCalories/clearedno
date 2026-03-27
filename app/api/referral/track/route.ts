export const dynamic = "force-dynamic";

// POST /api/referral/track
// Called after a new user signs up to link them to their referrer.
// Body: { userId: string, refCode: string }
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { userId, refCode } = body as { userId?: string; refCode?: string };

  if (!userId || !refCode) {
    return NextResponse.json({ error: "Missing userId or refCode" }, { status: 400 });
  }

  // Find referrer by code
  const { data: referrer } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("referral_code", refCode)
    .maybeSingle();

  if (!referrer) {
    // Invalid code — not an error worth surfacing to user
    return NextResponse.json({ ok: true });
  }

  // Prevent self-referral
  if (referrer.user_id === userId) {
    return NextResponse.json({ ok: true });
  }

  // Save the code on the new user's profile
  await supabaseAdmin
    .from("profiles")
    .update({ referred_by_code: refCode })
    .eq("user_id", userId);

  // Insert referral record (ignore if the referred user already has one)
  await supabaseAdmin
    .from("referrals")
    .upsert(
      {
        referrer_user_id: referrer.user_id,
        referred_user_id: userId,
        status: "pending",
      },
      { onConflict: "referred_user_id" }
    );

  return NextResponse.json({ ok: true });
}
