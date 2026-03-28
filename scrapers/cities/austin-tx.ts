// Austin, TX — Build + Development Services permit scraper
//
// PRIMARY:  Austin Open Data API (fast, no browser)
// FALLBACK: Austin Build Central (ABC) portal via Playwright
//
// The Open Data API is a public Socrata endpoint — no auth required, sub-second
// response times, and no bot-detection issues. We prefer it over the portal.
//
// Open Data dataset: "Austin Building Permits"
// Endpoint: https://data.austintexas.gov/resource/3syk-w9eu.json
// Search field:  permit_number
// Status field:  status_current
//
// ── PERMIT NUMBER FORMATS ──────────────────────────────────────────────────────
// Two formats are in use:
//   API format:    "2026-033822 PP"   (Open Data / Socrata dataset)
//   Portal format: "2024-BC-04812"   (ABC / Accela Citizen Access portal)
//
// If the API returns 0 results (e.g. for portal-format numbers), the scraper
// falls through automatically to the Playwright portal fallback.
//
// ── HOW TO UPDATE SELECTORS (Playwright fallback) ─────────────────────────────
// If the portal fallback needs updating:
//   1. Open https://abc.austintexas.gov/web/permit/public-search-other in Chrome
//   2. Search for a known permit number manually (e.g. "2026-033822 PP")
//   3. Right-click the search input → Inspect → copy its id/name/placeholder
//   4. Right-click the status element → Inspect → copy its selector
//   5. Update SEL.permitInput and SEL.statusCell below
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Austin, TX",
  state:    "TX",
  handles:  ["austin"],
};

// Open Data API — primary method
const API_URL  = "https://data.austintexas.gov/resource/3syk-w9eu.json";

// Portal fallback
const PORTAL_URL = "https://abc.austintexas.gov/web/permit/public-search-other";

// ── Selectors (Playwright fallback only) ──────────────────────────────────────
//
// The ABC portal (abc.austintexas.gov) is an Accela Citizen Access SPA.
// Selectors are ordered most-specific-first; the last entry is a broad fallback.
//
// If selectors break after an Austin portal redesign:
//   1. Open PORTAL_URL in Chrome DevTools
//   2. Search a permit (e.g. "2026-033822 PP")
//   3. Find the input via Elements → right-click → Copy selector
//   4. Update SEL.permitInput below

const SEL = {
  // Accela Citizen Access permit number field.
  // Common Accela IDs: txtSearchBy, txtRecordNum, ctl00_..._txtGSPermitNumber
  // The broad input[type="text"] fallback handles future portal redesigns.
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

const AUSTIN_STATUS_MAP: Record<string, PermitStatus> = {
  // ── Confirmed from live API (status_current field values) ─────────────────

  // Permit issued and active — work may proceed
  "ACTIVE":                    "APPROVED",

  // Work finished / CO issued
  "CLOSED":                    "CLEARED",

  // Under inspection — awaiting sign-off
  "INSPECTION":                "UNDER_REVIEW",

  // Application received, not yet reviewed
  "APPLICATION":               "PENDING",
  "INTAKE":                    "PENDING",

  // Permit lapsed without final inspection
  "EXPIRED":                   "EXPIRED",

  // Denied / pulled / voided
  "CANCELLED":                 "REJECTED",
  "VOID":                      "REJECTED",

  // ── Additional portal values (Playwright fallback) ─────────────────────────

  "FINAL":                     "CLEARED",
  "FINALED":                   "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "ISSUED":                    "CLEARED",

  "SUBMITTED":                 "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "PENDING":                   "PENDING",
  "IN QUEUE":                  "PENDING",

  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",

  "WITHDRAWN":                 "REJECTED",
  "DENIED":                    "REJECTED",
  "REVOKED":                   "REJECTED",
};

// ── Scraper class ─────────────────────────────────────────────────────────────

export class AustinTxScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    // ── 1. Try Open Data API first ─────────────────────────────────────────
    try {
      const result = await this.scrapeViaApi(permitNumber);
      if (result) return result;
      // null means permit not found in API dataset — fall through to portal
    } catch (apiErr) {
      console.error(
        JSON.stringify({
          level: "warn",
          scraper: "Austin, TX",
          method: "api",
          permit_number: permitNumber,
          message: "Open Data API failed, falling back to portal",
          error: apiErr instanceof Error ? apiErr.message : String(apiErr),
          timestamp: new Date().toISOString(),
        })
      );
    }

    // ── 2. Fall back to Playwright portal scrape ───────────────────────────
    return this.scrapeViaPortal(permitNumber);
  }

  // ── Open Data API ──────────────────────────────────────────────────────────
  // Returns null if the permit isn't in the dataset (caller falls back to portal).
  // Throws on network / parse errors (caller catches and falls back to portal).
  //
  // Confirmed field names from live API (dataset 3syk-w9eu):
  //   permit_number  — search key
  //   status_current — current permit status string
  //   permit_type_desc — human-readable permit type
  //   issue_date     — date permit was issued (ISO string or null)

  private async scrapeViaApi(permitNumber: string): Promise<ScrapeResult | null> {
    const url = `${API_URL}?permit_number=${encodeURIComponent(permitNumber)}&$limit=1`;

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
    if (!Array.isArray(rows) || rows.length === 0) {
      // Permit not in dataset — fall back to portal
      return null;
    }

    const row        = rows[0];
    const rawText    = ((row.status_current  as string) ?? "").trim();
    const typeDesc   = ((row.permit_type_desc as string) ?? "").trim();
    const issueDate  = ((row.issue_date       as string) ?? "").trim();

    if (!rawText) {
      // Row found but status field empty — report as PENDING
      return {
        permit_number: permitNumber,
        status:        "PENDING",
        raw_text:      "found in dataset, status_current empty",
        scrape_url:    url,
      };
    }

    const status = this.mapStatus(rawText);

    console.error(
      JSON.stringify({
        level:         "info",
        scraper:       "Austin, TX",
        method:        "api",
        permit_number: permitNumber,
        status_current: rawText,
        permit_type:   typeDesc,
        issue_date:    issueDate || null,
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

      // Give the React SPA time to hydrate
      await page.waitForTimeout(3000);

      // Step 2: Fill permit number
      // Try the prioritized SEL.permitInput list first; fall back to the first
      // visible text input on the page (handles future Accela portal redesigns).
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
        scraper: "Austin, TX",
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

    for (const [portalText, status] of Object.entries(AUSTIN_STATUS_MAP)) {
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
