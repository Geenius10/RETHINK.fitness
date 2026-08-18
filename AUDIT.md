# ReThink Clean v66 — Evidence Audit

- PASS — Rating core unique
- PASS — Pause after rating
- PASS — Group pause independent
- PASS — Signal at pause end
- PASS — Method history
- PASS — Live history reload
- PASS — Partner catalog
- PASS — Method border
- PASS — Restart/standby
- PASS — Sheet drag
- PASS — Keyboard
- PASS — Week cleanup
- PASS — Progress compact
- PASS — Streak min entries
- PASS — Custom foods/meals
- PASS — 1500 foods
- PASS — Plan start choices
- PASS — Workout finish choices

## Noch reale Geräteprüfung nötig
- iOS-Tastatur/VisualViewport
- Audio/Notification im Hintergrund
- Drag-to-dismiss per Finger
- Upgrade sehr alter Service-Worker-Caches

## Bereinigung v66
- Alter v49-Hellmodus entfernt.
- Alte Pausentimer-Positionierungen neutralisiert; nur `current-v66-theme-layout` positioniert `#restBar`.
- README auf aktuellen Soll-Zustand reduziert.
- Unsichere JavaScript-Bereiche bewusst nicht gelöscht.


## v67 — Master Audit Plan

Ab jetzt wird die App nicht mehr nur punktuell gegen einzelne Änderungswünsche geprüft, sondern in fünf vollständigen Durchläufen.

### Pass 1 — Navigation, Persistenz, PWA-Lifecycle
- echter Neustart vs. Standby
- Tab-/Unterseitenzustand und Scrollpositionen
- Zurück / X / Haken / Abbrechen
- App im Hintergrund / Rückkehr
- laufendes Workout bei Neustart
- Service-Worker-Update / Cache
- Storage-Kompatibilität und fehlerhafte/alte Datensätze

### Pass 2 — Trainingspläne, Übungskatalog, Methoden
- neue Übung / bearbeiten / austauschen
- alle Einzelmethoden
- Superset / Giant / Pre-Exhaust atomar
- Partnerauswahl über vollständigen Katalog
- Methodenwechsel in jede zulässige Zielstruktur
- Reihenfolge / Löschen / Normalisierung
- Vorschau
- Plan speichern / verwerfen / direkt starten

### Pass 3 — Laufendes Workout
- Eingaben KG / WDH / Zeit
- historische Vorwerte
- Bewertung Grün / Gelb / Rot / Blau
- Reihenfolge-unabhängige Gruppenbewertung
- Satzpause und Signalton
- Live-Bearbeitung / Austausch / Methodenwechsel
- Workout verwerfen / abschließen
- Originalplan überschreiben / neue Version / Planänderung verwerfen
- Timer und Hintergrundverhalten

### Pass 4 — Woche, Profil, Fortschritt, Ernährung, Hydrierung
- Wochenplan / Erledigtstatus / Löschen
- Trainingstage KW x/7
- Streaks und Mindestanzahl Einträge
- Gewichtstrend / Wunschgewicht / Zielrichtung
- Messungen
- Hydrierung
- 1.500 Lebensmittel
- Suche / Nutzungshäufigkeit / Portionsgrößen
- eigene Lebensmittel / Mahlzeiten / Mengenbearbeitung

### Pass 5 — UI-Konsistenz, Theme, Geräteverhalten
- Hell / Dunkel / System
- Methodenfarben und Rahmen
- aktive Übung / abgeschlossene Satzzeilen
- Keyboard / VisualViewport
- Bottom-Sheets / Drag-to-dismiss
- Touch-Ziele / iPhone/iPad
- Kontrast / Lesbarkeit
- Performance / große Datenmengen
- finaler README-/AUDIT-Abgleich

## v67 Änderung
- Nicht erledigte Wochenplan-Workouts verwenden wieder den normalen Flieder-Ton der App.
- Abgeschlossene Wochenplan-Workouts bleiben grün.
