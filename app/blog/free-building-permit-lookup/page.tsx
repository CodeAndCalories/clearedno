import type { Metadata } from "next";
import Link from "next/link";
import { liveCityList } from "@/lib/cities";

// The states this directory covers. The /check funnel below lists only the
// live-checker cities inside them — a Midwest lookup guide should not pitch
// Austin or Seattle. Derived from LIVE_CHECKER_CITIES, never hardcoded.
const POST_STATES = ["OH", "IL", "IN", "MI", "KY", "PA"] as const;
const liveHere = liveCityList({ separator: ", ", conjunction: "and", format: "city", states: POST_STATES });

export const metadata: Metadata = {
  // Retitled 2026-09-07. The old title read like ClearedNo offered a
  // by-address lookup; this page is a directory of each city's own portal.
  // "Building permit" + "lookup by address" + the state list stay prominent.
  title: "How to Look Up a Building Permit by Address in OH, IL, IN, MI, KY & PA | ClearedNo",
  description:
    "How to look up a building permit by address in Ohio, Illinois, Indiana, Michigan, Kentucky, and Pennsylvania — the free permit search portal each major city runs, and what each one lets you search by.",
  keywords: [
    "free building permit lookup by address",
    "permit lookup Ohio",
    "building permit search Illinois",
    "Indiana permit lookup",
    "Michigan building permit search",
    "Pennsylvania permit lookup",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/free-building-permit-lookup" },
  openGraph: {
    title: "How to Look Up a Building Permit by Address in OH, IL, IN, MI, KY & PA",
    description:
      "The free permit search portal each major city runs in Ohio, Illinois, Indiana, Michigan, Kentucky, and Pennsylvania — and what each lets you search by.",
    url: "https://www.clearedno.com/blog/free-building-permit-lookup",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Look Up a Building Permit by Address in OH, IL, IN, MI, KY & PA",
  description:
    "How to look up a building permit by address in Ohio, Illinois, Indiana, Michigan, Kentucky, and Pennsylvania — the free permit search portal each major city runs, and what each one lets you search by.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-04-29",
  dateModified: "2026-09-07",
};

const OHIO = [
  { city: "Columbus",   portal: "permits.columbus.gov",                        search: "address, permit number, or contractor name", note: "Updated daily" },
  { city: "Cleveland",  portal: "Cleveland Building Department ePlans",         search: "address or permit number",                   note: "Some older permits require phone lookup" },
  { city: "Cincinnati", portal: "Cincinnati Department of Buildings & Inspections", search: "address or permit number",                note: "Unincorporated areas use Hamilton County Building Inspections instead" },
  { city: "Akron",      portal: "City of Akron Building Department",            search: "address or permit number",                   note: null },
  { city: "Toledo",     portal: "Toledo Building Inspection",                   search: "address",                                    note: null },
  { city: "Dayton",     portal: "City of Dayton Permit Center",                 search: "address or permit number",                   note: null },
];

const ILLINOIS = [
  { city: "Chicago",                    portal: "chicago.gov — Buildings section",              search: "address (most comprehensive portal in IL)", note: null },
  { city: "Rockford",                   portal: "City of Rockford Building and Inspections",    search: "address or permit number",                  note: null },
  { city: "Springfield",                portal: "City of Springfield Building and Zoning",      search: "address",                                   note: null },
  { city: "Aurora / Naperville / Joliet", portal: "Each has its own portal",                   search: "search \"[city name] building permit lookup\" for direct link", note: null },
];

const INDIANA = [
  { city: "Indianapolis", portal: "indy.gov — eGov permits",                        search: "address or permit number", note: null },
  { city: "Fort Wayne",   portal: "City of Fort Wayne Building Commission",          search: "address",                  note: null },
  { city: "South Bend",   portal: "St. Joseph County Building Department",           search: "permit number",            note: null },
];

const MICHIGAN = [
  { city: "Detroit",      portal: "Detroit BSEED (Buildings, Safety Engineering, and Environmental Department)", search: "address",               note: null },
  { city: "Grand Rapids", portal: "City of Grand Rapids Building Safety",                                        search: "address or permit number", note: null },
  { city: "Lansing",      portal: "City of Lansing Building Safety Office",                                      search: "address",               note: null },
];

const KENTUCKY = [
  { city: "Louisville",  portal: "Louisville Metro — One Stop Shop",                      search: "address or permit number", note: null },
  { city: "Lexington",   portal: "Lexington-Fayette Urban County Government",             search: "address",                  note: null },
];

const PENNSYLVANIA = [
  { city: "Philadelphia",                portal: "Philadelphia Licenses and Inspections — eCLIPSE system",    search: "address (one of the best portals in the country)", note: null },
  { city: "Pittsburgh",                  portal: "City of Pittsburgh PLI (Permits, Licenses, and Inspections)", search: "address or permit number",                       note: null },
  { city: "Allentown / Erie / Harrisburg", portal: "Individual portals per city",                              search: "search \"[city] permit lookup\" for direct links",  note: null },
];

type CityRow = { city: string; portal: string; search: string; note: string | null };

function StateTable({ rows }: { rows: CityRow[] }) {
  return (
    <div className="border border-[#FF6B00]/20 overflow-hidden mt-4">
      {rows.map((row, i) => (
        <div
          key={row.city}
          className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < rows.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
        >
          <p className="font-mono text-xs text-[#FF6B00] mb-1">{row.city}</p>
          <p className="text-xs text-[#F5F0E8]/70">{row.portal}</p>
          <p className="text-[10px] text-[#F5F0E8]/40 mt-0.5">Search by: {row.search}</p>
          {row.note && <p className="text-[10px] text-[#F5F0E8]/30 mt-0.5 italic">{row.note}</p>}
        </div>
      ))}
    </div>
  );
}

export default function FreeBuildingPermitLookupPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">OH · IL · IN · MI · KY · PA</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">April 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOW TO LOOK UP A BUILDING PERMIT BY ADDRESS IN OH, IL, IN, MI, KY &amp; PA
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Need to look up a building permit by address? Every major Midwest city runs its own free
          online permit portal. Here is the one to use in each city, and what it lets you search by.
        </p>

        {/* This page is a directory of city portals. Anyone who landed here already
            holding a permit number in a live-checker city should get a real lookup
            in one click instead of a portal link. */}
        <div className="mt-6 border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-5 relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <p className="text-[9px] tracking-[0.3em] text-[#FF6B00] uppercase font-mono mb-2">Have the permit number already?</p>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-3">
            Skip the portal. For permits in {liveHere}, our free checker pulls the current status
            straight from the city&apos;s open-data feed — no login, no signup. Permit number only;
            for address searches, use the city portals listed below.
          </p>
          <Link
            href="/check"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
          >
            CHECK A PERMIT&apos;S STATUS FREE →
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">OHIO PERMIT LOOKUP BY ADDRESS</h2>
          <StateTable rows={OHIO} />
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">ILLINOIS PERMIT LOOKUP BY ADDRESS</h2>
          <StateTable rows={ILLINOIS} />
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">INDIANA PERMIT LOOKUP BY ADDRESS</h2>
          <StateTable rows={INDIANA} />
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">MICHIGAN PERMIT LOOKUP BY ADDRESS</h2>
          <StateTable rows={MICHIGAN} />
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">KENTUCKY PERMIT LOOKUP BY ADDRESS</h2>
          <StateTable rows={KENTUCKY} />
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-2">PENNSYLVANIA PERMIT LOOKUP BY ADDRESS</h2>
          <StateTable rows={PENNSYLVANIA} />
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHEN MANUAL LOOKUP GETS TEDIOUS</h2>
          <p>
            If you&apos;re a contractor tracking permits across multiple cities and projects,
            logging into each portal individually adds up fast.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker monitors status changes automatically in {liveHere}.
            You enter your permit numbers once and get email alerts when anything changes —
            approved, inspected, or flagged.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">SEE HOW PERMIT TRACKER WORKS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Automatic status alerts for permits in {liveHere}. No more portal-hopping.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            SEE HOW PERMIT TRACKER WORKS →
          </Link>
        </div>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FAQS</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can anyone look up a building permit?",
                a: "Yes — building permits are public records in all 50 states. Anyone can search by address.",
              },
              {
                q: "How far back do permit records go online?",
                a: "Most portals go back 10–15 years. Older records may require an in-person request at the building department.",
              },
              {
                q: "What if I can't find a permit for a property?",
                a: "Either no permit was pulled — which is a red flag for unpermitted work — or the record isn't in the online system yet. Call the building department directly to confirm.",
              },
              {
                q: "Can I see permit history for a house I'm buying?",
                a: "Yes — permit history is one of the most useful things to check before purchasing a property. Look for open permits, failed inspections, or unpermitted additions.",
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
          <Link href="/blog/how-to-check-permit-inspection-status" className="hover:text-[#FF6B00] transition-colors">
            How to Check Permit Inspection Status →
          </Link>
        </nav>
      </div>
    </article>
  );
}
