"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoofingLead {
  id: string;
  address: string | null;
  county: string;
  state: string | null;
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

// ─── Constants ────────────────────────────────────────────────────────────────

const STATES = ["OH", "IN", "MI", "KY", "IL", "PA"] as const;
const PAGE_SIZE = 25;

type SortKey =
  | "date-desc"
  | "date-asc"
  | "magnitude-desc"
  | "score"
  | "county-asc"
  | "county-desc";

const EVENT_TYPE_CONFIG = {
  hail: {
    label: "HAIL",
    color: "#FF6B00",
    bg:    "rgba(255,107,0,0.10)",
    border:"rgba(255,107,0,0.35)",
  },
  wind: {
    label: "WIND",
    color: "#60A5FA",
    bg:    "rgba(96,165,250,0.10)",
    border:"rgba(96,165,250,0.35)",
  },
} as const;

const SCORE_CONFIG = {
  hot: {
    label: "HOT",
    color: "#FF6B00",
    bg: "rgba(255,107,0,0.15)",
    border: "rgba(255,107,0,0.5)",
    dot: "#FF6B00",
  },
  warm: {
    label: "WARM",
    color: "#EAB308",
    bg: "rgba(234,179,8,0.15)",
    border: "rgba(234,179,8,0.45)",
    dot: "#EAB308",
  },
} as const;

const SELECT_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF6B00' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 10px center",
};

const SELECT_CLASS =
  "bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none pr-8";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatMagnitude(mag: number | null): string {
  if (mag === null || mag === undefined) return "—";
  return `${mag.toFixed(2)}"`;
}

