/**
 * save-leads.ts
 *
 * Takes an array of StormEvent objects (hail or wind) and upserts them into
 * the Supabase `roofing_leads` table.
 *
 * Upsert key: (county, state, event_date, source, event_type)
 *   — prevents duplicate rows if the scraper runs multiple times.
 *   — allows hail and wind events on the same day/county to coexist.
 *
 * lead_score logic:
 *   Hail  — "hot"  if magnitude >= 1.0 inch
 *          — "warm" if magnitude < 1.0 inch
 *   Wind  — "hot"  if magnitude >= 50 knots (significant wind damage)
 *          — "warm" if any wind event reported (magnitude < 50 or unknown)
 *
 * Required env vars (same as the rest of the app):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (preferred over anon key for server-side writes)
 *   -- OR --
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { StormEvent, EventType } from "./noaa-hail";

dotenv.config();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoofingLead {
  address:    string | null;
  county:     string;
  state:      string;       // 2-letter abbreviation, e.g. "OH"
  event_type: string;       // "hail" | "wind"
  event_date: string;       // ISO date "YYYY-MM-DD"
  source:     string;
  lead_score: "hot" | "warm";
  // id, magnitude, lat, lng, created_at are set by the database
}

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
// Score helpers
// ---------------------------------------------------------------------------

function scoreHail(magnitudeInches: number): "hot" | "warm" {
  return magnitudeInches >= 1.0 ? "hot" : "warm";
}

function scoreWind(magnitudeKnots: number): "hot" | "warm" {
  return magnitudeKnots >= 50 ? "hot" : "warm";
}

function scoreEvent(eventType: EventType, magnitude: number): "hot" | "warm" {
  return eventType === "hail" ? scoreHail(magnitude) : scoreWind(magnitude);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Upserts storm events (hail or wind) into the roofing_leads table.
 * Returns the number of rows that were inserted or updated.
 */
export async function saveStormLeads(events: StormEvent[]): Promise<number> {
  if (events.length === 0) {
    console.log("[save-leads] No events to save.");
    return 0;
  }

  const supabase = getSupabaseClient();

  // Deduplicate by (county, state, event_date, source, event_type), keeping
  // the highest-magnitude event. Prevents the Postgres "ON CONFLICT DO UPDATE
  // command cannot affect row a second time" error.
  const bestByKey = new Map<string, StormEvent>();
  for (const event of events) {
    const key = `${event.county}|${event.state}|${event.date}|noaa-storm-events|${event.eventType}`;
    const existing = bestByKey.get(key);
    if (!existing || event.magnitude > existing.magnitude) {
      bestByKey.set(key, event);
    }
  }
  const deduped = Array.from(bestByKey.values());
  console.log(
    `[save-leads] ${events.length} events → ${deduped.length} after dedup`
  );

  const rows: RoofingLead[] = deduped.map((event) => ({
    address:    null,
    county:     event.county,
    state:      event.state,
    event_type: event.eventType,
    event_date: event.date,
    source:     "noaa-storm-events",
    lead_score: scoreEvent(event.eventType, event.magnitude),
  }));

  // Upsert in batches of 500 to stay within Supabase limits
  const BATCH = 500;
  let savedCount = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);

    const { data, error } = await supabase
      .from("roofing_leads")
      .upsert(batch, {
        onConflict: "county,state,event_date,source,event_type",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    savedCount += data?.length ?? 0;
  }

  return savedCount;
}

// Backward-compatible alias
export const saveHailLeads = saveStormLeads;
