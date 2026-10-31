/* Guarda la página para abrirla sin señal. Primero pide lo nuevo; las fotos de Amazon nunca se guardan */
const CACHE = 'mis-cosas-v1';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','app.webmanifest'])));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(l=>Promise.all(l.filter(x=>x!==CACHE&&x.split('-')[0]===CACHE.split('-')[0]).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u = new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{
    const c = r.clone();
    caches.open(CACHE).then(x=>x.put(e.request,c));
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
