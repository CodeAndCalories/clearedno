import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import PermitAlertSignup from "@/app/permit-alert-signup";
import PermitFeeCalculator from "@/app/tools/permit-fee-calculator-client";

export const metadata: Metadata = {
  title: "Building Permit Fee Calculator (2026) — Estimate Your Permit Cost | ClearedNo",
  description:
    "Free building permit fee calculator. Estimate permit costs by city, project type, and project value for 2026. Instant estimates for roofing, additions, new construction and more.",
  keywords: [
    "building permit fee calculator",
    "permit cost calculator",
    "how much does a building permit cost",
    "permit fees by city",
    "roofing permit cost",
    "new construction permit fees",
    "addition permit cost 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/tools/permit-fee-calculator" },
  openGraph: {
    title: "Building Permit Fee Calculator (2026) — Estimate Your Permit Cost",
    description:
      "Free building permit fee calculator. Estimate permit costs by city, project type, and project value for 2026.",
    url: "https://www.clearedno.com/tools/permit-fee-calculator",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const FAQS = [
  {
    q: "How are building permit fees calculated?",
    a: "Most US cities charge a base administrative fee plus a valuation-based fee tied to your project's total construction value — commonly around $5-8 per $1,000 of value for residential work. Some jurisdictions use tiered flat fees by value bracket instead. Either way, the bigger the project value, the bigger the permit fee.",
  },
  {
    q: "Why is this an estimate and not exact?",
    a: "Every jurisdiction sets its own fee schedule, and many add line items this calculator can't predict — plan review surcharges, technology fees, state training fund fees, impact fees on new construction. The calculator gives you a realistic planning range; your building department's fee schedule gives you the exact number.",
  },
  {
    q: "Do permit fees vary by city?",
    a: "Yes, significantly. Two cities in the same state can charge very different fees for the identical project — larger metros generally run higher fee schedules, and some cities layer on plan review or zoning fees that others don't. That's why the calculator asks for your city and shows a range rather than a single number.",
  },
  {
    q: "What's included in a permit fee?",
    a: "Typically: plan review, permit issuance, and the required inspections for that scope of work. Watch for extras that are often billed separately — trade permits (electrical, plumbing, mechanical) on a larger job, re-inspection fees if an inspection fails, and contractor registration fees if you're not yet registered in that jurisdiction.",
  },
  {
    q: "How can I find my exact permit fee?",
    a: "Check your city building department's published fee schedule (usually a PDF on the permits page of the city website) or call the permit counter with your project valuation. Many cities will quote the fee before you apply. When you do pull the permit, ClearedNo can track its status automatically so you never have to check the portal.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function PermitFeeCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <MarketingNav />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              Free Tool
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] uppercase leading-[0.95] mb-4">
            Building Permit<br />
            <span className="text-[#FF6B00]">Fee Calculator</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-xl">
            Estimate what your building permit will cost before you apply. Pick your city and
            project type, enter the project value, and get an instant 2026 fee range based on
            how US cities actually calculate permit fees — a base fee plus a percentage of
            construction value. Works for roofing, decks, fences, electrical, plumbing,
            additions, and new construction.
          </p>
        </div>

        {/* Calculator */}
        <PermitFeeCalculator />

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] uppercase mb-8">
            Permit Fee FAQs
          </h2>
          <div className="space-y-6 text-sm text-[#F5F0E8]/70 leading-relaxed">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-l-2 border-[#FF6B00]/30 pl-4">
                <p className="font-mono text-xs tracking-widest text-[#F5F0E8] uppercase mb-2">{faq.q}</p>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* $79 upsell CTA */}
        <div className="mt-16 border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-8 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h2 className="font-heading text-2xl sm:text-3xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            The fee is the easy part. The wait is what costs you.
          </h2>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-6 max-w-lg">
            Once you pull the permit, ClearedNo watches the city portal for you and emails you
            the moment the status changes — cleared, approved, failed inspection, or hold.
            Unlimited permits, $79/month flat, first month free.
          </p>
          <Link
            href="/permits/landing"
            className="inline-flex items-center gap-2 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#F5F0E8] transition-colors"
          >
            Track Your Permits Automatically →
          </Link>
          <p className="mt-4 text-[10px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
            First month free · Cancel anytime
          </p>
        </div>

        {/* Cross-links */}
        <div className="mt-8 border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Link
            href="/permits"
            className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
          >
            ← Browse Permit Guides by City
          </Link>
          <Link
            href="/check"
            className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
          >
            Check a Permit&apos;s Live Status →
          </Link>
        </div>
      </div>

      {/* Email capture — free alert lead, tagged for the fee-calculator funnel */}
      <PermitAlertSignup projectType="fee-calculator" />
    </div>
  );
}
