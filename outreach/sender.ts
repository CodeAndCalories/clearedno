// Outreach sender — sends cold emails via Resend, enforces daily limits,
// and logs every sent email to avoid double-sending.
//
// Sent email log is stored in outreach/sent-log.json (gitignore this in production
// or swap for a database table).

import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";
import type { EmailDraft } from "./email-writer";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Safety rails: never send more than this many emails per day
const DAILY_LIMIT = 50;

// Path to the sent log file
const LOG_PATH = path.join(__dirname, "sent-log.json");

// ── Sent log ─────────────────────────────────────────────────────────────────

interface SentRecord {
  email: string;
  sentAt: string;
  subject: string;
}

function loadSentLog(): SentRecord[] {
  if (!fs.existsSync(LOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(LOG_PATH, "utf-8")) as SentRecord[];
}

function appendToLog(record: SentRecord) {
  const log = loadSentLog();
  log.push(record);
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

function countTodaysSent(log: SentRecord[]): number {
  const today = new Date().toISOString().split("T")[0];
  return log.filter((r) => r.sentAt.startsWith(today)).length;
}

function alreadySent(log: SentRecord[], email: string): boolean {
  return log.some((r) => r.email.toLowerCase() === email.toLowerCase());
}

// ── Main send function ────────────────────────────────────────────────────────

export interface SendResult {
  sent: number;
  skipped: number;
  errors: number;
}

/**
 * Sends a batch of email drafts, respecting the daily limit and dedup log.
 * Provide the recipient email for each lead (sourced from your CRM or lead list).
 */
export async function sendBatch(
  drafts: Array<{ draft: EmailDraft; recipientEmail: string }>
): Promise<SendResult> {
  const log = loadSentLog();
  const todaySent = countTodaysSent(log);
  let remaining = DAILY_LIMIT - todaySent;

  const result: SendResult = { sent: 0, skipped: 0, errors: 0 };

  for (const { draft, recipientEmail } of drafts) {
    if (remaining <= 0) {
      console.log("[Sender] Daily limit reached. Stopping.");
      result.skipped += drafts.length - result.sent - result.skipped - result.errors;
      break;
    }

    if (alreadySent(log, recipientEmail)) {
      console.log(`[Sender] Already sent to ${recipientEmail}, skipping.`);
      result.skipped++;
      continue;
    }

    try {
      await resend.emails.send({
        from: `${process.env.FROM_NAME || "Alex at ClearedNo"} <${process.env.FROM_EMAIL || "alex@clearedno.com"}>`,
        to: recipientEmail,
        subject: draft.subject,
        text: draft.body,
      });

      appendToLog({
        email: recipientEmail,
        sentAt: new Date().toISOString(),
        subject: draft.subject,
      });

      console.log(`[Sender] Sent to ${recipientEmail}: "${draft.subject}"`);
      result.sent++;
      remaining--;

      // Throttle: Resend free tier is 2 emails/second
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error(`[Sender] Failed to send to ${recipientEmail}:`, err);
      result.errors++;
    }
  }

  return result;
}
