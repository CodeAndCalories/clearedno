import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Permit Status Pending: What It Means and What to Do While You Wait | ClearedNo",
  description:
    "What each permit status actually means — pending, under review, approved, cleared, rejected. What contractors should do at each stage and how monitoring catches the moment it changes.",
  keywords: [
    "permit status pending",
    "building permit pending meaning",
    "permit pending contractor guide",
    "permit status meanings",
    "what does permit pending mean",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/permit-status-pending-what-it-means" },
  openGraph: {
    title: "Permit Status Pending: What It Means and What to Do While You Wait",
    description: "Every permit status explained — what each one means and what contractors should do at each stage.",
    url: "https://www.clearedno.com/blog/permit-status-pending-what-it-means",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Permit Status Pending: What It Means and What to Do While You Wait",
  description: "A contractor's guide to permit status terminology and what to do at each stage.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
};

export default function PermitStatusPendingPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">Permits 101</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">March 2026 · 7 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          PERMIT STATUS PENDING: WHAT IT MEANS AND WHAT TO DO WHILE YOU WAIT
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          City permit portals use different terminology and the same word can mean different things in different systems. Here&apos;s a plain-language breakdown of every status you&apos;re likely to see — and what you should actually be doing at each stage.
        </p>
      </header>

      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY PERMIT STATUS TERMINOLOGY IS CONFUSING</h2>
          <p>
            There is no standardized permit status vocabulary across U.S. cities. Every city builds its own permitting system — Austin uses Accela-based ABC, Houston uses AMANDA, Dallas uses eDevelopment, San Antonio uses SAconnect — and each system uses its own terminology.
          </p>
          <p className="mt-3">
            A status called &ldquo;Issued&rdquo; in one city means the same thing as &ldquo;Approved&rdquo; or &ldquo;Released&rdquo; in another. &ldquo;Finaled&rdquo; and &ldquo;Closed&rdquo; and &ldquo;Completed&rdquo; all typically mean the same thing. &ldquo;Pending&rdquo; can mean your application was received and is waiting for review, or it can mean something else entirely depending on where you look.
          </p>
          <p className="mt-3">
            This guide uses general terms. Where city-specific terminology differs meaningfully, we&apos;ll note it.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">STATUS BY STATUS — WHAT EACH ONE MEANS</h2>

          <div className="space-y-6 mt-4">

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">PENDING / SUBMITTED / APPLIED</h3>
              <p>
                Your application has been received and logged. It hasn&apos;t been assigned to a reviewer yet. This is the holding status between submission and the start of actual review.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Nothing yet. Wait for the status to change to Under Review or equivalent. Monitor so you know the moment it moves — some permits sit in Pending for days before a reviewer picks them up.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">UNDER REVIEW / IN REVIEW / PLAN CHECK</h3>
              <p>
                A reviewer has picked up your application and is actively working through it. Depending on project complexity and department, this can last days to weeks. On complex commercial projects with concurrent review across multiple departments, this stage can take months.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Stay available. Reviewers may contact you with questions or pre-correction discussions. Keep monitoring — when the status changes from Under Review, it&apos;s either a Correction or an Approval, both of which require fast action.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">CORRECTIONS REQUIRED / REVISION NEEDED</h3>
              <p>
                The reviewer found issues with your application — missing documentation, code conflicts, incomplete drawings, or other deficiencies. A correction letter has been issued detailing what needs to be addressed before the permit can move forward.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Act immediately. Read the correction letter the same day it lands. Get your design team or engineer on it. Every day you sit on a correction letter is a day added to your timeline. Resubmit as fast as humanly possible — your permit goes back into the review queue when you do, not to the front.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">APPROVED / ISSUED / PERMIT ISSUED / RELEASED</h3>
              <p>
                Review is complete, the permit has been approved, and work may legally commence. This is the status change you&apos;ve been waiting for. The permit card needs to be on site before work starts — pull and print it from the portal immediately.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Move fast. Download the permit card. Call your foreman. Confirm sub availability. Lock in materials delivery. The first contractor to mobilize after clearance maintains schedule — every hour of lag is lost time.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">CLEARED / FINAL / FINALED / COMPLETED / CLOSED</h3>
              <p>
                The work covered by the permit has been completed and passed final inspection. This is the end of the permit lifecycle — your project is officially done from a permitting standpoint. A Certificate of Occupancy (CO) may be issued separately for applicable project types.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Document it. Keep a record of the final status and inspection date. This is important for warranty claims, future renovations, and property transactions.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">EXPIRED / LAPSED</h3>
              <p>
                The permit was issued but work was not completed within the required timeframe, or the permit was not acted on after issuance within the allowable period (typically 180 days from issuance). An expired permit usually requires a renewal application and associated fees.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Contact the permitting department immediately about renewal options. Do not resume work without reactivating the permit — working under an expired permit can result in stop-work orders and fines.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B00]/40 pl-5">
              <h3 className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">DENIED / REJECTED / WITHDRAWN / REVOKED</h3>
              <p>
                The application was denied by the city, withdrawn by the applicant, or the permit was revoked after issuance (typically for code violations or misrepresentation). This is a hard stop that requires a new application process.
              </p>
              <p className="mt-2 text-[#F5F0E8]/50">
                <strong className="text-[#F5F0E8]/70">What to do:</strong> Request a detailed explanation from the permitting department. Understand the specific grounds for denial before resubmitting. In some cases, an appeal process is available.
              </p>
            </div>

          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHY MONITORING MATTERS AT EVERY STAGE</h2>
          <p>
            Each status transition has a time-sensitivity component. When your permit moves from Pending to Under Review — no action required, but you want to know it&apos;s moving. When it moves from Under Review to Corrections Required — you need to know within hours, not days. When it moves to Approved — you want to mobilize the same day.
          </p>
          <p className="mt-3">
            The problem with manual checking is that you don&apos;t know which transition is coming next or when. You could check Tuesday morning, see &ldquo;Under Review,&rdquo; and not check again until Thursday — missing a correction letter that landed Tuesday afternoon. Or miss an approval that came through Wednesday.
          </p>
          <p className="mt-3">
            Automatic monitoring means you find out within 2 hours of any transition, regardless of which one it is or when the city processes it. You&apos;re never more than 2 hours behind the city&apos;s most recent update.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">KNOW THE MOMENT YOUR STATUS CHANGES</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            ClearedNo monitors your permits every 2 hours. Corrections, approvals, clearances — you get an email the moment anything moves.
            First month free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
            >
              START YOUR 30-DAY FREE TRIAL →
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
          <Link href="/blog/how-to-never-miss-permit-approval" className="hover:text-[#FF6B00] transition-colors">← Never Miss a Permit Approval</Link>
          <Link href="/blog/what-does-permit-cleared-mean" className="hover:text-[#FF6B00] transition-colors">
            What Does &apos;Permit Cleared&apos; Mean? →
          </Link>
        </nav>
      </div>
    </article>
  );
}
