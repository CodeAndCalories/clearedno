"use client";

import { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RoofingLead {
  id: string;
  address: string | null;
  county: string;
  event_type: string;
  event_date: string;
  source: string;
  magnitude: number | null;
  lead_score: "hot" | "warm";
  lat: number | null;
  lng: number | null;
  created_at: string;
}

interface Props {
  leads: RoofingLead[];
  subscriptionStatus: string | null;
}

// ---------------------------------------------------------------------------
// Badge config
// ---------------------------------------------------------------------------

const SCORE_CONFIG = {
  hot: {
    label: "HOT",
    color: "#FF6B00",
    bg: "rgba(255,107,0,0.12)",
    dot: "#FF6B00",
  },
  warm: {
    label: "WARM",
    color: "#EAB308",
    bg: "rgba(234,179,8,0.12)",
    dot: "#EAB308",
  },
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00"); // force local parse
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatMagnitude(mag: number | null): string {
  if (mag === null || mag === undefined) return "—";
  return `${mag.toFixed(2)}"`;
}

function exportCsv(rows: RoofingLead[]) {
  const headers = ["county", "event_date", "magnitude_in", "lead_score", "event_type", "source", "lat", "lng"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${r.county}"`,
        r.event_date,
        r.magnitude ?? "",
        r.lead_score,
        r.event_type,
        r.source,
        r.lat ?? "",
        r.lng ?? "",
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `roofing-leads-ohio-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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
      {/* corner accents */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />

      <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">{label}</p>
      <p
        className="font-heading text-4xl tracking-widest"
        style={{ color: accent ?? "#F5F0E8" }}
      >
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LeadsTable({ leads, subscriptionStatus }: Props) {
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [portalLoading, setPortalLoading] = useState(false);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/leads-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setPortalLoading(false);
    }
  }

  // Unique sorted county list
  const counties = useMemo(() => {
    const s = new Set(leads.map((l) => l.county));
    return ["all", ...Array.from(s).sort()];
  }, [leads]);

  // Filtered rows
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (countyFilter !== "all" && l.county !== countyFilter) return false;
      if (scoreFilter !== "all" && l.lead_score !== scoreFilter) return false;
      return true;
    });
  }, [leads, countyFilter, scoreFilter]);

  // Stats (always from full dataset)
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.lead_score === "hot").length;
  const warmLeads = leads.filter((l) => l.lead_score === "warm").length;
  const newestDate = leads.length > 0 ? formatDate(leads[0].event_date) : "—";

  return (
    <div className="space-y-8">
      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={totalLeads} />
        <StatCard label="Hot Leads" value={hotLeads} accent="#FF6B00" />
        <StatCard label="Warm Leads" value={warmLeads} accent="#EAB308" />
        <StatCard label="Newest Event" value={newestDate} />
      </div>

      {/* ── Filters + export ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* County filter */}
          <div>
            <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">
              County
            </label>
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none pr-8"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF6B00' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
            >
              {counties.map((c) => (
                <option key={c} value={c} className="bg-[#0A0A0A]">
                  {c === "all" ? "All Counties" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Score filter */}
          <div>
            <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">
              Score
            </label>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none pr-8"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF6B00' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
            >
              <option value="all" className="bg-[#0A0A0A]">All Scores</option>
              <option value="hot" className="bg-[#0A0A0A]">Hot</option>
              <option value="warm" className="bg-[#0A0A0A]">Warm</option>
            </select>
          </div>
        </div>

        {/* Export + Portal */}
        <div className="flex items-end gap-3">
          <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase self-end pb-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => exportCsv(filtered)}
            className="border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
          >
            Download CSV
          </button>
          <button
            onClick={openPortal}
            disabled={portalLoading}
            className="border border-[#F5F0E8]/30 text-[#F5F0E8]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors disabled:opacity-40"
          >
            {portalLoading ? "Loading…" : "Manage Subscription"}
          </button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="border border-[#FF6B00]/20 px-6 py-12 text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#F5F0E8]/30 uppercase">
            No leads match the current filters
          </p>
        </div>
      ) : (
        <div className="border border-[#FF6B00]/20 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#FF6B00]/20">
                {["County", "Event Date", "Magnitude", "Score", "Type"].map((h) => (
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
              {filtered.map((lead, i) => {
                const cfg = SCORE_CONFIG[lead.lead_score] ?? SCORE_CONFIG.warm;
                return (
                  <tr
                    key={lead.id}
                    className={`border-b border-[#FF6B00]/10 hover:bg-[#FF6B00]/5 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"
                    }`}
                  >
                    {/* County */}
                    <td className="px-5 py-3 text-[#F5F0E8]/80 whitespace-nowrap">
                      {lead.county}
                    </td>

                    {/* Event date */}
                    <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">
                      {formatDate(lead.event_date)}
                    </td>

                    {/* Magnitude */}
                    <td className="px-5 py-3 text-[#F5F0E8]/80 whitespace-nowrap tabular-nums">
                      {formatMagnitude(lead.magnitude)}
                    </td>

                    {/* Lead score badge */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium"
                        style={{ color: cfg.color, backgroundColor: cfg.bg }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cfg.dot }}
                        />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Event type */}
                    <td className="px-5 py-3 text-[#F5F0E8]/40 whitespace-nowrap uppercase tracking-widest text-[9px]">
                      {lead.event_type}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer note */}
      <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase text-right">
        Source: NOAA Storm Events Database · updated by scraper on demand
      </p>
    </div>
  );
}
