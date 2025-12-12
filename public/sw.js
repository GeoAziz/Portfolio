/**
 * Service Worker
 * Handles offline support, caching, and background sync
 * File: public/sw.js
 */

const CACHE_VERSION = 'personal-os-v1';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/globals.css',
];

// Precache assets on install
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Cache addAll error:', err);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );

  self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );

  self.clients.claim();
});

// Network-first strategy for API calls, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external URLs
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for navigation
  if (request.mode === 'navigate') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Cache-first for images
  if (request.destination === 'image') {
    event.respondWith(
      cacheFirst(request).catch(() => {
        // Return placeholder image if cache misses
        return new Response(
          '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#e5e7eb" width="100" height="100"/></svg>',
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      })
    );
    return;
  }

  // Cache-first for stylesheets and fonts
  if (request.destination === 'style' || request.destination === 'font') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for documents and scripts
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Network-first strategy
 * Try network first, fall back to cache, then offline page
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network request failed, trying cache:', request.url);

    // Try cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline response
    return getOfflineResponse(request);
  }
}

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Cache miss and network failed:', request.url);
    return getOfflineResponse(request);
  }
}

/**
 * Stale-while-revalidate strategy
 * Return cached response immediately, update in background
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(CACHE_VERSION);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || networkPromise;
}

/**
 * Get offline response based on request type
 */
async function getOfflineResponse(request) {
  // For navigations, return offline page
  if (request.mode === 'navigate') {
    const cached = await caches.match('/offline.html');
    if (cached) {
      return cached;
    }

    // Fallback offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: #0f172a;
              color: #e2e8f0;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              max-width: 500px;
              text-align: center;
            }
            h1 {
              font-size: 2em;
              margin: 0 0 10px 0;
            }
            p {
              color: #cbd5e1;
              margin: 0 0 20px 0;
              line-height: 1.6;
            }
            button {
              background: #06b6d4;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 1em;
            }
            button:hover {
              background: #0891b2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📡 Offline</h1>
            <p>You're currently offline. Some features may not be available.</p>
            <button onclick="location.reload()">Try Again</button>
          </div>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }

  // For other requests, return a generic error response
  return new Response('Offline - Content not available', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync event:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
});

/**
 * Sync any pending data when connection is restored
 */
async function syncPendingData() {
  try {
    // Get pending items from IndexedDB or localStorage
    const pending = JSON.parse(localStorage.getItem('pending_sync') || '[]');

    if (pending.length === 0) {
      return;
    }

    // Send pending data to server
    for (const item of pending) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: JSON.stringify(item.body),
        });

        if (response.ok) {
          // Remove synced item
          const updated = pending.filter((p) => p.id !== item.id);
          localStorage.setItem('pending_sync', JSON.stringify(updated));
        }
      } catch (error) {
        console.warn('[ServiceWorker] Sync error for item:', item.id, error);
      }
    }

    // Notify clients that sync completed
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        count: pending.length,
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');

  const data = event.data?.json?.() || {};
  const title = data.title || 'Personal OS';
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192-maskable.png',
    tag: data.tag || 'notification',
    ...data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event.notification.tag);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if app is already open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if not found
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
