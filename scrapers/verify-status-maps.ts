// Status-map regression suite.
//
//   npm run verify:status-maps
//
// Asserts that every status string the eight live city APIs actually emit maps
// to the PermitStatus we intend. Exits non-zero on any mismatch.
//
// ── WHY THIS EXISTS ──────────────────────────────────────────────────────────
// Status mapping is the one place in this codebase where a bug is silent: a
// wrong mapping doesn't throw, doesn't log, and doesn't fail a build. It just
// tells a contractor their permit is APPROVED when it was denied. Three such
// bugs shipped before this file existed:
//
//   "Inactive Pending Revision" → APPROVED   (substring-matched "ACTIVE")
//   "Denied but Closed"         → CLEARED    (substring-matched "CLOSED")
//   "Final Inspection Approved" → APPROVED   (substring-matched "APPROVED")
//
// All three are pinned below.
//
// ── KEEPING IT HONEST ────────────────────────────────────────────────────────
// The VOCABULARIES here are complete as of 2026-08-07 — each was produced by
// GROUP BY on the live endpoint, not by reading docs or guessing. When a city
// adds a status this suite won't know about it, so re-enumerate periodically:
//
//   Austin        $select=status_current,count(*)&$group=status_current
//   Columbus      groupByFieldsForStatistics=PERMIT_STATUS (and B1_APPL_STATUS)
//   Cleveland     groupByFieldsForStatistics=CURRENT_TASK_STATUS
//   Cincinnati    $select=statuscurrent,count(*)&$group=statuscurrent
//   Philadelphia  SELECT status, count(*) FROM permits GROUP BY status
//   Pittsburgh    datastore_search?fields=status&distinct=true, then a
//                 filters={"status": …}&limit=0 call per value for its count
//                 (datastore_search_sql returns 403 as of 2026-10-04)
//   Seattle       $select=statuscurrent,count(*)&$group=statuscurrent
//   Detroit       groupByFieldsForStatistics=task_status  (plan-reviews layer;
//                 the permits layer has no status — "Issued" is synthesised)
//
// All eight vocabularies were re-enumerated on 2026-09-04 for the
// ACTION_REQUIRED remap and again on 2026-10-04 for READY_TO_ISSUE.
//
// Run with --live to re-fetch each vocabulary and report any value that has
// appeared since this file was written.

import type { PermitStatus } from "../types";
import {
  resolveStatus,
  resolveStatusWithIssueDate,
  normalizeStatus,
  isForwardProgress,
  CITY_STATUS_MAPS,
  ISSUE_DATE_AMBIGUOUS,
  TERMINAL_STATUSES,
} from "../lib/permit-status";

type Case = [raw: string, expected: PermitStatus];

// ── Austin, TX — status_current (complete) ────────────────────────────────────

const AUSTIN: Case[] = [
  // Regression pins — substring collisions ("ACTIVE" must not win)
  ["Inactive Pending Revision", "ACTION_REQUIRED"],
  ["Inactive Contractor",       "ACTION_REQUIRED"],
  ["Denied but Closed",         "REJECTED"],

  ["Final", "CLEARED"], ["Closed", "CLEARED"],
  ["Active", "APPROVED"],
  ["Pending", "PENDING"], ["Pending Permit", "PENDING"],
  // Applicant must act
  ["Awaiting Upload", "ACTION_REQUIRED"], ["Awaiting Update", "ACTION_REQUIRED"],
  ["Application Incomplete", "ACTION_REQUIRED"],
  // Ambiguous who acts — stays UNDER_REVIEW
  ["On Hold", "UNDER_REVIEW"], ["Re Review", "UNDER_REVIEW"],
  ["Suspended", "UNDER_REVIEW"],
  ["Expired", "EXPIRED"], ["Expired - License", "EXPIRED"],
  ["VOID", "REJECTED"], ["Withdrawn", "REJECTED"], ["Cancelled", "REJECTED"],
  ["Aborted", "REJECTED"], ["Revoked", "REJECTED"], ["Rejected", "REJECTED"],
  ["Cancelled - Contractor Required", "REJECTED"],
  ["Cancelled - New Permit Required", "REJECTED"],
  ["New Permit Required", "REJECTED"],
];

