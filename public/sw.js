/* OsamaDives: the pages you have seen open with no signal. Network first, always; the
   copy is only for when the network is gone. Nothing is served stale while online. */
const CACHE = "osamadives-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  if (req.url.includes("/api/") || req.url.includes("/logbook/admin")) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok && (req.mode === "navigate" || /\.(css|js|woff2?|webp|png|jpe?g|svg|mp4)$/.test(new URL(req.url).pathname))) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("/") : undefined)).then((hit) => hit || Response.error()))
  );
});
