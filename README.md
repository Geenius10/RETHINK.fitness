# ReThink. Fitness Push Backend

## Render deployment
Create a Node Web Service from this folder/repository.

- Build command: `npm install`
- Start command: `npm start`

Environment variables:
- `APP_ORIGIN=https://YOUR-GITHUB-PAGES-ORIGIN`
- `VAPID_PUBLIC_KEY=...`
- `VAPID_PRIVATE_KEY=...`
- `VAPID_SUBJECT=mailto:YOUR_EMAIL`
- `DATABASE_URL=...` for persistent subscriptions
- `CRON_SECRET=...` for the protected `/api/tick` wake/scheduler endpoint

Generate VAPID keys locally with:
`npm install && npm run generate-vapid`

After deployment, enter the Render service URL in **ReThink. Fitness → Einstellungen → Erinnerungen → Push-Server** and save from an installed iPhone/iPad PWA or another Push-capable browser.

## Reliable scheduling
The process also checks reminders while the web service is awake. Render Free services can sleep, so production scheduling should call `POST /api/tick` on a regular schedule and include the header `x-cron-secret: <CRON_SECRET>`. The endpoint is rejected when no secret is configured or the header does not match.

Persistent production use also needs a persistent PostgreSQL `DATABASE_URL`; otherwise subscriptions exist only in process memory and disappear on restart.

## iPhone/iPad
Web Push requires the site to be installed on the Home Screen and notification permission to be granted from the user gesture in the app. ReThink. Fitness requests permission only when the user taps **Speichern & Mitteilungen aktivieren**.
