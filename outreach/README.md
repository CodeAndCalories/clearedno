# ClearedNo — Outreach Agent

Automated cold-email pipeline for contractor lead generation.

**Stack:** Google Maps Places API (leads) → Claude API (personalized copy) → Gmail API (sending)

---

## Required Environment Variables

Add these to `.env.local` (see `.env.local.example`):

| Variable | Purpose |
|----------|---------|
| `GOOGLE_MAPS_API_KEY` | Finding contractor leads via Places API |
| `ANTHROPIC_API_KEY` | Claude generates personalized email copy |
| `GMAIL_CREDENTIALS_PATH` | Path to your downloaded Google OAuth credentials JSON |
| `GMAIL_TOKEN_PATH` | Path where the auth token will be saved after setup |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for outreach_leads table writes) |
| `FROM_EMAIL` | Sender email address (must match your Gmail account) |
| `FROM_NAME` | Sender display name (e.g. `Alex at ClearedNo`) |

---

## One-Time Gmail Setup

You only do this once. It authorises the agent to send email from your Gmail account.

### Step 1 — Create Google Cloud credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project (or use an existing one)
3. **APIs & Services → Library** → search "Gmail API" → Enable
4. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - Add your Gmail address as a **Test user**
5. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Desktop app**
   - Click **Create**
6. Download the JSON file → save as `outreach/credentials.json`
   _(this file is .gitignored — never commit it)_

### Step 2 — Run the auth script

```bash
npx ts-node --project tsconfig.scripts.json outreach/gmail-auth.ts
```

- The script prints a Google sign-in URL
- Open it in your browser and grant access
- It saves `outreach/token.json` automatically
- Done — the agent will use this token on every run

> If the token ever expires or stops working, delete `token.json` and re-run the auth script.

---

## Running the Outreach Agent

### Dry run (no emails sent, no DB writes)

```bash
DRY_RUN=true npx ts-node --project tsconfig.scripts.json outreach/index.ts
```

### Live run

```bash
npx ts-node --project tsconfig.scripts.json outreach/index.ts
```

### Via compiled JS (production / GitHub Actions)

```bash
npm run build:scraper   # compiles everything including outreach/
node dist/scraper/outreach/index.js
```

---

## Daily Limits

- **30 emails per day** — hard-coded in `sender.ts`
- The agent checks `last_contacted_at` in Supabase — a lead is never emailed twice
- Gmail free accounts allow ~500 emails/day; Google Workspace allows ~2,000/day

---

## Pipeline Flow

```
1. Check outreach_leads in Supabase
   └─ If < 100 uncontacted leads → run lead-finder.ts
         └─ Google Maps Places API → save new leads

2. Pull up to 30 uncontacted leads with emails

3. email-writer.ts → Claude API → personalized subject + body per lead

4. gmail-sender.ts → Gmail API → send + mark contacted in Supabase
```

---

## Files

| File | Purpose |
|------|---------|
| `gmail-auth.ts` | One-time OAuth2 setup — run once to create `token.json` |
| `gmail-sender.ts` | Low-level Gmail API send function |
| `sender.ts` | Batch send with daily quota + Supabase dedup tracking |
| `email-writer.ts` | Claude API — generates personalized cold emails |
| `lead-finder.ts` | Google Maps Places API — finds contractor leads |
| `reply-handler.ts` | Classifies inbound replies with Claude |
| `index.ts` | Orchestrator — runs the full pipeline |

---

## Reply Handling

Resend (or Gmail inbound parsing) can POST to `/api/outreach/reply` with raw email data.
`reply-handler.ts` uses Claude to classify the reply and notifies `ADMIN_EMAIL` for
`INTERESTED` or `QUESTION` replies.
