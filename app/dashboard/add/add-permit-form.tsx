"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cities, LIVE_CHECKER_CITIES } from "@/lib/cities";
import { addPermit } from "../actions";

// The city list is derived from lib/cities.ts so this form, the marketing
// /locations pages, and the scraper registry can't drift apart.
//
// Only LIVE_CHECKER_CITIES have a working scraper behind them. Every other
// city is selectable — so we can capture demand — but accepting a permit for
// one would be a promise we can't keep: nothing would ever check it, and the
// user would sit waiting for an alert that can never fire. Those cities get
// the waitlist instead.
const CITY_OPTIONS = cities.map((c) => ({
  slug:      c.slug,
  name:      c.name,
  stateAbbr: c.stateAbbr,
  label:     `${c.name}, ${c.stateAbbr}`,
  live:      LIVE_CHECKER_CITIES.has(c.slug),
}));

const DEFAULT_CITY =
  CITY_OPTIONS.find((c) => c.live)?.slug ?? CITY_OPTIONS[0]?.slug ?? "austin";

/**
 * Entitlement as it crosses to the client.
 *
 * `limit` is `number | null` rather than the server's `number`: the server
 * represents unlimited as Infinity, which does not survive serialization to a
 * Client Component. null means unlimited here.
 */
export interface EntitlementView {
  tier: "free" | "slots" | "unlimited";
  used: number;
  limit: number | null;
  canAdd: boolean;
  purchasedSlots: number;
}

