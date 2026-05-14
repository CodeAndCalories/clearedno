import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cleveland OH Building Permit Status — How to Check in 2026 | ClearedNo",
  description:
    "Check Cleveland Ohio building permit status online in 2026. Search Cuyahoga County permits by address or number. Roofing, electrical, new construction timelines.",
  keywords: [
    "Cleveland Ohio building permit status",
    "Cleveland permit status check 2026",
    "Cuyahoga County building permit lookup",
    "Cleveland Building Department permit search",
    "Cleveland Ohio inspection status",
    "Cleveland contractor permit tracking",
    "Cuyahoga County permit search",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/cleveland-building-permit-status-2026" },
  openGraph: {
    title: "Cleveland OH Building Permit Status — How to Check in 2026",
    description:
      "Check Cleveland Ohio building permit status online in 2026. Search Cuyahoga County permits by address or number. Roofing, electrical, new construction timelines.",
    url: "https://www.clearedno.com/blog/cleveland-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cleveland OH Building Permit Status — How to Check in 2026",
  description:
    "Check Cleveland Ohio building permit status online in 2026. Search Cuyahoga County permits by address or number. Roofing, electrical, new construction timelines.",
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
  { status: "Hold", meaning: "Action required", next: "Contact Building Department" },
];

const ROOFING_STAGES = [
  "Application submitted through Cleveland Building Department ePlans portal",
  "Application reviewed and approved (3–7 business days for simple re-roofs)",
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
  "Track permits across Cleveland city, Parma, Lakewood, and Euclid without juggling portals",
  "Never miss a permit expiration across multiple active jobs",
];

const SUBURBS = [
  { city: "Parma", dept: "City of Parma Building Department — separate portal" },
  { city: "Lakewood", dept: "City of Lakewood Building Department — separate portal" },
  { city: "Euclid", dept: "City of Euclid Building Department — separate portal" },
  { city: "Strongsville", dept: "City of Strongsville Building Department" },
  { city: "Mentor", dept: "City of Mentor Building Department" },
  { city: "Solon", dept: "City of Solon Building Department" },
  { city: "Westlake", dept: "City of Westlake Building Department" },
  { city: "North Olmsted", dept: "City of North Olmsted Building Department" },
];

const FAQS = [
  {
    q: "How long does a Cleveland building permit take?",
    a: "Residential roofing: 3–7 business days. New residential construction: 15–25 business days. Commercial projects: 30–90+ business days. Surge periods after hail events or winter storm seasons can extend all timelines.",
  },
  {
    q: "Can I check Cleveland permit status by address?",
    a: "Yes — the Cleveland Building Department ePlans portal allows address-based search. You'll see all permits associated with that address including historical records.",
  },
  {
    q: "Do suburbs like Parma and Lakewood use the Cleveland permit system?",
    a: "No — suburban cities in Cuyahoga County each maintain their own building departments and permit portals. Parma, Lakewood, Euclid, and others have separate systems from the City of Cleveland.",
  },
  {
    q: "Does Cleveland require permits for roofing?",
    a: "Yes — full roof replacements require a permit in Cleveland. Minor repairs may not, but full replacements always do. When in doubt, pull the permit.",
  },
  {
    q: "What are ice dam permits in Cleveland?",
    a: "Ice dams are a common winter issue in Northeast Ohio. Damage from ice dams often requires permitted repair work — roof deck replacement, fascia, soffit, and sometimes structural repairs. These are common permit types November through March.",
  },
  {
    q: "What's the difference between Cleveland city and Cuyahoga County permits?",
    a: "Cleveland city permits cover properties within city limits. Cuyahoga County's suburban cities each have their own permit systems. Unincorporated Cuyahoga County properties have yet another separate process.",
  },
];

const RELATED = [
  { title: "Columbus OH Building Permit Status — Complete 2026 Guide", href: "/blog/columbus-building-permit-status-2026" },
  { title: "Akron OH Building Permit Status — How to Check in 2026", href: "/blog/akron-building-permit-status-2026" },
  { title: "Cincinnati OH Building Permit Status — Full 2026 Guide", href: "/blog/cincinnati-building-permit-status-2026" },
];

export default function ClevelandPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Cleveland, OH</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">May 2026 · 9 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          CLEVELAND OH BUILDING PERMIT STATUS — HOW TO CHECK IN 2026
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Cleveland and Cuyahoga County deal with a unique permitting challenge: the city itself
          uses one system, while dozens of incorporated suburbs each run their own. Whether you&apos;re
          tracking a roofing job in Parma or a commercial renovation in downtown Cleveland, this guide
          covers what you need to check permit status in 2026.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CLEVELAND PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">Cleveland Building Department ePlans portal</span>
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
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Note</span>
              <span className="text-[#F5F0E8]/80">Suburbs use separate portals — see jurisdiction guide below</span>
            </div>
          </div>
          <p className="mt-4">
            For permits within Cleveland city limits, use the Cleveland Building Department ePlans
            portal. Enter your address or permit number to see status, inspection history, and any
            holds. Cleveland tracks building, electrical, plumbing, and mechanical permits — you may
            need to search multiple types for a full picture.
          </p>
        </section>

        {/* Jurisdiction */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CLEVELAND CITY VS CUYAHOGA COUNTY — JURISDICTION GUIDE</h2>
          <p>
            This is where most contractors working the Cleveland metro get tripped up. Cleveland city
            limits represent only a portion of Cuyahoga County. Every incorporated suburb — Parma,
            Lakewood, Euclid, and many others — operates its own building department with its own
            portal, fees, and inspection schedule.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Separate permit systems in Cuyahoga County</p>
            {SUBURBS.map((s) => (
              <p key={s.city}>{s.city} — {s.dept}</p>
            ))}
          </div>
          <p className="mt-4">
            Always confirm jurisdiction before pulling permits. Submitting to the wrong department
            means starting over entirely — fees don&apos;t transfer and timelines restart from zero.
          </p>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING CLEVELAND PERMIT STATUSES</h2>
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CLEVELAND PERMIT TYPES AND COMMON TIMELINES</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">RESIDENTIAL ROOFING PERMITS</h3>
          <p>
            Cuyahoga County sees multiple hail events annually, plus significant winter storm damage.
            Roofing is one of the most common permit types in the Cleveland market year-round.
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
              { type: "Simple re-roof", time: "3–7 business days" },
              { type: "Roof with structural modifications", time: "10–15 business days" },
              { type: "Final inspection", time: "Required for all permitted work" },
            ].map((row) => (
              <li key={row.type} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{row.type}:</strong> {row.time}
                </div>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ICE DAM AND WINTER DAMAGE PERMITS</h3>
          <p>
            Northeast Ohio winters produce ice dams — a uniquely local permit type that spikes
            November through March. Ice dam damage often requires permitted repair work including
            roof deck replacement, fascia, soffit, and in some cases structural repairs to rafters
            or sheathing. These permits follow the same roofing process but are often initiated
            mid-winter when portals are less congested.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW RESIDENTIAL CONSTRUCTION</h3>
          <p>Multiple inspection stages required — each must pass before proceeding:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {NEW_CONSTRUCTION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">Average new residential timeline: 15–25 business days for initial approval.</p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">COMMERCIAL PERMITS</h3>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              { type: "Minor tenant improvements", time: "15–30 business days" },
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CLEVELAND BUILDING DEPARTMENT — CONTACT INFORMATION</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>Cleveland Division of Building and Housing</p>
            <p>601 Lakeside Ave E, Cleveland, OH 44114</p>
            <p>Monday–Friday, 8am–4pm</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">Cleveland Building Department ePlans portal</strong> —
            available 24/7 for status checks, permit applications, and inspection requests. The portal
            is the fastest way to check status and submit documentation outside of business hours.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Request inspections through the portal. Cleveland requires advance notice for most
            inspections. Inspections are zone-assigned to the next available inspector — you cannot
            request a specific time window.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON CLEVELAND PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">WRONG JURISDICTION SUBMISSIONS</h3>
          <p>
            The most common mistake contractors make in the Cleveland market: pulling a city of
            Cleveland permit for a property that&apos;s actually in Parma, Lakewood, or Euclid. The city
            limits are not intuitive — a property with a Cleveland mailing address may be in an
            incorporated suburb.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">What to do:</strong> Verify jurisdiction before every
            permit pull. Use the city&apos;s GIS map or call the building department for the address.
            Wrong jurisdiction means starting over from scratch.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">HAIL SEASON AND WINTER SURGE</h3>
          <p>
            Cuyahoga County experiences multiple hail events per year plus significant winter damage.
            Unlike Texas or the Southwest, Cleveland has two distinct surge periods: spring/summer
            (hail) and late fall/winter (ice dams, wind, freeze-thaw damage). Processing times
            extend during both peak periods.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            Cleveland permits expire if no inspection activity occurs within the validity period.
            Ohio winters can delay projects — a permit pulled in October may see no inspection
            activity until March. Track expiration dates carefully on any job that stalls seasonally.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">OLDER HOUSING STOCK</h3>
          <p>
            Cleveland has one of the oldest housing stocks in Ohio. Pre-1960 homes often reveal
            unexpected conditions during construction — asbestos, knob-and-tube wiring, undersized
            structural members — that require additional permits and inspections not anticipated in
            the original scope. Budget time for supplemental permits on older properties.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING CLEVELAND PERMITS AUTOMATICALLY</h2>
          <p>
            For contractors working across Cleveland city and multiple Cuyahoga County suburbs,
            automatic tracking eliminates daily manual checks across multiple portals. ClearedNo
            covers Cuyahoga County property records — monitoring your permits and sending email
            alerts the moment any status changes.
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
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR CLEVELAND PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your Cleveland and Cuyahoga County permits every 2 hours. The second
            an inspection passes, fails, or a hold lands — you get an email. Stop juggling multiple
            portals every morning. First month free.
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
              CLEVELAND PERMIT CHECKER →
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
          <Link href="/blog/akron-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            ← Akron OH Permit Status 2026
          </Link>
          <Link href="/blog/columbus-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            Columbus OH Permit Status 2026 →
          </Link>
        </nav>
      </div>
    </article>
  );
}
