// Resend email sending functions
// All transactional emails go through here.
import { Resend } from "resend";
import { render } from "@react-email/components";
import { PermitClearedEmail } from "@/emails/permit-cleared";
import { WelcomeEmail } from "@/emails/welcome";
import type { Permit } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = `${process.env.FROM_NAME || "ClearedNo"} <${process.env.FROM_EMAIL || "alerts@clearedno.com"}>`;

// ── Permit status change alert ──────────────────────────────────────────────

export async function sendPermitClearedEmail({
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
    subject: `✅ PERMIT ${permit.permit_number} — STATUS CHANGED TO ${permit.status}`,
    html,
  });
}

// ── Welcome / onboarding email ───────────────────────────────────────────────

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
