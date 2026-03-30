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
import type { Permit, PermitStatus, StatusHistoryEntry } from "../types";

// ── City scraper registry ─────────────────────────────────────────────────────
// Add new city scrapers here. Order doesn't matter.
import { AustinTxScraper }      from "./cities/austin-tx";
import { DallasTxScraper }      from "./cities/dallas-tx";
import { HoustonTxScraper }     from "./cities/houston-tx";
import { SanAntonioTxScraper }  from "./cities/san-antonio-tx";
import { ColumbusOhScraper }      from "./cities/columbus-oh";
import { PhiladelphiaPaScraper }  from "./cities/philadelphia-pa";
import { GrandRapidsMiScraper }   from "./cities/grand-rapids-mi";
import type { BaseScraper } from "./base-scraper";

const SCRAPERS: BaseScraper[] = [
  new AustinTxScraper(),
  new DallasTxScraper(),
  new HoustonTxScraper(),
  new SanAntonioTxScraper(),
  new ColumbusOhScraper(),
  new PhiladelphiaPaScraper(),
  new GrandRapidsMiScraper(),
  // new PhoenixAzScraper(),
];

// ── Configuration ──────────────────────────────────────────────────────────
// When true: scrape and log but skip all DB writes and email sends.
const DRY_RUN = process.env.DRY_RUN === "true";

// After this many consecutive failures for the same city, email ADMIN_EMAIL.
const HEALTH_ERROR_THRESHOLD = 3;

// Statuses we consider "terminal" — no point re-checking these permits.
const TERMINAL_STATUSES: PermitStatus[] = ["CLEARED", "REJECTED", "EXPIRED"];

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

  log("info", { message: `Processing ${allPermits.length} active permits` });

  // ── Stats for end-of-run summary ─────────────────────────────────────────
  let checked = 0, changed = 0, skipped = 0, failed = 0;

  // ── Process each permit ───────────────────────────────────────────────────
  for (const permit of allPermits) {
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

    // Success — reset the consecutive error counter for this city
    recordSuccess(permit.city, permit.state);
    checked++;

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
    const { error: updateError } = await supabaseAdmin
      .from("permits")
      .update({
        status:         result.status,
        last_checked:   new Date().toISOString(),
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
      total:   allPermits.length,
      checked,
      changed,
      skipped,
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
