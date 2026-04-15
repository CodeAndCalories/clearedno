import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import RoiCalculator from "@/app/leads/landing/RoiCalculator";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Roofing Lead ROI Calculator — Is $300/mo Worth It?",
  description:
    "Calculate how many roofing jobs you need to break even on $300/mo in storm damage leads. See your ROI in seconds.",
  alternates: {
    canonical: "https://www.clearedno.com/leads/roi-calculator",
  },
  openGraph: {
    title: "Roofing Lead ROI Calculator — Is $300/mo Worth It?",
    description:
      "Calculate how many roofing jobs you need to break even on $300/mo in storm damage leads. See your ROI in seconds.",
    url: "https://www.clearedno.com/leads/roi-calculator",
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RoiCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      <MarketingNav />

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              Free Tool
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] uppercase leading-[0.95] mb-4">
            Roofing Lead<br />
            <span className="text-[#FF6B00]">ROI Calculator</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-md">
            Find out exactly how many jobs it takes to make ClearedNo pay for itself.
            Adjust the sliders for your business and see your break-even in real time.
          </p>
        </div>

        {/* Calculator */}
        <RoiCalculator />

        {/* CTA */}
        <div className="border border-[#FF6B00]/25 p-8 text-center">
          <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-3">
            Ready to start?
          </p>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed mb-6">
            Get weekly NOAA-sourced storm damage leads across 6 Midwest states —
            scored by severity, updated every Monday. $300/mo, cancel anytime.
          </p>
          <Link
            href="/leads/landing"
            className="inline-flex items-center gap-2 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#F5F0E8] transition-colors"
          >
            Get Access — $300/mo →
          </Link>
          <p className="mt-4 text-[10px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
            No contracts · Cancel anytime · 30-day money back
          </p>
        </div>

        {/* Breadcrumb back link */}
        <div className="mt-8 border-t border-[#FF6B00]/10 pt-6">
          <Link
            href="/leads/landing"
            className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
          >
            ← Back to Roofing Leads
          </Link>
        </div>

      </div>
    </div>
  );
}
