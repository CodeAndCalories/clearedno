export const dynamic = "force-dynamic";

// POST /api/leads-checkout
// Creates a Stripe Checkout session for the roofing leads subscription.
//
// Required env vars:
//   STRIPE_SECRET_KEY       — already set
//   STRIPE_LEADS_PRICE_ID   — add to .env.local (create price in Stripe dashboard)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const priceId = process.env.STRIPE_LEADS_PRICE_ID;
    if (!priceId) {
      console.error("[leads-checkout] STRIPE_LEADS_PRICE_ID is not set.");
      return NextResponse.json(
        { error: "STRIPE_LEADS_PRICE_ID is not configured." },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reuse existing Stripe customer if one exists for this user
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, full_name")
      .eq("user_id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const origin = req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/leads`,
      cancel_url: `${origin}/leads/landing`,
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[leads-checkout] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
