// Stripe SDK singleton — server-side only.
//
// Uses lazy initialization so the build succeeds even without STRIPE_SECRET_KEY.
// The client is created on first use; if the key is missing at runtime the
// individual API call will throw a clear error.

import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY environment variable is not set. " +
      "Add it to .env.local or your deployment environment."
    );
  }

  _stripe = new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });

  return _stripe;
}

// Proxy so callers can write `stripe.subscriptions.retrieve(...)` as before.
// The actual Stripe instance is created on first property access (lazy).
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return getStripeClient()[prop as keyof Stripe];
  },
});

// The single subscription price (monthly, $79)
export const PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";
