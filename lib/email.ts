// Scraper-safe email functions — NO TSX, NO react-email, NO emails/ imports.
// Safe to import from ts-node (scrapers) and Next.js alike.
//
// sendPermitStatusAlert — plain HTML alert for permit status changes
// sendAdminAlert        — plain text health alert to ops inbox
//
// For the welcome email (React template) see lib/email-app.ts
import { Resend } from "resend";
import type { Permit, PermitStatus } from "../types";

// Lazy initialization — prevents build failure when RESEND_API_KEY is not set.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

const FROM = `${process.env.FROM_NAME || "ClearedNo"} <${process.env.FROM_EMAIL || "alerts@clearedno.com"}>`;

// ── Status-aware subject lines ────────────────────────────────────────────────
function buildSubject(permit: Permit): string {
  const num = permit.permit_number;
  const subjects: Record<PermitStatus, string> = {
    CLEARED:      `✅ Permit Cleared — Work Can Start`,
    APPROVED:     `✅ Permit Approved — ${num}`,
    REJECTED:        `⚠️ Permit Rejected — Action Required`,
    UNDER_REVIEW:    `👀 Permit Under Review — ${num}`,
    ACTION_REQUIRED: `🚨 Action Needed on Permit ${num} — the city is waiting on you`,
    EXPIRED:      `⚠️ Permit Expired — ${num}`,
    PENDING:      `🔄 Permit Status Update — ${num}`,
    UNKNOWN:      `🔄 Permit Status Update — ${num}`,
  };
  return subjects[permit.status] ?? `Permit Update — ${num}`;
}

// ── Permit status alert ───────────────────────────────────────────────────────
// Plain HTML — no React/TSX dependencies so this works in ts-node (scraper runtime).
// Called by scrapers/index.ts whenever a permit's status changes.

const STATUS_EMOJI: Record<PermitStatus, string> = {
  CLEARED:      "✅",
  APPROVED:     "✅",
  REJECTED:        "⚠️",
  UNDER_REVIEW:    "👀",
  ACTION_REQUIRED: "🚨",
  EXPIRED:         "⚠️",
  PENDING:         "🔄",
  UNKNOWN:         "🔄",
};

// Human labels for the heading — "PERMIT ACTION_REQUIRED" is not a sentence.
const STATUS_HEADING: Record<PermitStatus, string> = {
  CLEARED:         "PERMIT CLEARED",
  APPROVED:        "PERMIT APPROVED",
  REJECTED:        "PERMIT REJECTED",
  UNDER_REVIEW:    "PERMIT UNDER REVIEW",
  ACTION_REQUIRED: "ACTION REQUIRED ON YOUR PERMIT",
  EXPIRED:         "PERMIT EXPIRED",
  PENDING:         "PERMIT PENDING",
  UNKNOWN:         "PERMIT STATUS UPDATE",
};

/**
 * ACTION_REQUIRED is the one alert where the reader losing a day costs money,
 * so its body says what happened and what to do instead of just naming the
 * new status. The city's own wording (from the latest history entry) is
 * quoted because that is what the portal will show them.
 */
function actionRequiredBlock(permit: Permit): string {
  const latest = permit.status_history?.[permit.status_history.length - 1];
  const cityWording = latest?.raw?.trim();
  const portalLink  = permit.scrape_url
    ? `<a href="${permit.scrape_url}" style="color:#FF6B00;">open the permit record</a>`
    : "open the permit record on the city portal";

  return `
    <div style="border:1px solid #F43F5E;background:rgba(244,63,94,0.08);padding:16px;margin:16px 0;">
      <p style="color:#F43F5E;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.1em;">
        THE CITY IS WAITING ON YOU
      </p>
      <p style="color:#F5F0E8;opacity:0.85;margin:0;">
        ${permit.city} has paused review of this permit until the applicant responds${
          cityWording ? ` — the portal shows <strong>"${escapeHtml(cityWording)}"</strong>` : ""
        }. Nothing moves until that is addressed: ${portalLink}, read the reviewer's
        comments, and submit the corrections or information requested.
      </p>
      <p style="color:#F5F0E8;opacity:0.55;margin:12px 0 0 0;font-size:12px;">
        ClearedNo keeps checking this permit and will alert you again when the
        city picks it back up.
      </p>
    </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPermitStatusAlert({
  to,
  userName,
  permit,
}: {
  to: string;
  userName: string;
  permit: Permit;
}) {
  const emoji   = STATUS_EMOJI[permit.status]   ?? "🔄";
  const heading = STATUS_HEADING[permit.status] ?? `PERMIT ${permit.status}`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL || "https://www.clearedno.com"}/dashboard`;
  const actionBlock  = permit.status === "ACTION_REQUIRED" ? actionRequiredBlock(permit) : "";

  const html = `<!DOCTYPE html>
<html>
<body style="background:#0A0A0A;font-family:monospace;padding:40px;">
  <div style="max-width:560px;margin:0 auto;">
    <h1 style="color:#FF6B00;font-size:24px;letter-spacing:0.1em;">CLEAREDNO</h1>
    <hr style="border-color:#FF6B00;opacity:0.3;" />
    <h2 style="color:${permit.status === "ACTION_REQUIRED" ? "#F43F5E" : "#F5F0E8"};">${emoji} ${heading}</h2>
    <p style="color:#F5F0E8;opacity:0.7;">
      Hi ${userName},<br/><br/>
      Permit #: ${permit.permit_number}<br/>
      Address: ${permit.address}<br/>
      City: ${permit.city}, ${permit.state}<br/>
      Status: ${permit.status.replace("_", " ")}<br/>
      Detected: ${new Date().toLocaleString()}
    </p>${actionBlock}
    <a href="${dashboardUrl}"
       style="background:#FF6B00;color:#000;padding:12px 24px;
              text-decoration:none;font-weight:bold;display:inline-block;
              margin-top:16px;">
      VIEW DASHBOARD →
    </a>
    <p style="color:#F5F0E8;opacity:0.2;font-size:11px;margin-top:32px;">
      ClearedNo · support@clearedno.com
    </p>
  </div>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM,
    to,
    subject: buildSubject(permit),
    html,
  });
}

// ── Admin health alert ────────────────────────────────────────────────────────
// Sent to ADMIN_EMAIL when a city scraper fails 3+ times in a row.
// Plain-text only — needs to be readable at a glance on mobile.

export async function sendAdminAlert({
  subject,
  message,
}: {
  subject: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    // Silently skip if ADMIN_EMAIL is not configured
    return null;
  }

  return getResend().emails.send({
    from: FROM,
    to:   adminEmail,
    subject: `[ClearedNo] ${subject}`,
    text: message,
  });
}
