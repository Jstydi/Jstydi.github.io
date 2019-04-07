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

async function update() {
  // Start the network request as soon as possible.
  const networkPromise = fetch('/data.json');

  startSpinner();

  const cachedResponse = await caches.match('/data.json');
  if (cachedResponse) await displayUpdate(cachedResponse);

  try {
    const networkResponse = await networkPromise;
    const cache = await caches.open('mysite-dynamic');
    cache.put('/data.json', networkResponse.clone());
    await displayUpdate(networkResponse);
  } catch (err) {
    // Maybe report a lack of connectivity to the user.
  }

  stopSpinner();

  const networkResponse = await networkPromise;

}

async function displayUpdate(response) {
  const data = await response.json();
  updatePage(data);
}
