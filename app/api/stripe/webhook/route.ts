// POST /api/stripe/webhook
// Receives Stripe events and keeps the profiles table in sync with subscription state.
// Must be registered at https://dashboard.stripe.com/webhooks
// with the raw body (Next.js App Router does NOT auto-parse it).
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type Stripe from "stripe";

// App Router reads the raw body via req.text() — no config needed.
// Force Node.js runtime so the crypto module is available for signature verification.
export const runtime = "nodejs";

// Map Stripe subscription statuses to our internal status enum
function mapStatus(stripeStatus: Stripe.Subscription.Status): string {
  const map: Record<string, string> = {
    trialing:         "trialing",
    active:           "active",
    past_due:         "past_due",
    canceled:         "canceled",
    unpaid:           "past_due",
    incomplete:       "past_due",
    incomplete_expired: "canceled",
    paused:           "past_due",
  };
  return map[stripeStatus] ?? "canceled";
}

async function updateSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_status: mapStatus(subscription.status),
      stripe_subscription_id: subscription.id,
    })
    .eq("user_id", userId);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  // Handle relevant subscription lifecycle events
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.resumed":
      await updateSubscription(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted":
      await updateSubscription(event.data.object as Stripe.Subscription);
      break;

    case "invoice.payment_failed": {
      // Mark as past_due to surface a warning in the dashboard
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
        await updateSubscription(sub);
      }
      break;
    }

    default:
      // Unhandled events are silently ignored
      break;
  }

  return NextResponse.json({ received: true });
}
