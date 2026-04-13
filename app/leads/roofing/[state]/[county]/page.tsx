import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import MarketingNav from "@/app/components/MarketingNav";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const revalidate = 86400;

const STATE_MAP: Record<string, string> = {
  oh: "Ohio",
  in: "Indiana",
  mi: "Michigan",
  ky: "Kentucky",
  il: "Illinois",
  pa: "Pennsylvania",
};

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

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

function formatMag(mag: number | null): string {
  if (mag === null || mag === undefined) return "—";
  return `${mag.toFixed(2)}"`;
}

// ---------------------------------------------------------------------------
// Static params — all county+state combos in the DB
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from("roofing_leads")
    .select("county, state")
    .order("state")
    .order("county");

  const seen = new Set<string>();
  const params: { state: string; county: string }[] = [];

  for (const row of data ?? []) {
    const stateSlug  = (row.state as string).toLowerCase();
    const countySlug = countyToSlug(row.county as string);
    const key        = `${stateSlug}/${countySlug}`;
    if (!seen.has(key)) {
      seen.add(key);
      params.push({ state: stateSlug, county: countySlug });
    }
  }

  return params;
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
  event_type: string;
}

// ---------------------------------------------------------------------------
// Resolve slug → actual county name in DB
// ---------------------------------------------------------------------------

