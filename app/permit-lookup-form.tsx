"use client";

// Free permit lookup tool for the homepage. Routes to the existing
// /permits/[city]/[project-type] pages — no new data needed.
// Client component because it needs select state + client-side routing;
// kept separate from page.tsx so the homepage stays a server component
// and can still export SEO metadata.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cities } from "@/lib/cities";

// Cities we have permit *guide* data for (slugs match /permits/[city]). This is
// deliberately the full list, not LIVE_CHECKER_CITIES — the form routes to fee
// and timeline guides, which exist everywhere, and makes no tracking promise.
const CITIES = cities.map((c) => ({
  slug: `${c.slug}-${c.stateSlug}`,
  name: `${c.name}, ${c.stateAbbr}`,
}));

// Project types (slugs match /permits/[city]/[project-type]).
const PROJECT_TYPES = [
  { slug: "roof-permit", name: "Roof Permit" },
  { slug: "deck-permit", name: "Deck Permit" },
  { slug: "fence-permit", name: "Fence Permit" },
  { slug: "electrical-permit", name: "Electrical Permit" },
  { slug: "plumbing-permit", name: "Plumbing Permit" },
  { slug: "new-construction", name: "New Construction" },
  { slug: "addition-permit", name: "Addition Permit" },
];

const selectClass =
  "w-full appearance-none bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 pr-10 tracking-wider focus:outline-none focus:border-[#FF6B00] transition-colors cursor-pointer";

const fieldLabel =
  "block text-[9px] tracking-[0.3em] text-[#FF6B00]/70 uppercase mb-2";

export default function PermitLookupForm() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const ready = city !== "" && type !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    router.push(`/permits/${city}/${type}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border border-[#FF6B00]/30 bg-[#0A0A0A] p-8 sm:p-10 text-left w-full max-w-2xl mx-auto"
    >
      {/* corner accents */}
      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

      <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-6">
        Free Fee &amp; Timeline Lookup
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* City */}
        <div>
          <label htmlFor="lookup-city" className={fieldLabel}>
            City
          </label>
          <div className="relative">
            <select
              id="lookup-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                Select a city…
              </option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#FF6B00] text-xs">
              ▾
            </span>
          </div>
        </div>

        {/* Project type */}
        <div>
          <label htmlFor="lookup-type" className={fieldLabel}>
            Project Type
          </label>
          <div className="relative">
            <select
              id="lookup-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                Select a project type…
              </option>
              {PROJECT_TYPES.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#FF6B00] text-xs">
              ▾
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!ready}
        className="mt-6 w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-6 py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B00]"
      >
        Look Up Permit Info →
      </button>

      {/* "permit data for" matters: this count is lookup coverage, and it sits
          directly above the tracking CTA, where a bare "11 cities" reads as a
          promise that we track all 11. Tracking is the smaller liveCheckerCities
          set, named in that CTA. */}
      <p className="mt-4 text-[10px] text-[#F5F0E8]/30 tracking-wider text-center">
        No signup required · permit data for {CITIES.length} cities ·{" "}
        {PROJECT_TYPES.length} permit types
      </p>
    </form>
  );
}
