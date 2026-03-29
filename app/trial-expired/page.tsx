import Link from "next/link";

export default function TrialExpiredPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="border border-[#FF6B00]/20 p-10 sm:p-14 relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

            <div className="font-heading text-5xl sm:text-6xl text-[#FF6B00]/20 mb-6 tracking-widest">
              14
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Trial Ended</span>
              <div className="w-8 h-px bg-[#FF6B00]" />
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-4">
              YOUR 14-DAY TRIAL HAS ENDED
            </h1>

            <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-8">
              Upgrade to continue monitoring your permits. The moment a status changes,
              you&apos;ll get an instant email alert — so you&apos;re never waiting blindly.
            </p>

            <div className="border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-5 py-4 mb-8 text-left">
              <div className="text-[10px] tracking-widest text-[#FF6B00] uppercase font-medium mb-3">
                What you get
              </div>
              <ul className="space-y-2">
                {[
                  "Permit status checked every 2–4 hours",
                  "Instant email alerts on every status change",
                  "Full history log for every permit",
                  "Cancel anytime — no contracts",
                ].map((item) => (
                  <li key={item} className="text-xs text-[#F5F0E8]/60 flex items-start gap-2">
                    <span className="text-[#FF6B00] mt-0.5">■</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <form action="/api/stripe/checkout" method="post">
              <button
                type="submit"
                className="w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors"
              >
                Upgrade to Continue — $79/mo →
              </button>
            </form>

            <p className="mt-4 text-[10px] text-[#F5F0E8]/20 tracking-widest">
              Your permit data is saved and ready to resume.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#F5F0E8]/60 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
