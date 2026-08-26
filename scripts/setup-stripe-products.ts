// ─────────────────────────────────────────────────────────
// Provisions the Stripe catalog ClearedNo expects.
//
//   npx ts-node scripts/setup-stripe-products.ts           # inspect only (default)
//   npx ts-node scripts/setup-stripe-products.ts --apply   # create what's missing
//
// Idempotent: every resource is looked up first (prices by lookup_key, products
// by metadata.clearedno_sku, coupon/promo code by id) and only created if absent.
// Re-running is safe — it never duplicates and never mutates existing resources.
//
// Resources:
//   permit_alerts_monthly  $79/mo   → STRIPE_PRICE_ID
//   roofing_leads_monthly  $300/mo  → STRIPE_LEADS_PRICE_ID
//   permit_slot_onetime_v2 $29.00   → STRIPE_SLOT_PRICE_ID  (ONE-TIME, not recurring)
//   FOUNDING49 coupon      $30 off once (first month $49) + matching promo code
//                                   — the webhook matches coupon.id === "FOUNDING49"
//
// Retired prices are archived rather than edited: Stripe prices are immutable,
// so a price change is always "create the new one, deactivate the old one".
// See RETIRED note on the permit_slot plan below.
// ─────────────────────────────────────────────────────────

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Stripe from "stripe";

const APPLY = process.argv.includes("--apply");

const FOUNDING_COUPON_ID = "FOUNDING49";

/**
 * How a price is billed.
 *
 * Every helper below used to assume `recurring.interval === "month"`, which
 * silently made a one-time price unmatchable: findPriceByShape would never
 * adopt it, and the creation path would have attached a monthly recurrence to
 * it. The catalog now carries two shapes, so the shape has to be explicit.
 */
type PlanBilling = "monthly" | "one_time";

type PlanSpec = {
  sku: string;
  lookupKey: string;
  envVar: string;
  productName: string;
  productDescription: string;
  unitAmount: number;
  billing: PlanBilling;
  /**
   * Prices this plan used to bill against. Archived (active: false) on --apply
   * so nothing can check out at the old amount, and never adopted from the
   * environment even when STRIPE_..._PRICE_ID still names one.
   */
  retiredPriceIds?: string[];
};

const PLANS: PlanSpec[] = [
  {
    sku: "permit_alerts",
    lookupKey: "permit_alerts_monthly",
    envVar: "STRIPE_PRICE_ID",
    productName: "ClearedNo — Permit Alerts",
    productDescription:
      "Automated permit status tracking with email and push alerts. $79/month, first 30 days free.",
    unitAmount: 7900,
    billing: "monthly",
  },
  {
    sku: "roofing_leads",
    lookupKey: "roofing_leads_monthly",
    envVar: "STRIPE_LEADS_PRICE_ID",
    productName: "ClearedNo — Roofing Storm Leads",
    productDescription:
      "Weekly storm-damage roofing leads scored by severity, unlimited downloads. Flat $300/month.",
    unitAmount: 30000,
    billing: "monthly",
  },
  {
    sku: "permit_slot",
    // _v2: the $9.99 price still owns "permit_slot_onetime" until it is
    // archived, and Stripe rejects a lookup_key held by another active price.
    lookupKey: "permit_slot_onetime_v2",
    envVar: "STRIPE_SLOT_PRICE_ID",
    productName: "ClearedNo — Permit Slot",
    productDescription:
      "One additional tracked permit slot. One-time purchase, kept permanently.",
    unitAmount: 2900,
    billing: "one_time",
    // The $9.99 price this replaced. Nothing ever sold at it, so archiving is
    // pure cleanup — no customer is mid-purchase against it.
    retiredPriceIds: ["price_1U8V0BDMg5xWs4GTOzfXOc3b"],
  },
];

// ── helpers ──────────────────────────────────────────────

const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** "$79.00/month" or "$29.00 one-time" — used in every log line and warning. */
function priceLabel(plan: PlanSpec): string {
  return plan.billing === "monthly"
    ? `${dollars(plan.unitAmount)}/month`
    : `${dollars(plan.unitAmount)} one-time`;
}

/** How an existing Stripe price reads back, for comparison against a spec. */
function describePrice(price: Stripe.Price): string {
  const amount = dollars(price.unit_amount ?? 0);
  return price.recurring
    ? `${amount}/${price.recurring.interval}`
    : `${amount} one-time`;
}

/** True when a live price is billed the way the spec expects. */
function matchesBilling(price: Stripe.Price, plan: PlanSpec): boolean {
  return plan.billing === "monthly"
    ? price.recurring?.interval === "month"
    : price.recurring == null;
}

