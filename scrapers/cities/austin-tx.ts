// Austin, TX — Build + Development Services permit scraper
//
// Portal: Austin Build Central (ABC)
// Search URL: https://abc.austintexas.gov/web/permit/public-search-other
//
// The portal is a React SPA. We use Playwright so the page fully hydrates
// before we try to interact with it.
//
// ── HOW TO UPDATE SELECTORS ──────────────────────────────────────────────────
// If the portal is redesigned and selectors break:
//   1. Open the URL in Chrome DevTools
//   2. Search for a known permit number manually
//   3. Right-click the status element → Inspect
//   4. Copy the selector and update the constant below
//   5. Run: DRY_RUN=true npx ts-node scrapers/index.ts
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from "playwright";
import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult, PermitStatus } from "@/types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG: ScraperConfig = {
  cityName: "Austin, TX",
  state:    "TX",
  handles:  ["austin"],
};

// The public permit search page
// TODO: Verify this URL is still correct if the scraper breaks
const PORTAL_URL = "https://abc.austintexas.gov/web/permit/public-search-other";

// ── Selectors ─────────────────────────────────────────────────────────────────
// Each selector is documented with what it targets in the portal DOM.
// If the portal is redesigned, these are the only values that need updating.

const SEL = {
  // The text input where the permit/record number is typed
  // TODO: Open DevTools on the search page and confirm this ID
  permitInput: 'input[placeholder*="Record Number"], input[id*="permit"], input[name*="permit"], input[type="text"]',

  // The "Search" or "Submit" button on the search form
  // TODO: Confirm the button text or selector after a portal visit
  searchButton: 'button[type="submit"], button:has-text("Search"), input[type="submit"]',

  // The cell or span containing the current status in the results table
  // Austin ABC typically renders status in a <td> or a labeled <span>
  // TODO: Inspect the results page to confirm the exact selector
  statusCell: 'td[data-label="Status"], .record-status, [class*="status"], td:nth-child(5)',

  // The container for results — used to confirm results have loaded
  // TODO: Verify this wraps the results table/list
  resultsContainer: '.search-results, table[class*="result"], [class*="records"]',
};

// ── Status mapping ────────────────────────────────────────────────────────────
// Maps Austin's exact portal status strings → our canonical PermitStatus.
// Source: Austin Development Services status documentation.
// TODO: Cross-check by searching a permit in each state in the portal.

const AUSTIN_STATUS_MAP: Record<string, PermitStatus> = {
  // Work completed, certificate of occupancy may be issued
  "FINAL":             "CLEARED",
  "FINALED":           "CLEARED",
  "CERTIFICATE OF OCCUPANCY": "CLEARED",
  "CO ISSUED":         "CLEARED",
  "COMPLETED":         "CLEARED",

  // Permit issued, work may proceed
  "ISSUED":            "CLEARED",   // Austin uses "Issued" for active permits ready for inspection
  "ACTIVE":            "APPROVED",

  // Submitted and being reviewed
  "INTAKE":            "PENDING",
  "SUBMITTED":         "PENDING",
  "APPLICATION RECEIVED": "PENDING",
  "PENDING":           "PENDING",

  // Flagged for additional city review
  "ON HOLD":           "UNDER_REVIEW",
  "HOLD":              "UNDER_REVIEW",
  "UNDER REVIEW":      "UNDER_REVIEW",
  "IN REVIEW":         "UNDER_REVIEW",

  // Permit denied or pulled
  "WITHDRAWN":         "REJECTED",
  "DENIED":            "REJECTED",
  "REVOKED":           "REJECTED",
  "CANCELLED":         "REJECTED",

  // Permit lapsed without final inspection
  "EXPIRED":           "EXPIRED",
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
    const browser = await chromium.launch({
      headless: true,
      // Required for Linux production environments (no display server)
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const context = await browser.newContext({
        // Appear as a normal desktop browser to avoid bot detection
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      });
      const page = await context.newPage();

      // ── Step 1: Load the search page ──────────────────────────────────────
      // Timeout is 25s — gives 5s margin before the base class 30s limit kicks in
      await page.goto(PORTAL_URL, {
        waitUntil: "networkidle",
        timeout: 25_000,
      });

      // ── Step 2: Fill in the permit number ─────────────────────────────────
      // TODO: Update SEL.permitInput if this step fails in production
      const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 10_000 });
      await inputEl.fill(permitNumber.trim());

      // Small delay so the SPA can react to the input
      await page.waitForTimeout(300);

      // ── Step 3: Submit the search ─────────────────────────────────────────
      // TODO: Update SEL.searchButton if the button can't be found
      const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
      await searchBtn.click();

      // ── Step 4: Wait for results ──────────────────────────────────────────
      // Wait for either the results container OR an error/no-results message
      // TODO: Update SEL.resultsContainer to match the actual wrapper element
      await page.waitForSelector(
        `${SEL.resultsContainer}, [class*="no-result"], [class*="error"]`,
        { timeout: 15_000 }
      );

      // ── Step 5: Extract status ─────────────────────────────────────────────
      // Attempt the primary selector first, fall back to text search
      let rawText = "";

      try {
        // TODO: Update SEL.statusCell to match the exact status element
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        // Fallback: search the full page text for recognisable status strings
        const bodyText = await page.locator("body").innerText();
        rawText = extractStatusFromBody(bodyText, permitNumber);
      }

      if (!rawText) {
        throw new Error(
          `Status text not found on page for permit ${permitNumber}. ` +
          "Check SEL.statusCell selector — the portal may have been redesigned."
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
      // Always close the browser — even on timeout or error
      await browser.close().catch(() => {});
    }
  }

  // ── Austin-specific status mapping ────────────────────────────────────────
  private mapStatus(rawText: string): PermitStatus {
    const key = rawText.toUpperCase().trim();

    // Check exact matches first (most reliable)
    for (const [portalText, status] of Object.entries(AUSTIN_STATUS_MAP)) {
      if (key === portalText || key.includes(portalText)) {
        return status;
      }
    }

    // Fall back to the generic normalizer in BaseScraper
    return this.normalizeStatus(rawText);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Last-resort status extraction: scans the full body text for known status
 * keywords when the specific selector fails. Not as precise but better than
 * throwing and wasting a retry.
 */
function extractStatusFromBody(bodyText: string, permitNumber: string): string {
  // Look for the permit number followed by status text within ~100 chars
  const re = new RegExp(
    `${permitNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]{0,100}`,
    "i"
  );
  const match = bodyText.match(re);
  if (match) return match[0];

  // If permit number not found at all, the search returned no results
  if (!bodyText.toLowerCase().includes(permitNumber.toLowerCase())) {
    throw new Error(`Permit ${permitNumber} not found in Austin portal search results.`);
  }

  return "";
}
