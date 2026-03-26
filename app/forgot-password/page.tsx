"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
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

            {submitted ? (
              <div className="text-center space-y-4">
                <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8]">CHECK EMAIL</h1>
                <p className="text-sm text-[#F5F0E8]/60 font-mono leading-relaxed">
                  We sent a password reset link to{" "}
                  <span className="text-[#FF6B00]">{email}</span>.
                  <br /><br />
                  Check your inbox — the link expires in 1 hour.
                </p>
                <div className="pt-4 border-t border-[#FF6B00]/20">
                  <Link
                    href="/login"
                    className="text-xs text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors"
                  >
                    ← Back to log in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-1">
                    RESET PASSWORD
                  </h1>
                  <p className="text-xs text-[#F5F0E8]/40 tracking-widest">
                    Enter your email to receive a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
                      placeholder="you@company.com"
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
                    {loading ? "Sending..." : "Send Reset Link →"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#FF6B00]/20 text-center">
                  <Link href="/login" className="text-xs text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors">
                    ← Back to log in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
