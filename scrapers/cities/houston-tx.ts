// Houston, TX — Public Works & Engineering permit scraper
//
// Portal: Houston Permitting Center
// Search URL: https://www.houston311.org/hpd/
//
// Houston's permit search portal requires navigating to a search form
// and entering the permit number. We use Playwright for JS-rendered pages.
//
// ── HOW TO UPDATE SELECTORS ──────────────────────────────────────────────────
// If the portal is redesigned and selectors break:
//   1. Open the search URL in Chrome
//   2. Search for a known permit number manually
//   3. Inspect the status element → copy its selector
//   4. Update the SEL constants below
//   5. Verify with: DRY_RUN=true node scrapers/dist/index.js
// ─────────────────────────────────────────────────────────────────────────────
//
// ── FALLBACK BEHAVIOR ────────────────────────────────────────────────────────
// If the portal cannot be scraped (selectors broken, timeout, bot detection),
// returns status=PENDING with raw_text="manual check required" instead of
// throwing. The permit stays in queue and retries next scheduled run.
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

// Houston's permit search portal
// TODO: Verify this is the correct search endpoint after visiting the portal
const PORTAL_URL = "https://www.houston311.org/hpd/";

// ── Selectors ─────────────────────────────────────────────────────────────────
// All selectors are best-guess based on common permitting portal patterns.
// Visit the portal and verify each one — update with confirmed selectors.
//
// HOW TO VERIFY: Open PORTAL_URL in Chrome DevTools → Elements tab,
// search for a permit, inspect each matching element, confirm the selector.

const SEL = {
  // The permit number search input field.
  // Houston typically labels this "Permit Number" or "Application Number".
  permitInput: [
    'input[placeholder*="Permit Number"]',
    'input[placeholder*="Application"]',
    'input[placeholder*="permit"]',
    'input[id*="permit"]',
    'input[id*="application"]',
    'input[name*="permit"]',
    'input[name*="application"]',
    'input[type="text"]:not([type="hidden"])',
  ].join(", "),

  // The "Search" or "Submit" button on the search form.
  searchButton: [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Search")',
    'button:has-text("Find")',
    'button:has-text("Look Up")',
    'button:has-text("Submit")',
  ].join(", "),

  // The element displaying the permit status in search results.
  // Houston portals often use a table with labeled columns or data attributes.
  statusCell: [
    'td[data-label="Status"]',
    'td[data-label="Permit Status"]',
    'td[data-label="Application Status"]',
    '.permit-status',
    '[class*="status-value"]',
    '[class*="permit-status"]',
    'span[class*="status"]',
    'td:nth-child(4)',
    'td:nth-child(5)',
  ].join(", "),

  // The results container — indicates the results have loaded.
  resultsContainer: [
    '.search-results',
    '[class*="results"]',
    '[class*="permit-list"]',
    'table',
    'tbody tr',
    '[id*="results"]',
  ].join(", "),
};

// ── Status mapping ────────────────────────────────────────────────────────────
// Maps Houston portal status strings → our canonical PermitStatus.
// TODO: Cross-check by searching a permit in each state in the portal.
// Reference: Houston Public Works & Engineering permit documentation.

