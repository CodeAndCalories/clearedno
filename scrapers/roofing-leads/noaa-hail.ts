/**
 * noaa-hail.ts
 *
 * Fetches storm events (hail or thunderstorm wind) from the NOAA Storm Events
 * Database for any supported state.
 * https://www.ncei.noaa.gov/pub/data/swdi/stormevents/
 *
 * No API key required — data is publicly available as .csv.gz files.
 *
 * Strategy:
 *   1. Scrape the csvfiles/ directory listing to find the annual detail files
 *      for each year covered by the last 12 months.
 *   2. Download and gunzip each file in memory (cached so multi-state runs
 *      only fetch each year-file once).
 *   3. Parse the CSV, filter to the requested state's county-level events
 *      of the requested type within the window.
 *   4. Return StormEvent[] tagged with state and eventType.
 */

import axios from "axios";
import * as zlib from "zlib";
import * as cheerio from "cheerio";
import * as dotenv from "dotenv";
import type { StateConfig } from "./config";

dotenv.config();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EventType = "hail" | "wind";

export interface StormEvent {
  county:    string;       // e.g. "Cuyahoga County"
  state:     string;       // 2-letter abbreviation, e.g. "OH"
  date:      string;       // ISO date "YYYY-MM-DD"
  magnitude: number;       // Hail: diameter in inches; Wind: speed in knots
  lat:       number | null;
  lng:       number | null;
  eventType: EventType;
}

// Backward-compatible alias
export type HailEvent = StormEvent;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORM_EVENTS_BASE =
  "https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/";

// NOAA EVENT_TYPE strings (uppercase for comparison)
const EVENT_TYPE_FILTER: Record<EventType, string> = {
  hail: "HAIL",
  wind: "THUNDERSTORM WIND",
};

// Storm Events BEGIN_DATE_TIME uses 3-letter month abbreviations
const MONTH_MAP: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

// ---------------------------------------------------------------------------
// Module-level CSV cache — keyed by URL
// Avoids re-downloading the same year file for each state / event type.
// ---------------------------------------------------------------------------

const csvCache = new Map<string, string>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Title-case a screaming-caps string: "CUYAHOGA" → "Cuyahoga" */
function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Parse Storm Events BEGIN_DATE_TIME.
 * Format: "16-APR-24 14:30:00"  (DD-MON-YY HH:MM:SS)
 */
function parseEventDate(raw: string): Date | null {
  const m = raw.match(/^(\d{1,2})-([A-Z]{3})-(\d{2})\s+\d{2}:\d{2}:\d{2}/i);
  if (m) {
    const day   = parseInt(m[1], 10);
    const month = MONTH_MAP[m[2].toUpperCase()];
    const year  = 2000 + parseInt(m[3], 10);
    if (month !== undefined) return new Date(year, month, day);
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Minimal RFC 4180-compliant CSV line splitter.
 * Handles quoted fields that contain commas or double-quotes.
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

// ---------------------------------------------------------------------------
// Step 1 — discover file URLs from the directory listing
// ---------------------------------------------------------------------------

async function findYearFileUrls(years: number[]): Promise<string[]> {
  const { data: html } = await axios.get<string>(STORM_EVENTS_BASE, {
    responseType: "text",
    timeout: 30_000,
  });

  const $ = cheerio.load(html);
  const urls: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href.includes("StormEvents_details-ftp") || !href.endsWith(".csv.gz")) {
      return;
    }
    for (const year of years) {
      if (href.includes(`_d${year}_`)) {
        const absolute = new URL(href, STORM_EVENTS_BASE).href;
        if (!urls.includes(absolute)) urls.push(absolute);
      }
    }
  });

  return urls;
}

// ---------------------------------------------------------------------------
// Step 2 — download + decompress (with cache)
// ---------------------------------------------------------------------------

async function getCsvText(url: string): Promise<string> {
  if (csvCache.has(url)) {
    console.log(`[noaa] Cache hit: ${url.split("/").pop()}`);
    return csvCache.get(url)!;
  }

  const filename = url.split("/").pop() ?? url;
  console.log(`[noaa] Downloading ${filename} ...`);

  const { data } = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer",
    timeout: 120_000,
  });

  const text = zlib.gunzipSync(Buffer.from(data)).toString("utf8");
  csvCache.set(url, text);
  return text;
}

