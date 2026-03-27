// Status history page for a single permit.
// Shows a timeline of all status changes from status_history JSONB.
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Permit, PermitStatus, StatusHistoryEntry } from "@/types";

const STATUS_CONFIG: Record<PermitStatus, { label: string; color: string; bg: string }> = {
  PENDING:      { label: "PENDING",      color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
  APPROVED:     { label: "APPROVED",     color: "#FF6B00", bg: "rgba(255,107,0,0.12)" },
  CLEARED:      { label: "CLEARED",      color: "#16A34A", bg: "rgba(22,163,74,0.12)" },
  REJECTED:     { label: "REJECTED",     color: "#DC2626", bg: "rgba(220,38,38,0.12)" },
  UNDER_REVIEW: { label: "UNDER REVIEW", color: "#EAB308", bg: "rgba(234,179,8,0.12)" },
  EXPIRED:      { label: "EXPIRED",      color: "#6B7280", bg: "rgba(107,114,128,0.08)" },
  UNKNOWN:      { label: "UNKNOWN",      color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
};

function StatusBadge({ status }: { status: PermitStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.UNKNOWN;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium tracking-widest uppercase"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export default async function PermitHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: permit } = await supabase
    .from("permits")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!permit) notFound();

  const p = permit as Permit;
  const history: StatusHistoryEntry[] = (p.status_history ?? []).slice().reverse();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00] flex-shrink-0">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
        <span className="ml-4 text-[#F5F0E8]/20">/</span>
        <Link href="/dashboard" className="ml-4 text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors tracking-widest uppercase flex-shrink-0">
          Dashboard
        </Link>
        <span className="ml-4 text-[#F5F0E8]/20">/</span>
        <span className="ml-4 text-xs text-[#FF6B00] tracking-widest uppercase truncate">
          {p.permit_number}
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Status History</span>
          </div>
          <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8]">
            {p.permit_number}
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 mt-1">
            {p.address} · {p.city}, {p.state}
          </p>
        </div>

        {history.length === 0 ? (
          <div className="border border-[#FF6B00]/20 border-dashed p-12 text-center">
            <div className="text-[#F5F0E8]/30 font-mono text-sm mb-2">No status changes recorded yet.</div>
            <p className="text-xs text-[#F5F0E8]/20">
              The scraper updates every 2–4 hours. Check back soon.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#FF6B00]/15" />

            <div className="space-y-0">
              {history.map((entry, idx) => {
                const cfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.UNKNOWN;
                const date = new Date(entry.timestamp);
                return (
                  <div key={idx} className="relative flex gap-5 pb-8">
                    {/* Timeline dot */}
                    <div
                      className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: cfg.color, backgroundColor: "#0A0A0A" }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <StatusBadge status={entry.status} />
                        {idx === 0 && (
                          <span className="text-[10px] text-[#FF6B00] font-mono tracking-widest uppercase">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#F5F0E8]/40 font-mono">
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {date.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      {entry.raw && (
                        <div className="mt-1.5 text-[11px] text-[#F5F0E8]/25 font-mono italic">
                          Portal text: &ldquo;{entry.raw}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="text-xs text-[#FF6B00]/60 hover:text-[#FF6B00] font-mono tracking-widest uppercase transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
