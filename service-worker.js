const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/src/index.css',
  '/src/main.jsx',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
