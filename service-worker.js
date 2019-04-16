console.log('Start 1');
// -------------------------------------------------- // Установка необходимых ресурсов в кэш
self.addEventListener('install', (event) => {
  console.log('Start install ', event);
  event.waitUntil(
    async function() {
    self.skipWaiting();
    const cacheName = 'Jstydi_app-v1';
    const cache = await caches.open(cacheName);
    // ссылки на кэшируемые файлы
    await cache.addAll(
    [
        '/',
        '/index.html',
        '/manifest.json',
        'https://code.jquery.com/jquery-3.4.0.min.js',
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
// -------------------------------------------------- //

// -------------------------------------------------- // Активация sw
self.addEventListener('activate', (event) => {
  //self.clients.claim();
  console.log("Start activate", event);
});
// -------------------------------------------------- //

// ---------------------------------------------------------- // Перехват запросов на сервер
// При запросе на сервер мы используем данные из кэша
self.addEventListener('fetch', (event) => {
  console.log('Start fetch ', event.request.url)
  event.respondWith(
                    caches.match(event.request) // Все требуемые ресурсы бырутся из кэш
                   )
});
// ---------------------------------------------------------- //

// ---------------------------------------------------------- // Работа с сообщениями от sw к странице
function Message() { // В-1
    self.clients.matchAll().then( (clients) => {

        // ________________________________________________________ \\
        fetch("Jstydi.github.io/content.json",{cache: "no-store"}) // Запрос на сервер для получения новых данных
            .then(function(response) {  
                 if (response.status !== 200) {  // Проверка на ошибку статус не равен (200, ОК) 
                 console.log('Похоже, возникла проблема, Код состояния: ' + response.status);  
                 return;  
                 }
             response.json().then(function(data) {  // Данные из сервера 
             console.log('Получены данные из сервера : ', data);
             });  
            })
              .catch(function(err) {  
              console.log('Ошибка запроса ', err);  
            });
        // ________________________________________________________ \\

     if (clients && clients.length) { // Отправляем сообщение на страницу
        const client = clients[0];
        var mes = {test:'test'};
        client.postMessage(mes); // Отправляем сообщение на страницу 
     }
  });
}
//setInterval(function() {  // Запуск функции на отправку сообщений с интервалом 20 сек.
//Message();
//}, 20000)

setInterval(function() {  // Запуск функции на отправку сообщений с интервалом 20 сек.

    fetch("https://jstydi.github.io/service-worker.js",{method: "HEAD", cache: "no-cache" "If-Modified-Since" })
            .then(function(response) {  
                 console.log('Статус ответа : ' + response.status);
                  console.log(response)
                 return;  
            }).catch(function(err) {  
              console.log('Ошибка запроса :', err);  
            });
        }, 20000)

// ----------------------------------------------------------- // Сообщение В-2
  self.addEventListener('message', function(event){
    if(event.data == "UPDATE"){
      console.log("В сервис воркер сработал updata " ,event.data);
    } else {
    event.ports[0].postMessage({'test': 'This is my response.'});
    }
  });
// ---------------------------------------------------------- //
