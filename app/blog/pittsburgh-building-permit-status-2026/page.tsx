import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pittsburgh Building Permit Status: How to Track Your Permit in 2026 | ClearedNo",
  description:
    "Pittsburgh's PLI portal, how to search by permit number or address, what each status means, typical 6-8 week timelines, and contractor mistakes that cause delays.",
  keywords: [
    "Pittsburgh building permit status",
    "PLI Pittsburgh permit",
    "epli.pittsburghpa.gov",
    "Pittsburgh permit contractor",
    "Pittsburgh permit approval time 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/pittsburgh-building-permit-status-2026" },
  openGraph: {
    title: "Pittsburgh Building Permit Status: How to Track Your Permit in 2026",
    description:
      "Pittsburgh's PLI portal explained — how to search permits, what each status means, and what causes delays.",
    url: "https://www.clearedno.com/blog/pittsburgh-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Pittsburgh Building Permit Status: How to Track Your Permit in 2026",
  description:
    "Pittsburgh's PLI portal, permit status meanings, typical timelines, and common contractor mistakes in 2026.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-30",
};

export default function PittsburghPermitStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Pittsburgh, PA</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          PITTSBURGH BUILDING PERMIT STATUS: HOW TO TRACK YOUR PERMIT IN 2026
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Pittsburgh&apos;s PLI department processes permits through the ePLI portal. Residential
          permits typically run 6–8 weeks. Here&apos;s how to track your permit, what each status
          means, and how to avoid the most common delays.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PITTSBURGH&apos;S PLI DEPARTMENT AND ePLI PORTAL</h2>
          <p>
            Pittsburgh building permits are managed by the <strong className="text-[#F5F0E8]">Department of Permits,
            Licenses and Inspections (PLI)</strong>. The online portal is at{" "}
            <strong className="text-[#F5F0E8]">epli.pittsburghpa.gov</strong>. PLI handles building,
            electrical, plumbing, mechanical, and zoning permits for the City of Pittsburgh — note
            that Pittsburgh and Allegheny County are separate jurisdictions; projects outside city
            limits go through Allegheny County or the relevant municipality.
          </p>
          <p className="mt-3">
            The ePLI portal allows contractors to apply for permits, upload documents, check status,
            and schedule inspections. A registered contractor account is required to submit
            applications. Registration requires your Pennsylvania contractor registration, business
            entity information, and insurance certificates. PLI&apos;s permit counter is at 200 Ross
            Street, Suite 3200, in downtown Pittsburgh, open Monday through Friday, 8:30 AM to
            4:30 PM.
          </p>
          <p className="mt-3">
            Pittsburgh also offers a public-facing permit search without login. Navigate to the
            ePLI portal and select &quot;Search Records&quot; — this allows anyone to look up permit
            history by address, useful for due diligence before taking on a property with a
            complex permit history.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO SEARCH BY PERMIT NUMBER OR ADDRESS</h2>
          <p>
            Pittsburgh permit numbers follow the format{" "}
            <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">YYYY-BLDG-XXXXXX</code> for building
            permits. Trade permits use similar formats with department codes (ELEC, PLMB, MECH).
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Go to epli.pittsburghpa.gov" },
              { n: "2", t: "Select \"Search Records\" from the main menu — no login required for public search" },
              { n: "3", t: "Choose \"Building Permits\" from the record type dropdown" },
              { n: "4", t: "Enter your permit number or property address. Address search is often faster if you don't have the permit number handy." },
              { n: "5", t: "Click the permit record. The detail page shows current status, assigned examiner, inspection history, and any comments." },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            For projects with multiple associated permits (building + electrical + plumbing under
            the same project), the permit detail page usually shows related records. Click through
            to verify each trade permit is tracking on schedule — it&apos;s common for the building
            permit to be issued while a trade permit is still under review.
          </p>
          <p className="mt-3">
            For contractors managing multiple jobs in Pittsburgh simultaneously, our guide on{" "}
            <Link href="/blog/contractor-permit-tracking-multiple-jobs" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">tracking permits across multiple jobs</Link>{" "}
            covers systems for staying on top of each project&apos;s status without checking every
            portal manually.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT EACH STATUS MEANS IN ePLI</h2>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              {
                status: "PENDING REVIEW",
                meaning: "Application submitted. Waiting for intake confirmation and examiner assignment.",
                action: "Wait. Normal intake takes 3–5 business days. No action needed unless intake calls.",
              },
              {
                status: "IN REVIEW",
                meaning: "Assigned to a plans examiner. Technical review in progress.",
                action: "Check ePLI daily for comments or correction requests. Respond promptly.",
              },
              {
                status: "CORRECTIONS REQUIRED",
                meaning: "Reviewer has flagged issues. Correction letter available in ePLI document tab.",
                action: "Read all comments. Upload corrected documents through ePLI. Clock restarts on resubmission.",
              },
              {
                status: "APPROVED",
                meaning: "Plans approved. Permit fee due before issuance.",
                action: "Pay fee. Permit becomes active and ISSUED status will update within 1–2 business days.",
              },
              {
                status: "INSPECTIONS REQUIRED",
                meaning: "Permit issued and active. Required inspections scheduled or pending.",
                action: "Schedule all required inspections in sequence. Don't cover rough work before inspection.",
              },
              {
                status: "FINAL",
                meaning: "All inspections passed. Project officially complete.",
                action: "Archive permit records. Certificate of Occupancy if applicable.",
              },
              {
                status: "EXPIRED",
                meaning: "Permit issued but work not started or not completed within allowed period.",
                action: "Contact PLI about renewal options. May require new application.",
              },
            ].map((row, i) => (
              <div key={row.status} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 6 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.status}</div>
                <div className="text-xs text-[#F5F0E8]/60">{row.meaning}</div>
                <div className="text-xs text-[#F5F0E8]/40 mt-1">Action: {row.action}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TYPICAL TIMELINES FOR PITTSBURGH PERMITS</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">RESIDENTIAL PERMITS</h3>
          <p>
            Standard residential permits in Pittsburgh — single-family new construction, additions,
            interior renovations — typically take <strong className="text-[#F5F0E8]">6 to 8 weeks</strong>
            from submission to issuance. This is relatively consistent throughout the year, though
            spring and early summer see increased volume and times can push to 9–10 weeks.
          </p>
          <p className="mt-3">
            Projects requiring zoning variances add time — the Zoning Board of Adjustment (ZBA)
            meets on a set schedule and approval is required before PLI will issue a building permit.
            ZBA review typically adds 6–10 weeks. If your project requires a variance, confirm
            zoning status before starting the PLI application.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">COMMERCIAL PERMITS</h3>
          <p>
            Commercial permits generally run <strong className="text-[#F5F0E8]">8 to 14 weeks</strong>.
            Pittsburgh has active commercial development in Downtown, the Strip District, Lawrenceville,
            and Oakland near the universities. Tenant improvement permits in office buildings and
            mixed-use buildings can be faster (5–7 weeks) if the scope is limited and the base
            building already has its permits in order.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">TRADE PERMITS</h3>
          <p>
            Standalone electrical, plumbing, and mechanical permits for simple work process in
            <strong className="text-[#F5F0E8]"> 5 to 10 business days</strong>. Over-the-counter
            permits for minor trade work are available at the PLI counter for qualifying scopes.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON CONTRACTOR MISTAKES IN PITTSBURGH</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">WRONG PERMIT TYPE</h3>
          <p>
            Pittsburgh&apos;s PLI has distinct permit types for different scopes of work — Building,
            Use and Occupancy, Zoning, Electrical, Plumbing, Mechanical. Selecting the wrong type
            routes your application to the wrong review division and requires a withdrawal and
            resubmission. For projects involving multiple scopes (e.g., a renovation that requires
            both a building permit and zoning approval), each permit type must be applied for
            separately. Missing one at the start adds weeks to your critical path.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">SKIPPING ZONING APPROVAL</h3>
          <p>
            This is the most significant systemic mistake contractors make in Pittsburgh. PLI
            requires zoning approval before issuing a building permit for many project types.
            If your project requires zoning confirmation, you need to get that sign-off first —
            applying for a building permit before zoning approval doesn&apos;t save time; it creates
            a blocking dependency that holds up the building permit indefinitely.
          </p>
          <p className="mt-3">
            Pittsburgh&apos;s zoning map is available through the city&apos;s GIS portal. Check your
            project&apos;s zoning district, setback requirements, and any overlay conditions before
            submitting. Many contractors in Pittsburgh now make a zoning confirmation call to PLI
            standard practice before pulling any permit.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">HISTORIC DISTRICT REQUIREMENTS (PHRC)</h3>
          <p>
            Pittsburgh has several significant historic districts — the Mexican War Streets in
            the North Side, parts of Allegheny West, sections of the South Side, and several
            downtown blocks. Projects in these areas that affect exterior appearances require
            review by the Pittsburgh Historic Review Commission (PHRC) before PLI will issue
            a building permit. PHRC review adds 4–8 weeks and has specific requirements for
            materials, window types, and façade treatments.
          </p>
          <p className="mt-3">
            If your project involves exterior work on a property in or adjacent to a historic
            district, verify PHRC applicability early. Missing this step is costly — starting
            exterior work without PHRC approval in a covered area can result in a stop-work
            order and a required restoration of unauthorized changes.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PRACTICAL TRACKING ADVICE FOR PITTSBURGH CONTRACTORS</h2>
          <ul className="space-y-4 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Check ePLI every 2–3 days once in review.</strong> PLI
                doesn&apos;t always send email notifications for correction requests. The ePLI activity
                log and document tab are the authoritative source of truth.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Schedule inspections before you need them.</strong> Pittsburgh
                inspection scheduling through ePLI works best when you request 48–72 hours in advance.
                For framing and rough-in inspections where your crew is waiting, don&apos;t schedule
                the inspection when the work is done — schedule it the day before you expect to finish.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Call PLI for permits stuck beyond expected timeframes.</strong>
                PLI&apos;s main line is (412) 255-2175. For permits that have been In Review for more than
                the expected window, a call asking specifically whether a reviewer has been assigned
                — not just a general &quot;what&apos;s the status&quot; question — tends to get better information.
              </div>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">WANT AUTOMATIC PITTSBURGH PERMIT ALERTS?</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo is expanding to Pennsylvania. Request Pittsburgh to move it up the list and
            get notified the moment monitoring launches.
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
