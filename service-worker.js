const CACHE_NAME = 'temp-paes-v3'; // Versão nova para limpar o erro anterior
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/background.jfif',
  './img/bimbo2.png',
  './img/ico-192.png'
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

// O SEGREDO: Estratégia "Cache First" com fallback para rede
self.addEventListener('fetch', event => {
  // Ignora requisições de outras origens (extensões, analytics, etc)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Se estiver no cache, entrega IMEDIATAMENTE
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Se não estiver no cache, tenta buscar na rede
      return fetch(event.request).then(response => {
        // Se a resposta for válida, salva uma cópia no cache para a próxima vez
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
