// POST /api/referral/track
//
// Called after a new user completes signup via a referral link.
// Links the new user to their referrer and creates a referral record.
// If the referred user is already paying, awards 1 free month to the referrer
// via a Stripe coupon applied to their subscription.
//
// Body: { referralCode: string, newUserId: string }
//
// This route uses the service role key and should only be called server-side
// (e.g., from the Stripe webhook or auth callback, not from the browser).

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { referralCode?: string; newUserId?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { referralCode, newUserId } = body;

  if (!referralCode || !newUserId) {
    return NextResponse.json(
      { error: "referralCode and newUserId are required" },
      { status: 400 }
    );
  }

  // ── 1. Find the referrer by their referral code ───────────────────────────
  const { data: referrerProfile, error: referrerErr } = await supabaseAdmin
    .from("profiles")
    .select("id, user_id, stripe_subscription_id")
    .eq("referral_code", referralCode)
    .maybeSingle();

  if (referrerErr || !referrerProfile) {
    return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
  }

  // ── 2. Find the new user's profile ───────────────────────────────────────
  const { data: newUserProfile, error: newUserErr } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("user_id", newUserId)
    .maybeSingle();

  if (newUserErr || !newUserProfile) {
    return NextResponse.json({ error: "New user profile not found" }, { status: 404 });
  }

  // Prevent self-referral
  if (referrerProfile.id === newUserProfile.id) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  }

  // ── 3. Check if referral already exists (idempotency) ────────────────────
  const { data: existing } = await supabaseAdmin
    .from("referrals")
    .select("id")
    .eq("referrer_user_id", referrerProfile.id)
    .eq("referred_user_id", newUserProfile.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ success: true, message: "Referral already tracked" });
  }

  // ── 4. Save the referred_by_code on the new user's profile ───────────────
  await supabaseAdmin
    .from("profiles")
    .update({ referred_by_code: referralCode })
    .eq("id", newUserProfile.id);

  // ── 5. Create the referral record ─────────────────────────────────────────
  const { error: insertError } = await supabaseAdmin
    .from("referrals")
    .insert({
      referrer_user_id:    referrerProfile.id,
      referred_user_id:    newUserProfile.id,
      status:              "pending",
      free_months_awarded: 0,
    });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // ── 6. Award 1 free month to referrer if they have an active subscription ─
  // Apply a 100%-off-for-1-month coupon to their subscription.
  if (referrerProfile.stripe_subscription_id) {
    try {
      // Create a one-time coupon: 100% off for 1 month
      const coupon = await stripe.coupons.create({
        percent_off: 100,
        duration:    "once",
        name:        "Referral Reward — 1 Free Month",
      });

      // Apply the coupon to the referrer's subscription
      await stripe.subscriptions.update(referrerProfile.stripe_subscription_id, {
        coupon: coupon.id,
      });

      // Mark the referral as completed and increment free months
      await supabaseAdmin
        .from("referrals")
        .update({
          status:              "completed",
          free_months_awarded: 1,
        })
        .eq("referrer_user_id", referrerProfile.id)
        .eq("referred_user_id", newUserProfile.id);
    } catch (stripeErr) {
      // Non-fatal: referral is still recorded, coupon can be applied manually
      console.error(
        JSON.stringify({
          level:   "error",
          message: "Failed to apply Stripe referral coupon",
          error:   stripeErr instanceof Error ? stripeErr.message : String(stripeErr),
          referrer_user_id: referrerProfile.id,
          referred_user_id: newUserProfile.id,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }

  return NextResponse.json({ success: true, message: "Referral tracked" });
}
