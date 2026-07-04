import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import PermitAlertSignup from "@/app/permit-alert-signup";
import PermitTimelineEstimator from "@/app/tools/permit-timeline-estimator-client";

export const metadata: Metadata = {
  title: "Building Permit Timeline Estimator (2026) — How Long Will Your Permit Take? | ClearedNo",
  description:
    "Free permit timeline estimator. Find out how long a building permit takes by city and project type in 2026. Instant estimates for roofing, additions, new construction and more.",
  keywords: [
    "permit timeline estimator",
    "how long does a building permit take",
    "building permit processing time",
    "permit approval time by city",
    "roofing permit timeline",
    "new construction permit time",
    "permit wait time 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/tools/permit-timeline-estimator" },
  openGraph: {
    title: "Building Permit Timeline Estimator (2026) — How Long Will Your Permit Take?",
    description:
      "Free permit timeline estimator. Find out how long a building permit takes by city and project type in 2026.",
    url: "https://www.clearedno.com/tools/permit-timeline-estimator",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const FAQS = [
  {
    q: "How long does a building permit take?",
    a: "It depends on scope. Simple residential permits — roofs, fences, decks — are often issued over the counter or within a week. Trade permits and additions typically run 1-3 weeks because they need plan review. New construction is the longest at roughly 3-6 weeks or more, since plans route through multiple departments and often come back with correction requests.",
  },
  {
    q: "Why do permit timelines vary by city?",
    a: "Staffing and volume. A busy metro processing tens of thousands of applications per year runs longer queues than a smaller market, and cities differ on which project types qualify for fast-track or over-the-counter issuance. Seasonal surges matter too — spring and summer application spikes stretch review times everywhere.",
  },
  {
    q: "What slows down a permit approval?",
    a: "The most common culprit is an incomplete first submittal — missing site plans, unsigned documents, or wrong valuations trigger a correction cycle that can add weeks. Other frequent delays: plan review comments requiring resubmittal, zoning or variance issues, unregistered contractors, and high seasonal permit volume at the city.",
  },
  {
    q: "Does project type affect permit time?",
    a: "Significantly. Like-for-like replacements (roof, water heater, fence) often skip plan review entirely and are issued in days. Anything structural — additions, new construction — requires full plan review across building, zoning, and sometimes fire and public works, which multiplies the timeline.",
  },
  {
    q: "How can I speed up my permit approval?",
    a: "Submit a complete application the first time — that alone avoids the biggest delay. Verify zoning before applying, use contractors already registered in that jurisdiction, respond to correction requests the day they arrive, and watch your permit status so nothing sits unnoticed. ClearedNo automates that last part: it monitors the portal and emails you the moment your status changes.",
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

export default function PermitTimelineEstimatorPage() {
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
            <span className="text-[#FF6B00]">Timeline Estimator</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-xl">
            Find out how long your building permit will take before you apply. Pick your city
            and project type and get an instant 2026 estimate in business days, based on typical
            review windows and how busy each city&apos;s permit office runs. Works for roofing,
            decks, fences, electrical, plumbing, additions, and new construction.
          </p>
        </div>

        {/* Estimator */}
        <PermitTimelineEstimator />

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] uppercase mb-8">
            Permit Timeline FAQs
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
            The estimate tells you the wait. ClearedNo tells you the moment it ends.
          </h2>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-6 max-w-lg">
            Once you apply, ClearedNo watches the city portal for you and emails you the moment
            the status changes — cleared, approved, failed inspection, or hold. No more morning
            portal checks while you wait. Unlimited permits, $79/month flat, first month free.
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

        {/* Cross-link to the fee calculator */}
        <div className="mt-8 border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Link
            href="/tools/permit-fee-calculator"
            className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
          >
            ← Estimate Your Permit Fee
          </Link>
          <Link
            href="/permits"
            className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
          >
            Browse Permit Guides by City →
          </Link>
        </div>
      </div>

      {/* Email capture — free alert lead, tagged for the timeline-estimator funnel */}
      <PermitAlertSignup projectType="timeline-estimator" />
    </div>
  );
}
