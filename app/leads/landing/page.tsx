"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LeadsLandingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      // Check auth state before hitting Stripe
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login?next=leads-checkout";
        return;
      }

      // Logged in — proceed directly to Stripe
      const res = await fetch("/api/leads-checkout", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#FF6B00]/20 px-6 py-4 flex items-center justify-between">
        <a href="/" className="font-heading text-2xl tracking-widest text-[#F5F0E8] uppercase hover:text-[#FF6B00] transition-colors">
          ClearedNo
        </a>
        <a
          href="/login"
          className="text-[10px] tracking-[0.25em] text-[#F5F0E8]/40 uppercase hover:text-[#FF6B00] transition-colors"
        >
          Sign In
        </a>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#FF6B00] uppercase mb-6">
          Roofing Leads · Ohio
        </p>

        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl tracking-widest text-[#F5F0E8] uppercase leading-none mb-6 max-w-3xl">
          Fresh roofing leads. Every week.
        </h1>

        <p className="text-[#F5F0E8]/50 text-sm sm:text-base max-w-xl leading-relaxed mb-14">
          We pull NOAA hail events weekly. You get a verified list of
          properties that need a new roof.
        </p>

        {/* Bullets */}
        <div className="flex flex-col gap-3 mb-16 text-left max-w-sm w-full">
          {[
            "44 hot leads available now",
            "County-level hail data across Ohio",
            "Weekly updated list — new leads every Monday",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6B00] flex-shrink-0" />
              <span className="text-sm text-[#F5F0E8]/70">{b}</span>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div className="border border-[#FF6B00]/30 p-8 relative max-w-sm w-full mb-8">
          {/* corner accents */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-4">
            Roofing Leads Access
          </p>

          <div className="flex items-end gap-2 mb-1">
            <span className="font-heading text-6xl tracking-widest text-[#F5F0E8]">$300</span>
            <span className="text-[#F5F0E8]/40 text-sm pb-2">/month</span>
          </div>

          <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase mb-8">
            30-day money-back guarantee · Cancel anytime
          </p>

          {error && (
            <div className="border border-[#DC2626]/40 bg-[#DC2626]/5 px-4 py-3 mb-4">
              <p className="text-xs text-[#DC2626]">{error}</p>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-6 py-4 hover:bg-[#F5F0E8] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Redirecting…" : "Get Access — $300/mo"}
          </button>
        </div>

        <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
          Secured by Stripe · No trial required
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#FF6B00]/20 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
          © {new Date().getFullYear()} ClearedNo
        </p>
        <div className="flex gap-6">
          {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Refunds", "/refunds"]].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase hover:text-[#FF6B00]/60 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
