// Permit status vocabularies — the single source of truth.
//
// These maps are shared by BOTH the scraper engine (scrapers/cities/*.ts) and
// the public checker (app/api/check-permit/route.ts). They used to be
// duplicated: each scraper carried its own map while the route carried a
// separate generic one. That guaranteed eventual drift — the same permit could
// report one status in a user's dashboard and a different one in the free
// checker. One definition, imported by both, makes that impossible.
//
// This module is deliberately dependency-free (types only) so the Next.js
// bundle can import it. The scraper modules themselves cannot be imported by
// the app: Austin still keeps a Playwright portal fallback, and pulling
// `playwright` into the client build would break it.
//
// ── HOW TO ADD OR CHANGE A MAP ───────────────────────────────────────────────
// Never guess a status string. Query the city's API and enumerate the real
// vocabulary first (GROUP BY the status column), then map every value it
// actually emits. Counts in the comments are from that enumeration and are
// there so the next person can tell a common status from a long-tail one.
//
// Statuses that describe an administrative non-state ("Not Needed", "CAGIS")
// map to UNKNOWN on purpose: the engine records those checks as inconclusive
// rather than inventing a permit state.

import type { PermitStatus } from "../types";

export type StatusMap = Record<string, PermitStatus>;

/**
 * Look up a raw status string in a city's status map.
 *
 * Exact match wins over substring match, ALWAYS. Substring matching alone is
 * order-dependent and silently wrong: a map listing "ACTIVE" before "INACTIVE
 * PENDING REVISION" maps the latter to APPROVED, and "CLOSED" before "DENIED"
 * maps "Denied but Closed" to CLEARED. Both are real values in the live Austin
 * dataset.
 *
 * So: try the whole string first. Only if nothing matches exactly do we fall
 * back to substring, and then longest-key-first so the most specific phrase
 * ("FINAL INSPECTION" over "FINAL") wins regardless of declaration order.
 *
 * Returns null if neither pass matches, so the caller can decide whether to
 * try the generic normaliser or report UNKNOWN.
 */
export function matchStatus(rawText: string, map: StatusMap): PermitStatus | null {
  const key = rawText.toUpperCase().trim();
  if (!key) return null;

  // Pass 1 — exact match on the full status string.
  const exact = map[key];
  if (exact) return exact;

  // Pass 2 — substring, longest key first (most specific wins).
  const bySpecificity = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const portalText of bySpecificity) {
    if (key.includes(portalText)) return map[portalText];
  }

  return null;
}

/**
 * Generic status normaliser — covers common portal language for cities whose
 * map has no entry for a value.
 *
 * Returning "UNKNOWN" means the status could not be determined. The engine
 * treats that as a scrape failure, not a result: it is never persisted, and it
 * increments the per-city health counter. Never return a plausible-looking
 * status (e.g. PENDING) as a stand-in for "we don't know" — that is exactly
 * what let a dead scraper report healthy runs for months.
 */
