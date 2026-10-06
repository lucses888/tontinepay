/* TontinePay — Service Worker
 *
 * Stratégies :
 *  - App shell + pages     : network-first (contenu toujours frais, fallback offline)
 *  - Assets _next/static   : cache-first (fingerprintés, immuables)
 *  - Images/icônes         : cache-first
 *  - API + auth            : network-only (jamais de cache de données sensibles)
 */

const VERSION = "v1";
const STATIC_CACHE = `tontinepay-static-${VERSION}`;
const PAGES_CACHE = `tontinepay-pages-${VERSION}`;
const IMAGES_CACHE = `tontinepay-images-${VERSION}`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES_CACHE);
      await cache.addAll([OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"]);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("tontinepay-") &&
              !key.endsWith(`-${VERSION}`)
          )
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API et auth : jamais de cache (données sensibles, temps réel)
  if (url.pathname.startsWith("/api/")) return;

  // Assets statiques fingerprintés : cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // Images publiques : cache-first
  if (/\.(png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(IMAGES_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // Pages (navigations) : network-first avec fallback offline
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(PAGES_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
          return new Response("Hors ligne", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })()
    );
  }
});
