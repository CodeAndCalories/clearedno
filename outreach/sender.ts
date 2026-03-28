// outreach/sender.ts
//
// Sends cold emails — picks transport automatically:
//   GMAIL_APP_PASSWORD set  → SMTP App Password (GitHub Actions / CI)
//   GMAIL_APP_PASSWORD unset → OAuth2 via token.json (local dev)
//
// Tracking is Supabase-backed (outreach_leads table):
//   - "already sent" check: outreach_leads.last_contacted_at IS NOT NULL
//   - Daily quota check:    count rows with last_contacted_at >= today's midnight
//   - After sending:        update status = 'contacted', last_contacted_at = now()

import { supabaseAdmin }      from "../lib/supabase/admin";
import { sendViaGmail }       from "./gmail-sender";
import { sendViaAppPassword } from "./gmail-app-sender";
import type { EmailDraft }    from "./email-writer";

const DAILY_LIMIT = 30;

export interface SendResult {
  sent:    number;
  skipped: number;
  errors:  number;
}

export interface SendItem {
  draft:          EmailDraft;
  recipientEmail: string;
  leadId:         string;
}

// ── Unified send helper ───────────────────────────────────────────────────────

/**
 * Sends a single email, choosing transport based on available env vars.
 * Export this for reply-handler and any other direct-send callers.
 */
export async function sendSingleEmail(opts: {
  to:      string;
  subject: string;
  text:    string;
}): Promise<boolean> {
  if (process.env.GMAIL_APP_PASSWORD) {
    return sendViaAppPassword(opts);
  }
  return sendViaGmail(opts);
}

// ── Daily quota ───────────────────────────────────────────────────────────────

async function countTodaysSent(): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabaseAdmin
    .from("outreach_leads")
    .select("*", { count: "exact", head: true })
    .gte("last_contacted_at", todayStart.toISOString());

  return count ?? 0;
}

// ── Batch send ────────────────────────────────────────────────────────────────

/**
 * Sends emails for a batch of leads.
 * Respects DAILY_LIMIT and deduplicates against last_contacted_at.
 * Pass dryRun=true to skip actual sending and DB writes.
 */
export async function sendBatch(
  items:  SendItem[],
  dryRun  = false
): Promise<SendResult> {
  const transport  = process.env.GMAIL_APP_PASSWORD ? "App Password (SMTP)" : "OAuth2";
  console.log(`[Sender] Transport: ${transport}`);

  const todaySent = await countTodaysSent();
  let remaining   = DAILY_LIMIT - todaySent;

  const result: SendResult = { sent: 0, skipped: 0, errors: 0 };

  for (const { draft, recipientEmail, leadId } of items) {
    if (remaining <= 0) {
      console.log("[Sender] Daily limit reached. Stopping.");
      result.skipped += items.length - result.sent - result.skipped - result.errors;
      break;
    }

    const { data: lead } = await supabaseAdmin
      .from("outreach_leads")
      .select("last_contacted_at")
      .eq("id", leadId)
      .single();

    if (lead?.last_contacted_at) {
      console.log(`[Sender] Already contacted ${recipientEmail} — skipping.`);
      result.skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`[Sender] DRY_RUN — would send to ${recipientEmail}: "${draft.subject}"`);
      result.sent++;
      remaining--;
      continue;
    }

    const ok = await sendSingleEmail({
      to:      recipientEmail,
      subject: draft.subject,
      text:    draft.body,
    });

    if (ok) {
      await supabaseAdmin
        .from("outreach_leads")
        .update({ status: "contacted", last_contacted_at: new Date().toISOString() })
        .eq("id", leadId);

      console.log(`[Sender] ✓ Sent to ${recipientEmail}: "${draft.subject}"`);
      result.sent++;
      remaining--;

      await new Promise((r) => setTimeout(r, 1_200));
    } else {
      result.errors++;
    }
  }

  return result;
}
