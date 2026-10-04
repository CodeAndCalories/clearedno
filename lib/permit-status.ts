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

  // Checked first: "Reviews Complete - Ready for Issue" must not hit COMPLETE
  // (CLEARED), and "Approved - Ready to Issue" must not hit APPROVED (issued).
  if (t.includes("READY FOR ISSU") || t.includes("READY TO ISSUE")) {
    return "READY_TO_ISSUE";
  }
  if (t.includes("FINAL") || t.includes("CLEARED") || t.includes("COMPLETE") || t.includes("CO ISSUED")) {
    return "CLEARED";
  }
  if (t.includes("ISSUED") || t.includes("APPROVED") || t.includes("ACTIVE")) {
    return "APPROVED";
  }
  // Applicant-must-act phrasing is checked before the generic review bucket:
  // "Corrections Required" contains no review keyword, but a future
  // "Corrections Required - In Review" must still land on ACTION_REQUIRED.
  if (
    t.includes("CORRECTIONS REQUIRED") || t.includes("REVISIONS REQUIRED") ||
    t.includes("INFO REQUESTED")       || t.includes("INFORMATION REQUESTED") ||
    t.includes("AWAITING INFORMATION") || t.includes("APPLICANT REVISIONS") ||
    t.includes("APPLICATION INCOMPLETE")
  ) {
    return "ACTION_REQUIRED";
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

  // Ambiguous — see AUSTIN_ISSUE_DATE_AMBIGUOUS. This dataset is "Issued
  // Construction Permits": every one of its 2,378,779 rows has an issue_date
  // (2026-10-04), so with the issue date these resolve to APPROVED. PENDING is
  // only what they map to when no issue date is known.
  "PENDING":                          "PENDING",   // 229
  "PENDING PERMIT":                   "PENDING",   // 56

  // Applicant must act — the city is waiting on the applicant
  // (re-enumerated 2026-09-04; "Awaiting Update" no longer appears live)
  "AWAITING UPLOAD":                  "ACTION_REQUIRED", // 1 — documents not uploaded
  "AWAITING UPDATE":                  "ACTION_REQUIRED", // 0 — retained from 2026-08-07
  "APPLICATION INCOMPLETE":           "ACTION_REQUIRED", // 2
  "INACTIVE PENDING REVISION":        "ACTION_REQUIRED", // 72 — inactive until applicant revises
  "INACTIVE CONTRACTOR":              "ACTION_REQUIRED", // 3 — applicant must assign a contractor

  // In review / held — with the city, or ambiguous who acts
  "ON HOLD":                          "UNDER_REVIEW", // 65
  "RE REVIEW":                        "UNDER_REVIEW", // 55
  "SUSPENDED":                        "UNDER_REVIEW", // 26

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

  "CORRECTIONS REQUIRED":      "ACTION_REQUIRED",
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
  "CORRECTIONS REQUIRED":    "ACTION_REQUIRED", // 3 — applicant must act
  "UNDER REVIEW":            "UNDER_REVIEW",    // 3
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
  "REVIEW COMPLETE ALERT ASSESSMT":   "UNDER_REVIEW", // 729
  "REOPENED":                         "UNDER_REVIEW", // 248
  "CERTIFICATE REVIEW":               "UNDER_REVIEW", // 49
  "ZONING REVIEW PENDING":            "UNDER_REVIEW", // 11
  "REVISIONS RECEIVED":               "UNDER_REVIEW", // 10
  "APPEAL PENDING":                   "UNDER_REVIEW", // 2
  "APPEAL NOT FILED":                 "UNDER_REVIEW", // 1

  // ── Applicant must act ────────────────────────────────────────────────────
  // Inspection outcomes that mean "correct the work and re-inspect", plus a
  // declined payment. These are the contractor's move, not the city's.
  "NON-COMPLIANT":                    "ACTION_REQUIRED", // 5,329 — failed inspection, correct & reschedule
  "INSPECTION FAILED":                "ACTION_REQUIRED", // 2     — rework, not rejection
  "NO EXCEPT - MAKE CORR NOTED":      "ACTION_REQUIRED", // 1     — corrections noted on plans
  "CASHIER DECLINED":                 "ACTION_REQUIRED", // 1     — payment must be redone
  "AWAITING PLANS":                   "ACTION_REQUIRED", // 1     — new 2026-10; city waits on the applicant's plans
  // Intermediate sub-review approvals — NOT permit approval.
  "FIRE REVIEW APPROVED":             "UNDER_REVIEW", // 2
  "PLAN REVIEW APPROVED":             "UNDER_REVIEW", // 1

  // ── Pre-issuance ──────────────────────────────────────────────────────────
  // Cleveland is deliberately NOT in ISSUE_DATE_AMBIGUOUS, so these stay
  // PENDING. ISSUE_DATE is set on all 201,363 rows (2026-10-04), including
  // records the city has not issued: "Application Declined" under task
  // "Application Acceptance", and "Plans Received" / "Awaiting Plans" under
  // "Application Review". Here it is not evidence of issuance.
  "CASHIER APPROVED":                 "PENDING",   // 5,679 — paid, awaiting issue
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
  // Ambiguous — see CINCINNATI_ISSUE_DATE_AMBIGUOUS. "Approved" is its own
  // label, separate from "Permit Issued", and 430 of its 465 rows have no
  // issueddate; 68 of 81 APRV_NR rows have none either (2026-10-04). Without an
  // issue date they resolve to READY_TO_ISSUE. APPROVED is only what they map
  // to when the issue date is present, or unknown.
  "APPROVED":  "APPROVED",     // 465
  "APRV_NR":   "APPROVED",     // 81  — approved, no review required
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

  // Internal system markers, not permit states — see Cleveland for rationale.
  "CAGIS":     "UNKNOWN",      // 1
  "SUBPERM":   "UNKNOWN",      // 1 — sub-permit marker, appeared 2026-09

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",

  "ACTIVE":                    "APPROVED",

  "CORRECTIONS REQUIRED":      "ACTION_REQUIRED",
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
  "STOP WORK":                         "UNDER_REVIEW",    // 296 — enforcement; who acts is ambiguous
  // Applicant must act (re-enumerated 2026-09-04)
  "AMENDMENT APPLICATION INCOMPLETE":  "ACTION_REQUIRED", // 224
  "AMENDMENT APPLICANT REVISIONS":     "ACTION_REQUIRED", // 157
  // Review done, issuance next — READY_TO_ISSUE (migration 021). For an
  // amendment the original permit is already issued; this is the amendment
  // that is approved and waiting to be issued. Counts re-checked 2026-10-04.
  "AMENDMENT READY FOR ISSUE":         "READY_TO_ISSUE",  // 92
  "AMENDMENT REVIEW":                  "UNDER_REVIEW",    // 89
  "AMENDMENT REQUESTED":               "UNDER_REVIEW",    // 55 — applicant asked for it; city acts
  "AMENDMENT DENIED":                  "REJECTED",        // 9
  "IN REVIEW":                         "UNDER_REVIEW",    // 2 — was falling through to the PENDING fallback
  "READY FOR ISSUE":                   "READY_TO_ISSUE",  // 1
  "EXPIRED DENIAL":                    "REJECTED",        // 1

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

  // Application received, not yet reviewed / under review.
  // "IN REVIEW" is a live value and is mapped UNDER_REVIEW in the block above;
  // it used to sit here as PENDING, which is what the drift check flagged.
  "UNDER REVIEW":              "PENDING",
  "PENDING":                   "PENDING",
  "SUBMITTED":                 "PENDING",
  "APPLICATION":               "PENDING",
  "APPLICATION RECEIVED":      "PENDING",
  "IN QUEUE":                  "PENDING",
  "INTAKE":                    "PENDING",
  "PLAN REVIEW":               "PENDING",
  "PLAN CHECK":                "PENDING",
  "CORRECTIONS REQUIRED":      "ACTION_REQUIRED",
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
  // Approved, NOT issued. 0 live rows on 2026-10-04 (10 on 2026-09-04); kept
  // so the next one resolves correctly.
  "READY FOR ISSUE":                  "READY_TO_ISSUE", // 0
  // Ambiguous — see PITTSBURGH_ISSUE_DATE_AMBIGUOUS. All 125 live rows carry
  // an issue_date (2026-10-04), so with the issue date it resolves to APPROVED.
  // PENDING is only what it maps to when no issue date is known.
  "APPLICATION FINALIZATION":         "PENDING",      // 125

  // ── Applicant must act (re-enumerated 2026-09-04) ─────────────────────────
  "AMENDMENT APPLICANT REVISIONS":    "ACTION_REQUIRED", // 86
  "AMENDMENT APPLICATION INCOMPLETE": "ACTION_REQUIRED", // 60
  "APPLICANT REVISIONS":              "ACTION_REQUIRED", // 11

  // ── In review — with the city, or ambiguous who acts ──────────────────────
  "STOP WORK":                        "UNDER_REVIEW", // 32 — issued but halted
  "AMENDMENT REVIEW":                 "UNDER_REVIEW", // 23
  "AMENDMENT REQUESTED":              "UNDER_REVIEW", // 2 — applicant asked for it; city acts
  "IN REVIEW":                        "UNDER_REVIEW", // 1
  "REVIEWS PAUSED":                   "UNDER_REVIEW", // 1 — new since 2026-08-07; reason not published

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

  "CORRECTIONS REQUIRED":      "ACTION_REQUIRED",
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

// ── Seattle, WA ───────────────────────────────────────────────

//
// Matched exact-first by BaseScraper.matchStatus(), then longest-substring.
// This is the COMPLETE live `statuscurrent` vocabulary of dataset 76t5-zqzr,
// verified against the API (counts as of 2026-09-04): 24 values. The brief
// that added this city listed 17 — the seven it omitted are tagged [+] below
// and were found by GROUP BY on the live endpoint, not guessed.
//
// Seattle publishes the richest PRE-ISSUANCE workflow of any city we track:
// thirteen of the 24 values describe a permit that has not been issued yet.
//
// ── ACTION_REQUIRED vs UNDER_REVIEW ──────────────────────────────────────────
// Three values mean "the APPLICANT must act": Corrections Required,
// Additional Info Requested, Awaiting Information. One means "the CITY is
// working — wait": Reviews In Process. They used to share UNDER_REVIEW; the
// ACTION_REQUIRED status (migration 020) exists so the first three get a
// louder badge and an alert that says what to do. "Corrections Submitted" is
// the applicant's response landing back with the city, so it stays
// UNDER_REVIEW.
//
// "Ready for Issuance" is READY_TO_ISSUE, not APPROVED: the permit has not
// been issued and work may not legally start. It is not PENDING either, which
// would make finishing review read like a step backwards (migration 021).
// "Approved to Occupy" is CLEARED, not APPROVED — it is the certificate of
// occupancy, the end of the lifecycle. Both MUST stay exact keys: under
// substring matching each would hit the "APPROVED" fallback.
//
// "Reviews Completed" stays PENDING. It is not always followed by issuance:
// of 470 live rows (2026-10-04), 192 are ECA/shoreline exemption requests,
// where it is the final state; 214 are demolition and 62 are building.

export const SEATTLE_STATUS_MAP: StatusMap = {
  // ── Finished ──────────────────────────────────────────────────────────────
  "COMPLETED":                 "CLEARED",      // 133,863
  "CLOSED":                    "CLEARED",      // 8,967
  "APPROVED TO OCCUPY":        "CLEARED",      // 26  [+] certificate of occupancy

  // ── Issued / work may proceed ─────────────────────────────────────────────
  "ISSUED":                    "APPROVED",     // 8,392
  "ACTIVE":                    "APPROVED",     // 268
  "PHASE ISSUED":              "APPROVED",     // 13  [+] a phase of a phased permit is issued
  // Inspections passed but the permit is not finaled — same call as
  // Cleveland's "Inspection Approved - C.O. Req". Not CLEARED until "Completed".
  "INSPECTIONS COMPLETED":     "APPROVED",     // 142 [+]

  // ── Pre-issuance: intake / queued — received, not yet under review ────────
  "INITIATED":                 "PENDING",      // 219  — application started online
  "READY FOR INTAKE":          "PENDING",      // 291
  "SCHEDULED":                 "PENDING",      // 1,940 — intake appointment scheduled
  "SCHEDULED AND SUBMITTED":   "PENDING",      // 82   [+]
  "APPLICATION COMPLETED":     "PENDING",      // 732  — intake done, review not started (NOT "COMPLETED")
  "PENDING":                   "PENDING",      // 2    [+]

  // ── Pre-issuance: reviews done, awaiting issuance ─────────────────────────
  "REVIEWS COMPLETED":         "PENDING",        // 470 — not always followed by issuance (NOT "COMPLETED")
  "READY FOR ISSUANCE":        "READY_TO_ISSUE", // 665 — approved, NOT issued

  // ── In review — with the city, wait ───────────────────────────────────────
  "REVIEWS IN PROCESS":        "UNDER_REVIEW", // 616
  "CORRECTIONS SUBMITTED":     "UNDER_REVIEW", // 9    [+] applicant responded, back with the city

  // ── APPLICANT must act — the city is waiting on the applicant ─────────────
  "ADDITIONAL INFO REQUESTED": "ACTION_REQUIRED", // 10,147
  "CORRECTIONS REQUIRED":      "ACTION_REQUIRED", // 2,109
  "AWAITING INFORMATION":      "ACTION_REQUIRED", // 528

  // ── Terminal negative ─────────────────────────────────────────────────────
  "WITHDRAWN":                 "REJECTED",     // 5,160
  "CANCELED":                  "REJECTED",     // 4,574 — Seattle spells it with one L
  "DENIED":                    "REJECTED",     // 1    [+]

  // ── Lapsed ────────────────────────────────────────────────────────────────
  "EXPIRED":                   "EXPIRED",      // 13,618

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  // Not emitted today; retained so a future Seattle value lands somewhere
  // sensible rather than UNKNOWN. Exact match on the live keys above always
  // runs first, so none of these can hijack a known value.
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "FINAL":                     "CLEARED",

  "APPROVED":                  "APPROVED",

  "APPLICATION RECEIVED":      "PENDING",
  "APPLICATION":               "PENDING",
  "SUBMITTED":                 "PENDING",
  "INTAKE":                    "PENDING",

  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "CANCELLED":                 "REJECTED",
  "REJECTED":                  "REJECTED",
  "REVOKED":                   "REJECTED",
  "VOID":                      "REJECTED",

  "LAPSED":                    "EXPIRED",
};

// ── Detroit, MI ───────────────────────────────────────────────

//
// Detroit's status comes from TWO ArcGIS layers, neither of which has a
// permit-level status column on its own:
//
//   bseed_building_permit_plan_reviews  task_status  — pre-issuance workflow
//   bseed_building_permits              (none)       — issued permits only;
//                                                      every row has issued_date
//
// The scraper queries both. A row in the permits layer with an issued_date is
// reported as the synthetic raw status "Issued" and mapped here. Otherwise the
// plan-review task_status is mapped. The task_status block is the COMPLETE
// live vocabulary, verified by GROUP BY (counts as of 2026-09-04).
//
// "Plans Approved" (task "Review Complete") is READY_TO_ISSUE, not APPROVED: it
// means plan review passed, and the permit has NOT been issued (23,810 rows
// carry it, most of which were later issued — the permits layer wins for
// those). It MUST stay an exact key or the "APPROVED" fallback would report
// issued-and-buildable for a permit that cannot legally start. It used to be
// PENDING, which made BLD2026-01450's UNDER_REVIEW → Plans Approved on
// 2026-10-03 alert as "PERMIT PENDING" (migration 021).
//
// "Accepted - Document Review Not Required" stays PENDING. Its task is
// "Application Submittal": it is an intake outcome, not a finished review.

export const DETROIT_STATUS_MAP: StatusMap = {
  // ── Issued — synthesised from the permits layer ───────────────────────────
  "ISSUED":                                  "APPROVED",

  // ── Pre-issuance (plan reviews layer, task_status) — complete ─────────────
  "PLANS APPROVED":                          "READY_TO_ISSUE", // 23,810 — review passed, NOT issued
  "ACCEPTED - DOCUMENT REVIEW NOT REQUIRED": "PENDING",      // 8,022  — intake accepted, awaiting issuance
  "ACCEPTED - DOCUMENT REVIEW REQUIRED":     "PENDING",      // 3,887  — intake accepted, not yet routed
  "ROUTED FOR ELECTRONIC REVIEW":            "UNDER_REVIEW", // 3,583
  "ROUTED FOR PAPER REVIEW":                 "UNDER_REVIEW", // 361
  // Applicant must act — the submittal is missing items.
  "INCOMPLETE":                              "ACTION_REQUIRED", // 1

  // ── Generic fallbacks (substring pass only) ───────────────────────────────
  "CERTIFICATE OF OCCUPANCY":  "CLEARED",
  "FINAL INSPECTION":          "CLEARED",
  "CO ISSUED":                 "CLEARED",
  "COMPLETED":                 "CLEARED",
  "FINALED":                   "CLEARED",
  "CLOSED":                    "CLEARED",
  "FINAL":                     "CLEARED",

  "APPROVED":                  "APPROVED",
  "ACTIVE":                    "APPROVED",

  "CORRECTIONS REQUIRED":      "ACTION_REQUIRED",
  "UNDER REVIEW":              "UNDER_REVIEW",
  "IN REVIEW":                 "UNDER_REVIEW",
  "REVIEW":                    "UNDER_REVIEW",
  "ON HOLD":                   "UNDER_REVIEW",
  "HOLD":                      "UNDER_REVIEW",

  "APPLICATION RECEIVED":      "PENDING",
  "APPLICATION":               "PENDING",
  "SUBMITTED":                 "PENDING",
  "ACCEPTED":                  "PENDING",
  "PENDING":                   "PENDING",
  "INTAKE":                    "PENDING",

  "WITHDRAWN":                 "REJECTED",
  "CANCELLED":                 "REJECTED",
  "REJECTED":                  "REJECTED",
  "REVOKED":                   "REJECTED",
  "DENIED":                    "REJECTED",
  "VOID":                      "REJECTED",

  "EXPIRED":                   "EXPIRED",
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
  seattle:      SEATTLE_STATUS_MAP,
  detroit:      DETROIT_STATUS_MAP,
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

// ── Issue date as ground truth ────────────────────────────────────────────────
//
// Some labels don't say whether the permit has been issued. Cincinnati's
// "Approved" sits alongside a separate "Permit Issued" label, and most rows
// carrying it have no issue date. Austin's "Pending" appears on permits that
// were issued months ago. Where the city's dataset publishes a trustworthy
// issue date, it settles those labels:
//
//   ambiguous label that maps to APPROVED + no issue date      → READY_TO_ISSUE
//   ambiguous label that maps to PENDING  + issue date present → APPROVED
//
// Getting the first direction wrong is the costly one. It tells a contractor
// "issued, start work" for a permit that isn't, which is how a stop-work order
// happens.
//
// ONLY labels listed below are touched, by exact match. Explicit labels
// ("Permit Issued", "Finaled", "Plans Approved", "Ready for Issuance",
// "Application Accepted") keep their mapping whatever the issue date says.
// Where a label and the date disagree, the explicit label wins.
//
// A city belongs here only if its issue date is real evidence of issuance.
// Checked 2026-10-04:
//   Cincinnati  issueddate is mostly absent before issuance (APPLIED 3,240 of
//               3,246 rows without; ROUTE 5,742 of 5,749 without).   TRUSTED
//   Austin      dataset is "Issued Construction Permits"; every row has an
//               issue_date that follows its applieddate.             TRUSTED
//   Pittsburgh  WPRDC documents the dataset as "permits issued by PLI" and
//               issue_date as "the date that the permit was issued". TRUSTED
//   Cleveland   ISSUE_DATE is set on every row, including declined
//               applications and records still in Application Review.
//               Undocumented, and contradicted by the city's own
//               workflow data.                                       NOT USED
//   Seattle     no issue date field.                                 n/a
//   Detroit     issuance comes from the permits layer already.       n/a

/** Cincinnati: approval labels that don't say whether the permit is issued. */
export const CINCINNATI_ISSUE_DATE_AMBIGUOUS: ReadonlySet<string> = new Set([
  "APPROVED", // statuscurrentmapped "Approved" / statuscurrent APPROVED — 430 of 465 without issueddate
  "APRV_NR",  // approved, no review required                         — 68 of 81 without issueddate
]);

/** Austin: "pending" labels on a dataset that only holds issued permits. */
export const AUSTIN_ISSUE_DATE_AMBIGUOUS: ReadonlySet<string> = new Set([
  "PENDING",         // 229, all with issue_date
  "PENDING PERMIT",  // 56,  all with issue_date
]);

/** Pittsburgh: a "pending"-mapped label that appears only on issued permits. */
export const PITTSBURGH_ISSUE_DATE_AMBIGUOUS: ReadonlySet<string> = new Set([
  "APPLICATION FINALIZATION", // 125, all with issue_date
]);

/** City slug → ambiguous labels. A city absent here never uses the tiebreaker. */
export const ISSUE_DATE_AMBIGUOUS: Record<string, ReadonlySet<string>> = {
  cincinnati: CINCINNATI_ISSUE_DATE_AMBIGUOUS,
  austin:     AUSTIN_ISSUE_DATE_AMBIGUOUS,
  pittsburgh: PITTSBURGH_ISSUE_DATE_AMBIGUOUS,
};

/**
 * Apply the issue-date tiebreaker to an already-mapped status.
 *
 * `issueDate` must be what the dataset actually returned for this record:
 * null or "" means the record has no issue date. Don't call this when the
 * issue date was never read (e.g. a portal fallback). Unknown is not absent,
 * and treating it as absent would downgrade a real approval.
 */
export function settleByIssueDate(
  rawText: string,
  mapped: PermitStatus,
  issueDate: string | number | null,
  ambiguousLabels: ReadonlySet<string>
): PermitStatus {
  if (!ambiguousLabels.has(rawText.toUpperCase().trim())) return mapped;

  const issued = issueDate !== null && String(issueDate).trim() !== "";
  if (mapped === "APPROVED" && !issued) return "READY_TO_ISSUE";
  if (mapped === "PENDING"  &&  issued) return "APPROVED";
  return mapped;
}

/**
 * resolveStatus() plus the issue-date tiebreaker, for callers holding the
 * record's issue date. The public checker uses this; the scrapers reach the
 * same logic through BaseScraper.settleByIssueDate().
 */
export function resolveStatusWithIssueDate(
  citySlug: string,
  rawText: string,
  issueDate: string | number | null
): PermitStatus {
  const mapped    = resolveStatus(citySlug, rawText);
  const ambiguous = ISSUE_DATE_AMBIGUOUS[citySlug];
  return ambiguous ? settleByIssueDate(rawText, mapped, issueDate, ambiguous) : mapped;
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

/**
 * Statuses the scraper stops checking — nothing further can happen to the
 * permit. Lives here, not in scrapers/index.ts, so the regression suite can
 * pin what is and is not on it without importing (and running) the engine.
 *
 * ACTION_REQUIRED and READY_TO_ISSUE are deliberately NOT terminal. The first
 * waits on the applicant; the second waits on issuance, and the user needs
 * the APPROVED alert that follows it. UNDER_REVIEW and PENDING are absent for
 * the same reason.
 */
export const TERMINAL_STATUSES: readonly PermitStatus[] = ["CLEARED", "REJECTED", "EXPIRED"];

/**
 * Where each status sits on the way to a usable permit. ACTION_REQUIRED shares
 * UNDER_REVIEW's stage: the review is mid-way, just waiting on the other
 * party. Off-path outcomes (REJECTED, EXPIRED) and UNKNOWN have no stage.
 */
const LIFECYCLE_STAGE: Record<PermitStatus, number | null> = {
  PENDING:         1,
  UNDER_REVIEW:    2,
  ACTION_REQUIRED: 2,
  READY_TO_ISSUE:  3,
  APPROVED:        4,
  CLEARED:         5,
  REJECTED:        null,
  EXPIRED:         null,
  UNKNOWN:         null,
};

/**
 * True when moving from `from` to `to` is a step toward a usable permit.
 * UNDER_REVIEW → READY_TO_ISSUE is; UNDER_REVIEW → PENDING is not, which is
 * why "plans approved, not issued" got its own status (migration 021).
 */
export function isForwardProgress(from: PermitStatus, to: PermitStatus): boolean {
  const a = LIFECYCLE_STAGE[from];
  const b = LIFECYCLE_STAGE[to];
  return a !== null && b !== null && b > a;
}
