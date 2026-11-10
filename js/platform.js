/* Agenda NEXE · platform.js
 * Funcions del navegador, sense cap dependència de claude.ai:
 *  - desar arxius (descàrrega al Mac, full de compartir a l'iPad),
 *  - emmagatzematge persistent,
 *  - service worker i avís d'actualització.
 */
const Plat = (() => {
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = () => (self.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;

  function download(name, text, mime) {
    const b = new Blob([text], { type: mime });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u; a.download = name; a.rel = "noopener"; a.style.display = "none";
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(u); a.remove(); }, 4000);
  }

  // Ha de cridar-se directament des d'un clic (el full de compartir ho exigeix).
  // Retorna "ok", "cancel" o "error".
  async function saveFile(name, text, mime, preferShare) {
    let file = null;
    try { file = new File([text], name, { type: mime }); } catch (e) {}
    if (file && (isIOS() || preferShare) && navigator.canShare && navigator.share) {
      let pot = false;
      try { pot = navigator.canShare({ files: [file] }); } catch (e) {}
      if (pot) {
        try { await navigator.share({ files: [file], title: name }); return "ok"; }
        catch (e) { if (e && e.name === "AbortError") return "cancel"; /* si falla, es descarrega */ }
      }
    }
    try { download(name, text, mime); return "ok"; } catch (e) { return "error"; }
  }

  async function persist() {
    try {
      if (!navigator.storage || !navigator.storage.persisted) return null;
      if (await navigator.storage.persisted()) return true;
      return navigator.storage.persist ? await navigator.storage.persist() : null;
    } catch (e) { return null; }
  }

  let wantReload = false, waiting = null;
  function registerSW(onUpdate) {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (wantReload) location.reload(); });
    navigator.serviceWorker.register("sw.js").then(reg => {
      const check = () => { if (reg.waiting && navigator.serviceWorker.controller) { waiting = reg.waiting; onUpdate(); } };
      check();
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        if (w) w.addEventListener("statechange", () => { if (w.state === "installed") check(); });
      });
      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    }).catch(() => {});
  }

  // Aplica la versió nova: primer s'acaben les escriptures pendents, després es recarrega.
  async function applyUpdate(beforeReload) {
    if (!waiting) return false;
    if (beforeReload) await beforeReload();
    wantReload = true;
    waiting.postMessage("skip");
    return true;
  }

  return { isIOS, standalone, saveFile, persist, registerSW, applyUpdate };
})();
