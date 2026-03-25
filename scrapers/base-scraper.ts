// Base class for all city permit scrapers.
// Each city scraper extends this and implements the `scrape()` method.
// The scraper engine in scrapers/index.ts calls run() which handles
// error catching, retries, and result normalization.

import type { ScrapeResult, PermitStatus } from "@/types";

export interface ScraperConfig {
  // Human-readable city name, e.g. "Austin, TX"
  cityName: string;
  // State abbreviation, e.g. "TX"
  state: string;
  // List of city names this scraper handles (lowercase, for matching)
  handles: string[];
}

export abstract class BaseScraper {
  protected config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Returns true if this scraper handles the given city + state */
  handles(city: string, state: string): boolean {
    return (
      this.config.state.toUpperCase() === state.toUpperCase() &&
      this.config.handles.includes(city.toLowerCase().trim())
    );
  }

  /** Runs the scraper with retry logic. Returns null on repeated failure. */
  async run(permitNumber: string, address: string): Promise<ScrapeResult | null> {
    const maxAttempts = 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.scrape(permitNumber, address);
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          // Exponential backoff: 2s, 4s
          await sleep(2000 * attempt);
        }
      }
    }

    console.error(
      `[${this.config.cityName}] Scrape failed after ${maxAttempts} attempts for ${permitNumber}:`,
      lastError
    );
    return null;
  }

  // ── Abstract methods ────────────────────────────────────────────────────────

  /**
   * Implement in each city scraper.
   * Should throw on network / parsing errors — BaseScraper.run() handles retries.
   */
  protected abstract scrape(
    permitNumber: string,
    address: string
  ): Promise<ScrapeResult>;

  // ── Helper utilities ────────────────────────────────────────────────────────

  /**
   * Maps raw text from a city portal to one of our canonical status values.
   * Override in city scrapers to customize the mapping.
   */
  protected normalizeStatus(rawText: string): PermitStatus {
    const text = rawText.toUpperCase();

    if (text.includes("CLEARED") || text.includes("FINALED") || text.includes("COMPLETE")) {
      return "CLEARED";
    }
    if (text.includes("APPROVED") || text.includes("ISSUED")) {
      return "APPROVED";
    }
    if (text.includes("DENIED") || text.includes("REJECTED") || text.includes("REVOKED")) {
      return "REJECTED";
    }
    if (text.includes("PENDING") || text.includes("IN REVIEW") || text.includes("SUBMITTED")) {
      return "PENDING";
    }

    return "UNKNOWN";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
