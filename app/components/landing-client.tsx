"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Attaches IntersectionObserver to all .reveal elements on the page.
// Must be rendered once inside the page body.
export function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

// Sticky CTA bar — mobile only, appears after hero scrolls out of view.
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#FF6B00]/30 p-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <Link
          href="/signup"
          className="cta-glow block w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase py-4 text-center"
        >
          START FREE TRIAL →
        </Link>
      </div>
    </div>
  );
}
