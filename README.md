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
- Einstellungsbutton im Dunkelmodus ist Flieder; der Messungs-Plusbutton verwendet die neutrale Standarddarstellung statt Flieder.
- Suchfelder in Bottom-Sheets sitzen näher an der jeweiligen Überschrift.
- Wiederholungsfelder (`X Wochen` / Datum) sind auf schmale Displays begrenzt und dürfen nicht horizontal aus dem Sheet ragen.
- `X Wochen`: Tippen/Fokus markiert die komplette Zahl, damit sie direkt überschrieben werden kann.
- Eingabefelder in Sheets werden über `VisualViewport` oberhalb der Bildschirmtastatur gehalten; dies gilt insbesondere für Getränke-, Lebensmittel- und Wiederholungsmengen.
- Der interne Service-Worker-Cache hat pro korrigiertem Build einen neuen Namen, damit die installierte PWA nicht versehentlich alte HTML-/Runtime-Dateien weiterverwendet.

## Rethink_v3.1 — verifizierte Reparatur des Tab- und Tastaturverhaltens
- Normaler Wechsel zwischen **Übungen, Trainingspläne, Training, Woche und Profil** bewahrt:
  - vertikale Scrollposition;
  - horizontale Chip-/Filterposition;
  - Such-/Eingabefelder;
  - offene `<details>`-Bereiche;
  - logische Auswahlzustände wie Übungsfilter, betrachtete Woche und betrachteter Profiltag.
- Der Fehler, bei dem der Zustand des Ziel-Tabs vor der Wiederherstellung mit der Scrollposition des vorherigen Tabs überschrieben wurde, ist behoben.
- Aktiver Tab:
  - erster Tap bei gescrolltem Tab → nur nach oben;
  - nächster Tap am Seitenanfang → bewusster Reset.
- Übungsbibliothek-Reset setzt dann Filter **und** beide horizontalen Filterleisten auf Anfang.
- Einstellungsbutton im Dunkelmodus: Flieder.
- Messungsbutton: neutral/weiß im Dunkelmodus, neutral im Hellmodus.
- Wochenwiederholung:
  - Datum und X-Wochen-Feld passen in schmale Displays;
  - Enddatum kann nicht vor dem heutigen Tag liegen;
  - Tap auf X-Wochen fokussiert das Feld und markiert die komplette Zahl;
  - das Feld wird über der Softwaretastatur gehalten.
- Suchfelder in Bottom-Sheets stehen näher an ihrer Überschrift.
- Getränkewahl fokussiert direkt die Mengenbox; die Sheet-Scrollposition wird so angepasst, dass das Feld über der Softwaretastatur sichtbar bleibt.

## Rethink_v3.1 — Live-Workout Korrekturen
- Hydrierung: Nach Auswahl eines Getränks steht die Mengenbox oberhalb der Getränkeliste, erhält direkt Fokus und wird bei Tastaturöffnung innerhalb des Sheets sichtbar gehalten.
- Eine Trainingskarte bleibt nur so lange methodenfarbig hervorgehoben, bis wirklich alle Sätze aller zugehörigen Übungen vollständig bewertet wurden.
- Fertige Karten werden wieder neutral und zeigen oben rechts eine grüne Box `✓ Abgeschlossen`.
- Superset, Giant Set und Pre-Exhaust: Jede einzelne Übung kann auch im laufenden Workout gelöscht werden.
- Wird eine Übung aus einer verbundenen Gruppe gelöscht, werden alle verbleibenden Übungen dieser Gruppe an Ort und Stelle zu Standardübungen normalisiert.
- Alle Eingabefelder im laufenden Workout verwenden eine eigene Keyboard-Sichtbarkeitslogik mit zusätzlichem dynamischem Bottom-Space.
- Neue Workouts mit historischen Vorwerten zeigen vor der jeweiligen Satznummer einen kleinen Punkt in der Farbe der letzten Bewertung derselben Übung, Satzmethode und desselben WDH-/Zeitmodus.
- Trainingsplan-Picker im Training-Tab zeigt Sortierung in der Reihenfolge: `A–Z`, `Hinzugefügt`, `Geändert`, `Genutzt`.

