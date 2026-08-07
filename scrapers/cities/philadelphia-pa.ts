// Philadelphia, PA — L&I permit lookup (Carto SQL API)
//
// API-ONLY. There is no browser path and there must not be one: the endpoint is
// public, unauthenticated, and answers in ~200ms.
//
// Endpoint: GET https://phl.carto.com/api/v2/sql?q=<SQL>
// Table:    permits
// Response: JSON { rows: [...] }; rows[0] is the permit
// Status:   the `status` column (verified — there is NO `permit_status` column)
//
// ── THE PERMIT NUMBER MUST BE QUOTED ──────────────────────────────────────────
// This is SQL, not a REST path. An unquoted value is parsed as a column name:
//
//   WHERE permitnumber=CP-2025-001437   → HTTP 400 {"error":["column \"cp\" does not exist"]}
//   WHERE permitnumber='CP-2025-001437' → {"permitnumber":"CP-2025-001437","status":"Issued"}
//
// Embedded single quotes are doubled ('' ) before interpolation so a permit
// number can never break out of the string literal.
//
// ── PERMIT NUMBER FORMATS ──────────────────────────────────────────────────────
// Philadelphia permit numbers are typically formatted as:
//   "CP-2024-012345"  (commercial permits)
//   "ZP-2024-012345"  (zoning permits)
//   "SP-2024-012345"  (street opening permits)
// Pass the number as-is; the API handles all formats.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";
import { PHILADELPHIA_STATUS_MAP } from "../../lib/permit-status";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Philadelphia, PA",
  state:    "PA",
  handles:  ["philadelphia", "philly"],
};

// Carto SQL API — the only method
const API_BASE = "https://phl.carto.com/api/v2/sql";

/** Public L&I record page — used for scrape_url and in indeterminate() logs. */
const PORTAL_URL = "https://li.phila.gov/license-inspections/verify";

/** Escape a value for safe interpolation into a single-quoted SQL literal. */
function sqlQuote(value: string): string {
  return `'${value.trim().replace(/'/g, "''")}'`;
}

// ── Scraper class ─────────────────────────────────────────────────────────────

export class PhiladelphiaPaScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    // API is public — call it directly; indeterminate() on failure
    try {
      const result = await this.scrapeViaApi(permitNumber);
      if (result) return result;
      // null means permit not found in API
      return this.indeterminate(
        permitNumber,
        "Permit not found in eCLIPSE API response"
      );
    } catch (apiErr) {
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Philadelphia, PA",
          method: "api",
          permit_number: permitNumber,
          message: "eCLIPSE API failed, returning UNKNOWN",
          error: apiErr instanceof Error ? apiErr.message : String(apiErr),
          timestamp: new Date().toISOString(),
        })
      );
      return this.indeterminate(
        permitNumber,
        `eCLIPSE API error: ${apiErr instanceof Error ? apiErr.message : String(apiErr)}`
      );
    }
  }

  // ── eCLIPSE public API ─────────────────────────────────────────────────────
  // Returns null if the permit isn't found.
  // Throws on network / parse errors.
  //
  // Response is a JSON array. Check data[0] (or the root array element) for:
  //   permit_status — primary status field
  //   status        — fallback status field

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const sql =
      `SELECT permitnumber, status, permitdescription, permittype, permitissuedate ` +
      `FROM permits WHERE permitnumber=${sqlQuote(permitNumber)} LIMIT 1`;
    const url = `${API_BASE}?q=${encodeURIComponent(sql)}`;

    const res = await fetch(url, {
      headers: {
        "Accept":     "application/json",
        "User-Agent": "ClearedNo/1.0 (permit status monitor; support@clearedno.com)",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json() as unknown;

    // Carto SQL API returns { rows: [...], ... }
    let record: Record<string, unknown> | null = null;

    if (
      data !== null &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.rows) && (obj.rows as unknown[]).length > 0) {
        record = (obj.rows as Record<string, unknown>[])[0];
      }
    }

    if (!record) {
      // Permit not found
      return null;
    }

    // `status` is the only status column on this table (verified against the
    // live schema — there is no `permit_status`).
    const rawText = ((record.status as string) ?? "").trim();

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      "found in API, status field empty",
        scrape_url:    url,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:         "info",
        scraper:       "Philadelphia, PA",
        method:        "api",
        permit_number: permitNumber,
        raw_status:    rawText,
        status,
        timestamp:     new Date().toISOString(),
      })
    );

    return {
      permit_number: permitNumber,
      status,
      raw_text:   rawText,
      scrape_url: url,
    };
  }

  // ── Fallback result ────────────────────────────────────────────────────────

  private indeterminate(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Philadelphia, PA",
        permit_number: permitNumber,
        message: "Scrape indeterminate — returning UNKNOWN so health tracking counts it as a failure",
        reason,
        portal_url: PORTAL_URL,
        timestamp: new Date().toISOString(),
      })
    );
    return {
      permit_number: permitNumber,
      status:        "UNKNOWN",
      raw_text:      reason,
      scrape_url:    PORTAL_URL,
    };
  }

  // ── Status mapping ─────────────────────────────────────────────────────────

  private mapStatus(rawText: string): PermitStatus {
    // Exact match first, then longest-substring — see BaseScraper.matchStatus().
    return this.matchStatus(rawText, PHILADELPHIA_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}
