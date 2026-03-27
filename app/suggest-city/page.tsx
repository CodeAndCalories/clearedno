"use client";

import { useState } from "react";
import Link from "next/link";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export default function SuggestCityPage() {
  const [city,    setCity]    = useState("");
  const [state,   setState]   = useState("TX");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/suggest-city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city.trim(), state, email: email.trim() || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="font-heading text-6xl text-[#FF6B00] mb-6">GOT IT.</div>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed mb-8">
            We&apos;ll add <span className="text-[#F5F0E8]">{city}, {state}</span> to
            the queue. You&apos;ll get an email when it&apos;s live —{" "}
            {email ? "we'll reach out to " + email : "check back soon"}.
          </p>
          <Link
            href="/"
            className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase hover:text-[#F5F0E8] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">City Request</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] leading-none mb-4">
            DON&apos;T SEE<br />
            <span className="text-[#FF6B00]">YOUR CITY?</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-sm">
            We add cities weekly based on demand. Request yours and
            we&apos;ll notify you the moment it goes live.
          </p>
        </div>

        {/* Form card */}
        <div className="relative border border-[#FF6B00]/30 p-8">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* City + State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  City <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Houston"
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  State <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer"
                >
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email (optional) */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Your Email <span className="text-[#F5F0E8]/20">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
              />
              <p className="mt-1.5 text-[10px] text-[#F5F0E8]/25">
                We&apos;ll notify you when your city goes live. No spam.
              </p>
            </div>

            {error && (
              <div className="border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
                <p className="text-xs text-[#DC2626] font-mono">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "REQUEST MY CITY →"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-[#F5F0E8]/20 tracking-widest">
          Cities are added in order of demand. Most requests go live within 1–2 weeks.
        </p>
      </main>
    </div>
  );
}
