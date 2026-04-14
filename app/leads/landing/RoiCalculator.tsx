"use client";

import { useState } from "react";

export default function RoiCalculator() {
  const [jobs, setJobs]       = useState(3);
  const [revenue, setRevenue] = useState(8000);

  const monthly = jobs * revenue;
  const annual  = monthly * 12;
  const cost    = 300;
  const roi     = Math.round(((monthly - cost) / cost) * 100);

  return (
    <div className="w-full max-w-2xl mb-16 text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-[#FF6B00]" />
        <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">ROI Calculator</span>
      </div>

      <div className="border border-[#FF6B00]/20 p-8">
        <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] uppercase mb-8">
          Calculate your ROI
        </h2>

        {/* ── Sliders ──────────────────────────────────────────────── */}
        <div className="space-y-8 mb-10">
          {/* Jobs slider */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[9px] tracking-[0.25em] text-[#F5F0E8]/40 uppercase">
                Average jobs closed per month
              </label>
              <span className="font-heading text-xl tracking-widest text-[#FF6B00]">{jobs}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={jobs}
              onChange={(e) => setJobs(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-[#FF6B00]/20 rounded-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:bg-[#FF6B00]
                         [&::-webkit-slider-thumb]:rounded-none
                         [&::-moz-range-thumb]:w-4
                         [&::-moz-range-thumb]:h-4
                         [&::-moz-range-thumb]:bg-[#FF6B00]
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:rounded-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[#F5F0E8]/20">1</span>
              <span className="text-[9px] text-[#F5F0E8]/20">20</span>
            </div>
          </div>

          {/* Revenue slider */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[9px] tracking-[0.25em] text-[#F5F0E8]/40 uppercase">
                Average revenue per job
              </label>
              <span className="font-heading text-xl tracking-widest text-[#FF6B00]">
                ${revenue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={20000}
              step={1000}
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-[#FF6B00]/20 rounded-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:bg-[#FF6B00]
                         [&::-webkit-slider-thumb]:rounded-none
                         [&::-moz-range-thumb]:w-4
                         [&::-moz-range-thumb]:h-4
                         [&::-moz-range-thumb]:bg-[#FF6B00]
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:rounded-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[#F5F0E8]/20">$2,000</span>
              <span className="text-[9px] text-[#F5F0E8]/20">$20,000</span>
            </div>
          </div>
        </div>

        {/* ── Live output ──────────────────────────────────────────── */}
        <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/[0.04] p-6 space-y-4">
          {[
            { label: "Monthly revenue from leads", value: `$${monthly.toLocaleString()}`, large: false },
            { label: "Annual revenue",             value: `$${annual.toLocaleString()}`,  large: false },
            { label: "Cost of ClearedNo",          value: "$300/month",                   large: false },
            { label: "ROI",                        value: `${roi.toLocaleString()}%`,      large: true  },
          ].map(({ label, value, large }, i) => (
            <div
              key={label}
              className={`flex justify-between items-center ${
                i === 3 ? "pt-4 border-t border-[#FF6B00]/20" : ""
              }`}
            >
              <span className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase">{label}</span>
              <span
                className={`font-heading tracking-widest text-[#FF6B00] ${
                  large ? "text-3xl" : "text-xl"
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.15em] text-[#F5F0E8]/25 mt-4">
          Based on contractors closing 3–5 jobs/month from our list
        </p>
      </div>
    </div>
  );
}
