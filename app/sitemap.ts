import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";

const BASE = "https://www.clearedno.com";

const BLOG_SLUGS = [
  "austin-permit-tx-search-tool",
  "contractor-permit-tracking-multiple-jobs",
  "why-austin-permits-take-so-long",
  "round-rock-cedar-park-permit-requirements",
  "travis-county-building-permits",
  "austin-contractor-permit-lookup",
  "how-to-check-austin-permit-status",
  "average-permit-times-texas",
  "what-does-permit-cleared-mean",
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const locationEntries: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE}/locations/${c.stateSlug}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
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
    ...locationEntries,
    ...blogEntries,
  ];
}
