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
    console.log('instal', event);
    // задержим обработку события
    // если произойдёт ошибка, serviceWorker не установится
    event.waitUntil(
        // находим в глобальном хранилище Cache-объект с нашим именем
        // если такого не существует, то он будет создан
        caches.open(cacheName).then(function(cache) {
            // загружаем в наш cache необходимые файлы
            console.log('Opened cache');
            return cache.addAll(cacheUrls);
        })
    );
});

self.addEventListener('activate', function(event) {
    // активация
    console.log('activate', event);
    console.log(cacheName);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Этот метод анализирует запрос и
    // ищет кэшированные результаты для этого запроса в любом из
    // созданных сервис-воркером кэшей.
    caches.match(event.request)
      .then(function(response) {
          
        // если в кэше найдено то, что нужно, мы можем тут же вернуть ответ.
        if (response) {
          return response;
        }

        // Клонируем запрос. Так как объект запроса - это поток,
        // обратиться к нему можно лишь один раз. 
        // При этом один раз мы обрабатываем его для нужд кэширования,
        // ещё один раз он обрабатывается браузером, для запроса ресурсов, 
        // поэтому объект запроса нужно клонировать.
        var fetchRequest = event.request.clone();
        
        // В кэше ничего не нашлось, поэтому нужно выполнить загрузку материалов,
        // что заключается в выполнении сетевого запроса и в возврате данных, если
        // то, что нужно, может быть получено из сети.
        return fetch(fetchRequest).then(
          function(response) {
            // Проверка того, получили ли мы правильный ответ
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонирование объекта ответа, так как он тоже является потоком.
            // Так как нам надо, чтобы ответ был обработан браузером,
            // а так же кэшем, его нужно клонировать,
            // поэтому в итоге у нас будет два потока.
            var responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                // Добавляем ответ в кэш для последующего использования.
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
