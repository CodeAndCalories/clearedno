import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roof Replacement Cost in Columbus OH (2026 Guide) | ClearedNo",
  description:
    "Average roof replacement cost in Columbus OH in 2026. Prices by material, neighborhood, and home size. What to expect before getting quotes.",
  keywords: [
    "roof replacement cost Columbus OH",
    "Columbus roofing cost 2026",
    "how much does a roof cost Columbus Ohio",
    "Columbus OH roofing contractor price",
    "Franklin County roof replacement cost",
    "asphalt shingle roof cost Columbus",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/roof-replacement-cost-columbus-oh" },
  openGraph: {
    title: "Roof Replacement Cost in Columbus OH (2026 Guide)",
    description:
      "Average roof replacement cost in Columbus OH in 2026. Prices by material, neighborhood, and home size. What to expect before getting quotes.",
    url: "https://www.clearedno.com/blog/roof-replacement-cost-columbus-oh",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Roof Replacement Cost in Columbus OH (2026 Guide)",
  description:
    "Average roof replacement cost in Columbus OH in 2026. Prices by material, neighborhood, and home size. What to expect before getting quotes.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-06",
  dateModified: "2026-05-06",
};

const costRows = [
  { size: "1,000 sq ft", asphalt: "$4,000–$6,500", metal: "$8,500–$13,000", arch: "$5,000–$8,000" },
  { size: "1,500 sq ft", asphalt: "$6,500–$10,000", metal: "$13,000–$19,500", arch: "$7,500–$12,000" },
  { size: "2,000 sq ft", asphalt: "$8,500–$13,000", metal: "$17,000–$26,000", arch: "$10,000–$16,000" },
  { size: "2,500 sq ft", asphalt: "$10,500–$16,000", metal: "$21,000–$32,000", arch: "$12,500–$20,000" },
  { size: "3,000 sq ft", asphalt: "$12,500–$19,000", metal: "$25,000–$38,000", arch: "$15,000–$24,000" },
];

const materialCosts = [
  { label: "3-tab asphalt shingles", value: "$90–$120 per square installed" },
  { label: "Architectural shingles", value: "$130–$180 per square installed" },
  { label: "Metal roofing", value: "$250–$450 per square installed" },
  { label: "Cedar shake", value: "$400–$600 per square installed" },
];

const neighborhoods = [
  {
    name: "German Village / Italian Village / Short North",
    desc: "Historic homes, complex rooflines, parking challenges. Premium pricing. Many homes have original slate or early asphalt that requires careful matching.",
  },
  {
    name: "Dublin / Powell / Upper Arlington",
    desc: "Larger homes, higher-end materials, premium pricing but also premium contractors. Expect $12,000–$22,000 for a typical home.",
  },
  {
    name: "Westerville / Gahanna / Reynoldsburg",
    desc: "Mid-range market, competitive contractor availability, good pricing. Most homeowners pay $8,000–$14,000.",
  },
  {
    name: "Grove City / Hilliard / Canal Winchester",
    desc: "Active storm damage market, lots of contractor competition, good pricing. Often 5–10% below Columbus proper.",
  },
  {
    name: "Whitehall / Glendale / Linden",
    desc: "Older housing stock, lots of storm damage work. Good contractor availability and competitive pricing.",
  },
];

const hailSigns = [
  "Circular dents or bruising on shingles",
  "Granule loss concentrated in impact patterns",
  "Dented gutters or downspouts",
  "Cracked or split shingles",
];

const contractorChecks = [
  "Ohio contractor license (verify at ohio.gov/licensing)",
  "General liability insurance minimum $1M",
  "Workers comp coverage",
  "Local address established before last storm season",
  "Google reviews spanning multiple years",
];

const claimSteps = [
  { t: "Have a contractor inspect first — reputable ones offer free inspections" },
  { t: "Document everything with photos before any repairs" },
  { t: "File your claim promptly — most policies have deadlines" },
  { t: "Your insurance company sends an adjuster" },
  { t: "If approved, the insurance check covers replacement minus your deductible" },
  { t: "Select your contractor and schedule work" },
];

export default function RoofReplacementCostColumbusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Columbus, OH</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 8 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          ROOF REPLACEMENT COST IN COLUMBUS OH (2026 GUIDE)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Columbus homeowners typically pay between $7,500 and $16,000 for a full roof replacement
          in 2026. Franklin County is one of Ohio&apos;s most active roofing markets — high storm
          activity and strong contractor competition keep prices reasonable.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Cost Table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">AVERAGE ROOF REPLACEMENT COST IN COLUMBUS OH</h2>
          <div className="border border-[#FF6B00]/20 overflow-x-auto">
            <div className="grid grid-cols-4 bg-[#FF6B00]/10 px-4 py-3 border-b border-[#FF6B00]/20 min-w-[540px]">
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Roof Size</span>
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Asphalt Shingles</span>
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Metal Roofing</span>
              <span className="text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase">Architectural</span>
            </div>
            {costRows.map((row, i) => (
              <div
                key={row.size}
                className={`grid grid-cols-4 px-4 py-3 min-w-[540px] ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < costRows.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
              >
                <span className="text-xs text-[#F5F0E8] font-mono">{row.size}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.asphalt}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.metal}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.arch}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Drivers */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT DRIVES ROOF REPLACEMENT COST IN COLUMBUS</h2>

          <div className="space-y-6">
            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-2">Home Age and Neighborhood</p>
              <p>
                Columbus has an incredibly diverse housing stock — from pre-war bungalows in Italian
                Village and German Village to new construction in Dublin and New Albany.
              </p>
              <p className="mt-3">
                <strong className="text-[#F5F0E8]">Older homes (pre-1970)</strong> in areas like
                Clintonville, Bexley, and Grandview often have steeper pitches, complex rooflines,
                and may have original decking that needs replacement. Budget 15–20% above average.
              </p>
              <p className="mt-3">
                <strong className="text-[#F5F0E8]">Newer construction</strong> in Hilliard,
                Westerville, Powell, and Grove City tends to be simpler rooflines with newer
                decking. Closer to average pricing.
              </p>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">Material Costs in 2026</p>
              <p className="mb-4">
                Material costs have stabilized somewhat after the supply chain volatility of
                2022–2024. Columbus contractors are currently quoting:
              </p>
              <div className="border border-[#FF6B00]/20 overflow-hidden">
                {materialCosts.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex justify-between px-5 py-3 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < materialCosts.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
                  >
                    <span className="text-[#F5F0E8]/60 text-xs">{item.label}</span>
                    <span className="font-mono text-xs text-[#F5F0E8]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-2">Storm Damage Context</p>
              <p>
                Franklin County is in Ohio&apos;s primary hail corridor. The NOAA storm events
                database shows consistent hail activity — Columbus averages multiple 1&quot;+ hail
                events per year. This keeps the roofing market active and contractors experienced
                with insurance claims.
              </p>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COLUMBUS ROOFING BY NEIGHBORHOOD</h2>
          <div className="space-y-4">
            {neighborhoods.map((n) => (
              <div key={n.name} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{n.name}</strong> — {n.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hail Season */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HAIL SEASON IN COLUMBUS</h2>
          <p>
            Columbus and Franklin County experience some of Ohio&apos;s most active hail seasons.
            Peak hail activity runs April through September, with the most damaging storms
            typically occurring in May and June.
          </p>
          <p className="mt-3">
            After a significant hail event, Columbus roofing contractors book out 4–8 weeks. If
            your roof was damaged, acting quickly matters — both for scheduling and for insurance
            documentation.
          </p>
          <p className="mt-4 text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase">Signs your Columbus roof has hail damage</p>
          <ul className="space-y-3 mt-3">
            {hailSigns.map((sign) => (
              <li key={sign} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Permits */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">GETTING ROOFING PERMITS IN COLUMBUS</h2>
          <p>
            The City of Columbus requires permits for roof replacements. The permit process
            through Columbus Building Services typically takes 1–3 business days for residential
            work.
          </p>
          <p className="mt-3">
            Your contractor should handle the permit — ask to see it before work begins. You can
            verify permit status at{" "}
            <span className="text-[#F5F0E8]">permits.columbus.gov</span> by searching your
            address.
          </p>
        </section>

        {/* Contractor Tips */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COLUMBUS ROOFING CONTRACTOR TIPS</h2>
          <p>
            Franklin County has 200+ licensed roofing contractors. That&apos;s good news for
            pricing competition — bad news for sorting out who&apos;s legitimate.
          </p>
          <p className="mt-3 mb-4">Key things to verify:</p>
          <ul className="space-y-3">
            {contractorChecks.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <strong className="text-[#F5F0E8]">After a hail storm:</strong> Columbus gets flooded
            with out-of-state storm chasers. Stick with contractors who have a permanent Columbus
            or central Ohio address and reviews predating the storm.
          </p>
        </section>

        {/* Insurance Claim */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO FILE A HAIL DAMAGE INSURANCE CLAIM IN COLUMBUS</h2>
          <ol className="space-y-3 ml-4">
            {claimSteps.map((step, i) => (
              <li key={step.t} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{i + 1}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4">
            The most common mistake Columbus homeowners make is waiting too long after a storm.
            Document damage immediately and start the claim process within 30 days of the event.
          </p>
        </section>

        {/* Related Posts */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">RELATED POSTS</h2>
          <div className="space-y-3">
            {[
              { href: "/blog/emergency-roof-repair-columbus-oh", label: "Emergency Roof Repair in Columbus OH — What to Do Right Now" },
              { href: "/blog/roof-replacement-cost-cleveland-oh", label: "Roof Replacement Cost in Cleveland OH (2026 Guide)" },
              { href: "/blog/best-roofing-contractors-cleveland-oh", label: "Best Roofing Contractors in Cleveland OH (2026)" },
            ].map((post) => (
              <div key={post.href} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <Link href={post.href} className="text-[#F5F0E8]/70 hover:text-[#FF6B00] transition-colors">{post.label}</Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">ROOFING CONTRACTOR IN COLUMBUS?</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo delivers weekly hail damage leads for Columbus and all of Franklin County —
            owner names, addresses, year built, storm severity. One job covers a year of access.
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
                q: "What is the average roof size in Columbus OH?",
                a: "Most Columbus homes have roofs between 1,500 and 2,500 square feet of surface area. Ranch homes tend to have larger roof footprints relative to their living space.",
              },
              {
                q: "How long does a roof last in Columbus?",
                a: "Asphalt shingles last 20–30 years in central Ohio conditions. Metal roofing lasts 40–70 years. Columbus's hail activity can shorten lifespan — inspect annually after storm season.",
              },
              {
                q: "Do Columbus roofing contractors offer financing?",
                a: "Many do — especially for larger jobs. GreenSky, Synchrony, and manufacturer financing programs are common. Expect 12–18 month same-as-cash options or longer-term financing at 6–10% APR.",
              },
              {
                q: "Is a permit required for roof replacement in Columbus?",
                a: "Yes. Any full replacement or significant repair requires a permit from Columbus Building Services. Contractors who skip permits create problems for resale.",
              },
              {
                q: "How do I compare Columbus roofing quotes?",
                a: "Make sure all quotes cover the same scope — tear-off layers, decking inspection, flashing replacement, drip edge, ice and water shield. A low quote that excludes these items isn't actually cheaper.",
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
          <Link href="/leads/roofing/oh/columbus" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">
            Find hail damage leads in Columbus and Franklin County →
          </Link>
        </p>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/roof-replacement-cost-cleveland-oh" className="hover:text-[#FF6B00] transition-colors">
            Roof Replacement Cost in Cleveland OH →
          </Link>
        </nav>
      </div>
    </article>
  );
}
