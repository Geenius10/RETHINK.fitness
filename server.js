import express from 'express';
import cors from 'cors';
import webpush from 'web-push';
import pg from 'pg';

const app=express();
const PORT=process.env.PORT||10000;
const ORIGIN=process.env.APP_ORIGIN||'https://geenius10.github.io';
const PUBLIC=process.env.VAPID_PUBLIC_KEY;
const PRIVATE=process.env.VAPID_PRIVATE_KEY;
const SUBJECT=process.env.VAPID_SUBJECT||'mailto:admin@example.com';
const CRON_SECRET=process.env.CRON_SECRET||'';
if(!PUBLIC||!PRIVATE) throw new Error('VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are required');
webpush.setVapidDetails(SUBJECT,PUBLIC,PRIVATE);
app.use(cors({origin:(origin,cb)=>!origin||origin===ORIGIN?cb(null,true):cb(new Error('Origin not allowed'))}));
app.use(express.json({limit:'64kb'}));

const pool=process.env.DATABASE_URL?new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false}):null;
const memory=new Map();

async function init(){
 if(!pool)return;
 await pool.query(`CREATE TABLE IF NOT EXISTS push_subscriptions(
  endpoint TEXT PRIMARY KEY, subscription JSONB NOT NULL, timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
  language TEXT NOT NULL DEFAULT 'de', reminders JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_sent JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
}
async function upsert(x){
 const endpoint=x.subscription?.endpoint;if(!endpoint)throw new Error('Missing endpoint');
 const row={endpoint,subscription:x.subscription,timezone:x.timezone||'Europe/Berlin',language:x.language==='en'?'en':'de',reminders:x.reminders||{},last_sent:{}};
 if(!pool){const prev=memory.get(endpoint);memory.set(endpoint,{...row,last_sent:prev?.last_sent||{}});return}
 await pool.query(`INSERT INTO push_subscriptions(endpoint,subscription,timezone,language,reminders)
 VALUES($1,$2,$3,$4,$5) ON CONFLICT(endpoint) DO UPDATE SET subscription=$2,timezone=$3,language=$4,reminders=$5,updated_at=NOW()`,
 [endpoint,row.subscription,row.timezone,row.language,row.reminders])
}
async function remove(endpoint){if(!pool){memory.delete(endpoint);return}await pool.query('DELETE FROM push_subscriptions WHERE endpoint=$1',[endpoint])}
async function allRows(){if(!pool)return [...memory.values()];return (await pool.query('SELECT * FROM push_subscriptions')).rows}
async function saveLast(endpoint,last){if(!pool){const x=memory.get(endpoint);if(x)x.last_sent=last;return}await pool.query('UPDATE push_subscriptions SET last_sent=$2 WHERE endpoint=$1',[endpoint,last])}

app.get('/',(req,res)=>res.json({ok:true,service:'ReThink. Fitness Push'}));
app.get('/health',(req,res)=>res.json({ok:true}));
app.get('/api/vapid-public-key',(req,res)=>res.type('text/plain').send(PUBLIC));
app.post('/api/subscribe',async(req,res)=>{try{await upsert(req.body);res.json({ok:true})}catch(e){res.status(400).send(e.message)}});
app.post('/api/unsubscribe',async(req,res)=>{try{await remove(req.body?.endpoint);res.json({ok:true})}catch(e){res.status(400).send(e.message)}});

function localParts(tz){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
 return Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]))
}
async function tick(){
 const rows=await allRows();
 for(const row of rows){
  let p;try{p=localParts(row.timezone)}catch{p=localParts('Europe/Berlin')}
  const date=`${p.year}-${p.month}-${p.day}`,time=`${p.hour}:${p.minute}`;
  const last=row.last_sent||{},rem=row.reminders||{};
  for(const kind of ['drink','food']){
   const cfg=rem[kind];if(!cfg?.enabled||cfg.time!==time||last[kind]===date)continue;
   const en=row.language==='en';
   const payload=JSON.stringify({
    title:'ReThink. Fitness',
    body:kind==='drink'?(en?'Time to drink some water.':'Zeit, etwas zu trinken.'):(en?'Time for a meal.':'Zeit für eine Mahlzeit.'),
    tag:`rethink-${kind}-${date}`,url:'./'
   });
   try{
    await webpush.sendNotification(row.subscription,payload);
    last[kind]=date;await saveLast(row.endpoint,last)
   }catch(e){
    if(e.statusCode===404||e.statusCode===410)await remove(row.endpoint);
    else console.error('push failed',e.statusCode||'',e.message)
   }
  }
 }
}
app.post('/api/tick',async(req,res)=>{
 if(!CRON_SECRET||req.get('x-cron-secret')!==CRON_SECRET)return res.status(401).json({ok:false});
 try{await tick();res.json({ok:true})}catch(e){console.error(e);res.status(500).json({ok:false})}
});

await init();
setInterval(()=>tick().catch(console.error),30000);
app.listen(PORT,()=>console.log(`ReThink push listening on ${PORT}`));