// ── Columbus, OH — PERMIT_STATUS + B1_APPL_STATUS (complete) ─────────────────

const COLUMBUS: Case[] = [
  // Regression pin — "Final Inspection Approved" is CLEARED, not APPROVED
  ["Final Inspection Approved", "CLEARED"],

  ["Certificate of Occupancy Issued", "CLEARED"],
  ["Permit Issued", "APPROVED"], ["Expired Permit", "EXPIRED"],

  ["Closed", "CLEARED"],
  ["Issued", "APPROVED"], ["Issued Online", "APPROVED"],
  ["Active", "APPROVED"], ["Open", "APPROVED"],
  ["Expired", "EXPIRED"], ["Expired No Permit", "EXPIRED"],
  ["Applied Online", "PENDING"], ["Issuance Pending", "PENDING"],
  ["Corrections Required", "ACTION_REQUIRED"], ["Under Review", "UNDER_REVIEW"],
  ["Void", "REJECTED"], ["VOID - Wrong CAP Type", "REJECTED"],
  ["Void - Duplicate", "REJECTED"], ["VOID - Entered In Error", "REJECTED"],
  ["Void - Test", "REJECTED"], ["Withdrawn", "REJECTED"],
  // Columbus's literal placeholder for "no status recorded".
  ["None", "UNKNOWN"],
];

// ── Cleveland, OH — CURRENT_TASK_STATUS (complete) ───────────────────────────

const CLEVELAND: Case[] = [
  ["Inspection Approved", "CLEARED"], ["Permit Closed", "CLEARED"],
  ["Permit Closed/Non-Compliant", "CLEARED"],
  ["Permit Closed - Non-Compliant", "CLEARED"],
  ["Inspection Passed", "CLEARED"], ["Complete", "CLEARED"],
  ["Closed - Pending Seed & Straw", "CLEARED"],
  ["Application Closure Approved", "CLEARED"],

  ["Permit Issuance Approved", "APPROVED"],
  ["Inspection Approved - C.O. Req", "APPROVED"],
  ["Closure Pending", "APPROVED"],
  ["Certificate of Occupancy Pending", "APPROVED"],
  ["Certificate of Completion Pending", "APPROVED"],
  ["Approve", "APPROVED"], ["Issued", "APPROVED"],
  ["Conditional Approval", "APPROVED"],
  ["Permit Issuance Complete", "APPROVED"],
  ["Issue Permit - Intake Approved", "APPROVED"],

  ["Inspection Pending", "UNDER_REVIEW"],
  ["nspection Pending", "UNDER_REVIEW"],   // typo present in the source data
  ["Review Complete Alert Assessmt", "UNDER_REVIEW"],
  ["Reopened", "UNDER_REVIEW"], ["Certificate Review", "UNDER_REVIEW"],
  ["Zoning Review Pending", "UNDER_REVIEW"],
  ["Revisions Received", "UNDER_REVIEW"],
  ["Appeal Pending", "UNDER_REVIEW"], ["Appeal Not Filed", "UNDER_REVIEW"],
  // Applicant must act — failed inspections and a declined payment.
  // "Permit Closed/Non-Compliant" is CLEARED (pinned above); bare
  // "Non-Compliant" is a live failed inspection and must not inherit that.
  ["Non-Compliant", "ACTION_REQUIRED"],
  ["Inspection Failed", "ACTION_REQUIRED"],
  ["Cashier Declined", "ACTION_REQUIRED"],
  ["No Except - Make Corr Noted", "ACTION_REQUIRED"],
  ["Awaiting Plans", "ACTION_REQUIRED"],   // new 2026-10; city waits on the applicant's plans
  // Intermediate sub-review approvals are NOT permit approval.
  ["Fire Review Approved", "UNDER_REVIEW"],
  ["Plan Review Approved", "UNDER_REVIEW"],

  ["Cashier Approved", "PENDING"], ["Plans Received", "PENDING"],
  ["Permit Issuance Pending", "PENDING"],
  ["Issuance Documents Received", "PENDING"],

  ["Discard", "REJECTED"], ["Closed - Discard", "REJECTED"],
  ["Application Declined", "REJECTED"], ["Deny", "REJECTED"],
  ["Application Review Declined", "REJECTED"],

  ["Not Needed", "UNKNOWN"], ["Not Applicable", "UNKNOWN"],
];

