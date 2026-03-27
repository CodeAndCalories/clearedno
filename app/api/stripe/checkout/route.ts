// POST /api/stripe/checkout
// Creates a Stripe Checkout session and redirects the user to it.
//
// Query params:
//   ?plan=founding  → uses STRIPE_FOUNDING_PRICE_ID ($49/mo locked forever)
//   (default)       → uses STRIPE_PRICE_ID ($79/mo standard)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PRICE_ID } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

const FOUNDING_PRICE_ID = process.env.STRIPE_FOUNDING_PRICE_ID ?? "";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Resolve price: founding member vs standard
  const plan    = req.nextUrl.searchParams.get("plan");
  const priceId = plan === "founding" && FOUNDING_PRICE_ID
    ? FOUNDING_PRICE_ID
    : PRICE_ID;

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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url:  `${baseUrl}/dashboard`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { supabase_user_id: user.id },
    },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
