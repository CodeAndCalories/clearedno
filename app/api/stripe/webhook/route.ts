// POST /api/stripe/webhook
// Receives Stripe events and keeps the profiles table in sync with subscription state.
// Must be registered at https://dashboard.stripe.com/webhooks
// with the raw body (Next.js App Router does NOT auto-parse it).
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email-app";
import type Stripe from "stripe";

// App Router reads the raw body via req.text() — no config needed.
// Force Node.js runtime so the crypto module is available for signature verification.
export const runtime = "nodejs";

// Map Stripe subscription statuses to our internal status enum
function mapStatus(stripeStatus: Stripe.Subscription.Status): string {
  const map: Record<string, string> = {
    trialing:           "trialing",
    active:             "active",
    past_due:           "past_due",
    canceled:           "canceled",
    unpaid:             "past_due",
    incomplete:         "past_due",
    incomplete_expired: "canceled",
    paused:             "past_due",
  };
  return map[stripeStatus] ?? "canceled";
}

/** Founding-member discount, identified by coupon name / promo code (not coupon id). */
const FOUNDING_CODE = "FOUNDING49";

/** Returns true when a subscription's price is the roofing leads product. */
function isLeadsSubscription(subscription: Stripe.Subscription): boolean {
  const priceId = subscription.items.data[0]?.price.id;
  return !!priceId && priceId === process.env.STRIPE_LEADS_PRICE_ID;
}

/**
 * Stripe's trial_end (unix seconds) as an ISO timestamp, or null when the
 * subscription has no trial.
 *
 * profiles.trial_ends_at defaults to signup + 14 days, but checkout creates a
 * 30-day Stripe trial — and nothing used to reconcile the two. A subscriber
 * was therefore bounced to /trial-expired on day 15 while Stripe still had 15
 * days left on a trial it had not charged for. Stripe is the party that
 * actually decides when the trial ends and when the first invoice is cut, so
 * it is the source of truth; this mirrors its answer into the column every
 * time we hear about the subscription.
 *
 * Writing null when Stripe reports no trial is deliberate: a stale future
 * timestamp on a fully-paid subscription is exactly the drift being fixed.
 */
function stripeTrialEndsAt(subscription: Stripe.Subscription): string | null {
  return subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;
}

// ---------------------------------------------------------------------------
// One-time purchases (mode: "payment")
// ---------------------------------------------------------------------------

/** metadata.sku written by app/api/stripe/checkout/route.ts for a slot purchase. */
const SLOT_SKU = "permit_slot";

/** Postgres unique_violation. A replayed Stripe event lands here, not in error. */
const PG_UNIQUE_VIOLATION = "23505";

type SlotOutcome =
  | "recorded"   // credited
  | "duplicate"  // already credited; replayed event
  | "ignored"    // not ours, or unattributable — retrying cannot help
  | "retry";     // transient failure; ask Stripe to send it again

/**
 * Credits a purchased permit slot.
 *
 * Idempotency comes from the unique constraint on stripe_checkout_session_id:
 * Stripe retries the same event on any non-2xx, and both
 * checkout.session.completed and checkout.session.async_payment_succeeded
 * carry the same session id. A second insert conflicts instead of granting a
 * second slot, and that conflict is success, not failure.
 *
 * The product is identified by metadata.sku rather than by price id, matching
 * how entitlement is decided everywhere else: a price is a number that will
 * change, not an identity. There is also no Subscription object on this path,
 * so isLeadsSubscription() cannot be consulted at all.
 */
