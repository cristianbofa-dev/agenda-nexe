/* Agenda NEXE · store.js
 * Persistència local del dispositiu.
 *  - Estat principal: IndexedDB (base "nexe", magatzem "kv", clau "state").
 *  - Mirall: localStorage["nexe"] (mateix text JSON). En obrir es tria el més recent dels dos.
 *  - Còpies internes ("desfer"): IndexedDB, magatzem "snaps" (si IndexedDB no va, localStorage).
 *  - Dades malmeses: es guarden intactes al magatzem "kv" amb clau "corrupte_<data>_<origen>".
 * Cap funció d'aquest fitxer esborra l'estat principal. Totes les operacions retornen promeses
 * i no llancen excepcions cap a l'app sense que l'app les pugui tractar.
 */
const Store = (() => {
  const DB_NAME = "nexe", DB_VER = 1;
  let db = null;
  let pending = Promise.resolve();
  let seq = 0;

  function open() {
    return new Promise(res => {
      try {
        if (!("indexedDB" in self)) return res(false);
        const r = indexedDB.open(DB_NAME, DB_VER);
        r.onupgradeneeded = () => {
          const d = r.result;
          if (!d.objectStoreNames.contains("kv")) d.createObjectStore("kv");
          if (!d.objectStoreNames.contains("snaps")) d.createObjectStore("snaps", { keyPath: "k" });
        };
        r.onsuccess = () => { db = r.result; db.onversionchange = () => { try { db.close(); } catch (e) {} db = null; }; res(true); };
        r.onerror = () => res(false);
        r.onblocked = () => res(false);
      } catch (e) { res(false); }
    });
  }

  function req(store, mode, fn) {
    return new Promise((res, rej) => {
      if (!db) return rej(new Error("IndexedDB no disponible"));
      try {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        let out;
        const r = fn(s);
        if (r) r.onsuccess = () => { out = r.result; };
        t.oncomplete = () => res(out);
        t.onerror = () => rej(t.error || new Error("error IndexedDB"));
        t.onabort = () => rej(t.error || new Error("IndexedDB avortat"));
      } catch (e) { rej(e); }
    });
  }

  const available = () => !!db;
  const getState = () => db ? req("kv", "readonly", s => s.get("state")) : Promise.resolve(null);

  function putState(json) {
    const p = req("kv", "readwrite", s => s.put(json, "state"));
    pending = pending.then(() => p).catch(() => {});
    return p;
  }

  // Espera que acabin les escriptures en curs (abans de recarregar per actualitzar).
  const flush = () => pending.then(() => {}, () => {});

  async function keepCorrupt(raw, src) {
    const k = "corrupte_" + new Date().toISOString().replace(/[:.]/g, "-") + "_" + src;
    if (db) { try { await req("kv", "readwrite", s => s.put(String(raw), k)); return k; } catch (e) {} }
    try { localStorage.setItem("nexe_" + k, String(raw)); return "nexe_" + k; } catch (e) { return null; }
  }

  async function listCorrupt() {
    const out = [];
    if (db) { try { (await req("kv", "readonly", s => s.getAllKeys())).forEach(k => { if (String(k).startsWith("corrupte_")) out.push(String(k)); }); } catch (e) {} }
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && (k.startsWith("nexe_corrupte_"))) out.push(k); } } catch (e) {}
    return out.sort();
  }

  async function getCorrupt(k) {
    if (k.startsWith("nexe_")) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    try { return await req("kv", "readonly", s => s.get(k)); } catch (e) { return null; }
  }

  // ---- còpies internes ----
  const LSK = "nexe_snaps_fallback";
  function lsSnaps() { try { const L = JSON.parse(localStorage.getItem(LSK) || "[]"); return Array.isArray(L) ? L : []; } catch (e) { return []; } }

  async function addSnap(meta, data, max) {
    const rec = Object.assign({ k: Date.now() + "_" + String(++seq).padStart(4, "0") }, meta, { data });
    if (db) {
      await req("snaps", "readwrite", s => s.put(rec));
      const keys = (await req("snaps", "readonly", s => s.getAllKeys())).map(String).sort();
      const sobren = keys.slice(0, Math.max(0, keys.length - max));
      if (sobren.length) await req("snaps", "readwrite", s => { sobren.forEach(k => s.delete(k)); return null; });
      return rec.k;
    }
    const L = lsSnaps(); L.push(rec);
    while (L.length > max) L.shift();
    localStorage.setItem(LSK, JSON.stringify(L)); // pot llançar: l'app ho tracta com a fallada
    return rec.k;
  }

  async function listSnaps() {
    let L = [];
    if (db) { try { L = await req("snaps", "readonly", s => s.getAll()); } catch (e) { L = []; } }
    else L = lsSnaps();
    return L.map(x => ({ k: x.k, t: x.t, why: x.why, c: x.c, v: x.v })).sort((a, b) => (a.k < b.k ? 1 : -1));
  }

  async function getSnap(k) {
    if (db) { try { const r = await req("snaps", "readonly", s => s.get(k)); return r ? r.data : null; } catch (e) { return null; } }
    const r = lsSnaps().find(x => x.k === k); return r ? r.data : null;
  }

  return { open, available, getState, putState, flush, keepCorrupt, listCorrupt, getCorrupt, addSnap, listSnaps, getSnap };
})();
