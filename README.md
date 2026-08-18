# ReThink. Athletic Lab — Rethink_v3.1

Diese Datei ist die **verbindliche Funktionsbeschreibung des aktuellen Soll-/Ist-Stands**. Sie ist bewusst keine Versionschronik. Wenn App-Verhalten und diese Datei voneinander abweichen, gilt das als Fehler und soll im nächsten Audit korrigiert werden.

## 1. PWA / Grundverhalten
- Mobile-first PWA mit `index.html`, `runtime-current.js`, `foods.js`, Manifest, Service Worker und App-Icons.
- Bestehende lokale Daten und Storage-Keys bleiben kompatibel.
- Echter neuer App-Start öffnet den Tab **Training**.
- Ein echter Neustart setzt die Profil-Tagesansicht auf **Heute** zurück, ohne die Daten dieses Tages zu löschen.
- Wird die App nur in den Hintergrund/Standby geschickt, bleibt der aktuelle Ort erhalten.
- Ein laufendes Workout hat beim Wiederöffnen Priorität.
- Hell / Dunkel / System stehen in Einstellungen zur Verfügung.
- Hellmodus ist bewusst blaugrau/lavendel und verwendet überwiegend dunkle Schrift statt weißer Schrift auf grauen Flächen.

## 2. Hauptnavigation
- Tabs: Übungen, Trainingspläne, Training, Woche, Profil.
- Wechsel auf einen anderen Tab führt immer an den Anfang der Seite.
- Beim bereits aktiven Tab gilt:
  - erster Tap bei gescrollter Seite → nur an den Anfang;
  - zweiter Tap am Seitenanfang → Tab-Auswahl wird auf Standard zurückgesetzt.
- Reset-Stand:
  - Übungen: Suche/Filter zurückgesetzt **und** Trainingsart-/Muskelgruppenleiste springen sichtbar an den linken Anfang;
  - Manuelles Ändern/Entfernen eines Filters verschiebt die horizontalen Filterleisten dagegen nicht;
  - Trainingspläne: beim ersten App-Einsatz **A–Z ↑**; sobald der Nutzer eine Sortierung wählt, bleibt genau diese Sortierung inklusive Richtung auch nach echtem Neustart erhalten;
  - Woche: aktuelle Woche;
  - Profil: Heute.
- Zurück führt innerhalb eines Arbeitsablaufs genau einen Schritt zurück.
- X beendet die gesamte aktuelle Hinzufügen-/Bearbeiten-Aktion.
- Zurück/X speichern keine Änderungen unbemerkt.

## 3. Übungskatalog
- Feste Trainingsarten- und Muskelgruppenstruktur.
- Suche und Filter bleiben beim Öffnen einer Ausführungskarte und beim Zurückgehen erhalten.
- Klick auf Übungsname/Karte öffnet die Ausführungs-/Detailkarte.
- Schwarzes Plus wählt eine Übung direkt.
- Eigene Übungen sind möglich.
- Varianten werden normalisiert; `Standard` darf nicht doppelt als Variante erscheinen.
- Eigene Übung benötigt sinnvolle Trainingsart/Muskelgruppe.
- Ausführungshilfe bleibt über die Übungskarte erreichbar.

## 4. Pläne — Grundprinzip
Einheitlicher Ablauf:
`gespeicherter Plan → Plan-Draft → Übungs-/Gruppen-Draft → Validierung → Übernehmen in Plan-Draft → ausdrückliches Speichern`.

- Das Originalobjekt darf während einer offenen Bearbeitungsmaske nicht direkt mutiert werden.
- `Übernehmen` einer Übung ist nicht dasselbe wie den gesamten Plan speichern.
- Bestehenden Plan außerhalb eines Workouts bearbeiten:
  - bestätigte Änderungen verändern den Plan-Draft;
  - beim Verlassen einmal `Plan speichern?`;
  - Speichern aktualisiert das Original;
  - Verwerfen stellt den Originalzustand wieder her.
