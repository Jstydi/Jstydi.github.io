console.log('Start');
self.addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('Jstydi_app-v1');
    // ссылки на кэшируемые файлы
    await cache.addAll(
    [
        '/index.html',
        '/manifest.json',
        '/service-worker.js',
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
    console.info('Start fetch ', event.request);
    // Как и в предыдущем примере, сначала `respondWith()` потом `waitUntil()`
    event.respondWith(fromCache(event.request));
    event.waitUntil(
      update(event.request)
      // В конце, после получения "свежих" данных от сервера уведомляем всех клиентов.
      .then(refresh)
    );
});

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function update(request) {
    return caches.open(CACHE).then((cache) =>
        fetch(request).then((response) =>
            cache.put(request, response.clone()).then(() => response)
        )
    );
}

// Шлём сообщения об обновлении данных всем клиентам.
function refresh(response) {
    return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            // Подробнее про ETag можно прочитать тут
            // https://en.wikipedia.org/wiki/HTTP_ETag
            const message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            // Уведомляем клиент об обновлении данных.
            client.postMessage(JSON.stringify(message));
        });
    });
}