## Rethink_v3.1 — Einheiten, Wochenstart und Textgröße
- Einstellungen enthalten jetzt eine eigene Sektion **Einheiten & Ansicht**.
- Gewicht: `kg` oder `lb`.
  - Trainingswerte, historische Vorwerte, Körpergewicht und Wunschgewicht werden in der gewählten Einheit angezeigt.
  - Bestehende Daten bleiben intern in kg gespeichert; Eingaben in lb werden beim Speichern zurück in kg konvertiert. Dadurch bleiben alte Pläne und Historien kompatibel.
  - Die Übungs-/Methodenmaske zeigt die aktuell gewählte Gewichtseinheit als Kontext an.
- Distanz: `km` oder `Miles`.
  - Die globale Distanzpräferenz wird gespeichert und in der Übungs-/Methodenmaske angezeigt; Distanzfelder verwenden diese Präferenz.
  - Intern bleibt die Basiseinheit km.
- Messungen: `cm` oder `Inches`.
  - Größe, Taille, Brust und Hüfte werden entsprechend angezeigt und eingegeben.
  - Intern bleiben bestehende Messwerte in cm gespeichert.
- Wochenstart: `Montag` oder `Sonntag`.
  - Tagesreihenfolge, Datumsbereich und Wochenansicht passen sich an.
  - Beim Umschalten werden vorhandene einmalige Wochenplan-Einträge anhand ihres echten Datums migriert, damit kein Workout auf einen falschen Tag rutscht.
  - Wiederholungsregeln bleiben datumsbasiert erhalten.
- Textgröße: `Standard`, `Groß`, `Sehr groß`.
  - Überschriften, Hilfstexte, Karten, Buttons und Eingabefelder skalieren gemeinsam.
- Bewertungspunkt aus dem letzten passenden Workout steht jetzt **hinter** der Satznummer: `1 •`, `1a •` usw.
- Löschen aus Giant Sets im laufenden Workout normalisiert logisch:
  - 4 → 3 Übungen: Giant Set bleibt Giant Set.
  - 3 → 2 Übungen: Gruppe wird Superset.
  - 2 → 1 Übung: verbleibende Übung wird Standard.

## Rethink_v3.1 — Neustart, Standby, Empfehlungen und aktive Karte
- **Echter App-/PWA-Neustart:** temporärer UI-Zustand wird auf Standard gesetzt:
  - Starttab Training;
  - Scrollpositionen aller fünf Tabs = Anfang;
  - Übungsfilter = Standard;
  - Wochenansicht = aktuelle Woche;
  - Profilansicht = Heute;
  - offene Unterseiten/Sheets werden nicht wiederhergestellt.
- Dauerhafte Nutzereinstellungen bleiben bei einem Neustart erhalten, z. B. kg/lb, km/mi, cm/in, Wochenstart, Textgröße, Theme, Pläne und Historie.
- **Standby / App nur im Hintergrund:** der vorhandene DOM-/UI-Zustand bleibt bestehen; beim Hintergrundwechsel wird der aktuelle Zustand zusätzlich gespeichert.
- Historische Trainingswerte werden wieder als graue Orientierung in KG/LB und WDH. eingeblendet, aber nur bei gleicher Übung, gleicher Satzmethode und gleichem WDH-/Zeitmodus.
- Zusätzlich erscheint wieder `Tipp nächstes Training` mit einer Empfehlung aus der letzten passenden Bewertung und den letzten sinnvollen Werten.
- Das Antippen, Fokussieren oder Ausfüllen von KG-/WDH-/Zeitfeldern verändert die aktive Kartenmarkierung **niemals**.
- Die aktive Kartenmarkierung richtet sich ausschließlich nach tatsächlich abgeschlossenen Bewertungen.
- Eine Einzelkarte bleibt hervorgehoben, bis alle ihre Sätze bewertet sind.
- Superset/Giant/Pre-Exhaust bleiben als gesamte Gruppe hervorgehoben, bis alle Sätze aller Gruppenmitglieder bewertet sind.
- Erst nach der letzten notwendigen Bewertung wird die aktuelle Karte neutral/abgeschlossen und die nächste logische Trainingseinheit markiert.