- Neuer Plan bleibt Draft, bis ausdrücklich gespeichert wird.
- Bearbeiteten bestehenden Plan direkt starten:
  - Originalplan überschreiben;
  - als neuen Plan speichern;
  - Änderungen verwerfen;
  - abbrechen.
- Vorschau ist read-only und verwendet dieselben Karten/Strukturen wie das spätere Workout.

## 5. Übung hinzufügen / bearbeiten / austauschen
- Neue Übung erscheint erst nach vollständiger Konfiguration im Plan.
- Gleiche Parametermaske für neue und bestehende Übungen.
- Bearbeiten erfolgt separat vom Klick auf den Übungsnamen.
- Konfigurierbar:
  - Satzmethode;
  - WDH.- oder Zeitmodus;
  - Sätze;
  - Pause;
  - Variante;
  - pro Seite;
  - methodenspezifische Parameter.
- Jede zulässige Einzelmethode kann in jede andere zulässige Einzel-/Gruppenmethode umgewandelt werden.
- Eine Änderung ersetzt die bearbeitete Übung an ihrer bisherigen Position.
- Keine halb konfigurierte Methode wird gespeichert.
- Löschen fragt nach Bestätigung.
- Reihenfolge verschiebt verbundene Gruppen als Einheit.

## 6. Gruppenmethoden
### Superset
- Zwei vollständig konfigurierte Übungen.
- Übung A und B bleiben als zusammenhängende Gruppe.
- Partnerübung wird über denselben vollständigen Übungskatalog wie Übung 1 gewählt.
- Suche, Filter und Ausführungsdetail sind vor der Auswahl verfügbar.
- Austausch einer Partnerübung ersetzt sie an ihrer Position, nicht am Planende.
- Wird aus einem 2er-Superset eine Übung gelöscht, wird die verbleibende Übung Standard.

### Giant Set
- 3 bis 6 Übungen.
- Die gewählte Anzahl ist verbindlich: 4 bedeutet vier vollständig gewählte Übungen, 5 fünf usw.
- Alle Partnerübungen laufen durch den vollständigen Übungskatalog.
- Position A/B/C/D/E/F bleibt erhalten.
- Löschen rückt Positionen lückenlos auf.
- Erweiterung verlangt vollständige Konfiguration der neuen Partner.
- Verkleinerung darf keine Übung kommentarlos löschen.

### Pre-Exhaust
- Zwei vollständig konfigurierte Übungen: Vorermüdung + Hauptübung.
- Gleiche Partner-/Draft-Regeln wie Superset.

### Umwandlung
- Superset ↔ Giant Set ↔ Pre-Exhaust ist möglich.
- Fehlende Partner werden vollständig ergänzt.
- Abbruch lässt die ursprüngliche Gruppe vollständig bestehen.

## 7. Satzmethoden
### Standard
- WDH. oder Zeit, sofern die Übung zeitbasiert geeignet ist.

### Drop Set
- Eine Übung.
- Sätze, WDH.-Vorgabe, Anzahl Drops, Gewichtsreduktion, Pause.
- Folgegewichte werden aus dem Basisgewicht berechnet.
- Manuell geänderte Folgewerte bleiben manuell.

### Pyramide
- Nur Wiederholungen, nicht Zeit.
- Mindestens 3 Sätze.
- Last hoch oder Last runter.
- WDH.-Vorgaben werden sinnvoll vom zuletzt geänderten Satz weitergeführt.
- Automatisch berechnete Werte bleiben überschreibbar.

### Back-off
- Top-Satz + Back-off-Sätze.
- Back-off-WDH. 6–12 als Einzelwerte.
- Reduktion aus Topgewicht berechenbar und überschreibbar.

### Cluster
- Gesamtziel statt starrer Teil-WDH.
- Erste Eingaben können leere Folgefelder sinnvoll vorbelegen.
- Manuelle Folgewerte bleiben erhalten.

### Rest-Pause
- Gesamtziel 20 oder 30 WDH.
- Keine festen WDH.-Vorgaben in den Teilblöcken.
- Nach Zielerreichung entfallen unnötige weitere Blöcke.

