"use client";

// PermitCard — client component that wraps each permit on the dashboard.
//
// Adds interactive features that can't be done in a Server Component:
//   • Delete button with inline confirmation (no modal, no navigation)
//   • "HISTORY →" opens a slide-in timeline modal showing all status changes
//
// Props are all serializable (no functions) so this can be imported from a
// Server Component and receive its data via RSC prop-passing.

import { useState, useTransition } from "react";
import type { Permit, PermitStatus, StatusHistoryEntry } from "@/types";
import { deletePermit } from "./actions";

// ── Status config (copied from dashboard to keep this component self-contained)

const STATUS_CONFIG: Record<
  PermitStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING:      { label: "PENDING",      color: "#6B7280", bg: "rgba(107,114,128,0.12)", dot: "#6B7280" },
  APPROVED:     { label: "APPROVED",     color: "#FF6B00", bg: "rgba(255,107,0,0.12)",   dot: "#FF6B00" },
  CLEARED:      { label: "CLEARED",      color: "#16A34A", bg: "rgba(22,163,74,0.12)",   dot: "#16A34A" },
  REJECTED:     { label: "REJECTED",     color: "#DC2626", bg: "rgba(220,38,38,0.12)",   dot: "#DC2626" },
  UNDER_REVIEW: { label: "UNDER REVIEW", color: "#EAB308", bg: "rgba(234,179,8,0.12)",   dot: "#EAB308" },
  EXPIRED:      { label: "EXPIRED",      color: "#6B7280", bg: "rgba(107,114,128,0.08)", dot: "#6B7280" },
  UNKNOWN:      { label: "UNKNOWN",      color: "#6B7280", bg: "rgba(107,114,128,0.12)", dot: "#6B7280" },
};

function StatusBadge({ status }: { status: PermitStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.UNKNOWN;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium tracking-widest uppercase"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ── History Modal ─────────────────────────────────────────────────────────────

function HistoryModal({
  permit,
  onClose,
}: {
  permit: Permit;
  onClose: () => void;
}) {
  const history: StatusHistoryEntry[] = permit.status_history ?? [];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#FF6B00]/30 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#FF6B00]/20 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-0.5">
              Status History
            </div>
            <div className="font-mono text-sm text-[#F5F0E8]">{permit.permit_number}</div>
            <div className="text-[10px] text-[#F5F0E8]/40 mt-0.5">{permit.address}</div>
          </div>
          <button
            onClick={onClose}
            className="text-[#F5F0E8]/30 hover:text-[#FF6B00] transition-colors font-mono text-sm ml-4"
            aria-label="Close history"
          >
            ✕
          </button>
        </div>

        {/* Timeline */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {history.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-[#F5F0E8]/20 text-xs tracking-widest uppercase font-mono">
                No history recorded yet
              </div>
              <p className="text-[10px] text-[#F5F0E8]/20 mt-2">
                Status changes will appear here after the first scraper run.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {[...history].reverse().map((entry, idx) => {
                const cfg = STATUS_CONFIG[entry.status as PermitStatus] ?? STATUS_CONFIG.UNKNOWN;
                const isLatest = idx === 0;
                const ts = new Date(entry.timestamp);
                const dateStr = ts.toLocaleDateString("en-US", {
                  month: "short",
                  day:   "numeric",
                  year:  "numeric",
                });
                const timeStr = ts.toLocaleTimeString("en-US", {
                  hour:   "numeric",
                  minute: "2-digit",
                });

                return (
                  <div key={entry.timestamp} className="flex gap-4">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: isLatest ? cfg.dot : "#374151" }}
                      />
                      {idx < history.length - 1 && (
                        <div className="w-px flex-1 bg-[#FF6B00]/10 mt-1 mb-0 min-h-[24px]" />
                      )}
                    </div>

                    {/* Entry content */}
                    <div className="pb-5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-xs font-mono font-semibold tracking-widest uppercase"
                          style={{ color: isLatest ? cfg.color : "#6B7280" }}
                        >
                          {entry.status.replace("_", " ")}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-mono text-[#FF6B00] tracking-widest">
                            (current)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#F5F0E8]/30 tracking-widest">
                        {dateStr} at {timeStr}
                      </div>
                      {entry.raw && entry.raw !== "manual check required" && (
                        <div className="mt-1 text-[10px] text-[#F5F0E8]/20 font-mono truncate">
                          Raw: {entry.raw}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#FF6B00]/10 px-6 py-3 flex-shrink-0">
          <div className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
            {history.length} status {history.length === 1 ? "change" : "changes"} recorded
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main PermitCard ────────────────────────────────────────────────────────────

export function PermitCard({ permit }: { permit: Permit }) {
  const [showHistory, setShowHistory]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition]      = useTransition();

  const lastChecked = permit.last_checked
    ? new Date(permit.last_checked).toLocaleString("en-US", {
        month:  "short",
        day:    "numeric",
        hour:   "numeric",
        minute: "2-digit",
      })
    : "Not yet checked";

  function handleDelete() {
    startTransition(async () => {
      await deletePermit(permit.id);
      // Server action revalidates the dashboard path — card will disappear
    });
  }

  return (
    <>
      {/* Card */}
      <div
        className={`border border-[#FF6B00]/20 bg-[#0A0A0A] hover:border-[#FF6B00]/50 transition-colors ${
          isPending ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Status color bar at top */}
        <div
          className="h-0.5 w-full"
          style={{ backgroundColor: STATUS_CONFIG[permit.status]?.color ?? "#6B7280" }}
        />

        <div className="p-5">
          {/* Header row: permit # + status badge */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="text-xs text-[#F5F0E8]/40 tracking-widest uppercase mb-1">
                Permit #
              </div>
              <div className="font-mono text-[#F5F0E8] font-medium">{permit.permit_number}</div>
            </div>
            <StatusBadge status={permit.status} />
          </div>

          {/* Address + city */}
          <div className="text-sm text-[#F5F0E8]/70 mb-1">{permit.address}</div>
          <div className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest">
            {permit.city}, {permit.state}
          </div>

          {/* Footer row: last checked + actions */}
          <div className="mt-4 pt-4 border-t border-[#FF6B00]/10 flex items-center justify-between gap-2">
            <div className="text-[10px] text-[#F5F0E8]/30 tracking-widest">
              Checked {lastChecked}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="text-[10px] text-[#FF6B00]/60 hover:text-[#FF6B00] tracking-widest uppercase transition-colors"
              >
                History →
              </button>

              {/* Delete — shows confirmation inline */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-[10px] text-[#F5F0E8]/20 hover:text-[#DC2626] tracking-widest uppercase transition-colors"
                  aria-label="Delete permit"
                >
                  Delete
                </button>
              ) : (
                <span className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="text-[10px] text-[#DC2626] tracking-widest uppercase hover:underline"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-[10px] text-[#F5F0E8]/30 tracking-widest uppercase hover:text-[#F5F0E8] transition-colors"
                  >
                    Cancel
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Modal — rendered in a portal-like manner via conditional */}
      {showHistory && (
        <HistoryModal
          permit={permit}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
