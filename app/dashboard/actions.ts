"use server";

// Server Actions for the dashboard.
// These run on the server and revalidate the dashboard after mutations.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Soft-deletes a permit by setting is_active = false.
 * Revalidates the dashboard so the card disappears without a full navigation.
 */
export async function deletePermit(permitId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS enforces ownership — only the permit owner can update their row.
  const { error } = await supabase
    .from("permits")
    .update({ is_active: false })
    .eq("id", permitId)
    .eq("user_id", user.id); // Belt-and-suspenders: ensure user owns this permit

  if (error) {
    // Log and surface — the client useTransition will keep the card visible
    console.error("[deletePermit] Supabase error:", error.message);
    throw new Error(error.message);
  }

  // Revalidate the dashboard route so Next.js re-fetches permit data
  revalidatePath("/dashboard");
}
