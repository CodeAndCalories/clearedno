// Status-map regression suite.
//
//   npm run verify:status-maps
//
// Asserts that every status string the six live city APIs actually emit maps
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
//   Pittsburgh    SELECT status, count(*) FROM "<resource>" GROUP BY status
//
// Run with --live to re-fetch each vocabulary and report any value that has
// appeared since this file was written.

import type { PermitStatus } from "../types";
import { resolveStatus, CITY_STATUS_MAPS } from "../lib/permit-status";

type Case = [raw: string, expected: PermitStatus];

// ── Austin, TX — status_current (complete) ────────────────────────────────────

const AUSTIN: Case[] = [
  // Regression pins — substring collisions
  ["Inactive Pending Revision", "UNDER_REVIEW"],
  ["Inactive Contractor",       "UNDER_REVIEW"],
  ["Denied but Closed",         "REJECTED"],

  ["Final", "CLEARED"], ["Closed", "CLEARED"],
  ["Active", "APPROVED"],
  ["Pending", "PENDING"], ["Pending Permit", "PENDING"],
  ["Awaiting Upload", "PENDING"], ["Awaiting Update", "PENDING"],
  ["On Hold", "UNDER_REVIEW"], ["Re Review", "UNDER_REVIEW"],
  ["Suspended", "UNDER_REVIEW"], ["Application Incomplete", "UNDER_REVIEW"],
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
  ["Corrections Required", "UNDER_REVIEW"], ["Under Review", "UNDER_REVIEW"],
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
  ["Non-Compliant", "UNDER_REVIEW"],
  ["Review Complete Alert Assessmt", "UNDER_REVIEW"],
  ["Reopened", "UNDER_REVIEW"], ["Certificate Review", "UNDER_REVIEW"],
  ["Zoning Review Pending", "UNDER_REVIEW"],
  ["Revisions Received", "UNDER_REVIEW"],
  ["Inspection Failed", "UNDER_REVIEW"], ["Appeal Pending", "UNDER_REVIEW"],
  ["Appeal Not Filed", "UNDER_REVIEW"], ["Cashier Declined", "UNDER_REVIEW"],
  ["No Except - Make Corr Noted", "UNDER_REVIEW"],
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
  ["CAGIS", "UNKNOWN"],
];

// ── Philadelphia, PA — status (complete) ─────────────────────────────────────

const PHILADELPHIA: Case[] = [
  ["COMPLETED", "CLEARED"], ["Completed", "CLEARED"], ["CLOSED", "CLEARED"],
  ["Issued", "APPROVED"],
  ["Expired", "EXPIRED"], ["EXPIRED", "EXPIRED"],
  ["ABANDONED", "REJECTED"], ["Cancelled", "REJECTED"], ["Refused", "REJECTED"],
  ["Denied", "REJECTED"], ["REVOKED", "REJECTED"], ["Withdrawn", "REJECTED"],
  ["Stop Work", "UNDER_REVIEW"],
  ["Amendment Application Incomplete", "UNDER_REVIEW"],
  ["Amendment Applicant Revisions", "UNDER_REVIEW"],
  ["Amendment Review", "UNDER_REVIEW"],
  ["Amendment Requested", "UNDER_REVIEW"],
  ["Amendment Ready For Issue", "PENDING"], ["Ready For Issue", "PENDING"],
  ["Amendment Denied", "REJECTED"], ["Expired Denial", "REJECTED"],
];

// ── Pittsburgh, PA — status (complete) ───────────────────────────────────────
//
// The pre-issuance states are the point of this city — see the notes in
// scrapers/cities/pittsburgh-pa.ts. "Ready For Issue" must be PENDING, not
// APPROVED: the permit has not been issued and work may not legally start.

const PITTSBURGH: Case[] = [
  ["Completed", "CLEARED"],
  ["Issued", "APPROVED"],
  ["Ready For Issue", "PENDING"],
  ["Application Finalization", "PENDING"],
  ["In Review", "UNDER_REVIEW"],
  ["Applicant Revisions", "UNDER_REVIEW"],
  ["Amendment Applicant Revisions", "UNDER_REVIEW"],
  ["Amendment Application Incomplete", "UNDER_REVIEW"],
  ["Amendment Review", "UNDER_REVIEW"],
  ["Amendment Requested", "UNDER_REVIEW"],
  ["Stop Work", "UNDER_REVIEW"],
  ["Revoked", "REJECTED"],
  ["Expired", "EXPIRED"],
];

// ── Suite ─────────────────────────────────────────────────────────────────────

const SUITES: [city: string, cases: Case[]][] = [
  ["austin",       AUSTIN],
  ["columbus",     COLUMBUS],
  ["cleveland",    CLEVELAND],
  ["cincinnati",   CINCINNATI],
  ["philadelphia", PHILADELPHIA],
  ["pittsburgh",   PITTSBURGH],
];

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
    const q = encodeURIComponent('SELECT status FROM "f4d1177a-f597-4c32-8cbf-7885f56253f6" GROUP BY status');
    const r = await fetch(`https://data.wprdc.org/api/3/action/datastore_search_sql?sql=${q}`);
    const d = await r.json() as { result?: { records?: { status: string }[] } };
    return (d.result?.records ?? []).map((x) => x.status ?? "");
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
