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

    const origin = req.nextUrl.origin;

    // Let Stripe create a fresh live-mode customer from the user's email.
    // Avoids stale test-mode customer IDs stored in the database.
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
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
