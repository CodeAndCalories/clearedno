import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("plan", "founding");

    if (error) throw error;

    const remaining = Math.max(0, 20 - (count ?? 0));
    return NextResponse.json({ remaining });
  } catch {
    return NextResponse.json({ remaining: null }, { status: 500 });
  }
}
