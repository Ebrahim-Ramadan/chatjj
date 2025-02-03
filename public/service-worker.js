async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll([
    "/",
    "/globe-outline-dark-2.svg",
    "/assets/google.svg",
  ]);
}

async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
}
async function dynamicCaching(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    await cache.put(request, responseClone);
    return response;
  } catch (error) {
    console.error("Dynamic caching failed:", error);
    return caches.match(request);
  }
}
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const responseClone = networkResponse.clone();
    await cache.put(request, responseClone);
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return caches.match("/offline");
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clearOldCaches());
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (event.request.mode === "navigate") {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(dynamicCaching(request));
  }
});
