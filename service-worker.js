const CACHE_NAME = 'temp-paes-v2'; // Mudamos a versão para forçar atualização
const assets = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'img/background.jfif',
  'img/bimbo2.png',
  'img/ico-192.png'
];

// Instalação: Salva os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache');
      return cache.addAll(assets);
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Estratégia: Tenta buscar na rede, se falhar (offline), usa o cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
