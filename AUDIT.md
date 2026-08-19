# ReThink Rethink_v3.1 — Audit

Diese Datei dokumentiert technische Nachweise des ausgelieferten v70-Stands. `PASS` bedeutet, dass der jeweilige Pfad im Code vorhanden ist bzw. der angegebene Test erfolgreich ausgeführt wurde.

## Automatische Prüfungen
- PASS — Syntax index inline
- PASS — Syntax runtime-current.js
- PASS — Syntax foods.js
- PASS — Syntax sw.js
- PASS — Manifest JSON
- PASS — 1.500 Lebensmittel
- PASS — Bewertungskern vorhanden
- PASS — Satzpause nach Bewertung
- PASS — Gruppenpause reihenfolgeunabhängig
- PASS — Historische Werte methodenspezifisch
- PASS — Giant 3–6
- PASS — Partnerkatalog
- PASS — Vorschau über Live-Karten
- PASS — Tab Reset/Scroll
- PASS — Profil Neustart Heute
- PASS — Pausentimer Body-Dock
- PASS — Wochen Running-State
- PASS — Wochen Reihenfolge-Badges
- PASS — Wochenbereich ±104
- PASS — Wiederholung count/date/once
- PASS — Wiederholung ohne Kopien
- PASS — Nur diese Woche
- PASS — Diese und folgende
- PASS — Nur dieses Workout entfernen
- PASS — Wiederholung ab hier beenden
- PASS — Wiederholungsmarker
- PASS — Eigene Lebensmittel/Mahlzeiten Suche
- PASS — ⅛ ¼ ½ 1
- PASS — Getränk Fokus
- PASS — Jahresbereinigung Opt-in

## Wiederholungslogik — ausgeführte Unit-Tests mit dem echten v70-JavaScript-Block
- PASS — 8-Wochen-Regel ist in Woche 1–8 aktiv und in Woche 9 beendet.
- PASS — `Nur diese Woche` ersetzt nur die gewählte Instanz; die Folgewoche bleibt in der Serie.
- PASS — `Diese und folgende Wochen` beendet die alte Serie ab dem gewählten Punkt und startet die neue Serie.
- PASS — `Nur dieses Workout entfernen` entfernt genau eine Instanz, spätere Wiederholungen bleiben.
- PASS — `Wiederholung ab hier beenden` entfernt aktuelle/folgende Serieninstanzen.
- PASS — Datumsregel ist bis einschließlich Enddatum aktiv und danach beendet.

## Geräteabhängig weiterhin real zu prüfen
- iOS-Tastatur/VisualViewport mit echter Bildschirmtastatur.
- Audio/Notification am Pausenende bei Hintergrundzuständen.
- Drag-to-dismiss mit Finger auf unterschiedlichen iPhone/iPad-Höhen.
- Service-Worker-Upgrade von sehr alten bereits installierten Homescreen-PWA-Versionen.

## v70 Speicherprinzip
- Wiederholungen speichern Regeln statt wöchentlicher Kopien.
- Regeln verweisen auf bestehende Plan-IDs und bewahren die Auswahlreihenfolge.
- Regeln zu gelöschten Plänen werden sicher entfernt.
- Ausnahmen werden nur für tatsächlich abweichende Einzelwochen gespeichert.

## Abschlussprüfung v70
- PASS — Wiederholungs-Unit-Tests nach finalem Code erneut ausgeführt.
- PASS — Alle JavaScript-Dateien syntaktisch gültig.
- PASS — Inline-JavaScript aus `index.html` syntaktisch gültig.
- PASS — Manifest gültiges JSON; alle Icon-Dateien vorhanden.
- PASS — Alle vom Service Worker referenzierten lokalen Assets vorhanden.
- PASS — HTML enthält `foods.js` und `runtime-current.js`.
- PASS — ZIP wird nach Erstellung auf Integrität geprüft.