function log(kind: "ok" | "add" | "warn" | "info", message: string) {
  const tag = { ok: "  ok  ", add: " add  ", warn: " warn ", info: "      " }[kind];
  console.log(`[${tag}] ${message}`);
}

function isResourceMissing(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "resource_missing"
  );
}

/** The env vars this run determined, printed at the end. */
const resolvedEnv: Record<string, string> = {};
/** Problems that need a human decision. */
const warnings: string[] = [];

// ── product / price ──────────────────────────────────────

async function findProduct(stripe: Stripe, sku: string): Promise<Stripe.Product | null> {
  // products.list has no metadata filter, and products.search lags behind
  // writes by up to a minute — so page and filter locally instead.
  for await (const product of stripe.products.list({ active: true, limit: 100 })) {
    if (product.metadata?.clearedno_sku === sku) return product;
  }
  return null;
}

async function findPriceByLookupKey(
  stripe: Stripe,
  lookupKey: string
): Promise<Stripe.Price | null> {
  const { data } = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  return data[0] ?? null;
}

/**
 * Last-resort match for resources created by hand in the dashboard: those carry
 * no lookup_key and no metadata, so the only durable handle is the price shape
 * itself. Without this the script would happily create a duplicate $79 price
 * alongside the one production is already billing against.
 */
async function findPriceByShape(stripe: Stripe, plan: PlanSpec): Promise<Stripe.Price[]> {
  const matches: Stripe.Price[] = [];
  for await (const price of stripe.prices.list({ active: true, limit: 100 })) {
    if (
      price.unit_amount === plan.unitAmount &&
      matchesBilling(price, plan) &&
      price.currency === "usd"
    ) {
      matches.push(price);
    }
  }
  return matches;
}

/**
 * Reports on a price already named in the environment so an existing
 * STRIPE_PRICE_ID is adopted rather than duplicated.
 */
async function inspectConfiguredPrice(
  stripe: Stripe,
  plan: PlanSpec,
  priceId: string
): Promise<boolean> {
  let price: Stripe.Price;
  try {
    price = await stripe.prices.retrieve(priceId);
  } catch (err) {
    if (isResourceMissing(err)) {
      warnings.push(
        `${plan.envVar}=${priceId} does not exist in this Stripe account (wrong mode? test id in a live account?).`
      );
      log("warn", `${plan.envVar} points at a price that does not exist: ${priceId}`);
      return false;
    }
    throw err;
  }

  const amount = price.unit_amount ?? 0;
  log(
    "ok",
    `${plan.envVar} → ${price.id} (${describePrice(price)}${price.active ? "" : ", INACTIVE"})`
  );

  if (amount !== plan.unitAmount) {
    warnings.push(
      `${plan.envVar} is ${dollars(amount)} but the site advertises ${dollars(plan.unitAmount)}. ` +
        `Left untouched — changing a live price is a pricing decision, not a setup step.`
    );
  }
  if (!matchesBilling(price, plan)) {
    warnings.push(
      `${plan.envVar} is ${describePrice(price)} but should be ${priceLabel(plan)}. ` +
        `A one-time price used in subscription mode (or the reverse) fails at checkout.`
    );
  }
  if (!price.active) {
    warnings.push(`${plan.envVar} is archived — checkout with it will fail.`);
  }

  resolvedEnv[plan.envVar] = price.id;
  return true;
}

/** True when `priceId` is one this plan has explicitly moved off. */
function isRetiredPrice(plan: PlanSpec, priceId: string): boolean {
  return (plan.retiredPriceIds ?? []).includes(priceId);
}

/**
 * Deactivates the prices a plan has moved off. Stripe prices cannot be edited,
 * so raising an amount means creating a new price and archiving the old one —
 * skip the archive and the previous amount stays purchasable by anything still
 * holding its id.
 */
async function archiveRetiredPrices(stripe: Stripe, plan: PlanSpec) {
  for (const priceId of plan.retiredPriceIds ?? []) {
    let price: Stripe.Price;
    try {
      price = await stripe.prices.retrieve(priceId);
    } catch (err) {
      // Expected in the mode that never had it (a test-mode id in live, or a
      // freshly created account) — not a problem to report.
      if (isResourceMissing(err)) {
        log("info", `retired price ${priceId} is not in this account — nothing to archive`);
        continue;
      }
      throw err;
    }

    if (!price.active) {
      log("ok", `retired price ${priceId} (${describePrice(price)}) is already archived`);
      continue;
    }
    if (!APPLY) {
      log("add", `would archive retired price ${priceId} (${describePrice(price)})`);
      continue;
    }

    await stripe.prices.update(priceId, { active: false });
    log("add", `archived retired price ${priceId} (${describePrice(price)})`);
  }
}

