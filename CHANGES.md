# Änderungen – ReThink. Fitness

## Pause
- `Keine` ist ein echter Pausenwert von 0 Sekunden.
- Explizite 0 Sekunden werden beim Anlegen, Umschalten zwischen WDH/Zeit, Partnerübungen und Speichern nicht mehr auf 1:30 zurückgesetzt.
- Fehlende Alt-Daten erhalten weiterhin sinnvoll 1:30 als Standard; nur ein bewusst gewähltes `Keine` bleibt 0.
- Die Pausen-Auswahllisten verwenden eine gemeinsame Darstellung: `Keine`, 00:30, 00:45, 01:00, 01:30 usw.

## Vorschau
- Drei alte Runtime-Overrides der Vorschau wurden entfernt. Diese haben den neuen Vorschau-Code bislang wieder überschrieben.
- Es existiert jetzt nur noch ein eigentlicher Vorschau-Renderer.
- WDH-Übungen: `Satz | KG/lb | WDH.`
- Zeitübungen: `Satz | Zeit | Leistung`.
- Bei Zeitübungen erscheinen weder `KG/lb` noch `S/W`.
- Die gespeicherte Zeit der jeweiligen Übung wird verwendet.
- Die Leistungsbox ist größer als die Zeitbox.
- Alle drei Felder bleiben auf einer Zeile.
- Minus-, Löschen-, Set-hinzufügen- und sonstige Live-Workout-Aktionsbuttons werden in der Vorschau nicht gerendert.
- Partnerübungen behalten in der Vorschau ihre jeweils eigenen WDH-/Zeit-Einstellungen.

## Codebereinigung
- Veraltete Vorschau-Renderer aus älteren Integrationsschichten entfernt.
- Veraltete Vorschau-CSS-Schicht `rethink-preview-clean-final` entfernt.
- Einheiten-Anpassung der Vorschau auf die tatsächlich verwendeten neuen Preview-Klassen reduziert.
- Gemeinsame Pause-Helfer statt konkurrierender `0`/Fallback-Darstellungen.
- Bestehende Daten-, Backup-, Trainings-, Wochenplan- und Gruppenlogik wurde nicht gelöscht.
- Service-Worker-Cache-Version erhöht, damit die korrigierten Dateien geladen werden.