// ── Cincinnati, OH — statuscurrent + statuscurrentmapped (complete) ──────────

// "Approved" and APRV_NR are the LABEL-ONLY result here. With the record's
// issue date they are settled by ISSUE_DATE_CASES below — that is what users
// actually see.
const CINCINNATI: Case[] = [
  ["Permit Finaled", "CLEARED"], ["Permit Issued", "APPROVED"],
  ["In Review", "UNDER_REVIEW"], ["Permit Withdrawn", "REJECTED"],
  ["Application Accepted", "PENDING"], ["Approved", "APPROVED"],

  ["CLOSED", "CLEARED"], ["XCLOSED", "CLEARED"],
  ["ISSUED", "APPROVED"], ["APPROVED", "APPROVED"], ["APRV_NR", "APPROVED"],
  ["TEMPCOFO", "APPROVED"], ["RENEW", "APPROVED"],
  ["ROUTE", "UNDER_REVIEW"], ["ENGRCHNG", "UNDER_REVIEW"],
  ["REVIEWED", "UNDER_REVIEW"], ["HOLD", "UNDER_REVIEW"],
  ["ADD INS", "UNDER_REVIEW"],
  ["APPLIED", "PENDING"], ["PAID", "PENDING"], ["BILLED", "PENDING"],
  ["WITHDRWN", "REJECTED"], ["W/REFUND", "REJECTED"], ["VOIDED", "REJECTED"],
  ["REVOKED", "REJECTED"], ["DENIED", "REJECTED"],
  ["EXPIRED", "EXPIRED"], ["APP_EXP", "EXPIRED"],
  ["CAGIS", "UNKNOWN"], ["SUBPERM", "UNKNOWN"],
];

// ── Philadelphia, PA — status (complete) ─────────────────────────────────────

const PHILADELPHIA: Case[] = [
  ["COMPLETED", "CLEARED"], ["Completed", "CLEARED"], ["CLOSED", "CLEARED"],
  ["Issued", "APPROVED"],
  ["Expired", "EXPIRED"], ["EXPIRED", "EXPIRED"],
  ["ABANDONED", "REJECTED"], ["Cancelled", "REJECTED"], ["Refused", "REJECTED"],
  ["Denied", "REJECTED"], ["REVOKED", "REJECTED"], ["Withdrawn", "REJECTED"],
  ["Stop Work", "UNDER_REVIEW"],
  ["Amendment Application Incomplete", "ACTION_REQUIRED"],
  ["Amendment Applicant Revisions", "ACTION_REQUIRED"],
  ["Amendment Review", "UNDER_REVIEW"],
  ["Amendment Requested", "UNDER_REVIEW"],
  ["In Review", "UNDER_REVIEW"],
  // Review done, issuance next — READY_TO_ISSUE, not PENDING and not APPROVED.
  ["Amendment Ready For Issue", "READY_TO_ISSUE"], ["Ready For Issue", "READY_TO_ISSUE"],
  ["Amendment Denied", "REJECTED"], ["Expired Denial", "REJECTED"],
];

// ── Pittsburgh, PA — status (complete) ───────────────────────────────────────
//
// The pre-issuance states are the point of this city — see the notes in
// scrapers/cities/pittsburgh-pa.ts. "Ready For Issue" must be READY_TO_ISSUE,
// not APPROVED: the permit has not been issued and work may not legally start.
// It has 0 live rows as of 2026-10-04 but stays pinned for the next one.
// "Application Finalization" stays PENDING: every live row has an issue_date.

