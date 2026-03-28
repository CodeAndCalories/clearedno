// San Antonio, TX — Development Services Department permit scraper
//
// Portal: City of San Antonio Development Services
// Search URL: https://saicims.sanantonio.gov/PermitStatus/
//
// San Antonio uses an Accela-based permit status portal. Playwright handles
// the JS-rendered page. The portal does not require login for public searches.
//
// ── HOW TO UPDATE SELECTORS ──────────────────────────────────────────────────
// If the portal is redesigned and selectors break:
//   1. Open PORTAL_URL in Chrome
//   2. Search for a known permit number manually
//   3. Inspect the status element → copy its selector
//   4. Update the SEL constants below
//   5. Verify with: DRY_RUN=true npx ts-node scrapers/index.ts
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
  cityName: "San Antonio, TX",
  state:    "TX",
  handles:  ["san antonio", "san-antonio"],
};

// San Antonio permit status portal
const PORTAL_URL = "https://saicims.sanantonio.gov/PermitStatus/";

// ── Selectors ─────────────────────────────────────────────────────────────────
// Based on the San Antonio Accela Citizen Access portal structure.
// Visit PORTAL_URL and verify each selector if they stop working.

const SEL = {
  // Permit number search input
  permitInput: [
    'input[id*="RecordNum"]',
    'input[id*="recordNum"]',
    'input[id*="txtSearch"]',
    'input[id*="PermitNum"]',
    'input[id*="permitNum"]',
    'input[placeholder*="Permit Number"]',
    'input[placeholder*="Record Number"]',
    'input[placeholder*="permit"]',
    'input[id*="permit"]',
    'input[id*="record"]',
    'input[name*="permit"]',
    'input[name*="record"]',
    'input[type="text"]',
  ].join(", "),

  // Search submit button
  searchButton: [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Search")',
    'a:has-text("Search")',
    'button:has-text("Find")',
    'button:has-text("Look Up")',
    'button:has-text("Submit")',
  ].join(", "),

  // Status display element in results
  statusCell: [
    'td[data-label="Status"]',
    'td[data-label="Permit Status"]',
    'td[data-label="Record Status"]',
    'td[data-label="Application Status"]',
    '.record-status',
    '[class*="status-value"]',
    '[class*="permit-status"]',
    '[class*="record-status"]',
    'span[class*="status"]',
    'td:nth-child(5)',
    'td:nth-child(4)',
  ].join(", "),

  // Results wrapper element — indicates results have loaded
  resultsContainer: [
    '.search-results',
    '[class*="results"]',
    '[class*="records-table"]',
    '[class*="permit-list"]',
    '[id*="searchResults"]',
    '[id*="searchResult"]',
    'table',
    'tbody tr',
  ].join(", "),
};

// ── Status mapping ────────────────────────────────────────────────────────────
// Maps San Antonio portal status strings → our canonical PermitStatus.
// Reference: San Antonio DSD permit documentation.

const SAN_ANTONIO_STATUS_MAP: Record<string, PermitStatus> = {
  // Work completed, inspections passed
  "FINAL":                     "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL APPROVED":            "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "CLOSED":                    "CLEARED",

  // Permit issued, ready for work to begin
  "ISSUED":                    "CLEARED",   // SA "Issued" = active and approved
  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",
  "IN PROGRESS":               "APPROVED",
  "PERMIT ISSUED":             "CLEARED",

  // Submitted, awaiting review
  "SUBMITTED":                 "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "PENDING":                   "PENDING",
  "IN INTAKE":                 "PENDING",
  "INTAKE":                    "PENDING",
  "WAITING":                   "PENDING",
  "RECEIVED":                  "PENDING",
  "IN QUEUE":                  "PENDING",
  "NEW":                       "PENDING",

  // Under city review, corrections needed
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "PLAN REVIEW":               "UNDER_REVIEW",
  "DEFICIENCY":                "UNDER_REVIEW",
  "INCOMPLETE":                "UNDER_REVIEW",
  "ADDITIONAL INFO REQUIRED":  "UNDER_REVIEW",

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

export class SanAntonioTxScraper extends BaseScraper {
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
        viewport: { width: 1280, height: 800 },
      });
      const page = await context.newPage();

      // ── Step 1: Load the portal ────────────────────────────────────────────
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

      // Give JS-rendered portal time to initialise
      await page.waitForTimeout(3000);

      // ── Step 2: Fill in the permit number ─────────────────────────────────
      try {
        let filled = false;

        // Attempt 1: use the ordered selector list
        try {
          const inputEl = await page.waitForSelector(SEL.permitInput, { timeout: 8_000 });
          await inputEl.fill(permitNumber.trim());
          filled = true;
        } catch {
          // Attempt 2: any visible text input
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
            "Permit number input not found. Check SEL.permitInput for San Antonio portal."
          );
        }
      } catch {
        return this.pendingFallback(
          permitNumber,
          "Permit number input not found. Check SEL.permitInput for San Antonio portal."
        );
      }

      await page.waitForTimeout(400);

      // ── Step 3: Submit the search ─────────────────────────────────────────
      try {
        const searchBtn = await page.waitForSelector(SEL.searchButton, { timeout: 5_000 });
        await searchBtn.click();
      } catch {
        // If no button found, try pressing Enter in the input
        try {
          await page.keyboard.press("Enter");
        } catch {
          return this.pendingFallback(
            permitNumber,
            "Search button not found. Check SEL.searchButton for San Antonio portal."
          );
        }
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
        rawText = await page.locator(SEL.statusCell).first().innerText({ timeout: 5_000 });
      } catch {
        // Fallback: scan the full page body
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
  private pendingFallback(permitNumber: string, reason: string): ScrapeResult {
    console.error(
      JSON.stringify({
        level: "warn",
        scraper: "San Antonio, TX",
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

  // ── San Antonio-specific status mapping ───────────────────────────────────
  private mapStatus(rawText: string): PermitStatus {
    const key = rawText.toUpperCase().trim();

    for (const [portalText, status] of Object.entries(SAN_ANTONIO_STATUS_MAP)) {
      if (key === portalText || key.includes(portalText)) {
        return status;
      }
    }

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

  if (!bodyText.toLowerCase().includes(permitNumber.toLowerCase())) {
    return "";
  }

  return "";
}
