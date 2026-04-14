import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ── GET — return current user's alerts ───────────────────────────────────────

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("lead_alerts")
    .select("id, county, state, created_at")
    .eq("user_id", user.id)
    .order("state", { ascending: true })
    .order("county", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ alerts: data ?? [] });
}

// ── POST — add a new alert ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { county?: string; state?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const county = (body.county ?? "").trim();
  const state  = (body.state  ?? "").trim().toUpperCase();

  if (!county || !state) {
    return NextResponse.json({ error: "county and state are required" }, { status: 400 });
  }

  const VALID_STATES = ["OH", "IN", "MI", "KY", "IL", "PA"];
  if (!VALID_STATES.includes(state)) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("lead_alerts")
    .insert({ user_id: user.id, county, state })
    .select("id, county, state, created_at")
    .single();

  if (error) {
    // Unique constraint — already watching this county
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already watching this county" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ alert: data }, { status: 201 });
}

// ── DELETE — remove an alert by id ───────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("lead_alerts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // ensures users can only delete their own alerts

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
