"use client";

import { useState } from "react";

export function PermitDelayCalculator() {
  const [projectValue, setProjectValue] = useState("");
  const [daysDelayed, setDaysDelayed] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function formatCurrency(value: string) {
    const num = value.replace(/[^0-9]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-US");
  }

  function handleProjectValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setProjectValue(raw ? Number(raw).toLocaleString("en-US") : "");
    setResult(null);
  }

  function handleDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setDaysDelayed(raw);
    setResult(null);
  }

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const pv = parseFloat(projectValue.replace(/[^0-9]/g, ""));
    const days = parseFloat(daysDelayed);
    if (!isNaN(pv) && !isNaN(days) && pv > 0 && days > 0) {
      // Formula: (Project Value × 0.01 / 30) × Days Delayed
      setResult((pv * 0.01 / 30) * days);
    }
  }

  const hasValidInputs =
    projectValue.replace(/[^0-9]/g, "") !== "" &&
    daysDelayed !== "" &&
    Number(projectValue.replace(/[^0-9]/g, "")) > 0 &&
    Number(daysDelayed) > 0;

  return (
    <div className="border border-[#FF6B00]/30 bg-[#0A0A0A] relative">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 py-4 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
        <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono">
          Permit Delay Cost Calculator
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={calculate} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Project value */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
                Project Value ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F0E8]/40 text-sm font-mono">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={projectValue}
                  onChange={handleProjectValueChange}
                  placeholder="500,000"
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono pl-7 pr-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                />
              </div>
            </div>

            {/* Days delayed */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2 font-mono">
                Days Delayed
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={daysDelayed}
                onChange={handleDaysChange}
                placeholder="14"
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!hasValidInputs}
            className="w-full sm:w-auto bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            CALCULATE LOSS →
          </button>
        </form>

        {/* Result */}
        {result !== null && (
          <div className="mt-6 border border-[#FF6B00]/30 bg-[#FF6B00]/5">
            <div className="border-b border-[#FF6B00]/20 px-6 py-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono">
                Estimated Cost of Delay
              </span>
            </div>
            <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase font-mono mb-1">
                  Lost value over {daysDelayed} day{Number(daysDelayed) !== 1 ? "s" : ""}
                </div>
                <div className="font-heading text-5xl text-[#FF6B00]">
                  ${result.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="text-xs text-[#F5F0E8]/40 font-mono leading-relaxed max-w-xs">
                Based on 1% of project value per month.
                ClearedNo alerts you the moment your permit clears — cutting that number down.
              </div>
            </div>
          </div>
        )}

        <p className="mt-4 text-[10px] text-[#F5F0E8]/25 font-mono leading-relaxed">
          Formula: (Project Value × 1% ÷ 30) × Days Delayed. Represents carrying costs, financing, and idle crew time.
        </p>
      </div>
    </div>
  );
}
