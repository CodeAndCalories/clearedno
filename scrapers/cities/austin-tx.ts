// Austin, TX permit scraper
// Portal: https://austin.permitstudio.com (or the city's Accela portal)
//
// Austin uses a public Accela Citizen Access portal. Permits can be looked up
// by permit number. The page is mostly server-rendered HTML so we use Playwright
// to ensure JavaScript-heavy pages fully render before extracting status.

import { BaseScraper, type ScraperConfig } from "../base-scraper";
import type { ScrapeResult } from "@/types";
import { chromium } from "playwright";

const CONFIG: ScraperConfig = {
  cityName: "Austin, TX",
  state: "TX",
  handles: ["austin"],
};

// The URL pattern for Austin's permit lookup portal
// Replace with the real URL once you confirm the city's current portal.
const PORTAL_BASE = "https://aca.austintexas.gov/ACA/Default.aspx";

export class AustinTxScraper extends BaseScraper {
  constructor() {
    super(CONFIG);
  }

  protected async scrape(
    permitNumber: string,
    _address: string
  ): Promise<ScrapeResult> {
    // Launch a headless Chromium browser to handle JS-rendered portals
    const browser = await chromium.launch({ headless: true });
    const page    = await browser.newPage();

    try {
      // Navigate to the permit search page
      await page.goto(PORTAL_BASE, { waitUntil: "domcontentloaded", timeout: 30_000 });

      // ── Step 1: Search by permit number ───────────────────────────────────
      // NOTE: These selectors must be updated to match the real Austin portal.
      // Common Accela selectors are shown here as starting points.
      await page.fill('input[name="ctl00$PlaceHolderMain$txtPermitNumber"]', permitNumber);
      await page.click('input[name="ctl00$PlaceHolderMain$btnSearch"]');
      await page.waitForLoadState("domcontentloaded");

      // ── Step 2: Extract status ─────────────────────────────────────────────
      // The status is typically in a table cell or a labeled div.
      // Update the selector to match the real portal's DOM structure.
      const rawText = await page
        .locator('[data-testid="permit-status"], td.status, .permit-status-value')
        .first()
        .innerText()
        .catch(() => "UNKNOWN");

      const scrapeUrl = page.url();
      const status    = this.normalizeStatus(rawText);

      return {
        permit_number: permitNumber,
        status,
        raw_text: rawText.trim(),
        scrape_url: scrapeUrl,
      };
    } finally {
      await browser.close();
    }
  }
}
