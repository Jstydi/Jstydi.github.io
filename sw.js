'use strict';

importScripts('sw-toolbox.js');
toolbox.precache(["index.html"]);
toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, {
  console.log("Test servis-worcer fail")
  networkTimeoutSeconds: 5
});
