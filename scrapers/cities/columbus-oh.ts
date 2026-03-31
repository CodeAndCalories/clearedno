// Columbus, OH — Columbus Accela permit scraper
//
// PRIMARY:  Columbus Accela REST API
// FALLBACK: Columbus Accela citizen portal via Playwright
//
// The Accela REST API is the preferred method — no browser required, fast
// response times, and no bot-detection issues.
//
// API endpoint: GET https://permits.columbus.gov/apis/v1/search/permits/{permitNumber}
// Status fields: result.status or result.record_status (try both)
//
// ── HOW TO UPDATE SELECTORS (Playwright fallback) ─────────────────────────────
// If the portal fallback needs updating:
//   1. Open https://permits.columbus.gov in Chrome
//   2. Search for a known permit number manually
//   3. Right-click the search input → Inspect → copy its id/name/placeholder
//   4. Right-click the status element → Inspect → copy its selector
//   5. Update SEL.permitInput and SEL.statusCell below
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Columbus, OH",
  state:    "OH",
  handles:  ["columbus"],
};

// Accela REST API — primary method
const API_URL = "https://permits.columbus.gov/apis/v1/search/permits";

// Portal fallback
const PORTAL_URL = "https://permits.columbus.gov";

// ── Selectors (Playwright fallback only) ──────────────────────────────────────
//
// The Columbus portal is an Accela Citizen Access SPA.
// Selectors are ordered most-specific-first; the last entry is a broad fallback.

const SEL = {
  // Accela Citizen Access permit number field.
  permitInput: [
    'input[id*="RecordNum"]',
    'input[id*="recordNum"]',
    'input[id*="txtSearch"]',
    'input[id*="PermitNum"]',
    'input[id*="permitNum"]',
    'input[placeholder*="Record Number"]',
    'input[placeholder*="Permit Number"]',
    'input[placeholder*="Permit"]',
    'input[placeholder*="record"]',
    'input[id*="permit"]',
    'input[id*="record"]',
    'input[name*="permit"]',
    'input[name*="record"]',
    'input[type="text"]',   // broadest fallback — first visible text input
  ].join(", "),

  searchButton: [
    'button[type="submit"]',
    'input[type="submit"]',
    'a:has-text("Search")',
    'button:has-text("Search")',
    'button:has-text("Find")',
    'button:has-text("Submit")',
    'button:has-text("Look Up")',
  ].join(", "),

  statusCell: [
    'td[data-label="Status"]',
    'td[data-label="Record Status"]',
    'td[data-label="Permit Status"]',
    '.record-status',
    '[class*="status-value"]',
    '[class*="permit-status"]',
    '[class*="record-status"]',
    'td:nth-child(5)',
    'td:nth-child(4)',
  ].join(", "),

  resultsContainer: [
    '.search-results',
    'table[class*="result"]',
    '[class*="records-table"]',
    '[class*="permit-list"]',
    '[id*="searchResults"]',
    '[id*="searchResult"]',
    'tbody tr',
    'table',
  ].join(", "),
};

// ── Status mapping ────────────────────────────────────────────────────────────

const COLUMBUS_STATUS_MAP: Record<string, PermitStatus> = {
  // ── Primary mappings ──────────────────────────────────────────────────────

  // Permit issued and active — work may proceed
  "ISSUED":                    "APPROVED",
  "ACTIVE":                    "APPROVED",
  "APPROVED":                  "APPROVED",

  // Work finished / final inspection passed
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",
  "COMPLETED":                 "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "CLOSED":                    "CLEARED",
  "FINAL INSPECTION":          "CLEARED",

  // Application received, not yet reviewed
  "APPLIED":                   "PENDING",
  "PENDING":                   "PENDING",
  "SUBMITTED":                 "PENDING",
  "APPLICATION":               "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "IN QUEUE":                  "PENDING",
  "INTAKE":                    "PENDING",

  // Permit voided / withdrawn
  "VOIDED":                    "REJECTED",
  "VOID":                      "REJECTED",
  "CANCELLED":                 "REJECTED",

  // Under review / on hold
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "PLAN CHECK":                "UNDER_REVIEW",
  "PLAN REVIEW":               "UNDER_REVIEW",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "INSPECTION":                "UNDER_REVIEW",

  // Permit lapsed without final inspection
  "EXPIRED":                   "EXPIRED",
  "LAPSED":                    "EXPIRED",

  // Denied / rejected
  "DENIED":                    "REJECTED",
  "REJECTED":                  "REJECTED",
  "WITHDRAWN":                 "REJECTED",
  "REVOKED":                   "REJECTED",
};

// ── Scraper class ─────────────────────────────────────────────────────────────

