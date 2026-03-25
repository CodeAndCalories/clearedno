// GET /api/stripe/portal
// Creates a dynamic Stripe Billing Portal session for the authenticated user
// and redirects them to it. Each session is single-use and short-lived (~5 min),
// which is more secure than a static portal URL.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function GET() {
  // 1. Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Look up their Stripe customer ID from the profiles table
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  const stripeCustomerId = profile?.stripe_customer_id;

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found" },
      { status: 400 }
    );
  }

  // 3. Create a dynamic portal session — single-use, expires in ~5 minutes
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  });

  // 4. Redirect the user to the session URL
  return NextResponse.redirect(portalSession.url, { status: 303 });
}
