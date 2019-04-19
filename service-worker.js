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

function connection() {
    var url = "https://jstydi.github.io/file-version.json";
    return fetch(url, {
            cache: "no-cache"
        }) // Запрос на сервер для получения новых данных
        .then(function (response) {
            if (response.status !== 200) { // Проверка на ошибку статус не равен (200, ОК) 
                console.log('Похоже, возникла проблема. Код состояния: ' + response.status);
                var netconnect = false;
                return netconnect;
            }
            return response.json().then(function (data) { // Данные из сервера
                //console.log('Получены данные из сервера ', data);
               //var tru =//
                compareCache(data, response.url).then(function(res) {
                console.log(res)
                })
                //console.log(tru)
                var t = "Данные из fetch запросса";
                return t;
            });
        })
        .catch(function (err) {
            console.log('Ошибка запроса :', err);
            var netconnect = false;
            return netconnect;
        });
}

function compareCache(data, url) {
    
   return caches.match(url).then(function (response) {
       return response.json().then(function(res) {

            console.log('Кэш ', res);
            console.log('Сеть ', data);
            var fetchArr = [
                [
                    [],
                    []
                ]
            ];
            var cacheArr = [
                [
                    [],
                    []
                ]
            ];
            var arr = [res, data];

            for (var i = 0; i < arr.length; i++) {
                objArr(arr[i], i)
            }

            function objArr(obj, i) {
                if (i == 0) {
                    for (var key in obj) {
                        fetchArr[i][i].push(key);
                        fetchArr[0][1].push(obj[key]);

                    }
                } else if (i == 1) {
                    for (var key in obj) {
                        cacheArr[0][0].push(key);
                        cacheArr[0][i].push(obj[key]);

                    }
                }
            }

            function comparisonResult(fetchArr, cacheArr) {
                var resObj = {};
                for (var i = 0; i < fetchArr[0][1].length; i++) {
                    if (fetchArr[0][1][i] !== cacheArr[0][1][i]) {
                        console.log('Не совпадение', fetchArr[0][0][i], fetchArr[0][1][i]);
                        var prop = fetchArr[0][0][i];
                        var val = fetchArr[0][1][i];
                        resObj[prop] = val;
                    } else {
                        console.log("Равны");
                        resObj.Res = "Без изменений";
                    }
                }
                return resObj;
            }
            var returnCompare = comparisonResult(fetchArr, cacheArr);
            console.log(returnCompare);
            return returnCompare;
        })

    });
}

setInterval(commandDistributor, 20000); // Запуск функции на с интервалом 5 сек.

function commandDistributor() {

    connection().then((connectresults) => {
        if (connectresults == false) {
            //console.log('Сеть недоступна ',connectresults);
        } else {
            console.log('Полученные данные ', connectresults);
        }
    })

    self.clients.matchAll().then((clients) => { // Отправляем данные на (html) страницу
        const client = clients[0];
        var message = {
            'Из service-worcer в': 'html'
        };
        client.postMessage(message);
    });
}

self.addEventListener('message', event => { // Принимаем данные из (html) страницы
    console.log("Принимаем данные из (html) страницы  ", event.data);
});