async function resolveCounty(
  stateAbbrev: string,
  countySlug: string
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("roofing_leads")
    .select("county")
    .eq("state", stateAbbrev)
    .limit(500);

  const counties = Array.from(new Set((data ?? []).map((r: { county: string }) => r.county)));
  return counties.find((c) => countyToSlug(c) === countySlug) ?? null;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { state: string; county: string };
}): Promise<Metadata> {
  const stateName = STATE_MAP[params.state];
  if (!stateName) return {};

  const stateAbbrev = params.state.toUpperCase();
  const countyName  = await resolveCounty(stateAbbrev, params.county);
  if (!countyName) return {};

  const displayCounty = countyName.replace(/ County$/i, "");

  const { data: leads } = await supabaseAdmin
    .from("roofing_leads")
    .select("lead_score, magnitude")
    .eq("state", stateAbbrev)
    .eq("county", countyName);

  const total    = leads?.length ?? 0;
  const hot      = leads?.filter((l) => l.lead_score === "hot").length ?? 0;
  const maxMag   = leads?.reduce((m, l) => Math.max(m, l.magnitude ?? 0), 0) ?? 0;

  return {
    title: `${displayCounty} County ${stateName} Roofing Leads — ${total} Hail Events | ClearedNo`,
    description: `Roofing leads in ${displayCounty} County, ${stateName}. ${hot} properties hit by ${maxMag.toFixed(2)}"+ hail. Updated weekly from NOAA storm data.`,
    alternates: {
      canonical: `https://www.clearedno.com/leads/roofing/${params.state}/${params.county}`,
    },
  };
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

export default async function CountyLeadsPage({
  params,
}: {
  params: { state: string; county: string };
}) {
  const stateName = STATE_MAP[params.state];
  if (!stateName) notFound();

  const stateAbbrev = params.state.toUpperCase();
  const countyName  = await resolveCounty(stateAbbrev, params.county);
  if (!countyName) notFound();

  const displayCounty = countyName.replace(/ County$/i, "");

  // Fetch all leads for this county
  const { data } = await supabaseAdmin
    .from("roofing_leads")
    .select("id, county, state, event_date, magnitude, lead_score, event_type")
    .eq("state", stateAbbrev)
    .eq("county", countyName)
    .order("event_date", { ascending: false });

  const leads = (data ?? []) as Lead[];
  if (leads.length === 0) notFound();

  const totalLeads  = leads.length;
  const hotLeads    = leads.filter((l) => l.lead_score === "hot").length;
  const warmLeads   = totalLeads - hotLeads;
  const maxMag      = leads.reduce((m, l) => Math.max(m, l.magnitude ?? 0), 0);
  const newestDate  = leads[0]?.event_date ? formatDate(leads[0].event_date) : "—";
  const newestRaw   = leads[0]?.event_date ?? "";

  // Neighbouring counties in same state (excluding current)
  const { data: otherCountyData } = await supabaseAdmin
    .from("roofing_leads")
    .select("county")
    .eq("state", stateAbbrev)
    .neq("county", countyName)
    .limit(200);

  const otherCounties = Array.from(
    new Set((otherCountyData ?? []).map((r: { county: string }) => r.county))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      <MarketingNav />

      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 pt-24 pb-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
            ClearedNo / Roofing Leads /{" "}
            <Link
              href={`/leads/roofing/${params.state}`}
              className="hover:text-[#FF6B00] transition-colors"
            >
              {stateName}
            </Link>{" "}
            / {displayCounty} County
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            {displayCounty} County, {stateName} — Roofing Leads
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 max-w-xl leading-relaxed">
            {totalLeads} hail-verified roofing leads in {displayCounty} County.
            Sourced from NOAA Storm Events, updated every Monday.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Leads"    value={totalLeads}             />
          <StatCard label="Hot Leads"      value={hotLeads}   accent="#FF6B00" />
          <StatCard label="Largest Hail"   value={`${maxMag.toFixed(2)}"`} accent="#EAB308" />
          <StatCard label="Latest Event"   value={newestDate}             />
        </div>

        {/* Context paragraph */}
        <div className="border-l-2 border-[#FF6B00]/40 pl-6 py-2">
          <p className="text-sm text-[#F5F0E8]/70 leading-relaxed">
            {displayCounty} County was hit by{" "}
            <span className="text-[#F5F0E8]">{totalLeads} hail events</span> in
            the past 12 months. The largest recorded was{" "}
            <span className="text-[#FF6B00] font-medium">{maxMag.toFixed(2)}&quot;</span> on{" "}
            {newestRaw ? formatDate(newestRaw) : "record"}.{" "}
            <span className="text-[#FF6B00] font-medium">{hotLeads} event{hotLeads !== 1 ? "s" : ""}</span>{" "}
            scored hot (1&quot;+ hailstone), indicating significant roof damage risk.
            {warmLeads > 0 &&
              ` An additional ${warmLeads} warm event${warmLeads !== 1 ? "s" : ""} caused minor-to-moderate shingle and gutter damage.`}
          </p>
        </div>

        {/* Leads table */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              Hail Events — {displayCounty} County
            </h2>
          </div>

          <div className="border border-[#FF6B00]/20 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#FF6B00]/20">
                  {["Event Date", "Magnitude", "Score", "Type"].map((h) => (
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
                {leads.map((lead, i) => {
                  const isHot = lead.lead_score === "hot";
                  return (
                    <tr
                      key={lead.id}
                      className={`border-b border-[#FF6B00]/10 hover:bg-[#FF6B00]/5 transition-colors ${
                        i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"
                      }`}
                    >
                      <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">
                        {formatDate(lead.event_date)}
                      </td>
                      <td className="px-5 py-3 text-[#F5F0E8]/80 tabular-nums whitespace-nowrap">
                        {formatMag(lead.magnitude)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium"
                          style={{
                            color:           isHot ? "#FF6B00" : "#EAB308",
                            backgroundColor: isHot ? "rgba(255,107,0,0.12)" : "rgba(234,179,8,0.12)",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: isHot ? "#FF6B00" : "#EAB308" }}
                          />
                          {isHot ? "Hot" : "Warm"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#F5F0E8]/40 uppercase tracking-widest text-[9px] whitespace-nowrap">
                        {lead.event_type}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-[#FF6B00] p-10 relative text-center">
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <p className="text-[10px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
            Full Lead List
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            Access {displayCounty} County Leads
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8 max-w-md mx-auto leading-relaxed">
            Download the full CSV with addresses, magnitudes, and scores for all{" "}
            {totalLeads} {displayCounty} County hail events. Plus all other counties
            across 6 states.
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

        {/* Internal links */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              More {stateName} Counties
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/leads/roofing/${params.state}`}
              className="border border-[#FF6B00]/30 px-4 py-2 text-[10px] tracking-widest uppercase text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors"
            >
              All {stateName} Leads →
            </Link>
            {otherCounties.map((c) => (
              <Link
                key={c}
                href={`/leads/roofing/${params.state}/${countyToSlug(c)}`}
                className="border border-[#FF6B00]/20 px-4 py-2 text-[10px] tracking-widest uppercase text-[#F5F0E8]/50 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
              >
                {c.replace(/ County$/, "")}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer nav */}
        <div className="border-t border-[#FF6B00]/10 pt-6 flex items-center justify-between">
          <Link
            href={`/leads/roofing/${params.state}`}
            className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
          >
            ← {stateName} Roofing Leads
          </Link>
          <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
            Source: NOAA Storm Events Database
          </p>
        </div>

      </div>
    </div>
  );
}
