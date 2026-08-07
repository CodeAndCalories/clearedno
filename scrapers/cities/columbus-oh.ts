// Columbus, OH — Building & Zoning Services permit lookup (ArcGIS Feature Service)
//
// API-ONLY. There is no browser path and there must not be one.
//
// The previous implementation called https://aca.columbus.gov/apis/v1/... and
// fell back to Playwright against https://aca.columbus.gov. Both were dead:
// that host does not resolve, so every Columbus check burned a browser launch
// and returned UNKNOWN. It is replaced by the city's published open-data
// Feature Service, which answers in ~200ms with no auth.
//
// Service: City of Columbus Maps & Apps → "Building Permits"
//   https://services1.arcgis.com/9yy6msODkIBzkUXU/arcgis/rest/services/Building_Permits/FeatureServer/0
//
// Lookup field:  B1_ALT_ID       — the permit number as printed on the permit
// Status fields: PERMIT_STATUS   — lifecycle status ("Permit Issued")
//                B1_APPL_STATUS  — application status ("Issued"), used as
//                                  fallback when PERMIT_STATUS is empty
// Deep link:     ACA_URL         — real Citizen Access record URL, surfaced to
//                                  the user as scrape_url
//
// Verified 2026-08-07: RES permit RSWDR2611829 →
//   PERMIT_STATUS "Permit Issued", B1_APPL_STATUS "Issued",
//   SITE_ADDRESS "853 BLUFFWAY DR"
//
// ── QUERY FORM ────────────────────────────────────────────────────────────────
// ArcGIS `where` is SQL. The permit number MUST be quoted, and embedded single
// quotes doubled, or the value parses as a column name and the service 400s.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Columbus, OH",
  state:    "OH",
  handles:  ["columbus"],
};

const API_URL =
  "https://services1.arcgis.com/9yy6msODkIBzkUXU/arcgis/rest/services/Building_Permits/FeatureServer/0/query";

/** Public portal — used for scrape_url when ACA_URL is absent, and in logs. */
const PORTAL_URL = "https://www.columbus.gov/bzs";

/** Fields we ask for. Keep narrow — the layer has 24 columns we don't need. */
const OUT_FIELDS = [
  "B1_ALT_ID",
  "PERMIT_STATUS",
  "B1_APPL_STATUS",
  "B1_PER_TYPE",
  "SITE_ADDRESS",
  "ISSUED_DT",
  "ACA_URL",
].join(",");

/** Escape a value for safe interpolation into a single-quoted SQL literal. */
function sqlQuote(value: string): string {
  return `'${value.trim().replace(/'/g, "''")}'`;
}

// ── Status mapping ────────────────────────────────────────────────────────────
//
// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.
//
// The first two blocks are the COMPLETE live vocabularies of both status
// columns, verified against the service (counts as of 2026-08-07). Note that
// "Final Inspection Approved" MUST be an exact key: under substring matching it
// hits "APPROVED" and reports APPROVED, when it actually means the work passed
// final inspection and is CLEARED — the single most common status in the layer.

const COLUMBUS_STATUS_MAP: Record<string, PermitStatus> = {
  // ── PERMIT_STATUS — complete live vocabulary ──────────────────────────────

  "FINAL INSPECTION APPROVED":        "CLEARED",   // 463,992
  "CERTIFICATE OF OCCUPANCY ISSUED":  "CLEARED",   // 30,994
  "PERMIT ISSUED":                    "APPROVED",  // 166,784
  "EXPIRED PERMIT":                   "EXPIRED",   // 15,124

  // ── B1_APPL_STATUS — complete live vocabulary ─────────────────────────────

  "CLOSED":                  "CLEARED",      // 519,919
  "ISSUED":                  "APPROVED",     // 97,510
  "ISSUED ONLINE":           "APPROVED",     // 1
  "ACTIVE":                  "APPROVED",     // 511
  "OPEN":                    "APPROVED",     // 15
  "EXPIRED":                 "EXPIRED",      // 5,969
  "EXPIRED NO PERMIT":       "EXPIRED",      // 9
  "APPLIED ONLINE":          "PENDING",      // 6
  "ISSUANCE PENDING":        "PENDING",      // 4
  "CORRECTIONS REQUIRED":    "UNDER_REVIEW", // 3
  "UNDER REVIEW":            "UNDER_REVIEW", // 3
  "VOID":                    "REJECTED",     // 281
  "VOID - WRONG CAP TYPE":   "REJECTED",     // 715
  "VOID - DUPLICATE":        "REJECTED",     // 528
  "VOID - ENTERED IN ERROR": "REJECTED",     // 439
  "VOID - TEST":             "REJECTED",     // 8
  "WITHDRAWN":               "REJECTED",     // 39

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  // Not currently emitted by either column; retained so a future Columbus
  // status string lands somewhere sensible rather than UNKNOWN.

  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",

  "APPROVED":                  "APPROVED",

  "APPLICATION RECEIVED":      "PENDING",
  "APPLICATION":               "PENDING",
  "SUBMITTED":                 "PENDING",
  "PENDING":                   "PENDING",
  "IN QUEUE":                  "PENDING",
  "APPLIED":                   "PENDING",
  "INTAKE":                    "PENDING",

  "PLAN REVIEW":               "UNDER_REVIEW",
  "PLAN CHECK":                "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "INSPECTION":                "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "CANCELLED":                 "REJECTED",
  "REJECTED":                  "REJECTED",
  "REVOKED":                   "REJECTED",
  "VOIDED":                    "REJECTED",
  "DENIED":                    "REJECTED",
  "LAPSED":                    "EXPIRED",
};

