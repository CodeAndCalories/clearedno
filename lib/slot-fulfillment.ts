// Crediting a purchased permit slot — the one implementation.
//
// SERVER ONLY. Imports the service-role Supabase client and the Stripe secret
// key. Never import from a Client Component.
//
// Two callers, deliberately:
//
//   1. app/api/stripe/webhook — checkout.session.completed. Authoritative and
//      guaranteed to arrive, but arrives on Stripe's schedule.
//   2. app/dashboard/add — the buyer's own return from Checkout, carrying
//      ?session_id=. Immediate, but only happens if the buyer's browser
//      actually comes back.
//
// Neither alone is sufficient: webhooks can lag, and buyers close tabs. Stripe
// recommends running fulfillment from both, which is only safe because it is
// idempotent — the unique constraint on stripe_checkout_session_id means the
// second caller conflicts instead of granting a second slot.

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type Stripe from "stripe";

/**
 * metadata.sku written by app/api/stripe/checkout/route.ts.
 * Imported by that route so the written and matched values cannot drift.
 */
export const SLOT_SKU = "permit_slot";

/** Postgres unique_violation. A replayed event lands here, not in error. */
const PG_UNIQUE_VIOLATION = "23505";

export type SlotOutcome =
  | "recorded"   // credited just now
  | "duplicate"  // already credited — replay, or the other caller won the race
  | "ignored"    // not ours, unpaid, or unattributable; retrying cannot help
  | "forbidden"  // session belongs to a different user — nothing credited
  | "retry";     // transient failure; the webhook should ask Stripe to resend

/**
 * Credits a permit slot from a completed Checkout Session.
 *
 * `expectedUserId` is the security boundary for the landing-page caller. That
 * path takes a session id straight from the query string, so without this
 * check a user could paste someone else's `cs_...` id and credit themselves.
 * The webhook passes nothing: its session arrives inside a signature-verified
 * event, and there is no browser session to compare against.
 *
 * Note that the row is always written with the user id resolved *from the
 * Stripe session*, never with `expectedUserId`. Even if the comparison below
 * were wrong, the slot would land on the paying account rather than the
 * caller's.
 */
export async function fulfillSlotPurchase(
  session: Stripe.Checkout.Session,
  { expectedUserId }: { expectedUserId?: string } = {}
): Promise<SlotOutcome> {
  const tag = expectedUserId ? "[slot/return]" : "[slot/webhook]";

  if (session.mode !== "payment") {
    console.warn(`${tag} Not a payment-mode session — ignoring`, {
      sessionId: session.id,
      mode:      session.mode,
    });
    return "ignored";
  }

  if (session.metadata?.sku !== SLOT_SKU) {
    console.warn(`${tag} One-time payment with unrecognised sku — ignoring`, {
      sessionId: session.id,
      sku:       session.metadata?.sku ?? null,
    });
    return "ignored";
  }

  const userId =
    session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;

  // ── Ownership ──────────────────────────────────────────────────────────
  // Checked before payment_status so a probe cannot distinguish "someone
  // else's paid session" from "someone else's unpaid session".
  if (expectedUserId !== undefined && userId !== expectedUserId) {
    console.warn(`${tag} Session does not belong to the signed-in user — refusing`, {
      sessionId:     session.id,
      sessionUserId: userId,
      requestUserId: expectedUserId,
    });
    return "forbidden";
  }

  // Only credit money we actually have. Card payments settle before the buyer
  // returns and before the event fires, so payment_status is "paid"; a
  // delayed-notification method would read "unpaid" and settle later via
  // checkout.session.async_payment_succeeded, which nothing here handles.
  // Card-only checkout means that cannot happen today — this guard exists so
  // that widening payment_method_types fails loudly rather than giving product
  // away.
  if (session.payment_status === "unpaid") {
    console.error(`${tag} Slot session is unpaid — not crediting`, {
      sessionId:     session.id,
      paymentStatus: session.payment_status,
      hint: "Handle checkout.session.async_payment_succeeded before enabling delayed payment methods.",
    });
    return "ignored";
  }

  if (!userId) {
    // Someone paid and we cannot tell who. Retrying will not add metadata, so
    // this is escalation-by-logging: it needs a human and a manual credit.
    console.error(`${tag} PAID SLOT WITH NO USER ID — manual credit required`, {
      sessionId:     session.id,
      paymentIntent: session.payment_intent,
      customer:      session.customer,
      customerEmail: session.customer_details?.email ?? null,
      amountTotal:   session.amount_total,
    });
    return "ignored";
  }

  // Quantity round-trips through Stripe metadata we set, so it is re-validated
  // rather than trusted: anything not a positive integer falls back to one.
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
      // Expected on the second caller — the normal outcome once both the
      // webhook and the buyer's return have run.
      console.log(`${tag} Slot already credited for this session`, {
        sessionId: session.id,
        userId,
      });
      return "duplicate";
    }

    console.error(`${tag} Failed to record slot purchase`, {
      sessionId: session.id,
      userId,
      error:     error.message,
      code:      error.code,
      hint:      "Run migrations/015_permit_slot_purchases.sql if the table is missing.",
    });
    return "retry";
  }

  console.log(`${tag} Slot purchase recorded`, { sessionId: session.id, userId, quantity });
  return "recorded";
}

/**
 * Landing-page entry point: fetches the session from Stripe by id, then
 * fulfills it on behalf of `expectedUserId`.
 *
 * The session is re-fetched from Stripe rather than trusted from the URL —
 * the query string carries only an id, and every field the decision rests on
 * (sku, payment_status, metadata) comes back from Stripe itself.
 */
export async function fulfillSlotPurchaseBySessionId(
  sessionId: string,
  expectedUserId: string
): Promise<SlotOutcome> {
  // Cheap shape check before spending an API call on obvious junk.
  if (!sessionId.startsWith("cs_")) {
    console.warn("[slot/return] Ignoring malformed session id", { sessionId });
    return "ignored";
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    // A wrong or foreign id lands here as resource_missing. Nothing is
    // credited and nothing about the id is revealed to the caller.
    console.warn("[slot/return] Could not retrieve session", {
      sessionId,
      error: err instanceof Error ? err.message : String(err),
    });
    return "ignored";
  }

  return fulfillSlotPurchase(session, { expectedUserId });
}
