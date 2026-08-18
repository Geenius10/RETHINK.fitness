# ReThink. Athletic Lab — Clean v66 Stabilized

Diese Datei beschreibt ausschließlich den aktuellen Soll-Zustand.

## Kernlogik
- Hinzufügen, Bearbeiten und Austauschen arbeiten auf Drafts; erst `Übernehmen` verändert den Planentwurf.
- Superset, Giant Set und Pre-Exhaust wählen Partnerübungen über den vollständigen Übungskatalog mit Suche, Filtern und Ausführungsdetail.
- Zeit und AMRAP sind Ausführungsmodi, keine Satzmethoden.
- Pyramide: nur Wiederholungen, mindestens 3 Sätze, Last hoch oder Last runter.

## Pläne und Workout
- Bestehenden Plan verlassen: einmal `Plan speichern?` → speichern oder verwerfen.
- Bearbeiteten Plan direkt starten: Original überschreiben / als neuen Plan speichern / Änderungen verwerfen / abbrechen.
- Workout ist ein Snapshot. Zurück erzeugt keine Plan-Speicherfrage.
- Training beenden: bei Strukturänderung Original überschreiben / neuen Plan speichern / Planänderung verwerfen.
- Live-Austausch lädt letzte Werte nur für gleiche Übung + gleiche Satzmethode + gleichen WDH-/Zeitmodus.

## Bewertung / Pause
- Bewertung ausschließlich über den Satz-Haken: Grün Perfekt, Gelb Limit, Rot Zu schwer, Hellblau Zu leicht.
- Einzelübung: nach Bewertung startet die Satzpause.
- Superset/Giant/Pre-Exhaust: Pause startet sobald alle Übungen derselben Runde bewertet sind; Reihenfolge egal.
- Signalton erst am Ende der Pause.
- Pausentimer bündig am unteren Bildschirmrand.
- Methodenrahmen, aktive Übung und abgeschlossene Satzzeilen verwenden die jeweilige Methodenfarbe.

## Navigation / Darstellung
- Echter Neustart → Training; Standby → derselbe Ort.
- Bottom-Sheets per Querbalken nach unten ziehbar; Tastatur verschiebt nur den scrollbaren Inhalt.
- Hell/Dunkel/System. Hellmodus: getöntes Blaugrau/Lavendel mit dunkler Schrift.
- `Heute messen?`: Standardkarte, Text rot, Pfeil rechts.

## Woche / Fortschritt
- Anstehende Wochenplan-Workouts orange; abgeschlossene grün.
- Löschen der Wochenzuordnung entfernt auch die Erledigung.
- Trainingstage zählt nur Wochenplan-Workouts.
- Fortschritt kompakt: Gewichtstrend; Wunschgewicht + kg bis Ziel; Streak + Wasser und Ernährung; Trainingstage + KW + x/7.
- Ziele-Streak: Wasserziel erreicht/überschritten UND Kalorienziel eingehalten; jeweils mindestens 3 Einträge.

## Ernährung
- 1.500 Lebensmittel, Suchpriorisierung, Portionen, eigene Lebensmittel und Mahlzeiten.
- Mahlzeiten summieren kcal, Protein und Wasser.
- Klick auf Getränk/Lebensmittel öffnet direkte Mengenbearbeitung.

## v67
- Nicht erledigte Wochenplan-Workouts sind wieder fliederfarben wie die übrige App.
- Abgeschlossene Wochenplan-Workouts bleiben grün.
- AUDIT.md enthält ab jetzt einen vollständigen 5-Pass-Master-Audit für die gesamte App.
