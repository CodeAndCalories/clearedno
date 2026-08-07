// Cleveland, OH — Department of Building & Housing permit lookup (ArcGIS)
//
// API-ONLY. There is no browser path and there must not be one.
//
// Service: City of Cleveland Open Data → "Issued Building Permits"
//   https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Building_Permits/FeatureServer/0
//
// Lookup field:  PERMIT_ID                  — e.g. "BCH26-032235"
// Status fields: CURRENT_TASK_STATUS        — where the permit sits right now
//                CURRENT_TASK               — which workflow stage that status
//                                             belongs to (logged for context)
// Deep link:     ACCELA_CITIZEN_ACCESS_URL  — real aca-prod.accela.com record
//
// Verified 2026-08-07: BCH26-032235 → CURRENT_TASK "Inspection",
// CURRENT_TASK_STATUS "Inspection Pending", 2165 E 89TH ST.
//
// ── A NOTE ON WHAT THIS STATUS MEANS ─────────────────────────────────────────
// CURRENT_TASK_STATUS is the status of the *current workflow task*, not a
// single permit-level state. "Inspection Approved" means the inspection passed;
// "Permit Closed" means the record is finished. Intermediate review approvals
// ("Plan Review Approved", "Fire Review Approved") are deliberately mapped to
// UNDER_REVIEW rather than APPROVED — one sub-review passing does not mean the
// permit is approved, and telling a contractor otherwise is the kind of
// confidently-wrong answer this codebase exists to avoid.
//
// ── QUERY FORM ────────────────────────────────────────────────────────────────
// ArcGIS `where` is SQL. The permit id MUST be quoted, and embedded single
// quotes doubled, or the value parses as a column name and the service 400s.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";
import { CLEVELAND_STATUS_MAP } from "../../lib/permit-status";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Cleveland, OH",
  state:    "OH",
  handles:  ["cleveland"],
};

const API_URL =
  "https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Building_Permits/FeatureServer/0/query";

/** Public portal — used for scrape_url when the Accela link is absent. */
const PORTAL_URL =
  "https://www.clevelandohio.gov/CityofCleveland/Home/Government/CityAgencies/BuildingAndHousing";

const OUT_FIELDS = [
  "PERMIT_ID",
  "CURRENT_TASK",
  "CURRENT_TASK_STATUS",
  "PERMIT_TYPE",
  "PRIMARY_ADDRESS",
  "ISSUE_DATE",
  "ACCELA_CITIZEN_ACCESS_URL",
].join(",");

/** Escape a value for safe interpolation into a single-quoted SQL literal. */
function sqlQuote(value: string): string {
  return `'${value.trim().replace(/'/g, "''")}'`;
}

// ── ArcGIS response shape ─────────────────────────────────────────────────────

interface ArcGisAttributes {
  PERMIT_ID?:                 string | null;
  CURRENT_TASK?:              string | null;
  CURRENT_TASK_STATUS?:       string | null;
  PERMIT_TYPE?:               string | null;
  PRIMARY_ADDRESS?:           string | null;
  ISSUE_DATE?:                number | null;
  ACCELA_CITIZEN_ACCESS_URL?: string | null;
}

interface ArcGisResponse {
  features?: { attributes?: ArcGisAttributes }[];
  error?:    { code?: number; message?: string };
}

// ── Scraper class ─────────────────────────────────────────────────────────────

export class ClevelandOhScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    try {
      const result = await this.scrapeViaApi(permitNumber);
      if (result) return result;

      return this.indeterminate(
        permitNumber,
        "Permit not found in Cleveland Building Permits feature service"
      );
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Cleveland, OH",
          method: "api",
          permit_number: permitNumber,
          message: "ArcGIS query failed, returning UNKNOWN",
          error: msg,
          timestamp: new Date().toISOString(),
        })
      );
      return this.indeterminate(permitNumber, `ArcGIS API error: ${msg}`);
    }
  }

  // ── ArcGIS Feature Service ─────────────────────────────────────────────────

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const params = new URLSearchParams({
      where:             `PERMIT_ID=${sqlQuote(permitNumber)}`,
      outFields:         OUT_FIELDS,
      returnGeometry:    "false",
      resultRecordCount: "1",
      f:                 "json",
    });
    const url = `${API_URL}?${params.toString()}`;

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

    const data = await res.json() as ArcGisResponse;

    // ArcGIS reports query errors with HTTP 200 and an `error` object, so a
    // bad request would otherwise look like "permit not found".
    if (data.error) {
      throw new Error(
        `ArcGIS error ${data.error.code ?? "?"}: ${data.error.message ?? "unknown"}`
      );
    }

    const attrs = data.features?.[0]?.attributes;
    if (!attrs) return null;

    const rawText     = (attrs.CURRENT_TASK_STATUS ?? "").trim();
    const currentTask = (attrs.CURRENT_TASK        ?? "").trim();
    const scrapeUrl   = (attrs.ACCELA_CITIZEN_ACCESS_URL ?? "").trim() || PORTAL_URL;

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      "found in layer, no current task status recorded",
        scrape_url:    scrapeUrl,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:         "info",
        scraper:       "Cleveland, OH",
        method:        "api",
        permit_number: permitNumber,
        current_task:  currentTask || null,
        task_status:   rawText,
        permit_type:   (attrs.PERMIT_TYPE     ?? "").trim() || null,
        site_address:  (attrs.PRIMARY_ADDRESS ?? "").trim() || null,
        issue_date:    attrs.ISSUE_DATE
          ? new Date(attrs.ISSUE_DATE).toISOString().slice(0, 10)
          : null,
        status,
        timestamp:     new Date().toISOString(),
      })
    );

    return {
      permit_number: permitNumber,
      status,
      // Include the workflow stage — "Inspection / Inspection Pending" is far
      // more legible in the UI and in status_history than the status alone.
      raw_text:   currentTask ? `${currentTask} / ${rawText}` : rawText,
      scrape_url: scrapeUrl,
    };
  }

  // ── Fallback result ────────────────────────────────────────────────────────

  private indeterminate(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Cleveland, OH",
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
    return this.matchStatus(rawText, CLEVELAND_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}
