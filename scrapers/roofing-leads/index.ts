/**
 * index.ts — Roofing Leads Scraper Entry Point
 *
 * Runs the full pipeline for all configured states:
 *   1. Fetch hail events from NOAA Storm Events (last 12 months) per state
 *   2. Fetch thunderstorm wind events from NOAA Storm Events per state
 *   3. Upsert all events into the Supabase `roofing_leads` table
 *
 * Usage:
 *   ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts
 *   ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts --dry-run
 *   ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts --from 2026-01-01
 *
 * Required env vars — add to .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

// Must be first — loads .env.local before any module tries to read Supabase creds.
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { STATES } from "./config";
import { fetchStormEvents } from "./noaa-hail";
import { saveStormLeads } from "./save-leads";

const DRY_RUN = process.argv.includes("--dry-run");

// Optional --from YYYY-MM-DD override. Defaults to 12 months ago (rolling window).
const fromIdx = process.argv.indexOf("--from");
const fromArg  = fromIdx !== -1 ? process.argv[fromIdx + 1] : undefined;
const FROM_DATE: Date | undefined = fromArg ? new Date(fromArg) : undefined;

if (FROM_DATE && isNaN(FROM_DATE.getTime())) {
  console.error(`[roofing-leads] Invalid --from date: "${fromArg}". Use YYYY-MM-DD.`);
  process.exit(1);
}

async function main() {
  const windowDesc = FROM_DATE
    ? `from ${FROM_DATE.toISOString().split("T")[0]} → today`
    : "last 12 months";
  console.log(
    `[roofing-leads] Starting roofing leads scraper (${STATES.length} states, hail + wind, ${windowDesc})${
      DRY_RUN ? " — DRY RUN, no saves" : ""
    }...`
  );
  const startedAt = Date.now();

  let grandTotalHail = 0;
  let grandTotalWind = 0;
  let grandSaved     = 0;

  for (const state of STATES) {
    console.log(`\n[roofing-leads] ── ${state.name} (${state.abbreviation}) ──`);

    try {
      // ── Hail ────────────────────────────────────────────────────────────
      const hailEvents = await fetchStormEvents(state, "hail", FROM_DATE);
      const hailHot    = hailEvents.filter((e) => e.magnitude >= 1.0).length;
      const hailWarm   = hailEvents.length - hailHot;

      // ── Wind ────────────────────────────────────────────────────────────
      const windEvents = await fetchStormEvents(state, "wind", FROM_DATE);
      const windHot    = windEvents.filter((e) => e.magnitude >= 50).length;
      const windWarm   = windEvents.length - windHot;

      // ── Per-state summary ───────────────────────────────────────────────
      console.log(
        `[roofing-leads] ${state.abbreviation}: ` +
          `${hailEvents.length} hail leads (${hailHot} hot >= 1", ${hailWarm} warm), ` +
          `${windEvents.length} wind leads (${windHot} hot >= 50kts, ${windWarm} warm)`
      );

      grandTotalHail += hailEvents.length;
      grandTotalWind += windEvents.length;

      if (DRY_RUN) {
        console.log(`[roofing-leads] ${state.abbreviation}: dry-run — skipping save.`);
        continue;
      }

      const allEvents = [...hailEvents, ...windEvents];
      if (allEvents.length === 0) {
        console.log(`[roofing-leads] ${state.abbreviation}: No events to save.`);
        continue;
      }

      const saved = await saveStormLeads(allEvents);
      console.log(`[roofing-leads] ${state.abbreviation}: ${saved} lead(s) saved/updated.`);
      grandSaved += saved;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[roofing-leads] ${state.abbreviation}: Error — ${message}`);
      // Continue to next state rather than aborting the whole run
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  const grandTotal = grandTotalHail + grandTotalWind;

  console.log(`\n[roofing-leads] ── Summary ──`);
  console.log(`[roofing-leads] Hail events fetched  : ${grandTotalHail}`);
  console.log(`[roofing-leads] Wind events fetched  : ${grandTotalWind}`);
  console.log(`[roofing-leads] Total events fetched : ${grandTotal}`);
  if (!DRY_RUN) {
    console.log(`[roofing-leads] Total leads saved    : ${grandSaved}`);
  }
  console.log(`[roofing-leads] Completed in ${elapsed}s.`);
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[roofing-leads] Fatal error: ${message}`);
  process.exit(1);
});
