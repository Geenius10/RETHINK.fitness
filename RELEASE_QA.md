# ReThink. Fitness – Release-QA und Geräteabnahme

Stand: 27.08.2026, Release Candidate nach Phase 14.

## Automatisch geprüft
- JavaScript-Syntax: bestanden.
- Inline-JavaScript-Syntax: bestanden.
- Release-Smoke-Test: **22/22 bestanden**. Die vier zuvor roten Checks waren veraltete Test-Strings nach der Dokumentkonsolidierung; die zugrunde liegenden Funktionen waren im Runtime-Code vorhanden. Die Assertions wurden auf die aktuelle Master-Spezifikation und die tatsächlichen Implementierungsmerkmale ausgerichtet.
- Service-Worker-Precache enthält ausschließlich vorhandene Dateien.
- Runtime-/Cache-Version konsistent: `20260827r1` / `rethink-fitness-20260827-release1`.
- Keine verbleibenden mehrfachen Runtime-Overrides aus der Ausgangskonsolidierung.
- Plan-/Partner-Pipeline, 0:00-Pause, Single-Recommendation, Keyboard-Manager, Resume-Regel und Backup-Katalogschutz statisch vorhanden.
- Push-Settings über `openSettingsPage()` → `#settingsBody`.
- Notification-Icons verweisen auf vorhandene Assets.

## Geräteabnahme vor öffentlichem Launch
Diese Punkte können nicht seriös durch die Build-Umgebung ersetzt werden und müssen einmal auf realem iPhone/iPad geprüft werden:

1. **Planer:** Plan erstellen, umbenennen, duplizieren; keine doppelten Namen. Parameter wechseln, ohne dass Werte verloren gehen.
2. **Partnerübungen:** A/B/C-Reihenfolge, individuelle WDH/Zeit/Variante/Equipment/pro Seite, gemeinsame Pause/Sätze von A, Austausch, Giant erweitern/reduzieren und 3→2 = Superset.
3. **Training:** Einzel/Superset/Giant starten; Standard-Bezeichnung, 0:00 Pause und exakt eine Empfehlung je Übung prüfen.
4. **Zeittraining:** nur Zeit, Play, Leistung; keine KG/S/W/km/Distanz.
5. **Keyboard:** KG/WDH/Zeit sowie relevante Planer-/Ernährungsfelder tippen; Tastatur bleibt offen, Feld sichtbar, Fokus ohne Eingabe verändert nichts.
6. **Sprache/Textgröße:** Deutsch/Englisch und Standard/Groß prüfen; Übungsnamen, Varianten, Equipment und eigene Plannamen bleiben unverändert.
7. **Backup:** echtes `Backup.json` exportieren, Daten verändern, importieren und Ergebnis prüfen; Built-in-Katalog darf nicht zurückrollen.
8. **PWA:** kurzer Standby, Rückkehr, iOS-Eviction/Reload und Kaltstart prüfen; aktives Workout bleibt wiederaufnehmbar.
9. **Wochenlogik:** Streak zählt heute nicht; Wochenzusammenfassung manuell prüfen und Sonntag/Montag-Regel bei Gelegenheit verifizieren.
10. **Push:** nach Backend-Deployment Permission und echte Zustellung auf installierter PWA testen.

## Push-Deployment
Für Live-Zustellung erforderlich: VAPID-Schlüssel, `APP_ORIGIN`, persistente `DATABASE_URL`, `CRON_SECRET` und externer Scheduler/Render-Job für `POST /api/tick`. Diese Werte gehören nicht in die Client-ZIP.

## Freigaberegel
Werden bei der Geräteabnahme Fehler gefunden, nur den konkreten Fehler beheben und anschließend die betroffene Funktion plus Release-Smoke-Test erneut prüfen. Keine bereits freigegebenen Bereiche ungefragt umbauen.
