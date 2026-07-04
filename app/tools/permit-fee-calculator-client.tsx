"use client";

// Interactive permit fee estimator. Client component so the host page stays
// statically generated — all math runs in the browser on input change.

import Link from "next/link";
import { useState } from "react";

// City cost factors reflect that bigger metros run higher fee schedules.
// Rough calibration against published 2025-2026 residential fee schedules.
const CITIES = [
  { slug: "austin-tx",       name: "Austin, TX",       factor: 1.15 },
  { slug: "dallas-tx",       name: "Dallas, TX",       factor: 1.05 },
  { slug: "houston-tx",      name: "Houston, TX",      factor: 1.0 },
  { slug: "san-antonio-tx",  name: "San Antonio, TX",  factor: 0.95 },
  { slug: "columbus-oh",     name: "Columbus, OH",     factor: 0.95 },
  { slug: "cleveland-oh",    name: "Cleveland, OH",    factor: 0.9 },
  { slug: "cincinnati-oh",   name: "Cincinnati, OH",   factor: 0.9 },
  { slug: "philadelphia-pa", name: "Philadelphia, PA", factor: 1.1 },
  { slug: "pittsburgh-pa",   name: "Pittsburgh, PA",   factor: 1.0 },
  { slug: "detroit-mi",      name: "Detroit, MI",      factor: 0.9 },
  { slug: "grand-rapids-mi", name: "Grand Rapids, MI", factor: 0.95 },
];

// Base fee band per project type (admin/issuance), plus a valuation-based fee
// of roughly $5-8 per $1,000 of project value — the model most US cities use.
const PROJECT_TYPES = [
  { slug: "roof",             name: "Roof replacement",  baseLow: 75,  baseHigh: 125, placeholder: "12,000" },
  { slug: "deck",             name: "Deck",              baseLow: 60,  baseHigh: 100, placeholder: "8,000" },
  { slug: "fence",            name: "Fence",             baseLow: 50,  baseHigh: 85,  placeholder: "4,500" },
  { slug: "electrical",       name: "Electrical work",   baseLow: 60,  baseHigh: 100, placeholder: "3,500" },
  { slug: "plumbing",         name: "Plumbing work",     baseLow: 60,  baseHigh: 100, placeholder: "3,500" },
  { slug: "new-construction", name: "New construction",  baseLow: 125, baseHigh: 150, placeholder: "350,000" },
  { slug: "addition",         name: "Addition",          baseLow: 100, baseHigh: 150, placeholder: "80,000" },
];

const RATE_LOW = 5;  // $ per $1,000 of project value
const RATE_HIGH = 8; // $ per $1,000 of project value

function roundToFive(n: number) {
  return Math.round(n / 5) * 5;
}

export default function PermitFeeCalculator() {
  const [citySlug, setCitySlug] = useState(CITIES[0].slug);
  const [typeSlug, setTypeSlug] = useState(PROJECT_TYPES[0].slug);
  const [projectValue, setProjectValue] = useState("");

  const city = CITIES.find((c) => c.slug === citySlug) ?? CITIES[0];
  const projectType = PROJECT_TYPES.find((t) => t.slug === typeSlug) ?? PROJECT_TYPES[0];
  const value = Number(projectValue.replace(/[^0-9]/g, ""));

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
    setProjectValue(raw ? Number(raw).toLocaleString("en-US") : "");
  }

  const hasResult = value > 0;
  const feeLow = hasResult
    ? roundToFive((projectType.baseLow + (value / 1000) * RATE_LOW) * city.factor)
    : 0;
  const feeHigh = hasResult
    ? roundToFive((projectType.baseHigh + (value / 1000) * RATE_HIGH) * city.factor)
    : 0;

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
          Permit Fee Calculator
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label htmlFor="pfc-city" className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
                City
              </label>
              <div className="relative">
                <select
                  id="pfc-city"
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
              <label htmlFor="pfc-type" className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
                Project Type
              </label>
              <div className="relative">
                <select
                  id="pfc-type"
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

          {/* Project value */}
          <div>
            <label htmlFor="pfc-value" className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
              Project Value ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F0E8]/40 text-sm font-mono">$</span>
              <input
                id="pfc-value"
                type="text"
                inputMode="numeric"
                value={projectValue}
                onChange={handleValueChange}
                placeholder={projectType.placeholder}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono pl-7 pr-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
              />
            </div>
            <p className="mt-2 text-[10px] text-[#F5F0E8]/25 font-mono">
              Total contract or construction value, including labor and materials.
            </p>
          </div>
        </div>

        {/* Result — updates instantly as inputs change */}
        {hasResult ? (
          <div className="mt-6 border border-[#FF6B00]/40 bg-[#FF6B00]/5 relative">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
            <div className="border-b border-[#FF6B00]/20 px-6 py-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono">
                Estimated Permit Fee — {city.name}
              </span>
            </div>
            <div className="px-6 py-5">
              <div className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase font-mono mb-1">
                {projectType.name} · ${value.toLocaleString("en-US")} project
              </div>
              <div className="font-heading text-4xl sm:text-5xl text-[#FF6B00] tracking-wide">
                ${feeLow.toLocaleString("en-US")} – ${feeHigh.toLocaleString("en-US")}
              </div>
              <p className="mt-4 text-xs text-[#F5F0E8]/50 font-mono leading-relaxed">
                Typically includes plan review, permit issuance, and required inspections.
                Trade permits, re-inspection fees, and contractor registration may be billed separately.
              </p>
              <p className="mt-3 text-[10px] text-[#F5F0E8]/30 font-mono leading-relaxed">
                Estimate only — actual fees vary by jurisdiction. Contact your local building
                department for exact fees.
              </p>
              <div className="mt-5 border-t border-[#FF6B00]/15 pt-4">
                <Link
                  href="/permits/landing"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
                >
                  Once you pull this permit, track its status automatically →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-[#FF6B00]/20 px-6 py-8 text-center">
            <p className="text-xs text-[#F5F0E8]/30 font-mono tracking-wide">
              Enter your project value to see an instant fee estimate.
            </p>
          </div>
        )}

        <p className="mt-4 text-[10px] text-[#F5F0E8]/25 font-mono leading-relaxed">
          Formula: base fee (${projectType.baseLow}–${projectType.baseHigh} for{" "}
          {projectType.name.toLowerCase()}) + ${RATE_LOW}–${RATE_HIGH} per $1,000 of project
          value, adjusted for {city.name} fee schedules.
        </p>
      </div>
    </div>
  );
}