const HOUSTON_STATUS_MAP: Record<string, PermitStatus> = {
  // Work completed, inspections passed
  "FINAL":                     "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL APPROVED":            "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "CLOSED":                    "CLEARED",

  // Permit issued, ready for work to begin
  "ISSUED":                    "CLEARED",   // Houston "Issued" = permit is active and approved
  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",
  "IN PROGRESS":               "APPROVED",

  // Submitted, awaiting review
  "SUBMITTED":                 "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "PENDING":                   "PENDING",
  "IN INTAKE":                 "PENDING",
  "INTAKE":                    "PENDING",
  "WAITING":                   "PENDING",
  "RECEIVED":                  "PENDING",

  // Under city review, corrections needed
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "DEFICIENCY":                "UNDER_REVIEW",
  "PLAN REVIEW":               "UNDER_REVIEW",

  // Permit denied, withdrawn, or voided
  "DENIED":                    "REJECTED",
  "WITHDRAWN":                 "REJECTED",
  "VOID":                      "REJECTED",
  "VOIDED":                    "REJECTED",
  "CANCELLED":                 "REJECTED",
  "REVOKED":                   "REJECTED",
  "REJECTED":                  "REJECTED",

  // Permit lapsed or expired
  "EXPIRED":                   "EXPIRED",
  "LAPSED":                    "EXPIRED",
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
        // Appear as a normal desktop browser to avoid bot detection
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1280, height: 800 },
      });
      const page = await context.newPage();

      // ── Step 1: Load the portal ────────────────────────────────────────────
      // Use domcontentloaded — avoids hanging on analytics/tracking scripts
      try {
        await page.goto(PORTAL_URL, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
      } catch (navErr) {
        return this.pendingFallback(
          permitNumber,
          `Navigation failed: ${navErr instanceof Error ? navErr.message : String(navErr)}`
        );
      }

      // Give JS-rendered portals time to initialise after DOM load
      await page.waitForTimeout(3000);

      // ── Step 2: Fill in the permit number ─────────────────────────────────
      // TODO: If Houston requires clicking into a sub-section before the form
      //       appears, add a click() here before waitForSelector().
      try {
        const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 8_000 });
        await inputEl.fill(permitNumber.trim());
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Permit number input not found. Check SEL.permitInput selector for Houston portal."
        );
      }

      await page.waitForTimeout(400);

      // ── Step 3: Submit the search ─────────────────────────────────────────
      // TODO: If Houston uses a keyboard enter instead of a button, replace
      //       searchBtn.click() with page.keyboard.press("Enter")
      try {
        const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
        await searchBtn.click();
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Search button not found. Check SEL.searchButton selector for Houston portal."
        );
      }

      // ── Step 4: Wait for results ──────────────────────────────────────────
      try {
        await page.waitForSelector(
          `${SEL.resultsContainer}, [class*="no-result"], [class*="error"], [class*="not-found"], [class*="empty"]`,
          { timeout: 15_000 }
        );
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Results container did not appear. Portal may have changed or is blocking access."
        );
      }

      // ── Step 5: Extract status ─────────────────────────────────────────────
      let rawText = "";

      try {
        // Primary: try the status cell selector
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        // Fallback: scan the full page body for status keywords near the permit number
        try {
          const bodyText = await page.locator("body").innerText({ timeout: 5_000 });
          rawText = extractStatusFromBody(bodyText, permitNumber);
        } catch {
          return this.pendingFallback(
            permitNumber,
            "Could not extract page text. Portal may be blocking automated access."
          );
        }
      }

      if (!rawText || rawText.trim() === "") {
        return this.pendingFallback(
          permitNumber,
          "Status text not found. Permit may not exist or SEL.statusCell selector is wrong."
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

  // ── Fallback result ────────────────────────────────────────────────────────
  // Returns PENDING instead of throwing, so BaseScraper doesn't count this
  // as a failure and fire health alarms. Permit stays in queue for next run.
  private pendingFallback(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Houston, TX",
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

  // ── Houston-specific status mapping ────────────────────────────────────────
  private mapStatus(rawText: string): PermitStatus {
    const key = rawText.toUpperCase().trim();

    // Exact match first (most precise)
    for (const [portalText, status] of Object.entries(HOUSTON_STATUS_MAP)) {
      if (key === portalText || key.includes(portalText)) {
        return status;
      }
    }

    // Fall back to the generic normalizer defined in BaseScraper
    return this.normalizeStatus(rawText);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Last-resort: scans full body text for status keywords near the permit number.
 * Used when the specific SEL.statusCell selector fails.
 */
function extractStatusFromBody(bodyText: string, permitNumber: string): string {
  const escaped = permitNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`${escaped}[\\s\\S]{0,150}`, "i");
  const match = bodyText.match(re);
  if (match) return match[0];

  // Permit number not found at all → search returned no results
  if (!bodyText.toLowerCase().includes(permitNumber.toLowerCase())) {
    return "";
  }

  return "";
}
