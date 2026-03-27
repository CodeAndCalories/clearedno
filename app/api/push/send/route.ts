// POST /api/push/send
//
// Sends a web push notification to a specific user.
// Called from the scraper engine (alongside email alerts) when a permit
// status changes.
//
// This is an internal server-only route — not called from the browser.
// Protect it with CRON_SECRET or call it only from trusted server code.
//
// Body:
//   userId: string    — the auth.users UUID of the recipient
//   title: string     — notification title
//   body: string      — notification body text
//   url?: string      — URL to open when notification is clicked (default: /dashboard)
//
// Setup:
//   1. Generate VAPID keys: npx web-push generate-vapid-keys
//   2. Add NEXT_PUBLIC_VAPID_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL to .env.local
//   3. Run migrations/003_referrals.sql to add push_subscription column

import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Configure web-push with VAPID keys.
// VAPID keys identify your server to push services (FCM, Mozilla, etc.).
// Generate once with: npx web-push generate-vapid-keys
const vapidPublicKey  = process.env.NEXT_PUBLIC_VAPID_KEY  ?? "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY       ?? "";
const vapidEmail      = process.env.VAPID_EMAIL             ?? "mailto:support@clearedno.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

interface PushPayload {
  userId: string;
  title:  string;
  body:   string;
  url?:   string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Check VAPID configuration before attempting to send
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json(
      { error: "VAPID keys not configured. Set NEXT_PUBLIC_VAPID_KEY and VAPID_PRIVATE_KEY." },
      { status: 503 }
    );
  }

  let payload: PushPayload;
  try {
    payload = await req.json();
    if (!payload.userId || !payload.title || !payload.body) {
      throw new Error("userId, title, and body are required");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request body" },
      { status: 400 }
    );
  }

  // Fetch the user's push subscription from their profile
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("push_subscription")
    .eq("user_id", payload.userId)
    .maybeSingle();

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  if (!profile?.push_subscription) {
    // User hasn't subscribed to push notifications — not an error
    return NextResponse.json({ success: true, sent: false, reason: "No push subscription" });
  }

  const subscription = profile.push_subscription as webpush.PushSubscription;

  // Build the notification payload
  const notificationPayload = JSON.stringify({
    title: payload.title,
    body:  payload.body,
    url:   payload.url ?? "/dashboard",
    icon:  "/clearedno-icon.png",
    badge: "/clearedno-icon.png",
  });

  try {
    await webpush.sendNotification(subscription, notificationPayload);
    return NextResponse.json({ success: true, sent: true });
  } catch (pushErr: unknown) {
    const err = pushErr as { statusCode?: number; message?: string };
    // HTTP 410 Gone = subscription is expired/revoked — clean it up
    if (err.statusCode === 410) {
      await supabaseAdmin
        .from("profiles")
        .update({ push_subscription: null })
        .eq("user_id", payload.userId);
      return NextResponse.json({ success: true, sent: false, reason: "Subscription expired — removed" });
    }

    return NextResponse.json(
      { error: err.message ?? "Push send failed" },
      { status: 500 }
    );
  }
}
