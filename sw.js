const C = 'rutin-v1';
self.addEventListener('install', e => e.waitUntil(
  caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon.png'])).then(() => self.skipWaiting())
));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
// Önce ağ (güncellemeler kendiliğinden gelsin), ağ yoksa önbellek.
self.addEventListener('fetch', e => {
  // Firebase istekleri (giriş, veritabanı) önbelleğe alınmaz; sadece uygulama dosyaları ve SDK.
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && u.host !== 'www.gstatic.com')) return;
  e.respondWith(
  fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open(C).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
