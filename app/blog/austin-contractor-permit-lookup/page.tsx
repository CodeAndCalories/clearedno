import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Austin Contractor Permit Lookup: What You Need to Know in 2026 | ClearedNo",
  description:
    "How contractors actually look up permits in Austin TX — the portals, the permit number formats, what the statuses mean, and why checking manually gets old fast.",
  keywords: [
    "Austin contractor permit lookup",
    "Austin TX permit search",
    "Austin building permit lookup",
    "Austin permit number",
    "Austin BDS portal",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/austin-contractor-permit-lookup" },
  openGraph: {
    title: "Austin Contractor Permit Lookup: What You Need to Know in 2026",
    description: "How contractors look up permits in Austin TX — portals, permit numbers, and statuses explained.",
    url: "https://www.clearedno.com/blog/austin-contractor-permit-lookup",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Austin Contractor Permit Lookup: What You Need to Know in 2026",
  description: "How contractors actually look up permits in Austin TX.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-28",
};

export default function AustinPermitLookupPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Austin, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 6 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          AUSTIN CONTRACTOR PERMIT LOOKUP: WHAT YOU NEED TO KNOW IN 2026
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Austin runs two separate permit systems that don&apos;t talk to each other very well.
          Here&apos;s how to navigate both — and what each status actually means when you find your permit.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE TWO AUSTIN PERMIT SYSTEMS</h2>
          <p>
            Austin&apos;s Build + Development Services (BDS) department operates on two platforms, and it&apos;s caused plenty of confusion for contractors over the years.
          </p>
          <p className="mt-3">
            The first is <strong className="text-[#F5F0E8]">Austin Build Central (ABC)</strong> — the older Accela Citizen Access portal at <strong className="text-[#F5F0E8]">abc.austintexas.gov</strong>. Most residential and commercial building permits issued before 2023 live here. If your permit number looks like <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">2024-BC-04812</code>, you&apos;re in ABC territory.
          </p>
          <p className="mt-3">
            The second is the <strong className="text-[#F5F0E8]">Austin Open Data portal</strong> at <strong className="text-[#F5F0E8]">data.austintexas.gov</strong>. This is a public dataset that Austin updates regularly. Permit numbers here look like <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">2026-033822 PP</code>. If you&apos;re dealing with a newer permit or trying to look up someone else&apos;s permit by address, this is often faster.
          </p>
          <p className="mt-3">
            Both are legitimate. Neither sends you alerts when something changes.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO LOOK UP A PERMIT IN AUSTIN BUILD CENTRAL</h2>
          <p>Go to <strong className="text-[#F5F0E8]">abc.austintexas.gov</strong> and look for the Building section. The navigation is a little clunky — don&apos;t be thrown off.</p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: 'Click "Building" in the top navigation menu' },
              { n: "2", t: 'Select "Search" from the dropdown, then "Building Permits"' },
              { n: "3", t: "Enter your permit number. It needs to match the format exactly — spaces and dashes matter." },
              { n: "4", t: "Click on your permit record in the results" },
              { n: "5", t: 'The "Status" field on the permit detail page is what you\'re looking for' },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4">
            One common issue: the search is case-sensitive in some fields and not others. If you get no results, try entering just the numeric portion of your permit number and browsing the list.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">LOOKING UP BY ADDRESS</h2>
          <p>
            Sometimes you don&apos;t have the permit number — you just know the job address. In ABC, you can search by address under the same Building → Search flow.
          </p>
          <p className="mt-3">
            For address lookups, the Open Data portal is often more reliable. Go to <strong className="text-[#F5F0E8]">data.austintexas.gov</strong>, search for "Building Permits," and filter by address. You&apos;ll get a list of every permit ever pulled at that address — useful when you&apos;re doing pre-purchase due diligence or tracking down a permit you filed years ago.
          </p>
          <p className="mt-3">
            One thing to know: the Open Data portal data has a lag. It&apos;s not live. Status updates can take 24–48 hours to appear there after BDS processes them. For current status on active permits, use ABC directly.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT THE STATUS CODES MEAN</h2>
          <p>Austin&apos;s permit statuses aren&apos;t always intuitive. Here&apos;s the translation:</p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              { status: "APPLICATION RECEIVED", meaning: "You submitted the application. It&apos;s sitting in the intake queue, not yet reviewed.", action: "Nothing to do. Check back in a few days." },
              { status: "IN REVIEW", meaning: "Assigned to a plans reviewer. Could be 2 days or 3 weeks depending on permit type and workload.", action: "Check regularly — corrections requests can drop in without warning." },
              { status: "PERMIT CORRECTION REQUIRED", meaning: "The reviewer flagged something. You&apos;ll get a comment letter with specific issues.", action: "Address every single comment and resubmit. Partial fixes slow everything down." },
              { status: "APPROVED / ISSUED", meaning: "You&apos;re cleared. Work can start.", action: "Get your permit card posted on site before you break ground." },
              { status: "INSPECTION REQUESTED", meaning: "An inspection has been scheduled or requested.", action: "Confirm the appointment and make sure the work is ready." },
              { status: "FINAL / FINALED", meaning: "All inspections passed. The project is complete from the city&apos;s perspective.", action: "Request Certificate of Occupancy if applicable." },
            ].map((row, i) => (
              <div key={row.status} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 5 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.status}</div>
                <div className="text-xs text-[#F5F0E8]/60" dangerouslySetInnerHTML={{ __html: row.meaning }} />
                <div className="text-xs text-[#F5F0E8]/40 mt-1">Action: {row.action}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW LONG DOES AN AUSTIN PERMIT TAKE?</h2>
          <p>
            It varies a lot. Express permits — the simple stuff like water heater replacements or minor electrical work — can clear in a few hours online. Those don&apos;t usually require manual lookups.
          </p>
          <p className="mt-3">
            The ones that need a plans reviewer are a different story. Austin BDS is generally running:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Residential new construction: 4–8 weeks, sometimes longer",
              "Commercial tenant improvements: 3–6 weeks",
              "Additions and remodels: 3–5 weeks",
              "Simple residential alterations: 1–3 weeks",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Those timelines can shift. BDS&apos;s current review times are posted on their website and updated weekly. Plan submittals that come in with complete documents tend to move faster — reviewers don&apos;t like playing phone tag for missing info.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE PROBLEM WITH MANUAL LOOKUPS</h2>
          <p>
            The portal works fine. The issue is that checking it is a job in itself.
          </p>
          <p className="mt-3">
            Most contractors with multiple active jobs check the portal every morning before the crew shows up. Sometimes twice a day when a permit is close to clearing. That&apos;s 10–15 minutes a day that adds up to hours per month. And if you miss the morning window when a permit clears, you might not catch it until noon — and your crew has already been sitting idle for half a day.
          </p>
          <p className="mt-3">
            A crew of 4–6 people idling costs $800–$2,000+ depending on trades. That&apos;s real money. The portal doesn&apos;t care.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">GET ALERTED THE MOMENT YOUR PERMIT CLEARS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo checks your Austin permits every 2 hours and sends you an instant email the moment the status changes.
            No more morning portal checks. First month free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              START MONITORING FREE →
            </Link>
            <Link
              href="/#check-permit"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              CHECK A PERMIT NOW (FREE)
            </Link>
          </div>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/travis-county-building-permits" className="hover:text-[#FF6B00] transition-colors">
            Travis County Building Permits →
          </Link>
        </nav>
      </div>
    </article>
  );
}
