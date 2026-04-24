import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── Static city config ───────────────────────────────────────────────────────

const CITY_META: Record<string, { name: string; state: string; stateFull: string }> = {
  "austin-tx":       { name: "Austin",       state: "TX", stateFull: "Texas" },
  "dallas-tx":       { name: "Dallas",       state: "TX", stateFull: "Texas" },
  "houston-tx":      { name: "Houston",      state: "TX", stateFull: "Texas" },
  "san-antonio-tx":  { name: "San Antonio",  state: "TX", stateFull: "Texas" },
  "columbus-oh":     { name: "Columbus",     state: "OH", stateFull: "Ohio" },
  "philadelphia-pa": { name: "Philadelphia", state: "PA", stateFull: "Pennsylvania" },
  "grand-rapids-mi": { name: "Grand Rapids", state: "MI", stateFull: "Michigan" },
  "cleveland-oh":    { name: "Cleveland",    state: "OH", stateFull: "Ohio" },
  "pittsburgh-pa":   { name: "Pittsburgh",   state: "PA", stateFull: "Pennsylvania" },
  "detroit-mi":      { name: "Detroit",      state: "MI", stateFull: "Michigan" },
  "cincinnati-oh":   { name: "Cincinnati",   state: "OH", stateFull: "Ohio" },
};

// ─── Static state config ──────────────────────────────────────────────────────

type CityEntry = { slug: string; name: string };

const STATE_META: Record<string, { name: string; abbr: string; cities: CityEntry[] }> = {
  texas: {
    name: "Texas",
    abbr: "TX",
    cities: [
      { slug: "austin-tx",       name: "Austin" },
      { slug: "dallas-tx",       name: "Dallas" },
      { slug: "houston-tx",      name: "Houston" },
      { slug: "san-antonio-tx",  name: "San Antonio" },
    ],
  },
  ohio: {
    name: "Ohio",
    abbr: "OH",
    cities: [
      { slug: "columbus-oh",   name: "Columbus" },
      { slug: "cleveland-oh",  name: "Cleveland" },
      { slug: "cincinnati-oh", name: "Cincinnati" },
    ],
  },
  pennsylvania: {
    name: "Pennsylvania",
    abbr: "PA",
    cities: [
      { slug: "philadelphia-pa", name: "Philadelphia" },
      { slug: "pittsburgh-pa",   name: "Pittsburgh" },
    ],
  },
  michigan: {
    name: "Michigan",
    abbr: "MI",
    cities: [
      { slug: "grand-rapids-mi", name: "Grand Rapids" },
      { slug: "detroit-mi",      name: "Detroit" },
    ],
  },
};

// ─── Pre-render all slugs (cities + states) at build time ─────────────────────

export function generateStaticParams() {
  const citySlugs = Object.keys(CITY_META).map((slug) => ({ city: slug }));
  const stateSlugs = Object.keys(STATE_META).map((slug) => ({ city: slug }));
  return [...citySlugs, ...stateSlugs];
}

// ─── Per-page metadata ────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { city: string } }
): Promise<Metadata> {
  if (STATE_META[params.city]) {
    const meta = STATE_META[params.city];
    const title = `Building Permits in ${meta.name} — Costs, Requirements & Timelines`;
    const description = `Building permit requirements, fees, and approval timelines for ${meta.cities.length} cities in ${meta.name}. Deck, roof, fence, addition, new construction, electrical, and plumbing permits.`;
    return {
      title,
      description,
      alternates: { canonical: `https://www.clearedno.com/permits/${params.city}` },
      openGraph: {
        title,
        description,
        url: `https://www.clearedno.com/permits/${params.city}`,
        type: "website",
        images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
      },
    };
  }

  const meta = CITY_META[params.city];
  if (!meta) return {};

  const title = `${meta.name} Building Permits — All Types, Fees & Requirements | ClearedNo`;
  const description = `Building permit requirements, fees, and approval timelines for ${meta.name}, ${meta.stateFull}. Deck, roof, fence, addition, new construction, electrical, and plumbing permits.`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.clearedno.com/permits/${params.city}` },
    openGraph: {
      title,
      description,
      url: `https://www.clearedno.com/permits/${params.city}`,
      type: "website",
      images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
    },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PermitRow = {
  project_type_slug: string;
  project_type_label: string;
  base_fee: number | null;
  avg_approval_days: number | null;
};

// ─── State hub page ───────────────────────────────────────────────────────────

