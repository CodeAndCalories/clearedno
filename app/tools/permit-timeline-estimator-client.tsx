"use client";

// Interactive permit timeline estimator. Client component so the host page
// stays statically generated — all math runs in the browser on input change.

import Link from "next/link";
import { useState } from "react";

// City speed factors reflect permit volume: busy metros run slower reviews,
// smaller markets turn permits around faster. Rough calibration against
// published 2025-2026 processing times, mirroring the fee calculator's
// cost-factor pattern.
const CITIES = [
  { slug: "austin-tx",       name: "Austin, TX",       factor: 1.25 },
  { slug: "dallas-tx",       name: "Dallas, TX",       factor: 1.1 },
  { slug: "houston-tx",      name: "Houston, TX",      factor: 1.2 },
  { slug: "san-antonio-tx",  name: "San Antonio, TX",  factor: 1.0 },
  { slug: "columbus-oh",     name: "Columbus, OH",     factor: 0.95 },
  { slug: "cleveland-oh",    name: "Cleveland, OH",    factor: 0.9 },
  { slug: "cincinnati-oh",   name: "Cincinnati, OH",   factor: 0.9 },
  { slug: "philadelphia-pa", name: "Philadelphia, PA", factor: 1.15 },
  { slug: "pittsburgh-pa",   name: "Pittsburgh, PA",   factor: 1.0 },
  { slug: "detroit-mi",      name: "Detroit, MI",      factor: 1.0 },
  { slug: "grand-rapids-mi", name: "Grand Rapids, MI", factor: 0.85 },
];

// Typical review windows in business days before city adjustment. Simple
// scopes are often over-the-counter; new construction needs full plan review.
const PROJECT_TYPES = [
  { slug: "roof",             name: "Roof replacement", daysLow: 1,  daysHigh: 5 },
  { slug: "deck",             name: "Deck",             daysLow: 2,  daysHigh: 7 },
  { slug: "fence",            name: "Fence",            daysLow: 1,  daysHigh: 4 },
  { slug: "electrical",       name: "Electrical work",  daysLow: 5,  daysHigh: 10 },
  { slug: "plumbing",         name: "Plumbing work",    daysLow: 5,  daysHigh: 10 },
  { slug: "new-construction", name: "New construction", daysLow: 15, daysHigh: 30 },
  { slug: "addition",         name: "Addition",         daysLow: 7,  daysHigh: 15 },
];

export default function PermitTimelineEstimator() {
  const [citySlug, setCitySlug] = useState(CITIES[0].slug);
  const [typeSlug, setTypeSlug] = useState(PROJECT_TYPES[0].slug);

  const city = CITIES.find((c) => c.slug === citySlug) ?? CITIES[0];
  const projectType = PROJECT_TYPES.find((t) => t.slug === typeSlug) ?? PROJECT_TYPES[0];

  const daysLow = Math.max(1, Math.round(projectType.daysLow * city.factor));
  const daysHigh = Math.max(daysLow + 1, Math.ceil(projectType.daysHigh * city.factor));

  const selectClasses =
    "w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer";

  return (
    <div className="border border-[#FF6B00]/30 bg-[#0A0A0A] relative">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 py-4 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
        <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono">
          Permit Timeline Estimator
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label htmlFor="pte-city" className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
              City
            </label>
            <div className="relative">
              <select
                id="pte-city"
                value={citySlug}
                onChange={(e) => setCitySlug(e.target.value)}
                className={selectClasses}
              >
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#FF6B00] text-xs">▾</span>
            </div>
          </div>

          {/* Project type */}
          <div>
            <label htmlFor="pte-type" className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
              Project Type
            </label>
            <div className="relative">
              <select
                id="pte-type"
                value={typeSlug}
                onChange={(e) => setTypeSlug(e.target.value)}
                className={selectClasses}
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#FF6B00] text-xs">▾</span>
            </div>
          </div>
        </div>

        {/* Result — updates instantly as inputs change */}
        <div className="mt-6 border border-[#FF6B00]/40 bg-[#FF6B00]/5 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <div className="border-b border-[#FF6B00]/20 px-6 py-3 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono">
              Estimated Approval Time — {city.name}
            </span>
          </div>
          <div className="px-6 py-5">
            <div className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase font-mono mb-1">
              {projectType.name} permit
            </div>
            <div className="font-heading text-4xl sm:text-5xl text-[#FF6B00] tracking-wide">
              {daysLow}–{daysHigh} business days
            </div>
            <p className="mt-4 text-xs text-[#F5F0E8]/50 font-mono leading-relaxed">
              What moves this number: plan review cycles, required inspections, current permit
              volume at the city, and how complete your application is on the first submittal.
            </p>
            <p className="mt-3 text-[10px] text-[#F5F0E8]/30 font-mono leading-relaxed">
              Estimate only — actual timelines vary by jurisdiction, project complexity, and
              current permit volume. Contact your local building department for current
              processing times.
            </p>
            <div className="mt-5 border-t border-[#FF6B00]/15 pt-4">
              <Link
                href="/permits/landing"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
              >
                Tracking a permit you already pulled? Get an alert the second it clears →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-[#F5F0E8]/25 font-mono leading-relaxed">
          Based on typical {projectType.name.toLowerCase()} review windows ({projectType.daysLow}–
          {projectType.daysHigh} business days), adjusted for {city.name} permit volume.
        </p>
      </div>
    </div>
  );
}
