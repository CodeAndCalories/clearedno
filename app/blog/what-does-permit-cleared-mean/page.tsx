import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Does 'Permit Cleared' Actually Mean? A Contractor's Guide | ClearedNo",
  description:
    "The difference between pending, approved, issued, cleared, finaled, and expired permits — and what you can legally do at each stage.",
  keywords: ["permit cleared meaning", "building permit status", "permit approved vs issued", "what does permit status mean", "permit finaled"],
  alternates: { canonical: "https://www.clearedno.com/blog/what-does-permit-cleared-mean" },
  openGraph: {
    title: "What Does 'Permit Cleared' Actually Mean? A Contractor's Guide",
    description: "Every permit status explained — from pending to finaled.",
    url: "https://www.clearedno.com/blog/what-does-permit-cleared-mean",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Does 'Permit Cleared' Actually Mean? A Contractor's Guide",
  description: "Explains building permit statuses: pending, approved, issued, cleared, finaled, expired.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-01",
  dateModified: "2026-03-28",
};

const STATUSES = [
  {
    status: "PENDING",
    aka: "Application Received, In Queue, Submitted",
    meaning: "Your application has been received but hasn't been assigned to a plans reviewer yet. It's sitting in the queue.",
    canYouStart: false,
    action: "Wait. Nothing you can do at this stage except make sure your application is complete and correct.",
  },
  {
    status: "UNDER REVIEW",
    aka: "In Review, Plan Review, Active Review",
    meaning: "A plans examiner is actively looking at your application. They may have questions or require corrections.",
    canYouStart: false,
    action: "Watch your email. Corrections requests often arrive with short response windows — missing one can push you back in the queue.",
  },
  {
    status: "CORRECTIONS REQUIRED",
    aka: "Comments Issued, Deficiency, Additional Info Required",
    meaning: "The reviewer found problems with your application. You'll receive a comment letter listing what needs to be fixed or resubmitted.",
    canYouStart: false,
    action: "Respond within 24 hours if possible. The clock stops while corrections are pending. Every day you wait is a day added to your timeline.",
  },
  {
    status: "APPROVED",
    aka: "Ready for Issuance, Payment Required",
    meaning: "Plans review is complete and your permit is approved. In some cities, you still need to pay fees or pick up the permit before work can begin.",
    canYouStart: false,
    action: "Pay any outstanding fees immediately. Don't start work until the permit is actually issued (next step).",
  },
  {
    status: "ISSUED",
    aka: "Active, Permit Issued, Open",
    meaning: "Your permit is officially issued. Work can legally begin. Post the permit card at the job site where it's visible from the street.",
    canYouStart: true,
    action: "Start work. Schedule your inspections early — inspection backlogs can add weeks if you wait until you need them.",
  },
  {
    status: "CLEARED / FINALED",
    aka: "Final, Final Inspection Passed, Closed, CO Issued",
    meaning: "All required inspections have passed and the work is complete. If a Certificate of Occupancy was required, it should be issued now.",
    canYouStart: true,
    action: "Project complete. Keep all permit documentation for your records — you may need it if the property is ever sold.",
  },
  {
    status: "EXPIRED",
    aka: "Lapsed, Void",
    meaning: "Your permit has expired — either because work didn't begin within the allowed timeframe or because the project stalled too long between inspections.",
    canYouStart: false,
    action: "Stop work immediately if in progress. You'll need to apply for a new permit (and possibly pay additional fees) to continue.",
  },
];

