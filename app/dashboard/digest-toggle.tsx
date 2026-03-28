"use client";

import { useState, useTransition } from "react";

interface Props {
  digestOptedOut: boolean;
}

export function DigestToggle({ digestOptedOut: initial }: Props) {
  const [optedOut, setOptedOut] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = !optedOut;
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/user/digest-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digest_opted_out: next }),
      });
      if (res.ok) {
        setOptedOut(next);
      } else {
        setError("Failed to save preference.");
      }
    });
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-xs font-mono text-[#F5F0E8]/70">
          Weekly Digest Email
        </div>
        <div className="text-[10px] font-mono text-[#F5F0E8]/30 mt-0.5">
          {optedOut
            ? "Paused — you won't receive Monday digests"
            : "Sends every Monday at 8am with your permit summary"}
        </div>
        {error && (
          <div className="text-[10px] text-[#DC2626] mt-1">{error}</div>
        )}
      </div>
      <button
        onClick={toggle}
        disabled={isPending}
        className={`relative flex-shrink-0 w-10 h-5 border transition-colors font-mono text-[10px] tracking-widest ${
          optedOut
            ? "border-[#F5F0E8]/20 bg-transparent"
            : "border-[#FF6B00]/60 bg-[#FF6B00]/10"
        } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
        aria-label={optedOut ? "Enable weekly digest" : "Disable weekly digest"}
      >
        <span
          className={`absolute top-0.5 w-3.5 h-3.5 transition-all ${
            optedOut
              ? "left-0.5 bg-[#F5F0E8]/20"
              : "left-[22px] bg-[#FF6B00]"
          }`}
        />
      </button>
    </div>
  );
}
