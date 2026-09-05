// Seattle, WA — Department of Construction & Inspections permit lookup (Socrata)
//
// API-ONLY. There is no browser path and there must not be one.
//
// Dataset: "Building Permits" (76t5-zqzr)
//   https://data.seattle.gov/resource/76t5-zqzr.json
//
// Lookup field: permitnum      — e.g. "7083427-CN"
// Status field: statuscurrent  — e.g. "Ready for Issuance"
// Deep link:    link           — Accela record page on services.seattle.gov
//
// Verified 2026-09-04: 7083427-CN → statuscurrent "Ready for Issuance",
// 9403 9TH AVE SW. Dataset holds 192,783 rows, refreshed daily; permitnum is
// unique (no permit has more than one row).
//
// ── WHY THIS CITY MATTERS ────────────────────────────────────────────────────
// Seattle exposes the richest pre-issuance vocabulary of any source we have —
// Initiated, Ready for Intake, Scheduled, Application Completed, Reviews In
// Process, Corrections Required, Additional Info Requested, Awaiting
// Information, Reviews Completed, Ready for Issuance. Those are exactly the
// states our users are waiting on. See SEATTLE_STATUS_MAP for how each maps,
// and for the one distinction (applicant-must-act vs city-is-working) that the
// PermitStatus union cannot express.
//
// ── DEEP LINK ────────────────────────────────────────────────────────────────
// Every row carries a `link` to the Accela record. The URL is also constructable
// from the permit number, so when the column is empty we build it instead of
// falling back to a generic portal page.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";
import { SEATTLE_STATUS_MAP } from "../../lib/permit-status";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Seattle, WA",
  state:    "WA",
  handles:  ["seattle"],
};

const API_URL = "https://data.seattle.gov/resource/76t5-zqzr.json";

/** Per-permit Accela record page — the same URL the dataset's `link` column carries. */
function recordUrl(permitNumber: string): string {
  return `https://services.seattle.gov/portal/customize/LinkToRecord.aspx?altId=${encodeURIComponent(permitNumber.trim())}`;
}

// ── Scraper class ─────────────────────────────────────────────────────────────

export class SeattleWaScraper extends BaseScraper {
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
        "Permit not found in Seattle Building Permits dataset"
      );
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Seattle, WA",
          method: "api",
          permit_number: permitNumber,
          message: "Socrata query failed, returning UNKNOWN",
          error: msg,
          timestamp: new Date().toISOString(),
        })
      );
      return this.indeterminate(permitNumber, `Socrata API error: ${msg}`);
    }
  }

  // ── Socrata Open Data API ──────────────────────────────────────────────────

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const url =
      `${API_URL}?permitnum=${encodeURIComponent(permitNumber.trim())}&$limit=1`;

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

    const rows = await res.json() as Record<string, unknown>[];
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const row     = rows[0];
    const rawText = ((row.statuscurrent as string) ?? "").trim();

    const scrapeUrl = extractLink(row.link) || recordUrl(permitNumber);

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      "found in dataset, statuscurrent empty",
        scrape_url:    scrapeUrl,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:          "info",
        scraper:        "Seattle, WA",
        method:         "api",
        permit_number:  permitNumber,
        status_current: rawText,
        permit_type:    ((row.permittypedesc   as string) ?? "").trim() || null,
        permit_class:   ((row.permitclass      as string) ?? "").trim() || null,
        site_address:   ((row.originaladdress1 as string) ?? "").trim() || null,
        applied_date:   ((row.applieddate      as string) ?? "").trim().slice(0, 10) || null,
        issued_date:    ((row.issueddate       as string) ?? "").trim().slice(0, 10) || null,
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
        scraper: "Seattle, WA",
        permit_number: permitNumber,
        message: "Scrape indeterminate — returning UNKNOWN so health tracking counts it as a failure",
        reason,
        portal_url: recordUrl(permitNumber),
        timestamp: new Date().toISOString(),
      })
    );
    return {
      permit_number: permitNumber,
      status:        "UNKNOWN",
      raw_text:      reason,
      scrape_url:    recordUrl(permitNumber),
    };
  }

  // ── Status mapping ─────────────────────────────────────────────────────────

  private mapStatus(rawText: string): PermitStatus {
    // Exact match first, then longest-substring — see BaseScraper.matchStatus().
    return this.matchStatus(rawText, SEATTLE_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Socrata serialises URL columns either as a bare string or as { url: "..." }
 * depending on the column type. Seattle's `link` is the object form today;
 * handle both rather than assuming one.
 */
function extractLink(link: unknown): string {
  if (typeof link === "string") return link.trim();
  if (link && typeof link === "object" && "url" in link) {
    const url = (link as { url?: unknown }).url;
    if (typeof url === "string") return url.trim();
  }
  return "";
}
