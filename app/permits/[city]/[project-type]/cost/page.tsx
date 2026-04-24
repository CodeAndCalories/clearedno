import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import StickyPermitCTA from "../sticky-cta";
import FeeCalculator from "./fee-calculator";

const YEAR = 2026;

// ─── Static params (mirrors parent route) ─────────────────────────────────────

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
    .select("project_type_label, base_fee")
    .eq("city_slug", params.city)
    .eq("project_type_slug", params["project-type"])
    .single();

  if (!data) return {};

  const label = data.project_type_label as string;
  const city = cityMeta.name;
  const state = cityMeta.state;

  const title = `${label} Cost in ${city} — ${YEAR} Fee Guide | ClearedNo`;
  const description = [
    `How much does a ${label.toLowerCase()} cost in ${city}, ${state}?`,
    data.base_fee != null ? `Base fee starts at $${data.base_fee}.` : null,
    `Complete ${YEAR} fee breakdown, cost calculator, and what affects your total permit cost.`,
  ]
    .filter(Boolean)
    .join(" ");

  const canonical = `https://www.clearedno.com/permits/${params.city}/${params["project-type"]}/cost`;

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PermitCostPage({
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
  const parentUrl = `/permits/${params.city}/${params["project-type"]}`;

  // ── FAQ JSON-LD ────────────────────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much is a ${label} in ${cityMeta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: row.base_fee != null
            ? `The base fee for a ${label.toLowerCase()} in ${cityMeta.name}, ${row.state} is $${row.base_fee}. Your total cost may be higher based on project valuation and square footage.`
            : `${label} fees in ${cityMeta.name} vary by project size. Contact the ${cityMeta.name} permit office for a precise quote.`,
        },
      },
      {
        "@type": "Question",
        name: `What affects ${label.toLowerCase()} cost in ${cityMeta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${label} permit costs in ${cityMeta.name} are typically based on the project's total valuation, square footage, construction type, and zoning district. Rush processing fees and plan review fees may also apply. The base fee${row.base_fee != null ? ` is $${row.base_fee}` : ""} and scales up from there.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I get a ${label.toLowerCase()} fee waived in ${cityMeta.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${cityMeta.name} may offer fee waivers or reductions for certain projects, including affordable housing, nonprofit work, or government-sponsored construction. Contact the ${cityMeta.name} building department directly to ask about current waiver programs.`,
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
            <span className="text-[#FF6B00]">Cost</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {cityMeta.name}, {cityMeta.state} · {YEAR} Fee Guide
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl tracking-wider text-[#F5F0E8] leading-[0.95] mb-6">
            {label.toUpperCase()} COST IN<br />
            <span className="text-[#FF6B00]">{cityMeta.name.toUpperCase()}</span>
          </h1>

          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-10">
            How much does a {label.toLowerCase()} cost in {cityMeta.name},{" "}
            {row.state}? Here&apos;s the {YEAR} fee breakdown — base fee, valuation
            multipliers, and a calculator so you can estimate your total before you
            apply.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">
                {row.base_fee != null ? `$${row.base_fee}` : "—"}
              </div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                Base Fee
              </div>
            </div>
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">
                {row.avg_approval_days != null ? `${row.avg_approval_days}d` : "—"}
              </div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                Avg Approval
              </div>
            </div>
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">
                {YEAR}
              </div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                Fee Schedule
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            HOW THE FEE IS CALCULATED
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-8">
            {cityMeta.name} calculates {label.toLowerCase()} fees using a base charge
            plus a valuation-based component tied to your project&apos;s square footage.
          </p>

          <div className="space-y-3 mb-10">
            {[
              {
                label: "Base permit fee",
                value: row.base_fee != null ? `$${row.base_fee}` : "Varies",
                note: "Flat charge to open the permit file",
              },
              {
                label: "Valuation surcharge",
                value: "$0.05 / sqft",
                note: "Applied on top of base fee by project size",
              },
              {
                label: "Plan review fee",
                value: "15–25% of base",
                note: "Required when plans must be reviewed before approval",
              },
              {
                label: "Inspection fee",
                value: "Included",
                note: "Standard inspections included in most permit fees",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border border-[#FF6B00]/10 px-5 py-4">
                <div>
                  <div className="text-sm text-[#F5F0E8]/80">{item.label}</div>
                  <div className="text-[10px] text-[#F5F0E8]/30 font-mono mt-0.5">{item.note}</div>
                </div>
                <div className="font-mono text-sm font-bold text-[#FF6B00] shrink-0 ml-4">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Fee calculator */}
          {row.base_fee != null && (
            <FeeCalculator baseFee={row.base_fee} />
          )}
        </div>
      </section>

      {/* What affects cost */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-8">
            WHAT AFFECTS YOUR COST
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                factor: "Project Valuation",
                detail: "Higher project value = higher fee. The city uses your total project cost to set the valuation multiplier.",
              },
              {
                factor: "Square Footage",
                detail: "Larger footprint projects incur higher per-sqft surcharges on top of the base fee.",
              },
              {
                factor: "Zoning District",
                detail: "Some zoning categories carry additional review requirements that increase processing fees.",
              },
              {
                factor: "Rush Processing",
                detail: `${cityMeta.name} may offer expedited review for an additional fee — typically 50–100% of the base fee.`,
              },
              {
                factor: "Resubmission",
                detail: "If your application is rejected and resubmitted, a resubmission fee (usually 25–50% of base) applies.",
              },
              {
                factor: "Contractor License",
                detail: "Some permit types require a licensed contractor. The license verification fee may be added to your total.",
              },
            ].map((item) => (
              <div key={item.factor} className="border border-[#FF6B00]/10 p-5">
                <div className="text-[10px] tracking-widest text-[#FF6B00] uppercase font-mono mb-2">
                  {item.factor}
                </div>
                <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements (what you need to apply) */}
      {row.requirements_summary && row.requirements_summary.length > 0 && (
        <section className="py-16 px-6 border-t border-[#FF6B00]/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
              WHAT YOU&apos;LL NEED TO APPLY
            </h2>
            <p className="text-sm text-[#F5F0E8]/40 mb-8">
              Missing documents can trigger resubmission fees — have these ready before you submit.
            </p>
            <ul className="space-y-3">
              {row.requirements_summary.map((req, i) => (
                <li key={i} className="flex items-start gap-4 border border-[#FF6B00]/10 p-4">
                  <span className="font-mono text-xs text-[#FF6B00] mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[#F5F0E8]/70 leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-10">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-6">
            {[
              {
                q: `How much is a ${label.toLowerCase()} in ${cityMeta.name}?`,
                a: row.base_fee != null
                  ? `The base fee for a ${label.toLowerCase()} in ${cityMeta.name}, ${row.state} is $${row.base_fee}. Your total will depend on project size and valuation — use the calculator above for a rough estimate.`
                  : `${label} fees in ${cityMeta.name} vary by project. Contact the permit office for a current quote.`,
              },
              {
                q: `What affects ${label.toLowerCase()} cost in ${cityMeta.name}?`,
                a: `The main cost drivers are project valuation, square footage, zoning district, and whether a rush review is needed. Resubmission or plan review fees can add 15–50% on top of the base fee if your application has issues.`,
              },
              {
                q: `Can I get a ${label.toLowerCase()} fee waived in ${cityMeta.name}?`,
                a: `${cityMeta.name} may offer fee waivers for affordable housing projects, nonprofit organizations, or government-sponsored work. Contact the ${cityMeta.name} building department directly to ask about active waiver programs.`,
              },
            ].map((item, i) => (
              <div key={i} className="border border-[#FF6B00]/10 p-6">
                <h3 className="font-heading text-lg tracking-widest text-[#F5F0E8] mb-3">
                  {item.q}
                </h3>
                <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 bg-[#FF6B00]/3">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-4 font-mono">
            After You Submit
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] mb-4">
            TRACK THIS PERMIT<br />
            <span className="text-[#FF6B00]">AUTOMATICALLY.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-8 max-w-xl mx-auto">
            Once you&apos;ve paid and submitted your {label.toLowerCase()}, ClearedNo
            watches the {cityMeta.name} portal and sends an instant alert the moment
            your status changes — so you can schedule your crew without checking daily.
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
            href={`/permits/${params.city}`}
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            All {cityMeta.name} Permits →
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
