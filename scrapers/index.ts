// ClearedNo — Permit Scraper Engine
//
// Runs all city scrapers, detects status changes, and fires email alerts.
//
// Usage:
//   Normal run:  npx ts-node --project tsconfig.scripts.json scrapers/index.ts
//   Dry run:     DRY_RUN=true npx ts-node --project tsconfig.scripts.json scrapers/index.ts
//
// DRY_RUN=true scrapes + logs everything but skips all DB writes and emails.
// Use this when updating selectors or testing a new city.
//
// PM2 runs this every 2 hours via ecosystem.config.js.
//
// ── HOW TO ADD A NEW CITY ────────────────────────────────────────────────────
// 1. Create scrapers/cities/your-city-st.ts (copy austin-tx.ts as a template)
// 2. Import it below and add an instance to the SCRAPERS array
// 3. Deploy — the engine routes permits automatically by city + state
// ─────────────────────────────────────────────────────────────────────────────

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { supabaseAdmin } from "../lib/supabase/admin";
import { sendPermitStatusAlert, sendAdminAlert } from "../lib/email";
import type {
  Permit,
  PermitStatus,
  StatusHistoryEntry,
  SubscriptionStatus,
} from "../types";

// ── City scraper registry ─────────────────────────────────────────────────────
// Add new city scrapers here. Order doesn't matter.
import { AustinTxScraper }      from "./cities/austin-tx";
import { DallasTxScraper }      from "./cities/dallas-tx";
import { HoustonTxScraper }     from "./cities/houston-tx";
import { SanAntonioTxScraper }  from "./cities/san-antonio-tx";
import { ColumbusOhScraper }      from "./cities/columbus-oh";
import { ClevelandOhScraper }     from "./cities/cleveland-oh";
import { CincinnatiOhScraper }    from "./cities/cincinnati-oh";
import { PhiladelphiaPaScraper }  from "./cities/philadelphia-pa";
import { PittsburghPaScraper }    from "./cities/pittsburgh-pa";
import { GrandRapidsMiScraper }   from "./cities/grand-rapids-mi";
import type { BaseScraper } from "./base-scraper";

const SCRAPERS: BaseScraper[] = [
  // ── API-only (no browser) — the supported set ───────────────────────────
  new AustinTxScraper(),        // Socrata
  new ColumbusOhScraper(),      // ArcGIS
  new ClevelandOhScraper(),     // ArcGIS
  new CincinnatiOhScraper(),    // Socrata
  new PhiladelphiaPaScraper(),  // Carto SQL
  new PittsburghPaScraper(),    // CKAN

  // ── Browser-based, unsupported ──────────────────────────────────────────
  // These remain registered so an existing permit row still routes somewhere
  // and is logged, but none of these cities are in LIVE_CHECKER_CITIES, so no
  // new permits can be added for them. See lib/cities.ts.
  new DallasTxScraper(),
  new HoustonTxScraper(),
  new SanAntonioTxScraper(),
  new GrandRapidsMiScraper(),
];

// ── Configuration ──────────────────────────────────────────────────────────
// When true: scrape and log but skip all DB writes and email sends.
const DRY_RUN = process.env.DRY_RUN === "true";

// After this many consecutive failures for the same city, email ADMIN_EMAIL.
const HEALTH_ERROR_THRESHOLD = 3;

// Statuses we consider "terminal" — no point re-checking these permits.
const TERMINAL_STATUSES: PermitStatus[] = ["CLEARED", "REJECTED", "EXPIRED"];

