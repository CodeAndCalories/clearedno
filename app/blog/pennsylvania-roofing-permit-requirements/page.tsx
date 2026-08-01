import type { Metadata } from "next";
import Link from "next/link";
import PermitAlertSignup from "@/app/permit-alert-signup";

export const metadata: Metadata = {
  title: "Pennsylvania Roofing Permit Requirements (2026) — By City | ClearedNo",
  description:
    "Do you need a permit to replace a roof in Pennsylvania? Requirements, costs, and approval times for Philadelphia, Pittsburgh, Allentown, Erie and more.",
  keywords: [
    "Pennsylvania roofing permit requirements",
    "do I need a permit to replace a roof in PA",
    "PA Uniform Construction Code roofing",
    "Philadelphia roofing permit",
    "Pittsburgh roofing permit",
    "Allentown roofing permit",
    "Erie PA roofing permit",
    "PA ice barrier requirement",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/pennsylvania-roofing-permit-requirements" },
  openGraph: {
    title: "Pennsylvania Roofing Permit Requirements (2026) — By City",
    description:
      "Do you need a permit to replace a roof in Pennsylvania? Requirements, costs, and approval times for Philadelphia, Pittsburgh, Allentown, Erie and more.",
    url: "https://www.clearedno.com/blog/pennsylvania-roofing-permit-requirements",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Pennsylvania Roofing Permit Requirements (2026) — By City",
  description:
    "Do you need a permit to replace a roof in Pennsylvania? Requirements, costs, and approval times for Philadelphia, Pittsburgh, Allentown, Erie and more.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
};

const STATUSES = [
  { status: "Submitted", meaning: "Application received by the code office", next: "Wait for intake review" },
  { status: "In Review", meaning: "Code official checking scope and contractor credentials", next: "Respond to any comments" },
  { status: "Approved", meaning: "Cleared for issuance, fees due", next: "Pay permit fees" },
  { status: "Issued", meaning: "Permit active — tear-off can begin", next: "Post the permit on site" },
  { status: "Inspection Scheduled", meaning: "Inspector assigned to a date", next: "Leave work accessible for inspection" },
  { status: "Passed", meaning: "Inspection approved", next: "Proceed or close out" },
  { status: "Failed", meaning: "Deficiencies noted — commonly flashing or ice barrier", next: "Correct and request re-inspection" },
  { status: "Finaled / Closed", meaning: "Final inspection complete", next: "Job closed, warranty documentation valid" },
  { status: "Expired", meaning: "Permit lapsed before final inspection", next: "Renew or re-apply" },
];

const PERMIT_REQUIRED = [
  "Full tear-off and replacement — permit required essentially everywhere in PA",
  "Adding a second layer over existing shingles (re-cover)",
  "Any repair or replacement of sheathing, rafters, or trusses",
  "Changing roof structure, pitch, or adding dormers",
  "Changing roofing material class or weight (asphalt to slate or tile)",
  "Adding or relocating skylights",
];

const PERMIT_USUALLY_NOT = [
  "Replacing a handful of blown-off or damaged shingles",
  "Patching a small localized leak with no decking work",
  "Resealing flashing or replacing a boot with no structural work",
  "Gutter and downspout replacement (in most jurisdictions)",
];

const CITIES = [
  {
    city: "Philadelphia",
    dept: "Licenses and Inspections (L&I)",
    portal: "eclipse.phila.gov",
    time: "3–7 business days",
    fee: "$100–$300",
    note: "Historic district review adds weeks. Contractor must hold an active Philadelphia license with insurance on file.",
  },
  {
    city: "Pittsburgh",
    dept: "Permits, Licenses and Inspections (PLI)",
    portal: "OneStopPGH",
    time: "5–10 business days",
    fee: "$100–$300",
    note: "City Historic Review Commission review required in designated districts such as Mexican War Streets and Deutschtown. Steep terrain often triggers extra scaffolding and safety conditions.",
  },
  {
    city: "Allentown",
    dept: "Building Standards & Safety",
    portal: "City of Allentown online permitting",
    time: "3–10 business days",
    fee: "$75–$200",
    note: "Contractor registration with the city is required before a permit will issue.",
  },
  {
    city: "Erie",
    dept: "Bureau of Code Enforcement",
    portal: "City of Erie permit office",
    time: "3–7 business days",
    fee: "$75–$175",
    note: "Lake-effect snow country — ice barrier and ventilation details get scrutinized harder here than anywhere else in the state.",
  },
  {
    city: "Harrisburg",
    dept: "Department of Building and Housing Development",
    portal: "City of Harrisburg permit office",
    time: "5–10 business days",
    fee: "$75–$200",
    note: "Historic district review applies in areas like Old Uptown and Midtown.",
  },
  {
    city: "Scranton",
    dept: "Department of Licensing, Inspections and Permits",
    portal: "City of Scranton permit office",
    time: "5–10 business days",
    fee: "$75–$200",
    note: "Contractor registration required. Heavy snow load region — ice barrier enforcement is strict.",
  },
];

const CONTRACTOR_USES = [
  "Get notified when a roofing permit issues so the crew can be scheduled with confidence",
  "Catch failed final inspections the day they post instead of at warranty registration",
  "Track permits across multiple PA municipalities from one place",
  "Never miss an expiration on a storm-season backlog of open permits",
];

const FAQS = [
  {
    q: "Do you need a permit to replace a roof in Pennsylvania?",
    a: "Yes, in nearly every Pennsylvania municipality a full roof replacement requires a building permit. Pennsylvania's Uniform Construction Code treats a complete tear-off and re-roof as regulated work. Minor repairs — replacing a few shingles or sealing flashing — generally do not require a permit, but the threshold varies by municipality.",
  },
  {
    q: "What is the PA Uniform Construction Code?",
    a: "The Uniform Construction Code (UCC) is Pennsylvania's statewide building code, adopted under Act 45 of 1999. It applies to nearly all construction in the Commonwealth and is based on the International Code Council family of codes, including the International Residential Code. Municipalities either enforce it with their own code office or hand enforcement to a third-party agency, but the technical requirements are the same statewide.",
  },
  {
    q: "How much does a roofing permit cost in Pennsylvania?",
    a: "Most Pennsylvania roofing permits run $75–$300 for a typical residential replacement. Philadelphia and Pittsburgh sit at the upper end; smaller cities like Erie and Allentown at the lower end. Fees are usually based on project valuation or a flat residential rate.",
  },
  {
    q: "How long does it take to get a roofing permit in PA?",
    a: "Typically 3–10 business days statewide. Philadelphia and Erie run 3–7 days; Pittsburgh, Harrisburg, and Scranton run 5–10. Historic district review, where it applies, adds weeks because those commissions meet on a monthly calendar.",
  },
  {
    q: "Is an ice barrier required in Pennsylvania?",
    a: "Yes. Pennsylvania's climate falls within the ice-barrier zone of the residential code, so an ice and water shield membrane is required along eaves — extending from the roof edge to at least 24 inches inside the exterior wall line. In steeper-pitch and heavy-snow regions inspectors commonly expect more coverage, and valleys are frequently required as well. Missing or short ice barrier is the most common roofing inspection failure in Pennsylvania.",
  },
  {
    q: "Can a homeowner pull their own roofing permit in Pennsylvania?",
    a: "In most municipalities a homeowner can pull a permit for work on their own primary residence. Hired contractors generally must be registered — Pennsylvania requires home improvement contractor registration with the Attorney General's office for most residential work, and several cities require separate local registration on top of that.",
  },
  {
    q: "What happens if I replace a roof without a permit in PA?",
    a: "Stop-work orders, fines, and required exposure of concealed work are all on the table. The bigger risk is at resale or claim time: unpermitted work can complicate an insurance claim, void a manufacturer warranty that requires code-compliant installation, and surface as a title issue during a sale.",
  },
];

const RELATED = [
  { title: "Philadelphia Building Permit Status — How to Check in 2026", href: "/blog/philadelphia-building-permit-status-2026" },
  { title: "Pittsburgh Building Permit Status 2026", href: "/blog/pittsburgh-building-permit-status-2026" },
  { title: "Philadelphia Building Permit Guide for Contractors", href: "/blog/philadelphia-building-permit-guide-contractors-2026" },
  { title: "Grand Rapids MI Building Permit Status — 2026 Guide", href: "/blog/grand-rapids-building-permit-status-2026" },
];

export default function PennsylvaniaRoofingPermitRequirementsPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Pennsylvania</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">July 2026 · 11 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          PENNSYLVANIA ROOFING PERMIT REQUIREMENTS (2026) — BY CITY
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Short answer: if you are tearing off and replacing a roof anywhere in Pennsylvania, you
          need a permit. The technical requirements come from one statewide code — the Uniform
          Construction Code — but who reviews it, what it costs, and how long it takes changes at
          every municipal line. Here&apos;s the statewide rule, then the city-by-city detail for
          Philadelphia, Pittsburgh, Allentown, Erie, Harrisburg, and Scranton.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* Quick lookup */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PA ROOFING PERMITS — QUICK ANSWER</h2>
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5 space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-36 flex-shrink-0">Full replacement</span>
              <span className="text-[#F5F0E8]/80">Permit required — statewide, essentially without exception</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-36 flex-shrink-0">Minor repair</span>
              <span className="text-[#F5F0E8]/80">Usually no permit — threshold varies by municipality</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-36 flex-shrink-0">Governing code</span>
              <span className="text-[#F5F0E8]/80">PA Uniform Construction Code (UCC)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-36 flex-shrink-0">Typical cost</span>
              <span className="text-[#F5F0E8]/80">$75–$300 residential</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-36 flex-shrink-0">Typical timeline</span>
              <span className="text-[#F5F0E8]/80">3–10 business days</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#FF6B00] w-36 flex-shrink-0">Climate rule</span>
              <span className="text-[#F5F0E8]/80">Ice barrier required at eaves — 24 in. inside the wall line</span>
            </div>
          </div>
          <p className="mt-4">
            Permits are issued by the municipality where the property sits, not by the state. In
            Pennsylvania that can mean a city code office, a borough or township office, or a
            third-party code agency the municipality contracts with. All three enforce the same
            technical code — they just differ in portal, fee schedule, and turnaround.
          </p>
        </section>

        {/* When required */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHEN A ROOFING PERMIT IS REQUIRED IN PENNSYLVANIA</h2>
          <p>
            The line most municipalities draw is between <em>repair</em> and <em>replacement</em>.
            Repair restores a small damaged portion. Replacement removes and reinstalls the roof
            covering — and that is regulated work.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">PERMIT REQUIRED</h3>
          <ul className="space-y-2 mt-2 ml-4">
            {PERMIT_REQUIRED.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">USUALLY NO PERMIT</h3>
          <ul className="space-y-2 mt-2 ml-4">
            {PERMIT_USUALLY_NOT.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00]/50 flex-shrink-0 mt-0.5">□</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <strong className="text-[#F5F0E8]">The gray zone is partial replacement.</strong> Some
            municipalities set a square-footage or percentage threshold — repair more than that and
            it becomes a replacement requiring a permit. Others treat any decking work as
            permittable regardless of size. When a storm claim covers one slope, call the code
            office before you assume it is exempt.
          </p>
          <p className="mt-3">
            One more trap: an insurance-funded replacement is still a permitted job. Adjusters do
            not pull permits, and &quot;the insurance company approved it&quot; carries no weight
            with a code official.
          </p>
        </section>

        {/* UCC */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">PA UNIFORM CONSTRUCTION CODE — THE BASICS</h2>
          <p>
            Pennsylvania adopted the Uniform Construction Code under Act 45 of 1999. Before that,
            code enforcement was a patchwork; the UCC created one technical standard for the whole
            Commonwealth, based on the International Code Council family of codes — most relevant
            here, the International Residential Code.
          </p>
          <p className="mt-3 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">What that means practically:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {[
              "The technical requirements for your roof are the same in Erie and Philadelphia",
              "Municipalities choose how to enforce — in-house code office or third-party agency",
              "Municipalities set their own fees, forms, and turnaround times",
              "A small number of municipalities opted out of local enforcement; the state Department of Labor & Industry handles those",
              "Local historic district ordinances layer on top of the UCC and are separate from it",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            So when a contractor working across the Lehigh Valley or greater Pittsburgh asks whether
            the rules change from township to township — the code does not. The paperwork does.
          </p>
        </section>

        {/* Ice barrier */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">ICE BARRIER REQUIREMENTS FOR PENNSYLVANIA&apos;S CLIMATE</h2>
          <p>
            Pennsylvania sits squarely in the residential code&apos;s ice-barrier region. Winter
            freeze-thaw cycling drives ice dam formation at the eaves, and meltwater backs up under
            the shingles. The code answer is a self-adhering membrane — ice and water shield —
            beneath the covering along the eaves.
          </p>
          <div className="border-l-2 border-[#FF6B00]/40 pl-4 mt-4 text-xs font-mono text-[#F5F0E8]/60 space-y-1">
            <p className="text-[#F5F0E8]/40 text-[9px] tracking-widest uppercase mb-2">The baseline requirement</p>
            <p>Membrane from the eave edge to a point at least 24 inches inside the exterior wall line</p>
            <p>Measured along the slope — steeper pitch means more material, not less</p>
            <p>Two courses lapped where a single width does not reach the line</p>
          </div>
          <p className="mt-4 text-[#F5F0E8]/50 text-xs font-mono tracking-widest uppercase">Where inspectors commonly expect more:</p>
          <ul className="space-y-2 mt-2 ml-4">
            {[
              "Valleys — routinely required even where the code minimum addresses eaves",
              "Erie and the northern tier — lake-effect snow country draws the strictest enforcement in the state",
              "Scranton, Wilkes-Barre, and the Poconos — heavy snow load region",
              "Low-slope sections and porch roofs tying into a main roof",
              "Around penetrations and at wall-to-roof transitions",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">This is the most common PA roofing inspection
            failure</strong> — membrane that stops short of the 24-inch line, or gets skipped on a
            porch roof. It is also the most expensive one to fix after the fact, because correcting
            it means pulling shingles back off. Photograph the membrane before you cover it.
          </p>
          <p className="mt-3">
            Ventilation is the companion issue. Inadequate intake and exhaust ventilation causes the
            warm-deck condition that creates ice dams in the first place, and inspectors in the
            snow-belt counties look at soffit and ridge ventilation on every re-roof.
          </p>
        </section>

        {/* Status table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">UNDERSTANDING PA ROOFING PERMIT STATUSES</h2>
          <p>
            Portal wording varies by municipality, but the underlying sequence is consistent across
            Pennsylvania:
          </p>
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

        {/* City by city */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CITY-BY-CITY: COSTS AND TIMELINES</h2>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">City</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Approval Time</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Typical Fee</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {CITIES.map((c) => (
                  <tr key={c.city} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono whitespace-nowrap">{c.city}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60 whitespace-nowrap">{c.time}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60 whitespace-nowrap">{c.fee}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{c.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10px] text-[#F5F0E8]/25 font-mono">
            Fees are estimates for a typical residential replacement. Confirm current fee schedules
            with the local code office before quoting.
          </p>

          {CITIES.map((c) => (
            <div key={c.city}>
              <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">{c.city.toUpperCase()}</h3>
              <div className="border-l-2 border-[#FF6B00]/30 pl-4 space-y-1 text-xs font-mono text-[#F5F0E8]/60">
                <p>Department — {c.dept}</p>
                <p>Portal — {c.portal}</p>
                <p>Approval — {c.time}</p>
                <p>Typical fee — {c.fee}</p>
              </div>
              <p className="mt-3">{c.note}</p>
            </div>
          ))}

          <p className="mt-6">
            Philadelphia has the deepest historic overlay in the state — see the{" "}
            <Link href="/blog/philadelphia-building-permit-status-2026" className="text-[#FF6B00] hover:underline">
              Philadelphia permit status guide
            </Link>{" "}
            for how eCLIPSE handles historic and zoning review alongside the building permit.
            Pittsburgh contractors should read the{" "}
            <Link href="/blog/pittsburgh-building-permit-status-2026" className="text-[#FF6B00] hover:underline">
              Pittsburgh permit status guide
            </Link>{" "}
            for OneStopPGH specifics.
          </p>
        </section>

        {/* Contractor registration */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CONTRACTOR REGISTRATION IN PENNSYLVANIA</h2>
          <p>
            Pennsylvania does not license roofers at the state level the way it licenses electricians
            in some other states — but registration requirements still gate your permit.
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Home Improvement Contractor registration with the PA Attorney General is required for most residential contractors doing more than a minimal annual volume",
              "The registration number must appear on contracts and advertising",
              "Philadelphia, Allentown, and Scranton require separate local registration on top of state registration",
              "Current general liability insurance and workers' compensation coverage must be on file",
              "An expired registration or lapsed insurance certificate blocks permit issuance regardless of how clean the application is",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Check your renewal dates before storm season, not during it. The busiest week of the
            year is the worst possible time to discover your insurance certificate expired.
          </p>
        </section>

        {/* Common problems */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">COMMON PA ROOFING PERMIT PROBLEMS IN 2026</h2>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-5 mb-3">ASSUMING THE MUNICIPALITY, NOT VERIFYING IT</h3>
          <p>
            Pennsylvania has more than 2,500 municipalities. Mailing addresses cross boundaries
            constantly — a &quot;Pittsburgh&quot; address is frequently in a borough with its own
            code office, and a &quot;Philadelphia&quot; address in the suburbs is Montgomery or
            Delaware County. Verify by parcel before applying.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">MISSED HISTORIC DESIGNATION</h3>
          <p>
            Philadelphia, Pittsburgh, Harrisburg, and several smaller cities have designated historic
            districts where the visible roof material and profile are reviewable. Those commissions
            meet monthly. A job quoted at one week becomes a two-month job, and the delay lands on
            whoever signed the contract.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">STORM-SEASON BACKLOG</h3>
          <p>
            After a significant hail or wind event, a code office that normally turns permits in
            three days can take two weeks. Every roofer in the county submits the same week. Submit
            immediately — position in the queue is the whole game — and expect the upper end of every
            timeline above.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">FAILED FINAL INSPECTIONS</h3>
          <p>Most common reasons a PA roofing final fails:</p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Ice barrier missing, short of the 24-inch line, or skipped on porch roofs",
              "Improper step or counter flashing at walls and chimneys",
              "Inadequate soffit intake or ridge exhaust ventilation",
              "Drip edge omitted at eaves and rakes",
              "Nailing pattern or fastener depth not matching manufacturer specification",
              "Decking deficiencies covered without notice to the inspector",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-[#F5F0E8]">Re-inspection fees</strong> apply in most PA
            municipalities. The real cost is the crew return trip, not the fee.
          </p>

          <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mt-6 mb-3">PERMITS THAT NEVER GET CLOSED</h3>
          <p>
            The crew finishes, the homeowner pays, and nobody requests the final inspection. Months
            later the permit expires open — and it surfaces at resale as a title problem. Close every
            permit. It takes one request.
          </p>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING PENNSYLVANIA ROOFING PERMITS AUTOMATICALLY</h2>
          <p>
            A roofing operation working across Pennsylvania is checking four or five different
            municipal portals, each with its own login and its own layout. Automatic tracking
            collapses that into one email feed — ClearedNo watches your permits and notifies you the
            moment a status changes, whichever city issued it.
          </p>
          <p className="mt-3">Roofers use it to:</p>
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
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">TRACK YOUR PENNSYLVANIA PERMITS AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Philadelphia, Pittsburgh, Allentown, Erie — one place, one email feed. ClearedNo watches
            every permit you have open and tells you the second it issues, passes, fails, or nears
            expiration. Unlimited permits, flat monthly price, first month free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/permits/landing"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              TRACK YOUR PERMITS →
            </Link>
            <Link
              href="/tools/permit-fee-calculator"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              ESTIMATE YOUR PERMIT FEE →
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
          <Link href="/blog/philadelphia-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            ← Philadelphia PA Permit Status 2026
          </Link>
          <Link href="/blog/pittsburgh-building-permit-status-2026" className="hover:text-[#FF6B00] transition-colors">
            Pittsburgh PA Permit Status 2026 →
          </Link>
        </nav>
      </div>

      {/* Email capture */}
      <PermitAlertSignup city="pennsylvania" projectType="roofing-permit" />
    </article>
  );
}
