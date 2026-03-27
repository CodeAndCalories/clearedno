// Next.js-only email functions — uses React email templates.
// Import this ONLY from app/api routes, never from scrapers or ts-node scripts.
//
// sendWelcomeEmail — rendered React template, sent on Stripe checkout completion
import { Resend } from "resend";
import { render } from "@react-email/components";
import { WelcomeEmail } from "../app/emails/welcome";

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
    subject: "Welcome to ClearedNo — Your permits are now being watched.",
    html,
  });
}
