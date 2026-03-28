// outreach/gmail-poll.ts
//
// Polls Gmail for unread replies to outreach emails and runs them through
// reply-handler.ts. Marks each message as read after processing.
//
// Usage:
//   node dist/scraper/outreach/gmail-poll.js
//   DRY_RUN=true node dist/scraper/outreach/gmail-poll.js
//
// Designed to run as a scheduled GitHub Actions job (hourly).

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs   from "fs";
import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import { handleInboundWebhook } from "./reply-handler";

const DRY_RUN = process.env.DRY_RUN === "true" || false;

// ── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Builds a Gmail auth client.
 * Prefers App Password (SMTP-only, no read access) — so for polling we always
 * need OAuth. If token.json exists, use it. Otherwise abort with a clear message.
 */
function buildOAuthClient(): OAuth2Client | null {
  const credPath  = process.env.GMAIL_CREDENTIALS_PATH ?? "./outreach/credentials.json";
  const tokenPath = process.env.GMAIL_TOKEN_PATH        ?? "./outreach/token.json";

  if (!fs.existsSync(credPath) || !fs.existsSync(tokenPath)) {
    console.error(
      "[GmailPoll] OAuth credentials not found. Gmail polling requires token.json.\n" +
      "  Run: npx ts-node --project tsconfig.scripts.json outreach/gmail-auth.ts"
    );
    return null;
  }

  try {
    const creds   = JSON.parse(fs.readFileSync(credPath,  "utf8"));
    const tokens  = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
    const { client_id, client_secret } = creds.installed ?? creds.web;

    const auth = new google.auth.OAuth2(client_id, client_secret, "http://localhost:3456");
    auth.setCredentials(tokens);

    auth.on("tokens", (t) => {
      const merged = { ...tokens, ...t };
      fs.writeFileSync(tokenPath, JSON.stringify(merged, null, 2));
    });

    return auth;
  } catch (err) {
    console.error("[GmailPoll] Failed to load OAuth credentials:", (err as Error).message);
    return null;
  }
}

// ── Decode base64url message parts ────────────────────────────────────────────

function decodeBase64Url(encoded: string): string {
  return Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function extractHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function extractPlainText(payload: any): string {
  if (!payload) return "";

  // Direct plain-text body
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Multipart — walk parts recursively
  if (payload.parts) {
    for (const part of payload.parts) {
      const text = extractPlainText(part);
      if (text) return text;
    }
  }

  return "";
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("══════════════════════════════════════════════");
  console.log(" ClearedNo — Gmail Reply Poller");
  console.log(`  Started:  ${new Date().toISOString()}`);
  console.log(`  DRY_RUN:  ${DRY_RUN}`);
  console.log("══════════════════════════════════════════════\n");

  const auth = buildOAuthClient();
  if (!auth) process.exit(1);

  const gmail = google.gmail({ version: "v1", auth });

  // Search for unread messages in inbox that look like replies to our outreach
  // "is:unread in:inbox" catches everything; we skip our own sent messages below
  const listRes = await gmail.users.messages.list({
    userId: "me",
    q:      "is:unread in:inbox",
    maxResults: 50,
  });

  const messages = listRes.data.messages ?? [];
  console.log(`[GmailPoll] Found ${messages.length} unread message(s)`);

  if (messages.length === 0) {
    console.log("[GmailPoll] Nothing to process.");
    return;
  }

  let processed = 0;
  let skipped   = 0;
  const myEmail = (process.env.FROM_EMAIL ?? "").toLowerCase();

  for (const { id } of messages) {
    if (!id) continue;

    const msgRes = await gmail.users.messages.get({
      userId: "me",
      id,
      format: "full",
    });

    const msg     = msgRes.data;
    const headers = msg.payload?.headers ?? [];
    const from    = extractHeader(headers, "from");
    const subject = extractHeader(headers, "subject");
    const body    = extractPlainText(msg.payload);

    // Extract plain email address from "Name <email@example.com>"
    const fromEmailMatch = from.match(/<([^>]+)>/) ?? from.match(/([^\s]+@[^\s]+)/);
    const fromEmail      = (fromEmailMatch?.[1] ?? from).toLowerCase().trim();

    // Skip messages from ourselves
    if (fromEmail === myEmail) {
      skipped++;
      // Still mark as read so it doesn't reappear
      await gmail.users.messages.modify({
        userId: "me",
        id,
        requestBody: { removeLabelIds: ["UNREAD"] },
      });
      continue;
    }

    console.log(`[GmailPoll] Processing reply from ${fromEmail}: "${subject}"`);

    if (!DRY_RUN) {
      try {
        await handleInboundWebhook({ from: fromEmail, subject, text: body });
      } catch (err) {
        console.error(`[GmailPoll] reply-handler failed for ${fromEmail}:`, (err as Error).message);
        // Still mark read to avoid infinite reprocessing
      }

      // Mark as read
      await gmail.users.messages.modify({
        userId: "me",
        id,
        requestBody: { removeLabelIds: ["UNREAD"] },
      });
    } else {
      console.log(`[GmailPoll] DRY_RUN — would process reply from ${fromEmail}, would mark read`);
    }

    processed++;
  }

  console.log(
    `\n[GmailPoll] Done — processed: ${processed}, skipped (own emails): ${skipped}`
  );
}

main().catch((err) => {
  console.error("[GmailPoll] Fatal error:", err);
  process.exit(1);
});
