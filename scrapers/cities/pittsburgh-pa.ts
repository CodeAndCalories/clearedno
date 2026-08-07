// Pittsburgh, PA — Bureau of Building Inspection permit lookup (CKAN / WPRDC)
//
// API-ONLY. There is no browser path and there must not be one.
//
// Source: Western Pennsylvania Regional Data Center → "PLI Permits"
//   package:  https://data.wprdc.org/dataset/pli-permits
//   endpoint: https://data.wprdc.org/api/3/action/datastore_search
//   resource: f4d1177a-f597-4c32-8cbf-7885f56253f6  (CSV, datastore_active)
//
// Lookup field: permit_id  — e.g. "BDA-2026-03807"
// Status field: status
//
// Verified 2026-08-07: BDA-2026-03807 → status "Amendment Review",
// 4481 CASSABILL DR. Resource confirmed datastore_active with 64,139 rows.
//
// ── WHY THIS CITY MATTERS MOST ────────────────────────────────────────────────
// Pittsburgh is the only source we have that publishes genuine PRE-ISSUANCE
// workflow states — In Review, Ready For Issue, Applicant Revisions, Amendment
// Review, Application Finalization. Every other city effectively only tells us
// about permits that have already been issued. These are precisely the states
// our users are waiting on, so they are mapped individually and deliberately:
//
//   Ready For Issue  → PENDING       approved, not yet issued; work may NOT start
//   In Review        → UNDER_REVIEW  sitting with a reviewer
//   * Revisions      → UNDER_REVIEW  ball is in the applicant's court
//   Stop Work        → UNDER_REVIEW  issued but halted — needs attention
//
// "Ready For Issue" is PENDING rather than APPROVED on purpose: telling a
// contractor a permit is APPROVED when they cannot legally start work is
// exactly the class of confidently-wrong answer this codebase avoids.
//
// ── NO DEEP LINK ──────────────────────────────────────────────────────────────
// This dataset exposes no per-permit record URL, so scrape_url falls back to
// the WPRDC dataset page. (Cleveland/Columbus supply Accela links; Cincinnati
// supplies CAGIS links; Pittsburgh has no equivalent.)
// ─────────────────────────────────────────────────────────────────────────────

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";
import { PITTSBURGH_STATUS_MAP } from "../../lib/permit-status";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Pittsburgh, PA",
  state:    "PA",
  handles:  ["pittsburgh"],
};

const API_URL     = "https://data.wprdc.org/api/3/action/datastore_search";
const RESOURCE_ID = "f4d1177a-f597-4c32-8cbf-7885f56253f6";

/** Public dataset page — this source has no per-permit record URL. */
const PORTAL_URL = "https://data.wprdc.org/dataset/pli-permits";

// ── CKAN response shape ───────────────────────────────────────────────────────

interface CkanRecord {
  permit_id?:   string | null;
  status?:      string | null;
  permit_type?: string | null;
  address?:     string | null;
  issue_date?:  string | null;
}

interface CkanResponse {
  success?: boolean;
  error?:   { message?: string; __type?: string };
  result?:  { records?: CkanRecord[] };
}

// ── Scraper class ─────────────────────────────────────────────────────────────

export class PittsburghPaScraper extends BaseScraper {
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
        "Permit not found in WPRDC PLI Permits datastore"
      );
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Pittsburgh, PA",
          method: "api",
          permit_number: permitNumber,
          message: "CKAN query failed, returning UNKNOWN",
          error: msg,
          timestamp: new Date().toISOString(),
        })
      );
      return this.indeterminate(permitNumber, `CKAN API error: ${msg}`);
    }
  }

  // ── CKAN datastore_search ──────────────────────────────────────────────────
  //
  // `filters` is a JSON object of exact-match field constraints. Using it (over
  // datastore_search_sql) means the permit number is passed as data, never
  // interpolated into SQL, so no escaping is required.

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const params = new URLSearchParams({
      resource_id: RESOURCE_ID,
      filters:     JSON.stringify({ permit_id: permitNumber.trim() }),
      limit:       "1",
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

    const data = await res.json() as CkanResponse;

    // CKAN signals failure with success:false rather than an HTTP error code.
    if (data.success === false) {
      throw new Error(`CKAN error: ${data.error?.message ?? data.error?.__type ?? "unknown"}`);
    }

    const record = data.result?.records?.[0];
    if (!record) return null;

    const rawText = (record.status ?? "").trim();

    if (!rawText) {
      return {
        permit_number: permitNumber,
        status:        "UNKNOWN",
        raw_text:      "found in datastore, status field empty",
        scrape_url:    PORTAL_URL,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:         "info",
        scraper:       "Pittsburgh, PA",
        method:        "api",
        permit_number: permitNumber,
        raw_status:    rawText,
        permit_type:   (record.permit_type ?? "").trim() || null,
        site_address:  (record.address     ?? "").trim() || null,
        issue_date:    (record.issue_date  ?? "").trim() || null,
        status,
        timestamp:     new Date().toISOString(),
      })
    );

    return {
      permit_number: permitNumber,
      status,
      raw_text:   rawText,
      scrape_url: PORTAL_URL,
    };
  }

  // ── Fallback result ────────────────────────────────────────────────────────

  private indeterminate(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Pittsburgh, PA",
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
    return this.matchStatus(rawText, PITTSBURGH_STATUS_MAP)
        ?? this.normalizeStatus(rawText);
  }
}
