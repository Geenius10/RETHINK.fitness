# ReThink. Fitness – Master-Spezifikation

Stand: Release Candidate nach Konsolidierungsphase 14, 27.08.2026.

Dieses Dokument ist die verbindliche fachliche Referenz für die weitere Entwicklung. Bestehende hier festgelegte Funktionen dürfen nicht unbeabsichtigt verändert oder zurückgebaut werden. Pro Logikbereich gilt eine kanonische Datenquelle bzw. Pipeline.

## 1. Übungskatalog
- Eindeutige Übungen; Mehrfachzuordnungen zu Trainingsarten ohne Duplikate.
- Sortierung nach Trainingsart, darin alphabetisch; Mehrfachfilter für Muskelgruppen.
- Suche umfasst Übungsname, Variante und Hilfsmittel.
- Varianten ausschließlich aus dem verbindlichen Katalog; keine erfundene `Standard`-/`Normal`-Variante.
- Hilfsmittel: 0 = nichts, 1 = implizit, >1 = optional auswählbar.
- Gewähltes/eindeutiges Hilfsmittel erscheint im sichtbaren Plan-/Workout-Namen.
- `pro Seite` bildet unilateral/bilateral ab.
- Übungsnamen, Varianten und Hilfsmittel/Equipment bleiben immer im englischen Original und werden nicht übersetzt.
- Aktueller Katalog: 110 eindeutige Einträge. `Calf Raises` ist kanonisch; `Calf Raise` bleibt nur Legacy-Lesealias. `Sprinter Iso Hold` ist kanonisch. `Copenhagen` ist keine Einzelübung. `Squat`: Back, Front, Goblet, Overhead.

## 2. Pläne und Übungskonfiguration
- Plannamen sind case-/whitespace-normalisiert eindeutig; Create/Rename/Save blockieren Dubletten, Duplizieren erzeugt einen freien Namen.
- Methode, Sätze, Pause, WDH/Zeit, Zielwert, Variante, `pro Seite` und Hilfsmittel sind unabhängig und dürfen bei anderen Auswahlen nicht zurückgesetzt werden.
- Neu, Bearbeiten und Austauschen verwenden dieselbe ExerciseConfig-/Save-/Validate-Logik.
- 1 Satz ist bei Standard, Superset, Giant und Pre-Exhaust zulässig; Sondermethoden dürfen methodisch begründete Grenzen haben.

## 3. Partnerübungen
- Auswahlreihenfolge A → B → C bleibt erhalten.
- WDH/Zeit, Variante, Hilfsmittel und `pro Seite` bleiben je Übung individuell.
- Satzanzahl und Pause sind gemeinsame Serienwerte; A ist die führende Quelle, B/C/... können sie nicht separat verändern.
- Bearbeiten eines einzelnen Gruppenmitglieds verändert nur dieses Mitglied.
- Strukturflow nur bei echter Methoden-/Strukturänderung.
- Bereits verwendete Übungen beim Austausch ausblenden.
- Giant 3→2 wird Superset; Giant kann erweitert/reduziert werden, bestehende Mitglieder bleiben erhalten.

## 4. Zeittraining
- Sichtbare Messfelder ausschließlich: **Zeit | Play | Leistung**.
- Kein KG, S/W, km oder Distanzfeld – in Einzel-, Partner-, Vorschau- und Historienansicht.
- Leistung erhält die größere Box.
- 0:00 Pause ist ein gültiger persistenter Wert und bleibt 0:00/Keine; niemals Truthy-Fallback auf 1:30.

## 5. Laufendes Training
- Sichtbare Standardmethode heißt ausschließlich **Standard**; historische interne Schlüssel bleiben kompatibel.
- Genau eine Empfehlung pro Übung, auch je A/B/C innerhalb einer Partnerkarte.
- Bewertung steuert den Kartenfortschritt; Eingabefelder nicht.
- Großer abgerundet-quadratischer Play-Button über Training starten/Plan wählen.
- Start-Plusbutton bei aktivem Workout ausblenden.

## 6. Eingaben / iPhone / iPad
- Tastatur bleibt während echter Eingabe geöffnet; Re-Render darf das fokussierte Input-Element nicht ersetzen.
- Aktives Feld bleibt über `visualViewport` im sichtbaren Bereich.
- Fokus + Blur ohne echte Eingabe ist ein striktes No-op und verändert keine Trainingswerte.
- Tippen/Scrollen außerhalb darf die Tastatur schließen.