export default function AddPermitForm({
  entitlement,
  defaultEmail,
}: {
  entitlement: EntitlementView;
  defaultEmail: string;
}) {
  const router = useRouter();

  const [citySlug, setCitySlug]         = useState(DEFAULT_CITY);
  const [permitNumber, setPermitNumber] = useState("");
  const [address, setAddress]           = useState("");
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  // Waitlist state (unsupported cities)
  const [waitlistEmail, setWaitlistEmail]     = useState(defaultEmail);
  const [waitlistDone, setWaitlistDone]       = useState(false);
  const [waitlistError, setWaitlistError]     = useState<string | null>(null);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const selectedCity = CITY_OPTIONS.find((c) => c.slug === citySlug);
  const cityLive     = selectedCity?.live ?? false;

  // Switching cities invalidates any error from the previous selection.
  useEffect(() => {
    setError(null);
    setWaitlistError(null);
    setWaitlistDone(false);
  }, [citySlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation is duplicated inside the server action, which is the copy
    // that counts — this round trip only saves the user a wasted request.
    const result = await addPermit({ citySlug, permitNumber, address });

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setWaitlistError(null);
    setWaitlistLoading(true);

    try {
      const res = await fetch("/api/permit-alert", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email: waitlistEmail.trim(),
          city:  selectedCity?.label ?? citySlug,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setWaitlistError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setWaitlistDone(true);
    } catch {
      setWaitlistError("Network error. Please try again.");
    } finally {
      setWaitlistLoading(false);
    }
  }

  return (
    <>
      <div className="relative border border-[#FF6B00]/30 p-8">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

        {/* City selector — always shown */}
        <div className="mb-6">
          <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
            City <span className="text-[#DC2626]">*</span>
          </label>
          <select
            required
            value={citySlug}
            onChange={(e) => setCitySlug(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer"
          >
            {CITY_OPTIONS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}{c.live ? "" : "  —  coming soon"}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[10px] text-[#F5F0E8]/30">
            Don&apos;t see your city?{" "}
            <Link href="/suggest-city" className="text-[#FF6B00]/60 hover:text-[#FF6B00] transition-colors">
              Request it →
            </Link>
          </p>
        </div>

        {!cityLive ? (
          /* ── Unsupported city — waitlist instead of a permit we can't check ── */
          <div>
            <div className="border border-[#FF6B00]/30 bg-[#FF6B00]/5 px-5 py-5">
              <div className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono mb-2">
                Not monitored yet
              </div>
              <p className="text-sm text-[#F5F0E8]/80 leading-relaxed">
                We can&rsquo;t track permits in{" "}
                <strong className="text-[#F5F0E8]">{selectedCity?.label}</strong> yet — the
                integration with the city portal isn&rsquo;t finished.
              </p>
              <p className="mt-2 text-xs text-[#F5F0E8]/50 leading-relaxed">
                We&rsquo;d rather tell you that than take the permit number and leave you
                waiting on an alert that would never arrive.
              </p>
            </div>

            {waitlistDone ? (
              <div className="mt-6 border border-[#16A34A]/40 bg-[#16A34A]/10 px-5 py-4">
                <p className="text-sm text-[#16A34A] font-mono">
                  You&rsquo;re on the list. We&rsquo;ll email you the moment{" "}
                  {selectedCity?.name} goes live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                    Email me when {selectedCity?.name} is live
                  </label>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                    placeholder="you@company.com"
                  />
                </div>

                {waitlistError && (
                  <div className="border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
                    <p className="text-xs text-[#DC2626] font-mono">{waitlistError}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="flex-1 w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {waitlistLoading ? "Adding..." : "Notify Me →"}
                  </button>
                  <Link
                    href="/dashboard"
                    className="text-center sm:text-left border border-[#FF6B00]/30 text-[#F5F0E8]/60 font-mono text-sm tracking-widest uppercase px-6 py-4 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        ) : !entitlement.canAdd ? (
          /* ── At the permit limit — the form is not offered ────────────────── */
          <div>
            <div className="border border-[#EAB308]/40 bg-[#EAB308]/5 px-5 py-5">
              <div className="text-[10px] tracking-[0.25em] text-[#EAB308] uppercase font-mono mb-2">
                Permit limit reached
              </div>
              <p className="text-sm text-[#F5F0E8]/80 leading-relaxed">
                You&rsquo;re tracking{" "}
                <strong className="text-[#F5F0E8]">
                  {entitlement.used} of {entitlement.limit}
                </strong>{" "}
                permits. Add a slot to track another.
              </p>
              <p className="mt-2 text-xs text-[#F5F0E8]/50 leading-relaxed">
                Your existing permits keep being monitored — nothing stops.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                disabled
                title="Slot purchases aren't live yet"
                className="flex-1 w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add a Slot — $9.99
              </button>
              <Link
                href="/dashboard"
                className="text-center sm:text-left border border-[#FF6B00]/30 text-[#F5F0E8]/60 font-mono text-sm tracking-widest uppercase px-6 py-4 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
              >
                Back
              </Link>
            </div>
            <p className="mt-3 text-[10px] text-[#F5F0E8]/30 font-mono">
              Slot purchases open shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Permit number */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Permit Number <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                required
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20 uppercase"
                placeholder="2026-033822 PP"
              />
              <p className="mt-1.5 text-[10px] text-[#F5F0E8]/30">
                Enter the permit number exactly as it appears on your permit documents.
              </p>
              {citySlug === "austin" && (
                <p className="mt-1 text-[10px] text-[#FF6B00]/60 font-mono">
                  Austin permits look like: 2026-033822 PP
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Property Address <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                placeholder="1847 Commerce St"
              />
            </div>

            {error && (
              <div className="border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
                <p className="text-xs text-[#DC2626] font-mono">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Permit..." : "Start Monitoring →"}
              </button>
              <Link
                href="/dashboard"
                className="text-center sm:text-left border border-[#FF6B00]/30 text-[#F5F0E8]/60 font-mono text-sm tracking-widest uppercase px-6 py-4 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Info box */}
      {cityLive && entitlement.canAdd && (
        <div className="mt-6 border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-5 py-4">
          <div className="text-[10px] tracking-widest text-[#FF6B00] uppercase font-medium mb-2">
            How monitoring works
          </div>
          <ul className="space-y-1.5">
            {[
              "We check your permit several times each weekday against the city's official records",
              "When the status changes, you get an email alert",
              "Every status change is logged so you can see the full history",
            ].map((item) => (
              <li key={item} className="text-xs text-[#F5F0E8]/50 flex items-start gap-2">
                <span className="text-[#FF6B00] mt-0.5">■</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
