/* Xino-Xano: guarda l'app al dispositiu perquè obri ràpid i funcioni amb mala connexió. */
const CACHE = 'xinoxano-v7';
const SHELL = ['./', 'index.html', 'data/banc.js', 'data/cangur.js', 'personatge.js', 'manifest.webmanifest', 'assets/icona.svg', 'assets/icona-petita.svg',
  'assets/icona-192.png', 'assets/icona-512.png', 'assets/logo-h.png', 'assets/logo-v.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Pàgina i dades: primer la xarxa (per tenir sempre l'última versió); si no n'hi ha, la còpia guardada.
  if (req.mode === 'navigate' || req.url.endsWith('banc.js') || req.url.endsWith('personatge.js') || req.url.endsWith('cangur.js') || req.url.endsWith('editable.js')) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // La resta (icones, logos, lletres): primer la còpia guardada.
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { if (res.ok && new URL(req.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })));
});