const PITTSBURGH: Case[] = [
  ["Completed", "CLEARED"],
  ["Issued", "APPROVED"],
  ["Ready For Issue", "READY_TO_ISSUE"],
  ["Application Finalization", "PENDING"],
  ["In Review", "UNDER_REVIEW"],
  ["Reviews Paused", "UNDER_REVIEW"],
  // Applicant must act
  ["Applicant Revisions", "ACTION_REQUIRED"],
  ["Amendment Applicant Revisions", "ACTION_REQUIRED"],
  ["Amendment Application Incomplete", "ACTION_REQUIRED"],
  // With the city, or ambiguous who acts
  ["Amendment Review", "UNDER_REVIEW"],
  ["Amendment Requested", "UNDER_REVIEW"],
  ["Stop Work", "UNDER_REVIEW"],
  ["Revoked", "REJECTED"],
  ["Expired", "EXPIRED"],
];

// ── Seattle, WA — statuscurrent (complete, 24 values) ─────────────────────────
//
// The pre-issuance states are the point of this city — see the notes in
// lib/permit-status.ts. Pins that matter:
//   "Ready for Issuance"  → READY_TO_ISSUE, not APPROVED: not issued, work may
//                           not start; not PENDING: review is done
//   "Approved to Occupy"  → CLEARED, not APPROVED: it is the CO
//   "Plans Approved"-style substring traps: "Application Completed" and
//   "Reviews Completed" must NOT resolve to CLEARED via "COMPLETED".
//   "Reviews Completed" stays PENDING, not READY_TO_ISSUE: 192 of its 470 live
//   rows are ECA/shoreline exemption requests, for which it is the end state.

const SEATTLE: Case[] = [
  // Regression pins — substring collisions
  ["Application Completed",     "PENDING"],
  ["Reviews Completed",         "PENDING"],
  ["Inspections Completed",     "APPROVED"],
  ["Approved to Occupy",        "CLEARED"],
  ["Ready for Issuance",        "READY_TO_ISSUE"],
  ["Phase Issued",              "APPROVED"],

  ["Completed", "CLEARED"], ["Closed", "CLEARED"],
  ["Issued", "APPROVED"], ["Active", "APPROVED"],
  ["Initiated", "PENDING"], ["Ready for Intake", "PENDING"],
  ["Scheduled", "PENDING"], ["Scheduled and Submitted", "PENDING"],
  ["Pending", "PENDING"],
  ["Reviews In Process", "UNDER_REVIEW"],
  ["Corrections Submitted", "UNDER_REVIEW"],
  // Applicant-must-act states — ACTION_REQUIRED, distinct from the
  // city-is-working "Reviews In Process" above. This is the distinction the
  // status was added for; if any of these regress to UNDER_REVIEW the alert
  // that tells a contractor to act stops firing.
  ["Additional Info Requested", "ACTION_REQUIRED"],
  ["Corrections Required", "ACTION_REQUIRED"],
  ["Awaiting Information", "ACTION_REQUIRED"],
  ["Withdrawn", "REJECTED"], ["Canceled", "REJECTED"], ["Denied", "REJECTED"],
  ["Expired", "EXPIRED"],
];

// ── Detroit, MI — task_status (complete) + synthesised "Issued" ───────────────
//
// "Plans Approved" must be READY_TO_ISSUE: plan review passed, the permit is
// not issued. Not APPROVED (work may not start) and not PENDING (that made
// BLD2026-01450's review finishing on 2026-10-03 alert as "PERMIT PENDING").
// Records that were subsequently issued appear in the permits layer, which the
// scraper checks first.

