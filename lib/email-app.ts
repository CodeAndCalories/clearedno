// Next.js-only email functions — uses React email templates.
// Import this ONLY from app/api routes, never from scrapers or ts-node scripts.
//
// sendWelcomeEmail — rendered React template, sent on Stripe checkout completion
// sendDigestEmail  — rendered React template, sent on weekly digest schedule
import { Resend } from "resend";
import { render } from "@react-email/components";
import { WelcomeEmail } from "../app/emails/welcome";
import { DigestEmail } from "../app/emails/digest";
import type { DigestPermit } from "../app/emails/digest";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

const FROM = `${process.env.FROM_NAME || "ClearedNo"} <${process.env.FROM_EMAIL || "alerts@clearedno.com"}>`;

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

  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Welcome to ClearedNo — add your first permit in 30 seconds",
    html,
  });
}

export async function sendDigestEmail({
  to,
  userName,
  permits,
  changedCount,
  weekOf,
  unsubscribeUrl,
}: {
  to: string;
  userName: string;
  permits: DigestPermit[];
  changedCount: number;
  weekOf: string;
  unsubscribeUrl: string;
}) {
  const html = await render(
    DigestEmail({ userName, permits, changedCount, weekOf, unsubscribeUrl }) as React.ReactElement
  );

  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Your permits this week — ClearedNo Weekly Update",
    html,
  });
}
