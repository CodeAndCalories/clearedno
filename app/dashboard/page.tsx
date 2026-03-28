// Dashboard — protected route (middleware redirects unauthenticated users)
// Server Component: fetches permits + profile from Supabase on the server.
// For active subscribers, also fetches next billing date from Stripe.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import type { Permit, PermitStatus, Profile } from "@/types";
import { PermitCard } from "./permit-card";
import { ReferralSection } from "./referral-section";
import { PushToggle } from "./push-toggle";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Days remaining until a target date. Returns 0 if already past. */
function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  const cities = [
    { name: "Austin, TX",  status: "live" },
    { name: "Dallas, TX",  status: "live" },
    { name: "Houston, TX", status: "live" },
    { name: "San Antonio, TX", status: "coming" },
    { name: "Phoenix, AZ", status: "coming" },
    { name: "Denver, CO",  status: "coming" },
  ];

  return (
    <div className="border border-[#FF6B00]/20 border-dashed p-10 sm:p-16 text-center">
      <div className="font-heading text-4xl sm:text-5xl text-[#FF6B00]/30 mb-4">
        NO PERMITS YET
      </div>
      <p className="text-sm text-[#F5F0E8]/40 mb-8 max-w-sm mx-auto leading-relaxed">
        Add your first permit and we&apos;ll start watching it immediately.
      </p>
      <p className="text-xs text-[#FF6B00]/60 font-mono mb-8 tracking-widest uppercase">
        Currently monitoring: Austin TX · Dallas TX
      </p>
      <Link
        href="/dashboard/add"
        className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        + Add First Permit
      </Link>

      {/* Supported cities */}
      <div className="mt-12 border-t border-[#FF6B00]/10 pt-8">
        <div className="text-[10px] tracking-[0.3em] text-[#FF6B00]/50 uppercase mb-4">
          Cities We Monitor
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((c) => (
            <span
              key={c.name}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border ${
                c.status === "live"
                  ? "border-[#16A34A]/30 text-[#16A34A]/70"
                  : "border-[#F5F0E8]/10 text-[#F5F0E8]/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  c.status === "live" ? "bg-[#16A34A]" : "bg-[#F5F0E8]/20"
                }`}
              />
              {c.name}
              {c.status === "coming" && (
                <span className="text-[#F5F0E8]/20"> soon</span>
              )}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-[#F5F0E8]/20 tracking-widest uppercase">
          More cities added weekly
        </p>
        <div className="mt-5">
          <Link
            href="/suggest-city"
            className="text-[10px] tracking-widest text-[#FF6B00]/60 uppercase hover:text-[#FF6B00] transition-colors"
          >
            Don&apos;t see your city? Request it →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Status config (for the summary strip) ────────────────────────────────────

const STATUS_CONFIG: Record<PermitStatus, { color: string }> = {
  PENDING:      { color: "#6B7280" },
  APPROVED:     { color: "#FF6B00" },
  CLEARED:      { color: "#16A34A" },
  REJECTED:     { color: "#DC2626" },
  UNDER_REVIEW: { color: "#EAB308" },
  EXPIRED:      { color: "#6B7280" },
  UNKNOWN:      { color: "#6B7280" },
};

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

  const isPaid     = profile?.subscription_status === "active";
  const isTrialing = profile?.subscription_status === "trialing";

  // For active subscribers: fetch next billing date from Stripe's current_period_end.
  let nextBillingDate: string | null = null;
  if (isPaid && profile?.stripe_subscription_id) {
    try {
      const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      nextBillingDate = new Date(sub.current_period_end * 1000).toLocaleDateString("en-US", {
        month: "long",
        day:   "numeric",
        year:  "numeric",
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

  // ── Referral + push data (server-fetched) ────────────────────────────────
  // Count completed referrals and fetch existing referral code + push sub.
  let referralCount = 0;
  let existingReferralCode: string | undefined;
  let hasPushSub = false;

  if (profile?.id) {
    const [referralResult, profileExtraResult] = await Promise.all([
      supabaseAdmin
        .from("referrals")
        .select("id", { count: "exact" })
        .eq("referrer_user_id", profile.id)
        .eq("status", "completed"),
      supabaseAdmin
        .from("profiles")
        .select("referral_code, push_subscription")
        .eq("id", profile.id)
        .single(),
    ]);
    referralCount        = referralResult.count ?? 0;
    existingReferralCode = profileExtraResult.data?.referral_code ?? undefined;
    hasPushSub           = !!profileExtraResult.data?.push_subscription;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header className="border-b border-[#FF6B00]/20 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10 flex-shrink-0">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* User identity + active badge */}
          <div className="hidden sm:flex items-center gap-2">
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
              className="border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-3 sm:px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">

        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
                Permit Status Board
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8]">
              YOUR PERMITS
            </h1>
          </div>
          <Link
            href="/dashboard/add"
            className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs sm:text-sm font-medium tracking-widest uppercase px-4 sm:px-6 py-3 hover:bg-[#F5F0E8] transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            + Add Permit
          </Link>
        </div>

        {/* ── Status summary strip ─────────────────────────────────── */}
        {permits.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[#FF6B00]/20 mb-6 sm:mb-8">
            {(["PENDING", "APPROVED", "CLEARED", "REJECTED"] as PermitStatus[]).map((s, i) => (
              <div
                key={s}
                className={`px-4 sm:px-6 py-4 ${
                  i < 3
                    ? i === 1
                      ? "border-r border-[#FF6B00]/20 sm:border-r border-t sm:border-t-0 border-[#FF6B00]/20"
                      : "border-r border-[#FF6B00]/20"
                    : "border-t sm:border-t-0 border-[#FF6B00]/20"
                }`}
              >
                <div
                  className="font-heading text-3xl mb-0.5"
                  style={{ color: STATUS_CONFIG[s].color }}
                >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {permits.map((permit) => (
              <PermitCard key={permit.id} permit={permit} />
            ))}
          </div>
        )}

        {/* ── Trial banner (trialing only) ─────────────────────────── */}
        {isTrialing && profile?.trial_ends_at && (
          <div className="mt-8 sm:mt-10 border border-[#FF6B00]/40 bg-[#FF6B00]/5 px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
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
                  day:   "numeric",
                })}
                . After that, monitoring pauses until you subscribe.
              </div>
            </div>
            <form action="/api/stripe/checkout" method="post" className="flex-shrink-0">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
              >
                Upgrade — $79/mo →
              </button>
            </form>
          </div>
        )}

        {/* ── Past due banner ──────────────────────────────────────── */}
        {profile?.subscription_status === "past_due" && (
          <div className="mt-8 sm:mt-10 border border-[#DC2626]/40 bg-[#DC2626]/5 px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              className="flex-shrink-0 bg-[#DC2626] text-[#F5F0E8] font-mono text-xs font-medium tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] hover:text-[#0A0A0A] transition-colors whitespace-nowrap text-center"
            >
              Update Payment →
            </a>
          </div>
        )}

        {/* ── Canceled banner ──────────────────────────────────────── */}
        {profile?.subscription_status === "canceled" && (
          <div className="mt-8 sm:mt-10 border border-[#6B7280]/30 bg-[#6B7280]/5 px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                className="w-full sm:w-auto bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
              >
                Resubscribe — $79/mo →
              </button>
            </form>
          </div>
        )}

        {/* ── Referral section ─────────────────────────────────────── */}
        <ReferralSection
          referralCount={referralCount}
          existingCode={existingReferralCode}
        />

        {/* ── Settings: push notifications ─────────────────────────── */}
        <div className="mt-6 border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-4 sm:px-6 py-5">
          <div className="text-[10px] tracking-[0.3em] text-[#FF6B00]/40 uppercase mb-4">
            Notification Settings
          </div>
          <PushToggle hasExistingSubscription={hasPushSub} />
        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      {isPaid && (
        <footer className="border-t border-[#FF6B00]/10 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Left: monitoring status + next billing date */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
              <span className="text-[10px] text-[#F5F0E8]/20 tracking-widest uppercase font-mono">
                Monitoring active
              </span>
              {nextBillingDate && (
                <span className="text-[10px] text-[#F5F0E8]/25 tracking-widest font-mono">
                  Next billing: {nextBillingDate}
                </span>
              )}
            </div>

            {/* Right: manage subscription */}
            <a
              href="/api/stripe/portal"
              className="border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
            >
              Manage Subscription
            </a>
          </div>
        </footer>
      )}

    </div>
  );
}