export default function PermitClearedMeaningPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Permits 101</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 4 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          WHAT DOES &ldquo;PERMIT CLEARED&rdquo; ACTUALLY MEAN? A CONTRACTOR&apos;S GUIDE
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          City permit portals show statuses like &ldquo;Issued,&rdquo; &ldquo;Finaled,&rdquo; &ldquo;Cleared,&rdquo; and &ldquo;In Review&rdquo; —
          but what do they actually mean? And more importantly: when can you start work?
        </p>
      </header>

      <div className="space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">THE QUICK ANSWER</h2>
          <p>
            Different cities use different words for the same concepts. &ldquo;Cleared,&rdquo; &ldquo;Finaled,&rdquo; &ldquo;Final,&rdquo;
            and &ldquo;Closed&rdquo; typically all mean the same thing: <strong className="text-[#F5F0E8]">all inspections have passed
            and the project is complete.</strong>
          </p>
          <p className="mt-3">
            The word &ldquo;cleared&rdquo; specifically comes from the idea that all inspection &ldquo;holds&rdquo; have been
            cleared — every required inspection checkbox has been checked. When ClearedNo sends you
            a &ldquo;CLEARED&rdquo; alert, it means one of these terminal states has been reached.
          </p>
          <div className="mt-4 border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
              <span className="text-xs font-mono text-[#16A34A] font-bold">WHEN YOU CAN START: APPROVED or ISSUED</span>
            </div>
            <p className="text-xs text-[#F5F0E8]/50 mt-2 ml-6">
              In most cities, you can legally start work as soon as the permit is &ldquo;Issued.&rdquo; Some cities
              require you to pay fees first (&ldquo;Approved&rdquo; stage). When in doubt, call the permitting office.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-6">EVERY STATUS, EXPLAINED</h2>
          <div className="space-y-4">
            {STATUSES.map((s) => (
              <div key={s.status} className="border border-[#FF6B00]/20 overflow-hidden">
                <div className={`px-5 py-3 flex items-center justify-between ${s.canYouStart ? "bg-[#16A34A]/10" : "bg-[#FF6B00]/5"}`}>
                  <span className="font-heading text-xl tracking-widest" style={{ color: s.canYouStart ? "#16A34A" : "#FF6B00" }}>
                    {s.status}
                  </span>
                  <span className={`text-[9px] tracking-widest uppercase font-mono px-2 py-0.5 border ${
                    s.canYouStart
                      ? "text-[#16A34A] border-[#16A34A]/40"
                      : "text-[#DC2626] border-[#DC2626]/40"
                  }`}>
                    {s.canYouStart ? "✓ Work OK" : "✗ Do Not Start"}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <p className="text-xs text-[#F5F0E8]/30 font-mono">Also called: {s.aka}</p>
                  <p className="text-sm text-[#F5F0E8]/70">{s.meaning}</p>
                  <div className="border-l-2 border-[#FF6B00]/30 pl-3">
                    <span className="text-[10px] text-[#FF6B00] uppercase tracking-widest font-mono">Action: </span>
                    <span className="text-xs text-[#F5F0E8]/50">{s.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY THE TERMINOLOGY VARIES BY CITY</h2>
          <p>
            Austin, Dallas, Houston, and San Antonio all use different permit software systems with
            their own status vocabulary. Austin&apos;s Accela portal might say &ldquo;Final,&rdquo; while Houston&apos;s
            system shows &ldquo;Finaled,&rdquo; and Dallas might show &ldquo;Closed.&rdquo; They all mean the same thing.
          </p>
          <p className="mt-3">
            ClearedNo normalizes all of these into consistent status labels — PENDING, APPROVED,
            CLEARED, UNDER_REVIEW, REJECTED, and EXPIRED — so you&apos;re not trying to decode city-specific
            jargon at 7 AM before your crew shows up.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">
            GET ALERTED THE MOMENT YOUR STATUS CHANGES
          </h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors your Austin, Dallas, Houston, or San Antonio permits and sends an
            instant alert — email or browser push — when any status changes. Know before your crew
            shows up. No more morning portal checks.
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
          <Link href="/blog/average-permit-times-texas" className="hover:text-[#FF6B00] transition-colors">← Average Permit Times in Texas</Link>
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">All posts →</Link>
        </nav>
      </div>
    </article>
  );
}
