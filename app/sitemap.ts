import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BASE = "https://www.clearedno.com";

// ─── Permit Encyclopedia ──────────────────────────────────────────────────────

const PERMIT_CITIES = [
  "austin-tx",
  "dallas-tx",
  "houston-tx",
  "san-antonio-tx",
  "columbus-oh",
  "philadelphia-pa",
  "grand-rapids-mi",
  "cleveland-oh",
  "pittsburgh-pa",
  "detroit-mi",
  "cincinnati-oh",
];

const CONTRACTOR_TRADES = [
  "roofing",
  "electrical",
  "plumbing",
  "hvac",
  "general-contractor",
  "remodeling",
];

const PERMIT_PROJECT_TYPES = [
  "deck-permit",
  "roof-permit",
  "fence-permit",
  "addition-permit",
  "new-construction",
  "electrical-permit",
  "plumbing-permit",
];

const LEADS_BLOG_SLUGS = [
  "ohio-roofing-leads",
  "roofing-lead-sources-2026",
  "ohio-hail-season-2025",
  "storm-data-roofing-leads",
  "how-to-find-storm-damage-leads-ohio",
  "hail-damage-roof-leads-columbus-ohio",
  "roofing-leads-cleveland-ohio",
  "best-roofing-leads-midwest",
  "roofing-contractor-lead-generation-tips",
  "hail-storm-tracker-roofing-contractors",
  "ohio-hail-season-roofing-leads",
  "ohio-building-permit-delays-2026",
];

const BLOG_SLUGS = [
  "grand-rapids-building-permit-status-2026",
  "philadelphia-building-permit-status-2026",
  "pennsylvania-roofing-permit-requirements",
  "austin-permit-tx-search-tool",
  "contractor-permit-tracking-multiple-jobs",
  "why-austin-permits-take-so-long",
  "round-rock-cedar-park-permit-requirements",
  "travis-county-building-permits",
  "austin-contractor-permit-lookup",
  "how-to-check-austin-permit-status",
  "average-permit-times-texas",
  "what-does-permit-cleared-mean",
  "houston-building-permit-status-2026",
  "houston-building-permit-status-check-2026",
  "san-antonio-building-permit-guide-2026",
  "columbus-ohio-building-permit-status-check",
  "cleveland-ohio-building-permit-guide-contractors",
  "cincinnati-building-permit-approval-times-2026",
  "grand-rapids-michigan-building-permit-guide",
  "detroit-building-permit-status-check-2026",
  "philadelphia-building-permit-guide-contractors-2026",
  "pittsburgh-building-permit-status-2026",
  "building-permit-tracking-software-contractors",
  "automatic-permit-status-alerts-contractors",
  "best-permit-monitoring-service-2026",
  "contractor-permit-management-tool",
  "austin-tx-permit-monitoring-service",
  "dallas-tx-permit-status-alerts",
  "houston-tx-permit-tracking-contractors",
  "how-much-does-permit-delay-cost-contractors",
  "permit-cleared-what-happens-next",
  "ohio-michigan-pennsylvania-permit-monitoring",
  "subcontractor-permit-tracking",
  "akron-building-permit-status-2026",
  "cincinnati-building-permit-status-2026",
  "cleveland-building-permit-status-2026",
  "columbus-building-permit-status-2026",
  "dallas-building-permit-status-2026",
  "san-antonio-building-permit-status-2026",
  "san-antonio-tx-permit-tracking-contractors",
  "building-permit-status-check-guide",
  "free-building-permit-lookup",
  "free-permit-lookup-by-address",
  "how-to-check-building-inspection-status",
  "how-to-check-permit-inspection-status",
  "how-to-never-miss-permit-approval",
  "permit-status-pending-what-it-means",
  "permit-tracking-software-for-contractors",
  "reduce-permit-wait-time-contractors",
  "angi-vs-homeadvisor-cost-for-contractors-2026",
  "best-roofing-contractors-cleveland-oh",
  "emergency-roof-repair-columbus-oh",
  "hail-damage-clinton-il",
  "hail-damage-roof-repair-chicago-il",
  "hail-damaged-roof-champaign-il",
  "roof-replacement-cost-cleveland-oh",
  "roof-replacement-cost-columbus-oh",
];

const LEADS_STATES = ["oh", "in", "mi", "ky", "il", "pa"];

