import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";

export const metadata = {
  title: "Roofing Leads — Ohio | ClearedNo",
  description: "Ohio hail storm roofing leads sourced from NOAA Storm Events data.",
};

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from("roofing_leads")
    .select("id, address, county, event_type, event_date, source, magnitude, lead_score, lat, lng, created_at")
    .order("event_date", { ascending: false });

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
            Roofing Leads — Ohio
          </h1>
          <p className="text-sm text-[#F5F0E8]/40 mt-2">
            Sourced from NOAA Storm Events Database · hail events past 12 months
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <LeadsTable leads={leads ?? []} />
      </div>
    </main>
  );
}