function exportCsv(rows: RoofingLead[]) {
  const headers = [
    "county", "state", "event_date", "magnitude_in",
    "lead_score", "event_type", "source", "lat", "lng",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${r.county}"`,
        r.state ?? "",
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
  a.download = `roofing-leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function sortLeads(arr: RoofingLead[], key: SortKey): RoofingLead[] {
  const copy = [...arr];
  switch (key) {
    case "date-desc":
      return copy.sort((a, b) => b.event_date.localeCompare(a.event_date));
    case "date-asc":
      return copy.sort((a, b) => a.event_date.localeCompare(b.event_date));
    case "magnitude-desc":
      return copy.sort((a, b) => (b.magnitude ?? 0) - (a.magnitude ?? 0));
    case "score":
      return copy.sort((a, b) =>
        a.lead_score === b.lead_score ? 0 : a.lead_score === "hot" ? -1 : 1
      );
    case "county-asc":
      return copy.sort((a, b) => a.county.localeCompare(b.county));
    case "county-desc":
      return copy.sort((a, b) => b.county.localeCompare(a.county));
    default:
      return copy;
  }
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div className="border border-[#FF6B00]/20 p-5 relative bg-[#0A0A0A]">
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />
      <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">{label}</p>
      <p
        className="font-heading text-4xl tracking-widest leading-none mb-1"
        style={{ color: accent ?? "#F5F0E8" }}
      >
        {value}
      </p>
      <p className="text-[9px] tracking-[0.15em] text-[#F5F0E8]/25 uppercase">{subtitle}</p>
    </div>
  );
}

// ─── Sort arrow ───────────────────────────────────────────────────────────────

function SortArrow({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) return <span className="ml-1 text-[#F5F0E8]/15">↕</span>;
  return <span className="ml-1 text-[#FF6B00]">{direction === "asc" ? "↑" : "↓"}</span>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LeadsTable({ leads, subscriptionStatus }: Props) {
  const [stateFilter,     setStateFilter]     = useState<string>("all");
  const [scoreFilter,     setScoreFilter]     = useState<string>("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [search,          setSearch]          = useState<string>("");
  const [sortKey,        setSortKey]        = useState<SortKey>("date-desc");
  const [page,           setPage]           = useState(1);
  const [portalLoading,  setPortalLoading]  = useState(false);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res  = await fetch("/api/leads-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  // ── Filter pipeline ───────────────────────────────────────────────────────

  const stateFiltered = useMemo(() => {
    if (stateFilter === "all") return leads;
    return leads.filter((l) => l.state === stateFilter);
  }, [leads, stateFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stateFiltered.filter((l) => {
      if (scoreFilter     !== "all" && l.lead_score  !== scoreFilter)     return false;
      if (eventTypeFilter !== "all" && l.event_type  !== eventTypeFilter) return false;
      if (q) {
        const countyMatch = l.county.toLowerCase().includes(q);
        const stateMatch  = (l.state ?? "").toLowerCase().includes(q);
        if (!countyMatch && !stateMatch) return false;
      }
      return true;
    });
  }, [stateFiltered, scoreFilter, search]);

  const sorted = useMemo(() => sortLeads(filtered, sortKey), [filtered, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, safePage]);

  // ── Stat cards (stateFilter only, unaffected by search/score/sort) ────────

  const statBase   = stateFilter === "all" ? leads : stateFiltered;
  const totalLeads = statBase.length;
  const hotLeads   = statBase.filter((l) => l.lead_score === "hot").length;
  const warmLeads  = statBase.filter((l) => l.lead_score === "warm").length;
  const newestDate =
    statBase.length > 0
      ? formatDate(
          statBase.reduce((best, l) =>
            l.event_date > best.event_date ? l : best
          ).event_date
        )
      : "—";

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleColumnSort(col: "county" | "date") {
    setSortKey((prev) => {
      if (col === "county") return prev === "county-asc" ? "county-desc" : "county-asc";
      return prev === "date-desc" ? "date-asc" : "date-desc";
    });
    setPage(1);
  }

  function handleStateChange(val: string)      { setStateFilter(val);              setPage(1); }
  function handleScoreChange(val: string)      { setScoreFilter(val);              setPage(1); }
  function handleEventTypeChange(val: string)  { setEventTypeFilter(val);          setPage(1); }
  function handleSortChange(val: SortKey)      { setSortKey(val);                  setPage(1); }
  function handleSearch(val: string)           { setSearch(val);                   setPage(1); }

  // ── Showing text ──────────────────────────────────────────────────────────

  const showingFrom = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const showingTo   = Math.min(safePage * PAGE_SIZE, sorted.length);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads"  value={totalLeads} subtitle="across 6 states"  />
        <StatCard label="Hot Leads"    value={hotLeads}   subtitle='1"+ hailstone'    accent="#FF6B00" />
        <StatCard label="Warm Leads"   value={warmLeads}  subtitle='under 1" hail'    accent="#EAB308" />
        <StatCard label="Newest Event" value={newestDate} subtitle="last event date"  />
      </div>

      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <div>
        <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search county or state..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:max-w-sm bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 placeholder:text-[#F5F0E8]/20 focus:outline-none focus:border-[#FF6B00] transition-colors"
        />
      </div>

      {/* ── Filters + export ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* State */}
          <div>
            <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">State</label>
            <select
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              className={SELECT_CLASS}
              style={SELECT_STYLE}
            >
              <option value="all" className="bg-[#0A0A0A]">All States</option>
              {STATES.map((s) => (
                <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>
              ))}
            </select>
          </div>

          {/* Score */}
          <div>
            <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">Score</label>
            <select
              value={scoreFilter}
              onChange={(e) => handleScoreChange(e.target.value)}
              className={SELECT_CLASS}
              style={SELECT_STYLE}
            >
              <option value="all"  className="bg-[#0A0A0A]">All Scores</option>
              <option value="hot"  className="bg-[#0A0A0A]">Hot</option>
              <option value="warm" className="bg-[#0A0A0A]">Warm</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">Type</label>
            <select
              value={eventTypeFilter}
              onChange={(e) => handleEventTypeChange(e.target.value)}
              className={SELECT_CLASS}
              style={SELECT_STYLE}
            >
              <option value="all"  className="bg-[#0A0A0A]">All Types</option>
              <option value="hail" className="bg-[#0A0A0A]">Hail</option>
              <option value="wind" className="bg-[#0A0A0A]">Wind</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">Sort</label>
            <select
              value={
                ["date-desc", "date-asc", "magnitude-desc", "score"].includes(sortKey)
                  ? sortKey
                  : "date-desc"
              }
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              className={SELECT_CLASS}
              style={SELECT_STYLE}
            >
              <option value="date-desc"       className="bg-[#0A0A0A]">Date (newest)</option>
              <option value="date-asc"        className="bg-[#0A0A0A]">Date (oldest)</option>
              <option value="magnitude-desc"  className="bg-[#0A0A0A]">Magnitude (highest)</option>
              <option value="score"           className="bg-[#0A0A0A]">Score (hot first)</option>
            </select>
          </div>
        </div>

        {/* Export + Portal */}
        <div className="flex items-end gap-3">
          <button
            onClick={() => exportCsv(sorted)}
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

      {/* ── Showing count ──────────────────────────────────────────────── */}
      <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase">
        Showing {showingFrom}–{showingTo} of {sorted.length} leads
      </p>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      {sorted.length === 0 ? (
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

                {/* County — clickable sort */}
                <th
                  className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal cursor-pointer hover:text-[#FF6B00] select-none"
                  onClick={() => handleColumnSort("county")}
                >
                  County
                  <SortArrow
                    active={sortKey === "county-asc" || sortKey === "county-desc"}
                    direction={sortKey === "county-asc" ? "asc" : "desc"}
                  />
                </th>

                <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                  State
                </th>

                {/* Date — clickable sort */}
                <th
                  className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal cursor-pointer hover:text-[#FF6B00] select-none"
                  onClick={() => handleColumnSort("date")}
                >
                  Event Date
                  <SortArrow
                    active={sortKey === "date-desc" || sortKey === "date-asc"}
                    direction={sortKey === "date-asc" ? "asc" : "desc"}
                  />
                </th>

                <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                  Magnitude
                </th>
                <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                  Score
                </th>
                <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                  Type
                </th>
                <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                  Map
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead, i) => {
                const cfg    = SCORE_CONFIG[lead.lead_score] ?? SCORE_CONFIG.warm;
                const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(
                  `${lead.county} ${lead.state ?? ""}`
                )}`;
                return (
                  <tr
                    key={lead.id}
                    className={`border-b border-[#FF6B00]/10 hover:bg-[#FF6B00]/5 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-[#F5F0E8]/[0.02]"
                    }`}
                  >
                    <td className="px-5 py-3 text-[#F5F0E8]/80 whitespace-nowrap">
                      {lead.county}
                    </td>
                    <td className="px-5 py-3 text-[#F5F0E8]/50 whitespace-nowrap">
                      {lead.state ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">
                      {formatDate(lead.event_date)}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap tabular-nums">
                      <span style={{ color: lead.magnitude ? "#FF6B00" : "rgba(245,240,232,0.3)" }}>
                        {formatMagnitude(lead.magnitude)}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium"
                        style={{
                          color:           cfg.color,
                          backgroundColor: cfg.bg,
                          border:          `1px solid ${cfg.border}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cfg.dot }}
                        />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {(() => {
                        const tc = EVENT_TYPE_CONFIG[lead.event_type as keyof typeof EVENT_TYPE_CONFIG]
                          ?? EVENT_TYPE_CONFIG.hail;
                        return (
                          <span
                            className="inline-flex items-center px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium"
                            style={{
                              color:           tc.color,
                              backgroundColor: tc.bg,
                              border:          `1px solid ${tc.border}`,
                            }}
                          >
                            {tc.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] tracking-widest uppercase font-mono text-[#F5F0E8]/30 border border-[#F5F0E8]/10 px-2 py-1 hover:border-[#FF6B00]/40 hover:text-[#FF6B00]/70 transition-colors"
                      >
                        Map ↗
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="border border-[#FF6B00]/30 text-[#FF6B00]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase">
            Page {safePage} of {totalPages}
          </p>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="border border-[#FF6B00]/30 text-[#FF6B00]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase text-right">
        New leads drop every Monday — email notification when your list updates
      </p>

    </div>
  );
}
