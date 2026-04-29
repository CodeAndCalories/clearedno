"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import MarketingNav from "@/app/components/MarketingNav";
import RoiCalculator from "./RoiCalculator";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const SCORE_CONFIG = {
  hot:  { label: "HOT",  color: "#FF6B00", bg: "rgba(255,107,0,0.12)"  },
  warm: { label: "WARM", color: "#EAB308", bg: "rgba(234,179,8,0.12)"  },
} as const;

const PREVIEW_ROWS = [
  {
    address:   "1847 Maple Ave, Columbus OH",
    owner:     "Patterson, James R",
    yearBuilt: "1994",
    event:     "Apr 12 Hail",
    score:     "hot" as const,
    blur:      false,
  },
  {
    address:   "334 Birchwood Dr, Dayton OH",
    owner:     "Kowalski, T",
    yearBuilt: "2001",
    event:     "Apr 12 Hail",
    score:     "hot" as const,
    blur:      false,
  },
  {
    address:   "9021 Ridge Rd, Cincinnati OH",
    owner:     "Nguyen, M A",
    yearBuilt: "1988",
    event:     "Apr 8 Wind",
    score:     "warm" as const,
    blur:      true,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LeadsLandingPage() {
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState<string | null>(null);
  const [openFaq, setOpenFaq]                   = useState<number | null>(null);
  const [sampleLoading, setSampleLoading]       = useState(false);
  const [sampleError, setSampleError]           = useState<string | null>(null);
  const [sampleDownloaded, setSampleDownloaded] = useState(false);

  async function handleSampleDownload() {
    setSampleLoading(true);
    setSampleError(null);
    try {
      const res = await fetch("/api/sample-download");
      if (!res.ok) {
        const json = await res.json();
        setSampleError(json.error ?? "Download failed. Please try again.");
        return;
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "clearedno-sample-franklin-county.csv";
      a.click();
      URL.revokeObjectURL(url);
      setSampleDownloaded(true);
    } catch {
      setSampleError("Network error. Please try again.");
    } finally {
      setSampleLoading(false);
    }
  }

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

        <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl tracking-widest text-[#F5F0E8] uppercase leading-none mb-4 max-w-3xl">
          Be First at the Door After the Storm.
        </h1>

        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-xl mb-10">
          Weekly hail and wind damage property lists for Midwest roofing contractors. Owner names, addresses, year built. Updated every Monday from NOAA data.
        </p>

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
          className="w-full max-w-sm bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-6 py-4 mb-3 hover:bg-[#F5F0E8] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Redirecting…" : "Get Access — $300/mo"}
        </button>

        {/* Sample CSV download */}
        <div className="w-full max-w-sm mb-10">
          <button
            onClick={handleSampleDownload}
            disabled={sampleLoading || sampleDownloaded}
            className="w-full border border-[#FF6B00]/40 text-[#FF6B00] font-mono text-xs tracking-widest uppercase px-6 py-3 hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sampleLoading
              ? "Preparing…"
              : sampleDownloaded
              ? "✓ Sample Downloaded"
              : "Download Free Sample (10 leads)"}
          </button>
          {sampleError && (
            <p className="text-[10px] tracking-[0.15em] text-[#DC2626] uppercase mt-2 text-center">
              {sampleError}
            </p>
          )}
          {!sampleError && (
            <p className="text-[9px] tracking-[0.15em] text-[#F5F0E8]/20 uppercase mt-2 text-center">
              Franklin County OH · real owner names + addresses · no sign-up required
            </p>
          )}
        </div>

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
            "Exclusive access — we limit contractors per county to protect lead quality",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6B00] flex-shrink-0" />
              <span className="text-sm text-[#F5F0E8]/70">{b}</span>
            </div>
          ))}
        </div>

        {/* ── Data preview ───────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Here&apos;s exactly what you get</span>
          </div>

          <div className="border border-[#FF6B00]/20 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#FF6B00]/20">
                  {["Address", "Owner", "Year Built", "Event", "Severity"].map((h) => (
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
                {PREVIEW_ROWS.map((row, i) => {
                  const cfg = SCORE_CONFIG[row.score];
                  return (
                    <tr
                      key={i}
                      className={`border-b border-[#FF6B00]/10 ${i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"}`}
                    >
                      <td className="px-5 py-3 text-[#F5F0E8]/80 whitespace-nowrap">{row.address}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {row.blur ? (
                          <span className="text-[#F5F0E8]/60 select-none" style={{ filter: "blur(4px)" }}>
                            {row.owner}
                          </span>
                        ) : (
                          <span className="text-[#F5F0E8]/70">{row.owner}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">{row.yearBuilt}</td>
                      <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">{row.event}</td>
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

          <p className="text-[10px] tracking-[0.15em] text-[#F5F0E8]/30 uppercase mt-3 leading-relaxed">
            Sample rows — paid access includes full owner data, mailing address, and severity score across 270,000+ Midwest properties.
          </p>
        </div>

        {/* ── Not Angi ───────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">This is not Angi or HomeAdvisor</span>
          </div>

          <div className="border border-[#FF6B00]/20">
            {[
              {
                heading: "No shared leads",
                body: "You get the property list, not a form submission 4 contractors already called.",
              },
              {
                heading: "No per-lead fees",
                body: "Flat $300/month — download as many leads as you want.",
              },
              {
                heading: "You work your own process",
                body: "Door knock, direct mail, cold call. Your leads, your close.",
              },
            ].map(({ heading, body }, i) => (
              <div
                key={heading}
                className={`flex gap-4 px-6 py-5 ${i < 2 ? "border-b border-[#FF6B00]/20" : ""}`}
              >
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <div>
                  <p className="text-sm text-[#F5F0E8] font-bold tracking-wide mb-1">{heading}</p>
                  <p className="text-xs text-[#F5F0E8]/50 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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

        {/* ── ROI Calculator ─────────────────────────────────────────── */}
        <RoiCalculator />

        {/* ── Early adopter ──────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left border border-[#FF6B00]/30 p-8 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <p className="text-base text-[#F5F0E8] leading-relaxed mb-3">
            Be one of the first contractors in your market with access.
          </p>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
            Early subscribers get locked in at $300/month — price increases as we add more counties and states.
          </p>
        </div>

        {/* ── ROI section ────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">The Math</span>
          </div>

          <div className="border border-[#FF6B00]/20 p-8">
            <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] uppercase mb-8">
              The math is simple
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[#FF6B00]/10 mb-6">
              {[
                { label: "Average roof job", value: "$8,000–$15,000 revenue" },
                { label: "Cost per month",   value: "$300/month" },
                { label: "Break even",       value: "1 callback per month" },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`p-5 ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-[#FF6B00]/10" : ""}`}
                >
                  <p className="text-[9px] tracking-[0.25em] text-[#F5F0E8]/35 uppercase mb-2">{label}</p>
                  <p className="font-heading text-lg tracking-widest text-[#FF6B00]">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#F5F0E8]/40 leading-relaxed">
              Most contractors close 3–5 jobs per month from our list.
            </p>
          </div>
        </div>

        {/* ── Resources ──────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Resources</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[#FF6B00]/20">
            {[
              {
                title: "How to Find Storm Damage Leads in Ohio",
                href: "/blog/how-to-find-storm-damage-leads-ohio",
                tag: "Ohio Guide",
              },
              {
                title: "7 Roofing Lead Generation Tips That Actually Work",
                href: "/blog/roofing-contractor-lead-generation-tips",
                tag: "Strategy",
              },
              {
                title: "How Roofing Contractors Use Hail Storm Trackers",
                href: "/blog/hail-storm-tracker-roofing-contractors",
                tag: "Storm Data",
              },
            ].map(({ title, href, tag }, i) => (
              <Link
                key={href}
                href={href}
                className={`group block p-6 hover:bg-[#FF6B00]/5 transition-colors ${
                  i < 2 ? "border-b sm:border-b-0 sm:border-r border-[#FF6B00]/20" : ""
                }`}
              >
                <span className="text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase border border-[#FF6B00]/30 px-2 py-0.5 inline-block mb-3">
                  {tag}
                </span>
                <p className="text-xs text-[#F5F0E8]/70 leading-relaxed mb-3 group-hover:text-[#F5F0E8] transition-colors">
                  {title}
                </p>
                <span className="text-[9px] tracking-[0.2em] text-[#FF6B00] uppercase group-hover:translate-x-1 transition-transform inline-block">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">FAQ</span>
          </div>

          <div className="border border-[#FF6B00]/20 divide-y divide-[#FF6B00]/10">
            {[
              {
                q: "Does this work in my state?",
                a: "Yes — we currently cover Ohio, Indiana, Michigan, Kentucky, Illinois, and Pennsylvania. Storm data updates every Monday. Property records include Franklin County (Columbus) and Cuyahoga County (Cleveland) with more counties being added monthly.",
              },
              {
                q: "How fresh is the storm data?",
                a: "Storm leads are pulled from NOAA every Monday morning and are typically 3–7 days old when they hit your dashboard. You'll see a NEW badge on any lead from the past 7 days.",
              },
              {
                q: "What's included in the sample CSV?",
                a: "50 real Franklin County, Ohio properties with owner name, mailing address, year built, and GPS coordinates. No fake data.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel from your account page anytime. We also offer a 30-day money-back guarantee — no questions asked.",
              },
              {
                q: "How is this different from HomeAdvisor or Angi?",
                a: "Those platforms sell the same lead to 5+ contractors and charge per lead. ClearedNo is a flat $300/mo and the data is yours — no competing bids, no per-lead fees.",
              },
              {
                q: "What's a \"hot\" vs \"warm\" lead?",
                a: "Hot leads are properties in counties that received hail 1.5\"+ or damaging wind in the last 30 days. Warm leads are properties in counties with storm activity in the last 90 days.",
              },
            ].map(({ q, a }, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FF6B00]/5 transition-colors group"
                >
                  <span className="text-sm text-[#F5F0E8]/80 group-hover:text-[#F5F0E8] transition-colors pr-4">
                    {q}
                  </span>
                  <span
                    className="text-[#FF6B00] text-lg leading-none flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{a}</p>
                  </div>
                )}
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

          <p className="text-[9px] tracking-[0.15em] text-[#F5F0E8]/30 uppercase mt-4 text-center leading-relaxed">
            Limited access per market — availability varies by region
          </p>
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
