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
};

// ─── Pre-render all 7 city hubs at build time ─────────────────────────────────

export function generateStaticParams() {
  return Object.keys(CITY_META).map((slug) => ({ city: slug }));
}

// ─── Per-page metadata ────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { city: string } }
): Promise<Metadata> {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CityPermitsPage(
  { params }: { params: { city: string } }
) {
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