## Rethink_v3.1 — Textgröße und Eingabefokus
- Textgröße hat drei globale Stufen: Standard, Groß und Sehr groß.
- Die Skalierung gilt einheitlich für Überschriften, Karten, Buttons, kleine Hinweise, Labels, Suchfelder, Eingabefelder, Sheets und dynamisch erzeugte Inhalte.
- Groß entspricht ca. +12 %, Sehr groß ca. +24 % gegenüber Standard.
- Antippen/Fokussieren eines KG-/WDH-/Zeitfeldes ohne tatsächliche Eingabe verändert den Trainingsdatensatz nicht.
- Ohne Eingabe entstehen weder `0` noch `_touched` noch andere versteckte Änderungen.
- Grau hinterlegte Vorwerte bleiben nach Fokus/Blur grau als Orientierung erhalten.
- Erst echte Nutzereingabe schreibt einen neuen Wert in den Satz.

## Rethink_v3.1 — Einheitensystem, Sprache und Textgröße
- Einstellungen verwenden jetzt eine gemeinsame Oberkategorie **Einheitensystem**:
  - **Metrisch:** kg / km / cm / ml / g
  - **Imperial:** lb / mi / in / oz; Lebensmittelmengen werden unter 1 lb in oz und ab 1 lb in lb angezeigt.
- Intern bleiben bestehende Daten in den bisherigen Basiseinheiten gespeichert, damit alte Pläne, Workouts und Historien kompatibel bleiben.
- Körpergröße wird im Imperial-System im Profil als **ft + in** dargestellt.
- Gewicht wird kg ↔ lb umgerechnet.
- Distanz wird km ↔ mi umgerechnet.
- Körpermaße werden cm ↔ in umgerechnet.
- Getränkemengen werden ml ↔ oz umgerechnet.
- Bei zeit-/cardiobasierten Übungen kann pro Satz zusätzlich Distanz eingetragen werden.
- Lebensmittelmengen werden bei Imperial sinnvoll als oz bzw. bei größeren Mengen als lb dargestellt.
- Textgröße besitzt drei globale Stufen: **Standard / Groß / Sehr groß**. Die Skalierung gilt appweit einschließlich Formulare und Buttons.
- Sprache besitzt **Deutsch** (Default) und **Englisch**.
- UI-Texte werden übersetzt; **Übungsnamen, Plannamen, eigene Lebensmittel-/Mahlzeitennamen und Notizen bleiben unverändert**.
- Ein bloßer Fokus/Klick in ein leeres Trainingsfeld verändert dessen Wert nicht. Ein leeres Feld darf insbesondere nicht automatisch `0` erhalten und übernimmt dadurch auch keinen grauen Vorwert.

## Rethink_v3.1 — Lebensmitteldatenbank v3
- Final bereinigter Stand: 1.700 Lebensmittel.
- Alle automatisch erzeugten Suffix-Familien `– TK`, `– gegrillt`, `– gegart`, `– gedünstet`, `– geröstet`, `– fettarm`, `– light` und `– gekocht` wurden aus dem Altbestand entfernt.
- Reale Zubereitungs- oder Produktvarianten bleiben nur dort bestehen, wo sie als eigenständiger, klar benannter Datensatz angelegt wurden.
- Nach Normalisierung der Namen existieren keine Namensdubletten mehr.
- Entfernte Generatorvarianten wurden durch neue reale Lebensmittel, Zutaten, Proteinquellen, Getreide, Brote, Pasta, Milchprodukte, Fisch-/Fleischsorten, Snacks, Saucen, Gerichte und internationale Speisen ersetzt.

## Rethink_v3.1 — Hydrierung Mengenbestätigung
- Die Getränkemenge wird oben in der Hydrierungsmaske bearbeitet.
- Rechts direkt in der Mengenbox befindet sich `+ Eintragen`.
- Alternativ bestätigt die Enter-/Done-Taste der Bildschirmtastatur die Menge sofort.
- Der bisherige separate große Eintragen-Button unterhalb der Getränkeliste wurde entfernt.

- Fix: Sprachumschaltung verändert im Tab `Pläne` nur noch den Textknoten; das bestehende Plan-SVG-Symbol bleibt erhalten.

## Daten & Backup
- Einstellungen: Backup erstellen / Backup wiederherstellen.
- Exportiert dauerhafte Nutzerdaten als JSON; temporäre UI-Zustände nicht.
- Wiederherstellung ersetzt nach Sicherheitsabfrage den lokalen Datenbestand und lädt die App neu.
- Kein Programmcode wird verändert. Backup/Restore kann Daten zwischen getrennten lokalen PWA-Speichern übertragen; es ist kein automatischer Cloud-Sync.

