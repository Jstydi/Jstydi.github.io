console.log('Start');
self.addEventListener('install', (event) => {
  console.log("Start install");
});

self.addEventListener('activate', (event) => {
  console.log("Start activate");
});

self.addEventListener('fetch', (event) => {
  console.log("Start fetch ", event.request);
});
