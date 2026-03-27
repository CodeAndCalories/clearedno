// outreach/sender.ts
//
// Sends cold emails via Gmail API (OAuth2).
//
// Tracking is Supabase-backed (outreach_leads table), NOT file-based:
//   - "already sent" check: outreach_leads.last_contacted_at IS NOT NULL
//   - Daily quota check:    count rows with last_contacted_at >= today's midnight
//   - After sending:        update status = 'contacted', last_contacted_at = now()

import { supabaseAdmin } from "../lib/supabase/admin";
import { sendViaGmail }  from "./gmail-sender";
import type { EmailDraft } from "./email-writer";

// Hard cap: never send more than this many emails per day
const DAILY_LIMIT = 30;

export interface SendResult {
  sent:    number;
  skipped: number;
  errors:  number;
}

export interface SendItem {
  draft:          EmailDraft;
  recipientEmail: string;
  leadId:         string;   // Supabase outreach_leads.id
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

// ── Main send function ────────────────────────────────────────────────────────

/**
 * Sends emails for a batch of leads.
 * Respects DAILY_LIMIT and deduplicates against last_contacted_at.
 * Pass dryRun=true to skip actual sending and DB writes.
 */
export async function sendBatch(
  items:  SendItem[],
  dryRun  = false
): Promise<SendResult> {
  const todaySent = await countTodaysSent();
  let remaining   = DAILY_LIMIT - todaySent;

  const result: SendResult = { sent: 0, skipped: 0, errors: 0 };

  for (const { draft, recipientEmail, leadId } of items) {
    if (remaining <= 0) {
      console.log("[Sender] Daily limit reached. Stopping.");
      result.skipped += items.length - result.sent - result.skipped - result.errors;
      break;
    }

    // Never send twice to the same lead
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

    const ok = await sendViaGmail({
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

      // Gentle throttle — avoid Gmail rate limits (250 emails/day free, 1/sec safe)
      await new Promise((r) => setTimeout(r, 1_200));
    } else {
      result.errors++;
    }
  }

  return result;
}
