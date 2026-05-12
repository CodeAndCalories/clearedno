import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Building Permit Lookup by Address — Search Any City (2026) | ClearedNo",
  description:
    "Free building permit lookup by address in 2026. Find any permit, check inspection status, and verify contractor work in Ohio, Texas, Illinois, Michigan, and more.",
  keywords: [
    "free building permit lookup by address",
    "permit lookup by address",
    "building permit search by address",
    "free permit status check",
    "check permit history by address",
    "find building permit online free",
    "open permit lookup",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/free-permit-lookup-by-address" },
  openGraph: {
    title: "Free Building Permit Lookup by Address — Search Any City (2026)",
    description:
      "Find any permit, check inspection status, and verify contractor work in Ohio, Texas, Illinois, Michigan, and more.",
    url: "https://www.clearedno.com/blog/free-permit-lookup-by-address",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free Building Permit Lookup by Address — Search Any City (2026)",
  description:
    "Free building permit lookup by address in 2026. Find any permit, check inspection status, and verify contractor work in Ohio, Texas, Illinois, Michigan, and more.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-12",
  dateModified: "2026-05-12",
};

const GENERAL_STEPS = [
  "Find your city or county building department website",
  'Look for "Permit Search," "Permit Status," or "Online Services"',
  "Enter the property address",
  "Review all permits associated with that address",
];

const OHIO_CITIES = [
  {
    city: "Columbus",
    url: "permits.columbus.gov",
    searchBy: "Address or permit number",
    detail: "Columbus has one of Ohio's best online permit portals. Enter any Columbus address and see every permit pulled on that property going back years.",
    note: null,
  },
  {
    city: "Cleveland",
    url: "Cleveland Building Department portal",
    searchBy: "Address or permit number",
    detail: null,
    note: "Cleveland city limits vs Cuyahoga County are separate systems. Confirm your property's jurisdiction first.",
  },
  {
    city: "Cincinnati",
    url: "Hamilton County Building Inspections portal",
    searchBy: "Parcel ID or permit number",
    detail: null,
    note: "City of Cincinnati and Hamilton County have separate systems. Most Cincinnati city addresses use the city portal.",
  },
  {
    city: "Akron",
    url: "City of Akron Building Department",
    searchBy: "Address or permit number",
    detail: null,
    note: null,
  },
  {
    city: "Toledo / Lucas County",
    url: "City of Toledo One Stop Shop",
    searchBy: "Address",
    detail: null,
    note: null,
  },
  {
    city: "Dayton / Montgomery County",
    url: "City of Dayton Permit Center",
    searchBy: "Address or permit number",
    detail: null,
    note: null,
  },
];

const TEXAS_CITIES = [
  {
    city: "Houston",
    url: "houstonpermittingcenter.org",
    searchBy: "Address or permit number",
    detail: "Houston's portal is one of the best in the country. Every permit ever pulled on an address is visible — useful for property due diligence.",
    note: null,
  },
  {
    city: "Austin",
    url: "abc.austintexas.gov",
    searchBy: "Address, permit number, or project name",
    detail: null,
    note: "Full history, scheduled inspections, and documents available. One of the better Texas portals.",
  },
  {
    city: "Dallas",
    url: "dallascityhall.com — Development Services",
    searchBy: "Address or permit number",
    detail: null,
    note: "Dallas tracks building, electrical, mechanical, and plumbing permits separately.",
  },
  {
    city: "San Antonio",
    url: "San Antonio Development Services",
    searchBy: "Address or permit number",
    detail: null,
    note: null,
  },
  {
    city: "Fort Worth",
    url: "City of Fort Worth Development Services",
    searchBy: "Address or permit number",
    detail: null,
    note: null,
  },
];

const ILLINOIS_CITIES = [
  {
    city: "Chicago",
    url: "chicago.gov/buildings",
    searchBy: "Address",
    detail: "Decades of permit history, all inspections, violations, and contractor info — the most comprehensive municipal portal in Illinois.",
    note: null,
  },
  {
    city: "Rockford",
    url: "City of Rockford Building and Inspections",
    searchBy: "Address or permit number",
    detail: null,
    note: null,
  },
];

const CHICAGO_SUBURBS = ["Naperville", "Aurora", "Joliet", "Schaumburg"];

const MICHIGAN_CITIES = [
  { city: "Detroit", url: "Detroit BSEED portal", searchBy: "Address" },
  { city: "Grand Rapids", url: "City of Grand Rapids Building Safety portal", searchBy: "Address or permit number" },
  { city: "Lansing", url: "City of Lansing Building Safety Office", searchBy: "Address" },
];

const PENNSYLVANIA_CITIES = [
  {
    city: "Philadelphia",
    url: "eclipse.phila.gov",
    searchBy: "Address or permit number",
    detail: "Real-time status, full history, documents, and contractor info — one of the country's best portals.",
  },
  {
    city: "Pittsburgh",
    url: "pittsburghpa.gov/pli",
    searchBy: "Address or permit number",
    detail: null,
  },
];

const LOOKUP_USES = [
  {
    label: "Before buying a house",
    items: [
      "Were renovations properly permitted?",
      "Are there open permits the seller needs to close?",
      "Was there unpermitted work that creates liability?",
      "Did any inspections fail and never get resolved?",
    ],
  },
  {
    label: "As a homeowner",
    items: [
      "Verify your contractor pulled the permit they said they would",
      "Track inspection progress on your renovation",
      "Confirm final inspection passed before releasing final payment",
    ],
  },
  {
    label: "As a contractor",
    items: [
      "Verify your own permits are in good standing",
      "Check subcontractor permit status",
      "Identify permit expirations before they cause project delays",
    ],
  },
  {
    label: "As a real estate agent",
    items: [
      "Due diligence before listing",
      "Identify issues that need to be disclosed or resolved",
      "Verify seller's representations about work done",
    ],
  },
];

const OPEN_PERMIT_STEPS = [
  "Seller contacts the building department",
  "Final inspection is scheduled",
  "If work passes — permit closes",
  "If work fails — corrections required before final",
];

const OLDER_PERMIT_STEPS = [
  "Call the building department directly and request a permit history search by address",
  "Visit in person — most departments can print permit history from older systems",
  "Request records formally — permits are public records, departments must provide them",
  "Check with the county assessor — some counties maintain building improvement records",
];

const FAQS = [
  {
    q: "Is building permit information really free?",
    a: "Yes — building permits are public records in all 50 states. There is no legitimate reason to pay for basic permit status information. Be cautious of services that charge for permit lookups — the same information is available free from your local building department.",
  },
  {
    q: "Can I see who pulled a permit on a property?",
    a: "Yes — permit records include the contractor name and license number who applied for the permit. This is useful for verifying that the contractor working on your property is the same one who pulled the permit.",
  },
  {
    q: "How far back do online permit records go?",
    a: "Varies by city. Modern systems like Philadelphia and Chicago go back 20–30 years. Smaller cities may only have records from 2010–2015 when they digitized. Older records require direct contact with the building department.",
  },
  {
    q: "What if I find unpermitted work on a property I'm buying?",
    a: "Options include: requiring the seller to retroactively permit and inspect the work, negotiating a price reduction to account for the risk, or walking away. Unpermitted work creates liability for the buyer once ownership transfers.",
  },
  {
    q: "Can I look up permits in a city where I don't own property?",
    a: "Yes — permit records are public. You can look up any address in any city. There is no ownership requirement to access permit status information.",
  },
  {
    q: "How do I find out if a contractor is licensed?",
    a: "Contractor license information is typically available through your state's contractor licensing board. Ohio uses OCILB, Texas uses TDLR, Illinois uses IDFPR. Most portals also show the license number of the contractor who pulled a permit.",
  },
];

function CityList({
  cities,
}: {
  cities: { city: string; url: string; searchBy: string; detail?: string | null; note?: string | null }[];
}) {
  return (
    <div className="space-y-5 mt-4">
      {cities.map((c) => (
        <div key={c.city} className="border-l-2 border-[#FF6B00]/20 pl-4">
          <h3 className="font-heading text-base tracking-widest text-[#F5F0E8] mb-1">{c.city.toUpperCase()}</h3>
          <div className="space-y-0.5 mb-2">
            <p className="text-[9px] tracking-[0.2em] text-[#FF6B00]/70 uppercase font-mono">{c.url}</p>
            <p className="text-xs text-[#F5F0E8]/40 font-mono">Search by: {c.searchBy}</p>
          </div>
          {c.detail && <p>{c.detail}</p>}
          {c.note && <p className="mt-1 text-[#F5F0E8]/50 text-xs">{c.note}</p>}
        </div>
      ))}
    </div>
  );
}

export default function FreePermitLookupByAddressPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">OH · TX · IL · MI · PA</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 9 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          FREE BUILDING PERMIT LOOKUP BY ADDRESS — SEARCH ANY CITY (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Building permits are public records. Anyone can look up permit status, inspection history,
          and contractor information for any address — completely free. Here&apos;s how to do it in
          every major city.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* General process */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO LOOK UP A PERMIT BY ADDRESS (GENERAL PROCESS)</h2>
          <p>The process is essentially the same across every city:</p>
          <ul className="space-y-3 mt-4 ml-4">
            {GENERAL_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Most portals show current status, inspection history, issue date, expiration date, and
            which contractor pulled the permit. All of this is free and requires no account on most
            city portals.
          </p>
        </section>

        {/* Ohio */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">OHIO — FREE PERMIT LOOKUP BY ADDRESS</h2>
          <CityList cities={OHIO_CITIES} />
        </section>

        {/* Texas */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">TEXAS — FREE PERMIT LOOKUP BY ADDRESS</h2>
          <CityList cities={TEXAS_CITIES} />
        </section>

        {/* Illinois */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">ILLINOIS — FREE PERMIT LOOKUP BY ADDRESS</h2>
          <CityList cities={ILLINOIS_CITIES} />
          <div className="mt-5 border border-[#FF6B00]/10 p-4">
            <p className="text-[9px] tracking-[0.25em] text-[#FF6B00]/70 uppercase font-mono mb-3">Chicago suburbs — each has its own portal</p>
            <ul className="space-y-2">
              {CHICAGO_SUBURBS.map((suburb) => (
                <li key={suburb} className="flex gap-3 text-xs">
                  <span className="text-[#FF6B00] flex-shrink-0">■</span>
                  <span className="text-[#F5F0E8]/60">{suburb}: City of {suburb} Building Department portal</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[#F5F0E8]/40">
              For any suburb not listed, search &ldquo;[suburb name] building permit status&rdquo; to find the direct portal link.
            </p>
          </div>
        </section>

        {/* Michigan */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">MICHIGAN — FREE PERMIT LOOKUP BY ADDRESS</h2>
          <CityList cities={MICHIGAN_CITIES} />
        </section>

        {/* Pennsylvania */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">PENNSYLVANIA — FREE PERMIT LOOKUP BY ADDRESS</h2>
          <CityList cities={PENNSYLVANIA_CITIES} />
        </section>

        {/* What you can learn */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT YOU CAN LEARN FROM A PERMIT LOOKUP</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {LOOKUP_USES.map(({ label, items }) => (
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

        {/* Open permits */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT &ldquo;OPEN PERMIT&rdquo; MEANS WHEN BUYING A HOUSE</h2>
          <p>
            An open permit means a permit was issued but never received a final inspection. This is
            a significant issue in real estate transactions that comes up more often than most buyers
            expect.
          </p>

          <h3 className="font-heading text-base tracking-widest text-[#F5F0E8] mt-5 mb-3">WHY IT MATTERS</h3>
          <ul className="space-y-2 ml-4">
            {[
              "Lenders sometimes won't close with open permits",
              "Title companies may require resolution before insuring",
              "The work associated with the open permit may not have been properly completed or inspected",
              "You inherit the responsibility for resolving it after purchase",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-base tracking-widest text-[#F5F0E8] mt-5 mb-3">HOW TO RESOLVE AN OPEN PERMIT</h3>
          <ul className="space-y-3 ml-4">
            {OPEN_PERMIT_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Always check permit status when buying a property — it takes 5 minutes and can prevent
            expensive surprises. If any permits show as open or have failed inspections, make resolution
            a condition of closing.
          </p>
        </section>

        {/* Older permits */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHEN PERMIT HISTORY ISN&apos;T ONLINE</h2>
          <p>
            Older permits (pre-2000 in most cities, pre-2010 in some) may not be in online systems.
            This is common for renovations done in the 1980s and 1990s. To find older permits:
          </p>
          <ul className="space-y-3 mt-4 ml-4">
            {OLDER_PERMIT_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            If a building department can&apos;t find a permit for significant work (additions, structural
            changes, electrical panel upgrades) on an older home, the work was likely done without
            a permit. This is worth flagging to your inspector and attorney if you&apos;re purchasing.
          </p>
        </section>

        {/* Manual vs automatic */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING PERMITS AUTOMATICALLY VS MANUAL LOOKUP</h2>
          <p>
            Manual lookups work fine for occasional one-off checks — a pre-purchase due diligence
            search or a quick verification that your contractor pulled a permit. For contractors
            managing multiple active permits across different jobs and cities, manual checking becomes
            a daily time sink.
          </p>
          <p className="mt-3">
            The problem isn&apos;t any single lookup — it&apos;s doing 5, 10, or 15 of them every morning
            across different portals with different interfaces, then doing it again tomorrow because
            status can change at any time.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker monitors your permits automatically:
          </p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              "Enter permit numbers once",
              "System checks status across multiple cities automatically",
              "Email alerts when any permit status changes",
              "Never miss an inspection pass, failure, hold, or expiration",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Contractors typically spend 30–60 minutes per day on manual permit status checks across
            multiple jobs. The Permit Tracker eliminates that entirely.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">AUTOMATE YOUR PERMIT TRACKING</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Stop checking permit portals manually every morning. ClearedNo monitors your permits
            automatically and sends email alerts the moment any status changes — passed, failed,
            on hold, or expiring. First month free.
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
          <Link href="/blog/building-permit-status-check-guide" className="hover:text-[#FF6B00] transition-colors">
            ← Building Permit Status Check Guide
          </Link>
          <Link href="/blog/how-to-check-building-inspection-status" className="hover:text-[#FF6B00] transition-colors">
            How to Check Building Inspection Status →
          </Link>
        </nav>
      </div>
    </article>
  );
}
