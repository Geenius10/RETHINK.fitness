const CACHE='rethink-fitness-20260915k-name-classification';
const ASSETS=[
 './', './index.html','./app.css','./app-core.js','./runtime-current.js','./foods.js','./manifest.webmanifest',
 './logo.png','./icon-180.png','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png','./favicon-64.png'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});return response}).catch(()=>caches.match(event.request).then(hit=>hit||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))))
});