const DETROIT: Case[] = [
  // Regression pin — "Plans Approved" is NOT permit approval, and NOT pending
  ["Plans Approved", "READY_TO_ISSUE"],

  ["Issued", "APPROVED"],
  // Intake outcomes (task "Application Submittal") — not a finished review.
  ["Accepted - Document Review Required", "PENDING"],
  ["Accepted - Document Review Not Required", "PENDING"],
  ["Routed for Electronic Review", "UNDER_REVIEW"],
  ["Routed for Paper Review", "UNDER_REVIEW"],
  ["Incomplete", "ACTION_REQUIRED"],
];

// ── Suite ─────────────────────────────────────────────────────────────────────

const SUITES: [city: string, cases: Case[]][] = [
  ["austin",       AUSTIN],
  ["columbus",     COLUMBUS],
  ["cleveland",    CLEVELAND],
  ["cincinnati",   CINCINNATI],
  ["philadelphia", PHILADELPHIA],
  ["pittsburgh",   PITTSBURGH],
  ["seattle",      SEATTLE],
  ["detroit",      DETROIT],
];

// ── Generic normaliser — cities with no map of their own ──────────────────────
//
// Ready-to-issue phrasing must win over the COMPLETE (→ CLEARED) and APPROVED
// (→ issued) keywords it usually travels with.

const NORMALISER: Case[] = [
  ["Ready for Issue",                       "READY_TO_ISSUE"],
  ["Ready to Issue",                        "READY_TO_ISSUE"],
  ["Approved - Ready for Issuance",         "READY_TO_ISSUE"],
  ["Reviews Complete - Ready for Issuance", "READY_TO_ISSUE"],
  ["Permit Issued",                         "APPROVED"],   // issuance itself is not swallowed
];

// ── Issue date as ground truth ────────────────────────────────────────────────
//
// Resolved through resolveStatusWithIssueDate(), the function the public
// checker calls and BaseScraper.settleByIssueDate() wraps. null = the record
// has no issue date.

type DatedCase = [city: string, raw: string, issueDate: string | null, expected: PermitStatus];

const ISSUE_DATE_CASES: DatedCase[] = [
  // Ambiguous "approved" + NO issue date → READY_TO_ISSUE. This is the
  // direction that prevents "issued, start work" for an unissued permit.
  ["cincinnati", "Approved",  null,                      "READY_TO_ISSUE"],
  ["cincinnati", "APPROVED",  null,                      "READY_TO_ISSUE"],
  ["cincinnati", "APRV_NR",   null,                      "READY_TO_ISSUE"],
  // …with an issue date it really is issued.
  ["cincinnati", "Approved",  "2026-10-02T00:00:00.000", "APPROVED"],
  ["cincinnati", "APRV_NR",   "2026-09-29T00:00:00.000", "APPROVED"],

  // Ambiguous "pending" + issue date PRESENT → APPROVED.
  ["austin",     "Pending",                  "2026-09-28T00:00:00.000", "APPROVED"],
  ["austin",     "Pending Permit",           "2026-01-20T00:00:00.000", "APPROVED"],
  ["pittsburgh", "Application Finalization", "2025-02-18",              "APPROVED"],
  // …without one it stays PENDING.
  ["austin",     "Pending",                  null, "PENDING"],
  ["austin",     "Pending Permit",           null, "PENDING"],
  ["pittsburgh", "Application Finalization", null, "PENDING"],

  // Unambiguous labels — the issue date must not move them in either direction.
  ["cincinnati", "Permit Issued",         null,         "APPROVED"],
  ["cincinnati", "Permit Finaled",        null,         "CLEARED"],
  ["cincinnati", "Application Accepted",  "2026-01-01", "PENDING"],       // 6 live rows like this
  ["cincinnati", "In Review",             "2026-01-01", "UNDER_REVIEW"],  // 7 live rows like this
  ["detroit",    "Plans Approved",        "2026-10-02", "READY_TO_ISSUE"],
  ["seattle",    "Ready for Issuance",    "2026-10-02", "READY_TO_ISSUE"],
  ["pittsburgh", "Ready For Issue",       "2025-01-01", "READY_TO_ISSUE"],
  ["pittsburgh", "Issued",                null,         "APPROVED"],
  ["austin",     "Active",                null,         "APPROVED"],
  ["austin",     "Final",                 null,         "CLEARED"],
  // Contains "PENDING" but is not the ambiguous label — exact match only.
  ["austin",     "Inactive Pending Revision", "2026-09-28", "ACTION_REQUIRED"],

  // Cleveland's ISSUE_DATE is on every row, declined applications included,
  // so it is not trusted and the tiebreaker never runs there.
  ["cleveland",  "Cashier Approved",      "2018-07-23", "PENDING"],
  ["cleveland",  "Plans Received",        "2026-10-02", "PENDING"],
  ["cleveland",  "Awaiting Plans",        "2026-10-01", "ACTION_REQUIRED"],
];