async function ensurePlan(stripe: Stripe, plan: PlanSpec) {
  console.log(`\n── ${plan.productName} ${"─".repeat(Math.max(0, 46 - plan.productName.length))}`);

  await archiveRetiredPrices(stripe, plan);

  const configured = process.env[plan.envVar];
  if (configured && isRetiredPrice(plan, configured)) {
    // Adopting it would pin the catalog to the price we just archived and let
    // the run finish reporting "complete" while checkout was still broken.
    log("warn", `${plan.envVar} still points at retired price ${configured} — ignoring it`);
    warnings.push(
      `${plan.envVar}=${configured} is the retired price. Replace it with the ` +
        `${plan.envVar} value printed below, in .env.local and in the Vercel env.`
    );
  } else if (configured) {
    const usable = await inspectConfiguredPrice(stripe, plan, configured);
    if (usable) return;
  }

  const existingPrice = await findPriceByLookupKey(stripe, plan.lookupKey);
  if (existingPrice) {
    log(
      "ok",
      `price with lookup_key "${plan.lookupKey}" already exists → ${existingPrice.id} ` +
        `(${describePrice(existingPrice)})`
    );
    resolvedEnv[plan.envVar] = existingPrice.id;
    return;
  }

  const shapeMatches = await findPriceByShape(stripe, plan);
  if (shapeMatches.length === 1) {
    const price = shapeMatches[0];
    const productName =
      typeof price.product === "string"
        ? (await stripe.products.retrieve(price.product)).name
        : (price.product as Stripe.Product).name;
    log(
      "ok",
      `found existing ${priceLabel(plan)} price → ${price.id} (product "${productName}")`
    );
    log("info", `created outside this script — adopting it instead of creating a duplicate`);
    resolvedEnv[plan.envVar] = price.id;

    // Tag it so future runs match on lookup_key and never reach this fallback.
    if (APPLY && !price.lookup_key) {
      await stripe.prices.update(price.id, { lookup_key: plan.lookupKey });
      log("add", `tagged ${price.id} with lookup_key "${plan.lookupKey}"`);
    } else if (!price.lookup_key) {
      log("add", `would tag it with lookup_key "${plan.lookupKey}" (no pricing change)`);
    }
    return;
  }
  if (shapeMatches.length > 1) {
    warnings.push(
      `Found ${shapeMatches.length} active ${priceLabel(plan)} prices ` +
        `(${shapeMatches.map((p) => p.id).join(", ")}). Too ambiguous to adopt — ` +
        `set ${plan.envVar} manually to the one production bills against.`
    );
    log("warn", `${shapeMatches.length} candidate prices at ${priceLabel(plan)} — refusing to guess`);
    return;
  }

  let product = await findProduct(stripe, plan.sku);
  if (product) {
    log("ok", `product already exists → ${product.id} ("${product.name}")`);
  } else if (!APPLY) {
    log("add", `would create product "${plan.productName}"`);
  } else {
    product = await stripe.products.create({
      name: plan.productName,
      description: plan.productDescription,
      metadata: { clearedno_sku: plan.sku },
    });
    log("add", `created product ${product.id} ("${product.name}")`);
  }

  if (!APPLY) {
    log(
      "add",
      `would create price ${priceLabel(plan)} (lookup_key "${plan.lookupKey}") → ${plan.envVar}`
    );
    return;
  }

  // Omitting `recurring` entirely is what makes a price one-time; passing it
  // as undefined is not the same thing to the Stripe SDK's typings.
  const price = await stripe.prices.create({
    product: product!.id,
    currency: "usd",
    unit_amount: plan.unitAmount,
    ...(plan.billing === "monthly"
      ? { recurring: { interval: "month" as const } }
      : {}),
    lookup_key: plan.lookupKey,
    metadata: { clearedno_sku: plan.sku },
  });
  log("add", `created price ${price.id} (${priceLabel(plan)}) → ${plan.envVar}`);
  resolvedEnv[plan.envVar] = price.id;
}

// ── FOUNDING49 coupon + promotion code ───────────────────

