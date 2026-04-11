import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── Static param sets ────────────────────────────────────────────────────────
// Top 5 project types × 7 cities = 35 pre-rendered pages.
// new-construction and plumbing-permit are rendered on-demand via SSR.

const CITIES = [
  "austin-tx",
  "dallas-tx",
  "houston-tx",
  "san-antonio-tx",
  "columbus-oh",
  "philadelphia-pa",
  "grand-rapids-mi",
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
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PermitRow = {
  city_slug: string;
  city_name: string;
  state: string;
  project_type_slug: string;
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
    .select("project_type_label, base_fee, avg_approval_days")
    .eq("city_slug", params.city)
    .eq("project_type_slug", params["project-type"])
    .single();

  if (!data) return {};

  const label = data.project_type_label as string;
  const city = cityMeta.name;
  const state = cityMeta.state;

  const title = `${city} ${label} — Requirements, Fees & Timeline | ClearedNo`;
  const description = [
    `${city}, ${state} ${label.toLowerCase()} requirements, base fee`,
    data.base_fee != null ? `($${data.base_fee})` : null,
    "and average approval time",
    data.avg_approval_days != null ? `(${data.avg_approval_days} days).` : ".",
    "Documents checklist, official portal link, and permit tracking.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.clearedno.com/permits/${params.city}/${params["project-type"]}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.clearedno.com/permits/${params.city}/${params["project-type"]}`,
      type: "website",
      images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectTypePermitPage({
  params,
}: {
  params: { city: string; "project-type": string };
}) {
  const { data: permit, error } = await supabaseAdmin
    .from("city_permits")
    .select("*")
    .eq("city_slug", params.city)
    .eq("project_type_slug", params["project-type"])
    .single();

  if (error || !permit) notFound();

  const row = permit as PermitRow;
  const cityMeta = CITY_META[params.city] ?? { name: row.city_name, state: row.state };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
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
          <div className="flex items-center gap-2 mb-8 text-[10px] tracking-widest font-mono text-[#F5F0E8]/30 uppercase">
            <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">Permits</Link>
            <span>/</span>
            <Link href={`/permits/${params.city}`} className="hover:text-[#FF6B00] transition-colors">
              {cityMeta.name}
            </Link>
            <span>/</span>
            <span className="text-[#FF6B00]">{row.project_type_label}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {cityMeta.name}, {cityMeta.state}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl tracking-wider text-[#F5F0E8] leading-[0.95] mb-6">
            {cityMeta.name.toUpperCase()}{" "}
            <span className="text-[#FF6B00]">
              {row.project_type_label.toUpperCase()}
            </span>
            <br />
            REQUIREMENTS &amp; FEES
          </h1>

          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-10">
            Everything you need to pull a {row.project_type_label.toLowerCase()} in{" "}
            {cityMeta.name}, {row.state} — documents, base fee, typical timeline, and
            a link to the official permit portal.
          </p>

          {/* Stats grid */}
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
                {cityMeta.name}
              </div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                {cityMeta.state}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            WHAT YOU&apos;LL NEED
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-8">
            Typical requirements for a {row.project_type_label.toLowerCase()} in{" "}
            {cityMeta.name}. Requirements may vary — confirm with the city before
            submitting.
          </p>

          {row.requirements_summary && row.requirements_summary.length > 0 ? (
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
          ) : (
            <p className="text-sm text-[#F5F0E8]/40">No requirements data available.</p>
          )}

          <p className="mt-6 text-[10px] text-[#F5F0E8]/25 tracking-widest">
            * Fees and timelines are estimates based on typical {cityMeta.name} permit
            activity. Actual amounts may vary based on project valuation, zoning, and
            completeness of your application.
          </p>
        </div>
      </section>

      {/* Official portal */}
      {row.official_url && (
        <section className="py-16 px-6 border-t border-[#FF6B00]/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              OFFICIAL PERMIT PORTAL
            </h2>
            <p className="text-sm text-[#F5F0E8]/50 mb-6">
              Submit your {row.project_type_label.toLowerCase()} application directly
              through {cityMeta.name}&apos;s official portal.
            </p>
            <a
              href={row.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-[#FF6B00] text-[#FF6B00] font-mono text-sm font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
            >
              OPEN {cityMeta.name.toUpperCase()} PERMIT PORTAL <span>↗</span>
            </a>
          </div>
        </section>
      )}

      {/* Track CTA */}
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
            Once you&apos;ve submitted your {row.project_type_label.toLowerCase()},
            ClearedNo watches the {cityMeta.name} portal and sends you an instant alert
            the moment your status changes — so you can schedule your crew without
            manually checking.
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

      {/* Back link */}
      <section className="py-8 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/permits/${params.city}`}
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            ← All {cityMeta.name} Permits
          </Link>
          <Link
            href="/permits"
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            All Cities →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
          <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">Permit Encyclopedia</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
