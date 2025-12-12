'use client';

import { useEffect } from 'react';

/**
 * PWA Initializer Component
 * Registers service worker and initializes PWA features
 * Should be included in root layout
 */
export function PWAInitializer() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
        .then((registration) => {
          console.log('Service Worker registered successfully');

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Request persistent storage
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage
        .persist()
        .then((persistent) => {
          console.log(`Persistent storage ${persistent ? 'granted' : 'denied'}`);
        })
        .catch((error) => {
          console.error('Persistent storage request failed:', error);
        });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't auto-request, let user decide
      console.log('Notifications available but not requested');
    }
  }, []);

  return null;
}
