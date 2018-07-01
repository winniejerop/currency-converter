const staticCache = 'static-v17';
const dynamicCache = 'dynamic-v2';

  const StaticFileToCache = [
  '/currency-converter/',
  '/currency-converter/index.html',
  '/currency-converter/assets/css/style.css',
  '/currency-converter/assets/js/app.js',
  '/currency-converter/assets/js/idb.js',
  'https://free.currencyconverterapi.com/api/v5/currencies'
  ];
  
  // cache assets
  self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(staticCache)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(StaticFileToCache);
      })
  )
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== staticCache && key !== dynamicCache) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});
//fetch cache 
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)
      .then(response => caches.open(cacheName)
      .then(cache => {
        cache.put(event.request, response.clone());
        return response;
      })).catch(event => {
      //console.log('Service Worker error caching and fetching');
    }))
  );
});