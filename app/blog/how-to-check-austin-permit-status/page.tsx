import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check Your Austin Building Permit Status in 2026 | ClearedNo",
  description:
    "Step-by-step guide to checking Austin permit status on the BDS portal, what each status means, and how to get alerts automatically.",
  keywords: ["check Austin permit status", "Austin building permit status", "Austin BDS portal", "Austin permit lookup"],
  alternates: { canonical: "https://www.clearedno.com/blog/how-to-check-austin-permit-status" },
  openGraph: {
    title: "How to Check Your Austin Building Permit Status in 2026",
    description: "Step-by-step guide to checking Austin permit status and how to get alerts automatically.",
    url: "https://www.clearedno.com/blog/how-to-check-austin-permit-status",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Check Your Austin Building Permit Status in 2026",
  description: "Step-by-step guide to checking Austin building permit status.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-28",
};

export default function AustinPermitStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Austin, TX</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 5 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOW TO CHECK YOUR AUSTIN BUILDING PERMIT STATUS IN 2026
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Austin&apos;s Build + Development Services portal works — but it doesn&apos;t send alerts. Here&apos;s
          how to check your permit status manually, and why most contractors eventually stop doing it.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">STEP 1: FIND YOUR PERMIT NUMBER</h2>
          <p>
            Austin uses two permit number formats depending on which system issued it:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            <li className="flex gap-3"><span className="text-[#FF6B00] flex-shrink-0">→</span><span><strong className="text-[#F5F0E8]">API format:</strong> <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">2026-033822 PP</code> — from the Austin Open Data portal or newer BDS records</span></li>
            <li className="flex gap-3"><span className="text-[#FF6B00] flex-shrink-0">→</span><span><strong className="text-[#F5F0E8]">Portal format:</strong> <code className="bg-[#FF6B00]/10 text-[#FF6B00] px-1">2024-BC-04812</code> — from the Accela Citizen Access portal</span></li>
          </ul>
          <p className="mt-3">
            Your permit number is on your permit application confirmation email, on the permit card
            posted at your job site, or on any correspondence from the City of Austin BDS department.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">STEP 2: VISIT THE AUSTIN BDS PORTAL</h2>
          <p>
            Go to <strong className="text-[#F5F0E8]">abc.austintexas.gov</strong> — the Austin Build + Development
            Services (BDS) portal, also known as Austin Build Central (ABC). This is the official
            Accela Citizen Access portal that Austin uses for permit tracking.
          </p>
          <p className="mt-3">
            Alternatively, Austin publishes permit data on its Open Data portal at
            <strong className="text-[#F5F0E8]"> data.austintexas.gov</strong>. This dataset is updated
            regularly and includes permit status, type, address, and more. This is the faster option
            for lookups if you know your permit number.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">STEP 3: SEARCH FOR YOUR PERMIT</h2>
          <p>
            On the ABC portal:
          </p>
          <ol className="space-y-3 mt-3 ml-4">
            {[
              { n: "1", t: "Click \"Building\" in the top menu" },
              { n: "2", t: "Select \"Search\" → \"Building Permits\"" },
              { n: "3", t: "Enter your permit number in the search field" },
              { n: "4", t: "Click \"Search\" or press Enter" },
              { n: "5", t: "Click on your permit record from the results list" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">STEP 4: READ THE STATUS</h2>
          <p>Austin&apos;s BDS portal shows a &ldquo;Status&rdquo; field on the permit detail page. Here&apos;s what each common status means:</p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {[
              { status: "APPLICATION RECEIVED", meaning: "Your application is in the queue, not yet assigned to a reviewer.", action: "Wait. Check back in a few days." },
              { status: "IN REVIEW", meaning: "A plans reviewer is actively reviewing your application.", action: "Check daily — comments or corrections may be needed." },
              { status: "CORRECTIONS REQUIRED", meaning: "The reviewer has flagged issues. You'll get a comment letter.", action: "Address all comments ASAP and resubmit." },
              { status: "APPROVED / ISSUED", meaning: "Your permit is approved. Work may begin.", action: "Start work. Keep permit card posted on site." },
              { status: "FINAL / FINALED", meaning: "All inspections passed. Project is complete.", action: "Request your Certificate of Occupancy if applicable." },
            ].map((row, i) => (
              <div key={row.status} className={`px-5 py-4 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < 4 ? "border-b border-[#FF6B00]/10" : ""}`}>
                <div className="font-mono text-xs text-[#FF6B00] mb-1">{row.status}</div>
                <div className="text-xs text-[#F5F0E8]/60">{row.meaning}</div>
                <div className="text-xs text-[#F5F0E8]/40 mt-1">Action: {row.action}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY THIS PROCESS IS SLOW AND FRUSTRATING</h2>
          <p>
            There&apos;s nothing wrong with the Austin BDS portal — it works. The problem is that it&apos;s a
            <em> passive</em> system. You have to go check it. There are no email alerts, no SMS
            notifications, and no webhooks.
          </p>
          <p className="mt-3">
            Most contractors check the portal every morning before their crew shows up. Some check
            it multiple times a day when they know a decision is imminent. That&apos;s time that could be
            spent on the job — or at least not staring at a loading screen.
          </p>
          <p className="mt-3">
            The math is brutal: if your crew costs $2,400 a day and your permit clears at 7 AM but
            you don&apos;t find out until you check at noon, you&apos;ve lost a half-day. Multiply that by
            five permits a month and you&apos;re leaving $6,000+ on the table every quarter.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">OR LET CLEAREDNO CHECK FOR YOU AUTOMATICALLY</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors your Austin permits 24/7 and sends you an instant alert — email or
            browser push — the moment the status changes. No more morning portal checks.
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
          <Link href="/blog/average-permit-times-texas" className="hover:text-[#FF6B00] transition-colors">
            Average Permit Times in Texas →
          </Link>
        </nav>
      </div>
    </article>
  );
}