async function recordSlotPurchase(
  session: Stripe.Checkout.Session
): Promise<SlotOutcome> {
  if (session.metadata?.sku !== SLOT_SKU) {
    console.warn("[stripe/webhook] One-time payment with unrecognised sku — ignoring", {
      sessionId: session.id,
      sku:       session.metadata?.sku ?? null,
    });
    return "ignored";
  }

  // Only credit money we actually have. Card payments settle before this event
  // fires, so payment_status is "paid"; a delayed-notification method would
  // arrive "unpaid" and settle later via checkout.session.async_payment_
  // succeeded, which this endpoint does not handle. Card-only checkout means
  // that cannot happen today — this guard exists so that widening
  // payment_method_types fails loudly rather than giving product away.
  if (session.payment_status === "unpaid") {
    console.error("[stripe/webhook] Slot session is unpaid — not crediting", {
      sessionId:     session.id,
      paymentStatus: session.payment_status,
      hint: "Handle checkout.session.async_payment_succeeded before enabling delayed payment methods.",
    });
    return "ignored";
  }

  const userId =
    session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;

  if (!userId) {
    // Someone paid and we cannot tell who. Retrying will not add metadata, so
    // this is escalation-by-logging: it needs a human and a manual credit.
    console.error("[stripe/webhook] PAID SLOT WITH NO USER ID — manual credit required", {
      sessionId:     session.id,
      paymentIntent: session.payment_intent,
      customer:      session.customer,
      customerEmail: session.customer_details?.email ?? null,
      amountTotal:   session.amount_total,
    });
    return "ignored";
  }

  // Quantity is attacker-adjacent (it round-trips through Stripe metadata we
  // set), so it is re-validated rather than trusted: anything that is not a
  // positive integer falls back to one slot.
  const parsed = Number.parseInt(session.metadata?.quantity ?? "1", 10);
  const quantity = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const { error } = await supabaseAdmin.from("permit_slot_purchases").insert({
    user_id:                    userId,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:   paymentIntentId,
    quantity,
  });

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) {
      console.log("[stripe/webhook] Slot already credited for this session — replay", {
        sessionId: session.id,
        userId,
      });
      return "duplicate";
    }

    // The customer has paid and holds no slot. Returning non-2xx makes Stripe
    // redeliver, which the unique constraint makes safe.
    console.error("[stripe/webhook] Failed to record slot purchase — will ask Stripe to retry", {
      sessionId: session.id,
      userId,
      error:     error.message,
      code:      error.code,
      hint:      "Run migrations/015_permit_slot_purchases.sql if the table is missing.",
    });
    return "retry";
  }

  console.log("[stripe/webhook] Slot purchase recorded", {
    sessionId: session.id,
    userId,
    quantity,
  });
  return "recorded";
}

// ---------------------------------------------------------------------------
// ClearedNo permit-checker subscription handler (unchanged)
// ---------------------------------------------------------------------------