// ── Lifecycle — forward progress and terminal statuses ────────────────────────
//
// READY_TO_ISSUE exists because Detroit BLD2026-01450 went from "Routed for
// Electronic Review" to "Plans Approved" on 2026-10-03 — genuine progress —
// and the alert said "PERMIT PENDING", the label of a fresh application.

type Step = [from: PermitStatus, to: PermitStatus, forward: boolean];

const PROGRESS: Step[] = [
  // The pin this status was added for.
  ["UNDER_REVIEW",    "READY_TO_ISSUE",  true],
  ["ACTION_REQUIRED", "READY_TO_ISSUE",  true],   // corrections accepted, then approved
  ["PENDING",         "READY_TO_ISSUE",  true],
  ["READY_TO_ISSUE",  "APPROVED",        true],   // issued — the alert that says "start work"
  ["APPROVED",        "CLEARED",         true],
  // What the old PENDING mapping produced, and genuine steps back.
  ["UNDER_REVIEW",    "PENDING",         false],
  ["READY_TO_ISSUE",  "PENDING",         false],
  ["READY_TO_ISSUE",  "UNDER_REVIEW",    false],  // review reopened
  // Lateral: same review, the other party's move.
  ["UNDER_REVIEW",    "ACTION_REQUIRED", false],
  // Off the path entirely.
  ["READY_TO_ISSUE",  "REJECTED",        false],
  ["READY_TO_ISSUE",  "EXPIRED",         false],
];

// Real raw transitions, resolved exactly as the scrapers resolve them.
type RawStep = [city: string, from: string, to: string];

const RAW_PROGRESS: RawStep[] = [
  ["detroit",      "Routed for Electronic Review", "Plans Approved"],     // BLD2026-01450
  ["seattle",      "Reviews In Process",           "Ready for Issuance"],
  ["philadelphia", "Amendment Review",             "Amendment Ready For Issue"],
  ["detroit",      "Plans Approved",               "Issued"],
];

// READY_TO_ISSUE must stay non-terminal: the scraper has to keep checking
// until the permit is issued, or the APPROVED alert never fires.
const NON_TERMINAL: PermitStatus[] = ["READY_TO_ISSUE", "ACTION_REQUIRED", "UNDER_REVIEW", "PENDING", "APPROVED"];
const TERMINAL:     PermitStatus[] = ["CLEARED", "REJECTED", "EXPIRED"];

