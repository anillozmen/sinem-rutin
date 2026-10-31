const C = 'rutin-v1';
self.addEventListener('install', e => e.waitUntil(
  caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon.png'])).then(() => self.skipWaiting())
));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
// Önce ağ (güncellemeler kendiliğinden gelsin), ağ yoksa önbellek.
self.addEventListener('fetch', e => e.respondWith(
  fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open(C).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }))
));
