import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hail Damage in Clinton IL — Guide for Roofing Contractors | ClearedNo",
  description:
    "Clinton IL hail damage data for roofing contractors. Storm history, how to find affected properties, and how to canvass before your competition.",
  keywords: [
    "Clinton IL hail damage roofing",
    "DeWitt County storm leads",
    "roofing leads Clinton Illinois",
    "hail damage roof Clinton IL",
    "NOAA hail data DeWitt County",
    "Illinois roofing contractor leads",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/hail-damage-clinton-il" },
  openGraph: {
    title: "Hail Damage in Clinton IL — Guide for Roofing Contractors",
    description:
      "Clinton IL hail damage data for roofing contractors. Storm history, how to find affected properties, and how to canvass before your competition.",
    url: "https://www.clearedno.com/blog/hail-damage-clinton-il",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hail Damage in Clinton IL — Guide for Roofing Contractors",
  description:
    "Clinton IL hail damage data for roofing contractors. Storm history, how to find affected properties, and how to canvass before your competition.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
};

const LEAD_SOURCES = [
  {
    name: "NOAA Storm Events Database",
    desc: "The official source for verified hail reports. Shows county, date, hail size, and path. Updated weekly but runs 60–90 days behind real time.",
  },
  {
    name: "Hail maps",
    desc: "Services like HailTrace and CoreLogic show storm paths overlaid on maps. Useful for visualizing impact zones.",
  },
  {
    name: "Property records",
    desc: "DeWitt County Assessor has property data including owner names and year built. Combining this with storm data gives you a canvassing list.",
  },
  {
    name: "ClearedNo",
    desc: "Pulls NOAA data weekly and cross-references with 270,000+ Midwest property records. Gives you a scored lead list for Clinton and all of Illinois ready to download as a CSV.",
  },
];

export default function HailDamageClintonIlPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Clinton, IL</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">April 2026 · 5 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HAIL DAMAGE IN CLINTON IL — GUIDE FOR ROOFING CONTRACTORS
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          Clinton, Illinois sits in DeWitt County — right in the heart of central Illinois hail
          country. When storms move through, contractors who move fast win the most jobs.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY CLINTON IL GETS HIT HARD</h2>
          <p>
            Central Illinois has some of the most active severe weather in the Midwest. The flat
            terrain gives storms an unobstructed path, meaning hail travels farther and hits harder
            than in more sheltered areas.
          </p>
          <p className="mt-3">
            DeWitt County sees multiple significant hail events per year — storms with hailstones
            1 inch or larger that cross the threshold from cosmetic damage into full roof
            replacement territory.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT ROOFING CONTRACTORS NEED AFTER A CLINTON STORM</h2>
          <p>
            Speed is everything after a hail event. Homeowners start calling contractors within
            24–48 hours. The contractors already knocking doors when the calls start coming in
            close the most jobs.
          </p>
          <p className="mt-3">What you need immediately after a storm:</p>
          <ul className="space-y-3 mt-3">
            {[
              "Which streets and neighborhoods got hit",
              "Property addresses with owner names",
              "Year the home was built — older roofs are priority",
              "Storm severity score — 1\"+ hail vs smaller",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO FIND CLINTON IL HAIL DAMAGE PROPERTIES</h2>
          <div className="space-y-4 mt-2">
            {LEAD_SOURCES.map((source) => (
              <div key={source.name} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{source.name}</strong> — {source.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">CANVASSING CLINTON AFTER A STORM</h2>
          <p>
            Clinton is a smaller market — the whole city is canvassable in a day if you have the
            right list. Here&apos;s the approach that works:
          </p>
          <ol className="space-y-3 mt-4 ml-4">
            {[
              { n: "1", t: "Pull your property list sorted by year built — pre-1990 homes first" },
              { n: "2", t: "Print a canvassing sheet with addresses and owner names" },
              { n: "3", t: "Hit the highest-severity blocks within 48 hours" },
              { n: "4", t: "Leave a door hanger if nobody's home with your estimate offer" },
              { n: "5", t: "Follow up by mail to anyone you missed" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4">
            In a city Clinton&apos;s size, being first means being the only one most homeowners talk to.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">DEWITT COUNTY STORM DATA COVERAGE</h2>
          <p>
            ClearedNo covers all of Illinois including DeWitt County. When hail hits Clinton, the
            next Monday update includes the affected properties scored by severity.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">DOWNLOAD FREE ILLINOIS STORM LEADS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Sample of real properties — owner names, addresses, year built, storm severity.
          </p>
          <Link
            href="/api/sample-download"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            DOWNLOAD FREE SAMPLE →
          </Link>
          <p className="mt-2 text-[9px] text-[#F5F0E8]/25 text-center">IL, OH, IN, MI, KY, and PA covered · No signup needed</p>
        </div>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FAQS</h2>
          <div className="space-y-6">
            {[
              {
                q: "How often does Clinton IL get significant hail?",
                a: "DeWitt County typically sees 2–4 significant hail events per year — storms with 1\"+ hailstones that warrant roof inspection or replacement.",
              },
              {
                q: "What's the best time to canvass after a storm?",
                a: "Within 48 hours if possible. After 72 hours, other contractors and insurance adjusters start flooding the area.",
              },
              {
                q: "Does ClearedNo cover all of DeWitt County?",
                a: "Yes — ClearedNo covers all counties across IL, OH, IN, MI, KY, and PA.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <p className="font-heading text-base tracking-widest text-[#F5F0E8] mb-2">{faq.q}</p>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/hail-damaged-roof-champaign-il" className="hover:text-[#FF6B00] transition-colors">
            Hail Damage in Champaign IL →
          </Link>
        </nav>
      </div>
    </article>
  );
}
