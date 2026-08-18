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
