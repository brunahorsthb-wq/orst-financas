// ORST Financas — Service Worker
// Ao publicar uma versao nova, troque o numero abaixo (v2, v3...) para os celulares atualizarem.
var CACHE = 'orst-financas-v4';
var BASE = self.registration.scope; // funciona com qualquer nome de repositorio
var ASSETS = ['', 'index.html', 'manifest.json', 'firebase-config.js', 'icon-192.png', 'icon-512.png']
  .map(function(p) { return BASE + p; });

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(err) { console.log('Cache parcial:', err); });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; })
                             .map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Rede primeiro, cache como reserva (offline). Firebase e CDNs passam direto.
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(BASE)) return;
  e.respondWith(
    fetch(e.request).then(function(res) {
      var copia = res.clone();
      caches.open(CACHE).then(function(cache) { cache.put(e.request, copia); });
      return res;
    }).catch(function() {
      return caches.match(e.request).then(function(c) { return c || caches.match(BASE + 'index.html'); });
    })
  );
});
