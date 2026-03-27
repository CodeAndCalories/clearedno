// ClearedNo Service Worker — handles web push notification events.
//
// This file must be served from the root path (/sw.js) so its scope
// covers the entire origin. Placed in /public/ in Next.js.
//
// Events handled:
//   push    — displays the notification when a push message arrives
//   notificationclick — opens /dashboard when user clicks the notification

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "ClearedNo", body: event.data.text(), url: "/dashboard" };
  }

  const options = {
    body:  data.body  ?? "A permit status has changed.",
    icon:  data.icon  ?? "/clearedno-icon.png",
    badge: data.badge ?? "/clearedno-icon.png",
    data:  { url: data.url ?? "/dashboard" },
    // Keep the notification visible until the user interacts with it
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title ?? "ClearedNo Update", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus an existing tab if one is open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        clients.openWindow(targetUrl);
      }
    })
  );
});
