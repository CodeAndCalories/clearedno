"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StickyPermitCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Respect previous session dismiss — don't flash the bar on dismissed users
    if (localStorage.getItem("permit-cta-dismissed") === "1") {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0 && scrolled / total >= 0.3) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismiss = () => {
    localStorage.setItem("permit-cta-dismissed", "1");
    setDismissed(true);
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#FF6B00]/30 bg-[#0A0A0A] px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Full text on sm+ */}
        <p className="hidden sm:block text-sm text-[#F5F0E8]/80 leading-snug">
          Waiting on this permit?{" "}
          <span className="text-[#F5F0E8]">
            Get an instant alert when it&apos;s approved.
          </span>
        </p>
        {/* Condensed text on mobile */}
        <p className="sm:hidden text-xs text-[#F5F0E8]/80 leading-snug">
          Get alerted the moment your permit clears.
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/signup"
            className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-4 py-2 sm:px-6 sm:py-3 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
          >
            Start Free 30-Day Trial →
          </Link>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-[#F5F0E8]/30 hover:text-[#F5F0E8]/60 transition-colors text-xl leading-none font-light"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
