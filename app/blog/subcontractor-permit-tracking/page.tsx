import type { Metadata } from "next";
import Link from "next/link";
import PermitAlertSignup from "@/app/permit-alert-signup";

const TITLE = "Subcontractor Permit Tracking — How GCs Monitor Trade Permits (2026)";
const DESCRIPTION =
  "Track subcontractor permits across electrical, plumbing, HVAC and roofing trades. How general contractors monitor trade permits, avoid inspection delays, and keep projects on schedule.";
const URL = "https://www.clearedno.com/blog/subcontractor-permit-tracking";

export const metadata: Metadata = {
  title: `${TITLE} | ClearedNo`,
  description: DESCRIPTION,
  keywords: [
    "subcontractor permit tracking",
    "track subcontractor permits",
    "general contractor permit tracking",
    "trade permit monitoring",
    "electrical permit status tracking",
    "GC permit management 2026",
    "subcontractor inspection tracking",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-07-30",
  dateModified: "2026-07-30",
};

const WHY_MANUAL_FAILS = [
  "You don't have portal logins for permits you didn't pull — the sub applied under their own license and account",
  "You're relying on the sub to self-report, and nobody volunteers bad news quickly",
  "A failed inspection gets reported at the next progress meeting, not the afternoon it happened",
  "Subs working several GCs' jobs at once aren't watching your schedule — they're watching theirs",
  "Chasing five trades for status by text every morning is its own part-time job",
];

const TRADE_SEQUENCE = [
  {
    stage: "Foundation",
    trade: "GC / concrete",
    gate: "Footing and foundation inspection must pass before framing starts.",
  },
  {
    stage: "Framing",
    trade: "GC / framer",
    gate: "Framing inspection gates the rough-in trades. Nothing goes in the walls until it passes.",
  },
  {
    stage: "Rough electrical",
    trade: "Electrician",
    gate: "Requires the electrician's own permit. Rough electrical inspection must pass before insulation.",
  },
  {
    stage: "Rough plumbing",
    trade: "Plumber",
    gate: "Separate plumbing permit. Usually inspected alongside or just after rough electrical.",
  },
  {
    stage: "Rough mechanical",
    trade: "HVAC",
    gate: "Separate mechanical permit. All three rough-ins typically must pass before insulation is approved.",
  },
  {
    stage: "Insulation",
    trade: "Insulator",
    gate: "Blocked until every rough-in inspection has passed. One open correction holds the whole stage.",
  },
  {
    stage: "Drywall",
    trade: "Drywall crew",
    gate: "Cannot cover work that hasn't been inspected. Hanging early risks tear-out.",
  },
  {
    stage: "Final",
    trade: "All trades",
    gate: "Each trade needs its own final inspection before the building final and certificate of occupancy.",
  },
];

const TRACK_FIELDS = [
  {
    field: "Permit number",
    why: "The only reliable handle on the permit. Everything else — status, inspections, expiration — is looked up from it.",
  },
  {
    field: "Trade",
    why: "Tells you which downstream stage is blocked when this permit stalls.",
  },
  {
    field: "Current status",
    why: "Applied, issued, inspection scheduled, passed, failed, or hold. Determines whether the sub can actually work.",
  },
  {
    field: "Last inspection result",
    why: "A failed rough-in is the single most common cause of a cascading schedule slip. You want this the day it happens.",
  },
  {
    field: "Expiration date",
    why: "Permits lapse after a period of inactivity. An expired sub permit mid-project stops that trade cold.",
  },
];

const HOW_TO_TRACK = [
  {
    title: "Collect permit numbers at contract signing",
    body: "Make the permit number a deliverable in the subcontract, due as soon as the sub pulls it. This is the single highest-leverage change — it costs nothing and it's much harder to get the number after a dispute has started.",
  },
  {
    title: "Monitor by permit number, not by login",
    body: "Building permits are public record. Status, inspection history, and expiration are visible to anyone with the permit number — you do not need the subcontractor's portal credentials, and you should not be asking for them.",
  },
  {
    title: "Get alerted on status change",
    body: "Manual lookups only tell you the state of things at the moment you looked. Alerts tell you the moment something moves — which is when the information is actually worth something.",
  },
  {
    title: "Track every trade on one board",
    body: "The value isn't in watching one permit. It's in seeing all four rough-in trades at once and knowing which one is about to hold up insulation.",
  },
];

const DELAY_COSTS = [
  "Idle crew on site with nothing to do: roughly $2,000–$2,400 per day",
  "A failed rough-in nobody reports for three days: three days of downstream trades pushed",
  "Cascading slip — insulation, drywall, and finish trades each rescheduled behind the delay",
  "Rescheduled subs go to their next job and come back when they have an opening, not when you need them",
  "On commercial work, liquidated damages accrue per calendar day of delay regardless of whose permit caused it",
];

const CLEAREDNO_FEATURES = [
  "Track any permit by number — including permits your subcontractors pulled",
  "Unlimited permits on one flat $79/month plan, no per-permit or per-trade fees",
  "Email alerts on any status change: issued, inspection passed, failed, hold, or expired",
  "Full audit trail of every status change with timestamps",
  "Multiple trades across multiple cities on a single board",
];

const COMPARISON_ROWS = [
  {
    label: "Accuracy",
    manual: "Secondhand — as accurate as the sub's last update",
    clearedno: "Read directly from the city record",
  },
  {
    label: "Speed",
    manual: "Days late, often at the next progress meeting",
    clearedno: "Alert within hours of the city updating",
  },
  {
    label: "GC time spent",
    manual: "Chasing five trades every morning",
    clearedno: "Zero — alerts come to you",
  },
  {
    label: "Audit trail",
    manual: "Texts and memory",
    clearedno: "Timestamped status history",
  },
  {
    label: "Failed inspections",
    manual: "Found out when the schedule already slipped",
    clearedno: "Same-day alert",
  },
  { label: "Cost", manual: "Your time, plus the delays you miss", clearedno: "$79/month flat" },
];

const FAQS = [
  {
    q: "Can a general contractor track a subcontractor's permit?",
    a: "Yes. Building permits are public records. As long as you have the permit number, you can look up its status, inspection history, and expiration date — regardless of who pulled it or whose license it sits under.",
  },
  {
    q: "Do I need the subcontractor's login to check their permit?",
    a: "No. Portal logins are only needed to file applications, upload documents, and manage a permit. Reading status is public. You should not be asking subs for their portal credentials — tracking by permit number gets you everything you need.",
  },
  {
    q: "What happens if a subcontractor's permit expires mid-project?",
    a: "That trade stops until the permit is renewed or re-pulled, and any inspection tied to it is on hold. Most jurisdictions expire permits after a set period with no inspection activity, so a sub who goes quiet for months can lapse without either of you noticing. Tracking the expiration date is what catches this before it becomes a stoppage.",
  },
  {
    q: "How do I get my subcontractors' permit numbers?",
    a: "Ask for it in the subcontract as a deliverable due when the permit is pulled. Most subs provide it without issue — it's a normal request. Getting it written into the agreement up front is far easier than chasing it later, particularly if the relationship has soured.",
  },
  {
    q: "Can I track permits across multiple trades and cities at once?",
    a: "Yes. ClearedNo tracks unlimited permits across supported cities on one flat plan, so a GC running electrical in one city and mechanical in another sees every trade on a single board.",
  },
];

const RELATED = [
  {
    title: "Permit Tracking Software for Contractors (2026) — Automate Status Checks",
    href: "/blog/permit-tracking-software-for-contractors",
  },
  {
    title: "Tracking Multiple Permits Without Losing Your Mind",
    href: "/blog/contractor-permit-tracking-multiple-jobs",
  },
  {
    title: "Building Permit Status Check — How to Find Any Permit in the Midwest",
    href: "/blog/building-permit-status-check-guide",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function SubcontractorPermitTrackingPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">
            General Contractors
          </span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">July 2026 · 9 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          SUBCONTRACTOR PERMIT TRACKING — HOW GCS MONITOR TRADE PERMITS (2026)
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          As a general contractor, your schedule depends on permits you didn&apos;t pull. The
          electrician&apos;s permit gates rough electrical. The rough inspection gates insulation.
          You&apos;re accountable for a timeline controlled by other people&apos;s paperwork — and
          usually you find out something went wrong days after it did. This guide covers how GCs
          track subcontractor permits across trades in 2026.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        {/* The problem */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            YOUR SCHEDULE, SOMEONE ELSE&apos;S PAPERWORK
          </h2>
          <p>
            On any project with separate trade permits, the general contractor owns the schedule but
            not the permits that control it. The electrician pulls their own electrical permit under
            their own license. The plumber pulls theirs. The mechanical contractor pulls theirs.
            Each one is a separate record, in a separate account, with its own status and its own
            inspection history.
          </p>
          <p className="mt-3">
            Rough electrical can&apos;t start until the electrician&apos;s permit is issued.
            Insulation can&apos;t be approved until every rough-in inspection has passed. Drywall
            can&apos;t cover work that hasn&apos;t been signed off. The dependency chain runs through
            paperwork you didn&apos;t file and can&apos;t directly control.
          </p>
          <p className="mt-3">
            When the owner asks why the project slipped two weeks, &ldquo;the electrician&apos;s
            permit had a correction and nobody told me&rdquo; is not an answer that protects you.
            The GC carries the schedule regardless of which trade caused the delay.
          </p>
        </section>

        {/* Why manual fails */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            WHY MANUAL TRACKING BREAKS AT THE SUBCONTRACTOR LAYER
          </h2>
          <p>
            Tracking your own permits manually is tedious. Tracking your subs&apos; permits manually
            barely works at all:
          </p>
          <ul className="space-y-3 mt-4 ml-4">
            {WHY_MANUAL_FAILS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            The structural problem is that your information is secondhand. You&apos;re not reading
            the permit record — you&apos;re reading a subcontractor&apos;s summary of it, delivered
            on their schedule, with their incentives attached.
          </p>
        </section>

        {/* Inline CTA */}
        <div className="border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed">
            <strong className="text-[#F5F0E8]">Stop relying on sub check-ins.</strong> ClearedNo
            tracks any permit by number — including your subs&apos; — and emails you the moment
            status changes. First month free.
          </p>
          <Link
            href="/permits/landing"
            className="inline-block flex-shrink-0 bg-[#FF6B00] text-[#0A0A0A] font-mono text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
          >
            START FREE →
          </Link>
        </div>

        {/* Trade sequence */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            THE TRADE SEQUENCE — WHERE PERMITS GATE PROGRESS
          </h2>
          <p>
            Every stage below has a permit and an inspection dependency. A stall at any one of them
            pushes everything after it:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Stage</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Permit Holder</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">What It Gates</th>
                </tr>
              </thead>
              <tbody>
                {TRADE_SEQUENCE.map((row) => (
                  <tr key={row.stage} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono whitespace-nowrap">{row.stage}</td>
                    <td className="py-3 pr-6 text-[#F5F0E8]/60 whitespace-nowrap">{row.trade}</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            The rough-in cluster is where most GCs get hurt. Three separate trades, three separate
            permits, three separate inspections — and insulation waits on all of them. If the
            plumber&apos;s rough fails on a Tuesday and you hear about it the following Monday,
            you&apos;ve lost a week you can&apos;t bill for.
          </p>
        </section>

        {/* What to track */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            WHAT TO TRACK FOR EVERY SUBCONTRACTOR
          </h2>
          <p>Five fields per trade permit. That&apos;s the whole picture:</p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-6 whitespace-nowrap">Field</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2">Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                {TRACK_FIELDS.map((row) => (
                  <tr key={row.field} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-6 text-[#F5F0E8] font-mono whitespace-nowrap">{row.field}</td>
                    <td className="py-3 text-[#F5F0E8]/60">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cost of delay */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            THE COST OF A MISSED SUBCONTRACTOR PERMIT DELAY
          </h2>
          <p>
            A subcontractor permit problem is more expensive than an equivalent delay on your own
            permit, because it surfaces later and lands mid-sequence:
          </p>
          <ul className="space-y-3 mt-4 ml-4">
            {DELAY_COSTS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            The compounding is what hurts. A three-day reporting lag on a failed rough-in
            doesn&apos;t cost three days — it costs three days plus however long it takes to get
            each downstream trade back on site. On commercial work with liquidated damages, that
            gap is billed to you regardless of which subcontractor&apos;s permit caused it.
          </p>
        </section>

        {/* How to track */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            HOW TO TRACK SUBCONTRACTOR PERMITS
          </h2>
          <ul className="space-y-4 mt-4 ml-4">
            {HOW_TO_TRACK.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <div>
                  <strong className="text-[#F5F0E8]">{item.title}.</strong> {item.body}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            None of this requires cooperation beyond the permit number itself. Once you have that,
            the city record is open to you — and you stop depending on anyone to tell you the truth
            about their own schedule.
          </p>
        </section>

        {/* ClearedNo */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            TRACKING SUBCONTRACTOR PERMITS WITH CLEAREDNO
          </h2>
          <p>
            ClearedNo tracks any permit by its number — yours or your subcontractors&apos; — and
            emails you the moment the status changes. Add the electrician&apos;s permit, the
            plumber&apos;s, and the mechanical contractor&apos;s alongside your own, and the whole
            rough-in cluster is visible on one board.
          </p>
          <ul className="space-y-3 mt-4 ml-4">
            {CLEAREDNO_FEATURES.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">■</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <strong className="text-[#F5F0E8]">Pricing:</strong> First month free, then $79/month
            flat for unlimited permits. Cancel anytime.
          </p>
          <p className="mt-3">
            One caught rough-in failure pays for the year. The audit trail is worth something on its
            own the first time a delay claim turns into a disagreement about who knew what and when.
          </p>
          <div className="mt-5">
            <Link
              href="/permits/landing"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors"
            >
              START YOUR FREE MONTH — TRACK EVERY TRADE →
            </Link>
          </div>
        </section>

        {/* Comparison table */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">
            SUB CHECK-INS VS AUTOMATED TRACKING
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#FF6B00]/30">
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-8 whitespace-nowrap"></th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 pr-8 whitespace-nowrap">Asking the Sub</th>
                  <th className="text-left text-[#FF6B00] font-mono tracking-widest uppercase py-2 whitespace-nowrap">ClearedNo</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-8 text-[#F5F0E8] font-mono whitespace-nowrap">{row.label}</td>
                    <td className="py-3 pr-8 text-[#F5F0E8]/60">{row.manual}</td>
                    <td className="py-3 text-[#F5F0E8]/60">{row.clearedno}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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

        {/* Related posts */}
        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">RELATED POSTS</h2>
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
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">
            TRACK EVERY TRADE PERMIT ON YOUR JOB
          </h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Add your subcontractors&apos; permit numbers and ClearedNo watches all of them — issued,
            inspection passed, failed, hold, or expiring. No portal logins, no chasing subs for
            status. Unlimited permits, first month free, then $79/month. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/permits/landing"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              TRACK SUB PERMITS — START FREE →
            </Link>
            <Link
              href="/permits/landing"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/60 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
            >
              SEE HOW IT WORKS
            </Link>
          </div>
        </div>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog/permit-tracking-software-for-contractors" className="hover:text-[#FF6B00] transition-colors">
            ← Permit Tracking Software for Contractors
          </Link>
          <Link href="/blog/contractor-permit-tracking-multiple-jobs" className="hover:text-[#FF6B00] transition-colors">
            Tracking Multiple Permits Without Losing Your Mind →
          </Link>
        </nav>
      </div>

      {/* Email capture */}
      <PermitAlertSignup projectType="subcontractor-permit-tracking" />
    </article>
  );
}
