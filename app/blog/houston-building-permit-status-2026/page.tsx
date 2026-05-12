import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Houston Building Permit Status Check — Complete 2026 Guide | ClearedNo",
  description:
    "How to check Houston building permit status online in 2026. Search by address or permit number, understand inspection stages, and track permits automatically.",
  keywords: [
    "Houston building permit status",
    "Houston permit status check 2026",
    "check Houston permit online",
    "houstonpermittingcenter.org permit lookup",
    "Houston inspection status",
    "Houston contractor permit tracking",
    "Harris County building permit",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/houston-building-permit-status-2026" },
  openGraph: {
    title: "Houston Building Permit Status Check — Complete 2026 Guide",
    description:
      "How to check Houston building permit status online in 2026. Search by address or permit number, understand inspection stages, and track permits automatically.",
    url: "https://www.clearedno.com/blog/houston-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Houston Building Permit Status Check — Complete 2026 Guide",
  description:
    "How to check Houston building permit status online in 2026. Search by address or permit number, understand inspection stages, and track permits automatically.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-12",
  dateModified: "2026-05-12",
};

const STATUSES = [
  { status: "Applied", meaning: "Application submitted, under review", next: "Wait for approval" },
  { status: "Approved", meaning: "Permit issued, work can begin", next: "Start construction" },
  { status: "Inspection Requested", meaning: "Inspection scheduled", next: "Wait for inspector" },
  { status: "Inspection Passed", meaning: "Work approved at this stage", next: "Proceed to next phase" },
  { status: "Inspection Failed", meaning: "Corrections required", next: "Fix issues, request re-inspection" },
  { status: "Final", meaning: "All inspections complete", next: "Project complete" },
  { status: "Expired", meaning: "Permit lapsed", next: "Renew or re-apply" },
  { status: "Withdrawn", meaning: "Application pulled by applicant", next: "Re-apply if needed" },
  { status: "Hold", meaning: "Requires action", next: "Contact permitting center" },
];

const ROOFING_STAGES = [
  "Application submitted",
  "Application reviewed and approved (1–5 business days for simple re-roofs)",
  "Work completed",
  "Final inspection requested",
  "Final inspection passed — permit closed",
];

const NEW_CONSTRUCTION_STAGES = [
  "Foundation inspection",
  "Framing inspection",
  "Rough mechanical (electrical, plumbing, HVAC)",
  "Insulation inspection",
  "Drywall inspection (some projects)",
  "Final inspection",
];

const CONTRACTOR_USES = [
  "Get notified immediately when inspections pass (so next trade can mobilize)",
  "Catch holds before they delay the project",
  "Never miss a permit expiration",
  "Track subcontractor permits on their jobs",
];

const FAQS = [
  {
    q: "How long does a Houston building permit take?",
    a: "Simple residential permits (re-roofs, additions under 1,000 sq ft): 1–5 business days. New residential construction: 5–15 business days. Commercial projects: 15–90+ business days depending on complexity and plan review requirements.",
  },
  {
    q: "Can I check Houston permit status by address?",
    a: "Yes — the Houston Permitting Center portal allows address-based search. You'll see all permits associated with that address including historical records.",
  },
  {
    q: "Does Houston require permits for roofing?",
    a: "Yes — any roof replacement or significant repair requires a permit. Simple repairs (patching, individual shingle replacement) may not require a permit, but full replacements do. When in doubt, pull the permit.",
  },
  {
    q: "What happens if work is done without a Houston permit?",
    a: "Unpermitted work creates issues at property sale (title companies look for open permits), can result in stop-work orders and fines, and may require demolition and reconstruction if discovered during a sale or refinance inspection.",
  },
  {
    q: "How do I request a Houston inspection?",
    a: "Through the online portal at houstonpermittingcenter.org or by phone at (832) 394-8880. Requests must be made at least 24 hours in advance. Inspections are typically scheduled for the next available business day.",
  },
  {
    q: "How long is a Houston building permit valid?",
    a: "180 days from issuance. Extensions are available — contact the Permitting Center before expiration. Permits with no inspection activity for 180 days automatically expire.",
  },
];

export default function HoustonPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Houston, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 9 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOUSTON BUILDING PERMIT STATUS CHECK — COMPLETE 2026 GUIDE
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Houston processes more building permits than almost any other city in the United States.
          With no zoning laws and one of the country&apos;s most active construction markets,
          navigating Houston&apos;s permit system is something contractors deal with constantly.
          This guide covers everything you need to know about checking permit status in Houston in 2026.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOUSTON PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">houstonpermittingcenter.org</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Search by</span>
              <span className="text-[#F5F0E8]/80">Address, permit number, or contractor name</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Hours</span>
              <span className="text-[#F5F0E8]/80">Available 24/7 online</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Updates</span>
              <span className="text-[#F5F0E8]/80">Same day as inspection or status change</span>
            </div>
          </div>
          <p className="mt-4">
            Go to the Houston Permitting Center online portal, click &ldquo;Check Permit Status,&rdquo; and enter
            your address or permit number. Houston&apos;s system shows full permit history including all
            inspections, approvals, and any holds or violations.
          </p>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING HOUSTON PERMIT STATUSES</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Status</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6">Meaning</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Next Step</th>
                </tr>
              </thead>
              <tbody>
                {STATUSES.map((row) => (
                  <tr key={row.status} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono whitespace-nowrap">{row.status}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60">{row.meaning}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Permit types */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOUSTON PERMIT TYPES AND INSPECTION STAGES</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">RESIDENTIAL ROOFING PERMITS</h3>
          <p>
            One of the most common permit types in Houston given the city&apos;s hurricane and hail
            exposure. Most re-roofs and full replacements require a permit regardless of project value.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Typical stages:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {ROOFING_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Most Houston roofing permits don&apos;t require a mid-construction inspection — just a final.
            This speeds up the process significantly compared to other cities.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Cost:</strong> Residential roofing permits in Houston
            typically run $100–$300 depending on project value.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW CONSTRUCTION PERMITS</h3>
          <p>More complex — multiple inspection stages are required:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {NEW_CONSTRUCTION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Each stage must pass before the next can proceed. Missing a required inspection means going
            back — inspectors won&apos;t approve work they can&apos;t see. If framing is drywalled before
            a rough inspection, you may be looking at opening walls.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">COMMERCIAL PERMITS</h3>
          <p>
            Houston commercial permits involve plan review before approval. Plan review times vary
            significantly by project type:
          </p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              { type: "Simple tenant improvements", time: "5–15 business days" },
              { type: "New commercial construction", time: "30–90 business days" },
              { type: "Major projects with fire marshal review", time: "60–120+ business days" },
            ].map((row) => (
              <li key={row.type} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{row.type}:</strong> {row.time}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact info */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOUSTON PERMITTING CENTER — FULL CONTACT GUIDE</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>Houston Permitting Center</p>
            <p>1002 Washington Ave, Houston, TX 77002</p>
            <p>Monday–Friday, 8am–4:30pm</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">houstonpermittingcenter.org</strong> — available 24/7
            for status checks, document uploads, and inspection requests. This is the fastest way to
            check status and request inspections outside of business hours.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PHONE</h3>
          <p>
            <strong className="text-[#F5F0E8]">(832) 394-8880</strong> — for status questions that
            aren&apos;t clear in the portal. Hold times vary; mornings early in the week tend to be
            shortest.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Request inspections online through the portal or by phone. Houston requires 24-hour advance
            notice for most inspections. Same-day inspection requests are not typically accommodated.
            Inspections are assigned to the next available inspector by zone — you can&apos;t request a
            specific inspector or time window.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON HOUSTON PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">LONG PLAN REVIEW TIMES</h3>
          <p>
            Houston&apos;s construction boom has strained the permitting center. Commercial plan reviews
            that used to take 2–3 weeks are now running 6–10 weeks for complex projects. Staffing
            has not kept pace with permit volume — a problem most major Texas cities share.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">What to do:</strong> Submit complete, accurate plans the
            first time. Incomplete submissions go to the back of the line when resubmitted. Hire a
            permit expediter for time-sensitive commercial projects — the cost is typically offset by
            even one week of avoided delay.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">FAILED INSPECTIONS</h3>
          <p>
            Houston&apos;s inspectors are thorough. Common failure reasons:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Work not matching approved plans",
              "Missing required materials (hurricane straps, proper flashing)",
              "Incomplete work at time of inspection",
              "Required corrections from previous inspection not completed",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Re-inspection fee:</strong> Houston charges $89 for
            re-inspections after a first failure. Budget for this on any project with complexity.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            Houston permits expire if no inspection is requested within 6 months of issuance, or if
            no inspection passes within 6 months of the last activity.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Watch for:</strong> Permits that stall mid-project. If
            a subcontractor delays, your permit clock keeps running. Set a calendar reminder at the
            5-month mark on any permit where work pace is uncertain.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">CONTRACTOR LICENSE ISSUES</h3>
          <p>
            Houston requires contractors to be registered with the city. If your contractor&apos;s
            registration lapses, inspections can be placed on hold. Verify contractor registration
            at the Permitting Center before starting work — a lapsed registration discovered mid-project
            can freeze all inspection activity until it&apos;s resolved.
          </p>
        </section>

        {/* City vs county */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOUSTON VS HARRIS COUNTY PERMITS</h2>
          <p>
            An important distinction:{" "}
            <strong className="text-[#F5F0E8]">City of Houston permits</strong> cover properties within
            Houston city limits. <strong className="text-[#F5F0E8]">Harris County permits</strong> cover
            unincorporated areas of Harris County outside city limits.
          </p>
          <p className="mt-3">
            If your property is in Katy, Sugar Land, Pearland, or The Woodlands — you may be dealing
            with a different jurisdiction entirely (Fort Bend County, Brazoria County, Montgomery County).
            Each county has its own permit portal, inspection process, and fee schedule.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Surrounding jurisdictions</p>
            <p>Harris County (unincorporated) — hcpid.org</p>
            <p>Fort Bend County — fortbendcountytx.gov</p>
            <p>Brazoria County — brazoria-county.com</p>
            <p>Montgomery County — mctx.org</p>
          </div>
          <p className="mt-4">
            Always verify jurisdiction before pulling permits. The wrong jurisdiction means starting
            over — fees don&apos;t transfer and approval timelines restart from zero.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING HOUSTON PERMITS AUTOMATICALLY</h2>
          <p>
            If you&apos;re a contractor managing multiple Houston permits simultaneously, daily manual
            status checks add up. A project with 5 active permits across different stages means 5
            separate lookups every morning — plus the constant risk that a status change happened
            yesterday and you haven&apos;t seen it yet.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker monitors your Houston permits automatically and sends email
            alerts when any status changes — inspection passes, failures, holds, or finals.
          </p>
          <p className="mt-3">Contractors use it to:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {CONTRACTOR_USES.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Stats */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOUSTON PERMIT STATISTICS 2026</h2>
          <p>
            Houston consistently ranks among the top US cities for permit volume — a direct result of
            its no-zoning policy and rapid population growth:
          </p>
          <ul className="space-y-3 mt-4 ml-4">
            {[
              "60,000–80,000 residential permits issued annually",
              "15,000–20,000 commercial permits annually",
              "Peak months: March–June and September–November",
              "Average residential approval time: 3–7 business days",
              "Average commercial approval time: 15–90 business days depending on complexity",
            ].map((stat) => (
              <li key={stat} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{stat}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            The no-zoning policy is what drives volume: Houston allows residential and commercial
            development to mix without the variance process other cities require. More projects start,
            more permits get pulled. The tradeoff is a permitting center that&apos;s perpetually managing
            high demand.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR HOUSTON PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your Houston permits every 2 hours. The second an inspection passes,
            fails, or a hold lands — you get an email. Stop checking houstonpermittingcenter.org
            every morning. First month free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              START TRACKING FREE →
            </Link>
            <Link
              href="/houston"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              HOUSTON PERMIT CHECKER →
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
          <Link href="/blog/houston-tx-permit-tracking-contractors" className="hover:text-[#FF6B00] transition-colors">
            Houston TX Permit Tracking for Contractors →
          </Link>
        </nav>
      </div>
    </article>
  );
}
