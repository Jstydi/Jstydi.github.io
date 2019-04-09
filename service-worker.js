console.log('Start');
const cacheName = 'Jstydi_app-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open(cacheName);
    // ссылки на кэшируемые файлы
    await cache.addAll(
    [
        '/',
        '/index.html',
        '/manifest.json',
        '/service-worker.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
        '/icons/android-icon-144x144.png',
        '/icons/android-icon-192x192.png',
        '/icons/android-icon-36x36.png',
        '/icons/android-icon-48x48.png',
        '/icons/android-icon-512x512.png',
        '/icons/android-icon-72x72.png',
        '/icons/android-icon-96x96.png',
        '/icons/apple-icon-114x114.png',
        '/icons/apple-icon-120x120.png',
        '/icons/apple-icon-144x144.png',
        '/icons/apple-icon-152x152.png',
        '/icons/apple-icon-180x180.png',
        '/icons/apple-icon-57x57.png',
        '/icons/apple-icon-60x60.png',
        '/icons/apple-icon-72x72.png',
        '/icons/apple-icon-76x76.png',
        '/icons/apple-icon-precomposed.png',
        '/icons/apple-icon.png',
        '/icons/favicon-16x16.png',
        '/icons/favicon-32x32.png',
        '/icons/favicon-96x96.png',
        '/icons/favicon.ico',
        '/icons/ms-icon-144x144.png',
        '/icons/ms-icon-150x150.png',
        '/icons/ms-icon-310x310.png',
        '/icons/ms-icon-70x70.png'
        ]
    );
  }());
});

self.addEventListener('activate', (event) => {
  console.log("Start activate");
});

// При запросе на сервер мы используем данные из кэша и только после идем на сервер.
self.addEventListener('fetch', (event) => {
  console.log('Start fetch ', event.request);
  event.respondWith(async function() {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(event.request);
    const networkResponsePromise = fetch(event.request);

    event.waitUntil(async function() {
      const networkResponse = await networkResponsePromise;
      await cache.put(event.request, networkResponse.clone());
    }());

    // Returned the cached response if we have one, otherwise return the network response.
    return cachedResponse || networkResponsePromise;
  }());
});
