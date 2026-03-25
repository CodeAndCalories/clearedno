// Dashboard — protected route (middleware redirects unauthenticated users)
// Server Component: fetches permits + profile from Supabase on the server.
// For active subscribers, also fetches next billing date from Stripe.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import type { Permit, PermitStatus, Profile } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Days remaining until a target date. Returns 0 if already past. */
function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Status badge ──────────────────────────────────────────────────────────────

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
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ── Permit card ───────────────────────────────────────────────────────────────

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
    <div className="border border-[#FF6B00]/20 bg-[#0A0A0A] hover:border-[#FF6B00]/50 transition-colors">
      <div className="h-0.5 w-full" style={{ backgroundColor: STATUS_CONFIG[permit.status]?.color ?? "#6B7280" }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-xs text-[#F5F0E8]/40 tracking-widest uppercase mb-1">Permit #</div>
            <div className="font-mono text-[#F5F0E8] font-medium">{permit.permit_number}</div>
          </div>
          <StatusBadge status={permit.status} />
        </div>
        <div className="text-sm text-[#F5F0E8]/70 mb-1">{permit.address}</div>
        <div className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest">
          {permit.city}, {permit.state}
        </div>
        <div className="mt-4 pt-4 border-t border-[#FF6B00]/10 flex items-center justify-between">
          <div className="text-[10px] text-[#F5F0E8]/30 tracking-widest">Checked {lastChecked}</div>
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

// ── Empty state ───────────────────────────────────────────────────────────────

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile and permits in parallel
  const [profileResult, permitsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("permits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileResult.data as Profile | null;
  const permits = (permitsResult.data ?? []) as Permit[];

  const isPaid = profile?.subscription_status === "active";
  const isTrialing = profile?.subscription_status === "trialing";

  // For active subscribers: fetch next billing date from Stripe's current_period_end.
  // Kept outside the JSX so the server component can await it cleanly.
  let nextBillingDate: string | null = null;
  if (isPaid && profile?.stripe_subscription_id) {
    try {
      const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      nextBillingDate = new Date(sub.current_period_end * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      // Non-fatal — just won't show the billing date
    }
  }

  // Trial days remaining (may be 0 if expired)
  const trialDaysLeft =
    isTrialing && profile?.trial_ends_at ? daysUntil(profile.trial_ends_at) : 0;

  // Permit status counts for the summary strip
  const counts = permits.reduce(
    (acc, p) => { acc[p.status] = (acc[p.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  // Display name shown in the nav
  const displayName = profile?.company_name ?? user.email ?? "";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10 flex-shrink-0">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>

        <div className="flex items-center gap-5">
          {/* User identity + active badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#F5F0E8]/40 font-mono">{displayName}</span>
            {isPaid && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-[#16A34A] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                Active
              </span>
            )}
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">

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

        {/* ── Status summary strip ─────────────────────────────────── */}
        {permits.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[#FF6B00]/20 mb-8">
            {(["PENDING", "APPROVED", "CLEARED", "REJECTED"] as PermitStatus[]).map((s, i) => (
              <div key={s} className={`px-6 py-4 ${i < 3 ? "border-r border-[#FF6B00]/20" : ""}`}>
                <div className="font-heading text-3xl mb-0.5" style={{ color: STATUS_CONFIG[s].color }}>
                  {counts[s] ?? 0}
                </div>
                <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase">{s}</div>
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

        {/* ── Trial banner (trialing only) ─────────────────────────── */}
        {isTrialing && profile?.trial_ends_at && (
          <div className="mt-10 border border-[#FF6B00]/40 bg-[#FF6B00]/5 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* Days remaining — the number is the headline */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-3xl text-[#FF6B00]">
                  {trialDaysLeft}
                </span>
                <span className="text-xs font-mono text-[#FF6B00] uppercase tracking-widest">
                  {trialDaysLeft === 1 ? "day" : "days"} left in your free trial
                </span>
              </div>
              <div className="text-xs text-[#F5F0E8]/40 font-mono">
                Trial ends{" "}
                {new Date(profile.trial_ends_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
                . After that, monitoring pauses until you subscribe.
              </div>
            </div>
            <form action="/api/stripe/checkout" method="post" className="flex-shrink-0">
              <button
                type="submit"
                className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
              >
                Upgrade — $79/mo →
              </button>
            </form>
          </div>
        )}

        {/* ── Past due banner ──────────────────────────────────────── */}
        {profile?.subscription_status === "past_due" && (
          <div className="mt-10 border border-[#DC2626]/40 bg-[#DC2626]/5 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#DC2626] uppercase tracking-widest font-medium mb-1">
                Payment Failed
              </div>
              <div className="text-xs text-[#F5F0E8]/50">
                Your last payment didn&apos;t go through. Update your billing details to keep monitoring active.
              </div>
            </div>
            <a
              href="https://billing.stripe.com/p/login/live_00g"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#DC2626] text-[#F5F0E8] font-mono text-xs font-medium tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
            >
              Update Payment →
            </a>
          </div>
        )}

        {/* ── Canceled banner ──────────────────────────────────────── */}
        {profile?.subscription_status === "canceled" && (
          <div className="mt-10 border border-[#6B7280]/30 bg-[#6B7280]/5 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#6B7280] uppercase tracking-widest font-medium mb-1">
                Subscription Canceled
              </div>
              <div className="text-xs text-[#F5F0E8]/40">
                Permit monitoring is paused. Resubscribe to resume.
              </div>
            </div>
            <form action="/api/stripe/checkout" method="post" className="flex-shrink-0">
              <button
                type="submit"
                className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
              >
                Resubscribe — $79/mo →
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      {/* Only shown for active subscribers. Clean, no upsell. */}
      {isPaid && (
        <footer className="border-t border-[#FF6B00]/10 px-6 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* Left: monitoring status + next billing date */}
            <div className="flex items-center gap-5">
              <span className="text-[10px] text-[#F5F0E8]/20 tracking-widest uppercase font-mono">
                Monitoring active
              </span>
              {nextBillingDate && (
                <span className="text-[10px] text-[#F5F0E8]/25 tracking-widest font-mono">
                  Next billing date: {nextBillingDate}
                </span>
              )}
            </div>

            {/* Right: manage subscription — links to Stripe customer portal */}
            {process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL && (
              <a
                href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
              >
                Manage Subscription
              </a>
            )}
          </div>
        </footer>
      )}

    </div>
  );
}
