// ─────────────────────────────────────────────────────────
// Read-only audit: which customers bought with the FOUNDING49 discount, and
// does their profile record it?
//
//   npx ts-node scripts/audit-founding-members.ts
//
// Writes nothing — to Stripe or Supabase. Reports a backfill plan only.
//
// Background: the webhook used to match `coupon.id === "FOUNDING49"`, but the
// live coupon's id is auto-generated ("FOUNDING49" is only its name), so
// founding checkouts were never marked `plan = "founding"`.
// ─────────────────────────────────────────────────────────

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Stripe from "stripe";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const FOUNDING_CODE = "FOUNDING49";

type FoundingSub = {
  subscriptionId: string;
  customerId: string;
  supabaseUserId: string | null;
  couponId: string;
  created: string;
  status: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} is not set. Add it to .env.local before running this audit.`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-02-24.acacia",
  });
  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // ── 1. Which coupons carry the FOUNDING49 identity? ──────────────────────
  // Match by id OR name, since the dashboard-created coupon has neither aligned.
  const foundingCouponIds = new Set<string>();
  let totalRedemptions = 0;

  for await (const coupon of stripe.coupons.list({ limit: 100 })) {
    if (coupon.id === FOUNDING_CODE || coupon.name === FOUNDING_CODE) {
      foundingCouponIds.add(coupon.id);
      totalRedemptions += coupon.times_redeemed;
      const off =
        coupon.amount_off != null
          ? `$${(coupon.amount_off / 100).toFixed(2)} off`
          : `${coupon.percent_off}% off`;
      console.log(
        `coupon ${coupon.id}  name="${coupon.name ?? ""}"  ${off} ${coupon.duration}  ` +
          `times_redeemed=${coupon.times_redeemed}  valid=${coupon.valid}`
      );
    }
  }

  for await (const promo of stripe.promotionCodes.list({ code: FOUNDING_CODE, limit: 100 })) {
    foundingCouponIds.add(promo.coupon.id);
    totalRedemptions += promo.times_redeemed;
    console.log(
      `promo  ${promo.id}  code=${promo.code}  active=${promo.active}  ` +
        `coupon=${promo.coupon.id}  times_redeemed=${promo.times_redeemed}`
    );
  }

  if (!foundingCouponIds.size) {
    console.log(`\nNo ${FOUNDING_CODE} coupon or promotion code exists — nothing to audit.`);
    return;
  }

  // Redemption counters are authoritative and cost one cheap read: if nothing
  // was ever redeemed, no subscription can carry the discount and the
  // per-subscription scan below is unnecessary.
  console.log(`\ntotal ${FOUNDING_CODE} redemptions across all coupons/codes: ${totalRedemptions}`);

  // ── 2. Subscriptions that actually applied one of those coupons ──────────
  const founding: FoundingSub[] = [];
  let subscriptionScanFailed: string | null = null;

  try {
    await scanSubscriptions(stripe, foundingCouponIds, founding);
  } catch (err) {
    // Restricted keys frequently lack subscription_read. Not fatal: the
    // redemption counters above already bound the answer.
    subscriptionScanFailed = err instanceof Error ? err.message : String(err);
    console.log(`\n── Stripe: subscription scan unavailable ──`);
    console.log(`  ${subscriptionScanFailed.split(".")[0]}.`);
    console.log(
      totalRedemptions === 0
        ? `  Not a problem here: ${totalRedemptions} redemptions means there is nothing to find.`
        : `  ⚠ ${totalRedemptions} redemption(s) exist but cannot be attributed — grant\n` +
            `    "Subscriptions Read" to the key and re-run before concluding anything.`
    );
  }

  if (!subscriptionScanFailed) {
    console.log(`\n── Stripe: subscriptions with a ${FOUNDING_CODE} discount ──`);
    if (!founding.length) {
      console.log("  none");
    } else {
      for (const f of founding) {
        console.log(
          `  ${f.subscriptionId}  ${f.status}  created=${f.created}  ` +
            `coupon=${f.couponId}  supabase_user_id=${f.supabaseUserId ?? "MISSING"}`
        );
      }
    }
  }

  await auditSupabase(supabase, founding, totalRedemptions, subscriptionScanFailed);
}

async function scanSubscriptions(
  stripe: Stripe,
  foundingCouponIds: Set<string>,
  founding: FoundingSub[]
) {
  for await (const sub of stripe.subscriptions.list({
    status: "all",
    limit: 100,
    expand: ["data.discounts"],
  })) {
    // The API version in use exposes `discounts`; older payloads used `discount`.
    const raw = sub as unknown as {
      discounts?: Array<string | { coupon?: { id?: string } }>;
      discount?: { coupon?: { id?: string } } | null;
    };
    const couponIds: string[] = [];

    for (const d of raw.discounts ?? []) {
      if (typeof d === "string") continue; // unexpanded id — resolved below
      if (d.coupon?.id) couponIds.push(d.coupon.id);
    }
    if (raw.discount?.coupon?.id) couponIds.push(raw.discount.coupon.id);

    const hit = couponIds.find((id) => foundingCouponIds.has(id));
    if (!hit) continue;

    founding.push({
      subscriptionId: sub.id,
      customerId: sub.customer as string,
      supabaseUserId: sub.metadata?.supabase_user_id ?? null,
      couponId: hit,
      created: new Date(sub.created * 1000).toISOString().slice(0, 10),
      status: sub.status,
    });
  }

  // Invoices catch one-off `duration: once` discounts that a subscription no
  // longer reports after the first billing cycle.
  const invoiceHits = new Map<string, string>(); // subscriptionId -> couponId
  for await (const invoice of stripe.invoices.list({ limit: 100 })) {
    const subId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id;
    if (!subId) continue;
    for (const amount of invoice.total_discount_amounts ?? []) {
      const discount = amount.discount as unknown as string | { coupon?: { id?: string } };
      const couponId = typeof discount === "string" ? undefined : discount?.coupon?.id;
      if (couponId && foundingCouponIds.has(couponId)) invoiceHits.set(subId, couponId);
    }
  }

  for (const [subId, couponId] of invoiceHits) {
    if (founding.some((f) => f.subscriptionId === subId)) continue;
    const sub = await stripe.subscriptions.retrieve(subId);
    founding.push({
      subscriptionId: sub.id,
      customerId: sub.customer as string,
      supabaseUserId: sub.metadata?.supabase_user_id ?? null,
      couponId,
      created: new Date(sub.created * 1000).toISOString().slice(0, 10),
      status: sub.status,
    });
  }

}

// ── 3. Does profiles.plan even exist, and what does it say? ────────────────

async function auditSupabase(
  supabase: SupabaseClient,
  founding: FoundingSub[],
  totalRedemptions: number,
  subscriptionScanFailed: string | null
) {
  console.log(`\n── Supabase: profiles.plan ──`);
  const { error: columnError } = await supabase.from("profiles").select("plan").limit(1);

  if (columnError) {
    console.log(`  column check FAILED: ${columnError.message}`);
    console.log(
      `  → If the column is missing, the webhook's \`plan: "founding"\` write has been\n` +
        `    failing silently (the update result is never checked). Backfill is blocked\n` +
        `    until the column is added.`
    );
    return;
  }
  console.log("  column exists");

  const { data: foundingRows, error: planError } = await supabase
    .from("profiles")
    .select("id, user_id, plan, stripe_subscription_id")
    .eq("plan", "founding");

  if (planError) {
    console.log(`  query failed: ${planError.message}`);
    return;
  }
  console.log(`  rows already marked plan='founding': ${foundingRows?.length ?? 0}`);

  // ── 4. The gap ───────────────────────────────────────────────────────────
  console.log(`\n── Backfill needed ──`);

  if (subscriptionScanFailed && totalRedemptions > 0) {
    console.log(
      `  UNKNOWN — ${totalRedemptions} redemption(s) exist but subscriptions could not be read.\n` +
        `  Grant "Subscriptions Read" to the Stripe key and re-run.`
    );
    return;
  }
  if (totalRedemptions === 0) {
    console.log(
      `  0 rows — ${FOUNDING_CODE} has never been redeemed (0 redemptions across every\n` +
        `  coupon and promotion code), so no profile can be missing plan='founding'.`
    );
    return;
  }
  if (!founding.length) {
    console.log(`  0 rows — no subscription carries the ${FOUNDING_CODE} discount.`);
    return;
  }

  const needsBackfill: string[] = [];
  for (const f of founding) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, user_id, plan")
      .eq("stripe_subscription_id", f.subscriptionId)
      .maybeSingle();

    const byUser = !profile && f.supabaseUserId
      ? (await supabase.from("profiles").select("id, user_id, plan").eq("user_id", f.supabaseUserId).maybeSingle()).data
      : null;

    const row = profile ?? byUser;
    if (!row) {
      console.log(`  ${f.subscriptionId} → NO PROFILE FOUND (user_id=${f.supabaseUserId ?? "unknown"})`);
      continue;
    }
    if (row.plan === "founding") {
      console.log(`  ${f.subscriptionId} → already correct (profile ${row.id})`);
      continue;
    }
    needsBackfill.push(row.id as string);
    console.log(
      `  ${f.subscriptionId} → profile ${row.id} has plan=${JSON.stringify(row.plan)}, expected "founding"`
    );
  }

  console.log(`\n  ${needsBackfill.length} row(s) need plan='founding'`);
  if (needsBackfill.length) {
    console.log(`  profile ids: ${needsBackfill.join(", ")}`);
    console.log(`\n  Nothing was modified. To apply, run in the Supabase SQL editor:`);
    console.log(
      `    update profiles set plan = 'founding'\n     where id in (${needsBackfill
        .map((id) => `'${id}'`)
        .join(", ")});`
    );
  }
}

main().catch((err: unknown) => {
  console.error("\naudit failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
