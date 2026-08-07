import type { Metadata } from "next";
import Link from "next/link";
import PermitAlertSignup from "@/app/permit-alert-signup";
import { liveCityList } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Grand Rapids MI Building Permit Status — 2026 Guide | ClearedNo",
  description:
    "Check Grand Rapids Michigan building permit status online. Home remodel, addition, and roofing permit timelines, fees, and requirements for 2026.",
  keywords: [
    "Grand Rapids building permit status",
    "Grand Rapids home remodel permit",
    "Grand Rapids home addition permit",
    "City of Grand Rapids Building Safety",
    "Kent County building permit",
    "Grand Rapids roofing permit",
    "Michigan residential code permit",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/grand-rapids-building-permit-status-2026" },
  openGraph: {
    title: "Grand Rapids MI Building Permit Status — 2026 Guide",
    description:
      "Check Grand Rapids Michigan building permit status online. Home remodel, addition, and roofing permit timelines, fees, and requirements for 2026.",
    url: "https://www.clearedno.com/blog/grand-rapids-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Grand Rapids MI Building Permit Status — 2026 Guide",
  description:
    "Check Grand Rapids Michigan building permit status online. Home remodel, addition, and roofing permit timelines, fees, and requirements for 2026.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
};

const STATUSES = [
  { status: "Submitted", meaning: "Application received by Building Safety", next: "Wait for plan review assignment" },
  { status: "In Review", meaning: "Plan reviewer checking against Michigan Residential Code", next: "Wait for approval or corrections" },
  { status: "Corrections Required", meaning: "Plan reviewer found deficiencies", next: "Revise plans and resubmit" },
  { status: "Ready to Issue", meaning: "Approved — fees due before issuance", next: "Pay permit fees" },
  { status: "Issued", meaning: "Permit active, work can begin", next: "Start construction, schedule inspections" },
  { status: "Inspection Scheduled", meaning: "Inspector assigned to a date", next: "Have work ready and accessible" },
  { status: "Approved", meaning: "Inspection passed at this stage", next: "Proceed to next phase" },
  { status: "Corrections", meaning: "Inspection failed — deficiencies noted", next: "Fix issues, request re-inspection" },
  { status: "Finaled", meaning: "All inspections complete", next: "Project closed" },
  { status: "Expired", meaning: "No inspection activity within 180 days", next: "Renew or re-apply" },
];

const REMODEL_STAGES = [
  "Application submitted to City of Grand Rapids Building Safety with scope of work",
  "Plan review against the Michigan Residential Code (5–15 business days)",
  "Permit issued after fees are paid",
  "Rough inspections — framing, electrical, plumbing, mechanical",
  "Insulation inspection (Michigan energy code compliance)",
  "Final inspection and permit close-out",
];

const ADDITION_STAGES = [
  "Zoning review — setbacks, lot coverage, height limits",
  "Building plan review against the Michigan Residential Code (10–20 business days)",
  "Permit issued after fees are paid",
  "Footing and foundation inspections",
  "Framing inspection",
  "Rough mechanical, electrical, and plumbing inspections",
  "Insulation and energy code inspection",
  "Final inspection and certificate of occupancy for the added space",
];

const CONTRACTOR_USES = [
  "Get notified immediately when a remodel or addition clears plan review",
  "Catch correction notices the day they post instead of a week later",
  "Never miss the 180-day expiration on a stalled remodel",
  "Track permits in both Grand Rapids city limits and Kent County townships",
];

const KENT_JURISDICTIONS = [
  { city: "Wyoming", dept: "City of Wyoming Building Inspection" },
  { city: "Kentwood", dept: "City of Kentwood Building Division" },
  { city: "Walker", dept: "City of Walker Building Department" },
  { city: "East Grand Rapids", dept: "City of East Grand Rapids Building Department" },
  { city: "Grandville", dept: "City of Grandville Building Department" },
  { city: "Cascade Township", dept: "Kent County Building & Safety (contracted)" },
  { city: "Ada Township", dept: "Kent County Building & Safety (contracted)" },
  { city: "Plainfield Township", dept: "Plainfield Township Building Department" },
];

const FAQS = [
  {
    q: "Do I need a permit to remodel my home in Grand Rapids?",
    a: "Yes for most work. Grand Rapids requires a building permit for structural changes, moving or removing walls, finishing a basement, altering egress, and any electrical, plumbing, or mechanical work. Cosmetic work — painting, flooring, cabinet swaps with no plumbing or electrical changes — generally does not need one.",
  },
  {
    q: "How long does a home remodel permit take in Grand Rapids?",
    a: "Residential remodels typically take 5–15 business days for plan review. Simple single-trade work sits at the low end; whole-house remodels with structural changes sit at the high end.",
  },
  {
    q: "How long does a home addition permit take in Grand Rapids?",
    a: "Home additions run 10–20 business days because they require zoning review for setbacks and lot coverage in addition to building plan review. Additions that need a variance take substantially longer — the Board of Zoning Appeals meets on a fixed monthly schedule.",
  },
  {
    q: "How much does a Grand Rapids building permit cost?",
    a: "Permit fees are calculated from the declared value of the work. Small remodels commonly land in the $100–$400 range, larger remodels $400–$1,200, and additions $800–$2,500+ depending on square footage and valuation. Separate electrical, plumbing, and mechanical permits are billed on top of the building permit.",
  },
  {
    q: "Does Grand Rapids require a permit for a new roof?",
    a: "Yes — full roof replacement requires a permit. Approval is fast, typically 3–7 business days. Minor repairs below the replacement threshold generally do not require one, but tear-off and re-cover work does.",
  },
  {
    q: "What is the difference between Grand Rapids and Kent County permitting?",
    a: "Property inside Grand Rapids city limits is permitted by City of Grand Rapids Building Safety. Property in unincorporated Kent County — and in townships that contract with the county — goes through Kent County Building & Safety. Neighboring cities like Wyoming, Kentwood, and Walker run their own departments entirely.",
  },
  {
    q: "How long is a Grand Rapids permit valid?",
    a: "Permits lapse if no inspection is requested or performed within 180 days. Michigan code allows the building official to extend a permit on written request, but a lapsed permit generally means re-application and new fees.",
  },
];

const RELATED = [
  { title: "Grand Rapids Michigan Building Permit Guide", href: "/blog/grand-rapids-michigan-building-permit-guide" },
  { title: "Detroit Building Permit Status Check 2026", href: "/blog/detroit-building-permit-status-check-2026" },
  { title: "Philadelphia Building Permit Status — How to Check in 2026", href: "/blog/philadelphia-building-permit-status-2026" },
  { title: "Pennsylvania Roofing Permit Requirements (2026) — By City", href: "/blog/pennsylvania-roofing-permit-requirements" },
];

export default function GrandRapidsPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Grand Rapids, MI</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">July 2026 · 10 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          GRAND RAPIDS MI BUILDING PERMIT STATUS — 2026 GUIDE
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Grand Rapids has one of the most active residential renovation markets in Michigan. The
          city&apos;s older housing stock in Heritage Hill, East Hills, and the West Side drives
          constant remodel and addition activity — and every one of those projects runs through
          City of Grand Rapids Building Safety. Here&apos;s how to check permit status, what each
          permit type actually takes, and where the Kent County jurisdiction line falls.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">GRAND RAPIDS PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">City of Grand Rapids Building Safety — online permit portal at grandrapidsmi.gov</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Search by</span>
              <span className="text-[#F5F0E8]/80">Address, permit number, or parcel</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Hours</span>
              <span className="text-[#F5F0E8]/80">Available 24/7 online</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Code</span>
              <span className="text-[#F5F0E8]/80">Michigan Residential Code (statewide)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Peak season</span>
              <span className="text-[#F5F0E8]/80">April–October</span>
            </div>
          </div>
          <p className="mt-4">
            Open the Building Safety permit portal, search by property address, and you&apos;ll see
            every permit tied to that parcel — including inspection history and current status.
            Grand Rapids issues building, electrical, plumbing, and mechanical permits separately,
            so a single remodel often produces four permit records. Check all of them: a project
            can be held up by a rough electrical correction while the building permit still reads
            &quot;Issued.&quot; Department contacts and typical approval windows are on our{" "}
            <Link href="/locations/mi/grand-rapids" className="text-[#FF6B00] hover:underline">
              Grand Rapids permit tracking page
            </Link>.
          </p>
        </section>

        {/* Jurisdiction */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">GRAND RAPIDS CITY VS KENT COUNTY — JURISDICTION GUIDE</h2>
          <p>
            This is the single most common mistake on West Michigan projects. A Grand Rapids mailing
            address does not mean Grand Rapids permitting jurisdiction. Large stretches of Kent
            County carry a Grand Rapids postal address while sitting entirely outside city limits.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Jurisdiction split</p>
            <p>Inside Grand Rapids city limits → City of Grand Rapids Building Safety</p>
            <p>Unincorporated Kent County + contracted townships → Kent County Building &amp; Safety</p>
            <p>Neighboring cities → their own building departments</p>
          </div>
          <p className="mt-4">
            Verify jurisdiction by parcel, not by mailing address. The wrong department means
            starting over — fees do not transfer between jurisdictions and the review clock
            restarts at zero.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">Separate permit systems in the Grand Rapids metro</p>
            {KENT_JURISDICTIONS.map((s) => (
              <p key={s.city}>{s.city} — {s.dept}</p>
            ))}
          </div>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING GRAND RAPIDS PERMIT STATUSES</h2>
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">GRAND RAPIDS PERMIT TYPES AND TIMELINES</h2>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6">Permit Type</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Review Time</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Typical Fee Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Roofing (full replacement)", time: "3–7 business days", fee: "$100–$250" },
                  { type: "Residential remodel", time: "5–15 business days", fee: "$150–$1,200" },
                  { type: "Home addition", time: "10–20 business days", fee: "$800–$2,500+" },
                  { type: "New residential construction", time: "15–25 business days", fee: "$2,000–$5,000+" },
                  { type: "Deck / porch", time: "3–10 business days", fee: "$100–$350" },
                  { type: "Commercial alteration", time: "20–45 business days", fee: "Valuation-based" },
                ].map((row) => (
                  <tr key={row.type} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono">{row.type}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60 whitespace-nowrap">{row.time}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10px] text-[#F5F0E8]/25 font-mono">
            Fee ranges are estimates based on declared project valuation. Confirm current fee
            schedules with Building Safety before budgeting.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">HOME REMODEL PERMITS IN GRAND RAPIDS</h3>
          <p>
            Remodels are the highest-volume residential permit type in Grand Rapids, driven by the
            city&apos;s pre-1940 housing stock. Kitchen and bath gut jobs, basement finishes, and
            wall removals all require a building permit plus separate trade permits.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">What requires a remodel permit:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {[
              "Removing, moving, or adding a wall — load-bearing or not",
              "Finishing a basement or attic into habitable space",
              "Changing window or door openings (egress compliance)",
              "Any electrical, plumbing, or mechanical alteration",
              "Structural repair to joists, rafters, or foundation",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Typical stages:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {REMODEL_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Review time: 5–15 business days.</strong> Single-trade
            work with no structural change clears at the low end. Whole-house remodels with beam
            calculations and a stamped structural letter sit at the high end. Cost commonly runs
            $150–$1,200 in permit fees depending on declared valuation, before trade permits.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">HOME ADDITION PERMITS IN GRAND RAPIDS</h3>
          <p>
            Additions carry a second review layer that remodels do not: zoning. Before Building
            Safety reviews the structure, a zoning reviewer checks setbacks, maximum lot coverage,
            and height against the district your parcel sits in. On Grand Rapids&apos; narrow older
            lots, side-yard setbacks are the most common reason an addition gets kicked back.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Typical stages:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {ADDITION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Review time: 10–20 business days.</strong> Permit
            fees for an addition commonly run $800–$2,500+ depending on square footage and declared
            valuation. If the addition needs a variance, add the Board of Zoning Appeals calendar
            to your timeline — that board meets monthly, and a missed submittal deadline pushes you
            a full cycle.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ROOFING PERMITS</h3>
          <p>
            Full roof replacement requires a permit in Grand Rapids. Review is fast —{" "}
            <strong className="text-[#F5F0E8]">3–7 business days</strong> — because there is no plan
            review component for a straight tear-off and re-roof. A final inspection is required
            before the permit closes.
          </p>
          <p className="mt-3">
            Michigan&apos;s climate adds one requirement contractors from warmer states miss: an ice
            barrier is required along the eaves, extending from the roof edge to a point at least 24
            inches inside the exterior wall line. Missing or short ice barrier is a routine
            inspection failure in Kent County.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW RESIDENTIAL CONSTRUCTION</h3>
          <p>
            New construction runs <strong className="text-[#F5F0E8]">15–25 business days</strong>{" "}
            for initial approval, with zoning, building, and site plan review running in sequence.
            Expect the full inspection ladder afterward: footing, foundation, framing, rough trades,
            insulation, and final with certificate of occupancy. Each stage must pass before the
            next can proceed.
          </p>
        </section>

        {/* Michigan code */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">MICHIGAN RESIDENTIAL CODE — WHAT APPLIES IN GRAND RAPIDS</h2>
          <p>
            Michigan adopts a statewide construction code. Grand Rapids enforces the Michigan
            Residential Code for one- and two-family dwellings, alongside the Michigan Building,
            Electrical, Plumbing, and Mechanical Codes for everything else. Local jurisdictions
            enforce the state code — they do not write their own structural requirements — which
            means a plan that passes in Kentwood is built to the same code as one in Grand Rapids.
            What differs locally is zoning, fees, and process.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Code items that drive the most corrections in West Michigan:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {[
              "Ice barrier at eaves — required for Michigan's freeze-thaw climate",
              "Frost-depth footings — 42 inches typical in Kent County",
              "Egress window sizing and well dimensions in finished basements",
              "Energy code insulation and air sealing verification",
              "Smoke and carbon monoxide alarm placement on remodels",
              "Stair rise, run, and handrail geometry on additions",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Michigan also licenses residential builders and maintenance &amp; alteration
            contractors at the state level. A homeowner can pull a permit for their own primary
            residence, but hired trades must be licensed — and an expired license discovered
            mid-project stops inspections cold.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CITY OF GRAND RAPIDS BUILDING SAFETY — CONTACT INFORMATION</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>City of Grand Rapids — Development Center, Building Safety</p>
            <p>1120 Monroe Ave NW, Grand Rapids, MI 49503</p>
            <p>Monday–Friday, 8am–5pm</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">grandrapidsmi.gov</strong> — the Building Safety
            permit portal is available 24/7 for status checks, applications, document uploads, fee
            payment, and inspection requests.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">KENT COUNTY</h3>
          <p>
            For property outside city limits, Kent County Building &amp; Safety handles permits and
            inspections for unincorporated areas and contracted townships. Confirm which department
            covers your parcel before you apply.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Request inspections through the portal. Grand Rapids requires advance notice — same-day
            requests are generally not accommodated, and requests placed after the daily cutoff roll
            to the following business day.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON GRAND RAPIDS PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">WRONG JURISDICTION</h3>
          <p>
            The most expensive mistake in West Michigan. A homeowner in a Grand Rapids-addressed
            township applies to the city, waits two weeks, and gets told to start over with Kent
            County. Verify by parcel before submitting anything.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ZONING KICKBACKS ON ADDITIONS</h3>
          <p>Common reasons an addition fails zoning review in Grand Rapids:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Side-yard setback encroachment on narrow older lots",
              "Lot coverage exceeded once the addition footprint is added",
              "Rear-yard setback conflict with an existing detached garage",
              "Historic district review not obtained in Heritage Hill or Heartside",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">What to do:</strong> Pull your parcel&apos;s zoning
            district and setback requirements before drawing. If you need a variance, plan around
            the Board of Zoning Appeals monthly calendar from day one.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">FAILED INSPECTIONS</h3>
          <p>Common failure reasons in Grand Rapids:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Work not matching approved plans after a mid-job change",
              "Missing or short ice barrier on roofing permits",
              "Insulation and air sealing not meeting Michigan energy code",
              "Basement egress window well undersized",
              "Work concealed before the rough inspection was performed",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Re-inspection fees</strong> apply after a failure.
            Concealing rough work before inspection is the costliest version — the inspector can
            require you to open it back up.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            Grand Rapids permits lapse if no inspection activity occurs within 180 days. Remodels
            are the most common casualty — the homeowner runs out of budget mid-project, six months
            pass, and the permit dies. Set a reminder on any job where the pace is uncertain.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">SPRING AND SUMMER VOLUME</h3>
          <p>
            April through October is peak season in West Michigan — the construction window is short
            and everyone submits at once. Expect review times to sit at the upper end of every range
            above from late spring through early fall. Submit in February or March if your schedule
            allows.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING GRAND RAPIDS PERMITS</h2>
          <p>
            For contractors managing multiple Grand Rapids projects across city and county
            jurisdictions, automatic tracking would eliminate daily manual status checks — but it
            isn&apos;t available in Grand Rapids yet. Grand Rapids publishes no per-permit status
            API, so ClearedNo can&apos;t poll it. Automated tracking is live in {liveCityList({ separator: ", ", conjunction: "and", format: "city" })}.
            Get notified below when Grand Rapids launches.
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">RELATED PERMIT GUIDES</h2>
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
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">GET NOTIFIED WHEN GRAND RAPIDS LAUNCHES</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Automated tracking isn&apos;t available in Grand Rapids yet. It&apos;s live in {liveCityList({ separator: ", ", conjunction: "and", format: "city" })},
            where ClearedNo emails you the second plan review clears, an inspection passes or fails,
            or a hold lands. Get notified when Grand Rapids goes live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/locations/mi/grand-rapids#waitlist"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              NOTIFY ME WHEN GRAND RAPIDS LAUNCHES →
            </Link>
            <Link
              href="/tools/permit-timeline-estimator"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              ESTIMATE YOUR TIMELINE →
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
          <Link href="/blog/detroit-building-permit-status-check-2026" className="hover:text-[#FF6B00] transition-colors">
            ← Detroit MI Permit Status 2026
          </Link>
          <Link href="/blog/philadelphia-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            Philadelphia PA Permit Status 2026 →
          </Link>
        </nav>
      </div>

      {/* Email capture */}
      <PermitAlertSignup city="grand-rapids-mi" projectType="building-permit-status" />
    </article>
  );
}
