// Roofer Email Collector — discovers roofing contractors via Google Maps Places API,
// scrapes their websites for contact emails, writes results to a CSV file, and
// imports unique new emails into the outreach_leads Supabase table.
//
// Usage:
//   npx ts-node scrapers/roofer-email-collector.ts
//
// Output: output/roofer-emails-v3.csv
// Columns: business_name, email, phone, website, city, state
// Covers: OH (21 cities), IL (10), IN (10), KY (9), MI (10), PA (9) — 69 cities total

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Configuration ──────────────────────────────────────────────────────────────

const TARGET_CITIES: Array<{ city: string; state: string }> = [
  // Ohio — 21 cities
  { city: 'Columbus',        state: 'OH' },
  { city: 'Cleveland',       state: 'OH' },
  { city: 'Cincinnati',      state: 'OH' },
  { city: 'Akron',           state: 'OH' },
  { city: 'Toledo',          state: 'OH' },
  { city: 'Dayton',          state: 'OH' },
  { city: 'Youngstown',      state: 'OH' },
  { city: 'Canton',          state: 'OH' },
  { city: 'Lorain',          state: 'OH' },
  { city: 'Elyria',          state: 'OH' },
  { city: 'Springfield',     state: 'OH' },
  { city: 'Kettering',       state: 'OH' },
  { city: 'Hamilton',        state: 'OH' },
  { city: 'Parma',           state: 'OH' },
  { city: 'Euclid',          state: 'OH' },
  { city: 'Mentor',          state: 'OH' },
  { city: 'Middletown',      state: 'OH' },
  { city: 'Mansfield',       state: 'OH' },
  { city: 'Lima',            state: 'OH' },
  { city: 'Newark',          state: 'OH' },
  { city: 'Findlay',         state: 'OH' },
  // Illinois — 10 cities
  { city: 'Chicago',         state: 'IL' },
  { city: 'Aurora',          state: 'IL' },
  { city: 'Rockford',        state: 'IL' },
  { city: 'Joliet',          state: 'IL' },
  { city: 'Naperville',      state: 'IL' },
  { city: 'Peoria',          state: 'IL' },
  { city: 'Springfield',     state: 'IL' },
  { city: 'Elgin',           state: 'IL' },
  { city: 'Waukegan',        state: 'IL' },
  { city: 'Cicero',          state: 'IL' },
  // Indiana — 10 cities
  { city: 'Indianapolis',    state: 'IN' },
  { city: 'Fort Wayne',      state: 'IN' },
  { city: 'Evansville',      state: 'IN' },
  { city: 'South Bend',      state: 'IN' },
  { city: 'Carmel',          state: 'IN' },
  { city: 'Fishers',         state: 'IN' },
  { city: 'Bloomington',     state: 'IN' },
  { city: 'Hammond',         state: 'IN' },
  { city: 'Gary',            state: 'IN' },
  { city: 'Muncie',          state: 'IN' },
  // Kentucky — 9 cities
  { city: 'Louisville',      state: 'KY' },
  { city: 'Lexington',       state: 'KY' },
  { city: 'Bowling Green',   state: 'KY' },
  { city: 'Owensboro',       state: 'KY' },
  { city: 'Covington',       state: 'KY' },
  { city: 'Richmond',        state: 'KY' },
  { city: 'Georgetown',      state: 'KY' },
  { city: 'Florence',        state: 'KY' },
  { city: 'Hopkinsville',    state: 'KY' },
  // Michigan — 10 cities
  { city: 'Detroit',         state: 'MI' },
  { city: 'Grand Rapids',    state: 'MI' },
  { city: 'Warren',          state: 'MI' },
  { city: 'Sterling Heights', state: 'MI' },
  { city: 'Ann Arbor',       state: 'MI' },
  { city: 'Lansing',         state: 'MI' },
  { city: 'Flint',           state: 'MI' },
  { city: 'Dearborn',        state: 'MI' },
  { city: 'Livonia',         state: 'MI' },
  { city: 'Troy',            state: 'MI' },
  // Pennsylvania — 9 cities
  { city: 'Philadelphia',    state: 'PA' },
  { city: 'Pittsburgh',      state: 'PA' },
  { city: 'Allentown',       state: 'PA' },
  { city: 'Erie',            state: 'PA' },
  { city: 'Reading',         state: 'PA' },
  { city: 'Scranton',        state: 'PA' },
  { city: 'Bethlehem',       state: 'PA' },
  { city: 'Lancaster',       state: 'PA' },
  { city: 'Harrisburg',      state: 'PA' },
]

const SEARCH_QUERIES = [
  'roofing contractor',
  'roofing company',
]

const MAX_PER_COMBO = 15

const CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/about',
  '/about-us',
  '/get-in-touch',
  '/estimate',
  '/free-estimate',
  '/request-quote',
]

