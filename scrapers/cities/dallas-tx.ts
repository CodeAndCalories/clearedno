// Dallas, TX — Development Services permit scraper
//
// Portal: Dallas Development Services
// Search URL: https://developmentservices.dallascityhall.com/
//
// Dallas uses a custom web portal (not Accela). The permit search is
// available without login. We use Playwright to handle the JS-rendered page.
//
// ── HOW TO UPDATE SELECTORS ──────────────────────────────────────────────────
// If the portal is redesigned and selectors break:
//   1. Open the search URL in Chrome
//   2. Search for a known permit number manually
//   3. Inspect the status element → copy its selector
//   4. Update the SEL constants below
//   5. Verify with: DRY_RUN=true npx ts-node scrapers/index.ts
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "../../types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Dallas, TX",
  state:    "TX",
  handles:  ["dallas"],
};

// TODO: Confirm the exact search/lookup URL after visiting the portal
// Dallas may require navigating to a specific sub-page for permit lookup
const PORTAL_URL = "https://developmentservices.dallascityhall.com/";

// The direct permit search endpoint (often different from the homepage)
// TODO: Update after inspecting the network tab on a manual search
const SEARCH_URL = "https://developmentservices.dallascityhall.com/";

// ── Selectors ─────────────────────────────────────────────────────────────────
// TODO: All selectors below are best-guess — visit the portal and verify each one.
// Document what each selector targets in a comment after confirming.

const SEL = {
  // Permit number search input
  // TODO: Inspect the search form input element and update this selector
  permitInput: 'input[placeholder*="permit"], input[name*="permit"], input[id*="permit"], input[type="text"]:first-of-type',

  // Search submit button
  // TODO: Confirm button text ("Search", "Find", "Submit", etc.)
  searchButton: 'button[type="submit"], button:has-text("Search"), button:has-text("Find")',

  // Status display element in results
  // TODO: Inspect the results and find the exact element holding the status string
  statusCell: 'td[class*="status"], span[class*="status"], [data-label="Status"], td:nth-child(4)',

  // Wrapper element that indicates results have loaded
  // TODO: Confirm the class/ID of the results container
  resultsContainer: '[class*="results"], [class*="grid"], table, [class*="permit-list"]',
};

// ── Status mapping ────────────────────────────────────────────────────────────
// Maps Dallas portal status strings → our canonical PermitStatus.
// TODO: Confirm each status string by creating test permits or asking DDS support.
// Reference: https://developmentservices.dallascityhall.com/

const DALLAS_STATUS_MAP: Record<string, PermitStatus> = {
  // Work finished, inspections passed
  "FINAL APPROVED":   "CLEARED",
  "CERTIFICATE OF OCCUPANCY": "CLEARED",
  "CO ISSUED":        "CLEARED",
  "FINAL":            "CLEARED",
  "COMPLETED":        "CLEARED",
  "CLOSED":           "CLEARED",

  // Permit issued, ready for work to begin
  "ISSUED":           "CLEARED",   // In Dallas "Issued" means approved and active
  "APPROVED":         "APPROVED",
  "ACTIVE":           "APPROVED",
  "IN PROGRESS":      "APPROVED",

  // Under initial review
  "SUBMITTED":        "PENDING",
  "APPLICATION RECEIVED": "PENDING",
  "PENDING":          "PENDING",
  "IN INTAKE":        "PENDING",
  "INTAKE":           "PENDING",

  // Needs correction or additional information
  "ON HOLD":          "UNDER_REVIEW",
  "HOLD":             "UNDER_REVIEW",
  "CORRECTIONS REQUIRED": "UNDER_REVIEW",
  "IN REVIEW":        "UNDER_REVIEW",
  "UNDER REVIEW":     "UNDER_REVIEW",
  "INCOMPLETE":       "UNDER_REVIEW",

  // Permit rejected or pulled
  "DENIED":           "REJECTED",
  "WITHDRAWN":        "REJECTED",
  "VOID":             "REJECTED",
  "VOIDED":           "REJECTED",
  "CANCELLED":        "REJECTED",
  "REVOKED":          "REJECTED",

  // Permit lapsed
  "EXPIRED":          "EXPIRED",
  "LAPSED":           "EXPIRED",
};

// ── Scraper class ─────────────────────────────────────────────────────────────

export class DallasTxScraper extends BaseScraper {
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      });
      const page = await context.newPage();

      // ── Step 1: Load the portal ────────────────────────────────────────────
      // TODO: If the homepage requires navigating to a sub-page for search,
      //       add a second goto() and a click() to get to the search form.
      await page.goto(SEARCH_URL, {
        waitUntil: "networkidle",
        timeout: 25_000,
      });

      // ── Step 2: Fill in the permit number ─────────────────────────────────
      // TODO: Verify SEL.permitInput targets the correct input field
      const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 10_000 });
      await inputEl.fill(permitNumber.trim());
      await page.waitForTimeout(300);

      // ── Step 3: Submit ────────────────────────────────────────────────────
      // TODO: Verify SEL.searchButton targets the correct submit button
      const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
      await searchBtn.click();

      // ── Step 4: Wait for results ──────────────────────────────────────────
      // TODO: Verify SEL.resultsContainer wraps the results grid/table
      await page.waitForSelector(
        `${SEL.resultsContainer}, [class*="no-result"], [class*="error"], [class*="not-found"]`,
        { timeout: 15_000 }
      );

      // ── Step 5: Extract status ─────────────────────────────────────────────
      let rawText = "";

      try {
        // TODO: Verify SEL.statusCell points to the status value element
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        // Fallback: scan body text for status keywords near the permit number
        const bodyText = await page.locator("body").innerText();
        rawText = extractStatusFromBody(bodyText, permitNumber);
      }

      if (!rawText) {
        throw new Error(
          `Status not found for permit ${permitNumber} in Dallas portal. ` +
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

  // ── Dallas-specific status mapping ────────────────────────────────────────
  private mapStatus(rawText: string): PermitStatus {
    const key = rawText.toUpperCase().trim();

    for (const [portalText, status] of Object.entries(DALLAS_STATUS_MAP)) {
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
    throw new Error(`Permit ${permitNumber} not found in Dallas portal search results.`);
  }

  return "";
}
