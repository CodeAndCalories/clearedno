// Detroit, MI — BSEED building permit lookup (ArcGIS, two layers)
//
// API-ONLY. There is no browser path and there must not be one.
//
// Detroit was written off as "publishes permits but no status field" because
// the obvious dataset — Building Permits — really has none: every row in it is
// an issued permit. The pre-issuance workflow lives in a SEPARATE layer that
// tracks the plan-review task for each application. Together the two layers
// give a complete lifecycle:
//
//   Plan reviews (pre-issuance)
//     https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/bseed_building_permit_plan_reviews/FeatureServer/0
//     Lookup: record_id   Status: task_status   Stage: task
//     One row per record (verified: max rows per record_id is 1).
//
//   Building permits (issued)
//     https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/bseed_building_permits/FeatureServer/0
//     Lookup: record_id   Status: none — presence + issued_date means issued.
//     Verified: 0 of 46,904 rows lack an issued_date.
//
// Record IDs look like "BLD2026-01450" (commercial) or "RES2026-03142"
// (residential). Both layers refresh daily.
//
// Verified 2026-09-04:
//   BLD2026-01450 → reviews: "Plans Distribution / Routed for Electronic
//                   Review" (2026-09-03), absent from permits → UNDER_REVIEW
//   RES2026-03142 → permits: issued 2026-09-03, absent from reviews → APPROVED
//   BLD2020-02531 → in BOTH: reviews "Plans Approved", permits issued
//                   2020-08-10 → APPROVED (the permits layer wins)
//
// ── RESOLUTION ORDER ─────────────────────────────────────────────────────────
// Both layers are queried in parallel. If the permits layer has the record
// with an issued_date, the permit is issued — that is the later state, and the
// reviews row ("Plans Approved") describes a stage it has already passed.
// Otherwise the reviews row's task_status is the current state. A record in
// neither layer is not found.
//
// ── NO DEEP LINK ──────────────────────────────────────────────────────────────
// Neither layer exposes a per-record URL, and BSEED's Accela portal keys
// records by an internal CAP ID we don't have. scrape_url is the portal's
// public search page.
//
// ── QUERY FORM ────────────────────────────────────────────────────────────────
// ArcGIS `where` is SQL. The record id MUST be quoted, and embedded single
// quotes doubled, or the value parses as a column name and the service 400s.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";
import { DETROIT_STATUS_MAP } from "../../lib/permit-status";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Detroit, MI",
  state:    "MI",
  handles:  ["detroit"],
};

const SERVICE_BASE =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services";
const REVIEWS_URL = `${SERVICE_BASE}/bseed_building_permit_plan_reviews/FeatureServer/0/query`;
const PERMITS_URL = `${SERVICE_BASE}/bseed_building_permits/FeatureServer/0/query`;

/** BSEED's Accela Citizen Access portal — public search, no per-record URL. */
const PORTAL_URL = "https://aca-prod.accela.com/DETROIT/Default.aspx";

const REVIEW_FIELDS = [
  "record_id",
  "task",
  "task_status",
  "task_status_date",
  "submitted_date",
  "address",
].join(",");

const PERMIT_FIELDS = [
  "record_id",
  "permit_type",
  "submitted_date",
  "issued_date",
  "address",
].join(",");

/** Escape a value for safe interpolation into a single-quoted SQL literal. */
function sqlQuote(value: string): string {
  return `'${value.trim().replace(/'/g, "''")}'`;
}

// ── ArcGIS response shapes ────────────────────────────────────────────────────

interface ReviewAttributes {
  record_id?:        string | null;
  task?:             string | null;
  task_status?:      string | null;
  task_status_date?: string | null;
  submitted_date?:   string | null;
  address?:          string | null;
}

interface PermitAttributes {
  record_id?:      string | null;
  permit_type?:    string | null;
  submitted_date?: string | null;
  issued_date?:    string | null;
  address?:        string | null;
}

interface ArcGisResponse<T> {
  features?: { attributes?: T }[];
  error?:    { code?: number; message?: string };
}

