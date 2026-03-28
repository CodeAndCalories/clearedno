import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAdminAlert } from "@/lib/email";

// GET /api/suggest-city — returns top 10 most-requested cities
export async function GET(): Promise<NextResponse> {
  const { data, error } = await supabaseAdmin
    .from("city_suggestions")
    .select("id, city, state, votes")
    .order("votes", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cities: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const city  = (body.city  as string | undefined)?.trim();
  const state = (body.state as string | undefined)?.trim().toUpperCase();
  const email = (body.email as string | undefined)?.trim() || null;

  if (!city || !state) {
    return NextResponse.json({ error: "City and state are required" }, { status: 400 });
  }

  // Upsert: if city+state already exists, increment votes; otherwise insert
  const { data, error } = await supabaseAdmin
    .from("city_suggestions")
    .upsert(
      { city, state, email, votes: 1 },
      {
        onConflict: "lower(city),lower(state)",
        ignoreDuplicates: false,
      }
    )
    .select("votes")
    .single();

  // If upsert doesn't support expression conflicts, fall back to manual increment
  if (error?.code === "23505" || error?.message?.includes("unique")) {
    // Conflict: increment votes manually
    const { data: existing } = await supabaseAdmin
      .from("city_suggestions")
      .select("id, votes")
      .ilike("city", city)
      .ilike("state", state)
      .single();

    if (existing) {
      await supabaseAdmin
        .from("city_suggestions")
        .update({ votes: existing.votes + 1 })
        .eq("id", existing.id);
    }
  } else if (error) {
    console.error("city_suggestions insert error:", error);
    return NextResponse.json({ error: "Failed to save suggestion" }, { status: 500 });
  }

  const totalVotes = data?.votes ?? 1;

  // Notify admin
  await sendAdminAlert({
    subject: `New city request: ${city}, ${state}`,
    message: [
      `City requested: ${city}, ${state}`,
      `Requester email: ${email ?? "(not provided)"}`,
      `Total votes for this city: ${totalVotes}`,
      ``,
      `View all requests in Supabase → city_suggestions table`,
    ].join("\n"),
  });

  return NextResponse.json({ ok: true, city, state });
}
