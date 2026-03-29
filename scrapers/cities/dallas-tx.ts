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
    // Scraper selectors unverified — using safe fallback until portal confirmed
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
      try {
        await page.goto(SEARCH_URL, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });
      } catch (navErr) {
        return this.pendingFallback(
          permitNumber,
          `Navigation failed: ${navErr instanceof Error ? navErr.message : String(navErr)}`
        );
      }
      // Give the portal JS time to initialise after DOM load
      await page.waitForTimeout(3000);

      // ── Step 2: Fill in the permit number ─────────────────────────────────
      try {
        const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 10_000 });
        await inputEl.fill(permitNumber.trim());
        await page.waitForTimeout(300);
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Permit number input not found. Check SEL.permitInput selector for Dallas portal."
        );
      }

      // ── Step 3: Submit ────────────────────────────────────────────────────
      try {
        const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
        await searchBtn.click();
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Search button not found. Check SEL.searchButton selector for Dallas portal."
        );
      }

      // ── Step 4: Wait for results ──────────────────────────────────────────
      try {
        await page.waitForSelector(
          `${SEL.resultsContainer}, [class*="no-result"], [class*="error"], [class*="not-found"]`,
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
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        // Fallback: scan body text for status keywords near the permit number
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
      await browser.close().catch(() => {});
    }
  }

  // ── Fallback result ────────────────────────────────────────────────────────
  // Returns PENDING instead of throwing so the permit stays in queue for next run.
  private pendingFallback(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "Dallas, TX",
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
