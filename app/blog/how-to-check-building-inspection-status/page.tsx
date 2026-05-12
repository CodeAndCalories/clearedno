import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check Building Inspection Status Online (OH, TX, IL, PA) | ClearedNo",
  description:
    "Check building inspection status online in Ohio, Texas, Illinois, and Pennsylvania. Free lookup tools by city, what each status means, and how contractors track multiple permits automatically.",
  keywords: [
    "check building inspection status online",
    "building inspection status lookup",
    "permit inspection status Ohio",
    "permit inspection status Texas",
    "permit inspection status Illinois",
    "permit inspection status Pennsylvania",
    "how to check inspection status",
    "building permit inspection passed failed",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/how-to-check-building-inspection-status" },
  openGraph: {
    title: "How to Check Building Inspection Status Online (OH, TX, IL, PA)",
    description:
      "Free lookup tools by city, what each status means, and how contractors track multiple permits automatically.",
    url: "https://www.clearedno.com/blog/how-to-check-building-inspection-status",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Check Building Inspection Status Online (OH, TX, IL, PA)",
  description:
    "Check building inspection status online in Ohio, Texas, Illinois, and Pennsylvania. Free lookup tools by city, what each status means, and how contractors track multiple permits automatically.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-12",
  dateModified: "2026-05-12",
};

const STATUSES = [
  { status: "Scheduled", meaning: "Inspection booked — waiting for inspector visit" },
  { status: "Passed", meaning: "Inspector approved the work — you're clear to proceed" },
  { status: "Failed", meaning: "Inspector found issues — corrections required before re-inspection" },
  { status: "Pending", meaning: "Submitted but not yet scheduled" },
  { status: "Partial Pass", meaning: "Some items approved, others need correction" },
  { status: "Final", meaning: "All inspections complete, permit closed out" },
  { status: "Hold", meaning: "Inspection paused — usually missing documentation or fee" },
];

const OHIO_CITIES = [
  {
    city: "Columbus",
    portal: "permits.columbus.gov",
    searchBy: "Address, permit number, or contractor name",
    updateFreq: "Within 24 hours of inspection",
    notes:
      "Columbus Building Services handles all city permits. Suburban cities (Dublin, Westerville, Hilliard) have separate portals.",
  },
  {
    city: "Cleveland",
    portal: "City of Cleveland ePlans portal",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes:
      "Cuyahoga County and Cleveland city permits are separate systems. Confirm which jurisdiction your property falls under.",
  },
  {
    city: "Cincinnati",
    portal: "development.cincinnati-oh.gov",
    searchBy: "Permit number or parcel ID",
    updateFreq: "—",
    notes:
      "Cincinnati city permits vs Hamilton County permits are different. Most city properties go through Cincinnati's system.",
  },
  {
    city: "Akron",
    portal: "City of Akron Building Department online portal",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes: "Summit County has a separate system for unincorporated areas.",
  },
  {
    city: "Toledo",
    portal: "City of Toledo One Stop Shop",
    searchBy: "Address",
    updateFreq: "—",
    notes: "Lucas County properties outside Toledo city limits use the county system.",
  },
  {
    city: "Dayton",
    portal: "City of Dayton Permit Center",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes: "Montgomery County handles surrounding municipalities.",
  },
];

const TEXAS_CITIES = [
  {
    city: "Houston",
    portal: "houstonpermittingcenter.org",
    searchBy: "Address or permit number",
    updateFreq: "Same day as inspection",
    notes:
      "Houston's permitting center is one of the most comprehensive in Texas — full inspection history available online.",
  },
  {
    city: "Austin",
    portal: "abc.austintexas.gov",
    searchBy: "Address, permit number, or project name",
    updateFreq: "24–48 hours",
    notes:
      "Austin's portal shows full inspection history and upcoming scheduled inspections. One of the better portals in Texas.",
  },
  {
    city: "Dallas",
    portal: "dallascityhall.com — Development Services",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes:
      "Dallas has multiple inspection types — building, electrical, mechanical, plumbing all tracked separately.",
  },
  {
    city: "San Antonio",
    portal: "San Antonio Development Services",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes:
      "Bexar County has a separate system for properties outside San Antonio city limits.",
  },
  {
    city: "Fort Worth",
    portal: "City of Fort Worth Development Services",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes: "Tarrant County properties use a different system than Fort Worth city.",
  },
];

const ILLINOIS_CITIES = [
  {
    city: "Chicago",
    portal: "chicago.gov/buildings",
    searchBy: "Address",
    updateFreq: "Within 24 hours",
    notes:
      "Chicago's portal is comprehensive — shows all permits and inspections by address going back years. One of the best municipal portals in the country.",
  },
  {
    city: "Rockford",
    portal: "City of Rockford Building and Inspections",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes: "Winnebago County has a separate system.",
  },
  {
    city: "Springfield",
    portal: "City of Springfield Building and Zoning",
    searchBy: "Address",
    updateFreq: "—",
    notes: "Sangamon County handles surrounding areas.",
  },
  {
    city: "Naperville / Aurora / Joliet",
    portal: "Each city has its own portal",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes:
      'Search "[city name] building permit inspection status" for the direct link. DuPage County covers many Naperville-area unincorporated properties.',
  },
];

const PENNSYLVANIA_CITIES = [
  {
    city: "Philadelphia",
    portal: "eclipse.phila.gov",
    searchBy: "Address or permit number",
    updateFreq: "Real-time",
    notes:
      "Philadelphia's eCLIPSE system is one of the most advanced municipal portals in the country. Full inspection history, scheduled inspections, and contractor information all visible.",
  },
  {
    city: "Pittsburgh",
    portal: "pittsburghpa.gov/pli",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes:
      "Pittsburgh PLI (Permits, Licenses, and Inspections). Allegheny County has a separate system for municipalities outside Pittsburgh.",
  },
  {
    city: "Allentown",
    portal: "City of Allentown Bureau of Inspections",
    searchBy: "Permit number",
    updateFreq: "—",
    notes: "Lehigh County handles surrounding municipalities.",
  },
  {
    city: "Erie",
    portal: "City of Erie Bureau of Building Inspection",
    searchBy: "Address or permit number",
    updateFreq: "—",
    notes: "—",
  },
];

const FAQS = [
  {
    q: "How long does a building inspection take to schedule?",
    a: "Typically 3–10 business days depending on city and current backlog. Chicago, Houston, and Columbus tend to run longer during peak construction season (May–September).",
  },
  {
    q: "Can I check inspection status without the permit number?",
    a: "Yes — most portals allow address-based search. The address lookup often shows all permits and inspections for that property.",
  },
  {
    q: "What if my inspector doesn't show up for a scheduled inspection?",
    a: "Call the building department immediately and document the missed appointment. You're entitled to reschedule at no additional cost. This happens more often during peak season.",
  },
  {
    q: "How long is a building permit valid in Ohio, Texas, Illinois, and Pennsylvania?",
    a: "Most jurisdictions: 180 days from issuance, with extensions available. Work must start within 6 months and inspections must progress regularly. Permits can expire if work stalls — contact your building department before the expiration date.",
  },
  {
    q: "Is there a way to get inspection status by text or email automatically?",
    a: "Most city portals don't offer automatic notifications. ClearedNo's Permit Tracker sends email alerts automatically when any permit status changes — contractors use it to eliminate daily manual checking.",
  },
];

function CityTable({ cities }: { cities: typeof OHIO_CITIES }) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#FF6B00]/30">
            <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-4 whitespace-nowrap">City</th>
            <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-4 whitespace-nowrap">Portal</th>
            <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-4 whitespace-nowrap">Search By</th>
            <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-4 whitespace-nowrap">Updates</th>
            <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((row) => (
            <tr key={row.city} className="border-b border-[#FF6B00]/10">
              <td className="py-3 pr-4 text-[#F5F0E8] font-mono whitespace-nowrap">{row.city}</td>
              <td className="py-3 pr-4 text-[#F5F0E8]/60">{row.portal}</td>
              <td className="py-3 pr-4 text-[#F5F0E8]/60 whitespace-nowrap">{row.searchBy}</td>
              <td className="py-3 pr-4 text-[#F5F0E8]/60 whitespace-nowrap">{row.updateFreq}</td>
              <td className="py-3 text-[#F5F0E8]/50">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BuildingInspectionStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">OH · TX · IL · PA</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 10 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOW TO CHECK BUILDING INSPECTION STATUS ONLINE (OH, TX, IL, PA)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          If you&apos;re a contractor or homeowner waiting on a building inspection, knowing the current
          status before you show up on site saves time and prevents costly delays. This guide covers
          every major city across Ohio, Texas, Illinois, and Pennsylvania.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Status definitions */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT BUILDING INSPECTION STATUS MEANS</h2>
          <p>
            When you look up a permit, you&apos;ll typically see one of these statuses. The exact
            wording varies by city, but the meanings are consistent across most portals:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-8 whitespace-nowrap">Status</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">What It Means</th>
                </tr>
              </thead>
              <tbody>
                {STATUSES.map((row) => (
                  <tr key={row.status} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-8 text-[#F5F0E8] font-mono whitespace-nowrap">{row.status}</td>
                    <td className="py-3 text-[#F5F0E8]/60">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            The statuses that require immediate action are <strong className="text-[#F5F0E8]">Failed</strong>,{" "}
            <strong className="text-[#F5F0E8]">Hold</strong>, and{" "}
            <strong className="text-[#F5F0E8]">Partial Pass</strong>. Each of these blocks your
            project from moving forward until resolved. A{" "}
            <strong className="text-[#F5F0E8]">Pending</strong> status that&apos;s more than
            two weeks old is also worth a phone call to the building department.
          </p>
        </section>

        {/* Ohio */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">OHIO BUILDING INSPECTION STATUS</h2>
          <p>
            Ohio has one of the more fragmented permit systems in the Midwest — cities, counties,
            and townships each maintain their own portals. The lookup that works for a Columbus
            project won&apos;t work for a Hilliard project three miles away. Here&apos;s how each
            major Ohio city is organized.
          </p>
          <CityTable cities={OHIO_CITIES} />
          <p className="mt-4">
            <strong className="text-[#F5F0E8]">One consistent rule across all Ohio jurisdictions:</strong>{" "}
            before searching, confirm whether your property is within a city&apos;s incorporated limits
            or in unincorporated county territory. The county auditor&apos;s parcel search is the
            fastest way to confirm — most Ohio counties have one at{" "}
            <span className="text-[#F5F0E8]/80">[county]auditor.org</span>.
          </p>
        </section>

        {/* Texas */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TEXAS BUILDING INSPECTION STATUS</h2>
          <p>
            Texas cities generally have better-funded and more modern permitting portals than the
            national average. Houston and Austin in particular have invested heavily in online
            systems. The main fragmentation issue in Texas is county vs. city jurisdiction — suburban
            growth areas are often technically unincorporated county land.
          </p>
          <CityTable cities={TEXAS_CITIES} />
          <p className="mt-4">
            Texas has no statewide building code — each city adopts its own version of the
            International codes, often with local amendments. That means inspection requirements
            and what&apos;s flagged as a failure can vary even between neighboring cities. If you
            work across DFW or Houston&apos;s suburbs, this matters.
          </p>
        </section>

        {/* Illinois */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">ILLINOIS BUILDING INSPECTION STATUS</h2>
          <p>
            Illinois has stark contrast between Chicago — which has one of the most advanced
            municipal permit portals in the country — and downstate cities that often rely on
            phone-based inspection scheduling and status updates.
          </p>
          <CityTable cities={ILLINOIS_CITIES} />
          <p className="mt-4">
            Chicago&apos;s portal at <strong className="text-[#F5F0E8]">chicago.gov/buildings</strong> is
            worth highlighting specifically: searching by address returns a complete history of every
            permit ever pulled on that property, every inspection result, every violation, and any
            active complaints. It&apos;s unusually comprehensive and frequently updated. For any
            project within Chicago city limits, this should be your first stop.
          </p>
        </section>

        {/* Pennsylvania */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PENNSYLVANIA BUILDING INSPECTION STATUS</h2>
          <p>
            Pennsylvania&apos;s permit landscape is fragmented at the municipal level — the state has
            over 2,500 municipalities, many with independent building departments. Philadelphia and
            Pittsburgh are well-digitized. Mid-sized cities like Allentown and Erie have functional
            portals. Smaller municipalities often require a phone call.
          </p>
          <CityTable cities={PENNSYLVANIA_CITIES} />
          <p className="mt-4">
            Philadelphia&apos;s <strong className="text-[#F5F0E8]">eCLIPSE system</strong> at{" "}
            <strong className="text-[#F5F0E8]">eclipse.phila.gov</strong> is one of the best in the
            country — real-time updates, full inspection history, contractor information,
            and scheduled inspection details all visible without an account. If you work in
            Philadelphia, bookmark it.
          </p>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON INSPECTION STATUS PROBLEMS — AND HOW TO FIX THEM</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">&ldquo;INSPECTION FAILED&rdquo; — WHAT NOW?</h3>
          <ul className="space-y-3 ml-4">
            {[
              "Review the correction notice — inspectors leave written documentation of every failed item.",
              "Make required corrections.",
              "Request re-inspection through the same portal or by calling the building department.",
              "Most cities schedule re-inspections within 3–7 business days.",
              "Some cities charge a re-inspection fee — typically $50–$150.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">&ldquo;INSPECTION PENDING&rdquo; FOR MORE THAN 2 WEEKS</h3>
          <p>
            Call the building department directly. Sometimes inspections get lost in the scheduling
            queue, especially during busy permit seasons (spring and summer). A phone call usually
            resolves it same day.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">CAN&apos;T FIND YOUR PERMIT ONLINE</h3>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              "Search by address instead of permit number.",
              "Try the county system if the city search comes up empty.",
              "Call the building department — some older permits aren't in online systems.",
              "Ask your contractor for the exact permit number as issued.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">&ldquo;HOLD&rdquo; STATUS</h3>
          <p>Usually means one of:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Outstanding fee not paid",
              "Missing required documentation",
              "Stop work order issued",
              "Inspection prerequisite not completed (e.g. rough-in before framing inspection)",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Call the department that issued the hold to resolve — these don&apos;t clear automatically.
          </p>
        </section>

        {/* Multi-permit tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW CONTRACTORS TRACK MULTIPLE PERMITS ACROSS CITIES</h2>
          <p>
            If you&apos;re managing permits across multiple projects and cities, checking each portal
            individually every day adds up to hours per week. Houston uses a different URL than
            Austin. Chicago&apos;s search UI is completely different from Columbus&apos;s. Philadelphia
            has its own system. None of them talk to each other.
          </p>
          <p className="mt-3">
            The only practical solution at scale is a single dashboard that monitors all of them
            and notifies you when anything changes. That&apos;s what ClearedNo&apos;s Permit Tracker
            does — enter your permit numbers once, get email alerts the moment any status changes
            across any supported city.
          </p>
          <p className="mt-3">Contractors use it to:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              "Know immediately when an inspection passes so the next trade can schedule",
              "Catch failed inspections before showing up on site",
              "Track subcontractor permits on their projects",
              "Never miss a permit expiration",
            ].map((item) => (
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
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">STOP CHECKING PORTALS EVERY MORNING</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors your permits across Ohio, Texas, Illinois, and Pennsylvania automatically.
            The second any inspection status changes — passed, failed, or put on hold — you get an email.
            No more logging into five different portals. First month free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              START TRACKING FREE →
            </Link>
            <Link
              href="/#check-permit"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              CHECK A PERMIT NOW (FREE)
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
          <Link href="/blog/permit-status-pending-what-it-means" className="hover:text-[#FF6B00] transition-colors">
            Permit Status Pending: What It Means →
          </Link>
        </nav>
      </div>
    </article>
  );
}
