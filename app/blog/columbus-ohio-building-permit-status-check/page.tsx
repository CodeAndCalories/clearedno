import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Columbus Ohio Building Permit Status Check: A Complete Guide (2026) | ClearedNo",
  description:
    "How to check your Columbus Ohio building permit status on the Accela portal, what each status means, typical approval times, and what to do when your permit is stuck.",
  keywords: [
    "Columbus Ohio building permit status",
    "Columbus permit lookup",
    "permits.columbus.gov",
    "Columbus Accela portal",
    "Columbus building permit approval time",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/columbus-ohio-building-permit-status-check" },
  openGraph: {
    title: "Columbus Ohio Building Permit Status Check: A Complete Guide (2026)",
    description:
      "How to check your Columbus Ohio building permit status on the Accela portal, what each status means, and typical approval timelines.",
    url: "https://www.clearedno.com/blog/columbus-ohio-building-permit-status-check",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Columbus Ohio Building Permit Status Check: A Complete Guide (2026)",
  description:
    "How to check your Columbus Ohio building permit status on the Accela portal, what each status means, and typical approval timelines.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-30",
};

export default function ColumbusOhioPermitStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Columbus, OH</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          COLUMBUS OHIO BUILDING PERMIT STATUS CHECK: A COMPLETE GUIDE (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Columbus uses the Accela Citizen Access portal for all permit tracking. Here&apos;s exactly how
          to search, what each status means, and what realistic timelines look like in 2026.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO ACCESS THE COLUMBUS PERMIT PORTAL</h2>
          <p>
            Columbus processes building permits through <strong className="text-[#F5F0E8]">permits.columbus.gov</strong>, which
            runs on the Accela Citizen Access platform. This is the same platform used by dozens of
            Ohio municipalities, so if you&apos;ve used it elsewhere, the interface will look familiar.
          </p>
          <p className="mt-3">
            No login is required to check the status of an existing permit. You can search by permit
            number, address, or parcel number. For permit applications and inspection scheduling,
            you&apos;ll need to create a free account. Most contractors working in Columbus regularly
            keep a logged-in tab open — inspection scheduling and document uploads require authentication.
          </p>
          <p className="mt-3">
            Columbus&apos;s Department of Building and Zoning Services (BZS) manages the permit process.
            Their main line is (614) 645-7433, but for permit status questions you&apos;ll generally get
            faster answers through the portal or by emailing the plan examiner assigned to your record
            (their name appears on the permit detail page once review has started).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO SEARCH FOR YOUR PERMIT</h2>
          <p>
            Once you&apos;re on <strong className="text-[#F5F0E8]">permits.columbus.gov</strong>, the search
            process is straightforward:
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Click \"Building\" in the top navigation bar" },
              { n: "2", t: "Select \"Building Permits\" from the dropdown" },
              { n: "3", t: "Choose your search type: Permit Number, Address, or Parcel Number" },
              { n: "4", t: "Enter your search term and click \"Search\"" },
              { n: "5", t: "Click the permit record to view the full detail page" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            Columbus permit numbers follow the format <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">BLD-YYYY-XXXXXX</code> for
            building permits. Electrical permits use <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">ELC-YYYY-XXXXXX</code>, and
            mechanical permits use <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">MEC-YYYY-XXXXXX</code>. Make sure
            you&apos;re searching under the right permit type — a common mistake is looking for an electrical
            sub-permit under the building section and getting zero results.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT EACH STATUS MEANS</h2>
          <p>
            Columbus uses Accela&apos;s standard status terminology, but the workflow has some
            Columbus-specific nuances worth understanding:
          </p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              {
                status: "APPLIED",
                meaning: "Application submitted and received. Not yet assigned to a reviewer.",
                action: "No action needed. Wait for assignment — typically 3–7 business days.",
              },
              {
                status: "IN REVIEW",
                meaning: "Assigned to a plans examiner and currently being reviewed.",
                action: "Check comments tab. Respond immediately if corrections are flagged.",
              },
              {
                status: "CORRECTIONS REQUIRED",
                meaning: "Reviewer has flagged issues. A correction letter has been issued.",
                action: "Address all comments and resubmit revised drawings. Clock restarts.",
              },
              {
                status: "ISSUED",
                meaning: "Permit approved and issued. Work may legally begin.",
                action: "Download permit card, post it on site. Schedule first inspection when ready.",
              },
              {
                status: "INSPECTION PHASE",
                meaning: "Permit is active and inspections are being scheduled or completed.",
                action: "Track each required inspection. Schedule through the portal or at (614) 645-5731.",
              },
              {
                status: "FINALED",
                meaning: "All inspections passed. Project is complete and closed out.",
                action: "Request Certificate of Occupancy if applicable. Archive permit records.",
              },
              {
                status: "VOIDED",
                meaning: "Permit has been cancelled, usually due to non-activity or owner request.",
                action: "A new permit application is required to restart work.",
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TYPICAL APPROVAL TIMELINES IN COLUMBUS</h2>
          <p>
            Columbus BZS publishes target review times, but actual timelines in 2026 depend heavily
            on project complexity, the current review queue, and whether your first submission
            requires corrections.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">RESIDENTIAL PERMITS</h3>
          <p>
            Standard residential projects — new single-family homes, additions, accessory structures —
            typically see permit issuance in <strong className="text-[#F5F0E8]">6 to 10 weeks</strong> from
            application submission. Simple projects with complete plans and no zoning questions can
            come in closer to 4–5 weeks. Projects requiring a variance or Board of Zoning Adjustment
            hearing will add 6–10 weeks on top of the base review time.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">COMMERCIAL PERMITS</h3>
          <p>
            Commercial new construction and major renovations run longer — expect <strong className="text-[#F5F0E8]">10 to 16 weeks</strong> for
            initial review. Columbus does offer an expedited review service for an additional fee, which
            can compress timelines to 3–5 weeks for eligible project types. Contact BZS directly to
            determine if your project qualifies.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">TRADE PERMITS</h3>
          <p>
            Electrical, plumbing, and mechanical permits for straightforward work (like-for-like
            replacements, standard HVAC swaps) are often processed in <strong className="text-[#F5F0E8]">5 to 10 business days</strong>.
            These can sometimes be approved over the counter at the BZS office at 111 N. Front Street
            if the scope is minor enough.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON REASONS COLUMBUS PERMITS GET DELAYED</h2>
          <p>
            Most permit delays in Columbus trace back to one of a handful of consistent issues.
            Knowing them in advance saves real time.
          </p>
          <ul className="space-y-4 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Incomplete plan sets.</strong> Columbus requires engineered drawings
                for most structural work. Missing energy compliance documentation (Ohio&apos;s residential
                energy code is based on IECC 2021), incomplete site plans, or unsigned drawings are
                the most frequent correction triggers.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Zoning questions.</strong> Columbus has several overlay districts —
                including historic preservation overlays, flood plain zones (many near Scioto and
                Olentangy rivers), and neighborhood design overlays — that trigger additional review
                cycles. Check Columbus&apos;s zoning map before submitting if the property is near any
                of these areas.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Inspection backlog.</strong> Columbus&apos;s inspection division
                operates on a first-come first-served scheduling basis. During peak season (May–September),
                inspection slots fill 3–5 days out. If you need a framing inspection on a Friday, call
                or schedule online by Tuesday morning at the latest.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Sub-permit sequencing errors.</strong> Columbus requires that
                certain trade permits be pulled under the parent building permit. If a contractor
                pulls a standalone electrical permit for a project that has an open building permit,
                it creates a records conflict that BZS staff must manually resolve — often adding
                one to two weeks.
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHEN TO CALL VS. WHEN TO WAIT</h2>
          <p>
            The general rule with Columbus BZS: if your permit has been in APPLIED status for more
            than 10 business days without moving to IN REVIEW, it&apos;s worth calling to confirm your
            application was received properly and is in the queue. Sometimes electronic submissions
            have missing attachments that don&apos;t trigger an automatic notification.
          </p>
          <p className="mt-3">
            Once your permit is IN REVIEW, give it the full expected window before escalating. Plan
            examiners are assigned cases in order and calling too early just adds to the phone queue
            without advancing your permit. The exception is if you received a correction letter and
            need to clarify something — in that case, email is faster than calling, and the examiner&apos;s
            contact information is on the comment letter.
          </p>
          <p className="mt-3">
            For permits stuck at CORRECTIONS REQUIRED for more than a few weeks after resubmission,
            the BZS supervisor for your permit type (building, electrical, plumbing, or mechanical)
            can be reached through the main office line. Frame it as a status check, not a complaint.
          </p>
          <p className="mt-3">
            For context on how Columbus timelines compare to other markets, see our breakdown of
            {" "}<Link href="/blog/average-permit-times-texas" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">average permit times in Texas</Link>{" "}
            — Texas cities like Austin tend to run on similar or slightly faster timelines for
            residential work, though commercial projects vary significantly.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">GET NOTIFIED WHEN COLUMBUS ADDS SUPPORT</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo currently monitors permits in Texas cities. Columbus, OH support is in development.
            Request your city to move it up the priority list and get notified the moment it launches.
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
          <Link href="/blog/average-permit-times-texas" className="hover:text-[#FF6B00] transition-colors">
            Average Permit Times in Texas →
          </Link>
        </nav>
      </div>
    </article>
  );
}
