// Subimos para v6 para invalidar o cache antigo
const CACHE_NAME = 'temp-paes-v6';

const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/background.jfif',
  './img/bimbo2.png',
  './img/icon-192.png',
  './img/icon-512.png'
];

// Instalação - Salva tudo no cache imediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Ativação - Limpa caches velhos e assume o controle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Estratégia "Cache First" com fallback para rede
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
