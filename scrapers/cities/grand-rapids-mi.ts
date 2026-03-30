// Grand Rapids, MI — BS&A Online permit scraper
//
// ONLY METHOD: BS&A Online portal via Playwright (no public API available)
//
// BS&A Online is used by hundreds of Michigan municipalities. Grand Rapids
// uses TenantId=35 on the Building Permits search category.
//
// Portal: https://www.bsaonline.com/SiteSearch/SiteSearchIndex
//         ?SearchCategory=Building+Permits&TenantId=35
//
// ── HOW TO UPDATE SELECTORS ───────────────────────────────────────────────────
// If selectors break after a BS&A portal update:
//   1. Open PORTAL_URL in Chrome DevTools
//   2. Search a permit number manually
//   3. Right-click the search input → Inspect → copy its id/name/placeholder
//   4. Right-click the status element → Inspect → copy its selector
//   5. Update SEL.permitInput and SEL.statusCell below
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Grand Rapids, MI",
  state:    "MI",
  handles:  ["grand rapids", "grand-rapids"],
};

// BS&A Online portal — only method (no public API)
const PORTAL_URL =
  "https://www.bsaonline.com/SiteSearch/SiteSearchIndex?SearchCategory=Building+Permits&TenantId=35";

// ── Selectors ─────────────────────────────────────────────────────────────────
//
// Selectors are ordered most-specific-first; broad fallbacks handle portal
// redesigns. The BS&A search input is typically #txtSearchValue.

const SEL = {
  // BS&A Online permit search input — #txtSearchValue is the confirmed selector
  permitInput: [
    "#txtSearchValue",
    'input[id*="SearchValue"]',
    'input[id*="searchValue"]',
    'input[id*="RecordNum"]',
    'input[id*="recordNum"]',
    'input[id*="txtSearch"]',
    'input[id*="PermitNum"]',
    'input[id*="permitNum"]',
    'input[placeholder*="Search"]',
    'input[placeholder*="Permit Number"]',
    'input[placeholder*="Permit"]',
    'input[id*="permit"]',
    'input[id*="record"]',
    'input[name*="permit"]',
    'input[name*="record"]',
    'input[type="text"]',   // broadest fallback
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

  // BS&A uses .search-result-status and .permit-status for status display
  statusCell: [
    ".search-result-status",
    ".permit-status",
    'td[data-label="Status"]',
    'td[data-label="Record Status"]',
    'td[data-label="Permit Status"]',
    '.record-status',
    '[class*="status-value"]',
    '[class*="permit-status"]',
    '[class*="record-status"]',
    '[class*="search-result-status"]',
    'td:nth-child(5)',
    'td:nth-child(4)',
  ].join(", "),

  resultsContainer: [
    '.search-results',
    '[class*="search-result"]',
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

const GRAND_RAPIDS_STATUS_MAP: Record<string, PermitStatus> = {
  // ── Primary mappings ──────────────────────────────────────────────────────

  // Permit issued and active — work may proceed
  "ISSUED":                    "APPROVED",
  "ACTIVE":                    "APPROVED",
  "APPROVED":                  "APPROVED",
  "PERMIT ISSUED":             "APPROVED",

  // Work finished / final inspection passed
  "FINAL":                     "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "COMPLETED":                 "CLEARED",
  "CLOSED":                    "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "CERTIFICATE OF COMPLETION": "CLEARED",

  // Application received, not yet reviewed
  "APPLIED":                   "PENDING",
  "PENDING":                   "PENDING",
  "SUBMITTED":                 "PENDING",
  "APPLICATION":               "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "IN QUEUE":                  "PENDING",
  "INTAKE":                    "PENDING",

  // Under review / on hold
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "PLAN REVIEW":               "UNDER_REVIEW",
  "PLAN CHECK":                "UNDER_REVIEW",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "INSPECTION":                "UNDER_REVIEW",

  // Permit lapsed
  "EXPIRED":                   "EXPIRED",
  "LAPSED":                    "EXPIRED",

  // Denied / cancelled
  "DENIED":                    "REJECTED",
  "REJECTED":                  "REJECTED",
  "WITHDRAWN":                 "REJECTED",
  "REVOKED":                   "REJECTED",
  "CANCELLED":                 "CANCELLED",
  "VOID":                      "CANCELLED",
  "VOIDED":                    "CANCELLED",
};

// ── Scraper class ─────────────────────────────────────────────────────────────

export class GrandRapidsMiScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    // BS&A Online has no public API — Playwright only
    return this.scrapeViaPortal(permitNumber);
  }

  // ── Playwright portal scrape ───────────────────────────────────────────────

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

      // Give the page time to load dynamic content
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
        scraper: "Grand Rapids, MI",
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

    for (const [portalText, status] of Object.entries(GRAND_RAPIDS_STATUS_MAP)) {
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
