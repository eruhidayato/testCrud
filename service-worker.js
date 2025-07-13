const CACHE_NAME = 'pwa-presensi-v1';
const URLS_TO_CACHE = [
  '/',                // index.html
  '/index.html',
  '/app.js',
  '/manifest.json'
];

// Install: cache file lokal saja
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .catch(err => console.warn('Cache addAll error:', err))
  );
});

// Fetch: jika origin berbeda (eksternal), bypass; 
// kalau sama, coba cache-first
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // Bypass external domains
  if (requestURL.origin !== location.origin) {
    return event.respondWith(fetch(event.request));
  }

  // Handle local assets
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
      .catch(err => fetch(event.request))
  );
});
