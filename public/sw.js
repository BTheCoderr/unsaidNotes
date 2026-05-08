/* Minimal offline shell for the PWA — no background sync. */
const CACHE = "unsaid-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE);
        await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
      } catch {
        /* cache may fail if offline during first install */
      }
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(OFFLINE_URL);
      if (cached) return cached;
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }),
  );
});
