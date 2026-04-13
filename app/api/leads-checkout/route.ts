export const dynamic = "force-dynamic";

// POST /api/leads-checkout
// Creates a Stripe Checkout session for the roofing leads subscription.
// No auth required — anyone can purchase leads access.
//
// Required env vars:
//   STRIPE_SECRET_KEY       — already set
//   STRIPE_LEADS_PRICE_ID   — add to .env.local (create price in Stripe dashboard)

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const priceId = process.env.STRIPE_LEADS_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_LEADS_PRICE_ID is not configured." },
      { status: 500 }
    );
  }

  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/leads`,
    cancel_url: `${origin}/leads/landing`,
  });

  return NextResponse.json({ url: session.url });
}
