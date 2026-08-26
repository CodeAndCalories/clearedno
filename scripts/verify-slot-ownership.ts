// Slot-fulfillment ownership regression suite.
//
//   npm run verify:slot-ownership
//
// Asserts that lib/slot-fulfillment refuses to credit a permit slot to anyone
// other than the account that paid for it. Exits non-zero on any mismatch.
//
// ── WHY THIS EXISTS ──────────────────────────────────────────────────────────
// app/dashboard/add fulfills a purchase from a session id it reads out of the
// query string:
//
//   /dashboard/add?slot=success&session_id=cs_live_...
//
// That id is attacker-supplied by construction. Without the ownership check,
// anyone who obtained another user's session id could paste it into their own
// browser and credit themselves a slot someone else paid for — repeatedly,
// were it not for the unique constraint.
//
// The check is a single comparison inside fulfillSlotPurchase(), which is
// exactly the kind of line that gets "simplified" away by someone who doesn't
// know why it's there. Nothing else in the system would notice: no error, no
// log, no failing build — just slots quietly landing on the wrong account.
//
// The webhook deliberately does NOT pass expectedUserId (its session arrives
// inside a signature-verified Stripe event, and there is no browser session to
// compare against), so the suite also pins that the check is skipped there.
// Making the webhook subject to it would break every legitimate fulfillment.
//
// ── WHY IT TOUCHES NOTHING ───────────────────────────────────────────────────
// Every case below is chosen to return BEFORE the database insert, so this
// suite writes nothing to Supabase and makes no Stripe API calls. It runs
// safely against production credentials, and needs none.

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import {
  fulfillSlotPurchase,
  fulfillSlotPurchaseBySessionId,
  type SlotOutcome,
} from "../lib/slot-fulfillment";
import type Stripe from "stripe";

// Two accounts: ALICE pays, MALLORY tries to claim what she paid for.
const ALICE   = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const MALLORY = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb";

/** A completed, paid slot session belonging to ALICE, with overrides. */
function aliceSession(
  over: Partial<Stripe.Checkout.Session> = {}
): Stripe.Checkout.Session {
  return {
    id:                  "cs_live_ALICE_SESSION",
    mode:                "payment",
    payment_status:      "paid",
    metadata:            { supabase_user_id: ALICE, sku: "permit_slot", quantity: "1" },
    client_reference_id: ALICE,
    payment_intent:      "pi_alice",
    customer:            "cus_alice",
    customer_details:    { email: "alice@example.com" },
    amount_total:        999,
    ...over,
  } as unknown as Stripe.Checkout.Session;
}

type Case = {
  name: string;
  expected: SlotOutcome;
  run: () => Promise<SlotOutcome>;
};

const CASES: Case[] = [
  // ── Ownership: the security boundary ──────────────────────────────────
  {
    name:     "Mallory replays Alice's session id",
    expected: "forbidden",
    run:      () => fulfillSlotPurchase(aliceSession(), { expectedUserId: MALLORY }),
  },
  {
    name:     "metadata stripped — client_reference_id still identifies Alice",
    expected: "forbidden",
    run: () =>
      fulfillSlotPurchase(
        aliceSession({ metadata: { sku: "permit_slot" } as Stripe.Metadata }),
        { expectedUserId: MALLORY }
      ),
  },
  {
    name:     "session identifies nobody — still not claimable",
    expected: "forbidden",
    run: () =>
      fulfillSlotPurchase(
        aliceSession({
          metadata:            { sku: "permit_slot" } as Stripe.Metadata,
          client_reference_id: null,
        }),
        { expectedUserId: MALLORY }
      ),
  },

  // ── The webhook must NOT be subject to the ownership check ────────────
  // Passing no expectedUserId has to skip it. This case would return
  // "forbidden" if the check ever became unconditional; "ignored" proves it
  // got past ownership and stopped at the payment_status guard instead.
  {
    name:     "webhook path (no expectedUserId) skips the ownership check",
    expected: "ignored",
    run:      () => fulfillSlotPurchase(aliceSession({ payment_status: "unpaid" })),
  },

  // ── Pre-write guards ──────────────────────────────────────────────────
  {
    name:     "Alice's own session, unpaid — not credited",
    expected: "ignored",
    run: () =>
      fulfillSlotPurchase(aliceSession({ payment_status: "unpaid" }), {
        expectedUserId: ALICE,
      }),
  },
  {
    name:     "Alice's own session, different product",
    expected: "ignored",
    run: () =>
      fulfillSlotPurchase(
        aliceSession({
          metadata: { supabase_user_id: ALICE, sku: "something_else" } as Stripe.Metadata,
        }),
        { expectedUserId: ALICE }
      ),
  },
  {
    name:     "subscription-mode session pasted into the slot path",
    expected: "ignored",
    run: () =>
      fulfillSlotPurchase(aliceSession({ mode: "subscription" }), {
        expectedUserId: ALICE,
      }),
  },
  {
    name:     "malformed session id is rejected without calling Stripe",
    expected: "ignored",
    run:      () => fulfillSlotPurchaseBySessionId("not-a-session-id", ALICE),
  },
];

async function main() {
  console.log(`\nSlot ownership guard — ${CASES.length} assertions\n`);

  let failures = 0;

  for (const testCase of CASES) {
    let actual: SlotOutcome | string;
    try {
      actual = await testCase.run();
    } catch (err) {
      actual = `threw: ${err instanceof Error ? err.message : String(err)}`;
    }

    if (actual === testCase.expected) {
      console.log(`  ok    ${testCase.name}`);
    } else {
      console.log(`  FAIL  ${testCase.name}`);
      console.log(`          expected ${testCase.expected}, got ${actual}`);
      failures++;
    }
  }

  console.log(
    `\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`} — ${CASES.length} assertions\n`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
