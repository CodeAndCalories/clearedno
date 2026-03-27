"use client";

// PushToggle — browser push notification enable/disable toggle.
//
// Shown in the dashboard settings area. Requests permission, registers the
// service worker, and saves the subscription to the server via
// POST /api/push/subscribe.
//
// Requires NEXT_PUBLIC_VAPID_KEY in env (the public VAPID key).

import { useState, useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY ?? "";

// Converts the VAPID public key from base64url to an ArrayBuffer for the browser API.
function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

interface PushToggleProps {
  hasExistingSubscription: boolean; // From server: whether user already has a sub saved
}

export function PushToggle({ hasExistingSubscription }: PushToggleProps) {
  const [enabled, setEnabled]   = useState(hasExistingSubscription);
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Push notifications require a secure context and service worker support
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setSupported(false);
    }
  }, []);

  if (!supported || !VAPID_PUBLIC_KEY) {
    return null; // Hide silently if push not available or VAPID not configured
  }

  async function handleEnable() {
    setLoading(true);
    setStatus("idle");

    try {
      // 1. Register a service worker (needed to receive push events)
      const reg = await navigator.serviceWorker.register("/sw.js");

      // 2. Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        setLoading(false);
        return;
      }

      // 3. Subscribe via the Push API
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToArrayBuffer(VAPID_PUBLIC_KEY),
      });

      // 4. Save subscription to server
      const res = await fetch("/api/push/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (!res.ok) throw new Error("Failed to save subscription");

      setEnabled(true);
      setStatus("success");
    } catch (err) {
      console.error("Push subscribe error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    setLoading(true);

    try {
      await fetch("/api/push/subscribe", { method: "DELETE" });
      setEnabled(false);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-xs font-mono text-[#F5F0E8]/60">Push Notifications</div>
        <div className="text-[10px] text-[#F5F0E8]/25 tracking-widest mt-0.5">
          {enabled
            ? "Browser notifications are on — you'll hear about status changes instantly"
            : "Get browser alerts the moment a permit status changes"}
        </div>
        {status === "error" && (
          <div className="text-[10px] text-[#DC2626] mt-1">
            Permission denied or setup failed. Check browser settings.
          </div>
        )}
        {status === "success" && (
          <div className="text-[10px] text-[#16A34A] mt-1">
            Push notifications enabled!
          </div>
        )}
      </div>

      <button
        onClick={enabled ? handleDisable : handleEnable}
        disabled={loading}
        className={`flex-shrink-0 font-mono text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 transition-colors disabled:opacity-50 whitespace-nowrap ${
          enabled
            ? "border border-[#6B7280]/40 text-[#6B7280] hover:border-[#DC2626] hover:text-[#DC2626]"
            : "bg-[#FF6B00] text-[#0A0A0A] hover:bg-[#F5F0E8]"
        }`}
      >
        {loading ? "..." : enabled ? "Disable" : "Enable Push"}
      </button>
    </div>
  );
}