## 7. Profil, Ernährung, Hydrierung
- Wasser aus Nahrung zählt zur Hydrierung.
- Ernährungsziele als wiederverwendete Karte mit Änderung + Berechnung; Ernährungsdaten sind löschbar.
- Streaks berücksichtigen nur vollständig abgeschlossene Tage bis gestern; heute erhöht keinen Streak.
- Wochenzusammenfassung bezieht sich auf die letzte vollständig abgeschlossene Woche nach eingestelltem Wochenstart.
- Automatisch nur beim ersten normalen Öffnen Sonntag/Montag einmal pro abgeschlossener Woche; laufendes Workout wird nicht unterbrochen.
- Zusätzlich jederzeit unter Einstellungen → Daten & App abrufbar.
- Zusammenfassung: Datumsbereich, Trainingstage, Trainingsanzahl, abgeschlossene Sätze, Hydrierungsziel-Tage, Ernährungsziel-Tage, Tage mit beiden Zielen.

## 8. Einstellungen / Sprache / Darstellung
- Einheiten: kg/lb, km/mi, cm/in, ml/oz.
- Wochenstart Sonntag/Montag.
- Deutsch ist Standard, Englisch Alternative; die gesamte feste UI wird lokalisiert.
- Nicht übersetzt: Übungsnamen, Varianten, Hilfsmittel/Equipment, selbst vergebene Plannamen und freie Nutzertexte.
- Textgröße global nur **Standard** und **Groß**; historische dritte Stufe wird auf Groß migriert. Zentrale Quelle ist `--text-scale`.
- Daten & App bündelt Backup, Restore, Datenlöschung, Wochenzusammenfassung und Erinnerungen.

## 9. Backup / Restore
- In der UI ausschließlich **Backup**; Exportdatei exakt `Backup.json`.
- Schema `rethink-fitness-backup`, Version 1.
- Alle definierten persönlichen Persistenzbereiche werden gesichert; integrierter Übungskatalog, technische UI-/Scroll-/Filterzustände, Cache und Push-Subscription nicht.
- Built-in-Katalog darf durch Restore niemals zurückgerollt werden; eigene Übungen werden gesichert.
- Restore validiert Schema/Version, ersetzt den persönlichen Snapshot vollständig und rollt bei Schreibfehlern atomar zurück.
- Legacy-Backups `rethink-v3.1-backup` bleiben lesbar.
- Round-trip-Test ist verpflichtend, wenn persistente Nutzerfelder geändert werden.

## 10. PWA / Resume / Neustart
- Gleiches Dokument im Hintergrund: keine Navigation, Zustand bleibt exakt erhalten.
- iOS-Dokumentrekonstruktion innerhalb von 6 Stunden: persistierten UI-Zustand wiederherstellen.
- Kaltstart ohne aktuellen Hintergrundmarker bzw. nach mindestens 6 Stunden: Start auf **Training**; transiente UI-Zustände zurücksetzen.
- Aktives Workout wird nie durch Kaltstart gelöscht und bleibt wieder aufnehmbar.
- PWA-Icon: `R.` links oben + Hantel rechts.

## 11. Release / Web Push
- Release-Cache: `rethink-fitness-20260827-release1`; Runtime-Version `20260827r1`.
- Service-Worker-Precache darf nur tatsächlich vorhandene Assets enthalten.
- Apple-PWA-Metadaten und vorhandene Icons bleiben korrekt verdrahtet.
- Push-Einstellungen werden über `openSettingsPage()` in `#settingsBody` eingebunden.
- Permission nur nach expliziter Nutzeraktion.
- Backend: VAPID, persistente PostgreSQL-Subscriptions, Entfernung ungültiger Subscriptions, geschützter `POST /api/tick` mit `CRON_SECRET`.
- Live-Push erfordert externes Deployment mit VAPID, `APP_ORIGIN`, `DATABASE_URL`, `CRON_SECRET` und Scheduler.

## 12. Entwicklungsregeln
- Keine Regressionen gegen diese Master-Spezifikation.
- Keine parallelen/überlagernden Renderer oder konkurrierenden Runtime-Regeln für denselben Bereich.
- Legacy-Daten nur soweit nötig kompatibel lesen; sichtbare UI folgt ausschließlich dem aktuellen Standard.
- Neue persistente Nutzerfelder müssen in Backup/Restore und dessen Round-trip-Test aufgenommen werden.
- Vor Release: JavaScript-/Inline-Syntax, Release-Smoke-Test und PWA-Assetprüfung ausführen.
- Hardwareabhängige Punkte auf echtem iPhone/iPad abnehmen: Keyboard, PWA Resume/Eviction, Backup-Dateiauswahl, Push-Permission und echte Zustellung.
