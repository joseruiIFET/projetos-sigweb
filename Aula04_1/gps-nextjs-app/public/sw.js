// Service Worker para o Coletor GPS PWA (SIG-Web)
// IMPORTANTE: Em desenvolvimento local, NUNCA use Cache-First em HTML/JS
const CACHE_NAME = 'sigweb-gps-v2';

self.addEventListener('install', (event) => {
  // Força ativação imediata
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpa todos os caches antigos
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network-First: Sempre busca da rede primeiro para não congelar o código do Next.js
  if (!event.request.url.startsWith('http')) return;
  if (event.request.url.includes('openstreetmap.org')) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
