const CACHE_NAME = 'pwa-profile-v1';
const DYNAMIC_CACHE = 'pwa-profile-dynamic-v1';

// Статичні ресурси для кешування
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './styles/auth.css',
  './styles/profile.css',
  './styles/games.css',
  './js/config.js',
  './js/i18n.js',
  './js/db.js',
  './js/ui.js',
  './js/router.js',
  './js/auth.js',
  './js/app.js',
  './js/pages/login.js',
  './js/pages/register.js',
  './js/pages/forgot-password.js',
  './js/pages/profile.js',
  './js/pages/settings.js',
  './js/pages/about.js',
  './js/pages/games.js',
  './js/pages/game-words.js',
  './js/pages/game-memory.js',
  './js/pages/music.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активація Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map(name => {
              console.log('[SW] Deleting the old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Обробка запитів
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ігноруємо запити до chrome-extension та інших протоколів
  if (!url.protocol.startsWith('https')) {
    return;
  }

  // Стратегія Cache First для статичних ресурсів
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Стратегія Network First для HTMLS
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Стратегія Stale While Revalidate для інших ресурсів
  event.respondWith(staleWhileRevalidate(request));
});

// Cache First: спочатку кеш, потім мережа
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[SW] Download error:', error);
    return new Response('Offline mode', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First: спочатку мережа, потім кеш
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return caches.match('/index.html');
  }
}

// Stale While Revalidate: кеш одразу, оновлення у фоні
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Повідомлення від клієнта
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(name => caches.delete(name))
          );
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Синхронізація у фоні (Background Sync)
self.addEventListener('sync', event => {
  console.log('[SW] Background Sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Data synchronisation...');
  // Cинхронізації
  return Promise.resolve();
}