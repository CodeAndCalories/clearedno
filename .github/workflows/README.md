# GitHub Actions — ClearedNo Workflows

## Workflows

### `scraper.yml` — Permit Status Scraper

Runs the permit scraper on a schedule and on demand.

**Scheduled triggers:**
- Weekdays (Mon–Fri): every 2 hours from 06:00–18:00 UTC
- Weekends (Sat–Sun): 08:00, 12:00, 16:00 UTC

---

## Manual Trigger (with Dry Run)

Use this to test the scraper — or new city selectors — without touching the
database or sending any emails.

1. Go to **Actions → Permit Status Scraper → Run workflow**
2. Set **dry_run** to `true`
3. Click **Run workflow**

The scraper will run through every active permit and log what it *would* do,
but skip all Supabase writes and Resend calls.

---

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**
and add each of the following:

| Secret | Where to find it |
|--------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key (keep secret) |
| `RESEND_API_KEY` | resend.com → API Keys |
| `FROM_EMAIL` | The verified sender address in Resend (e.g. `alerts@clearedno.com`) |
| `FROM_NAME` | Sender display name (e.g. `ClearedNo`) |
| `ADMIN_EMAIL` | Your ops inbox — receives scraper health-check failure alerts |
| `NEXT_PUBLIC_URL` | Your deployed domain, no trailing slash (e.g. `https://www.clearedno.com`) |

> **Note:** Stripe keys are intentionally excluded — the scraper never touches
> Stripe. Only add what's needed to keep the secret surface small.

---

## Adding a New City Scraper

1. **Create the scraper file** at `scrapers/cities/{city}-{state-abbr}.ts`
   - Extend `BaseScraper` from `../base-scraper`
   - Implement `handles(city, state): boolean` and `scrape(permit): Promise<ScrapeResult>`
   - Add a `STATUS_MAP` object mapping portal strings → `PermitStatus` values
   - Mark all selectors with `// TODO: verify` so they're easy to find later

2. **Register it in the engine** — open `scrapers/index.ts` and add your scraper
   to the `scrapers` array:
   ```typescript
   import { PhoenixAzScraper } from './cities/phoenix-az';

   const scrapers: BaseScraper[] = [
     new AustinTxScraper(),
     new DallasTxScraper(),
     new PhoenixAzScraper(), // ← add here
   ];
   ```

3. **Verify selectors** — run a dry-run against a real permit number from that
   city to confirm the selectors still work:
   ```
   DRY_RUN=true npx ts-node --project tsconfig.scripts.json scrapers/index.ts
   ```
   Or trigger the workflow manually with `dry_run=true`.

4. **Update `migrations/002_...sql`** if the new city introduces any new status
   values not already in the `permits_status_check` constraint.

---

## Monitoring & Alerts

- The scraper sends an email to `ADMIN_EMAIL` when any city portal fails
  **3 or more consecutive times** — this is your signal to check selectors.
- Each run emits structured newline-delimited JSON to stdout, which GitHub
  Actions captures in the run log.
- End-of-run summary includes: `total`, `checked`, `changed`, `skipped`,
  `failed`, `duration_ms`.
