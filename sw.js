/* Agenda NEXE · service worker
 * Guarda els arxius de l'app per funcionar sense connexió. NO toca mai les dades
 * (IndexedDB i localStorage): una actualització només canvia el codi.
 * Una versió nova s'instal·la en segon pla i només s'activa quan l'usuari prem «Actualitzar».
 */
const VER = "nexe-2026.11.10-pwa1";
const FILES = ["./", "index.html", "css/app.css", "js/store.js", "js/platform.js", "js/app.js",
  "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("nexe-") && k !== VER).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("message", e => { if (e.data === "skip") self.skipWaiting(); });

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VER).then(c => c.match(r, { ignoreSearch: true }).then(m => m ||
      fetch(r).catch(() => (r.mode === "navigate" ? c.match("index.html") : Response.error()))))
  );
});
