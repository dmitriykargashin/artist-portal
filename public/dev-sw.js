// This is a no-op service worker to handle requests from previously cached DevTools
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