// Live vocabulary sources, used by --live to detect statuses added since the
// suite was written.
const LIVE_SOURCES: Record<string, () => Promise<string[]>> = {
  austin: async () => {
    const r = await fetch("https://data.austintexas.gov/resource/3syk-w9eu.json?$select=status_current&$group=status_current");
    return (await r.json() as { status_current?: string }[]).map((x) => x.status_current ?? "");
  },
  columbus: async () => {
    const out: string[] = [];
    for (const f of ["PERMIT_STATUS", "B1_APPL_STATUS"]) {
      const u = "https://services1.arcgis.com/9yy6msODkIBzkUXU/arcgis/rest/services/Building_Permits/FeatureServer/0/query"
        + `?where=1%3D1&groupByFieldsForStatistics=${f}`
        + `&outStatistics=[{"statisticType":"count","onStatisticField":"OBJECTID","outStatisticFieldName":"n"}]&f=json`;
      const d = await (await fetch(u)).json() as { features?: { attributes: Record<string, string> }[] };
      out.push(...(d.features ?? []).map((x) => x.attributes[f] ?? ""));
    }
    return out;
  },
  cleveland: async () => {
    const u = "https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/Building_Permits/FeatureServer/0/query"
      + "?where=1%3D1&groupByFieldsForStatistics=CURRENT_TASK_STATUS"
      + '&outStatistics=[{"statisticType":"count","onStatisticField":"OBJECTID","outStatisticFieldName":"n"}]&f=json';
    const d = await (await fetch(u)).json() as { features?: { attributes: Record<string, string> }[] };
    return (d.features ?? []).map((x) => x.attributes.CURRENT_TASK_STATUS ?? "");
  },
  cincinnati: async () => {
    const out: string[] = [];
    for (const f of ["statuscurrent", "statuscurrentmapped"]) {
      const r = await fetch(`https://data.cincinnati-oh.gov/resource/uhjb-xac9.json?$select=${f}&$group=${f}&$limit=200`);
      out.push(...(await r.json() as Record<string, string>[]).map((x) => x[f] ?? ""));
    }
    return out;
  },
  philadelphia: async () => {
    const q = encodeURIComponent("SELECT status FROM permits GROUP BY status");
    const d = await (await fetch(`https://phl.carto.com/api/v2/sql?q=${q}`)).json() as { rows?: { status: string }[] };
    return (d.rows ?? []).map((x) => x.status ?? "");
  },
  pittsburgh: async () => {
    // datastore_search_sql returns 403 as of 2026-10-04, and its error body
    // parsed as "0 values, all covered". distinct=true on datastore_search
    // gives the same vocabulary; a failed call now throws and is reported.
    const r = await fetch(
      "https://data.wprdc.org/api/3/action/datastore_search"
        + "?resource_id=f4d1177a-f597-4c32-8cbf-7885f56253f6&fields=status&distinct=true&limit=1000"
    );
    const d = await r.json() as { success?: boolean; result?: { records?: { status: string }[] } };
    if (!r.ok || !d.success) throw new Error(`HTTP ${r.status}`);
    return (d.result?.records ?? []).map((x) => x.status ?? "");
  },
  seattle: async () => {
    const r = await fetch("https://data.seattle.gov/resource/76t5-zqzr.json?$select=statuscurrent&$group=statuscurrent&$limit=200");
    return (await r.json() as { statuscurrent?: string }[]).map((x) => x.statuscurrent ?? "");
  },
  detroit: async () => {
    const u = "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/bseed_building_permit_plan_reviews/FeatureServer/0/query"
      + "?where=1%3D1&groupByFieldsForStatistics=task_status"
      + '&outStatistics=[{"statisticType":"count","onStatisticField":"ObjectId","outStatisticFieldName":"n"}]&f=json';
    const d = await (await fetch(u)).json() as { features?: { attributes: Record<string, string> }[] };
    // The permits layer has no status column; "Issued" is synthesised by the
    // scraper, so it is appended here to keep the drift check honest.
    return [...(d.features ?? []).map((x) => x.attributes.task_status ?? ""), "Issued"];
  },
};

