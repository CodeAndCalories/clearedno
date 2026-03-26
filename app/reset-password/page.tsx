"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="relative border border-[#FF6B00]/30 p-8">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

            <div className="mb-8">
              <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-1">
                NEW PASSWORD
              </h1>
              <p className="text-xs text-[#F5F0E8]/40 tracking-widest">
                Choose a strong password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                  placeholder="Repeat password"
                />
              </div>

              {error && (
                <div className="border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3">
                  <p className="text-xs text-[#DC2626] font-mono">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Set New Password →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
