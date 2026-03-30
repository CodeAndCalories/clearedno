import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Houston Building Permit Status Check: A Contractor's Guide (2026) | ClearedNo",
  description:
    "How to check Houston permit status through the AMANDA portal, what SUBMITTED/IN REVIEW/ISSUED/FINALED means, typical timelines, ETJ complications, and how to escalate when stuck.",
  keywords: [
    "Houston building permit status",
    "Houston permit check",
    "permits.houston.gov",
    "Houston Permit Center AMANDA",
    "Houston permit approval time 2026",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/houston-building-permit-status-check-2026" },
  openGraph: {
    title: "Houston Building Permit Status Check: A Contractor's Guide (2026)",
    description:
      "Houston's AMANDA portal, no-zoning permit complications, typical timelines, ETJ issues, and what to do when your permit is stuck.",
    url: "https://www.clearedno.com/blog/houston-building-permit-status-check-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Houston Building Permit Status Check: A Contractor's Guide (2026)",
  description:
    "Houston's AMANDA portal, permit status meanings, timelines, ETJ complications, and escalation strategies for contractors.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-30",
};

export default function HoustonPermitStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Houston, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 8 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOUSTON BUILDING PERMIT STATUS CHECK: A CONTRACTOR&apos;S GUIDE (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Houston doesn&apos;t have zoning, but it still requires building permits — and the AMANDA
          portal isn&apos;t always intuitive. Here&apos;s how to check status, what each label means,
          what the ETJ and MUD complications look like, and how to escalate when your permit
          is stuck.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOUSTON&apos;S PERMIT SYSTEM: NO ZONING, BUT STILL PERMITS</h2>
          <p>
            Houston is unique nationally in having no citywide zoning ordinance. There are no
            residential zones, commercial zones, or industrial zones in the traditional sense.
            What Houston does have is a set of deed restrictions in many neighborhoods, a building
            code enforced through the permit process, and a significant number of regulations
            around setbacks, impervious cover, drainage, and floodplain management.
          </p>
          <p className="mt-3">
            This means Houston contractors don&apos;t need to worry about zoning compliance in the same
            way as Dallas or Austin contractors — but the permit process is still mandatory for all
            structural work, new construction, additions, and many renovation scopes. The absence
            of zoning doesn&apos;t simplify permits; it just removes one common delay source.
          </p>
          <p className="mt-3">
            Building permits in the City of Houston are managed by the{" "}
            <strong className="text-[#F5F0E8]">Houston Permit Center</strong>, accessible through{" "}
            <strong className="text-[#F5F0E8]">permits.houston.gov</strong>. The city uses the AMANDA
            permit management platform for backend processing and the ProjectDox system for online
            plan review. The public-facing portal at permits.houston.gov handles permit applications,
            status checks, and document submissions.
          </p>
          <p className="mt-3">
            The Houston Permit Center&apos;s main office is at 1002 Washington Avenue in Houston.
            Phone: (832) 394-8800. Walk-in hours are Monday through Friday, 8 AM to 5 PM. For
            commercial projects, Houston also has district permit offices that can handle certain
            permit types closer to the project site.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO CHECK PERMIT STATUS THROUGH PERMITS.HOUSTON.GOV</h2>
          <p>
            Houston&apos;s portal allows status checks with or without a login. For basic status lookups:
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Go to permits.houston.gov" },
              { n: "2", t: "Select \"Check Permit Status\" or navigate to the permit lookup tool" },
              { n: "3", t: "Enter your permit number. Houston permit numbers follow the format YYYY-XXXXXX for building permits." },
              { n: "4", t: "You can also search by address. Enter the full street address including zip code for best results." },
              { n: "5", t: "The result page shows current status, permit type, issue date (if issued), and associated inspections." },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            For projects submitted electronically through ProjectDox (Houston&apos;s plan review
            system), status updates in the public portal sometimes lag a day or two behind actual
            reviewer actions. If you need current information during active review, logging into
            your ProjectDox account gives more real-time visibility into reviewer comments and
            document exchange.
          </p>
          <p className="mt-3">
            Houston also makes permit data publicly available through its Open Data portal at
            <strong className="text-[#F5F0E8]"> houstontx.gov/opendata</strong>. This dataset is
            useful for contractors who want to analyze neighborhood permit activity or verify
            permit history on a property before taking on a job.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT EACH STATUS MEANS</h2>
          <p>
            Houston&apos;s AMANDA system uses these standard status labels for building permits:
          </p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              {
                status: "SUBMITTED",
                meaning: "Application received and pending intake review for completeness.",
                action: "Wait for intake confirmation. Typically 3–5 business days.",
              },
              {
                status: "IN REVIEW",
                meaning: "Application accepted and assigned to a plan reviewer. Active review underway.",
                action: "Monitor portal and ProjectDox for comments. Respond to reviewer requests promptly.",
              },
              {
                status: "PENDING CORRECTIONS",
                meaning: "Reviewer has flagged issues. Correction comments posted to your account.",
                action: "Review all comments in ProjectDox. Upload corrected plans. Clock restarts.",
              },
              {
                status: "APPROVED — PENDING PAYMENT",
                meaning: "Plans approved but permit fee not yet paid.",
                action: "Pay permit fee online or at the counter. Permit activates upon payment confirmation.",
              },
              {
                status: "ISSUED",
                meaning: "Permit fully issued and active. Work may legally begin.",
                action: "Download permit card. Post on site. Schedule inspections as work progresses.",
              },
              {
                status: "FINALED",
                meaning: "All required inspections completed and approved. Project officially closed.",
                action: "Certificate of Occupancy issued if applicable. Archive all permit documentation.",
              },
              {
                status: "EXPIRED",
                meaning: "Permit issued but work not started or work abandoned for more than 180 days.",
                action: "Contact Permit Center about renewal. May require re-application depending on elapsed time.",
              },
            ].map((row, i) => (
              <div key={row.status} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 6 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.status}</div>
                <div className="text-xs text-[#F5F0E8]/60">{row.meaning}</div>
                <div className="text-xs text-[#F5F0E8]/40 mt-1">Action: {row.action}</div>
              </div>
            ))}
          </div>
          <p className="mt-4">
            For how Houston timelines stack up across Texas, see our guide on{" "}
            <Link href="/blog/average-permit-times-texas" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">average permit times across Texas</Link>{" "}
            — Houston, Dallas, and Austin all run on broadly similar timelines for residential work,
            with commercial variance reflecting each city&apos;s specific review capacity.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TYPICAL TIMELINES FOR HOUSTON PERMITS</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">RESIDENTIAL PROJECTS</h3>
          <p>
            Residential building permits in Houston — new construction, additions, garage conversions
            — typically take <strong className="text-[#F5F0E8]">4 to 6 weeks</strong> from submission
            to issuance. Houston processes one of the highest volumes of residential permits of any
            US city, and the Permit Center has generally kept residential timelines competitive.
            Projects in areas with significant drainage review requirements (flood plains, near
            bayous) add 2–4 weeks.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">COMMERCIAL PROJECTS</h3>
          <p>
            Commercial permits are considerably more variable. Standard commercial renovations and
            tenant improvements run <strong className="text-[#F5F0E8]">6 to 10 weeks</strong>. Commercial
            new construction — particularly larger projects with fire suppression, structural
            complexity, and environmental compliance requirements — can run <strong className="text-[#F5F0E8]">10 to 14 weeks</strong>.
            Houston&apos;s commercial development pace in areas like the Energy Corridor, Westchase, and
            Greenway Plaza keeps commercial review queues full.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">TRADE PERMITS</h3>
          <p>
            Mechanical, electrical, and plumbing permits for straightforward scopes typically
            process in <strong className="text-[#F5F0E8]">5 to 10 business days</strong>. Houston&apos;s
            Permit Center allows online applications for many trade permit types, and some qualify
            for same-day issuance for simple replacement scopes.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">ETJ AND MUD COMPLICATIONS</h2>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-2 mb-3">EXTRATERRITORIAL JURISDICTION (ETJ)</h3>
          <p>
            Houston&apos;s extraterritorial jurisdiction (ETJ) extends up to 5 miles beyond the city
            limits and covers significant portions of Harris County. Projects in the ETJ are not
            in the City of Houston for permit purposes — they fall under Harris County jurisdiction,
            which has its own separate permit process through the Harris County Engineering Department.
          </p>
          <p className="mt-3">
            Contractors who assume a project is in Houston because it has a Houston mailing address
            often discover at permit submission that the property is actually in the ETJ or
            unincorporated Harris County. Check the property&apos;s jurisdictional status at
            HoustonTX.gov&apos;s GIS map or through the Harris County Appraisal District (HCAD) record
            before applying for permits.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">MUNICIPAL UTILITY DISTRICTS (MUDs)</h3>
          <p>
            The Houston metro area has hundreds of Municipal Utility Districts — special-purpose
            governmental entities that provide water, sewer, and drainage services to suburban
            developments that grew outside existing municipal infrastructure. MUDs don&apos;t issue
            building permits, but they can create complications on permit applications.
          </p>
          <p className="mt-3">
            For projects in MUD territory, the permit process goes through the relevant city or
            county authority, but utility connections must be coordinated with the MUD separately.
            Missing the MUD coordination step means your project can have a valid building permit
            but no legal utility connections — a delay that&apos;s particularly painful when it shows
            up at the end of a project. Identify the applicable MUD at the start of any project
            in suburban Houston and initiate utility coordination early.
          </p>
          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">FLOODPLAIN AND DRAINAGE REQUIREMENTS</h3>
          <p>
            Houston&apos;s history with flooding — particularly after Harvey in 2017 — has resulted in
            tightened floodplain and drainage requirements that affect a significant percentage of
            development in the city and surrounding areas. Projects in Special Flood Hazard Areas
            require elevation certificates and may be subject to substantial improvement rules
            (if renovation cost exceeds 50% of the structure&apos;s market value, the entire structure
            must be brought into compliance with current floodplain regulations).
          </p>
          <p className="mt-3">
            Check FEMA flood maps and Houston&apos;s own Floodplain Management Program requirements
            before proceeding with any project near a bayou, floodway, or regulated drainage
            feature. This is one of the most significant sources of permit delays and cost surprises
            in the Houston market.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE INSPECTION PROCESS IN HOUSTON</h2>
          <p>
            Houston requires inspections at defined stages of construction. For residential projects,
            the standard sequence:
          </p>
          <ul className="space-y-3 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Foundation inspection</strong> — before concrete pour. Required for slab-on-grade and pier and beam foundations.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Framing inspection</strong> — after framing complete, before insulation or drywall.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Rough-in inspections</strong> — electrical, plumbing, and mechanical rough-ins, coordinated with framing.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Insulation inspection</strong> — before drywall is hung. Often overlooked by contractors new to Texas energy code requirements.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <span><strong className="text-[#F5F0E8]">Final inspection</strong> — all work complete. All trade sub-inspections must be signed off first.</span>
            </li>
          </ul>
          <p className="mt-3">
            Schedule inspections through permits.houston.gov or by calling (832) 394-8800, inspection
            scheduling option. Aim for at least 24–48 hours lead time on standard inspections.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO ESCALATE WHEN YOUR PERMIT IS STUCK</h2>
          <p>
            When a Houston permit has been sitting in IN REVIEW or PENDING CORRECTIONS status
            beyond the expected window:
          </p>
          <ul className="space-y-4 mt-3">
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Check ProjectDox first.</strong> If your project is
                in electronic plan review, ProjectDox often has more current information than the
                public permit portal. Correction comments are posted there before the portal status
                updates.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Call with your permit number ready.</strong> (832) 394-8800
                connects to the Permit Center. Ask specifically whether a reviewer has been assigned
                and whether there are any outstanding comments. General status questions get generic
                answers.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Request a permit status meeting for commercial projects.</strong>
                Houston&apos;s Permit Center offers pre-construction meetings and mid-review consultations
                for commercial projects. If your commercial project has been stuck for an unusually
                long time, requesting a formal status meeting often produces more information — and
                sometimes accelerates review — compared to phone calls alone.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
              <div>
                <strong className="text-[#F5F0E8]">Verify no outstanding fees or conditions.</strong> Houston
                permits can stall at an approved stage because of outstanding fees, required
                certificates, or drainage coordination that needs to be resolved. Check the conditions
                attached to your permit record before escalating — many &quot;stuck&quot; permits are actually
                waiting on the contractor to complete a fee payment or upload a required document.
              </div>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">LET CLEAREDNO MONITOR YOUR HOUSTON PERMITS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors Texas permits 24/7 and sends instant alerts when your permit status
            changes. No more checking the portal every morning — know the moment Houston issues
            your permit.
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
