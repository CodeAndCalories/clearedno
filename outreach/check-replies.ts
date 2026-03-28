// outreach/check-replies.ts
//
// Polls Gmail inbox via IMAP using an App Password (no OAuth required).
// For each unread message:
//   1. Check if sender exists in outreach_leads
//   2. Classify intent with Claude (INTERESTED / QUESTION / NOT_INTERESTED / OOO)
//   3. Auto-reply based on classification
//   4. Mark email as read in Gmail
//   5. Update lead status in Supabase
//
// Usage:
//   node dist/scraper/outreach/check-replies.js
//   DRY_RUN=true node dist/scraper/outreach/check-replies.js
//
// Requires:
//   FROM_EMAIL        — your Gmail address (e.g. clearedno@gmail.com)
//   GMAIL_APP_PASSWORD — from myaccount.google.com/apppasswords
//   GMAIL must have IMAP enabled: Settings → See all settings → Forwarding and POP/IMAP

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { ImapFlow } from "imapflow";
import { supabaseAdmin } from "../lib/supabase/admin";
import { sendAdminAlert } from "../lib/email";
import { handleInboundWebhook } from "./reply-handler";

const DRY_RUN = process.env.DRY_RUN === "true" || false;

// ── IMAP client factory ───────────────────────────────────────────────────────

function buildImapClient(): ImapFlow {
  const user = process.env.FROM_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error(
      "[CheckReplies] FROM_EMAIL and GMAIL_APP_PASSWORD must both be set.\n" +
      "  Get an App Password at: myaccount.google.com/apppasswords"
    );
    process.exit(1);
  }

  return new ImapFlow({
    host:   "imap.gmail.com",
    port:   993,
    secure: true,
    auth:   { user, pass },
    logger: false,   // suppress imapflow debug output
  });
}

// ── Parse "Name <email@example.com>" → "email@example.com" ───────────────────

function extractEmail(raw: string): string {
  const bracketMatch = raw.match(/<([^>]+)>/);
  if (bracketMatch) return bracketMatch[1].toLowerCase().trim();
  const plainMatch = raw.match(/[\w._%+\-]+@[\w.\-]+\.[a-z]{2,}/i);
  return (plainMatch?.[0] ?? raw).toLowerCase().trim();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("══════════════════════════════════════════════");
  console.log(" ClearedNo — Reply Checker");
  console.log(`  Started:  ${new Date().toISOString()}`);
  console.log(`  DRY_RUN:  ${DRY_RUN}`);
  console.log("══════════════════════════════════════════════\n");

  const client   = buildImapClient();
  const myEmail  = (process.env.FROM_EMAIL ?? "").toLowerCase();
  let   processed = 0;
  let   skipped   = 0;

  try {
    await client.connect();
    await client.mailboxOpen("INBOX");

    // Search for unread messages only
    const uids = await client.search({ seen: false }, { uid: true });

    if (uids.length === 0) {
      console.log("[CheckReplies] No unread messages. Done.");
      return;
    }

    console.log(`[CheckReplies] ${uids.length} unread message(s) to process`);

    for await (const message of client.fetch(uids, {
      uid:      true,
      envelope: true,
      bodyParts: ["TEXT"],
      bodyStructure: true,
    }, { uid: true })) {

      const envelope = message.envelope;
      const fromRaw  = envelope?.from?.[0];
      const fromAddr = fromRaw
        ? extractEmail(`${fromRaw.name ?? ""} <${fromRaw.address ?? ""}>`)
        : "";
      const subject  = envelope?.subject ?? "(no subject)";

      // Skip our own sent messages that ended up in inbox
      if (!fromAddr || fromAddr === myEmail) {
        skipped++;
        if (!DRY_RUN) {
          await client.messageFlagsAdd({ uid: message.uid }, ["\\Seen"], { uid: true });
        }
        continue;
      }

      // Extract plain-text body
      let body = "";
      if (message.bodyParts) {
        for (const [, content] of message.bodyParts) {
          if (content) {
            body = content.toString();
            break;
          }
        }
      }

      console.log(`\n[CheckReplies] From: ${fromAddr}`);
      console.log(`[CheckReplies] Subject: ${subject}`);

      if (DRY_RUN) {
        console.log(`[CheckReplies] DRY_RUN — would classify and auto-reply, would mark read`);
        processed++;
        continue;
      }

      // Check if this lead has already received an auto-reply.
      // If so, send admin alert and skip — no more auto-replies to this person.
      const { data: lead } = await supabaseAdmin
        .from("outreach_leads")
        .select("id, business_name, city, state, auto_replied")
        .ilike("email", fromAddr)
        .maybeSingle();

      if (lead?.auto_replied) {
        console.log(`[CheckReplies] ${fromAddr} already auto-replied — forwarding to admin`);
        await sendAdminAlert({
          subject: `Follow-up from ${fromAddr} — handle manually`,
          message: [
            `This lead already received an auto-reply.`,
            ``,
            `From:    ${fromAddr}`,
            `Lead:    ${lead.business_name} (${lead.city}, ${lead.state})`,
            `Subject: ${subject}`,
            ``,
            `Their message:`,
            body.slice(0, 600),
          ].join("\n"),
        }).catch(() => {});
        // Still mark read so it doesn't reappear next hour
        await client.messageFlagsAdd({ uid: message.uid }, ["\\Seen"], { uid: true });
        processed++;
        continue;
      }

      // Run through the full reply-handler pipeline:
      //   classify → auto-reply → update Supabase
      try {
        const result = await handleInboundWebhook({
          from:    fromAddr,
          subject,
          text:    body.slice(0, 2_000),
        });
        console.log(`[CheckReplies] Classified: ${result.intent} (${result.confidence})`);
      } catch (err) {
        console.error(
          `[CheckReplies] reply-handler failed for ${fromAddr}:`,
          (err as Error).message
        );
        // Fall through — still mark read to avoid infinite loop
      }

      // Mark as read regardless of handler outcome
      await client.messageFlagsAdd({ uid: message.uid }, ["\\Seen"], { uid: true });
      console.log(`[CheckReplies] ✓ Marked as read`);
      processed++;
    }

  } finally {
    await client.logout();
  }

  console.log(
    `\n[CheckReplies] Done — processed: ${processed}, skipped: ${skipped}`
  );
}

main().catch((err) => {
  console.error("[CheckReplies] Fatal error:", err.message ?? err);
  process.exit(1);
});
