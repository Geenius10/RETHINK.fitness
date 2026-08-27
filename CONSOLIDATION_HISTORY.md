# ReThink. Fitness – Konsolidierungsverlauf

Dieses Dokument ersetzt die einzelnen `PHASE_1` bis `PHASE_14`-Dokumente sowie die alten Audit-/Legacy-Notizen. Es dient nur als kompakte technische Historie. Der aktuelle verbindliche Funktionsstand steht in `MASTER_SPEC.md`.

## Ausgangsaudit
Die Baseline enthielt bereits einen großen Teil der gewünschten Funktionen, aber überlagerte Renderer/Runtime-Overrides und uneinheitliche Logik erzeugten Regressionsrisiken. Hauptbaustellen waren Renderer, Backup/Restore, Plan-/Partnerkonfiguration, Katalog, i18n, Streak/Wochenzusammenfassung, Eingaben, PWA-Resume und Push.

## Phasen 1–2 – Architektur und Renderer
- Tote/überschriebene Deklarationen und triviale Wrapper entfernt.
- `renderSets`, Live-Karten, Food Search und Profil-Erweiterungen auf kanonische Pipelines reduziert.
- Nutrition, Direct Editing und Streak in eine Profil-Pipeline vereinigt.
- Ergebnis: keine verbleibenden mehrfachen `window`-Overrides.

## Phase 3 – Backup / Restore
- Einheitliches `Backup.json`, versioniertes Schema und 22 definierte persönliche Persistenzschlüssel.
- Built-in-Katalog und technische UI-Zustände vom Backup ausgeschlossen.
- Atomarer Restore mit Legacy-Lesekompatibilität und Round-trip-Test.
- Test: 22/22 Schlüssel identisch, Katalog geschützt, fehlende Snapshot-Schlüssel korrekt entfernt.

## Phase 4 – Plan / Partner
- Gemeinsame ExerciseConfig-/Save-/Validate-Pipeline für Neu, Bearbeiten und Austauschen.
- Unabhängige Parameter bleiben bei Re-Render/Methodenwechsel erhalten.
- Gemeinsame Partnerwerte von A; individuelle Werte je Mitglied.
- Giant 2→Superset, bestehende Mitglieder beim Erweitern/Reduzieren erhalten.
- Self-Test: methodChangePreserves, oneSetPartner, giantTwoToSuperset, sharedFromA bestanden.

## Phase 5 – Übungskatalog
- Katalog auf 95 eindeutige Einträge konsolidiert.
- `Calf Raises` kanonisch, `Sprinter Iso Hold` kanonisch, Copenhagen nur als vorgesehene Variante, Squat inkl. Overhead.
- Mehrfachzuordnungen auch im Plan-Picker korrekt berücksichtigt.
- Keine Varianten/Hilfsmittel aus Vermutung erfunden.

## Phase 6 – DE/EN
- Zentrale UI-Lokalisierung erweitert.
- Katalogbasierter Schutz für Übungsnamen, Varianten und Equipment; dynamische Optionen mit i18n-Schutz.
- Nutzerdefinierte Plannamen und freie Texte bleiben unverändert.

## Phase 7 – Streak / Wochenzusammenfassung
- Gemeinsame Tagesauswertung; Streak startet bei gestern.
- Abgeschlossene Wochenrange nach Sonntag/Montag.
- Automatisches Popup nur einmal pro abgeschlossener Woche am Sonntag/Montag; manuell jederzeit abrufbar.

## Phase 8 – Textgröße
- Sichtbar nur Standard/Groß; alte dritte Stufe migriert auf Groß.
- Eine globale Skalierungsquelle über `--text-scale`; dynamische UI eingeschlossen.

## Phase 9 – Trainings-Runtime
- Alle produktiven `rest || 90`-Fallbacks entfernt; 0:00 bleibt 0.
- Sichtbar ausschließlich `Standard` statt `Normal`.
- Alte Empfehlungsrenderer entfernt; exakt eine Empfehlung pro Übung.

## Phase 10 – Keyboard / Input
- Re-Render während echter Eingabe geschützt, damit iOS-Keyboard offen bleibt.
- `visualViewport` hält aktives Feld sichtbar.
- Fokus ohne Eingabe verändert keine Daten.

## Phase 11 – PWA Resume / Restart
- Eine kanonische 6-Stunden-Regel statt konkurrierender Boot-Token-Logik.
- Kurzfristige iOS-Rekonstruktion restauriert UI; echter Kaltstart startet auf Training.
- Aktives Workout bleibt erhalten.

## Phase 12 – Rest-Audit
- Zentrale eindeutige Plannamenprüfung für Create/Rename/Save; Duplicate erzeugt freien Namen.
- Verbleibende dynamische i18n-Texte ergänzt.

## Phase 13 – Gesamt-QA
- Konsolidierte Phasen gegen Regressionen geprüft.
- Push-Hook-Fehler behoben: Integration an realen `openSettingsPage()`-Flow statt nicht vorhandenem `renderSettings`.

## Phase 14 – Release / PWA / Push
- Release-Cache und Runtime-Version vereinheitlicht.
- Phantom-Precache-Dateien entfernt; Apple-PWA-Metadaten/Icons korrigiert.
- Push-Backend mit VAPID, PostgreSQL und geschütztem Scheduler-Endpunkt vorbereitet.

## Historische Katalog-/Zeittraining-Regeln
Aus früheren Notizen dauerhaft übernommen:
- Varianten/Hilfsmittel direkt sichtbar; keine Anzeige-Buttons und keine erfundene Standard-Variante.
- Suche über Name, Varianten und Hilfsmittel.
- Zeittraining zeigt nur Zeit, Play und Leistung; keine KG/S/W/Distanzfelder.
- Legacy-Daten dürfen intern lesbar bleiben, ohne wieder in der UI sichtbar zu werden.
