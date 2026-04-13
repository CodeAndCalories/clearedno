import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  // Use saved customer ID, or fall back to searching Stripe by email.
  // The latter handles the case where checkout created a live-mode customer
  // that hasn't been written back to the profiles table yet.
  let customerId: string | null = profile?.stripe_customer_id ?? null;

  if (!customerId) {
    const results = await stripe.customers.list({ email: user.email, limit: 1 });
    customerId = results.data[0]?.id ?? null;
  }

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer found for this account. Please complete checkout first." },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") ?? "";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/leads`,
  });

  return NextResponse.json({ url: session.url });
}
