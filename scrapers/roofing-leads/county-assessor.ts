import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FRANKLIN_ARCGIS =
  'https://services1.arcgis.com/cJ9YHowT8TU7DUyn/arcgis/rest/services/Franklin_County_Parcels/FeatureServer/0/query'

const BATCH_SIZE = 1000

async function fetchFranklinCounty() {
  let offset = 0
  let totalInserted = 0
  let hasMore = true

  while (hasMore) {
    const params = new URLSearchParams({
      where: "YEARBUILT > 0 AND YEARBUILT < 2005 AND CLASSCD LIKE '1%'", // residential only
      outFields: 'SITEADDRESS,OWNERNAME1,OWNERADDR,OWNERCITY,OWNERSTATE,OWNERZIP,YEARBUILT',
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
        const ownerMailingAddress = [
          a.OWNERADDR,
          a.OWNERCITY,
          a.OWNERSTATE,
          a.OWNERZIP,
        ]
          .filter(Boolean)
          .join(', ')

        return {
          address: a.SITEADDRESS || null,
          county: 'franklin',
          state: 'OH',
          owner_name: a.OWNERNAME1 || null,
          owner_mailing_address: ownerMailingAddress || null,
          year_built: a.YEARBUILT ? parseInt(a.YEARBUILT) : null,
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
