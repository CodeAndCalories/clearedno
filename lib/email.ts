// Resend email sending functions
// All transactional emails route through this file.
import { Resend } from "resend";
import { render } from "@react-email/components";
import { PermitClearedEmail } from "@/emails/permit-cleared";
import { WelcomeEmail } from "@/emails/welcome";
import type { Permit, PermitStatus } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = `${process.env.FROM_NAME || "ClearedNo"} <${process.env.FROM_EMAIL || "alerts@clearedno.com"}>`;

// ── Status-aware subject lines ────────────────────────────────────────────────
// Each status gets a subject line that conveys urgency and action clearly.
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
// Fires for ANY status change, not just CLEARED.
// Called by scrapers/index.ts whenever a permit's status changes.

export async function sendPermitStatusAlert({
  to,
  userName,
  permit,
}: {
  to: string;
  userName: string;
  permit: Permit;
}) {
  const html = await render(
    PermitClearedEmail({ userName, permit }) as React.ReactElement
  );

  return resend.emails.send({
    from: FROM,
    to,
    subject: buildSubject(permit),
    html,
  });
}

// ── Welcome / onboarding email ────────────────────────────────────────────────
// Sent once after a user completes Stripe checkout (via webhook).

export async function sendWelcomeEmail({
  to,
  userName,
}: {
  to: string;
  userName: string;
}) {
  const html = await render(
    WelcomeEmail({ userName }) as React.ReactElement
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
