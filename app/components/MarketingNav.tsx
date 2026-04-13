"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Permit Tracker", href: "/permits/landing" },
  { label: "Roofing Leads",  href: "/leads/landing"   },
] as const;

export default function MarketingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#FF6B00]/20 bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Left — logo */}
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
          <Image
            src="/clearedno-icon.png"
            alt="ClearedNo"
            width={26}
            height={26}
            className="rounded-sm"
            priority
          />
          <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
            CLEARED<span className="text-[#F5F0E8]">NO</span>
          </span>
        </Link>

        {/* Center — product links (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-[10px] tracking-[0.2em] uppercase font-mono transition-colors ${
                  isActive
                    ? "text-[#FF6B00]"
                    : "text-[#F5F0E8]/45 hover:text-[#FF6B00]"
                }`}
              >
                {isActive && (
                  <span className="inline-block w-1 h-1 rounded-full bg-[#FF6B00] mr-2 mb-px" />
                )}
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right — sign in */}
        <Link
          href="/login"
          className="text-[10px] tracking-[0.25em] text-[#F5F0E8]/45 uppercase hover:text-[#FF6B00] transition-colors"
        >
          Sign In
        </Link>

      </div>
    </nav>
  );
}
