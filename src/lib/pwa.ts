/**
 * PWA Utilities
 * Service worker registration, installation, and offline support utilities
 */

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('Service Worker registered successfully:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service Workers unregistered successfully');
    return true;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Check if app is installed (PWA)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for display mode
  const displayMode = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

  return displayMode;
}

/**
 * Check if app is in PWA mode (not in browser tab)
 */
export function isInPWAMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const isStandalone = (window.navigator as any).standalone === true;
  const isDisplayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;

  return isStandalone || isDisplayModeStandalone;
}

/**
 * Listen for install prompt event and provide install button
 */
export function useInstallPrompt(callback: (event: InstallPromptEvent) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    callback(event as InstallPromptEvent);
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };
}

/**
 * Get installed app display mode
 */
export function getDisplayMode(): 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser' {
  if (typeof window === 'undefined') {
    return 'browser';
  }

  // Check fullscreen
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }

  // Check standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }

  // Check minimal-ui
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }

  return 'browser';
}

/**
 * Check online/offline status
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function useOnlineStatus(callback: (isOnline: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Cache API utilities for offline support
 */
export const cacheVersion = 'personal-os-v1';

export async function cacheAssets(assets: string[]): Promise<void> {
  try {
    const cache = await caches.open(cacheVersion);
    await cache.addAll(assets);
    console.log(`Cached ${assets.length} assets`);
  } catch (error) {
    console.error('Cache assets failed:', error);
  }
}

export async function getCachedAsset(url: string): Promise<Response | null> {
  try {
    const cache = await caches.open(cacheVersion);
    const response = await cache.match(url);
    return response || null;
  } catch (error) {
    console.error('Get cached asset failed:', error);
    return null;
  }
}

export async function clearCache(): Promise<void> {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('Cache cleared');
  } catch (error) {
    console.error('Clear cache failed:', error);
  }
}

/**
 * Request persistent storage permission
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false;
  }

  try {
    const persistent = await navigator.storage.persist();
    console.log(`Persistent storage ${persistent ? 'granted' : 'denied'}`);
    return persistent;
  } catch (error) {
    console.error('Persistent storage request failed:', error);
    return false;
  }
}

/**
 * Check if persistent storage is available
 */
export async function isPersistentStorageAvailable(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.persisted) {
    return false;
  }

  try {
    return await navigator.storage.persisted();
  } catch (error) {
    console.error('Check persistent storage failed:', error);
    return false;
  }
}

/**
 * Share content via native share sheet
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    console.log('Web Share API not supported');
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Share failed:', error);
    }
    return false;
  }
}

/**
 * Check if native share is supported
 */
export function isNativeShareSupported(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return !!navigator.share;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') {
    return 'denied';
  }

  return await Notification.requestPermission();
}

/**
 * Send notification
 */
export async function sendNotification(title: string, options?: NotificationOptions): Promise<void> {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
}

/**
 * Get device storage info
 */
export async function getStorageInfo(): Promise<StorageEstimate | null> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return null;
  }

  try {
    return await navigator.storage.estimate();
  } catch (error) {
    console.error('Get storage info failed:', error);
    return null;
  }
}
