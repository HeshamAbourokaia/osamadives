// Keeps Osama's card working on a boat with no signal, without ever freezing an old
// copy in place: the page itself is fetched fresh whenever there is signal and only
// falls back to the cache when the network fails. Pictures are served from the cache
// first, since they do not change.
const CACHE = "osamadives-card-v4";
const FILES = [
  "/card",
  "/brand/stamp-512.png",
  "/brand/icon-192.png",
  "/card.webmanifest",
  "/card/dahab-band.webp",
  "/card/dahab-far.webp",
  "/review-card.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function save(request, response) {
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(CACHE).then((c) => c.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  const mine =
    url.pathname === "/card" ||
    url.pathname.startsWith("/card/") ||
    url.pathname === "/card.webmanifest" ||
    url.pathname === "/review-card.png" ||
    url.pathname.startsWith("/brand/") ||
    url.pathname.startsWith("/_next/");
  if (!mine) return;

  // the page: newest wins, the cache is the safety net
  if (e.request.mode === "navigate" || url.pathname === "/card") {
    e.respondWith(
      fetch(e.request)
        .then((res) => save(e.request, res))
        .catch(() => caches.match(e.request).then((hit) => hit || caches.match("/card")))
    );
    return;
  }

  // everything else: from the cache, refreshed quietly in the background
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const live = fetch(e.request).then((res) => save(e.request, res)).catch(() => hit);
      return hit || live;
    })
  );
});