// ---------------------------------------------------------------------------
// Step 3 — parse one year file for a specific state + event type
// ---------------------------------------------------------------------------

async function parseYearFile(
  url: string,
  state: StateConfig,
  cutoff: Date,
  eventType: EventType
): Promise<StormEvent[]> {
  const filename = url.split("/").pop() ?? url;
  const csv      = await getCsvText(url);
  const lines    = csv.split("\n");
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const col = (name: string) => headers.indexOf(name);

  const STATE_I    = col("STATE");
  const TYPE_I     = col("EVENT_TYPE");
  const CZ_TYPE_I  = col("CZ_TYPE");
  const DATE_I     = col("BEGIN_DATE_TIME");
  const COUNTY_I   = col("CZ_NAME");
  const MAG_I      = col("MAGNITUDE");
  const LAT_I      = col("BEGIN_LAT");
  const LON_I      = col("BEGIN_LON");

  const stateUpper  = state.name.toUpperCase();
  const typeFilter  = EVENT_TYPE_FILTER[eventType];
  const events: StormEvent[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const f = parseCsvLine(line);

    if (f[STATE_I]?.toUpperCase()   !== stateUpper) continue;
    if (f[TYPE_I]?.toUpperCase()    !== typeFilter) continue;
    if (f[CZ_TYPE_I]?.toUpperCase() !== "C")        continue;

    const eventDate = parseEventDate(f[DATE_I] ?? "");
    if (!eventDate || eventDate < cutoff) continue;

    const magRaw = parseFloat(f[MAG_I] ?? "");
    const latRaw = parseFloat(f[LAT_I] ?? "");
    const lngRaw = parseFloat(f[LON_I] ?? "");

    events.push({
      county:    toTitleCase(f[COUNTY_I] ?? "") + " County",
      state:     state.abbreviation,
      date:      eventDate.toISOString().split("T")[0],
      magnitude: isNaN(magRaw) ? 0 : magRaw,
      lat:       isNaN(latRaw) ? null : latRaw,
      lng:       isNaN(lngRaw) ? null : lngRaw,
      eventType,
    });
  }

  console.log(
    `[noaa] ${filename}: ${events.length} ${state.abbreviation} ${eventType} event(s) in window`
  );
  return events;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Fetches storm events (hail or thunderstorm wind) for the given state.
 *
 * @param cutoffOverride  Explicit start date. Defaults to 12 months ago.
 *
 * Year files are cached in memory, so calling this for multiple states or
 * event types in the same process only downloads each file once.
 */
export async function fetchStormEvents(
  state: StateConfig,
  eventType: EventType,
  cutoffOverride?: Date
): Promise<StormEvent[]> {
  const now    = new Date();
  const cutoff = cutoffOverride ?? (() => {
    const c = new Date(now);
    c.setFullYear(now.getFullYear() - 1);
    return c;
  })();

  const startStr = cutoff.toISOString().split("T")[0];
  const endStr   = now.toISOString().split("T")[0];
  console.log(
    `[noaa] Fetching ${state.name} (${state.abbreviation}) ${eventType} events ${startStr} → ${endStr}`
  );

  const yearsNeeded: number[] = [];
  for (let y = cutoff.getFullYear(); y <= now.getFullYear(); y++) {
    yearsNeeded.push(y);
  }

  const urls = await findYearFileUrls(yearsNeeded);
  if (urls.length === 0) {
    console.warn(
      `[noaa] No Storm Events files found for year(s): ${yearsNeeded.join(", ")}. ` +
        "The current year file may not yet be published — try again later."
    );
    return [];
  }

  const all: StormEvent[] = [];
  for (const url of urls) {
    const events = await parseYearFile(url, state, cutoff, eventType);
    all.push(...events);
  }

  console.log(`[noaa] Total ${state.abbreviation} ${eventType} events: ${all.length}`);
  return all;
}

// Backward-compatible alias
export const fetchHailEvents = (state: StateConfig) =>
  fetchStormEvents(state, "hail");
