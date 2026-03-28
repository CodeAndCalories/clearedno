// outreach/gmail-app-sender.ts
//
// Sends email via Gmail SMTP using an App Password.
// No OAuth flow needed — works in GitHub Actions / any CI environment.
//
// Setup (one time):
//   1. Enable 2-Step Verification on your Google account
//   2. myaccount.google.com/apppasswords → create App Password → "Mail"
//   3. Add to env: GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
//   4. Also set FROM_EMAIL to your Gmail address

import nodemailer from "nodemailer";

export interface AppPasswordSendOptions {
  to:      string;
  subject: string;
  text:    string;
}

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host:   "smtp.gmail.com",
    port:   587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.FROM_EMAIL!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });

  return _transporter;
}

/**
 * Sends a single email via Gmail SMTP + App Password.
 * Returns true on success, false on failure (never throws).
 */
export async function sendViaAppPassword(opts: AppPasswordSendOptions): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL;
  const fromName  = process.env.FROM_NAME ?? "ClearedNo";

  if (!fromEmail || !process.env.GMAIL_APP_PASSWORD) {
    console.error("[AppPasswordSender] FROM_EMAIL or GMAIL_APP_PASSWORD not set.");
    return false;
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from:    `"${fromName}" <${fromEmail}>`,
      to:      opts.to,
      subject: opts.subject,
      text:    opts.text,
    });
    return true;
  } catch (err: any) {
    console.error(`[AppPasswordSender] Send failed to ${opts.to}: ${err?.message ?? err}`);
    return false;
  }
}