export function normalizeStatus(rawText: string): PermitStatus {
  const t = rawText.toUpperCase().trim();

  if (t.includes("FINAL") || t.includes("CLEARED") || t.includes("COMPLETE") || t.includes("CO ISSUED")) {
    return "CLEARED";
  }
  if (t.includes("ISSUED") || t.includes("APPROVED") || t.includes("ACTIVE")) {
    return "APPROVED";
  }
  if (t.includes("UNDER REVIEW") || t.includes("IN REVIEW") || t.includes("HOLD")) {
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

// ── Austin, TX ────────────────────────────────────────────────

// Keys are matched exact-first by BaseScraper.matchStatus(), so multi-word
// values like "DENIED BUT CLOSED" resolve correctly instead of colliding with
// the shorter "CLOSED" / "ACTIVE" keys under substring matching.
//
// The first block is the COMPLETE status_current vocabulary of dataset
// 3syk-w9eu, verified against the live API (counts as of 2026-08-07). Keeping
// it exhaustive means exact match handles every real row and the substring
// pass below is only a safety net for values Austin adds later.

export const AUSTIN_STATUS_MAP: StatusMap = {
  // ── Complete live vocabulary (status_current) ─────────────────────────────

  // Work finished / permit closed out
  "FINAL":                            "CLEARED",   // 2,000,252
  "CLOSED":                           "CLEARED",   // 129

  // Permit issued and active — work may proceed
  "ACTIVE":                           "APPROVED",  // 27,673

  // Application received, not yet reviewed
  "PENDING":                          "PENDING",   // 229
  "PENDING PERMIT":                   "PENDING",   // 65
  "AWAITING UPLOAD":                  "PENDING",   // 1
  "AWAITING UPDATE":                  "PENDING",   // 1

  // In review / held — not yet decided
  "INACTIVE PENDING REVISION":        "UNDER_REVIEW", // 115
  "ON HOLD":                          "UNDER_REVIEW", // 76
  "RE REVIEW":                        "UNDER_REVIEW", // 55
  "SUSPENDED":                        "UNDER_REVIEW", // 26
  "INACTIVE CONTRACTOR":              "UNDER_REVIEW", // 3
  "APPLICATION INCOMPLETE":           "UNDER_REVIEW", // 2

  // Permit lapsed without final inspection
  "EXPIRED":                          "EXPIRED",   // 168,987
  "EXPIRED - LICENSE":                "EXPIRED",   // 12

  // Denied / pulled / voided — terminal, not recoverable
  "VOID":                             "REJECTED",  // 153,210
  "WITHDRAWN":                        "REJECTED",  // 17,493
  "CANCELLED":                        "REJECTED",  // 675
  "ABORTED":                          "REJECTED",  // 120
  "CANCELLED - CONTRACTOR REQUIRED":  "REJECTED",  // 119
  "DENIED BUT CLOSED":                "REJECTED",  // 43  (NOT "CLOSED"/CLEARED)
  "CANCELLED - NEW PERMIT REQUIRED":  "REJECTED",  // 9
  "NEW PERMIT REQUIRED":              "REJECTED",  // 3
  "REVOKED":                          "REJECTED",  // 2
  "REJECTED":                         "REJECTED",  // 1

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  // Not present in the current dataset; retained so a future Austin status
  // string still lands somewhere sensible rather than UNKNOWN.

  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "ISSUED":                    "APPROVED",

  "APPLICATION RECEIVED":      "PENDING",
  "SUBMITTED":                 "PENDING",
  "APPLICATION":               "PENDING",
  "IN QUEUE":                  "PENDING",
  "INTAKE":                    "PENDING",

  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "INSPECTION":                "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "DENIED":                    "REJECTED",
};

// ── Columbus, OH ──────────────────────────────────────────────

//
// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.
//
// The first two blocks are the COMPLETE live vocabularies of both status
// columns, verified against the service (counts as of 2026-08-07). Note that
// "Final Inspection Approved" MUST be an exact key: under substring matching it
// hits "APPROVED" and reports APPROVED, when it actually means the work passed
// final inspection and is CLEARED — the single most common status in the layer.

export const COLUMBUS_STATUS_MAP: StatusMap = {
  // ── PERMIT_STATUS — complete live vocabulary ──────────────────────────────

  "FINAL INSPECTION APPROVED":        "CLEARED",   // 463,992
  "CERTIFICATE OF OCCUPANCY ISSUED":  "CLEARED",   // 30,994
  "PERMIT ISSUED":                    "APPROVED",  // 166,784
  "EXPIRED PERMIT":                   "EXPIRED",   // 15,124

  // ── B1_APPL_STATUS — complete live vocabulary ─────────────────────────────

  "CLOSED":                  "CLEARED",      // 519,919
  "ISSUED":                  "APPROVED",     // 97,510
  "ISSUED ONLINE":           "APPROVED",     // 1
  "ACTIVE":                  "APPROVED",     // 511
  "OPEN":                    "APPROVED",     // 15
  "EXPIRED":                 "EXPIRED",      // 5,969
  "EXPIRED NO PERMIT":       "EXPIRED",      // 9
  "APPLIED ONLINE":          "PENDING",      // 6
  "ISSUANCE PENDING":        "PENDING",      // 4
  "CORRECTIONS REQUIRED":    "UNDER_REVIEW", // 3
  "UNDER REVIEW":            "UNDER_REVIEW", // 3
  "VOID":                    "REJECTED",     // 281
  "VOID - WRONG CAP TYPE":   "REJECTED",     // 715
  "VOID - DUPLICATE":        "REJECTED",     // 528
  "VOID - ENTERED IN ERROR": "REJECTED",     // 439
  "VOID - TEST":             "REJECTED",     // 8
  "WITHDRAWN":               "REJECTED",     // 39

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  // Not currently emitted by either column; retained so a future Columbus
  // status string lands somewhere sensible rather than UNKNOWN.

  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",

  "APPROVED":                  "APPROVED",

  "APPLICATION RECEIVED":      "PENDING",
  "APPLICATION":               "PENDING",
  "SUBMITTED":                 "PENDING",
  "PENDING":                   "PENDING",
  "IN QUEUE":                  "PENDING",
  "APPLIED":                   "PENDING",
  "INTAKE":                    "PENDING",

  "PLAN REVIEW":               "UNDER_REVIEW",
  "PLAN CHECK":                "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "INSPECTION":                "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "CANCELLED":                 "REJECTED",
  "REJECTED":                  "REJECTED",
  "REVOKED":                   "REJECTED",
  "VOIDED":                    "REJECTED",
  "DENIED":                    "REJECTED",
  "LAPSED":                    "EXPIRED",
};

// ── Cleveland, OH ─────────────────────────────────────────────

//
// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.
// This is the COMPLETE live CURRENT_TASK_STATUS vocabulary, verified against
// the service (counts as of 2026-08-07).

export const CLEVELAND_STATUS_MAP: StatusMap = {
  // ── Finished ──────────────────────────────────────────────────────────────
  "INSPECTION APPROVED":              "CLEARED",   // 96,367
  "PERMIT CLOSED":                    "CLEARED",   // 49,368
  "PERMIT CLOSED/NON-COMPLIANT":      "CLEARED",   // 3,787 — closed, flagged
  "PERMIT CLOSED - NON-COMPLIANT":    "CLEARED",   // 77
  "INSPECTION PASSED":                "CLEARED",   // 47
  "CLOSED - PENDING SEED & STRAW":    "CLEARED",   // 6
  "COMPLETE":                         "CLEARED",   // 4
  "APPLICATION CLOSURE APPROVED":     "CLEARED",   // 1

  // ── Issued / work may proceed ─────────────────────────────────────────────
  "PERMIT ISSUANCE APPROVED":         "APPROVED",  // 20,244
  "INSPECTION APPROVED - C.O. REQ":   "APPROVED",  // 8,110 — CO still required
  "CLOSURE PENDING":                  "APPROVED",  // 123 — work done, closing out
  "CERTIFICATE OF OCCUPANCY PENDING": "APPROVED",  // 15
  "CERTIFICATE OF COMPLETION PENDING":"APPROVED",  // 8
  "APPROVE":                          "APPROVED",  // 29
  "ISSUED":                           "APPROVED",  // 11
  "CONDITIONAL APPROVAL":             "APPROVED",  // 1
  "PERMIT ISSUANCE COMPLETE":         "APPROVED",  // 1
  "ISSUE PERMIT - INTAKE APPROVED":   "APPROVED",  // 1

  // ── In review / action needed ─────────────────────────────────────────────
  "INSPECTION PENDING":               "UNDER_REVIEW", // 8,154
  "NSPECTION PENDING":                "UNDER_REVIEW", // 1 — typo in source data
  "NON-COMPLIANT":                    "UNDER_REVIEW", // 5,329
  "REVIEW COMPLETE ALERT ASSESSMT":   "UNDER_REVIEW", // 729
  "REOPENED":                         "UNDER_REVIEW", // 248
  "CERTIFICATE REVIEW":               "UNDER_REVIEW", // 49
  "ZONING REVIEW PENDING":            "UNDER_REVIEW", // 11
  "REVISIONS RECEIVED":               "UNDER_REVIEW", // 10
  "INSPECTION FAILED":                "UNDER_REVIEW", // 2 — rework, not rejection
  "APPEAL PENDING":                   "UNDER_REVIEW", // 2
  "APPEAL NOT FILED":                 "UNDER_REVIEW", // 1
  "CASHIER DECLINED":                 "UNDER_REVIEW", // 1 — payment needs action
  "NO EXCEPT - MAKE CORR NOTED":      "UNDER_REVIEW", // 1
  // Intermediate sub-review approvals — NOT permit approval.
  "FIRE REVIEW APPROVED":             "UNDER_REVIEW", // 2
  "PLAN REVIEW APPROVED":             "UNDER_REVIEW", // 1

  // ── Pre-issuance ──────────────────────────────────────────────────────────
  "CASHIER APPROVED":                 "PENDING",   // 5,735 — paid, awaiting issue
  "PLANS RECEIVED":                   "PENDING",   // 61
  "PERMIT ISSUANCE PENDING":          "PENDING",   // 1
  "ISSUANCE DOCUMENTS RECEIVED":      "PENDING",   // 1

  // ── Terminal negative ─────────────────────────────────────────────────────
  "DISCARD":                          "REJECTED",  // 23
  "CLOSED - DISCARD":                 "REJECTED",  // 14
  "APPLICATION DECLINED":             "REJECTED",  // 4
  "DENY":                             "REJECTED",  // 4
  "APPLICATION REVIEW DECLINED":      "REJECTED",  // 1

  // ── Administrative non-statuses ───────────────────────────────────────────
  // These describe a workflow task that doesn't apply, not a permit state.
  // Mapping them to a real status would be a guess, so they stay UNKNOWN and
  // the engine records the check as inconclusive.
  "NOT NEEDED":                       "UNKNOWN",   // 24
  "NOT APPLICABLE":                   "UNKNOWN",   // 1

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "CLOSED":                    "CLEARED",
  "FINAL":                     "CLEARED",

  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",

  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "APPLICATION RECEIVED":      "PENDING",
  "SUBMITTED":                 "PENDING",
  "PENDING":                   "PENDING",
  "INTAKE":                    "PENDING",

  "WITHDRAWN":                 "REJECTED",
  "CANCELLED":                 "REJECTED",
  "REVOKED":                   "REJECTED",
  "DENIED":                    "REJECTED",
  "VOID":                      "REJECTED",

  "EXPIRED":                   "EXPIRED",
  "LAPSED":                    "EXPIRED",
};

// ── Cincinnati, OH ────────────────────────────────────────────

//
// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.
// Both live vocabularies below are complete, verified against the dataset
// (counts as of 2026-08-07).

export const CINCINNATI_STATUS_MAP: StatusMap = {
  // ── statuscurrentmapped — human labels ────────────────────────────────────
  "PERMIT FINALED":       "CLEARED",      // 140,342
  "PERMIT ISSUED":        "APPROVED",     // 22,272
  "IN REVIEW":            "UNDER_REVIEW", // 5,659
  "PERMIT WITHDRAWN":     "REJECTED",     // 4,750
  "APPLICATION ACCEPTED": "PENDING",      // 3,248

  // ── statuscurrent — raw codes ─────────────────────────────────────────────
  "CLOSED":    "CLEARED",      // 140,342
  "XCLOSED":   "CLEARED",      // 19
  "ISSUED":    "APPROVED",     // 22,233
  "APPROVED":  "APPROVED",     // 479
  "APRV_NR":   "APPROVED",     // 82  — approved, no review required
  "TEMPCOFO":  "APPROVED",     // 2   — temporary certificate of occupancy
  "RENEW":     "APPROVED",     // 1
  "ROUTE":     "UNDER_REVIEW", // 5,659 — routed to reviewers
  "ENGRCHNG":  "UNDER_REVIEW", // 37  — engineering change requested
  "REVIEWED":  "UNDER_REVIEW", // 7
  "HOLD":      "UNDER_REVIEW", // 3
  "ADD INS":   "UNDER_REVIEW", // 1   — additional inspection required
  "APPLIED":   "PENDING",      // 3,248
  "PAID":      "PENDING",      // 281 — fees paid, awaiting issuance
  "BILLED":    "PENDING",      // 1
  "WITHDRWN":  "REJECTED",     // 4,750
  "W/REFUND":  "REJECTED",     // 57  — withdrawn with refund
  "VOIDED":    "REJECTED",     // 5
  "REVOKED":   "REJECTED",     // 4
  "DENIED":    "REJECTED",     // 1
  "EXPIRED":   "EXPIRED",      // 1,581
  "APP_EXP":   "EXPIRED",      // 93  — application expired

  // Internal system marker, not a permit state — see Cleveland for rationale.
  "CAGIS":     "UNKNOWN",      // 1

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",

  "ACTIVE":                    "APPROVED",

  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "PLAN REVIEW":               "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "INSPECTION":                "UNDER_REVIEW",

  "APPLICATION RECEIVED":      "PENDING",
  "APPLICATION":               "PENDING",
  "SUBMITTED":                 "PENDING",
  "PENDING":                   "PENDING",
  "INTAKE":                    "PENDING",

  "WITHDRAWN":                 "REJECTED",
  "CANCELLED":                 "REJECTED",
  "REJECTED":                  "REJECTED",
  "VOID":                      "REJECTED",

  "LAPSED":                    "EXPIRED",
};

// ── Philadelphia, PA ──────────────────────────────────────────

// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.

export const PHILADELPHIA_STATUS_MAP: StatusMap = {
  // ── Live values missing from the original map ─────────────────────────────
  // Verified against `SELECT status, count(*) FROM permits GROUP BY status`
  // (2026-08-07). Without these, every one of these rows fell through to
  // normalizeStatus() and came back UNKNOWN — i.e. counted as a scrape failure.

  "ABANDONED":                         "REJECTED",     // 1,907
  "REFUSED":                           "REJECTED",     // 1,308
  "STOP WORK":                         "UNDER_REVIEW", // 305
  "AMENDMENT APPLICATION INCOMPLETE":  "UNDER_REVIEW", // 217
  "AMENDMENT APPLICANT REVISIONS":     "UNDER_REVIEW", // 149
  "AMENDMENT READY FOR ISSUE":         "PENDING",      // 99
  "AMENDMENT REVIEW":                  "UNDER_REVIEW", // 78
  "AMENDMENT REQUESTED":               "UNDER_REVIEW", // 37
  "AMENDMENT DENIED":                  "REJECTED",     // 8
  "READY FOR ISSUE":                   "PENDING",      // 1
  "EXPIRED DENIAL":                    "REJECTED",     // 1

  // ── Primary mappings ──────────────────────────────────────────────────────

  // Permit issued and active — work may proceed
  "ISSUED":                    "APPROVED",
  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",
  "PERMIT ISSUED":             "APPROVED",

  // Work finished / final inspection passed
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",
  "CLOSED":                    "CLEARED",
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "FINAL INSPECTION":          "CLEARED",

  // Application received, not yet reviewed / under review
  "UNDER REVIEW":              "PENDING",
  "IN REVIEW":                 "PENDING",
  "PENDING":                   "PENDING",
  "SUBMITTED":                 "PENDING",
  "APPLICATION":               "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "IN QUEUE":                  "PENDING",
  "INTAKE":                    "PENDING",
  "PLAN REVIEW":               "PENDING",
  "PLAN CHECK":                "PENDING",
  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",
  "ZONING REVIEW":             "UNDER_REVIEW",
  "ZONING":                    "UNDER_REVIEW",
  "L&I REVIEW":                "UNDER_REVIEW",

  // Permit lapsed
  "EXPIRED":                   "EXPIRED",
  "LAPSED":                    "EXPIRED",

  // Denied / cancelled
  "DENIED":                    "REJECTED",
  "REJECTED":                  "REJECTED",
  "WITHDRAWN":                 "REJECTED",
  "REVOKED":                   "REJECTED",
  "CANCELLED":                 "REJECTED",
  "VOID":                      "REJECTED",
  "VOIDED":                    "REJECTED",
};

// ── Pittsburgh, PA ────────────────────────────────────────────

//
// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.
// This is the COMPLETE live vocabulary, verified against the datastore
// (counts as of 2026-08-07).

export const PITTSBURGH_STATUS_MAP: StatusMap = {
  // ── Finished ──────────────────────────────────────────────────────────────
  "COMPLETED":                        "CLEARED",      // 42,828

  // ── Issued / work may proceed ─────────────────────────────────────────────
  "ISSUED":                           "APPROVED",     // 15,484

  // ── Pre-issuance — the states our users actually wait on ──────────────────
  "READY FOR ISSUE":                  "PENDING",      // 10 — approved, NOT issued
  "APPLICATION FINALIZATION":         "PENDING",      // 124

  // ── In review / action needed ─────────────────────────────────────────────
  "AMENDMENT APPLICANT REVISIONS":    "UNDER_REVIEW", // 90
  "AMENDMENT APPLICATION INCOMPLETE": "UNDER_REVIEW", // 57
  "STOP WORK":                        "UNDER_REVIEW", // 30 — issued but halted
  "AMENDMENT REVIEW":                 "UNDER_REVIEW", // 26
  "APPLICANT REVISIONS":              "UNDER_REVIEW", // 10
  "AMENDMENT REQUESTED":              "UNDER_REVIEW", // 6
  "IN REVIEW":                        "UNDER_REVIEW", // 1

  // ── Terminal negative ─────────────────────────────────────────────────────
  "REVOKED":                          "REJECTED",     // 701

  // ── Lapsed ────────────────────────────────────────────────────────────────
  "EXPIRED":                          "EXPIRED",      // 4,772

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "CLOSED":                    "CLEARED",
  "FINAL":                     "CLEARED",

  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",

  "CORRECTIONS REQUIRED":      "UNDER_REVIEW",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "PLAN REVIEW":               "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "APPLICATION RECEIVED":      "PENDING",
  "APPLICATION":               "PENDING",
  "SUBMITTED":                 "PENDING",
  "PENDING":                   "PENDING",
  "INTAKE":                    "PENDING",

  "WITHDRAWN":                 "REJECTED",
  "CANCELLED":                 "REJECTED",
  "REJECTED":                  "REJECTED",
  "DENIED":                    "REJECTED",
  "VOID":                      "REJECTED",

  "LAPSED":                    "EXPIRED",
};

// ── City registry ─────────────────────────────────────────────────────────────

/**
 * City slug → status map. Keys must match lib/cities.ts slugs and the entries
 * in LIVE_CHECKER_CITIES.
 */
export const CITY_STATUS_MAPS: Record<string, StatusMap> = {
  austin:       AUSTIN_STATUS_MAP,
  columbus:     COLUMBUS_STATUS_MAP,
  cleveland:    CLEVELAND_STATUS_MAP,
  cincinnati:   CINCINNATI_STATUS_MAP,
  philadelphia: PHILADELPHIA_STATUS_MAP,
  pittsburgh:   PITTSBURGH_STATUS_MAP,
};

/**
 * Resolve a city's raw status text to a PermitStatus, falling back to the
 * generic normaliser. Used by the public checker; the scrapers call
 * BaseScraper.mapStatus(), which resolves to exactly the same logic.
 */
export function resolveStatus(citySlug: string, rawText: string): PermitStatus {
  const map = CITY_STATUS_MAPS[citySlug];
  if (!map) return normalizeStatus(rawText);
  return matchStatus(rawText, map) ?? normalizeStatus(rawText);
}