async function updateSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_status: mapStatus(subscription.status),
      stripe_subscription_id: subscription.id,
      trial_ends_at: stripeTrialEndsAt(subscription),
    })
    .eq("user_id", userId);
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

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

    // ── Checkout completed: first-time subscription created ──────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // ── One-time purchases ────────────────────────────────────────────────
      // This must come before the guard below. A mode:"payment" session has
      // subscription === null by definition, and customer === null unless one
      // was passed explicitly — so the guard drops these events entirely, which
      // is how a paid slot would vanish without trace.
      if (session.mode === "payment") {
        const outcome = await recordSlotPurchase(session);

        if (outcome === "retry") {
          return NextResponse.json(
            { error: "Failed to record purchase" },
            { status: 500 }
          );
        }
        break;
      }

      // Only handle subscription-mode checkouts
      if (!session.subscription || !session.customer) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      // ── Roofing leads checkout ────────────────────────────────────────────
      if (isLeadsSubscription(subscription)) {
        await supabaseAdmin
          .from("profiles")
          .update({
            stripe_customer_id:       session.customer as string,
            leads_subscription_id:    subscription.id,
            leads_subscription_status: "active",
          })
          .eq("user_id", userId);
        break;
      }

      // ── ClearedNo permit-checker checkout (existing logic) ────────────────

      // Detect founding checkout: session had the FOUNDING49 discount applied.
      // The live coupon was created in the dashboard, so "FOUNDING49" is its
      // *name* (id is auto-generated) — match on name and promo code too, not
      // just id, or founding signups get recorded as regular ones.
      const isFoundingCheckout = (session.total_details?.breakdown?.discounts ?? []).some(
        (d) => {
          const discount = d.discount as {
            coupon?: { id?: string; name?: string | null };
            promotion_code?: string | { code?: string } | null;
          };
          const promo = discount?.promotion_code;
          const promoCode = typeof promo === "string" ? undefined : promo?.code;
          return (
            discount?.coupon?.id === FOUNDING_CODE ||
            discount?.coupon?.name === FOUNDING_CODE ||
            promoCode === FOUNDING_CODE
          );
        }
      );

      // Persist customer + subscription state (handles race with subscription.created)
      const { error: stateError } = await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id:     session.customer as string,
          stripe_subscription_id: subscription.id,
          subscription_status:    mapStatus(subscription.status),
          // Synced here as well as in updateSubscription(): checkout.session.completed
          // and customer.subscription.created arrive in no guaranteed order, and the
          // dashboard reads this column on the very next page load.
          trial_ends_at:          stripeTrialEndsAt(subscription),
        })
        .eq("user_id", userId);

      if (stateError) {
        // Loud: the customer has paid but we failed to record it.
        console.error("[stripe/webhook] Failed to persist subscription state", {
          userId,
          subscriptionId: subscription.id,
          error: stateError.message,
        });
      }

      // The founding flag is written separately and best-effort: `plan` is a
      // newer column, and a failure here must never discard the billing state
      // above (PostgREST rejects the whole payload when one column is missing).
      if (isFoundingCheckout) {
        const { error: planError } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "founding" })
          .eq("user_id", userId);

        if (planError) {
          console.error("[stripe/webhook] Failed to set plan='founding'", {
            userId,
            error: planError.message,
            hint: "Run migrations/011_profiles_plan.sql if the column is missing.",
          });
        }
      }

      // Send welcome email — fetch user's email from auth.users
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const userEmail = userData?.user?.email;
      if (!userEmail) break;

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("user_id", userId)
        .single();

      await sendWelcomeEmail({
        to:       userEmail,
        userName: profile?.full_name ?? "there",
      });

      // Convert any pending referral for this user
      if (!profile?.id) break;
      const { data: pendingReferral } = await supabaseAdmin
        .from("referrals")
        .select("*, referrer:referrer_user_id(stripe_subscription_id)")
        .eq("referred_user_id", profile.id)
        .eq("status", "pending")
        .single();

      if (pendingReferral?.referrer?.stripe_subscription_id) {
        const coupon = await stripe.coupons.create({
          percent_off: 100,
          duration:    "once",
          name:        "Referral Reward — 1 Free Month",
        });
        await stripe.subscriptions.update(
          pendingReferral.referrer.stripe_subscription_id,
          { coupon: coupon.id }
        );
        await supabaseAdmin
          .from("referrals")
          .update({ status: "completed", free_months_awarded: 1 })
          .eq("id", pendingReferral.id);
      }

      break;
    }

    // ── Ongoing subscription lifecycle ────────────────────────────────────────
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.resumed":
      // Only sync permit-checker subscriptions here; leads are handled at checkout
      if (!isLeadsSubscription(event.data.object as Stripe.Subscription)) {
        await updateSubscription(event.data.object as Stripe.Subscription);
      }
      break;

    // ── Subscription canceled ─────────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;

      if (isLeadsSubscription(sub)) {
        // Cancel the leads subscription
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({ leads_subscription_status: "canceled" })
            .eq("user_id", userId);
        }
      } else {
        // Cancel the permit-checker subscription (existing logic)
        await updateSubscription(sub);
      }
      break;
    }

    case "invoice.payment_failed": {
      // Mark as past_due to surface a warning in the dashboard
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
        if (!isLeadsSubscription(sub)) {
          await updateSubscription(sub);
        }
      }
      break;
    }

    default:
      // Unhandled events are silently ignored
      break;
  }

  return NextResponse.json({ received: true });
}
