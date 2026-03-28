"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeletePermitButton({ permitId }: { permitId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("permits").update({ is_active: false }).eq("id", permitId);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[10px] text-[#DC2626] font-mono tracking-widest uppercase hover:text-[#F5F0E8] transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "YES"}
        </button>
        <span className="text-[#F5F0E8]/20 text-[10px]">/</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] text-[#F5F0E8]/40 font-mono tracking-widest uppercase hover:text-[#F5F0E8] transition-colors"
        >
          NO
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Remove this permit from monitoring"
      className="text-[#F5F0E8]/20 hover:text-[#DC2626] transition-colors text-lg leading-none flex-shrink-0"
    >
      ×
    </button>
  );
}
