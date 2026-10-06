/* =========================================================================
   Service worker: keeps Firebase Storage images in a local cache.
   Firebase serves images with "Cache-Control: private, max-age=0", which
   makes the browser re-request them on every page. Here an image that has
   loaded once is answered from the cache instantly, and refreshed quietly
   in the background (so re-uploaded images still update on a later visit).
   Bump CACHE when the caching logic changes to drop the old cache.
   ========================================================================= */
var CACHE = "andy-images-v1";
var IMAGE_HOST = "firebasestorage.googleapis.com";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET" || new URL(req.url).hostname !== IMAGE_HOST) return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req, { ignoreVary: true }).then(function (cached) {
        var network = fetch(req).then(function (res) {
          // Opaque (status 0) responses come from <img> requests without CORS; they are fine to cache.
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        });
        if (cached) {
          event.waitUntil(network.catch(function () {}));
          return cached;
        }
        return network;
      });
    })
  );
});

// The page sends images it already showed before this worker took control.
// Fetching them again is cheap: the browser's HTTP cache answers with a 304.
self.addEventListener("message", function (event) {
  var data = event.data || {};
  if (data.type !== "cache-images" || !Array.isArray(data.urls)) return;
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(data.urls.map(function (url) {
        if (new URL(url).hostname !== IMAGE_HOST) return null;
        return cache.match(url, { ignoreVary: true }).then(function (hit) {
          if (hit) return null;
          return fetch(url, { mode: "no-cors" }).then(function (res) {
            if (res.ok || res.type === "opaque") return cache.put(url, res);
          }).catch(function () {});
        });
      }));
    })
  );
});
