// Philadelphia, PA — eCLIPSE permit scraper
//
// PRIMARY:  Philadelphia eCLIPSE public API (no browser required)
// FALLBACK: pendingFallback — API is public; no Playwright fallback needed
//
// The eCLIPSE API is a public endpoint — no auth required.
//
// Endpoint: GET https://li.phila.gov/api/permits?permit_number={permitNumber}
// Response: JSON array; check data[0] for permit details
// Status fields: permit_status or status (try both)
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

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Philadelphia, PA",
  state:    "PA",
  handles:  ["philadelphia", "philly"],
};

// eCLIPSE public API — primary (and only) method
const API_URL = "https://li.phila.gov/api/permits";

// Reference URL for fallback logs (no Playwright fallback; used in pendingFallback only)
const PORTAL_URL = "https://li.phila.gov/license-inspections/verify";

// ── Status mapping ────────────────────────────────────────────────────────────

const PHILADELPHIA_STATUS_MAP: Record<string, PermitStatus> = {
  // ── Primary mappings ──────────────────────────────────────────────────────

  // Permit issued and active — work may proceed
  "ISSUED":                    "APPROVED",
  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",
  "PERMIT ISSUED":             "APPROVED",

  // Work finished / final inspection passed
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",
  "CLOSED":                    "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "FINAL INSPECTION":          "CLEARED",

  // Application received, not yet reviewed / under review
  "UNDER REVIEW":              "PENDING",
  "IN REVIEW":                 "PENDING",
  "PENDING":                   "PENDING",
  "SUBMITTED":                 "PENDING",
  "APPLICATION":               "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "IN QUEUE":                  "PENDING",
  "INTAKE":                    "PENDING",
  "PLAN REVIEW":               "PENDING",
  "PLAN CHECK":                "PENDING",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "ZONING REVIEW":             "UNDER_REVIEW",
  "ZONING":                    "UNDER_REVIEW",
  "L&I REVIEW":                "UNDER_REVIEW",

  // Permit lapsed
  "EXPIRED":                   "EXPIRED",
  "LAPSED":                    "EXPIRED",

  // Denied / cancelled
  "DENIED":                    "REJECTED",
  "REJECTED":                  "REJECTED",
  "WITHDRAWN":                 "REJECTED",
  "REVOKED":                   "REJECTED",
  "CANCELLED":                 "REJECTED",
  "VOID":                      "REJECTED",
  "VOIDED":                    "REJECTED",
};

// ── Scraper class ─────────────────────────────────────────────────────────────

export class PhiladelphiaPaScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    // API is public — call it directly; pendingFallback on failure
    try {
      const result = await this.scrapeViaApi(permitNumber);
      if (result) return result;
      // null means permit not found in API
      return this.pendingFallback(
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
          message: "eCLIPSE API failed, returning PENDING fallback",
          error: apiErr instanceof Error ? apiErr.message : String(apiErr),
          timestamp: new Date().toISOString(),
        })
      );
      return this.pendingFallback(
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
    const url = `${API_URL}?permit_number=${encodeURIComponent(permitNumber)}`;

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

    // Response may be a root array or an object with a data array
    let record: Record<string, unknown> | null = null;

    if (Array.isArray(data) && data.length > 0) {
      record = data[0] as Record<string, unknown>;
    } else if (
      data !== null &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const obj = data as Record<string, unknown>;
      // Handle { data: [...] } wrapper
      if (Array.isArray(obj.data) && (obj.data as unknown[]).length > 0) {
        record = (obj.data as Record<string, unknown>[])[0];
      }
    }

    if (!record) {
      // Permit not found
      return null;
    }

    // Try both field names: permit_status and status
    const rawText = (
      ((record.permit_status as string) ?? "").trim() ||
      ((record.status        as string) ?? "").trim()
    );

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "PENDING",
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

  private pendingFallback(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Philadelphia, PA",
        permit_number: permitNumber,
        message: "Using PENDING fallback — manual check may be required",
        reason,
        portal_url: PORTAL_URL,
        timestamp: new Date().toISOString(),
      })
    );
    return {
      permit_number: permitNumber,
      status:        "PENDING",
      raw_text:      "manual check required",
      scrape_url:    PORTAL_URL,
    };
  }

  // ── Status mapping ─────────────────────────────────────────────────────────

  private mapStatus(rawText: string): PermitStatus {
    const key = rawText.toUpperCase().trim();

    for (const [portalText, status] of Object.entries(PHILADELPHIA_STATUS_MAP)) {
      if (key === portalText || key.includes(portalText)) {
        return status;
      }
    }

    return this.normalizeStatus(rawText);
  }
}
