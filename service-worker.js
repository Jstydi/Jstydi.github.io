console.log("Start");
// -------------------------------------------------- // Установка необходимых ресурсов в кэш
self.addEventListener("install", event => {
    console.log("Start install");
    event.waitUntil(
        (async function () {
            self.skipWaiting();
            const cacheName = "Jstydi_app-v1";
            const cache = await caches.open(cacheName);
            // ссылки на кэшируемые файлы
            await cache.addAll([
                "/",
                "/file-version.json",
                "/index.html",
                "/manifest.json",
                "https://code.jquery.com/jquery-3.4.0.min.js",
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
            ]);
        })()
    );
});
// -------------------------------------------------- //

// -------------------------------------------------- // Активация sw
self.addEventListener("activate", event => {
    self.clients.claim();
    console.log("Start activate");
});
// -------------------------------------------------- //

// ---------------------------------------------------------- // Перехват запросов на сервер
// При запросе на сервер мы используем данные из кэша
self.addEventListener("fetch", event => {
    console.log("Start fetch ", event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) { // Все требуемые ресурсы беруться из кэш
            if (event.request.url == 'https://jstydi.github.io/') {
                console.log('перехват test')
            }
            return response;
        })
    )
});
// ---------------------------------------------------------- //

// ---------------------------------------------------------- // Работа с сообщениями от sw к странице

function connection() {
    var url = "https://jstydi.github.io/file-version.json";
    var connectresults = {};
    return fetch(url, { // Запрос на сервер для получения новых данных
            cache: "no-cache"
        })
        .then(function (response) {
            if (response.status !== 200) {
                // Проверка на ошибку статус не равен (200, ОК)
                console.log("Похоже, возникла проблема. Код состояния: " + response.status);
                connectresults.connect = false;
                return connectresults; // Проблемы с ресурсом
            };
            return response.json().then(function (data) {
                //console.log('Получены данные из сервера ', data);

                //compareCache(data, response.url).then(function(res) {
                //console.log(res)
                //})
                return compareCache(data, response.url);
            });
        })
        .catch(function (err) {
            console.log("Ошибка запроса :", err);
            connectresults.connect = false;
            return connectresults;
        });
}

function compareCache(fetchdata, cacheurl) {
    return caches.match(cacheurl).then(function (response) {
        return response.json().then(function (cachedata) {
            console.log("Кэш ", cachedata);
            console.log("Сеть ", fetchdata);
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
            var arr = [fetchdata, cachedata];

            for (var i = 0; i < arr.length; i++) {
                objArr(arr[i], i);
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
                        console.log("Не совпадение", fetchArr[0][0][i], fetchArr[0][1][i]);
                        var prop = fetchArr[0][0][i];
                        //var val = fetchArr[0][1][i];
                        resObj[prop] = true;
                    } else {
                        console.log("Равны");
                        var prop = fetchArr[0][0][i];
                        resObj[prop] = false;
                    }
                }
                return resObj;
            }
            var returnCompare = comparisonResult(fetchArr, cacheArr);
            console.log(returnCompare);
            return returnCompare;
        });
    });
}

setInterval(commandDistributor, 20000); // Запуск функции на с интервалом 20 сек.

function commandDistributor() {
    var t0 = performance.now(); // Начало время выполнения
    connection().then(connectresults => {
        if (connectresults.connect == false) {
            console.log('Сеть недоступна ', connectresults);
        } else if (connectresults[service_worker.js] == true) {
            console.log("Полученные данные ", connectresults[service_worker.js]);
            var t1 = performance.now(); // Конец времени выполнения
            console.log((t1 - t0) + " ms "); // Результат 
        } else if (connectresults.index.html == true) {
            console.log("Полученные данные ", connectresults.index.html);
            var t1 = performance.now(); // Конец времени выполнения
            console.log((t1 - t0) + " ms "); // Результат
        } else if (connectresults.content.json == true) {
            console.log("Полученные данные ", connectresults.content.json);
            var t1 = performance.now(); // Конец времени выполнения
            console.log((t1 - t0) + " ms "); // Результат
        } else {
            console.log(connectresults)
        }
    });

    self.clients.matchAll().then(clients => {
        if (clients && clients.length) {
            // Отправляем данные на (html) страницу
            const client = clients[0];
            var message = {
                "Из service-worcer в": "html"
            };
            client.postMessage(message);
        }
    });
}

self.addEventListener("message", event => { // Принимаем данные из (html) страницы
    var htmlMessage = event.data;
    if (htmlMessage == true) {
        console.log("Принимаем данные из (html) страницы, под контролем sw ", htmlMessage);
    } else {
        console.log("Принимаем данные из (html) страницы  ", htmlMessage);
    }
});