### AMRAP
- AMRAP ist ein Ausführungsmodus, keine eigene Satzmethode.
- Tatsächliche WDH. werden im Workout eingetragen.

### Zeit
- Zeit ist ein Ausführungsmodus, keine eigene Satzmethode.
- 0:15 bis 3:00 in 15-Sekunden-Schritten plus direkte Eingabe.
- Start / Stop / Reset.
- Stop stellt auf die ursprünglich eingestellte Satzzeit zurück.
- Reguläres Ende führt zur normalen Bewertung.

## 8. Laufendes Workout
- Workout ist ein Snapshot der Planstruktur.
- Änderungen gelten zunächst nur für das laufende Workout.
- Live möglich:
  - Sätze hinzufügen/löschen;
  - Übung austauschen;
  - Methode ändern;
  - WDH. ↔ Zeit;
  - Pause;
  - Partnerstruktur ändern.
- Verwerfen löscht den Workout-Snapshot, nicht die gespeicherte Planvorlage.
- Training beenden speichert die Workout-Historie.
- Bei Strukturänderung danach:
  - Originalplan überschreiben;
  - als neuen Plan speichern;
  - Planänderungen nicht speichern.
- Neue Planversion erhält einen eindeutigen Namen (`Push`, `Push 2`, `Push 3` …).
- Historische Vorwerte werden planunabhängig geladen, aber nur bei:
  - gleicher Übung;
  - gleicher Satzmethode;
  - gleichem WDH.-/Zeitmodus.
- Nach Live-Austausch/Methodenwechsel werden diese Vorwerte erneut gesucht.

## 9. Bewertung
- Bewertung ausschließlich über den Satz-Haken.
- Vier Optionen:
  - Grün ✓ — Perfekt · 1–3 WDH. mit guter Form übrig;
  - Gelb ○ — Limit · 0 WDH. übrig;
  - Rot ✕ — Zu schwer · Form zu früh verloren;
  - Hellblau — — Zu leicht · problemlos 3+ WDH. übrig.
- Grau hinterlegte Werte aus dem letzten passenden Workout gelten als Orientierung.
- Neue Eingabe überschreibt den grauen Vorwert.
- Bewertung ohne neue Eingabe übernimmt den grauen Vorwert als tatsächlichen Wert.
- Nach Bewertung wird der Satz abgeschlossen.
- Einzelübung: danach startet die konfigurierte Satzpause.
- Superset/Giant/Pre-Exhaust: Pause startet, sobald **alle Übungen derselben Runde bewertet** wurden; Reihenfolge ist egal.
- Signalton kommt erst am Ende der Satzpause.
- Bewertungsfarbe bleibt semantisch am Haken.
- Nur die aktuell anstehende Übung/Serie ist in Methodenfarbe hervorgehoben.
- Nach Abschluss wird sie wieder neutral und die nächste Übung hervorgehoben.
- Methodenrahmen bleiben in ihrer jeweiligen Methodenfarbe sichtbar.
- Pausentimer ist am unteren Bildschirmrand fixiert.

## 10. Wochenplan
- Wochenansicht kann weit zurück/voraus navigiert werden (bis ±104 Wochen), ohne automatisch leere Wochen zu speichern.
- Nicht erledigte Workouts: Flieder.
- Erledigte Workouts: Grün.
- Laufendes Wochenworkout: sichtbarer Status `WORKOUT LÄUFT`; Tap/Play öffnet die laufende Einheit.
- Play-Button hat ausreichend Kontrast.
- Mehrere Pläne an einem Tag:
  - Auswahl wird sichtbar 1, 2, 3 … nummeriert;
  - Auswahlreihenfolge = Workout-Reihenfolge;
  - Abwählen nummeriert automatisch neu;
  - Übungen erscheinen Plan für Plan;
  - identische Gruppen-IDs verschiedener Pläne werden nicht zusammengeführt;
  - Reihenfolge kann im Workout später manuell geändert werden.
