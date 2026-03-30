// POST /api/stripe/checkout
// Creates a Stripe Checkout session and redirects the user to it.
// First month free (30-day trial), then $79/mo.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PRICE_ID } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url:  `${baseUrl}/dashboard`,
    payment_method_collection: "always",
    subscription_data: {
      trial_period_days: 30,
      metadata: { supabase_user_id: user.id },
    },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
