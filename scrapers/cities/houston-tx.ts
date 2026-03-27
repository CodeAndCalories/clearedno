// Houston, TX — Planning & Development permit scraper
//
// Portal: City of Houston — Planning & Development
// Search URL: https://www.houstontx.gov/planninganddev/bldgsvc/permit_search.html
//
// Houston uses a server-rendered portal (not a JS SPA like Austin's).
// We use Playwright to submit the search form and read results.
//
// ── HOW TO UPDATE SELECTORS ──────────────────────────────────────────────────
// If the portal is redesigned and selectors break:
//   1. Open the search URL in Chrome
//   2. Search for a known permit number manually
//   3. Inspect the status element → copy its selector
//   4. Update the SEL constants below
//   5. Verify with: DRY_RUN=true node dist/scrapers/index.js
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Houston, TX",
  state:    "TX",
  handles:  ["houston"],
};

const PORTAL_URL =
  "https://www.houstontx.gov/planninganddev/bldgsvc/permit_search.html";

// ── Selectors ─────────────────────────────────────────────────────────────────
// TODO: Verify each selector by visiting the portal and inspecting the DOM.

const SEL = {
  // Permit number text input
  permitInput:
    'input[name*="permit"], input[id*="permit"], input[placeholder*="permit"], input[type="text"]:first-of-type',

  // Search submit button
  searchButton:
    'input[type="submit"], button[type="submit"], button:has-text("Search"), input[value*="Search"]',

  // Status cell in results table
  statusCell:
    'td[class*="status"], [data-label="Status"], td:nth-child(5), span[class*="status"]',

  // Any element that appears once results are loaded
  resultsContainer:
    'table[class*="result"], [class*="results"], [class*="permit-list"], table tbody tr',
};

// ── Status mapping ────────────────────────────────────────────────────────────
// Maps Houston portal status strings → our canonical PermitStatus.
// TODO: Confirm each status string against the live portal.

const HOUSTON_STATUS_MAP: Record<string, PermitStatus> = {
  // Permit issued and ready for work
  "ISSUED":                  "CLEARED",
  "PERMIT ISSUED":           "CLEARED",
  "FINAL":                   "CLEARED",
  "FINALED":                 "CLEARED",
  "CERTIFICATE OF OCCUPANCY": "CLEARED",
  "CO ISSUED":               "CLEARED",
  "COMPLETED":               "CLEARED",
  "CLOSED":                  "CLEARED",

  // Permit approved but not yet finaled
  "APPROVED":                "APPROVED",
  "ACTIVE":                  "APPROVED",
  "UNDER CONSTRUCTION":      "APPROVED",

  // Initial intake / review stage
  "PENDING":                 "PENDING",
  "APPLICATION RECEIVED":    "PENDING",
  "INTAKE":                  "PENDING",
  "IN INTAKE":               "PENDING",
  "SUBMITTED":               "PENDING",
  "NEW":                     "PENDING",

  // Flagged for additional information
  "ON HOLD":                 "UNDER_REVIEW",
  "HOLD":                    "UNDER_REVIEW",
  "IN REVIEW":               "UNDER_REVIEW",
  "UNDER REVIEW":            "UNDER_REVIEW",
  "PLAN REVIEW":             "UNDER_REVIEW",
  "CORRECTIONS REQUIRED":    "UNDER_REVIEW",
  "INCOMPLETE":              "UNDER_REVIEW",
  "ADDITIONAL INFO REQUIRED": "UNDER_REVIEW",

  // Rejected / pulled
  "DENIED":                  "REJECTED",
  "REJECTED":                "REJECTED",
  "WITHDRAWN":               "REJECTED",
  "VOID":                    "REJECTED",
  "VOIDED":                  "REJECTED",
  "CANCELLED":               "REJECTED",
  "REVOKED":                 "REJECTED",

  // Lapsed
  "EXPIRED":                 "EXPIRED",
  "LAPSED":                  "EXPIRED",
};

// ── Scraper class ─────────────────────────────────────────────────────────────

export class HoustonTxScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });
      const page = await context.newPage();

      // ── Step 1: Load the portal ────────────────────────────────────────────
      await page.goto(PORTAL_URL, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      // Small wait for any late JS to initialise
      await page.waitForTimeout(2000);

      // ── Step 2: Fill in the permit number ─────────────────────────────────
      const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 10_000 });
      await inputEl.fill(permitNumber.trim());
      await page.waitForTimeout(300);

      // ── Step 3: Submit ────────────────────────────────────────────────────
      const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
      await searchBtn.click();

      // ── Step 4: Wait for results or error ─────────────────────────────────
      await page.waitForSelector(
        `${SEL.resultsContainer}, [class*="no-result"], [class*="error"], [class*="not-found"], [class*="noRecord"]`,
        { timeout: 15_000 }
      );

      // ── Step 5: Extract status ─────────────────────────────────────────────
      let rawText = "";

      try {
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        // Fallback: scan body text near the permit number
        const bodyText = await page.locator("body").innerText();
        rawText = extractStatusFromBody(bodyText, permitNumber);
      }

      if (!rawText) {
        throw new Error(
          `Status not found for permit ${permitNumber} in Houston portal. ` +
          "Check SEL.statusCell — the portal DOM may have changed."
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

  // ── Houston-specific status mapping ────────────────────────────────────────
  private mapStatus(rawText: string): PermitStatus {
    const key = rawText.toUpperCase().trim();

    for (const [portalText, status] of Object.entries(HOUSTON_STATUS_MAP)) {
      if (key === portalText || key.includes(portalText)) {
        return status;
      }
    }

    return this.normalizeStatus(rawText);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractStatusFromBody(bodyText: string, permitNumber: string): string {
  const re = new RegExp(
    `${permitNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]{0,100}`,
    "i"
  );
  const match = bodyText.match(re);
  if (match) return match[0];

  if (!bodyText.toLowerCase().includes(permitNumber.toLowerCase())) {
    throw new Error(`Permit ${permitNumber} not found in Houston portal search results.`);
  }

  return "";
}