export class ColumbusOhScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    // ── 1. Try Accela REST API first ───────────────────────────────────────
    try {
      const result = await this.scrapeViaApi(permitNumber);
      if (result) return result;
      // null means permit not found in API — fall through to portal
    } catch (apiErr) {
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Columbus, OH",
          method: "api",
          permit_number: permitNumber,
          message: "Accela API failed, falling back to portal",
          error: apiErr instanceof Error ? apiErr.message : String(apiErr),
          timestamp: new Date().toISOString(),
        })
      );
    }

    // ── 2. Fall back to Playwright portal scrape ───────────────────────────
    return this.scrapeViaPortal(permitNumber);
  }

  // ── Accela REST API ────────────────────────────────────────────────────────
  // Returns null if the permit isn't found (caller falls back to portal).
  // Throws on network / parse errors (caller catches and falls back to portal).

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const url = `${API_URL}/${encodeURIComponent(permitNumber)}`;

    const res = await fetch(url, {
      headers: {
        "Accept":     "application/json",
        "User-Agent": "ClearedNo/1.0 (permit status monitor; support@clearedno.com)",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status === 404) {
      // Permit not found in API — fall back to portal
      return null;
    }

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json() as Record<string, unknown>;

    // Try both status field names: result.status and result.record_status
    const rawText = (
      ((data.status         as string) ?? "").trim() ||
      ((data.record_status  as string) ?? "").trim()
    );

    if (!rawText) {
      // Record found but status field empty — report as PENDING
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
        scraper:       "Columbus, OH",
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

  // ── Playwright portal fallback ─────────────────────────────────────────────

  private async scrapeViaPortal(permitNumber: string): Promise<ScrapeResult> {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1280, height: 800 },
      });
      const page = await context.newPage();

      // Step 1: Load search page
      try {
        await page.goto(PORTAL_URL, {
          waitUntil: "domcontentloaded",
          timeout:   60_000,
        });
      } catch (navErr) {
        return this.pendingFallback(
          permitNumber,
          `Navigation failed: ${navErr instanceof Error ? navErr.message : String(navErr)}`
        );
      }

      // Give the SPA time to hydrate
      await page.waitForTimeout(3000);

      // Step 2: Fill permit number
      try {
        let filled = false;

        // Attempt 1: use the ordered selector list
        try {
          const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 8_000 });
          await inputEl.fill(permitNumber.trim());
          filled = true;
        } catch {
          // Attempt 2: try any visible text input via Playwright locator
          const inputs = page.locator('input[type="text"]:visible, input:not([type]):visible');
          const count  = await inputs.count();
          if (count > 0) {
            await inputs.first().fill(permitNumber.trim());
            filled = true;
          }
        }

        if (!filled) {
          return this.pendingFallback(
            permitNumber,
            "Permit number input field not found. Check SEL.permitInput selector."
          );
        }
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Permit number input field not found. Check SEL.permitInput selector."
        );
      }

      await page.waitForTimeout(400);

      // Step 3: Submit
      try {
        const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
        await searchBtn.click();
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Search button not found. Check SEL.searchButton selector."
        );
      }

      // Step 4: Wait for results
      try {
        await page.waitForSelector(
          `${SEL.resultsContainer}, [class*="no-result"], [class*="error"], [class*="not-found"], [class*="empty"]`,
          { timeout: 20_000 }
        );
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Results container did not appear after search."
        );
      }

      // Step 5: Extract status
      let rawText = "";

      try {
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        try {
          const bodyText = await page.locator("body").innerText({ timeout: 5_000 });
          rawText = extractStatusFromBody(bodyText, permitNumber);
        } catch {
          return this.pendingFallback(
            permitNumber,
            "Could not extract page text."
          );
        }
      }

      if (!rawText || rawText.trim() === "") {
        return this.pendingFallback(
          permitNumber,
          "Status text not found. Permit may not exist or selectors need updating."
        );
      }

      const scrapeUrl = page.url();
      const status    = this.mapStatus(rawText);

      return {
        permit_number: permitNumber,
        status,
        raw_text:   rawText.trim(),
        scrape_url: scrapeUrl,
      };

    } finally {
      await browser.close().catch(() => {});
    }
  }

  // ── Fallback result ────────────────────────────────────────────────────────

  private pendingFallback(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Columbus, OH",
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

    for (const [portalText, status] of Object.entries(COLUMBUS_STATUS_MAP)) {
      if (key === portalText || key.includes(portalText)) {
        return status;
      }
    }

    return this.normalizeStatus(rawText);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractStatusFromBody(bodyText: string, permitNumber: string): string {
  const escaped = permitNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`${escaped}[\\s\\S]{0,150}`, "i");
  const match = bodyText.match(re);
  if (match) return match[0];

  if (!bodyText.toLowerCase().includes(permitNumber.toLowerCase())) {
    return "";
  }

  return "";
}
