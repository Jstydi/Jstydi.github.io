console.log('Start');
self.addEventListener('install', (event) => {
  console.log("Start install");
});

self.addEventListener('activate', (event) => {
  console.log("Start activate");
});

self.addEventListener('fetch', (event) => {
  event.respondWith(console.log("Start fetch ", event.request))
});
