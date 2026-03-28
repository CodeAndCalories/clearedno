"use client";

import { useState } from "react";

interface Props {
  initialCode: string | null;
  referralCount: number;
}

export default function ReferralSection({ initialCode, referralCount }: Props) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const referralUrl = code ? `https://www.clearedno.com/signup?ref=${code}` : null;

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/referral/generate", { method: "POST" });
      const data = await res.json();
      if (data.code) setCode(data.code);
    } finally {
      setGenerating(false);
    }
  }

  async function copyLink() {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-10 border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-6 h-px bg-[#FF6B00]" />
        <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Referral Program</span>
      </div>
      <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-1">
        GET 1 FREE MONTH
      </h2>
      <p className="text-xs text-[#F5F0E8]/50 mb-5">
        For every contractor you refer who subscribes.{" "}
        {referralCount > 0 && (
          <span className="text-[#FF6B00] font-medium">
            You&apos;ve referred {referralCount} {referralCount === 1 ? "person" : "people"} so far.
          </span>
        )}
      </p>

      {code ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-[#0A0A0A] border border-[#FF6B00]/30 px-4 py-3 font-mono text-sm text-[#F5F0E8]/70 truncate">
            {referralUrl}
          </div>
          <button
            onClick={copyLink}
            className="flex-shrink-0 bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
          >
            {copied ? "COPIED ✓" : "COPY LINK"}
          </button>
        </div>
      ) : (
        <button
          onClick={generate}
          disabled={generating}
          className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50"
        >
          {generating ? "GENERATING..." : "GET MY REFERRAL LINK →"}
        </button>
      )}
    </div>
  );
}
