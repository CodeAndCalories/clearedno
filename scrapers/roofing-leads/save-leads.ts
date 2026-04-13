/**
 * save-leads.ts
 *
 * Takes an array of HailEvent objects and upserts them into the
 * Supabase `roofing_leads` table.
 *
 * Upsert key: (county, event_date, source) — prevents duplicate rows
 * if the scraper is run multiple times.
 *
 * lead_score logic:
 *   "hot"  — hail magnitude >= 1.0 inch (significant damage threshold)
 *   "warm" — hail magnitude < 1.0 inch (smaller but still noteworthy)
 *
 * Required env vars (same as the rest of the app):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (preferred over anon key for server-side writes)
 *   -- OR --
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { HailEvent } from "./noaa-hail";

dotenv.config();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoofingLead {
  address: string | null;
  county: string;
  event_type: string;
  event_date: string;   // ISO date "YYYY-MM-DD"
  source: string;
  lead_score: "hot" | "warm";
  // id and created_at are set by the database
}

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role key for unauthenticated server-side writes;
  // fall back to anon key if service role is not available.
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env"
    );
  }

  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Score helper
// ---------------------------------------------------------------------------

function scoreFromMagnitude(magnitudeInches: number): "hot" | "warm" {
  return magnitudeInches >= 1.0 ? "hot" : "warm";
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Upserts hail events into the roofing_leads table.
 * Returns the number of rows that were inserted or updated.
 */
export async function saveHailLeads(events: HailEvent[]): Promise<number> {
  if (events.length === 0) {
    console.log("[save-leads] No events to save.");
    return 0;
  }

  const supabase = getSupabaseClient();

  // Storm Events can have multiple hail reports for the same county on the
  // same day. Deduplicate by (county, event_date, source), keeping the
  // highest-magnitude event — prevents the Postgres "ON CONFLICT DO UPDATE
  // command cannot affect row a second time" error.
  const bestByKey = new Map<string, HailEvent>();
  for (const event of events) {
    const key = `${event.county}|${event.date}|noaa-storm-events`;
    const existing = bestByKey.get(key);
    if (!existing || event.magnitude > existing.magnitude) {
      bestByKey.set(key, event);
    }
  }
  const deduped = [...bestByKey.values()];
  console.log(
    `[save-leads] ${events.length} events → ${deduped.length} after dedup`
  );

  const rows: RoofingLead[] = deduped.map((event) => ({
    // address is unknown from weather data alone; set to null for manual enrichment
    address: null,
    county: event.county,
    event_type: "hail",
    event_date: event.date,
    source: "noaa-storm-events",
    lead_score: scoreFromMagnitude(event.magnitude),
  }));

  // Upsert in batches of 500 to stay within Supabase limits
  const BATCH = 500;
  let savedCount = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);

    const { data, error } = await supabase
      .from("roofing_leads")
      .upsert(batch, {
        onConflict: "county,event_date,source", // unique constraint in DB
        ignoreDuplicates: false, // update lead_score if magnitude changed
      })
      .select("id");

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    savedCount += data?.length ?? 0;
  }

  return savedCount;
}
