// outreach/gmail-sender.ts
//
// Sends email via Gmail API using OAuth2 credentials.
// Requires a one-time auth flow — run outreach/gmail-auth.ts first.
//
// Token is refreshed automatically when it expires.

import * as fs from "fs";
import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

const CREDENTIALS_PATH = process.env.GMAIL_CREDENTIALS_PATH ?? "./outreach/credentials.json";
const TOKEN_PATH        = process.env.GMAIL_TOKEN_PATH        ?? "./outreach/token.json";

// ── Build authorized Gmail client ─────────────────────────────────────────────

function buildAuthClient(): OAuth2Client | null {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.warn(`[GmailSender] credentials.json not found at ${CREDENTIALS_PATH}`);
    return null;
  }
  if (!fs.existsSync(TOKEN_PATH)) {
    console.warn(`[GmailSender] token.json not found at ${TOKEN_PATH}. Run outreach/gmail-auth.ts first.`);
    return null;
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id } = credentials.installed ?? credentials.web;
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      "http://localhost:3456"
    );
    oAuth2Client.setCredentials(tokens);

    // Persist refreshed token back to disk so it survives across runs
    oAuth2Client.on("tokens", (newTokens) => {
      const existing = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
      const merged   = { ...existing, ...newTokens };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
    });

    return oAuth2Client;
  } catch (err) {
    console.warn("[GmailSender] Failed to load credentials:", (err as Error).message);
    return null;
  }
}

// ── Encode email as RFC 2822 base64url ────────────────────────────────────────

function buildRawMessage(opts: {
  from: string;
  to:   string;
  subject: string;
  text: string;
}): string {
  const messageParts = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    opts.text,
  ];
  const raw = messageParts.join("\r\n");
  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface GmailSendOptions {
  to:      string;
  subject: string;
  text:    string;
}

/**
 * Sends a single email via Gmail API.
 * Returns true on success, false on failure (never throws).
 */
export async function sendViaGmail(opts: GmailSendOptions): Promise<boolean> {
  const auth = buildAuthClient();
  if (!auth) {
    console.error("[GmailSender] Cannot send — auth client unavailable.");
    return false;
  }

  const fromEmail = process.env.FROM_EMAIL ?? "me";
  const fromName  = process.env.FROM_NAME  ?? "ClearedNo";
  const from      = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  try {
    const gmail = google.gmail({ version: "v1", auth });
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: buildRawMessage({ from, to: opts.to, subject: opts.subject, text: opts.text }),
      },
    });
    return true;
  } catch (err: any) {
    // Surface useful error details without crashing the whole run
    const msg = err?.response?.data?.error?.message ?? err?.message ?? String(err);
    console.error(`[GmailSender] Send failed to ${opts.to}: ${msg}`);
    return false;
  }
}