function countyToSlug(county: string): string {
  return county
    .replace(/ County$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Roofing leads: state pages ─────────────────────────────────────────────
  const leadsStateEntries: MetadataRoute.Sitemap = LEADS_STATES.map((state) => ({
    url: `${BASE}/leads/roofing/${state}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // ── Roofing leads: city pages ─────────────────────────────────────────────
  const LEADS_CITIES: { state: string; city: string }[] = [
    { state: "oh", city: "columbus" }, { state: "oh", city: "cleveland" },
    { state: "oh", city: "cincinnati" }, { state: "oh", city: "akron" },
    { state: "oh", city: "toledo" }, { state: "oh", city: "dayton" },
    { state: "in", city: "indianapolis" }, { state: "in", city: "fort-wayne" },
    { state: "mi", city: "detroit" }, { state: "mi", city: "grand-rapids" },
    { state: "ky", city: "louisville" }, { state: "ky", city: "lexington" },
    { state: "il", city: "chicago" }, { state: "il", city: "rockford" },
    { state: "pa", city: "philadelphia" }, { state: "pa", city: "pittsburgh" },
  ];
  const leadsCityEntries: MetadataRoute.Sitemap = LEADS_CITIES.map(({ state, city }) => ({
    url: `${BASE}/leads/roofing/${state}/${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ── Roofing leads: county pages — TEMPORARY, remove once deindexed ─────────
  //
  // These pages are noindex (see app/leads/roofing/[state]/[county]/page.tsx).
  // They are listed here ONLY to get Google to recrawl them: a noindex tag is
  // invisible until the page is fetched, and dropping these URLs from the
  // sitemap on 2026-07-07 cut their crawl rate so far that just 29 of 243 had
  // been processed three weeks later. Listing them again restores crawl
  // scheduling so the tag is actually seen and the pages fall out of the index.
  //
  // priority 0.1 / changeFrequency "monthly" is deliberate — these must not
  // compete with real content for crawl budget, only stay above the floor.
  //
  // DO NOT remove the noindex to "fix" the mismatch between a sitemap entry
  // and a noindexed page. The mismatch is the mechanism.
  //
  // The 1000-row cap below is load-bearing, not a bug to fix: PostgREST caps
  // the response at 1000 rows regardless of the 2000 asked for, so ordering by
  // (state, county) yields the ~244 counties across IL/IN/KY that were in the
  // sitemap before it was trimmed — i.e. exactly the set Google indexed. The
  // uncapped distinct_counties_by_state RPC would add ~270 counties that were
  // never indexed and have nothing to deindex, wasting the crawl budget this
  // block is trying to conserve.
  //
  // REMOVE this block (and the countyToSlug helper and supabaseAdmin import
  // above) once GSC reports the county pages as "Excluded by 'noindex' tag".
  const { data: countyRows } = await supabaseAdmin
    .from("roofing_leads")
    .select("county, state")
    .order("state")
    .order("county")
    .limit(2000); // over-fetch; deduplicate below then cap

  const seen = new Set<string>();
  const leadsCountyEntries: MetadataRoute.Sitemap = [];

  for (const row of countyRows ?? []) {
    if (leadsCountyEntries.length >= 500) break;
    const stateSlug  = (row.state as string).toLowerCase();
    const countySlug = countyToSlug(row.county as string);
    const key        = `${stateSlug}/${countySlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    leadsCountyEntries.push({
      url: `${BASE}/leads/roofing/${stateSlug}/${countySlug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    });
  }

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const leadsBlogEntries: MetadataRoute.Sitemap = LEADS_BLOG_SLUGS.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const locationEntries: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE}/locations/${c.stateSlug}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Permit Encyclopedia: state hubs
  const permitStateEntries: MetadataRoute.Sitemap = ["texas", "ohio", "pennsylvania", "michigan"].map((state) => ({
    url: `${BASE}/permits/${state}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Permit Encyclopedia: 1 index + state hubs + city hubs + project-type pages
  const permitIndexEntry: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/permits`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const permitCityEntries: MetadataRoute.Sitemap = PERMIT_CITIES.map((city) => ({
    url: `${BASE}/permits/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const permitProjectEntries: MetadataRoute.Sitemap = PERMIT_CITIES.flatMap((city) =>
    PERMIT_PROJECT_TYPES.map((pt) => ({
      url: `${BASE}/permits/${city}/${pt}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }))
  );

  const TOP_PERMIT_TYPES = [
    "deck-permit",
    "roof-permit",
    "fence-permit",
    "addition-permit",
    "electrical-permit",
  ];

  const permitCostEntries: MetadataRoute.Sitemap = PERMIT_CITIES.flatMap((city) =>
    TOP_PERMIT_TYPES.map((pt) => ({
      url: `${BASE}/permits/${city}/${pt}/cost`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  );

  const permitTimelineEntries: MetadataRoute.Sitemap = PERMIT_CITIES.flatMap((city) =>
    TOP_PERMIT_TYPES.map((pt) => ({
      url: `${BASE}/permits/${city}/${pt}/timeline`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  );

  // Contractors: 1 index + 6 trades × 11 cities = 67 entries
  const contractorIndexEntry: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/contractors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const contractorPageEntries: MetadataRoute.Sitemap = CONTRACTOR_TRADES.flatMap((trade) =>
    PERMIT_CITIES.map((city) => ({
      url: `${BASE}/contractors/${trade}/${city}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE}/check`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/signup`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/leads/roi-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/tools/permit-fee-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/tools/permit-timeline-estimator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE}/austin`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/dallas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/houston`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/san-antonio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/suggest-city`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/locations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...locationEntries,
    ...blogEntries,
    ...leadsBlogEntries,
    ...permitIndexEntry,
    ...permitStateEntries,
    ...permitCityEntries,
    ...permitProjectEntries,
    ...permitCostEntries,
    ...permitTimelineEntries,
    ...contractorIndexEntry,
    ...contractorPageEntries,
    ...leadsStateEntries,
    ...leadsCityEntries,
    ...leadsCountyEntries,
  ];
}