async function ensureFoundingCoupon(stripe: Stripe) {
  console.log(`\n── FOUNDING49 (founding member, first month $49) ─`);

  let coupon: Stripe.Coupon | null = null;
  try {
    coupon = await stripe.coupons.retrieve(FOUNDING_COUPON_ID);
  } catch (err) {
    if (!isResourceMissing(err)) throw err;
  }

  // The live coupon was made in the dashboard, which auto-generates the id and
  // puts "FOUNDING49" in the name. Adopt that rather than adding a second one.
  if (!coupon) {
    for await (const c of stripe.coupons.list({ limit: 100 })) {
      if (c.name === FOUNDING_COUPON_ID) {
        coupon = c;
        log("ok", `coupon named "${FOUNDING_COUPON_ID}" exists under id ${c.id} — adopting`);
        break;
      }
    }
  }

  if (coupon) {
    const off = coupon.amount_off
      ? `${dollars(coupon.amount_off)} off`
      : `${coupon.percent_off}% off`;
    log("ok", `coupon ${coupon.id} already exists (${off}, ${coupon.duration}${coupon.valid ? "" : ", INVALID"})`);
    if (!coupon.valid) warnings.push(`Coupon ${FOUNDING_COUPON_ID} is no longer valid (expired or redemption limit reached).`);
  } else if (!APPLY) {
    log("add", `would create coupon ${FOUNDING_COUPON_ID} ($30.00 off, once → first month $49)`);
  } else {
    coupon = await stripe.coupons.create({
      id: FOUNDING_COUPON_ID,
      name: "Founding Member — First Month $49",
      amount_off: 3000,
      currency: "usd",
      duration: "once",
    });
    log("add", `created coupon ${coupon.id} ($30.00 off, once)`);
  }

  // A customer-enterable promotion code is what `allow_promotion_codes` checkouts need.
  // Not limit:1 — this account has both an active and a stale inactive copy of
  // the code, and taking whichever came first would report the wrong one.
  const { data: promos } = await stripe.promotionCodes.list({
    code: FOUNDING_COUPON_ID,
    limit: 100,
  });

  const activePromo = promos.find((p) => p.active);
  if (activePromo) {
    log("ok", `promotion code ${activePromo.code} is active → ${activePromo.id} (coupon ${activePromo.coupon.id})`);
    return;
  }
  if (promos.length) {
    warnings.push(
      `Promotion code ${FOUNDING_COUPON_ID} exists but every copy is inactive — customers cannot enter it.`
    );
    log("warn", `${promos.length} ${FOUNDING_COUPON_ID} promotion code(s) found, none active`);
    return;
  }

  if (!APPLY) {
    log("add", `would create promotion code ${FOUNDING_COUPON_ID}`);
    return;
  }

  const promo = await stripe.promotionCodes.create({
    coupon: coupon!.id,
    code: FOUNDING_COUPON_ID,
  });
  log("add", `created promotion code ${promo.code} → ${promo.id}`);
}

// ── main ─────────────────────────────────────────────────

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local before running this script."
    );
    process.exit(1);
  }

  // Restricted keys (rk_*) are also valid here — they just may lack scopes.
  const mode = key.includes("_live_") ? "LIVE" : "TEST";
  const keyKind = key.startsWith("rk_") ? "restricted key" : "secret key";
  const stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia", typescript: true });

  // Cosmetic only: restricted keys often lack accounts_kyc_basic_read, which
  // must not stop the catalog work.
  let accountLabel = "(name unavailable — key lacks account read scope)";
  try {
    const account = await stripe.accounts.retrieve();
    accountLabel = `${account.id}${account.business_profile?.name ? ` (${account.business_profile.name})` : ""}`;
  } catch {
    /* ignore — identified by mode below */
  }

  console.log(`\nStripe account: ${accountLabel}`);
  console.log(`Mode:           ${mode} (${keyKind})`);
  console.log(
    `Action:         ${APPLY ? `WRITING — resources will be created in ${mode} mode` : "inspect only (pass --apply to create)"}`
  );

  for (const plan of PLANS) {
    await ensurePlan(stripe, plan);
  }
  await ensureFoundingCoupon(stripe);

  // ── summary ────────────────────────────────────────────
  const missing = PLANS.filter((p) => !resolvedEnv[p.envVar]);

  if (Object.keys(resolvedEnv).length) {
    console.log(`\n── .env.local (and Vercel env) ──────────────────`);
    for (const [name, value] of Object.entries(resolvedEnv)) {
      console.log(`${name}=${value}`);
    }
  }

  if (warnings.length) {
    console.log(`\n── needs your attention ─────────────────────────`);
    for (const w of warnings) console.log(`  • ${w}`);
  }

  if (missing.length) {
    console.log(
      `\n${APPLY ? "Still missing" : "Not yet created"}: ${missing.map((p) => p.envVar).join(", ")}` +
        (APPLY ? "" : `\nRe-run with --apply to create them in ${mode} mode.`)
    );
  } else {
    console.log(`\nCatalog complete — every price ClearedNo needs is configured.`);
  }
  console.log();
}

main().catch((err) => {
  console.error("\nsetup-stripe-products failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
