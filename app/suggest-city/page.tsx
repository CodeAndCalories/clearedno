"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const SUPPORTED_CITIES = ["austin", "dallas", "houston", "san antonio"];

type CityRequest = { id: string; city: string; state: string; votes: number };

export default function SuggestCityPage() {
  const [city,    setCity]    = useState("");
  const [state,   setState]   = useState("TX");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const [topCities, setTopCities]     = useState<CityRequest[]>([]);
  const [votingId,  setVotingId]      = useState<string | null>(null);
  const [votedIds,  setVotedIds]      = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/suggest-city")
      .then((r) => r.json())
      .then((d) => setTopCities(d.cities ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/suggest-city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city.trim(), state, email: email.trim() || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
      return;
    }

    setSuccess(true);
    // Refresh top cities
    fetch("/api/suggest-city")
      .then((r) => r.json())
      .then((d) => setTopCities(d.cities ?? []))
      .catch(() => {});
  }

  async function handleUpvote(id: string, cityName: string, cityState: string) {
    if (votedIds.has(id) || votingId === id) return;
    setVotingId(id);

    await fetch("/api/suggest-city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: cityName, state: cityState }),
    });

    setVotedIds((prev) => new Set(prev).add(id));
    setVotingId(null);

    // Refresh counts
    fetch("/api/suggest-city")
      .then((r) => r.json())
      .then((d) => setTopCities(d.cities ?? []))
      .catch(() => {});
  }

  const isSupported = (cityName: string) =>
    SUPPORTED_CITIES.includes(cityName.toLowerCase().trim());

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="font-heading text-6xl text-[#FF6B00] mb-6">GOT IT.</div>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed mb-8">
            We&apos;ll add <span className="text-[#F5F0E8]">{city}, {state}</span> to
            the queue. You&apos;ll get an email when it&apos;s live —{" "}
            {email ? "we'll reach out to " + email : "check back soon"}.
          </p>
          <Link
            href="/"
            className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase hover:text-[#F5F0E8] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">City Request</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] leading-none mb-4">
            DON&apos;T SEE<br />
            <span className="text-[#FF6B00]">YOUR CITY?</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-sm">
            We add cities weekly based on demand. Request yours and
            we&apos;ll notify you the moment it goes live.
          </p>
        </div>

        {/* Currently supported */}
        <div className="mb-8 border border-[#16A34A]/30 bg-[#16A34A]/5 px-5 py-4">
          <div className="text-[10px] tracking-[0.2em] text-[#16A34A] uppercase mb-3">✓ Already Monitoring</div>
          <div className="flex flex-wrap gap-2">
            {["Austin, TX", "Dallas, TX", "Houston, TX", "San Antonio, TX"].map((c) => (
              <Link
                key={c}
                href={`/${c.split(",")[0].toLowerCase().replace(" ", "-")}`}
                className="text-xs font-mono text-[#16A34A] border border-[#16A34A]/40 px-3 py-1 hover:bg-[#16A34A]/10 transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Top requested cities */}
        {topCities.length > 0 && (
          <div className="mb-10">
            <div className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-4">Top Requested Cities</div>
            <div className="border border-[#FF6B00]/20 divide-y divide-[#FF6B00]/10">
              {topCities.map((c, i) => {
                const supported = isSupported(c.city);
                return (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#F5F0E8]/25 w-5">{i + 1}.</span>
                      <div>
                        <span className="text-sm text-[#F5F0E8]/80 font-mono">{c.city}, {c.state}</span>
                        {supported && (
                          <span className="ml-2 text-[9px] text-[#16A34A] font-mono">✓ Live</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#FF6B00]">{c.votes} {c.votes === 1 ? "request" : "requests"}</span>
                      {!supported && (
                        <button
                          onClick={() => handleUpvote(c.id, c.city, c.state)}
                          disabled={votedIds.has(c.id) || votingId === c.id}
                          className="text-[10px] tracking-widest font-mono uppercase px-3 py-1 border transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-[#FF6B00]/40 text-[#FF6B00] hover:bg-[#FF6B00]/10"
                        >
                          {votedIds.has(c.id) ? "✓ Voted" : votingId === c.id ? "..." : "↑ Vote"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="relative border border-[#FF6B00]/30 p-8">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <div className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-6">Request a New City</div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* City + State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  City <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Phoenix"
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                />
                {isSupported(city) && city.trim() && (
                  <p className="mt-1.5 text-[10px] text-[#16A34A] font-mono">
                    ✓ Already monitoring {city}!{" "}
                    <Link href="/signup" className="underline hover:no-underline">Sign up to get started →</Link>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  State <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer"
                >
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email (optional) */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Your Email <span className="text-[#F5F0E8]/20">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
              />
              <p className="mt-1.5 text-[10px] text-[#F5F0E8]/25">
                We&apos;ll notify you when your city goes live. No spam.
              </p>
            </div>

            {error && (
              <div className="border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
                <p className="text-xs text-[#DC2626] font-mono">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "REQUEST MY CITY →"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-[#F5F0E8]/20 tracking-widest">
          Cities are added in order of demand. Most requests go live within 1–2 weeks.
        </p>
      </main>
    </div>
  );
}
