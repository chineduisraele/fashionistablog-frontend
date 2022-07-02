const STATIC_CACHE = "static-v1",
  DYNAMIC_CACHE = "dynamic-v1",
  staticAssets = [
    "/",
    "/static/css/main.ea86fd06.css",
    "/static/js/main.c9436c03.js",
    "/static/js/787.c1112931.chunk.js",
    "/manifest.json",
    "/static/media/1.d466802465feac013526.webp",
    "/static/media/2.3a302b78d0af9e1cad06.webp",
    "/static/media/3.bd9fd426a181e37bd360.webp",
    "/static/media/4.04a70d0643f3911bc975.webp",
    "/static/media/5.800b991bf1f85fec5fbb.webp",
    "/static/media/6.3a762473b6cc12604209.webp",
    "/static/media/7.b3aec7bb3d827a24a3f6.webp",
    "/static/media/8.199290fd60495c7b9744.webp",
    "/static/media/add-1.822a2194e72e11c597b6.webp",
    "/static/media/admin.285d188731f8d9775306.webp",
    "/static/media/banner.081574d62be82f9af4a6.webp",
    "/static/media/facebook.e094863efa5ea75bbebc.webp",
    "/static/media/lazyimage.b885f21c53c2834d50e9.webp",
    "/static/media/logo.96ef8823ad8e83f4f096.webp",
    "/static/media/noprofile.680ad093e6a33700cf4b.webp",
    "/static/media/purchase.fc1b8688703853f5a41d.webp",
    "/static/manifest-icon-192.maskable.png",
    "/static/manifest-icon-512.maskable.png",
    "/svg.svg",
  ],
  self = this;

// add to cache function
const addToCache = async (cacheName, asset, method, url = null) => {
  const cache = await caches.open(cacheName);
  const cacheResponse =
    method === "all" ? await cache.addAll(asset) : await cache.put(url, asset);
  return cacheResponse;
};

// match or return fallback
const matchOrFallback = async (url, fallback) => {
  const cachedResponse = await caches.match(url);
  if (cachedResponse) {
    return cachedResponse;
  } else {
    return url.includes("/api/") ? undefined : await caches.match(fallback);
  }
};

const limitCacheSize = async (name, size) => {
  const cache = await caches.open(name);
  const cacheKeys = await cache.keys();
  if (cacheKeys.length > size) {
    cache.delete(cacheKeys[0]).then(limitCacheSize(name, size));
  }
};

// install
self.addEventListener("install", (event) => {
  event.waitUntil(addToCache(STATIC_CACHE, staticAssets, "all"));
});

// fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      // network first approach
      let cleanedUrl = event.request.url.replace(event.request.referrer, "/");
      try {
        // const preloadResponse = await event.preloadResponse;
        // if (preloadResponse) {
        //   return preloadResponse;
        // }

        const networkResponse = await fetch(event.request);
        // only add items not in static asset to dynamic cache if those items are not images
        // images will be cached in browser cache via cache control headers
        // this reduces bloating of cache storage
        if (
          !staticAssets.includes(cleanedUrl) &&
          event.request.url !== "/" &&
          event.request.url.includes("/api/")
        ) {
          addToCache(
            DYNAMIC_CACHE,
            networkResponse.clone(),
            "put",
            event.request.url
          );
        }
        if (networkResponse && event.request.url.includes("/api/")) {
          const client = await self.clients.get(event.clientId);
          client && client.postMessage({ onlineStatus: true });
        }

        // on reload or back to home
        if (event.request.url.includes("/api/post/posts/?page=1")) {
          // limit cache size
          limitCacheSize(DYNAMIC_CACHE, 500);
        }

        return networkResponse;
      } catch (error) {
        // images
        if (
          event.request.url.endsWith(".webp") ||
          event.request.url.endsWith(".png") ||
          event.request.url.endsWith(".jpg") ||
          event.request.url.endsWith(".jpeg")
        ) {
          return matchOrFallback(
            event.request.url,
            "/static/media/lazyimage.b885f21c53c2834d50e9.webp"
          );
        }

        // default
        else {
          if (event.request.url.includes("/api/")) {
            const client = await self.clients.get(event.clientId);
            client && client.postMessage({ onlineStatus: false });
          }

          return matchOrFallback(event.request.url, "/");
        }
      }
    })()
  );
});

// deleting old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      return cacheKeys
        .filter((key) => key !== STATIC_CACHE)
        .map((key) => caches.delete(key));
    })()
  );
});