## Rethink_v3.1 gezielte Verifikation
- PASS — erster Sortierzustand ohne Präferenz = A–Z ↑.
- PASS — Sortierauswahl wird unter `rethink_plan_sort_v31` gespeichert.
- PASS — gespeicherte Sortierung wird nach Neustart wiederhergestellt.
- PASS — Tab-Reset der Trainingspläne überschreibt die gespeicherte Sortierung nicht.
- PASS — Übungsbibliothek-Reset setzt `typeChips.scrollLeft` und `muscleChips.scrollLeft` auf 0.
- PASS — manueller Filterklick enthält keinen erzwungenen Scroll-Reset.
- PASS — Profil-Tag wird bei echtem Neustart vor der Active-Workout-Prioritätsprüfung auf Heute gesetzt.
- PASS — laufende Workout-Karten in Training und Woche verwenden Flieder mit schwarzer Schrift.
- PASS — Wochen-Play-Button behält den bisherigen dunkleren Farbton.
- PASS — wichtige Aktionsbuttons im Hellmodus nutzen einheitliches Flieder.

## Rethink_v3.1 — Tab-State Audit
- PASS — Wechsel auf inaktiven Tab ruft `showTab(..., reset:false)` auf.
- PASS — normaler Tabwechsel überspringt Re-Render bei bereits besuchtem Tab.
- PASS — Scrollposition wird pro Tab erfasst und wiederhergestellt.
- PASS — horizontale `.chips`-Positionen werden pro Tab erfasst/wiederhergestellt.
- PASS — `details[open]` werden pro Tab erfasst/wiederhergestellt.
- PASS — Tab-eigene Inputs werden als UI-Zustand erfasst.
- PASS — manueller Übungsfilter-Render bewahrt `typeChips.scrollLeft` und `muscleChips.scrollLeft`.
- PASS — bewusster zweiter Tab-Tap setzt Filter und horizontale Filterleisten zurück.

## Rethink_v3.1 — Tab-State-Prüfung
- PASS — normaler Tabwechsel nutzt `showTab(...,{reset:false})`.
- PASS — `showTab` ruft vor dem Wechsel `captureTabUiState(currentTab)` auf.
- PASS — `restoreTabUiState` stellt vertikalen Scroll, horizontale Chippositionen, Inputs und Details wieder her.
- PASS — normaler Wechsel rendert einen bereits besuchten Tab nicht neu.
- PASS — Reset bleibt ausschließlich der aktiven-Tab-Sonderaktion vorbehalten.
- PASS — Settings ist im Dunkelmodus Flieder.
- PASS — Messungen-Plus ist im Dunkelmodus weiß und im Hellmodus neutral.


## Rethink_v3.1 — Chat-/Datei-Abgleich
- PASS — five tab state model
- PASS — normal switch no reset
- PASS — second tap reset
- PASS — exercise horizontal state
- PASS — exercise ribbon deliberate reset
- PASS — tab state persisted
- PASS — profile new document today
- PASS — plan sort persistent
- PASS — rating four colors
- PASS — pause after rating
- PASS — group pause order independent
- PASS — method history restore
- PASS — method colored borders
- PASS — rest timer fixed
- PASS — week completion cleanup
- PASS — week recurring rules
- PASS — week running resume
- PASS — week order numbering
- PASS — profile streak rules
- PASS — food 1500
- PASS — food search meals custom
- PASS — keyboard visual viewport
- PASS — repeat fields responsive
- PASS — repeat weeks select all
- PASS — dark settings neutral
- PASS — measurement neutral
- PASS — search spacing tight
- PASS — fresh service worker cache

### Geräteabhängig weiterhin nur auf echtem iPhone/iPad abschließend prüfbar
- tatsächliche iOS-Tastaturhöhe/Animation in installierter Homescreen-PWA;
- Scrollen mit sichtbarer Tastatur und anschließendes Dismiss;
- Standby vs. von iOS verworfener/re-konstruierter PWA-Prozess;
- Service-Worker-Aktualisierung einer bereits länger installierten Version.


