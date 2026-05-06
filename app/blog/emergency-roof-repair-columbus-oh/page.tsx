import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Emergency Roof Repair in Columbus OH — What to Do Right Now | ClearedNo",
  description:
    "Need emergency roof repair in Columbus OH? What to do immediately after storm damage, how to find a contractor fast, and what it costs.",
  keywords: [
    "emergency roof repair Columbus OH",
    "Columbus Ohio emergency roofer",
    "storm damage roof repair Columbus",
    "emergency tarping Columbus Ohio",
    "Franklin County emergency roof repair",
    "roof leak Columbus OH",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/emergency-roof-repair-columbus-oh" },
  openGraph: {
    title: "Emergency Roof Repair in Columbus OH — What to Do Right Now",
    description:
      "Need emergency roof repair in Columbus OH? What to do immediately after storm damage, how to find a contractor fast, and what it costs.",
    url: "https://www.clearedno.com/blog/emergency-roof-repair-columbus-oh",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Emergency Roof Repair in Columbus OH — What to Do Right Now",
  description:
    "Need emergency roof repair in Columbus OH? What to do immediately after storm damage, how to find a contractor fast, and what it costs.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-06",
  dateModified: "2026-05-06",
};

const interiorSteps = [
  "Move furniture and valuables away from the leak area",
  "Place buckets or containers to catch dripping water",
  "Use towels or plastic sheeting to protect flooring",
  "If water is near electrical outlets or panels, turn off the circuit breaker for that area",
];

const documentItems = [
  "The interior damage — water stains, wet insulation, damaged drywall",
  "The exterior damage if safely visible from the ground",
  "Any hail damage to gutters, siding, AC units (these support your insurance claim)",
];

const repairRows = [
  { type: "Emergency tarping", cost: "$200–$500", premium: "Standard" },
  { type: "Small patch repair", cost: "$300–$800", premium: "+$150–$300" },
  { type: "Flashing repair", cost: "$200–$600", premium: "+$150–$300" },
  { type: "Partial section replacement", cost: "$1,500–$4,000", premium: "+$200–$500" },
  { type: "Full replacement (emergency)", cost: "$8,000–$16,000", premium: "Schedule ASAP" },
];

const claimSteps = [
  "Call your insurance company to report the claim — don't wait",
  "Your insurer will assign a claim number and adjuster",
  "Document damage before any repairs beyond emergency tarping",
  "Keep all receipts — emergency tarping costs are typically reimbursable",
];

const waitTimes = [
  { situation: "Active leak into living space", timing: "Same day", note: "ongoing water damage compounds rapidly" },
  { situation: "Storm damage without active leak", timing: "24–72 hours", note: "document and arrange inspection" },
  { situation: "Hail damage", timing: "Up to 30 days", note: "file insurance claim immediately and get on contractor's schedule" },
  { situation: "Flashing issue causing slow leak", timing: "Within 1–2 weeks", note: "slow leaks cause mold faster than most homeowners expect" },
];

const safelyDo = [
  "Plastic sheeting over interior areas to protect belongings",
  "Buckets to catch active drips",
  "Calling multiple contractors simultaneously to find fastest availability",
];

const doNotDo = [
  "Attempt to walk on your roof",
  "Apply roofing cement or patches yourself without experience",
  "Remove damaged materials before documenting them",
];

const verificationSteps = [
  'Google the company name + "reviews" — look for reviews predating the current storm',
  "Ask for their Ohio contractor license number",
  "Never pay full amount upfront — 10–30% deposit maximum",
  "Get the scope of any emergency work in writing, even a text message confirmation",
];

export default function EmergencyRoofRepairColumbusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Columbus, OH</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          EMERGENCY ROOF REPAIR IN COLUMBUS OH — WHAT TO DO RIGHT NOW
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Dealing with an active leak, storm damage, or structural failure in Columbus? Here&apos;s
          exactly what to do — in the right order.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Immediate Steps */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">IMMEDIATE STEPS (FIRST 2 HOURS)</h2>

          <div className="space-y-6">
            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">1. Stop the Interior Damage First</p>
              <p className="mb-3">Before anything else, protect your belongings and interior:</p>
              <ul className="space-y-3">
                {interiorSteps.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">2. Document Everything</p>
              <p className="mb-3">
                Before any repairs or cleanup, photograph and video everything:
              </p>
              <ul className="space-y-3">
                {documentItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[#F5F0E8]/50 italic">
                Do not go on your roof — leave that to professionals.
              </p>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-2">3. Temporary Protection</p>
              <p>
                If a contractor can&apos;t get there immediately, temporary tarping prevents further
                damage. Some Columbus roofing companies offer emergency tarping services — call and
                ask specifically about emergency response time.
              </p>
            </div>
          </div>
        </section>

        {/* Finding Emergency Contractor */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FINDING AN EMERGENCY ROOFING CONTRACTOR IN COLUMBUS</h2>
          <p>
            Columbus has a large contractor market but genuine emergency availability varies. When
            calling, ask specifically:
          </p>
          <ul className="space-y-3 mt-4">
            {[
              '"Do you offer emergency same-day or next-day service?"',
              '"Can you tarp today if replacement can\'t happen immediately?"',
              '"What\'s your emergency response fee?"',
            ].map((q) => (
              <li key={q} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span className="text-[#F5F0E8]/80">{q}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Emergency calls typically carry a premium — expect to pay $150–$400 for emergency
            dispatch on top of repair costs. That&apos;s normal and worth it to stop ongoing damage.
          </p>
        </section>

        {/* Common Emergencies */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON ROOFING EMERGENCIES IN COLUMBUS</h2>

          <div className="space-y-6">
            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">Storm Damage (Hail and Wind)</p>
              <p className="mb-4">
                Columbus and Franklin County sit in Ohio&apos;s primary storm corridor. The most
                common roofing emergencies:
              </p>
              <div className="space-y-4">
                {[
                  {
                    label: "Hail damage",
                    desc: "Doesn't always cause immediate leaks but cracks shingles and allows water infiltration over time. After a hail event, get an inspection within 30 days — most insurance policies have claim filing deadlines.",
                  },
                  {
                    label: "Wind damage",
                    desc: "Missing shingles, lifted flashing, and damaged ridge caps expose decking immediately. These need prompt attention — exposed decking deteriorates fast in Columbus's wet springs.",
                  },
                  {
                    label: "Branch and tree impact",
                    desc: "A fallen branch can puncture decking entirely. Temporary tarping is essential while you arrange permanent repairs.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span><strong className="text-[#F5F0E8]">{item.label}:</strong> {item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-3">Ice Dam Damage</p>
              <p className="mb-3">
                Columbus winters produce ice dams — ice formations at the roof edge that force
                water back under shingles. Signs include:
              </p>
              <ul className="space-y-3">
                {[
                  "Water stains at exterior walls near the roofline",
                  "Icicle formation along gutters",
                  "Water dripping from soffits",
                ].map((sign) => (
                  <li key={sign} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                Ice dams are a symptom of inadequate insulation and ventilation. Emergency repair
                addresses the immediate leak — underlying insulation issues need separate attention.
              </p>
            </div>

            <div>
              <p className="font-heading text-base tracking-widest text-[#FF6B00] mb-2">Flashing Failure</p>
              <p>
                Flashing around chimneys, pipes, and skylights is the most common source of
                non-storm leaks in Columbus homes. Flashing repairs are typically $200–$600 and
                can often be done same-day or next-day even during busy periods.
              </p>
            </div>
          </div>
        </section>

        {/* Cost Table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">EMERGENCY REPAIR COSTS IN COLUMBUS</h2>
          <div className="border border-[#FF6B00]/20 overflow-x-auto">
            <div className="grid grid-cols-3 bg-[#FF6B00]/10 px-4 py-3 border-b border-[#FF6B00]/20 min-w-[480px]">
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Repair Type</span>
              <span className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase">Typical Cost</span>
              <span className="text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase">Emergency Premium</span>
            </div>
            {repairRows.map((row, i) => (
              <div
                key={row.type}
                className={`grid grid-cols-3 px-4 py-3 min-w-[480px] ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < repairRows.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
              >
                <span className="text-xs text-[#F5F0E8]">{row.type}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.cost}</span>
                <span className="text-xs text-[#F5F0E8]/70">{row.premium}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Insurance */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">INSURANCE CLAIMS FOR EMERGENCY ROOF DAMAGE IN COLUMBUS</h2>
          <p>
            If your emergency was caused by a storm, hail, wind, or falling tree — your
            homeowners insurance likely covers it.
          </p>
          <p className="mt-4 mb-3 text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase">Do this immediately</p>
          <ol className="space-y-3 ml-4">
            {claimSteps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4">
            <strong className="text-[#F5F0E8]">Important:</strong> Emergency tarping to prevent
            further damage is generally covered as part of your claim. Get receipts and document
            why it was necessary.
          </p>
        </section>

        {/* Temporary Repairs */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TEMPORARY REPAIRS YOU CAN DO SAFELY</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] text-[#FF6B00] font-mono tracking-widest uppercase mb-3">From the ground or interior only</p>
              <ul className="space-y-3">
                {safelyDo.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase mb-3">Do not</p>
              <ul className="space-y-3">
                {doNotDo.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#F5F0E8]/30 flex-shrink-0 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How Long Can You Wait */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW LONG CAN YOU WAIT?</h2>
          <div className="border border-[#FF6B00]/20 overflow-hidden">
            {waitTimes.map((row, i) => (
              <div
                key={row.situation}
                className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < waitTimes.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
              >
                <span className="text-xs text-[#F5F0E8] sm:w-48 flex-shrink-0">{row.situation}</span>
                <span className="text-xs text-[#FF6B00] font-mono font-bold sm:w-28 flex-shrink-0">{row.timing}</span>
                <span className="text-xs text-[#F5F0E8]/50">{row.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Storm Chasers */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FINDING RELIABLE HELP VS STORM CHASERS</h2>
          <p>
            After major Columbus storms, door-to-door contractors flood the area. In an emergency
            you&apos;re more vulnerable to making a bad decision fast.
          </p>
          <p className="mt-3 mb-4">Quick verification steps even in an emergency:</p>
          <ul className="space-y-3">
            {verificationSteps.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">ROOFING CONTRACTOR IN COLUMBUS?</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo delivers weekly storm damage leads for Columbus and Franklin County —
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
                q: "Does homeowners insurance cover emergency roof repairs in Columbus?",
                a: "Storm-caused damage is typically covered minus your deductible. Wear and age-related failures are generally not. Emergency tarping to prevent further damage is usually reimbursable — document everything.",
              },
              {
                q: "How fast can a Columbus roofer respond to an emergency?",
                a: "Same-day tarping is available from most larger Columbus roofing companies. Full repair or replacement scheduling depends on their current backlog — after major storms, expect a 2–6 week wait for full replacement even with emergency status.",
              },
              {
                q: "What's the difference between emergency repair and full replacement?",
                a: "Emergency repair stops immediate water intrusion — tarping, patching, or flashing repair. Full replacement addresses the underlying condition. Many Columbus homeowners do emergency repair immediately then schedule full replacement within 30–90 days.",
              },
              {
                q: "Should I tarp my own roof?",
                a: "Only if you have roofing experience and proper safety equipment. Falls from roofs are a leading cause of home accident fatalities. The cost of professional tarping ($200–$500) is worth it versus the risk.",
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
            See storm damage data for Columbus and Franklin County →
          </Link>
        </p>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/roof-replacement-cost-columbus-oh" className="hover:text-[#FF6B00] transition-colors">
            Roof Replacement Cost in Columbus OH →
          </Link>
        </nav>
      </div>
    </article>
  );
}
