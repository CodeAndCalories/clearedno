import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hail Damage Roof Repair in Chicago IL (2026 Guide) | ClearedNo",
  description:
    "Hail damage roof repair in Chicago IL — how to spot damage, file an insurance claim, find a contractor, and what repairs cost in 2026.",
  keywords: [
    "hail damage roof repair Chicago IL",
    "Chicago hail damage roofing 2026",
    "Cook County hail damage insurance claim",
    "Chicago roofing contractor hail",
    "hail damage Chicago suburbs",
    "Illinois hail damage roof replacement",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/hail-damage-roof-repair-chicago-il" },
  openGraph: {
    title: "Hail Damage Roof Repair in Chicago IL (2026 Guide)",
    description:
      "Hail damage roof repair in Chicago IL — how to spot damage, file an insurance claim, find a contractor, and what repairs cost in 2026.",
    url: "https://www.clearedno.com/blog/hail-damage-roof-repair-chicago-il",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hail Damage Roof Repair in Chicago IL (2026 Guide)",
  description:
    "Hail damage roof repair in Chicago IL — how to spot damage, file an insurance claim, find a contractor, and what repairs cost in 2026.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-06",
  dateModified: "2026-05-06",
};

const shingleSigns = [
  { label: "Circular bruising or dents", desc: "hail impact creates soft spots that compress the shingle mat" },
  { label: "Granule loss in impact patterns", desc: "random circular areas of exposed black mat" },
  { label: "Cracked or fractured shingles", desc: "from larger hailstones" },
  { label: "Shiny spots", desc: "where granules have been knocked off, leaving exposed asphalt" },
];

const otherIndicators = [
  "Dented gutters and downspouts — hail hits metal at the same force as your roof",
  "Dented AC condenser fins — same storm, same impact",
  "Damaged window screens or siding — confirms hail hit the property",
];

const repairRows = [
  { level: "Minor (isolated)", type: "Spot repair", cost: "$300–$1,200" },
  { level: "Moderate (one slope)", type: "Partial replacement", cost: "$2,500–$6,000" },
  { level: "Severe (full roof)", type: "Full replacement", cost: "$9,000–$20,000" },
  { level: "Insurance claim", type: "Your deductible", cost: "$500–$2,500" },
];

const claimSteps = [
  {
    title: "Get a Contractor Inspection First",
    desc: "Before calling your insurance company, have a roofing contractor inspect. Reputable Chicago contractors offer free hail damage inspections. Their documentation helps your claim.",
  },
  {
    title: "File Promptly",
    desc: "Most Illinois homeowners insurance policies have a 1-year deadline for storm damage claims — some are shorter. Don't assume you have unlimited time. Call your insurance company, report the storm date, and request an adjuster inspection.",
  },
  {
    title: "Insurance Adjuster Visit",
    desc: "The adjuster will inspect independently. Having your contractor present during the adjuster's visit is your right and is strongly recommended. Contractors know what adjusters look for and can point out damage the adjuster might miss.",
  },
  {
    title: "Review the Estimate",
    desc: "If approved, the insurance company issues an Actual Cash Value (ACV) payment immediately — this is replacement cost minus depreciation. After the work is completed, you can claim the Replacement Cost Value (RCV) — the depreciation amount.",
  },
  {
    title: "Supplement if Needed",
    desc: "If the insurance estimate misses items — code upgrades, additional flashing, ice and water shield requirements — your contractor can submit a supplement. This is common and legitimate.",
  },
];

const verifyItems = [
  "Illinois contractor registration",
  "General liability and workers comp insurance",
  "GAF Master Elite or Owens Corning Preferred certification",
  "Established Google presence with reviews predating the storm",
  "Chicago-area physical address",
];

const scamItems = [
  "Deductible waiver offers (insurance fraud, illegal in Illinois)",
  "Full payment upfront",
  "Verbal-only estimates",
  "Pressure to sign same-day",
];

const timeline = [
  { period: "Week 1–2", desc: "Storm chasers flood the market, legitimate contractors get inundated with calls" },
  { period: "Week 3–6", desc: "Legitimate contractors booked 4–8 weeks out" },
  { period: "Month 2–4", desc: "Peak installation season, prices hold firm" },
  { period: "Late fall", desc: "Contractor availability improves, some pricing flexibility" },
];

const neighborhoods = [
  {
    name: "City of Chicago proper",
    desc: "Flat and low-slope roofs are common — different repair process than suburban pitched roofs. Many Chicago city roofs use modified bitumen or TPO membrane, not shingles.",
  },
  {
    name: "North Shore suburbs (Evanston, Wilmette, Winnetka)",
    desc: "Older homes, complex rooflines, premium materials. Expect premium contractor pricing.",
  },
  {
    name: "Western suburbs (Naperville, Aurora, Wheaton)",
    desc: "High volume of storm damage work, competitive contractor market, good pricing.",
  },
  {
    name: "South suburbs (Joliet, Tinley Park, Orland Park)",
    desc: "Active storm corridor, good contractor availability, mid-range pricing.",
  },
];

export default function HailDamageRoofRepairChicagoPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Chicago, IL</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 8 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HAIL DAMAGE ROOF REPAIR IN CHICAGO IL (2026 GUIDE)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Chicago and the surrounding Cook County suburbs get hit by significant hail multiple times
          per year. The window to act is short — insurance claim deadlines, contractor availability,
          and weather all work against you if you wait.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Does Chicago Get Hail */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DOES CHICAGO GET HAIL?</h2>
          <p>
            Yes — more than most people realize. While Chicago&apos;s lakefront moderates
            temperatures, the broader Cook County and collar counties area sits in the Midwest hail
            corridor. Significant hail events (1 inch or larger) occur multiple times per season,
            typically April through September.
          </p>
          <p className="mt-3">
            The suburbs — Naperville, Aurora, Joliet, Schaumburg, Arlington Heights — often see
            more severe hail than the city proper due to storm track patterns.
          </p>
        </section>

        {/* Spotting Damage */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO SPOT HAIL DAMAGE ON A CHICAGO ROOF</h2>

          <div className="space-y-6">
            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">Asphalt Shingles (Most Common in Chicago)</p>
              <div className="space-y-3">
                {shingleSigns.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span><strong className="text-[#F5F0E8]">{item.label}</strong> — {item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">Other Indicators</p>
              <ul className="space-y-3">
                {otherIndicators.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4">
            The roof itself often looks fine from the ground. Most legitimate hail damage requires
            getting on the roof to assess — or having a contractor inspect.
          </p>
        </section>

        {/* Repair Costs */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CHICAGO HAIL DAMAGE REPAIR COSTS</h2>
          <div className="border border-[#FF6B00]/20 overflow-x-auto">
            <div className="grid grid-cols-3 bg-[#FF6B00]/10 px-4 py-3 border-b border-[#FF6B00]/20 min-w-[420px]">
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Damage Level</span>
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Repair Type</span>
              <span className="text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase">Typical Cost</span>
            </div>
            {repairRows.map((row, i) => (
              <div
                key={row.level}
                className={`grid grid-cols-3 px-4 py-3 min-w-[420px] ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < repairRows.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
              >
                <span className="text-xs text-[#F5F0E8]">{row.level}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.type}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.cost}</span>
              </div>
            ))}
          </div>
          <p className="mt-4">
            For most significant hail events — 1 inch or larger — full replacement is typically
            necessary. Insurance adjusters look for a certain density of impacts per 10-square-foot
            test area. When that threshold is met, the full slope or full roof is approved.
          </p>
        </section>

        {/* Insurance Claim Steps */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FILING A HAIL DAMAGE INSURANCE CLAIM IN CHICAGO</h2>
          <div className="space-y-5">
            {claimSteps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <span className="w-6 h-6 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-1">{step.title}</p>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Permit Requirements */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CHICAGO-AREA ROOFING PERMIT REQUIREMENTS</h2>
          <p className="mb-4">Chicago and Cook County suburbs each have their own permit requirements:</p>
          <div className="space-y-4">
            {[
              {
                name: "City of Chicago",
                desc: "Roof replacements require a permit through the Chicago Department of Buildings. The portal is at chicago.gov/buildings. Permits run $150–$400 for residential.",
              },
              {
                name: "Cook County suburbs",
                desc: "Each suburb has its own building department. Naperville, Aurora, Joliet, Schaumburg all require permits. Your contractor should know the local requirements.",
              },
            ].map((item) => (
              <div key={item.name} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{item.name}:</strong> {item.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Permits are non-negotiable for legitimate work. Insurance companies increasingly
            require permit documentation for claims.
          </p>
        </section>

        {/* Finding a Contractor */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FINDING A RELIABLE CHICAGO ROOFING CONTRACTOR</h2>
          <p className="mb-4">
            Chicago&apos;s roofing market is massive — hundreds of contractors serve Cook County
            and the collar counties. After hail events, out-of-state storm chasers add to the
            chaos.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase mb-3">Verify before hiring</p>
              <ul className="space-y-3">
                {verifyItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase mb-3">Common scams to avoid</p>
              <ul className="space-y-3">
                {scamItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#F5F0E8]/30 flex-shrink-0 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Hail Season Timeline */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HAIL SEASON TIMELINE FOR CHICAGO CONTRACTORS</h2>
          <p className="mb-4">After a major Cook County hail event:</p>
          <div className="border border-[#FF6B00]/20 overflow-hidden">
            {timeline.map((row, i) => (
              <div
                key={row.period}
                className={`flex gap-4 px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < timeline.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
              >
                <span className="text-xs text-[#FF6B00] font-mono font-bold w-24 flex-shrink-0">{row.period}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-4">
            If you&apos;re dealing with a late-season storm, legitimate contractors may push
            installation to the following spring. This is fine for non-emergency damage as long as
            your insurance claim is filed.
          </p>
        </section>

        {/* Neighborhoods */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CHICAGO NEIGHBORHOODS AND ROOFING CONSIDERATIONS</h2>
          <div className="space-y-4">
            {neighborhoods.map((n) => (
              <div key={n.name} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{n.name}:</strong> {n.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">ROOFING CONTRACTOR IN CHICAGO?</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo delivers weekly hail damage leads for Chicago and Cook County — owner names,
            addresses, year built, storm severity. One job covers a year of access.
          </p>
          <Link
            href="/api/sample-download"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            DOWNLOAD FREE SAMPLE →
          </Link>
          <p className="mt-2 text-[9px] text-[#F5F0E8]/25 text-center">OH, IN, MI, KY, IL, and PA covered · No signup needed</p>
        </div>

        {/* FAQs */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FAQS</h2>
          <div className="space-y-6">
            {[
              {
                q: "How long does hail damage take to show up as a leak?",
                a: "Hail damage can cause leaks immediately or take 1–3 years as the damaged shingles deteriorate. This is why filing an insurance claim promptly matters — waiting until you see a leak means your policy deadline may have passed.",
              },
              {
                q: "Can I claim hail damage on a roof that's already old?",
                a: "Yes — if the storm caused damage, you can file a claim regardless of roof age. However, the insurance payout may reflect depreciation on an older roof (ACV vs RCV).",
              },
              {
                q: "Is Chicago roofing more expensive than suburbs?",
                a: "Generally yes — city permits, parking, material delivery, and labor costs run higher in Chicago proper vs suburban Cook County and collar counties.",
              },
              {
                q: "What hail size causes roof damage?",
                a: "Insurance adjusters typically look for 1 inch or larger (quarter size). Smaller hail can cause damage on older or already-compromised roofs. Wind-driven smaller hail can also cause damage that exceeds what size alone would suggest.",
              },
              {
                q: "How do I know if a Chicago roofer is legitimate?",
                a: "Verify Illinois registration, check Google reviews spanning multiple years, confirm they have a physical Chicago-area address, and ask for certificates of insurance before signing anything.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <p className="font-heading text-base tracking-widest text-[#F5F0E8] mb-2">{faq.q}</p>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-[#F5F0E8]/40">
          <Link href="/leads/roofing/il/chicago" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">
            See hail damage leads for Chicago and Cook County →
          </Link>
        </p>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/hail-damage-clinton-il" className="hover:text-[#FF6B00] transition-colors">
            Hail Damage in Clinton IL →
          </Link>
        </nav>
      </div>
    </article>
  );
}
