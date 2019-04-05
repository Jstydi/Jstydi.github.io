importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');
workbox.setConfig({
  debug: true
});
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
        '/index.html',
        '/style.css',
        '/manifest.json',
        handler
);
