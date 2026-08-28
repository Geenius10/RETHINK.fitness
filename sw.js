const CACHE='rethink-fitness-20260828-plans-empty1';
const ASSETS=[
 './', './index.html', './runtime-current.js?v=20260827r1', './foods.js?v=20260821m', './manifest.webmanifest',
 './icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))))
});

self.addEventListener('push',event=>{
 let data={};
 try{data=event.data?event.data.json():{}}catch{data={body:event.data?event.data.text():''}}
 const title=data.title||'ReThink. Fitness';
 const options={
  body:data.body||'',
  tag:data.tag||'rethink-reminder',
  renotify:true,
  icon:'./icons/icon-192.png',
  badge:'./icons/icon-192.png',
  data:{url:data.url||'./'}
 };
 event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const target=event.notification.data?.url||'./';
 event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const c of list){if('focus'in c){try{c.navigate?.(target)}catch{}return c.focus()}}
  return clients.openWindow?clients.openWindow(target):undefined
 }));
});