## Rethink_v3.1 — vollständiger erneuter Abgleich nach Reparatur
- PASS — tab state all 5
- PASS — exercise filter state
- PASS — week state
- PASS — profile state
- PASS — tab second tap reset
- PASS — plan sort persistent
- PASS — true start training
- PASS — profile fresh today
- PASS — rating 4
- PASS — pause after rating
- PASS — group pause order
- PASS — pause signal end
- PASS — history same method mode
- PASS — method frames
- PASS — active method focus
- PASS — pause bottom
- PASS — giant 3 6
- PASS — partner catalog
- PASS — preview live cards
- PASS — week running
- PASS — week order
- PASS — week recurring
- PASS — week delete completion
- PASS — week counter
- PASS — streak 3 entries
- PASS — food 1500
- PASS — food search meals
- PASS — food fraction units
- PASS — drink focus final
- PASS — repeat keyboard
- PASS — repeat future date
- PASS — light theme
- PASS — dark settings lilac
- PASS — measurement neutral
- PASS — search gap
- PASS — annual cleanup optin
- PASS — data compatibility

### Ausgeführte Browser-DOM-Tests dieses Builds
- PASS — alle fünf Tabs behalten ihre jeweilige vertikale Scrollposition.
- PASS — Übungsbibliothek behält Trainingsart, Muskelgruppe, Suchtext und beide horizontalen Filterpositionen.
- PASS — Woche behält den betrachteten Wochenoffset.
- PASS — Profil behält den betrachteten Tag beim normalen Tabwechsel.
- PASS — erster Tap auf aktiven gescrollten Tab scrollt nur nach oben; nächster Tap setzt zurück.
- PASS — Einstellungsbutton im Dunkelmodus ist Flieder.
- PASS — Messungsbutton im Dunkelmodus ist weiß/neutral.
- PASS — X-Wochen-Feld bleibt innerhalb des Sheets, erhält Fokus und markiert den kompletten Inhalt.
- PASS — Datumsfeld bleibt innerhalb des Sheets und blockiert vergangene Enddaten.
- PASS — Suchfeldabstand zur Sheet-Überschrift wurde auf ca. 12,5 px reduziert.
- PASS — Getränkewahl fokussiert die Mengenbox.
- PASS — simulierte kleinere VisualViewport-Höhe verschiebt die Mengenbox innerhalb des Sheets über den Tastaturbereich.

### Noch nur auf echtem iOS-Gerät abschließend prüfbar
- sichtbares Öffnen der nativen iOS-Tastatur (Headless-Browser kann nur Fokus/Selektion prüfen);
- echtes Scroll-/Dismiss-Verhalten mit iOS-Tastatur;
- Standby vs. von iOS komplett verworfener PWA-Prozess;
- Update einer bereits installierten alten Homescreen-PWA.

## Rethink_v3.1 — Live-Workout Prüfungen
- PASS — Einzelkarte unvollständig: keine Abschlussbox, aktive Methodenfärbung bleibt.
- PASS — Einzelkarte vollständig bewertet: grüne `Abgeschlossen`-Box erscheint, aktive Methodenfärbung endet.
- PASS — Superset unvollständig: Färbung bleibt, keine Abschlussbox.
- PASS — Superset vollständig bewertet: Abschlussbox erscheint, Färbung endet.
- PASS — Superset-Mitglieder besitzen Löschzugänge im laufenden Workout.
- PASS — Löschen eines Superset-Mitglieds: verbleibende Übung wird Standard, `techniqueGroup` wird entfernt.
- PASS — Vorbewertungs-Punkte erscheinen bei Einzelmethoden und Gruppenmethoden.
- PASS — Trainingsplan-Picker Reihenfolge: A–Z → Hinzugefügt → Geändert → Genutzt.
- PASS — Hydrierungs-Mengenfeld steht vor der Getränkeliste und erhält nach Auswahl Fokus.
- PASS — Live-Workout-Fokus erzeugt dynamischen Bottom-Space und scrollt den Live-Screen nach oben.
- Geräteprüfung erforderlich — tatsächliche native iOS-Tastaturanimation und endgültige Pixelposition auf iPhone/iPad.


