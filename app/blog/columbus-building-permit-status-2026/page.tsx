import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Columbus OH Building Permit Status — Complete 2026 Guide | ClearedNo",
  description:
    "Check Columbus Ohio building permit status online in 2026. Search by address or permit number at permits.columbus.gov. Roofing, new construction, commercial timelines.",
  keywords: [
    "Columbus Ohio building permit status",
    "Columbus permit status check 2026",
    "permits.columbus.gov permit lookup",
    "Franklin County building permit",
    "Columbus Ohio inspection status",
    "Columbus contractor permit tracking",
    "Columbus Development Services permit",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/columbus-building-permit-status-2026" },
  openGraph: {
    title: "Columbus OH Building Permit Status — Complete 2026 Guide",
    description:
      "Check Columbus Ohio building permit status online in 2026. Search by address or permit number at permits.columbus.gov. Roofing, new construction, commercial timelines.",
    url: "https://www.clearedno.com/blog/columbus-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Columbus OH Building Permit Status — Complete 2026 Guide",
  description:
    "Check Columbus Ohio building permit status online in 2026. Search by address or permit number at permits.columbus.gov. Roofing, new construction, commercial timelines.",
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
  { status: "Hold", meaning: "Action required", next: "Contact Building Services" },
];

const ROOFING_STAGES = [
  "Application submitted at permits.columbus.gov or in person",
  "Application reviewed and approved (2–5 business days for simple re-roofs)",
  "Work completed",
  "Final inspection requested",
  "Final inspection passed — permit closed",
];

const NEW_CONSTRUCTION_STAGES = [
  "Site plan review and approval",
  "Foundation permit and inspection",
  "Framing inspection",
  "Rough mechanical (electrical, plumbing, HVAC) inspections",
  "Insulation inspection",
  "Drywall inspection (select projects)",
  "Final inspection and certificate of occupancy",
];

const CONTRACTOR_USES = [
  "Get notified immediately when inspections pass (so the next trade can mobilize)",
  "Catch holds before they stall a project",
  "Never miss a permit expiration across multiple active jobs",
  "Track permits in both Columbus city limits and Franklin County",
];

const SUBURBS = [
  { city: "Dublin", dept: "City of Dublin Building Standards" },
  { city: "Westerville", dept: "City of Westerville Building Division" },
  { city: "Hilliard", dept: "City of Hilliard Building Department" },
  { city: "Gahanna", dept: "City of Gahanna Building Department" },
  { city: "Grove City", dept: "City of Grove City Building Division" },
  { city: "Reynoldsburg", dept: "City of Reynoldsburg Building Department" },
  { city: "New Albany", dept: "City of New Albany Building Department" },
  { city: "Pickerington", dept: "Fairfield County Building" },
];

const FAQS = [
  {
    q: "How long does a Columbus building permit take?",
    a: "Residential roofing: 2–5 business days. New residential construction: 10–20 business days. Commercial projects: 30–90+ business days. Surge periods after hail events can extend all timelines.",
  },
  {
    q: "Can I check Columbus permit status by address?",
    a: "Yes — permits.columbus.gov allows address-based search. You'll see all permits associated with that address including historical records and inspection history.",
  },
  {
    q: "Does Columbus require permits for roofing?",
    a: "Yes — any full roof replacement requires a permit in Columbus. Minor repairs may not, but full replacements do. When in doubt, pull the permit.",
  },
  {
    q: "What's the re-inspection fee in Columbus?",
    a: "Columbus charges $75–$100 for re-inspections after a failed inspection. Fees may increase for repeat failures on the same stage.",
  },
  {
    q: "What is Franklin County's role in Columbus permitting?",
    a: "Properties within Columbus city limits use Columbus Building Services. Properties in unincorporated Franklin County use Franklin County Building Inspection. Always verify which jurisdiction applies before pulling a permit.",
  },
  {
    q: "When is peak permit season in Columbus?",
    a: "April through September — driven by spring construction season and Ohio's hail corridor activity. Franklin County sits in a primary hail path, making late spring and summer the busiest months for roofing permits.",
  },
];

const RELATED = [
  { title: "Cleveland OH Building Permit Status — How to Check in 2026", href: "/blog/cleveland-building-permit-status-2026" },
  { title: "Cincinnati OH Building Permit Status — Full 2026 Guide", href: "/blog/cincinnati-building-permit-status-2026" },
  { title: "Akron OH Building Permit Status — How to Check in 2026", href: "/blog/akron-building-permit-status-2026" },
];

export default function ColumbusPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Columbus, OH</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 9 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          COLUMBUS OH BUILDING PERMIT STATUS — COMPLETE 2026 GUIDE
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Columbus is one of the fastest-growing cities in the Midwest. Franklin County&apos;s booming
          population and active construction market mean the city&apos;s permitting system handles
          high volume year-round — with peak demand driven by spring construction season and Ohio&apos;s
          hail corridor activity. Here&apos;s everything you need to check permit status in Columbus in 2026.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COLUMBUS PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">permits.columbus.gov — Columbus Building Services</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Search by</span>
              <span className="text-[#F5F0E8]/80">Address or permit number</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Hours</span>
              <span className="text-[#F5F0E8]/80">Available 24/7 online</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Peak season</span>
              <span className="text-[#F5F0E8]/80">April–September</span>
            </div>
          </div>
          <p className="mt-4">
            Navigate to permits.columbus.gov, use the permit search function, and enter your address
            or permit number. Columbus tracks building, electrical, plumbing, and mechanical permits
            separately — you may need to search multiple permit types to get a complete picture of a
            property&apos;s permit activity.
          </p>
        </section>

        {/* City vs County */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COLUMBUS CITY VS FRANKLIN COUNTY — JURISDICTION GUIDE</h2>
          <p>
            Columbus city limits cover a large portion of Franklin County, but not all of it. Properties
            in unincorporated Franklin County — and in surrounding incorporated suburbs — use separate
            permitting systems entirely.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Jurisdiction split</p>
            <p>Columbus city limits → Columbus Building Services at permits.columbus.gov</p>
            <p>Franklin County (unincorporated) → Franklin County Building Inspection</p>
          </div>
          <p className="mt-4">
            Columbus suburbs each maintain their own permit portals. Always verify which city&apos;s
            jurisdiction your project falls under before pulling permits. The wrong jurisdiction means
            starting over — fees don&apos;t transfer and timelines restart from zero.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Separate permit systems in the Columbus metro</p>
            {SUBURBS.map((s) => (
              <p key={s.city}>{s.city} — {s.dept}</p>
            ))}
          </div>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING COLUMBUS PERMIT STATUSES</h2>
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COLUMBUS PERMIT TYPES AND COMMON TIMELINES</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">RESIDENTIAL ROOFING PERMITS</h3>
          <p>
            Franklin County sits in Ohio&apos;s primary hail corridor, making roofing one of the most
            common permit types in Columbus. Spring and summer storms produce significant hail damage
            across the metro annually.
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
              { type: "Simple re-roof", time: "2–5 business days" },
              { type: "Roof replacement with structural changes", time: "7–14 business days" },
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

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW RESIDENTIAL CONSTRUCTION</h3>
          <p>Columbus&apos;s rapid population growth keeps new residential construction volume high. Multiple inspections are required:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {NEW_CONSTRUCTION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Average new residential construction timeline: 10–20 business days for initial approval.
            Each stage must pass before the next can proceed.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">COMMERCIAL PERMITS</h3>
          <p>Commercial permitting runs significantly longer due to plan review:</p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              { type: "Minor tenant improvements", time: "10–20 business days" },
              { type: "Major renovations", time: "30–60 business days" },
              { type: "New commercial construction", time: "60–90+ business days" },
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

        {/* Contact */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COLUMBUS BUILDING SERVICES — CONTACT INFORMATION</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>Columbus Building Services</p>
            <p>757 Carolyn Ave, Columbus, OH 43224</p>
            <p>Monday–Friday, 8am–4:30pm</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">permits.columbus.gov</strong> — available 24/7 for
            status checks, permit applications, document uploads, and inspection requests.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Request inspections through the online portal. Columbus requires advance notice for
            most inspections — same-day requests are generally not accommodated. Inspections are
            assigned to the next available inspector by zone.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON COLUMBUS PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">HAIL SEASON VOLUME SURGE</h3>
          <p>
            Franklin County sits squarely in Ohio&apos;s primary hail corridor. After a significant
            storm event, permit applications surge — especially for roofing. Processing times during
            surge periods extend 2–3x normal timelines as Building Services handles sudden spikes in volume.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">What to do:</strong> Submit immediately after a storm.
            The queue fills fast. Peak months April through September require the fastest turnaround —
            contractors who submit first get reviewed first.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">FAILED INSPECTIONS</h3>
          <p>Common failure reasons in Columbus:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Work not matching approved plans",
              "Improper flashing installation on roofing permits",
              "Incomplete work at time of inspection",
              "Missing required materials or fire blocking",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Re-inspection fee:</strong> Columbus charges $75–$100
            for re-inspections after a first failure.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            Columbus permits expire if no inspection activity occurs within the permit&apos;s validity
            period. Projects that stall mid-construction risk expiration and re-application.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Watch for:</strong> Permits with no recent activity.
            Set a reminder before expiration on any job where work pace is uncertain.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">CONTRACTOR REGISTRATION</h3>
          <p>
            Columbus requires contractor registration. Expired registrations result in inspection holds.
            Verify registration status before starting any permitted work — a lapsed registration
            discovered mid-project can freeze all inspection activity.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING COLUMBUS PERMITS AUTOMATICALLY</h2>
          <p>
            For contractors managing multiple Columbus permits across city and county jurisdictions,
            automatic tracking eliminates daily manual status checks. ClearedNo covers Franklin County
            with 271,000+ property records — monitoring your permits and sending email alerts the
            moment any status changes.
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

        {/* Related posts */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">OTHER OHIO PERMIT GUIDES</h2>
          <div className="space-y-3">
            {RELATED.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="flex items-center gap-3 border border-[#FF6B00]/20 p-4 hover:border-[#FF6B00]/50 transition-colors group"
              >
                <span className="text-[#FF6B00] font-mono text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                <span className="text-xs text-[#F5F0E8]/60 group-hover:text-[#F5F0E8] transition-colors">{post.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR COLUMBUS PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your Columbus permits every 2 hours across Franklin County&apos;s
            271,000+ property records. The second an inspection passes, fails, or a hold lands —
            you get an email. Stop checking permits.columbus.gov every morning. First month free.
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
              COLUMBUS PERMIT CHECKER →
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
          <Link href="/blog/cleveland-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            ← Cleveland OH Permit Status 2026
          </Link>
          <Link href="/blog/cincinnati-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            Cincinnati OH Permit Status 2026 →
          </Link>
        </nav>
      </div>
    </article>
  );
}