async function StatePermitsPage({ slug }: { slug: string }) {
  const meta = STATE_META[slug];

  const citySlugs = meta.cities.map((c) => c.slug);
  const { data: permits } = await supabaseAdmin
    .from("city_permits")
    .select("city_slug, base_fee, avg_approval_days")
    .in("city_slug", citySlugs);

  const rows = permits ?? [];
  const fees = rows.map((r) => r.base_fee).filter((f): f is number => f != null);
  const days = rows.map((r) => r.avg_approval_days).filter((d): d is number => d != null);

  const avgFee = fees.length ? Math.round(fees.reduce((a, b) => a + b, 0) / fees.length) : null;
  const avgDays = days.length ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : null;

  const permitCountByCity: Record<string, number> = {};
  for (const r of rows) {
    permitCountByCity[r.city_slug] = (permitCountByCity[r.city_slug] ?? 0) + 1;
  }

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
          <div className="flex items-center gap-2 mb-8 text-[10px] tracking-widest font-mono text-[#F5F0E8]/30 uppercase">
            <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">Permits</Link>
            <span>/</span>
            <span className="text-[#FF6B00]">{meta.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {meta.abbr} · {meta.cities.length} Cities Covered
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            {meta.name.toUpperCase()}<br />
            <span className="text-[#FF6B00]">BUILDING PERMITS</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Requirements, fees, and approval timelines for every major permit type
            across {meta.cities.length} cities in {meta.name}. Select a city below to
            see the full breakdown.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="border border-[#FF6B00]/20 p-4 text-center">
              <div className="font-mono text-lg text-[#FF6B00]">{meta.cities.length}</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">Cities Covered</div>
            </div>
            <div className="border border-[#FF6B00]/20 p-4 text-center">
              <div className="font-mono text-lg text-[#FF6B00]">
                {avgFee != null ? `$${avgFee}` : "—"}
              </div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">Avg Permit Fee</div>
            </div>
            <div className="border border-[#FF6B00]/20 p-4 text-center">
              <div className="font-mono text-lg text-[#FF6B00]">
                {avgDays != null ? `${avgDays}d` : "—"}
              </div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">Avg Approval</div>
            </div>
          </div>
        </div>
      </section>

      {/* City list */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            SELECT A CITY
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-10">
            {meta.cities.length} cities in {meta.name} · click any city for fees, timelines &amp; requirements
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meta.cities.map((city) => {
              const count = permitCountByCity[city.slug] ?? 0;
              return (
                <Link
                  key={city.slug}
                  href={`/permits/${city.slug}`}
                  className="group border border-[#FF6B00]/20 p-6 hover:border-[#FF6B00]/60 hover:bg-[#FF6B00]/5 transition-all"
                >
                  <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-2 font-mono">
                    {meta.abbr}
                  </div>
                  <div className="font-heading text-2xl tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors mb-3">
                    {city.name.toUpperCase()}
                  </div>
                  <div className="text-xs text-[#F5F0E8]/40 font-mono">
                    {count > 0 ? `${count} permit types` : "permit guides"} →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-4">
            TRACK ANY {meta.abbr}<br />
            <span className="text-[#FF6B00]">PERMIT — FREE.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            ClearedNo watches {meta.name} permit portals multiple times daily and
            texts you the moment your status changes. First month free.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            MONITOR MY {meta.name.toUpperCase()} PERMITS <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
          <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">All Cities</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}

// ─── Page (handles both state and city slugs) ─────────────────────────────────

export default async function CityPermitsPage(
  { params }: { params: { city: string } }
) {
  if (STATE_META[params.city]) {
    return <StatePermitsPage slug={params.city} />;
  }

  const meta = CITY_META[params.city];
  if (!meta) notFound();

  const { data: permits, error } = await supabaseAdmin
    .from("city_permits")
    .select("project_type_slug, project_type_label, base_fee, avg_approval_days")
    .eq("city_slug", params.city)
    .order("project_type_label");

  if (error || !permits || permits.length === 0) notFound();

  const rows = permits as PermitRow[];
  const minFee = Math.min(...rows.map((r) => r.base_fee ?? 0));
  const maxFee = Math.max(...rows.map((r) => r.base_fee ?? 0));
  const avgDays = Math.round(
    rows.reduce((s, r) => s + (r.avg_approval_days ?? 0), 0) / rows.length
  );

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
            <Link
              href={`/permits/${meta.stateFull.toLowerCase()}`}
              className="hover:text-[#FF6B00] transition-colors"
            >
              {meta.stateFull}
            </Link>
            <span>/</span>
            <span className="text-[#FF6B00]">{meta.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {meta.name}, {meta.state}
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            {meta.name.toUpperCase()}<br />
            <span className="text-[#FF6B00]">BUILDING PERMITS</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Requirements, base fees, and average approval timelines for every major
            permit type in {meta.name}, {meta.stateFull}. Select a permit type below
            to see the full breakdown.
          </p>

          {/* City-level stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="border border-[#FF6B00]/20 p-4 text-center">
              <div className="font-mono text-lg text-[#FF6B00]">{rows.length}</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">Permit Types</div>
            </div>
            <div className="border border-[#FF6B00]/20 p-4 text-center">
              <div className="font-mono text-lg text-[#FF6B00]">${minFee}–${maxFee}</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">Fee Range</div>
            </div>
            <div className="border border-[#FF6B00]/20 p-4 text-center">
              <div className="font-mono text-lg text-[#FF6B00]">{avgDays}d</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">Avg Approval</div>
            </div>
          </div>
        </div>
      </section>

      {/* Permit type list */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-10">
            PERMIT TYPES
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {rows.map((permit) => (
              <Link
                key={permit.project_type_slug}
                href={`/permits/${params.city}/${permit.project_type_slug}`}
                className="group border border-[#FF6B00]/20 p-6 hover:border-[#FF6B00]/60 hover:bg-[#FF6B00]/5 transition-all"
              >
                <div className="font-heading text-xl tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors mb-4">
                  {permit.project_type_label.toUpperCase()}
                </div>
                <div className="flex gap-6 font-mono text-xs text-[#F5F0E8]/50">
                  {permit.base_fee != null && (
                    <span>
                      <span className="text-[#FF6B00]">${permit.base_fee}</span> base fee
                    </span>
                  )}
                  {permit.avg_approval_days != null && (
                    <span>
                      <span className="text-[#FF6B00]">{permit.avg_approval_days}d</span> avg approval
                    </span>
                  )}
                </div>
                <div className="mt-4 text-[10px] tracking-widest text-[#FF6B00]/60 uppercase font-mono">
                  View requirements →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-4">
            TRACK ANY {meta.name.toUpperCase()}<br />
            <span className="text-[#FF6B00]">PERMIT — FREE.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            ClearedNo checks the {meta.name} permit portal multiple times daily and
            texts you the moment your status changes. First month free.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            MONITOR MY {meta.name.toUpperCase()} PERMITS <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
          <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">All Cities</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