- Löschen eines normalen Wochenplan-Workouts entfernt auch dessen Wochen-Erledigtstatus.

### Wiederholungen v70
Beim Hinzufügen eines Plans/mehrerer Pläne zu einem Wochentag:
- Einmalig;
- jede Woche für **X Wochen** (2–104);
- jede Woche **bis einschließlich Datum**.
- Es werden keine Kopien der Pläne für jede Woche gespeichert.
- Gespeichert wird nur eine kleine Wiederholungsregel mit Plan-ID, Wochentag, Start, Reihenfolge und Ende.
- Wiederholte Einträge tragen ein kleines `↻`.
- Reihenfolge mehrerer wiederholter Pläne bleibt erhalten.

Bestehende Wiederholung bearbeiten:
- `Nur diese Woche`;
- `Diese und folgende Wochen`;
- abbrechen.
- Vorhandene Wiederholungsart/Restdauer wird beim Öffnen vorausgefüllt.

Bestehende Wiederholung löschen:
- `Nur dieses Workout entfernen`:
  - entfernt nur diese Wocheninstanz;
  - entfernt deren Wochen-Erledigtstatus;
  - spätere Wiederholungen bleiben.
- `Wiederholung ab hier beenden`:
  - beendet die Serie ab dieser Woche;
  - bereits absolvierte Workout-Historie bleibt erhalten.
- Vergangene Workout-Historie wird nicht durch die Wiederholungsregel ersetzt oder überschrieben.
- Regeln zu gelöschten Plänen werden sicher bereinigt.

## 11. Trainingstage / Fortschritt
Fortschrittskarten sind kompakt:
- **Gewichtstrend**
  - aktuelles Gewicht;
  - Wunschgewicht;
  - Zielgewicht + kg bis Ziel.
- **Streak**
  - Zahl;
  - `Wasser und Ernährung`.
- **Trainingstage**
  - `KW xx`;
  - `x/7`.

Regeln:
- Trainingstage zählt ausschließlich abgeschlossene Workouts aus dem Wochenplan.
- Wird ein entsprechender Workout-Verlauf gelöscht, sinkt der Counter.
- Gewichtsziel berücksichtigt Zielrichtung:
  - Abnehmen: Ziel erreicht bei Gewicht ≤ Ziel;
  - Aufbau: Ziel erreicht bei Gewicht ≥ Ziel.
- Ziele-Streak zählt nur Tage mit:
  - Wasserziel erreicht/überschritten;
  - Kalorienziel eingehalten;
  - mindestens 3 passende Getränkeeinträge;
  - mindestens 3 passende Ernährungseinträge.
- Hydrierung und Ernährung haben zusätzlich eigene Flammen-Streaks.

## 12. Profil / Messungen
- Profilansicht kann zwischen Tagen navigieren.
- Standby behält den betrachteten Tag.
- Echter Neustart → Heute.
- `Heute messen?`: normale Karte, nur Text rot, Pfeil nach rechts.
- Wunschgewicht steht in eigener Zeile.
- Verlauf/Diagramme bleiben unabhängig von der Tagesauswahl.

## 13. Hydrierung
- Eigene Getränke.
- Name, Größe, Hydrierungs-%, optional kcal/Koffein.
- Protein-Shake/Protein-Koffein folgen dem Getränke-Symbol-/Farbsystem.
- Klick auf Getränk fokussiert die Mengenbox direkt.
- Eingetragene Getränke können in der Menge nachbearbeitet werden.
- Hydrierung wird in Tagesziele eingerechnet.

## 14. Ernährung
- 1.500 integrierte Lebensmittel.
- Suche: `Lebensmittel, Mahlzeit oder Kategorie`.
- Suchfeld bleibt stabil/sticky; Treffer reduzieren sich darunter.
- Suche priorisiert:
  - exakten Namen/Wortanfang;
  - Kategorieanfang;
  - häufig verwendete Lebensmittel.
