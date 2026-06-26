"use client";

// Email-capture box for permit detail pages. Posts to /api/permit-alert and
// stores a lead in permit_alerts. Client component so the host page can stay
// statically generated — this only runs on user interaction.

import { useState } from "react";

// Copy kept as constants so apostrophes render via {expressions}, avoiding
// eslint's react/no-unescaped-entities on JSX text nodes.
const HEADLINE = "Get alerted when this permit status changes";
const SUBTEXT =
  "Drop your email and we'll notify you the moment this permit clears. Free.";
const SUCCESS = "You're on the list. We'll email you when status changes.";

type Status = "idle" | "loading" | "success" | "error";

export default function PermitAlertSignup({
  city,
  projectType,
}: {
  city?: string;
  projectType?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/permit-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), city, projectType }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="py-16 px-6 border-t border-[#FF6B00]/10">
      <div className="max-w-2xl mx-auto">
        <div className="relative border border-[#FF6B00]/30 bg-[#FF6B00]/[0.03] p-8 sm:p-10 text-center">
          {/* corner accents */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          {status === "success" ? (
            <div className="py-2">
              <div className="text-[#FF6B00] text-2xl mb-3">✓</div>
              <p className="font-heading text-2xl tracking-widest text-[#F5F0E8] uppercase">
                {SUCCESS}
              </p>
            </div>
          ) : (
            <>
              <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
                Free Alert
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl tracking-widest text-[#F5F0E8] uppercase mb-3">
                {HEADLINE}
              </h2>
              <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-md mx-auto mb-7">
                {SUBTEXT}
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="Email address"
                  disabled={status === "loading"}
                  className="flex-1 bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 placeholder:text-[#F5F0E8]/25 focus:outline-none focus:border-[#FF6B00] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B00] whitespace-nowrap"
                >
                  {status === "loading" ? "Sending…" : "Notify Me"}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-3 text-xs text-[#FF6B00] tracking-wide" role="alert">
                  {error}
                </p>
              )}

              <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest uppercase">
                No spam · Unsubscribe anytime
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
