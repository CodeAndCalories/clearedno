// Base class for all city permit scrapers.
//
// HOW TO ADD A NEW CITY SCRAPER (≈ 30 minutes):
// ─────────────────────────────────────────────
// 1. Copy scrapers/cities/austin-tx.ts → scrapers/cities/your-city-st.ts
// 2. Update the CONFIG object at the top (cityName, state, handles, portalUrl)
// 3. Implement the scrape() method — fill in the permit number field,
//    click search, wait for results, and return the status text.
// 4. Update mapStatus() with the city's specific status strings.
// 5. Register the new scraper in scrapers/index.ts SCRAPERS array.
// 6. Test with DRY_RUN=true first.
//
// The base class handles:
//   - 30-second per-attempt timeout (via Promise.race)
//   - Up to 3 attempts with exponential backoff (2s, 4s)
//   - Fallback normalizeStatus() if you don't override mapStatus()

import type { ScrapeResult, PermitStatus } from "@/types";

export interface ScraperConfig {
  cityName: string;   // Human-readable, e.g. "Austin, TX"
  state: string;      // Two-letter abbreviation, e.g. "TX"
  handles: string[];  // Lowercase city names this scraper covers
}

// Max time (ms) allowed for a single scrape attempt before it's killed
const SCRAPE_TIMEOUT_MS = 30_000;

export abstract class BaseScraper {
  protected config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Returns true if this scraper handles the given city + state. */
  handles(city: string, state: string): boolean {
    return (
      this.config.state.toUpperCase() === state.toUpperCase() &&
      this.config.handles.includes(city.toLowerCase().trim())
    );
  }

  /**
   * Runs the scraper with a 30-second timeout per attempt and exponential
   * backoff between retries. Returns null after all attempts fail so the
   * engine can track consecutive failures without crashing the run.
   */
  async run(permitNumber: string, address: string): Promise<ScrapeResult | null> {
    const maxAttempts = 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Race the scrape against a hard timeout so a hung browser never
        // blocks the entire queue.
        const result = await Promise.race([
          this.scrape(permitNumber, address),
          this.rejectAfter(SCRAPE_TIMEOUT_MS),
        ]);
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          // Exponential backoff: 2 s → 4 s
          await sleep(2000 * attempt);
        }
      }
    }

    const msg = lastError instanceof Error ? lastError.message : String(lastError);
    console.error(
      JSON.stringify({
        level: "error",
        scraper: this.config.cityName,
        permit_number: permitNumber,
        message: `Scrape failed after ${maxAttempts} attempts`,
        error: msg,
        timestamp: new Date().toISOString(),
      })
    );
    return null;
  }

  // ── Abstract — implement in every city scraper ───────────────────────────

  /**
   * Perform the actual scrape. Must throw on any failure so the base class
   * retry loop can catch it. The browser/page must be closed in a
   * try/finally block inside this method so cleanup always happens.
   */
  protected abstract scrape(
    permitNumber: string,
    address: string
  ): Promise<ScrapeResult>;

  // ── Helpers available to all city scrapers ───────────────────────────────

  /**
   * Generic status normalizer — covers common portal language.
   * Override mapStatus() in your city scraper for portal-specific strings.
   */
  protected normalizeStatus(rawText: string): PermitStatus {
    const t = rawText.toUpperCase().trim();

    if (t.includes("FINAL") || t.includes("CLEARED") || t.includes("COMPLETE") || t.includes("CO ISSUED")) {
      return "CLEARED";
    }
    if (t.includes("ISSUED") || t.includes("APPROVED") || t.includes("ACTIVE")) {
      return "APPROVED";
    }
    if (t.includes("UNDER REVIEW") || t.includes("IN REVIEW") || t.includes("HOLD") || t.includes("HOLD")) {
      return "UNDER_REVIEW";
    }
    if (t.includes("DENIED") || t.includes("REJECTED") || t.includes("REVOKED") || t.includes("WITHDRAWN")) {
      return "REJECTED";
    }
    if (t.includes("EXPIRED") || t.includes("LAPSED")) {
      return "EXPIRED";
    }
    if (t.includes("PENDING") || t.includes("INTAKE") || t.includes("SUBMITTED") || t.includes("RECEIVED")) {
      return "PENDING";
    }

    return "UNKNOWN";
  }

  // ── Private ─────────────────────────────────────────────────────────────

  /** Returns a promise that rejects after `ms` milliseconds. */
  private rejectAfter(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Scrape timed out after ${ms}ms`)),
        ms
      )
    );
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
