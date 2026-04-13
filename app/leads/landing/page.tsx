"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import MarketingNav from "@/app/components/MarketingNav";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SampleLead {
  county:     string;
  state:      string | null;
  event_date: string;
  magnitude:  number | null;
  lead_score: "hot" | "warm";
}

const SCORE_CONFIG = {
  hot:  { label: "HOT",  color: "#FF6B00", bg: "rgba(255,107,0,0.12)"  },
  warm: { label: "WARM", color: "#EAB308", bg: "rgba(234,179,8,0.12)"  },
} as const;

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LeadsLandingPage() {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [sampleLeads, setSampleLeads] = useState<SampleLead[]>([]);
  const [totalCount, setTotalCount]   = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadSample() {
      const [sampleRes, countRes] = await Promise.all([
        supabase
          .from("roofing_leads")
          .select("county, state, event_date, magnitude, lead_score")
          .order("event_date", { ascending: false })
          .limit(5),
        supabase
          .from("roofing_leads")
          .select("id", { count: "exact", head: true }),
      ]);

      if (sampleRes.data) setSampleLeads(sampleRes.data as SampleLead[]);
      if (countRes.count !== null) setTotalCount(countRes.count);
    }

    loadSample();
  }, []);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login?next=leads-checkout";
        return;
      }

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
      <MarketingNav />

      {/* pt-14 offsets the fixed nav */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-20 text-center">

        <p className="text-[10px] tracking-[0.4em] text-[#FF6B00] uppercase mb-6">
          Roofing Leads · 6 Midwest States
        </p>

        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl tracking-widest text-[#F5F0E8] uppercase leading-none mb-8 max-w-3xl">
          Fresh roofing leads. Every week.
        </h1>

        {/* ── Stats bar ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 mb-10 border border-[#FF6B00]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#FF6B00]/20 w-full max-w-2xl">
          {[
            { stat: "1,700+", label: "Leads across 6 states" },
            { stat: "Every Monday", label: "New leads added" },
            { stat: "NOAA", label: "hail + wind damage events" },
          ].map(({ stat, label }) => (
            <div key={label} className="flex-1 px-6 py-4 text-center">
              <p className="font-heading text-2xl tracking-widest text-[#FF6B00] mb-0.5">{stat}</p>
              <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Early CTA ──────────────────────────────────────────────── */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full max-w-sm bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-6 py-4 mb-10 hover:bg-[#F5F0E8] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Redirecting…" : "Get Access — $300/mo"}
        </button>

        <p className="text-[#F5F0E8]/50 text-sm sm:text-base max-w-xl leading-relaxed mb-14">
          We pull NOAA hail events weekly. You get a verified list of
          properties that need a new roof — scored by severity, ready to download.
        </p>

        {/* Bullets */}
        <div className="flex flex-col gap-3 mb-16 text-left max-w-sm w-full">
          {[
            "1,700+ leads across 6 Midwest states",
            "County-level hail data from NOAA Storm Events",
            "Weekly updated list — new leads every Monday",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6B00] flex-shrink-0" />
              <span className="text-sm text-[#F5F0E8]/70">{b}</span>
            </div>
          ))}
        </div>

        {/* ── Sample data table ──────────────────────────────────────── */}
        {sampleLeads.length > 0 && (
          <div className="w-full max-w-2xl mb-16 text-left">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse flex-shrink-0" />
              <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/70 uppercase">
                Live sample — updated weekly
              </p>
            </div>

            <div className="border border-[#FF6B00]/20 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#FF6B00]/20">
                    {["County", "State", "Date", "Score"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleLeads.map((lead, i) => {
                    const cfg = SCORE_CONFIG[lead.lead_score] ?? SCORE_CONFIG.warm;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-[#FF6B00]/10 ${
                          i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"
                        }`}
                      >
                        <td className="px-5 py-3 text-[#F5F0E8]/80 whitespace-nowrap">{lead.county}</td>
                        <td className="px-5 py-3 text-[#F5F0E8]/50 whitespace-nowrap">{lead.state ?? "—"}</td>
                        <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">{formatDate(lead.event_date)}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium"
                            style={{ color: cfg.color, backgroundColor: cfg.bg }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalCount !== null && (
              <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase mt-3 text-right">
                + {(totalCount - sampleLeads.length).toLocaleString()} more leads available this month
              </p>
            )}
          </div>
        )}

        {/* ── How it works ───────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">How It Works</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[#FF6B00]/20">
            {[
              {
                num: "01",
                title: "Hail hits",
                desc: "NOAA detects storm events by county. Every hail event is logged with location and severity.",
              },
              {
                num: "02",
                title: "We score it",
                desc: "Hot (1\"+ hail) or Warm — ranked by severity so you know which roofs need work most.",
              },
              {
                num: "03",
                title: "You call first",
                desc: "Download the CSV. Beat competitors to the door before homeowners call anyone else.",
              },
            ].map(({ num, title, desc }, i) => (
              <div
                key={num}
                className={`p-6 ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-[#FF6B00]/20" : ""}`}
              >
                <span className="font-heading text-3xl text-[#FF6B00]/30 block mb-3">{num}</span>
                <h3 className="font-heading text-xl tracking-widest text-[#F5F0E8] uppercase mb-2">{title}</h3>
                <p className="text-xs text-[#F5F0E8]/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Objection row ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-10">
          {["No contracts", "Cancel anytime", "30-day money back"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="text-[#FF6B00] text-sm">■</span>
              <span className="text-xs text-[#F5F0E8]/50 tracking-widest uppercase">{item}</span>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div className="border border-[#FF6B00]/30 p-8 relative max-w-sm w-full mb-8">
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
