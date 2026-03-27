// outreach/gmail-auth.ts
//
// ONE-TIME SETUP — run this ONCE to authorise your Gmail account.
// It opens a browser, asks you to log in with Google, then saves
// a token.json file that gmail-sender.ts reuses on every run.
//
// Usage:
//   npx ts-node --project tsconfig.scripts.json outreach/gmail-auth.ts
//
// Prerequisites:
//   1. Google Cloud Console → APIs & Services → Enable "Gmail API"
//   2. OAuth consent screen → External → add your Gmail as test user
//   3. Credentials → Create OAuth client ID (Desktop app)
//   4. Download JSON → save as outreach/credentials.json
//   5. Set GMAIL_CREDENTIALS_PATH=./outreach/credentials.json in .env.local
//   6. Set GMAIL_TOKEN_PATH=./outreach/token.json in .env.local

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs   from "fs";
import * as path from "path";
import * as http from "http";
import * as url  from "url";
import { google } from "googleapis";

// Scopes needed: send email on behalf of the user
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const CREDENTIALS_PATH = process.env.GMAIL_CREDENTIALS_PATH ?? "./outreach/credentials.json";
const TOKEN_PATH        = process.env.GMAIL_TOKEN_PATH        ?? "./outreach/token.json";

async function main() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`\n❌  credentials.json not found at: ${CREDENTIALS_PATH}`);
    console.error("   Download it from Google Cloud Console → Credentials → your OAuth client → Download JSON");
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed ?? credentials.web;

  // Use localhost redirect for desktop flow
  const redirectUri = "http://localhost:3456";
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",   // force refresh_token to be returned
  });

  console.log("\n══════════════════════════════════════════════");
  console.log("  ClearedNo — Gmail OAuth Setup");
  console.log("══════════════════════════════════════════════");
  console.log("\n1. Open this URL in your browser:\n");
  console.log("  ", authUrl);
  console.log("\n2. Log in and grant access.");
  console.log("3. You'll be redirected to localhost — the script captures the code automatically.\n");

  // Spin up a local server to capture the OAuth callback
  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const params = new url.URL(req.url!, "http://localhost:3456").searchParams;
      const code   = params.get("code");
      const error  = params.get("error");

      res.writeHead(200, { "Content-Type": "text/html" });
      if (code) {
        res.end("<h2>✅ Authorized! You can close this tab.</h2>");
        server.close();
        resolve(code);
      } else {
        res.end(`<h2>❌ Error: ${error}</h2>`);
        server.close();
        reject(new Error(`OAuth error: ${error}`));
      }
    });

    server.listen(3456, () => {
      console.log("Waiting for Google callback on http://localhost:3456 ...\n");
    });
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const tokenDir = path.dirname(TOKEN_PATH);
  if (!fs.existsSync(tokenDir)) fs.mkdirSync(tokenDir, { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

  console.log(`\n✅  Token saved to: ${TOKEN_PATH}`);
  console.log("   The outreach agent will use this token automatically.\n");
  console.log("   If the token expires, delete token.json and re-run this script.\n");
}

main().catch((err) => {
  console.error("\n❌  Auth failed:", err.message);
  process.exit(1);
});
