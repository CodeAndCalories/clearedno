"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// US states for the dropdown
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export default function AddPermitPage() {
  const router = useRouter();

  const [permitNumber, setPermitNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("TX");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("permits").insert({
      user_id: user.id,
      permit_number: permitNumber.trim().toUpperCase(),
      address: address.trim(),
      city: city.trim(),
      state: state,
      status: "PENDING",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
        <span className="ml-4 text-[#F5F0E8]/20">/</span>
        <Link href="/dashboard" className="ml-4 text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors tracking-widest uppercase">
          Dashboard
        </Link>
        <span className="ml-4 text-[#F5F0E8]/20">/</span>
        <span className="ml-4 text-xs text-[#FF6B00] tracking-widest uppercase">Add Permit</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">New Permit</span>
          </div>
          <h1 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">ADD A PERMIT</h1>
          <p className="mt-3 text-sm text-[#F5F0E8]/40 leading-relaxed">
            We&apos;ll start monitoring this permit within the hour. You&apos;ll get an email the
            moment the status changes.
          </p>
        </div>

        <div className="relative border border-[#FF6B00]/30 p-8">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Permit number */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Permit Number <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                required
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20 uppercase"
                placeholder="2024-BC-04812"
              />
              <p className="mt-1.5 text-[10px] text-[#F5F0E8]/30">
                Enter the permit number exactly as it appears on your permit documents.
              </p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                Property Address <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                placeholder="1847 Commerce St"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  City <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                  placeholder="Austin"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  State <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer"
                >
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[10px] text-[#F5F0E8]/25 -mt-2">
              Don&apos;t see your city?{" "}
              <Link href="/suggest-city" className="text-[#FF6B00]/60 hover:text-[#FF6B00] transition-colors">
                Request it →
              </Link>
            </p>

            {error && (
              <div className="border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
                <p className="text-xs text-[#DC2626] font-mono">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Permit..." : "Start Monitoring →"}
              </button>
              <Link
                href="/dashboard"
                className="text-center sm:text-left border border-[#FF6B00]/30 text-[#F5F0E8]/60 font-mono text-sm tracking-widest uppercase px-6 py-4 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info box */}
        <div className="mt-6 border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-5 py-4">
          <div className="text-[10px] tracking-widest text-[#FF6B00] uppercase font-medium mb-2">
            How monitoring works
          </div>
          <ul className="space-y-1.5">
            {[
              "We check your permit every 2–4 hours using the city's official portal",
              "The moment status changes, you get an instant email alert",
              "Full history of every status change is logged automatically",
            ].map((item) => (
              <li key={item} className="text-xs text-[#F5F0E8]/50 flex items-start gap-2">
                <span className="text-[#FF6B00] mt-0.5">■</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
