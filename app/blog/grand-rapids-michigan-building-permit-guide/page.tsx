import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grand Rapids Michigan Building Permit Guide: How to Search and Track Permits (2026) | ClearedNo",
  description:
    "Grand Rapids uses the BS&A Online portal for permit tracking. Here's how to search by permit number, what the statuses mean, typical timelines, and what contractors commonly get wrong.",
  keywords: [
    "Grand Rapids Michigan building permit",
    "Grand Rapids permit status",
    "BS&A Online Grand Rapids",
    "bsaonline.com permits",
    "Grand Rapids Building Safety",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/grand-rapids-michigan-building-permit-guide" },
  openGraph: {
    title: "Grand Rapids Michigan Building Permit Guide: How to Search and Track Permits (2026)",
    description:
      "Grand Rapids uses the BS&A Online portal for permit tracking. Here's how to use it correctly and what timelines to expect.",
    url: "https://www.clearedno.com/blog/grand-rapids-michigan-building-permit-guide",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Grand Rapids Michigan Building Permit Guide: How to Search and Track Permits (2026)",
  description:
    "Grand Rapids uses the BS&A Online portal for permit tracking. Here's how to search correctly and what each status means.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-30",
};

export default function GrandRapidsMichiganPermitPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Grand Rapids, MI</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          GRAND RAPIDS MICHIGAN BUILDING PERMIT GUIDE: HOW TO SEARCH AND TRACK PERMITS (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Grand Rapids uses the BS&amp;A Online portal for permit tracking — a platform used across
          much of Michigan. Here&apos;s how to navigate it correctly, what each status means, and what
          contractors running multiple jobs commonly get wrong.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE BS&amp;A ONLINE PORTAL: WHAT IT IS AND HOW TO ACCESS IT</h2>
          <p>
            Grand Rapids Building Safety Department uses <strong className="text-[#F5F0E8]">BS&amp;A Online</strong>,
            a Michigan-specific government software platform accessible at <strong className="text-[#F5F0E8]">bsaonline.com</strong>.
            BS&amp;A is widely used by Michigan municipalities — Kent County townships like Kentwood,
            Wyoming, and Walker use it as well — but each municipality has its own separate instance.
            When searching for Grand Rapids permits specifically, you need to be on the City of Grand
            Rapids instance, not a neighboring township&apos;s.
          </p>
          <p className="mt-3">
            The direct URL for Grand Rapids is accessible through the city&apos;s Building Safety Department
            page at <strong className="text-[#F5F0E8]">grandrapidsmi.gov/departments/building-safety</strong>.
            The portal link from there routes to the correct BS&amp;A tenant for Grand Rapids. Searching
            on bsaonline.com directly without specifying the city can return results from other
            Michigan municipalities with similar permit numbers — a common source of confusion.
          </p>
          <p className="mt-3">
            The Building Safety Department&apos;s main line is (616) 456-3087. Staff are available
            Monday through Friday, 8 AM to 5 PM. For permit applications, the permit counter at
            City Hall (300 Monroe Ave NW) handles walk-in submissions. Online submissions for most
            permit types are available through the portal.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO SEARCH BY PERMIT NUMBER IN BS&amp;A</h2>
          <p>
            Grand Rapids permit numbers follow the format <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">BLD-YYYY-XXXXXX</code> for
            building permits and <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">ELE-YYYY-XXXXXX</code> for electrical.
            When searching in BS&amp;A:
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Navigate to the Grand Rapids BS&A instance through grandrapidsmi.gov" },
              { n: "2", t: "Select \"Permits\" from the top menu — not \"Licenses\" or \"Building\" (common mistake)" },
              { n: "3", t: "Choose the search category that matches your permit type (Building, Electrical, Mechanical, Plumbing)" },
              { n: "4", t: "Enter your permit number in the search field. Include the full prefix (BLD-, ELE-, etc.)" },
              { n: "5", t: "Click the result to open the permit detail page. The status, assigned reviewer, and inspection log are all here." },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            You can also search by address. Enter the property address without street type abbreviations
            — BS&amp;A sometimes has trouble matching &quot;St&quot; vs &quot;Street&quot; and similar variations. If
            an address search returns nothing, try entering just the street number and first word of
            the street name.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT THE STATUS FIELDS MEAN</h2>
          <p>
            BS&amp;A displays permit status in a field labeled &quot;Status&quot; on the permit detail page.
            For Grand Rapids, the standard statuses are:
          </p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              {
                status: "APPLIED",
                meaning: "Application submitted. Not yet reviewed or assigned to an examiner.",
                action: "Wait for assignment. Allow 5–7 business days before checking again.",
              },
              {
                status: "PLAN REVIEW IN PROCESS",
                meaning: "Assigned to a plans examiner. Active review underway.",
                action: "Monitor portal for comments. Respond immediately to correction requests.",
              },
              {
                status: "APPROVED — PENDING PAYMENT",
                meaning: "Plans approved but permit fee not yet collected.",
                action: "Pay fee immediately through the portal or in person. Permit not active until paid.",
              },
              {
                status: "ISSUED",
                meaning: "Permit fully issued. Work may legally begin.",
                action: "Download permit documents. Post on site. Schedule first inspection when ready.",
              },
              {
                status: "FINAL",
                meaning: "All required inspections have been completed and approved.",
                action: "Project is complete. Request Certificate of Occupancy if applicable.",
              },
              {
                status: "EXPIRED",
                meaning: "Permit issued but not used within required timeframe or work abandoned.",
                action: "Contact Building Safety for renewal or re-application options.",
              },
            ].map((row, i) => (
              <div key={row.status} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 5 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.status}</div>
                <div className="text-xs text-[#F5F0E8]/60">{row.meaning}</div>
                <div className="text-xs text-[#F5F0E8]/40 mt-1">Action: {row.action}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TYPICAL TIMELINES FOR GRAND RAPIDS PERMITS</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">RESIDENTIAL PROJECTS</h3>
          <p>
            Grand Rapids residential permits — new homes, additions, garages — typically take
            <strong className="text-[#F5F0E8]"> 4 to 8 weeks</strong> from application to issuance.
            The wide range reflects project complexity and current review queue depth. Simple projects
            with complete submissions can come in at 3–4 weeks. Projects needing zoning board review
            or historic district approval add significant time.
          </p>
          <p className="mt-3">
            Grand Rapids has active infill development in several neighborhoods (Creston, Belknap
            Lookout, Garfield Park), and the Building Safety Department has seen increased application
            volume over the past two years. Expect the longer end of the range during peak spring
            and summer months.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">COMMERCIAL PROJECTS</h3>
          <p>
            Commercial permits generally run <strong className="text-[#F5F0E8]">6 to 12 weeks</strong> depending
            on scope. Grand Rapids has a concentrated commercial district around Downtown and the
            Medical Mile, plus growing development in the Westside and East Hills corridors.
            Mixed-use projects in these areas sometimes require urban planning review in addition
            to building review.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">TRADE AND MECHANICAL PERMITS</h3>
          <p>
            Standalone mechanical, electrical, and plumbing permits for simple scopes — furnace
            replacements, panel upgrades, water heater swaps — are typically processed in
            <strong className="text-[#F5F0E8]"> 3 to 7 business days</strong>. Some qualify for
            same-day or next-day over-the-counter approval at the permit counter.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">REQUIRED INSPECTIONS IN GRAND RAPIDS</h2>
          <p>
            Grand Rapids follows the Michigan Building Code (based on IBC 2021) and requires the
            following inspection stages for most residential construction:
          </p>
          <ul className="space-y-3 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Footing inspection</strong> — before concrete is poured. Inspectors check depth, rebar, and form placement.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Foundation inspection</strong> — after walls are poured but before backfill.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Rough-in inspections</strong> — framing, electrical, plumbing, and mechanical rough-ins must all be approved before insulation. These can be coordinated on the same day with advance notice.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Insulation inspection</strong> — Grand Rapids requires a separate insulation inspection before drywall. This is often missed by contractors new to Michigan code requirements.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Final inspection</strong> — covers all work. All trade sub-inspections must be passed before final can be scheduled.</span>
            </li>
          </ul>
          <p className="mt-4">
            Schedule inspections through the BS&amp;A portal or by calling (616) 456-3087. Request
            at least 48 hours in advance. During peak season, schedule your rough-in inspections
            before you need them — don&apos;t wait until the work is ready and then call.
          </p>
          <p className="mt-3">
            For contractors managing multiple concurrent projects, tracking all these inspection
            stages across sites gets complex fast. Our guide on{" "}
            <Link href="/blog/contractor-permit-tracking-multiple-jobs" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">contractor permit tracking across multiple jobs</Link>{" "}
            covers strategies for keeping everything organized.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT CONTRACTORS COMMONLY GET WRONG IN GRAND RAPIDS</h2>
          <ul className="space-y-4 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Wrong BS&amp;A tenant.</strong> Searching on the statewide bsaonline.com
                without specifying Grand Rapids can surface permits from Grandville, Wyoming, or other
                Kent County municipalities. Always navigate to Grand Rapids through the city&apos;s website.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Not using the correct search category.</strong> BS&amp;A separates
                Building, Electrical, Plumbing, and Mechanical permits into different search categories.
                Searching in Building will not return electrical permits even for the same address.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Missing the fee payment step.</strong> Grand Rapids shows
                APPROVED — PENDING PAYMENT as a distinct status. Many contractors assume approval
                means the permit is issued, but work cannot legally start until the fee is collected
                and the status changes to ISSUED.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Skipping the insulation inspection.</strong> This is the single most
                common inspection failure in Grand Rapids for contractors from out of state. If you
                hang drywall before the insulation inspection passes, you will be required to open
                walls for the inspector — a costly mistake.
              </div>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">WANT AUTOMATIC GRAND RAPIDS PERMIT ALERTS?</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo is expanding permit monitoring to Michigan. Request Grand Rapids to move it
            up the priority list.
          </p>
          <Link
            href="/suggest-city"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            REQUEST YOUR CITY →
          </Link>
          <p className="mt-2 text-[9px] text-[#F5F0E8]/25 text-center">Ohio, Michigan &amp; Pennsylvania support coming soon</p>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/contractor-permit-tracking-multiple-jobs" className="hover:text-[#FF6B00] transition-colors">
            Tracking Permits Across Multiple Jobs →
          </Link>
        </nav>
      </div>
    </article>
  );
}