// Subscription statuses whose permits get checked.
//
// ── THIS SET IS NOT A MIRROR OF UNLIMITED_STATUSES ──────────────────────
// lib/entitlements.ts holds a set that looks almost identical. The two answer
// DIFFERENT questions and are deliberately not the same:
//
//   this set  → "may this permit be checked at all?"
//   UNLIMITED_STATUSES → "how many permits may this user have?"
//
// 'free' makes the difference concrete. A free user's one permit IS checked —
// that is the entire free tier — so 'free' belongs here. But a free user is
// capped at 1 + purchased slots, so 'free' must NEVER be added to
// UNLIMITED_STATUSES, where it would hand every non-paying account unlimited
// tracking. Reconciling the two sets to "fix" the discrepancy breaks a tier.
//
// Deliberately keyed on subscription STATUS, never on a price ID. Any active
// permit-side subscription counts, whatever it costs — filtering on a specific
// price here would silently stop tracking for every subscriber the moment a
// new tier is introduced alongside the existing one.
//
// 'past_due' and 'canceled' are included, which looks generous and is not.
// A lapsed subscriber degrades to the FREE TIER, not to a broken product:
// getEntitlement() still caps them at 1 + purchased slots, exactly what a
// never-paid account gets. Excluding them here bought nothing — capacity was
// already capped elsewhere — while creating a state where the app accepts a
// permit it silently never checks. A permit that is accepted and never checked
// is worse than a refused one: the user waits on an alert that cannot arrive.
//
// So this set is now "every status that is a real account", and the revenue
// question — how many permits — is answered entirely by getEntitlement().
//
// Be precise about what that enforces. getEntitlement gates ADDING a permit,
// so a lapsed user cannot climb past 1 + purchased slots. It does not prune
// what they already have, and the loop below filters on status, not count — a
// subscriber who cancels holding 5 permits keeps all 5 checked. The dashboard's
// lapsed banner says exactly that rather than implying a cap nothing applies.
// Trimming to the allowance would mean choosing which permits to drop, which is
// a product decision, not a scraper one.
//
// The dashboard no longer redirects lapsed users to /reactivate; they land on
// the dashboard with that banner and can reactivate from it.
//
// Typed as a Set of SubscriptionStatus so an invalid literal fails the build,
// but widened to ReadonlySet<string> so .has() takes the raw column value.
const ENTITLED_SUBSCRIPTION_STATUSES: ReadonlySet<string> =
  new Set<SubscriptionStatus>(["active", "trialing", "free", "canceled", "past_due"]);

// ── Structured logger ──────────────────────────────────────────────────────
// All logs are newline-delimited JSON so they can be ingested by any log
// aggregator (Datadog, Logtail, CloudWatch, etc.).
interface LogData {
  [key: string]: unknown;
}
function log(level: "info" | "warn" | "error", data: LogData): void {
  process.stdout.write(
    JSON.stringify({
      level,
      service: "clearedno-scraper",
      timestamp: new Date().toISOString(),
      dry_run: DRY_RUN,
      ...data,
    }) + "\n"
  );
}

// ── Health tracking (per-run, in-memory) ──────────────────────────────────
// Tracks consecutive scraper failures per city key ("Austin|TX").
// Resets to 0 on any success. After HEALTH_ERROR_THRESHOLD failures,
// sends one admin alert per city per run.
const consecutiveErrors = new Map<string, number>();
const adminAlertedCities = new Set<string>();

function cityKey(city: string, state: string): string {
  return `${city.toLowerCase()}|${state.toUpperCase()}`;
}

function recordSuccess(city: string, state: string): void {
  consecutiveErrors.set(cityKey(city, state), 0);
}

async function recordFailure(
  city: string,
  state: string,
  permitNumber: string,
  errorMsg: string
): Promise<void> {
  const key = cityKey(city, state);
  const count = (consecutiveErrors.get(key) ?? 0) + 1;
  consecutiveErrors.set(key, count);

  log("error", {
    message: "Scrape failed",
    permit_number: permitNumber,
    city,
    state,
    consecutive_failures: count,
    error: errorMsg,
  });

  if (count >= HEALTH_ERROR_THRESHOLD && !adminAlertedCities.has(key)) {
    adminAlertedCities.add(key);
    await sendAdminAlert({
      subject: `Scraper unhealthy — ${city}, ${state} (${count} consecutive failures)`,
      message:
        `The ${city}, ${state} scraper has failed ${count} times in a row.\n\n` +
        `Last error on permit ${permitNumber}:\n${errorMsg}\n\n` +
        `Check the portal URL and selectors in scrapers/cities/${city.toLowerCase().replace(/ /g, "-")}-${state.toLowerCase()}.ts`,
    }).catch((e) => log("error", { message: "Failed to send admin alert", error: String(e) }));
  }
}

// ── Main engine ────────────────────────────────────────────────────────────

