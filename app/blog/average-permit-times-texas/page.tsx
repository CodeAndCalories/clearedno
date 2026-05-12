import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Average Building Permit Times in Texas 2026 — By City | ClearedNo",
  description:
    "How long do building permits take in Texas? Average approval times for Houston, Austin, Dallas, San Antonio by project type.",
  keywords: ["Texas permit approval times", "Austin permit timeline", "Dallas permit time", "Houston permit time", "San Antonio permit time"],
  alternates: { canonical: "https://www.clearedno.com/blog/average-permit-times-texas" },
  openGraph: {
    title: "Average Building Permit Approval Times in Texas (2026)",
    description: "Permit timelines by city: Austin, Dallas, Houston, San Antonio.",
    url: "https://www.clearedno.com/blog/average-permit-times-texas",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Average Building Permit Approval Times in Texas (2026)",
  description: "Breakdown of permit approval timelines for Austin, Dallas, Houston, and San Antonio.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-28",
};

const CITIES = [
  {
    name: "Austin, TX",
    href: "/austin",
    portal: "Build + Development Services (BDS)",
    times: [
      { type: "Simple repair / replacement", time: "1–3 weeks" },
      { type: "Residential addition", time: "3–6 weeks" },
      { type: "New residential build", time: "6–12 weeks" },
      { type: "Commercial TI", time: "4–8 weeks" },
      { type: "New commercial construction", time: "8–16 weeks" },
    ],
    note: "Austin is known for longer review times due to high application volume. The city has invested in staff, but demand consistently outpaces capacity.",
    color: "#FF6B00",
  },
  {
    name: "Dallas, TX",
    href: "/dallas",
    portal: "Development Services",
    times: [
      { type: "Simple repair / replacement", time: "1–2 weeks" },
      { type: "Residential addition", time: "2–5 weeks" },
      { type: "New residential build", time: "4–10 weeks" },
      { type: "Commercial TI", time: "4–8 weeks" },
      { type: "New commercial construction", time: "8–14 weeks" },
    ],
    note: "Dallas generally moves faster than Austin for residential permits. Commercial projects involving Historic or Landmark designations can add 4–6 weeks.",
    color: "#FF6B00",
  },
  {
    name: "Houston, TX",
    href: "/houston",
    portal: "Houston Permitting Center",
    times: [
      { type: "Simple repair / replacement", time: "1–2 weeks" },
      { type: "Residential addition", time: "2–4 weeks" },
      { type: "New residential build", time: "3–8 weeks" },
      { type: "Commercial TI", time: "3–6 weeks" },
      { type: "New commercial construction", time: "6–12 weeks" },
    ],
    note: "Houston's no-zoning policy eliminates zoning review time, which can make it faster than other Texas cities for some project types. Flood zone reviews add time in certain areas.",
    color: "#FF6B00",
  },
  {
    name: "San Antonio, TX",
    href: "/san-antonio",
    portal: "SAICIMS (Accela)",
    times: [
      { type: "Simple repair / replacement", time: "1–3 weeks" },
      { type: "Residential addition", time: "3–5 weeks" },
      { type: "New residential build", time: "4–10 weeks" },
      { type: "Commercial TI", time: "3–7 weeks" },
      { type: "New commercial construction", time: "8–16 weeks" },
    ],
    note: "San Antonio projects in Historic Districts (King William, Lavaca, etc.) require Office of Historic Preservation review, which adds 2–4 weeks to most timelines.",
    color: "#FF6B00",
  },
];

export default function AveragePermitTimesPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Texas</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 6 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          AVERAGE BUILDING PERMIT APPROVAL TIMES IN TEXAS (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          How long will it actually take to get a building permit in Austin, Dallas, Houston, or
          San Antonio? We break it down by city and project type — so you can plan your schedule
          with realistic expectations.
        </p>
      </header>

      <div className="space-y-10 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY PERMIT TIMES VARY SO MUCH</h2>
          <p>
            Permit approval times depend on several factors that are mostly outside your control:
          </p>
          <ul className="space-y-2 mt-3 ml-4">
            {[
              "Application completeness — incomplete submissions restart the clock",
              "Project complexity — new commercial construction gets more scrutiny",
              "Department workload — a construction boom means longer queues",
              "Historic or environmental overlays — trigger additional reviews",
              "Trade permits — electrical, mechanical, and plumbing are reviewed separately",
              "Inspector availability — inspection backlogs add days or weeks at the end",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            The timelines below are based on typical applications that were submitted correctly and
            completely. Expect 20–50% longer if your first submission gets kicked back for corrections.
          </p>
        </section>

        {CITIES.map((city) => (
          <section key={city.name}>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-4">
              <Link href={city.href} className="hover:text-[#FF6B00] transition-colors">{city.name.toUpperCase()}</Link>
            </h2>
            <p className="text-xs text-[#F5F0E8]/40 font-mono mb-4">Portal: {city.portal}</p>

            <div className="border border-[#FF6B00]/20 overflow-hidden mb-4">
              <div className="grid grid-cols-2 border-b border-[#FF6B00]/20 bg-[#FF6B00]/5 px-5 py-3">
                <span className="text-[10px] tracking-[0.2em] text-[#FF6B00]/60 uppercase">Project Type</span>
                <span className="text-[10px] tracking-[0.2em] text-[#FF6B00]/60 uppercase text-right">Typical Timeline</span>
              </div>
              {city.times.map((row, i) => (
                <div key={row.type} className={`grid grid-cols-2 px-5 py-3 ${i < city.times.length - 1 ? "border-b border-[#FF6B00]/10" : ""} ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"}`}>
                  <span className="text-xs text-[#F5F0E8]/60">{row.type}</span>
                  <span className="text-xs font-mono text-[#FF6B00] text-right">{row.time}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#F5F0E8]/40 italic">{city.note}</p>
          </section>
        ))}

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO SPEED UP YOUR PERMIT</h2>
          <div className="space-y-4">
            {[
              { tip: "Submit a complete application the first time", detail: "Every missing document resets your review queue position. Use the city's pre-application checklist and have an architect or engineer review before submission." },
              { tip: "Respond to corrections within 24 hours", detail: "When a reviewer flags a correction, the clock stops until you respond. Contractors who resubmit the same day get back in the front of the line." },
              { tip: "Schedule inspections before you need them", detail: "Houston and Austin inspection backlogs can run 1–2 weeks. Book your rough-in and final inspections before you're ready — you can reschedule, but you can't un-wait." },
              { tip: "Use third-party plan review for commercial projects", detail: "Austin, Dallas, and San Antonio all allow third-party plan review for commercial projects. This can cut weeks off approval times but adds upfront cost." },
            ].map((item) => (
              <div key={item.tip} className="border-l-2 border-[#FF6B00]/40 pl-4">
                <div className="text-xs font-mono font-bold text-[#FF6B00] mb-1">{item.tip}</div>
                <div className="text-xs text-[#F5F0E8]/50 leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">KNOW THE MOMENT YOUR PERMIT CLEARS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            You can&apos;t speed up the city. But you can make sure you&apos;re the first to know when the
            decision is made. ClearedNo monitors your permit and sends an instant alert — so your
            crew starts work the same day it clears, not two days later.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors"
          >
            START MONITORING FREE →
          </Link>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog/how-to-check-austin-permit-status" className="hover:text-[#FF6B00] transition-colors">← Check Austin Permit Status</Link>
          <Link href="/blog/what-does-permit-cleared-mean" className="hover:text-[#FF6B00] transition-colors">
            What Does Permit Cleared Mean? →
          </Link>
        </nav>
      </div>
    </article>
  );
}
