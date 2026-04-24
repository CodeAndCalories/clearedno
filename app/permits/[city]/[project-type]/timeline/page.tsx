import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import StickyPermitCTA from "../sticky-cta";

const YEAR = 2026;

// ─── Static params ────────────────────────────────────────────────────────────

const CITIES = [
  "austin-tx",
  "dallas-tx",
  "houston-tx",
  "san-antonio-tx",
  "columbus-oh",
  "philadelphia-pa",
  "grand-rapids-mi",
  "cleveland-oh",
  "pittsburgh-pa",
  "detroit-mi",
  "cincinnati-oh",
];

const TOP_PROJECT_TYPES = [
  "deck-permit",
  "roof-permit",
  "fence-permit",
  "addition-permit",
  "electrical-permit",
];

export function generateStaticParams() {
  const params: Array<{ city: string; "project-type": string }> = [];
  for (const city of CITIES) {
    for (const pt of TOP_PROJECT_TYPES) {
      params.push({ city, "project-type": pt });
    }
  }
  return params;
}

// ─── City display map ─────────────────────────────────────────────────────────

const CITY_META: Record<string, { name: string; state: string }> = {
  "austin-tx":       { name: "Austin",       state: "TX" },
  "dallas-tx":       { name: "Dallas",       state: "TX" },
  "houston-tx":      { name: "Houston",      state: "TX" },
  "san-antonio-tx":  { name: "San Antonio",  state: "TX" },
  "columbus-oh":     { name: "Columbus",     state: "OH" },
  "philadelphia-pa": { name: "Philadelphia", state: "PA" },
  "grand-rapids-mi": { name: "Grand Rapids", state: "MI" },
  "cleveland-oh":    { name: "Cleveland",    state: "OH" },
  "pittsburgh-pa":   { name: "Pittsburgh",   state: "PA" },
  "detroit-mi":      { name: "Detroit",      state: "MI" },
  "cincinnati-oh":   { name: "Cincinnati",   state: "OH" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PermitRow = {
  city_name: string;
  state: string;
  project_type_label: string;
  base_fee: number | null;
  avg_approval_days: number | null;
  requirements_summary: string[] | null;
  official_url: string | null;
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { city: string; "project-type": string };
}): Promise<Metadata> {
  const cityMeta = CITY_META[params.city];
  if (!cityMeta) return {};

  const { data } = await supabaseAdmin
    .from("city_permits")
    .select("project_type_label, avg_approval_days")
    .eq("city_slug", params.city)
    .eq("project_type_slug", params["project-type"])
    .single();

  if (!data) return {};

  const label = data.project_type_label as string;
  const city = cityMeta.name;
  const state = cityMeta.state;

  const title = `How Long Does a ${label} Take in ${city}? (${YEAR} Timeline)`;
  const description = [
    `How long does a ${label.toLowerCase()} take in ${city}, ${state}?`,
    data.avg_approval_days != null
      ? `Average approval is ${data.avg_approval_days} days.`
      : null,
    `${YEAR} timeline breakdown, common delay causes, and how to speed up your ${city} permit approval.`,
  ]
    .filter(Boolean)
    .join(" ");

  const canonical = `https://www.clearedno.com/permits/${params.city}/${params["project-type"]}/timeline`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timelinePhases(avgDays: number) {
  // Distribute avg_approval_days across realistic permit phases
  const review   = Math.round(avgDays * 0.45);
  const revision = Math.round(avgDays * 0.25);
  const approval = Math.round(avgDays * 0.20);
  const issuance = avgDays - review - revision - approval;

  return [
    {
      phase: "Application & Plan Review",
      days: `${review}–${review + 3} days`,
      detail: "City staff reviews your submitted documents for completeness and code compliance.",
    },
    {
      phase: "Corrections & Resubmission",
      days: `${revision}–${revision + 5} days`,
      detail: "If changes are required, you revise plans and resubmit. This phase can repeat.",
    },
    {
      phase: "Final Approval",
      days: `${approval}–${approval + 2} days`,
      detail: "Reviewer signs off. Status moves from 'Under Review' to 'Approved'.",
    },
    {
      phase: "Permit Issuance",
      days: `${issuance}–${issuance + 2} days`,
      detail: "Permit is issued and available for download. Work may begin.",
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PermitTimelinePage({
  params,
}: {
  params: { city: string; "project-type": string };
}) {
  const { data: permit, error } = await supabaseAdmin
    .from("city_permits")
    .select("city_name, state, project_type_label, base_fee, avg_approval_days, requirements_summary, official_url")
    .eq("city_slug", params.city)
    .eq("project_type_slug", params["project-type"])
    .single();

  if (error || !permit) notFound();

  const row = permit as PermitRow;
  const cityMeta = CITY_META[params.city] ?? { name: row.city_name, state: row.state };
  const label = row.project_type_label;
  const avgDays = row.avg_approval_days ?? 14;
  const parentUrl = `/permits/${params.city}/${params["project-type"]}`;
  const phases = timelinePhases(avgDays);

  // ── FAQ JSON-LD ────────────────────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How long does a ${label.toLowerCase()} take in ${cityMeta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average ${label.toLowerCase()} approval time in ${cityMeta.name}, ${row.state} is ${avgDays} days. This includes plan review, any required corrections, final approval, and permit issuance. Incomplete applications or high-volume periods can extend this significantly.`,
        },
      },
      {
        "@type": "Question",
        name: `What causes permit delays in ${cityMeta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Common causes of ${label.toLowerCase()} delays in ${cityMeta.name} include incomplete application documents, plan review comments requiring corrections, high application volume at the permit office, zoning issues requiring additional sign-off, and contractor license verification holds. Submitting a complete application the first time is the single biggest factor in avoiding delays.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I check my permit status in ${cityMeta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can check your ${cityMeta.name} permit status through the city's official online portal. For automatic updates without manual checking, ClearedNo (clearedno.com) monitors your permit 24/7 and sends an instant alert the moment your status changes — so you never miss an approval or a correction notice.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#FF6B00]/20 bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/clearedno-icon.png" alt="ClearedNo" width={28} height={28} className="rounded-sm" />
            <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
              CLEARED<span className="text-[#F5F0E8]">NO</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase">
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#F5F0E8] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[10px] tracking-widest font-mono text-[#F5F0E8]/30 uppercase flex-wrap">
            <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">Permits</Link>
            <span>/</span>
            <Link href={`/permits/${params.city}`} className="hover:text-[#FF6B00] transition-colors">{cityMeta.name}</Link>
            <span>/</span>
            <Link href={parentUrl} className="hover:text-[#FF6B00] transition-colors">{label}</Link>
            <span>/</span>
            <span className="text-[#FF6B00]">Timeline</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {cityMeta.name}, {cityMeta.state} · {YEAR} Timeline
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl tracking-wider text-[#F5F0E8] leading-[0.95] mb-6">
            HOW LONG DOES A<br />
            <span className="text-[#FF6B00]">{label.toUpperCase()}</span><br />
            TAKE IN {cityMeta.name.toUpperCase()}?
          </h1>

          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-10">
            The average {label.toLowerCase()} approval in {cityMeta.name},{" "}
            {row.state} takes <strong className="text-[#F5F0E8]">{avgDays} days</strong>.
            Here&apos;s the full {YEAR} timeline breakdown — what happens at each stage,
            what causes delays, and how to get approved faster.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">{avgDays}d</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">Avg Approval</div>
            </div>
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">{phases.length}</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">Stages</div>
            </div>
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">{YEAR}</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline phases */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            STAGE-BY-STAGE TIMELINE
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-10">
            What actually happens between submission and permit in hand.
          </p>

          <div className="relative">
            {/* Vertical rail */}
            <div className="absolute left-[19px] top-6 bottom-6 w-px bg-[#FF6B00]/20 hidden sm:block" />

            <div className="space-y-4">
              {phases.map((phase, i) => (
                <div key={i} className="flex gap-6 items-start">
                  {/* Step dot */}
                  <div className="shrink-0 w-10 h-10 border border-[#FF6B00]/40 flex items-center justify-center font-mono text-xs text-[#FF6B00] bg-[#0A0A0A] relative z-10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 border border-[#FF6B00]/10 p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="font-heading text-lg tracking-widest text-[#F5F0E8]">
                        {phase.phase.toUpperCase()}
                      </div>
                      <div className="font-mono text-sm text-[#FF6B00] shrink-0">{phase.days}</div>
                    </div>
                    <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{phase.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-[10px] text-[#F5F0E8]/20 tracking-widest">
            * Timeline based on {YEAR} {cityMeta.name} permit office averages. Actual times vary
            by application volume, project complexity, and completeness of submission.
          </p>
        </div>
      </section>

      {/* What causes delays */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-8">
            WHAT CAUSES DELAYS
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              {
                cause: "Incomplete Application",
                impact: "+5–10 days",
                detail: "Missing documents are the #1 delay. The reviewer returns your file and the clock resets.",
              },
              {
                cause: "Plan Review Comments",
                impact: "+7–14 days",
                detail: "If plans don't meet code, the city issues correction comments. Each round of revisions adds time.",
              },
              {
                cause: "High Application Volume",
                impact: "+3–7 days",
                detail: `${cityMeta.name} permit offices slow down during peak construction season (spring/summer).`,
              },
              {
                cause: "Zoning Issues",
                impact: "+10–21 days",
                detail: "Projects in special zoning districts or historic areas require additional sign-offs.",
              },
              {
                cause: "Contractor License Hold",
                impact: "+2–5 days",
                detail: "If your contractor's license can't be verified, the application is put on hold until resolved.",
              },
              {
                cause: "Inspector Backlog",
                impact: "+3–7 days",
                detail: "In-person inspections (required for some permits) are scheduled by availability, not request.",
              },
            ].map((item) => (
              <div key={item.cause} className="border border-[#FF6B00]/10 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] tracking-widest text-[#FF6B00] uppercase font-mono">{item.cause}</div>
                  <div className="font-mono text-xs text-[#F5F0E8]/40 border border-[#FF6B00]/20 px-2 py-0.5">{item.impact}</div>
                </div>
                <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to speed it up */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            HOW TO GET APPROVED FASTER
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-8">
            Most {cityMeta.name} permit delays are avoidable. These steps cut the most time.
          </p>

          <div className="space-y-3">
            {[
              {
                tip: "Submit a complete application the first time",
                detail: `Review the ${cityMeta.name} ${label.toLowerCase()} checklist before submitting. A complete application skips the correction round entirely.`,
              },
              {
                tip: "Apply online, not in person",
                detail: `${cityMeta.name}'s online portal processes applications faster than counter submissions and lets you upload revisions without visiting the office.`,
              },
              {
                tip: "Respond to comments within 24 hours",
                detail: "When the city issues correction comments, faster response time means your file gets back in the review queue sooner.",
              },
              {
                tip: "Ask about expedited review",
                detail: `${cityMeta.name} may offer paid expedited review that cuts plan review time by 50% or more for an additional fee.`,
              },
              {
                tip: "Monitor your status daily",
                detail: `Status changes — especially correction notices — require fast action. Missing a notice for days can push your timeline back by weeks.`,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 border border-[#FF6B00]/10 p-5">
                <span className="font-mono text-xs text-[#FF6B00] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-sm font-bold text-[#F5F0E8] mb-1">{item.tip}</div>
                  <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-10">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-6">
            <div className="border border-[#FF6B00]/10 p-6">
              <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mb-3">
                How long does a {label.toLowerCase()} take in {cityMeta.name}?
              </h3>
              <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
                The average {label.toLowerCase()} approval in {cityMeta.name},{" "}
                {row.state} is <strong className="text-[#F5F0E8]">{avgDays} days</strong>.
                This includes plan review ({phases[0]?.days}), any required corrections (
                {phases[1]?.days}), final sign-off, and issuance. Incomplete applications
                or peak-season volume can extend this significantly.
              </p>
            </div>

            <div className="border border-[#FF6B00]/10 p-6">
              <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mb-3">
                What causes permit delays in {cityMeta.name}?
              </h3>
              <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
                The most common causes are incomplete applications, plan correction
                comments requiring resubmission, high application volume during
                construction season, zoning sign-offs, and contractor license holds.
                Submitting a complete application the first time eliminates the biggest
                single source of delay.
              </p>
            </div>

            <div className="border border-[#FF6B00]/10 p-6">
              <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mb-3">
                How do I check my permit status in {cityMeta.name}?
              </h3>
              <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
                You can check through the {cityMeta.name} city portal directly. For
                hands-free monitoring,{" "}
                <Link href="/signup" className="text-[#FF6B00] hover:underline">
                  ClearedNo
                </Link>{" "}
                watches your {cityMeta.name} permit 24/7 and sends an instant text or
                email the moment your status changes — so you catch correction notices
                immediately and never miss an approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 bg-[#FF6B00]/3">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-4 font-mono">
            Stop Checking Manually
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] mb-4">
            GET ALERTED THE MOMENT<br />
            <span className="text-[#FF6B00]">YOUR PERMIT CLEARS.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-8 max-w-xl mx-auto">
            ClearedNo monitors the {cityMeta.name} permit portal multiple times a day
            and texts you instantly when your {label.toLowerCase()} status changes —
            approved, correction required, or rejected. Catch issues in hours, not days.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            TRACK THIS PERMIT FREE <span>→</span>
          </Link>
          <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest">
            First month free · Card required, not charged for 30 days · Cancel anytime
          </p>
        </div>
      </section>

      {/* Back links */}
      <section className="py-8 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={parentUrl}
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            ← {label} Requirements
          </Link>
          <Link
            href={`/permits/${params.city}/${params["project-type"]}/cost`}
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            Fee Guide →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © {YEAR} ClearedNo ·{" "}
          <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">Permit Encyclopedia</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
        </p>
      </footer>

      <StickyPermitCTA />
    </div>
  );
}