// ── Scraper class ─────────────────────────────────────────────────────────────

export class DetroitMiScraper extends BaseScraper {
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
        "Record not found in Detroit BSEED plan-review or building-permit layers"
      );
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Detroit, MI",
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

  // ── ArcGIS Feature Services ────────────────────────────────────────────────

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    // Record ids in both layers are upper-case; users type them either way.
    const recordId = permitNumber.trim().toUpperCase();
    const where    = `record_id=${sqlQuote(recordId)}`;

    const [permit, review] = await Promise.all([
      this.queryLayer<PermitAttributes>(PERMITS_URL, where, PERMIT_FIELDS, "issued_date DESC"),
      this.queryLayer<ReviewAttributes>(REVIEWS_URL, where, REVIEW_FIELDS, "task_status_date DESC"),
    ]);

    if (!permit && !review) return null;

    // ── Issued: the permits layer wins ───────────────────────────────────────
    const issuedDate = (permit?.issued_date ?? "").trim();
    if (permit && issuedDate) {
      const status = this.mapStatus("Issued");

      console.error(
        JSON.stringify({
          level:         "info",
          scraper:       "Detroit, MI",
          method:        "api",
          layer:         "building_permits",
          permit_number: permitNumber,
          issued_date:   issuedDate,
          permit_type:   (permit.permit_type ?? "").trim() || null,
          site_address:  (permit.address     ?? "").trim() || null,
          review_stage:  review
            ? `${(review.task ?? "").trim()} / ${(review.task_status ?? "").trim()}`
            : null,
          status,
          timestamp:     new Date().toISOString(),
        })
      );

      return {
        permit_number: permitNumber,
        status,
        raw_text:   `Issued ${issuedDate}`,
        scrape_url: PORTAL_URL,
      };
    }

    // ── Pre-issuance: the plan-review task is the current state ──────────────
    const rawText = (review?.task_status ?? "").trim();
    const task    = (review?.task        ?? "").trim();

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      permit
          ? "found in building_permits layer with no issued_date and no plan-review task"
          : "found in plan_reviews layer, task_status empty",
        scrape_url:    PORTAL_URL,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:            "info",
        scraper:          "Detroit, MI",
        method:           "api",
        layer:            "building_permit_plan_reviews",
        permit_number:    permitNumber,
        task:             task || null,
        task_status:      rawText,
        task_status_date: (review?.task_status_date ?? "").trim() || null,
        submitted_date:   (review?.submitted_date   ?? "").trim() || null,
        site_address:     (review?.address          ?? "").trim() || null,
        status,
        timestamp:        new Date().toISOString(),
      })
    );

    return {
      permit_number: permitNumber,
      status,
      // Include the workflow stage — "Plans Distribution / Routed for
      // Electronic Review" is far more legible than the status alone.
      raw_text:   task ? `${task} / ${rawText}` : rawText,
      scrape_url: PORTAL_URL,
    };
  }

  private async queryLayer<T>(
    url: string,
    where: string,
    outFields: string,
    orderBy: string
  ): Promise<T | null> {
    const params = new URLSearchParams({
      where,
      outFields,
      orderByFields:     orderBy,
      returnGeometry:    "false",
      resultRecordCount: "1",
      f:                 "json",
    });

    const res = await fetch(`${url}?${params.toString()}`, {
      headers: {
        "Accept":     "application/json",
        "User-Agent": "ClearedNo/1.0 (permit status monitor; support@clearedno.com)",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json() as ArcGisResponse<T>;

    // ArcGIS reports query errors with HTTP 200 and an `error` object, so a
    // bad request would otherwise look like "record not found".
    if (data.error) {
      throw new Error(
        `ArcGIS error ${data.error.code ?? "?"}: ${data.error.message ?? "unknown"}`
      );
    }

    return data.features?.[0]?.attributes ?? null;
  }

  // ── Fallback result ────────────────────────────────────────────────────────

  private indeterminate(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Detroit, MI",
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
    return this.matchStatus(rawText, DETROIT_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}
