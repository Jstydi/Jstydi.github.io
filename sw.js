console.log("Старт service worker")
// наименование для нашего хранилища кэша
var cacheName = 'Jstydi_app',
// ссылки на кэшируемые файлы
    cacheUrls = [
        '/index.html',
        '/style.css',
        '/manifest.json',
        "/icons/android-icon-144x144.png",
        "/icons/android-icon-192x192.png",
        "/icons/android-icon-36x36.png",
        "/icons/android-icon-48x48.png",
        "/icons/android-icon-512x512.png",
        "/icons/android-icon-72x72.png",
        "/icons/android-icon-96x96.png",
        "/icons/apple-icon-114x114.png",
        "/icons/apple-icon-120x120.png",
        "/icons/apple-icon-144x144.png",
        "/icons/apple-icon-152x152.png",
        "/icons/apple-icon-180x180.png",
        "/icons/apple-icon-57x57.png",
        "/icons/apple-icon-60x60.png",
        "/icons/apple-icon-72x72.png",
        "/icons/apple-icon-76x76.png",
        "/icons/apple-icon-precomposed.png",
        "/icons/apple-icon.png",
        "/icons/favicon-16x16.png",
        "/icons/favicon-32x32.png",
        "/icons/favicon-96x96.png",
        "/icons/favicon.ico",
        "/icons/ms-icon-144x144.png",
        "/icons/ms-icon-150x150.png",
        "/icons/ms-icon-310x310.png",
        "/icons/ms-icon-70x70.png"
        ];
self.addEventListener('install', function(event) {
    // задержим обработку события
    // если произойдёт ошибка, serviceWorker не установится
    event.waitUntil(
        // находим в глобальном хранилище Cache-объект с нашим именем
        // если такого не существует, то он будет создан
        caches.open(cacheName).then(function(cache) {
            console.log("Загрузка в кэш, ф-я instal");
            // загружаем в наш cache необходимые файлы
            return cache.addAll(cacheUrls);
       })
    );
}); 

self.addEventListener('activate', function(event) {
    // активация
    //event.waitUntil();
    console.log('Запуск функции активации ', event);
});

self.addEventListener('fetch', function(event) {
    console.log('Запуск функции fetch ', event);
});
