# Icon diagnosis and final fix
Canonical icon chain:
- HTML: `./apple-touch-icon.png?v=20260823-icon-final-6`
- Manifest: `./icons/icon-192.png`, `./icons/icon-512.png`, `./icons/icon-maskable-512.png`
- Favicon: `./favicon.png`
- Service worker update uses `updateViaCache: none`
- Service worker deletes older caches on activation.
- Root fallback icon copies are included.
