// Network first, cache as fallback: updates show up straight away, and the app still opens with a weak signal on site.
const CACHE = 'intrakore-v1';
const SHELL = ['./', 'index.html', 'desk.html', 'config.js', 'db.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'talabat.svg'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