const EMAIL_BLOCKLIST = [
  'noreply', 'no-reply', 'donotreply',
  'wordpress', 'woocommerce', 'sentry',
  'example.com', 'test.com', 'w3.org', 'schema.org',
  'yoursite', 'yourdomain', 'domain.com',
  'privacy@', 'legal@', 'abuse@', 'postmaster@',
  'webmaster@', 'support@squarespace', 'support@wix',
  '@sentry.io', '@rollbar.com', '@bugsnag.com',
]

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const OUTPUT_DIR  = path.resolve('output')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'roofer-emails-v3.csv')

// ── Types ──────────────────────────────────────────────────────────────────────

interface RooferLead {
  business_name: string
  email:         string
  phone:         string
  website:       string
  city:          string
  state:         string
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.error('ERROR: GOOGLE_MAPS_API_KEY is not set in .env.local')
    process.exit(1)
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const seenEmails = new Set<string>()
  const seenNames  = new Set<string>()
  const allLeads:  RooferLead[] = []

  for (const { city, state } of TARGET_CITIES) {
    console.log(`\nSearching ${city} ${state}...`)

    for (const query of SEARCH_QUERIES) {
      const places = await textSearch(apiKey, query, city, state, MAX_PER_COMBO)
      console.log(`  [${query}] → ${places.length} places found`)

      for (const { placeId, name } of places) {
        const nameKey = `${name.toLowerCase()}|${city.toLowerCase()}`
        if (seenNames.has(nameKey)) continue
        seenNames.add(nameKey)

        const details = await getPlaceDetails(placeId, apiKey)
        await sleep(150)

        let email: string | null = null
        if (details.website) {
          email = await extractEmailFromWebsite(details.website)
          await sleep(1_000)
        }

        if (!email) continue
        if (seenEmails.has(email)) continue
        seenEmails.add(email)

        console.log(`  Found email: ${email}  (${name})`)

        allLeads.push({
          business_name: name,
          email,
          phone:   details.phone   ?? '',
          website: details.website ?? '',
          city,
          state,
        })
      }
    }
  }

  // ── Write CSV ──────────────────────────────────────────────────────────────
  const csvStream = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf8' })
  csvStream.write('business_name,email,phone,website,city,state\n')
  for (const lead of allLeads) csvStream.write(csvRow(lead))
  await new Promise<void>((resolve, reject) => {
    csvStream.end((err: Error | null | undefined) => err ? reject(err) : resolve())
  })
  console.log(`\nCSV written: ${allLeads.length} leads → ${OUTPUT_FILE}`)

  // ── Supabase import ────────────────────────────────────────────────────────
  await importToSupabase(allLeads)
}

async function importToSupabase(leads: RooferLead[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Skipping Supabase import — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Fetch all existing emails in one query
  const { data: existing, error: fetchErr } = await supabase
    .from('outreach_leads')
    .select('email')
    .not('email', 'is', null)

  if (fetchErr) {
    console.error('Supabase fetch existing emails failed:', fetchErr.message)
    return
  }

  const existingEmails = new Set((existing ?? []).map((r: { email: string }) => r.email.toLowerCase()))

  const newLeads = leads.filter(l => !existingEmails.has(l.email.toLowerCase()))
  console.log(`\nSupabase import: ${leads.length} scraped, ${existingEmails.size} already exist, ${newLeads.length} new`)

  if (newLeads.length === 0) {
    console.log('Nothing new to import.')
    return
  }

  let inserted = 0
  for (const lead of newLeads) {
    const { error } = await supabase.from('outreach_leads').insert({
      business_name:   lead.business_name,
      email:           lead.email,
      phone:           lead.phone   || null,
      website:         lead.website || null,
      city:            lead.city,
      state:           lead.state,
      contractor_type: 'roofing',
      source:          'scraper_v2',
      status:          'new',
    })

    if (error) {
      if (error.code === '23505') continue // duplicate — race condition, skip
      console.error(`  Insert failed for ${lead.email}:`, error.message)
    } else {
      console.log(`  Imported: ${lead.email}  (${lead.business_name}, ${lead.city})`)
      inserted++
    }
  }

  console.log(`\nSupabase import done — ${inserted} / ${newLeads.length} inserted`)
}

// ── Google Maps helpers ────────────────────────────────────────────────────────

async function textSearch(
  apiKey: string,
  query:  string,
  city:   string,
  state:  string,
  max:    number,
): Promise<Array<{ placeId: string; name: string }>> {
  try {
    const res = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `${query} in ${city} ${state}`,
          key:   apiKey,
        },
      },
    )
    return (res.data.results ?? []).slice(0, max).map((r: any) => ({
      placeId: r.place_id as string,
      name:    r.name     as string,
    }))
  } catch (err) {
    console.error(`  Text search failed (${city} / ${query}):`, (err as Error).message)
    return []
  }
}