async function runScrapers(): Promise<void> {
  const runStart = Date.now();
  log("info", { message: "Scraper run started" });

  if (DRY_RUN) {
    log("warn", {
      message: "DRY RUN MODE — no DB writes or emails will be sent",
    });
  }

  // ── Fetch all permits that are not in a terminal state ─────────────────
  const { data: permits, error: fetchError } = await supabaseAdmin
    .from("permits")
    .select("*")
    .eq("is_active", true)
    .not("status", "in", `("CLEARED","REJECTED","EXPIRED")`)
    .order("last_checked", { ascending: true, nullsFirst: true }); // oldest-checked first

  if (fetchError) {
    log("error", { message: "Failed to fetch permits", error: fetchError.message });
    process.exit(1);
  }

  const allPermits = (permits ?? []) as Permit[];

  // ── Entitlement filter ─────────────────────────────────────────────────
  // The scraper IS the product: checking a permit and emailing the alert is
  // the thing people pay for. This working set used to be every active permit
  // with no reference to billing, so canceled users kept receiving checks and
  // alerts indefinitely — while /reactivate told them monitoring had stopped.
  //
  // permits.user_id and profiles.user_id both reference auth.users(id), but
  // there is no foreign key between the two tables, so PostgREST cannot embed
  // one in the other. Two queries and a Map are the join.
  const permitOwnerIds = [...new Set(allPermits.map((p) => p.user_id))];
  const ownerStatusById = new Map<string, string>();

  if (permitOwnerIds.length > 0) {
    const { data: ownerProfiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("user_id, subscription_status")
      .in("user_id", permitOwnerIds);

    // Fail closed and loudly, matching the permit fetch above. Continuing
    // without entitlement data would mean choosing between silently starving
    // paying customers of alerts and silently restoring the bug this filter
    // exists to fix. Neither belongs in a default path.
    if (profilesError) {
      log("error", {
        message: "Failed to fetch owner profiles — cannot determine entitlement",
        error: profilesError.message,
      });
      process.exit(1);
    }

    for (const row of ownerProfiles ?? []) {
      ownerStatusById.set(
        row.user_id as string,
        row.subscription_status as string
      );
    }
  }

  // A permit whose owner has no profile row is not entitled. The signup
  // trigger creates one for every user, so its absence is a data problem
  // rather than a billing state — logged as such instead of being folded in
  // with ordinary cancellations.
  const entitledPermits: Permit[] = [];
  let skippedUnentitled = 0;

  for (const p of allPermits) {
    const ownerStatus = ownerStatusById.get(p.user_id);

    if (ownerStatus !== undefined && ENTITLED_SUBSCRIPTION_STATUSES.has(ownerStatus)) {
      entitledPermits.push(p);
      continue;
    }

    skippedUnentitled++;
    log("info", {
      permit_number: p.permit_number,
      city: p.city,
      state: p.state,
      old_status: p.status,
      owner_subscription_status: ownerStatus ?? "none (no profile row)",
      message: "Owner not entitled to tracking — skipping",
    });
  }

  log("info", {
    message:
      `Processing ${entitledPermits.length} of ${allPermits.length} active permits`,
    entitled: entitledPermits.length,
    skipped_unentitled: skippedUnentitled,
  });

  // ── Stats for end-of-run summary ─────────────────────────────────────────
  let checked = 0, changed = 0, skipped = 0, failed = 0;

  // ── Process each permit ───────────────────────────────────────────────────
  for (const permit of entitledPermits) {
    const permitLog = {
      permit_number: permit.permit_number,
      city: permit.city,
      state: permit.state,
      old_status: permit.status,
    };

    // ── 1. Find the right city scraper ──────────────────────────────────
    const scraper = SCRAPERS.find((s) => s.handles(permit.city, permit.state));

    if (!scraper) {
      log("info", {
        ...permitLog,
        message: "City not yet supported — skipping",
      });
      skipped++;
      continue;
    }

    // ── 2. Run the scraper ───────────────────────────────────────────────
    // BaseScraper.run() has its own retry + timeout logic.
    // It returns null on total failure — we never throw here.
    const result = await scraper.run(permit.permit_number, permit.address);

    if (!result) {
      await recordFailure(
        permit.city,
        permit.state,
        permit.permit_number,
        "Scraper returned null after all retry attempts"
      );
      failed++;
      continue;
    }

    // ── 2a. UNKNOWN is a failure, not a result ───────────────────────────
    // A scraper returns UNKNOWN when it ran to completion but could not
    // determine the real status — broken selectors, a portal redesign, or
    // status text we have no mapping for.
    //
    // This used to be reported as PENDING, which the engine counted as a
    // success: recordSuccess() reset the health counter, so a completely
    // broken scraper looked healthy indefinitely and HEALTH_ERROR_THRESHOLD
    // could never fire. Treat it as the failure it is, and never persist it.
    if (result.status === "UNKNOWN") {
      await recordFailure(
        permit.city,
        permit.state,
        permit.permit_number,
        `Scraper could not determine status — ${result.raw_text}`
      );
      failed++;
      continue;
    }

    // Success — reset the consecutive error counter for this city
    recordSuccess(permit.city, permit.state);
    checked++;

    // ── 2b. Stamp last_checked on EVERY successful check ─────────────────
    // This must happen before the change check below. It previously lived
    // inside the "status changed" branch, so a check that found no change
    // wrote nothing at all — leaving last_checked NULL forever and making
    // "checked, unchanged" indistinguishable from "never checked". That is
    // the signal used to detect a silently dead pipeline, so it has to be
    // written unconditionally.
    if (!DRY_RUN) {
      const { error: stampError } = await supabaseAdmin
        .from("permits")
        .update({ last_checked: new Date().toISOString() })
        .eq("id", permit.id);

      if (stampError) {
        log("error", {
          ...permitLog,
          message: "Failed to stamp last_checked",
          error: stampError.message,
        });
      }
    }

    // ── 3. Deduplicated change detection ────────────────────────────────
    // Only proceed if the new status differs from BOTH:
    //   (a) the current value stored in Supabase, AND
    //   (b) the most recent entry in status_history
    // This guards against edge cases where they fall out of sync.
    const history = permit.status_history ?? [];
    const lastHistoryStatus = history.length > 0
      ? history[history.length - 1].status
      : null;

    const differsFromDb      = result.status !== permit.status;
    const differsFromHistory = lastHistoryStatus === null || result.status !== lastHistoryStatus;
    const hasReallyChanged   = differsFromDb && differsFromHistory;

    log("info", {
      ...permitLog,
      new_status: result.status,
      changed: hasReallyChanged,
      raw_text: result.raw_text,
      scrape_url: result.scrape_url,
      message: hasReallyChanged
        ? `Status changed: ${permit.status} → ${result.status}`
        : "No status change",
    });

    // ── 4. Persist + alert if changed ───────────────────────────────────
    if (!hasReallyChanged) continue;

    changed++;

    if (DRY_RUN) {
      log("info", {
        ...permitLog,
        new_status: result.status,
        message: "[DRY RUN] Would update DB and send alert — skipped",
      });
      continue;
    }

    // ── 4a. Build updated history array ─────────────────────────────────
    const newEntry: StatusHistoryEntry = {
      status:    result.status,
      timestamp: new Date().toISOString(),
      raw:       result.raw_text,
    };
    const updatedHistory: StatusHistoryEntry[] = [...history, newEntry];

    // ── 4b. Update permit in Supabase ─────────────────────────────────
    // last_checked is already stamped in step 2b for every successful
    // check, changed or not — it deliberately isn't repeated here.
    const { error: updateError } = await supabaseAdmin
      .from("permits")
      .update({
        status:         result.status,
        status_history: updatedHistory,
        scrape_url:     result.scrape_url,
      })
      .eq("id", permit.id);

    if (updateError) {
      log("error", {
        ...permitLog,
        new_status: result.status,
        message: "DB update failed",
        error: updateError.message,
      });
      failed++;
      continue;
    }

    // ── 4c. Fetch user details for the alert email ────────────────────
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(permit.user_id);
    const userEmail = userData?.user?.email;

    if (!userEmail) {
      log("warn", {
        ...permitLog,
        message: "Could not find user email — alert not sent",
      });
      continue;
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("user_id", permit.user_id)
      .single();

    const userName = profile?.full_name ?? "there";

    // ── 4d. Send alert email ──────────────────────────────────────────
    const emailResult = await sendPermitStatusAlert({
      to:       userEmail,
      userName,
      permit: { ...permit, status: result.status },
    }).catch((e) => {
      log("error", {
        ...permitLog,
        message: "Failed to send alert email",
        error: String(e),
      });
      return null;
    });

    if (!emailResult) {
      // Don't mark as failed — the DB was updated correctly, just email errored
      continue;
    }

    // ── 4e. Insert alert record (prevents future duplicates) ──────────
    const { error: alertError } = await supabaseAdmin
      .from("alerts")
      .insert({
        user_id:    permit.user_id,
        permit_id:  permit.id,
        type:       "status_change",
        new_status: result.status,
      });

    if (alertError) {
      log("warn", {
        ...permitLog,
        message: "Failed to insert alert record",
        error: alertError.message,
      });
    }

    log("info", {
      ...permitLog,
      new_status: result.status,
      alerted_email: userEmail,
      message: "Alert sent successfully",
    });
  }

  // ── End-of-run summary ────────────────────────────────────────────────
  const durationMs = Date.now() - runStart;

  log("info", {
    message: "Scraper run complete",
    stats: {
      total:    allPermits.length,
      entitled: entitledPermits.length,
      checked,
      changed,
      // `skipped` is city-not-supported; `skipped_unentitled` is billing.
      // Kept separate so a spike in one is never mistaken for the other.
      skipped,
      skipped_unentitled: skippedUnentitled,
      failed,
      duration_ms: durationMs,
    },
  });
}

// ── Entrypoint ─────────────────────────────────────────────────────────────

runScrapers().catch((err) => {
  log("error", {
    message: "Fatal uncaught error in scraper engine",
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});
