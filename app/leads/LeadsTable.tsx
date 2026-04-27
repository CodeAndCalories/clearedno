"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

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

interface PropertyLead {
  id: string;
  address: string | null;
  county: string;
  state: string | null;
  owner_name: string | null;
  owner_mailing_address: string | null;
  year_built: number | null;
  source: string;
  lat: number | null;
  lng: number | null;
}

interface Props {
  leads: RoofingLead[];
  propertyLeads: PropertyLead[];
  subscriptionStatus: string | null;
  totalStormCount: number;
  totalPropertyCount: number;
  distinctCountyCount: number;
  pre1990Count: number;
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

type Tab = "storm" | "property";

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

// Returns true only when event_date is a real date string within the last 7 days.
// Passing null (property records have no event_date) always returns false.
function isNewThisWeek(eventDate: string | null | undefined): boolean {
  if (!eventDate) return false;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return eventDate >= sevenDaysAgo;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatMagnitude(mag: number | null): string {
  if (mag === null || mag === undefined) return "—";
  return `${mag.toFixed(2)}"`;
}

function exportStormCsv(rows: RoofingLead[]) {
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
  a.download = `storm-leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPropertyCsv(rows: PropertyLead[]) {
  const headers = ["address", "county", "state", "owner_name", "owner_mailing_address", "year_built"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${r.address ?? ""}"`,
        `"${r.county}"`,
        r.state ?? "",
        `"${r.owner_name ?? ""}"`,
        `"${r.owner_mailing_address ?? ""}"`,
        r.year_built ?? "",
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `property-leads-${new Date().toISOString().split("T")[0]}.csv`;
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
  showPulse,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  accent?: string;
  showPulse?: boolean;
}) {
  return (
    <div className="border border-[#FF6B00]/20 p-5 relative bg-[#0A0A0A]">
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase">{label}</p>
        {showPulse && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse flex-shrink-0" />
        )}
      </div>
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

export default function LeadsTable({ leads, propertyLeads, subscriptionStatus, totalStormCount, totalPropertyCount, distinctCountyCount, pre1990Count }: Props) {
  // ── Tab state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("storm");

  // ── Storm tab state ───────────────────────────────────────────────────────
  const [stateFilter,     setStateFilter]     = useState<string>("all");
  const [scoreFilter,     setScoreFilter]     = useState<string>("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [search,          setSearch]          = useState<string>("");
  const [sortKey,        setSortKey]        = useState<SortKey>("date-desc");
  const [page,           setPage]           = useState(1);
  const [portalLoading,  setPortalLoading]  = useState(false);
  const [hideContacted,  setHideContacted]  = useState(false);

  // ── Property tab state ────────────────────────────────────────────────────
  const [propSearch,        setPropSearch]        = useState<string>("");
  const [propPage,          setPropPage]          = useState(1);
  const [propHideContacted, setPropHideContacted] = useState(false);

  // ── Shared contact state (optimistic, client-side only) ───────────────────
  const [contactedIds,  setContactedIds]  = useState<Set<string>>(new Set());
  const [contactingId,  setContactingId]  = useState<string | null>(null);

  async function markContacted(id: string) {
    setContactingId(id);
    try {
      await fetch("/api/leads/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lead_id: id }),
      });
      // Optimistically mark regardless of response
      setContactedIds((prev) => new Set(Array.from(prev).concat(id)));
    } finally {
      setContactingId(null);
    }
  }

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

  // ── Storm filter pipeline ─────────────────────────────────────────────────

  const stateFiltered = useMemo(() => {
    if (stateFilter === "all") return leads;
    return leads.filter((l) => l.state === stateFilter);
  }, [leads, stateFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stateFiltered.filter((l) => {
      // Score / new-week filter
      if (scoreFilter === "new-week") {
        if (!isNewThisWeek(l.event_date)) return false;
      } else if (scoreFilter !== "all") {
        if (l.lead_score !== scoreFilter) return false;
      }
      if (eventTypeFilter !== "all" && l.event_type !== eventTypeFilter) return false;
      if (hideContacted && contactedIds.has(l.id)) return false;
      if (q) {
        const countyMatch = l.county.toLowerCase().includes(q);
        const stateMatch  = (l.state ?? "").toLowerCase().includes(q);
        if (!countyMatch && !stateMatch) return false;
      }
      return true;
    });
  }, [stateFiltered, scoreFilter, eventTypeFilter, search, hideContacted, contactedIds]);

  const sorted = useMemo(() => sortLeads(filtered, sortKey), [filtered, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, safePage]);

  // ── Storm stat cards ──────────────────────────────────────────────────────

  const statBase      = stateFilter === "all" ? leads : stateFiltered;
  const totalLeads    = statBase.length;
  const hotLeads      = statBase.filter((l) => l.lead_score === "hot").length;
  const warmLeads     = statBase.filter((l) => l.lead_score === "warm").length;
  const hasNewThisWeek = useMemo(
    () => statBase.some((l) => isNewThisWeek(l.event_date)),
    [statBase]
  );
  const newestDate =
    statBase.length > 0
      ? formatDate(
          statBase.reduce((best, l) =>
            l.event_date > best.event_date ? l : best
          ).event_date
        )
      : "—";

  // ── Property filter pipeline ──────────────────────────────────────────────

  const filteredProps = useMemo(() => {
    const q = propSearch.trim().toLowerCase();
    return propertyLeads.filter((p) => {
      if (propHideContacted && contactedIds.has(p.id)) return false;
      if (!q) return true;
      const addrMatch  = (p.address ?? "").toLowerCase().includes(q);
      const ownerMatch = (p.owner_name ?? "").toLowerCase().includes(q);
      return addrMatch || ownerMatch;
    });
  }, [propertyLeads, propSearch, propHideContacted, contactedIds]);

  const propTotalPages = Math.max(1, Math.ceil(filteredProps.length / PAGE_SIZE));
  const safePropPage   = Math.min(propPage, propTotalPages);
  const paginatedProps = useMemo(() => {
    const start = (safePropPage - 1) * PAGE_SIZE;
    return filteredProps.slice(start, start + PAGE_SIZE);
  }, [filteredProps, safePropPage]);

  // ── Property stat cards ───────────────────────────────────────────────────

  const totalProps   = propertyLeads.length;
  const pre1990      = propertyLeads.filter((p) => p.year_built !== null && p.year_built < 1990).length;
  const avgYearBuilt = useMemo(() => {
    const withYear = propertyLeads.filter((p) => p.year_built !== null);
    if (withYear.length === 0) return "—";
    const avg = Math.round(withYear.reduce((s, p) => s + p.year_built!, 0) / withYear.length);
    return String(avg);
  }, [propertyLeads]);
  const countyCoverage = useMemo(() => {
    return new Set(propertyLeads.map((p) => p.county)).size;
  }, [propertyLeads]);

  // ── Contacted counts ──────────────────────────────────────────────────────

  const stormContactedCount = useMemo(
    () => leads.filter((l) => contactedIds.has(l.id)).length,
    [leads, contactedIds]
  );
  const propContactedCount = useMemo(
    () => propertyLeads.filter((p) => contactedIds.has(p.id)).length,
    [propertyLeads, contactedIds]
  );

  // ── Storm handlers ────────────────────────────────────────────────────────

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

  const showingFrom = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const showingTo   = Math.min(safePage * PAGE_SIZE, sorted.length);

  const propShowingFrom = filteredProps.length === 0 ? 0 : (safePropPage - 1) * PAGE_SIZE + 1;
  const propShowingTo   = Math.min(safePropPage * PAGE_SIZE, filteredProps.length);

  // ── Print canvassing sheet ────────────────────────────────────────────────

  function openCanvass() {
    const params = new URLSearchParams();
    if (propSearch) params.set("q", propSearch);
    window.open(`/leads/canvass?${params.toString()}`, "_blank");
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── Tab switcher ───────────────────────────────────────────────── */}
      <div className="flex border border-[#FF6B00]/20">
        {(["storm", "property"] as Tab[]).map((tab) => {
          const label = tab === "storm" ? "Storm Events" : "Property Records";
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 text-[10px] tracking-[0.25em] uppercase font-mono transition-colors ${
                isActive
                  ? "bg-[#FF6B00] text-[#0A0A0A] font-bold"
                  : "text-[#F5F0E8]/40 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          STORM EVENTS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "storm" && (
        <>
          {/* ── Stat cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Leads"  value={stateFilter === "all" ? totalStormCount : totalLeads} subtitle="across 6 states"  />
            <StatCard label="Hot Leads"    value={hotLeads}   subtitle='1"+ hailstone'    accent="#FF6B00" />
            <StatCard label="Warm Leads"   value={warmLeads}  subtitle='under 1" hail'    accent="#EAB308" />
            <StatCard
              label="Last NOAA Update"
              value={newestDate}
              subtitle="NOAA reports 60–90 days behind"
              showPulse={hasNewThisWeek}
            />
          </div>

          {/* ── Search bar ─────────────────────────────────────────────── */}
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

          {/* ── Filters + export ───────────────────────────────────────── */}
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
                  <option value="all"      className="bg-[#0A0A0A]">All Scores</option>
                  <option value="hot"      className="bg-[#0A0A0A]">Hot</option>
                  <option value="warm"     className="bg-[#0A0A0A]">Warm</option>
                  <option value="new-week" className="bg-[#0A0A0A]">New this week</option>
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

            {/* Export + Portal + Alerts */}
            <div className="flex items-end gap-3">
              <button
                onClick={() => exportStormCsv(sorted)}
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
              <Link
                href="/leads/alerts"
                className="border border-[#FF6B00]/30 text-[#FF6B00]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
              >
                County Alerts
              </Link>
            </div>
          </div>

          {/* ── Showing count + hide contacted toggle ──────────────────── */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase">
              Showing {showingFrom}–{showingTo} of {sorted.length} leads
            </p>
            <div className="flex items-center gap-3">
              {stormContactedCount > 0 && (
                <span className="text-[9px] tracking-[0.2em] text-[#22C55E]/60 uppercase">
                  {stormContactedCount} contacted
                </span>
              )}
              <button
                onClick={() => setHideContacted((v) => !v)}
                className={`text-[9px] tracking-[0.2em] uppercase font-mono border px-3 py-1 transition-colors ${
                  hideContacted
                    ? "border-[#FF6B00]/60 text-[#FF6B00]/80 bg-[#FF6B00]/5"
                    : "border-[#F5F0E8]/15 text-[#F5F0E8]/30 hover:border-[#F5F0E8]/30"
                }`}
              >
                {hideContacted ? "Showing uncontacted" : "Hide contacted"}
              </button>
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────────────────── */}
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
                      Score
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Type
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Map
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Contacted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((lead, i) => {
                    const cfg        = SCORE_CONFIG[lead.lead_score] ?? SCORE_CONFIG.warm;
                    const isNew      = isNewThisWeek(lead.event_date);
                    const isContacted = contactedIds.has(lead.id);
                    const mapUrl     = `https://maps.google.com/?q=${encodeURIComponent(
                      `${lead.county} ${lead.state ?? ""}`
                    )}`;
                    return (
                      <tr
                        key={lead.id}
                        className={`border-b border-[#FF6B00]/10 transition-colors ${
                          isContacted
                            ? "opacity-40"
                            : i % 2 === 0
                            ? "bg-transparent hover:bg-[#FF6B00]/5"
                            : "bg-[#F5F0E8]/[0.02] hover:bg-[#FF6B00]/5"
                        }`}
                      >
                        <td className="px-5 py-3 text-[#F5F0E8]/80 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            {lead.county}
                            {isNew && (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[8px] tracking-widest uppercase font-bold rounded-full bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40">
                                NEW
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#F5F0E8]/50 whitespace-nowrap">
                          {lead.state ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap">
                          {formatDate(lead.event_date)}
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
                        <td className="px-5 py-3 whitespace-nowrap">
                          {isContacted ? (
                            <span className="text-[#22C55E] text-sm">✓</span>
                          ) : (
                            <button
                              onClick={() => markContacted(lead.id)}
                              disabled={contactingId === lead.id}
                              className="text-[9px] tracking-widest uppercase font-mono text-[#F5F0E8]/25 border border-[#F5F0E8]/10 px-2 py-1 hover:border-[#22C55E]/40 hover:text-[#22C55E]/70 transition-colors disabled:opacity-30"
                            >
                              {contactingId === lead.id ? "…" : "Mark"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ─────────────────────────────────────────────── */}
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

          {/* ── Bottom bar ─────────────────────────────────────────────── */}
          <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase text-right">
            New leads drop every Monday — email notification when your list updates
          </p>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PROPERTY RECORDS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "property" && (
        <>
          {/* ── Stat cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Properties" value={totalPropertyCount} subtitle="property records"   />
            <StatCard label="Avg Year Built"   value={avgYearBuilt}      subtitle="median build year"  accent="#FF6B00" />
            <StatCard label="Pre-1990 Roofs"   value={pre1990Count}      subtitle="highest priority"   accent="#FF6B00" />
            <StatCard label="County Coverage"  value={distinctCountyCount} subtitle="counties tracked"   />
          </div>

          {/* ── Search + export ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between">
            <div>
              <label className="block text-[9px] tracking-[0.2em] text-[#FF6B00]/60 uppercase mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search address or owner name..."
                value={propSearch}
                onChange={(e) => { setPropSearch(e.target.value); setPropPage(1); }}
                className="w-full sm:w-80 bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 placeholder:text-[#F5F0E8]/20 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={() => exportPropertyCsv(filteredProps)}
                className="border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
              >
                Download CSV
              </button>
              <button
                onClick={openCanvass}
                className="border border-[#F5F0E8]/30 text-[#F5F0E8]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
              >
                Print Canvassing Sheet
              </button>
            </div>
          </div>

          {/* ── Showing count + hide contacted toggle ──────────────────── */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase">
              Showing {propShowingFrom}–{propShowingTo} of {filteredProps.length} properties
            </p>
            <div className="flex items-center gap-3">
              {propContactedCount > 0 && (
                <span className="text-[9px] tracking-[0.2em] text-[#22C55E]/60 uppercase">
                  {propContactedCount} contacted
                </span>
              )}
              <button
                onClick={() => setPropHideContacted((v) => !v)}
                className={`text-[9px] tracking-[0.2em] uppercase font-mono border px-3 py-1 transition-colors ${
                  propHideContacted
                    ? "border-[#FF6B00]/60 text-[#FF6B00]/80 bg-[#FF6B00]/5"
                    : "border-[#F5F0E8]/15 text-[#F5F0E8]/30 hover:border-[#F5F0E8]/30"
                }`}
              >
                {propHideContacted ? "Showing uncontacted" : "Hide contacted"}
              </button>
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────────────────── */}
          {filteredProps.length === 0 ? (
            <div className="border border-[#FF6B00]/20 px-6 py-12 text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#F5F0E8]/30 uppercase">
                No properties match the current search
              </p>
            </div>
          ) : (
            <div className="border border-[#FF6B00]/20 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#FF6B00]/20">
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Address
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Owner Name
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Mailing Address
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Year Built
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Map
                    </th>
                    <th className="text-left text-[9px] tracking-[0.25em] text-[#FF6B00]/60 uppercase px-5 py-3 whitespace-nowrap font-normal">
                      Contacted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProps.map((prop, i) => {
                    const isOld       = prop.year_built !== null && prop.year_built < 1990;
                    const isContacted = contactedIds.has(prop.id);
                    const mapUrl      = `https://maps.google.com/?q=${encodeURIComponent(
                      `${prop.address ?? ""} ${prop.county} ${prop.state ?? ""}`
                    )}`;
                    return (
                      <tr
                        key={prop.id}
                        className={`border-b border-[#FF6B00]/10 transition-colors ${
                          isContacted
                            ? "opacity-40"
                            : i % 2 === 0
                            ? "bg-transparent hover:bg-[#FF6B00]/5"
                            : "bg-[#F5F0E8]/[0.02] hover:bg-[#FF6B00]/5"
                        }`}
                      >
                        <td className="px-5 py-3 text-[#F5F0E8]/80 max-w-[200px] truncate">
                          {prop.address ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-[#F5F0E8]/60 whitespace-nowrap max-w-[160px] truncate">
                          {prop.owner_name ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-[#F5F0E8]/40 max-w-[200px] truncate">
                          {prop.owner_mailing_address ?? "—"}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap tabular-nums">
                          <span style={{ color: isOld ? "#FF6B00" : "rgba(245,240,232,0.6)" }}>
                            {prop.year_built ?? "—"}
                          </span>
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
                        <td className="px-5 py-3 whitespace-nowrap">
                          {isContacted ? (
                            <span className="text-[#22C55E] text-sm">✓</span>
                          ) : (
                            <button
                              onClick={() => markContacted(prop.id)}
                              disabled={contactingId === prop.id}
                              className="text-[9px] tracking-widest uppercase font-mono text-[#F5F0E8]/25 border border-[#F5F0E8]/10 px-2 py-1 hover:border-[#22C55E]/40 hover:text-[#22C55E]/70 transition-colors disabled:opacity-30"
                            >
                              {contactingId === prop.id ? "…" : "Mark"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ─────────────────────────────────────────────── */}
          {propTotalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPropPage((p) => Math.max(1, p - 1))}
                disabled={safePropPage === 1}
                className="border border-[#FF6B00]/30 text-[#FF6B00]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <p className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase">
                Page {safePropPage} of {propTotalPages}
              </p>
              <button
                onClick={() => setPropPage((p) => Math.min(propTotalPages, p + 1))}
                disabled={safePropPage === propTotalPages}
                className="border border-[#FF6B00]/30 text-[#FF6B00]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase text-right">
            Franklin County parcel data — sourced from county assessor
          </p>
        </>
      )}

    </div>
  );
}
