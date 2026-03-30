import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "San Antonio Building Permit Guide for Contractors (2026) | ClearedNo",
  description:
    "San Antonio's SAconnect portal, how to search permits, what PENDING vs ISSUED vs FINALED means, typical timelines, and common delay causes including drainage and historic review.",
  keywords: [
    "San Antonio building permit guide",
    "SAconnect permit San Antonio",
    "saconnect.info permit",
    "San Antonio DSD permit",
    "San Antonio permit approval time 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/san-antonio-building-permit-guide-2026" },
  openGraph: {
    title: "San Antonio Building Permit Guide for Contractors (2026)",
    description:
      "How to navigate San Antonio's SAconnect permit portal, what each status means, and typical timelines for residential and commercial projects.",
    url: "https://www.clearedno.com/blog/san-antonio-building-permit-guide-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "San Antonio Building Permit Guide for Contractors (2026)",
  description:
    "San Antonio's SAconnect permit portal, status meanings, timelines, and common delay causes for contractors.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-30",
};

export default function SanAntonioPermitGuidePost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">San Antonio, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          SAN ANTONIO BUILDING PERMIT GUIDE FOR CONTRACTORS (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          San Antonio processes permits through the SAconnect portal — an Accela implementation run
          by Development Services. Here&apos;s how to search, what each status means, and what
          contractors need to know about drainage review and historic district complications.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE SACONNECT PORTAL AND DEVELOPMENT SERVICES DEPARTMENT</h2>
          <p>
            San Antonio building permits are processed by the <strong className="text-[#F5F0E8]">Development Services
            Department (DSD)</strong> through the SAconnect portal at{" "}
            <strong className="text-[#F5F0E8]">saconnect.info</strong>. SAconnect runs on the Accela
            Citizen Access platform — the same system used by Austin and many other Texas cities.
            If you&apos;re familiar with the Austin BDS portal, SAconnect will feel familiar. If you&apos;re
            new to Accela, it&apos;s worth spending 15 minutes getting oriented before your first
            application.
          </p>
          <p className="mt-3">
            Contractor accounts are required to submit applications and upload documents. Public
            permit searches (by permit number or address) don&apos;t require a login. DSD&apos;s main
            office is at 1901 S. Alamo Street in San Antonio, with permit counter hours Monday
            through Friday, 7:45 AM to 4:30 PM. The main permit inquiry line is (210) 207-1111.
          </p>
          <p className="mt-3">
            San Antonio has grown significantly in the past decade — it&apos;s now the second-largest
            city in Texas — and DSD has expanded staffing accordingly. Residential permit volumes
            are high, particularly in the fast-growing north and northwest sides, and timelines
            reflect this demand. Commercial development near the Medical Center, the South Side
            corridors, and the downtown urban core adds to commercial review queue depth.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO SEARCH BY PERMIT NUMBER OR ADDRESS</h2>
          <p>
            San Antonio permit numbers follow the format{" "}
            <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">YYYY-BLDG-XXXXXX</code> for building
            permits. The SAconnect portal search process:
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Go to saconnect.info" },
              { n: "2", t: "Click \"Building\" in the top navigation" },
              { n: "3", t: "Select \"Building Permits\" from the dropdown" },
              { n: "4", t: "Choose Permit Number or Address as your search type" },
              { n: "5", t: "Enter your search term and click Search" },
              { n: "6", t: "Click the permit record from the results list to view status, reviewer information, and conditions" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            The permit detail page in SAconnect shows more information than the basic status field.
            Scroll to the &quot;Conditions&quot; tab — any outstanding conditions that must be resolved
            before the permit can be issued are listed here. Many permits stall because a condition
            (like a drainage review sign-off or a tree mitigation fee) is outstanding and not
            obvious from the status field alone.
          </p>
          <p className="mt-3">
            For how San Antonio&apos;s timelines compare to other Texas cities, see our breakdown of{" "}
            <Link href="/blog/average-permit-times-texas" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">average permit times across Texas</Link>.
            San Antonio and Austin are broadly similar in their residential timelines, though
            San Antonio commercial has seen longer waits in recent years due to volume growth.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT EACH STATUS MEANS IN SAN ANTONIO&apos;S SYSTEM</h2>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              {
                status: "PENDING",
                meaning: "Application submitted. Intake review in progress — verifying that all required documents are present.",
                action: "Wait. Intake typically completes in 3–5 business days. Watch for requests for missing documents.",
              },
              {
                status: "IN REVIEW",
                meaning: "Application accepted. Assigned to a plans examiner for technical review.",
                action: "Check SAconnect for comments and conditions daily. Respond promptly to any reviewer requests.",
              },
              {
                status: "CORRECTIONS REQUIRED",
                meaning: "Reviewer has flagged deficiencies. Correction letter posted to permit record.",
                action: "Read all comments. Upload corrected plans through SAconnect. Review cycle restarts.",
              },
              {
                status: "APPROVED — CONDITIONS",
                meaning: "Plans approved with conditions that must be satisfied before issuance.",
                action: "Resolve all conditions (fees, drainage sign-offs, etc.) listed under the Conditions tab.",
              },
              {
                status: "ISSUED",
                meaning: "Permit fully issued. Work may legally begin.",
                action: "Download permit card. Post on site. Schedule inspections when ready.",
              },
              {
                status: "FINALED",
                meaning: "All required inspections completed and approved. Project officially closed.",
                action: "Certificate of Occupancy if applicable. Archive permit records.",
              },
              {
                status: "EXPIRED",
                meaning: "Permit issued but not used within required timeframe (typically 180 days in SA).",
                action: "Renewal may be available through DSD. Call before re-applying.",
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
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TYPICAL TIMELINES FOR SAN ANTONIO PERMITS</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">RESIDENTIAL PROJECTS</h3>
          <p>
            Standard residential permits in San Antonio — new single-family homes, additions,
            accessory dwelling units — typically take <strong className="text-[#F5F0E8]">4 to 6 weeks</strong>
            from submission to issuance. San Antonio has implemented process improvements in recent
            years that have helped compression residential timelines. Projects in master-planned
            communities with pre-approved plans can be faster.
          </p>
          <p className="mt-3">
            Residential projects near drainage features — including properties in or near FEMA
            Special Flood Hazard Areas, which are numerous in San Antonio given the city&apos;s
            topography and flood history — require drainage review that can add 2–4 weeks.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">COMMERCIAL PROJECTS</h3>
          <p>
            Commercial new construction and major renovations run <strong className="text-[#F5F0E8]">8 to 12 weeks</strong>.
            Commercial projects near the Medical Center cluster, along Loop 1604 growth corridors,
            and in the downtown Innovation District have seen higher volume in recent years.
            Projects requiring site development plan approval from DSD add 4–6 weeks before
            the building permit review even begins.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">TRADE PERMITS</h3>
          <p>
            Standalone trade permits — HVAC replacements, electrical panel upgrades, plumbing
            repairs — typically process in <strong className="text-[#F5F0E8]">5 to 10 business days</strong>.
            Some qualify for over-the-counter approval at DSD.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON DELAY SOURCES IN SAN ANTONIO</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">DRAINAGE REVIEW FOR FLOOD PLAIN PROXIMITY</h3>
          <p>
            San Antonio has a significant history with flooding — the San Antonio River watershed
            covers much of the city, and many properties are in or near regulated flood plains.
            Projects on properties within FEMA Special Flood Hazard Areas require drainage review
            by DSD&apos;s Stormwater division. This review is separate from the plan review process
            and must be completed before the building permit can be issued.
          </p>
          <p className="mt-3">
            Check flood plain status early using FEMA&apos;s flood map service center (msc.fema.gov)
            and San Antonio&apos;s own GIS flood plain viewer. If your project is in a flood zone,
            build the drainage review timeline into your project schedule from the start — finding
            out at permit submission that you need this review adds weeks.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">HISTORIC DESIGN REVIEW COMMISSION</h3>
          <p>
            San Antonio has extensive historic district coverage, particularly in the near-downtown
            and King William neighborhoods. The Historic Design Review Commission (HDRC) must approve
            exterior changes to buildings in designated historic districts before DSD will issue a
            building permit. HDRC meets approximately twice monthly.
          </p>
          <p className="mt-3">
            The HDRC process applies to exterior modifications including window replacements, door
            changes, siding replacements, roofing, and any visible additions. Contractors doing
            renovation work in King William, Beacon Hill, Lavaca, or other historic overlay areas
            need to confirm HDRC applicability before submitting to DSD. HDRC approval adds 4–8
            weeks and has specific design guidelines that must be followed.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">TREE MITIGATION REQUIREMENTS</h3>
          <p>
            San Antonio&apos;s Tree Preservation Ordinance protects heritage trees (defined by size and
            species) on development sites. Projects that will impact protected trees require a tree
            survey and mitigation plan. Missing this requirement at submission is a common source
            of corrections on new construction permits, particularly in the older established
            neighborhoods with large tree canopy.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHEN TO CALL DSD VS. WHEN TO WAIT</h2>
          <p>
            DSD&apos;s general rule: if your permit has been in PENDING status for more than a week
            without moving, call to confirm your application was fully received and isn&apos;t sitting
            in an incomplete submissions queue. The (210) 207-1111 line handles permit status
            questions — have your permit number and application date ready.
          </p>
          <p className="mt-3">
            Once in IN REVIEW status, the established review window should be respected before
            calling. For residential permits, that&apos;s generally 3–4 weeks from assignment; for
            commercial, 6–8 weeks. Calling every few days doesn&apos;t accelerate review and clogs
            the DSD phone lines.
          </p>
          <p className="mt-3">
            For permits stuck in APPROVED — CONDITIONS status, the conditions tab in SAconnect
            will tell you exactly what&apos;s outstanding. Most conditions are fee-based (drainage
            fees, park fees, or mitigation fees) and can be cleared quickly once you know
            what&apos;s required.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">LET CLEAREDNO MONITOR YOUR SAN ANTONIO PERMITS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors Texas permits 24/7 and sends instant alerts when status changes.
            No more manual portal checks — know the moment your San Antonio permit moves.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            START FREE TRIAL →
          </Link>
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
