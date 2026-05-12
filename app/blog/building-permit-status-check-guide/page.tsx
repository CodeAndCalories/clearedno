import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Building Permit Status Check — How to Find Any Permit in the Midwest | ClearedNo",
  description:
    "How to check building permit status in any Midwest city. Free lookup tools for Ohio, Illinois, Indiana, Michigan, Kentucky, and Pennsylvania by address or permit number.",
  keywords: [
    "building permit status check",
    "check building permit status online",
    "Midwest permit lookup",
    "Ohio building permit status",
    "Illinois building permit lookup",
    "Indiana permit status",
    "Michigan building permit",
    "Pennsylvania permit status check",
    "find building permit by address",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/building-permit-status-check-guide" },
  openGraph: {
    title: "Building Permit Status Check — How to Find Any Permit in the Midwest",
    description:
      "Free lookup tools for Ohio, Illinois, Indiana, Michigan, Kentucky, and Pennsylvania by address or permit number.",
    url: "https://www.clearedno.com/blog/building-permit-status-check-guide",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Building Permit Status Check — How to Find Any Permit in the Midwest",
  description:
    "How to check building permit status in any Midwest city. Free lookup tools for Ohio, Illinois, Indiana, Michigan, Kentucky, and Pennsylvania by address or permit number.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-12",
  dateModified: "2026-05-12",
};

const CONTRACTOR_REASONS = [
  "Know when inspections pass so next trades can mobilize",
  "Catch holds or failures before showing up on site",
  "Track subcontractor permits on your projects",
  "Never miss a permit expiration that could stall a job",
];

const HOMEOWNER_REASONS = [
  "Verify contractors pulled permits before paying final invoice",
  "Check permit history before buying a property",
  "Track your own renovation progress",
];

const REALTOR_REASONS = [
  "Identify open permits that could complicate closings",
  "Verify work was properly permitted before listing",
];

const OHIO_CITIES = [
  {
    city: "Columbus",
    portal: "permits.columbus.gov",
    details:
      "Franklin County's most comprehensive portal. Search by address, permit number, or contractor. Shows all permits and inspections for any Columbus address going back 10+ years. Updates within 24 hours of any status change.",
    sees: "Application date, approval date, inspection history, current status, assigned inspector, and any holds or violations.",
  },
  {
    city: "Cleveland",
    portal: "City of Cleveland ePlans portal",
    details:
      "Cuyahoga County's system is split between Cleveland city and surrounding suburbs. For suburban properties (Parma, Lakewood, Euclid), check individual city portals.",
    sees: null,
  },
  {
    city: "Cincinnati",
    portal: "development.cincinnati-oh.gov",
    details:
      "Search by permit number or parcel ID. Cincinnati city permits and Hamilton County permits are separate — verify jurisdiction before searching.",
    sees: null,
  },
  {
    city: "Akron",
    portal: "City of Akron Building Department",
    details:
      "Summit County portal available online. Search by address or permit number. Summit County covers Cuyahoga Falls, Stow, and other surrounding municipalities on a separate system.",
    sees: null,
  },
  {
    city: "Toledo",
    portal: "City of Toledo One Stop Shop",
    details:
      "Lucas County portal for Toledo and surrounding areas. Search by address. Northwest Ohio's most active construction market after Columbus.",
    sees: null,
  },
  {
    city: "Dayton",
    portal: "City of Dayton Permit Center",
    details:
      "Montgomery County handles Dayton and surrounding municipalities. Search online by address or permit number.",
    sees: null,
  },
];

const ILLINOIS_CITIES = [
  {
    city: "Chicago",
    portal: "chicago.gov/buildings",
    details:
      "The gold standard of municipal permit portals. Search any Chicago address and see complete permit and inspection history going back decades. Updates in real time. Covers all of Chicago city limits.",
    note: "For collar counties (Cook County suburbs, DuPage, Lake, Will, Kane), each municipality has its own system.",
  },
  {
    city: "Rockford",
    portal: "City of Rockford Building Department",
    details: "Winnebago County portal available for Rockford and surrounding areas. Search by address or permit number.",
    note: null,
  },
  {
    city: "Springfield",
    portal: "City of Springfield Building and Zoning",
    details:
      "Sangamon County handles Springfield and surrounding municipalities. Online portal available for status checks.",
    note: null,
  },
];

const CHICAGO_SUBURBS = [
  { name: "Naperville", dept: "City of Naperville Building Services" },
  { name: "Aurora", dept: "City of Aurora Building Department" },
  { name: "Joliet", dept: "City of Joliet Building Division" },
  { name: "Schaumburg", dept: "Village of Schaumburg Building Division" },
  { name: "Arlington Heights", dept: "Village of Arlington Heights" },
];

const INDIANA_CITIES = [
  {
    city: "Indianapolis",
    portal: "indy.gov eGov",
    details:
      "Marion County's comprehensive portal. Search by address or permit number. Indianapolis-Marion County's consolidated government means one portal covers most of the metro.",
  },
  {
    city: "Fort Wayne",
    portal: "City of Fort Wayne Building Commission",
    details:
      "Allen County portal available for Fort Wayne and surrounding municipalities. Online search by address or permit number.",
  },
  {
    city: "South Bend",
    portal: "St. Joseph County Building Department",
    details:
      "Covers South Bend and surrounding St. Joseph County municipalities. Search by permit number.",
  },
  {
    city: "Evansville",
    portal: "City of Evansville",
    details:
      "Vanderburgh County portal available online. Search by address or permit number.",
  },
];

const MICHIGAN_CITIES = [
  {
    city: "Detroit",
    portal: "BSEED Portal",
    details:
      "Detroit's Buildings, Safety Engineering, and Environmental Department portal. Search by address. Suburban Oakland, Macomb, and Wayne County municipalities have separate systems.",
  },
  {
    city: "Grand Rapids",
    portal: "City of Grand Rapids Building Safety",
    details:
      "Kent County's most active construction market. Online portal search by address or permit number. Updates within 24 hours.",
  },
  {
    city: "Lansing",
    portal: "City of Lansing Building Safety Office",
    details: "Ingham County portal for Lansing and East Lansing. Search by address.",
  },
  {
    city: "Ann Arbor",
    portal: "City of Ann Arbor",
    details:
      "Washtenaw County's most active market. Online permit portal with full inspection history.",
  },
];

const KENTUCKY_CITIES = [
  {
    city: "Louisville",
    portal: "Louisville Metro One Stop Shop",
    details:
      "Jefferson County's comprehensive portal. Louisville Metro's consolidated government means one portal covers most of the metro area. Search by address or permit number.",
  },
  {
    city: "Lexington",
    portal: "lfucg.com",
    details:
      "Lexington-Fayette Urban County Government portal. Search by address or permit number. Lexington's growing construction market makes this a busy portal.",
  },
];

const PENNSYLVANIA_CITIES = [
  {
    city: "Philadelphia",
    portal: "eclipse.phila.gov",
    details:
      "One of the country's best municipal permit portals. Real-time updates, full inspection history, contractor information, and document access all from one portal. Search by address or permit number.",
  },
  {
    city: "Pittsburgh",
    portal: "pittsburghpa.gov/pli",
    details:
      "Allegheny County's portal for Pittsburgh and surrounding municipalities (PLI — Permits, Licenses, and Inspections). Search by address or permit number. Full inspection history available.",
  },
  {
    city: "Allentown",
    portal: "City of Allentown Bureau of Inspections",
    details: "Lehigh County portal for Allentown and surrounding areas.",
  },
];

const STATUS_PAGE_FIELDS = [
  {
    field: "Permit number",
    meaning: "Your reference number for all communications with the building department",
  },
  {
    field: "Status",
    meaning: "Current stage (applied, approved, under inspection, final, expired)",
  },
  {
    field: "Issue date",
    meaning: "When the permit was approved and work authorized to begin",
  },
  {
    field: "Expiration date",
    meaning: "When the permit expires if work isn't completed — critical to watch",
  },
  {
    field: "Inspection history",
    meaning: "Every inspection, who conducted it, result (pass/fail), and date",
  },
  {
    field: "Violations",
    meaning: "Any active violations associated with the permit or address",
  },
  {
    field: "Contractor",
    meaning: "Who pulled the permit — useful for verifying your contractor is legitimate",
  },
];

const NOT_FOUND_STEPS = [
  "Try the county system if city search shows nothing — jurisdiction matters",
  'Search by address instead of permit number — or vice versa',
  'Try alternate address formats — "St" vs "Street," numbered vs spelled-out streets',
  "Call the building department directly — older permits may not be in online systems",
  "Check if work was done without a permit — unfortunately common, creates problems at resale",
];

const FAQS = [
  {
    q: "Are building permits public record?",
    a: "Yes — in all 50 states, building permits are public records. Anyone can look up permit status for any address. Some portals require creating a free account; most are fully open.",
  },
  {
    q: "How current is permit status information?",
    a: "Most modern portals update within 24 hours of any status change. Some real-time systems (Philadelphia, Chicago) update immediately. Older systems may lag 48–72 hours.",
  },
  {
    q: "Can I look up permits for a house I'm buying?",
    a: "Yes — permit history is important due diligence before purchasing. Look for open permits (seller's responsibility to close), unpermitted work (liability risk), and failed inspections that were never resolved.",
  },
  {
    q: "How long are building permits valid?",
    a: "Typically 180 days from issuance in most Midwest jurisdictions, with renewals available. Permits can also expire if no inspection activity occurs within 180 days. Always check expiration dates on active permits.",
  },
  {
    q: "What if a permit shows as expired but work was completed?",
    a: "Contact the building department to request a final inspection and close out the permit. Expired permits with completed work are common and usually resolvable — but do it before the property sells.",
  },
];

function StateSection({
  state,
  cities,
  children,
}: {
  state: string;
  cities: { city: string; portal: string; details: string; note?: string | null; sees?: string | null }[];
  children?: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">{state} PERMIT STATUS LOOKUP</h2>
      <div className="space-y-6">
        {cities.map((c) => (
          <div key={c.city} className="border-l-2 border-[#FF6B00]/20 pl-4">
            <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mb-1">{c.city.toUpperCase()}</h3>
            <p className="text-[9px] tracking-[0.2em] text-[#FF6B00]/70 uppercase font-mono mb-2">{c.portal}</p>
            <p>{c.details}</p>
            {c.sees && (
              <p className="mt-2">
                <strong className="text-[#F5F0E8]">What you&apos;ll see:</strong> {c.sees}
              </p>
            )}
            {c.note && <p className="mt-2 text-[#F5F0E8]/50 text-xs">{c.note}</p>}
          </div>
        ))}
      </div>
      {children}
    </section>
  );
}

export default function BuildingPermitStatusCheckGuidePost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">OH · IL · IN · MI · KY · PA</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 11 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          BUILDING PERMIT STATUS CHECK — HOW TO FIND ANY PERMIT IN THE MIDWEST
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Whether you&apos;re a contractor tracking an active job or a homeowner checking on a
          neighbor&apos;s renovation, building permit status is public information. This guide
          covers every major Midwest city and how to look up permit status for free.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Why it matters */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY PERMIT STATUS MATTERS</h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {[
              { label: "For contractors", items: CONTRACTOR_REASONS },
              { label: "For homeowners", items: HOMEOWNER_REASONS },
              { label: "For real estate professionals", items: REALTOR_REASONS },
            ].map(({ label, items }) => (
              <div key={label} className="border border-[#FF6B00]/15 p-4">
                <p className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono mb-3">{label}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs">
                      <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Ohio */}
        <StateSection state="OHIO" cities={OHIO_CITIES} />

        {/* Illinois */}
        <StateSection state="ILLINOIS" cities={ILLINOIS_CITIES}>
          <div className="mt-5 border border-[#FF6B00]/10 p-4">
            <p className="text-[9px] tracking-[0.25em] text-[#FF6B00]/70 uppercase font-mono mb-3">Chicago suburbs — each has its own portal</p>
            <ul className="space-y-2">
              {CHICAGO_SUBURBS.map((s) => (
                <li key={s.name} className="flex gap-3 text-xs">
                  <span className="text-[#FF6B00] flex-shrink-0">■</span>
                  <div>
                    <strong className="text-[#F5F0E8]">{s.name}:</strong>{" "}
                    <span className="text-[#F5F0E8]/50">{s.dept}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[#F5F0E8]/40">
              For any suburb not listed, search &ldquo;[suburb name] building permit status&rdquo; for the direct portal link.
            </p>
          </div>
        </StateSection>

        {/* Indiana */}
        <StateSection state="INDIANA" cities={INDIANA_CITIES} />

        {/* Michigan */}
        <StateSection state="MICHIGAN" cities={MICHIGAN_CITIES} />

        {/* Kentucky */}
        <StateSection state="KENTUCKY" cities={KENTUCKY_CITIES} />

        {/* Pennsylvania */}
        <StateSection state="PENNSYLVANIA" cities={PENNSYLVANIA_CITIES} />

        {/* How to read a status page */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO READ A PERMIT STATUS PAGE</h2>
          <p>
            Most portals show similar information regardless of city. Here&apos;s what each field means
            and what to watch for:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-8 whitespace-nowrap">Field</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">What It Means</th>
                </tr>
              </thead>
              <tbody>
                {STATUS_PAGE_FIELDS.map((row) => (
                  <tr key={row.field} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-8 text-[#F5F0E8] font-mono whitespace-nowrap">{row.field}</td>
                    <td className="py-3 text-[#F5F0E8]/60">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            The two fields to watch most closely are <strong className="text-[#F5F0E8]">expiration date</strong>{" "}
            and <strong className="text-[#F5F0E8]">violations</strong>. An expiring permit that isn&apos;t
            renewed pauses the entire job. An active violation can hold up a final inspection indefinitely.
          </p>
        </section>

        {/* Can't find */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT TO DO IF YOU CAN&apos;T FIND A PERMIT</h2>
          <p>
            If a permit search comes up empty, work through these steps in order before assuming
            the work was unpermitted:
          </p>
          <ul className="space-y-3 mt-4 ml-4">
            {NOT_FOUND_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            If steps 1–4 come up empty, the work may genuinely be unpermitted. This is common
            on older properties and in jurisdictions with limited enforcement. Unpermitted work
            discovered at resale or refinance typically requires retroactive permitting and
            inspection — sometimes demolition if the work can&apos;t be inspected as-built.
          </p>
        </section>

        {/* Multi-permit tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING MULTIPLE PERMITS WITHOUT LOSING YOUR MIND</h2>
          <p>
            Contractors managing multiple active jobs across different cities face a real operational
            problem: each city has a different portal, different login, different format. Checking
            10 active permits means 10 separate website visits every morning — and missing a status
            change by even a day can delay a trade or let a permit expire.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker centralizes permit monitoring. Enter your permit numbers
            once — the system checks status automatically and sends email alerts when anything changes.
            Passed inspection, failed inspection, hold, expiration warning — you find out the same day,
            not the next time you remember to check.
          </p>
          <p className="mt-3">
            Most contractors who use it recover 30–60 minutes per day that was previously spent on
            manual status checks. On a 10-job pipeline, that compounds fast.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">MONITOR ALL YOUR PERMITS FROM ONE PLACE</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your permits across Ohio, Illinois, Indiana, Michigan, Kentucky, and
            Pennsylvania automatically. Enter permit numbers once — get email alerts the moment
            any status changes. No more morning portal rounds. First month free.
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
          <Link href="/blog/how-to-check-building-inspection-status" className="hover:text-[#FF6B00] transition-colors">
            ← How to Check Building Inspection Status (OH, TX, IL, PA)
          </Link>
          <Link href="/blog/contractor-permit-tracking-multiple-jobs" className="hover:text-[#FF6B00] transition-colors">
            Tracking Permits Across Multiple Jobs →
          </Link>
        </nav>
      </div>
    </article>
  );
}