## UI-Feinschliff
- Sprache und Textgröße speichern die Auswahl und lösen anschließend einen echten Reload aus; der aktuelle Sitzungs-/Öffnungsstand wird vorher gesichert.
- Leerer Pläne-Tab: Begrüßungskarte mit `Trainingsplan erstellen`.
- Kalorien-/Proteinwerte und Balken in `Ernährung heute` größer.
- `Meine Getränke` und `Meine Lebensmittel & Mahlzeiten` typografisch angeglichen.
- Erklärung unter Hell/Dunkel entfernt.
- sichtbares `Plane` zu `Pläne` korrigiert.

## Vollständige Deutsch-/Englisch-Oberfläche
- Alle festen UI-Texte in Navigation, Tabs, Trainingsplaneditor, Übungsmasken, Live-Workout, Bewertungsdialogen, Wochenplan, Profil, Messungen, Hydrierung, Ernährung, Einstellungen, Backup und Sicherheitsabfragen werden bei Englisch übersetzt.
- Dynamische feste Texte wie Satz-/Übungsanzahlen, Kalenderwoche und Methodenhinweise werden ebenfalls übersetzt.
- Übungsnamen und Plannamen bleiben ausdrücklich unverändert. Freie Nutzertexte/Notizen werden ebenfalls nicht automatisch übersetzt.

## Eindeutige Plannamen
- Zwei Trainingspläne dürfen nicht denselben Namen besitzen.
- Vergleich ignoriert Groß-/Kleinschreibung, führende/abschließende Leerzeichen und doppelte Leerzeichen.
- Beim Bearbeiten darf ein Plan seinen eigenen bestehenden Namen behalten.
- Bei Namenskollision wird Speichern/Starten blockiert und der Nutzer muss einen anderen Namen wählen.
- Automatisch als neuer Plan erzeugte Versionen (`Push 2`, `Push 3` usw.) bleiben weiterhin eindeutig.

## Ernährungsziele – Profil/Home
- `Bearbeiten` neben `Ernährung heute` entfernt.
- Kalorien-/Protein-Labels entsprechen typografisch `Menge`/`Ziel` der Hydrierung.
- Kalorien-/Protein-Fortschrittsbalken haben dieselbe Höhe wie der Hydrierungsbalken.
- Unter Ernährung befindet sich eine klappbare Karte `Ernährungsziele`.
- Eingeklappt: Überschrift + `Persönlichen Wert berechnen`.
- Aufgeklappt: exakt die drei Zielwerte Kalorien/Tag, Protein g/Tag und Flüssigkeit ml/Tag mit direkter Bearbeitung und `Ziele speichern`.
- Die bestehende Zielberechnungsformel wird unverändert verwendet; berechnete Werte werden direkt gespeichert und in den Feldern angezeigt.
- `Meine Getränke` und `Meine Lebensmittel & Mahlzeiten` wurden leicht kleiner gesetzt.

## UI-Korrektur – Ernährungsziele & Wochenplan-Suche
- `Ernährungsziele` steht normal linksbündig; der Auf-/Zuklapp-Pfeil sitzt rechtsbündig.
- Die Plansuche beim Hinzufügen zum Wochenplan baut das Suchfeld während der Eingabe nicht mehr neu auf. Dadurch bleibt die Tastatur beim Tippen mehrerer Buchstaben geöffnet.
- Tippen/Scrollen außerhalb kann die Tastatur weiterhin schließen.

## ReThink v3.1 – Ernährungs-, Zeit-, Partner- und Backup-Fixes
- Wasser aus Lebensmitteln wird in der Hydrierungsanzeige mitgerechnet.
- Ernährungsfelder bleiben bei geöffneter iOS-Tastatur sichtbar; die Lebensmittelsuche bleibt stabil.
- `Dead Hang` und `Calf Raises` ergänzt.
- Zeitübungen verwenden den nativen iOS-Auswahl-Roller: Cardio bis 60:00, sonstige Zeitübungen bis 10:00.
- Partnerübung 2+ nutzt für `Wiederholungen pro Seite` dasselbe Formularlayout wie Übung 1.
- Neu erstellte Supersets/Giant Sets/Pre-Exhaust behalten exakt die Auswahlreihenfolge A, B, C …
- Backup erstellt direkt die JSON-Datei; kein vorgeschalteter Teilen-Dialog.

