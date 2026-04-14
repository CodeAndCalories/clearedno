import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CUYAHOGA_ARCGIS =
  'https://gis.cuyahogacounty.us/server/rest/services/MyPLACE/Parcels_WMA_GJOIN_WGS84/MapServer/0/query'

const BATCH_SIZE = 1000

async function fetchCuyahogaCounty() {
  let offset = 0
  let totalInserted = 0
  let hasMore = true

  while (hasMore) {
    const params = new URLSearchParams({
      where: "property_class = 'R'", // residential only
      outFields: 'par_addr_all,par_city,par_zip,deeded_owner,mail_addr_street,mail_city,mail_state,mail_zip',
      returnGeometry: 'false',
      resultOffset: String(offset),
      resultRecordCount: String(BATCH_SIZE),
      f: 'json',
    })

    const res = await fetch(`${CUYAHOGA_ARCGIS}?${params}`)
    const json = await res.json()

    if (!json.features || json.features.length === 0) {
      hasMore = false
      break
    }

    const rows = json.features
      .map((f: any) => {
        const a = f.attributes
        return {
          address: a.par_addr_all || null,
          county: 'cuyahoga',
          state: 'OH',
          owner_name: a.deeded_owner || null,
          owner_mailing_address: [a.mail_addr_street, a.mail_city, a.mail_state, a.mail_zip].filter(Boolean).join(', ') || null,
          year_built: null,
          source: 'cuyahoga-arcgis',
          created_at: new Date().toISOString(),
        }
      })
      .filter((r: any) => r.address)

    // Upsert matching on county + address
    const { error } = await supabase
      .from('roofing_leads')
      .upsert(rows, { onConflict: 'county,address', ignoreDuplicates: true })

    if (error) {
      console.error(`[ERROR] batch at offset ${offset}:`, error.message)
    } else {
      totalInserted += rows.length
      console.log(`[OK] offset ${offset} — ${rows.length} rows upserted (total: ${totalInserted})`)
    }

    if (json.features.length < BATCH_SIZE) {
      hasMore = false
    } else {
      offset += BATCH_SIZE
    }
  }

  console.log(`[DONE] Cuyahoga County complete — ${totalInserted} total records`)
}

fetchCuyahogaCounty().catch(console.error)
