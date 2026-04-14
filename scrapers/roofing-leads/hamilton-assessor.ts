import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HAMILTON_ARCGIS =
  'https://www.hamiltonco.org/arcgis/rest/services/HamiltonCounty/Parcels/MapServer/0/query'

const BATCH_SIZE = 1000

async function fetchHamiltonCounty() {
  let offset = 0
  let totalInserted = 0
  let hasMore = true

  while (hasMore) {
    const params = new URLSearchParams({
      where: "1=1",
      outFields: '*',
      returnGeometry: 'false',
      resultOffset: String(offset),
      resultRecordCount: String(BATCH_SIZE),
      f: 'json',
    })

    let res = await fetch(`${HAMILTON_ARCGIS}?${params}`)
    let json = await res.json()

    // Fallback to public ArcGIS if primary fails
    if (!json.features) {
      console.warn(`[WARN] Primary URL returned no features at offset ${offset}, trying fallback…`)
      const fallback = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Hamilton_County_OH_Parcels/FeatureServer/0/query'
      res = await fetch(`${fallback}?${params}`)
      json = await res.json()
    }

    if (!json.features || json.features.length === 0) {
      hasMore = false
      break
    }

    // Log the first record's keys to identify field names
    if (offset === 0 && json.features.length > 0) {
      console.log('[INFO] Sample field keys:', Object.keys(json.features[0].attributes))
    }

    const rows = json.features
      .map((f: any) => {
        const a = f.attributes
        // Common Hamilton County field name variants — adapt after first run
        const address =
          a.SITEADDRESS ?? a.SITE_ADDRESS ?? a.ADDRESS ?? a.PAR_ADDR ?? a.FullAddress ?? null
        const ownerName =
          a.OWNER1 ?? a.OWNERNAME ?? a.OWNER_NAME ?? a.OWN1 ?? a.Deeded_Owner ?? null
        const mailingAddr =
          a.MAIL_ADDR ?? a.MAILADDRESS ?? a.MAILING_ADDRESS ?? null
        const yearBuilt =
          a.YR_BUILT ?? a.YEAR_BUILT ?? a.YRBUILT ?? a.YearBuilt ?? null

        return {
          address,
          county: 'hamilton',
          state: 'OH',
          owner_name: ownerName,
          owner_mailing_address: mailingAddr,
          year_built: yearBuilt ? Number(yearBuilt) : null,
          source: 'hamilton-arcgis',
          created_at: new Date().toISOString(),
        }
      })
      .filter((r: any) => r.address)

    if (rows.length === 0) {
      console.log(`[SKIP] offset ${offset} — no addressable rows`)
    } else {
      const { error } = await supabase
        .from('roofing_leads')
        .upsert(rows, { onConflict: 'county,address', ignoreDuplicates: true })

      if (error) {
        console.error(`[ERROR] batch at offset ${offset}:`, error.message)
      } else {
        totalInserted += rows.length
        console.log(`[OK] offset ${offset} — ${rows.length} rows upserted (total: ${totalInserted})`)
      }
    }

    if (json.features.length < BATCH_SIZE) {
      hasMore = false
    } else {
      offset += BATCH_SIZE
    }
  }

  console.log(`[DONE] Hamilton County complete — ${totalInserted} total records`)
}

fetchHamiltonCounty().catch(console.error)
