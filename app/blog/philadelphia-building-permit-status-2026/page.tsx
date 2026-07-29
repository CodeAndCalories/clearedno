import type { Metadata } from "next";
import Link from "next/link";
import PermitAlertSignup from "@/app/permit-alert-signup";

export const metadata: Metadata = {
  title: "Philadelphia Building Permit Status — How to Check in 2026 | ClearedNo",
  description:
    "Check Philadelphia building permit status online via eCLIPSE. Search by address or permit number, understand approval times, and track permits automatically.",
  keywords: [
    "Philadelphia building permit status",
    "eCLIPSE permit search",
    "eclipse.phila.gov permit lookup",
    "Philadelphia L+I permit",
    "Philadelphia zoning permit vs building permit",
    "Philadelphia historic district review",
    "Philadelphia roofing permit",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/philadelphia-building-permit-status-2026" },
  openGraph: {
    title: "Philadelphia Building Permit Status — How to Check in 2026",
    description:
      "Check Philadelphia building permit status online via eCLIPSE. Search by address or permit number, understand approval times, and track permits automatically.",
    url: "https://www.clearedno.com/blog/philadelphia-building-permit-status-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Philadelphia Building Permit Status — How to Check in 2026",
  description:
    "Check Philadelphia building permit status online via eCLIPSE. Search by address or permit number, understand approval times, and track permits automatically.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
};

const STATUSES = [
  { status: "Submitted", meaning: "Application filed in eCLIPSE, awaiting intake", next: "Wait for intake review" },
  { status: "In Review", meaning: "Assigned to plan examiners by discipline", next: "Monitor each review line separately" },
  { status: "Additional Information Required", meaning: "An examiner returned comments", next: "Respond and resubmit in eCLIPSE" },
  { status: "Approved", meaning: "All reviews cleared, fees due", next: "Pay to move to Issued" },
  { status: "Issued", meaning: "Permit active, work can begin", next: "Schedule inspections" },
  { status: "Inspection Scheduled", meaning: "Inspector assigned to a date", next: "Have work ready and accessible" },
  { status: "Passed", meaning: "Inspection approved at this stage", next: "Proceed to next phase" },
  { status: "Failed", meaning: "Violations or deficiencies noted", next: "Correct and request re-inspection" },
  { status: "Completed", meaning: "Final inspection passed, permit closed", next: "Project closed" },
  { status: "Expired", meaning: "Permit lapsed without completion", next: "Apply for extension or re-apply" },
  { status: "Revoked / Hold", meaning: "L+I suspended the permit", next: "Contact L+I immediately" },
];

const ECLIPSE_STEPS = [
  "Go to eclipse.phila.gov",
  "Choose the public search — no account needed for status lookup",
  "Search by property address, permit number, or application number",
  "Open the record to see review lines, inspection history, and current status",
  "Check each review discipline separately — building, zoning, electrical, plumbing, mechanical",
];

const ROOFING_STAGES = [
  "Application filed in eCLIPSE with contractor license and insurance on file",
  "Review and approval (3–7 business days for a straight re-roof)",
  "Fees paid, permit issued",
  "Work completed",
  "Final inspection requested and passed — permit closed",
];

const NEW_CONSTRUCTION_STAGES = [
  "Zoning permit obtained (or zoning review cleared) before building review",
  "Building plan review — structural, life safety, accessibility",
  "Trade reviews — electrical, plumbing, mechanical, fire suppression",
  "Permit issued after all review lines clear and fees are paid",
  "Foundation and structural inspections",
  "Rough trade inspections",
  "Final inspections and certificate of occupancy",
];

const CONTRACTOR_USES = [
  "Get notified the moment an eCLIPSE review line flips to approved",
  "Catch 'additional information required' comments the day they post",
  "Track historic and zoning reviews running in parallel with building review",
  "Never miss a permit expiration across multiple active Philadelphia jobs",
];

const FAQS = [
  {
    q: "How do I check a Philadelphia building permit status?",
    a: "Use eCLIPSE at eclipse.phila.gov. Search by property address, permit number, or application number. No account is required for a public status lookup, and the portal reflects real-time updates from L+I staff.",
  },
  {
    q: "What is eCLIPSE?",
    a: "eCLIPSE is Philadelphia's online permitting and licensing system, run by the Department of Licenses and Inspections (L+I). It handles applications, plan review, fee payment, inspection scheduling, and status tracking for every permit type in the city.",
  },
  {
    q: "How long does a Philadelphia roofing permit take?",
    a: "Residential roofing permits typically clear in 3–7 business days. A straight tear-off and re-roof has no plan review component, so most of the time is intake and issuance.",
  },
  {
    q: "How long does new construction take to permit in Philadelphia?",
    a: "New construction runs 20–40 business days for initial approval, and commercial projects run 30–90 business days. Both depend on how many review disciplines are involved and whether zoning or historic review runs first.",
  },
  {
    q: "What is the difference between a zoning permit and a building permit in Philadelphia?",
    a: "A zoning permit confirms the proposed use, size, and placement are allowed under the Philadelphia Zoning Code. A building permit approves how the structure is built. Zoning comes first — if the use or dimensions are not permitted by right, you need a zoning variance from the Zoning Board of Adjustment before a building permit can be issued.",
  },
  {
    q: "Do I need historic review for my Philadelphia project?",
    a: "If your property is individually listed on the Philadelphia Register of Historic Places or sits inside a designated historic district, yes. The Philadelphia Historical Commission must review exterior work — including many roof replacements where the material or profile is visible from the street. Historic review adds weeks to the timeline and is a common source of surprise delays.",
  },
  {
    q: "Why is my Philadelphia permit still 'in review' after weeks?",
    a: "Philadelphia permits carry multiple parallel review lines. The overall application stays 'in review' until every discipline clears, so one open line — often zoning or historic — holds the whole permit. Open the record in eCLIPSE and check each review line individually to find the one that has not moved.",
  },
];

const RELATED = [
  { title: "Pennsylvania Roofing Permit Requirements (2026) — By City", href: "/blog/pennsylvania-roofing-permit-requirements" },
  { title: "Pittsburgh Building Permit Status 2026", href: "/blog/pittsburgh-building-permit-status-2026" },
  { title: "Philadelphia Building Permit Guide for Contractors", href: "/blog/philadelphia-building-permit-guide-contractors-2026" },
  { title: "Grand Rapids MI Building Permit Status — 2026 Guide", href: "/blog/grand-rapids-building-permit-status-2026" },
];

export default function PhiladelphiaPermitStatus2026Post() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Philadelphia, PA</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">July 2026 · 10 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          PHILADELPHIA BUILDING PERMIT STATUS — HOW TO CHECK IN 2026
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Philadelphia runs everything through eCLIPSE — the Department of Licenses and Inspections
          portal that handles applications, plan review, inspections, and status tracking in one
          system. The good news: it updates in real time. The catch: a Philadelphia permit is really
          several parallel reviews stacked together, and one stalled line holds the whole thing.
          Here&apos;s how to read it.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PHILADELPHIA PERMIT STATUS — QUICK LOOKUP</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Portal</span>
              <span className="text-[#F5F0E8]/80">eclipse.phila.gov — real-time status updates</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Department</span>
              <span className="text-[#F5F0E8]/80">Licenses and Inspections (L+I)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Search by</span>
              <span className="text-[#F5F0E8]/80">Address, permit number, or application number</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Account</span>
              <span className="text-[#F5F0E8]/80">Not required for public status lookup</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-32 flex-shrink-0">Hours</span>
              <span className="text-[#F5F0E8]/80">Available 24/7 online</span>
            </div>
          </div>
          <p className="mt-4 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">How to look up a permit:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {ECLIPSE_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            eCLIPSE reflects real-time updates — when a plan examiner clears a review line or an
            inspector closes out an inspection, the record changes immediately. That makes it
            reliable, but it also means status can change at any hour of the day, which is why most
            contractors end up checking it several times a day during review.
          </p>
        </section>

        {/* L+I */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PHILADELPHIA L+I — WHO ACTUALLY REVIEWS YOUR PERMIT</h2>
          <p>
            The Department of Licenses and Inspections is the single permitting authority for the
            City of Philadelphia. Unlike most metros, Philadelphia is a consolidated
            city-county — there is no separate county building department to route around. If the
            property is in Philadelphia, it goes through L+I.
          </p>
          <p className="mt-3">
            L+I splits a permit application across multiple review disciplines that run in parallel:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Building — structural, life safety, accessibility",
              "Zoning — use, dimensions, and placement under the Zoning Code",
              "Electrical, plumbing, mechanical — trade-specific review",
              "Fire — suppression and alarm systems on applicable projects",
              "Historic — Philadelphia Historical Commission, where applicable",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            The application does not move to Approved until every line clears. This is the number
            one reason Philadelphia permits appear stuck: five reviews are done and one is not, and
            the top-level status still reads &quot;In Review.&quot; Always open the record and look
            at the review lines individually.
          </p>
          <p className="mt-3">
            L+I also requires contractors to hold an active Philadelphia contractor license with
            current insurance on file. A lapsed license blocks permit issuance regardless of how
            clean the plan review is.
          </p>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING PHILADELPHIA PERMIT STATUSES</h2>
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

        {/* Zoning vs building */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">ZONING PERMIT VS BUILDING PERMIT — THE DISTINCTION THAT COSTS PEOPLE MONTHS</h2>
          <p>
            These are two different permits answering two different questions, and confusing them is
            the most expensive mistake on a Philadelphia project.
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">&nbsp;</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6">Zoning Permit</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Building Permit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Answers", z: "Is this use / size / placement allowed here?", b: "Is this built to code?" },
                  { k: "Governed by", z: "Philadelphia Zoning Code", b: "Philadelphia Building Construction & Occupancy Code" },
                  { k: "Order", z: "First", b: "After zoning clears" },
                  { k: "If denied", z: "Appeal to the Zoning Board of Adjustment (variance)", b: "Revise plans and resubmit" },
                  { k: "Typical add-on time", z: "Weeks — months if a variance is needed", b: "Included in review timeline" },
                ].map((row) => (
                  <tr key={row.k} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono whitespace-nowrap">{row.k}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60">{row.z}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Straightforward work — a re-roof, a kitchen remodel with no footprint change, a water
            heater swap — usually needs only a building or trade permit, because nothing about the
            use or dimensions changes. Anything that adds floor area, changes the number of dwelling
            units, alters the building envelope, or changes the use requires zoning first.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">If your project is not permitted by right</strong>,
            you need a variance from the Zoning Board of Adjustment. That means a hearing, a
            required notice period, and neighborhood association notification. Budget months, not
            weeks — and do not order materials against a schedule that assumes approval.
          </p>
        </section>

        {/* Historic */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HISTORIC DISTRICT REVIEW IN PHILADELPHIA</h2>
          <p>
            Philadelphia has one of the largest inventories of historically designated property in
            the country. Between individually listed buildings on the Philadelphia Register of
            Historic Places and full district designations — Society Hill, Old City, Rittenhouse,
            Spring Garden, Diamond Street, and many more — a large share of the city&apos;s older
            housing stock triggers review by the Philadelphia Historical Commission.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">What triggers historic review:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {[
              "Any exterior alteration visible from the public right-of-way",
              "Window and door replacement on a designated facade",
              "Roof replacement where material or profile is visible from the street",
              "Additions, dormers, and roof decks",
              "Facade repointing, cladding, and painting on designated masonry",
              "Demolition — full or partial",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Staff-level review handles in-kind repairs and minor work relatively quickly. Anything
            substantial goes to the Architectural Committee and then the full Historical Commission,
            both of which meet on a fixed monthly calendar. Miss a submittal deadline and you wait a
            full cycle.
          </p>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Check designation before you quote the job.</strong>{" "}
            A roof that would clear in a week anywhere else in the city can take two months on a
            designated property if the material is visible from the street. Contractors who find out
            after signing eat the delay.
          </p>
        </section>

        {/* Permit types */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PHILADELPHIA PERMIT TYPES AND TIMELINES</h2>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6">Permit Type</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Review Time</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Residential roofing", time: "3–7 business days", note: "Add weeks if historically designated" },
                  { type: "Residential alteration", time: "10–20 business days", note: "Zoning review if envelope changes" },
                  { type: "New construction", time: "20–40 business days", note: "Zoning permit required first" },
                  { type: "Commercial", time: "30–90 business days", note: "Multiple parallel review disciplines" },
                  { type: "Zoning permit (by right)", time: "10–20 business days", note: "Prerequisite to building review" },
                  { type: "Zoning variance (ZBA)", time: "Months", note: "Hearing, notice period, neighborhood notification" },
                ].map((row) => (
                  <tr key={row.type} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono">{row.type}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60 whitespace-nowrap">{row.time}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">RESIDENTIAL ROOFING PERMITS</h3>
          <p>
            Full roof replacement requires a permit in Philadelphia. Review is quick —{" "}
            <strong className="text-[#F5F0E8]">3–7 business days</strong> — because a straight
            tear-off and re-roof carries no plan review component. The permit is gated on the
            contractor holding an active Philadelphia license with current insurance, so the delay
            is more often licensing paperwork than review.
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
            The exception is historic designation. On a designated property where the roof is
            visible from the street, add Historical Commission review to the front of that sequence.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">NEW CONSTRUCTION</h3>
          <p>
            New construction runs <strong className="text-[#F5F0E8]">20–40 business days</strong>{" "}
            for initial approval, assuming the project is permitted by right. If it needs a
            variance, that clock does not start until the Zoning Board rules.
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {NEW_CONSTRUCTION_STAGES.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF6B00] font-mono flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">COMMERCIAL PERMITS</h3>
          <p>
            Commercial work runs <strong className="text-[#F5F0E8]">30–90 business days</strong>.
            The spread is wide because commercial applications carry the most parallel review
            lines — building, fire, accessibility, and every trade — and each one can return
            comments independently.
          </p>
          <ul className="space-y-3 mt-3 ml-4">
            {[
              { type: "Minor tenant fit-out", time: "20–35 business days" },
              { type: "Major renovation / change of occupancy", time: "40–70 business days" },
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PHILADELPHIA L+I — CONTACT INFORMATION</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">IN-PERSON</h3>
          <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
            <p>Department of Licenses and Inspections — Permit and License Center</p>
            <p>1401 John F. Kennedy Blvd, Municipal Services Building, Concourse Level</p>
            <p>Philadelphia, PA 19102</p>
            <p>Monday–Friday, business hours (appointment recommended)</p>
          </div>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">ONLINE PORTAL</h3>
          <p>
            <strong className="text-[#F5F0E8]">eclipse.phila.gov</strong> — available 24/7 for status
            checks, applications, plan uploads, comment responses, fee payment, and inspection
            scheduling. Status reflects real-time L+I activity.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PHONE</h3>
          <p>
            Philadelphia routes general L+I questions through <strong className="text-[#F5F0E8]">311</strong>.
            For a specific application, the assigned plan examiner&apos;s contact appears on the
            eCLIPSE record — reaching them directly is far faster than the general line.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">INSPECTION REQUESTS</h3>
          <p>
            Schedule inspections through eCLIPSE. Requests placed after the daily cutoff move to the
            next business day, and inspectors are assigned by district.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON PHILADELPHIA PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">ONE STALLED REVIEW LINE</h3>
          <p>
            The permit reads &quot;In Review&quot; for three weeks and nobody can tell you why. In
            almost every case, one discipline has an open comment while the rest are clear. Open the
            eCLIPSE record, find the line that has not moved, and contact that examiner directly.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">UNANSWERED COMMENTS</h3>
          <p>
            When an examiner returns &quot;additional information required,&quot; the clock stops on
            L+I&apos;s side and starts on yours. Applications sit dead for weeks because nobody
            noticed the comment posted. This is the single most common self-inflicted delay in
            Philadelphia — and the one automatic status alerts eliminate outright.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">SURPRISE HISTORIC DESIGNATION</h3>
          <p>
            A contractor quotes a four-week job on a Fishtown or Spring Garden rowhome and then
            discovers the property is designated. Historical Commission review runs on a monthly
            calendar and can add two months. Check designation before you sign.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">LAPSED CONTRACTOR LICENSE OR INSURANCE</h3>
          <p>
            L+I will not issue a permit to a contractor whose Philadelphia license or insurance
            certificate has expired. The plan review can be fully approved and the permit still will
            not issue. Verify both before applying.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">FAILED INSPECTIONS</h3>
          <p>Common failure reasons in Philadelphia:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Work not matching approved plans after a field change",
              "Rough work concealed before inspection",
              "Egress and fire separation deficiencies in rowhome conversions",
              "Improper flashing and drainage detail on flat roofs",
              "Missing smoke and carbon monoxide alarms on alterations",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMIT EXPIRATION</h3>
          <p>
            Philadelphia permits expire if work does not start within the required window or if
            inspection activity stops. Extensions are available on request but are not automatic —
            and a permit that lapses on a project with an open violation gets complicated fast.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING PHILADELPHIA PERMITS AUTOMATICALLY</h2>
          <p>
            eCLIPSE updates in real time, which is exactly why manual checking fails — the change
            you needed to see happened at 2pm on a day you did not log in. ClearedNo watches your
            Philadelphia permits and emails you the moment anything moves, so a returned comment
            gets answered the same day instead of the following week.
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
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR PHILADELPHIA PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo watches eCLIPSE for you and emails you the second a review line clears, a
            comment posts, or an inspection result lands. Unlimited permits, flat monthly price,
            first month free. Stop refreshing eclipse.phila.gov six times a day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/permits/landing"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              TRACK YOUR PERMITS →
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
          <Link href="/blog/grand-rapids-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            ← Grand Rapids MI Permit Status 2026
          </Link>
          <Link href="/blog/pennsylvania-roofing-permit-requirements" className="hover:text-[#FF6B00] transition-colors">
            Pennsylvania Roofing Permit Requirements →
          </Link>
        </nav>
      </div>

      {/* Email capture */}
      <PermitAlertSignup city="philadelphia-pa" projectType="building-permit-status" />
    </article>
  );
}