## Rethink_v3.1 — Einheiten-/Gruppenprüfung
- PASS — Giant Set mit 3 Übungen: Löschen einer Übung ergibt ein 2er-Superset.
- PASS — Giant Set mit 4 Übungen: Löschen einer Übung ergibt weiterhin ein 3er-Giant-Set.
- PASS — Bewertungs-Punkt steht hinter der Satznummer und überlagert sie nicht.
- PASS — Standardpräferenzen: kg / km / cm / Montag / Standardtext.
- PASS — Gewichtsumrechnung: 100 kg ↔ ca. 220,5 lb; gespeicherte Basis bleibt kg.
- PASS — Längenumrechnung: 100 cm ↔ ca. 39,4 in; gespeicherte Basis bleibt cm.
- PASS — Distanzumrechnung: 10 km ↔ ca. 6,21 mi.
- PASS — Live-Workout zeigt bei lb die Überschrift `LB` und speichert Eingaben kanonisch in kg.
- PASS — Messungsmaske übernimmt Gewicht- und Längeneinheiten und speichert kanonisch.
- PASS — Wochenstart Sonntag zeigt `So · Mo · Di · Mi · Do · Fr · Sa`.
- PASS — Bestehende Wochenplan-Einträge werden beim Wechsel des Wochenstarts nach Datum migriert.
- PASS — Textgrößenpräferenz setzt den gewählten Darstellungsmodus am Root-Element.

## Rethink_v3.1 — Neustart/Empfehlung/Markierung
- PASS — echter Neustart setzt Tab auf Training, alle fünf Scrollstände auf 0, Übungsfilter zurück, Woche auf aktuell und Profil auf Heute.
- PASS — dauerhafte Präferenzen wie lb/mi/in, Wochenstart und Textgröße überleben den transienten Neustart-Reset.
- PASS — letzter passender Workout-Datensatz liefert wieder graue Gewicht-/WDH.-Vorwerte.
- PASS — `Tipp nächstes Training` wird aus letzter passender Methode + Bewertung berechnet.
- PASS — Klick/Eingabe im letzten WDH.-Feld verändert `activeExerciseIndex` nicht.
- PASS — Bewertung eines früheren Satzes lässt die Karte aktiv.
- PASS — ausgefüllter letzter Satz ohne Bewertung lässt die Karte aktiv.
- PASS — erst die letzte Bewertung schließt die Karte ab und aktiviert die nächste.

## Rethink_v3.1 — Textgröße / leere Eingabe
- PASS — Fokus + Blur im Gewichtsfeld ohne Eingabe: Wert bleibt leer, grauer Vorwert bleibt sichtbar, `_touched` bleibt false.
- PASS — Fokus + Blur im WDH.-Feld ohne Eingabe: Wert bleibt leer, grauer Vorwert bleibt sichtbar, `_touched` bleibt false.
- PASS — tatsächliche Eingabe `82.5` wird gespeichert.
- PASS — Standard → Groß vergrößert H1, Buttons, kleine Texte, Eingaben und Kartentexte.
- PASS — Groß → Sehr groß vergrößert dieselben Elemente erneut.
- PASS — dynamisch erzeugte Inhalte werden über MutationObserver ebenfalls skaliert.

## Rethink_v3.1 — Einheitensystem/Sprache/Textgröße
- PASS — Default Einheitensystem = Metrisch; Default Sprache = Deutsch.
- PASS — Imperial setzt Gewicht lb, Distanz mi und Körpermaße in.
- PASS — 100 kg werden als ca. 220,5 lb dargestellt.
- PASS — 10 km werden als ca. 6,21 mi dargestellt.
- PASS — 100 cm werden als ca. 39,4 in dargestellt.
- PASS — 250 ml werden als ca. 8,5 oz dargestellt.
- PASS — 100 g werden imperial als oz, 1000 g als lb dargestellt.
- PASS — Profilgröße 180 cm wird imperial als ft + in dargestellt.
- PASS — zeit-/cardiobasierte Live-Sätze besitzen ein optionales Distanzfeld und speichern intern km.
- PASS — Klick/Fokus auf ein leeres Trainingsfeld lässt Anzeige und gespeicherten Wert leer; kein automatisches `0`.
- PASS — Textgröße Groß setzt die globale Textskalierung auf 115%; Sehr groß auf 130%.
- PASS — Deutsch/Englisch-Umschaltung übersetzt UI-Navigation.
- PASS — Übungsname und Planname bleiben bei Sprachumschaltung unverändert.
