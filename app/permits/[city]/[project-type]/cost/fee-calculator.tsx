"use client";

import { useState } from "react";

export default function FeeCalculator({ baseFee }: { baseFee: number }) {
  const [sqft, setSqft] = useState("");

  const sqftNum = parseFloat(sqft) || 0;
  const ratePerSqft = 0.05;
  const estimated = sqftNum > 0 ? Math.round(baseFee + sqftNum * ratePerSqft) : null;

  return (
    <div className="border border-[#FF6B00]/20 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-px bg-[#FF6B00]" />
        <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase font-mono">
          Fee Estimator
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 items-end">
        <div>
          <label className="block text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase font-mono mb-2">
            Project Square Footage
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
            className="w-full bg-transparent border border-[#FF6B00]/30 text-[#F5F0E8] font-mono text-lg px-4 py-3 focus:outline-none focus:border-[#FF6B00] placeholder-[#F5F0E8]/20"
          />
          <p className="text-[10px] text-[#F5F0E8]/25 mt-2 font-mono">
            Base fee ${baseFee} + $0.05/sqft valuation estimate
          </p>
        </div>

        <div className="border border-[#FF6B00]/20 p-5 text-center">
          <div className="font-mono text-3xl font-bold text-[#FF6B00] mb-1">
            {estimated != null ? `$${estimated.toLocaleString()}` : `$${baseFee}`}
          </div>
          <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase font-mono">
            {estimated != null ? "Estimated Total" : "Base Fee (minimum)"}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-[#F5F0E8]/20 tracking-widest">
        * Estimate only. Actual fees depend on project valuation, zoning, and inspector review. Confirm with the city permit office before submitting.
      </p>
    </div>
  );
}
