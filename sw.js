/* बालाजी ब्लड सेंटर — Service Worker
   नीतियाँ:
   - HTML / manifest  → Network First (नया version तुरंत दिखे)
   - बाकी files      → Cache First (तेज़ चले)
   - पुराना cache      → हटा दिया जाता है
   - कोई CDN नहीं — React भी लोकल फ़ाइल से, इसलिए पहली बार भी ऑफ़लाइन चलता है  */
const CACHE = 'bcc-v36';
const SHELL = [
  './',
  './index.html',
  './js/app.js',
  './js/cloud.js',
  './img/logo.png',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-32.png',
  './img/donate-qr.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      /* cache:'reload' — browser ka purana HTTP cache (max-age) bypass karke
         hamesha server se taaza file lo, warna SW purana app.js precache kar leta hai */
      .then((c) => Promise.allSettled(SHELL.map((u) =>
        fetch(new Request(u, { cache: 'reload' })).then((res) => {
          if (res && res.ok) return c.put(u, res);
        })
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // क्लाउड (Firestore) की calls Service Worker के कैश में न जाएँ — हमेशा ताज़ा डेटा
  if (url.origin !== self.location.origin) return;

  // 1) पेज का HTML — पहले server से (नया version तुरंत दिखे),
  //    पर server गड़बड़ (502/404) या ऑफ़लाइन हो तो पुराना कैश दिखाओ।
  //    गड़बड़ वाला response कभी कैश में नहीं सेव होना चाहिए — वरना टूटा पेज
  //    ज़िंदा रहेगा और यूज़र को हमेशा टूटा दिखेगा।
  const isDoc = req.mode === 'navigate' || (req.destination === 'document') ||
    (url.origin === self.location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('.html')));
  if (isDoc) {
    e.respondWith(
      fetch(req).then((res) => {
        if (!res || !res.ok) return caches.match(req).then((r) => r || caches.match('./index.html'));
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 2) sw.js और manifest — पहले server, फिर कैश (ऑफ़लाइन भी चलना चाहिए)
  if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('manifest.webmanifest')) {
    e.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // 3) बाकी — cache first, फिर network
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
