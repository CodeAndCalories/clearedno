// Dashboard — protected route (middleware redirects unauthenticated users)
// Server Component: fetches permits from Supabase on the server.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Permit, PermitStatus } from "@/types";

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PermitStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING:  { label: "PENDING",  color: "#6B7280", bg: "rgba(107,114,128,0.12)", dot: "#6B7280" },
  APPROVED: { label: "APPROVED", color: "#FF6B00", bg: "rgba(255,107,0,0.12)",   dot: "#FF6B00" },
  CLEARED:  { label: "CLEARED",  color: "#16A34A", bg: "rgba(22,163,74,0.12)",   dot: "#16A34A" },
  REJECTED: { label: "REJECTED", color: "#DC2626", bg: "rgba(220,38,38,0.12)",   dot: "#DC2626" },
  UNKNOWN:  { label: "UNKNOWN",  color: "#6B7280", bg: "rgba(107,114,128,0.12)", dot: "#6B7280" },
};

function StatusBadge({ status }: { status: PermitStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.UNKNOWN;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium tracking-widest uppercase"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}

// ── Permit card ──────────────────────────────────────────────────────────────

function PermitCard({ permit }: { permit: Permit }) {
  const lastChecked = permit.last_checked
    ? new Date(permit.last_checked).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Not yet checked";

  return (
    <div className="border border-[#FF6B00]/20 bg-[#0A0A0A] hover:border-[#FF6B00]/50 transition-colors group">
      {/* Status stripe at top */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: STATUS_CONFIG[permit.status]?.color ?? "#6B7280" }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-xs text-[#F5F0E8]/40 tracking-widest uppercase mb-1">
              Permit #
            </div>
            <div className="font-mono text-[#F5F0E8] font-medium">{permit.permit_number}</div>
          </div>
          <StatusBadge status={permit.status} />
        </div>

        <div className="text-sm text-[#F5F0E8]/70 mb-1">{permit.address}</div>
        <div className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest">
          {permit.city}, {permit.state}
        </div>

        <div className="mt-4 pt-4 border-t border-[#FF6B00]/10 flex items-center justify-between">
          <div className="text-[10px] text-[#F5F0E8]/30 tracking-widest">
            Checked {lastChecked}
          </div>
          <Link
            href={`/dashboard/permits/${permit.id}`}
            className="text-[10px] text-[#FF6B00]/60 hover:text-[#FF6B00] tracking-widest uppercase transition-colors"
          >
            History →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="border border-[#FF6B00]/20 border-dashed p-16 text-center">
      <div className="font-heading text-5xl text-[#FF6B00]/30 mb-4">NO PERMITS YET</div>
      <p className="text-sm text-[#F5F0E8]/40 mb-8 max-w-sm mx-auto leading-relaxed">
        Add your first permit and we&apos;ll start watching it immediately.
      </p>
      <Link
        href="/dashboard/add"
        className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors inline-flex items-center gap-2"
      >
        + Add First Permit
      </Link>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile and permits in parallel
  const [profileResult, permitsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("permits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileResult.data;
  const permits = (permitsResult.data ?? []) as Permit[];

  // Status counts for the summary row
  const counts = permits.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="text-xs text-[#F5F0E8]/40 font-mono">
            {profile?.company_name ?? user.email}
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-[10px] tracking-widest text-[#F5F0E8]/30 hover:text-[#FF6B00] uppercase transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
                Permit Status Board
              </span>
            </div>
            <h1 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">
              YOUR PERMITS
            </h1>
          </div>
          <Link
            href="/dashboard/add"
            className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            + Add Permit
          </Link>
        </div>

        {/* ── Summary strip ────────────────────────────────────────── */}
        {permits.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[#FF6B00]/20 mb-8">
            {(["PENDING", "APPROVED", "CLEARED", "REJECTED"] as PermitStatus[]).map((s, i) => (
              <div
                key={s}
                className={`px-6 py-4 ${i < 3 ? "border-r border-[#FF6B00]/20" : ""}`}
              >
                <div
                  className="font-heading text-3xl mb-0.5"
                  style={{ color: STATUS_CONFIG[s].color }}
                >
                  {counts[s] ?? 0}
                </div>
                <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase">
                  {s}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Permit grid ──────────────────────────────────────────── */}
        {permits.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {permits.map((permit) => (
              <PermitCard key={permit.id} permit={permit} />
            ))}
          </div>
        )}

        {/* ── Subscription status banner ───────────────────────────── */}
        {/* ACTIVE — clean confirmation, no upsell needed */}
        {profile?.subscription_status === "active" && (
          <div className="mt-10 border border-[#16A34A]/40 bg-[#16A34A]/5 px-6 py-4 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0" />
            <div>
              <div className="text-xs font-mono text-[#16A34A] uppercase tracking-widest font-medium mb-0.5">
                Subscription Active
              </div>
              <div className="text-xs text-[#F5F0E8]/50">
                Your permits are being monitored 24/7. You&apos;ll be alerted the moment anything changes.
              </div>
            </div>
          </div>
        )}

        {/* TRIALING — show trial end date + upgrade CTA */}
        {profile?.subscription_status === "trialing" && profile.trial_ends_at && (
          <div className="mt-10 border border-[#FF6B00]/40 bg-[#FF6B00]/5 px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#FF6B00] uppercase tracking-widest font-medium mb-0.5">
                Free Trial Active
              </div>
              <div className="text-xs text-[#F5F0E8]/50">
                Trial ends{" "}
                {new Date(profile.trial_ends_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
                . Upgrade to keep your permits monitored.
              </div>
            </div>
            <form action="/api/stripe/checkout" method="post">
              <button
                type="submit"
                className="flex-shrink-0 bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-medium tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
              >
                Upgrade — $79/mo →
              </button>
            </form>
          </div>
        )}

        {/* PAST DUE — payment failed, needs action */}
        {profile?.subscription_status === "past_due" && (
          <div className="mt-10 border border-[#DC2626]/40 bg-[#DC2626]/5 px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#DC2626] uppercase tracking-widest font-medium mb-0.5">
                Payment Failed
              </div>
              <div className="text-xs text-[#F5F0E8]/50">
                Your last payment didn&apos;t go through. Update your billing details to keep monitoring active.
              </div>
            </div>
            <a
              href="https://billing.stripe.com/p/login/test_00g"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#DC2626] text-[#F5F0E8] font-mono text-xs font-medium tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#0A0A0A] transition-colors"
            >
              Update Payment →
            </a>
          </div>
        )}

        {/* CANCELED — subscription ended */}
        {profile?.subscription_status === "canceled" && (
          <div className="mt-10 border border-[#6B7280]/40 bg-[#6B7280]/5 px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#6B7280] uppercase tracking-widest font-medium mb-0.5">
                Subscription Canceled
              </div>
              <div className="text-xs text-[#F5F0E8]/50">
                Permit monitoring is paused. Resubscribe to start watching your permits again.
              </div>
            </div>
            <form action="/api/stripe/checkout" method="post">
              <button
                type="submit"
                className="flex-shrink-0 bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-medium tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
              >
                Resubscribe — $79/mo →
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
