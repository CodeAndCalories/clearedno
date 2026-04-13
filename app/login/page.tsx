"use client";

// useSearchParams() must be inside a Suspense boundary in Next.js 14.
// Split into LoginForm (uses the hook) + LoginPage (provides the boundary).
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Special case: user clicked "Get Access" on the leads landing page
    // before logging in. Complete the Stripe checkout now.
    if (next === "leads-checkout") {
      const res = await fetch("/api/leads-checkout", { method: "POST" });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        router.push("/leads/landing");
        router.refresh();
      }
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="relative border border-[#FF6B00]/30 p-8">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

      <div className="mb-8">
        <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-1">LOG IN</h1>
        <p className="text-xs text-[#F5F0E8]/40 tracking-widest">
          Access your permit dashboard
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

        <div>
          <label className="block text-[10px] tracking-[0.2em] text-[#FF6B00]/80 uppercase mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#FF6B00]/30 text-[#F5F0E8] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#F5F0E8]/20"
            placeholder="••••••••"
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
          {loading ? "Logging In..." : "Log In →"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#FF6B00]/20 space-y-3 text-center">
        <p className="text-xs text-[#F5F0E8]/40">
          No account?{" "}
          <Link href="/signup" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">
            Start your free trial
          </Link>
        </p>
        <p className="text-xs text-[#F5F0E8]/40">
          <Link href="/forgot-password" className="text-[#F5F0E8]/50 hover:text-[#FF6B00] transition-colors">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
      </div>

      {/* Form — Suspense required by Next.js 14 when useSearchParams is used */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="border border-[#FF6B00]/30 p-8 text-center">
              <span className="text-xs text-[#F5F0E8]/30 tracking-widest uppercase font-mono">
                Loading...
              </span>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
