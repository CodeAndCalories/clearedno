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

// City data: slug → { display name, county slug, county display name }
// Used to detect city slugs and map them to their parent county for DB queries.
const CITY_DATA: Record<string, Record<string, { name: string; countySlug: string; countyFull: string }>> = {
  oh: {
    columbus:   { name: "Columbus",   countySlug: "franklin",   countyFull: "Franklin County" },
    cleveland:  { name: "Cleveland",  countySlug: "cuyahoga",   countyFull: "Cuyahoga County" },
    cincinnati: { name: "Cincinnati", countySlug: "hamilton",   countyFull: "Hamilton County" },
    akron:      { name: "Akron",      countySlug: "summit",     countyFull: "Summit County" },
    toledo:     { name: "Toledo",     countySlug: "lucas",      countyFull: "Lucas County" },
    dayton:     { name: "Dayton",     countySlug: "montgomery", countyFull: "Montgomery County" },
  },
  in: {
    indianapolis: { name: "Indianapolis", countySlug: "marion", countyFull: "Marion County" },
    "fort-wayne": { name: "Fort Wayne",   countySlug: "allen",  countyFull: "Allen County" },
  },
  mi: {
    detroit:       { name: "Detroit",       countySlug: "wayne", countyFull: "Wayne County" },
    "grand-rapids": { name: "Grand Rapids", countySlug: "kent",  countyFull: "Kent County" },
  },
  ky: {
    louisville: { name: "Louisville", countySlug: "jefferson", countyFull: "Jefferson County" },
    lexington:  { name: "Lexington",  countySlug: "fayette",   countyFull: "Fayette County" },
  },
  il: {
    chicago:  { name: "Chicago",  countySlug: "cook",      countyFull: "Cook County" },
    rockford: { name: "Rockford", countySlug: "winnebago", countyFull: "Winnebago County" },
  },
  pa: {
    philadelphia: { name: "Philadelphia", countySlug: "philadelphia", countyFull: "Philadelphia County" },
    pittsburgh:   { name: "Pittsburgh",   countySlug: "allegheny",    countyFull: "Allegheny County" },
  },
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
// Static params — county combos from DB + hardcoded city slugs
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

  // Add city slugs
  for (const [state, cities] of Object.entries(CITY_DATA)) {
    for (const citySlug of Object.keys(cities)) {
      const key = `${state}/${citySlug}`;
      if (!seen.has(key)) {
        seen.add(key);
        params.push({ state, county: citySlug });
      }
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

  // City path
  const cityEntry = CITY_DATA[params.state]?.[params.county];
  if (cityEntry) {
    const stateAbbrev = params.state.toUpperCase();
    const { data: leads } = await supabaseAdmin
      .from("roofing_leads")
      .select("lead_score, magnitude")
      .eq("state", stateAbbrev)
      .ilike("county", `%${cityEntry.countyFull.replace(" County", "")}%`);

    const total = leads?.length ?? 0;
    const hot   = leads?.filter((l) => l.lead_score === "hot").length ?? 0;

    return {
      title: `Roofing Leads in ${cityEntry.name}, ${stateName} — Hail & Wind Damage Data | ClearedNo`,
      description: `Find hail damage roofing leads in ${cityEntry.name}, ${stateName}. ${hot} hot leads from recent storm events. Updated weekly from NOAA data. ${total} total events tracked.`,
      alternates: {
        canonical: `https://www.clearedno.com/leads/roofing/${params.state}/${params.county}`,
      },
    };
  }

  // County path
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
// Stat card (shared)
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
// City page component
// ---------------------------------------------------------------------------

async function CityLeadsPage({
  stateSlug,
  citySlug,
  stateName,
}: {
  stateSlug: string;
  citySlug: string;
  stateName: string;
}) {
  const cityEntry = CITY_DATA[stateSlug][citySlug];
  const stateAbbrev = stateSlug.toUpperCase();

  // Query by county — best proxy for city-level storm data
  const { data } = await supabaseAdmin
    .from("roofing_leads")
    .select("id, county, state, event_date, magnitude, lead_score, event_type")
    .eq("state", stateAbbrev)
    .ilike("county", `%${cityEntry.countyFull.replace(" County", "")}%`)
    .order("event_date", { ascending: false });

  const leads = (data ?? []) as Lead[];
  const totalLeads = leads.length;
  const hotLeads   = leads.filter((l) => l.lead_score === "hot").length;
  const warmLeads  = totalLeads - hotLeads;
  const maxMag     = leads.reduce((m, l) => Math.max(m, l.magnitude ?? 0), 0);
  const newestDate = leads[0]?.event_date ? formatDate(leads[0].event_date) : "—";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I find hail damage leads in ${cityEntry.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ClearedNo sources hail damage roofing leads in ${cityEntry.name}, ${stateName} from NOAA Storm Events data. Every Monday we update our database with new storm records, score each event (hot = 1"+ hailstone, warm = under 1"), and make the full lead list available for download. Contractors get addresses, event dates, and magnitude data for every tracked storm in ${cityEntry.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `What roofing leads are available in ${cityEntry.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ClearedNo tracks ${totalLeads > 0 ? `${totalLeads} hail events` : "hail events"} in the ${cityEntry.countyFull} area (${cityEntry.name}, ${stateName}). ${hotLeads > 0 ? `${hotLeads} of these are hot leads (1"+ hailstone size), indicating significant roof damage probability.` : ""} All leads include event date, hail magnitude, and lead score.`,
        },
      },
      {
        "@type": "Question",
        name: `How fresh is the storm data for ${cityEntry.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ClearedNo updates ${cityEntry.name} storm data every Monday from the NOAA Storm Events Database. The most recent ${cityEntry.name} hail event in our system${leads[0]?.event_date ? ` was recorded on ${formatDate(leads[0].event_date)}` : " is updated weekly"}. Subscribers get access to fresh leads before they go cold.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MarketingNav />

      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 pt-24 pb-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
            ClearedNo / Roofing Leads /{" "}
            <Link href={`/leads/roofing/${stateSlug}`} className="hover:text-[#FF6B00] transition-colors">
              {stateName}
            </Link>{" "}
            / {cityEntry.name}
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            Roofing Leads in {cityEntry.name}, {stateName}
            <span className="block text-[#FF6B00] text-3xl sm:text-4xl mt-2">
              — Hail &amp; Wind Damage Data
            </span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 max-w-xl leading-relaxed">
            {totalLeads > 0
              ? `${totalLeads} hail-verified roofing leads in the ${cityEntry.name} area. Sourced from NOAA Storm Events, updated every Monday.`
              : `Hail damage roofing leads for ${cityEntry.name}, ${stateName}. Updated weekly from NOAA Storm Events.`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Leads"  value={totalLeads > 0 ? totalLeads : "—"} />
          <StatCard label="Hot Leads"    value={hotLeads > 0 ? hotLeads : "—"} accent="#FF6B00" />
          <StatCard label="Largest Hail" value={maxMag > 0 ? `${maxMag.toFixed(2)}"` : "—"} accent="#EAB308" />
          <StatCard label="Latest Event" value={newestDate} />
        </div>

        {/* Why contractors need leads */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              Why {cityEntry.name} Roofing Contractors Need Storm Leads
            </h2>
          </div>
          <div className="border-l-2 border-[#FF6B00]/40 pl-6 py-2 mb-6">
            <p className="text-sm text-[#F5F0E8]/70 leading-relaxed">
              {cityEntry.name} sits in a high-frequency hail corridor that produces
              damaging storms every season. The window to reach homeowners after a hail
              event is{" "}
              <span className="text-[#F5F0E8]">72 hours</span> — after that, other
              contractors and insurance adjusters have already knocked.{" "}
              {hotLeads > 0 && (
                <>
                  <span className="text-[#FF6B00] font-medium">{hotLeads} hot-scored events</span>{" "}
                  in the {cityEntry.name} area had hailstones over 1&quot;, the threshold where roof
                  replacement is nearly guaranteed.{" "}
                </>
              )}
              {warmLeads > 0 && (
                <>
                  An additional{" "}
                  <span className="text-[#F5F0E8]">{warmLeads} warm events</span> produced
                  shingle and gutter damage that often goes unclaimed without a contractor
                  follow-up.
                </>
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                stat: "72 hrs",
                label: "Contact window",
                detail: "Homeowners are most receptive in the first 3 days after a storm.",
              },
              {
                stat: "1.0\"",
                label: "Hot lead threshold",
                detail: "Hailstones at or above 1 inch typically cause insurable roof damage.",
              },
              {
                stat: "Weekly",
                label: "Data refresh",
                detail: "New storm events are added every Monday from NOAA records.",
              },
            ].map((item) => (
              <div key={item.label} className="border border-[#FF6B00]/20 p-5 relative bg-[#0A0A0A]">
                <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
                <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />
                <p className="font-heading text-3xl tracking-widest text-[#FF6B00] mb-1">{item.stat}</p>
                <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">{item.label}</p>
                <p className="text-xs text-[#F5F0E8]/50 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How ClearedNo works */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              How ClearedNo Works
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                step: "01",
                title: "Storm data ingested weekly",
                detail: `Every Monday, ClearedNo pulls new events from NOAA Storm Events and maps them to specific counties — including ${cityEntry.countyFull} (${cityEntry.name}).`,
              },
              {
                step: "02",
                title: "Events scored hot or warm",
                detail: "Each storm event is scored based on hailstone size: hot (1\"+ = near-certain damage) or warm (under 1\" = moderate risk). You see the score on every lead.",
              },
              {
                step: "03",
                title: "You download and work the leads",
                detail: `Subscribers get a CSV with event date, magnitude, score, and county for every tracked storm in ${cityEntry.name} and across all 6 states. No per-lead fees, no contracts.`,
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5 border border-[#FF6B00]/10 p-5">
                <span className="font-heading text-2xl text-[#FF6B00]/40 shrink-0 mt-0.5">{item.step}</span>
                <div>
                  <p className="text-sm font-bold text-[#F5F0E8] mb-1">{item.title}</p>
                  <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads table (if any) */}
        {leads.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
                Recent Hail Events — {cityEntry.name} Area
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
                  {leads.slice(0, 10).map((lead, i) => {
                    const isHot = lead.lead_score === "hot";
                    return (
                      <tr
                        key={lead.id}
                        className={`border-b border-[#FF6B00]/10 hover:bg-[#FF6B00]/5 transition-colors ${
                          i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"
                        }`}
                      >
                        <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">{formatDate(lead.event_date)}</td>
                        <td className="px-5 py-3 text-[#F5F0E8]/80 tabular-nums whitespace-nowrap">{formatMag(lead.magnitude)}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium"
                            style={{
                              color:           isHot ? "#FF6B00" : "#EAB308",
                              backgroundColor: isHot ? "rgba(255,107,0,0.12)" : "rgba(234,179,8,0.12)",
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isHot ? "#FF6B00" : "#EAB308" }} />
                            {isHot ? "Hot" : "Warm"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#F5F0E8]/40 uppercase tracking-widest text-[9px] whitespace-nowrap">{lead.event_type}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {leads.length > 10 && (
                <div className="px-5 py-3 border-t border-[#FF6B00]/10 text-[10px] text-[#F5F0E8]/30 tracking-widest">
                  Showing 10 of {leads.length} events — get the full list below
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">FAQ</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: `How do I find hail damage leads in ${cityEntry.name}?`,
                a: `ClearedNo pulls ${cityEntry.name}-area hail events from NOAA Storm Events every Monday and scores each one. Hot leads (1"+ hailstone) indicate near-certain roof damage. Subscribe to download the full lead list with event dates and magnitudes — no per-lead fees.`,
              },
              {
                q: `What roofing leads are available in ${cityEntry.name}?`,
                a: `The ${cityEntry.name} area (${cityEntry.countyFull}) has ${totalLeads > 0 ? `${totalLeads} tracked hail events` : "tracked hail events"} in our system${hotLeads > 0 ? `, including ${hotLeads} hot leads with 1"+ hailstone size` : ""}. Subscribers get the full CSV with date, magnitude, and score for every event.`,
              },
              {
                q: `How fresh is the storm data for ${cityEntry.name}?`,
                a: `${cityEntry.name} storm data is refreshed every Monday from NOAA. ${leads[0]?.event_date ? `The most recent event in our system was ${formatDate(leads[0].event_date)}.` : ""} Fresh data means you reach homeowners before the competition does.`,
              },
            ].map((item, i) => (
              <div key={i} className="border border-[#FF6B00]/10 p-6">
                <h3 className="text-sm font-bold text-[#F5F0E8] mb-2 leading-snug">{item.q}</h3>
                <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-[#FF6B00] p-10 relative text-center">
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <p className="text-[10px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">Full Lead List</p>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            Get {cityEntry.name} Roofing Leads
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8 max-w-md mx-auto leading-relaxed">
            Download the full CSV with event dates, magnitudes, and scores for every
            tracked hail event in {cityEntry.name} — plus all counties across 6 states.
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
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              More {stateName} Cities
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/leads/roofing/${stateSlug}`}
              className="border border-[#FF6B00]/30 px-4 py-2 text-[10px] tracking-widest uppercase text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors"
            >
              All {stateName} Leads →
            </Link>
            {Object.entries(CITY_DATA[stateSlug] ?? {})
              .filter(([slug]) => slug !== citySlug)
              .slice(0, 4)
              .map(([slug, city]) => (
                <Link
                  key={slug}
                  href={`/leads/roofing/${stateSlug}/${slug}`}
                  className="border border-[#FF6B00]/20 px-4 py-2 text-[10px] tracking-widest uppercase text-[#F5F0E8]/50 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
                >
                  {city.name}
                </Link>
              ))}
          </div>
        </div>

        {/* Footer nav */}
        <div className="border-t border-[#FF6B00]/10 pt-6 flex items-center justify-between">
          <Link
            href={`/leads/roofing/${stateSlug}`}
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

// ---------------------------------------------------------------------------
// Page (routes to city or county view)
// ---------------------------------------------------------------------------

export default async function CountyLeadsPage({
  params,
}: {
  params: { state: string; county: string };
}) {
  const stateName = STATE_MAP[params.state];
  if (!stateName) notFound();

  // City slug detection — render city hub if matched
  if (CITY_DATA[params.state]?.[params.county]) {
    return (
      <CityLeadsPage
        stateSlug={params.state}
        citySlug={params.county}
        stateName={stateName}
      />
    );
  }

  // ── County path ────────────────────────────────────────────────────────────
  const stateAbbrev = params.state.toUpperCase();
  const countyName  = await resolveCounty(stateAbbrev, params.county);
  if (!countyName) notFound();

  const displayCounty = countyName.replace(/ County$/i, "");

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

  const { data: otherCountyData } = await supabaseAdmin
    .from("roofing_leads")
    .select("county")
    .eq("state", stateAbbrev)
    .neq("county", countyName)
    .limit(200);

  const otherCounties = Array.from(
    new Set((otherCountyData ?? []).map((r: { county: string }) => r.county))
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Roofing Leads - ${displayCounty} County ${stateName}`,
    description: `Storm damage roofing leads for ${displayCounty} County, ${stateName}`,
    provider: {
      "@type": "Organization",
      name: "ClearedNo",
      url: "https://clearedno.com",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${displayCounty} County, ${stateName}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
