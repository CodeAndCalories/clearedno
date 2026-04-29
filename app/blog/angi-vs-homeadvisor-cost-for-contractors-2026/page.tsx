import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Angi vs HomeAdvisor Cost for Contractors in 2026 — Is It Worth It? | ClearedNo",
  description:
    "We break down the real cost of Angi and HomeAdvisor for roofing contractors in 2026 — and compare them to storm data lead services.",
  keywords: [
    "Angi vs HomeAdvisor roofing",
    "HomeAdvisor cost for contractors 2026",
    "Angi leads roofing contractor",
    "roofing lead cost 2026",
    "storm data leads vs HomeAdvisor",
    "best roofing lead source 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/angi-vs-homeadvisor-cost-for-contractors-2026" },
  openGraph: {
    title: "Angi vs HomeAdvisor Cost for Contractors in 2026 — Is It Worth It?",
    description:
      "We break down the real cost of Angi and HomeAdvisor for roofing contractors in 2026 — and compare them to storm data lead services.",
    url: "https://www.clearedno.com/blog/angi-vs-homeadvisor-cost-for-contractors-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Angi vs HomeAdvisor Cost for Contractors in 2026 — Is It Worth It?",
  description:
    "We break down the real cost of Angi and HomeAdvisor for roofing contractors in 2026 — and compare them to storm data lead services.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
};

const comparisonRows = [
  { label: "Cost", angi: "$80–200/lead + membership", storm: "$300/month flat" },
  { label: "Lead exclusivity", angi: "Shared with 3–4 contractors", storm: "Your list, not shared" },
  { label: "Lead volume", angi: "Pay per lead", storm: "Unlimited downloads" },
  { label: "Data includes", angi: "Homeowner request only", storm: "Address, owner name, year built" },
  { label: "Best for", angi: "Homeowners actively searching", storm: "Proactive canvassing after storms" },
];

export default function AngiVsHomeAdvisorPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Lead Sources</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">April 2026 · 5 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          ANGI VS HOMEADVISOR COST FOR CONTRACTORS IN 2026 — IS IT WORTH IT?
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          If you&apos;re a roofing contractor evaluating lead sources in 2026, you&apos;ve probably
          looked at Angi and HomeAdvisor. Here&apos;s the honest breakdown of what they actually
          cost and what you get.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW ANGI AND HOMEADVISOR CHARGE CONTRACTORS</h2>
          <p>
            Both platforms charge per lead — and the costs have gone up significantly in recent years.
          </p>
          <p className="mt-4 text-xs text-[#FF6B00] font-mono tracking-widest uppercase">Typical roofing lead costs in 2026</p>
          <ul className="space-y-3 mt-3">
            {[
              { label: "HomeAdvisor", value: "$80–$150 per lead" },
              { label: "Angi (formerly Angi Leads)", value: "$80–$200 per lead" },
              { label: "Annual membership fee", value: "$300–$500 on top of lead costs" },
            ].map((item) => (
              <li key={item.label} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{item.label}:</strong> {item.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            The problem isn&apos;t just the cost — it&apos;s the model. You&apos;re buying the same
            lead that 3–4 other contractors also bought. By the time you call, the homeowner has
            already heard from your competition.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE REAL MATH</h2>
          <p>Say you buy 20 leads per month at $100 each:</p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              { label: "Lead cost", value: "$2,000/month" },
              { label: "Close rate on shared leads", value: "10–15% typically" },
              { label: "Jobs closed", value: "2" },
              { label: "Revenue per job", value: "$8,000 average" },
              { label: "Revenue", value: "$16,000" },
              { label: "Profit after leads", value: "$14,000" },
            ].map((row, i) => (
              <div key={row.label} className={`flex justify-between px-5 py-3 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 5 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <span className="text-[#F5F0E8]/60">{row.label}</span>
                <span className="font-mono text-xs text-[#F5F0E8]">{row.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4">
            That math works — until lead quality drops, which contractors report happening
            consistently after the first few months.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT ROOFING CONTRACTORS ARE DOING INSTEAD IN 2026</h2>
          <p>
            The contractors closing the most jobs after storms aren&apos;t buying shared leads.
            They&apos;re using NOAA storm data to find damaged properties before homeowners even
            call anyone.
          </p>
          <p className="mt-3">The approach:</p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Storm hits a county" },
              { n: "2", t: "They pull a list of affected properties with owner names and addresses" },
              { n: "3", t: "They door knock or direct mail within 48 hours" },
              { n: "4", t: "They're first — not competing with 3 other contractors" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 border border-[#FF6B00]/20 p-5 space-y-2">
            {[
              { label: "Average roof job", value: "$8,000–$15,000" },
              { label: "Cost of storm data service", value: "$300/month" },
              { label: "Break-even", value: "One job per month" },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between">
                <span className="text-[#F5F0E8]/60 text-xs">{stat.label}</span>
                <span className="font-mono text-xs text-[#FF6B00] font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">ANGI VS HOMEADVISOR VS STORM DATA — SIDE BY SIDE</h2>
          <div className="border border-[#FF6B00]/20 overflow-hidden">
            <div className="grid grid-cols-3 bg-[#FF6B00]/10 px-5 py-3 border-b border-[#FF6B00]/20">
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase"></span>
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Angi / HomeAdvisor</span>
              <span className="text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase">Storm Data (ClearedNo)</span>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < comparisonRows.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <span className="text-xs text-[#F5F0E8]/50 font-mono">{row.label}</span>
                <span className="text-xs text-[#F5F0E8]/70 pr-4">{row.angi}</span>
                <span className="text-xs text-[#F5F0E8]">{row.storm}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">BOTTOM LINE</h2>
          <p>
            Angi and HomeAdvisor work for some contractors — especially those who don&apos;t want
            to do outbound work. But the cost per job is high and competition is intense.
          </p>
          <p className="mt-3">
            If you&apos;re in a storm-heavy market like Ohio, Illinois, Indiana, Michigan, Kentucky,
            or Pennsylvania — storm data lets you move faster and cheaper than any lead marketplace.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">SEE HOW CLEAREDNO WORKS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            $300/month. No per-lead fees. Cancel anytime.
          </p>
          <Link
            href="/leads/landing"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            SEE HOW CLEAREDNO WORKS →
          </Link>
          <p className="mt-2 text-[9px] text-[#F5F0E8]/25 text-center">OH, IN, MI, KY, IL, and PA covered</p>
        </div>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FAQS</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is HomeAdvisor worth it for roofers in 2026?",
                a: "It depends on your close rate and market. At $100+ per shared lead, you need a strong follow-up system to make the math work.",
              },
              {
                q: "What states does ClearedNo cover?",
                a: "OH, IN, MI, KY, IL, and PA — the Midwest hail corridor.",
              },
              {
                q: "Can I cancel ClearedNo anytime?",
                a: "Yes — no contracts, 30-day money back guarantee.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <p className="font-heading text-base tracking-widest text-[#F5F0E8] mb-2">{faq.q}</p>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/roofing-lead-sources-2026" className="hover:text-[#FF6B00] transition-colors">
            Best Roofing Lead Sources in 2026 →
          </Link>
        </nav>
      </div>
    </article>
  );
}
