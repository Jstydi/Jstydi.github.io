'use strict';

importScripts('sw-toolbox.js');
setInterval(function() { 
toolbox.precache(["index.html"]);
toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, {
networkTimeoutSeconds: 5
});
console.log("test");
}, 5000);
