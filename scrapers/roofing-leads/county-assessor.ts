import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FRANKLIN_ARCGIS =
  'https://gis.franklincountyohio.gov/hosting/rest/services/ParcelFeatures/Parcel_Features/MapServer/0/query'

const BATCH_SIZE = 1000

async function fetchFranklinCounty() {
  let offset = 0
  let totalInserted = 0
  let hasMore = true

  while (hasMore) {
    const params = new URLSearchParams({
      where: "RESYRBLT > 0 AND RESYRBLT < 2005 AND PCLASS LIKE '1%'", // residential only
      outFields: 'SITEADDRESS,CNVYNAME,OWNERMADDR,OWNERCITY,OWNERSTATE,OWNERZIP,RESYRBLT',
      returnGeometry: 'false',
      resultOffset: String(offset),
      resultRecordCount: String(BATCH_SIZE),
      f: 'json',
    })

    const res = await fetch(`${FRANKLIN_ARCGIS}?${params}`)
    const json = await res.json()

    if (!json.features || json.features.length === 0) {
      hasMore = false
      break
    }

    const rows = json.features
      .map((f: any) => {
        const a = f.attributes
        return {
          address: a.SITEADDRESS || null,
          county: 'franklin',
          state: 'OH',
          owner_name: a.CNVYNAME || null,
          owner_mailing_address: [a.OWNERMADDR, a.OWNERCITY, a.OWNERSTATE, a.OWNERZIP].filter(Boolean).join(', ') || null,
          year_built: a.RESYRBLT ? parseInt(a.RESYRBLT) : null,
          source: 'franklin-arcgis',
          created_at: new Date().toISOString(),
        }
      })
      .filter((r: any) => r.address)

    // Upsert matching on county + address
    const { error } = await supabase
      .from('roofing_leads')
      .upsert(rows, { onConflict: 'county,address', ignoreDuplicates: false })

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

  console.log(`[DONE] Franklin County complete — ${totalInserted} total records`)
}

fetchFranklinCounty().catch(console.error)