- In Suche enthalten:
  - integrierte Lebensmittel;
  - eigene Lebensmittel;
  - gespeicherte Mahlzeiten.
- Typische Portionsgrößen als Orientierung.
- Mengenoptionen: ⅛, ¼, ½, 1 plus freie Gramm-/Portionseingabe.
- Eigene Lebensmittel erstellbar/bearbeitbar/löschbar.
- Eigene Mahlzeiten aus mehreren Lebensmitteln und individuellen Mengen.
- kcal, Protein und Wasser werden summiert.
- Gespeicherte Mahlzeit kann später direkt als Portion eingetragen werden.
- Klick auf eingetragenes Lebensmittel öffnet direkte Mengenbearbeitung.
- Tastatur soll die Mengenbox sichtbar oberhalb der Tastatur halten.

## 15. Tastatur / Bottom-Sheets
- Bottom-Sheets besitzen Querbalken.
- Nach unten ziehen bewegt das Sheet.
- Ab einer Schwelle wird der Vorgang wie X/Abbrechen geschlossen.
- Darunter federt das Sheet zurück.
- Tastatur verschiebt nicht das gesamte Sheet.
- Nur der scrollbare Inhalt wird so angepasst, dass das aktive Eingabefeld sichtbar bleibt.

## 16. Speicher / Datenpflege
- Bestehende Kern-Storage-Keys bleiben erhalten:
  - `gymapp_plans`
  - `gymapp_custom_exercises`
  - `gymapp_workout_history`
  - `gymapp_active_workout`
  - `gymapp_measurements`
  - `gymapp_nutrition`
  - `gymapp_profile`
  - `rethink_week_plan`
  - `rethink_week_plan_dated_v1`
- Weitere aktuelle Keys:
  - Theme-/View-State;
  - `rethink_week_recurring_rules_v1`;
  - `rethink_week_recurring_exceptions_v1`.
- Jährliche Datenbereinigung ist opt-in und löscht nie ohne Bestätigung.
- Pläne, eigene Lebensmittel, Mahlzeiten und Messungen bleiben von dieser Verlaufsbereinigung geschützt.
- Wiederholungsregeln erzeugen keine wöchentlichen Plan-Kopien.

## 17. Qualitätsregel
- README ist der aktuelle Sollzustand, keine Historie.
- AUDIT.md dokumentiert technische Nachweise und Tests.
- Änderungen sollen funktionierende, nicht beanstandete Bereiche nicht zurückbauen.
- Bei Unsicherheit wird bestehender Code nicht aggressiv gelöscht.

## 18. Rethink_v3.1 — aktuelle Zusatzregeln
- Dateiname/Release-Bezeichnung ab diesem Stand: `Rethink_v3.1`.
- Trainingsplan-Sortierung:
  - erster Einsatz ohne gespeicherte Präferenz = `A–Z ↑`;
  - jede bewusst gewählte Sortierung und Pfeilrichtung wird persistent gespeichert;
  - echter Neustart stellt die letzte Sortierung wieder her;
  - Tab-Reset überschreibt diese Präferenz nicht.
- Übungsbibliothek-Tabreset:
  - Filter werden zurückgesetzt;
  - Trainingsart- und Muskelgruppenleiste springen gleichzeitig auf die linke Anfangsposition;
  - manuelles An-/Abwählen einzelner Filter behält die aktuelle horizontale Leistenposition.
- Hellmodus:
  - zentrale wichtige Aktionsbuttons verwenden einheitliches Flieder;
  - laufendes Workout ist im Training-Tab und im Wochenplan fliederfarben;
  - Texte der laufenden Workout-Karten sind schwarz;
  - die zugehörigen Aktionsbuttons behalten ihren bisherigen dunkleren Button-Farbton.
- Echter Neustart setzt die Profilansicht immer auf `Heute`, auch wenn ein laufendes Workout beim Start Priorität hat.

