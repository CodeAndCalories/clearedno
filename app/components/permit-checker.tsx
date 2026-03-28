"use client";

import { useState } from "react";
import Link from "next/link";

const CITIES = [
  { label: "Austin, TX",      value: "austin" },
  { label: "Dallas, TX",      value: "dallas" },
  { label: "Houston, TX",     value: "houston" },
  { label: "San Antonio, TX", value: "san-antonio" },
];

type Result = {
  status: string;
  address?: string;
  lastChecked: string;
  city: string;
  error?: string;
};

interface PermitCheckerProps {
  defaultCity?: string;
}

export function PermitChecker({ defaultCity }: PermitCheckerProps) {
  const [city, setCity]           = useState(defaultCity ?? "austin");
  const [permitNumber, setPermit] = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<Result | null>(null);
  const [error, setError]         = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/check-permit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ city, permitNumber: permitNumber.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === "CLEARED")      return "#16A34A";
    if (s === "APPROVED")     return "#FF6B00";
    if (s === "UNDER_REVIEW") return "#EAB308";
    if (s === "REJECTED")     return "#DC2626";
    if (s === "EXPIRED")      return "#6B7280";
    return "#6B7280"; // PENDING, UNKNOWN
  };

  return (
    <div className="border border-[#FF6B00]/30 bg-[#0A0A0A] relative">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* City selector */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Permit number */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Permit Number
              </label>
              <input
                type="text"
                required
                value={permitNumber}
                onChange={(e) => setPermit(e.target.value)}
                placeholder="e.g. 2024-BC-04812 or 2026-033822 PP"
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !permitNumber.trim()}
            className="w-full sm:w-auto bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "CHECKING..." : "CHECK STATUS →"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
            <p className="text-xs text-[#DC2626] font-mono">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 border border-[#FF6B00]/20 bg-[#FF6B00]/5">
            <div className="border-b border-[#FF6B00]/20 px-6 py-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono">
                Result — {result.city}
              </span>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase mb-1">Status</div>
                  <div
                    className="font-heading text-4xl tracking-widest"
                    style={{ color: statusColor(result.status) }}
                  >
                    {result.status}
                  </div>
                </div>
                {result.address && (
                  <div className="text-right">
                    <div className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase mb-1">Address</div>
                    <div className="text-sm text-[#F5F0E8]/80 font-mono">{result.address}</div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-[#F5F0E8]/30 font-mono">
                Checked: {result.lastChecked}
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="border-t border-[#FF6B00]/20 px-6 py-4 bg-[#FF6B00]/5">
              <p className="text-xs text-[#F5F0E8]/60 mb-2">
                Want us to monitor this permit 24/7 and alert you the moment it changes?
              </p>
              <Link
                href="/signup"
                className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase hover:text-[#F5F0E8] transition-colors font-mono font-bold"
              >
                Sign up free — monitor this permit 24/7 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
