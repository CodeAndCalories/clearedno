// Cincinnati, OH — Buildings & Inspections permit lookup (Socrata)
//
// API-ONLY. There is no browser path and there must not be one.
//
// Dataset: "Cincinnati Building Permits" (uhjb-xac9)
//   https://data.cincinnati-oh.gov/resource/uhjb-xac9.json
//
// Lookup field:  permitnum            — e.g. "2026P06504"
// Status fields: statuscurrent        — raw code, e.g. "ISSUED", "WITHDRWN"
//                statuscurrentmapped  — human label, e.g. "Permit Issued"
// Deep link:     link                 — CAGIS record page for the permit
//
// Verified 2026-08-07: 2026P06504 → statuscurrent "ISSUED",
// statuscurrentmapped "Permit Issued", 170 WILDWOOD ST.
//
// ── WHY BOTH STATUS FIELDS ───────────────────────────────────────────────────
// statuscurrentmapped is preferred because it is the human-readable label, but
// it is NOT a superset: values like "ENGRCHNG" and "TEMPCOFO" appear only in
// statuscurrent. Both vocabularies are therefore enumerated in the map below,
// and we fall back to the raw code whenever the mapped label is absent.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";
import { CINCINNATI_STATUS_MAP } from "../../lib/permit-status";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Cincinnati, OH",
  state:    "OH",
  handles:  ["cincinnati"],
};

const API_URL = "https://data.cincinnati-oh.gov/resource/uhjb-xac9.json";

/** Public portal — used for scrape_url when the dataset has no CAGIS link. */
const PORTAL_URL = "https://www.cincinnati-oh.gov/buildings/";

// ── Scraper class ─────────────────────────────────────────────────────────────

export class CincinnatiOhScraper extends BaseScraper {
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
        "Permit not found in Cincinnati Building Permits dataset"
      );
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Cincinnati, OH",
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

    const row = rows[0];

    // Prefer the human label; fall back to the raw code, which carries values
    // the mapped column omits entirely.
    const mapped = ((row.statuscurrentmapped as string) ?? "").trim();
    const code   = ((row.statuscurrent       as string) ?? "").trim();
    const rawText = mapped || code;

    const scrapeUrl = extractLink(row.link) || PORTAL_URL;

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      "found in dataset, status fields empty",
        scrape_url:    scrapeUrl,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:          "info",
        scraper:        "Cincinnati, OH",
        method:         "api",
        permit_number:  permitNumber,
        status_current: code   || null,
        status_mapped:  mapped || null,
        permit_type:    ((row.permittypemapped as string) ?? "").trim() || null,
        site_address:   ((row.originaladdress1 as string) ?? "").trim() || null,
        issued_date:    ((row.issueddate       as string) ?? "").trim() || null,
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
        scraper: "Cincinnati, OH",
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
    return this.matchStatus(rawText, CINCINNATI_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Socrata serialises URL columns either as a bare string or as { url: "..." }
 * depending on the column type. Handle both rather than assuming one.
 */
function extractLink(link: unknown): string {
  if (typeof link === "string") return link.trim();
  if (link && typeof link === "object" && "url" in link) {
    const url = (link as { url?: unknown }).url;
    if (typeof url === "string") return url.trim();
  }
  return "";
}
