// Dashboard — protected route (middleware redirects unauthenticated users)
// Server Component: fetches permits + profile from Supabase on the server.
// For active subscribers, also fetches next billing date from Stripe.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { cities as allCities, LIVE_CHECKER_CITIES } from "@/lib/cities";
import { getEntitlement, type Entitlement } from "@/lib/entitlements";
import type { Permit, PermitStatus, Profile } from "@/types";
import { PermitCard } from "./permit-card";
import { ReferralSection } from "./referral-section";
import { PushToggle } from "./push-toggle";
import { DigestToggle } from "./digest-toggle";
import CheckoutButton from "../checkout-button";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Days remaining until a target date. Returns 0 if already past. */
function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ entitlement }: { entitlement: Entitlement }) {
  // Derived from LIVE_CHECKER_CITIES so this panel can never again advertise a
  // city we don't actually monitor. It previously hardcoded Dallas and Houston
  // as "live" — neither had a working checker, and Houston has no public API at
  // all, so both were promises we couldn't keep.
  const cities = allCities.map((c) => ({
    name:   `${c.name}, ${c.stateAbbr}`,
    status: LIVE_CHECKER_CITIES.has(c.slug) ? "live" : "coming",
  }));

  const liveNames = cities
    .filter((c) => c.status === "live")
    .map((c) => c.name)
    .join(" · ");

  // Signup promises "1 permit free, forever"; without this the first screen
  // after signup never repeats it, and the cap only surfaces on /dashboard/add.
  // Counted from FREE_TIER_PERMIT_LIMIT via getEntitlement so the number here
  // can never drift from the number actually enforced.
  const allowance =
    entitlement.tier === "unlimited"
      ? "Unlimited plan — no cap on tracked permits."
      : entitlement.purchasedSlots > 0
        ? `Free tier + ${entitlement.purchasedSlots} slot${
            entitlement.purchasedSlots === 1 ? "" : "s"
          } — ${entitlement.limit} permits included.`
        : `Free tier — ${entitlement.limit} permit${
            entitlement.limit === 1 ? "" : "s"
          } included, no card.`;

  return (
    <div className="border border-[#FF6B00]/20 border-dashed p-10 sm:p-16 text-center">
      <div className="font-heading text-4xl sm:text-5xl text-[#FF6B00]/30 mb-3">
        NO PERMITS YET
      </div>
      <p className="text-[11px] text-[#FF6B00]/70 font-mono tracking-widest uppercase mb-5">
        {allowance}
      </p>
      <p className="text-sm text-[#F5F0E8]/40 mb-8 max-w-sm mx-auto leading-relaxed">
        Add your first permit and we&apos;ll start watching it immediately.
      </p>
      <p className="text-xs text-[#FF6B00]/60 font-mono mb-8 tracking-widest uppercase">
        Currently monitoring: {liveNames}
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
  UNDER_REVIEW:    { color: "#EAB308" },
  // Rose, not the yellow of UNDER_REVIEW and not the deep red of REJECTED:
  // urgent but recoverable — the applicant has to do something.
  ACTION_REQUIRED: { color: "#F43F5E" },
  EXPIRED:         { color: "#6B7280" },
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

  // Enforce trial expiration — expired trialing users see a dedicated upgrade page
  if (isTrialing && profile?.trial_ends_at) {
    const trialExpired = new Date(profile.trial_ends_at) < new Date();
    if (trialExpired) redirect("/trial-expired");
  }

  // Lapsed accounts are no longer redirected away. Cancelling drops a user to
  // the free tier — one permit plus any slots bought outright — and
  // scrapers/index.ts keeps checking their permits, since both statuses are in
  // ENTITLED_SUBSCRIPTION_STATUSES. Forcing them to /reactivate walled them out
  // of a tier the pricing page explicitly promises them, behind a page whose
  // only control was $79/mo. The banner below offers reactivation instead of
  // demanding it. /reactivate is kept as a route and still resolves, but
  // nothing links to it any more — the banner sends users straight to Stripe.
  const subStatus = profile?.subscription_status;
  const isLapsed  = subStatus === "canceled" || subStatus === "past_due";

  // Resolved only where the free allowance is actually reported: the empty
  // state names it, and the lapsed banner reports it against usage. Not worth
  // three extra queries on a subscriber's dashboard that has permits to render.
  const entitlement =
    permits.length === 0 || isLapsed ? await getEntitlement(user.id) : null;

  // What a lapsed user is told they still have. Over-allowance is stated
  // rather than hidden: the scraper filters on status, not count, so their
  // existing permits really do keep being checked — it is adding another that
  // the cap blocks.
  const lapsedMessage = (() => {
    if (!entitlement) return "";
    const allowed = `${entitlement.limit} permit${entitlement.limit === 1 ? "" : "s"}`;
    const slots =
      entitlement.purchasedSlots > 0
        ? ` — including the ${entitlement.purchasedSlots} slot${
            entitlement.purchasedSlots === 1 ? "" : "s"
          } you bought, which you keep`
        : "";
    const lead =
      subStatus === "past_due"
        ? "Your last payment didn't go through, so unlimited tracking has stopped."
        : "Unlimited tracking has ended.";

    return entitlement.used > entitlement.limit
      ? `${lead} Your ${entitlement.used} permits are still being checked every 2 hours, but the free tier covers ${allowed}${slots} — so you can't add another until you're back under that, or subscribed again. Nothing was deleted.`
      : `${lead} You're on the free tier: ${allowed}${slots}, still checked every 2 hours. Nothing was deleted.`;
  })();

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
  let digestOptedOut = false;

  if (profile?.id) {
    const [referralResult, profileExtraResult] = await Promise.all([
      supabaseAdmin
        .from("referrals")
        .select("id", { count: "exact" })
        .eq("referrer_user_id", profile.id)
        .eq("status", "completed"),
      supabaseAdmin
        .from("profiles")
        .select("referral_code, push_subscription, digest_opted_out")
        .eq("id", profile.id)
        .single(),
    ]);
    referralCount        = referralResult.count ?? 0;
    existingReferralCode = profileExtraResult.data?.referral_code ?? undefined;
    hasPushSub           = !!profileExtraResult.data?.push_subscription;
    digestOptedOut       = !!profileExtraResult.data?.digest_opted_out;
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
          <EmptyState entitlement={entitlement!} />
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
            <CheckoutButton
              wrapperClassName="flex-shrink-0"
              className="w-full sm:w-auto bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
            >
              Upgrade — $79/mo →
            </CheckoutButton>
          </div>
        )}

        {/* ── Lapsed banner: on the free tier, reactivation offered ── */}
        {isLapsed && entitlement && (
          <div className="mt-8 sm:mt-10 border border-[#EAB308]/40 bg-[#EAB308]/5 px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#EAB308] uppercase tracking-widest font-medium mb-1">
                {subStatus === "past_due"
                  ? "Payment failed — you're on the free tier"
                  : "Subscription canceled — you're on the free tier"}
              </div>
              <div className="text-xs text-[#F5F0E8]/50 leading-relaxed max-w-xl">
                {lapsedMessage}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
              {subStatus === "past_due" && (
                <a
                  href="https://billing.stripe.com/p/login/live_00g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#EAB308] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap text-center"
                >
                  Update Payment →
                </a>
              )}
              <CheckoutButton
                className="w-full sm:w-auto border border-[#FF6B00]/50 text-[#FF6B00] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
              >
                Reactivate — $79/mo →
              </CheckoutButton>
            </div>
          </div>
        )}

        {/* ── Referral section ─────────────────────────────────────── */}
        <ReferralSection
          referralCount={referralCount}
          existingCode={existingReferralCode}
        />

        {/* ── Settings: notifications + email preferences ──────────── */}
        <div className="mt-6 border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-4 sm:px-6 py-5">
          <div className="text-[10px] tracking-[0.3em] text-[#FF6B00]/40 uppercase mb-4">
            Notification Settings
          </div>
          <div className="space-y-4">
            <PushToggle hasExistingSubscription={hasPushSub} />
            <div className="border-t border-[#FF6B00]/10 pt-4">
              <DigestToggle digestOptedOut={digestOptedOut} />
            </div>
          </div>
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
