# ReThink. Fitness Push Backend

## Render
Create a Node Web Service from this folder/repository.

Build command: `npm install`
Start command: `npm start`

Environment variables:
- `APP_ORIGIN=https://geenius10.github.io`
- `VAPID_PUBLIC_KEY=...`
- `VAPID_PRIVATE_KEY=...`
- `VAPID_SUBJECT=mailto:YOUR_EMAIL`
- `DATABASE_URL=...` (recommended for persistent subscriptions)

Generate VAPID keys locally with:
`npm install`
`npm run generate-vapid`

After deployment, copy the Render URL (for example `https://rethink-fitness-push.onrender.com`) into ReThink. Fitness → Settings → Reminders → Push server.

Important: Render Free web services sleep after 15 minutes without inbound traffic. The in-process scheduler cannot send a reminder while the service is asleep. For reliable scheduled pushes, use an always-on paid web service or an external/Render scheduled trigger. Render Cron Jobs have a minimum monthly charge and can be used to wake/run scheduling logic. Also, free Render Key Value is not persistent and free Postgres expires after 30 days, so persistent production subscriptions need a persistent datastore.
