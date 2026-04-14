"use client";

import { useState, useEffect } from "react";
import MarketingNav from "@/app/components/MarketingNav";

const STATES = ["OH", "IN", "MI", "KY", "IL", "PA"] as const;

interface Alert {
  id: string;
  county: string;
  state: string;
  created_at: string;
}

export default function LeadAlertsPage() {
  const [alerts,   setAlerts]   = useState<Alert[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [county,   setCounty]   = useState("");
  const [state,    setState]    = useState<string>(STATES[0]);
  const [adding,   setAdding]   = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState<string | null>(null);

  async function loadAlerts() {
    setLoading(true);
    try {
      const res  = await fetch("/api/lead-alerts");
      const data = await res.json();
      if (res.ok) setAlerts(data.alerts ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAlerts(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!county.trim()) { setError("Please enter a county name."); return; }
    setAdding(true);
    try {
      const res  = await fetch("/api/lead-alerts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ county: county.trim(), state }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add alert.");
      } else {
        setSuccess(`Now watching ${county.trim()}, ${state}`);
        setCounty("");
        loadAlerts();
      }
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string, label: string) {
    setRemoving(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/lead-alerts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess(`Removed alert for ${label}`);
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to remove alert.");
      }
    } finally {
      setRemoving(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono flex flex-col">
      <MarketingNav />

      <section className="flex-1 max-w-2xl mx-auto w-full px-6 pt-28 pb-20">

        {/* Header */}
        <p className="text-[10px] tracking-[0.4em] text-[#FF6B00] uppercase mb-4">
          ClearedNo / Leads / Alerts
        </p>
        <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8] uppercase mb-3">
          County Alerts
        </h1>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-12">
          Get an email when a storm hits your watched counties.
          We check for new hail and wind events every Monday.
        </p>

        {/* Feedback messages */}
        {error && (
          <div className="border border-[#DC2626]/40 bg-[#DC2626]/5 px-4 py-3 mb-6">
            <p className="text-xs text-[#DC2626]">{error}</p>
          </div>
        )}
        {success && (
          <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 px-4 py-3 mb-6">
            <p className="text-xs text-[#FF6B00]">{success}</p>
          </div>
        )}

        {/* Add alert form */}
        <div className="border border-[#FF6B00]/20 p-6 mb-10">
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-5">
            Watch a new county
          </p>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-[9px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none"
              >
                {STATES.map((s) => (
                  <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-[2]">
              <label className="block text-[9px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase mb-1">
                County
              </label>
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Franklin"
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-xs font-mono px-3 py-2 placeholder:text-[#F5F0E8]/20 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-5 py-2 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {adding ? "Saving…" : "Watch this county"}
            </button>
          </form>
        </div>

        {/* Alert list */}
        <div>
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-4">
            Watched counties ({alerts.length})
          </p>

          {loading ? (
            <p className="text-sm text-[#F5F0E8]/30">Loading…</p>
          ) : alerts.length === 0 ? (
            <div className="border border-[#FF6B00]/10 px-6 py-10 text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#F5F0E8]/20 uppercase">
                No counties watched yet
              </p>
            </div>
          ) : (
            <div className="border border-[#FF6B00]/20 divide-y divide-[#FF6B00]/10">
              {alerts.map((alert) => {
                const label = `${alert.county}, ${alert.state}`;
                return (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#F5F0E8]/80">{label}</p>
                        <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/25 uppercase mt-0.5">
                          Added {new Date(alert.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(alert.id, label)}
                      disabled={removing === alert.id}
                      className="text-[9px] tracking-widest uppercase font-mono text-[#F5F0E8]/30 border border-[#F5F0E8]/10 px-3 py-1.5 hover:border-[#DC2626]/40 hover:text-[#DC2626]/70 transition-colors disabled:opacity-30"
                    >
                      {removing === alert.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/15 uppercase mt-12">
          Alerts are sent every Monday with the weekly digest
        </p>
      </section>

      <footer className="border-t border-[#FF6B00]/20 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
          © {new Date().getFullYear()} ClearedNo
        </p>
        <div className="flex gap-6">
          {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Refunds", "/refunds"]].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase hover:text-[#FF6B00]/60 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
