self.addEventListener('install', function(event) {
    // инсталляция
    setInterval(function() {
    console.log('install', event);
    console.log("Test");
    }, 10000);
});

self.addEventListener('activate', function(event) {
    // активация
    console.log('activate', event);
});
