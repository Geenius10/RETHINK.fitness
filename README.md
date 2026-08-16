# ReThink. Clean v1
Komplett neuer Quellcode. Keine alte Screen-/CSS-Struktur übernommen.

Die bestehenden LocalStorage-Schlüssel bleiben gleich, damit alte Pläne, eigene Übungen, Verlauf, aktive Workouts, Messungen, Ernährung und Profil auf derselben Domain weiter eingelesen werden können.

Architektur:
- 5 Haupt-Tabs mit gespeicherter Scrollposition
- Vollbild-Unterseiten mit kompakter fixer Topbar
- einheitliche Sheets
- Standardpause 01:30
- KG / WDH. in allen Satzansichten
- Übungsbibliothek, eigene Übungen, Planeditor, Vorschau, Training, Verlauf, Woche, Profil


## Clean v2 additions
- restored UI/page/draft state; active workout has startup priority
- plan picker search + shared sorting
- history delete/restart, week multi-plan merge
- live notes, deletion, timers, gated ratings
- method descriptions and aligned KG/WDH headers
- expanded hydration/nutrition/drinks/measurements
- execution guidance rewritten using ACE Exercise Library movement-form principles

## Clean v3
- Zurück führt innerhalb eines Arbeitsablaufs auf den unmittelbar vorherigen Screen; X/Schließen beendet den Sheet-Ablauf.
- Tastatur wird beim Scrollen geschlossen.
- Sortierung um „Genutzt“ ergänzt; alle Sortierungen sind auf-/absteigend.
- Wiederholungen werden über verständliche Presets gewählt.
- Superset, Giant Set und Pre-Exhaust verlangen verknüpfte Übungen; Drop Set konfiguriert Drops und Reduktion.
- Ein Satz kann erst nach vollständigen Werten über den Haken bewertet und abgeschlossen werden. Die Bewertung färbt den Haken.

## Clean v4
- 10–15 statt 12–15; Max Hold ergänzt.
- Bewertung „Zu leicht“ als vierte, hellblaue Stufe.
- Mehrere Wochenpläne werden nur referenziert, nie als neuer Plan gespeichert. Änderungen/Löschungen der Quellen wirken auf die Woche; abgeschlossene kombinierte Workouts bleiben als Snapshot im Verlauf.
- Profilbearbeitung wieder ausgebaut: Alter, Größe, Geschlecht für Energieberechnung, Aktivität, Ziel, Messungen, Ernährungsziele und berechneter Startwert – im Clean-Design.

## Clean v5
- Datumsgebundene Wochenansicht, zwei Wochen zurück und zwei Wochen voraus.
- Getränke aus Verlauf übernehmen, letzte Menge merken, Kalorien/Koffein/Hydrierung protokollieren und Einträge löschen.
- Vollbild-Einstellungen mit Profil-, Trainings- und Datenbereichen.
- Plan Tap/Bearbeiten, Long-Press Duplizieren/Löschen, Links-Wisch Löschen mit Bestätigung.
- Zurück im Planeditor fragt nur bei Änderungen nach Speichern.
- Vorschau entspricht der Trainingsansicht.
- Änderungen während eines laufenden Trainings erzeugen erst beim gespeicherten Abschluss einen neuen angepassten Plan.

## Clean v6 – Zusammenführung mit Verlauf/v2.121
- Übung austauschen erhält Satzmethode, Sätze, Wiederholungsziel, Pause, Notiz und Methodendaten.
- Superset, Giant Set und Pre-Exhaust laufen nun als echte gemeinsame Runden mit KG/WDH. pro beteiligter Übung.
- Verknüpfung lösen setzt die verbleibende Übung sauber auf Standard zurück.
- Varianten und WDH. pro Seite wieder integriert.
- Max Hold schaltet auf Zeittracking.
- Empfehlungen aus dem letzten Trainingsverlauf im Plan und Training.
- Reihenfolge im laufenden Workout funktioniert mit Pfeilen.
- Pausentimer überlebt App-Wechsel/Sperrbildschirm zeitlich.
- Zusammenfassung zeigt tatsächliche KG/WDH./Zeit- und Teilsetwerte.
- Eigene Übungen können bearbeitet werden und mehrere Bereiche sowie Zeit/Wiederholungs-Tracking erhalten.

## Clean v7 – Usability / state / active workout
- Laufendes Training: große grün akzentuierte Karte mit Live-Zeit und aktueller Übung; normale Startkarte verschwindet.
- Nach echtem App-Neustart mit aktivem Workout startet ReThink oben auf der Training-Seite bei dieser Karte.
- Hintergrund/Foreground ohne Neustart behält den aktuellen Screen; UI-Zustand wird zusätzlich gespeichert.
- Workout-Eingaben sind auf iOS wieder fokussierbar; Scrollen schließt die Tastatur erst nach tatsächlicher Scrollbewegung.
- „Genutzt“ ist bei Übungen eine Sortierung nach letzter tatsächlicher Nutzung und wechselt per erneutem Tap zwischen ↑/↓.
- Mehrere Muskelgruppenfilter wirken als UND-Verknüpfung.
- Leere Pläne können weder gespeichert noch gestartet werden.
- Tabbar größer und mit eindeutigen SVG-Symbolen; Profil mit Personensilhouette.
- Profilreihenfolge: Profildaten → Messungen → Hydrierung mit aufklappbaren Getränken → Ernährung.