async function main(): Promise<void> {
  const live = process.argv.includes("--live");
  let failures = 0;
  let total    = 0;

  for (const [city, cases] of SUITES) {
    console.log(`\n── ${city} (${cases.length} statuses) ─────────────────────────`);
    for (const [raw, expected] of cases) {
      const got = resolveStatus(city, raw);
      const ok  = got === expected;
      total++;
      if (!ok) failures++;
      console.log(
        `${ok ? "  ok  " : "  FAIL"}  ${raw.padEnd(36)} → ${got}` +
        (ok ? "" : `   (expected ${expected})`)
      );
    }
  }

  // Every live city must have a map registered.
  for (const [city] of SUITES) {
    if (!CITY_STATUS_MAPS[city]) {
      console.log(`\n  FAIL  no status map registered for "${city}"`);
      failures++;
    }
  }

  const check = (ok: boolean, line: string, expected: string): void => {
    total++;
    if (!ok) failures++;
    console.log(`${ok ? "  ok  " : "  FAIL"}  ${line}${ok ? "" : `   (expected ${expected})`}`);
  };

  console.log(`\n── generic normaliser (${NORMALISER.length} statuses) ─────────────────`);
  for (const [raw, expected] of NORMALISER) {
    const got = normalizeStatus(raw);
    check(got === expected, `${raw.padEnd(36)} → ${got}`, expected);
  }

  console.log(`\n── issue date as ground truth (${ISSUE_DATE_CASES.length} cases) ───────────`);
  for (const [city, raw, issueDate, expected] of ISSUE_DATE_CASES) {
    const got = resolveStatusWithIssueDate(city, raw, issueDate);
    check(
      got === expected,
      `${city}: ${raw} [${issueDate ? "issued" : "no issue date"}]`.padEnd(54) + ` → ${got}`,
      expected,
    );
  }
  // Every listed label must map to APPROVED or PENDING on its own; anything
  // else makes the tiebreaker a silent no-op for it.
  for (const [city, labels] of Object.entries(ISSUE_DATE_AMBIGUOUS)) {
    for (const label of labels) {
      const base = resolveStatus(city, label);
      check(
        base === "APPROVED" || base === "PENDING",
        `${city}: ambiguous "${label}" maps to ${base}`,
        "APPROVED or PENDING",
      );
    }
  }
  check(!("cleveland" in ISSUE_DATE_AMBIGUOUS), "cleveland: issue date not trusted", "absent from ISSUE_DATE_AMBIGUOUS");

  console.log(`\n── lifecycle: forward progress ─────────────────────────────`);
  for (const [from, to, forward] of PROGRESS) {
    const got = isForwardProgress(from, to);
    check(got === forward, `${`${from} → ${to}`.padEnd(36)} forward=${got}`, `forward=${forward}`);
  }
  for (const [city, fromRaw, toRaw] of RAW_PROGRESS) {
    const from = resolveStatus(city, fromRaw);
    const to   = resolveStatus(city, toRaw);
    check(
      isForwardProgress(from, to),
      `${city}: "${fromRaw}" → "${toRaw}" = ${from} → ${to}`,
      "forward progress",
    );
  }

  console.log(`\n── lifecycle: terminal statuses ────────────────────────────`);
  for (const s of NON_TERMINAL) {
    check(!TERMINAL_STATUSES.includes(s), `${s.padEnd(36)} keeps being checked`, "not terminal");
  }
  for (const s of TERMINAL) {
    check(TERMINAL_STATUSES.includes(s), `${s.padEnd(36)} stops being checked`, "terminal");
  }

  if (live) {
    console.log("\n── live vocabulary drift check ─────────────────────────────");
    for (const [city, cases] of SUITES) {
      const covered = new Set(cases.map(([raw]) => raw.toUpperCase().trim()));
      let vocab: string[];
      try {
        vocab = await LIVE_SOURCES[city]();
      } catch (err) {
        console.log(`  warn  ${city}: could not fetch vocabulary (${String(err)})`);
        continue;
      }
      const missing = vocab
        .filter((v) => v && v.trim())
        .filter((v) => !covered.has(v.toUpperCase().trim()));
      if (missing.length === 0) {
        console.log(`  ok    ${city}: all ${vocab.filter(Boolean).length} live values covered`);
      } else {
        console.log(`  NEW   ${city}: ${missing.length} uncovered → ${missing.map((m) => JSON.stringify(m)).join(", ")}`);
        for (const m of missing) console.log(`          ${JSON.stringify(m)} currently resolves to ${resolveStatus(city, m)}`);
        failures++;
      }
    }
  }

  console.log(
    `\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`} — ${total} assertions across ${SUITES.length} cities`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
