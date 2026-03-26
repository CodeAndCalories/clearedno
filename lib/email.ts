// Resend email sending functions
// All transactional emails route through this file.
//
// sendPermitStatusAlert — plain HTML, safe for ts-node / scraper runtime
// sendWelcomeEmail      — React email template, only called from Next.js API routes
// sendAdminAlert        — plain text, safe everywhere
import { Resend } from "resend";
import type { Permit, PermitStatus } from "../types";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = `${process.env.FROM_NAME || "ClearedNo"} <${process.env.FROM_EMAIL || "alerts@clearedno.com"}>`;

// ── Status-aware subject lines ────────────────────────────────────────────────
function buildSubject(permit: Permit): string {
  const num = permit.permit_number;
  const subjects: Record<PermitStatus, string> = {
    CLEARED:      `✅ Permit Cleared — Work Can Start`,
    APPROVED:     `✅ Permit Approved — ${num}`,
    REJECTED:     `⚠️ Permit Rejected — Action Required`,
    UNDER_REVIEW: `👀 Permit Under Review — ${num}`,
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
  REJECTED:     "⚠️",
  UNDER_REVIEW: "👀",
  EXPIRED:      "⚠️",
  PENDING:      "🔄",
  UNKNOWN:      "🔄",
};

export async function sendPermitStatusAlert({
  to,
  userName,
  permit,
}: {
  to: string;
  userName: string;
  permit: Permit;
}) {
  const emoji = STATUS_EMOJI[permit.status] ?? "🔄";
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL || "https://www.clearedno.com"}/dashboard`;

  const html = `<!DOCTYPE html>
<html>
<body style="background:#0A0A0A;font-family:monospace;padding:40px;">
  <div style="max-width:560px;margin:0 auto;">
    <h1 style="color:#FF6B00;font-size:24px;letter-spacing:0.1em;">CLEAREDNO</h1>
    <hr style="border-color:#FF6B00;opacity:0.3;" />
    <h2 style="color:#F5F0E8;">${emoji} PERMIT ${permit.status}</h2>
    <p style="color:#F5F0E8;opacity:0.7;">
      Hi ${userName},<br/><br/>
      Permit #: ${permit.permit_number}<br/>
      Address: ${permit.address}<br/>
      City: ${permit.city}, ${permit.state}<br/>
      Status: ${permit.status}<br/>
      Detected: ${new Date().toLocaleString()}
    </p>
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

  return resend.emails.send({
    from: FROM,
    to,
    subject: buildSubject(permit),
    html,
  });
}

// ── Welcome / onboarding email ────────────────────────────────────────────────
// Uses React email template — only called from Next.js API routes, never scrapers.

export async function sendWelcomeEmail({
  to,
  userName,
}: {
  to: string;
  userName: string;
}) {
  // Lazy-import so this module remains ts-node-safe when imported by scrapers.
  // In Next.js API routes the dynamic import resolves fine; in ts-node it's never called.
  const { render } = await import("@react-email/components");
  const { WelcomeEmail } = await import("../emails/welcome");

  const html = await render(
    (WelcomeEmail as any)({ userName }) as React.ReactElement
  );

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to ClearedNo — Your permits are now being watched.",
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

  return resend.emails.send({
    from: FROM,
    to:   adminEmail,
    subject: `[ClearedNo] ${subject}`,
    text: message,
  });
}
