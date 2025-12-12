'use client';

import { useState, useEffect } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { CodeBlock } from '@/components/CodeBlock';
import { motion } from 'framer-motion';
import { usePWAInstallPrompt } from '@/hooks/use-pwa-install';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Download, Wifi, WifiOff, Share2, Bell, Database } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PWAPage() {
  const [activeTab, setActiveTab] = useState<'manifest' | 'service-worker' | 'offline' | 'install' | 'status'>('manifest');
  const { isPromptAvailable, isInstalled, prompt, dismiss } = usePWAInstallPrompt();
  const { isOnline, wasOffline } = useOnlineStatus();
  const [storageInfo, setStorageInfo] = useState<{ usage?: number; quota?: number }>({});

  useEffect(() => {
    // Get storage info
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        setStorageInfo({
          usage: estimate.usage,
          quota: estimate.quota,
        });
      });
    }
  }, []);

  const tabs = [
    { id: 'manifest', label: 'Web Manifest', icon: '📋' },
    { id: 'service-worker', label: 'Service Worker', icon: '⚙️' },
    { id: 'offline', label: 'Offline Support', icon: '📡' },
    { id: 'install', label: 'Installation', icon: '📥' },
    { id: 'status', label: 'Status', icon: '📊' },
  ];

  const storageUsagePercent = storageInfo.quota ? Math.round((storageInfo.usage! / storageInfo.quota) * 100) : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen">
      <SectionHeader title="Progressive Web App (PWA)" />

      <motion.div variants={item} className="max-w-5xl mx-auto mt-16 space-y-12">
        {/* Installation CTA */}
        {isPromptAvailable && !isInstalled && (
          <motion.div
            variants={item}
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-xl p-6 backdrop-blur flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Install Personal OS
              </h3>
              <p className="text-slate-300">Add this app to your home screen for quick access</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => prompt()}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => dismiss()}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}

        {/* Status Cards */}
        <motion.div variants={item} className="grid md:grid-cols-3 gap-4">
          {/* Online Status */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <h4 className="font-semibold text-white">Network Status</h4>
            </div>
            <p className={`text-sm ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </p>
            {wasOffline && <p className="text-xs text-slate-400 mt-2">Connection restored</p>}
          </div>

          {/* Installation Status */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-white">App Status</h4>
            </div>
            <p className={`text-sm ${isInstalled ? 'text-blue-400' : 'text-slate-400'}`}>
              {isInstalled ? '✓ Installed' : 'Available to install'}
            </p>
          </div>

          {/* Storage Status */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-white">Storage</h4>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${storageUsagePercent}%` }} />
              </div>
              <p className="text-xs text-slate-400">
                {storageInfo.usage ? `${(storageInfo.usage / 1024 / 1024).toFixed(1)}MB` : 'N/A'} /{' '}
                {storageInfo.quota ? `${(storageInfo.quota / 1024 / 1024).toFixed(0)}MB` : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold">
              ✓
            </span>
            PWA Features Implemented
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Web Manifest',
                desc: 'App metadata, icons, shortcuts, display mode',
              },
              {
                title: 'Service Worker',
                desc: 'Offline support, caching strategies, background sync',
              },
              {
                title: 'Offline Support',
                desc: 'Network-first and cache-first strategies with fallbacks',
              },
              {
                title: 'Installation',
                desc: 'Add to home screen, app shortcuts, install prompt',
              },
              {
                title: 'Push Notifications',
                desc: 'Browser notifications with service worker support',
              },
              {
                title: 'Storage APIs',
                desc: 'Persistent storage, IndexedDB, Cache API, localStorage',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
              >
                <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Manifest Tab */}
          {activeTab === 'manifest' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Web Manifest Configuration</h4>
                <p className="text-slate-400 text-sm mb-4">
                  The manifest.json file defines your PWA's appearance and behavior when installed
                </p>
                <CodeBlock
                  language="json"
                  code={`{
  "name": "Personal OS - Portfolio & Systems",
  "short_name": "Personal OS",
  "description": "A personal portfolio designed as an operating system",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#06b6d4",
  "background_color": "#0f172a",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screenshot-540x720.png",
      "sizes": "540x720",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "View Projects",
      "url": "/projects"
    }
  ]
}`}
                />
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Key Manifest Properties</h4>
                <div className="space-y-3 text-sm">
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <p className="font-mono text-cyan-400">name</p>
                    <p className="text-slate-400">Full app name (shown on install)</p>
                  </div>
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <p className="font-mono text-cyan-400">display</p>
                    <p className="text-slate-400">standalone = fullscreen app, no browser UI</p>
                  </div>
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <p className="font-mono text-cyan-400">icons</p>
                    <p className="text-slate-400">Multiple sizes for different devices</p>
                  </div>
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <p className="font-mono text-cyan-400">screenshots</p>
                    <p className="text-slate-400">Preview images for app store listings</p>
                  </div>
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <p className="font-mono text-cyan-400">shortcuts</p>
                    <p className="text-slate-400">Quick action links from home screen</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Service Worker Tab */}
          {activeTab === 'service-worker' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Service Worker Strategies</h4>
                <div className="space-y-4 text-sm">
                  <div className="bg-slate-800/50 rounded p-3">
                    <p className="font-semibold text-cyan-400 mb-1">Cache-First</p>
                    <p className="text-slate-400">Images, fonts, CSS → Fast offline support</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3">
                    <p className="font-semibold text-cyan-400 mb-1">Network-First</p>
                    <p className="text-slate-400">API calls → Fresh data when possible</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3">
                    <p className="font-semibold text-cyan-400 mb-1">Stale-While-Revalidate</p>
                    <p className="text-slate-400">Documents, scripts → Quick load + background refresh</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Service Worker Lifecycle</h4>
                <CodeBlock
                  language="javascript"
                  code={`// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter(n => n !== 'v1').map(n => caches.delete(n))
      );
    })
  );
});

// Fetch: Intercept network requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});`}
                />
              </div>
            </motion.div>
          )}

          {/* Offline Tab */}
          {activeTab === 'offline' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Offline Support Architecture</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="text-2xl">📱</div>
                    <div>
                      <p className="font-semibold text-white">User Goes Offline</p>
                      <p className="text-slate-400 text-sm">
                        Service Worker intercepts network requests and returns cached content
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">💾</div>
                    <div>
                      <p className="font-semibold text-white">Cache Storage</p>
                      <p className="text-slate-400 text-sm">
                        Multiple cache stores for different content types (CSS, JS, images, API)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">🔄</div>
                    <div>
                      <p className="font-semibold text-white">Sync on Reconnect</p>
                      <p className="text-slate-400 text-sm">
                        Background sync API queues actions taken offline and syncs when online
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">🚨</div>
                    <div>
                      <p className="font-semibold text-white">Offline Fallback</p>
                      <p className="text-slate-400 text-sm">
                        Fallback offline.html page for navigations when cache is empty
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Offline Hook Usage</h4>
                <CodeBlock
                  language="typescript"
                  code={`import { useOnlineStatus } from '@/hooks/use-online-status';

export function MyComponent() {
  const { isOnline, wasOffline } = useOnlineStatus();

  return (
    <div>
      {!isOnline && (
        <div className="warning">
          You're offline. Some features unavailable.
        </div>
      )}
      {wasOffline && isOnline && (
        <div className="success">
          Connection restored! Syncing data...
        </div>
      )}
    </div>
  );
}`}
                />
              </div>
            </motion.div>
          )}

          {/* Install Tab */}
          {activeTab === 'install' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Installation Methods</h4>
                <div className="space-y-4 text-sm">
                  <div className="border border-slate-700 rounded p-4">
                    <p className="font-semibold text-white mb-2">📱 Mobile Browser</p>
                    <p className="text-slate-400">
                      Tap share menu → "Add to Home Screen" or look for install prompt
                    </p>
                  </div>
                  <div className="border border-slate-700 rounded p-4">
                    <p className="font-semibold text-white mb-2">🖥️ Desktop (Chrome/Edge)</p>
                    <p className="text-slate-400">
                      Click install icon in address bar or use menu → "Install app"
                    </p>
                  </div>
                  <div className="border border-slate-700 rounded p-4">
                    <p className="font-semibold text-white mb-2">⌨️ Programmatic Install</p>
                    <p className="text-slate-400">
                      Use beforeinstallprompt event to show custom install button
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Install Prompt Hook</h4>
                <CodeBlock
                  language="typescript"
                  code={`import { usePWAInstallPrompt } from '@/hooks/use-pwa-install';

export function InstallButton() {
  const { isPromptAvailable, isInstalled, prompt } = usePWAInstallPrompt();

  if (isInstalled) {
    return <div>✓ App installed</div>;
  }

  if (!isPromptAvailable) {
    return null; // Don't show button if not available
  }

  return (
    <button onClick={() => prompt()}>
      Install Personal OS
    </button>
  );
}`}
                />
              </div>
            </motion.div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <motion.div variants={item} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4">✓ Implementation Status</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>✓ Web Manifest (public/manifest.json)</li>
                    <li>✓ Service Worker (public/sw.js)</li>
                    <li>✓ Cache strategies (network-first, cache-first, stale-while-revalidate)</li>
                    <li>✓ Offline fallback page</li>
                    <li>✓ Background sync support</li>
                    <li>✓ Push notification handling</li>
                    <li>✓ PWA Initializer component</li>
                    <li>✓ Installation prompt hook</li>
                    <li>✓ Online status hook</li>
                  </ul>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4">📊 Feature Matrix</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-slate-300">Installable</span>
                      <span className="text-green-400">✓ Supported</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-300">Offline Support</span>
                      <span className="text-green-400">✓ Full</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-300">Add to Home Screen</span>
                      <span className="text-green-400">✓ Available</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-300">Notifications</span>
                      <span className="text-green-400">✓ Enabled</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-300">Standalone Mode</span>
                      <span className="text-green-400">✓ Supported</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-4">Installation Requirements</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>✓ Valid HTTPS (or localhost for dev)</li>
                  <li>✓ Web manifest with icons and display mode</li>
                  <li>✓ Service worker registered</li>
                  <li>✓ Responsive design that works on mobile</li>
                  <li>✓ Proper metadata in HTML head</li>
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Integration Guide */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur"
        >
          <h3 className="text-2xl font-bold text-white mb-6">PWA Benefits</h3>

          <div className="grid md:grid-cols-2 gap-6 text-slate-300 text-sm">
            <div className="flex gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-semibold text-white">Performance</p>
                <p>Instant load from cache, reduced bandwidth usage offline</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-semibold text-white">Native Feel</p>
                <p>Standalone app experience without app store friction</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">💾</span>
              <div>
                <p className="font-semibold text-white">Offline Ready</p>
                <p>Works offline with service worker caching and background sync</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-semibold text-white">Analytics</p>
                <p>Track installation, engagement, and offline usage patterns</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-semibold text-white">Push Notifications</p>
                <p>Re-engage users with timely, relevant notifications</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🌍</span>
              <div>
                <p className="font-semibold text-white">Cross Platform</p>
                <p>Works on all browsers and devices with one codebase</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