// ── ArcGIS response shape ─────────────────────────────────────────────────────

interface ArcGisAttributes {
  B1_ALT_ID?:      string | null;
  PERMIT_STATUS?:  string | null;
  B1_APPL_STATUS?: string | null;
  B1_PER_TYPE?:    string | null;
  SITE_ADDRESS?:   string | null;
  ISSUED_DT?:      number | null;
  ACA_URL?:        string | null;
}

interface ArcGisResponse {
  features?: { attributes?: ArcGisAttributes }[];
  error?:    { code?: number; message?: string };
}

// ── Scraper class ─────────────────────────────────────────────────────────────

export class ColumbusOhScraper extends BaseScraper {
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
        "Permit not found in Columbus Building Permits feature service"
      );
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Columbus, OH",
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
  // Returns null if the permit isn't in the layer.
  // Throws on network / HTTP / service-level errors.

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const params = new URLSearchParams({
      where:          `B1_ALT_ID=${sqlQuote(permitNumber)}`,
      outFields:      OUT_FIELDS,
      returnGeometry: "false",
      resultRecordCount: "1",
      f:              "json",
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
    if (!attrs) {
      // Not in the layer — caller reports UNKNOWN.
      return null;
    }

    // PERMIT_STATUS is the lifecycle status and is preferred. B1_APPL_STATUS is
    // the application status, used only when the former is blank.
    const permitStatus = (attrs.PERMIT_STATUS  ?? "").trim();
    const applStatus   = (attrs.B1_APPL_STATUS ?? "").trim();
    const rawText      = permitStatus || applStatus;

    // "None" is Columbus's literal placeholder for "no status recorded" — it is
    // not a status, and must not be mapped to one.
    if (!rawText || rawText.toUpperCase() === "NONE") {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      "found in layer, no status recorded",
        scrape_url:    (attrs.ACA_URL ?? "").trim() || PORTAL_URL,
      };
    }

    const status = this.mapStatus(rawText);

    // Prefer the city's own Citizen Access deep link so the UI points at the
    // real record rather than a raw ArcGIS query URL.
    const scrapeUrl = (attrs.ACA_URL ?? "").trim() || PORTAL_URL;

    console.error(
      JSON.stringify({
        level:          "info",
        scraper:        "Columbus, OH",
        method:         "api",
        permit_number:  permitNumber,
        permit_status:  permitStatus || null,
        appl_status:    applStatus   || null,
        permit_type:    (attrs.B1_PER_TYPE  ?? "").trim() || null,
        site_address:   (attrs.SITE_ADDRESS ?? "").trim() || null,
        issued_date:    attrs.ISSUED_DT
          ? new Date(attrs.ISSUED_DT).toISOString().slice(0, 10)
          : null,
        status,
        timestamp:      new Date().toISOString(),
      })
    );

    return {
      permit_number: permitNumber,
      status,
      raw_text:   rawText,
      scrape_url: scrapeUrl,
    };
  }

  // ── Fallback result ────────────────────────────────────────────────────────

  private indeterminate(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Columbus, OH",
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
    return this.matchStatus(rawText, COLUMBUS_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}