async function getPlaceDetails(
  placeId: string,
  apiKey:  string,
): Promise<{ website?: string; phone?: string }> {
  try {
    const res = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields:   'website,formatted_phone_number',
          key:      apiKey,
        },
      },
    )
    const r = res.data.result ?? {}
    return {
      website: r.website,
      phone:   r.formatted_phone_number,
    }
  } catch (err) {
    console.error(`  Place Details failed for ${placeId}:`, (err as Error).message)
    return {}
  }
}

// ── Website email extraction ───────────────────────────────────────────────────

async function extractEmailFromWebsite(websiteUrl: string): Promise<string | null> {
  const base = normalizeUrl(websiteUrl)
  if (!base) return null

  const pagesToTry = [base, ...CONTACT_PATHS.map((p) => `${base.replace(/\/$/, '')}${p}`)]

  for (const pageUrl of pagesToTry) {
    const html = await fetchWithTimeout(pageUrl, 6_000)
    if (!html) continue

    const email = pickBestEmail(extractAllEmails(html))
    if (email) return email
  }

  return null
}

function extractAllEmails(html: string): string[] {
  const candidates = new Set<string>()

  // Method 1: JSON-LD structured data
  const ldJsonBlocks = Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  )
  for (const block of ldJsonBlocks) {
    try {
      const obj = JSON.parse(block[1])
      for (const e of findEmailsInObject(obj)) candidates.add(e.toLowerCase())
    } catch {
      // Malformed JSON — ignore
    }
  }

  // Method 2: mailto: href links
  for (const match of Array.from(html.matchAll(/mailto:([^"'\s>?&]+)/gi))) {
    const raw = match[1].toLowerCase().split('?')[0].trim()
    if (raw.includes('@')) candidates.add(raw)
  }

  // Method 3: Obfuscated "name [at] domain [dot] com"
  const deobfuscated = html
    .replace(/\s*\[at\]\s*/gi,  '@')
    .replace(/\s*\(at\)\s*/gi,  '@')
    .replace(/\s+at\s+/gi,      '@')
    .replace(/\s*\[dot\]\s*/gi, '.')
    .replace(/\s*\(dot\)\s*/gi, '.')
    .replace(/\s+dot\s+/gi,     '.')
  for (const match of Array.from(deobfuscated.matchAll(new RegExp(EMAIL_REGEX.source, 'g')))) {
    candidates.add(match[0].toLowerCase())
  }

  // Method 4: JSON "email":"..." patterns
  for (const match of Array.from(html.matchAll(/["']email["']\s*:\s*["']([^"']+)["']/gi))) {
    const e = match[1].toLowerCase().trim()
    if (e.includes('@')) candidates.add(e)
  }

  // Method 5: Raw regex sweep
  for (const match of Array.from(html.matchAll(new RegExp(EMAIL_REGEX.source, 'g')))) {
    candidates.add(match[0].toLowerCase())
  }

  return Array.from(candidates)
}

function findEmailsInObject(obj: unknown, depth = 0): string[] {
  if (depth > 6 || obj === null || typeof obj !== 'object') return []
  const found: string[] = []
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key.toLowerCase() === 'email' && typeof value === 'string' && value.includes('@')) {
      found.push(value)
    } else if (typeof value === 'object') {
      found.push(...findEmailsInObject(value, depth + 1))
    } else if (Array.isArray(value)) {
      for (const item of value as unknown[]) found.push(...findEmailsInObject(item, depth + 1))
    }
  }
  return found
}

function pickBestEmail(emails: string[]): string | null {
  const valid = emails.filter((e) => {
    if (!e.includes('@')) return false
    if (e.includes('%')) return false
    const lower = e.toLowerCase()
    if (EMAIL_BLOCKLIST.some((blocked) => lower.includes(blocked))) return false
    const parts = lower.split('.')
    const tld   = parts[parts.length - 1]
    if (!tld || tld.length < 2 || tld.length > 6) return false
    const [local, domain] = lower.split('@')
    if (!local || local.length < 1) return false
    if (!domain || !domain.includes('.')) return false
    return true
  })

  if (valid.length === 0) return null

  const preferred = valid.find((e) =>
    /^(info|contact|hello|hey|admin|office|team|estimate|quotes?)@/.test(e),
  )
  return preferred ?? valid[0]
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal:   controller.signal,
      redirect: 'follow',
      headers:  {
        'User-Agent':      BROWSER_UA,
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('text') && !ct.includes('html')) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
    return u.origin
  } catch {
    return null
  }
}

// ── CSV helpers ────────────────────────────────────────────────────────────────

/** Escapes a single CSV field value. */
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function csvRow(lead: RooferLead): string {
  return [
    csvEscape(lead.business_name),
    csvEscape(lead.email),
    csvEscape(lead.phone),
    csvEscape(lead.website),
    csvEscape(lead.city),
    csvEscape(lead.state),
  ].join(',') + '\n'
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Entry point ────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error('Fatal error:', err instanceof Error ? err.message : err)
  process.exit(1)
})
