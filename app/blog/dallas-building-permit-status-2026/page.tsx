import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dallas Building Permit Status Check — Complete 2026 Guide | ClearedNo",
  description:
    "How to check Dallas building permit status online in 2026. Search by address or permit number, understand inspection stages, and track permits automatically.",
  keywords: [
    "Dallas building permit status",
    "Dallas permit status check 2026",
    "check Dallas permit online",
    "dallascityhall.com permit lookup",
    "Dallas inspection status",
    "Dallas contractor permit tracking",
    "Dallas Development Services",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/dallas-building-permit-status-2026" },
  openGraph: {
    title: "Dallas Building Permit Status Check — Complete 2026 Guide",
    description:
      "How to check Dallas building permit status online in 2026. Search by address or permit number, understand inspection stages, and track permits automatically.",
    url: "https://www.clearedno.com/blog/dallas-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Dallas Building Permit Status Check — Complete 2026 Guide",
  description:
    "How to check Dallas building permit status online in 2026. Search by address or permit number, understand inspection stages, and track permits automatically.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-05-13",
  dateModified: "2026-05-13",
};

const STATUSES = [
  { status: "Submitted", meaning: "Application received, pending review", next: "Wait for plan review" },
  { status: "Under Review", meaning: "Plans being reviewed by staff", next: "Wait for approval" },
  { status: "Approved", meaning: "Permit issued, work can begin", next: "Start construction" },
  { status: "Inspection Requested", meaning: "Inspection scheduled", next: "Wait for inspector" },
  { status: "Passed", meaning: "Work approved at this stage", next: "Proceed to next phase" },
  { status: "Failed", meaning: "Corrections required", next: "Fix issues, request re-inspection" },
  { status: "Final", meaning: "All inspections complete", next: "Project closed" },
  { status: "Expired", meaning: "Permit lapsed without final", next: "Renew or re-apply" },
  { status: "Hold", meaning: "Action required", next: "Contact Development Services" },
];

const ROOFING_STAGES = [
  "Application submitted",
  "Application reviewed and approved (1–3 business days for simple re-roofs)",
  "Work completed",
  "Final inspection requested",
  "Final inspection passed — permit closed",
];

const NEW_CONSTRUCTION_STAGES = [
  "Site plan approval",
  "Foundation permit and inspection",
  "Framing permit and inspection",
  "Rough mechanical (electrical, plumbing, HVAC) inspections",
  "Insulation inspection",
  "Final inspection and certificate of occupancy",
];

const CONTRACTOR_USES = [
  "Get notified immediately when inspections pass (so the next trade can mobilize)",
  "Catch holds before they stall a project",
  "Never miss a permit expiration",
  "Track subcontractor permits across metroplex jurisdictions",
];

const SUBURBS = [
  { city: "Plano", dept: "City of Plano Development Services" },
  { city: "Irving", dept: "City of Irving Development Services" },
  { city: "Garland", dept: "City of Garland Building Inspections" },
  { city: "Mesquite", dept: "City of Mesquite Building Inspections" },
  { city: "Carrollton", dept: "City of Carrollton Development Services" },
  { city: "Richardson", dept: "City of Richardson Building Inspections" },
  { city: "Frisco", dept: "City of Frisco Building Inspections" },
  { city: "McKinney", dept: "City of McKinney Development Services" },
];

const FAQS = [
  {
    q: "How long does a Dallas building permit take?",
    a: "Residential roofing: 1–5 business days. New residential construction: 15–30 business days. Commercial projects: 30–120+ business days depending on complexity. Surge periods after hail events can extend all timelines significantly.",
  },
  {
    q: "Can I check Dallas permit status by address?",
    a: "Yes — the Dallas Development Services portal allows address-based search. You'll see all permits associated with that address including historical records.",
  },
  {
    q: "Does Dallas require permits for roofing?",
    a: "Yes — any full roof replacement requires a permit. Simple repairs under a certain value threshold may not, but full replacements do. When in doubt, pull the permit.",
  },
  {
    q: "What's the re-inspection fee in Dallas?",
    a: "Dallas charges a re-inspection fee for failed inspections — typically $75–$150 depending on permit type. Fees increase for multiple failures on the same inspection.",
  },
  {
    q: "How do I find a licensed roofing contractor in Dallas?",
    a: "Verify Texas contractor registration through the Texas Department of Licensing and Regulation (TDLR) at tdlr.texas.gov. Ask for the contractor's TDLR registration number before signing anything.",
  },
  {
    q: "Does Dallas have a roofing permit lookup by address?",
    a: "Yes — through the Dallas Development Services portal at dallascityhall.com. Search by address to see all roofing permits associated with a property.",
  },
];

export default function DallasPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Dallas, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 10 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          DALLAS BUILDING PERMIT STATUS CHECK — COMPLETE 2026 GUIDE
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Dallas is one of the fastest-growing construction markets in the United States. With billions
          in development happening across Dallas County and the surrounding metroplex, the city&apos;s
          permitting system processes tens of thousands of permits annually — and knowing how to navigate
          it saves contractors significant time.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DALLAS PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">dallascityhall.com — Development Services department</span>
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
              <span className="text-[#F5F0E8]/80">Within 24 hours of status change</span>
            </div>
          </div>
          <p className="mt-4">
            Go to Dallas Development Services online portal, navigate to permit search, and enter your
            address or permit number. Dallas tracks building, electrical, mechanical, and plumbing permits
            separately — you may need to search multiple permit types for a full picture.
          </p>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING DALLAS PERMIT STATUSES</h2>
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DALLAS PERMIT TYPES AND COMMON TIMELINES</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">RESIDENTIAL ROOFING PERMITS</h3>
          <p>
            Dallas sees heavy roofing activity due to North Texas hail storms. Roofing permits are among
            the fastest to process — and among the most common permit types in the entire DFW market.
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
          <ul className="space-y-3 mt-4 ml-4">
            {[
              { type: "Simple re-roof", time: "1–3 business days for approval" },
              { type: "Roof replacement with structural changes", time: "5–10 business days" },
              { type: "Final inspection", time: "Required for all permitted roof replacements" },
            ].map((row) => (
              <li key={row.type} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{row.type}:</strong> {row.time}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Cost:</strong> Dallas residential roofing permits
            typically run $100–$400 depending on project value.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW RESIDENTIAL CONSTRUCTION</h3>
          <p>
            Dallas&apos;s housing boom means high permit volume for new construction. Multiple inspection
            stages are required and each must pass before proceeding:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {NEW_CONSTRUCTION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Average new residential construction timeline: 15–30 business days for initial approval.
            Each stage must pass before the next can proceed — a failed inspection means going back,
            and an inspector won&apos;t approve work that&apos;s been covered before it was inspected.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">COMMERCIAL PERMITS</h3>
          <p>Dallas commercial permitting runs significantly longer due to plan review requirements:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              { type: "Minor tenant improvements", time: "10–20 business days" },
              { type: "Major renovations", time: "30–60 business days" },
              { type: "New commercial construction", time: "60–120+ business days" },
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DALLAS DEVELOPMENT SERVICES — CONTACT INFORMATION</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>Dallas Development Services</p>
            <p>1500 Marilla St, Dallas, TX 75201</p>
            <p>Monday–Friday, 8am–4:30pm</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">dallascityhall.com/departments/sustainabledevelopment</strong> —
            available 24/7 for status checks, document uploads, and inspection requests. This is the
            fastest way to track permits and request inspections outside of business hours.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PHONE</h3>
          <p>
            <strong className="text-[#F5F0E8]">(214) 948-4480</strong> — for status questions that
            aren&apos;t clear in the portal. Hold times vary; calling early in the morning early in the
            week tends to be fastest.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Request inspections through the online portal or by phone. Dallas requires 24-hour advance
            notice for most inspections. Same-day requests are not typically accommodated. Inspections
            are assigned to the next available inspector by zone — you cannot request a specific
            inspector or time window.
          </p>
        </section>

        {/* Metroplex jurisdiction guide */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DALLAS VS SURROUNDING CITIES — JURISDICTION GUIDE</h2>
          <p>
            Dallas proper covers a large area but the metroplex has dozens of separate municipalities,
            each with their own permitting systems. A property that appears to be &ldquo;in Dallas&rdquo;
            may actually be in an incorporated suburb with completely different rules, fees, and timelines.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Separate permit systems in the metroplex</p>
            {SUBURBS.map((s) => (
              <p key={s.city}>{s.city} — {s.dept}</p>
            ))}
          </div>
          <p className="mt-4">
            Always verify which city&apos;s jurisdiction your project falls under before pulling permits.
            Dallas city limits are large but irregular. The wrong jurisdiction means starting over —
            fees don&apos;t transfer and approval timelines restart from zero.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON DALLAS PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">HIGH VOLUME DELAYS</h3>
          <p>
            Dallas&apos;s construction boom has significantly increased permit volume. Plan review times
            that previously ran 5–7 business days are now 10–15 for residential and 30–60+ for
            commercial. Staffing has not kept pace with permit volume — a problem most major Texas
            cities share.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">What to do:</strong> Submit complete, accurate plans
            the first time. Incomplete submissions restart the clock. For commercial projects, consider
            hiring a permit expediter — the cost is typically offset by even one week of avoided delay.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">HAIL SEASON SURGE</h3>
          <p>
            North Texas gets some of the country&apos;s most damaging hail. After major DFW hail events,
            roofing permit applications surge — sometimes 500–1,000% above normal volume. Processing
            times during surge periods can extend 2–3x normal timelines.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">What to do:</strong> Submit immediately after a storm
            event. The queue fills fast and early submissions get earlier review. Out-of-state storm
            chasers flood the market after every major event — local contractors who move first win the
            jobs.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            Dallas permits expire if no inspection activity occurs within 180 days of issuance.
            Projects that stall mid-construction — waiting on subcontractors, materials, or financing
            — risk permit expiration.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Watch for:</strong> Permits with no recent inspection
            activity. Renewal is available but requires re-application and fees. Set a calendar reminder
            at the 5-month mark on any permit where work pace is uncertain.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">CONTRACTOR REGISTRATION</h3>
          <p>
            Dallas requires contractor registration with Development Services. Expired registrations
            cause inspection holds. Verify registration status before starting any permitted work — a
            lapsed registration discovered mid-project can freeze all inspection activity until
            it&apos;s resolved.
          </p>
        </section>

        {/* Hail season deep dive */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DALLAS HAIL SEASON AND ROOFING PERMITS</h2>
          <p>
            North Texas sits in one of the most active hail corridors in the country. The Dallas-Fort
            Worth area averages multiple significant hail events per year — storms with 1-inch-plus
            hailstones that trigger insurance claims and roofing replacements across thousands of
            properties simultaneously.
          </p>
          <p className="mt-3">After a major DFW hail event:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              "Permit applications spike immediately across all Dallas jurisdictions",
              "Out-of-state storm chasers flood the market",
              "Local contractors book 4–8 weeks out within days of the storm",
              "Dallas Development Services extends hours during surge periods",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            For roofing contractors in Dallas, speed matters enormously. The difference between getting
            a job and losing it to a competitor often comes down to who calls the homeowner first —
            and who can pull the permit fastest.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING DALLAS PERMITS AUTOMATICALLY</h2>
          <p>
            Managing multiple Dallas permits simultaneously means tracking building, electrical,
            plumbing, and mechanical permits separately — across potentially multiple suburb
            jurisdictions if you work across the metroplex. A contractor with 10 active jobs could
            easily be juggling 30+ permits across 5 different city portals.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker monitors your permits automatically and sends email alerts
            when any status changes — inspection passes, failures, holds, or finals.
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DALLAS PERMIT STATISTICS 2026</h2>
          <ul className="space-y-3 mt-4 ml-4">
            {[
              "Dallas processes 40,000–60,000 permits annually",
              "Peak months: March–July (spring construction and hail season)",
              "Average residential roofing approval: 1–5 business days",
              "Average new residential approval: 15–30 business days",
              "Average commercial approval: 30–120 business days",
            ].map((stat) => (
              <li key={stat} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{stat}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Dallas&apos;s continued population growth — the DFW metro adds hundreds of thousands of
            residents annually — keeps construction volume elevated year over year. Permit volume is
            expected to remain high through 2027 as housing and commercial development continues to
            outpace supply across the region.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR DALLAS PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your Dallas permits every 2 hours. The second an inspection passes,
            fails, or a hold lands — you get an email. Stop manually checking dallascityhall.com
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
              href="/"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              DALLAS PERMIT CHECKER →
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
          <Link href="/blog/houston-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            Houston Building Permit Status 2026 →
          </Link>
        </nav>
      </div>
    </article>
  );
}
