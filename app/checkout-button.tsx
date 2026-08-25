"use client";

// Starts a Stripe Checkout session and sends the browser to it.
//
// Every upgrade path in the app used to be a plain
// <form action="/api/stripe/checkout" method="post">. That route answers with
// JSON — `{ "url": "https://checkout.stripe.com/..." }` — and a native form
// POST navigates the browser to the response body, so the user landed on a
// page of raw JSON instead of Stripe. The URL was right there on screen and
// completely unusable.
//
// The route cannot simply return a 303 to fix this: the signup page and the
// slot purchase both read the JSON with fetch(). One shape of response, one
// way of consuming it — this component.

import { useState } from "react";

export type CheckoutProduct = "permit_alerts" | "permit_slot";

export default function CheckoutButton({
  children,
  className,
  wrapperClassName,
  product,
  pendingLabel = "Opening Checkout...",
}: {
  children: React.ReactNode;
  /** Classes for the button itself — call sites keep their existing styling. */
  className?: string;
  /** Classes for the container, replacing whatever the old <form> carried. */
  wrapperClassName?: string;
  /** Omitted means the $79/mo subscription, matching the route's default. */
  product?: CheckoutProduct;
  pendingLabel?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(product ? { product } : {}),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setError(data.error ?? "Couldn't start checkout. Please try again.");
        setLoading(false);
        return;
      }

      // Leaving for Stripe — the loading state is deliberately not cleared, so
      // the button stays disabled for the moment before the browser navigates.
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={wrapperClassName}>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? pendingLabel : children}
      </button>

      {error && (
        <p className="mt-2 text-[10px] text-[#DC2626] font-mono leading-relaxed">
          {error}
        </p>
      )}
    </div>
  );
}
