/**
 * index.ts — Roofing Leads Scraper Entry Point
 *
 * Runs the full pipeline:
 *   1. Fetch Ohio hail events from NOAA CDO (last 90 days)
 *   2. Upsert them into the Supabase `roofing_leads` table
 *
 * Usage:
 *   ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts
 *
 * Required env vars — add to .env:
 *   NOAA_CDO_TOKEN
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import { fetchOhioHailEvents } from "./noaa-hail";
import { saveHailLeads } from "./save-leads";

async function main() {
  console.log("[roofing-leads] Starting roofing leads scraper...");
  const startedAt = Date.now();

  try {
    // Step 1: Pull hail events from NOAA
    const hailEvents = await fetchOhioHailEvents();

    if (hailEvents.length === 0) {
      console.log("[roofing-leads] No hail events found. Nothing to save.");
      return;
    }

    const hotCount = hailEvents.filter((e) => e.magnitude >= 1.0).length;
    const warmCount = hailEvents.length - hotCount;
    console.log(
      `[roofing-leads] Events fetched: ${hailEvents.length} total ` +
        `(${hotCount} hot >= 1\", ${warmCount} warm < 1\")`
    );

    // Step 2: Upsert into Supabase
    const saved = await saveHailLeads(hailEvents);

    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(
      `[roofing-leads] Done. ${saved} lead(s) saved/updated in ${elapsed}s.`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[roofing-leads] Fatal error: ${message}`);
    process.exit(1);
  }
}

main();
