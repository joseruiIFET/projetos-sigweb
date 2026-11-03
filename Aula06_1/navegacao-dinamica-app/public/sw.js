// Service Worker para o Sistema de Navegação PWA (SIG-Web)
const CACHE_NAME = 'sigweb-navegacao-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon.svg',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;
  // Não armazena em cache blocos de mapas de satélite ou OSM
  if (event.request.url.includes('tile.openstreetmap.org') || event.request.url.includes('arcgisonline.com')) {
    return;
  }

  // Páginas: rede primeiro. Se viessem do cache, um HTML antigo apontaria para
  // arquivos de um deploy anterior, que não existem mais, e a página quebraria.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match('/offline.html'))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
