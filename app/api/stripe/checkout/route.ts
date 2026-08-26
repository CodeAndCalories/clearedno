export const dynamic = 'force-dynamic'

// POST /api/stripe/checkout
// Creates a Stripe Checkout session and returns its URL.
//
// Two products share this route, selected by the `product` field in the body:
//
//   "permit_alerts" (default) — subscription. First month free (30-day trial),
//                               then $79/mo.
//   "permit_slot"             — one-time $9.99 for a single extra tracked
//                               permit. mode: "payment", no subscription.
//
// The default matters: the dashboard banners POST to this route as a plain
// HTML form with no body at all, and the signup page sends `{ email }`. Both
// must keep landing on the subscription path.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PRICE_ID } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
// Imported rather than redeclared: the value written here is the value
// lib/slot-fulfillment matches on, and the two must not drift.
import { SLOT_SKU } from "@/lib/slot-fulfillment";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Tolerate a missing or non-JSON body — form POSTs from the dashboard send
  // neither, and must continue to mean "the subscription".
  const body = await req
    .json()
    .catch(() => ({} as Record<string, unknown>));
  const product = typeof body?.product === "string" ? body.product : "permit_alerts";

  // Fetch or create a Stripe customer for this user
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

  const baseUrl = process.env.NEXT_PUBLIC_URL!;

  // ── One-time permit slot ($9.99) ────────────────────────────────────────
  if (product === SLOT_SKU) {
    const slotPriceId = process.env.STRIPE_SLOT_PRICE_ID;

    if (!slotPriceId) {
      console.error("[stripe/checkout] STRIPE_SLOT_PRICE_ID is not set.");
      return NextResponse.json(
        { error: "Permit slots aren't available yet." },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      // Passing `customer` explicitly is load-bearing. In payment mode
      // customer_creation defaults to "if_required", which for a plain one-off
      // charge means no Customer is created and session.customer comes back
      // null — tripping the webhook's `!session.customer` guard and silently
      // dropping a paid event. Reusing the existing id also keeps one customer
      // per user, which the billing portal depends on.
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: slotPriceId, quantity: 1 }],

      // Deliberately NO allow_promotion_codes here. A 100%-off code can leave
      // a session with no PaymentIntent at all, and that path is unverified —
      // the purchase ledger keys on session.id precisely to avoid depending on
      // the PaymentIntent, but the fulfillment behaviour at $0 is untested.

      // mode:"payment" has no subscription_data, so the user id cannot ride
      // along the way it does for subscriptions. Session-level metadata is what
      // survives to checkout.session.completed.
      metadata: {
        supabase_user_id: user.id,
        sku:              SLOT_SKU,
        quantity:         "1",
      },
      client_reference_id: user.id,

      // Session metadata does NOT propagate to the PaymentIntent. This copy is
      // what would carry attribution on payment_intent.* or charge.refunded
      // events, which read the PaymentIntent and never see the Session.
      payment_intent_data: {
        metadata: { supabase_user_id: user.id },
      },

      // {CHECKOUT_SESSION_ID} is substituted by Stripe on redirect. The add
      // page fulfills from it directly, so a buyer who returns before the
      // webhook lands still sees their slot — the webhook remains the
      // guarantee for buyers who never come back.
      success_url: `${baseUrl}/dashboard/add?slot=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/dashboard/add`,
    });

    return NextResponse.json({ url: session.url });
  }

  // ── Permit alerts subscription ($79/mo, first month free) ────────────────
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    // Outreach emails advertise FOUNDING49 — without this the code cannot be
    // entered here, only in the leads/account flows.
    allow_promotion_codes: true,
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url:  `${baseUrl}/dashboard`,
    payment_method_collection: "always",
    subscription_data: {
      trial_period_days: 30,
      metadata: { supabase_user_id: user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
