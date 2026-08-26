// The single place that decides how many permits a user may track.
//
// SERVER ONLY. This imports the service-role Supabase client — importing it
// from a Client Component would bundle the service key into the browser.
// Server Components and Server Actions only.
//
// Everything that gates permit tracking reads from here. Scattering the rule
// across the add form, the dashboard and the webhook is how the old system
// ended up with no enforcement at all: the only "gate" was a client-side
// insert that RLS happily accepted.

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SubscriptionStatus } from "@/types";

/** Permits every account may track without paying anything. */
export const FREE_TIER_PERMIT_LIMIT = 1;

/**
 * Subscription statuses that grant UNLIMITED tracking.
 *
 * ── THIS SET IS NOT A MIRROR OF ENTITLED_SUBSCRIPTION_STATUSES ──────────
 * scrapers/index.ts holds a set that looks almost identical. The two answer
 * DIFFERENT questions and are deliberately not the same:
 *
 *   this set → "how many permits may this user have?"
 *   ENTITLED_SUBSCRIPTION_STATUSES → "may this permit be checked at all?"
 *
 * 'free' makes the difference concrete. A free user's one permit IS checked,
 * so 'free' appears in the scraper's set — but a free user is capped at
 * 1 + purchased slots, so 'free' must NEVER appear here. Adding it would hand
 * every non-paying account unlimited tracking, which is the hole the whole
 * entitlement layer exists to close. Reconciling the two sets breaks a tier.
 *
 * Keyed on STATUS, never on a price ID. Any active permit-side subscription
 * counts, whatever it is billed at — today's $79/mo or whatever replaces it.
 * Checking a specific price here would drop every existing subscriber to the
 * free tier the moment a second price exists, which is the single most
 * expensive mistake available in this change.
 *
 * Not to be confused with the $29 permit slot: that is a one-time purchase,
 * never a subscription status, and it raises `limit` via purchasedSlots below
 * rather than granting anything unlimited.
 */
const UNLIMITED_STATUSES: ReadonlySet<string> = new Set<SubscriptionStatus>([
  "active",
  "trialing",
]);

export type EntitlementTier = "free" | "slots" | "unlimited";

export interface Entitlement {
  /** 'free' = allowance only, 'slots' = allowance + bought slots, 'unlimited' = subscribed. */
  tier: EntitlementTier;
  /** Permits allowed in total. Infinity when unlimited. */
  limit: number;
  /** Active permits currently tracked. */
  used: number;
  /** Whether one more permit may be added right now. */
  canAdd: boolean;
  /** Slots bought outright, summed across purchases. */
  purchasedSlots: number;
}

/**
 * Resolves a user's permit entitlement: one profiles read, one permits count,
 * one purchases sum, issued in parallel.
 *
 * Failure policy is fail-closed: an unreadable profile is treated as
 * not-subscribed rather than assumed-subscribed. A transient error therefore
 * blocks one permit add — recoverable by retrying, and loud in the logs —
 * whereas failing open would silently hand out unlimited tracking with nothing
 * to detect it. Same trade-off the scraper's entitlement filter makes.
 */
export async function getEntitlement(userId: string): Promise<Entitlement> {
  const [profileResult, permitsResult, purchasesResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("subscription_status")
      .eq("user_id", userId)
      .maybeSingle(),

    supabaseAdmin
      .from("permits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),

    // select("*") rather than select("quantity, refunded_at") on purpose: the
    // refunded_at column arrives in migration 019, and naming a column that
    // does not exist yet makes PostgREST fail the whole query. That failure is
    // handled below by assuming zero slots — which would silently strip paid
    // slots from every owner the moment this deployed ahead of the migration.
    // With select("*"), a pre-019 database simply returns rows without the
    // column, refunded_at reads as undefined, and every row counts — exactly
    // the behaviour that database should have, since it cannot record a refund
    // in the first place.
    supabaseAdmin
      .from("permit_slot_purchases")
      .select("*")
      .eq("user_id", userId),
  ]);

  if (profileResult.error) {
    console.error("[entitlements] Failed to read profile — treating as free tier", {
      userId,
      error: profileResult.error.message,
    });
  }

  if (permitsResult.error) {
    console.error("[entitlements] Failed to count permits", {
      userId,
      error: permitsResult.error.message,
    });
  }

  // Tolerated: migration 015 may not be applied yet, in which case the table
  // does not exist and every user simply has zero purchased slots. Degrading
  // to the free allowance is correct — no slot can have been sold before the
  // table that records the sale exists.
  if (purchasesResult.error) {
    console.error("[entitlements] Failed to read slot purchases — assuming 0", {
      userId,
      error: purchasesResult.error.message,
      hint: "Run migrations/015_permit_slot_purchases.sql if the table is missing.",
    });
  }

  const status = profileResult.data?.subscription_status as string | undefined;
  const used = permitsResult.count ?? 0;

  const purchasedSlots = (purchasesResult.data ?? [])
    .filter((row) => !(row as { refunded_at?: string | null }).refunded_at)
    .reduce((sum, row) => sum + (row.quantity as number), 0);

  // 'canceled' and 'past_due' fall through to the free allowance rather than
  // to zero: a lapsed subscriber keeps the free tier every account gets, and
  // keeps any slots they paid for outright. Purchased slots are not a rental.
  //
  // The divergence this note used to describe is closed: scrapers/index.ts now
  // admits 'canceled' and 'past_due' to ENTITLED_SUBSCRIPTION_STATUSES, so a
  // lapsed user's permits keep being checked rather than being accepted and
  // silently ignored. Adding is still capped here; checking is not capped
  // there, which is what the dashboard's lapsed banner tells the user.
  if (status !== undefined && UNLIMITED_STATUSES.has(status)) {
    return {
      tier: "unlimited",
      limit: Infinity,
      used,
      canAdd: true,
      purchasedSlots,
    };
  }

  const limit = FREE_TIER_PERMIT_LIMIT + purchasedSlots;

  return {
    tier: purchasedSlots > 0 ? "slots" : "free",
    limit,
    used,
    canAdd: used < limit,
    purchasedSlots,
  };
}
