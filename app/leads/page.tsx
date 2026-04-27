import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";

export const metadata = {
  title: "Roofing Leads — Midwest | ClearedNo",
  description: "Hail and wind damage roofing leads across 6 Midwest states, sourced from NOAA Storm Events data.",
};

export default async function LeadsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single()
    : { data: null };

  const PROPERTY_SOURCES = ["franklin-arcgis", "cuyahoga-arcgis"];

  const [
    { data: stormLeads, error: stormError, count: stormCount },
    { data: propertyLeads, error: propertyError, count: propertyCount },
    { data: propCountyRows },
    { count: pre1990Count },
  ] = await Promise.all([
    supabase
      .from("roofing_leads")
      .select("id, address, county, state, event_type, event_date, source, magnitude, lead_score, lat, lng, created_at", { count: "exact" })
      .not("event_date", "is", null)
      .order("event_date", { ascending: false }),
    supabase
      .from("roofing_leads")
      .select("id, address, county, state, owner_name, owner_mailing_address, year_built, source, lat, lng", { count: "exact" })
      .eq("source", "franklin-arcgis")
      .order("year_built", { ascending: true })
      .limit(1000),
    // County names across all property sources — no limit — for distinct county count.
    supabase
      .from("roofing_leads")
      .select("county")
      .in("source", PROPERTY_SOURCES)
      .not("county", "is", null),
    // HEAD-only count of pre-1990 properties across all property sources.
    supabase
      .from("roofing_leads")
      .select("*", { count: "exact", head: true })
      .in("source", PROPERTY_SOURCES)
      .not("year_built", "is", null)
      .lt("year_built", 1990),
  ]);

  const distinctCountyCount = new Set(propCountyRows?.map((r) => r.county) ?? []).size;

  const error = stormError ?? propertyError;

  if (error) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono p-8">
        <div className="max-w-6xl mx-auto">
          <div className="border border-[#DC2626]/40 bg-[#DC2626]/5 px-6 py-5">
            <p className="text-[10px] tracking-[0.3em] text-[#DC2626] uppercase mb-1">Error</p>
            <p className="text-sm text-[#F5F0E8]/70">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
            ClearedNo / Leads
          </p>
          <h1 className="font-heading text-5xl tracking-widest text-[#F5F0E8] uppercase">
            Roofing Leads — Midwest
          </h1>
          <p className="text-sm text-[#F5F0E8]/40 mt-2">
            Sourced from NOAA Storm Events Database · hail + wind damage events · 6 states · updated weekly · data reflects 60–90 day NOAA reporting lag
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <LeadsTable
          leads={stormLeads ?? []}
          propertyLeads={propertyLeads ?? []}
          subscriptionStatus={profile?.subscription_status ?? null}
          totalStormCount={stormCount ?? (stormLeads?.length ?? 0)}
          totalPropertyCount={propertyCount ?? (propertyLeads?.length ?? 0)}
          distinctCountyCount={distinctCountyCount}
          pre1990Count={pre1990Count ?? 0}
        />
      </div>
    </main>
  );
}