## Rethink_v3.1 — Fünf-Tab-Zustand
Für alle fünf Haupt-Tabs gilt:
- Tab verlassen und später zurückkehren → exakt den vorherigen Zustand wiederherstellen.
- Erhalten werden insbesondere Scrollposition, Filter, Suche, Sortierung, betrachtete Woche, betrachteter Profiltag, geöffnete Bereiche und horizontale Filterleisten.
- Ein Wechsel auf einen anderen Tab ist **kein Reset**.
- Beim bereits aktiven Tab:
  - erster Tap bei gescrollter Seite → nur an den Anfang scrollen;
  - zweiter Tap am Seitenanfang → bewusster Reset dieses Tabs.
- Übungsfilterleisten:
  - manueller Filterwechsel behält ihre horizontale Position;
  - bewusster Tab-Reset setzt Trainingsart- und Muskelgruppenleiste an den linken Anfang.
- Die Tab-Zustände werden zusätzlich während Standby/Seitenwechsel lokal gesichert.

## Rethink_v3.1 — Zustand der fünf Haupttabs
- Ein normaler Wechsel zwischen Übungen, Trainingsplänen, Training, Woche und Profil setzt **nichts** zurück.
- Beim Verlassen eines Tabs werden gespeichert:
  - vertikale Scrollposition;
  - horizontale Chip-/Filterpositionen;
  - Suchfelder und Auswahlfelder;
  - geöffnete Details;
  - der sichtbare DOM-Zustand des Tabs.
- Beim Zurückkehren wird genau dieser Zustand wiederhergestellt.
- Übungsfilter, Planansicht/Sortierung, Wochenansicht und Profiltag bleiben damit so stehen, wie sie verlassen wurden.
- Sonderaktion nur auf dem bereits aktiven Tab:
  - Tap bei gescrollter Seite → zum Anfang;
  - erneuter Tap am Anfang → bewusster Reset des Tabs.
- Beim bewussten Reset der Übungsbibliothek springen zusätzlich Trainingsart- und Muskelgruppenleiste an den linken Anfang.
- Dunkelmodus: Einstellungsbutton ist Flieder.
- Messungen-Plusbutton ist neutral: Dunkelmodus weiß, Hellmodus neutraler Standardbutton.

## Rethink_v3.1 — Zustand, Sheets und PWA-Cache
- Beim normalen Wechsel zwischen **allen fünf Haupttabs** bleiben der zuletzt sichtbare Bereich, vertikale Scrollposition, horizontale Chip-/Filterpositionen, offene Details und Eingabefelder so erhalten, wie der Tab verlassen wurde.
- Ein normaler Tabwechsel löst ausdrücklich **keinen Reset** aus.
- Nur der bewusste Reset über den bereits aktiven Tab setzt dessen Auswahl zurück; bei der Übungsbibliothek springen dann zusätzlich Trainingsart- und Muskelgruppenleiste ganz nach links.
- Die Übungsfilter selbst werden zusammen mit dem Tabzustand in der Session-UI gespeichert.
- Ein neu geladenes App-Dokument setzt die Profil-Tagesansicht auf **Heute**; reines Standby ohne Neuladen behält die aktuelle Ansicht.
- Einstellungsbutton im Dunkelmodus bleibt neutral; der Messungs-Plusbutton verwendet wieder die neutrale Standarddarstellung statt Flieder.
- Suchfelder in Bottom-Sheets sitzen näher an der jeweiligen Überschrift.
- Wiederholungsfelder (`X Wochen` / Datum) sind auf schmale Displays begrenzt und dürfen nicht horizontal aus dem Sheet ragen.
- `X Wochen`: Tippen/Fokus markiert die komplette Zahl, damit sie direkt überschrieben werden kann.
- Eingabefelder in Sheets werden über `VisualViewport` oberhalb der Bildschirmtastatur gehalten; dies gilt insbesondere für Getränke-, Lebensmittel- und Wiederholungsmengen.
- Der interne Service-Worker-Cache hat pro korrigiertem Build einen neuen Namen, damit die installierte PWA nicht versehentlich alte HTML-/Runtime-Dateien weiterverwendet.
