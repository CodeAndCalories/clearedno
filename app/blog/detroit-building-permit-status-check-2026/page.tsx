import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Detroit Building Permit Status Check: What Contractors Need to Know (2026) | ClearedNo",
  description:
    "Detroit's BSEED portal is complex — dual permit systems, legacy paper records, and long review times. Here's how to navigate it, look up a permit, and what to do when your application is stuck.",
  keywords: [
    "Detroit building permit status",
    "BSEED Detroit permit",
    "bseed.detroitmi.gov",
    "Detroit permit contractor",
    "Detroit permit approval time 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/detroit-building-permit-status-check-2026" },
  openGraph: {
    title: "Detroit Building Permit Status Check: What Contractors Need to Know (2026)",
    description:
      "Detroit's BSEED portal and permit system explained — how to look up status, realistic timelines, and practical workarounds.",
    url: "https://www.clearedno.com/blog/detroit-building-permit-status-check-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Detroit Building Permit Status Check: What Contractors Need to Know (2026)",
  description:
    "Detroit's BSEED permit portal, dual permit systems, and practical workarounds for contractors tracking permit status in 2026.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-30",
};

export default function DetroitPermitStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Detroit, MI</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 8 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          DETROIT BUILDING PERMIT STATUS CHECK: WHAT CONTRACTORS NEED TO KNOW (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Detroit&apos;s BSEED portal and permit system are genuinely complex — a dual permit system,
          legacy paper records for older properties, and review times that can stretch to four months
          for commercial projects. Here&apos;s how to navigate it effectively.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING DETROIT&apos;S BSEED DEPARTMENT</h2>
          <p>
            Detroit&apos;s building permits are handled by <strong className="text-[#F5F0E8]">BSEED — the Buildings,
            Safety Engineering and Environmental Department</strong>, accessible at{" "}
            <strong className="text-[#F5F0E8]">bseed.detroitmi.gov</strong>. BSEED is a combined agency
            that handles building permits, fire inspections, environmental compliance, and licensing
            — which means the department is large and its functions are not always obviously separated
            on the website.
          </p>
          <p className="mt-3">
            The permit and licensing functions are the ones most contractors interact with. BSEED
            operates the Detroit Permit Center at the Coleman A. Young Municipal Center, 2 Woodward
            Avenue, Suite 401. Counter hours are Monday through Friday, 8 AM to 4 PM. BSEED also
            has a satellite office in the city&apos;s northwest side for certain permit types.
          </p>
          <p className="mt-3">
            One critical thing to know upfront: Detroit operates what is effectively a dual-track
            system for permits. The modern online system handles applications submitted through the
            Detroit Permit Center portal (linked from bseed.detroitmi.gov), while legacy permits
            issued before the system was digitized in the mid-2010s may only exist as paper records.
            For properties with older permit histories, you may need to request records in person.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO LOOK UP YOUR PERMIT STATUS</h2>
          <p>
            For permits submitted through the online system, status can be checked through the
            BSEED portal. Here&apos;s the process:
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Go to bseed.detroitmi.gov and navigate to the Permit Center section" },
              { n: "2", t: "Log into your contractor account (required for status checks on submitted permits)" },
              { n: "3", t: "Select \"My Permits\" or use the permit search function with your record number" },
              { n: "4", t: "Your permit record will show the current status, assigned reviewer (if applicable), and any comments or corrections" },
              { n: "5", t: "If you have an associated record number from your submission confirmation, use that for the most reliable search results" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            Detroit permit numbers typically follow the format <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">BLD-YYYY-XXXXXX</code> for
            building permits and have similar prefixes for trade permits (ELC, PLB, MEC). Keep your
            record number from your submission confirmation — searching by address in the Detroit
            system can sometimes return multiple records for the same property due to historical
            permit data overlap.
          </p>
          <p className="mt-3">
            For the status terminology in Detroit and how it compares to other systems, see our
            explainer on{" "}
            <Link href="/blog/what-does-permit-cleared-mean" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">what &quot;permit cleared&quot; actually means</Link>{" "}
            — the terminology varies more than most contractors expect across different city systems.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT &quot;UNDER REVIEW&quot; MEANS AT BSEED</h2>
          <p>
            Detroit&apos;s portal uses &quot;Under Review&quot; as a broad status that covers the entire plan
            review phase — from initial assignment through any correction cycles. Unlike some other
            cities that break review into distinct sub-statuses, Detroit&apos;s Under Review can mean
            any of these things:
          </p>
          <ul className="space-y-3 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span>Application has been assigned to a plans examiner and review has started</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span>Application is in queue waiting for assignment (pre-review)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span>Corrections have been flagged and the reviewer is waiting for your response</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span>Corrected plans have been resubmitted and are in secondary review</span>
            </li>
          </ul>
          <p className="mt-3">
            Because Under Review doesn&apos;t distinguish between these stages, calling with your record
            number is often the only way to get a meaningful update on where exactly your application
            stands. BSEED&apos;s permit tracking line is (313) 224-3158. Have your record number ready
            and be specific — ask &quot;Has a plan examiner been assigned?&quot; and &quot;Are there any outstanding
            correction comments?&quot; rather than just asking for a status update.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TYPICAL TIMELINES FOR DETROIT PERMITS</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">RESIDENTIAL PROJECTS</h3>
          <p>
            Residential building permits in Detroit — new construction, additions, substantial
            renovations — typically take <strong className="text-[#F5F0E8]">6 to 10 weeks</strong> from
            submission to issuance. This is longer than most Michigan municipalities. Detroit has a
            significant volume of rehabilitation and adaptive reuse projects as the city continues
            to recover and develop, which adds to review queue depth.
          </p>
          <p className="mt-3">
            Projects involving properties with existing code violations or open permits from
            previous owners can add substantial time. Before submitting a permit for a property
            with a complex history, it&apos;s worth requesting a pre-application review with BSEED to
            surface any outstanding issues.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">COMMERCIAL PROJECTS</h3>
          <p>
            Commercial new construction and major commercial renovations run significantly longer —
            <strong className="text-[#F5F0E8]"> 10 to 16 weeks</strong> is realistic, and complex
            projects with fire suppression, structural upgrades, and environmental compliance
            requirements can stretch to 20 weeks or more. Detroit is actively developing its
            downtown core, New Center, Midtown, and east riverfront, and the demand for commercial
            plan review has outpaced departmental capacity in recent years.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">DEMOLITION PERMITS</h3>
          <p>
            Detroit handles demolition permits separately from building permits. Demolition permits
            in Detroit involve environmental review (lead and asbestos survey requirements) that
            does not apply in most other cities. Budget 4–6 weeks for a residential demolition
            permit and 6–10 weeks for commercial. The city has historically been aggressive about
            demolishing blighted properties under city programs, and the permitting requirements
            for private demolitions reflect this institutional priority.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT DOCUMENTATION TO HAVE READY</h2>
          <p>
            Detroit requires a more complete documentation package than most Michigan municipalities.
            Having everything ready at time of submission reduces the probability of a correction
            cycle and meaningfully shortens your timeline.
          </p>
          <ul className="space-y-4 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Contractor registration and licensing.</strong> All contractors
                must have a valid City of Detroit contractor registration. Electrical, plumbing, and
                mechanical contractors must hold applicable Michigan state licenses. Out-of-state
                contractors must comply with Michigan&apos;s licensing requirements before applying.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Complete plan set.</strong> Michigan Building Code (IBC 2021
                basis) applies to commercial; Michigan Residential Code applies to one and two-family
                dwellings. Plans must be stamped by a licensed Michigan architect or engineer for most
                commercial projects and for residential new construction above a certain square footage
                threshold.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Property information.</strong> Parcel number, legal description,
                and current zoning designation. Detroit has a complex zoning map with significant
                industrial-to-residential conversion areas, and verifying zoning classification
                before submitting prevents misfiled applications.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Energy compliance documentation.</strong> Michigan adopted
                IECC 2021 as its energy code. ResCheck (residential) or COMcheck (commercial) reports
                are required for new construction and most addition permits.
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PRACTICAL WORKAROUNDS WHEN YOUR PERMIT IS STUCK</h2>
          <p>
            If your permit has been sitting in Under Review status beyond the expected timeframe,
            these approaches have the best track record:
          </p>
          <ul className="space-y-4 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Call with your record number ready.</strong> (313) 224-3158 is
                the BSEED main line. Specifically ask whether your application has been assigned to
                an examiner yet, and if not, how many applications are ahead of yours in the queue.
                This gives you real information rather than a generic status.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Request a pre-submission meeting for future applications.</strong>
                BSEED offers pre-application conferences that can identify likely correction issues
                before you formally submit. The time spent on this meeting more than pays off in
                reduced review cycles.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">For commercial projects, consider third-party plan review.</strong>
                Michigan allows third-party plan review for certain commercial project types. BSEED
                maintains a list of approved third-party review agencies. This can significantly
                compress commercial timelines for projects that qualify.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Go in person for legacy records.</strong> If you&apos;re working
                on a property with a complex permit history and need to verify status of older permits,
                the Coleman A. Young Municipal Center records staff can pull physical files that
                aren&apos;t available through the online portal.
              </div>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">WANT AUTOMATIC DETROIT PERMIT ALERTS?</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo is expanding to Michigan. Request Detroit to move it up the priority list and
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
          <Link href="/blog/what-does-permit-cleared-mean" className="hover:text-[#FF6B00] transition-colors">
            What Does &quot;Permit Cleared&quot; Mean? →
          </Link>
        </nav>
      </div>
    </article>
  );
}
