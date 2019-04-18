console.log('Start');
// -------------------------------------------------- // Установка необходимых ресурсов в кэш
self.addEventListener('install', (event) => {
    console.log('Start install');
    event.waitUntil(
        async function () {
            self.skipWaiting();
            const cacheName = 'Jstydi_app-v1';
            const cache = await caches.open(cacheName);
            // ссылки на кэшируемые файлы
            await cache.addAll(
                [
                    '/',
                    'file-version.json',
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
    self.clients.claim();
    console.log("Start activate");
});
// -------------------------------------------------- //

// ---------------------------------------------------------- // Перехват запросов на сервер
// При запросе на сервер мы используем данные из кэша
self.addEventListener('fetch', (event) => {
    console.log('Start fetch ', event.request.url)
    event.respondWith(
        caches.match(event.request) // Все требуемые ресурсы беруться из кэш
    )
});
// ---------------------------------------------------------- //

// ---------------------------------------------------------- // Работа с сообщениями от sw к странице

function connection () {
   //var url = "https://jstydi.github.io/file-version.json";
   return fetch("https://jstydi.github.io/file-version.json", { cache: "no-cache" })  // Запрос на сервер для получения новых данных
        .then(function (response) {
            if (response.status !== 200) {  // Проверка на ошибку статус не равен (200, ОК) 
                console.log('Похоже, возникла проблема. Код состояния: ' + response.status);
                var netconnect = false;
                return netconnect;
            }
            return response.json().then(function (data) {  // Данные из сервера
                console.log('Получены данные из сервера ', data);
                //console.log('Адрес запроса ', url);
                compareCache(data, url);
                return data;
            });
        })
        .catch(function (err) {
            console.log('Ошибка запроса :', err);
            var netconnect = false;
            return netconnect;
        });
      }

    function compareCache(data, url){
        return cache.match(url).then(function(response) {
        console.log(response);
        console.log(data);
        });
    }

    setInterval(commandDistributor, 20000);  // Запуск функции на с интервалом 5 сек.

    function commandDistributor (){
        
        connection().then((connectresults) => {
            if(connectresults == false){
            //console.log('Сеть недоступна ',connectresults);
            } else {
            //console.log('Полученные данные ',connectresults);
            }
         })
            
        self.clients.matchAll().then((clients) => { // Отправляем данные на (html) страницу
            const client = clients[0];
            var message = { 'Из service-worcer в' : 'html' };
            client.postMessage(message);
        });
     }

     self.addEventListener('message', event => { // Принимаем данные из (html) страницы
        console.log("Принимаем данные из (html) страницы  ", event.data);
     });

