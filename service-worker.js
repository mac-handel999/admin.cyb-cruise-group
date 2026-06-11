
const CACHE_NAME = 'cyb-cruise-group-v1';
const ASSETS_TO_CACHE = [
  '/',
   '/index.html',
    '/Home.html',
    '/CR-System/admin-dashboard.html',
    '/directory.html',
    '/style.css',
    '/pwa-installer.js'
];

// 'install' lifecycle stage: build out the offline asset matrix storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Cache Engine: Securing static system blueprints...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 'activate' lifecycle stage: purge old system builds when you update code
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PWA Cache Engine: Flushing legacy operational cache clusters...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 'fetch' interceptor: serve local cached components for ultra-fast boot speeds
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the local file copy instantly, or fallback to fetching online live
      return cachedResponse || fetch(event.request);
    })
  );
});












// const CACHE_NAME = 'cyb-cruise-group-v1';
// const ASSETS = [
//   '/index.html',
//   '/Home.html',
//   '/CR-System/admin-gate.html',
//   '/CR-System/admin-dashboard.html',
//   '/style.css',
//   '/pwa-installer.js'
// ];

// // Install Lifecycle Event
// self.addEventListener('install', (e) => {
//   e.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(ASSETS);
//     })
//   );
// });

// // Fetch Event to serve assets smoothly
// self.addEventListener('fetch', (e) => {
//   e.respondWith(
//     caches.match(e.request).then((response) => {
//       return response || fetch(e.request);
//     })
//   );
// });
