import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Travis County Building Permits: A Contractor's Guide | ClearedNo",
  description:
    "Travis County permits vs City of Austin permits — what's different, which projects need county approval, and how to navigate the process in 2026.",
  keywords: [
    "Travis County building permits",
    "Travis County permit search",
    "Travis County contractor permits",
    "unincorporated Travis County permits",
    "Austin ETJ permits",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/travis-county-building-permits" },
  openGraph: {
    title: "Travis County Building Permits: A Contractor's Guide",
    description: "Travis County permits vs City of Austin — what's different and how to navigate the process.",
    url: "https://www.clearedno.com/blog/travis-county-building-permits",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Travis County Building Permits: A Contractor's Guide",
  description: "Travis County permits vs City of Austin permits — a contractor's guide.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-05",
  dateModified: "2026-03-28",
};

export default function TravisCountyPermitsPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Travis County</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          TRAVIS COUNTY BUILDING PERMITS: A CONTRACTOR&apos;S GUIDE
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Building in unincorporated Travis County is a different process than building inside Austin city limits.
          Here&apos;s what changes, what stays the same, and what trips contractors up.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COUNTY VS CITY — WHAT&apos;S THE DIFFERENCE?</h2>
          <p>
            If your job site is inside Austin city limits, you deal with the City of Austin&apos;s Build + Development Services. That&apos;s the ABC portal at abc.austintexas.gov.
          </p>
          <p className="mt-3">
            If your job site is in Travis County but outside any incorporated city — no city address, rural land, unincorporated subdivisions — you&apos;re dealing with Travis County instead. Two completely separate permitting authorities with different applications, different reviewers, and different timelines.
          </p>
          <p className="mt-3">
            There&apos;s a third situation: Austin&apos;s extraterritorial jurisdiction (ETJ). This is land outside city limits but within Austin&apos;s 2-mile buffer. In the ETJ, some development requires both county and city review depending on the project type. This is where things get complicated and a lot of contractors get surprised.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT NEEDS A TRAVIS COUNTY PERMIT?</h2>
          <p>
            Travis County requires permits for most structural work in unincorporated areas. That includes:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "New construction — residential and commercial",
              "Additions that increase square footage",
              "Structural alterations, including load-bearing wall removal",
              "Electrical, plumbing, and mechanical work (depending on project scope)",
              "Manufactured and modular home installations",
              "Accessory structures over 200 sq ft",
              "Pools and water features",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Some things don&apos;t require a county permit — painting, flooring, like-for-like fixture replacements, and most cosmetic work. When in doubt, call Travis County Development Services at (512) 854-4215 before you start.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO APPLY FOR A TRAVIS COUNTY PERMIT</h2>
          <p>
            Travis County Development Services handles permits online through their permitting portal. You can find it at <strong className="text-[#F5F0E8]">tcds.travis.com</strong> or through the Travis County website.
          </p>
          <p className="mt-3">
            Unlike Austin&apos;s BDS, Travis County still handles a fair amount of permitting in-person or via email submission for larger projects. The online system has improved significantly over the past couple years, but complex commercial projects sometimes get routed to staff review manually.
          </p>
          <p className="mt-3">
            What you&apos;ll generally need for a residential new construction permit:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Completed permit application with property owner info",
              "Site plan showing setbacks, easements, and drainage",
              "Construction drawings (floor plans, elevations, foundation plan)",
              "Energy code compliance documentation (ACCA Manual J for HVAC if applicable)",
              "Septic system information if not on city sewer",
              "Valuation of the project (used to calculate permit fees)",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW LONG DO TRAVIS COUNTY PERMITS TAKE?</h2>
          <p>
            Travis County is generally faster than the City of Austin for residential work, but it varies.
          </p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              { type: "Simple residential alterations", time: "5–10 business days" },
              { type: "Residential new construction", time: "3–5 weeks" },
              { type: "Commercial projects", time: "4–8 weeks (depends heavily on complexity)" },
              { type: "Electrical / plumbing standalone", time: "3–7 business days" },
            ].map((row, i) => (
              <div key={row.type} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 3 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.type}</div>
                <div className="text-xs text-[#F5F0E8]/60">{row.time}</div>
              </div>
            ))}
          </div>
          <p className="mt-4">
            These are current estimates — Travis County posts their actual review times on their website and they adjust based on staff load and submission volume. Summer tends to be slower. Winter is usually faster.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE ETJ SITUATION — READ THIS BEFORE YOU PULL A PERMIT</h2>
          <p>
            If your project is in Austin&apos;s ETJ, pay close attention. Austin has extraterritorial jurisdiction over a 2-mile band outside city limits. In that zone, some projects need Travis County permits AND Austin review for certain elements — particularly if they relate to water, sewer, or subdivision rules.
          </p>
          <p className="mt-3">
            The simplest way to check: look up the property on Austin&apos;s GIS maps at <strong className="text-[#F5F0E8]">austintexas.gov/gis</strong>. There&apos;s a city limits layer and an ETJ layer. If you&apos;re inside the ETJ boundary, call both Travis County Development Services and Austin BDS before you apply for anything.
          </p>
          <p className="mt-3">
            Getting this wrong can mean permits issued by one jurisdiction that conflict with requirements from the other. It&apos;s a mess to unwind after the fact.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CHECKING YOUR PERMIT STATUS IN TRAVIS COUNTY</h2>
          <p>
            Once you&apos;ve submitted, you can check status through the Travis County permitting portal using your permit number or project address. Status updates are usually posted within 24 hours of a review action.
          </p>
          <p className="mt-3">
            Like Austin&apos;s system, Travis County does not send proactive status notifications. You have to check manually. If you&apos;re running multiple county permits simultaneously, that&apos;s a lot of daily checking.
          </p>
          <p className="mt-3">
            ClearedNo currently monitors City of Austin permits directly. If you&apos;re doing a lot of county work in Travis County or the surrounding suburbs, check out our coverage roadmap — we&apos;re actively adding more jurisdictions.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">STOP MANUALLY CHECKING YOUR AUSTIN PERMITS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors your City of Austin permits every 2 hours and sends an instant alert the moment anything changes.
            First month free — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              START MONITORING FREE →
            </Link>
            <Link
              href="/suggest-city"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              REQUEST TRAVIS COUNTY COVERAGE
            </Link>
          </div>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog/austin-contractor-permit-lookup" className="hover:text-[#FF6B00] transition-colors">← Austin Permit Lookup</Link>
          <Link href="/blog/round-rock-cedar-park-permit-requirements" className="hover:text-[#FF6B00] transition-colors">
            Round Rock & Cedar Park Permits →
          </Link>
        </nav>
      </div>
    </article>
  );
}
