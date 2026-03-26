// Next.js-only email functions — uses React email templates.
// Import this ONLY from app/api routes, never from scrapers or ts-node scripts.
//
// sendWelcomeEmail — rendered React template, sent on Stripe checkout completion
import { Resend } from "resend";
import { render } from "@react-email/components";
import { WelcomeEmail } from "../emails/welcome";

const resend = new Resend(process.env.RESEND_API_KEY!);

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

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to ClearedNo — Your permits are now being watched.",
    html,
  });
}
