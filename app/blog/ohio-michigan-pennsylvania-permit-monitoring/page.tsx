import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Permit Monitoring Coming to Ohio, Michigan & Pennsylvania — Join the Waitlist | ClearedNo",
  description:
    "ClearedNo is expanding permit monitoring to Ohio, Michigan, and Pennsylvania. Columbus, Cleveland, Cincinnati, Grand Rapids, Detroit, Philadelphia, and Pittsburgh — request your city now.",
  keywords: [
    "Ohio permit monitoring",
    "Michigan permit tracking",
    "Pennsylvania permit alerts",
    "Columbus permit monitoring",
    "Philadelphia permit tracking",
    "Grand Rapids permit alerts",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/ohio-michigan-pennsylvania-permit-monitoring" },
  openGraph: {
    title: "Permit Monitoring Coming to Ohio, Michigan & Pennsylvania",
    description: "ClearedNo is expanding to OH, MI, and PA. Request your city now.",
    url: "https://www.clearedno.com/blog/ohio-michigan-pennsylvania-permit-monitoring",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Permit Monitoring Coming to Ohio, Michigan & Pennsylvania — Join the Waitlist",
  description: "ClearedNo expansion announcement for Ohio, Michigan, and Pennsylvania permit monitoring.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
};

export default function OhioMichiganPennsylvaniaPermitMonitoringPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Expansion</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 5 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          PERMIT MONITORING COMING TO OHIO, MICHIGAN &amp; PENNSYLVANIA — JOIN THE WAITLIST
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          ClearedNo started in Texas. The demand from contractors in Ohio, Michigan, and Pennsylvania has been clear — and we&apos;re building it. Here&apos;s what&apos;s coming and how to get on the list for your city.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY WE STARTED IN TEXAS</h2>
          <p>
            ClearedNo launched in Austin and Dallas because that&apos;s where the founders were working and where the problem was most acute. Texas is a high-growth construction market with four major metro areas — Austin, Dallas, Houston, San Antonio — all running their own permit systems with no unified notification layer.
          </p>
          <p className="mt-3">
            The Texas market validated that the core problem — contractors spending hours per week manually checking city portals — was real, widespread, and expensive. Contractors who started monitoring immediately saw the value: permit clearances found the same morning they happened, corrections caught the day they were issued instead of days later.
          </p>
          <p className="mt-3">
            Once we had Texas working well, the requests started coming in from other states. Ohio first. Then Michigan and Pennsylvania. All markets with significant construction activity, all with the same manual-checking problem Texas had.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY OHIO, MICHIGAN, AND PENNSYLVANIA</h2>
          <p>
            These three states share a few characteristics that make them natural next markets for permit monitoring:
          </p>
          <ul className="space-y-4 mt-4 ml-4">
            {[
              {
                title: "Major metro construction activity",
                body: "Columbus is one of the fastest-growing cities in the Midwest. Grand Rapids has a robust construction market. Philadelphia and Pittsburgh together represent a significant volume of commercial and residential permitting.",
              },
              {
                title: "Fragmented permit systems",
                body: "Ohio, Michigan, and Pennsylvania all have city-level permit systems with no state-level coordination. Columbus uses Accela, Cleveland uses its own system, Cincinnati splits between the city and Hamilton County. Michigan municipalities largely use BS&A Online. Pennsylvania cities run eCLIPSE or proprietary systems. The fragmentation is exactly the problem we solve.",
              },
              {
                title: "Contractor demand",
                body: "The cities we're adding — Columbus, Philadelphia, Grand Rapids — came directly from contractor requests via our suggest-city form. That's the clearest signal: contractors in these markets want this.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{item.title}.</strong> {item.body}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT&apos;S COMING — CITY BY CITY</h2>

          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">OHIO</h3>
              <p>
                <strong className="text-[#F5F0E8]">Columbus</strong> — The largest city in Ohio, Columbus uses the Accela permit platform. We&apos;re integrating with Columbus&apos;s Accela API for real-time permit status. Columbus is the most requested Ohio city and will be the first live.
              </p>
              <p className="mt-3">
                <strong className="text-[#F5F0E8]">Cleveland</strong> — Cleveland&apos;s Building &amp; Housing department runs a separate portal. Monitoring will be available for Cleveland commercial and residential permits.
              </p>
              <p className="mt-3">
                <strong className="text-[#F5F0E8]">Cincinnati</strong> — Cincinnati splits between the city&apos;s system and Hamilton County depending on jurisdiction. We&apos;re building support for both.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">MICHIGAN</h3>
              <p>
                <strong className="text-[#F5F0E8]">Grand Rapids</strong> — Grand Rapids uses BS&A Online, a platform used by hundreds of Michigan municipalities. Monitoring Grand Rapids via BS&A is the first step toward broader Michigan coverage.
              </p>
              <p className="mt-3">
                <strong className="text-[#F5F0E8]">Detroit</strong> — Detroit&apos;s BSEED system has its own portal. Detroit permit monitoring is on the roadmap for later in 2026.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">PENNSYLVANIA</h3>
              <p>
                <strong className="text-[#F5F0E8]">Philadelphia</strong> — Philadelphia uses the eCLIPSE portal for L&amp;I permits. The eCLIPSE API is publicly accessible, making Philadelphia one of the cleaner integrations.
              </p>
              <p className="mt-3">
                <strong className="text-[#F5F0E8]">Pittsburgh</strong> — Pittsburgh&apos;s PLI department uses its own portal. Pittsburgh monitoring is planned for the second half of 2026.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO GET YOUR CITY ADDED FASTER</h2>
          <p>
            We prioritize city expansion based on the number of contractor requests we receive. The more contractors who request a city, the higher it moves in the queue.
          </p>
          <p className="mt-3">
            If you&apos;re a contractor in Ohio, Michigan, or Pennsylvania — or any other state — and you want permit monitoring in your city, the fastest way to make it happen is to submit a city request. We track these by city and use them directly to determine build priority.
          </p>
          <p className="mt-3">
            Cities with 10+ requests from contractors in the same market typically go live within 2–4 weeks.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE SAME PROBLEM, DIFFERENT ZIP CODE</h2>
          <p>
            Whether you&apos;re checking Columbus&apos;s Accela portal, Grand Rapids&apos;s BS&A system, or Philadelphia&apos;s eCLIPSE — the core problem is identical to what Texas contractors face. No push notifications. No email alerts. A portal you have to log into manually to find out if anything changed.
          </p>
          <p className="mt-3">
            Contractors in Columbus are losing the same hours to manual portal checks that Austin contractors were losing before they started using ClearedNo. The geography changes. The problem doesn&apos;t.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">REQUEST YOUR CITY — MOVE IT UP THE LIST</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Tell us which city you need monitored. The more requests a city gets, the faster we build it.
            Ohio, Michigan, and Pennsylvania contractors — your requests directly shape the expansion schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/suggest-city"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              REQUEST YOUR CITY →
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              SEE HOW IT WORKS
            </Link>
          </div>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog/permit-cleared-what-happens-next" className="hover:text-[#FF6B00] transition-colors">← Permit Cleared: What Happens Next</Link>
          <Link href="/blog/columbus-ohio-building-permit-status-check" className="hover:text-[#FF6B00] transition-colors">
            Columbus Ohio Permit Guide →
          </Link>
        </nav>
      </div>
    </article>
  );
}