## Globaler Tastatur-/Eingabefeld-Fix
Der iOS-Sichtbarkeitsschutz gilt jetzt appweit für alle relevanten Eingabefelder, nicht nur Ernährung. Dazu gehören insbesondere Übungssuche, Übungen hinzufügen/bearbeiten im Planeditor, laufendes Training, Zahlenfelder, Suchfelder, Profil und Wochenplan. Beim Öffnen bzw. Verändern der Tastatur wird das aktive Feld innerhalb des sichtbaren Bereichs gehalten.

## iOS Tastatur – VisualViewport-Fix
- Bei geöffneter Tastatur wird nicht mehr nur das Eingabefeld gescrollt.
- Bottom-Sheets und geöffnete Vollseiten werden auf die tatsächlich sichtbare `visualViewport`-Höhe begrenzt.
- Dadurch kann die umgebende Karte nicht mehr hinter der Tastatur liegen.
- Das aktive Eingabefeld wird nach jeder Größenänderung der iOS-Tastatur zusätzlich in den sichtbaren Bereich nachgeführt.

## Katalogkorrektur
- `Dead Hang` und `Calf Raises` wurden in die tatsächlich von `allExercises()` verwendete Datenquelle `DEFAULT_EXERCISES` aufgenommen. Dadurch erscheinen sie jetzt im sichtbaren Übungskatalog, in der Suche und beim Hinzufügen zu Plänen/Partnergruppen.

## Selektives Backup v2
Das Backup sichert nur noch persönliche Nutzerdaten:
- Profil einschließlich Gewicht und Körpermessungen
- Ernährung und Hydrierung einschließlich eigener Lebensmittel/Mahlzeiten und Ziele
- Trainingspläne
- eigene Übungen, soweit sie als Abhängigkeit von Trainingsplänen benötigt werden
- Wochenplan einschließlich Wiederholungsregeln

Nicht gesichert bzw. nicht wiederhergestellt werden:
- Programmcode
- UI-, Scroll-, Filter- oder Seitenzustände
- Cache-/Session-Daten
- Theme, Sprache und sonstige technische Preferences
- laufendes Workout
- Workout-Historie

Damit kann ein Restore neue Codeänderungen nicht mehr durch alte technische LocalStorage-Werte überlagern.

## Persönliches Backup v3
Das Backup enthält jetzt vollständig die persönlichen Nutzerdaten:
- Trainingspläne
- selbst hinzugefügte Übungen
- abgeschlossene Trainings / Workout-Historie
- Wochenplan einschließlich datumsbasierter Wochen und Wiederholungsregeln
- Profil
- Gewicht und sämtliche Körpermessungen
- Ernährungstagebuch
- Ernährungsziele
- eigene Lebensmittel und Mahlzeiten
- Getränkedefinitionen
- vollständiger Trink-/Hydrierungsverlauf

Bewusst NICHT Bestandteil des Backups:
- integrierter Standard-Übungskatalog (`DEFAULT_EXERCISES`)
- App-Code
- Service Worker / Cache
- UI-, Scroll- und Filterzustände
- laufendes Workout
- technische App-Einstellungen

Dadurch bleiben eigene Übungen erhalten, während ein App-/Firmware-Update den integrierten Übungskatalog erweitern oder korrigieren kann. Ein Restore ersetzt nur persönliche Daten und kann neue Standardübungen aus einer neueren App-Version nicht entfernen.

## Sichtbarer Fix M
- Dead Hang und Calf Raises im tatsächlich verwendeten Standardkatalog abgesichert.
- Legacy-Hide-Einträge für genau diese neuen Übungen werden einmalig entfernt.
- `NORMAL` wird sichtbar zu `STANDARD`.
- Die alte zweite Empfehlung `.recommendation` wird ausgeblendet; nur `Tipp nächstes Training` bleibt.
- Pausensignal deutlich länger und kräftiger.
- Großer zentraler Play-Button auf der Trainingsseite.
- Runtime/foods mit Cache-Busting-URL und neuem Service-Worker-Cache.
- VisualViewport-Tastaturfix wieder enthalten.

## Trainingsstart-Button
- Der zentrale Play-Button auf der Trainingsseite ist jetzt größer und rechteckig mit stark abgerundeten Ecken.
- Farbgebung und Kontrast bleiben im bestehenden ReThink-Flieder-/Kartenstil.

