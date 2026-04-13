import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import MarketingNav from "@/app/components/MarketingNav";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const revalidate = 86400; // revalidate daily as scraper runs weekly

const STATE_MAP: Record<string, string> = {
  oh: "Ohio",
  in: "Indiana",
  mi: "Michigan",
  ky: "Kentucky",
  il: "Illinois",
  pa: "Pennsylvania",
};

function countyToSlug(county: string): string {
  return county
    .replace(/ County$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Static params — 6 states
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(STATE_MAP).map((state) => ({ state }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  const stateName = STATE_MAP[params.state];
  if (!stateName) return {};

  const stateAbbrev = params.state.toUpperCase();

  const [{ count: total }, { count: hot }] = await Promise.all([
    supabaseAdmin
      .from("roofing_leads")
      .select("id", { count: "exact", head: true })
      .eq("state", stateAbbrev),
    supabaseAdmin
      .from("roofing_leads")
      .select("id", { count: "exact", head: true })
      .eq("state", stateAbbrev)
      .eq("lead_score", "hot"),
  ]);

  return {
    title: `Roofing Leads in ${stateName} — ${total ?? 0} Hail Leads This Season | ClearedNo`,
    description: `Get weekly roofing leads in ${stateName}. ${hot ?? 0} hot leads from NOAA hail data. Beat competitors to storm-damaged properties.`,
    alternates: {
      canonical: `https://www.clearedno.com/leads/roofing/${params.state}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Lead {
  id: string;
  county: string;
  state: string;
  event_date: string;
  magnitude: number | null;
  lead_score: "hot" | "warm";
}

interface CountyRow {
  county: string;
  total: number;
  hot: number;
  newest: string;
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="border border-[#FF6B00]/20 p-5 relative bg-[#0A0A0A]">
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />
      <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">{label}</p>
      <p className="font-heading text-4xl tracking-widest" style={{ color: accent ?? "#F5F0E8" }}>
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function StateLeadsPage({
  params,
}: {
  params: { state: string };
}) {
  const stateName = STATE_MAP[params.state];
  if (!stateName) notFound();

  const stateAbbrev = params.state.toUpperCase();

  // Fetch all leads for this state
  const { data: leads } = await supabaseAdmin
    .from("roofing_leads")
    .select("id, county, state, event_date, magnitude, lead_score")
    .eq("state", stateAbbrev)
    .order("event_date", { ascending: false });

  const allLeads = (leads ?? []) as Lead[];

  if (allLeads.length === 0) notFound();

  // Build county breakdown
  const countyMap = new Map<string, CountyRow>();
  for (const lead of allLeads) {
    const existing = countyMap.get(lead.county);
    if (!existing) {
      countyMap.set(lead.county, {
        county: lead.county,
        total: 1,
        hot: lead.lead_score === "hot" ? 1 : 0,
        newest: lead.event_date,
      });
    } else {
      existing.total++;
      if (lead.lead_score === "hot") existing.hot++;
      if (lead.event_date > existing.newest) existing.newest = lead.event_date;
    }
  }

  const countyRows = Array.from(countyMap.values()).sort((a, b) => b.total - a.total);

  const totalLeads = allLeads.length;
  const hotLeads   = allLeads.filter((l) => l.lead_score === "hot").length;
  const warmLeads  = allLeads.length - hotLeads;
  const newestDate = allLeads[0]?.event_date ? formatDate(allLeads[0].event_date) : "—";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      <MarketingNav />

      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 pt-24 pb-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
            ClearedNo / Roofing Leads / {stateName}
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            Roofing Leads — {stateName}
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 max-w-xl leading-relaxed">
            {totalLeads} hail-verified roofing leads across {countyRows.length}{" "}
            {stateName} counties. Sourced from NOAA Storm Events, updated every Monday.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Leads"   value={totalLeads}  />
          <StatCard label="Hot Leads"     value={hotLeads}    accent="#FF6B00" />
          <StatCard label="Warm Leads"    value={warmLeads}   accent="#EAB308" />
          <StatCard label="Latest Event"  value={newestDate}  />
        </div>

        {/* County breakdown table */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              County Breakdown
            </h2>
          </div>

          <div className="border border-[#FF6B00]/20 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#FF6B00]/20">
                  {["County", "Total Leads", "Hot", "Most Recent"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {countyRows.map((row, i) => (
                  <tr
                    key={row.county}
                    className={`border-b border-[#FF6B00]/10 hover:bg-[#FF6B00]/5 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"
                    }`}
                  >
                    <td className="px-5 py-3 whitespace-nowrap">
                      <Link
                        href={`/leads/roofing/${params.state}/${countyToSlug(row.county)}`}
                        className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
                      >
                        {row.county}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-[#F5F0E8]/80 tabular-nums">{row.total}</td>
                    <td className="px-5 py-3 text-[#FF6B00] tabular-nums">{row.hot}</td>
                    <td className="px-5 py-3 text-[#F5F0E8]/50 whitespace-nowrap">{formatDate(row.newest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How leads are scored */}
        <div className="border border-[#FF6B00]/20 p-8 relative">
          <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              How Leads Are Scored
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium h-fit flex-shrink-0"
                style={{ color: "#FF6B00", backgroundColor: "rgba(255,107,0,0.12)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                Hot
              </span>
              <div>
                <p className="text-sm text-[#F5F0E8]/80 mb-1 font-medium">1.00&quot;+ hail diameter</p>
                <p className="text-xs text-[#F5F0E8]/50 leading-relaxed">
                  Hailstones at or above 1 inch cause significant roof damage. These properties
                  are highly likely to need full or partial roof replacement.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium h-fit flex-shrink-0"
                style={{ color: "#EAB308", backgroundColor: "rgba(234,179,8,0.12)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                Warm
              </span>
              <div>
                <p className="text-sm text-[#F5F0E8]/80 mb-1 font-medium">Under 1.00&quot; hail diameter</p>
                <p className="text-xs text-[#F5F0E8]/50 leading-relaxed">
                  Smaller hail events still cause granule loss, cracked shingles, and gutter
                  damage. Worth a knock — many homeowners don&apos;t know they have damage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* County quick links */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {stateName} Counties with Leads
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {countyRows.map((row) => (
              <Link
                key={row.county}
                href={`/leads/roofing/${params.state}/${countyToSlug(row.county)}`}
                className="border border-[#FF6B00]/20 px-3 py-1.5 text-[10px] tracking-widest uppercase text-[#F5F0E8]/50 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
              >
                {row.county.replace(/ County$/, "")} ({row.total})
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-[#FF6B00] p-10 relative text-center">
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <p className="text-[10px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
            Full Access
          </p>
          <h2 className="font-heading text-4xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            {totalLeads} {stateName} Leads
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8 max-w-md mx-auto leading-relaxed">
            Download the full county-level CSV. Updated every Monday with new NOAA storm
            data across all 6 Midwest states.
          </p>
          <Link
            href="/leads/landing"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-4 hover:bg-[#F5F0E8] transition-colors"
          >
            Get Full Access — $300/mo →
          </Link>
          <p className="mt-4 text-[10px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
            No contracts · Cancel anytime · 30-day money back
          </p>
        </div>

        {/* Footer nav */}
        <div className="border-t border-[#FF6B00]/10 pt-6 flex items-center justify-between">
          <Link href="/leads/landing" className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors">
            ← All Roofing Leads
          </Link>
          <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
            Source: NOAA Storm Events Database
          </p>
        </div>

      </div>
    </div>
  );
}
