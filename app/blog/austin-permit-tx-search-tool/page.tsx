import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // Retitled 2026-09-04. The old title promised an on-page "search tool" and an
  // address lookup; this is a how-to guide, and the only lookup ClearedNo runs is
  // by permit number at /check. Title and description now say what the page is,
  // and keep "Austin" + "permit search" prominent — that is what ranks.
  title: "How to Search Austin Building Permits (2026) — By Address or Permit Number | ClearedNo",
  description:
    "Austin permit search, step by step: find any building permit by address, permit number, or contractor using Austin Build Central and Open Data — and check a permit's live status free by number.",
  keywords: [
    "Austin TX permit search tool",
    "Austin permit search",
    "search Austin permits by address",
    "Austin building permit search",
    "Austin permit lookup tool",
    "find Austin permit number",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/austin-permit-tx-search-tool" },
  openGraph: {
    title: "How to Search Austin Building Permits (2026) — By Address or Permit Number",
    description: "How to search Austin TX permits by address, number, or contractor using the official portals — plus a free live status check by permit number.",
    url: "https://www.clearedno.com/blog/austin-permit-tx-search-tool",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Search Austin Building Permits (2026) — By Address or Permit Number",
  description: "How to find any permit in Austin TX by address, permit number, or contractor using the official portals.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-22",
  dateModified: "2026-09-04",
};

export default function AustinPermitSearchToolPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Austin, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 5 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOW TO SEARCH AUSTIN BUILDING PERMITS (2026) — BY ADDRESS OR PERMIT NUMBER
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Whether you&apos;re searching for your own permit or looking up permit history on a property you&apos;re about to work on — here&apos;s every way to find Austin permits, and which city portal to use for each.
        </p>

        {/* Austin is a live checker city: anyone who landed here wanting an actual
            status lookup can get one in one click instead of reading a guide. */}
        <div className="mt-6 border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-5 relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <p className="text-[9px] tracking-[0.3em] text-[#FF6B00] uppercase font-mono mb-2">Have the permit number already?</p>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-3">
            Skip the portal. Our free checker pulls the current status of any Austin permit straight
            from the city&apos;s open-data feed — no login, no signup. Permit number only; for address
            searches, use Austin Build Central as described below.
          </p>
          <Link
            href="/check"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
          >
            CHECK AN AUSTIN PERMIT&apos;S STATUS FREE →
          </Link>
        </div>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE THREE WAYS TO SEARCH AUSTIN PERMITS</h2>
          <p>
            Austin makes permit data available through three main channels. Each is good for different things.
            If you just want current status and timelines in one place, start with our{" "}
            <Link href="/locations/tx/austin" className="text-[#FF6B00] hover:underline">
              Austin permit status page
            </Link>.
          </p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              {
                name: "Austin Build Central (ABC)",
                url: "abc.austintexas.gov",
                best: "Current status on active permits",
                notes: "Most detailed view of individual permits. Requires permit number or address. The primary system for active permits.",
              },
              {
                name: "Austin Open Data Portal",
                url: "data.austintexas.gov",
                best: "Historical lookups, address history, bulk data",
                notes: "24–48 hour data lag. Best for research — looking up permit history on a property, checking what was permitted years ago.",
              },
              {
                name: "ClearedNo Free Permit Checker",
                url: "clearedno.com/check",
                best: "Quick status check on active Austin permits — by permit number",
                notes: "Enter a permit number and get the current status without logging into any city portal. Does not search by address.",
              },
            ].map((row, i) => (
              <div key={row.name} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 2 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.name}</div>
                <div className="text-[10px] text-[#F5F0E8]/40 font-mono mb-1">{row.url}</div>
                <div className="text-xs text-[#F5F0E8]/60 mb-1"><strong className="text-[#F5F0E8]/80">Best for:</strong> {row.best}</div>
                <div className="text-xs text-[#F5F0E8]/40">{row.notes}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SEARCHING BY PERMIT NUMBER</h2>
          <p>
            If you have the permit number, the fastest route is Austin Build Central. Go to <strong className="text-[#F5F0E8]">abc.austintexas.gov</strong>, navigate to Building → Search → Building Permits, and enter the permit number.
          </p>
          <p className="mt-3">
            Austin uses two permit number formats. Know which one you have:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0">→</span>
              <span><strong className="text-[#F5F0E8]">ABC format:</strong> <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">2024-BC-04812</code> — older permits, Accela-based</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0">→</span>
              <span><strong className="text-[#F5F0E8]">API format:</strong> <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">2026-033822 PP</code> — newer permits from Austin Open Data</span>
            </li>
          </ul>
          <p className="mt-3">
            If the number has spaces and two letters at the end (like <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">PP</code>, <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">BP</code>, <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">EP</code>), it&apos;s the newer format and you may find it easier to search the Open Data portal.
          </p>
          <p className="mt-3">
            Alternatively, drop the permit number into{" "}
            <Link href="/check" className="text-[#FF6B00] hover:underline">ClearedNo&apos;s free permit checker</Link>.
            It reads Austin&apos;s open-data feed and shows you the current status in a few seconds, in either number format.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SEARCHING BY ADDRESS</h2>
          <p>
            Both ABC and the Open Data portal support address searches — ClearedNo&apos;s checker does not, so for
            address lookups you&apos;ll use the city&apos;s own portals. Here&apos;s when to use each:
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Use Austin Build Central (ABC)</strong> when you need current status on an active permit at an address. Go to Building → Search, select the address search option, and enter the street address. You&apos;ll get a list of permits associated with that address.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Use Austin Open Data</strong> when you&apos;re doing property research — checking what&apos;s been permitted at an address over the past 10 years, identifying if previous owners pulled permits for work that might not have been inspected, or doing due diligence on an acquisition. Search for the &ldquo;Building Permits&rdquo; dataset on data.austintexas.gov and filter by address.
          </p>
          <p className="mt-3">
            One common issue with address searches: Austin addresses sometimes appear in multiple formats in the system (E. versus East, abbreviated vs. spelled out). If you get no results, try a few variations.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">SEARCHING BY CONTRACTOR NAME</h2>
          <p>
            ABC supports contractor searches, though it&apos;s less commonly used. Under Building → Search, you can search by contractor name or license number. This is useful if you&apos;re a GC tracking subcontractor permit activity, or if you&apos;re doing competitive research.
          </p>
          <p className="mt-3">
            The Open Data portal also lets you filter by contractor name or license. For bulk data needs — like pulling a list of every permit a specific company has pulled in the past 3 years — Open Data is the better choice since you can download the dataset as a CSV.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT THE SEARCH RESULTS SHOW YOU</h2>
          <p>
            When you find a permit record in ABC, the detail page shows you:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Permit number and type (building, electrical, plumbing, mechanical)",
              "Project address and legal description",
              "Permit applicant and contractor of record",
              "Application date and issue date (if issued)",
              "Current status",
              "Project description",
              "Valuation",
              "Inspection history and upcoming inspections",
              "Attached documents (plans, correction letters, approval letters)",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            The attached documents section is worth knowing about. If your permit is &ldquo;In Review&rdquo; and nothing seems to be happening, sometimes a reviewer has uploaded a document — a request for additional information, a comment that didn&apos;t trigger a formal correction letter — that you need to look at. Check the documents tab, not just the status field.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE LIMITATION ALL THESE TOOLS SHARE</h2>
          <p>
            Every method described here — ABC, Open Data, our free checker — is a passive lookup. You go check. Nothing comes to you.
          </p>
          <p className="mt-3">
            For a single permit you check once a week, that&apos;s fine. For 8–10 active permits you&apos;re scheduling crews around? You need proactive notifications.
          </p>
          <p className="mt-3">
            That&apos;s the gap ClearedNo fills. You add your permit numbers, and we watch them for you. Every 2 hours, we check. The moment anything changes — status update, correction request, permit clearance — you get an email. You don&apos;t have to touch the portal.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">CHECK A PERMIT — OR LET US WATCH IT FOR YOU</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Free one-off permit lookup — no account needed. Or sign up to monitor all your permits automatically.
            One permit free, forever. No card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/check"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              CHECK A PERMIT NOW (FREE) →
            </Link>
            <Link
              href="/signup"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              START MONITORING FREE
            </Link>
          </div>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog/contractor-permit-tracking-multiple-jobs" className="hover:text-[#FF6B00] transition-colors">← Tracking Multiple Permits</Link>
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">
            All Posts →
          </Link>
        </nav>
      </div>
    </article>
  );
}
