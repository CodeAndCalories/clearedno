"use client";

// ReferralSection — client component shown on the dashboard.
//
// Displays:
//   1. The user's unique referral link (fetched from /api/referral/generate)
//   2. A "Copy to clipboard" button
//   3. The number of successful referrals (passed from server via props)
//
// The generate API is called lazily (on first render of this component)
// so we don't block the dashboard server render.

import { useState, useEffect } from "react";

interface ReferralSectionProps {
  referralCount: number;  // Number of completed referrals (from server)
  existingCode?: string;  // Pre-fetched code if profile already has one
}

export function ReferralSection({ referralCount, existingCode }: ReferralSectionProps) {
  const [referralUrl, setReferralUrl] = useState<string | null>(
    existingCode ? buildUrl(existingCode) : null
  );
  const [copied, setCopied]   = useState(false);
  const [loading, setLoading] = useState(!existingCode);
  const [error, setError]     = useState<string | null>(null);

  function buildUrl(code: string): string {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.clearedno.com";
    return `${base}/signup?ref=${code}`;
  }

  // Fetch or generate the referral code on mount (only if not pre-supplied)
  useEffect(() => {
    if (existingCode) return;

    async function fetchCode() {
      try {
        const res = await fetch("/api/referral/generate", { method: "POST" });
        if (!res.ok) throw new Error("Failed to generate referral code");
        const data = await res.json();
        setReferralUrl(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load referral link");
      } finally {
        setLoading(false);
      }
    }

    fetchCode();
  }, [existingCode]);

  async function handleCopy() {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — select the text manually
    }
  }

  return (
    <div className="mt-10 border border-[#FF6B00]/20 bg-[#FF6B00]/5">
      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              Referral Program
            </span>
          </div>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8]">
            EARN FREE MONTHS
          </h2>
        </div>
        {/* Referral counter */}
        {referralCount > 0 && (
          <div className="text-right">
            <div className="font-heading text-3xl text-[#FF6B00]">{referralCount}</div>
            <div className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase">
              {referralCount === 1 ? "referral" : "referrals"}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-5">
        <p className="text-sm text-[#F5F0E8]/60 mb-4 leading-relaxed">
          Share this link. Get{" "}
          <span className="text-[#FF6B00] font-medium">1 free month</span> for
          every contractor who signs up and subscribes.
        </p>

        {/* Link + copy button */}
        {loading ? (
          <div className="text-xs text-[#F5F0E8]/30 font-mono tracking-widest">
            Generating your link...
          </div>
        ) : error ? (
          <div className="text-xs text-[#DC2626] font-mono">{error}</div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* URL display */}
            <div className="flex-1 bg-[#0A0A0A] border border-[#FF6B00]/20 px-4 py-3 font-mono text-xs text-[#F5F0E8]/60 truncate">
              {referralUrl}
            </div>
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 transition-colors whitespace-nowrap ${
                copied
                  ? "bg-[#16A34A] text-[#F5F0E8]"
                  : "bg-[#FF6B00] text-[#0A0A0A] hover:bg-[#F5F0E8]"
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}

        {/* How it works micro-copy */}
        <p className="mt-3 text-[10px] text-[#F5F0E8]/25 tracking-widest uppercase">
          Free month applied automatically when your referral starts paying.
        </p>
      </div>
    </div>
  );
}