## ReThink. Fitness — Full Safe Backup
Ab diesem Stand trägt die ausgelieferte Datei den Namen `ReThink. Fitness`.

`Full Safe` sichert alle persönlichen persistenten Nutzerdaten:
- Trainingspläne
- selbst hinzugefügte Übungen
- abgeschlossene Trainings / Workout-Historie
- ein aktuell laufendes Workout
- Wochenplan inklusive datumsbasierter Wochen, Wiederholungen und Ausnahmen
- vollständiges Profil
- Gewicht und sämtliche Körpermessungen
- Ernährungstagebuch
- Ernährungsziele
- eigene Lebensmittel und Mahlzeiten
- Getränkedefinitionen
- vollständiger Hydrierungs-/Trinkverlauf
- persönliche Datenaufbewahrungsoptionen

Nicht Bestandteil eines Full-Safe-Backups:
- App-Code / HTML / JavaScript / CSS
- integrierter Standard-Übungskatalog
- Service Worker / Cache
- Scrollpositionen, Filter, geöffnete Screens und sonstige temporäre UI-Zustände

Dadurch bleiben Code-Updates, neue Standardübungen und größere Funktionsänderungen der jeweils installierten App-Version erhalten, auch wenn danach ein älteres Full-Safe-Backup wiederhergestellt wird.

## Play-Button – finale Geometrie
Der zentrale Trainingsstart-Button wird mit einer abschließenden, spezifischen CSS-Regel auf 132 × 104 px und 22 px Eckenradius festgesetzt. Breite, Höhe, min/max-Dimensionen, `appearance` und `clip-path` werden explizit überschrieben, damit ältere runde `.icon-btn`-/Button-Regeln ihn nicht mehr kreisförmig darstellen können.

## Training läuft – Startbutton
Sobald `activeWorkout` existiert, werden sowohl die gesamte Karte „Training starten“ als auch der Play-/Startbutton explizit ausgeblendet und deaktiviert. Die `hidden`-Regel besitzt `!important`, damit die Inline-Darstellung des großen Play-Buttons das Ausblenden nicht mehr übersteuern kann. Nach Beenden oder Verwerfen des laufenden Trainings erscheint der Startbereich wieder.

## Vollbackup v5 – Datensicherheit
Die Backup-Funktion erstellt jetzt einen vollständigen Snapshot von **allen `localStorage`-Einträgen** der App. Damit werden nicht mehr nur vorher definierte Schlüssel gesichert, sondern auch Datenbereiche, die durch neue Funktionen später hinzukommen.

Dazu gehören damit insbesondere Trainingspläne, eigene Übungen, Übungshistorie und Empfehlungen, abgeschlossene Trainings, laufende Trainings, Wochenpläne, Profil, Gewicht/Körpermaße, Ernährung, Lebensmittel, Mahlzeiten, Hydrierung, Getränke, Ziele, Einstellungen und weitere persistente App-Daten.

### Restore-Sicherheitsregel
Beim Wiederherstellen wird `localStorage` **niemals geleert**. Ebenso werden keine vorhandenen Schlüssel gelöscht, nur weil sie in einem älteren Backup fehlen. Die im Backup enthaltenen Werte werden über die entsprechenden gespeicherten Werte geschrieben; neuere zusätzliche Datenbereiche bleiben bestehen.

HTML, CSS, JavaScript, `DEFAULT_EXERCISES` und andere Dateien der installierten App sind keine `localStorage`-Daten und werden durch dieses Backup daher nicht zurückgesetzt.

## JSON-Wiederherstellung – kompatibler Import
Die Wiederherstellung akzeptiert jetzt:
- aktuelle ReThink-Vollbackups (`localStorage`)
- ältere ReThink-Backupvarianten mit `data` oder `storage`
- ältere verschachtelte `data.localStorage`-Backups
- rohe LocalStorage-Key/Value-JSONs

Der starre Schema-Abgleich wurde für den Import entfernt. Dadurch können ältere von ReThink erzeugte JSON-Sicherungen wieder eingespielt werden. Die JSON-Datei wird validiert; unbekannte JSON-Strukturen werden mit einer verständlichen Fehlermeldung abgelehnt. Der iOS-Dateiauswahldialog wird bei jedem Restore frisch erzeugt, sodass auch dieselbe Datei erneut gewählt werden kann.
