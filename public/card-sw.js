// Keeps Osama's card working on a boat with no signal. It caches the card and its
// picture on first visit and serves them from the cache whenever the network is gone.
const CACHE = "osamadives-card-v3";
const FILES = ["/card", "/brand/stamp-512.png", "/brand/icon-192.png", "/card.webmanifest", "/card/dahab-band.webp", "/card/dahab-far.webp", "/review-card.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/card") && !url.pathname.startsWith("/brand/") && !url.pathname.startsWith("/_next/")) return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const live = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || live;
    })
  );
});
