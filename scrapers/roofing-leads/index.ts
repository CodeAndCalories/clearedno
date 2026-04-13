/**
 * index.ts — Roofing Leads Scraper Entry Point
 *
 * Runs the full pipeline for all configured states:
 *   1. Fetch hail events from NOAA CDO (last 12 months) per state
 *   2. Upsert them into the Supabase `roofing_leads` table
 *
 * Usage:
 *   ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts
 *   ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts --dry-run
 *
 * Required env vars — add to .env:
 *   NOAA_CDO_TOKEN
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import { STATES } from "./config";
import { fetchHailEvents } from "./noaa-hail";
import { saveHailLeads } from "./save-leads";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  console.log(
    `[roofing-leads] Starting roofing leads scraper (${STATES.length} states)${DRY_RUN ? " — DRY RUN, no saves" : ""}...`
  );
  const startedAt = Date.now();

  let grandTotal = 0;
  let grandSaved = 0;

  for (const state of STATES) {
    console.log(`\n[roofing-leads] ── ${state.name} (${state.abbreviation}) ──`);

    try {
      const hailEvents = await fetchHailEvents(state);

      if (hailEvents.length === 0) {
        console.log(`[roofing-leads] ${state.abbreviation}: No hail events found.`);
        continue;
      }

      const hotCount  = hailEvents.filter((e) => e.magnitude >= 1.0).length;
      const warmCount = hailEvents.length - hotCount;
      console.log(
        `[roofing-leads] ${state.abbreviation}: ${hailEvents.length} events ` +
          `(${hotCount} hot >= 1", ${warmCount} warm < 1")`
      );

      grandTotal += hailEvents.length;

      if (DRY_RUN) {
        console.log(`[roofing-leads] ${state.abbreviation}: dry-run — skipping save.`);
        continue;
      }

      const saved = await saveHailLeads(hailEvents);
      console.log(`[roofing-leads] ${state.abbreviation}: ${saved} lead(s) saved/updated.`);
      grandSaved += saved;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[roofing-leads] ${state.abbreviation}: Error — ${message}`);
      // Continue to next state rather than aborting the whole run
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log(`\n[roofing-leads] ── Summary ──`);
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
