# ClearedNo

Permit monitoring and roofing-lead data service.

## Required env vars

These MUST be set in production. The app will return HTTP 500 from the relevant
endpoint if any of these are missing — no silent fallbacks.

| Variable | Used by | Notes |
|----------|---------|-------|
| `CRON_SECRET` | `/api/outreach-send`, `/api/outreach-followup` | Bearer token for the outreach cron endpoints. Must be a strong random string. Required — endpoints fail closed if unset. |
| `DIGEST_SECRET` | `/api/digest` | Bearer token for the weekly digest cron. Required — endpoint fails closed if unset. |
| `RESEND_API_KEY` | outreach + digest emails | Resend API key. |
| `OUTREACH_FROM_EMAIL` | outreach emails | Optional — defaults to `outreach@clearedno.com`. |
| `NEXT_PUBLIC_URL` | digest emails | Base URL used to build unsubscribe links. |

Supabase, Stripe, and any other integrations have their own standard env vars
documented inline in the relevant modules.

### Rotating secrets

If `CRON_SECRET` or `DIGEST_SECRET` is ever exposed (e.g. shows up in git
history), rotate the value in the host env (Vercel / Cloudflare) immediately.
The old value should not be considered secret anymore.
