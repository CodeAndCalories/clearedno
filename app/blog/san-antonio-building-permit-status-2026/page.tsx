import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "San Antonio Building Permit Status — How to Check in 2026 | ClearedNo",
  description:
    "Check San Antonio building permit status online in 2026. Search by address or permit number, understand Bexar County vs city permits, and track automatically.",
  keywords: [
    "San Antonio building permit status",
    "San Antonio permit status check 2026",
    "check San Antonio permit online",
    "sanantonio.gov DSD permit lookup",
    "Bexar County building permit",
    "San Antonio Development Services permit",
    "San Antonio contractor permit tracking",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/san-antonio-building-permit-status-2026" },
  openGraph: {
    title: "San Antonio Building Permit Status — How to Check in 2026",
    description:
      "Check San Antonio building permit status online in 2026. Search by address or permit number, understand Bexar County vs city permits, and track automatically.",
    url: "https://www.clearedno.com/blog/san-antonio-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "San Antonio Building Permit Status — How to Check in 2026",
  description:
    "Check San Antonio building permit status online in 2026. Search by address or permit number, understand Bexar County vs city permits, and track automatically.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-13",
  dateModified: "2026-05-13",
};

const STATUSES = [
  { status: "Applied", meaning: "Application submitted, under review", next: "Wait for plan review" },
  { status: "Approved", meaning: "Permit issued, work authorized", next: "Start construction" },
  { status: "Inspection Requested", meaning: "Inspection scheduled", next: "Wait for inspector" },
  { status: "Inspection Passed", meaning: "Work approved at this stage", next: "Proceed to next phase" },
  { status: "Inspection Failed", meaning: "Corrections required", next: "Fix issues, request re-inspection" },
  { status: "Certificate Issued", meaning: "Final approval, project complete", next: "Project closed" },
  { status: "Expired", meaning: "Permit lapsed without final", next: "Renew or re-apply" },
  { status: "On Hold", meaning: "Action required", next: "Contact Development Services" },
];

const ROOFING_STAGES = [
  "Application submitted online or in person",
  "Application reviewed and approved (2–5 business days for simple re-roofs)",
  "Work completed",
  "Final inspection requested",
  "Final inspection passed — certificate of completion issued",
];

const NEW_CONSTRUCTION_STAGES = [
  "Site plan review and approval",
  "Foundation permit and inspection",
  "Framing inspection",
  "Rough mechanical (electrical, plumbing, HVAC) inspections",
  "Insulation inspection",
  "Final inspection and certificate of occupancy",
];

const CONTRACTOR_USES = [
  "Get notified immediately when inspections pass (so the next trade can mobilize)",
  "Catch holds and HDRC flags before they stall a project",
  "Never miss a permit expiration across multiple active jobs",
  "Track permits in both San Antonio city limits and Bexar County",
];

const HISTORIC_DISTRICTS = [
  "King William Historic District",
  "Tobin Hill Historic District",
  "Monte Vista Historic District",
  "Lavaca Historic District",
  "Government Hill Historic District",
  "Highland Park Historic District",
];

const FAQS = [
  {
    q: "How long does a San Antonio building permit take?",
    a: "Residential roofing: 2–5 business days. New residential construction: 10–20 business days. Commercial projects: 30–90+ business days. Projects in historic districts add 2–6 weeks for HDRC review.",
  },
  {
    q: "Does San Antonio have express permitting?",
    a: "Yes — qualifying residential projects can use express review for faster approval. Ask about eligibility when submitting your application at Development Services.",
  },
  {
    q: "What's the difference between San Antonio and Bexar County permits?",
    a: "City of San Antonio permits cover properties within city limits. Bexar County Development Services handles properties in unincorporated areas outside city limits. Always verify jurisdiction before pulling a permit — the wrong one means starting over.",
  },
  {
    q: "Does San Antonio require permits for roofing?",
    a: "Yes — full roof replacements require a permit. Minor repairs under a certain value threshold may not, but full replacements always do. Check with Development Services if you're unsure whether your scope requires a permit.",
  },
  {
    q: "Can I check permit history for a property I'm buying?",
    a: "Yes — San Antonio permit records are public. Search by address at the Development Services portal at sanantonio.gov/DSD to see full permit history, open permits, and any code violations.",
  },
  {
    q: "What extra steps are required for historic district projects?",
    a: "Projects in San Antonio historic districts require review and approval from the Historic and Design Review Commission (HDRC) before a building permit is issued. HDRC adds 2–6 weeks to the approval timeline and has specific design standards for each district.",
  },
];

export default function SanAntonioPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">San Antonio, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 9 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          SAN ANTONIO BUILDING PERMIT STATUS — HOW TO CHECK IN 2026
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          San Antonio is one of Texas&apos;s fastest-growing cities — and its permitting system reflects
          that growth. Whether you&apos;re a contractor tracking an active job or a homeowner checking
          on a renovation, here&apos;s everything you need to know about San Antonio building permits
          in 2026.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SAN ANTONIO PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">sanantonio.gov/DSD — Development Services department</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Search by</span>
              <span className="text-[#F5F0E8]/80">Address or permit number</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Hours</span>
              <span className="text-[#F5F0E8]/80">Available 24/7 online</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Updates</span>
              <span className="text-[#F5F0E8]/80">Within 24 hours of status change</span>
            </div>
          </div>
          <p className="mt-4">
            Navigate to San Antonio&apos;s Development Services department online portal, click permit
            search, and enter your address or permit number. The portal shows all active and historical
            permits for the address, including inspection history and any holds.
          </p>
        </section>

        {/* City vs County */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SAN ANTONIO VS BEXAR COUNTY — WHICH SYSTEM?</h2>
          <p>
            San Antonio&apos;s city limits cover a large portion of Bexar County, but not all of it.
            Properties outside city limits fall under Bexar County jurisdiction — a completely separate
            permitting system with different fees, timelines, and inspection processes.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Jurisdiction split</p>
            <p>San Antonio city limits → Development Services at sanantonio.gov/DSD</p>
            <p>Bexar County (unincorporated) → Bexar County Development Services</p>
          </div>
          <p className="mt-4">
            Always confirm jurisdiction before pulling permits. The wrong jurisdiction means starting
            the application over — fees don&apos;t transfer and approval timelines restart from zero.
            San Antonio&apos;s GIS map on the city website can confirm whether a specific address
            falls inside or outside city limits.
          </p>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SAN ANTONIO PERMIT STATUSES</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Status</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6">Meaning</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Next Step</th>
                </tr>
              </thead>
              <tbody>
                {STATUSES.map((row) => (
                  <tr key={row.status} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono whitespace-nowrap">{row.status}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60">{row.meaning}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Permit types */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SAN ANTONIO PERMIT TYPES AND TIMELINES</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">RESIDENTIAL ROOFING</h3>
          <p>
            San Antonio sees significant storm activity — roofing permits are among the most common
            permit types and are processed relatively quickly compared to commercial work.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Typical stages:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {ROOFING_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-3 mt-4 ml-4">
            {[
              { type: "Simple re-roof", time: "2–5 business days" },
              { type: "Structural modifications", time: "7–14 business days" },
              { type: "Final inspection", time: "Required for all permitted work" },
            ].map((row) => (
              <li key={row.type} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{row.type}:</strong> {row.time}
                </div>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW RESIDENTIAL CONSTRUCTION</h3>
          <p>
            Bexar County&apos;s population growth drives high new construction volume across San Antonio.
            Multiple inspection stages are required and each must pass before proceeding:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {NEW_CONSTRUCTION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-3 mt-4 ml-4">
            {[
              { type: "Average approval timeline", time: "10–20 business days" },
              { type: "Express review", time: "Available for qualifying projects — can cut approval time in half" },
            ].map((row) => (
              <li key={row.type} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{row.type}:</strong> {row.time}
                </div>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">COMMERCIAL CONSTRUCTION</h3>
          <p>Commercial permitting in San Antonio runs significantly longer due to plan review and, for larger projects, fire marshal review:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              { type: "Minor improvements", time: "10–30 business days" },
              { type: "Major construction", time: "45–90+ business days" },
              { type: "Projects over certain thresholds", time: "Fire marshal review adds additional time" },
            ].map((row) => (
              <li key={row.type} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{row.type}:</strong> {row.time}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact info */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SAN ANTONIO DEVELOPMENT SERVICES — CONTACT</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>San Antonio Development Services</p>
            <p>1901 S. Alamo St, San Antonio, TX 78204</p>
            <p>Monday–Friday, 7:45am–4:30pm</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">sanantonio.gov/DSD</strong> — available 24/7 for status
            checks, document uploads, and inspection requests. The portal is the fastest way to check
            status and submit documentation outside of business hours.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PHONE</h3>
          <p>
            <strong className="text-[#F5F0E8]">(210) 207-1111</strong> — for status questions and
            permit inquiries. Calling early in the morning tends to reach staff faster.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Request inspections through the online portal. San Antonio requires advance notice for most
            inspections — same-day requests are not typically accommodated. Inspections are assigned
            by zone to the next available inspector.
          </p>
        </section>

        {/* Common permit issues */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON SAN ANTONIO PERMIT ISSUES IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">EXPRESS VS STANDARD REVIEW</h3>
          <p>
            San Antonio offers an express review option for qualifying residential projects. Express
            review can cut approval time in half — ask Development Services if your project qualifies
            when submitting. Not all project types are eligible; complex plans or those requiring
            multiple department sign-offs typically don&apos;t qualify.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">HISTORIC DISTRICTS</h3>
          <p>
            San Antonio has more historic district coverage than almost any other Texas city. Work in
            these districts requires approval from the Historic and Design Review Commission (HDRC)
            before a building permit can be issued — adding 2–6 weeks to the approval timeline.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Districts requiring HDRC review include:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {HISTORIC_DISTRICTS.map((district) => (
              <li key={district} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{district}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Check before applying:</strong> San Antonio&apos;s GIS
            map shows all historic district boundaries. Submitting a standard permit application for a
            historic district property will result in a hold until HDRC review is completed — better
            to know in advance and plan for the additional timeline.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">FLOOD ZONE REQUIREMENTS</h3>
          <p>
            San Antonio&apos;s location in Central Texas makes flood zone compliance critical. The city
            sits at the edge of Flash Flood Alley — one of the most flood-prone regions in the country.
            Properties in FEMA flood zones require additional documentation and review, including
            elevation certificates for new construction and substantial improvements.
          </p>
          <p className="mt-3">
            The 2021 floods highlighted flood zone compliance gaps — the city has tightened requirements
            since. Flood zone status isn&apos;t always obvious from an address alone. Check the FEMA
            Flood Map Service Center or San Antonio&apos;s flood map before starting the permit process.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            San Antonio permits expire if no inspection activity occurs within the permit&apos;s validity
            period. Projects that stall mid-construction — waiting on subcontractors, materials, or
            financing — risk permit expiration and the need to re-apply.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Watch for:</strong> Permits with no recent inspection
            activity. Set a calendar reminder well before expiration on any project where the pace of
            work is uncertain.
          </p>
        </section>

        {/* Hail and storm activity */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SAN ANTONIO HAIL AND STORM ACTIVITY</h2>
          <p>
            San Antonio and Bexar County sit in the Texas Hill Country transition zone — not as
            hail-active as DFW or the Central Texas corridor, but significant events do occur.
            Roofing contractors working the San Antonio market need to move quickly after storm events.
          </p>
          <p className="mt-3">
            The Hill Country&apos;s terrain can intensify storms moving from the west — events that
            look minor on radar sometimes produce significant damage on the ground. After any major
            event affecting Bexar County:
          </p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              "Permit applications spike across both city and county portals",
              "Development Services processing times extend during high-volume periods",
              "Contractors who submit earliest get earlier review slots",
              "Out-of-area storm chasers increase market competition immediately after the event",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING SAN ANTONIO PERMITS AUTOMATICALLY</h2>
          <p>
            For contractors managing multiple San Antonio permits, automatic tracking eliminates daily
            manual status checks. A contractor with active jobs across San Antonio city limits and
            Bexar County unincorporated areas is juggling two separate portals — plus the added
            complexity of any historic district projects requiring HDRC coordination.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker monitors your permits and sends email alerts when any
            status changes — inspection passes, failures, holds, or finals.
          </p>
          <p className="mt-3">Contractors use it to:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {CONTRACTOR_USES.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR SAN ANTONIO PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your San Antonio permits every 2 hours. The second an inspection passes,
            fails, or a hold lands — you get an email. Stop manually checking sanantonio.gov/DSD
            every morning. First month free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              START TRACKING FREE →
            </Link>
            <Link
              href="/"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              SAN ANTONIO PERMIT CHECKER →
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-6">FAQS</h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-l-2 border-[#FF6B00]/30 pl-4">
                <p className="font-mono text-xs tracking-widest text-[#F5F0E8] uppercase mb-2">{faq.q}</p>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog/average-permit-times-texas" className="hover:text-[#FF6B00] transition-colors">
            ← Average Permit Times in Texas 2026
          </Link>
          <Link href="/blog/dallas-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            Dallas Building Permit Status 2026 →
          </Link>
        </nav>
      </div>
    </article>
  );
}
