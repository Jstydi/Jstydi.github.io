'use strict';
self.addEventListener('fetch', (event) => {
    console.log('Происходит запрос на сервер');
});
importScripts('sw-toolbox.js');
toolbox.precache(["index.html"]);
toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, {
networkTimeoutSeconds: 5
});

