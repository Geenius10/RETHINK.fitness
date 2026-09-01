
"use strict";
const STORAGE={plans:"gymapp_plans",custom:"gymapp_custom_exercises",library:"gymapp_exercise_library",history:"gymapp_workout_history",active:"gymapp_active_workout",measurements:"gymapp_measurements",nutrition:"gymapp_nutrition",profile:"gymapp_profile"};
const WEEK_KEY="rethink_week_plan",WEEK_DATED_KEY="rethink_week_plan_dated_v1",REST_DEFAULT_KEY="rethink_default_rest",REST_END_KEY="geeniusapp_rest_end";
const DEFAULT_EXERCISES=[{"id":1,"name":"Bench Press","categories":["Gewichte"],"muscles":["Arme/Hände","Brust","Schulter"],"variants":["Incline","Decline"],"equipment":["Barbell","Dumbbell"],"equipmentDisplay":"Barbell, Dumbbell | Default: Barbell","equipmentRequired":true,"defaultEquipment":"Barbell","execution":"Aufbau: Verwende eine stabile Hantelbank. Für Flat liegt die Rückenlehne waagerecht; für Incline wird das Kopfende angehoben; für Decline liegt das Kopfende tiefer und die Beine müssen sicher fixiert sein. Bei der Barbell-Variante liegt die Langhantel in einer Ablage über dem oberen Brustbereich; stelle die Ablage so ein, dass du die Hantel mit fast gestreckten Armen herausheben kannst, ohne die Schultern von der Bank lösen zu müssen. Bei Dumbbells nimmst du je eine Kurzhantel und setzt dich zunächst auf die Bank, bevor du dich kontrolliert zurücklehnst. Ausgangsposition: Lege Hinterkopf, oberen Rücken und Gesäß auf die Bank. Stelle die Füße fest auf den Boden beziehungsweise bei einer Decline-Bank in die vorgesehenen Halterungen. Ziehe die Schulterblätter leicht nach hinten und unten, hebe die Brust etwas an und spanne Bauch sowie Gesäß an. Greife die Langhantel so, dass die Unterarme am unteren Punkt ungefähr senkrecht stehen; die Handgelenke bleiben möglichst gerade über den Unterarmen. Bewegung: Löse die Hantel aus der Ablage und bringe sie mit gestreckten Armen über die Brust. Senke sie langsam und kontrolliert zur mittleren bis unteren Brust, während die Ellbogen schräg unterhalb der Schulterlinie bleiben. Bei Kurzhanteln bewegen sich beide Hanteln seitlich der Brust nach unten. Endposition/ Rückweg: Stoppe, sobald du die Last kontrolliert halten kannst und die Schultern nicht nach vorn kippen. Drücke die Last über die Handflächen wieder nach oben, bis die Arme fast gestreckt sind. Setze die Langhantel erst nach der letzten Wiederholung sicher in beiden Ablagehaken ab. Wichtig: Der Kopf bleibt auf der Bank, die Füße bleiben belastet und die Schulterblätter verlieren während der Wiederholung nicht ihre stabile Position.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":2,"name":"Biceps Curls","categories":["Gewichte","Geräte"],"muscles":["Arme/Hände"],"variants":[],"equipment":["Barbell","Dumbbell","Cable"],"equipmentDisplay":"Barbell, Dumbbell, Cable | Default: Dumbbell","equipmentRequired":true,"defaultEquipment":"Dumbbell","execution":"Aufbau: Halte eine Langhantel, zwei Kurzhanteln oder einen Kabelgriff vor dem Körper. Beim Kabelzug stelle die Rolle tief ein und gehe so weit zurück, dass bereits in der Ausgangsposition leichte Spannung auf dem Kabel liegt. Ausgangsposition: Richte den Oberkörper auf, stelle die Füße stabil und lasse die Arme seitlich beziehungsweise leicht vor dem Körper hängen. Die Oberarme bleiben nahe am Rumpf. Spanne den Bauch an, damit du nicht nach hinten ausweichst. Bewegung: Beuge die Ellbogen und führe die Hände in Richtung Schultern. Die Oberarme bleiben dabei möglichst ruhig; die Bewegung entsteht überwiegend im Ellbogengelenk. Endposition/Rückweg: Stoppe, bevor die Ellbogen deutlich nach vorn wandern oder die Schultern hochgezogen werden. Senke die Last langsam zurück, bis die Arme fast vollständig gestreckt sind. Wichtig: Kein Schwung aus Hüfte oder Rücken; Seated/Standing wird hier nicht als eigene Variantenform geführt, weil die Zielbewegung des Ellbogens gleich bleibt.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":3,"name":"Farmer's Walk","categories":["Gewichte"],"muscles":["Athletik","Arme/Hände","Core"],"variants":[],"equipment":["Dumbbell","Kettlebell","Trap Bar"],"equipmentDisplay":"Dumbbell, Kettlebell, Trap Bar | Default: Kettlebell","equipmentRequired":true,"defaultEquipment":"Kettlebell","execution":"Aufbau: Wähle für Farmer Carry zwei gleich schwere Kurzhanteln, Kettlebells oder eine Trap Bar; für Suitcase Carry verwendest du nur eine Last auf einer Körperseite. Stelle die Gewichte so auf den Boden, dass du sie ohne Drehen des Oberkörpers aufnehmen kannst. Ausgangsposition: Gehe wie bei einem kontrollierten Deadlift in die Knie und Hüfte, greife die Gewichte und richte dich auf. Stehe groß, halte Kopf und Brustkorb neutral, ziehe die Schultern nicht hoch und spanne Bauch sowie Gesäß an. Bewegung: Gehe mit kurzen, gleichmäßigen Schritten geradeaus. Beim Suitcase Carry verhinderst du aktiv, dass der Oberkörper zur belasteten Seite kippt; beim Farmer Carry bleiben beide Schultern auf gleicher Höhe. Endposition/Rückweg: Beende die vorgegebene Strecke, bleibe stabil stehen und setze die Lasten mit gebeugten Knien und nach hinten geschobener Hüfte kontrolliert auf den Boden. Wichtig: Nicht mit rundem Rücken aufnehmen oder absetzen und die Last nicht gegen die Beine schlagen lassen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":4,"name":"Deadlifts","categories":["Gewichte"],"muscles":["Rücken","Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Barbell","Dumbbell"],"equipment":["Romanian"],"equipmentDisplay":"Romanian | optional","equipmentRequired":false,"defaultEquipment":"","execution":"Aufbau: Lege die Langhantel auf den Boden, sodass die Stange ungefähr über der Mitte deiner Füße liegt. Bei Kurzhanteln stehen die Gewichte seitlich oder leicht vor den Füßen. Verwende eine freie Fläche ohne Gegenstände im Bewegungsweg. Ausgangsposition: Stelle die Füße etwa hüftbreit. Beuge dich aus Hüfte und Knien nach unten, greife die Stange knapp außerhalb der Beine und bringe die Schienbeine nahe an die Hantel. Spanne den Bauch rundum an, ziehe die Schultern leicht weg von den Ohren und halte den Rücken in einer stabilen, neutralen Position. Bewegung Conventional: Drücke den Boden mit den Füßen weg und strecke Knie und Hüfte gemeinsam; die Hantel bleibt dicht an Schienbeinen und Oberschenkeln. Bewegung Romanian: Starte im Stand, schiebe die Hüfte weit nach hinten und senke die Hantel dicht an den Beinen ab, während die Knie nur leicht gebeugt bleiben. Endposition/Rückweg: Stelle dich vollständig auf, ohne den Oberkörper nach hinten zu überstrecken. Für die Abwärtsbewegung schiebst du zuerst die Hüfte nach hinten und beugst anschließend die Knie, bis die Hantel kontrolliert den Boden beziehungsweise den vorgesehenen unteren Punkt erreicht. Wichtig: Hebe die Last nicht mit rundem Rücken vom Boden und reiße nicht ruckartig an der Hantel.","defaultVariant":"Barbell","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":5,"name":"Butterfly","categories":["Gewichte","Geräte"],"muscles":["Brust"],"variants":["Incline","Decline"],"equipment":["Dumbbell","Cable","Machine"],"equipmentDisplay":"Dumbbell, Cable, Machine | Default: Machine","equipmentRequired":true,"defaultEquipment":"Machine","execution":"Aufbau: Bei Dumbbell Fly liegst du auf einer stabilen Bank; stelle sie für Flat waagerecht, für Incline schräg nach oben und für Decline entsprechend nach unten. Bei Cable Fly stellst du zwei Kabelzüge symmetrisch ein und positionierst dich mittig zwischen ihnen. Bei Butterfly Machine stellst du Sitz und Arm-/Griffposition so ein, dass die Griffe ungefähr auf Brusthöhe liegen. Ausgangsposition: Ziehe die Schulterblätter leicht nach hinten und unten, halte den Brustkorb stabil und beuge die Ellbogen leicht. Bei Kurzhanteln starten die Gewichte über der Brust, bei Kabel oder Maschine starten die Arme seitlich beziehungsweise leicht hinter dem Oberkörper. Bewegung: Führe die Arme in einem großen Bogen vor dem Brustkorb zusammen. Der Ellbogenwinkel verändert sich nur wenig; es ist keine Press- oder Curlbewegung. Endposition/Rückweg: Stoppe, wenn die Hände beziehungsweise Griffe vor der Brust zusammenkommen. Öffne die Arme anschließend langsam zurück, bis du eine kontrollierte Dehnung der Brust spürst, ohne dass die Schultern nach vorn kippen. Wichtig: Verwende nur so viel Bewegungsumfang, wie das Schultergelenk schmerzfrei kontrollieren kann.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":6,"name":"Good Mornings","categories":["Gewichte"],"muscles":["Rücken","Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":["Barbell"],"equipmentDisplay":"Barbell (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle eine Langhantel in einem Rack ungefähr auf Schulterhöhe ein. Gehe unter die Hantel und lege sie stabil auf den oberen Rücken, nicht auf die Halswirbelsäule. Hebe sie aus dem Rack und mache einen kleinen Schritt zurück. Ausgangsposition: Füße etwa hüft- bis schulterbreit, Knie leicht gebeugt, Brustkorb über dem Becken. Spanne Bauch und Rücken an. Bewegung: Schiebe die Hüfte weit nach hinten, während du den Oberkörper aus der Hüfte nach vorn neigst. Die Knie verändern ihren Winkel nur wenig; der Rücken bleibt stabil und die Hantel bewegt sich mit dem Oberkörper. Endposition/Rückweg: Senke dich nur so weit, wie du die Wirbelsäule neutral halten und die Spannung in Gesäß und hinterer Oberschenkelmuskulatur kontrollieren kannst. Drücke die Füße in den Boden und schiebe die Hüfte wieder nach vorn, bis du aufrecht stehst. Wichtig: Es ist eine Hüftbeuge, keine Kniebeuge.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":7,"name":"Hip Thrusts","categories":["Gewichte","Geräte"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Barbell","Machine"],"equipmentDisplay":"Barbell, Machine | Default: Barbell","equipmentRequired":true,"defaultEquipment":"Barbell","execution":"Aufbau: Für die Langhantelvariante benötigst du eine stabile Bank, eine Langhantel und möglichst ein Hüftpolster. Setze dich vor die Bank und lehne den oberen Rücken etwa auf Höhe der unteren Schulterblätter an die Bankkante. Rolle die Hantel über die Beine bis in die Hüftbeuge. Bei der Maschine stellst du Sitz, Rückenauflage und Hüftpolster entsprechend ein. Ausgangsposition: Stelle die Füße ungefähr hüft- bis schulterbreit auf, vollständig auf den Boden. In der oberen Position sollen die Unterschenkel ungefähr senkrecht stehen. Halte das Kinn leicht Richtung Brust und spanne den Bauch an. Bewegung: Drücke den Boden über die Fersen und den ganzen Fuß weg und hebe das Becken nach oben. Die Bewegung kommt aus der Hüftstreckung; der Brustkorb bleibt kontrolliert und kippt nicht stark nach hinten. Endposition/Rückweg: Stoppe, wenn Schulter, Hüfte und Knie ungefähr eine Linie bilden und das Gesäß fest angespannt ist. Senke das Becken kontrolliert wieder ab, ohne die Hantel fallen zu lassen. Wichtig: Nicht durch Überstrecken des unteren Rückens zusätzliche Höhe erzwingen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":8,"name":"Landmine Rotations","categories":["Gewichte"],"muscles":["Schulter","Core"],"variants":[],"equipment":["Landmine"],"equipmentDisplay":"Landmine (implicit)","equipmentImplicit":true,"execution":"Aufbau: Befestige ein Ende einer Langhantel in einer Landmine-Halterung. Greife das freie Ende mit beiden Händen vor Brust oder Schulter. Ausgangsposition: Füße etwas breiter als hüftbreit, Knie leicht gebeugt, Arme vor dem Körper. Spanne Bauch und Gesäß an. Bewegung: Führe das Hantelende in einem kontrollierten Bogen von einer Körperseite zur anderen. Drehe Brustkorb und Hüfte gemeinsam und lasse die Füße bei Bedarf leicht mitrotieren, statt den unteren Rücken isoliert stark zu verdrehen. Endposition/Rückweg: Stoppe auf jeder Seite, bevor die Körperkontrolle verloren geht, und führe die Hantel über die Mitte zurück. Wichtig: Die Hantel bleibt dicht genug am Körper, dass du sie ohne ruckartige Beschleunigung kontrollieren kannst.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":9,"name":"Lateral Raises","categories":["Gewichte","Geräte"],"muscles":["Schulter"],"variants":[],"equipment":["Dumbbell","Cable"],"equipmentDisplay":"Dumbbell, Cable | Default: Dumbbell","equipmentRequired":true,"defaultEquipment":"Dumbbell","execution":"Aufbau: Halte je eine Kurzhantel seitlich am Körper oder stelle einen Kabelzug so ein, dass der Griff von unten seitlich zum arbeitenden Arm zieht. Ausgangsposition: Stehe stabil mit leicht gebeugten Knien, Bauch angespannt und Schultern entspannt. Die Arme hängen seitlich, Ellbogen sind leicht gebeugt. Bewegung: Hebe die Arme seitlich vom Körper weg. Führe dabei die Ellbogen und nicht die Hände bewusst nach oben; Handgelenke bleiben neutral. Endposition/Rückweg: Hebe bis ungefähr Schulterhöhe oder nur so hoch, wie die Schulter ohne Hochziehen kontrolliert bleibt. Senke die Arme langsam zurück, ohne die Gewichte gegen den Körper fallen zu lassen. Wichtig: Verwende kein Schwungholen aus Hüfte oder Rücken.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":10,"name":"Lunges","categories":["Gewichte","Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Forward","Reverse","Walking","Curtsy"],"equipment":["Dumbbell","Barbell"],"equipmentDisplay":"Dumbbell, Barbell | optional","equipmentRequired":false,"execution":"Aufbau: Nutze eine freie, ebene Fläche. Die Übung kann ohne Zusatzlast, mit Kurzhanteln an den Seiten oder mit einer Langhantel auf dem oberen Rücken ausgeführt werden. Ausgangsposition: Stehe aufrecht, Füße etwa hüftbreit, Bauch leicht angespannt. Forward: Mache einen ausreichend langen Schritt nach vorn. Reverse: Setze einen Fuß nach hinten. Walking: Gehe nach jeder Wiederholung direkt mit dem anderen Bein weiter. Curtsy: Setze den bewegten Fuß schräg hinter das Standbein. Bewegung: Senke das Becken kontrolliert ab, indem du beide Knie beugst. Der vordere Fuß bleibt vollständig belastet und das vordere Knie zeigt in Richtung der Fußspitzen. Endposition/Rückweg: Das hintere Knie nähert sich dem Boden, ohne hart aufzusetzen. Drücke dich über den vorderen Fuß wieder hoch; bei Forward und Reverse zurück in den Stand, bei Walking in den nächsten Schritt. Wichtig: Halte Becken und Oberkörper möglichst stabil und vermeide ein nach innen fallendes vorderes Knie.","defaultVariant":"Forward","defaultEquipment":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":11,"name":"Pullovers","categories":["Gewichte","Geräte"],"muscles":["Brust","Rücken"],"variants":[],"equipment":["Dumbbell","Cable"],"equipmentDisplay":"Dumbbell, Cable | Default: Dumbbell","equipmentRequired":true,"defaultEquipment":"Dumbbell","execution":"Aufbau: Für die Kurzhantelvariante lege dich längs auf eine stabile Bank und halte eine einzelne Kurzhantel mit beiden Händen über der Brust. Für Kabel oder Maschine stelle Sitz, Bank und Griff so ein, dass der Widerstand von hinter beziehungsweise über dem Kopf kommt. Ausgangsposition: Füße fest auf den Boden, Schulterblätter stabil auf der Bank, Bauch angespannt. Halte die Arme nahezu gestreckt, aber nicht hart verriegelt. Bewegung: Führe die Arme langsam in einem Bogen hinter den Kopf beziehungsweise gegen den Kabelzug nach hinten, ohne den Ellbogenwinkel stark zu verändern. Endposition/Rückweg: Stoppe, sobald du eine kontrollierte Dehnung im Brust-/Latbereich spürst und die Rippen nicht nach oben ausweichen. Ziehe die Arme im gleichen Bogen wieder über den Brustkorb beziehungsweise nach vorn. Wichtig: Nicht durch ein starkes Hohlkreuz mehr Bewegungsumfang erzwingen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":12,"name":"Reverse Fly","categories":["Gewichte","Geräte"],"muscles":["Rücken","Schulter"],"variants":["STANDING","Seated","Chest-supported"],"equipment":["Dumbbell","Cable","Machine"],"equipmentDisplay":"Dumbbell, Cable, Machine | Default: Dumbbell","equipmentRequired":true,"defaultEquipment":"Dumbbell","execution":"Aufbau: Bei Dumbbells kannst du dich aus der Hüfte nach vorn beugen oder mit dem Brustkorb auf einer Schrägbank abstützen. Bei Cable verwendest du zwei gegenüberliegende Griffe; bei der Reverse-Fly-Machine stellst du Sitz und Griffe so ein, dass die Arme ungefähr auf Schulterhöhe starten. Ausgangsposition: Arme vor beziehungsweise unter dem Körper, Ellbogen leicht gebeugt, Schultern weg von den Ohren. Spanne Bauch und Rücken an. Bewegung: Führe die Arme seitlich nach außen und leicht nach hinten, als würdest du mit beiden Armen einen großen Bogen öffnen. Endposition/Rückweg: Stoppe ungefähr dann, wenn Oberarme seitlich auf Höhe des Rumpfes stehen und die Schulterblätter kontrolliert nach hinten geführt sind. Kehre langsam in die Ausgangsposition zurück. Wichtig: Nicht durch starkes Zurücklehnen oder Schwung aus dem Oberkörper arbeiten.","defaultVariant":"STANDING","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":13,"name":"Rows","categories":["Gewichte","Geräte"],"muscles":["Arme/Hände","Rücken","Schulter","Core"],"variants":["Standing","Seated","Chest-supported"],"equipment":["Barbell","Dumbbell","Cable","T-Bar","Machine"],"equipmentDisplay":"Barbell, Dumbbell, Cable, T-Bar, Machine | Default: Barbell","equipmentRequired":true,"defaultEquipment":"Barbell","execution":"Aufbau: Wähle die Variante passend zum Gerät. Bei Barbell/Dumbbell Row stehst du mit der Last vor oder neben dem Körper; bei Cable Row sitzt du vor einem Kabelzug mit Fußstützen; bei Chest-supported Row liegt der Brustkorb an einem Polster; bei T-Bar Row greifst du die vorgesehenen Griffe der T-Bar. Ausgangsposition Standing: Stelle die Füße stabil auf, beuge Knie leicht, schiebe die Hüfte nach hinten und neige den Oberkörper nach vorn, ohne den Rücken rund zu machen. Ausgangsposition Seated/Chest-supported: Stelle Sitz, Brustpolster und Griff so ein, dass du mit fast gestreckten Armen starten kannst und Schultern nicht hochgezogen sind. Spanne den Bauch an. Bewegung: Ziehe die Ellbogen nach hinten in Richtung Hüfte beziehungsweise Rippen. Die Hände folgen den Ellbogen; die Schulterblätter bewegen sich kontrolliert nach hinten, ohne dass du den Brustkorb stark herauswirfst. Endposition/Rückweg: Stoppe, wenn die Ellbogen hinter oder ungefähr auf Höhe des Oberkörpers stehen und du die Schulterposition noch kontrollieren kannst. Strecke die Arme langsam wieder nach vorn beziehungsweise unten, ohne die Last fallen zu lassen. Wichtig: Kein ruckartiges Zurücklehnen oder Aufrichten des Oberkörpers, um die Last zu beschleunigen.","defaultVariant":"Standing","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":14,"name":"Shoulder Presses","categories":["Gewichte"],"muscles":["Arme/Hände","Schulter","Core"],"variants":["Standing","Seated"],"equipment":["Barbell","Dumbbell"],"equipmentDisplay":"Barbell, Dumbbell | Default: Dumbbell","equipmentRequired":true,"defaultEquipment":"Dumbbell","execution":"Aufbau: Für Standing stellst du dich auf eine freie, ebene Fläche; für Seated setzt du dich auf eine stabile Bank, vorzugsweise mit Rückenlehne. Bei Langhantel kann ein Rack verwendet werden, bei Kurzhanteln hältst du je eine Hantel. Ausgangsposition: Bringe die Hantel oder Hanteln auf Schulterhöhe. Die Unterarme stehen möglichst unter den Gewichten, die Handgelenke bleiben gerade. Stelle die Füße fest auf, spanne Bauch und Gesäß an und halte den Brustkorb über dem Becken. Bewegung: Drücke die Last senkrecht nach oben. Bei einer Langhantel ziehst du den Kopf nur so weit zurück, dass die Stange am Gesicht vorbeikommt, und bringst den Kopf anschließend wieder neutral unter die Hantel. Endposition/Rückweg: Strecke die Arme über dem Kopf, ohne die Schultern zu den Ohren hochzuziehen oder den unteren Rücken stark zu überstrecken. Senke die Last kontrolliert zurück bis ungefähr auf Schulterhöhe. Wichtig: Vermeide Schwung aus den Beinen; dafür gibt es die separate Übung Push Press.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":15,"name":"Shoulder Rotations","categories":["Gewichte","Geräte"],"muscles":["Schulter"],"variants":["Internal Rotation","External Rotation"],"equipment":["Dumbbell","Cable"],"equipmentDisplay":"Dumbbell, Cable | Default: Cable","equipmentRequired":true,"defaultEquipment":"Cable","execution":"Aufbau: Für Cable Rotation stelle die Rolle ungefähr auf Ellbogenhöhe ein. Für Dumbbell Rotation wähle eine Position, in der der Oberarm sicher abgestützt oder am Körper gehalten werden kann. Ausgangsposition: Beuge den Ellbogen ungefähr 90 Grad. Halte den Oberarm dicht am Rumpf oder in der vorgesehenen Schulterposition und fixiere ihn, damit die Bewegung nicht aus dem Ellbogen oder Rumpf kommt. External Rotation: Unterarm startet vor dem Bauch und bewegt sich nach außen. Internal Rotation: Unterarm startet weiter außen und bewegt sich zum Bauch. Bewegung: Drehe den Oberarm kontrolliert im Schultergelenk, während Ellbogenwinkel und Oberarmposition möglichst gleich bleiben. Endposition/Rückweg: Stoppe am schmerzfreien Ende des Bewegungsumfangs und kehre langsam zurück. Wichtig: Sehr leichte Lasten reichen häufig aus; kein Schwung und kein Mitdrehen des Oberkörpers.","defaultVariant":"External Rotation","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":16,"name":"Split Squats","categories":["Gewichte","Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Barbell","Dumbbell"],"equipment":["ATG","Bulgarian"],"equipmentDisplay":"ATG, Bulgarian | Default: ATG","equipmentRequired":true,"execution":"Aufbau: Wähle ATG oder Bulgarian als Namensform; angezeigt werden ATG Split Squats beziehungsweise Bulgarian Split Squats. Unter dem Namen kann als Variante Barbell, Dumbbell oder „—“ gewählt werden. Für Bulgarian benötigst du zusätzlich eine stabile Bank/Erhöhung für den hinteren Fuß; bei ATG bleibt der hintere Fuß am Boden beziehungsweise auf dem Fußballen. Ausgangsposition: Langer Schrittstand, vorderer Fuß vollständig belastet, Becken und Brustkorb nach vorn ausgerichtet, Rumpf angespannt. Bewegung: Senke das Becken kontrolliert nahezu senkrecht ab und lasse das vordere Knie in Richtung der Fußspitzen nach vorn wandern. Das hintere Bein dient überwiegend der Balance. Ende: Gehe so tief, wie Ferse, Knie, Becken und Rücken stabil bleiben, und drücke dich über den vorderen Fuß wieder hoch. Bei Barbell liegt die Hantel stabil auf dem oberen Rücken; Dumbbells hängen seitlich. Wichtig: Kein Einknicken des vorderen Knies und kein starkes Abstoßen mit dem hinteren Bein.","defaultVariant":"","defaultEquipment":"ATG","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":17,"name":"Squats","categories":["Gewichte","Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Barbell","Dumbbell","Kettlebell","Assisted"],"equipment":["Front","Goblet","Overhead","Sissy"],"equipmentDisplay":"Front, Goblet, Overhead, Sissy | optional","equipmentRequired":false,"defaultEquipment":"","execution":"Aufbau: Ohne Namensauswahl entspricht die Übung dem klassischen Back Squat und wird einfach als Squats angezeigt. Wählst du Front, Goblet, Overhead oder Sissy unter „Hilfsmittel / Gerät“, wird daraus Front Squats, Goblet Squats, Overhead Squats oder Sissy Squats. Die Variante Barbell (Default), Dumbbell, Kettlebell, Assisted oder „—“ steht ausschließlich unter dem Übungsnamen. Ausgangsposition: Füße stabil etwa schulterbreit, Fußspitzen leicht nach außen, Rumpf gespannt. Für Back liegt eine Langhantel auf dem oberen Rücken; für Front wird die Last vorne auf Schulterhöhe gehalten; Goblet hält eine einzelne Last dicht vor der Brust; Overhead hält die Last stabil über Kopf; Sissy wird mit weit nach vorn wandernden Knien und möglichst gestreckter Hüfte ausgeführt und kann Assisted unterstützt werden. Bewegung: Beuge Knie und Hüfte kontrolliert, halte Knie in Richtung der Fußspitzen und den ganzen Fuß beziehungsweise bei Sissy den kontrollierten Vorfußkontakt stabil. Ende: Erreiche nur die Tiefe, in der Rücken, Knie und Lastposition kontrolliert bleiben, und strecke dich wieder auf. Wichtig: Die gewählte Variante muss zur Namensform passen; bei Sissy besonders langsam beginnen und die Tiefe nur schmerzfrei steigern.","defaultVariant":"Barbell","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":18,"name":"Step-Ups","categories":["Gewichte","Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":["Dumbbell","Barbell"],"equipmentDisplay":"Dumbbell, Barbell | optional","equipmentRequired":false,"execution":"Aufbau: Verwende eine stabile Box oder Bank, die nicht kippen oder wegrutschen kann. Wähle eine Höhe, bei der du den oberen Fuß vollständig aufsetzen kannst und das Knie kontrolliert bleibt. Zusatzlast kann mit Kurzhanteln seitlich oder einer Langhantel getragen werden. Ausgangsposition: Stelle einen Fuß komplett auf die Box, Ferse eingeschlossen. Der andere Fuß bleibt am Boden. Spanne Bauch und Gesäß an. Bewegung: Drücke den oberen Fuß in die Box und strecke Knie und Hüfte dieses Beins, bis du oben stehst. Das untere Bein soll möglichst wenig abspringen. Endposition/Rückweg: Stehe kurz stabil auf der Box und steige anschließend kontrolliert mit dem freien Bein zurück zum Boden. Wichtig: Das Knie des arbeitenden Beins bleibt in Richtung der Fußspitzen.","defaultEquipment":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":19,"name":"Triceps Extensions","categories":["Gewichte","Geräte"],"muscles":["Arme/Hände"],"variants":["Overhead","Pushdown"],"equipment":["Dumbbell","Cable"],"equipmentDisplay":"Dumbbell, Cable | Default: Cable","equipmentRequired":true,"defaultEquipment":"Cable","execution":"Aufbau: Verwende eine Kurzhantel, einen Kabelzug oder einen geeigneten Griff. Für Overhead befindet sich der Widerstand hinter beziehungsweise über dem Kopf; bei einer Kabelvariante kann die Rolle hoch oder tief eingestellt sein, je nach Ausführung. Ausgangsposition: Beuge den Ellbogen und halte den Oberarm möglichst stabil in der vorgesehenen Position. Bei Overhead zeigt der Oberarm nach oben neben dem Kopf. Spanne den Bauch an, damit der Rücken nicht ausweicht. Bewegung: Strecke den Ellbogen gegen den Widerstand, ohne den Oberarm deutlich zu bewegen. Endposition/Rückweg: Strecke den Arm fast vollständig und beuge den Ellbogen anschließend langsam wieder, bis eine kontrollierte Dehnung im Trizeps entsteht. Wichtig: Pushdown wird als eigene Variantenform nur dann geführt, wenn der Widerstand von oben nach unten gedrückt wird; unabhängig von der Körperposition bleibt die eigentliche Zielbewegung die Ellbogenstreckung.","defaultVariant":"Pushdown","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":20,"name":"Abduction","categories":["Geräte","Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Machine","Lying","Resistance Band"],"equipmentDisplay":"Machine, Lying, Resistance Band","equipmentImplicit":false,"execution":"Aufbau: Setze dich in die Hüftabduktionsmaschine und positioniere die Polster an der Außenseite der Oberschenkel beziehungsweise Knie. Stelle den Startwinkel so ein, dass du bequem beginnen kannst. Ausgangsposition: Rücken und Becken liegen an der Lehne, Füße stehen auf den vorgesehenen Auflagen. Greife die Haltegriffe und halte den Oberkörper ruhig. Bewegung: Drücke beide Knie gegen die Polster nach außen, ohne den Oberkörper mitzudrehen. Endposition/Rückweg: Öffne die Beine nur so weit, wie das Becken stabil bleibt. Führe die Knie anschließend langsam wieder zueinander, ohne dass die Gewichte unkontrolliert anschlagen. Wichtig: Die Bewegung entsteht im Hüftgelenk, nicht durch Schwung aus dem Oberkörper.","equipmentRequired":true,"defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12"},{"id":21,"name":"Adduction","categories":["Geräte","Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Machine","Lying"],"equipmentDisplay":"Machine, Lying","equipmentImplicit":false,"execution":"Aufbau: Setze dich in die Hüftadduktionsmaschine und positioniere die Polster an den Innenseiten der Oberschenkel. Stelle die Ausgangsweite so ein, dass du die Beine ohne schmerzhaftes Ziehen öffnen kannst. Ausgangsposition: Rücken und Becken liegen stabil an der Lehne, Hände an den Griffen. Bewegung: Führe die Knie gegen die Polster kontrolliert nach innen zusammen. Endposition/ Rückweg: Stoppe, wenn die Beine nahezu zusammenstehen oder die Maschine ihren vorgesehenen Endpunkt erreicht. Öffne die Beine langsam wieder bis zur gewählten Ausgangsweite. Wichtig: Das Becken bleibt ruhig und rotiert nicht mit.","equipmentRequired":true,"defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12"},{"id":22,"name":"Calf Raises","categories":["Geräte","Körpergewicht"],"muscles":["Beine/Füße"],"variants":["Standing","Seated"],"equipment":["Machine","Dumbbell"],"equipmentDisplay":"Machine, Dumbbell | optional","equipmentRequired":false,"execution":"Aufbau: Bei Standing stehst du mit den Fußballen auf einer Kante oder der vorgesehenen Maschinenplattform; die Fersen können sich frei nach unten und oben bewegen. Bei Seated sitzt du mit gebeugten Knien und einem Polster auf den Oberschenkeln. Ausgangsposition: Halte Füße ungefähr hüftbreit und richte die Fußspitzen nach vorn oder leicht nach außen. Stabilisiere Knie und Becken. Bewegung: Drücke die Fußballen kräftig in die Unterlage und hebe die Fersen so hoch wie kontrolliert möglich. Endposition/ Rückweg: Halte oben kurz, ohne auf den Außen- oder Innenrand des Fußes wegzukippen. Senke die Fersen langsam wieder ab, bis eine angenehme Dehnung in der Wade entsteht. Wichtig: Nicht federnd aus dem unteren Punkt springen, wenn die Übung als Kraftübung ausgeführt wird.","defaultVariant":"Standing","defaultEquipment":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":23,"name":"Chest Press","categories":["Geräte"],"muscles":["Arme/Hände","Brust","Schulter"],"variants":["Incline","Decline"],"equipment":["Machine"],"equipmentDisplay":"Machine (implicit)","equipmentImplicit":true,"execution":"Aufbau: Setze dich in die Brustpresse und stelle die Sitzhöhe so ein, dass die Griffe ungefähr auf Höhe der mittleren Brust liegen. Stelle gegebenenfalls Startposition und Rückenlehne so ein, dass die Hände nicht weit hinter den Schultern beginnen. Ausgangsposition: Stelle beide Füße fest auf den Boden oder die vorgesehenen Fußauflagen. Lege Rücken und Gesäß an die Lehne, ziehe die Schulterblätter leicht nach hinten und unten und greife die Griffe mit geraden Handgelenken. Bewegung: Drücke die Griffe nach vorn, ohne die Schultern vom Polster abzuheben. Endposition/Rückweg: Strecke die Arme fast vollständig, ohne die Ellbogen hart zu verriegeln. Führe die Griffe langsam zurück, bis die Oberarme ungefähr seitlich des Rumpfes oder leicht dahinter stehen. Wichtig: Die genaue Griffbahn hängt von der Maschine ab; stelle die Maschine so ein, dass keine schmerzhafte Schulterposition entsteht.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":24,"name":"Crunches","categories":["Geräte","Körpergewicht"],"muscles":["Core"],"variants":["Lying","Kneeling"],"equipment":["Machine"],"equipmentDisplay":"Machine | optional","equipmentRequired":false,"execution":"Aufbau: Bei Bodyweight liegst du auf einer Matte; bei der Crunch Machine stellst du Sitz, Rückenpolster und gegebenenfalls Fuß- oder Brustpolster so ein, dass die Maschinenachse zu deiner Rumpfbeugung passt. Ausgangsposition Bodyweight: Lege dich auf den Rücken, stelle die Füße flach auf und beuge die Knie. Lege die Hände locker an Schläfen, Brust oder Oberschenkel, ohne am Kopf zu ziehen. Spanne den Bauch an. Ausgangsposition Maschine: Sitze mit Rücken und Becken an der Auflage und greife die vorgesehenen Griffe. Bewegung: Ziehe die unteren Rippen in Richtung Becken und rolle den oberen Rumpf kontrolliert ein. Endposition/Rückweg: Stoppe, wenn die Bauchmuskeln maximal angespannt sind und du nicht weiter über die Hüfte nach vorn kippst. Kehre langsam in die Ausgangsposition zurück. Wichtig: Der Nacken bleibt entspannt; ziehe den Kopf nicht mit den Händen nach vorn.","defaultEquipment":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":25,"name":"Face Pulls","categories":["Geräte"],"muscles":["Arme/Hände","Rücken","Schulter"],"variants":[],"equipment":["Cable"],"equipmentDisplay":"Cable (implicit)","equipmentImplicit":true,"execution":"Aufbau: Befestige ein Seil am Kabelzug etwa auf Gesichts- bis Stirnhöhe. Gehe so weit zurück, dass bei ausgestreckten Armen bereits leichte Kabelspannung besteht. Ausgangsposition: Stehe stabil, Knie leicht gebeugt, Rumpf angespannt. Greife die Seilenden mit beiden Händen und halte die Arme vor dem Körper. Bewegung: Ziehe das Seil zum Gesicht und führe die Hände dabei auseinander, sodass die Ellbogen seitlich nach außen und hinten wandern. Endposition/Rückweg: Die Hände befinden sich ungefähr neben Ohren oder Schläfen, die Schulterblätter sind kontrolliert nach hinten geführt. Strecke die Arme langsam wieder nach vorn. Wichtig: Nicht den Kopf zum Seil schieben und nicht mit dem unteren Rücken nach hinten ausweichen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":26,"name":"Lat Pulldowns","categories":["Geräte"],"muscles":["Arme/Hände","Rücken"],"variants":[],"equipment":["Cable","Machine"],"equipmentDisplay":"Cable, Machine | Default: Cable","equipmentRequired":true,"defaultEquipment":"Cable","execution":"Aufbau: Setze dich an den Latzug. Stelle das Oberschenkelpolster so ein, dass es die Oberschenkel sicher festhält, ohne unangenehm zu drücken. Wähle eine Griffvariante und greife die Stange oder Griffe, bevor du dich vollständig unter das Polster setzt. Ausgangsposition: Sitze aufrecht, Füße fest auf dem Boden, Arme nahezu gestreckt über dem Kopf. Spanne den Bauch an und halte den Brustkorb ruhig. Ziehe die Schultern leicht weg von den Ohren. Bewegung: Ziehe die Ellbogen nach unten in Richtung Rippen und führe die Stange vor dem Gesicht zum oberen Brustbereich. Endposition/Rückweg: Stoppe, wenn die Ellbogen seitlich am Rumpf sind und die Stange den oberen Brustbereich erreicht oder sich ihm nähert. Lasse die Arme langsam wieder nach oben strecken, ohne die Schultern unkontrolliert hochzuziehen. Wichtig: Ziehe die Stange nicht hinter den Kopf und lehne dich nicht weit nach hinten, um die Last zu bewegen.","equipmentImplicit":false,"defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12"},{"id":27,"name":"Leg Curls","categories":["Geräte"],"muscles":["Beine/Füße"],"variants":["Seated","Lying"],"equipment":["Machine"],"equipmentDisplay":"Machine (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle die Maschine entsprechend der Variante ein. Beim Seated Leg Curl liegt das Oberschenkelpolster oberhalb der Knie und das untere Polster hinten am Unterschenkel knapp oberhalb der Ferse. Beim Lying Leg Curl liegst du bäuchlings und das Rollenpolster liegt ebenfalls knapp oberhalb der Fersen. Richte das Knie möglichst auf die Drehachse der Maschine aus. Ausgangsposition: Halte Becken und Oberkörper fest an der vorgesehenen Auflage und greife die Haltegriffe. Bewegung: Beuge die Knie und ziehe die Fersen gegen den Widerstand in Richtung Gesäß beziehungsweise unter den Sitz. Endposition/Rückweg: Stoppe, wenn du die Knie maximal kontrolliert gebeugt hast, ohne dass das Becken ausweicht. Strecke die Knie anschließend langsam wieder, bis die Beine fast gerade sind. Wichtig: Nicht mit Hüfte oder Rücken Schwung holen.","defaultVariant":"Seated","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":28,"name":"Leg Extensions","categories":["Geräte"],"muscles":["Beine/Füße"],"variants":[],"equipment":["Machine"],"equipmentDisplay":"Machine (implicit)","equipmentImplicit":true,"execution":"Aufbau: Setze dich in die Beinstreckmaschine. Stelle die Rückenlehne so ein, dass Kniekehle und Sitzkante nicht unangenehm drücken. Richte die Knie ungefähr auf die Drehachse der Maschine aus und positioniere das Rollenpolster vorne am unteren Schienbein knapp oberhalb des Sprunggelenks. Ausgangsposition: Rücken und Becken bleiben an der Lehne, Hände an den Griffen, Knie deutlich gebeugt. Bewegung: Strecke die Knie und hebe das Polster nach vorn und oben. Endposition/Rückweg: Strecke die Beine bis fast gerade, ohne die Knie ruckartig durchzuschlagen. Senke das Gewicht langsam zurück, bis die Knie wieder in der eingestellten Ausgangsbeugung sind. Wichtig: Die Bewegung kommt aus den Knien; der Oberkörper bleibt ruhig.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":29,"name":"Leg Press","categories":["Geräte"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Machine"],"equipmentDisplay":"Machine (implicit)","equipmentImplicit":true,"execution":"Aufbau: Setze dich in die Beinpresse und stelle Rückenlehne sowie Sitz so ein, dass du die Plattform mit beiden Füßen sicher erreichen kannst. Platziere die Füße ungefähr schulterbreit auf der Plattform. Ausgangsposition: Rücken und Becken liegen vollständig an der Lehne. Löse die Sicherheitshebel entsprechend der Maschine erst, wenn beide Füße sicher stehen. Spanne den Bauch an. Bewegung: Lasse die Plattform kontrolliert zu dir kommen, indem du Knie und Hüfte beugst. Die Knie folgen der Richtung der Fußspitzen und die Fersen bleiben auf der Plattform. Endposition/Rückweg: Stoppe die Abwärtsbewegung, bevor das Becken von der Lehne abrollt oder der untere Rücken deutlich rund wird. Drücke die Plattform über den ganzen Fuß weg, bis die Beine fast gestreckt sind. Wichtig: Knie nicht hart durchdrücken und die Sicherheitsmechanik der jeweiligen Maschine vor Beginn kennen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":30,"name":"Pallof Press","categories":["Geräte"],"muscles":["Core"],"variants":["Cable","Resistance Band","Resistance Band + Weight Plate"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Befestige einen einzelnen Griff oder ein Band ungefähr auf Brusthöhe. Stelle dich seitlich zum Befestigungspunkt, sodass der Zug von rechts oder links kommt. Gehe so weit weg, dass deutliche, aber kontrollierbare Spannung entsteht. Ausgangsposition: Halte den Griff mit beiden Händen direkt vor dem Brustbein, Füße ungefähr schulterbreit. Spanne Bauch und Gesäß an und halte Schultern sowie Becken nach vorn ausgerichtet. Bewegung: Drücke die Hände langsam gerade vor den Körper, ohne dass sich Brustkorb oder Becken in Richtung Kabel drehen. Endposition/Rückweg: Halte die Arme kurz gestreckt und ziehe den Griff dann kontrolliert zurück zur Brust. Wichtig: Die Aufgabe besteht darin, Rotation zu verhindern; deshalb darf der Körper nicht dem Kabelzug folgen.","defaultVariant":"Cable","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":31,"name":"Ab Wheel","categories":["Körpergewicht"],"muscles":["Schulter","Core"],"variants":["Kneeling","Standing"],"equipment":["Ab Wheel"],"equipmentDisplay":"Ab Wheel (implicit)","equipmentImplicit":true,"execution":"Aufbau: Lege eine Matte auf den Boden und stelle das Ab-Wheel vor deine Knie. Für die normale Einstiegsvariante kniest du; eine Standing-Progression ist deutlich anspruchsvoller und erst geeignet, wenn die kniende Variante vollständig kontrolliert wird. Ausgangsposition: Knie ungefähr hüftbreit, Hände an beiden Griffen des Rads, Rad direkt unter oder leicht vor den Schultern. Strecke die Arme, spanne Bauch und Gesäß an und ziehe die Rippen leicht Richtung Becken, damit der untere Rücken nicht ins Hohlkreuz fällt. Bewegung: Rolle das Rad langsam nach vorn. Hüfte und Schultern bewegen sich gemeinsam nach vorn und unten; die Arme bleiben weitgehend gestreckt. Endposition/Rückweg: Gehe nur so weit, wie du Bauchspannung und eine stabile Wirbelsäule halten kannst. Ziehe das Rad anschließend kontrolliert zurück, indem du Bauch und Schultergürtel aktivierst, bis das Rad wieder unter den Schultern steht. Wichtig: Stoppe sofort, wenn der untere Rücken sichtbar durchhängt oder du nur mit einem ruckartigen Hüftknick zurückkommst.","defaultVariant":"Kneeling","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentRequired":false,"defaultEquipment":""},{"id":32,"name":"Bird Dog","categories":["Körpergewicht"],"muscles":["Rücken","Gesäß/Hüfte","Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Gehe auf allen vieren auf eine Matte. Ausgangsposition: Hände direkt unter den Schultern, Knie direkt unter den Hüften, Fußrücken oder Zehen am Boden. Richte den Rücken neutral aus und spanne den Bauch leicht an. Bewegung: Strecke gleichzeitig einen Arm nach vorn und das gegenüberliegende Bein nach hinten. Führe Hand, Schulter, Becken und Fuß langsam in eine lange Linie, ohne dass sich das Becken zur Seite öffnet. Endposition/Rückweg: Halte kurz, wenn Arm und Bein ungefähr auf Rumpfhöhe sind. Führe beide kontrolliert zurück unter den Körper und wechsle die Seite. Wichtig: Die Bewegung soll aus Schulter und Hüfte kommen; der untere Rücken bleibt möglichst ruhig.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":33,"name":"Clamshells","categories":["Körpergewicht"],"muscles":["Gesäß/Hüfte"],"variants":[],"equipment":["Dumbbell","Resistance Band"],"equipmentDisplay":"Dumbbell, Resistance Band | Default: Resistance Band","equipmentRequired":true,"execution":"Aufbau: Lege dich seitlich auf eine Matte; ein Widerstandsband kann knapp oberhalb der Knie angebracht werden. Ausgangsposition: Hüfte und Knie sind gebeugt, die Beine liegen übereinander und die Füße bleiben zusammen. Kopf kann auf dem unteren Arm oder einem Kissen liegen. Halte das Becken senkrecht übereinander, ohne nach hinten zu rollen. Bewegung: Hebe das obere Knie nach oben, während die Füße Kontakt behalten. Endposition/Rückweg: Öffne nur so weit, wie das Becken ruhig bleibt. Senke das Knie langsam wieder auf das untere Bein. Wichtig: Wenn du dich nach hinten drehst, ist der Bewegungsumfang zu groß.","defaultEquipment":"Resistance Band","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":34,"name":"Glute Bridge","categories":["Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":["Resistance Band"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich auf den Rücken auf eine Matte. Ausgangsposition: Stelle beide Füße etwa hüftbreit auf, Fersen ungefähr eine Fußlänge vor dem Gesäß, Knie gebeugt. Arme liegen entspannt neben dem Körper. Spanne den Bauch leicht an und halte die Rippen kontrolliert. Bewegung: Drücke über Fersen und ganzen Fuß in den Boden und hebe das Becken nach oben. Die Knie bleiben ungefähr über den Füßen und kippen nicht nach innen. Endposition/Rückweg: Hebe das Becken, bis Schultern, Hüfte und Knie ungefähr eine Linie bilden. Spanne das Gesäß kurz an und senke anschließend Wirbel für Wirbel beziehungsweise kontrolliert das Becken zurück zum Boden. Wichtig: Die Höhe entsteht aus der Hüftstreckung, nicht aus einem starken Hohlkreuz.","defaultVariant":"Resistance Band","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":35,"name":"Hollow Body Hold","categories":["Körpergewicht"],"muscles":["Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich flach auf den Rücken. Ausgangsposition: Strecke Beine und Arme zunächst aus. Spanne die Bauchmuskeln an und drücke den unteren Rücken sanft gegen den Boden. Hebe Kopf und Schulterblätter leicht an. Bewegung/Halten: Hebe die gestreckten Beine wenige Zentimeter vom Boden und führe die Arme je nach Schwierigkeitsgrad neben dem Körper oder über den Kopf. Halte Rippen und Becken zueinander gezogen, sodass der untere Rücken Bodenkontakt behält. Endposition: Beende die Haltung, sobald der untere Rücken vom Boden abhebt. Wichtig: Eine leichtere Variante ist, Knie stärker zu beugen oder die Arme näher am Körper zu halten.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":36,"name":"Hyperextensions","categories":["Körpergewicht"],"muscles":["Rücken","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Roman Chair"],"equipmentDisplay":"Roman Chair (implicit)","equipmentRequired":false,"execution":"Aufbau: Stelle eine Roman-Chair-/Hyperextension-Bank so ein, dass das obere Polster unterhalb der Hüftknochen liegt und du die Hüfte frei beugen kannst. Fixiere beide Füße sicher unter den vorgesehenen Rollen oder Platten. Ausgangsposition: Strecke den Körper von Kopf bis Ferse möglichst gerade und verschränke die Arme vor der Brust. Spanne den Bauch leicht an. Bewegung: Schiebe die Hüfte nach hinten und neige den Oberkörper kontrolliert nach unten, ohne den Rücken rund zu machen. Endposition/Rückweg: Senke dich bis zu einer deutlichen, aber kontrollierten Dehnung der Beinrückseite beziehungsweise bis der Oberkörper ungefähr Richtung Boden zeigt. Strecke die Hüfte und richte den Körper wieder bis zur geraden Linie auf. Wichtig: Nicht über die gerade Körperlinie hinaus ins Hohlkreuz drücken.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":true,"defaultEquipment":""},{"id":37,"name":"Nordic Hamstring Curls","categories":["Körpergewicht"],"muscles":["Beine/Füße"],"variants":["Assisted"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Knie auf eine dicke Matte oder ein weiches Polster. Fixiere beide Fersen sehr sicher unter einer Nordic-Bank, einem schweren unbeweglichen Gegenstand oder durch eine zweite Person. Die Fixierung darf sich nicht lösen können. Ausgangsposition: Knie ungefähr hüftbreit, Hüfte vollständig gestreckt, Oberkörper aufrecht. Spanne Bauch und Gesäß an, sodass Schulter, Hüfte und Knie eine gerade Linie bilden. Bewegung: Lasse den gesamten Körper aus den Knien langsam nach vorn kippen. Die Hüfte bleibt gestreckt; du knickst nicht in der Taille ab. Bremse die Bewegung aktiv mit der hinteren Oberschenkelmuskulatur. Endposition/Rückweg: Gehe so weit nach vorn, wie du kontrollieren kannst. Wenn die Kraft nicht reicht, fange dich mit den Händen am Boden ab und drücke dich leicht zurück, während die Beinrückseite weiter arbeitet. Wichtig: Diese Übung ist sehr anspruchsvoll; beginne mit kleinerem Bewegungsumfang oder Unterstützung.","defaultVariant":"Assisted","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":39,"name":"Plank","categories":["Körpergewicht"],"muscles":["Schulter","Core"],"variants":[],"equipment":["Front","Side","Copenhagen"],"equipmentDisplay":"Front, Side, Copenhagen | Default: Front","execution":"Aufbau: Nutze eine feste, ebene Unterlage. Für Front Plank stützt du dich auf Unterarme und Zehen; für Side Plank auf einen Unterarm und die Außenkante des unteren Fußes beziehungsweise eine einfachere Knievariante. Ausgangsposition Front: Ellbogen direkt unter den Schultern, Unterarme nach vorn, Beine gestreckt. Spanne Bauch, Gesäß und Oberschenkel an und ziehe die Rippen leicht Richtung Becken. Ausgangsposition Side: Ellbogen unter der Schulter, Schulter aktiv vom Ohr wegdrücken, Beine übereinander oder versetzt. Copenhagen: Lege das äußere Bein mit der Fußinnenseite auf eine Erhöhung. Bewegung/Halten: Hebe das Becken so an, dass Kopf, Brustkorb, Becken und Beine eine Linie bilden. Atme ruhig weiter, ohne den Bauch komplett zu entspannen. Endposition: Beende die Haltung, sobald das Becken deutlich absinkt, sich der Rücken stark durchbiegt oder die Schulterposition verloren geht. Wichtig: Eine saubere kürzere Haltezeit ist sinnvoller als eine lange Position mit Ausweichbewegungen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":true,"defaultEquipment":"Front"},{"id":40,"name":"Push-Ups","categories":["Körpergewicht","Calisthenics"],"muscles":["Arme/Hände","Brust","Schulter","Core","Athletik"],"variants":["Incline","Decline","Feet Elevated","Wall","Parallel Bars"],"equipment":["Handstand","Pike","Planche"],"equipmentDisplay":"Handstand, Pike, Planche | optional","execution":"Aufbau: Wähle bei Bedarf eine Namensform über „Hilfsmittel / Gerät“: ohne Auswahl bleiben es Push-Ups, mit Handstand, Pike oder Planche entsteht entsprechend Handstand Push-Ups, Pike Push-Ups oder Planche Push-Ups. Die Variante (z. B. Incline, Decline, Feet Elevated, Wall oder Parallel Bars) wird nur unter dem Übungsnamen angezeigt. Ausgangsposition: Hände stabil auf Unterlage oder Griffen, Rumpf und Gesäß fest, Körperlinie kontrolliert. Bewegung: Beuge die Ellbogen und senke Brust beziehungsweise Oberkörper kontrolliert in Richtung Unterlage, ohne in der Lendenwirbelsäule durchzuhängen. Drücke dich anschließend wieder aktiv weg. Bei Handstand-, Pike- und Planche-Formen verändert sich der Körperwinkel entsprechend, die Schulter bleibt aktiv und die Bewegung kontrolliert. Ende: Arme nahezu strecken, ohne die Schulterposition zu verlieren. Wichtig: Nur eine Variante/Progression wählen, die ohne Schwung und mit sauberer Rumpfspannung beherrscht wird.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","defaultEquipment":"","equipmentRequired":false,"equipmentImplicit":false},{"id":41,"name":"Reverse Nordics","categories":["Körpergewicht"],"muscles":["Beine/Füße","Core"],"variants":["Assisted"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Knie auf eine weiche Matte. Ausgangsposition: Knie etwa hüftbreit, Oberkörper aufrecht, Hüfte vollständig gestreckt. Spanne Bauch und Gesäß an und halte Schulter, Hüfte und Knie in einer geraden Linie. Bewegung: Lehne den gesamten Körper langsam aus den Kniegelenken nach hinten. Die Hüfte bleibt geöffnet; schiebe das Gesäß nicht nach hinten und knicke nicht im Hüftgelenk ein. Endposition/Rückweg: Gehe nur so weit zurück, wie du die gerade Körperlinie kontrollieren kannst und keine unangenehme Kniebelastung entsteht. Ziehe dich über die Vorderseite der Oberschenkel zurück in den aufrechten Kniestand. Wichtig: Verwende bei Bedarf eine Bandunterstützung oder halte dich leicht an einer festen Stütze.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":43,"name":"Step-Downs","categories":["Körpergewicht"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stelle dich auf eine niedrige, stabile Box oder Stufe. Die freie Seite neben der Box muss frei von Gegenständen sein. Ausgangsposition: Ein Fuß steht vollständig auf der Box, das andere Bein hängt seitlich oder nach vorn frei. Richte Becken und Brustkorb gerade aus und spanne den Bauch an. Bewegung: Beuge langsam Knie und Hüfte des Standbeins und senke die freie Ferse Richtung Boden. Halte das Knie des Standbeins in Richtung der Fußspitzen und den ganzen Standfuß belastet. Endposition/Rückweg: Berühre den Boden mit der freien Ferse nur leicht oder stoppe kurz davor. Drücke dich ausschließlich über das Standbein wieder nach oben. Wichtig: Die Box ist zu hoch, wenn das Becken stark zur Seite absinkt oder das Knie nach innen kippt.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":44,"name":"Tibialis Raises","categories":["Gewichte","Körpergewicht"],"muscles":["Beine/Füße"],"variants":["Leaning","Seated"],"equipment":["Kettlebell","TibBar"],"equipmentDisplay":"Kettlebell, TibBar | optional | Default: Kettlebell","equipmentRequired":false,"execution":"Aufbau: Stelle dich mit dem Rücken an eine Wand und die Füße etwa 20 bis 40 cm vor die Wand oder nutze eine spezielle Tibialis- Vorrichtung. Ausgangsposition: Fersen bleiben fest auf dem Boden, Knie sind gestreckt oder leicht gebeugt, Rücken lehnt stabil an der Wand. Bewegung: Ziehe beide Fußspitzen so weit wie möglich nach oben Richtung Schienbein, während die Fersen Bodenkontakt behalten. Endposition/Rückweg: Halte die höchste Position kurz und senke die Fußspitzen anschließend kontrolliert fast bis zum Boden ab. Wichtig: Die Bewegung findet im Sprunggelenk statt; verlagere nicht das gesamte Körpergewicht nach vorn und hinten.","defaultVariant":"Seated","defaultEquipment":"Kettlebell","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":45,"name":"Lever","categories":["Calisthenics"],"muscles":["Rücken","Schulter","Core"],"variants":["Tuck","Straddle"],"equipment":["Back","Front"],"equipmentDisplay":"Back, Front | Default: Front","execution":"Aufbau: Verwende eine stabile Klimmzugstange oder Turnringe mit ausreichend freiem Raum. Wähle Front oder Back als „Hilfsmittel / Gerät“; dadurch lautet der Übungsname Front Lever oder Back Lever. Tuck oder Straddle wird nur als Variante darunter angezeigt; ohne Variante ist die gestreckte Grundform gemeint. Ausgangsposition: Hänge mit gestreckten Armen und aktivem Schultergürtel, Bauch und Gesäß angespannt. Bewegung Front Lever: Ziehe die Schulterblätter nach unten und führe den Körper vor den Armen in Richtung Horizontale. Bewegung Back Lever: Bringe den Körper kontrolliert hinter die Arme in die horizontale Position. Bei Tuck bleiben die Knie angezogen, bei Straddle sind die Beine geöffnet. Ende: Halte Schulter, Hüfte und Füße möglichst in einer Linie und kehre langsam in einen sicheren Hang zurück. Wichtig: Kein Schwung; nur so weit absenken beziehungsweise strecken, wie Schulter und Rumpf stabil bleiben.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","defaultEquipment":"Front","equipmentRequired":true,"equipmentImplicit":false},{"id":46,"name":"Dips","categories":["Calisthenics"],"muscles":["Arme/Hände","Brust","Schulter"],"variants":["Parallel Bars","Rings"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Verwende zwei stabile parallele Dip-Holme oder Turnringe, die dein Körpergewicht sicher tragen. Stelle bei Bedarf eine Box unter die Holme, damit du kontrolliert in die Stützposition kommst. Ausgangsposition: Stütze dich mit gestreckten Armen ab, Hände fest um die Holme, Schultern aktiv nach unten gedrückt. Halte Brustkorb und Becken kontrolliert und spanne Bauch sowie Gesäß an. Die Beine hängen ruhig oder sind leicht angewinkelt. Bewegung: Beuge die Ellbogen und senke den Körper zwischen den Holmen ab. Die Ellbogen bewegen sich überwiegend nach hinten; der Oberkörper kann je nach Schwerpunkt leicht nach vorn geneigt sein. Endposition/Rückweg: Senke dich nur so tief, wie die Schultern schmerzfrei und stabil bleiben. Drücke die Holme nach unten und strecke die Ellbogen wieder, bis du in der stabilen Stützposition bist. Wichtig: Nicht in den Schultern einsinken und nicht aus dem unteren Punkt herausfedern.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","defaultVariant":"Parallel Bars","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":47,"name":"Dragon Flag","categories":["Calisthenics"],"muscles":["Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich mit dem Rücken auf eine stabile Bank oder Matte und greife mit beiden Händen hinter dem Kopf eine feste Bankkante oder einen sicheren Anker. Ausgangsposition: Hebe die Beine an, rolle das Becken vom Untergrund ab und bringe den Körper so weit nach oben, dass nur oberer Rücken und Schulterblätter Kontakt zur Bank haben. Spanne Bauch und Gesäß an. Bewegung: Senke den Körper als möglichst starre Linie aus Schulter, Hüfte, Knie und Füßen langsam Richtung Bank. Endposition/Rückweg: Stoppe kurz bevor Hüfte oder unterer Rücken den Untergrund berühren oder bevor die Körperspannung verloren geht. Ziehe den gestreckten Körper aus der Bauchspannung wieder nach oben. Wichtig: Nicht im unteren Rücken durchhängen; zunächst Tuck- oder Teilbewegungen nutzen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":49,"name":"Handstand","categories":["Calisthenics"],"muscles":["Athletik","Schulter","Core"],"variants":["Wall"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Nutze eine freie Wandfläche oder eine freie Bodenfläche mit ausreichend Platz. Entferne Gegenstände, auf die du fallen könntest. Ausgangsposition: Setze die Hände etwa schulterbreit auf den Boden, Finger weit gespreizt und Mittelfinger ungefähr nach vorn. Drücke die Hände aktiv in den Boden und strecke die Ellbogen. Spanne Bauch und Gesäß an. Bewegung an der Wand: Gehe oder kicke die Beine kontrolliert nach oben, bis die Füße die Wand leicht berühren. Schiebe die Schultern aktiv von den Ohren weg beziehungsweise den Boden von dir weg, sodass der Oberkörper lang wird. Freestanding: Bringe das Becken über die Hände und kontrolliere das Gleichgewicht über Finger- und Handballendruck. Endposition: Ziel ist eine möglichst gestreckte Linie von Händen über Schultern, Becken, Knie bis Füße. Zum Absteigen nimm ein Bein kontrolliert zurück zum Boden oder drehe seitlich aus. Wichtig: Nicht mit völlig entspannten Schultern in die Position hängen.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":51,"name":"Leg Raises","categories":["Calisthenics"],"muscles":["Arme/Hände","Core"],"variants":["Tuck"],"equipment":["Hanging","Parallel Bars"],"equipmentDisplay":"Hanging, Parallel Bars | Default: Hanging","execution":"Aufbau: Wähle Hanging an einer stabilen Klimmzugstange oder Parallel Bars im Stütz. Für Tuck bleiben die Knie gebeugt; ohne Tuck werden die Beine möglichst gestreckt geführt. Ausgangsposition: Im Hang Schultern aktiv nach unten ziehen; auf Parallel Bars Arme strecken und Schultern aktiv absenken. Bauch und Gesäß anspannen und Pendeln vermeiden. Bewegung: Rolle das Becken leicht nach hinten und hebe Knie beziehungsweise gestreckte Beine kontrolliert nach vorn. Endposition/Rückweg: Hebe nur so hoch, wie Rumpf und Schulterposition stabil bleiben, und senke die Beine langsam zurück. Wichtig: Nicht mit Schwung arbeiten und den unteren Rücken nicht unkontrolliert ins Hohlkreuz ziehen.","defaultVariant":"","equipmentRequired":true,"defaultEquipment":"Hanging","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":52,"name":"Human Flag","categories":["Calisthenics"],"muscles":["Athletik","Rücken","Schulter","Core"],"variants":["Tuck","Straddle"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Verwende eine fest verankerte senkrechte Stange oder ein geeignetes Rig. Ausgangsposition: Greife die Stange mit weit versetzten Händen. Die obere Hand zieht, die untere Hand drückt; beide Arme bleiben möglichst gestreckt. Stelle die Füße zunächst am Boden und spanne Bauch und Gesäß an. Bewegung: Drücke mit dem unteren Arm aktiv von der Stange weg und ziehe mit dem oberen Arm, während du Becken und Beine seitlich vom Boden abhebst. Nutze je nach Progression angewinkelte Beine, Straddle oder vollständig gestreckte Beine. Endposition: Ziel ist eine horizontale Linie des Körpers seitlich zur Stange. Senke die Beine kontrolliert wieder zum Boden. Wichtig: Schulterposition und Griff müssen stabil sein; keine ruckartigen Versuche aus einem lockeren Schultergelenk.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","defaultVariant":"","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":53,"name":"L-Sit/V-Sit","categories":["Calisthenics"],"muscles":["Athletik","Arme/Hände","Schulter","Core"],"variants":["Parallel Bars","Floor"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Wähle Parallel Bars oder Floor. Setze die Hände seitlich neben die Hüfte beziehungsweise greife die Holme fest. Ausgangsposition: Strecke die Ellbogen, drücke die Schultern aktiv nach unten und spanne Bauch sowie Oberschenkel an. Bewegung: Hebe Becken und gestreckte Beine vom Boden. Für den L-Sit führst du die Beine ungefähr waagerecht nach vorn; für den V-Sit weiter in Richtung Oberkörper. Endposition/Rückweg: Halte Knie gestreckt und den Stütz aktiv, dann senke die Beine kontrolliert ab, bevor Schulter- oder Rumpfspannung verloren geht.","defaultVariant":"Parallel Bars","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":54,"name":"Muscle-Ups","categories":["Calisthenics"],"muscles":["Athletik","Arme/Hände","Brust","Rücken","Schulter","Core"],"variants":["Bar","Rings"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Verwende eine hohe, stabile Klimmzugstange mit ausreichend Freiraum oberhalb und hinter der Stange oder korrekt aufgehängte Turnringe. Ausgangsposition: Greife die Stange im Obergriff etwas breiter als schulterbreit beziehungsweise die Ringe sicher. Hänge mit aktivem Schultergürtel, spanne Bauch und Gesäß an und halte die Beine zusammen. Bewegung Zugphase: Ziehe nicht nur das Kinn, sondern den Brustkorb möglichst hoch zur Stange; die Ellbogen ziehen kräftig nach unten und hinten. Übergang: Wenn der Brustkorb über Stangenhöhe kommt, bringe die Schultern nach vorn über die Hände und rolle die Ellbogen von unterhalb nach oberhalb der Stange. Druckphase: Drücke dich aus der tiefen Dip-Position nach oben, bis die Arme gestreckt sind. Rückweg: Senke dich kontrolliert über Dip, Übergang und Zugphase zurück in den Hang. Wichtig: Der Muscle-Up verlangt hohe Zugkraft und einen sicheren Dip; Anfänger sollten zuerst Pull-Up, High Pull und Dip beherrschen. Ein unkontrolliertes Herumwerfen der Schultern über die Stange vermeiden.","defaultVariant":"Bar","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":55,"name":"Pistol Squats","categories":["Calisthenics"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Assisted"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Nutze einen freien, ebenen Boden. Für Assisted halte dich leicht an einer Stange, einem Band oder einer festen Stütze fest. Ausgangsposition: Stehe auf einem Bein, der gesamte Fuß ist belastet. Strecke das freie Bein nach vorn und die Arme zur Balance ebenfalls nach vorn. Spanne den Bauch an. Bewegung: Beuge Knie, Hüfte und Sprunggelenk des Standbeins und senke das Becken kontrolliert nach unten. Halte das Knie in Richtung der Fußspitzen und die Ferse am Boden. Endposition/Rückweg: Gehe so tief, wie du das Gleichgewicht und die Fußposition halten kannst; in der vollständigen Variante sinkt die Hüfte deutlich unter Kniehöhe. Drücke über den ganzen Standfuß wieder nach oben. Wichtig: Wenn die Ferse abhebt oder das Knie stark nach innen fällt, nutze Unterstützung oder geringere Tiefe.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":56,"name":"Planche","categories":["Calisthenics"],"muscles":["Athletik","Brust","Schulter","Core"],"variants":["Tuck","Straddle"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Nutze einen rutschfesten Boden oder stabile Parallettes. Ausgangsposition: Setze die Hände ungefähr schulterbreit auf, Finger nach vorn oder leicht außen; auf Parallettes greifst du die Griffe fest. Strecke die Ellbogen vollständig und drücke den Boden aktiv weg, sodass der obere Rücken leicht rund und die Schulterblätter stabil sind. Spanne Bauch, Gesäß und Beine an. Bewegung: Lehne die Schultern deutlich vor die Hände und verlagere immer mehr Körpergewicht auf die Arme. Je nach Progression bleiben Knie angezogen, weiter geöffnet, Beine gespreizt oder vollständig gestreckt. Endposition: Hebe die Füße vom Boden und halte den Körper möglichst parallel zum Boden, ohne die Ellbogen zu beugen oder die Hüfte absinken zu lassen. Rückweg: Verlagere das Gewicht kontrolliert zurück, bis die Füße wieder Bodenkontakt haben. Wichtig: Planche ist ein fortgeschrittener Skill; arbeite zuerst mit Tuck-Positionen und Planche Leans.","defaultVariant":"","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":58,"name":"Pull-Ups","categories":["Calisthenics"],"muscles":["Arme/Hände","Rücken","Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Verwende eine fest montierte Klimmzugstange oder stabile Ringe, die dein Körpergewicht sicher tragen. Stelle bei Bedarf eine Box unter die Stange, damit du sie kontrolliert greifen kannst, statt hineinzuspringen. Ausgangsposition: Greife die Stange etwas breiter als schulterbreit im Obergriff für einen Pull-Up oder ungefähr schulterbreit im Untergriff für einen Chin-Up. Umschließe die Stange vollständig mit den Fingern und möglichst auch dem Daumen. Hänge mit gestreckten Armen unter der Stange, bringe Kopf, Brustkorb und Becken unter die Hände, spanne Bauch und Gesäß an und halte die Beine ruhig. Ziehe die Schultern weg von den Ohren, indem du die Schulterblätter leicht nach unten führst. Bewegung: Beginne den Zug, indem du die Ellbogen nach unten und anschließend Richtung Rippen führst. Ziehe den Brustkorb zur Stange, ohne die Beine nach vorn zu schwingen, mit den Knien Schwung zu erzeugen oder den Kopf nach hinten zu werfen. Endposition/Rückweg: Ziehe so hoch, bis das Kinn mindestens auf Höhe der Stange ist beziehungsweise der obere Brustkorb sich der Stange nähert. Halte kurz die Körperspannung und senke dich anschließend kontrolliert ab, bis die Arme wieder vollständig oder nahezu vollständig gestreckt sind. Wichtig: Bauch und Gesäß bleiben während der gesamten Wiederholung aktiv; der Körper soll nicht pendeln. Wenn du die Ausgangsposition nicht kontrolliert halten kannst, nutze ein Assistenzband oder eine unterstützte Variante.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":59,"name":"AirBike","categories":["Cardio"],"muscles":["Athletik","Arme/Hände","Beine/ Füße","Core"],"variants":[],"equipment":["AirBike"],"equipmentDisplay":"AirBike (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle den Sattel so ein, dass das Knie am unteren Pedalpunkt leicht gebeugt bleibt. Setze dich mittig auf den Sattel und stelle die Füße sicher auf die Pedale. Greife die beweglichen Handgriffe. Ausgangsposition: Oberkörper aufrecht bis leicht nach vorn geneigt, Bauch angespannt, Schultern locker. Bewegung: Trete mit den Beinen kontinuierlich in die Pedale und bewege gleichzeitig die Griffe vor und zurück. Ein Arm drückt, während der andere zieht; die Beinbewegung läuft gleichmäßig weiter. Intensität entsteht durch schnelleres und kräftigeres Arbeiten, da der Luftwiderstand mit der Leistung zunimmt. Beenden: Verringere die Geschwindigkeit schrittweise, weil Pedale und Griffe gekoppelt weiterlaufen können. Wichtig: Hände und Füße bleiben bis zum vollständigen Abbremsen an Griffen und Pedalen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":60,"name":"CrossTrainer","categories":["Cardio"],"muscles":["Athletik","Arme/Hände","Beine/ Füße"],"variants":[],"equipment":["CrossTrainer"],"equipmentDisplay":"CrossTrainer (implicit)","equipmentImplicit":true,"execution":"Aufbau: Steige auf die Pedale des Crosstrainers und greife die festen oder beweglichen Handgriffe. Stelle Widerstand und gegebenenfalls Rampenhöhe niedrig ein, bevor du startest. Ausgangsposition: Füße vollständig auf den Pedalen, Knie leicht gebeugt, Oberkörper aufrecht, Bauch angespannt. Bewegung: Bewege die Pedale in einer gleichmäßigen elliptischen Bahn. Bei beweglichen Griffen drückt ein Arm nach vorn, während der andere zurückzieht. Halte die Knie in Richtung der Fußspitzen und vermeide starkes seitliches Wippen. Beenden: Reduziere Tempo und Widerstand, bis die Pedale fast stehen, und steige erst dann ab. Wichtig: Nicht auf den Handgriffen hängen; sie dienen zur Führung beziehungsweise zusätzlichen Armarbeit.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":61,"name":"Fahrradergometer","categories":["Cardio"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Bike Ergometer"],"equipmentDisplay":"Bike Ergometer (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle die Sattelhöhe so ein, dass das Knie am tiefsten Pedalpunkt noch leicht gebeugt ist und die Hüfte nicht seitlich kippen muss. Stelle bei Bedarf Lenkerhöhe und Sattelabstand so ein, dass du die Griffe bequem erreichst. Ausgangsposition: Setze beide Füße mittig auf die Pedale beziehungsweise in die Pedalschlaufen. Sitze stabil auf dem Sattel, Schultern locker, Hände leicht am Lenker. Bewegung: Trete gleichmäßig im Kreis und halte die Knie in Richtung der Füße. Vermeide ein starkes seitliches Wippen des Beckens. Intensität wird über Trittfrequenz und Widerstand gesteuert. Rückweg/Beenden: Reduziere vor dem Absteigen zunächst Tempo und Widerstand, bis die Pedale langsam laufen. Wichtig: Der Sattel ist zu hoch, wenn du die Hüfte zum Erreichen des unteren Pedalpunkts deutlich hin- und herbewegst.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":62,"name":"Laufband","categories":["Cardio"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Treadmill"],"equipmentDisplay":"Treadmill (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle dich zunächst auf die seitlichen Trittflächen des Laufbands und befestige, falls vorhanden, den Sicherheitsclip an deiner Kleidung. Starte das Band mit sehr niedriger Geschwindigkeit. Ausgangsposition: Steige erst dann auf die laufende Fläche und gehe mittig auf dem Band. Richte den Oberkörper auf, blicke nach vorn und halte die Arme locker gebeugt. Bewegung: Gehe oder laufe mit Schritten, die möglichst unter dem Körperschwerpunkt aufsetzen, statt weit vor dem Körper zu landen. Bei Incline bleibt der Körper aufrecht bis leicht aus den Sprunggelenken nach vorn geneigt; halte dich nicht dauerhaft an den Griffen fest. Beenden: Reduziere Geschwindigkeit und Steigung schrittweise bis zum langsamen Gehen und stoppe das Band vollständig, bevor du absteigst. Wichtig: Nicht nach hinten auf dem Band driften.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":63,"name":"Ruderergometer","categories":["Cardio"],"muscles":["Athletik","Arme/Hände","Rücken","Beine/Füße","Core"],"variants":[],"equipment":["Row Ergometer"],"equipmentDisplay":"Row Ergometer (implicit)","equipmentImplicit":true,"execution":"Aufbau: Setze dich auf den Rollsitz des Ruderergometers. Stelle die Fußplatten so ein, dass der Riemen ungefähr über dem breitesten Teil des Fußes verläuft, und ziehe beide Riemen fest. Greife den Griff locker mit beiden Händen, Daumen unter dem Griff. Ausgangsposition/Catch: Rolle nach vorn, bis die Schienbeine ungefähr senkrecht stehen. Die Arme sind gestreckt, Schultern entspannt, Oberkörper aus der Hüfte leicht nach vorn geneigt. Bewegung/Drive: Drücke zuerst kräftig mit den Beinen gegen die Fußplatten. Wenn die Beine sich strecken, öffne die Hüfte und lehne den Oberkörper leicht zurück. Ziehe erst zum Schluss den Griff mit den Armen knapp unter die Rippen. Endposition/Finish: Beine gestreckt, Oberkörper leicht zurückgelehnt, Bauch angespannt, Handgelenke gerade. Rückweg/Recovery: Strecke zuerst die Arme, kippe dann den Oberkörper aus der Hüfte nach vorn und beuge erst danach die Knie, um den Sitz wieder nach vorn rollen zu lassen. Wichtig: Der Rückweg ist ruhiger als der kräftige Drive; ziehe nicht zuerst mit den Armen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":64,"name":"Seilspringen","categories":["Cardio"],"muscles":["Athletik","Arme/Hände","Beine/ Füße","Core","Sprünge"],"variants":["Weighted Rope","Weighted Handles"],"equipment":["Jump Rope"],"equipmentDisplay":"Jump Rope (implicit)","equipmentImplicit":true,"execution":"Aufbau: Verwende ein Springseil, dessen Mitte unter beiden Füßen liegt und dessen Griffe ungefähr bis Brust- oder Achselhöhe reichen. Stelle dich auf eine freie, ebene Fläche mit genügend Abstand über dem Kopf und neben dem Körper. Ausgangsposition: Füße ungefähr hüftbreit, Knie weich, Ellbogen nahe am Rumpf, Hände seitlich vor der Hüfte. Bewegung: Drehe das Seil überwiegend aus den Handgelenken und springe nur wenige Zentimeter hoch, gerade genug, damit das Seil unter den Füßen durchläuft. Lande leise auf dem Vor- bis Mittelfuß und lasse die Fersen kurz Richtung Boden federn. Varianten können beidbeinige Sprünge oder alternierendes Laufen auf der Stelle sein. Wichtig: Nicht die ganzen Arme kreisen lassen und nicht unnötig hoch springen.","defaultVariant":"Weighted Rope","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":65,"name":"Skiergometer","categories":["Cardio"],"muscles":["Athletik","Arme/Hände","Rücken","Core"],"variants":[],"equipment":["SkiErg"],"equipmentDisplay":"SkiErg (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle dich etwa 45 bis 60 cm vor das SkiErg, Füße ungefähr schulterbreit. Greife beide Handgriffe; die Arme sind oben gebeugt und die Hände befinden sich ungefähr auf Augenhöhe oder etwas darüber. Ausgangsposition: Stehe aufrecht mit leicht gebeugten Knien, spanne Bauch und Gesäß an und halte die Schultern entspannt. Bewegung: Beginne den Zug aus Rumpf und Hüfte, indem du den Oberkörper kontrolliert nach vorn bringst und die Hüfte leicht nach hinten schiebst. Ziehe die Griffe anschließend dicht am Körper nach unten; die Arme folgen der Bewegung. Endposition: Die Hände enden seitlich neben den Oberschenkeln, Knie sind leicht gebeugt, Rücken bleibt kontrolliert. Rückweg: Richte dich wieder auf und lasse die Arme kontrolliert nach oben in die Ausgangsposition zurückkehren. Wichtig: Nicht nur mit den Armen ziehen; der Hauptimpuls kommt aus Rumpf, Latissimus und Hüftbewegung.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":66,"name":"StairMaster","categories":["Cardio"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["StairMaster"],"equipmentDisplay":"StairMaster (implicit)","equipmentImplicit":true,"execution":"Aufbau: Steige auf die stehenden Stufen und greife die Handläufe zunächst zur Sicherheit. Wähle eine niedrige Geschwindigkeit. Ausgangsposition: Richte den Oberkörper auf, blicke nach vorn und stelle möglichst den ganzen oder zumindest den Großteil des Fußes auf jede Stufe. Bewegung: Steige abwechselnd von Stufe zu Stufe und drücke dich über das jeweils belastete Bein nach oben. Halte Knie und Fuß in derselben Richtung. Die Hände liegen nur leicht an den Griffen und tragen nicht dauerhaft das Körpergewicht. Beenden: Reduziere die Geschwindigkeit, warte bis die Stufen sicher langsam laufen beziehungsweise stehen, und steige kontrolliert ab. Wichtig: Nicht stark nach vorn auf die Konsole lehnen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":600,"equipmentRequired":false,"defaultEquipment":""},{"id":67,"name":"Ankle Dorsiflexion","categories":["Mobilität"],"muscles":["Beine/Füße"],"variants":[],"equipment":["Kneeling","Standing"],"equipmentDisplay":"Kneeling, Standing | Default: Kneeling","execution":"Aufbau: Wähle Kneeling oder Standing; die Auswahl wird Teil des Übungsnamens. Kneeling: Stelle einen Fuß flach vor dich und knie mit dem anderen Bein dahinter. Standing: Stelle dich in Schrittstellung vor eine Wand oder andere stabile Orientierung. Ausgangsposition: Der zu mobilisierende Fuß bleibt vollständig am Boden, Ferse fest aufgesetzt und Knie über dem Fuß ausgerichtet. Bewegung: Schiebe das Knie langsam nach vorn über die Zehen, ohne dass die Ferse abhebt oder das Fußgewölbe einknickt. Ende: Gehe bis zu einer deutlichen, schmerzfreien Spannung im Sprunggelenk und kehre kontrolliert zurück. Wichtig: Knie folgt der Richtung der Fußspitzen; keine ruckartigen Bewegungen.","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","defaultEquipment":"Kneeling","equipmentRequired":true,"equipmentImplicit":false},{"id":68,"name":"Cat-Cow","categories":["Mobilität"],"muscles":["Rücken","Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Gehe auf einer Matte in den Vierfüßlerstand. Ausgangsposition: Hände direkt unter den Schultern, Knie direkt unter den Hüften, Rücken zunächst neutral. Spanne den Bauch leicht an. Cat: Atme aus, drücke Hände und Knie in den Boden, ziehe das Becken leicht ein und runde die Wirbelsäule Abschnitt für Abschnitt nach oben; der Kopf folgt der Bewegung und blickt Richtung Brust. Cow: Atme ein, kippe das Becken in die Gegenrichtung, lasse Brustbein und Bauch kontrolliert Richtung Boden sinken und öffne die Brust, ohne den Nacken stark zu überstrecken. Wechsel langsam zwischen beiden Positionen. Wichtig: Die Bewegung soll entlang der Wirbelsäule verteilt sein und nicht nur aus dem unteren Rücken kommen.","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":69,"name":"Couch Stretch","categories":["Mobilität"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Knie dich mit dem hinteren Knie vor eine Wand oder eine stabile Bank und lege Schienbein/Fußrücken des hinteren Beins daran an. Das vordere Bein steht so weit vorn, dass der ganze Fuß belastet bleibt. Ausgangsposition: Richte Becken und Oberkörper möglichst auf, spanne den Bauch leicht an und kippe das Becken nicht ins Hohlkreuz. Bewegung/Halten: Spanne das Gesäß der hinteren Seite an und verschiebe das Becken nur so weit nach vorn, bis du eine deutliche Dehnung an Hüftbeuger und vorderem Oberschenkel spürst. Endposition/Rückweg: Halte die Position ruhig und atme weiter; löse sie anschließend kontrolliert, indem du das Becken zurücknimmst und das hintere Bein aus der Wand-/Bankposition führst. Wichtig: Kein stechender Knieschmerz und kein erzwungenes Hohlkreuz.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":70,"name":"Deep Squat Hold","categories":["Mobilität"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Assisted"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stelle dich auf eine ebene Fläche, Füße etwa schulterbreit oder etwas breiter, Zehen leicht nach außen. Ausgangsposition: Spanne den Bauch an und verteile das Gewicht über den ganzen Fuß. Bewegung: Beuge Knie und Hüfte und sinke langsam in eine tiefe Kniebeuge. Die Knie folgen der Richtung der Fußspitzen, die Fersen bleiben am Boden. Halten: Bleibe in der tiefsten Position, die du ohne Schmerzen und ohne Verlust des Fußkontakts halten kannst. Halte den Rücken lang und den Brustkorb möglichst aufrecht; die Ellbogen können leicht gegen die Innenseite der Knie drücken, ohne Gewalt anzuwenden. Rückweg: Drücke dich über den ganzen Fuß wieder in den Stand. Wichtig: Eine Fersenerhöhung kann als Mobilitätsregression verwendet werden, wenn die Fersen sonst sofort abheben.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":72,"name":"Shoulder CARs","categories":["Mobilität"],"muscles":["Schulter"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stehe oder sitze aufrecht mit ausreichend Platz für einen großen Armkreis. Ausgangsposition: Spanne Bauch und Gesäß leicht an, halte Rippen und Becken ruhig. Strecke einen Arm neben dem Körper und den Ellbogen vollständig. Bewegung: Führe den Arm langsam nach vorn und über den Kopf, so weit wie möglich ohne den Oberkörper auszuweichen. Wenn du am individuellen Endpunkt bist, drehe den Oberarm kontrolliert nach innen und führe den Arm hinter dem Körper nach unten. Kehre anschließend den gesamten Ablauf in Gegenrichtung um. Wichtig: CARs sind langsame kontrollierte Gelenkbewegungen, keine schnellen Armkreise; reduziere den Radius, wenn der Rumpf mitdreht.","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":73,"name":"Thoracic Rotation","categories":["Mobilität"],"muscles":["Rücken","Schulter","Core"],"variants":["Quadruped","Seated","Lying"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Wähle Quadruped, Seated oder Lying. Stabilisiere Becken und unteren Rücken; bei Lying liegen Hüfte und Knie gebeugt übereinander, bei Quadruped Hände unter den Schultern, bei Seated sitzt du aufrecht. Ausgangsposition: Bauch leicht anspannen und die Bewegung auf die Brustwirbelsäule begrenzen. Bewegung: Drehe Brustkorb, Arm und Blick kontrolliert zur Seite beziehungsweise öffne im Liegen den oberen Arm zur Gegenseite. Endposition/Rückweg: Stoppe vor Ausweichbewegungen des Beckens und kehre langsam zur Ausgangsposition zurück.","defaultVariant":"Lying","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":74,"name":"Shoulder Flexion","categories":["Mobilität"],"muscles":["Rücken","Schulter"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stelle dich mit dem Rücken an eine freie Wand. Ausgangsposition: Füße etwas vor die Wand stellen, Gesäß und oberer Rücken liegen an. Spanne den Bauch an und ziehe die Rippen leicht nach unten, damit der untere Rücken nicht stark von der Wand wegkippt. Strecke die Arme vor dem Körper beziehungsweise an der Wand nach oben. Bewegung: Führe beide Arme langsam über den Kopf Richtung Wand, während Ellbogen möglichst gestreckt bleiben. Endposition/Rückweg: Gehe nur so weit, wie du die Rippen kontrolliert halten kannst und keine Schmerzen entstehen. Senke die Arme anschließend wieder nach vorn. Wichtig: Nicht durch ein stärkeres Hohlkreuz zusätzlichen Schulterwinkel erzeugen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":75,"name":"Wrist CARs","categories":["Mobilität"],"muscles":["Arme/Hände"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Sitze oder stehe aufrecht. Ausgangsposition: Beuge einen Ellbogen ungefähr 90 Grad und halte den Unterarm mit der anderen Hand fest, damit er sich nicht mitbewegt. Schließe die arbeitende Hand locker zur Faust. Bewegung: Bewege das Handgelenk langsam in einen möglichst großen Kreis: Beugung, seitliche Abweichung, Streckung und andere Seite. Endposition/Rückweg: Führe mehrere langsame Kreise in beide Richtungen aus, ohne dass der Unterarm rotiert. Wichtig: Nur im schmerzfreien Bewegungsumfang arbeiten und nicht mit Schwung kreisen.","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":76,"name":"Jumps","categories":["Explosivität"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte","Sprünge"],"variants":[],"equipment":["Broad","Counter Movement","Drop","Squat","Skater"],"equipmentDisplay":"Broad, Counter Movement, Drop, Squat, Skater | Default: Squat","execution":"Aufbau: Wähle über „Hilfsmittel / Gerät“ die Sprungform; sie wird deshalb Teil des Übungsnamens (z. B. Squat Jumps, Broad Jumps oder Skater Jumps). Sorge für eine freie, rutschfeste Landefläche; bei Drop Jumps zusätzlich für eine niedrige, stabile Box. Ausgangsposition: Nimm einen athletischen Stand ein, Füße stabil, Knie leicht gebeugt und Rumpf angespannt. Bewegung: Squat Jumps starten aus einer kurzen Kniebeuge und gehen explosiv nach oben; Broad Jumps explosiv nach vorn; Counter Movement Jumps nach einer schnellen Gegenbewegung senkrecht nach oben; Drop Jumps beginnen mit dem kontrollierten Heruntersteigen von der Box und einem unmittelbar folgenden reaktiven Absprung; Skater Jumps springen seitlich von einem Bein auf das andere. Ende: Lande leise über Mittel-/Vorfuß, Knie in Richtung der Fußspitzen und Hüfte kontrolliert. Stabilisiere die Landung vor der nächsten Wiederholung. Wichtig: Qualität und Explosivität gehen vor Wiederholungszahl; bei nachlassender Landekontrolle den Satz beenden.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6","defaultEquipment":"Squat","equipmentRequired":true,"equipmentImplicit":false},{"id":78,"name":"Pulls","categories":["Explosivität"],"muscles":["Athletik","Rücken","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Clean","High"],"equipmentDisplay":"Clean, High | Default: Clean","equipmentImplicit":false,"execution":"Aufbau: Verwende eine Langhantel und wähle Clean oder High als Namensform; angezeigt werden dadurch Clean Pulls beziehungsweise High Pulls. Stelle die Hantel über dem Mittelfuß auf, Füße etwa hüftbreit. Ausgangsposition: Greife die Stange etwas weiter als schulterbreit, Rücken neutral, Brust angehoben, Rumpf angespannt. Bewegung: Strecke Knie und Hüfte explosiv und führe die Hantel dicht am Körper nach oben. Beim Clean Pull endet der Zug mit vollständiger Hüftstreckung und aktivem Schulterhochziehen; beim High Pull ziehen die Ellbogen anschließend weiter nach oben und außen, sodass die Stange höher steigt. Ende: Fange die Hantel nicht wie bei einem Clean, sondern führe sie kontrolliert zurück. Wichtig: Die Beschleunigung kommt aus Beinen und Hüfte, nicht aus frühem Armzug.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6","defaultEquipment":"Clean","equipmentRequired":true},{"id":81,"name":"Half Squats","categories":["Explosivität"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Barbell/Trapbar"],"equipmentDisplay":"Barbell/Trapbar (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle dich auf eine ebene Fläche; je nach Variante ohne Zusatzlast oder mit Langhantel in einem sicheren Rack. Ausgangsposition: Füße etwa schulterbreit, Zehen leicht nach außen, ganzer Fuß belastet. Bei Langhantel liegt die Stange sicher auf dem oberen Rücken. Spanne Bauch und Rücken an. Bewegung: Beuge Knie und Hüfte schnell, aber kontrolliert nur bis ungefähr zur halben Kniebeugentiefe; die Hüfte bleibt deutlich oberhalb der Knie. Drücke ohne Pause explosiv über den ganzen Fuß nach oben und strecke Knie und Hüfte schnell. Endposition: Stehe wieder aufrecht, ohne zwingend vom Boden abzuspringen. Wichtig: Obwohl die Bewegung explosiv ausgeführt wird, bleiben Knie in Richtung der Fußspitzen und der Rumpf stabil.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6","equipmentRequired":false,"defaultEquipment":""},{"id":84,"name":"Kettlebell Swings","categories":["Explosivität"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":["Kettlebell"],"equipmentDisplay":"Kettlebell (implicit)","equipmentImplicit":true,"execution":"Aufbau: Stelle eine Kettlebell etwa eine Fußlänge vor dich auf den Boden. Ausgangsposition: Füße etwas breiter als hüftbreit. Schiebe die Hüfte nach hinten, greife den Griff mit beiden Händen und kippe die Kettlebell leicht zu dir. Rücken bleibt stabil, Bauch angespannt. Bewegung: Ziehe die Kettlebell zunächst zwischen die Oberschenkel nach hinten. Strecke dann die Hüfte explosiv nach vorn und richte dich auf; die Kettlebell schwingt durch diesen Hüftimpuls nach vorn bis ungefähr Brusthöhe. Die Arme bleiben relativ locker und heben das Gewicht nicht aktiv hoch. Rückweg: Lasse die Kettlebell zurückfallen und schiebe die Hüfte erst dann wieder nach hinten, wenn die Unterarme sich dem Körper nähern. Wichtig: Es ist eine Hüftbeuge, keine tiefe Kniebeuge; am oberen Punkt nicht ins Hohlkreuz lehnen.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6","equipmentRequired":false,"defaultEquipment":""},{"id":85,"name":"Push Press","categories":["Explosivität"],"muscles":["Athletik","Arme/Hände","Schulter","Beine/Füße","Core"],"variants":["Half Kneeling"],"equipment":["Landmine","Barbell","Dumbbell"],"equipmentDisplay":"Landmine, Barbell, Dumbbell | Default: Landmine","equipmentImplicit":false,"execution":"Aufbau: Wähle Landmine, Barbell oder Dumbbell. Bei Half Kneeling kniest du einseitig mit dem gegenüberliegenden Fuß vorn; sonst stehst du stabil. Ausgangsposition: Last auf Schulterhöhe, Rumpf und Gesäß angespannt. Bewegung: Im Stand beuge Knie und Hüfte kurz und strecke die Beine explosiv, um den anschließenden Druck mit den Armen zu unterstützen. Bei Half Kneeling Landmine bleibt der Unterkörper stabil und du drückst das Landmine-Ende schräg nach vorn/oben. Endposition/Rückweg: Strecke den Arm beziehungsweise die Arme kontrolliert aus, ohne in den Rücken auszuweichen, und senke die Last wieder auf Schulterhöhe.","defaultVariant":"","equipmentRequired":true,"defaultEquipment":"Landmine","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6"},{"id":87,"name":"Pogo Hops","categories":["Explosivität"],"muscles":["Athletik","Beine/Füße","Sprünge"],"variants":["Assisted"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stelle dich auf eine freie, ebene Fläche. Ausgangsposition: Füße ungefähr hüftbreit, Knie nur leicht gebeugt, Oberkörper aufrecht. Bewegung: Springe wiederholt klein und schnell nach oben, indem du hauptsächlich die Sprunggelenke streckst. Die Knie bleiben relativ steif, ohne vollständig verriegelt zu sein. Landung: Lande auf dem Vor- bis Mittelfuß und nutze den kurzen elastischen Bodenkontakt direkt für den nächsten Sprung. Wichtig: Ziel sind kurze, reaktive Kontakte, nicht maximale Sprunghöhe; beende die Serie, wenn die Fersen hart aufschlagen oder die Knie stark einknicken.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":88,"name":"Power Cleans","categories":["Explosivität"],"muscles":["Athletik","Rücken","Schulter","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":["Barbell"],"equipmentDisplay":"Barbell (implicit)","equipmentImplicit":true,"execution":"Aufbau: Lege eine Langhantel auf den Boden und stelle dich so hin, dass die Stange ungefähr über dem Mittelfuß liegt. Ausgangsposition: Füße etwa hüftbreit, Griff knapp außerhalb der Beine, Rücken neutral, Bauch fest und Schultern leicht vor der Stange. Bewegung: Drücke den Boden weg und führe die Stange dicht an den Beinen bis oberhalb der Knie. Beschleunige anschließend durch eine explosive Streckung von Hüfte, Knie und Sprunggelenk. Ziehe dich danach aktiv unter die Hantel und drehe die Ellbogen schnell nach vorn. Endposition/Rückweg: Fange die Stange stabil auf den vorderen Schultern in einer Teilkniebeuge, richte dich vollständig auf und senke die Hantel kontrolliert zurück. Wichtig: Die Hantel wird auf den Schultern abgefangen; die Hände führen, tragen aber nicht allein die Last.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"3-6","equipmentRequired":false,"defaultEquipment":""},{"id":90,"name":"Flutter Kicks","categories":["Körpergewicht"],"muscles":["Athletik"],"variants":["Resistance Band"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich auf den Rücken auf eine Matte. Wenn du die Resistance-Band-Variante nutzt, lege ein leichtes Band um beide Füße beziehungsweise Knöchel und prüfe, dass es sicher sitzt. Ausgangsposition: Lege die Arme seitlich ab oder die Hände zur Unterstützung unter das Becken. Spanne den Bauch an, drücke den unteren Rücken sanft Richtung Unterlage und hebe beide gestreckten Beine einige Zentimeter vom Boden ab. Bewegung: Bewege die Beine abwechselnd in kleinen, schnellen Auf-und-ab-Bewegungen aus der Hüfte, während die Knie nur leicht gebeugt bleiben. Die Bewegung soll gleichmäßig bleiben; Becken und Brustkorb bleiben ruhig. Endposition/Rückweg: Führe die Beine kontrolliert zusammen und senke sie erst ab, wenn du die Bauchspannung halten kannst. Wichtig: Sobald der untere Rücken deutlich abhebt oder die Bewegung nur noch aus Schwung entsteht, verkleinere den Bewegungsumfang oder beende den Satz.","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":91,"name":"Jefferson Curl","categories":["Gewichte","Mobilität"],"muscles":["Rücken","Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":["Dumbbell","Kettlebell"],"equipmentDisplay":"Dumbbell, Kettlebell | optional | Default: Dumbbell","equipmentRequired":false,"execution":"Aufbau: Beginne ohne Zusatzgewicht oder mit einer sehr leichten Dumbbell/Kettlebell. Für mehr Bewegungsweg kannst du auf einer stabilen niedrigen Box stehen. Ausgangsposition: Füße etwa hüftbreit, Knie gestreckt oder minimal weich, Gewicht mit beiden Händen vor den Oberschenkeln, Arme lang. Bewegung: Beginne am Kopf: Kinn langsam Richtung Brust, dann oberen, mittleren und unteren Rücken Wirbel für Wirbel einrollen. Lass das Gewicht dicht vor den Beinen nach unten wandern und vermeide Federn. Endposition/Rückweg: Stoppe am tiefsten schmerzfrei kontrollierbaren Punkt. Rolle anschließend in umgekehrter Reihenfolge wieder auf, bis Kopf und Brustkorb zuletzt aufgerichtet sind. Wichtig: Ziel ist kontrollierte segmentale Wirbelsäulenbewegung, nicht das Bewegen einer schweren Last.","defaultEquipment":"Dumbbell","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":92,"name":"Dead Hang","categories":["Körpergewicht","Calisthenics"],"muscles":["Arme/Hände","Rücken","Schulter","Core"],"variants":["Passive","Active","False Grip"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Verwende eine stabile Klimmzugstange oder Ringe, die dein Körpergewicht sicher tragen; nutze bei Bedarf eine Box zum sicheren Auf- und Absteigen. Ausgangsposition: Greife die Stange/Ringe und hänge mit gestreckten Armen. Bauch und Gesäß leicht anspannen, Beine ruhig halten. Bewegung/Halten Passive: Schultern dürfen kontrolliert Richtung Ohren steigen, Ellbogen bleiben gestreckt. Active: Ziehe die Schulterblätter bei gestreckten Armen aktiv nach unten. False Grip: Bei Ringen liegt der Ring tief in der Handfläche nahe der Handgelenksfalte und das Handgelenk bleibt über dem Ring gebeugt. Endposition/Rückweg: Halte die gewählte Variante ruhig und ohne Pendeln; beende kontrolliert über Box/Boden, bevor der Griff nachlässt.","defaultVariant":"Passive","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":93,"name":"Sprinter Iso Holds","categories":["Körpergewicht","Explosivität"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stelle dich auf eine freie Fläche; für die leichtere Variante kannst du dich mit einer Hand leicht an einer Wand abstützen. Ausgangsposition: Stehe auf einem Bein, beuge das Standknie leicht und neige den Oberkörper aus der Hüfte etwas nach vorn. Hebe das andere Knie etwa auf Hüfthöhe. Der gegenüberliegende Arm schwingt nach vorn, der andere nach hinten wie in einer Sprintposition. Bewegung/Halten: Drücke den Standfuß aktiv in den Boden, halte Knieachse, Becken und Rumpf stabil und ziehe das angehobene Knie aktiv nach oben. Endposition/Rückweg: Halte die Position für die vorgegebene Zeit, setze den Fuß kontrolliert ab und wechsle die Seite. Wichtig: Kein Wippen, kein Einsinken im Standbein und kein Verdrehen des Beckens.","defaultSets":3,"defaultMeasureMode":"time","defaultTimeSeconds":30,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":94,"name":"Hamstring Tantrums","categories":["Explosivität"],"muscles":["Athletik","Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Resistance Band","GymBall"],"equipment":["Seated","Lying"],"equipmentDisplay":"Seated, Lying | Default: Lying","equipmentRequired":true,"execution":"Aufbau: Wähle Seated oder Lying als Namensform. Als Variante kann Resistance Band oder GymBall gewählt werden. Lying: Lege dich in Bauch- oder Rückenlage passend zum verwendeten Widerstand; Seated: sitze stabil mit aufgerichtetem Oberkörper. Ausgangsposition: Becken bleibt ruhig, Knie in der für den Widerstand geeigneten Position. Bewegung: Führe schnelle, kleine Kniebeuge-/Kniebeugungsimpulse gegen den Widerstand aus, sodass die hintere Oberschenkelmuskulatur wiederholt beschleunigt und abbremst. Bei GymBall bleibt der Ball kontrolliert unter den Fersen/Unterschenkeln; beim Band bleibt kontinuierliche Spannung. Ende: Stoppe, bevor die Bewegung unkontrolliert wird oder das Becken ausweicht. Wichtig: Es geht um schnelle, kontrollierte Aktivierung der Hamstrings, nicht um maximale Last.","defaultEquipment":"Lying","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"6-10","equipmentImplicit":false},{"id":95,"name":"Ankle CARs","categories":["Mobilität"],"muscles":["Beine/Füße"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Führe die Übung im Sitzen oder Stand aus und entlaste den zu bewegenden Fuß, sodass er frei kreisen kann. Ausgangsposition: Knie und Unterschenkel möglichst ruhig halten, Fuß leicht anheben. Bewegung: Bewege den Fuß langsam durch einen möglichst großen kontrollierten Kreis: Zehen nach unten, zur Außenseite, nach oben Richtung Schienbein und zur Innenseite zurück. Endposition/Rückweg: Schließe den Kreis in der Ausgangsposition und wiederhole ihn langsam in beide Richtungen. Wichtig: Der Kreis kommt aus dem Sprunggelenk; Knie und Hüfte sollen nicht mitdrehen.","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":96,"name":"Hip CARs","categories":["Mobilität"],"muscles":["Gesäß/Hüfte"],"variants":["Standing","Quadruped","Lying"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Wähle Standing, Quadruped oder Lying und schaffe genügend Platz für einen großen kontrollierten Hüftkreis. Ausgangsposition: Stabilisiere Becken und Rumpf; im Stand stehst du auf einem Bein und hältst dich bei Bedarf leicht fest, im Vierfüßler sind Hände unter den Schultern und Knie unter der Hüfte, im Liegen bleibt das Becken ruhig auf der Unterlage. Bewegung: Ziehe das arbeitende Knie kontrolliert Richtung Brust, öffne es seitlich, rotiere den Oberschenkel nach außen und führe das Bein anschließend nach hinten. Kehre über Innenrotation und Adduktion denselben Weg zurück, sodass ein möglichst großer, langsamer Kreis im Hüftgelenk entsteht. Endposition/Rückweg: Beende den Kreis in der Ausgangsposition und wiederhole in gleicher Qualität oder wechsle die Richtung. Wichtig: Der Kreis wird nur so groß gewählt, wie Becken und Wirbelsäule weitgehend unbewegt bleiben.","defaultVariant":"Standing","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":97,"name":"90/90","categories":["Mobilität"],"muscles":["Gesäß/Hüfte","Core"],"variants":["Hip Switch","Hinge","Manual External Rotation","Manual Internal Rotation","Active External Rotation","Active Internal Rotation"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Setze dich auf den Boden und beuge beide Knie ungefähr 90°. Ein Bein liegt vor dem Körper, das andere seitlich hinter dir. Ausgangsposition: Richte den Oberkörper auf, verteile das Gewicht kontrolliert auf beide Sitzbeinhöcker und halte die Hände bei Bedarf leicht am Boden. Bewegung Hip Switch: Führe beide Knie kontrolliert zur Gegenseite, ohne die Füße unnötig zu versetzen. Hinge: Bleibe in der 90/90-Position und neige den langen Oberkörper aus der Hüfte über das vordere Bein. Manual/Active Rotation: Erzeuge die gewählte Innen- oder Außenrotation kontrolliert mit leichter Handunterstützung beziehungsweise aktiv gegen die Schwerkraft. Endposition/Rückweg: Stoppe vor Schmerz oder Becken-Ausweichbewegung und kehre langsam zur Ausgangsposition zurück.","defaultVariant":"Hip Switch","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":98,"name":"Horse Stance","categories":["Körpergewicht","Mobilität"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":["Dynamic"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Stelle die Füße deutlich weiter als schulterbreit und drehe die Fußspitzen leicht nach außen. Ausgangsposition: Richte den Oberkörper auf, spanne den Bauch an und verteile das Gewicht über den ganzen Fuß. Bewegung/Halten: Beuge Knie und Hüfte und senke das Becken gerade nach unten, bis die Oberschenkel so tief wie kontrollierbar stehen. Die Knie folgen den Fußspitzen. Bei Dynamic bewegst du dich langsam wenige Zentimeter auf und ab; ohne Dynamic hältst du die Position statisch. Endposition/Rückweg: Drücke dich kontrolliert über beide Füße in den Stand. Wichtig: Knie nicht nach innen kollabieren lassen und nicht ins Hohlkreuz ausweichen.","defaultVariant":"","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":99,"name":"Cossack Squat","categories":["Körpergewicht","Mobilität"],"muscles":["Beine/Füße","Gesäß/Hüfte","Core"],"variants":[],"equipment":["Barbell","Dumbbell","Kettlebell"],"equipmentDisplay":"Barbell, Dumbbell, Kettlebell | optional","equipmentRequired":false,"execution":"Aufbau: Stelle die Füße sehr weit auseinander; Zusatzlast kann optional als Barbell, Dumbbell oder Kettlebell verwendet werden. Ausgangsposition: Füße vollständig am Boden, Brustkorb aufgerichtet, Bauch angespannt. Bewegung: Verlagere das Gewicht auf eine Seite, beuge dort Knie und Hüfte und schiebe das Becken nach hinten und unten. Das andere Bein bleibt seitlich gestreckt; dessen Zehen dürfen nach oben drehen. Endposition/Rückweg: Senke dich nur so weit, wie der belastete Fuß stabil bleibt, und drücke dich anschließend über diesen Fuß kontrolliert zur Mitte zurück. Wechsle die Seite. Wichtig: Das belastete Knie folgt der Fußrichtung.","defaultEquipment":"","defaultSets":2,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":100,"name":"Side Bends","categories":["Körpergewicht","Geräte"],"muscles":["Core"],"variants":["Standing","Lying"],"equipment":["Roman Chair","Dumbbell"],"equipmentDisplay":"Roman Chair, Dumbbell | optional | Default: Roman Chair","equipmentRequired":false,"execution":"Aufbau: Wähle Standing oder Lying sowie optional Roman Chair oder Dumbbell. Im Roman Chair fixierst du die Füße sicher und positionierst die Hüfte seitlich auf dem Polster; im Stand hältst du eine Dumbbell einseitig. Ausgangsposition: Rumpf lang, Becken neutral, Schultern übereinander. Bewegung: Neige den Oberkörper kontrolliert seitlich aus der Taille, ohne nach vorn oder hinten zu rotieren. Endposition/Rückweg: Stoppe im kontrollierten Bewegungsumfang und richte den Oberkörper mit der seitlichen Rumpfmuskulatur wieder bis zur neutralen Linie auf. Wichtig: Nicht mit Schwung arbeiten und die Bewegung nicht aus der Hüfte verdrehen.","defaultEquipment":"Roman Chair","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":101,"name":"Hip Flexion","categories":["Gewichte","Geräte","Körpergewicht"],"muscles":["Athletik","Beine/Füße","Core"],"variants":["Standing","Seated"],"equipment":["Kettlebell","Cable"],"equipmentDisplay":"Kettlebell, Cable | optional | Default: Cable","equipmentRequired":false,"execution":"Aufbau: Wähle Standing oder Seated und optional Cable oder Kettlebell. Für Cable befestigst du eine Fußmanschette an einem tiefen Kabelzug; eine Kettlebell nur so verwenden, dass sie sicher am Fuß gehalten werden kann. Ausgangsposition: Becken neutral, Bauch angespannt, Standbein stabil beziehungsweise im Sitzen Oberkörper aufrecht. Bewegung: Hebe Knie und Oberschenkel aus der Hüfte nach vorn/oben, ohne dich zurückzulehnen oder das Becken zu kippen. Endposition/Rückweg: Stoppe am höchsten kontrollierbaren Punkt und senke das Bein langsam zurück, ohne die Last fallen zu lassen. Wichtig: Die Bewegung kommt aus der Hüftbeugung, nicht aus Schwung im Oberkörper.","defaultVariant":"Standing","defaultEquipment":"Cable","defaultSets":3,"defaultMeasureMode":"reps","defaultReps":"8-12","equipmentImplicit":false},{"id":102,"name":"Cobra","categories":["Mobilität"],"muscles":["Brust","Rücken","Schulter","Core"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich bäuchlings auf eine Matte, Beine nach hinten gestreckt und Fußrücken am Boden. Ausgangsposition: Hände neben oder leicht unter den Schultern, Ellbogen nah am Körper, Schulterblätter kontrolliert. Bewegung/Halten: Hebe Brust und Kopf langsam an, indem du die Brustwirbelsäule streckst; die Hände dürfen unterstützen, sollen den Oberkörper aber nicht gewaltsam hochdrücken. Becken und Beine bleiben am Boden. Endposition/Rückweg: Halte die schmerzfreie Endposition ruhig und senke Brust und Kopf anschließend kontrolliert zurück. Wichtig: Schultern weg von den Ohren und keinen stechenden Druck im unteren Rücken erzwingen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":103,"name":"Child‘s Pose","categories":["Mobilität"],"muscles":["Brust","Rücken","Schulter","Gesäß/Hüfte","Beine/Füße"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Beginne im Vierfüßlerstand auf einer Matte. Ausgangsposition: Knie ungefähr unter den Hüften; Hände auf dem Boden, Rücken neutral. Bewegung/Halten: Schiebe das Becken langsam Richtung Fersen und wandere mit beiden Händen weit nach vorn. Senke Brust und Kopf Richtung Boden, während die Arme lang bleiben; alternativ können die Arme seitlich abgelegt werden. Endposition/Rückweg: Halte die Position ruhig, atme tief weiter und komme anschließend kontrolliert über die Hände zurück in den Vierfüßlerstand. Wichtig: Knie- und Schulterposition so anpassen, dass die Haltung schmerzfrei bleibt.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":104,"name":"Half Pigeon","categories":["Mobilität"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":["Elevated"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Wähle Floor oder Elevated. Beim Floor bringst du ein gebeugtes Bein vor den Körper und führst das andere Bein lang nach hinten; bei Elevated liegt das vordere Bein auf einer stabilen Bank/Box. Ausgangsposition: Richte das Becken möglichst nach vorn aus, stütze die Hände bei Bedarf ab und verlängere den Rücken. Bewegung/Halten: Bleibe aufrecht oder neige den Oberkörper aus der Hüfte über das vordere Bein, bis du eine kontrollierte Dehnung in Gesäß/Hüfte spürst. Endposition/Rückweg: Halte ruhig, atme weiter und löse die Position langsam, bevor du die Seite wechselst. Wichtig: Das vordere Knie nicht in eine schmerzhafte Position zwingen.","defaultVariant":"","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":105,"name":"Downward Dog","categories":["Mobilität"],"muscles":["Rücken","Schulter","Beine/Füße"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Beginne im Vierfüßlerstand auf einer rutschfesten Matte. Ausgangsposition: Hände etwa schulterbreit, Zehen aufgestellt, Bauch leicht angespannt. Bewegung/Halten: Drücke die Hände aktiv in den Boden und schiebe die Hüfte nach oben und hinten, sodass der Körper ungefähr ein umgedrehtes V bildet. Strecke die Arme und verlängere den Rücken; die Knie dürfen gebeugt bleiben und die Fersen müssen den Boden nicht erreichen. Endposition/Rückweg: Halte die Position ruhig und kehre anschließend kontrolliert in den Vierfüßlerstand zurück. Wichtig: Rückenlänge wichtiger als erzwungene gestreckte Knie.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":106,"name":"Happy Baby","categories":["Mobilität"],"muscles":["Rücken","Beine/Füße","Gesäß/Hüfte"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich auf den Rücken auf eine Matte. Ausgangsposition: Ziehe beide Knie Richtung Brust, öffne sie seitlich und greife Außenseiten der Füße oder die Unterschenkel. Bewegung/Halten: Richte die Fußsohlen Richtung Decke und führe die Knie kontrolliert neben dem Oberkörper Richtung Boden, während Kreuzbein und Rücken möglichst auf der Matte bleiben. Endposition/Rückweg: Halte die Dehnung ruhig, atme weiter und löse den Griff langsam, bevor du die Füße absetzt. Wichtig: Nicht an den Knien reißen oder das Becken gewaltsam vom Boden ziehen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":107,"name":"Bridge Pose","categories":["Mobilität"],"muscles":["Brust","Rücken","Schulter","Beine/ Füße","Gesäß/Hüfte"],"variants":[],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Lege dich auf den Rücken, beuge die Knie und stelle die Füße hüftbreit nahe am Gesäß auf. Ausgangsposition: Füße vollständig belastet, Arme seitlich, Bauch leicht angespannt. Bewegung/Halten: Drücke die Füße in den Boden und hebe das Becken kontrolliert an. Ziehe die Schulterblätter leicht unter den Körper und öffne den Brustkorb. Endposition/Rückweg: Halte die Position ohne Überstreckung im unteren Rücken und senke Wirbelsäule und Becken anschließend langsam wieder ab. Wichtig: Diese Mobility-/Yoga-Variante dient der gehaltenen Öffnung und bleibt von der kraftorientierten Glute Bridge getrennt.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":108,"name":"Crossed Shoulder Stretch","categories":["Mobilität"],"muscles":["Schulter"],"variants":["Seated","Lying"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Wähle Seated oder Lying. Ausgangsposition: Halte den Rumpf ruhig und die Schulter des zu dehnenden Arms entspannt. Bewegung/Halten: Führe einen Arm ungefähr auf Schulterhöhe gestreckt quer vor die Brust. Greife mit dem anderen Arm oberhalb des Ellbogens und ziehe ihn sanft näher zum Oberkörper. Endposition/Rückweg: Halte eine deutliche, schmerzfreie Dehnung an der hinteren Schulter, atme weiter und löse den Arm anschließend langsam. Wichtig: Schulter nicht hochziehen und Oberkörper nicht mitdrehen.","defaultVariant":"Seated","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":109,"name":"Apley Scratch / Cow Face","categories":["Mobilität"],"muscles":["Arme/Hände","Brust","Rücken","Schulter"],"variants":["Assisted"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Sitze oder stehe aufrecht; für Assisted halte einen Gurt oder ein Handtuch bereit. Ausgangsposition: Führe einen Arm über den Kopf, beuge den Ellbogen und lasse die Hand zwischen die Schulterblätter sinken. Der andere Arm geht seitlich nach hinten und der Handrücken wandert am Rücken nach oben. Bewegung/Halten: Führe beide Hände kontrolliert aufeinander zu; bei Assisted greifst du den Gurt mit beiden Händen und verkürzt den Abstand ohne zu reißen. Endposition/Rückweg: Halte die schmerzfreie Schulterposition ruhig und löse beide Arme langsam. Wichtig: Brustkorb nicht stark ins Hohlkreuz schieben und Schultergelenke nicht erzwingen.","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""},{"id":110,"name":"Frog Pose","categories":["Mobilität"],"muscles":["Beine/Füße","Gesäß/Hüfte"],"variants":["Single Leg","Dynamic"],"equipment":[],"equipmentDisplay":"-","execution":"Aufbau: Beginne auf Händen und Knien auf einer Matte. Ausgangsposition: Hände unter den Schultern, Knie zunächst unter den Hüften. Bewegung/Halten Standard: Schiebe beide Knie kontrolliert weit auseinander und stelle die Unterschenkel ungefähr quer zu den Oberschenkeln. Senke dich bei Bedarf auf die Unterarme und schiebe das Becken langsam nach hinten. Single Leg: Öffne nur ein Knie seitlich, während die andere Seite stabil bleibt. Dynamic: Bewege das Becken langsam vor und zurück, ohne in die Endposition zu federn. Endposition/Rückweg: Halte beziehungsweise bewege nur im schmerzfreien Bereich und führe die Knie anschließend kontrolliert wieder zusammen.","defaultVariant":"","defaultSets":1,"defaultMeasureMode":"time","defaultTimeSeconds":60,"equipmentImplicit":false,"equipmentRequired":false,"defaultEquipment":""}];
const METHOD_LABEL={standard:"Standard",normal:"Standard",superset:"Superset",giant:"Giant Set",preexhaust:"Pre-Exhaust",dropset:"Drop Set",restpause:"Rest-Pause",cluster:"Cluster",pyramid:"Pyramide",backoff:"Back-off"};
const METHOD_KEYS=["standard","superset","giant","preexhaust","dropset","restpause","cluster","pyramid","backoff"];
const $=id=>document.getElementById(id),clone=o=>JSON.parse(JSON.stringify(o)),uid=()=>Date.now()+Math.floor(Math.random()*1e5);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const read=(k,f)=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):f}catch{return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let plans=[],customExercises=[],history=[],measurements=[],nutrition={},profile={},activeWorkout=null,weekPlan=[null,null,null,null,null,null,null];
let currentTab="training",tabScroll={exercises:0,plans:0,training:0,week:0,profile:0},pageStack=[],currentExercise=null,currentPlan=null,pendingStartPlan=null,restTimer=null,restEnd=0,clockTimer=null,timeSetTimers=new Map(),audioCtx=null;
let sheetStack=[],exerciseDetailReturn=null,ratingTarget=null;
const WEEK_VIEW_OFFSET_KEY="rethink_week_view_offset",PROFILE_DAY_OFFSET_KEY="rethink_profile_day_offset";
let weekOffset=Math.max(-104,Math.min(104,Number(localStorage.getItem(WEEK_VIEW_OFFSET_KEY)||0))),editorDirty=false,editorOriginalSnapshot="",livePlanEdited=false;

function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1500)}
function ensureAudio(){try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx}catch{return null}}
function signalTone(){
 const c=ensureAudio();if(!c)return;
 try{
  const now=c.currentTime,master=c.createGain();
  master.gain.setValueAtTime(.0001,now);
  master.gain.exponentialRampToValueAtTime(.68,now+.025);
  master.gain.setValueAtTime(.68,now+.85);
  master.gain.exponentialRampToValueAtTime(.0001,now+1.35);
  master.connect(c.destination);
  [[740,0,.36],[980,.32,.40],[1240,.70,.50]].forEach(([freq,offset,len])=>{
    const o=c.createOscillator(),g=c.createGain();
    o.type="square";o.frequency.setValueAtTime(freq,now+offset);
    g.gain.setValueAtTime(.0001,now+offset);
    g.gain.exponentialRampToValueAtTime(.42,now+offset+.015);
    g.gain.setValueAtTime(.34,now+offset+Math.max(.03,len-.08));
    g.gain.exponentialRampToValueAtTime(.0001,now+offset+len);
    o.connect(g);g.connect(master);o.start(now+offset);o.stop(now+offset+len+.03)
  })
 }catch{}
}
function requestTimerNotifications(){if("Notification" in window&&Notification.permission==="default")Notification.requestPermission().catch(()=>{})}
function backgroundTimerNotice(text){if(document.visibilityState!=="hidden"||!("Notification" in window)||Notification.permission!=="granted")return;navigator.serviceWorker?.ready.then(r=>r.showNotification("ReThink.",{body:text,tag:"rethink-timer",renotify:true})).catch(()=>{})}


function mondayOf(date=new Date()){const d=new Date(date);const day=(d.getDay()+6)%7;d.setHours(12,0,0,0);d.setDate(d.getDate()-day);return d}
function weekKeyForOffset(offset=weekOffset){const d=mondayOf();d.setDate(d.getDate()+offset*7);return d.toISOString().slice(0,10)}
function loadDatedWeeks(){return read(WEEK_DATED_KEY,{})||{}}
function saveCurrentWeekRefs(){const all=loadDatedWeeks();all[weekKeyForOffset()]=weekPlan;write(WEEK_DATED_KEY,all)}
function loadWeekOffset(offset){weekOffset=Math.max(-104,Math.min(104,offset));localStorage.setItem(WEEK_VIEW_OFFSET_KEY,String(weekOffset));const all=loadDatedWeeks();weekPlan=all[weekKeyForOffset()]||[[],[],[],[],[],[],[]];weekPlan=weekPlan.map(x=>Array.isArray(x)?x:(x!=null?[x]:[]));renderWeek()}
function weekDateAt(day,offset=weekOffset){const d=mondayOf();d.setDate(d.getDate()+offset*7+day);return d}
function fmtShortDate(d){return d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}
function markEditorDirty(){editorDirty=true;persistUI()}
function setEditorBaseline(){editorOriginalSnapshot=JSON.stringify(currentPlan||null);editorDirty=false}
function editorHasChanges(){return editorDirty||JSON.stringify(currentPlan||null)!==editorOriginalSnapshot}
function persistRestEnd(){
 if(restEnd>Date.now()){localStorage.setItem(REST_END_KEY,String(restEnd));if(activeWorkout)activeWorkout.restEnd=restEnd}
 else{localStorage.removeItem(REST_END_KEY);if(activeWorkout)activeWorkout.restEnd=0}
 if(activeWorkout)write(STORAGE.active,activeWorkout)
}
function restoreRestTimer(){
 const saved=Math.max(Number(localStorage.getItem(REST_END_KEY)||0),Number(activeWorkout?.restEnd||0));
 if(!activeWorkout||saved<=Date.now()){if(saved)localStorage.removeItem(REST_END_KEY);return}
 restEnd=saved;startRest(Math.ceil((saved-Date.now())/1000),true)
}
function groupMethod(m){return["superset","giant","preexhaust"].includes(m)}
function groupMembers(e){return[e.name,...(e.linkedExerciseNames||[])].filter(Boolean)}
function repTop(reps){const m=String(reps||"").match(/(\d+)\s*-\s*(\d+)/);return m?Number(m[2]):null}
function lastHistoryExercise(name){for(let i=history.length-1;i>=0;i--){const ex=(history[i].exercises||[]).find(e=>e.name===name);if(ex)return ex}return null}
function saveAll(){write(STORAGE.plans,plans);write(STORAGE.custom,customExercises);write(STORAGE.history,history);write(STORAGE.measurements,measurements);write(STORAGE.nutrition,nutrition);write(STORAGE.profile,profile);activeWorkout?write(STORAGE.active,activeWorkout):localStorage.removeItem(STORAGE.active);write(WEEK_KEY,weekPlan);saveCurrentWeekRefs()}
const REP_PRESETS=["1-3","3-6","4-8","8-12","10-15","15-20","20-30","AMRAP"];
function repsForMethod(m){
 if(m==="standard")return["1-3","3-6","4-8","8-12","10-15","15-20","20-30","AMRAP"];
 if(m==="superset")return["4-8","8-12","10-15","15-20","AMRAP"];
 if(m==="giant")return["1-3","3-6","4-8","8-12","10-15","15-20","AMRAP"];
 if(m==="preexhaust")return["8-12","10-15","15-20","AMRAP"];
 if(m==="dropset")return["8-12","10-15","15-20"];
 if(m==="restpause")return["20","30"];
 if(m==="cluster")return["6","8","10","12","15","20"];
 if(m==="backoff")return["5"];
 return REP_PRESETS
}
function timeMaxForExercise(e){return 600}
function timePresetValues(e){const max=timeMaxForExercise(e),vals=[];for(let s=15;s<=Math.min(600,max);s+=15)vals.push(s);if(max>600)for(let s=660;s<=max;s+=60)vals.push(s);return vals}
function timePresetMarkup(e,prefix){
 const vals=timePresetValues(e),max=vals[vals.length-1]||600;
 const cur=Math.min(max,Math.max(15,Number(e.timeSeconds)||60));
 if(!vals.includes(cur)){vals.push(cur);vals.sort((a,b)=>a-b)}
 return`<select id="${prefix}TimeWheel" class="field time-wheel-select" aria-label="Zeit wählen">${vals.map(v=>`<option value="${v}" ${cur===v?"selected":""}>${formatTime(v)}</option>`).join("")}</select>`
}
function repPresetMarkup(e){const opts=repsForMethod(e.setTechnique||"standard"),cur=amrapText(e.reps||defaultRepsForMethod(e.setTechnique));return`<div class="rep-presets">${opts.map(v=>`<button type="button" class="rep-preset ${cur===v?"active":""}" data-rep-preset="${v}">${v}</button>`).join("")}</div>`}
function defaultRestSeconds(){return Number(localStorage.getItem(REST_DEFAULT_KEY)||90)||90}
function defaultRepsForMethod(m){return m==="superset"||m==="preexhaust"?"10-15":m==="restpause"?"20":m==="cluster"?"10":m==="backoff"?"5":"8-12"}
const METHOD_DEFAULT_SETS={standard:3,superset:3,giant:3,preexhaust:3,dropset:3,restpause:1,cluster:1,pyramid:5,backoff:4};
function defaultSetsForExerciseMethod(e,m="standard"){m=m||"standard";if(m!=="standard")return METHOD_DEFAULT_SETS[m]||3;return Math.max(1,Number(e?.defaultSets)||3)}
function applyStandardExerciseDefaults(e){const c=catalogExercise(e?.name)||e||{};e.sets=defaultSetsForExerciseMethod(c,"standard");e.rest=defaultRestSeconds();e.measureMode=c.defaultMeasureMode||"reps";if(e.measureMode==="time"){e.timeSeconds=Math.max(15,Number(c.defaultTimeSeconds)||60);e.reps=""}else{e.reps=c.defaultReps||"8-12"}return e}
function prepareDraftForTargetMethod(e,method,oldGroupCount=1){
 method=METHOD_KEYS.includes(method)?method:"standard";e.setTechnique=method;e.methodData={};e.reps=defaultRepsForMethod(method);e.sets=defaultSetsForExerciseMethod(e,method);
 if(method==="dropset")e.methodData={dropCount:2,dropPercent:20,intraRest:0};
 else if(method==="giant")e.methodData={giantCount:Math.max(3,Math.min(6,Number(oldGroupCount)||3))};
 else if(method==="pyramid"){e.methodData={pyramidDirection:"peak"};ensurePyramidData(e)}
 else if(method==="backoff")e.methodData={topReps:5,backoffReps:8,backoffPercent:15};
 else if(method==="cluster"){e.reps="10";e.methodData={blocks:5,clusterReps:2,intraRest:20}}
 else if(method==="restpause"){e.reps="20";e.methodData={maxBlocks:6,intraRest:20}}
 if(!groupMethod(method)){e.techniqueGroup=null;e.linkedExerciseNames=[]}
 return e
}
function validateExerciseDraft(e){
 if(!e||!e.name)return"Bitte eine Übung auswählen.";
 const sets=Number(e.sets);if(!Number.isInteger(sets)||sets<1||sets>10)return"Bitte eine gültige Satzanzahl festlegen.";
 const rest=Number(e.rest);if(!Number.isFinite(rest)||rest<0)return"Bitte eine gültige Pausenzeit festlegen.";
 if(e.measureMode==="time"){
  const t=Number(e.timeSeconds),max=600;
  if(!Number.isFinite(t)||t<15||t>max||t%15!==0)return`Bitte eine Zeit zwischen 0:15 und ${formatTime(max)} festlegen.`;
 }else{
  const m=e.setTechnique||"standard",r=amrapText(e.reps||"");
  if(m==="restpause"){if(![20,30].includes(Number(e.reps)))return"Für Rest-Pause bitte ein Gesamtziel von 20 oder 30 WDH. wählen."}
  else if(m==="cluster"){if(!Number.isFinite(Number(e.reps))||Number(e.reps)<=0)return"Bitte ein gültiges Cluster-Gesamtziel wählen."}
  else if(m==="pyramid"){
   ensurePyramidData(e);if(!Array.isArray(e.methodData?.reps)||e.methodData.reps.length!==sets||e.methodData.reps.some(x=>!Number.isFinite(Number(x))||Number(x)<1))return"Bitte die Wiederholungen für jeden Pyramiden-Satz vollständig festlegen.";
  }else if(m==="backoff"){
   const md=e.methodData||{},top=Number(md.topReps),back=Number(md.backoffReps),pct=Number(md.backoffPercent);if(!Number.isFinite(top)||top<1||![6,7,8,9,10,11,12].includes(back)||back<=top||!Number.isFinite(pct)||pct<=0)return"Bitte Top-Satz, Back-off-WDH. und Gewichtsreduktion vollständig festlegen.";
  }else if(!r)return"Bitte eine Wiederholungsvorgabe festlegen.";
 }
 if((e.setTechnique||"")==="dropset"){
  const md=e.methodData||{},c=Number(md.dropCount),pct=Number(md.dropPercent);if(![1,2,3,4].includes(c)||![10,15,20,25,30].includes(pct))return"Bitte Anzahl der Drops und Gewichtsreduktion vollständig festlegen.";
 }
 if((e.setTechnique||"")==="giant"){
  const c=Number(e.methodData?.giantCount);if(![3,4,5,6].includes(c))return"Bitte die Anzahl der Übungen im Giant Set festlegen.";
 }
 return""
}
function validateDraftCollection(drafts,method,target){
 if(!Array.isArray(drafts)||drafts.length!==target)return`Bitte zuerst alle ${target} Übungen vollständig konfigurieren.`;
 for(let i=0;i<drafts.length;i++){const err=validateExerciseDraft(drafts[i]);if(err)return`${String.fromCharCode(65+i)} · ${drafts[i]?.name||"Übung"}: ${err}`}
 if(groupMethod(method)&&drafts.some(x=>x.setTechnique!==method))return"Alle Übungen der Serie müssen dieselbe Zielmethode verwenden.";
 return""
}
function normEx(x){
 const e=clone(x||{});e.name=e.name||"Übung";
 e.categories=Array.isArray(e.categories)&&e.categories.length?[...new Set(e.categories)]:[e.category||"Körpergewicht"];
 e.category=e.categories[0]||"Körpergewicht";e.muscles=Array.isArray(e.muscles)?e.muscles:[];
 e.variants=Array.isArray(e.variants)?[...new Set(e.variants.filter(Boolean))]:[];
 e.equipment=Array.isArray(e.equipment)?[...new Set(e.equipment.filter(Boolean))]:[];
 e.equipmentDisplay=e.equipmentDisplay||(e.equipment.length?e.equipment.join(", "):"-");return e
}
function normPlanEx(e){
 if(e){
  const _oldName=String(e.name||""),_oldVariant=String(e.variant||""),_oldEquipment=String(e.equipmentChoice||"");
  if(_oldName==="Deadlifts"||_oldName==="Deadlift"){
   if(["Barbell","Dumbbell"].includes(_oldEquipment)){e.variant=_oldEquipment;e._variantExplicit=true}
   if(_oldVariant==="Romanian"){e.equipmentChoice="Romanian";e._equipmentExplicit=true}
  }
  if(_oldName==="Split Squats"||_oldName==="Split Squat"){
   if(["Dumbbell","Barbell"].includes(_oldEquipment)){e.variant=_oldEquipment;e._variantExplicit=true}
   if(["ATG","Bulgarian"].includes(_oldVariant)){e.equipmentChoice=_oldVariant;e._equipmentExplicit=true}
  }
  if(_oldName==="Squats"||_oldName==="Squat"){
   if(["Barbell","Dumbbell","Kettlebell","Assisted"].includes(_oldEquipment)){e.variant=_oldEquipment;e._variantExplicit=true}
   if(["Front","Goblet","Overhead","Sissy"].includes(_oldVariant)){e.equipmentChoice=_oldVariant;e._equipmentExplicit=true}
   if(_oldVariant==="Back"){e.equipmentChoice="";e._equipmentExplicit=true}
  }
 }
 if(e&&String(e.name||"")==="Sissy Squats"){e.name="Squats";e.equipmentChoice="Sissy";e._equipmentExplicit=true;if(!e.variant)e.variant="Assisted";e._variantExplicit=true}
 if(e&&String(e.name||"")==="Squat Jumps"){e.name="Jumps";e.equipmentChoice="Squat";e._equipmentExplicit=true}
 if(e&&e.setTechnique!=null){const rawMethod=String(e.setTechnique).trim().toLowerCase();e.setTechnique=rawMethod==="normal"?"standard":rawMethod}const x=normEx(e),legacyAmrap=x.setTechnique==="amrap";const catalogEx=catalogExercise(x.name);if(catalogEx)x.name=catalogEx.name;if(catalogEx){if(!Array.isArray(x.equipment)||!x.equipment.length)x.equipment=clone(catalogEx.equipment||[]);if(!Array.isArray(x.variants)||!x.variants.length)x.variants=clone(catalogEx.variants||[])}x.variant=(String(x.variant||"").trim().toLowerCase()==="standard"?"":String(x.variant||"").trim());x.setTechnique=legacyAmrap?"standard":(String(x.setTechnique||"standard").trim().toLowerCase()==="normal"?"standard":String(x.setTechnique||"standard").trim().toLowerCase());x.measureMode=x.measureMode||((x.tracking||"").includes("time")?"time":"reps");x.reps=legacyAmrap&&x.measureMode!=="time"?"AMRAP":(x.reps||x.targetRepRange||defaultRepsForMethod(x.setTechnique));x.sets=Math.max(1,Number(x.sets)||3);x.rest=Number.isFinite(Number(x.rest))?Number(x.rest):defaultRestSeconds();x.methodData=x.methodData||{};x.note=x.note||"";x.variant=String(x.variant||"").toLowerCase()==="standard"?"":(x.variant||"");applyCatalogDefaults(x);x.perSide=!!x.perSide;x.linkedExerciseNames=Array.isArray(x.linkedExerciseNames)?x.linkedExerciseNames:[];return x}
function normPlan(p){return{id:p.id||uid(),name:p.name||"Trainingsplan",createdAt:p.createdAt||Date.now(),updatedAt:p.updatedAt||Date.now(),lastUsedAt:Number(p.lastUsedAt)||0,exercises:(p.exercises||[]).map(normPlanEx)}}
function allExercises(){const hidden=new Set((read(STORAGE.library,{hidden:[]}).hidden||[])),map=new Map(DEFAULT_EXERCISES.filter(x=>!hidden.has(x.name)).map(x=>[x.name.toLowerCase(),normEx(x)]));customExercises.forEach(x=>{const e=normEx(typeof x==="string"?{name:x,custom:true}:x);e.custom=true;map.set(e.name.toLowerCase(),e)});return[...map.values()].sort((a,b)=>a.name.localeCompare(b.name,"de"))}
function findExercise(n){const wanted=canonicalExerciseName(n);return allExercises().find(x=>x.name===wanted)||normEx({name:wanted})}
const EXERCISE_NAME_ALIASES={"Calf Raise":"Calf Raises","Biceps Curl":"Biceps Curls","Deadlift":"Deadlifts","Good Morning":"Good Mornings","Hip Thrust":"Hip Thrusts","Landmine Rotation":"Landmine Rotations","Lateral Raise":"Lateral Raises","Lunge":"Lunges","Pullover":"Pullovers","Row":"Rows","Shoulder Press":"Shoulder Presses","Shoulder Rotation":"Shoulder Rotations","Split Squat":"Split Squats","Squat":"Squats","Step-Up":"Step-Ups","Triceps Extension":"Triceps Extensions","Crunch":"Crunches","Face Pull":"Face Pulls","Lat Pulldown":"Lat Pulldowns","Leg Curl":"Leg Curls","Leg Extension":"Leg Extensions","Bird Dog":"Bird Dogs","Clamshell":"Clamshells","Glute Bridge":"Glute Bridges","Nordic Hamstring Curl":"Nordic Hamstring Curls","Pike Push-Up":"Push-Ups","Push-Up":"Push-Ups","Sissy Squat":"Squats","Step-Down":"Step-Downs","Tibialis Raise":"Tibialis Raises","Dip":"Dips","Handstand Push-Up":"Push-Ups","Hanging Leg Raise":"Leg Raises","Muscle-Up":"Muscle-Ups","Pistol Squat":"Pistol Squats","Planche Push-Up":"Push-Ups","Pull-Up":"Pull-Ups","Box Jump":"Jumps","Broad Jump":"Jumps","Clean Pull":"Pulls","Countermovement Jump":"Jumps","Drop Jump":"Jumps","Half Squat":"Half Squats","High Pull":"Pulls","Kettlebell Swing":"Kettlebell Swings","Landmine Push Press":"Push Press","Power Clean":"Power Cleans","Push Press":"Push Presses","Jefferson Curl":"Jefferson Curls","Dead Hang":"Dead Hangs","Sprinter Iso Hold":"Sprinter Iso Holds","Side Bend":"Side Bends","Crossed Shoulder Stretch":"Crossed Shoulder Stretches","Sprinter Iso Holds":"Sprinter Iso Holds","Bird Dogs":"Bird Dog","Glute Bridges":"Glute Bridge","Reverse Nordic":"Reverse Nordics","Back Lever":"Lever","Front Lever":"Lever","Hanging Leg Raises":"Leg Raises","Pike Push-Ups":"Push-Ups","Handstand Push-Ups":"Push-Ups","Planche Push-Ups":"Push-Ups","Open Book Rotation":"Thoracic Rotation","Box Jumps":"Jumps","Broad Jumps":"Jumps","Countermovement Jumps":"Jumps","Drop Jumps":"Jumps","Squat Jump":"Jumps","Squat Jumps":"Jumps","Side Jump":"Jumps","Side Jumps":"Jumps","Clean Pulls":"Pulls","High Pulls":"Pulls","Landmine Push Presses":"Push Press","Push Presses":"Push Press","Jefferson Curls":"Jefferson Curl","Dead Hangs":"Dead Hang","Crossed Shoulder Stretches":"Crossed Shoulder Stretch","Ankle Dorsiflexion Mobilization":"Ankle Dorsiflexion"};
function canonicalExerciseName(name){return EXERCISE_NAME_ALIASES[name]||name}
function catalogExercise(name){const wanted=canonicalExerciseName(name);return DEFAULT_EXERCISES.find(x=>x.name===wanted)||null}
function catalogOptionMeta(source){
 const c=typeof source==="string"?(catalogExercise(source)||normEx({name:canonicalExerciseName(source)})):(source?.name?(catalogExercise(source.name)||normEx(source)):normEx(source||{}));
 const equipment=(c.equipment||[]).filter(Boolean),variants=(c.variants||[]).filter(Boolean),implicit=!!c.equipmentImplicit;
 const showEquipment=!implicit&&equipment.length>0,required=showEquipment&&!!c.equipmentRequired;
 const fallback=equipment.includes(c.defaultEquipment)?c.defaultEquipment:(required?(equipment[0]||""):"");
 return{catalog:c,equipment,variants,showEquipment,equipmentRequired:required,defaultEquipment:fallback,nameStyle:"prefix"}
}
function sensibleVariantDefault(meta){
 const list=meta?.variants||[];if(!list.length)return"";
 if(Object.prototype.hasOwnProperty.call(meta?.catalog||{},"defaultVariant"))return meta.catalog.defaultVariant||"";
 const preferred=["Standard","Normal","Neutral","Flat","Regular"];
 return preferred.find(x=>list.includes(x))||list[0]||""
}
function applyCatalogDefaults(e){
 if(!e)return e;const meta=catalogOptionMeta(e);
 if(meta.variants.length){
  if(e._variantExplicit){if(e.variant&&!meta.variants.includes(e.variant))e.variant=""}
  else if(!meta.variants.includes(e.variant))e.variant=sensibleVariantDefault(meta)
 }else e.variant="";
 if(meta.showEquipment){
  if(e._equipmentExplicit){if(e.equipmentChoice&&!meta.equipment.includes(e.equipmentChoice))e.equipmentChoice=""}
  else if(meta.equipmentRequired&&!meta.equipment.includes(e.equipmentChoice))e.equipmentChoice=meta.defaultEquipment||meta.equipment[0]||"";
  else if(!meta.equipmentRequired&&!meta.equipment.includes(e.equipmentChoice))e.equipmentChoice=meta.defaultEquipment||""
 }else e.equipmentChoice="";
 return e
}
function exerciseOptionFieldsMarkup(e,prefix){
 const meta=catalogOptionMeta(e);if(!meta.variants.length&&!meta.showEquipment)return"";
 const variant=meta.variants.length?`<div class="form-field option-peer"><label>VARIANTE</label><select id="${prefix}Variant" class="field"><option value="" ${e.variant?"":"selected"}>—</option>${meta.variants.map(v=>`<option value="${esc(v)}" ${e.variant===v?"selected":""}>${esc(v)}</option>`).join("")}</select></div>`:"";
 const equipment=meta.showEquipment?`<div class="form-field option-peer"><label>HILFSMITTEL / GERÄT</label><select id="${prefix}Equipment" class="field">${meta.equipmentRequired?"":`<option value="" ${e.equipmentChoice?"":"selected"}>—</option>`}${meta.equipment.map(v=>`<option value="${esc(v)}" ${e.equipmentChoice===v?"selected":""}>${esc(v)}</option>`).join("")}</select></div>`:"";
 return variant+equipment
}
function captureExerciseOptionFields(e,prefix){
 if(!e)return e;const meta=catalogOptionMeta(e),v=$(`${prefix}Variant`),q=$(`${prefix}Equipment`);
 if(v){e.variant=v.value;e._variantExplicit=true}
 if(q){e.equipmentChoice=q.value;e._equipmentExplicit=true}
 if(meta.showEquipment&&meta.equipmentRequired&&!e.equipmentChoice){e.equipmentChoice=meta.defaultEquipment||meta.equipment[0]||"";e._equipmentExplicit=false}
 return applyCatalogDefaults(e)
}
function captureVisibleExerciseConfig(e,prefix,{setsId=null,restId=null,perSideId=null}={}){
 if(!e)return e;
 if(setsId&&$(setsId))e.sets=Number($(setsId).value)||e.sets;
 if(restId&&$(restId))e.rest=Number($(restId).value);
 captureExerciseOptionFields(e,prefix);
 if(perSideId&&$(perSideId))e.perSide=!!$(perSideId).checked;
 saveMethodRepConfig(e,prefix);
 return e
}
function exerciseDisplayName(e){
 const meta=catalogOptionMeta(e),base=canonicalExerciseName(e?.name||"Übung"),eq=meta.showEquipment?String(e?.equipmentChoice||meta.defaultEquipment||"").trim():"";if(!eq)return base;
 const compact=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"");
 if(compact(base).includes(compact(eq))||compact(eq).includes(compact(base)))return base;
 if(meta.nameStyle==="suffix")return`${base} ${eq}`;if(meta.nameStyle==="separator")return`${base} — ${eq}`;return`${eq} ${base}`
}
function exerciseInlineMeta(e){
 const bits=[];
 if(e?.variant)bits.push(String(e.variant));
 if(e?.perSide)bits.push("WDH. pro Seite");
 return bits.length?`<div class="exercise-title-variant">${bits.map(esc).join(" · ")}</div>`:""
}





function isCustom(n){return customExercises.some(x=>(typeof x==="string"?x:x.name)===n)}

const UI_KEY="rethink_ui_state_v2",DAY_KEY="rethink_day_state_v2";
const METHOD_HELP={
 standard:"Sätze nacheinander ausführen und dazwischen vollständig pausieren. Last und WDH. bleiben pro Satz anpassbar.",
 superset:"A direkt gefolgt von B mit keiner oder kurzer Zwischenpause. Pause erst nach B.",
 giant:"Drei oder mehr Übungen direkt nacheinander. Pause erst nach der letzten Übung der Runde.",
 preexhaust:"Isolationsübung A ermüdet den Zielmuskel vor Hauptübung B. Beide direkt nacheinander ausführen.",
 dropset:"Nach dem Ausgangssatz die Last direkt reduzieren und ohne reguläre Satzpause weiterarbeiten.",
 restpause:"Das WDH.-Gesamtziel in mehreren Teilblöcken mit sehr kurzen Pausen erreichen.",
 cluster:"Den Arbeitssatz in kleine WDH.-Blöcke teilen. Kurze Pausen helfen, Leistung und Ausführung zu halten.",
 pyramid:"Die Last verändert sich von Satz zu Satz; die WDH. verlaufen entgegengesetzt. Folge dem Ziel jedes Satzes.",
 backoff:"Auf einen schweren Top-Satz folgen leichtere Sätze für zusätzliches Trainingsvolumen."
};
function methodHelp(m){return METHOD_HELP[m||"standard"]||METHOD_HELP.standard}
function exerciseSetCount(ex){return Number(ex?.sets)||0}
function workoutSetCount(w){return(w?.exercises||[]).reduce((n,e)=>n+(e.liveSets?.length||Number(e.sets)||0),0)}
function amrapText(v){const s=String(v||"");return s.toUpperCase().includes("AMRAP")?"AMRAP":s}
function restSeconds(e,fallback=90){const n=Number(e?.rest);return Number.isFinite(n)?Math.max(0,n):fallback}
function exerciseWorkSeconds(e){const sets=Math.max(1,Number(e?.sets)||1);return e?.measureMode==="time"?sets*Math.max(15,Number(e.timeSeconds)||60):sets*45}
function estimateMinutes(p){
 const ex=p?.exercises||[];let sec=0,seen=new Set();
 ex.forEach(e=>{if(groupMethod(e.setTechnique)&&e.techniqueGroup){if(seen.has(e.techniqueGroup))return;seen.add(e.techniqueGroup);const members=ex.filter(x=>x.techniqueGroup===e.techniqueGroup),rounds=Math.max(1,...members.map(x=>Number(x.sets)||1));sec+=members.reduce((sum,x)=>sum+(x.measureMode==="time"?rounds*Math.max(15,Number(x.timeSeconds)||60):rounds*45),0);sec+=Math.max(0,rounds-1)*restSeconds(members[0],90);return}const sets=Math.max(1,Number(e.sets)||1);sec+=exerciseWorkSeconds(e);sec+=Math.max(0,sets-1)*restSeconds(e,90)});
 return Math.max(1,Math.round(sec/60))
}
function persistUI({capture=true}={}){
 const visible=document.querySelector(".page:not(.hidden)");
 if(capture)captureTabUiState(currentTab);
 const state={
  tab:currentTab,tabScroll,tabUiState:clone(tabUiState),
  exerciseFilters:{type:exType,muscles:[...exMuscles]},
  plansQuickEdit:!!plansQuickEdit,
  page:visible?.id||null,pageScroll:visible?.scrollTop||0,
  currentPlan:currentPlan?clone(currentPlan):null,
  currentExerciseName:$("exerciseDetailPage")&&!$("exerciseDetailPage").classList.contains("hidden")?$("exerciseDetailTitle").textContent:null,
  pendingStartPlanId:pendingStartPlan?.id||pendingStartPlan||null
 };
 try{localStorage.setItem(UI_KEY,JSON.stringify(state))}catch{}
}
const SESSION_MARKER="rethink_session_alive_v1";
const rethinkPersistOnBackgroundV5=()=>{try{persistUI();saveAll()}catch{}};
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")rethinkPersistOnBackgroundV5()});
window.addEventListener("pagehide",rethinkPersistOnBackgroundV5);

function restoreUI(){
 const saved=read(UI_KEY,null);
 sessionStorage.setItem(SESSION_MARKER,"1");
 if(saved){
  try{
   if(saved.tabUiState&&typeof saved.tabUiState==="object")tabUiState={...tabUiState,...saved.tabUiState};
   if(saved.tabScroll&&typeof saved.tabScroll==="object")tabScroll={...tabScroll,...saved.tabScroll};
   currentTab=saved.tab||"training";
   if(saved.exerciseFilters){exType=saved.exerciseFilters.type||"Alle";exMuscles=new Set(saved.exerciseFilters.muscles||[])}
   plansQuickEdit=!!saved.plansQuickEdit;
   if(saved.currentPlan)currentPlan=clone(saved.currentPlan);
   showTab(currentTab,{reset:false});
   const page=saved.page;
   if(page==="livePage"&&activeWorkout){openLive(false);requestAnimationFrame(()=>{$("livePage").scrollTop=Number(saved.pageScroll)||0});return}
   if(page==="settingsPage"&&typeof openSettingsPage==="function"){openSettingsPage();requestAnimationFrame(()=>{$("settingsPage").scrollTop=Number(saved.pageScroll)||0});return}
   if(page==="exerciseDetailPage"&&saved.currentExerciseName){openExerciseDetail(saved.currentExerciseName);requestAnimationFrame(()=>{$("exerciseDetailPage").scrollTop=Number(saved.pageScroll)||0});return}
   const p=page&&$(page);
   if(p&&page!==`${currentTab}Page`){openPage(page);requestAnimationFrame(()=>{p.scrollTop=Number(saved.pageScroll)||0})}
   else requestAnimationFrame(()=>{const tabPage=$(`${currentTab}Page`);if(tabPage)tabPage.scrollTop=Number(saved.pageScroll||tabScroll[currentTab]||0)});
   return
  }catch{}
 }
 currentTab="training";showTab("training",{reset:true});if(activeWorkout){renderTrainingHome();openLive(false)}
}

window.__rethinkRestoreUIV24=restoreUI;

let profileDayOffset=0;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,"0");
function profileDate(offset=profileDayOffset){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d}
function profileDateKey(offset=profileDayOffset){const d=profileDate(offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function profileDayLabel(){if(profileDayOffset===0)return"Heute";if(profileDayOffset===-1)return"Gestern";if(profileDayOffset===1)return"Morgen";return profileDate().toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})}
function profileDayBounds(){const d=profileDate();d.setHours(0,0,0,0);return{start:d.getTime(),end:d.getTime()+86400000}}
function changeProfileDay(delta){profileDayOffset+=delta;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,String(profileDayOffset));renderProfile();requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"auto"}))}
function dailyReset(){
 const today=new Date().toISOString().slice(0,10),d=read(DAY_KEY,{date:today});
 if(d.date!==today){nutrition.hydration=0;nutrition.consumedCalories=0;nutrition.consumedProtein=0;d.date=today;write(DAY_KEY,d);saveAll()}
}
function hydrateGoal(){
 const stored=Number(nutrition.waterGoal)||0;
 if(nutrition.waterGoalMode==="manual")return stored;
 const w=profileWeight?.()||Number(profile.weight)||Number(measurements.at(-1)?.weight)||0;
 if(!w)return stored;
 if(nutrition.waterGoalMode==="auto"||nutrition.goalCalculatedAt){
  const age=Number(profile.age)||30,activity=Number(profile.activity)||1.55,bf=typeof currentBodyFatPct==="function"?currentBodyFatPct():0,sex=profile.sex;
  const basePerKg=age>=51?30:35;
  let water=w*basePerKg+activityWaterExtra(activity);
  if(bf>0&&((sex==="male"&&bf<15)||(sex!=="male"&&bf<23)))water+=150;
  return Math.max(1500,Math.min(5500,Math.round(water/50)*50))
 }
 return stored
}

function foodTone(cat){
 const m={"Obst":"food-fruit","Gemüse":"food-veg","Getreide & Beilagen":"food-carb","Milchprodukte & Eier":"food-dairy","Fleisch, Fisch & Protein":"food-protein","Hülsenfrüchte, Nüsse & Samen":"food-legume","Fette, Aufstriche & Sonstiges":"food-other"};
 return m[cat]||"food-other"
}
function todayFoodEntries(){
 const today=profileDateKey();
 nutrition.foodLog=Array.isArray(nutrition.foodLog)?nutrition.foodLog:[];
 return nutrition.foodLog.filter(x=>x.date===today)
}
function recalcFoodTotals(){
 const foods=todayFoodEntries(),drinks=todayHydrationEntries();
 nutrition.consumedCalories=Math.round(foods.reduce((s,x)=>s+Number(x.kcal||0),0)+drinks.reduce((s,x)=>s+Number(x.caloriesPer250||0)*Number(x.size||0)/250,0));
 nutrition.consumedProtein=Math.round((foods.reduce((s,x)=>s+Number(x.protein||0),0)+drinks.reduce((s,x)=>s+Number(x.protein||0),0))*10)/10;
 nutrition.hydration=Math.round(foods.reduce((s,x)=>s+Number(x.water||0),0)+drinks.reduce((s,x)=>s+Number(x.size||0)*Number(x.hydration||0)/100,0));
 nutrition.caffeineToday=Math.round(drinks.reduce((s,x)=>s+Number(x.caffeinePerServing||0),0))
}
function addFoodEntry(food,grams){
 grams=Math.max(1,Number(grams)||100);
 nutrition.foodLog=Array.isArray(nutrition.foodLog)?nutrition.foodLog:[];
 nutrition.foodLog.push({id:uid(),date:profileDateKey(),name:food.name,category:food.category,grams,kcal:Math.round(food.kcal*grams/100),protein:Math.round(food.protein*grams/100*10)/10,water:Math.round(Number(food.water||0)*grams/100)});
 recalcFoodTotals();saveAll();renderProfile()
}
function deleteFoodEntry(id){
 nutrition.foodLog=(nutrition.foodLog||[]).filter(x=>String(x.id)!==String(id));recalcFoodTotals();saveAll();renderProfile()
}
function openFoodSearch(initialQuery=""){
 let q=String(initialQuery||"").toLowerCase();
 const rows=()=>q?FOOD_DB.filter(f=>f.name.toLowerCase().includes(q)).slice(0,80):[];
 const rowMarkup=()=>rows().map(f=>`<button class="food-result ${foodTone(f.category)}" data-food-name="${esc(f.name)}"><div class="food-result-copy"><strong>${esc(f.name)}</strong><small>${esc(f.category)}</small></div><span class="food-result-values">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser</span></button>`).join("")||(q?'<div class="small empty-food-note">Kein passendes Lebensmittel gefunden.</div>':'<div class="food-search-empty"><strong>Lebensmittel suchen</strong><div class="small">Tippe einen Namen ein. Die Datenbank wird nicht als Liste angezeigt.</div></div>');
 const body=()=>`<div class="search food-search"><span class="search-loupe" aria-hidden="true">⌕</span><input id="foodSearchInput" class="field" type="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Lebensmittel suchen" value="${esc(q)}"><button id="foodSearchClear" class="${q?"":"hidden"}">×</button></div><div class="small food-source-note">${FOOD_DB.length} Lebensmittel · Nährwerte pro 100 g</div><div id="foodSearchRows">${rowMarkup()}</div>`;
 const bindRows=()=>document.querySelectorAll("[data-food-name]").forEach(b=>b.onclick=()=>{
   const f=FOOD_DB.find(x=>x.name===b.dataset.foodName);
   currentSheetState={title:"Lebensmittel hinzufügen",body:body(),scroll:$("sheetBody").scrollTop||0,bind};
   openSheet(f.name,`<div class="food-selected ${foodTone(f.category)}"><strong>${esc(f.name)}</strong><div class="small">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser je 100 g</div></div><div class="form-field"><label>MENGE G</label><input id="foodGramInput" class="field" inputmode="decimal" value="100" onfocus="this.select()" onclick="this.select()"></div><button id="foodAddConfirm" class="primary" style="width:100%">Hinzufügen</button>`,()=>{const grams=$("foodGramInput");grams.onfocus=()=>grams.select();grams.onclick=()=>grams.select();$("foodAddConfirm").onclick=()=>{addFoodEntry(f,Number(String(grams.value).replace(",",".")));closeSheet({all:true})}})
 });
 const bind=()=>{
   const input=$("foodSearchInput");
   const refresh=()=>{$("foodSearchRows").innerHTML=rowMarkup();$("foodSearchClear").classList.toggle("hidden",!q);bindRows();currentSheetState={title:"Lebensmittel hinzufügen",body:body(),scroll:$("sheetBody").scrollTop||0,bind}};
   input.oninput=()=>{q=input.value.toLowerCase();refresh()};
   $("foodSearchClear").onclick=()=>{q="";input.value="";refresh();input.focus()};
   bindRows()
 };
 openSheet("Lebensmittel hinzufügen",body(),bind)
}
const BUILTIN_DRINKS=[
{id:"water",name:"Wasser",icon:"💧",kind:"water",size:250,hydration:100,calories:0,caffeine:0},
{id:"coffee",name:"Kaffee",icon:"☕",kind:"coffee",size:250,hydration:95,calories:2,caffeine:95},
{id:"cappuccino",name:"Cappuccino",icon:"☕",kind:"coffee",size:200,hydration:97,calories:80,caffeine:60},
{id:"oat-cappuccino",name:"Hafer Cappuccino",icon:"☕",kind:"coffee",size:200,hydration:96,calories:90,caffeine:60},
{id:"espresso",name:"Espresso",icon:"☕",kind:"coffee",size:30,hydration:87,calories:0,caffeine:8},
{id:"protein-shake",name:"Protein-Shake",icon:"💪",kind:"protein",size:500,hydration:110,calories:57,caffeine:0,protein:20},
{id:"protein-caffeine",name:"Protein-Koffein",icon:"⚡",kind:"protein",size:500,hydration:110,calories:57,caffeine:80,protein:20},
{id:"herbal-tea",name:"Kräuter Tee",icon:"🍵",kind:"tea",size:250,hydration:100,calories:0,caffeine:0},
{id:"green-tea",name:"Grüner Tee",icon:"🍵",kind:"tea",size:250,hydration:99,calories:0,caffeine:25},
{id:"black-tea",name:"Schwarzer Tee",icon:"🍵",kind:"tea",size:250,hydration:99,calories:0,caffeine:45},
{id:"alcoholfree-beer",name:"Bier alkoholfrei",icon:"🍺",kind:"beer",size:500,hydration:100,calories:100,caffeine:0},
{id:"beer",name:"Bier",icon:"🍺",kind:"beer",size:500,hydration:70,calories:215,caffeine:0},
{id:"diet-soda",name:"Diätlimonade",icon:"🥤",kind:"soda",size:330,hydration:95,calories:0,caffeine:0},
{id:"soda",name:"Limonade",icon:"🥤",kind:"soda",size:330,hydration:85,calories:135,caffeine:0},
{id:"juice",name:"Saft",icon:"🧃",kind:"juice",size:250,hydration:85,calories:110,caffeine:0},
{id:"gin-tonic",name:"Gin Tonic",icon:"🍸",kind:"cocktail",size:250,hydration:30,calories:170,caffeine:0},
{id:"aperol",name:"Aperol Spritz",icon:"🍹",kind:"cocktail",size:250,hydration:40,calories:190,caffeine:0},
{id:"white-wine",name:"Weißwein",icon:"🍷",kind:"wine",size:150,hydration:35,calories:72,caffeine:0},
{id:"red-wine",name:"Rotwein",icon:"🍷",kind:"wine",size:150,hydration:35,calories:75,caffeine:0},
{id:"prosecco",name:"Prosecco",icon:"🥂",kind:"wine",size:100,hydration:35,calories:30,caffeine:0},
{id:"energy-drink",name:"Energy Drink",icon:"⚡",kind:"energy",size:250,hydration:80,calories:110,caffeine:80},
{id:"smoothie",name:"Smoothie",icon:"🍓",kind:"smoothie",size:250,hydration:85,calories:150,caffeine:0},
{id:"milkshake",name:"Milchshake",icon:"🍓",kind:"smoothie",size:300,hydration:75,calories:360,caffeine:0}
];
function drinkKind(d){
 if(d.kind)return d.kind;
 const n=String(d.name||"").toLowerCase();
 if(n.includes("wasser"))return"water";if(n.includes("kaffee")||n.includes("espresso")||n.includes("cappuccino"))return"coffee";
 if(n.includes("tee"))return"tea";if(n.includes("bier"))return"beer";if(n.includes("wein")||n.includes("prosecco"))return"wine";
 if(n.includes("gin")||n.includes("aperol")||n.includes("cocktail"))return"cocktail";if(n.includes("energy"))return"energy";
 if(n.includes("saft"))return"juice";if(n.includes("smoothie"))return"smoothie";if(n.includes("milch"))return"milk";if(n.includes("limonade"))return"soda";
 return"custom"
}
function drinkTone(d){return`drink-kind-${drinkKind(d)} drink-id-${String(d.id||"").replace(/[^a-z0-9_-]/gi,"-")}`}
function ensureDrinks(){
 const existing=Array.isArray(nutrition.drinks)?nutrition.drinks:[];
 const deleted=new Set((nutrition.deletedBuiltinDrinks||[]).map(String));
 const builtinById=new Map(BUILTIN_DRINKS.map(x=>[String(x.id),x]));
 const builtinByName=new Map(BUILTIN_DRINKS.map(x=>[String(x.name).toLowerCase(),x]));
 const merged=[],seen=new Set();
 // Keep the user's current order.
 existing.forEach(old=>{
  const base=builtinById.get(String(old.id))||builtinByName.get(String(old.name||"").toLowerCase());
  if(base&&deleted.has(String(base.id))&&String(base.id)!=="water")return;
  const d=base?{...base,...old,id:old.id||base.id,icon:["protein-shake","protein-caffeine"].includes(String(base.id))?base.icon:(old.icon||base.icon),kind:["protein-shake","protein-caffeine"].includes(String(base.id))?"protein":(old.kind||base.kind)}:old;
  merged.push(d);seen.add(String(d.id||d.name))
 });
 // Append missing built-ins; Water is always restored and never deletable.
 BUILTIN_DRINKS.forEach(base=>{
  if(deleted.has(String(base.id))&&String(base.id)!=="water")return;
  if(!merged.some(d=>String(d.id)===String(base.id)||String(d.name||"").toLowerCase()===String(base.name).toLowerCase()))merged.push(clone(base))
 });
 nutrition.drinks=merged
}
function touchInput(el){if(el)el.dataset.touched="1"}
function loadData(){plans=(read(STORAGE.plans,[])||[]).map(normPlan);customExercises=read(STORAGE.custom,[])||[];history=(read(STORAGE.history,[])||[]).map(w=>({...w,exercises:(w.exercises||[]).map(e=>{const liveSets=e.liveSets;const n=normPlanEx(e);if(liveSets)n.liveSets=liveSets;return n})}));measurements=read(STORAGE.measurements,[])||[];nutrition=read(STORAGE.nutrition,{calories:"",protein:"",hydration:0})||{};profile=read(STORAGE.profile,{})||{};activeWorkout=read(STORAGE.active,null);if(activeWorkout?.exercises)activeWorkout.exercises=activeWorkout.exercises.map(e=>{const liveSets=e.liveSets;const n=normPlanEx(e);if(liveSets)n.liveSets=liveSets;return n});{const dated=loadDatedWeeks()[weekKeyForOffset(0)];weekPlan=dated||read(WEEK_KEY,[[],[],[],[],[],[],[]])||[[],[],[],[],[],[],[]]}if(!Array.isArray(weekPlan)||weekPlan.length!==7)weekPlan=[[],[],[],[],[],[],[]];weekPlan=weekPlan.map(x=>Array.isArray(x)?x.filter(id=>plans.some(p=>String(p.id)===String(id))):(x!=null&&plans.some(p=>String(p.id)===String(x))?[x]:[]))}
const tabUiState={
 exercises:{},plans:{},training:{},week:{},profile:{}
};
const tabVisited={exercises:false,plans:false,training:false,week:false,profile:false};

function captureTabUiState(name=currentTab){
 const tab=$("tab-"+name);if(!tab)return;
 const s=tabUiState[name]||(tabUiState[name]={});
 s.scroll=Math.max(Number(window.scrollY||0),Number(document.scrollingElement?.scrollTop||0));
 s.horizontal={};
 tab.querySelectorAll(".chips,[data-preserve-hscroll]").forEach((el,i)=>{
   s.horizontal[el.id||`idx_${i}`]=Number(el.scrollLeft||0)
 });
 s.details={};
 tab.querySelectorAll("details").forEach((el,i)=>{
   s.details[el.id||`idx_${i}`]=!!el.open
 });
 // Preserve text/search inputs that belong directly to the tab.
 s.inputs={};
 tab.querySelectorAll("input,textarea,select").forEach((el,i)=>{
   const key=el.id||`idx_${i}`;
   if(el.type==="checkbox"||el.type==="radio")s.inputs[key]={checked:!!el.checked};
   else s.inputs[key]={value:el.value}
 });
 if(name==="exercises")s.logical={type:exType,muscles:[...exMuscles],search:$("exerciseSearch")?.value||""};
 else if(name==="week")s.logical={weekOffset:Number(weekOffset)||0};
 else if(name==="profile")s.logical={profileDayOffset:Number(profileDayOffset)||0};
 else if(name==="plans")s.logical={plansQuickEdit:!!plansQuickEdit}
}

function restoreTabUiState(name,{scroll=true}={}){
 const tab=$("tab-"+name),s=tabUiState[name];if(!tab||!s)return;
 if(s.logical){
   if(name==="exercises"){
     exType=s.logical.type||"Alle";exMuscles=new Set(Array.isArray(s.logical.muscles)?s.logical.muscles:[]);
     if($("exerciseSearch")&&document.activeElement!==$("exerciseSearch"))$("exerciseSearch").value=s.logical.search||""
   }else if(name==="week"){
     weekOffset=Number(s.logical.weekOffset)||0;localStorage.setItem(WEEK_VIEW_OFFSET_KEY,String(weekOffset))
   }else if(name==="profile"){
     profileDayOffset=Number(s.logical.profileDayOffset)||0;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,String(profileDayOffset))
   }else if(name==="plans")plansQuickEdit=!!s.logical.plansQuickEdit
 }
 if(s.inputs){
   tab.querySelectorAll("input,textarea,select").forEach((el,i)=>{
     const key=el.id||`idx_${i}`,v=s.inputs[key];if(!v)return;
     if("checked" in v&&(el.type==="checkbox"||el.type==="radio"))el.checked=!!v.checked;
     else if("value" in v&&document.activeElement!==el)el.value=v.value
   })
 }
 if(s.details){
   tab.querySelectorAll("details").forEach((el,i)=>{
     const key=el.id||`idx_${i}`;if(Object.prototype.hasOwnProperty.call(s.details,key))el.open=!!s.details[key]
   })
 }
 if(s.horizontal){
   tab.querySelectorAll(".chips,[data-preserve-hscroll]").forEach((el,i)=>{
     const key=el.id||`idx_${i}`;if(Object.prototype.hasOwnProperty.call(s.horizontal,key))el.scrollLeft=Number(s.horizontal[key])||0
   })
 }
 if(scroll){
   const y=Number(s.scroll??tabScroll[name]??0)||0;
   try{window.scrollTo({top:y,left:0,behavior:"auto"})}catch{window.scrollTo(0,y)}
   const doc=document.scrollingElement||document.documentElement;if(doc)doc.scrollTop=y;
   tabScroll[name]=y
 }
}

function showTab(name,{reset=false,forceRender=false}={}){
 const outgoing=currentTab;
 if(outgoing)captureTabUiState(outgoing);
 // Save the outgoing state now, but DO NOT capture the target before it has been restored.
 persistUI({capture:false});

 document.querySelectorAll(".tab-screen").forEach(x=>x.classList.add("hidden"));
 $("tab-"+name).classList.remove("hidden");
 currentTab=name;
 document.querySelectorAll("#bottomNav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));

 if(!tabVisited[name]||reset||forceRender){
   // On an ordinary first visit render the current logical globals.
   // On a deliberate reset the reset function already established the canonical globals.
   renderTab(name);
   tabVisited[name]=true
 }

 requestAnimationFrame(()=>{
   if(reset){
     try{window.scrollTo({top:0,left:0,behavior:"auto"})}catch{window.scrollTo(0,0)}
     const doc=document.scrollingElement||document.documentElement;if(doc)doc.scrollTop=0;
     tabScroll[name]=0
   }else{
     restoreTabUiState(name,{scroll:true});
     setTimeout(()=>restoreTabUiState(name,{scroll:true}),45)
   }
   // Persist only after the target was restored; don't recapture and overwrite it.
   persistUI({capture:false})
 })
}
function resetTabToStandard(name){
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));pageStack=[];sheetStack=[];$("sheetWrap")?.classList.add("hidden");exerciseDetailReturn=null;$("bottomNav").classList.remove("hidden");
 const a=document.activeElement;if(a&&["INPUT","TEXTAREA","SELECT"].includes(a.tagName))a.blur();
 if(name==="exercises"){exType="Alle";exMuscles.clear();exercisePickerState={q:"",type:"Alle",muscles:[]};const s=$("exerciseSearch");if(s)s.value=""}
 if(name==="plans"){plansQuickEdit=false;document.querySelectorAll(".swipe-open").forEach(x=>x.classList.remove("swipe-open"))}
 if(name==="training"){document.querySelectorAll(".swipe-open").forEach(x=>x.classList.remove("swipe-open"))}
 if(name==="week"){saveCurrentWeekRefs();weekOffset=0;localStorage.setItem(WEEK_VIEW_OFFSET_KEY,"0");const all=loadDatedWeeks();weekPlan=all[weekKeyForOffset(0)]||read(WEEK_KEY,[[],[],[],[],[],[],[]])||[[],[],[],[],[],[],[]];weekPlan=weekPlan.map(x=>Array.isArray(x)?x:(x!=null?[x]:[]));document.querySelectorAll(".swipe-open").forEach(x=>x.classList.remove("swipe-open"))}
 if(name==="profile"){profileDayOffset=0;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,"0")}
 tabScroll[name]=0
}
function mainScrollTop(){
 const el=document.scrollingElement||document.documentElement;
 return Math.max(Number(el?.scrollTop||0),Number(document.body?.scrollTop||0),Number(window.scrollY||0))
}
function forceTabTop(name){
 const el=document.scrollingElement||document.documentElement;
 try{window.scrollTo({top:0,left:0,behavior:"auto"})}catch{window.scrollTo(0,0)}
 if(el)el.scrollTop=0;
 if(document.documentElement)document.documentElement.scrollTop=0;
 if(document.body)document.body.scrollTop=0;
 const tab=$("tab-"+name);if(tab)tab.scrollTop=0;
 tabScroll[name]=0
}
function resetExerciseFilterRibbonScroll(){
 const type=$("typeChips"),muscle=$("muscleChips");
 if(type)type.scrollLeft=0;
 if(muscle)muscle.scrollLeft=0
}
let exerciseResetArmed=false;
function exerciseFilterSituation(){
 const q=String($("exerciseSearch")?.value||"").trim();
 const type=exType!=="Alle";
 const muscles=exMuscles.size>0;
 const h=(Number($("typeChips")?.scrollLeft)||0)>2||(Number($("muscleChips")?.scrollLeft)||0)>2;
 return !!(q||type||muscles||h)
}
document.addEventListener("input",e=>{if(e.target?.id==="exerciseSearch")exerciseResetArmed=false},true);
document.addEventListener("click",e=>{if(e.target?.closest?.("#typeChips .chip,#muscleChips .chip"))exerciseResetArmed=false},true);
document.querySelectorAll("#bottomNav button").forEach(b=>b.onclick=()=>{
 const name=b.dataset.tab;
 const subPage=!!document.querySelector(".page:not(.hidden)");
 const isCurrent=currentTab===name&&!subPage;
 if(!isCurrent){exerciseResetArmed=false;showTab(name,{reset:false});return}

 if(mainScrollTop()>8){
   forceTabTop(name);
   if(name==="exercises")exerciseResetArmed=true;
   if(tabUiState[name])tabUiState[name].scroll=0;
   persistUI();
   return
 }

 // Exercises with an active filter/search state must get one clean "to top" tap
 // before a second tap is allowed to reset filters and search.
 if(name==="exercises"&&exerciseFilterSituation()&&!exerciseResetArmed){
   forceTabTop(name);
   exerciseResetArmed=true;
   return
 }

 resetTabToStandard(name);
 if(name==="exercises")exerciseResetArmed=false;
 showTab(name,{reset:true,forceRender:true});
 requestAnimationFrame(()=>{
   forceTabTop(name);
   if(name==="exercises")resetExerciseFilterRibbonScroll();
   tabUiState[name]={scroll:0,horizontal:{},details:{},inputs:{}};
   captureTabUiState(name);
   setTimeout(()=>{forceTabTop(name);if(name==="exercises")resetExerciseFilterRibbonScroll()},40)
 })
});
function openPage(id,render){$(id)?.classList.add("keyboard-safe");
 const visible=document.querySelector(".page:not(.hidden)");
 if(visible)pageStack.push({page:visible.id,scroll:visible.scrollTop||0});
 else pageStack.push({tab:currentTab,scroll:window.scrollY||0});
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));$(id).classList.remove("hidden");$("bottomNav").classList.add("hidden");render?.();requestAnimationFrame(()=>$(id).scrollTo({top:0,behavior:"auto"}));persistUI()
}
function closePage(){
 const current=document.querySelector(".page:not(.hidden)");if(current)current.classList.add("hidden");
 const p=pageStack.pop();
 if(p?.page){$(p.page).classList.remove("hidden");$("bottomNav").classList.add("hidden");requestAnimationFrame(()=>$(p.page).scrollTo({top:p.scroll||0,behavior:"auto"}))}
 else{$("bottomNav").classList.remove("hidden");showTab(p?.tab||currentTab);requestAnimationFrame(()=>window.scrollTo({top:p?.scroll||0,behavior:"auto"}))}
 persistUI()
}
document.addEventListener("click",e=>{if(!e.target.closest("[data-back]"))return;if(e.target.closest("#exerciseDetailPage")&&exerciseDetailReturn?.type==="live"&&activeWorkout){const idx=exerciseDetailReturn.index||0;exerciseDetailReturn=null;closePage();requestAnimationFrame(()=>focusLiveExercise(idx,"auto"));return}closePage()});
let keyboardDismissStartY=null,keyboardDismissCanBlur=false;
function activeEditable(){const a=document.activeElement;return a&&["INPUT","TEXTAREA","SELECT"].includes(a.tagName)?a:null}
document.addEventListener("touchstart",e=>{
 keyboardDismissStartY=e.touches?.[0]?.clientY??null;
 keyboardDismissCanBlur=!e.target.closest("input,textarea,select");
},{passive:true});
document.addEventListener("touchmove",e=>{
 const a=activeEditable();
 if(!a||!keyboardDismissCanBlur||keyboardDismissStartY==null)return;
 const y=e.touches?.[0]?.clientY??keyboardDismissStartY;
 if(Math.abs(y-keyboardDismissStartY)>18){
   a.blur();
   keyboardDismissStartY=null;
   keyboardDismissCanBlur=false
 }
},{passive:true});
document.addEventListener("touchend",()=>{keyboardDismissStartY=null;keyboardDismissCanBlur=false},{passive:true});
document.addEventListener("wheel",e=>{
 const a=activeEditable();
 if(a&&!e.target.closest("input,textarea,select"))a.blur()
},{passive:true});



document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){saveAll();captureTabUiState(currentTab);persistUI({capture:false})}});
window.addEventListener("pagehide",()=>{saveAll();captureTabUiState(currentTab);persistUI({capture:false})});


function renderTab(n){if(n==="exercises")renderExerciseLibrary();if(n==="plans")renderPlans();if(n==="training")renderTrainingHome();if(n==="week")renderWeek();if(n==="profile")renderProfile()}

const PLAN_SORT_KEY="rethink_plan_sort_v31";
const storedPlanSort=read(PLAN_SORT_KEY,{key:"name",dir:1});
let exType="Alle",exMuscles=new Set(),planSort={
 key:["name","created","updated","used"].includes(storedPlanSort?.key)?storedPlanSort.key:"name",
 dir:Number(storedPlanSort?.dir)===-1?-1:1
};
function savePlanSort(){write(PLAN_SORT_KEY,planSort)}
function exerciseLastUsedAt(name){
 let t=0;
 history.forEach(w=>{(w.exercises||[]).forEach(e=>{if(e.name===name)t=Math.max(t,Number(w.finishedAt||w.startedAt||0))})});
 if(activeWorkout)(activeWorkout.exercises||[]).forEach(e=>{if(e.name===name)t=Math.max(t,Number(activeWorkout.startedAt||Date.now()))});
 return t
}
function sortExercises(rows,sort=exerciseSort){
 const out=[...rows];
 out.sort((a,b)=>{
  if(sort.key==="used"){const av=exerciseLastUsedAt(a.name),bv=exerciseLastUsedAt(b.name);if(av!==bv)return sort.dir*(av-bv);return a.name.localeCompare(b.name,"de")}
  return sort.dir*a.name.localeCompare(b.name,"de")
 });
 return out
}
function exerciseSortMarkup(sort=exerciseSort,prefix="exsort"){
 const defs=[["name","A–Z"],["used","Genutzt"]];
 return defs.map(([k,l])=>`<button class="chip ${sort.key===k?"active":""}" data-${prefix}="${k}">${l}${sort.key===k?(sort.dir>0?" ↑":" ↓"):""}</button>`).join("")
}
const EXERCISE_CATEGORY_ORDER=["Gewichte","Geräte","Körpergewicht","Calisthenics","Cardio","Mobilität","Explosivität"];
const MUSCLE_GROUP_ORDER=["Athletik","Arme/Hände","Brust","Rücken","Schulter","Beine/Füße","Gesäß/Hüfte","Core","Sprünge"];
function orderedMuscles(all){
 const present=[...new Set(all.flatMap(x=>x.muscles||[]))];
 return ["Alle",...MUSCLE_GROUP_ORDER.filter(x=>present.includes(x)),...present.filter(x=>!MUSCLE_GROUP_ORDER.includes(x)).sort((a,b)=>a.localeCompare(b,"de"))]
}
function exerciseCategoryIndex(e){
 const i=EXERCISE_CATEGORY_ORDER.indexOf(e.category);
 return i>=0?i:999
}
function groupedExerciseSort(a,b){
 const ai=exerciseCategoryIndex(a),bi=exerciseCategoryIndex(b);
 if(ai!==bi)return ai-bi;
 return a.name.localeCompare(b.name,"de")
}
function orderedExerciseTypes(all){
 const present=[...new Set(all.flatMap(x=>x.categories||[x.category]))];
 return [...EXERCISE_CATEGORY_ORDER.filter(x=>present.includes(x)),...present.filter(x=>!EXERCISE_CATEGORY_ORDER.includes(x)).sort((a,b)=>a.localeCompare(b,"de"))]
}
function renderExerciseLibrary(){
 const all=allExercises(),q=String($("exerciseSearch")?.value||"").trim().toLowerCase();
 const rows=all.filter(e=>(exType==="Alle"||(e.categories||[]).includes(exType))&&(!exMuscles.size||[...exMuscles].every(m=>(e.muscles||[]).includes(m)))&&(!q||[e.name,...(e.categories||[]),...(e.muscles||[]),...(e.variants||[]),e.equipmentDisplay||""].join(" ").toLowerCase().includes(q))).sort(groupedExerciseSort);
 const types=orderedExerciseTypes(all),muscles=[...new Set(all.flatMap(e=>e.muscles||[]))].sort((a,b)=>a.localeCompare(b,"de"));
 $("typeChips").innerHTML=["Alle",...types].map(x=>`<button class="chip ${exType===x?"active":""}" data-type="${esc(x)}">${esc(x)}</button>`).join("");
 $("muscleChips").innerHTML=["Alle",...muscles].map(x=>`<button class="chip ${(x==="Alle"&&!exMuscles.size)||exMuscles.has(x)?"active":""}" data-muscle="${esc(x)}">${esc(x)}</button>`).join("");
 $("exerciseList").innerHTML=rows.map(e=>{
   const eq=e.equipmentDisplay&&e.equipmentDisplay!=="-"?e.equipmentDisplay.replace(/\s*\|\s*Default:.*$/,"").replace(/\s*\|\s*optional$/,"").replace(/\s*\(implicit\)$/,""):"";
   const meta=[(e.categories||[]).join(" · "),(e.muscles||[]).join(", "),eq].filter(Boolean).join(" · ");
   return `<button class="exercise-card exercise-card-compact" data-ex="${esc(e.name)}"><div class="exercise-card-copy"><strong>${esc(e.name)}</strong><small>${esc(meta)}</small></div><span class="exercise-card-chevron">›</span></button>`
 }).join("")||`<div class="card small">Keine Übung gefunden.</div>`;
 document.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>openExerciseDetail(b.dataset.ex));
 document.querySelectorAll("[data-type]").forEach(b=>b.onclick=()=>{const t=b.dataset.type;exType=(t!=="Alle"&&exType===t)?"Alle":t;renderExerciseLibrary()});
 document.querySelectorAll("[data-muscle]").forEach(b=>b.onclick=()=>{const m=b.dataset.muscle;if(m==="Alle")exMuscles.clear();else exMuscles.has(m)?exMuscles.delete(m):exMuscles.add(m);renderExerciseLibrary()})
}
$("exerciseSearch").oninput=renderExerciseLibrary;$("clearSearch").onclick=()=>{$("exerciseSearch").value="";$("exerciseSearch").dispatchEvent(new Event("input",{bubbles:true}));$("exerciseSearch").focus()};
const EXECUTION_GUIDE={"Back Lever":"Hänge mit gestreckten Armen an der Stange oder den Ringen, ziehe die Schulterblätter aktiv nach unten und bringe den Körper kontrolliert rückwärts in eine möglichst gerade, horizontale Linie. Spanne Gesäß und Bauch fest an, halte Hüfte und Knie gestreckt und vermeide ein Durchhängen im unteren Rücken. Halte die Position nur so lange, wie Schulterkontrolle und Körperspannung erhalten bleiben, und löse sie kontrolliert.","Dragon Flag":"Lege dich auf eine Bank, greife hinter dem Kopf fest und hebe Schulterblätter, Becken und Beine als gespannte Einheit an. Senke den gestreckten Körper langsam ab, ohne in der Hüfte einzuknicken oder den unteren Rücken unkontrolliert durchhängen zu lassen. Stoppe knapp vor dem Kontakt und ziehe den Körper aus der Rumpfspannung wieder hoch.","Front Lever":"Hänge im Obergriff, ziehe die Schulterblätter aktiv nach unten und hinten und kippe den gestreckten Körper nach hinten, bis Schulter, Hüfte und Füße möglichst eine horizontale Linie bilden. Halte Arme gestreckt, Rippen unten und Gesäß angespannt. Halte ohne Schwung und kehre kontrolliert in den Hang zurück.","Handstand":"Setze die Hände etwa schulterbreit auf, spreize die Finger und drücke aktiv aus den Schultern nach oben. Bringe Hüfte über Schultern und Hände und richte Beine und Rumpf zu einer langen Linie aus. Balanciere über Fingerdruck und Handballen, halte Bauch und Gesäß angespannt und steige kontrolliert wieder ab.","Handstand Push-Up":"Starte im stabilen Handstand mit aktiven Schultern und gespanntem Rumpf. Beuge die Ellbogen kontrolliert und senke den Kopf zwischen die Hände, ohne die Körperspannung zu verlieren. Drücke den Boden kräftig weg, bis die Arme wieder gestreckt sind.","Hanging Leg Raise":"Hänge stabil mit aktiven Schultern an der Stange. Kippe das Becken nach hinten und hebe die möglichst gestreckten Beine ohne Schwung bis mindestens Hüfthöhe beziehungsweise kontrolliert höher. Senke die Beine langsam ab, ohne ins Hohlkreuz oder Pendeln zu geraten.","Human Flag":"Greife die Stange mit versetzten Händen; die obere Hand zieht, die untere drückt. Spanne Rumpf und Gesäß an und hebe den Körper seitlich in eine möglichst gerade Linie. Halte Schultern aktiv und Hüfte gestreckt und senke kontrolliert ab, sobald die Linie nicht mehr gehalten werden kann.","L-Sit/V-Sit":"Stütze dich mit gestreckten Armen auf Parallettes oder Griffen ab und drücke die Schultern aktiv nach unten. Hebe die gestreckten Beine vor den Körper; für den V-Sit führst du sie weiter nach oben. Halte Knie gestreckt und Rumpf fest und setze die Füße kontrolliert wieder ab.","Muscle-Up":"Starte im aktiven Hang und ziehe dich explosiv mit der Brust zur Stange beziehungsweise zwischen die Ringe. Führe den Oberkörper zügig über die Hände in die Übergangsphase, ohne die Schultern kollabieren zu lassen. Drücke dich anschließend in den stabilen Stütz und kehre kontrolliert zurück.","Pistol Squat":"Stehe auf einem Bein und strecke das freie Bein nach vorn. Beuge Hüfte, Knie und Sprunggelenk des Standbeins kontrolliert, halte die Ferse am Boden und das Knie in Fußrichtung. Gehe so tief wie stabil möglich und drücke dich über den ganzen Fuß wieder hoch.","Planche":"Stütze dich mit gestreckten Armen auf Hände oder Parallettes und schiebe die Schultern deutlich vor die Hände. Runde den oberen Rücken leicht, spanne Bauch und Gesäß an und hebe die Füße vom Boden. Halte den Körper möglichst als feste Linie und beende die Position, bevor Ellbogen oder Schulterkontrolle nachgeben.","Planche Push-Up":"Starte in einer stabilen Planche mit Schultern vor den Händen und festem Rumpf. Beuge die Ellbogen und senke den Körper als Einheit, ohne die Hüfte absinken zu lassen. Drücke dich mit unveränderter Körperlinie wieder in den gestreckten Stütz.","Sissy Squat":"Stehe aufrecht, halte dich bei Bedarf leicht fest und gehe auf die Fußballen. Schiebe die Knie kontrolliert nach vorn, während Hüfte und Oberkörper möglichst gestreckt bleiben und der Körper nach hinten sinkt. Strecke die Knie aus der Vorderseite der Oberschenkel wieder, ohne Schwung zu nutzen.","AirBike":"Stelle den Sitz so ein, dass das Knie unten leicht gebeugt bleibt. Drücke und ziehe die Pedale gleichmäßig und bewege gleichzeitig die Griffe kraftvoll vor und zurück. Halte den Rumpf stabil und steuere die Intensität über Tritt- und Armfrequenz.","CrossTrainer":"Stelle die Füße vollständig auf die Pedale und halte den Oberkörper aufrecht. Führe Beine und bewegliche Griffe in einem gleichmäßigen, fließenden Rhythmus und vermeide seitliches Ausweichen. Passe Widerstand und Frequenz so an, dass die Bewegung ruhig bleibt.","Fahrradergometer":"Stelle den Sattel so ein, dass das Knie am tiefsten Pedalpunkt leicht gebeugt ist. Trete rund und gleichmäßig, halte Knie in Richtung der Füße und den Oberkörper ruhig. Reguliere Belastung über Widerstand und Trittfrequenz, ohne auf dem Sattel zu wippen.","Laufband":"Richte dich auf und lande mit dem Fuß möglichst unter dem Körperschwerpunkt statt weit davor. Halte Schritte gleichmäßig, Arme locker gebeugt und den Blick nach vorn. Passe Tempo und Steigung so an, dass du nicht am Geländer hängen oder die Schrittlänge erzwingen musst.","Ruderergometer":"Starte vorn mit gebeugten Knien, langen Armen und neutralem Rücken. Drücke zuerst kräftig über die Beine, öffne danach die Hüfte und ziehe zuletzt den Griff zum unteren Brustkorb. Auf dem Rückweg gehen zuerst Arme vor, dann kippt der Oberkörper und zuletzt beugen die Knie.","Seilspringen":"Halte Ellbogen nah am Körper und drehe das Seil hauptsächlich aus den Handgelenken. Springe nur so hoch wie nötig über den Fußballen und halte Knie und Hüfte weich. Lande leise und halte einen gleichmäßigen Rhythmus ohne große Armkreise.","Skiergometer":"Starte aufrecht mit hohen Griffen und leicht gebeugten Armen. Ziehe die Griffe durch eine kräftige Rumpf- und Hüftbeugung nach unten, während die Arme die Bewegung beenden. Richte dich kontrolliert wieder auf und führe die Griffe ohne ruckartiges Hochziehen zurück.","StairMaster":"Stelle den ganzen oder überwiegenden Fuß sicher auf die Stufe und halte den Oberkörper aufrecht. Steige gleichmäßig aus Hüfte und Bein, ohne dich dauerhaft auf den Handläufen abzustützen. Wähle eine Geschwindigkeit, bei der Knieachse und Schrittgröße kontrolliert bleiben.","Box Jump":"Starte in einer stabilen athletischen Position. Springe explosiv auf die Box und lande vollständig und leise auf der Oberfläche. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Broad Jump":"Starte in einer stabilen athletischen Position. Springe explosiv nach vorn und nutze die Arme zur Unterstützung. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Clean Pull":"Starte mit der Hantel dicht vor den Schienbeinen, Rücken neutral und Rumpf gespannt. Strecke Beine und Hüfte explosiv und halte die Hantel eng am Körper; ziehe die Schultern am Ende kraftvoll hoch, ohne die Hantel umzusetzen. Senke kontrolliert und setze neu an.","Countermovement Jump":"Starte in einer stabilen athletischen Position. Nutze eine kurze Gegenbewegung und strecke Hüfte, Knie und Sprunggelenk explosiv. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Depth Jump":"Starte in einer stabilen athletischen Position. Steige von der Box herunter, lande kurz und reaktiv und springe unmittelbar wieder explosiv ab. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Half Squat":"Stelle die Füße für Half Squat stabil und richte Knie und Fußspitzen in dieselbe Richtung. Beuge Hüfte und Knie kontrolliert und halte Rumpf sowie Fußsohle stabil. Drücke über den ganzen Fuß nach oben und strecke Hüfte und Knie gemeinsam, ohne die Knie hart durchzuschlagen.","Hang Power Clean":"Starte aus der Hangposition oberhalb der Knie, Rücken neutral und Rumpf gespannt. Beschleunige die Hantel durch explosive Streckung von Hüfte, Knie und Sprunggelenk eng am Körper nach oben. Ziehe dich unter die Hantel und fange sie stabil auf den vorderen Schultern ab, bevor du dich vollständig aufrichtest.","High Pull":"Starte mit der Hantel dicht vor den Schienbeinen und halte die Hantel eng am Körper. Strecke Hüfte, Knie und Sprunggelenke explosiv und führe anschließend die Ellbogen hoch und außen, sodass die Hantel bis etwa Brusthöhe steigt. Fange sie nicht auf, sondern senke kontrolliert zurück.","Jump Squat":"Starte in einer stabilen athletischen Position. Sinke kurz in die Kniebeuge und strecke Hüfte, Knie und Sprunggelenk explosiv zum Absprung. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Kettlebell Swing":"Stehe etwas breiter als hüftbreit und halte die Kettlebell mit beiden Händen. Schiebe die Hüfte nach hinten, lasse die Kugel dicht zwischen die Beine schwingen und strecke die Hüfte anschließend explosiv. Die Arme führen nur; lasse die Kettlebell durch den Hüftimpuls steigen und fange den Rückschwung wieder mit der Hüfte ab.","Landmine Push Press":"Halte die Last auf Schulterhöhe und stehe stabil. Beuge Knie und Hüfte kurz gerade nach unten und strecke die Beine anschließend explosiv, um die Last zu beschleunigen; drücke mit den Armen über Kopf nach. Stabilisiere oben mit gestreckten Armen und senke die Last kontrolliert.","Lateral Bound":"Starte in einer stabilen athletischen Position. Springe seitlich von einem Bein auf das andere und stabilisiere die Landung. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Loaded Jump Squat":"Starte in einer stabilen athletischen Position. Sinke kurz in die Kniebeuge und strecke Hüfte, Knie und Sprunggelenk explosiv zum Absprung. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Medicine Ball Chest Pass":"Halte den Medizinball stabil und richte Füße, Knie und Rumpf für Medicine Ball Chest Pass aus. Beschleunige den Ball explosiv aus Brusthöhe gerade nach vorn, wobei Beine, Hüfte und Rumpf die Bewegung einleiten. Fange beziehungsweise nimm den Ball erst wieder auf, wenn du stabil stehst, und setze jede Wiederholung neu an.","Medicine Ball Overhead Throw":"Halte den Medizinball stabil und richte Füße, Knie und Rumpf für Medicine Ball Overhead Throw aus. Beschleunige den Ball mit gestreckter Hüfte kraftvoll über Kopf nach vorn, wobei Beine, Hüfte und Rumpf die Bewegung einleiten. Fange beziehungsweise nimm den Ball erst wieder auf, wenn du stabil stehst, und setze jede Wiederholung neu an.","Medicine Ball Rotational Throw":"Halte den Medizinball stabil und richte Füße, Knie und Rumpf für Medicine Ball Rotational Throw aus. Beschleunige den Ball aus einer kontrollierten Rumpfrotation seitlich, wobei Beine, Hüfte und Rumpf die Bewegung einleiten. Fange beziehungsweise nimm den Ball erst wieder auf, wenn du stabil stehst, und setze jede Wiederholung neu an.","Medicine Ball Scoop Toss":"Halte den Medizinball stabil und richte Füße, Knie und Rumpf für Medicine Ball Scoop Toss aus. Beschleunige den Ball aus Hüfte und Beinen bogenförmig nach vorn/oben, wobei Beine, Hüfte und Rumpf die Bewegung einleiten. Fange beziehungsweise nimm den Ball erst wieder auf, wenn du stabil stehst, und setze jede Wiederholung neu an.","Medicine Ball Shot Put":"Halte den Medizinball stabil und richte Füße, Knie und Rumpf für Medicine Ball Shot Put aus. Beschleunige den Ball einarmig aus Schulter und Rumpfrotation nach vorn, wobei Beine, Hüfte und Rumpf die Bewegung einleiten. Fange beziehungsweise nimm den Ball erst wieder auf, wenn du stabil stehst, und setze jede Wiederholung neu an.","Medicine Ball Slam":"Halte den Medizinball stabil und richte Füße, Knie und Rumpf für Medicine Ball Slam aus. Beschleunige den Ball über Kopf anheben und kraftvoll vor dir auf den Boden, wobei Beine, Hüfte und Rumpf die Bewegung einleiten. Fange beziehungsweise nimm den Ball erst wieder auf, wenn du stabil stehst, und setze jede Wiederholung neu an.","Pogo Jump":"Starte in einer stabilen athletischen Position. Halte Knie relativ steif und springe reaktiv hauptsächlich aus den Sprunggelenken. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Power Clean":"Starte mit der Hantel dicht vor den Schienbeinen, Rücken neutral und Rumpf gespannt. Beschleunige die Hantel durch explosive Streckung von Hüfte, Knie und Sprunggelenk eng am Körper nach oben. Ziehe dich unter die Hantel und fange sie stabil auf den vorderen Schultern ab, bevor du dich vollständig aufrichtest.","Push Press":"Halte die Last auf Schulterhöhe und stehe stabil. Beuge Knie und Hüfte kurz gerade nach unten und strecke die Beine anschließend explosiv, um die Last zu beschleunigen; drücke mit den Armen über Kopf nach. Stabilisiere oben mit gestreckten Armen und senke die Last kontrolliert.","Repeated Broad Jump":"Starte in einer stabilen athletischen Position. Springe explosiv nach vorn und nutze die Arme zur Unterstützung. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Single-Leg Bound":"Starte in einer stabilen athletischen Position. Springe kontrolliert auf einem Bein nach vorn und stabilisiere jede Landung. Lande mit Knie und Fuß in gleicher Richtung, federe kontrolliert ab und richte dich vor der nächsten Wiederholung neu aus.","Butterfly Machine":"Stabilisiere bei Butterfly Machine Schulterblätter und Rumpf und halte die Ellbogen leicht gebeugt. Führe die Arme in einem weiten Bogen kontrolliert zusammen, ohne die Schultern nach vorn zu schieben. Öffne langsam zurück, bis eine kontrollierte Dehnung der Brust entsteht.","Cable Biceps Curl":"Richte dich für Cable Biceps Curl stabil aus und halte die Oberarme ruhig. Beuge die Ellbogen kontrolliert, bis der Bizeps deutlich verkürzt ist, ohne Schulter oder Oberkörper mitzuschwingen. Senke die Last langsam bis fast zur vollständigen Streckung zurück.","Cable Fly":"Stabilisiere bei Cable Fly Schulterblätter und Rumpf und halte die Ellbogen leicht gebeugt. Führe die Arme in einem weiten Bogen kontrolliert zusammen, ohne die Schultern nach vorn zu schieben. Öffne langsam zurück, bis eine kontrollierte Dehnung der Brust entsteht.","Cable Lateral Raise":"Stehe stabil und halte die Arme bei Cable Lateral Raise leicht gebeugt. Hebe die Arme seitlich kontrolliert bis ungefähr Schulterhöhe, ohne Schwung oder Hochziehen der Schultern. Senke langsam zurück und behalte Spannung bis zur Ausgangsposition.","Cable Row":"Richte dich für Cable Row ein und beginne mit langen Armen. Halte Wirbelsäule und Rumpf stabil. Ziehe die Ellbogen nach hinten und die Schulterblätter kontrolliert zusammen. Strecke die Arme langsam wieder, ohne die Last fallen oder den Oberkörper mitschwingen zu lassen.","Cable Shoulder Rotation":"Positioniere den Oberarm bei Cable Shoulder Rotation stabil am Körper beziehungsweise in der vorgesehenen Schulterposition. Drehe den Oberarm kontrolliert gegen den Widerstand, ohne Ellbogen oder Rumpf ausweichen zu lassen. Kehre langsam zurück und arbeite nur im schmerzfreien Bewegungsumfang.","Cable Triceps Extension":"Stabilisiere bei Cable Triceps Extension Schulter und Oberarm und halte den Rumpf ruhig. Strecke die Ellbogen kontrolliert gegen den Widerstand, ohne die Oberarme mitzubewegen. Kehre langsam in die gebeugte Ausgangsposition zurück.","Calf Machine":"Positioniere die Fußballen sicher auf der Auflage und halte Knie und Hüfte stabil. Drücke die Fersen kontrolliert maximal nach oben und halte kurz die Spannung in den Waden. Senke die Fersen langsam durch den verfügbaren Bewegungsumfang zurück.","Chest Press":"Positioniere dich für Chest Press stabil, ziehe die Schulterblätter nach hinten/unten und halte Füße beziehungsweise Rumpf fest. Senke die Last kontrolliert zur Brust, während Unterarme und Handgelenke möglichst übereinander bleiben. Drücke die Last kraftvoll zurück, ohne die Schultern nach vorn zu verlieren.","Chest Supported Row":"Richte dich für Chest Supported Row ein und beginne mit langen Armen. Halte Brust und Rumpf fest an der Auflage. Ziehe die Ellbogen nach hinten und die Schulterblätter kontrolliert zusammen. Strecke die Arme langsam wieder, ohne die Last fallen oder den Oberkörper mitschwingen zu lassen.","Crunch Machine":"Stelle Sitz und Polster so ein, dass du den Rumpf kontrolliert beugen kannst. Ziehe Rippen und Becken über die Bauchmuskulatur zueinander, ohne nur mit Armen oder Hüfte zu drücken. Kehre langsam in die aufrechte Ausgangsposition zurück.","Hip Abduction Machine":"Sitze stabil mit Becken und Rücken an der Lehne. Drücke die Knie kontrolliert nach außen gegen die Polster, ohne den Oberkörper mitzudrehen. Führe die Beine langsam wieder zusammen und halte die Spannung bis zur Ausgangsposition.","Hip Adduction Machine":"Sitze stabil mit Becken und Rücken an der Lehne. Führe die Beine kontrolliert gegen die Polster nach innen zusammen, ohne das Becken zu verdrehen. Öffne die Beine langsam wieder bis zu einer kontrollierten Dehnung.","Hip Thrust Machine":"Positioniere bei Hip Thrust Machine die Füße so, dass die Knie oben ungefähr über den Fersen stehen. Strecke die Hüfte über die Fersen, spanne das Gesäß an und halte Rippen und Becken kontrolliert, statt ins Hohlkreuz zu gehen. Senke die Hüfte langsam wieder ab.","Lat Pull-Down":"Setze dich stabil unter die Latzugstange und fixiere die Oberschenkel. Ziehe die Schulterblätter nach unten und führe die Ellbogen anschließend Richtung Rippen, bis die Stange kontrolliert zum oberen Brustbereich kommt. Strecke die Arme langsam wieder, ohne die Schultern unkontrolliert hochzuziehen.","Leg Curl":"Richte das Knie zur Maschinenachse aus und positioniere das Polster knapp oberhalb der Ferse. Beuge die Knie kontrolliert und ziehe das Polster Richtung Gesäß, ohne Hüfte oder Rücken auszuweichen. Strecke die Knie langsam wieder, ohne die Gewichte abfallen zu lassen.","Leg Extension":"Richte Kniegelenk und Drehachse der Maschine aus und fixiere den Oberkörper. Strecke die Knie kontrolliert gegen das Polster, ohne Schwung zu holen. Senke die Last langsam zurück, bis die Knie wieder deutlich gebeugt sind.","Leg Press":"Setze die Füße stabil auf die Plattform und halte Becken und Rücken an der Lehne. Senke die Plattform durch Beugen von Knie und Hüfte so weit, wie das Becken stabil bleibt und die Knie den Fußspitzen folgen. Drücke über den ganzen Fuß zurück, ohne die Knie hart durchzustrecken.","Reverse Fly":"Stabilisiere bei Reverse Fly Schulterblätter und Rumpf und halte die Ellbogen leicht gebeugt. Führe die Arme in einem weiten Bogen kontrolliert zusammen, ohne die Schultern nach vorn zu schieben. Öffne langsam zurück, bis eine kontrollierte Dehnung der Brust entsteht.","ATG Split Squat":"Stelle die Füße für ATG Split Squat stabil und richte Knie und Fußspitzen in dieselbe Richtung. Beuge Hüfte und Knie kontrolliert und halte Rumpf sowie Fußsohle stabil. Drücke über den ganzen Fuß nach oben und strecke Hüfte und Knie gemeinsam, ohne die Knie hart durchzuschlagen.","Barbell Bench Press":"Positioniere dich für Barbell Bench Press stabil, ziehe die Schulterblätter nach hinten/unten und halte Füße beziehungsweise Rumpf fest. Senke die Last kontrolliert zur Brust, während Unterarme und Handgelenke möglichst übereinander bleiben. Drücke die Last kraftvoll zurück, ohne die Schultern nach vorn zu verlieren.","Barbell Deadlift":"Spanne für Barbell Deadlift den Rumpf an und halte die Wirbelsäule neutral. Schiebe die Hüfte nach hinten und halte die Last beziehungsweise Hantel dicht am Körper, während die Knie nur so weit wie nötig beugen. Strecke die Hüfte kontrolliert wieder nach vorn, ohne ins Hohlkreuz zu überstrecken.","Barbell Good Morning":"Spanne für Barbell Good Morning den Rumpf an und halte die Wirbelsäule neutral. Schiebe die Hüfte nach hinten und halte die Last beziehungsweise Hantel dicht am Körper, während die Knie nur so weit wie nötig beugen. Strecke die Hüfte kontrolliert wieder nach vorn, ohne ins Hohlkreuz zu überstrecken.","Barbell Hip Thrust":"Positioniere bei Barbell Hip Thrust die Füße so, dass die Knie oben ungefähr über den Fersen stehen. Strecke die Hüfte über die Fersen, spanne das Gesäß an und halte Rippen und Becken kontrolliert, statt ins Hohlkreuz zu gehen. Senke die Hüfte langsam wieder ab.","Barbell Row":"Richte dich für Barbell Row ein und beginne mit langen Armen. Halte Wirbelsäule und Rumpf stabil. Ziehe die Ellbogen nach hinten und die Schulterblätter kontrolliert zusammen. Strecke die Arme langsam wieder, ohne die Last fallen oder den Oberkörper mitschwingen zu lassen.","Barbell Squat":"Stelle die Füße für Barbell Squat stabil und richte Knie und Fußspitzen in dieselbe Richtung. Beuge Hüfte und Knie kontrolliert und halte Rumpf sowie Fußsohle stabil. Drücke über den ganzen Fuß nach oben und strecke Hüfte und Knie gemeinsam, ohne die Knie hart durchzuschlagen.","Biceps Curl":"Richte dich für Biceps Curl stabil aus und halte die Oberarme ruhig. Beuge die Ellbogen kontrolliert, bis der Bizeps deutlich verkürzt ist, ohne Schulter oder Oberkörper mitzuschwingen. Senke die Last langsam bis fast zur vollständigen Streckung zurück.","Bulgarian Split Squat":"Stelle die Füße für Bulgarian Split Squat stabil und richte Knie und Fußspitzen in dieselbe Richtung. Beuge Hüfte und Knie kontrolliert und halte Rumpf sowie Fußsohle stabil. Drücke über den ganzen Fuß nach oben und strecke Hüfte und Knie gemeinsam, ohne die Knie hart durchzuschlagen.","Cable-Fly":"Stabilisiere bei Cable-Fly Schulterblätter und Rumpf und halte die Ellbogen leicht gebeugt. Führe die Arme in einem weiten Bogen kontrolliert zusammen, ohne die Schultern nach vorn zu schieben. Öffne langsam zurück, bis eine kontrollierte Dehnung der Brust entsteht.","Dumbbell Bench Press":"Positioniere dich für Dumbbell Bench Press stabil, ziehe die Schulterblätter nach hinten/unten und halte Füße beziehungsweise Rumpf fest. Senke die Last kontrolliert zur Brust, während Unterarme und Handgelenke möglichst übereinander bleiben. Drücke die Last kraftvoll zurück, ohne die Schultern nach vorn zu verlieren.","Dumbbell Fly":"Stabilisiere bei Dumbbell Fly Schulterblätter und Rumpf und halte die Ellbogen leicht gebeugt. Führe die Arme in einem weiten Bogen kontrolliert zusammen, ohne die Schultern nach vorn zu schieben. Öffne langsam zurück, bis eine kontrollierte Dehnung der Brust entsteht.","Dumbbell Lateral Raise":"Stehe stabil und halte die Arme bei Dumbbell Lateral Raise leicht gebeugt. Hebe die Arme seitlich kontrolliert bis ungefähr Schulterhöhe, ohne Schwung oder Hochziehen der Schultern. Senke langsam zurück und behalte Spannung bis zur Ausgangsposition.","Dumbbell Row":"Richte dich für Dumbbell Row ein und beginne mit langen Armen. Halte Wirbelsäule und Rumpf stabil. Ziehe die Ellbogen nach hinten und die Schulterblätter kontrolliert zusammen. Strecke die Arme langsam wieder, ohne die Last fallen oder den Oberkörper mitschwingen zu lassen.","Dumbbell Shoulder Rotation":"Positioniere den Oberarm bei Dumbbell Shoulder Rotation stabil am Körper beziehungsweise in der vorgesehenen Schulterposition. Drehe den Oberarm kontrolliert gegen den Widerstand, ohne Ellbogen oder Rumpf ausweichen zu lassen. Kehre langsam zurück und arbeite nur im schmerzfreien Bewegungsumfang.","Face-Pull":"Ziehe das Seil auf Gesichts- bis Stirnhöhe und führe die Hände dabei auseinander. Halte Brustkorb und Rumpf ruhig und drehe die Oberarme kontrolliert nach außen, sodass die Schulterblätter nach hinten arbeiten. Strecke die Arme langsam wieder nach vorn, ohne die Schultern hochzuziehen.","Front Squat":"Stelle die Füße für Front Squat stabil und richte Knie und Fußspitzen in dieselbe Richtung. Beuge Hüfte und Knie kontrolliert und halte Rumpf sowie Fußsohle stabil. Drücke über den ganzen Fuß nach oben und strecke Hüfte und Knie gemeinsam, ohne die Knie hart durchzuschlagen.","Goblet Squat":"Stelle die Füße für Goblet Squat stabil und richte Knie und Fußspitzen in dieselbe Richtung. Beuge Hüfte und Knie kontrolliert und halte Rumpf sowie Fußsohle stabil. Drücke über den ganzen Fuß nach oben und strecke Hüfte und Knie gemeinsam, ohne die Knie hart durchzuschlagen.","Landmine Rotation":"Halte das Ende der Landmine mit beiden Händen vor dem Körper und stehe stabil. Führe die Hantel in einem kontrollierten Bogen von einer Seite zur anderen und drehe dabei Brustkorb und Hüfte koordiniert. Halte die Arme relativ lang und vermeide ein unkontrolliertes Verdrehen des unteren Rückens.","Paloff Press":"Stelle dich seitlich zum Kabelzug und halte den Griff vor der Brust. Spanne Rumpf und Gesäß an und drücke die Hände gerade nach vorn, ohne dich zum Zug zu drehen. Führe die Hände langsam zur Brust zurück und halte Becken und Brustkorb die ganze Zeit gerade.","Prone Arm Circles":"Lege dich bäuchlings hin, spanne Gesäß und Rumpf leicht an und hebe die Arme knapp vom Boden. Führe die gestreckten Arme langsam in einem weiten Kreis von über Kopf Richtung Hüfte und wieder zurück. Halte die Schultern weg von den Ohren und vermeide Schwung.","Pull-Over":"Lege dich stabil auf die Bank und halte die Last über der Brust. Führe die Arme mit leicht gebeugten Ellbogen kontrolliert hinter den Kopf, ohne die Rippen stark anzuheben oder ins Hohlkreuz zu gehen. Ziehe die Last in einem Bogen wieder über die Brust.","Romanian Deadlift":"Spanne für Romanian Deadlift den Rumpf an und halte die Wirbelsäule neutral. Schiebe die Hüfte nach hinten und halte die Last beziehungsweise Hantel dicht am Körper, während die Knie nur so weit wie nötig beugen. Strecke die Hüfte kontrolliert wieder nach vorn, ohne ins Hohlkreuz zu überstrecken.","Seated Dumbbell Shoulder Press":"Richte dich für Seated Dumbbell Shoulder Press stabil aus und spanne den Rumpf an. Drücke die Gewichte von Schulterhöhe kontrolliert über Kopf, ohne Rippen stark anzuheben oder ins Hohlkreuz auszuweichen. Senke sie langsam zurück auf Schulterhöhe.","Standing Shoulder Press":"Richte dich für Standing Shoulder Press stabil aus und spanne den Rumpf an. Drücke die Gewichte von Schulterhöhe kontrolliert über Kopf, ohne Rippen stark anzuheben oder ins Hohlkreuz auszuweichen. Senke sie langsam zurück auf Schulterhöhe.","Suitcase Carry":"Halte eine schwere Last einseitig neben dem Körper und richte dich auf. Gehe mit ruhigen, gleichmäßigen Schritten, ohne zur belasteten oder unbelasteten Seite zu kippen. Halte Schulter, Rippen und Becken möglichst waagerecht und setze die Last kontrolliert ab.","T-Bar Row":"Richte dich für T-Bar Row ein und beginne mit langen Armen. Halte Wirbelsäule und Rumpf stabil. Ziehe die Ellbogen nach hinten und die Schulterblätter kontrolliert zusammen. Strecke die Arme langsam wieder, ohne die Last fallen oder den Oberkörper mitschwingen zu lassen.","Tibialis Raise":"Lehne dich stabil an beziehungsweise stehe aufrecht und halte die Fersen am Boden. Ziehe die Fußspitzen so weit wie möglich Richtung Schienbein, ohne Knie oder Hüfte mitzubewegen. Senke die Füße langsam wieder ab und wiederhole aus dem Sprunggelenk.","Triceps Extension":"Stabilisiere bei Triceps Extension Schulter und Oberarm und halte den Rumpf ruhig. Strecke die Ellbogen kontrolliert gegen den Widerstand, ohne die Oberarme mitzubewegen. Kehre langsam in die gebeugte Ausgangsposition zurück.","Ab Wheel":"Knie vor dem Ab-Wheel und spanne Bauch und Gesäß an. Rolle das Rad langsam nach vorn, während Rippen und Becken kontrolliert bleiben und der untere Rücken nicht durchhängt. Ziehe das Rad aus der Rumpfspannung wieder zurück.","Bird Dog":"Starte im Vierfüßlerstand mit neutralem Rücken. Strecke einen Arm und das gegenüberliegende Bein, ohne Becken oder Brustkorb zu verdrehen. Halte kurz die lange Linie und führe beide kontrolliert zurück, bevor du die Seite wechselst.","Chin-Up":"Greife die Stange im Untergriff und starte im aktiven Hang. Ziehe die Schulterblätter nach unten und führe die Ellbogen Richtung Rippen, bis das Kinn kontrolliert über Stangenhöhe kommt. Senke dich langsam bis in die gestreckte Position zurück, ohne zu schwingen.","Clamshell":"Lege dich auf die Seite, Hüfte und Knie gebeugt und Füße übereinander. Halte das Becken ruhig und öffne das obere Knie, ohne nach hinten zu rollen oder die Füße zu trennen. Senke das Knie kontrolliert wieder ab.","Curtsy Lunge":"Nimm für Curtsy Lunge einen stabilen Schrittstand ein und halte Becken und Rumpf gerade. Senke den Körper durch Beugen beider Beine, wobei das vordere Knie der Fußrichtung folgt und die Ferse belastet bleibt. Drücke dich über den vorderen Fuß kontrolliert zurück in die Ausgangsposition.","Dip":"Stütze dich mit gestreckten Armen auf den Holmen ab und halte die Schultern aktiv. Beuge die Ellbogen und senke den Körper kontrolliert, bis Schulter und Brust einen schmerzfreien Bewegungsumfang erreichen. Drücke dich wieder hoch, ohne die Schultern nach vorn kollabieren zu lassen.","Glute Bridge":"Lege dich auf den Rücken, stelle die Füße hüftbreit auf und halte die Rippen kontrolliert. Drücke über die Fersen und strecke die Hüfte, bis Schulter, Hüfte und Knie eine Linie bilden. Spanne oben das Gesäß an und senke das Becken langsam zurück.","Hollow Body Hold":"Lege dich auf den Rücken und drücke den unteren Rücken aktiv Richtung Boden. Hebe Schulterblätter und Beine an und strecke Arme und Beine nur so weit, wie der Lendenbereich Kontakt behält. Atme ruhig und verkürze den Hebel, sobald der Rücken abhebt.","Hyperextensions":"Positioniere die Hüfte an der Polsterkante und fixiere die Füße. Senke den Oberkörper kontrolliert aus der Hüfte bei neutralem Rücken. Strecke die Hüfte wieder, bis der Körper eine gerade Linie bildet, ohne den unteren Rücken zu überstrecken.","Lunge":"Nimm für Lunge einen stabilen Schrittstand ein und halte Becken und Rumpf gerade. Senke den Körper durch Beugen beider Beine, wobei das vordere Knie der Fußrichtung folgt und die Ferse belastet bleibt. Drücke dich über den vorderen Fuß kontrolliert zurück in die Ausgangsposition.","Nordic Hamstring Curl":"Knie auf einer weichen Unterlage und fixiere die Fersen sicher. Halte Hüfte gestreckt und senke den Körper als gerade Linie aus den Knien langsam nach vorn. Bremse so lange wie möglich mit der Beinrückseite und fange dich bei Bedarf mit den Händen ab, bevor du kontrolliert zurückkehrst.","Plank":"Stütze dich auf Unterarme und Zehen und richte Ellbogen unter den Schultern aus. Spanne Bauch und Gesäß an und halte Kopf, Brustkorb, Becken und Beine in einer Linie. Atme ruhig weiter und beende den Satz, sobald die Hüfte deutlich absinkt oder hochwandert.","Pull-Up":"Greife die Stange im Obergriff und starte im aktiven Hang. Ziehe die Schulterblätter nach unten und führe die Ellbogen Richtung Rippen, bis das Kinn kontrolliert über Stangenhöhe kommt. Senke dich langsam bis in die gestreckte Position zurück, ohne zu schwingen.","Push-Up":"Setze die Hände etwa schulterbreit auf und halte den Körper von Kopf bis Ferse als gespannte Linie. Beuge die Ellbogen kontrolliert und senke die Brust Richtung Boden, ohne Hüfte oder unteren Rücken durchhängen zu lassen. Drücke den Boden weg, bis die Arme wieder gestreckt sind.","Reverse Lunge":"Nimm für Reverse Lunge einen stabilen Schrittstand ein und halte Becken und Rumpf gerade. Senke den Körper durch Beugen beider Beine, wobei das vordere Knie der Fußrichtung folgt und die Ferse belastet bleibt. Drücke dich über den vorderen Fuß kontrolliert zurück in die Ausgangsposition.","Reverse Nordics":"Knie aufrecht mit gestreckter Hüfte und angespanntem Gesäß. Lehne den gesamten Körper von den Knien aus kontrolliert nach hinten, ohne in der Hüfte einzuknicken. Ziehe dich über die Vorderseite der Oberschenkel wieder in die aufrechte Position.","Side Plank":"Stütze dich seitlich auf Unterarm und Fußkante, Ellbogen unter der Schulter. Hebe das Becken, bis Kopf, Rumpf und Beine eine Linie bilden, und halte Schulter und Becken übereinander. Atme ruhig und senke kontrolliert ab.","Step-Down":"Stehe auf einer niedrigen Box auf einem Bein und halte Becken und Rumpf stabil. Beuge das Standbein langsam und senke die freie Ferse kontrolliert Richtung Boden, während das Knie in Fußrichtung bleibt. Drücke dich über den Standfuß wieder hoch.","Step-Up":"Stelle den ganzen Fuß auf eine stabile Box oder Bank. Drücke dich überwiegend über das obere Bein hoch, bis Hüfte und Knie gestreckt sind, ohne dich stark mit dem hinteren Fuß abzustoßen. Senke dich kontrolliert wieder ab und halte das Knie in Fußrichtung.","90/90 Hip Switch":"Sitze mit beiden Knien gebeugt in einer 90/90-Position. Drehe beide Knie kontrolliert zur Gegenseite, ohne die Füße weit zu versetzen oder die Bewegung mit Schwung zu erzwingen. Richte den Oberkörper jeweils über der neuen Hüftposition auf und wechsle langsam zurück.","Ankle Dorsiflexion Mobilization":"Stelle einen Fuß flach vor dich und halte die Ferse fest am Boden. Schiebe das Knie langsam in Richtung der Zehen beziehungsweise leicht darüber, ohne dass das Fußgewölbe kollabiert. Gehe nur bis zu einer kontrollierten Dehnung im Sprunggelenk und kehre wieder zurück.","Cat-Cow":"Komme in den Vierfüßlerstand mit Händen unter den Schultern und Knien unter der Hüfte. Runde die Wirbelsäule langsam vom Becken bis zum oberen Rücken und wechsle anschließend kontrolliert in die Gegenbewegung. Kopple die Bewegung ruhig an die Atmung und erzwinge keine Endposition.","Couch Stretch":"Positioniere ein Knie nahe an Wand oder Bank und den Fuß nach oben, das andere Bein steht vorn. Richte Becken und Oberkörper auf und spanne das Gesäß der hinteren Seite leicht an. Verschiebe die Hüfte nur so weit nach vorn, bis eine deutliche, aber kontrollierte Dehnung an Hüftbeuger und Oberschenkel entsteht.","Deep Squat Hold":"Stelle die Füße stabil etwas breiter als hüftbreit und sinke in eine tiefe Kniebeuge. Halte Fersen belastet, Knie in Fußrichtung und Brustkorb aufgerichtet. Atme ruhig und nutze bei Bedarf die Ellbogen sanft gegen die Knie, ohne die Position zu erzwingen.","Open Book Rotation":"Lege dich auf die Seite, Hüfte und Knie gebeugt, beide Arme nach vorn gestreckt. Öffne den oberen Arm in einem weiten Bogen zur Gegenseite und lasse Brustkorb und Blick folgen, während die Knie zusammenbleiben. Kehre langsam zurück und bewege nur im schmerzfreien Bereich.","Shoulder CARs":"Stehe aufrecht und halte Rumpf und Rippen ruhig. Führe einen gestreckten Arm langsam in einem möglichst großen kontrollierten Kreis über Kopf nach hinten und wieder nach vorn. Drehe den Oberarm passend mit und vermeide Ausweichbewegungen der Wirbelsäule.","Thoracic Rotation":"Nimm einen stabilen Vierfüßler- oder Kniestand ein und fixiere Becken und unteren Rücken. Drehe den Brustkorb kontrolliert zur Seite, indem du Arm und Blick mitführst. Kehre langsam zur Mitte zurück und erzeuge die Bewegung vor allem aus der Brustwirbelsäule.","Wall Shoulder Flexion":"Stehe mit Rücken und Rippen kontrolliert an der Wand und halte den Bauch leicht angespannt. Führe die Arme gestreckt nach oben, ohne ins Hohlkreuz auszuweichen oder die Schultern hochzuziehen. Gehe nur so weit, wie Rückenposition und Schulterbewegung sauber bleiben.","Wrist CARs":"Halte Unterarm und Ellbogen ruhig und forme eine lockere Faust. Bewege das Handgelenk langsam durch einen möglichst großen Kreis aus Beugung, Seitbewegung und Streckung. Vermeide schnelle Bewegungen und halte den Unterarm während des gesamten Kreises stabil."};
function executionText(e){
 if(EXECUTION_GUIDE[e.name])return EXECUTION_GUIDE[e.name];
 return `Richte die Ausgangsposition für ${e.name} stabil ein. Führe die Bewegung kontrolliert und ohne Schwung im schmerzfreien Bewegungsumfang aus. Halte Rumpf und Gelenke stabil und kehre kontrolliert in die Ausgangsposition zurück.`;
}
function openExerciseDetail(name,{onAdd=null}={}){
 const e=findExercise(name);currentExercise=e;$("exerciseDetailTitle").textContent=e.name;
 $("exerciseDetailActions").innerHTML=onAdd?'<button id="detailAddBtn" class="icon-btn plus-btn">+</button>':"";
 const variantHtml=(e.variants||[]).length?`<div class="detail-section"><label>VARIANTEN</label><div class="detail-chip-row">${e.variants.map(v=>`<span class="detail-chip">${esc(v)}</span>`).join("")}</div></div>`:"";
 const equipmentHtml=(e.equipment||[]).length?`<div class="detail-section"><label>HILFSMITTEL / GERÄT</label><div class="detail-chip-row">${e.equipment.map(v=>`<span class="detail-chip">${esc(v)}</span>`).join("")}</div></div>`:"";
 $("exerciseDetailBody").innerHTML=`<div class="detail-section"><label>TRAININGSART</label><strong>${esc(e.category||e.categories?.[0]||"—")}</strong></div><div class="detail-section"><label>BEREICHE</label><strong>${esc((e.muscles||[]).join(", ")||"—")}</strong></div>${variantHtml}${equipmentHtml}<div class="detail-copy"><h2>Ausführung</h2><p>${esc(e.execution||"")}</p></div>`;
 openPage("exerciseDetailPage",()=>{if(onAdd)$("detailAddBtn").onclick=()=>{closePage();requestAnimationFrame(()=>onAdd(name))}})
}
$("exerciseDetailPage").querySelector("[data-back]").onclick=(ev)=>{
 if(exerciseDetailReturn?.type==="live"&&activeWorkout){
   ev?.stopPropagation?.();const idx=Number(exerciseDetailReturn.index)||0;exerciseDetailReturn=null;
   closePage();requestAnimationFrame(()=>focusLiveExercise(idx,"auto"));return
 }
 if(exerciseDetailReturn){
   ev?.stopPropagation?.();const snap=exerciseDetailReturn.snapshot;exerciseDetailReturn=null;
   const current=document.querySelector(".page:not(.hidden)");if(current)current.classList.add("hidden");
   const p=pageStack.pop();if(p?.page){$(p.page).classList.remove("hidden");$("bottomNav").classList.add("hidden")}
   else{$("bottomNav").classList.remove("hidden");showTab(p?.tab||currentTab)}
   if(snap)renderSheetState(snap);return
 }
 ev?.stopPropagation?.();closePage()
};
$("newExerciseBtn").onclick=()=>openNewExerciseSheet();
function customExerciseForm(existing=null){const types=["Gewichte","Körpergewicht","Calisthenics","Geräte","Explosivität","Cardio"],muscles=["Brust","Rücken","Schulter","Arme/Hände","Beine","Core","Athletik"],selected=new Set(existing?.muscles||[]);return{html:`<div class="form-field"><label>Name</label><input id="ceName" class="field" value="${esc(existing?.name||"")}"></div><div class="form-field"><label>Trainingsart</label><select id="ceType" class="field">${types.map(x=>`<option ${existing?.category===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="form-field"><label>Tracking</label><select id="ceTracking" class="field"><option value="reps" ${existing?.tracking!=="time"?"selected":""}>Wiederholungen</option><option value="time" ${existing?.tracking==="time"?"selected":""}>Zeit</option></select></div><div class="form-field"><label>Muskelgruppen / Bereiche</label><div class="chips" style="flex-wrap:wrap;overflow:visible">${muscles.map(x=>`<button type="button" class="chip ${selected.has(x)?"active":""}" data-ce-muscle="${x}">${x}</button>`).join("")}</div></div>`,selected}}
function bindCustomMuscles(selected){document.querySelectorAll("[data-ce-muscle]").forEach(b=>b.onclick=()=>{selected.has(b.dataset.ceMuscle)?selected.delete(b.dataset.ceMuscle):selected.add(b.dataset.ceMuscle);b.classList.toggle("active",selected.has(b.dataset.ceMuscle))})}
function saveCustomExerciseForm(index,selected){const name=$("ceName").value.trim();if(!name)return alert("Bitte Namen eingeben.");if(!selected.size)return alert("Bitte mindestens einen Bereich wählen.");const e={name,category:$("ceType").value,subcategory:[...selected][0],muscles:[...selected],tracking:$("ceTracking").value,custom:true};if(index==null)customExercises.push(e);else customExercises[index]=e;saveAll();closeSheet({all:true});renderExerciseLibrary();if(index==null)openExerciseDetail(name);else toast("Übung aktualisiert")}
function openNewExerciseSheet(){const f=customExerciseForm();openSheet("Eigene Übung",`${f.html}<button id="saveCustomExercise" class="primary" style="width:100%">Übung speichern</button>`);bindCustomMuscles(f.selected);$("saveCustomExercise").onclick=()=>saveCustomExerciseForm(null,f.selected)}
function openEditCustomExercise(name){const idx=customExercises.findIndex(x=>(typeof x==="string"?x:x.name)===name);if(idx<0)return;const existing=normEx(typeof customExercises[idx]==="string"?{name:customExercises[idx],custom:true}:customExercises[idx]),f=customExerciseForm(existing);openSheet("Eigene Übung bearbeiten",`${f.html}<button id="saveCustomExercise" class="primary" style="width:100%">Änderungen speichern</button>`);bindCustomMuscles(f.selected);$("saveCustomExercise").onclick=()=>saveCustomExerciseForm(idx,f.selected)}
function countPlanSets(p){return(p.exercises||[]).reduce((n,e)=>n+(Number(e.sets)||0),0)}
function planLastUsedAt(p){
 let t=Number(p.lastUsedAt)||0;
 history.forEach(w=>{if(String(w.planId||"")===String(p.id)||(!w.planId&&(w.planName===p.name||w.name===p.name)))t=Math.max(t,Number(w.finishedAt||w.startedAt||0))});
 if(activeWorkout&&(String(activeWorkout.planId||"")===String(p.id)||activeWorkout.planName===p.name))t=Math.max(t,Number(activeWorkout.startedAt||0));
 return t
}
function sortedPlans(){const a=[...plans];a.sort((x,y)=>{if(planSort.key==="name")return planSort.dir*x.name.localeCompare(y.name,"de");if(planSort.key==="used"){const xv=planLastUsedAt(x),yv=planLastUsedAt(y);if(xv!==yv)return planSort.dir*(xv-yv);return x.name.localeCompare(y.name,"de")}const k=planSort.key==="created"?"createdAt":"updatedAt";return planSort.dir*((x[k]||0)-(y[k]||0))});return a}
let plansQuickEdit=false;
function renderPlans(){const defs=[["name","A–Z"],["created","Hinzugefügt"],["updated","Geändert"],["used","Genutzt"]];$("planSortChips").innerHTML=defs.map(([k,l])=>`<button class="chip ${planSort.key===k?"active":""}" data-sort="${k}">${l}${planSort.key===k?(planSort.dir>0?" ↑":" ↓"):""}</button>`).join("");document.querySelectorAll("[data-sort]").forEach(b=>b.onclick=()=>{if(planSort.key===b.dataset.sort)planSort.dir*=-1;else{planSort.key=b.dataset.sort;planSort.dir=1}savePlanSort();renderPlans()});$("planList").classList.toggle("quick-edit",plansQuickEdit);
 $("plansEditBtn").textContent=plansQuickEdit?"Fertig":"Bearbeiten";
 $("planList").innerHTML=sortedPlans().map(p=>`<div class="plan-card ${plansQuickEdit?"plan-quick-edit":""}" data-plan="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span class="chev">›</span>${plansQuickEdit?`<button class="plan-quick-delete" data-quick-delete="${p.id}" aria-label="${esc(p.name)} löschen">−</button>`:`<button class="plan-swipe-delete" data-swipe-delete="${p.id}">Löschen</button>`}</div>`).join("");document.querySelectorAll("[data-plan]").forEach(card=>{const id=Number(card.dataset.plan);let timer,startX=0,startY=0,dx=0,dy=0,longFired=false;const cancelHold=()=>{clearTimeout(timer);timer=null};card.onclick=e=>{if(plansQuickEdit||e.target.closest("[data-swipe-delete],[data-quick-delete]")||longFired)return;editPlan(id)};card.oncontextmenu=e=>e.preventDefault();card.onpointerdown=e=>{startX=e.clientX;startY=e.clientY;dx=0;dy=0;longFired=false;card.classList.add("hold-armed");cancelHold();timer=setTimeout(()=>{longFired=true;card.classList.add("hold-ready");setTimeout(()=>{card.classList.remove("hold-armed","hold-ready");openPlanLongActions(id)},120)},700)};card.onpointermove=e=>{dx=e.clientX-startX;dy=e.clientY-startY;if(Math.abs(dx)>12||Math.abs(dy)>12)cancelHold()};card.onpointerup=()=>{cancelHold();card.classList.remove("hold-armed","hold-ready");if(!longFired){if(dx<-45){closeAllSwipeActions(card);card.classList.add("swipe-open")}else if(dx>25)card.classList.remove("swipe-open")}};card.onpointercancel=()=>{cancelHold();card.classList.remove("hold-armed","hold-ready")};card.onpointerleave=()=>{cancelHold();card.classList.remove("hold-armed","hold-ready")}});document.querySelectorAll("[data-swipe-delete]").forEach(b=>b.onclick=e=>{e.stopPropagation();deletePlanAsked(Number(b.dataset.swipeDelete))});
 document.querySelectorAll("[data-quick-delete]").forEach(b=>b.onclick=e=>{e.stopPropagation();const id=Number(b.dataset.quickDelete);plans=plans.filter(x=>x.id!==id);saveAll();renderPlans();renderWeek()})
}
$("plansEditBtn").onclick=()=>{plansQuickEdit=!plansQuickEdit;renderPlans()};
function closeAllSwipeActions(except=null){document.querySelectorAll(".swipe-open").forEach(x=>{if(x!==except)x.classList.remove("swipe-open")})}
document.addEventListener("pointerdown",e=>{const card=e.target.closest(".swipe-open");if(!card)closeAllSwipeActions()},{passive:true});
document.addEventListener("scroll",()=>closeAllSwipeActions(),true);
document.addEventListener("touchstart",e=>{if(!e.target.closest(".swipe-open"))closeAllSwipeActions()},{passive:true});

function deletePlanAsked(id){const p=plans.find(x=>x.id===id);if(p&&confirm(`„${p.name}“ wirklich löschen?`)){plans=plans.filter(x=>x.id!==id);saveAll();renderPlans();renderWeek()}}
function openPlanLongActions(id){const p=plans.find(x=>x.id===id);if(!p)return;openSheet(p.name,`<button id="duplicatePlanBtn" class="secondary" style="width:100%">Duplizieren</button><button id="deletePlanBtn" class="secondary danger" style="width:100%;margin-top:8px">Löschen</button>`);$("duplicatePlanBtn").onclick=()=>{plans.push({...clone(p),id:uid(),name:p.name+" Kopie",createdAt:Date.now(),updatedAt:Date.now()});saveAll();closeSheet({all:true});renderPlans()};$("deletePlanBtn").onclick=()=>{closeSheet({all:true});deletePlanAsked(id)}}
$("newPlanBtn").onclick=()=>{currentPlan={id:uid(),name:"",createdAt:Date.now(),updatedAt:Date.now(),exercises:[],_isNew:true};setEditorBaseline();openPlanEditor()};
function planBaseName(name){
 return String(name||"Trainingsplan").replace(/\s+\d+$/,"").trim()||"Trainingsplan"
}
function nextPlanVersionName(name){
 const base=planBaseName(name),nums=plans.map(p=>{const m=String(p.name||"").match(new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s+(\\d+)$`));return m?Number(m[1]):String(p.name||"")===base?1:0});
 const max=Math.max(1,...nums);return `${base} ${max+1}`
}
function isExistingPlanEditor(){return !!currentPlan?._editingSourceId}
function editPlan(id){
 const src=plans.find(p=>p.id===id);if(!src)return;
 currentPlan=clone(src);currentPlan._editingSourceId=src.id;currentPlan._originalName=src.name;
 // Keep editor familiar; the numbered name is assigned only if changes are explicitly saved.
 setEditorBaseline();openPlanEditor()
}
function openPlanEditor(){$("planName").value=currentPlan.name||"";renderEditorExercises();openPage("planEditorPage")}
$("planEditorBack").onclick=()=>{
 if(!editorHasChanges()){closePage();return}
 openSheet("Planbearbeitung verlassen?",`<p class="muted">Du hast Änderungen vorgenommen.</p><div class="save-choice-stack"><button id="backSavePlan" class="primary">Änderungen speichern</button><button id="discardPlanChanges" class="secondary danger">Plan verwerfen</button><button id="stayInPlan" class="secondary">Weiter bearbeiten</button></div>`);
 $("discardPlanChanges").onclick=()=>{closeSheet({all:true});editorDirty=false;closePage()};$("stayInPlan").onclick=()=>closeSheet({all:true});$("backSavePlan").onclick=()=>{closeSheet({all:true});if(currentPlan._editingSourceId)askExistingPlanSave(()=>{editorDirty=false;closePage();renderPlans()});else if(saveCurrentPlan()){editorDirty=false;closePage();renderPlans()}}
};$("planName").addEventListener("input",()=>{if(currentPlan){currentPlan.name=$("planName").value;markEditorDirty()}});

function planStructureSnapshot(p){const x=clone(p||{});delete x.name;delete x.updatedAt;delete x.lastUsedAt;delete x._editingSourceId;delete x._originalName;delete x._isNew;delete x.id;delete x.createdAt;delete x.sourcePlanId;return JSON.stringify(x)}
function editorOnlyRenamed(){if(!currentPlan?._editingSourceId)return false;const src=plans.find(p=>p.id===currentPlan._editingSourceId);return !!src&&planStructureSnapshot(src)===planStructureSnapshot(currentPlan)&&String(src.name)!==String($("planName").value.trim())}
function overwriteCurrentPlan(){const entered=$("planName").value.trim();if(!entered)return alert("Bitte Planname eingeben.");const src=plans.find(p=>p.id===currentPlan._editingSourceId);if(!src)return null;const saved=clone(currentPlan);saved.id=src.id;saved.name=entered;saved.createdAt=src.createdAt;saved.updatedAt=Date.now();delete saved._editingSourceId;delete saved._originalName;delete saved._isNew;plans=plans.map(p=>p.id===src.id?clone(saved):p);currentPlan=clone(saved);saveAll();setEditorBaseline();return saved}
function savePlanAsNew(){const entered=$("planName").value.trim();if(!entered)return alert("Bitte Planname eingeben.");if(!(currentPlan.exercises||[]).length)return alert("Ein Trainingsplan braucht mindestens eine Übung.");const saved=clone(currentPlan);saved.id=uid();saved.name=nextPlanVersionName(currentPlan._originalName||entered);saved.createdAt=Date.now();saved.updatedAt=Date.now();saved.sourcePlanId=currentPlan._editingSourceId||currentPlan.id;delete saved._editingSourceId;delete saved._originalName;delete saved._isNew;plans.push(clone(saved));currentPlan=clone(saved);saveAll();setEditorBaseline();return saved}
function askExistingPlanSave(after){if(editorOnlyRenamed()){overwriteCurrentPlan();after?.();return}openSheet("Planänderungen speichern?",`<p class="muted">Möchtest du den bisherigen Plan überschreiben oder die Bearbeitung als neuen Plan speichern?</p><div class="save-choice-stack"><button id="overwritePlan" class="primary">Alten Plan überschreiben</button><button id="newPlanVersion" class="secondary">Neuen Plan erstellen</button><button id="cancelPlanSave" class="secondary">Abbrechen</button></div>`);$("overwritePlan").onclick=()=>{if(overwriteCurrentPlan()){closeSheet({all:true});after?.()}};$("newPlanVersion").onclick=()=>{if(savePlanAsNew()){closeSheet({all:true});after?.()}};$("cancelPlanSave").onclick=()=>closeSheet({all:true})}
function saveCurrentPlan(){
 const entered=$("planName").value.trim();if(!entered)return alert("Bitte Planname eingeben.");
 if(!(currentPlan.exercises||[]).length){alert("Ein Trainingsplan braucht mindestens eine Übung.");return null}
 let saved=clone(currentPlan);
 if(currentPlan._editingSourceId){
  saved.id=uid();saved.name=nextPlanVersionName(currentPlan._originalName||entered);saved.createdAt=Date.now();saved.updatedAt=Date.now();saved.sourcePlanId=currentPlan._editingSourceId;
  delete saved._editingSourceId;delete saved._originalName;delete saved._isNew;
  plans.push(clone(saved))
 }else{
  saved.name=entered;saved.updatedAt=Date.now();delete saved._isNew;delete saved._editingSourceId;delete saved._originalName;
  plans.push(clone(saved))
 }
 currentPlan=clone(saved);saveAll();setEditorBaseline();return saved
}
$("planSaveBtn").onclick=()=>{if(!editorHasChanges()){closePage();showTab("plans");return}const done=()=>{closePage();showTab("plans");renderPlans()};if(currentPlan._editingSourceId)askExistingPlanSave(done);else{openSheet("Plan wirklich speichern?",`<p class="muted">Möchtest du diesen Trainingsplan speichern?</p><div class="grid2"><button id="cancelPlanSave" class="secondary">Abbrechen</button><button id="confirmPlanSave" class="primary">Speichern</button></div>`);$("cancelPlanSave").onclick=()=>closeSheet({all:true});$("confirmPlanSave").onclick=()=>{if(saveCurrentPlan()){closeSheet({all:true});done()}}}};
function confirmAndStartPlan(p){
 if(!p||(p.exercises||[]).length===0)return alert("Ein leeres Training kann nicht gestartet werden.");
 openSheet("Training wirklich starten?",`<p class="muted" style="margin:0 0 16px">„${esc(p.name)}“ jetzt starten?</p><button id="reallyStartPlan" class="primary" style="width:100%">Training starten</button>`);
 $("reallyStartPlan").onclick=()=>{closeSheet({all:true});startWorkout(p)}
}
function currentEditorTransientPlan(){
 const n=$("planName").value.trim();if(!n){alert("Bitte Planname eingeben.");return null}
 if(!(currentPlan.exercises||[]).length){alert("Ein Trainingsplan braucht mindestens eine Übung.");return null}
 const p=clone(currentPlan);p.name=n;p.id=`draft_${uid()}`;p.sourcePlanId=currentPlan._editingSourceId||null;p.transientEditorPlan=true;delete p._editingSourceId;delete p._originalName;delete p._isNew;return p
}
function startCurrentEditorPlan(){const p=currentEditorTransientPlan();if(p)confirmAndStartPlan(p)}
$("planPlayBtn").onclick=startCurrentEditorPlan;
function planPrescription(e){
 const m=e.setTechnique||"standard",pause=`Pause ${formatTime(restSeconds(e,90))}`;
 if(e.measureMode==="time")return`Zeitziel ${formatTime(e.timeSeconds||60)} · ${pause}`;
 if(m==="pyramid"){ensurePyramidData(e);return`WDH.-Ziel je Satz: ${(e.methodData?.reps||[]).join(" → ")} · ${pause}`;}
 if(m==="backoff")return`Wiederholungsziel ${e.methodData?.topReps||5}/${e.methodData?.backoffReps||8} · ${pause}`;
 if(m==="restpause")return`Wiederholungsziel ${Number(e.reps)||20} gesamt · ${pause}`;
 if(m==="cluster")return`Wiederholungsziel ${amrapText(e.reps||"8")} gesamt · ${pause}`;
 const r=amrapText(e.reps||defaultRepsForMethod(m));
 return`Wiederholungsziel ${r} · ${pause}`
}

function editorVisualGroups(exercises){
 const out=[];
 (exercises||[]).forEach((e,i)=>{
  if(groupMethod(e.setTechnique)){
   const key=e.techniqueGroup||`legacy_${i}_${e.setTechnique}`;
   const prev=out[out.length-1];
   if(prev&&prev.key===key)prev.items.push({e,i});
   else out.push({key,method:e.setTechnique,items:[{e,i}]})
  }else out.push({key:`single_${i}`,method:e.setTechnique||"standard",items:[{e,i}]})
 });
 return out
}
function renderEditorExerciseInner(e,i,letter=""){
 return `<div class="editor-group-exercise"><div class="space"><button class="exercise-title-link" data-editor-detail="${i}">${letter?`<span class="group-letter">${letter}</span> `:""}${esc(exerciseDisplayName(e))}</button><button class="remove-mini" data-remove-ex="${i}">−</button></div>${e.variant||e.perSide?`<div class="variant-line">${e.variant?esc(e.variant):""}${e.variant&&e.perSide?" · ":""}${e.perSide?"WDH. pro Seite":""}</div>`:""}<div class="editor-ex-meta"><span class="meta-pill">${Number(e.sets||3)} ${Number(e.sets||3)===1?"Satz":"Sätze"}</span><span class="meta-pill">${e.measureMode==="time"?formatTime(e.timeSeconds||300):(amrapText(e.reps||"8-12")+(amrapText(e.reps||"")==="AMRAP"?"":" WDH."))}</span><span class="meta-pill">${formatTime(restSeconds(e,90))} Pause</span>${["cluster","restpause"].includes(e.setTechnique)?`<span class="meta-pill intraset-meta-pill">${Number(e.methodData?.intraRest)||20}s Pause im Satz</span>`:""}</div><div class="editor-action-row"><button class="secondary edit-mini" data-config="${i}">Bearbeiten</button><button class="secondary edit-mini" data-replace="${i}">⇄ Austauschen</button></div></div>`
}
function renderEditorExercises(){
 const ep=currentPlan||{exercises:[]};
 $("editorPlanStats").innerHTML=`<div class="stat-grid editor-stat-grid"><div class="stat"><strong>${ep.exercises.length}</strong><span>ÜBUNGEN</span></div><div class="stat"><strong>${countPlanSets(ep)}</strong><span>SÄTZE</span></div><div class="stat"><strong>~${estimateMinutes(ep)} Min.</strong><span>DAUER</span></div></div>`;
 $("editorExerciseList").innerHTML=editorVisualGroups(currentPlan.exercises).map(g=>{
   const grouped=groupMethod(g.method);
   return `<div class="method-card method-${g.method} ${grouped?"connected-method-card":""}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="method-help">${esc(methodHelp(g.method))}</div>${g.items.map(({e,i},j)=>renderEditorExerciseInner(e,i,grouped?String.fromCharCode(65+j):"")).join("")}${grouped?`<div class="editor-action-row"><button class="secondary edit-mini" data-detach="${g.items[0].i}">⌁ Verknüpfung lösen</button></div>`:""}</div>`
 }).join("");
 document.querySelectorAll("[data-editor-detail]").forEach(b=>b.onclick=()=>openExerciseDetail(currentPlan.exercises[Number(b.dataset.editorDetail)].name));
 document.querySelectorAll("[data-remove-ex]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.removeEx),name=currentPlan.exercises[i]?.name||"diese Übung";if(!confirm(`„${name}“ wirklich aus dem Trainingsplan löschen?`))return;const removed=currentPlan.exercises.splice(i,1)[0];normalizeBrokenPlanGroupAfterDelete(removed);markEditorDirty();renderEditorExercises();persistUI()});
 document.querySelectorAll("[data-config]").forEach(b=>b.onclick=()=>configureExercise(Number(b.dataset.config)));
 document.querySelectorAll("[data-replace]").forEach(b=>b.onclick=()=>replacePlanExercise(Number(b.dataset.replace)));
 document.querySelectorAll("[data-detach]").forEach(b=>b.onclick=()=>detachExerciseGroup(Number(b.dataset.detach)))
}
function replacePlanExercise(i){
 const old=currentPlan.exercises[i];if(!old)return;
 const sourceIndexes=groupMethod(old.setTechnique)&&old.techniqueGroup?groupIndexesFor(i):[i];
 openExercisePicker(name=>{
  const fresh=findExercise(name),keep={setTechnique:old.setTechnique,measureMode:old.measureMode,reps:old.reps,sets:old.sets,rest:old.rest,methodData:clone(old.methodData||{}),note:old.note,variant:"",perSide:old.perSide,linkedExerciseNames:clone(old.linkedExerciseNames||[]),techniqueGroup:old.techniqueGroup||null};
  const replacement=normPlanEx({...fresh,...keep});applyCatalogDefaults(replacement);
  configureReplacementDraft(i,sourceIndexes,replacement)
 },{exclude:new Set([old.name]),title:"Übung austauschen",detailAdd:true})
}
function configureReplacementDraft(i,sourceIndexes,draft){
 let methodScroll=0;
 const render=()=>{
  openSheet(draft.name+" konfigurieren",`<div class="method-tabs" id="repMethodTabs">${METHOD_KEYS.map(k=>`<button class="chip ${draft.setTechnique===k?"active":""}" data-rep-method="${k}">${METHOD_LABEL[k]}</button>`).join("")}</div><div class="method-help">${esc(methodHelp(draft.setTechnique))}</div><div class="mode-switch"><button type="button" class="chip ${draft.measureMode!=="time"?"active":""}" id="repModeReps">Wiederholungen</button><button type="button" class="chip ${draft.measureMode==="time"?"active":""}" id="repModeTime">Zeit</button></div><div class="grid2"><div class="form-field"><label>SÄTZE</label><select id="repSets" class="field">${Array.from({length:10},(_,n)=>`<option ${Number(draft.sets)===n+1?"selected":""}>${n+1}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE</label><select id="repRest" class="field">${[0,30,45,60,90,120,150,180,240,300].map(v=>`<option value="${v}" ${Number(draft.rest)===v?"selected":""}>${v?formatTime(v):"Keine"}</option>`).join("")}</select></div></div><div class="form-field"><label>${draft.measureMode==="time"?"ZEIT":"WDH.-VORGABE"}</label>${draft.measureMode==="time"?timePresetMarkup(draft,"rep"):methodRepConfigMarkup(draft,"rep")}</div>${(findExercise(draft.name).variants||[]).length?`<div class="form-field"><label>VARIANTE</label><select id="repVariant" class="field"><option value="">Standard</option>${(findExercise(draft.name).variants||[]).map(v=>`<option ${draft.variant===v?"selected":""}>${esc(v)}</option>`).join("")}</select></div>`:""}<div class="form-field"><label><input id="repPerSide" type="checkbox" ${draft.perSide?"checked":""}> Wiederholungen pro Seite</label></div>${existingEditMethodMarkup(draft,sourceIndexes.length)}<button id="repConfirm" class="primary" style="width:100%">Übernehmen</button>`,null,{replace:true});
  requestAnimationFrame(()=>{const t=$("repMethodTabs");if(t)t.scrollLeft=methodScroll});
  $("repRest").onchange=()=>{draft.rest=Number($("repRest").value)};$("repModeReps").onclick=()=>{draft.measureMode="reps";render()};
  $("repModeTime").onclick=()=>{draft.measureMode="time";draft.timeSeconds=Math.max(15,Number(draft.timeSeconds)||60);render()};
  document.querySelectorAll("[data-rep-method]").forEach(b=>b.onclick=()=>{methodScroll=$("repMethodTabs")?.scrollLeft||0;prepareDraftForTargetMethod(draft,b.dataset.repMethod,sourceIndexes.length);render()});
  document.querySelectorAll("[data-rep-preset]").forEach(b=>b.onclick=()=>{draft.reps=b.dataset.repPreset;render()});
  const repTimeWheel=$("repTimeWheel");if(repTimeWheel)repTimeWheel.onchange=()=>{draft.timeSeconds=Number(repTimeWheel.value);render()};
  $("repConfirm").onclick=()=>{draft.sets=Number($("repSets").value);draft.rest=Number($("repRest").value);if($("repVariant"))draft.variant=$("repVariant").value;draft.perSide=!!$("repPerSide")?.checked;draft.methodData=draft.methodData||{};if($("cfgDrops"))draft.methodData.dropCount=Number($("cfgDrops").value)||2;if($("cfgDropPct"))draft.methodData.dropPercent=Number($("cfgDropPct").value)||20;if($("cfgGiantCount"))draft.methodData.giantCount=Number($("cfgGiantCount").value)||3;saveMethodRepConfig(draft,"rep");const validation=validateExerciseDraft(draft);if(validation)return toast(validation);if(methodNeedsPartners(draft.setTechnique)){beginExistingPartnerReplacement(sourceIndexes,draft,i);return}if(sourceIndexes.length>1){const preserved=sourceIndexes.map(idx=>clone(currentPlan.exercises[idx])),pos=sourceIndexes.indexOf(i);preserved[pos]=clone(draft);preserved.forEach(x=>{x.techniqueGroup=null;x.linkedExerciseNames=[];x.setTechnique="standard";x.methodData={};if(!x.reps||["20","30","20-30"].includes(String(x.reps)))x.reps="8-12"});commitAtomicPlanGroup(sourceIndexes,preserved,i);return}commitAtomicPlanGroup(sourceIndexes,[draft],i)}
 };
 render()
}
function detachExerciseGroup(i){const e=currentPlan.exercises[i];e.linkedExerciseNames=[];e.techniqueGroup=null;e.setTechnique="standard";if(e.reps==="20-30")e.reps="8-12";markEditorDirty();renderEditorExercises();toast("Verknüpfung gelöst – Übung ist jetzt Standard")}
let planAddFlow=null;
function cancelPlanAddFlow(){
 planAddFlow=null;sheetStack=[];currentSheetState=null;$("sheetWrap").classList.add("hidden")
}
function planAddTypes(all){return orderedExerciseTypes(all)}
function planAddMuscles(all){return orderedMuscles(all)}
function startPlanExerciseAddFlow(){
 planAddFlow={step:"picker",q:exercisePickerState.q||"",type:exercisePickerState.type||"Alle",muscles:new Set(exercisePickerState.muscles||[]),drafts:[],history:[],methodScroll:0};
 renderPlanAddPicker()
}
function planAddFiltered(){
 const all=allExercises(),f=planAddFlow,used=new Set((f?.drafts||[]).map(x=>x.name));
 return all.filter(x=>!used.has(x.name)&&(f.type==="Alle"||(x.categories||[x.category]).includes(f.type))&&(!f.muscles.size||[...f.muscles].every(m=>(x.muscles||[]).includes(m)))&&(!f.q||[x.name,...(x.equipment||[]),...(x.variants||[])].join(" ").toLowerCase().includes(f.q))).sort(groupedExerciseSort)
}
function renderPlanAddPicker(){
 if(!planAddFlow)return;
 const f=planAddFlow,all=allExercises(),rows=planAddFiltered(),types=planAddTypes(all),ms=planAddMuscles(all);
 f.step="picker";
 renderSheetState({title:f.drafts.length?"Weitere Übung auswählen":"Übung hinzufügen",scroll:Number(f.pickerScroll)||0,body:`<div class="search"><input id="planAddSearch" class="field" placeholder="Übung suchen" value="${esc(f.q)}"><button id="planAddClear">×</button></div><div class="chips" id="paTypeChips">${types.map(x=>`<button class="chip ${f.type===x?"active":""}" data-pa-type="${esc(x)}">${esc(x)}</button>`).join("")}</div><div class="chips" id="paMuscleChips">${ms.map(x=>`<button class="chip ${(x==="Alle"&&!f.muscles.size)||f.muscles.has(x)?"active":""}" data-pa-muscle="${esc(x)}">${esc(x)}</button>`).join("")}</div><div class="small" id="planAddCount" style="margin:2px 0 8px">${rows.length} Übungen</div><div id="planAddRows">${planAddRowsMarkup(rows)}</div>`});
 const search=$("planAddSearch");
 const refresh=()=>{const rows=planAddFiltered();$("planAddCount").textContent=`${rows.length} Übungen`;$("planAddRows").innerHTML=planAddRowsMarkup(rows);bindPlanAddRows()};
 search.oninput=()=>{f.q=search.value.toLowerCase();exercisePickerState.q=f.q;refresh()};
 $("planAddClear").onclick=()=>{f.q="";search.value="";exercisePickerState.q="";refresh();search.focus()};
 requestAnimationFrame(()=>{if($("paTypeChips"))$("paTypeChips").scrollLeft=Number(f.typeScroll)||0;if($("paMuscleChips"))$("paMuscleChips").scrollLeft=Number(f.muscleScroll)||0;$("sheetBody").scrollTop=Number(f.pickerScroll)||0});
 document.querySelectorAll("[data-pa-type]").forEach(b=>b.onclick=()=>{f.pickerScroll=$("sheetBody").scrollTop||0;f.typeScroll=$("paTypeChips")?.scrollLeft||0;f.muscleScroll=$("paMuscleChips")?.scrollLeft||0;f.type=(f.type===b.dataset.paType&&f.type!=="Alle")?"Alle":b.dataset.paType;exercisePickerState.type=f.type;renderPlanAddPicker()});
 document.querySelectorAll("[data-pa-muscle]").forEach(b=>b.onclick=()=>{f.pickerScroll=$("sheetBody").scrollTop||0;f.typeScroll=$("paTypeChips")?.scrollLeft||0;f.muscleScroll=$("paMuscleChips")?.scrollLeft||0;const m=b.dataset.paMuscle;if(m==="Alle")f.muscles.clear();else f.muscles.has(m)?f.muscles.delete(m):f.muscles.add(m);exercisePickerState.muscles=[...f.muscles];renderPlanAddPicker()});
 bindPlanAddRows()
}
function planAddRowsMarkup(rows){
 return rows.map(e=>{const meta=[(e.categories||[]).join(" · "),(e.muscles||[]).join(", ")].filter(Boolean).join(" · ");return `<div class="exercise-card picker-quick-card"><button class="picker-info" type="button" data-pa-info="${esc(e.name)}"><div><strong>${esc(e.name)}</strong><small>${esc(meta)}</small></div></button><button class="picker-quick-add" type="button" data-pa-pick="${esc(e.name)}" aria-label="${esc(e.name)} hinzufügen">+</button></div>`}).join("")
}
function bindPlanAddRows(){
 document.querySelectorAll("[data-pa-pick]").forEach(b=>b.onclick=()=>beginPlanAddConfig(b.dataset.paPick,"picker"));
 document.querySelectorAll("[data-pa-info]").forEach(b=>b.onclick=()=>renderPlanAddDetail(b.dataset.paInfo))
}
function renderPlanAddDetail(name){
 if(!planAddFlow)return;planAddFlow.step="detail";planAddFlow.detailName=name;const e=findExercise(name);
 const variantHtml=(e.variants||[]).length?`<div class="detail-section"><div class="small">VARIANTEN</div><div class="detail-chip-row">${e.variants.map(v=>`<span class="detail-chip">${esc(v)}</span>`).join("")}</div></div>`:"";
 const equipmentHtml=(e.equipment||[]).length?`<div class="detail-section"><div class="small">HILFSMITTEL / GERÄT</div><div class="detail-chip-row">${e.equipment.map(v=>`<span class="detail-chip">${esc(v)}</span>`).join("")}</div></div>`:"";
 renderSheetState({title:name,scroll:0,body:`<div class="detail-section"><div class="small">TRAININGSART</div><strong>${esc(e.category||e.categories?.[0]||"—")}</strong></div><div class="detail-section"><div class="small">BEREICHE</div><strong>${esc((e.muscles||[]).join(", ")||"—")}</strong></div>${variantHtml}${equipmentHtml}<div class="detail-copy"><h2>Ausführung</h2><p>${esc(e.execution||"")}</p></div><button id="planAddFromDetail" class="primary" style="width:100%;margin-top:12px">+ Zum Plan</button>`});
 $("planAddFromDetail").onclick=()=>beginPlanAddConfig(name,"detail")
}
function beginPlanAddConfig(name,from="picker",seed=null){
 if(!planAddFlow)return;
 const draft=seed?clone(seed):normPlanEx(applyStandardExerciseDefaults({...findExercise(name),setTechnique:"standard"}));
 planAddFlow.current=draft;planAddFlow.from=from;planAddFlow.step="config";
 renderPlanAddConfig()
}
function renderPlanAddConfig(){
 if(!planAddFlow?.current)return;
 const e=planAddFlow.current;
 renderSheetState({title:e.name,scroll:0,body:`<div class="method-tabs" id="paMethodTabs">${METHOD_KEYS.map(k=>`<button class="chip ${e.setTechnique===k?"active":""}" data-pa-method="${k}">${METHOD_LABEL[k]}</button>`).join("")}</div><div class="method-help">${esc(methodHelp(e.setTechnique))}</div><div class="mode-switch"><button type="button" class="chip ${e.measureMode!=="time"?"active":""}" id="paModeReps">Wiederholungen</button><button type="button" class="chip ${e.measureMode==="time"?"active":""}" id="paModeTime">Zeit</button></div><div class="grid2"><div class="form-field"><label>SÄTZE</label><select id="paSets" class="field">${Array.from({length:10},(_,n)=>`<option ${e.sets===n+1?"selected":""}>${n+1}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE</label><select id="paRest" class="field">${[0,30,45,60,90,120,150,180,240,300].map(v=>`<option value="${v}" ${Number(e.rest)===v?"selected":""}>${v?formatTime(v):"Keine"}</option>`).join("")}</select></div></div><div class="form-field"><label>${e.measureMode==="time"?"ZEIT":"WDH.-VORGABE"}</label>${e.measureMode==="time"?timePresetMarkup(e,"pa"):methodRepConfigMarkup(e,"pa")}</div>${exerciseOptionFieldsMarkup(e,"pa")}<div class="form-field"><label><input id="paPerSide" type="checkbox" ${e.perSide?"checked":""}> Wiederholungen pro Seite</label></div>${planAddMethodExtra(e)}<button id="paConfirm" class="primary" style="width:100%">Übernehmen</button>`});
 requestAnimationFrame(()=>{const tabs=$("paMethodTabs");if(tabs)tabs.scrollLeft=planAddFlow.methodScroll||0});
 $("paModeReps").onclick=()=>{captureVisibleExerciseConfig(e,"pa",{setsId:"paSets",restId:"paRest",perSideId:"paPerSide"});e.measureMode="reps";renderPlanAddConfig()};$("paModeTime").onclick=()=>{captureVisibleExerciseConfig(e,"pa",{setsId:"paSets",restId:"paRest",perSideId:"paPerSide"});e.measureMode="time";e.timeSeconds=Math.max(15,Number(e.timeSeconds)||60);renderPlanAddConfig()};
 document.querySelectorAll("[data-pa-method]").forEach(b=>b.onclick=()=>{captureVisibleExerciseConfig(e,"pa",{setsId:"paSets",restId:"paRest",perSideId:"paPerSide"});const tabs=$("paMethodTabs");planAddFlow.methodScroll=tabs?.scrollLeft||0;if(planAddFlow.memberGroup)planAddFlow.memberMethodExplicit=true;const keepVariant=e.variant,keepEquipment=e.equipmentChoice,ve=e._variantExplicit,ee=e._equipmentExplicit;prepareDraftForTargetMethod(e,b.dataset.paMethod,1);e.variant=keepVariant;e.equipmentChoice=keepEquipment;e._variantExplicit=ve;e._equipmentExplicit=ee;applyCatalogDefaults(e);renderPlanAddConfig()});
 $("paSets").onchange=()=>{captureVisibleExerciseConfig(e,"pa",{setsId:"paSets",restId:"paRest",perSideId:"paPerSide"});if(e.setTechnique==="pyramid")ensurePyramidData(e);renderPlanAddConfig()};
 document.querySelectorAll("[data-rep-preset]").forEach(b=>b.onclick=()=>{captureVisibleExerciseConfig(e,"pa",{setsId:"paSets",restId:"paRest",perSideId:"paPerSide"});e.reps=b.dataset.repPreset;renderPlanAddConfig()});
 const paTimeWheel=$("paTimeWheel");if(paTimeWheel)paTimeWheel.onchange=()=>{captureVisibleExerciseConfig(e,"pa",{setsId:"paSets",restId:"paRest",perSideId:"paPerSide"});e.timeSeconds=Number(paTimeWheel.value);renderPlanAddConfig()};
 $("paConfirm").onclick=()=>confirmPlanAddDraft()
}
function defaultPyramidReps(sets=5){
 const templates={
  1:[8],
  2:[10,8],
  3:[10,8,10],
  4:[12,10,8,10],
  5:[12,10,8,10,12],
  6:[14,12,10,8,10,12],
  7:[14,12,10,8,10,12,14],
  8:[18,14,12,10,8,10,12,14],
  9:[18,14,12,10,8,10,12,14,18]
 };
 return (templates[sets]||templates[9].slice(0,sets)).slice()
}
function pyramidPctForSets(sets){
 const mid=(sets-1)/2;
 return Array.from({length:sets},(_,i)=>Math.max(55,100-Math.round(Math.abs(mid-i))*10))
}
function resizePyramidReps(old,sets){
 old=Array.isArray(old)?old.map(Number).filter(Number.isFinite):[];
 if(!old.length)return defaultPyramidReps(sets);
 if(old.length===sets)return old;
 // Preserve all manually entered values. New sets extend at the outside.
 let arr=old.slice();
 while(arr.length<sets){
  const edge=Math.max(Number(arr[0])||0,Number(arr[arr.length-1])||0);
  const next=edge>=14?18:edge>=12?14:edge+2;
  if(arr.length+2<=sets)arr=[next,...arr,next];
  else arr.push(next)
 }
 while(arr.length>sets){
  if(arr.length-2>=sets)arr=arr.slice(1,-1);
  else arr=arr.slice(0,sets)
 }
 return arr
}
function ensurePyramidData(e){
 e.methodData=e.methodData||{};
 const sets=Math.max(1,Number(e.sets)||5);
 e.methodData.reps=resizePyramidReps(e.methodData.reps,sets);
 if(!Array.isArray(e.methodData.weightPct)||e.methodData.weightPct.length!==sets)e.methodData.weightPct=pyramidPctForSets(sets)
}
function methodRepConfigMarkup(e,prefix){
 if(e.setTechnique==="pyramid"){ensurePyramidData(e);return`<div class="pyramid-config"><div class="small">WDH. JE SATZ</div>${e.methodData.reps.map((r,i)=>`<div class="pyramid-config-row"><span>Satz ${i+1}</span><input id="${prefix}PyrRep${i}" class="field" inputmode="numeric" value="${r}"><span>${e.methodData.weightPct[i]}%</span></div>`).join("")}</div>`}
 if(e.setTechnique==="backoff"){e.methodData=e.methodData||{};const top=Number(e.methodData.topReps)||5,back=Math.max(top+1,Number(e.methodData.backoffReps)||8),pct=Number(e.methodData.backoffPercent)||15;return`<div class="grid2"><div class="form-field"><label>TOP-SATZ WDH.</label><select id="${prefix}TopReps" class="field">${Array.from({length:10},(_,i)=>i+1).map(n=>`<option ${n===top?"selected":""}>${n}</option>`).join("")}</select></div><div class="form-field"><label>BACK-OFF WDH.</label><select id="${prefix}BackReps" class="field">${[6,7,8,9,10,11,12].filter(n=>n>top).map(n=>`<option ${n===back?"selected":""}>${n}</option>`).join("")}</select></div></div><div class="form-field"><label>GEWICHT REDUZIEREN %</label><select id="${prefix}BackPct" class="field">${[5,10,15,20,25,30].map(n=>`<option ${n===pct?"selected":""}>${n}</option>`).join("")}</select></div>`}
 return repPresetMarkup(e)
}
function saveMethodRepConfig(e,prefix){
 e.methodData=e.methodData||{};
 if(e.setTechnique==="pyramid"){ensurePyramidData(e);e.methodData.reps=e.methodData.reps.map((_,i)=>Math.max(1,Number($(`${prefix}PyrRep${i}`)?.value)||e.methodData.reps[i]))}
 if(e.setTechnique==="backoff"){e.methodData.topReps=Math.max(1,Number($(`${prefix}TopReps`)?.value)||5);e.methodData.backoffReps=Math.min(12,Math.max(e.methodData.topReps+1,Number($(`${prefix}BackReps`)?.value)||8));e.methodData.backoffPercent=Math.max(0,Number($(`${prefix}BackPct`)?.value)||15)}
}
function planAddMethodExtra(e){
 if(e.setTechnique==="giant"){const c=Math.max(3,Number(e.methodData?.giantCount)||3);return`<div class="form-field"><label>ANZAHL ÜBUNGEN</label><select id="paGiantCount" class="field">${[3,4,5,6].map(n=>`<option ${c===n?"selected":""}>${n}</option>`).join("")}</select></div>`}
 if(e.setTechnique==="dropset")return`<div class="grid2"><div class="form-field"><label>DROPS</label><select id="paDrops" class="field">${[1,2,3,4].map(n=>`<option ${Number(e.methodData?.dropCount||2)===n?"selected":""}>${n}</option>`).join("")}</select></div><div class="form-field"><label>REDUKTION %</label><select id="paDropPct" class="field">${[10,15,20,25,30].map(n=>`<option ${Number(e.methodData?.dropPercent||20)===n?"selected":""}>${n}</option>`).join("")}</select></div></div>`;
 if(e.setTechnique==="cluster")return`<div class="grid2"><div class="form-field"><label>CLUSTER PRO SATZ</label><select id="paClusterBlocks" class="field">${[2,3,4,5,6].map(n=>`<option ${Number(e.methodData?.blocks||4)===n?"selected":""}>${n}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE IM SATZ</label><select id="paIntraRest" class="field">${[10,15,20,30,45].map(n=>`<option value="${n}" ${Number(e.methodData?.intraRest||20)===n?"selected":""}>${n}s</option>`).join("")}</select></div></div>`;
 if(e.setTechnique==="restpause")return`<div class="form-field"><label>REST-PAUSE PAUSE</label><select id="paIntraRest" class="field">${[10,15,20,30].map(n=>`<option value="${n}" ${Number(e.methodData?.intraRest||20)===n?"selected":""}>${n}s</option>`).join("")}</select></div>`;
 return""
}
function savePlanAddFormToDraft(){
 const e=planAddFlow.current;e.sets=Number($("paSets").value);e.rest=Number($("paRest").value);captureExerciseOptionFields(e,"pa");e.perSide=!!$("paPerSide")?.checked;e.methodData=e.methodData||{};
 if($("paGiantCount"))e.methodData.giantCount=Number($("paGiantCount").value)||3;
 if($("paDrops"))e.methodData.dropCount=Number($("paDrops").value)||2;
 if($("paDropPct"))e.methodData.dropPercent=Number($("paDropPct").value)||20;if($("paClusterBlocks"))e.methodData.blocks=Number($("paClusterBlocks").value)||4;if($("paIntraRest"))e.methodData.intraRest=Number($("paIntraRest").value)||20;saveMethodRepConfig(e,"pa")
}

function renderPartnerExercisePicker(){
 if(!planAddFlow?.group)return renderPlanAddPicker();
 const f=planAddFlow,all=allExercises(),rows=planAddFiltered();
 f.step="partnerPicker";
 const pos=f.drafts.length+1,target=f.group.target,method=METHOD_LABEL[f.group.method]||f.group.method;
 renderSheetState({
  title:`${method} · Übung ${pos}/${target}`,
  scroll:0,
  body:`<div class="compact-partner-note">Wähle nur die nächste Partnerübung. Satzanzahl und Pause gelten für die gesamte Serie.</div>
  <div class="search compact-partner-search"><input id="paPartnerSearch" placeholder="Übung suchen" value="${esc(f.q||"")}"><button id="paPartnerClear" class="${f.q?"":"hidden"}">×</button></div>
  <div class="picker-list compact-partner-list">${rows.map(x=>`<div class="picker-row"><button class="picker-name" data-partner-detail="${esc(x.name)}">${esc(x.name)}</button><button class="quick-add" data-partner-add="${esc(x.name)}" aria-label="${esc(x.name)} hinzufügen">+</button></div>`).join("")}</div>`,
  onBack:()=>{if(f.drafts.length){const prev=f.drafts.pop();f.current=prev;f.step="config";renderPlanAddConfig()}else renderPlanAddPicker()},
  onClose:cancelPlanAddFlow
 });
 const q=$("paPartnerSearch");
 q.oninput=()=>{f.q=q.value.toLowerCase();renderPartnerExercisePicker();requestAnimationFrame(()=>{const n=$("paPartnerSearch");if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}})};
 $("paPartnerClear").onclick=()=>{f.q="";renderPartnerExercisePicker()};
 document.querySelectorAll("[data-partner-add]").forEach(b=>b.onclick=()=>startCompactPartnerConfig(b.dataset.partnerAdd));
 document.querySelectorAll("[data-partner-detail]").forEach(b=>b.onclick=()=>startCompactPartnerConfig(b.dataset.partnerDetail))
}
function startCompactPartnerConfig(name,seed=null,order=null){
 const master=planAddFlow.drafts[0],base=seed?clone(seed):normPlanEx({...findExercise(name),sets:master.sets||3,rest:restSeconds(master,90)});
 if(!seed)prepareDraftForTargetMethod(base,planAddFlow.group.method,planAddFlow.group.target);
 else{base.setTechnique=planAddFlow.group.method;base.techniqueGroup=planAddFlow.group.id;base.sets=Number(master.sets)||3;base.rest=Number(master.rest)||0;if(!base.reps)base.reps=defaultRepsForMethod(planAddFlow.group.method)}
 base.techniqueGroup=planAddFlow.group.id;if(order!=null)base._draftOrder=order;else if(Array.isArray(planAddFlow.editSourceIndexes)){base._draftOrder=Number(planAddFlow.nextOrder)||planAddFlow.editSourceIndexes.length;planAddFlow.nextOrder=base._draftOrder+1}
 planAddFlow.current=base;planAddFlow.step="partnerConfig";renderCompactPartnerConfig()
}
function advancePartnerDraftFlow(){
 const f=planAddFlow;if(!f?.group)return;
 if(f.drafts.length>=f.group.target){const master=f.drafts[0];f.drafts.forEach(d=>{d.setTechnique=f.group.method;d.techniqueGroup=f.group.id;d.sets=Number(master.sets)||3;d.rest=Number(master.rest)||0});commitPlanAddFlow();return}
 if(Array.isArray(f.pendingSeeds)&&f.pendingSeeds.length){const next=f.pendingSeeds.shift();startCompactPartnerConfig(next.exercise.name,next.exercise,next.order);return}
 renderPartnerExercisePicker()
}
function renderCompactPartnerConfig(){
 const e=planAddFlow.current,method=planAddFlow.group.method;
 renderSheetState({
  title:`${METHOD_LABEL[method]} · ${esc(e.name)}`,
  scroll:0,
  body:`<div class="compact-partner-card"><strong>${esc(e.name)}</strong><div class="small">${e.sets} Sätze · ${formatTime(e.rest)} Pause · als Teil derselben ${esc(METHOD_LABEL[method])}-Serie</div></div>
  <div class="mode-switch"><button type="button" class="chip ${e.measureMode!=="time"?"active":""}" id="partnerModeReps">Wiederholungen</button><button type="button" class="chip ${e.measureMode==="time"?"active":""}" id="partnerModeTime">Zeit</button></div>
  <div class="form-field"><label>${e.measureMode==="time"?"ZEIT":"WDH.-VORGABE"}</label>${e.measureMode==="time"?timePresetMarkup(e,"partner"):methodRepConfigMarkup(e,"partner")}</div>
  ${exerciseOptionFieldsMarkup(e,"partner")}
  <div class="form-field"><label><input id="partnerPerSide" type="checkbox" ${e.perSide?"checked":""}> Wiederholungen pro Seite</label></div>
  ${method==="dropset"?`<div class="grid2"><div class="form-field"><label>DROPS</label><select id="partnerDrops" class="field">${[1,2,3,4].map(n=>`<option ${Number(e.methodData?.dropCount||2)===n?"selected":""}>${n}</option>`).join("")}</select></div><div class="form-field"><label>REDUKTION %</label><select id="partnerDropPct" class="field">${[10,15,20,25,30].map(n=>`<option ${Number(e.methodData?.dropPercent||20)===n?"selected":""}>${n}</option>`).join("")}</select></div></div>`:""}
  <button id="partnerReplaceChoice" class="secondary" style="width:100%;margin-bottom:8px">⇄ Diese Übung austauschen</button>
  <button id="partnerConfirm" class="primary" style="width:100%">Übung übernehmen</button>`,
  onBack:()=>{if(Array.isArray(planAddFlow.pendingSeeds)&&e._draftOrder!=null)planAddFlow.pendingSeeds.unshift({exercise:clone(e),order:e._draftOrder});planAddFlow.current=null;renderPartnerExercisePicker()},
  onClose:cancelPlanAddFlow
 });
 $("partnerModeReps").onclick=()=>{e.measureMode="reps";renderCompactPartnerConfig()};$("partnerModeTime").onclick=()=>{e.measureMode="time";e.timeSeconds=Math.max(15,Number(e.timeSeconds)||60);renderCompactPartnerConfig()};
 document.querySelectorAll("[data-rep-preset]").forEach(b=>b.onclick=()=>{e.reps=b.dataset.repPreset;renderCompactPartnerConfig()});
 const partnerTimeWheel=$("partnerTimeWheel");if(partnerTimeWheel)partnerTimeWheel.onchange=()=>{e.timeSeconds=Number(partnerTimeWheel.value);renderCompactPartnerConfig()};
 $("partnerReplaceChoice").onclick=()=>openExercisePicker(name=>{const keep={sets:e.sets,rest:e.rest,measureMode:e.measureMode,timeSeconds:e.timeSeconds,reps:e.reps,methodData:clone(e.methodData||{}),setTechnique:method,techniqueGroup:planAddFlow.group.id,perSide:e.perSide,_draftOrder:e._draftOrder};const x=normPlanEx({...findExercise(name),...keep,variant:""});planAddFlow.current=x;renderCompactPartnerConfig()},{exclude:new Set([e.name]),title:"Übung austauschen",detailAdd:true,returnToSheet:true});
 $("partnerConfirm").onclick=()=>{
  captureExerciseOptionFields(e,"partner");e.perSide=!!$("partnerPerSide")?.checked;e.methodData=e.methodData||{};
  if($("partnerDrops"))e.methodData.dropCount=Number($("partnerDrops").value)||2;if($("partnerDropPct"))e.methodData.dropPercent=Number($("partnerDropPct").value)||20;saveMethodRepConfig(e,"partner");
  const validation=validateExerciseDraft(e);if(validation)return toast(validation);
  const copy=clone(e);copy.setTechnique=method;copy.techniqueGroup=planAddFlow.group.id;if(!Array.isArray(planAddFlow.editSourceIndexes)&&!Number.isFinite(Number(copy._draftOrder)))copy._draftOrder=planAddFlow.drafts.length;planAddFlow.drafts.push(copy);planAddFlow.current=null;advancePartnerDraftFlow()
 }
}
function confirmPlanAddDraft(){
 if(!planAddFlow?.current)return;
 savePlanAddFormToDraft();
 const validation=validateExerciseDraft(planAddFlow.current);if(validation)return toast(validation);
 const e=clone(planAddFlow.current),method=e.setTechnique||"standard";
 if(methodNeedsPartners(method)){
  const selectedTarget=method==="giant"
    ? Math.min(6,Math.max(3,Number($("paGiantCount")?.value||e.methodData?.giantCount||planAddFlow.group?.target||3)))
    : 2;
  e.methodData=e.methodData||{};
  if(method==="giant")e.methodData.giantCount=selectedTarget;
  if(!planAddFlow.group){
    planAddFlow.group={id:`tg_${uid()}`,method,target:selectedTarget};
  }else{
    planAddFlow.group.method=method;
    if(method==="giant")planAddFlow.group.target=selectedTarget
  }
  e.techniqueGroup=planAddFlow.group.id;
  if(!Array.isArray(planAddFlow.editSourceIndexes)&&!Number.isFinite(Number(e._draftOrder)))e._draftOrder=planAddFlow.drafts.length;
  planAddFlow.drafts.push(e);
  if(planAddFlow.drafts.length<planAddFlow.group.target){
    planAddFlow.current=null;renderPartnerExercisePicker();return
  }
  const master=planAddFlow.drafts[0],gid=planAddFlow.group.id;
  planAddFlow.drafts.forEach(d=>{
    d.setTechnique=planAddFlow.group.method;
    d.techniqueGroup=gid;
    d.sets=master.sets;
    d.rest=master.rest
  });
  commitPlanAddFlow();return
 }
 planAddFlow.drafts.push(e);commitPlanAddFlow()
}
function commitPlanAddFlow(){
 if(!planAddFlow?.drafts?.length)return;
 let drafts=planAddFlow.drafts.map(clone);
 const detached=drafts.flatMap(d=>Array.isArray(d._detachedAfterConversion)?d._detachedAfterConversion.map(clone):[]);
 if(drafts.some(d=>Number.isFinite(Number(d._draftOrder))))drafts.sort((a,b)=>(Number.isFinite(Number(a._draftOrder))?Number(a._draftOrder):999)-(Number.isFinite(Number(b._draftOrder))?Number(b._draftOrder):999));
 drafts.forEach(d=>{delete d._draftOrder;delete d._detachedAfterConversion});
 detached.forEach(d=>{d.techniqueGroup=null;d.linkedExerciseNames=[];d.setTechnique="standard";d.methodData={};if(!d.reps||["20","30","20-30"].includes(String(d.reps)))d.reps="8-12";delete d.liveSets});
 const method=planAddFlow.group?.method||drafts[0]?.setTechnique||"standard",target=planAddFlow.group?.target||drafts.length,validation=validateDraftCollection(drafts,method,target);if(validation)return toast(validation);
 const edited=Array.isArray(planAddFlow.editSourceIndexes)&&planAddFlow.editSourceIndexes.length,liveContext=planAddFlow.context==="live",collection=liveContext?activeWorkout.exercises:currentPlan.exercises;
 if(liveContext){
   const oldByName=new Map(collection.map(x=>[x.name,clone(x.liveSets||[])]));
   [...drafts,...detached].forEach(d=>{const old=oldByName.get(d.name)||[];d.liveSets=rebuildLiveSetsForExercise(d,old)});
 }
 if(edited){
   const indexes=[...planAddFlow.editSourceIndexes].sort((a,b)=>a-b),insertAt=indexes[0];
   [...indexes].sort((a,b)=>b-a).forEach(i=>collection.splice(i,1));
   collection.splice(insertAt,0,...drafts,...detached)
 }else collection.push(...drafts);
 if(liveContext){livePlanEdited=true;saveAll();renderLive()}else{markEditorDirty();renderEditorExercises();persistUI()}
 planAddFlow=null;sheetStack=[];currentSheetState=null;$("sheetWrap").classList.add("hidden");
 toast(edited?(drafts.length>1?"Serie übernommen":"Änderung übernommen"):(drafts.length>1?`${drafts.length} Übungen hinzugefügt`:"Übung hinzugefügt"))
}
function planAddBack(){
 if(!planAddFlow){closeSheet({all:false});return}
 if(planAddFlow.step==="config"){
  // No commit: go back and allow a different exercise to be chosen.
  planAddFlow.current=null;
  if(planAddFlow.from==="detail"&&planAddFlow.detailName)renderPlanAddDetail(planAddFlow.detailName);else renderPlanAddPicker();
  return
 }
 if(planAddFlow.step==="detail"){renderPlanAddPicker();return}
 if(planAddFlow.step==="partnerConfig"){planAddFlow.current=null;renderPartnerExercisePicker();return}
 if(planAddFlow.step==="partnerPicker"){if(planAddFlow.drafts.length){const prev=planAddFlow.drafts.pop();planAddFlow.current=prev;planAddFlow.step="config";renderPlanAddConfig();return}renderPlanAddPicker();return}
 if(planAddFlow.step==="picker"&&planAddFlow.drafts.length){
  // Return to the previously confirmed draft and edit it before the whole group is committed.
  const prev=planAddFlow.drafts.pop();planAddFlow.current=prev;planAddFlow.from="picker";planAddFlow.step="config";renderPlanAddConfig();return
 }
 cancelPlanAddFlow()
}
$("editorAddExerciseBtn").onclick=startPlanExerciseAddFlow;
$("editorPreviewBtn").onclick=()=>openPreview(currentPlan);$("editorReorderBtn").onclick=()=>openReorderSheet();$("editorStartTrainingBtn").onclick=startCurrentEditorPlan;
function reorderUnits(exercises){return editorVisualGroups(exercises).map(g=>({method:g.method,indexes:g.items.map(x=>x.i),label:g.items.map(x=>x.e.name).join(" + ")}))}
function openReorderSheet(){const units=reorderUnits(currentPlan.exercises);openSheet("Reihenfolge ändern",units.map((u,ui)=>`<div class="exercise-card"><div><strong>${ui+1}. ${esc(u.label)}</strong>${u.indexes.length>1?`<small>${METHOD_LABEL[u.method]} · ${u.indexes.length} Übungen</small>`:""}</div><div class="row"><button class="icon-btn" data-unit-up="${ui}">↑</button><button class="icon-btn" data-unit-down="${ui}">↓</button></div></div>`).join(""));document.querySelectorAll("[data-unit-up]").forEach(b=>b.onclick=()=>movePlanUnit(Number(b.dataset.unitUp),-1));document.querySelectorAll("[data-unit-down]").forEach(b=>b.onclick=()=>movePlanUnit(Number(b.dataset.unitDown),1))}
function movePlanUnit(ui,d){const units=reorderUnits(currentPlan.exercises),j=ui+d;if(j<0||j>=units.length)return;const chunks=units.map(u=>u.indexes.map(i=>currentPlan.exercises[i]));[chunks[ui],chunks[j]]=[chunks[j],chunks[ui]];currentPlan.exercises=chunks.flat();markEditorDirty();closeSheet({all:true});renderEditorExercises();openReorderSheet()}
function normalizeGroupCollection(exercises,gid,structuralSource=null){
 const members=exercises.filter(e=>e.techniqueGroup===gid);if(!members.length)return;
 const method=members[0].setTechnique||"standard",min=method==="giant"?3:2;
 if(members.length<min){
  members.forEach(e=>{e.techniqueGroup=null;e.setTechnique="standard";e.linkedExerciseNames=[];if(!e.reps||["20","30","20-30"].includes(String(e.reps)))e.reps="8-12"});
  return
 }
 const master=structuralSource||members[0];
 const sharedSets=Math.max(1,Math.min(10,Number(master.sets)||3));
 const sharedRest=Math.max(0,Number(master.rest)||0);
 members.forEach(e=>{
  e.setTechnique=method;e.techniqueGroup=gid;e.sets=sharedSets;e.rest=sharedRest;
  e.linkedExerciseNames=members.filter(x=>x!==e).map(x=>x.name);
  if(method==="giant"){e.methodData=e.methodData||{};e.methodData.giantCount=members.length}
 })
}
function normalizeBrokenPlanGroupAfterDelete(removed){if(removed&&groupMethod(removed.setTechnique)&&removed.techniqueGroup)normalizeGroupCollection(currentPlan.exercises,removed.techniqueGroup)}
function normalizeBrokenLiveGroupAfterDelete(removed){if(!removed||!groupMethod(removed.setTechnique)||!removed.techniqueGroup)return;normalizeGroupCollection(activeWorkout.exercises,removed.techniqueGroup);activeWorkout.exercises.forEach(e=>{if(e.techniqueGroup===removed.techniqueGroup||!e.techniqueGroup)e.liveSets=rebuildLiveSetsForExercise(e,e.liveSets||[])})}
function methodNeedsPartners(m){return["superset","giant","preexhaust"].includes(m)}
function methodMinPartners(m){return m==="giant"?2:1}
function groupIndexesFor(index){
 const e=currentPlan.exercises[index];if(!e||!groupMethod(e.setTechnique)||!e.techniqueGroup)return[index];
 return currentPlan.exercises.map((x,i)=>x.techniqueGroup===e.techniqueGroup&&x.setTechnique===e.setTechnique?i:-1).filter(i=>i>=0)
}
function ensureTechniqueGroup(index,method){
 const e=currentPlan.exercises[index];
 if(!e.techniqueGroup)e.techniqueGroup=`tg_${uid()}`;
 e.setTechnique=method
}
function linkedMethodMarkup(e,index){
 const m=e.setTechnique||"standard";
 if(methodNeedsPartners(m)){
   const count=groupIndexesFor(index).length,target=m==="giant"?Math.max(3,Number(e.methodData?.giantCount)||3):2;
   return `<div class="method-link-box"><div class="method-config-note">${m==="giant"?`Giant Set mit ${target} Übungen. Jede Übung wird nacheinander in derselben Maske eingestellt.`:"Nach dem Speichern fügst du die zweite Übung hinzu und stellst ihre Parameter in derselben Maske ein."}</div>${m==="giant"?`<div class="form-field"><label>ANZAHL ÜBUNGEN</label><select id="cfgGiantCount" class="field">${[3,4,5,6].map(n=>`<option ${target===n?"selected":""}>${n}</option>`).join("")}</select></div>`:""}<div class="small">${count} von ${target} Übungen konfiguriert</div></div>`
 }
 if(m==="dropset")return`<div class="method-link-box"><div class="method-config-note">Drop Set bleibt dieselbe Übung. Nach dem Basissatz folgen direkte Gewichtsreduktionen.</div><div class="grid2"><div class="form-field"><label>DROPS</label><select id="cfgDrops" class="field">${[1,2,3,4].map(x=>`<option ${Number(e.methodData?.dropCount||2)===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="form-field"><label>REDUKTION %</label><select id="cfgDropPct" class="field">${[10,15,20,25,30].map(x=>`<option ${Number(e.methodData?.dropPercent||20)===x?"selected":""}>${x}</option>`).join("")}</select></div></div></div>`;
 return""
}
function configureExercise(i,flow=null){
 const original=currentPlan.exercises[i];if(!original)return;
 const originalGroup=groupMethod(original.setTechnique)&&original.techniqueGroup?groupIndexesFor(i):[i];
 const draft=clone(original);let methodScroll=0;

 const render=()=>{
  $("sheetBody").innerHTML=`<div class="method-tabs" id="cfgMethodTabs">${METHOD_KEYS.map(k=>`<button class="chip ${draft.setTechnique===k?"active":""}" data-method="${k}">${METHOD_LABEL[k]}</button>`).join("")}</div>
  <div class="method-help">${esc(methodHelp(draft.setTechnique))}</div>
  <div class="mode-switch"><button type="button" class="chip ${draft.measureMode!=="time"?"active":""}" id="cfgModeReps">Wiederholungen</button><button type="button" class="chip ${draft.measureMode==="time"?"active":""}" id="cfgModeTime">Zeit</button></div>
  <div class="grid2"><div class="form-field"><label>SÄTZE</label><select id="cfgSets" class="field">${Array.from({length:10},(_,n)=>`<option ${Number(draft.sets)===n+1?"selected":""}>${n+1}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE</label><select id="cfgRest" class="field">${[0,30,45,60,90,120,150,180,240,300].map(v=>`<option value="${v}" ${Number(draft.rest)===v?"selected":""}>${v?formatTime(v):"Keine"}</option>`).join("")}</select></div></div>
  <div class="form-field"><label>${draft.measureMode==="time"?"ZEIT":"WDH.-VORGABE"}</label>${draft.measureMode==="time"?timePresetMarkup(draft,"cfg"):methodRepConfigMarkup(draft,"cfg")}</div>
  ${exerciseOptionFieldsMarkup(draft,"cfg")}
  <div class="form-field"><label><input id="cfgPerSide" type="checkbox" ${draft.perSide?"checked":""}> Wiederholungen pro Seite</label></div>
  ${existingEditMethodMarkup(draft,originalGroup.length)}
  <button id="cfgSave" class="primary" style="width:100%">Übernehmen</button>`;
  bind()
 };
 const bind=()=>{
  requestAnimationFrame(()=>{const t=$("cfgMethodTabs");if(t)t.scrollLeft=methodScroll});
  $("cfgRest").onchange=()=>{draft.rest=Number($("cfgRest").value)};$("cfgModeReps").onclick=()=>{captureVisibleExerciseConfig(draft,"cfg",{setsId:"cfgSets",restId:"cfgRest",perSideId:"cfgPerSide"});draft.measureMode="reps";render()};
  $("cfgModeTime").onclick=()=>{captureVisibleExerciseConfig(draft,"cfg",{setsId:"cfgSets",restId:"cfgRest",perSideId:"cfgPerSide"});draft.measureMode="time";draft.timeSeconds=Math.max(15,Number(draft.timeSeconds)||60);render()};
  document.querySelectorAll("[data-method]").forEach(b=>b.onclick=()=>{
    captureVisibleExerciseConfig(draft,"cfg",{setsId:"cfgSets",restId:"cfgRest",perSideId:"cfgPerSide"});methodScroll=$("cfgMethodTabs")?.scrollLeft||0;
    const keepVariant=draft.variant,keepEquipment=draft.equipmentChoice,ve=draft._variantExplicit,ee=draft._equipmentExplicit;prepareDraftForTargetMethod(draft,b.dataset.method,originalGroup.length);draft.variant=keepVariant;draft.equipmentChoice=keepEquipment;draft._variantExplicit=ve;draft._equipmentExplicit=ee;applyCatalogDefaults(draft);
    render()
  });
  const cfgTimeWheel=$("cfgTimeWheel");if(cfgTimeWheel)cfgTimeWheel.onchange=()=>{captureVisibleExerciseConfig(draft,"cfg",{setsId:"cfgSets",restId:"cfgRest",perSideId:"cfgPerSide"});draft.timeSeconds=Number(cfgTimeWheel.value);render()};
  document.querySelectorAll("[data-rep-preset]").forEach(b=>b.onclick=()=>{
   const variant=$("cfgVariant")?.value??draft.variant??"",equipment=$("cfgEquipment")?.value??draft.equipmentChoice??"";
   captureVisibleExerciseConfig(draft,"cfg",{setsId:"cfgSets",restId:"cfgRest",perSideId:"cfgPerSide"});
   draft.variant=variant;draft.equipmentChoice=equipment;
   if($("cfgVariant"))draft._variantExplicit=true;
   if($("cfgEquipment"))draft._equipmentExplicit=true;
   draft.reps=b.dataset.repPreset;render()
  });
  $("cfgSave").onclick=()=>{
    draft.sets=Number($("cfgSets").value);draft.rest=Number($("cfgRest").value);
    captureExerciseOptionFields(draft,"cfg");
    draft.perSide=!!$("cfgPerSide")?.checked;
    draft.methodData=draft.methodData||{};
    if($("cfgDrops"))draft.methodData.dropCount=Number($("cfgDrops").value)||2;
    if($("cfgDropPct"))draft.methodData.dropPercent=Number($("cfgDropPct").value)||20;
    if($("cfgGiantCount"))draft.methodData.giantCount=Number($("cfgGiantCount").value)||3;if($("cfgClusterBlocks"))draft.methodData.blocks=Number($("cfgClusterBlocks").value)||4;if($("cfgIntraRest"))draft.methodData.intraRest=Number($("cfgIntraRest").value)||20;
    saveMethodRepConfig(draft,"cfg");
    const validation=validateExerciseDraft(draft);if(validation)return toast(validation);

    if(methodNeedsPartners(draft.setTechnique)){
      const target=draft.setTechnique==="giant"?(Number(draft.methodData?.giantCount)||3):2;
      const sameGroup=originalGroup.length>1&&draft.setTechnique===original.setTechnique&&target===originalGroup.length;
      if(sameGroup){
        const preserved=originalGroup.map(idx=>clone(currentPlan.exercises[idx])),pos=originalGroup.indexOf(i),gid=original.techniqueGroup;preserved[pos]=clone(draft);
        preserved.forEach(x=>{x.setTechnique=draft.setTechnique;x.techniqueGroup=gid;x.sets=Number(draft.sets)||3;x.rest=Number(draft.rest)||0;if(draft.setTechnique==="giant"){x.methodData=x.methodData||{};x.methodData.giantCount=target}});
        commitAtomicPlanGroup(originalGroup,preserved,i);return
      }
      beginExistingPartnerReplacement(originalGroup,draft,i);return
    }

    if(originalGroup.length>1){
      const preserved=originalGroup.map(idx=>clone(currentPlan.exercises[idx]));
      const pos=originalGroup.indexOf(i);preserved[pos]=clone(draft);preserved.forEach(x=>{x.techniqueGroup=null;x.setTechnique="standard";x.linkedExerciseNames=[];if(!x.reps||["20","30","20-30"].includes(String(x.reps)))x.reps="8-12"});
      commitAtomicPlanGroup(originalGroup,preserved,i);return
    }
    commitAtomicPlanGroup(originalGroup,[draft],i)
  }
 };
 openSheet(original.name+" bearbeiten","");render()
}

function existingEditMethodMarkup(e,oldGroupCount=1){
 const m=e.setTechnique||"standard";
 if(methodNeedsPartners(m)){
   const target=m==="giant"?Math.max(3,Number(e.methodData?.giantCount)||Math.max(3,oldGroupCount)):2;
   return`<div class="method-link-box"><div class="method-config-note">${m==="giant"?`Giant Set mit ${target} Übungen. Die Übungen laufen direkt hintereinander; Pause nach der kompletten Runde.`:m==="preexhaust"?"Pre-Exhaust: zuerst die isolierende Vorermüdungsübung, direkt danach die Mehrgelenksübung.":"Superset: zwei Übungen direkt nacheinander; Pause nach dem Paar."}</div>${m==="giant"?`<div class="form-field"><label>ANZAHL ÜBUNGEN</label><select id="cfgGiantCount" class="field">${[3,4,5,6].map(n=>`<option ${target===n?"selected":""}>${n}</option>`).join("")}</select></div>`:""}</div>`
 }
 if(m==="dropset")return`<div class="method-link-box"><div class="method-config-note">Basissatz, dann ohne reguläre Satzpause die Last reduzieren. WDH. bleiben je Drop frei eintragbar.</div><div class="grid2"><div class="form-field"><label>DROPS</label><select id="cfgDrops" class="field">${[1,2,3,4].map(x=>`<option ${Number(e.methodData?.dropCount||2)===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="form-field"><label>REDUKTION %</label><select id="cfgDropPct" class="field">${[10,15,20,25,30].map(x=>`<option ${Number(e.methodData?.dropPercent||20)===x?"selected":""}>${x}</option>`).join("")}</select></div></div></div>`;
 if(m==="cluster")return`<div class="method-link-box"><div class="method-config-note">Ein Satz wird in kurze Cluster mit kurzen Pausen im Satz aufgeteilt. Jede Cluster-WDH. bleibt frei eintragbar.</div><div class="grid2"><div class="form-field"><label>CLUSTER PRO SATZ</label><select id="cfgClusterBlocks" class="field">${[2,3,4,5,6].map(x=>`<option ${Number(e.methodData?.blocks||4)===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE IM SATZ</label><select id="cfgIntraRest" class="field">${[10,15,20,30,45].map(x=>`<option value="${x}" ${Number(e.methodData?.intraRest||20)===x?"selected":""}>${x}s</option>`).join("")}</select></div></div></div>`;
 if(m==="restpause")return`<div class="method-link-box"><div class="method-config-note">Startblock nahe am Limit, danach kurze Pausen und frei eintragbare Mini-Blöcke bis zum Gesamtziel.</div><div class="form-field"><label>REST-PAUSE PAUSE</label><select id="cfgIntraRest" class="field">${[10,15,20,30].map(x=>`<option value="${x}" ${Number(e.methodData?.intraRest||20)===x?"selected":""}>${x}s</option>`).join("")}</select></div></div>`;
 return""
}

function commitAtomicPlanGroup(sourceIndexes,drafts,focusIndex=null){
 const indexes=[...sourceIndexes].sort((a,b)=>a-b),insertAt=indexes[0];
 const result=drafts.map(clone);
 if(result.length>1&&groupMethod(result[0].setTechnique)){
  const gid=result[0].techniqueGroup||`tg_${uid()}`,method=result[0].setTechnique;
  result.forEach(e=>{e.techniqueGroup=gid;e.setTechnique=method;e.linkedExerciseNames=result.filter(x=>x!==e).map(x=>x.name)})
 }else result.forEach(e=>{e.techniqueGroup=null;e.linkedExerciseNames=[]});
 [...indexes].sort((a,b)=>b-a).forEach(i=>currentPlan.exercises.splice(i,1));currentPlan.exercises.splice(insertAt,0,...result);
 markEditorDirty();planAddFlow=null;sheetStack=[];currentSheetState=null;$("sheetWrap").classList.add("hidden");renderEditorExercises();persistUI();toast(result.length>1?"Serie übernommen":"Änderung übernommen")
}
function beginExistingPartnerReplacement(sourceIndexes,firstDraft,editIndex=sourceIndexes[0]){
 const method=firstDraft.setTechnique,target=method==="giant"?(Number(firstDraft.methodData?.giantCount)||3):2,gid=`tg_${uid()}`;
 const ordered=sourceIndexes.map((idx,pos)=>({idx,pos,exercise:clone(currentPlan.exercises[idx])})),editedPos=Math.max(0,ordered.findIndex(x=>x.idx===editIndex));
 const first=clone(firstDraft);first.setTechnique=method;first.techniqueGroup=gid;first._draftOrder=editedPos;
 const others=ordered.filter(x=>x.idx!==editIndex);
 const startFlow=selected=>{
  const pending=selected.sort((a,b)=>a.pos-b.pos).map(x=>{const d=clone(x.exercise);if(d.setTechnique!==method)prepareDraftForTargetMethod(d,method,target);else{d.setTechnique=method;d.methodData=d.methodData||{};if(method==="giant")d.methodData.giantCount=target}d.sets=Number(first.sets)||3;d.rest=Number(first.rest)||0;d.techniqueGroup=gid;return{exercise:d,order:x.pos}});
  planAddFlow={step:"partnerPicker",q:exercisePickerState.q||"",type:exercisePickerState.type||"Alle",muscles:new Set(exercisePickerState.muscles||[]),drafts:[first],pendingSeeds:pending,current:null,group:{id:gid,method,target},history:[],methodScroll:0,editSourceIndexes:[...sourceIndexes],editInsertAt:Math.min(...sourceIndexes),nextOrder:sourceIndexes.length};
  advancePartnerDraftFlow()
 };
 const keepNeeded=target-1;
 if(others.length>keepNeeded){
  let chosen=new Set(others.slice(0,keepNeeded).map(x=>x.idx));
  const renderChoice=()=>{openSheet(`${METHOD_LABEL[method]} · Struktur festlegen`,`<div class="method-config-note">Welche ${keepNeeded} bestehende${keepNeeded===1?" Übung":"n Übungen"} sollen neben „${esc(first.name)}“ erhalten bleiben? Es wird noch nichts am Plan geändert.</div><div class="picker-list">${others.map(x=>`<button class="exercise-card ${chosen.has(x.idx)?"selected":""}" data-keep-existing="${x.idx}" style="width:100%;text-align:left"><strong>${esc(x.exercise.name)}</strong><small>${chosen.has(x.idx)?"Wird übernommen":"Wird als Standard außerhalb der neuen Serie erhalten"}</small></button>`).join("")}</div><button id="confirmExistingSelection" class="primary" style="width:100%;margin-top:10px">Auswahl bestätigen</button>`,null,{replace:true});document.querySelectorAll("[data-keep-existing]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.keepExisting);if(chosen.has(id))chosen.delete(id);else if(chosen.size<keepNeeded)chosen.add(id);renderChoice()});$("confirmExistingSelection").onclick=()=>{if(chosen.size!==keepNeeded)return toast(`Bitte genau ${keepNeeded} Übung${keepNeeded===1?"":"en"} auswählen.`);const selected=others.filter(x=>chosen.has(x.idx));const detached=others.filter(x=>!chosen.has(x.idx)).map(x=>x.exercise);first._detachedAfterConversion=detached;startFlow(selected)}};
  renderChoice();return
 }
 startFlow(others)
}
function continueGroupAdd(flow){
 const members=currentPlan.exercises.filter(x=>x.techniqueGroup===flow.groupId);
 if(members.length>=flow.target){renderEditorExercises();return}
 const used=new Set(members.map(x=>x.name));
 openExercisePicker(name=>{
   const base=members[0],fresh=normPlanEx({...findExercise(name),sets:base.sets||3,setTechnique:flow.method,reps:base.reps||"8-12",rest:restSeconds(base,90),techniqueGroup:flow.groupId,methodData:{...(base.methodData||{})}});
   const groupIdx=currentPlan.exercises.map((x,i)=>x.techniqueGroup===flow.groupId?i:-1).filter(i=>i>=0);
   const insertAt=(groupIdx.length?Math.max(...groupIdx)+1:currentPlan.exercises.length);
   currentPlan.exercises.splice(insertAt,0,fresh);markEditorDirty();renderEditorExercises();persistUI();
   configureExercise(insertAt,flow)
 },{exclude:used,title:`${METHOD_LABEL[flow.method]} · Übung ${members.length+1} hinzufügen`,detailAdd:true})
}
function detachExerciseGroup(i){
 const ids=groupIndexesFor(i);if(!ids.length)return;if(!confirm("Verknüpfte Serie wirklich auflösen? Alle Übungen bleiben als Standardübungen erhalten."))return;
 ids.forEach(idx=>{const e=currentPlan.exercises[idx];e.techniqueGroup=null;e.setTechnique="standard";e.linkedExerciseNames=[];if(!e.reps||["20","30","20-30"].includes(String(e.reps)))e.reps="8-12"});
 markEditorDirty();renderEditorExercises();persistUI();toast("Verknüpfung gelöst")
}

let exercisePickerState={q:"",type:"Alle",muscles:[]};
function openExercisePicker(onPick,{returnToSheet=false,exclude=new Set(),title="Übung hinzufügen",detailAdd=false}={}){
 const all=allExercises().filter(x=>!exclude.has(x.name));let q=exercisePickerState.q||"",type=exercisePickerState.type||"Alle",muscles=new Set(exercisePickerState.muscles||[]);
 const filteredRows=()=>all.filter(x=>(type==="Alle"||(x.categories||[x.category]).includes(type))&&(!muscles.size||[...muscles].every(m=>(x.muscles||[]).includes(m)))&&(!q||[x.name,...(x.equipment||[]),...(x.variants||[])].join(" ").toLowerCase().includes(q))).sort(groupedExerciseSort);
 const rowsMarkup=rows=>rows.map(x=>`<div class="exercise-card picker-quick-card"><button class="picker-info" type="button" data-pick-info="${esc(x.name)}"><div><strong>${esc(x.name)}</strong><small>${esc(x.category)} · ${esc((x.muscles||[]).join(", "))}</small></div></button><button class="picker-quick-add" type="button" data-pick="${esc(x.name)}" aria-label="${esc(x.name)} hinzufügen">+</button></div>`).join("");
 const bindRows=()=>{
   document.querySelectorAll("[data-pick]").forEach(b=>b.onclick=e=>{e.stopPropagation();const name=b.dataset.pick;if(returnToSheet){onPick(name)}else{closeSheet({all:true});onPick(name)}});
   document.querySelectorAll("[data-pick-info]").forEach(b=>b.onclick=()=>{
    const name=b.dataset.pickInfo;
    if(detailAdd){
      closeSheet({all:true});
      openExerciseDetail(name,{onAdd:(picked)=>{onPick(picked)}})
    }else openExerciseDetail(name)
   })
 };
 const refreshRows=()=>{
   const rows=filteredRows(),count=$("pickerCount"),list=$("pickerRows");
   if(count)count.textContent=`${rows.length} Übungen`;
   if(list){list.innerHTML=rowsMarkup(rows);bindRows()}
 };
 const render=()=>{
  const types=orderedExerciseTypes(all),ms=orderedMuscles(all),rows=filteredRows();
  $("sheetBody").innerHTML=`<div class="search"><input id="pickerSearch" class="field" placeholder="Übung suchen" value="${esc(q)}"><button id="pickerClear">×</button></div><div class="chips">${types.map(x=>`<button class="chip ${type===x?"active":""}" data-pt="${esc(x)}">${esc(x)}</button>`).join("")}</div><div class="chips">${ms.map(x=>`<button class="chip ${(x==="Alle"&&!muscles.size)||muscles.has(x)?"active":""}" data-pm="${esc(x)}">${esc(x)}</button>`).join("")}</div><div id="pickerCount" class="small" style="margin:2px 0 8px">${rows.length} Übungen</div><div id="pickerRows">${rowsMarkup(rows)}</div>`;
  $("pickerSearch").oninput=()=>{q=$("pickerSearch").value.toLowerCase();exercisePickerState={q,type,muscles:[...muscles]};refreshRows()};
  $("pickerClear").onclick=()=>{q="";exercisePickerState={q,type,muscles:[...muscles]};$("pickerSearch").value="";refreshRows();$("pickerSearch").focus()};
  document.querySelectorAll("[data-pt]").forEach(b=>b.onclick=()=>{type=(type===b.dataset.pt&&type!=="Alle")?"Alle":b.dataset.pt;exercisePickerState={q,type,muscles:[...muscles]};render()});
  document.querySelectorAll("[data-pm]").forEach(b=>b.onclick=()=>{const m=b.dataset.pm;if(m==="Alle")muscles.clear();else muscles.has(m)?muscles.delete(m):muscles.add(m);exercisePickerState={q,type,muscles:[...muscles]};render()});
  bindRows()
 };
 openSheet(title,"");render()
}
function sortedPlansForPicker(query=""){return sortedPlans().filter(p=>(p.exercises||[]).length>0).filter(p=>!query||p.name.toLowerCase().includes(query.toLowerCase()))}
function planPickerMarkup(query=""){
 const rows=sortedPlansForPicker(query),defs=[["name","A–Z"],["created","Hinzugefügt"],["updated","Geändert"],["used","Genutzt"]];
 return`<div class="plan-picker-tools"><div class="search"><input id="planPickerSearch" class="field" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" placeholder="Plan suchen" value="${esc(query)}"><button id="planPickerClear">×</button></div><div class="chips">${defs.map(([k,l])=>`<button class="chip ${planSort.key===k?"active":""}" data-picker-sort="${k}">${l}${planSort.key===k?(planSort.dir>0?" ↑":" ↓"):""}</button>`).join("")}</div></div><div id="planPickerRows">${rows.map(p=>`<button class="plan-card" data-start="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span class="chev">›</span></button>`).join("")||'<div class="small">Keine passenden Pläne.</div>'}</div>`
}
let activeHomeClockTimer=null;
function currentWorkoutExerciseLabel(){
 if(!activeWorkout)return"";
 const idx=(activeWorkout.exercises||[]).findIndex(e=>(e.liveSets||[]).some(s=>!s.completed));
 const i=idx<0?Math.max(0,(activeWorkout.exercises||[]).length-1):idx;
 const ex=activeWorkout.exercises?.[i];
 return ex?`Aktuell: ${ex.name} · ${i+1}/${activeWorkout.exercises.length}`:""
}
function updateActiveHomeClock(){const el=$("activeHomeClock");if(el&&activeWorkout)el.textContent=formatDuration(Date.now()-activeWorkout.startedAt)}
function completedSetsOfExercise(e){return(e?.liveSets||[]).filter(s=>s.completed)}
function completedExerciseCount(w){return(w?.exercises||[]).filter(e=>{const planned=(e?.liveSets||[]).length||Number(e?.sets)||0,done=completedSetsOfExercise(e).length;return planned>0&&done===planned}).length}
function completedSetCount(w){return(w?.exercises||[]).reduce((n,e)=>n+completedSetsOfExercise(e).length,0)}
function historyPlanExists(w){return plans.some(p=>String(p.id)===String(w.planId))}
function historyDateTime(w){
 const d=new Date(w.finishedAt||w.startedAt||Date.now());
 return `${d.toLocaleDateString("de-DE")} · ${d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}`
}
function renderTrainingHome(){
 clearInterval(activeHomeClockTimer);
 $("activeBanner").innerHTML=activeWorkout?`<div class="active-workout-card"><button class="active-resume-area" id="resumeWorkout"><div class="space"><div><div class="active-kicker">Training läuft</div><div class="active-name">${esc(activeWorkout.name)}</div><div class="active-meta">${activeWorkout.exercises?.length||0} Übungen · ${workoutSetCount(activeWorkout)} Sätze</div></div><div id="activeHomeClock" class="active-time">${formatDuration(Date.now()-activeWorkout.startedAt)}</div></div><div class="active-current">${esc(currentWorkoutExerciseLabel())}</div></button><div class="active-workout-actions"><button id="homeDiscardWorkout" class="secondary danger">Verwerfen</button><button id="homeFinishWorkout" class="secondary">Beenden</button></div></div>`:"";
 $("startTrainingCard").classList.toggle("hidden",!!activeWorkout);
 if(activeWorkout){$("resumeWorkout").onclick=()=>openLive();$("homeFinishWorkout").onclick=openFinishWorkoutSheet;$("homeDiscardWorkout").onclick=discardWorkoutAsked;activeHomeClockTimer=setInterval(updateActiveHomeClock,1000)}
 $("historyList").innerHTML=history.slice().reverse().slice(0,30).map((w,i)=>{const idx=history.length-1-i,exists=historyPlanExists(w),ex=completedExerciseCount(w),sets=completedSetCount(w);return`<div class="plan-card history-card ${exists?"":"history-orphan"}"><div ${exists?`data-history="${idx}"`:""}><strong>${esc(w.name||w.planName||"Training")}</strong><small>${historyDateTime(w)} · ${ex} abgeschlossene Übung${ex===1?"":"en"} · ${sets} abgeschlossene Sätze${exists?"":" · Plan gelöscht"}</small></div><div class="history-actions">${exists?`<button class="icon-btn" data-history-open="${idx}">›</button>`:""}<button class="icon-btn danger" data-history-delete="${idx}">−</button></div></div>`}).join("")||'<div class="card small">Noch keine Trainings.</div>';
 document.querySelectorAll("[data-history-open]").forEach(b=>b.onclick=()=>openSummary(history[Number(b.dataset.historyOpen)]));
 document.querySelectorAll("[data-history]").forEach(b=>b.onclick=()=>openSummary(history[Number(b.dataset.history)]));
 document.querySelectorAll("[data-history-delete]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.historyDelete);if(confirm("Diesen Verlaufseintrag löschen?")){history.splice(i,1);saveAll();renderTrainingHome()}});
}
$("clearHistoryBtn").onclick=()=>{if(history.length&&confirm("Gesamten Trainingsverlauf löschen?")){history=[];saveAll();renderTrainingHome()}};
$("choosePlanStart").onclick=()=>openPlanStartSheet();
function openPlanStartSheet(){
 if(!plans.length){
  currentPlan={id:uid(),name:"",createdAt:Date.now(),updatedAt:Date.now(),exercises:[],_isNew:true};
  setEditorBaseline();openPlanEditor();return
 }
 let q="";
 const bindRows=()=>document.querySelectorAll("[data-start]").forEach(b=>b.onclick=()=>{openPreStart(Number(b.dataset.start))});
 const refreshRows=()=>{
  const rows=sortedPlansForPicker(q);
  $("planPickerRows").innerHTML=rows.map(p=>`<button class="plan-card" data-start="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span class="chev">›</span></button>`).join("")||'<div class="small">Keine passenden Pläne.</div>';
  bindRows()
 };
 const render=()=>{
  $("sheetBody").innerHTML=planPickerMarkup(q);
  const planSearch=$("planPickerSearch");
  planSearch.oninput=()=>{q=planSearch.value;refreshRows();requestAnimationFrame(()=>{if(document.activeElement!==planSearch)planSearch.focus({preventScroll:true});window.rethinkKeepFieldVisibleV24?.(planSearch)})};
  $("planPickerClear").onclick=()=>{q="";planSearch.value="";refreshRows();planSearch.focus({preventScroll:true});window.rethinkKeepFieldVisibleV24?.(planSearch)};
  document.querySelectorAll("[data-picker-sort]").forEach(b=>b.onclick=()=>{if(planSort.key===b.dataset.pickerSort)planSort.dir*=-1;else{planSort.key=b.dataset.pickerSort;planSort.dir=1}render()});
  bindRows()
 };
 openSheet("Trainingsplan auswählen","");render()
}
function previewVisualGroups(exercises){
 const out=[];
 (exercises||[]).forEach((e,i)=>{
  if(groupMethod(e.setTechnique)&&e.techniqueGroup){
   const prev=out[out.length-1];
   if(prev&&prev.key===e.techniqueGroup)prev.items.push(e);else out.push({key:e.techniqueGroup,method:e.setTechnique,items:[e]})
  }else out.push({key:`p_${i}`,method:e.setTechnique||"standard",items:[e]})
 });
 return out
}
function previewMemberHeader(e,j,method){
 const letter=groupMethod(method)?String.fromCharCode(65+j):"";
 return `<div class="preview-group-member"><div class="live-card-head"><div><div class="live-single-title-row"><button class="exercise-title-link">${letter?`<span class="group-letter">${letter}</span><span class="group-title-name">${esc(exerciseDisplayName(e))}</span>`:esc(exerciseDisplayName(e))}</button></div>${exerciseInlineMeta(e)}<div class="prescription">${esc(planPrescription(e))}</div></div></div></div>`
}
function previewGroupRounds(g){
 const rounds=Math.max(1,...g.items.map(e=>e.liveSets?.length||e.sets||1));let html="";
 for(let si=0;si<rounds;si++){
  html+=`<div class="preview-combined-round"><div class="group-round-title">Satz ${si+1}</div>`;
  g.items.forEach((e,gi)=>{
   const s=e.liveSets?.[si]||initSet(e,si),idx=`${si+1}${String.fromCharCode(65+gi)}`;
   if(e.measureMode==="time"){
    html+=`<div class="preview-combined-time-row"><span class="combined-index">${idx}</span><div class="preview-labeled-field"><span>ZEIT</span><b>${formatTime(s.time||e.timeSeconds||60)}</b></div><div class="preview-labeled-field preview-performance"><span>LEISTUNG</span><b>Leistung</b></div></div>`;
   }else{
    html+=`<div class="preview-combined-rep-row"><span class="combined-index">${idx}</span><div class="preview-labeled-field"><span>KG</span><b>KG</b></div><div class="preview-labeled-field"><span>WDH.</span><b>${esc(liveRepBoxSuggestion(e,s))}</b></div></div>`;
   }
  });
  html+=`</div>`;
 }
 return html
}
function previewMethodCard(g){
 const grouped=groupMethod(g.method);
 return `<div class="method-card method-${g.method} ${grouped?"connected-method-card":""}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="method-help">${esc(methodHelp(g.method))}</div>${g.items.map((e,j)=>previewMemberHeader(e,j,g.method)).join("")}${grouped?previewGroupRounds(g):g.items.map(e=>renderPreviewSets(e)).join("")}</div>`
}
function openPreview(p){
 $("previewTitle").textContent=p.name||"Workout Vorschau";
 const pp={...clone(p),exercises:clone(p.exercises).map(e=>{const x=normPlanEx(e);x.liveSets=Array.from({length:Number(x.sets)||defaultSetsForExerciseMethod(x,x.setTechnique||"standard")},(_,i)=>initSet(x,i));return x})};
 $("previewBody").innerHTML=`<div class="preview-live-shell">${previewVisualGroups(pp.exercises).map(previewMethodCard).join("")}</div>`;
 openPage("previewPage")
}
function renderPreviewSets(e){
 const staticCell=(txt,cls="preview-value")=>`<span class="${cls}">${esc(String(txt??""))}</span>`;
 if(e.measureMode==="time"){
  return `<div class="preview-single-time"><div class="preview-single-time-head"><span>SATZ</span><span>ZEIT</span><span>LEISTUNG</span></div>${e.liveSets.map((s,si)=>`<div class="preview-single-time-row"><span>${si+1}</span><b>${formatTime(s.time||e.timeSeconds||60)}</b><b>Leistung</b></div>`).join("")}</div>`
 }
 if(e.setTechnique==="cluster"){
  return e.liveSets.map((s,si)=>{const t=targetVisibleSegments(e,s),segs=t.items.map(x=>[x.seg,x.index]);return`<div class="cluster-set-block"><div class="cluster-head"><span>SATZ ${si+1}</span><span>KG</span><span>WDH.</span></div>${segs.map(([g,gi])=>`<div class="cluster-row preview-static-row"><span>${gi+1}</span>${staticCell("KG")}${staticCell(g.reps||"WDH.")}</div>`).join("")}</div>`}).join("")
 }
 if(["dropset","restpause"].includes(e.setTechnique)){
  return e.liveSets.map((s,si)=>`<div class="advanced-head"><span>SATZ ${si+1}</span><span></span><span>KG</span><span>WDH.</span><span></span><span></span></div>${s.segments.map((g,gi)=>`<div class="advanced-row preview-static-row"><span>${gi+1}</span><span class="small">${esc(g.label)}</span>${staticCell("KG")}${staticCell(g.reps||"WDH.")}<span></span><span></span></div>`).join("")}`).join("")
 }
 return `<div class="set-head"><span>SATZ</span><span>KG</span><span>WDH.</span><span></span><span></span></div>${e.liveSets.map((s,si)=>`<div class="set-row preview-static-row"><span>${si+1}</span>${staticCell("KG")}${staticCell(s.reps||"WDH.")}<span></span><span></span></div>`).join("")}`
}
function openPreStart(id){
 const p=plans.find(x=>String(x.id)===String(id));
 if(!p)return;
 if(!(p.exercises||[]).length)return alert("Dieser Plan enthält noch keine Übung und kann nicht gestartet werden.");
 pendingStartPlan=p;
 confirmAndStartPlan(p)
}
$("confirmStartBtn").onclick=()=>startWorkout(pendingStartPlan);$("preStartTopPlay").onclick=()=>startWorkout(pendingStartPlan);
function lastWorkoutForPlan(p){
 const ids=new Set([p.id,p.sourcePlanId,...(p.sourcePlanIds||[]),...(p.weekSourceIds||[])].filter(Boolean).map(String));
 for(let i=history.length-1;i>=0;i--){
  const w=history[i],wids=[w.planId,w.sourcePlanId,...(w.sourcePlanIds||[]),...(w.weekSourceIds||[])].filter(Boolean).map(String);
  if(wids.some(id=>ids.has(id))||w.planName===p.name||w.name===p.name)return w
 }
 return null
}
function copySuggestion(target,prev){
 if(!target||!prev)return;
 if(target.group&&prev.group){target.segments.forEach((g,i)=>{const pg=prev.segments?.find(x=>x.name===g.name)||prev.segments?.[i];if(pg)g._suggested={weight:pg.weight||"",reps:pg.reps||""}});return}
 if(target.segments&&prev.segments){target.segments.forEach((g,i)=>{const pg=prev.segments?.[i];if(pg)g._suggested={weight:pg.weight||"",reps:pg.reps||""}});return}
 target._suggested={weight:prev.weight||"",reps:prev.reps||"",level:prev.level||"",time:prev.time||""}
}
function applyPreviousWorkoutSuggestions(p){
 if(!p)return;
 (p.exercises||[]).forEach(e=>{
  let prev=null;
  for(let hi=history.length-1;hi>=0&&!prev;hi--){
   const matches=(history[hi].exercises||[]).filter(x=>String(x.name||"")===String(e.name||"")&&String(x.setTechnique||"standard")===String(e.setTechnique||"standard")&&String(x.measureMode||"reps")===String(e.measureMode||"reps"));
   for(let mi=matches.length-1;mi>=0;mi--){const done=(matches[mi].liveSets||[]).filter(s=>s.completed||s.segments?.some(g=>g.completed));if(done.length){prev={exercise:matches[mi],sets:done};break}}
  }
  if(!prev)return;
  (e.liveSets||[]).forEach((s,i)=>{if(prev.sets[i])copySuggestion(s,prev.sets[i])});
  e._lastRatings=prev.sets.map(s=>s.rating||s.segments?.find(g=>g.rating)?.rating||"")
 })
}
function effectiveValue(value,suggested){return String(value??"").trim()!==""?value:(suggested??"")}
function suggestedComplete(e,s){
 if(e.measureMode==="time")return Number(s.time)>0&&!!(s._touched||s._timedOnce);
 if(s.group)return s.segments.every(g=>effectiveValue(g.weight,g._suggested?.weight)!==""&&Number(effectiveValue(g.reps,g._suggested?.reps))>0);
 if(s.segments)return s.segments.every(g=>effectiveValue(g.weight,g._suggested?.weight)!==""&&Number(effectiveValue(g.reps,g._suggested?.reps))>0);
 return effectiveValue(s.weight,s._suggested?.weight)!==""&&Number(effectiveValue(s.reps,s._suggested?.reps))>0
}
function promoteSuggested(e,s){
 if(!s)return;
 if(s.group||s.segments){(s.segments||[]).forEach(g=>{const sug=g?._suggested;if(!sug)return;if(String(g.weight??"").trim()===""&&String(sug.weight??"").trim()!=="")g.weight=sug.weight;if(String(g.reps??"").trim()===""&&String(sug.reps??"").trim()!=="")g.reps=sug.reps});return}
 const sug=s._suggested;if(!sug)return;
 if(String(s.weight??"").trim()===""&&String(sug.weight??"").trim()!=="")s.weight=sug.weight;
 if(String(s.reps??"").trim()===""&&String(sug.reps??"").trim()!=="")s.reps=sug.reps;
 if(String(s.level??"").trim()===""&&String(sug.level??"").trim()!=="")s.level=sug.level
}
function inputSuggestionAttr(v){return String(v??"").trim()!==""?` placeholder="${esc(v)}"`:""}
function initSet(e,i){
 if(e.measureMode==="time"){
  const origin=Math.max(15,Number(e.timeSeconds)||60);
  return{time:origin,_timerOrigin:origin,weight:"",level:e.level||"",completed:false,rating:"",_suggested:{level:"Leistung"}}
 }
 if(groupMethod(e.setTechnique)){
  const r=amrapText(e.reps||defaultRepsForMethod(e.setTechnique||"standard"));
  return{weight:"",reps:"",completed:false,rating:"",_suggested:{reps:r}}
 }
 if(["dropset","restpause","cluster"].includes(e.setTechnique)){
  const len=e.setTechnique==="dropset"?(e.methodData?.dropCount||2)+1:e.setTechnique==="cluster"?Math.max(Number(e.methodData?.blocks)||4,Math.ceil((Number(e.reps)||8)/Math.max(1,Number(e.methodData?.clusterReps)||2))):(e.methodData?.maxBlocks||6);
  const segments=Array.from({length:len},(_,g)=>({
    label:e.setTechnique==="dropset"?(g?`Drop ${g}`:"Basis"):e.setTechnique==="restpause"?(g?`RP ${g}`:"Start"):"",
    weight:"",reps:"",completed:false,
    _suggested:e.setTechnique==="cluster"?{reps:String(e.methodData?.clusterReps||2)}:{}
  }));
  return{segments,completed:false,rating:""}
 }
 if(e.setTechnique==="pyramid"){
  ensurePyramidData(e);
  return{weight:"",reps:"",completed:false,rating:"",_suggested:{reps:String((e.methodData?.reps||[])[i]||8)}}
 }
 if(e.setTechnique==="backoff"){
  const r=i===0?(e.methodData?.topReps||5):(e.methodData?.backoffReps||8);
  return{weight:"",reps:String(r),completed:false,rating:""}
 }
 return{weight:"",reps:"",completed:false,rating:"",_suggested:{reps:amrapText(e.reps||"8-12")}}
}
function startWorkout(p){requestTimerNotifications();if(!p||(p.exercises||[]).length===0)return alert("Ein leeres Training kann nicht gestartet werden.");const stored=plans.find(x=>x.id===p.id);if(stored)stored.lastUsedAt=Date.now();const previous=lastWorkoutForPlan(p);activeWorkout={id:uid(),planId:stored?p.id:(p.sourcePlanId||null),sourcePlanId:p.sourcePlanId||(stored?p.id:null),startedFromUnsavedPlan:!!p.transientEditorPlan,name:p.name,planName:p.name,startedAt:Date.now(),note:"",restEnd:0,activeExerciseIndex:0,structureBaseline:null,weekSourceIds:clone(p.weekSourceIds||[]),weekDate:p.weekDate||null,isWeekCombined:Array.isArray(p.weekSourceIds)&&p.weekSourceIds.length>0,exercises:clone(p.exercises).map(e=>({...normPlanEx(e),liveSets:Array.from({length:Number(e.sets)||defaultSetsForExerciseMethod(e,e.setTechnique||"standard")},(_,i)=>initSet(e,i))}))};activeWorkout.structureBaseline=clone(activeWorkout.exercises);applyPreviousWorkoutSuggestions(activeWorkout,previous);tabScroll.training=0;if(tabUiState.training)tabUiState.training.scroll=0;
saveAll();
currentTab="training";
document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
pageStack=[];
$("bottomNav").classList.remove("hidden");
showTab("training",{reset:false});
renderTrainingHome();
requestAnimationFrame(()=>{renderTrainingHome();openLive(false);requestAnimationFrame(()=>{renderLive();$("livePage").scrollTop=0;focusLiveExercise(0,"auto");persistUI()})})
}
function liveCardIndexesV13(card){return String(card?.dataset?.liveMembers||card?.dataset?.liveCard||"").split(",").map(Number).filter(Number.isFinite)}
function liveExerciseCompleteV13(e){return !!e&&(e.liveSets||[]).length>0&&(e.liveSets||[]).every(s=>!!s.completed)}
function liveCardCompleteV13(card){const ids=liveCardIndexesV13(card);return ids.length>0&&ids.every(i=>liveExerciseCompleteV13(activeWorkout?.exercises?.[i]))}
function refreshActiveWorkoutCardV13(scroll=false){
 if(!activeWorkout)return;
 const idx=Math.max(0,Math.min(Number(activeWorkout.activeExerciseIndex)||0,(activeWorkout.exercises||[]).length-1));
 document.querySelectorAll(".live-exercise-card[data-live-card]").forEach(card=>{
   const current=liveCardIndexesV13(card).includes(idx),complete=liveCardCompleteV13(card);
   card.classList.toggle("live-method-complete",complete);
   card.classList.toggle("active-live-exercise",current&&!complete)
 });
 if(scroll){
   const card=[...document.querySelectorAll(".live-exercise-card[data-live-card]")].find(c=>liveCardIndexesV13(c).includes(idx));
   card?.scrollIntoView?.({block:"start",behavior:"auto"})
 }
}
function setActiveExercise(index,scroll=false,behavior="auto"){
 if(!activeWorkout)return;
 index=Math.max(0,Math.min(Number(index)||0,(activeWorkout.exercises||[]).length-1));
 activeWorkout.activeExerciseIndex=index;saveAll();
 refreshActiveWorkoutCardV13(false);
 if(scroll){
  const card=[...document.querySelectorAll(".live-exercise-card[data-live-card]")].find(c=>liveCardIndexesV13(c).includes(index));
  if(card)requestAnimationFrame(()=>card.scrollIntoView({block:"start",behavior:behavior==="smooth"?"smooth":"auto"}))
 }
}
function focusLiveExercise(index=0,behavior="auto"){
 setActiveExercise(index,false,behavior);
 requestAnimationFrame(()=>{
  const page=$("livePage");
  const card=[...document.querySelectorAll("#liveBody .live-exercise-card[data-live-card]")].find(c=>liveCardIndexesV13(c).includes(Number(index)));
  if(!page||!card)return;
  const header=page.querySelector(".page-top");
  const top=Math.max(0,card.offsetTop-(header?.offsetHeight||0)-10);
  page.scrollTo({top,behavior:behavior==="smooth"?"smooth":"auto"})
 })
}
function openLive(focus=false){if(!activeWorkout)return;$("liveTitle").textContent=activeWorkout.name;renderLive();openPage("livePage");clearInterval(clockTimer);clockTimer=setInterval(()=>$("liveClock").textContent=formatDuration(Date.now()-activeWorkout.startedAt),1000);if(restEnd>Date.now())startRest(Math.ceil((restEnd-Date.now())/1000),true);else restoreRestTimer();focusLiveExercise(focus?0:(activeWorkout.activeExerciseIndex||0),"auto")}
$("workoutNoteBtn").onclick=()=>{if(!activeWorkout)return;const v=prompt("Trainingsnotiz",activeWorkout.note||"");if(v!==null){activeWorkout.note=v.trim();saveAll();renderLive()}};
function leaveLiveToTraining(){
 saveAll();persistUI();clearInterval(clockTimer);document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));pageStack=[];$("bottomNav").classList.remove("hidden");showTab("training",{reset:false})
}
$("liveBackBtn").onclick=()=>leaveLiveToTraining();
function liveVisualGroups(exercises){
 const out=[],seen=new Set();
 (exercises||[]).forEach((e,i)=>{
  if(groupMethod(e.setTechnique)&&e.techniqueGroup){
   if(seen.has(e.techniqueGroup))return;
   const members=[];(exercises||[]).forEach((x,j)=>{if(x.techniqueGroup===e.techniqueGroup)members.push({e:x,i:j})});
   seen.add(e.techniqueGroup);out.push({group:true,method:e.setTechnique,key:e.techniqueGroup,members})
  }else out.push({group:false,method:e.setTechnique||"standard",key:`single_${i}`,members:[{e,i}]})
 });
 return out
}
function combinedMemberControls(x,si,gi,showLabels=true){
 const s=x.e.liveSets?.[si];if(!s)return"";
 const idx=`${si+1}${String.fromCharCode(65+gi)}`,lab=txt=>`<span class="${showLabels?"":"combined-label-hidden"}">${txt}</span>`;
 if(x.e.measureMode==="time"){
  return`<div class="combined-member-row combined-time-row"><span class="combined-index">${idx}</span><label class="combined-field">${lab("ZEIT")}<input type="text" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="${s.completed?"rated-time-value":""}" data-time-field="1" data-input="${x.i}|${si}|time" placeholder="${liveTimeBoxPlaceholder(s)}" value="${liveTimeBoxValue(s)}"></label><button class="time-play" data-time-play="${x.i}|${si}">▶</button><label class="combined-field">${lab("LEISTUNG")}<input type="text" data-input="${x.i}|${si}|level" placeholder="Leistung" value="${esc(s.level||"")}"></label><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(x.e,s)?"ready":""}" data-check="${x.i}|${si}">✓</button></div>`
 }
 return`<div class="combined-member-row"><span class="combined-index">${idx}</span><label class="combined-field">${lab("KG")}<input type="text" inputmode="decimal" data-input="${x.i}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight||"")}"></label><label class="combined-field">${lab("WDH.")}<input type="text" inputmode="numeric" data-input="${x.i}|${si}|reps" placeholder="${esc(liveRepBoxSuggestion(x.e,s))}" value="${esc(s.reps||"")}"></label><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(x.e,s)?"ready":""}" data-check="${x.i}|${si}">✓</button></div>`
}
function renderLiveGroupCard(g){
 const first=g.members[0],complete=liveGroupComplete(g);
 const active=g.members.some(x=>Number(activeWorkout.activeExerciseIndex||0)===x.i)&&!complete;
 const rounds=Math.max(...g.members.map(x=>x.e.liveSets?.length||x.e.sets||0));let rows="";
 for(let si=0;si<rounds;si++){
  rows+=`<div class="combined-round"><div class="group-round-title"><span>Satz ${si+1}</span><button class="remove-mini" data-remove-live-set="${first.i}|${si}">−</button></div>`;
  const seenModes=new Set();
  g.members.forEach((x,gi)=>{const mode=x.e.measureMode==="time"?"time":"reps",show=!seenModes.has(mode);seenModes.add(mode);rows+=combinedMemberControls(x,si,gi,show)});
  rows+=`</div>`
 }
 const head=g.members.map((x,gi)=>`<div class="live-group-member-head"><div class="live-group-member-copy"><div class="live-group-title-row"><button class="exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}"><span class="group-letter">${String.fromCharCode(65+gi)}</span><span class="group-title-name">${esc(exerciseDisplayName(x.e))}</span></button></div>${exerciseInlineMeta(x.e)}<div class="prescription connected-prescription">${esc(planPrescription(x.e))}</div><button class="note-line connected-note-line" data-live-note="${x.i}" style="border:0;background:transparent;padding:0">✎ ${esc(x.e.note||"Notiz")}</button></div><button class="icon-btn live-group-member-edit" data-live-config="${x.i}">✎</button><button class="live-group-member-delete" data-delete-live-ex="${x.i}">−</button></div>`).join("");
 return`<div class="method-card live-exercise-card connected-live-card method-${g.method} ${active?"active-live-exercise":""} ${complete?"live-method-complete":""}" data-live-card="${first.i}" data-live-members="${g.members.map(x=>x.i).join(",")}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="method-help">${esc(methodHelp(g.method))}</div><div class="combined-series-head">${head}</div>${rows}<button class="secondary" data-add-group-set="${esc(g.key)}" style="margin-top:8px">Satz hinzufügen</button></div>`
}
function renderLiveSingleCard(e,i){
 const complete=liveExerciseComplete(e);return`<div class="method-card live-exercise-card method-${e.setTechnique||"standard"} ${Number(activeWorkout.activeExerciseIndex||0)===i&&!complete?"active-live-exercise":""} ${complete?"live-method-complete":""}" data-live-card="${i}"><div class="method-name">${METHOD_LABEL[e.setTechnique||"standard"]}</div><div class="method-help">${esc(methodHelp(e.setTechnique))}</div><div class="live-card-head"><div><div class="live-single-title-row"><button class="exercise-title-link" data-live-detail="${esc(e.name)}" data-live-index="${i}">${esc(exerciseDisplayName(e))}</button></div>${exerciseInlineMeta(e)}<div class="prescription">${esc(planPrescription(e))}</div></div><div class="live-card-actions"><button class="icon-btn" data-live-config="${i}" aria-label="Übung bearbeiten">✎</button><button class="live-delete-ex" data-delete-live-ex="${i}" aria-label="Übung löschen">−</button></div></div><button class="note-line" data-live-note="${i}" style="border:0;background:transparent;padding:0">✎ ${esc(e.note||"Notiz")}</button>${renderSets(e,i)}<button class="secondary" data-add-set="${i}" style="margin-top:8px">Satz hinzufügen</button></div>`
}
function renderLive(){
 $("workoutNoteText").textContent=activeWorkout.note||"Notiz";
 $("liveBody").innerHTML=liveVisualGroups(activeWorkout.exercises).map(g=>g.group?renderLiveGroupCard(g):renderLiveSingleCard(g.members[0].e,g.members[0].i)).join("");
 document.querySelectorAll("[data-time-field]").forEach(inp=>{inp.onfocus=()=>inp.select();inp.onclick=()=>inp.select()});
 document.querySelectorAll("[data-live-detail]").forEach(b=>b.onclick=()=>{const i=Number((b.dataset.liveIndex ?? b.closest("[data-live-card]")?.dataset.liveCard) || 0);setActiveExercise(i);exerciseDetailReturn={type:"live",index:i};openExerciseDetail(b.dataset.liveDetail)});
 document.querySelectorAll("[data-live-config]").forEach(b=>b.onclick=()=>{setActiveExercise(Number(b.dataset.liveConfig));configureLiveExercise(Number(b.dataset.liveConfig))});
 document.querySelectorAll("[data-delete-live-ex]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.deleteLiveEx);if(confirm(`„${activeWorkout.exercises[i].name}“ aus dem Training löschen?`)){const removed=activeWorkout.exercises.splice(i,1)[0];normalizeBrokenLiveGroupAfterDelete(removed);livePlanEdited=true;saveAll();renderLive()}});
 document.querySelectorAll("[data-live-note]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.liveNote),v=prompt("Notiz",activeWorkout.exercises[i].note||"");if(v!==null){activeWorkout.exercises[i].note=v.trim();saveAll();renderLive()}});
 document.querySelectorAll("[data-check]").forEach(b=>b.onclick=()=>{setActiveExercise(Number(b.dataset.check.split("|")[0]));toggleSet(b.dataset.check)});
 document.querySelectorAll("[data-segment-check]").forEach(b=>b.onclick=()=>{const [ei,si,gi]=b.dataset.segmentCheck.split("|").map(Number);setActiveExercise(ei);const g=activeWorkout.exercises[ei].liveSets[si].segments[gi];if(g.completed){g.completed=false;g.rating="";activeWorkout.exercises[ei].liveSets[si].completed=false;saveAll();renderLive()}else openSegmentRating(ei,si,gi)});
 document.querySelectorAll("[data-input]").forEach(x=>{
  x.oninput=()=>{setActiveExercise(Number(x.dataset.input.split("|")[0]));touchInput(x);updateInput(x)};
  x.onchange=()=>updateInput(x);
  x.onblur=()=>{updateInput(x);setTimeout(()=>{const a=document.activeElement;if(!a||!a.matches("[data-input]"))renderLive()},0)};
  if(x.dataset.timeField){x.onfocus=()=>setTimeout(()=>x.select(),0);x.addEventListener("click",ev=>{ev.stopPropagation();x.select()})}
  x.addEventListener("pointerdown",ev=>ev.stopPropagation());if(!x.dataset.timeField)x.addEventListener("click",ev=>ev.stopPropagation())
 });
 document.querySelectorAll("[data-add-set]").forEach(b=>b.onclick=()=>{const e=activeWorkout.exercises[Number(b.dataset.addSet)];e.liveSets.push(initSet(e,e.liveSets.length));livePlanEdited=true;saveAll();renderLive()});
 document.querySelectorAll("[data-add-group-set]").forEach(b=>b.onclick=()=>{const gid=b.dataset.addGroupSet,members=activeWorkout.exercises.map((x,i)=>x.techniqueGroup===gid?i:-1).filter(i=>i>=0);members.forEach(i=>{const e=activeWorkout.exercises[i];e.liveSets.push(initSet(e,e.liveSets.length));e.sets=e.liveSets.length});livePlanEdited=true;saveAll();renderLive()});
 document.querySelectorAll("[data-remove-live-set]").forEach(b=>b.onclick=()=>removeLiveSet(b.dataset.removeLiveSet));
 document.querySelectorAll("[data-time-play]").forEach(b=>b.onclick=()=>toggleTimeTimer(b.dataset.timePlay,b));
}
function advancedTarget(e){return Math.max(1,Number(e.reps)||1)}
function normalizeTargetSegments(e,s){
 const target=advancedTarget(e);let total=0,reachedAt=-1;
 (s.segments||[]).forEach((seg,i)=>{if(reachedAt>=0){seg.reps="";seg.completed=false;return}const r=Math.max(0,Number(seg.reps)||0);total+=r;if(total>=target)reachedAt=i});
 return{target,total,reached:reachedAt>=0,reachedAt}
}
function targetVisibleSegments(e,s){
 const x=normalizeTargetSegments(e,s),max=x.reached?x.reachedAt+1:(s.segments||[]).length;
 return{...x,items:(s.segments||[]).slice(0,max).map((seg,index)=>({seg,index}))}
}
function restPauseTarget(e){return Math.max(1,Number(e.reps)||20)}
function restPauseVisibleSegments(e,s){return targetVisibleSegments(e,s)}
function restPauseComplete(e,s){
 const x=restPauseVisibleSegments(e,s);
 return x.reached&&x.items.every(({seg})=>validKg(seg.weight)&&validReps(seg.reps))
}
function liveRepBoxSuggestion(e,s){
 const raw=String(s?._suggested?.reps||amrapText(e?.reps||"WDH.")).trim();
 return /AMRAP/i.test(raw)?"MAX":raw
}
function liveTimeBoxValue(s){return s?._manualTime||s?._timerRunning?formatTime(s.time):""}
function liveTimeBoxPlaceholder(s){return formatTime(Number(s?._timerOrigin)||Number(s?.time)||60)}
function renderSets(e,ei){
 if(groupMethod(e.setTechnique)){return e.liveSets.map((s,si)=>`<div class="group-round"><div class="group-round-title">Runde ${si+1}</div>${s.segments.map((g,gi)=>`<div class="group-ex-row group-ex-rated"><span class="group-ex-name">${String.fromCharCode(65+gi)} · ${esc(g.name)}</span><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|gw|${gi}" placeholder="${esc(g._suggested?.weight||"KG")}" value="${esc(g.weight)}"><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|gr|${gi}" placeholder="${esc(g._suggested?.reps||"WDH.")}" value="${esc(g.reps)}"><button class="set-check ${g.completed?"done":""} ${g.rating?`rating-${g.rating}`:""} ${segmentHasValues(g)?"ready":""}" data-segment-check="${ei}|${si}|${gi}">✓</button></div><div class="rating-row group-rating-row"><span class="rating-label">BEW.</span><div class="small">${g.completed?`Bewertet: ${ratingLabel(g.rating)}`:segmentHasValues(g)?"Haken drücken und bewerten":"KG und WDH. eintragen"}</div></div>`).join("")}<div class="group-round-foot"><span class="small">${s.completed?"Runde abgeschlossen":"Alle Übungen einzeln bewerten"}</span><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button></div></div>`).join("")}

 if(e.measureMode==="time"){
  return`<div class="time-head"><span>SATZ</span><span>ZEIT</span><span></span><span>LEISTUNG</span><span></span><span></span></div>${e.liveSets.map((s,si)=>`<div class="time-row"><span>${si+1}</span><input type="text" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="${s.completed?"rated-time-value":""}" data-time-field="1" data-input="${ei}|${si}|time" placeholder="${liveTimeBoxPlaceholder(s)}" value="${liveTimeBoxValue(s)}"><button class="time-play" data-time-play="${ei}|${si}">▶</button><input type="text" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|level" placeholder="${esc(s._suggested?.level||"Leistung")}" value="${esc(s.level||"")}"><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(e,s)?"ready":""}" data-check="${ei}|${si}">✓</button><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button></div>${ratingMarkup(ei,si,s)}`).join("")}`
 }
 if(e.setTechnique==="cluster"){
  return e.liveSets.map((s,si)=>{
   const targetInfo=targetVisibleSegments(e,s),segs=targetInfo.items.map(x=>[x.seg,x.index]);
   return`<div class="advanced-compact-set cluster-set-block">
     <div class="advanced-compact-head"><span>SATZ ${si+1}</span><span>KG</span><span>WDH.</span><span></span><span></span></div>
     ${segs.map(([g,gi],ri)=>{
       const last=ri===segs.length-1;
       return`<div class="advanced-compact-row">
         <span>${gi+1}</span>
         <input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sw|${gi}" placeholder="${esc(g._suggested?.weight||"KG")}" value="${esc(g.weight)}">
         <input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sr|${gi}" placeholder="${esc(g._suggested?.reps||"WDH.")}" value="${esc(g.reps)}">
         ${last?`<button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(e,s)?"ready":""}" data-check="${ei}|${si}">✓</button><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button>`:`<span></span><span></span>`}
       </div>${!last?`<div class="intraset-rest-divider"><span></span><b>${Number(e.methodData?.intraRest)||20}s Pause</b><span></span></div>`:""}`
     }).join("")}
     ${ratingMarkup(ei,si,s)}
   </div>`
  }).join("")
 }
 if(e.setTechnique==="restpause"){
  return e.liveSets.map((s,si)=>{
   const targetInfo=targetVisibleSegments(e,s),segs=targetInfo.items.map(x=>[x.seg,x.index]);
   return`<div class="advanced-compact-set restpause-set-block">
     <div class="advanced-compact-head"><span>SATZ ${si+1}</span><span>KG</span><span>WDH.</span><span></span><span></span></div>
     ${segs.map(([g,gi],ri)=>{
       const last=ri===segs.length-1;
       return`<div class="advanced-compact-row">
         <span class="advanced-compact-index">${gi+1}${g.label?`<small>${esc(g.label)}</small>`:""}</span>
         <input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sw|${gi}" placeholder="${esc(g._suggested?.weight||"KG")}" value="${esc(g.weight)}">
         <input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sr|${gi}" placeholder="${esc(g._suggested?.reps||"WDH.")}" value="${esc(g.reps)}">
         ${last?`<button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${restPauseComplete(e,s)?"ready":""}" data-check="${ei}|${si}">✓</button><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button>`:`<span></span><span></span>`}
       </div>${!last?`<div class="intraset-rest-divider"><span></span><b>${Number(e.methodData?.intraRest)||20}s Pause</b><span></span></div>`:""}`
     }).join("")}
     <div class="restpause-progress small">${targetInfo.total} / ${targetInfo.target} WDH.${targetInfo.reached?" · Ziel erreicht":""}</div>
     ${ratingMarkup(ei,si,s)}
   </div>`
  }).join("")
 }
 if(e.setTechnique==="dropset"){
  return e.liveSets.map((s,si)=>{
   const segs=s.segments.map((x,i)=>[x,i]);
   return`<div class="advanced-head"><span>SATZ ${si+1}</span><span></span><span>KG</span><span>WDH.</span><span></span><span></span></div>${segs.map(([g,gi])=>`<div class="advanced-row"><span>${gi+1}</span><span class="small">${esc(g.label)}</span><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sw|${gi}" placeholder="${esc(g._suggested?.weight||"KG")}" value="${esc(g.weight)}"><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sr|${gi}" placeholder="${esc(g._suggested?.reps||"WDH.")}" value="${esc(g.reps)}"><span></span><span></span></div>`).join("")}<div class="space" style="margin-top:6px"><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(e,s)?"ready":""}" data-check="${ei}|${si}">✓</button><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button></div>${ratingMarkup(ei,si,s)}`}).join("")
 }
 return`<div class="set-head"><span>SATZ</span><span>KG</span><span>WDH.</span><span></span><span></span></div>${e.liveSets.map((s,si)=>`<div class="set-row"><span>${si+1}</span><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight)}"><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|reps" placeholder="${esc(liveRepBoxSuggestion(e,s))}" value="${esc(s.reps)}" ${e.setTechnique==="backoff"?"readonly":""}><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(e,s)?"ready":""}" data-check="${ei}|${si}" >✓</button><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button></div>${ratingMarkup(ei,si,s)}`).join("")}`
}

const RATING_GUIDE={
 green:{label:"Perfekt",hint:"1–3 Wdh. mit guter Form übrig"},
 yellow:{label:"Limit",hint:"0 Wdh. mit guter Form übrig"},
 red:{label:"Zu schwer",hint:"Form zu früh verloren"},
 blue:{label:"Zu leicht",hint:"problemlos noch 3+ Wdh."}
};
function ratingChoiceMarkup(){return ["green","yellow","red","blue"].map(k=>`<button class="rating-choice ${k}" data-rating-choice="${k}"><strong>${RATING_GUIDE[k].label}</strong><small>${RATING_GUIDE[k].hint}</small></button>`).join("")}
function ratingLabel(r){return RATING_GUIDE[r]?.label?.toLowerCase()||""}
function segmentHasValues(g){return validKg(g?.weight)&&validReps(g?.reps)}
function openSegmentRating(ei,si,gi){const e=activeWorkout.exercises[ei],s=e.liveSets[si],g=s.segments[gi];if(!segmentHasValues(g)&&!(effectiveValue(g.weight,g._suggested?.weight)!==""&&Number(effectiveValue(g.reps,g._suggested?.reps))>0))return toast("Bitte zuerst KG und WDH. vollständig eintragen.");if(!segmentHasValues(g)){g.weight=g._suggested?.weight||"";g.reps=g._suggested?.reps||"";}ratingTarget={ei,si,gi,segment:true};openSheet("Intensität bewerten",`<div class="rating-question">Wie intensiv hat sich ${esc(g.name)} angefühlt?</div><div class="rating-question-sub">Wähle eine Antwort. Erst danach wird diese Übung der Runde abgeschlossen.</div><div class="rating-question-grid">${ratingChoiceMarkup()}</div>`,()=>document.querySelectorAll("[data-rating-choice]").forEach(b=>b.onclick=()=>applySegmentRating(b.dataset.ratingChoice)))}
function applySegmentRating(r){
 if(!ratingTarget?.segment)return;
 const{ei,si,gi}=ratingTarget,e=activeWorkout.exercises[ei],s=e.liveSets[si],g=s.segments[gi];
 if(!segmentHasValues(g))return;
 g.completed=true;g.rating=r;s.completed=s.segments.every(x=>x.completed);s.rating=s.completed?"group":"";
 ratingTarget=null;saveAll();closeSheet({all:true});renderLive();
 if(!s.completed)return;
 const group=liveGroupContext(ei,si);
 if(group){
   if(group.roundDone){
     const pause=Number.isFinite(Number(activeWorkout.exercises[group.first].rest))?Number(activeWorkout.exercises[group.first].rest):90;
     if(pause>0)startRest(pause);
     if(group.allDone)setTimeout(()=>focusLiveExercise(group.after,"smooth"),200);
     else setActiveExercise(group.first,false)
   }else{
     const openMembers=group.members.filter(i=>activeWorkout.exercises[i].liveSets?.[si]&&!activeWorkout.exercises[i].liveSets[si].completed);
     if(openMembers.length)setActiveExercise(openMembers.find(i=>i>ei)??openMembers[0],false)
   }
   return
 }
 const pause=Number.isFinite(Number(e.rest))?Number(e.rest):90;
 if(pause>0)startRest(pause);
 if(e.liveSets.every(x=>x.completed))setTimeout(()=>focusLiveExercise(ei+1,"smooth"),200)
}
function ratingClass(s){return s.rating?`rating-${s.rating}`:""}
function canRateSet(e,s){
 if(strictSetValues(e,s)||suggestedComplete(e,s))return true;
 if(e.measureMode!=="time"&&!s.group&&!s.segments){
  const w=effectiveValue(s.weight,s._suggested?.weight),r=effectiveValue(s.reps,s._suggested?.reps);
  return validKg(w)&&validReps(r)
 }
 return false
}
function validKg(v){const x=String(v??"").trim().replace(",",".");return x!==""&&Number.isFinite(Number(x))&&Number(x)>=0}
function validReps(v){const x=String(v??"").trim();return x!==""&&Number.isFinite(Number(x))&&Number(x)>0}
function strictSetValues(e,s){
 // A suggestion/placeholder is never enough for a rating. The user must actually enter/use values.
 if(e.measureMode==="time")return Number(s.time)>0;
 if(s.group)return s.segments.every(g=>validKg(g.weight)&&validReps(g.reps));
 if(e.setTechnique==="restpause"&&s.segments)return restPauseComplete(e,s);
 if(s.segments)return s.segments.every(g=>validKg(g.weight)&&validReps(g.reps));
 return validKg(s.weight)&&validReps(s.reps)
}
function ratingMarkup(){return""}
function openSetRating(ei,si){const e=activeWorkout.exercises[ei],s=e.liveSets[si];if(!canRateSet(e,s))return toast(e.measureMode==="time"?"Bitte zuerst die Zeit eintragen.":"Bitte zuerst KG und WDH. vollständig eintragen.");promoteSuggested(e,s);saveAll();ratingTarget={ei,si};openSheet("Intensität bewerten",`<div class="rating-question">Wie intensiv hat sich der Satz angefühlt?</div><div class="rating-question-sub">Wähle eine Antwort. Erst danach wird der Satz abgeschlossen und der Haken entsprechend eingefärbt.</div><div class="rating-question-grid">${ratingChoiceMarkup()}</div>`,()=>document.querySelectorAll("[data-rating-choice]").forEach(b=>b.onclick=()=>applySetRating(b.dataset.ratingChoice)))}
function liveGroupContext(ei,si){
 const e=activeWorkout.exercises[ei];
 if(!e||!groupMethod(e.setTechnique)||!e.techniqueGroup)return null;
 const members=activeWorkout.exercises.map((x,i)=>x.techniqueGroup===e.techniqueGroup&&x.setTechnique===e.setTechnique?i:-1).filter(i=>i>=0);
 const pos=members.indexOf(ei),last=pos===members.length-1;
 const roundDone=members.every(i=>!activeWorkout.exercises[i].liveSets?.[si]||activeWorkout.exercises[i].liveSets[si].completed);
 const allDone=members.every(i=>(activeWorkout.exercises[i].liveSets||[]).every(s=>s.completed));
 return{members,pos,last,roundDone,allDone,first:members[0],after:Math.max(...members)+1}
}
function syncGroupStructure(ei){
 const e=activeWorkout.exercises[ei];if(!e||!groupMethod(e.setTechnique)||!e.techniqueGroup)return;
 const members=activeWorkout.exercises.map((x,i)=>x.techniqueGroup===e.techniqueGroup?i:-1).filter(i=>i>=0),base=activeWorkout.exercises[members[0]];
 members.forEach(i=>{const x=activeWorkout.exercises[i];x.setTechnique=base.setTechnique;x.techniqueGroup=base.techniqueGroup;x.sets=base.sets;x.rest=base.rest;x.liveSets=rebuildLiveSetsForExercise(x,x.liveSets||[])})
}function applySetRating(r){
 if(!ratingTarget)return;
 const{ei,si}=ratingTarget,e=activeWorkout.exercises[ei],s=e.liveSets[si];
 if(!canRateSet(e,s))return toast("Die Werte sind nicht vollständig.");
 s.completed=true;s.rating=r;ratingTarget=null;saveAll();closeSheet({all:true});renderLive();

 const group=liveGroupContext(ei,si);
 if(group){
   if(group.roundDone){
     const pause=Number.isFinite(Number(activeWorkout.exercises[group.first].rest))?Number(activeWorkout.exercises[group.first].rest):90;
     if(pause>0)startRest(pause);
     if(group.allDone)setTimeout(()=>focusLiveExercise(group.after,"smooth"),200);
     else setActiveExercise(group.first,false);
     return
   }
   const openMembers=group.members.filter(i=>{
     const rs=activeWorkout.exercises[i].liveSets?.[si];
     return rs&&!rs.completed
   });
   if(openMembers.length)setActiveExercise(openMembers.find(i=>i>ei)??openMembers[0],false);
   return
 }
 const pause=Number.isFinite(Number(e.rest))?Number(e.rest):90;if(pause>0)startRest(pause);
 if(e.liveSets.every(x=>x.completed))setTimeout(()=>focusLiveExercise(ei+1,"smooth"),200)
}
function removeLiveSet(key){
 const[ei,si]=key.split("|").map(Number),e=activeWorkout.exercises[ei];
 if(groupMethod(e.setTechnique)&&e.techniqueGroup){
   const members=activeWorkout.exercises.map((x,i)=>x.techniqueGroup===e.techniqueGroup?i:-1).filter(i=>i>=0);
   if(members.some(i=>(activeWorkout.exercises[i].liveSets||[]).length<=1))return toast("Mindestens ein Satz bleibt bestehen");
   if(!confirm(`Satz ${si+1} der gesamten ${METHOD_LABEL[e.setTechnique]}-Serie wirklich löschen?`))return;
   members.forEach(i=>activeWorkout.exercises[i].liveSets.splice(si,1));members.forEach(i=>activeWorkout.exercises[i].sets=activeWorkout.exercises[i].liveSets.length)
 }else{
   if(e.liveSets.length<=1)return toast("Mindestens ein Satz bleibt bestehen");
   if(!confirm(`Satz ${si+1} von „${e.name}“ wirklich löschen?`))return;e.liveSets.splice(si,1);e.sets=e.liveSets.length
 }
 livePlanEdited=true;saveAll();renderLive()
}
function timeOriginFor(e,s){return Math.max(1,Number(s._timerOrigin)||Number(s.time)||Number(e.timeSeconds)||60)}
function toggleTimeTimer(key,btn){
 const[ei,si]=key.split("|").map(Number),e=activeWorkout.exercises[ei],s=e.liveSets[si],id=`${ei}|${si}`,origin=timeOriginFor(e,s);
 if(timeSetTimers.has(id)){
   clearInterval(timeSetTimers.get(id));timeSetTimers.delete(id);
   s.time=origin;s._timerOrigin=origin;s._timerRunning=false;saveAll();renderLive();return
 }
 s._timerOrigin=origin;s.time=origin;s._touched=true;s._timerRunning=true;saveAll();btn.textContent="■";
 let remain=origin;
 const timer=setInterval(()=>{
   remain=Math.max(0,remain-1);s.time=remain;
   const inp=document.querySelector(`[data-input="${ei}|${si}|time"]`);if(inp)inp.value=formatTime(remain);
   if(remain<=0){
     clearInterval(timer);timeSetTimers.delete(id);s._timerRunning=false;s._timedOnce=true;
     // Reset display to the originally selected/edited duration before asking for the normal rating.
     s.time=origin;s._timerOrigin=origin;saveAll();signalTone();backgroundTimerNotice("Zeit beendet");renderLive();
     setTimeout(()=>openSetRating(ei,si),180)
   }
 },1000);
 timeSetTimers.set(id,timer)
}
function roundLoad(v){return Math.round((Number(v)||0)*2)/2}
function autoFillDropWeights(e,s,base){
 if(e.setTechnique!=="dropset"||!s?.segments?.length||!Number.isFinite(Number(base)))return;
 const pct=(Number(e.methodData?.dropPercent)||20)/100;
 s.segments.slice(1).forEach((seg,i)=>{if(!seg._manualWeight){seg._suggested=seg._suggested||{};seg._suggested.weight=String(roundLoad(Number(base)*Math.pow(1-pct,i+1)))}})
}
function autoFillBackoffWeights(e,base){
 if(e.setTechnique!=="backoff"||!Number.isFinite(Number(base)))return;
 const pct=(Number(e.methodData?.backoffPercent)||15)/100;
 e.liveSets.slice(1).forEach(s=>{if(!s._manualWeight){s._suggested=s._suggested||{};s._suggested.weight=String(roundLoad(Number(base)*(1-pct)))}})
}
function autoFillPyramidWeights(e,anchorIndex,base){
 if(e.setTechnique!=="pyramid"||!Number.isFinite(Number(base)))return;ensurePyramidData(e);
 const anchorPct=Number(e.methodData.weightPct?.[anchorIndex])||100,peak=Number(base)/(anchorPct/100);
 e.liveSets.forEach((s,i)=>{if(i===anchorIndex)return;if(!s._manualWeight){s._suggested=s._suggested||{};s._suggested.weight=String(roundLoad(peak*((Number(e.methodData.weightPct?.[i])||100)/100)))}})
}
function updateInput(inp){
 const[a,b,k,g]=inp.dataset.input.split("|"),e=activeWorkout.exercises[a],s=e.liveSets[b];s._touched=true;
 if(k==="weight"){s.weight=inp.value;s._manualWeight=true}
 if(k==="reps"){s.reps=inp.value;s._manualReps=true}
 if(k==="time"){const t=Math.max(1,parseTime(inp.value)||Number(e.timeSeconds)||60);s.time=t;s._timerOrigin=t;s._manualTime=true}
 if(k==="level")s.level=inp.value;
 if(k==="sw"){s.segments[g].weight=inp.value;s.segments[g]._manualWeight=true}
 if(k==="sr"){s.segments[g].reps=inp.value}
 if(k==="gw")s.segments[g].weight=inp.value;
 if(k==="gr")s.segments[g].reps=inp.value;
 saveAll()
}

/* Advanced method field commit: calculations happen after input is complete, never per keystroke. */
function syncVisibleWorkoutSuggestionsV14(){
 if(!activeWorkout)return;
 document.querySelectorAll("#liveBody [data-input]").forEach(inp=>{
   const p=String(inp.dataset.input||"").split("|"),ex=activeWorkout.exercises?.[Number(p[0])],s=ex?.liveSets?.[Number(p[1])];
   if(!ex||!s)return;
   const k=p[2],g=Number(p[3]);
   if(k==="weight")inp.placeholder=s._suggested?.weight||"KG";
   if(k==="reps")inp.placeholder=s._suggested?.reps||amrapText(ex.reps||"WDH.");
   if(k==="sw")inp.placeholder=s.segments?.[g]?._suggested?.weight||"KG";
   if(k==="sr")inp.placeholder=s.segments?.[g]?._suggested?.reps||"WDH.";
   if(k==="level")inp.placeholder=s._suggested?.level||"Leistung"
 })
}
document.addEventListener("change",e=>{
 const inp=e.target?.closest?.("[data-input]");if(!inp||!activeWorkout)return;
 const [a,b,k,g]=String(inp.dataset.input||"").split("|"),ex=activeWorkout.exercises?.[Number(a)],set=ex?.liveSets?.[Number(b)];
 if(!ex||!set)return;
 if(k==="weight"&&Number(b)===0&&ex.setTechnique==="backoff")autoFillBackoffWeights(ex,inp.value);
 if(k==="weight"&&Number(b)===0&&ex.setTechnique==="pyramid")autoFillPyramidWeights(ex,0,inp.value);
 if(k==="sw"&&Number(g)===0&&ex.setTechnique==="dropset")autoFillDropWeights(ex,set,inp.value);
 if(k==="sw"&&Number(g)===0&&["restpause","cluster"].includes(ex.setTechnique)){
   const w=String(inp.value||"");set.segments.slice(1).forEach(seg=>{if(!seg._manualWeight&&!String(seg.weight||"").trim())seg.weight=w})
 }
 if(k==="sr"&&["restpause","cluster"].includes(ex.setTechnique))normalizeTargetSegments(ex,set);
 saveAll();syncVisibleWorkoutSuggestionsV14()
},true);

function toggleSet(key){const p=key.split("|").map(Number),ei=p[0],si=p[1],e=activeWorkout.exercises[ei],s=e.liveSets[si];if(s.completed){s.completed=false;s.rating="";saveAll();renderLive();return}openSetRating(ei,si)}
function startRest(sec=90,restored=false){
 ensureAudio();clearInterval(restTimer);const n=Number(sec);sec=Number.isFinite(n)?Math.max(0,n):90;
 if(sec<=0){restEnd=0;persistRestEnd();$("restBar").classList.add("hidden");return}
 if(!restored)restEnd=Date.now()+sec*1000;persistRestEnd();$("restBar").classList.remove("hidden");$("restBar").classList.toggle("rest-restored",!!restored);
 const tick=()=>{const s=Math.max(0,Math.ceil((restEnd-Date.now())/1000));$("restTime").textContent=formatTime(s);if(!s){clearInterval(restTimer);restEnd=0;persistRestEnd();$("restBar").classList.add("hidden");signalTone();backgroundTimerNotice("Pause beendet");toast("Pause beendet")}};tick();restTimer=setInterval(tick,250)
}
$("restMinus").onclick=()=>{restEnd=Math.max(Date.now(),restEnd-15000);persistRestEnd()};$("restPlus").onclick=()=>{restEnd+=15000;persistRestEnd()};$("restSkip").onclick=()=>{clearInterval(restTimer);restEnd=0;persistRestEnd();$("restBar").classList.add("hidden")};
function rebuildLiveSetsForExercise(e,oldSets=[]){
 const count=Math.max(1,Number(e.sets)||oldSets.length||3),fresh=Array.from({length:count},(_,i)=>initSet(e,i));
 fresh.forEach((s,i)=>{
  const old=oldSets[i];if(!old)return;
  if(e.measureMode==="time"){
   s.time=Number(old.time)||s.time;s._timerOrigin=Number(old._timerOrigin)||s._timerOrigin;
   s.level=old.level||"";s.completed=!!old.completed;s.rating=old.rating||"";
   return
  }
  if(groupMethod(e.setTechnique)){
   s.weight=old.weight||"";s.reps=old._manualReps?(old.reps||""):"";
   s._manualWeight=!!old._manualWeight;s._manualReps=!!old._manualReps;
   s.completed=!!old.completed;s.rating=old.rating||"";
   return
  }
  if(!["dropset","restpause","cluster"].includes(e.setTechnique)){
   s.weight=old.weight||"";
   if(e.setTechnique==="pyramid")s.reps=old._manualReps?(old.reps||""):"";
   else s.reps=old.reps||s.reps||"";
   s._manualWeight=!!old._manualWeight;s._manualReps=!!old._manualReps;
   s.completed=!!old.completed;s.rating=old.rating||""
  }
 });
 return fresh
}
function liveGroupIndexesFor(i){
 const e=activeWorkout?.exercises?.[i];if(!e||!groupMethod(e.setTechnique)||!e.techniqueGroup)return[i];
 return activeWorkout.exercises.map((x,j)=>x.techniqueGroup===e.techniqueGroup&&x.setTechnique===e.setTechnique?j:-1).filter(j=>j>=0)
}
function commitAtomicLiveGroup(sourceIndexes,drafts){
 const indexes=[...sourceIndexes].sort((a,b)=>a-b),insertAt=indexes[0],oldByName=new Map(indexes.map(i=>activeWorkout.exercises[i]).map(x=>[x.name,clone(x.liveSets||[])]));
 const result=drafts.map(clone);if(result.length>1&&groupMethod(result[0].setTechnique)){const gid=result[0].techniqueGroup||`tg_${uid()}`,method=result[0].setTechnique;result.forEach(e=>{e.techniqueGroup=gid;e.setTechnique=method;e.linkedExerciseNames=result.filter(x=>x!==e).map(x=>x.name)})}else result.forEach(e=>{e.techniqueGroup=null;e.linkedExerciseNames=[]});
 result.forEach(e=>e.liveSets=rebuildLiveSetsForExercise(e,oldByName.get(e.name)||[]));[...indexes].sort((a,b)=>b-a).forEach(i=>activeWorkout.exercises.splice(i,1));activeWorkout.exercises.splice(insertAt,0,...result);livePlanEdited=true;saveAll();closeSheet({all:true});renderLive();toast(result.length>1?"Serie übernommen":"Änderung übernommen")
}
function beginLivePartnerReplacement(sourceIndexes,firstDraft,editIndex=sourceIndexes[0]){
 const method=firstDraft.setTechnique,target=method==="giant"?(Number(firstDraft.methodData?.giantCount)||3):2,gid=`tg_${uid()}`;
 const ordered=sourceIndexes.map((idx,pos)=>({idx,pos,exercise:clone(activeWorkout.exercises[idx])})),editedPos=Math.max(0,ordered.findIndex(x=>x.idx===editIndex)),first=clone(firstDraft);first.setTechnique=method;first.techniqueGroup=gid;first._draftOrder=editedPos;
 const others=ordered.filter(x=>x.idx!==editIndex),keepNeeded=target-1;
 const startFlow=selected=>{const pending=selected.sort((a,b)=>a.pos-b.pos).map(x=>{const d=clone(x.exercise);delete d.liveSets;if(d.setTechnique!==method)prepareDraftForTargetMethod(d,method,target);else{d.setTechnique=method;d.methodData=d.methodData||{};if(method==="giant")d.methodData.giantCount=target}d.sets=Number(first.sets)||3;d.rest=Number(first.rest)||0;d.techniqueGroup=gid;return{exercise:d,order:x.pos}});planAddFlow={context:"live",step:"partnerPicker",q:exercisePickerState.q||"",type:exercisePickerState.type||"Alle",muscles:new Set(exercisePickerState.muscles||[]),drafts:[first],pendingSeeds:pending,current:null,group:{id:gid,method,target},history:[],methodScroll:0,editSourceIndexes:[...sourceIndexes],editInsertAt:Math.min(...sourceIndexes),nextOrder:sourceIndexes.length};advancePartnerDraftFlow()};
 if(others.length>keepNeeded){let chosen=new Set(others.slice(0,keepNeeded).map(x=>x.idx));const renderChoice=()=>{openSheet(`${METHOD_LABEL[method]} · Struktur festlegen`,`<div class="method-config-note">Wähle genau ${keepNeeded} bestehende${keepNeeded===1?" Übung":" Übungen"} für die neue Serie. Nicht ausgewählte Übungen bleiben im laufenden Workout als Standard erhalten.</div>${others.map(x=>`<button class="exercise-card ${chosen.has(x.idx)?"selected":""}" data-live-keep="${x.idx}" style="width:100%;text-align:left"><strong>${esc(x.exercise.name)}</strong><small>${chosen.has(x.idx)?"Teil der neuen Serie":"Bleibt Standard"}</small></button>`).join("")}<button id="confirmLiveKeep" class="primary" style="width:100%;margin-top:10px">Auswahl bestätigen</button>`,null,{replace:true});document.querySelectorAll("[data-live-keep]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.liveKeep);if(chosen.has(id))chosen.delete(id);else if(chosen.size<keepNeeded)chosen.add(id);renderChoice()});$("confirmLiveKeep").onclick=()=>{if(chosen.size!==keepNeeded)return toast(`Bitte genau ${keepNeeded} auswählen.`);first._detachedAfterConversion=others.filter(x=>!chosen.has(x.idx)).map(x=>{const d=clone(x.exercise);delete d.liveSets;return d});startFlow(others.filter(x=>chosen.has(x.idx)))}};renderChoice();return}
 startFlow(others)
}
function configureLiveExercise(i){
 const e=activeWorkout.exercises[i];if(!e)return;const originalGroup=liveGroupIndexesFor(i),draft=clone(e);delete draft.liveSets;let methodScroll=0;
 const render=()=>{
  $("sheetBody").innerHTML=`<div class="method-tabs" id="liveMethodTabs">${METHOD_KEYS.map(k=>`<button class="chip ${draft.setTechnique===k?"active":""}" data-live-method="${k}">${METHOD_LABEL[k]}</button>`).join("")}</div><div class="method-help">${esc(methodHelp(draft.setTechnique))}</div><div class="mode-switch"><button type="button" class="chip ${draft.measureMode!=="time"?"active":""}" id="liveModeReps">Wiederholungen</button><button type="button" class="chip ${draft.measureMode==="time"?"active":""}" id="liveModeTime">Zeit</button></div><div class="grid2"><div class="form-field"><label>SÄTZE</label><select id="liveCfgSets" class="field">${Array.from({length:10},(_,n)=>`<option ${Number(draft.sets)===n+1?"selected":""}>${n+1}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE</label><select id="liveCfgRest" class="field">${[0,30,45,60,90,120,150,180,240,300].map(v=>`<option value="${v}" ${Number(draft.rest)===v?"selected":""}>${v?formatTime(v):"Keine"}</option>`).join("")}</select></div></div><div class="form-field"><label>${draft.measureMode==="time"?"ZEIT":"WDH.-VORGABE"}</label>${draft.measureMode==="time"?timePresetMarkup(draft,"liveCfg"):methodRepConfigMarkup(draft,"liveCfg")}</div>${exerciseOptionFieldsMarkup(draft,"liveCfg")}<div class="form-field"><label><input id="liveCfgPerSide" type="checkbox" ${draft.perSide?"checked":""}> Wiederholungen pro Seite</label></div>${existingEditMethodMarkup(draft,originalGroup.length)}<button id="liveReplaceExercise" class="secondary" style="width:100%;margin-bottom:8px">⇄ Übung austauschen</button><button id="liveCfgSave" class="primary" style="width:100%">Übernehmen</button>`;
  requestAnimationFrame(()=>{const t=$("liveMethodTabs");if(t)t.scrollLeft=methodScroll});
  $("liveCfgRest").onchange=()=>{draft.rest=Number($("liveCfgRest").value)};$("liveModeReps").onclick=()=>{captureVisibleExerciseConfig(draft,"liveCfg",{setsId:"liveCfgSets",restId:"liveCfgRest",perSideId:"liveCfgPerSide"});draft.measureMode="reps";render()};$("liveModeTime").onclick=()=>{captureVisibleExerciseConfig(draft,"liveCfg",{setsId:"liveCfgSets",restId:"liveCfgRest",perSideId:"liveCfgPerSide"});draft.measureMode="time";draft.timeSeconds=Math.max(15,Number(draft.timeSeconds)||60);render()};
  document.querySelectorAll("[data-live-method]").forEach(b=>b.onclick=()=>{captureVisibleExerciseConfig(draft,"liveCfg",{setsId:"liveCfgSets",restId:"liveCfgRest",perSideId:"liveCfgPerSide"});methodScroll=$("liveMethodTabs")?.scrollLeft||0;const keepVariant=draft.variant,keepEquipment=draft.equipmentChoice,ve=draft._variantExplicit,ee=draft._equipmentExplicit;prepareDraftForTargetMethod(draft,b.dataset.liveMethod,originalGroup.length);draft.variant=keepVariant;draft.equipmentChoice=keepEquipment;draft._variantExplicit=ve;draft._equipmentExplicit=ee;applyCatalogDefaults(draft);render()});
  document.querySelectorAll("[data-rep-preset]").forEach(b=>b.onclick=()=>{captureVisibleExerciseConfig(draft,"liveCfg",{setsId:"liveCfgSets",restId:"liveCfgRest",perSideId:"liveCfgPerSide"});draft.reps=b.dataset.repPreset;render()});const liveCfgTimeWheel=$("liveCfgTimeWheel");if(liveCfgTimeWheel)liveCfgTimeWheel.onchange=()=>{captureVisibleExerciseConfig(draft,"liveCfg",{setsId:"liveCfgSets",restId:"liveCfgRest",perSideId:"liveCfgPerSide"});draft.timeSeconds=Number(liveCfgTimeWheel.value);render()};
  $("liveReplaceExercise").onclick=()=>openExercisePicker(name=>{const keep={sets:draft.sets||3,setTechnique:draft.setTechnique||"standard",measureMode:draft.measureMode,reps:draft.reps||defaultRepsForMethod(draft.setTechnique),timeSeconds:draft.timeSeconds,rest:restSeconds(draft,90),methodData:clone(draft.methodData||{}),perSide:draft.perSide};const replacement=normPlanEx({...findExercise(name),...keep});applyCatalogDefaults(replacement);Object.assign(draft,replacement);render()},{exclude:new Set([draft.name]),title:"Übung austauschen",detailAdd:true,returnToSheet:true});
  $("liveCfgSave").onclick=()=>{draft.sets=Number($("liveCfgSets").value);draft.rest=Number($("liveCfgRest").value);captureExerciseOptionFields(draft,"liveCfg");draft.perSide=!!$("liveCfgPerSide")?.checked;draft.methodData=draft.methodData||{};if($("cfgDrops"))draft.methodData.dropCount=Number($("cfgDrops").value)||2;if($("cfgDropPct"))draft.methodData.dropPercent=Number($("cfgDropPct").value)||20;if($("cfgGiantCount"))draft.methodData.giantCount=Number($("cfgGiantCount").value)||3;saveMethodRepConfig(draft,"liveCfg");const validation=validateExerciseDraft(draft);if(validation)return toast(validation);if(methodNeedsPartners(draft.setTechnique)){const target=draft.setTechnique==="giant"?(Number(draft.methodData?.giantCount)||3):2,sameGroup=originalGroup.length>1&&draft.setTechnique===e.setTechnique&&target===originalGroup.length;if(sameGroup){const preserved=originalGroup.map(idx=>{const x=clone(activeWorkout.exercises[idx]);delete x.liveSets;return x}),pos=originalGroup.indexOf(i),gid=e.techniqueGroup;preserved[pos]=clone(draft);preserved.forEach(x=>{x.setTechnique=draft.setTechnique;x.techniqueGroup=gid;x.sets=Number(draft.sets)||3;x.rest=Number(draft.rest)||0;if(draft.setTechnique==="giant"){x.methodData=x.methodData||{};x.methodData.giantCount=target}});commitAtomicLiveGroup(originalGroup,preserved);return}beginLivePartnerReplacement(originalGroup,draft,i);return}if(originalGroup.length>1){const preserved=originalGroup.map(idx=>{const x=clone(activeWorkout.exercises[idx]);delete x.liveSets;return x}),pos=originalGroup.indexOf(i);preserved[pos]=clone(draft);preserved.forEach(x=>{x.techniqueGroup=null;x.linkedExerciseNames=[];x.setTechnique="standard";x.methodData={};if(!x.reps||["20","30","20-30"].includes(String(x.reps)))x.reps="8-12"});commitAtomicLiveGroup(originalGroup,preserved);return}commitAtomicLiveGroup(originalGroup,[draft])}
 };
 openSheet(e.name+" bearbeiten","");render()
}
function addLiveExerciseAndConfigure(n){
 const draft=normPlanEx(applyStandardExerciseDefaults({...findExercise(n),setTechnique:"standard"}));
 configureLiveDraft(draft)
}
function configureLiveDraft(draft){
 const render=()=>{openSheet(draft.name+" hinzufügen",`<div class="mode-switch"><button id="draftModeReps" class="chip ${draft.measureMode!=="time"?"active":""}">Wiederholungen</button><button id="draftModeTime" class="chip ${draft.measureMode==="time"?"active":""}">Zeit</button></div><div class="grid2"><div class="form-field"><label>SÄTZE</label><select id="draftSets" class="field">${Array.from({length:10},(_,i)=>`<option ${draft.sets===i+1?"selected":""}>${i+1}</option>`).join("")}</select></div><div class="form-field"><label>PAUSE</label><select id="draftRest" class="field">${[0,30,45,60,90,120,150,180,240,300].map(v=>`<option value="${v}" ${draft.rest===v?"selected":""}>${v?formatTime(v):"Keine"}</option>`).join("")}</select></div></div><div class="form-field"><label>${draft.measureMode==="time"?"ZEIT":"WDH.-VORGABE"}</label>${draft.measureMode==="time"?timePresetMarkup(draft,"draft"):repPresetMarkup(draft)}</div><button id="confirmLiveDraft" class="primary" style="width:100%">Übung hinzufügen</button>`,()=>{$("draftRest").onchange=()=>{draft.rest=Number($("draftRest").value)};$("draftModeReps").onclick=()=>{draft.measureMode="reps";render()};$("draftModeTime").onclick=()=>{draft.measureMode="time";draft.timeSeconds=Math.max(15,draft.timeSeconds||60);render()};document.querySelectorAll("[data-rep-preset]").forEach(b=>b.onclick=()=>{draft.reps=b.dataset.repPreset;render()});const draftTimeWheel=$("draftTimeWheel");if(draftTimeWheel)draftTimeWheel.onchange=()=>{draft.timeSeconds=Number(draftTimeWheel.value);render()};$("confirmLiveDraft").onclick=()=>{draft.sets=Number($("draftSets").value);draft.rest=Number($("draftRest").value);draft.liveSets=Array.from({length:draft.sets},(_,i)=>initSet(draft,i));activeWorkout.exercises.push(draft);activeWorkout.activeExerciseIndex=activeWorkout.exercises.length-1;livePlanEdited=true;saveAll();closeSheet({all:true});renderLive();focusLiveExercise(activeWorkout.activeExerciseIndex,"smooth")}})};render()
}

$("liveAddExercise").onclick=()=>openExercisePicker(addLiveExerciseAndConfigure,{detailAdd:true});
$("liveReorder").onclick=()=>openLiveReorder();
function liveReorderUnits(){return liveVisualGroups(activeWorkout.exercises).map(g=>({method:g.method,indexes:g.members.map(x=>x.i),label:g.members.map(x=>x.e.name).join(" + ")}))}
function openLiveReorder(){const units=liveReorderUnits();openSheet("Reihenfolge ändern",units.map((u,ui)=>`<div class="exercise-card"><div><strong>${ui+1}. ${esc(u.label)}</strong>${u.indexes.length>1?`<small>${METHOD_LABEL[u.method]} · ${u.indexes.length} Übungen</small>`:""}</div><div class="row"><button class="icon-btn" data-live-unit-up="${ui}">↑</button><button class="icon-btn" data-live-unit-down="${ui}">↓</button></div></div>`).join(""));document.querySelectorAll("[data-live-unit-up]").forEach(b=>b.onclick=()=>moveLiveUnit(Number(b.dataset.liveUnitUp),-1));document.querySelectorAll("[data-live-unit-down]").forEach(b=>b.onclick=()=>moveLiveUnit(Number(b.dataset.liveUnitDown),1))}
function moveLiveUnit(ui,d){const units=liveReorderUnits(),j=ui+d;if(j<0||j>=units.length)return;const chunks=units.map(u=>u.indexes.map(i=>activeWorkout.exercises[i]));[chunks[ui],chunks[j]]=[chunks[j],chunks[ui]];activeWorkout.exercises=chunks.flat();livePlanEdited=true;saveAll();closeSheet({all:true});renderLive();openLiveReorder()}
function openFinishWorkoutSheet(){
 if(!activeWorkout)return;
 openSheet("Training wirklich beenden?",`<p class="small" style="margin:0 0 14px">Möchtest du das Training beenden und speichern oder vollständig verwerfen?</p><div class="grid2"><button id="discardWorkout" class="secondary danger">Training verwerfen</button><button id="saveWorkout" class="primary">Training beenden</button></div>`)
}
function discardWorkoutAsked(){
 if(!activeWorkout)return;
 if(!confirm("Training wirklich verwerfen? Alle Eintragungen dieses Trainings gehen verloren."))return;
 activeWorkout=null;livePlanEdited=false;restEnd=0;persistRestEnd();timeSetTimers.forEach(clearInterval);timeSetTimers.clear();saveAll();closeSheet({all:true});document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));pageStack=[];$("bottomNav").classList.remove("hidden");showTab("training",{reset:true})
}
function finalizeWorkout({saveChangedPlan=false,saveTransientPlan=false}={}){
 if(!activeWorkout)return;
 activeWorkout.finishedAt=Date.now();

 // Weekly combined plans keep the agreed special rule: only completion creates the plan.
 if(activeWorkout.isWeekCombined){
  const requested=activeWorkout.name||"Wochenplan",finalName=plans.some(p=>planBaseName(p.name)===planBaseName(requested))?nextPlanVersionName(requested):requested;
  const np={id:uid(),name:finalName,createdAt:Date.now(),updatedAt:Date.now(),lastUsedAt:Date.now(),fromWeek:true,sourcePlanIds:clone(activeWorkout.weekSourceIds||[]),exercises:clone(activeWorkout.exercises).map(x=>{const y=clone(x);delete y.liveSets;return y})};
  plans.push(np);activeWorkout.planId=np.id;activeWorkout.planName=np.name;activeWorkout.savedWeekPlanId=np.id;livePlanEdited=false
 }else if(livePlanEdited&&saveChangedPlan){
  const structural=clone(activeWorkout.exercises).map(x=>{const y=clone(x);delete y.liveSets;return y});
  const sourceId=activeWorkout.sourcePlanId||activeWorkout.planId,src=plans.find(p=>p.id===sourceId);
  if(saveChangedPlan==="overwrite"&&src){src.exercises=structural;src.updatedAt=Date.now();src.lastUsedAt=Date.now();activeWorkout.planId=src.id;activeWorkout.planName=src.name}
  else{const np={id:uid(),name:nextPlanVersionName(activeWorkout.planName||activeWorkout.name||"Training"),createdAt:Date.now(),updatedAt:Date.now(),lastUsedAt:Date.now(),sourcePlanId:sourceId,exercises:structural};plans.push(np);activeWorkout.planId=np.id;activeWorkout.planName=np.name}
  livePlanEdited=false
 }

 if(activeWorkout.startedFromUnsavedPlan&&saveTransientPlan){
  const structural=clone(activeWorkout.exercises).map(x=>{const y=clone(x);delete y.liveSets;return y});
  const sourceId=activeWorkout.sourcePlanId,src=sourceId?plans.find(p=>String(p.id)===String(sourceId)):null;
  if(saveTransientPlan==="overwrite"&&src){
   src.exercises=structural;src.updatedAt=Date.now();src.lastUsedAt=Date.now();src.name=activeWorkout.planName||activeWorkout.name||src.name;
   activeWorkout.planId=src.id;activeWorkout.planName=src.name
  }else{
   const requested=activeWorkout.planName||activeWorkout.name||"Trainingsplan";
   const finalName=plans.some(p=>p.name===requested)?nextPlanVersionName(requested):requested;
   const np={id:uid(),name:finalName,createdAt:Date.now(),updatedAt:Date.now(),lastUsedAt:Date.now(),sourcePlanId:sourceId||null,exercises:structural};
   plans.push(np);activeWorkout.planId=np.id;activeWorkout.planName=np.name
  }
 }
 activeWorkout.sourcePlanId=activeWorkout.sourcePlanId||activeWorkout.planId;
 history.push(clone(activeWorkout));const done=clone(activeWorkout);
 activeWorkout=null;livePlanEdited=false;restEnd=0;persistRestEnd();timeSetTimers.forEach(clearInterval);timeSetTimers.clear();tabScroll.training=0;if(tabUiState.training)tabUiState.training.scroll=0;saveAll();renderTrainingHome();renderPlans();renderWeek();renderProfile();closeSheet({all:true});
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));pageStack=[];$("bottomNav").classList.remove("hidden");showTab("training",{reset:true});renderTrainingHome();requestAnimationFrame(()=>{renderTrainingHome();openSummary(done)})
}
function finishAndSaveWorkout(){
 if(!activeWorkout)return;
 if(activeWorkout.startedFromUnsavedPlan){
  const existing=activeWorkout.sourcePlanId?plans.find(p=>String(p.id)===String(activeWorkout.sourcePlanId)):null;
  openSheet("Trainingsplan speichern?",`<p class="small" style="margin:0 0 14px">Dieses Training wurde aus einem noch nicht gespeicherten Plan gestartet. Das Training selbst wird in jedem Fall im Verlauf gespeichert. Möchtest du auch den Trainingsplan speichern?</p><div class="save-choice-stack">${existing?`<button id="finishTransientOverwrite" class="primary">Bestehenden Plan überschreiben</button>`:""}<button id="finishTransientSave" class="primary">Trainingsplan speichern</button><button id="finishTransientNoSave" class="secondary">Nur Training speichern</button></div>`);
  if($("finishTransientOverwrite"))$("finishTransientOverwrite").onclick=()=>finalizeWorkout({saveTransientPlan:"overwrite"});
  $("finishTransientSave").onclick=()=>finalizeWorkout({saveTransientPlan:true});
  $("finishTransientNoSave").onclick=()=>finalizeWorkout({saveTransientPlan:false});
  return
 }
 if(livePlanEdited&&!activeWorkout.isWeekCombined){
  const existing=plans.find(p=>p.id===(activeWorkout.sourcePlanId||activeWorkout.planId));
  openSheet("Planänderungen speichern?",`<p class="small" style="margin:0 0 14px">Das Workout wird in jedem Fall in der Historie gespeichert. Wie sollen die während des Trainings entstandenen Planänderungen behandelt werden?</p><div class="save-choice-stack">${existing?`<button id="finishOverwritePlan" class="primary">Bestehenden Plan überschreiben</button>`:""}<button id="finishWithPlanSave" class="secondary">Als neuen Plan speichern</button><button id="finishWithoutPlanSave" class="secondary danger">Planänderungen verwerfen</button></div>`);
  if($("finishOverwritePlan"))$("finishOverwritePlan").onclick=()=>finalizeWorkout({saveChangedPlan:"overwrite"});
  $("finishWithoutPlanSave").onclick=()=>finalizeWorkout({saveChangedPlan:false});
  $("finishWithPlanSave").onclick=()=>finalizeWorkout({saveChangedPlan:true});
  return
 }
 finalizeWorkout({saveChangedPlan:false})
}
$("finishWorkoutBtn").onclick=openFinishWorkoutSheet;
$("liveTopStop").onclick=openFinishWorkoutSheet;
document.addEventListener("click",e=>{if(e.target.id==="discardWorkout")discardWorkoutAsked();if(e.target.id==="saveWorkout")finishAndSaveWorkout()});
function summaryRatingText(r){return r==="red"?"zu anstrengend":r==="yellow"?"noch passend":r==="green"?"genau richtig":r==="blue"?"zu leicht":""}
function summaryRatingBadge(r){return r?`<span class="summary-rating"><span class="summary-rating-dot rating-${r}"></span><span>${summaryRatingText(r)}</span></span>`:""}
function summaryChip(content){return `<span class="summary-chip">${content}</span>`}
function summarySetText(e,s){
 if(s.group){
  return `<div class="summary-set-content">${(s.segments||[]).map(g=>`${summaryChip(`${esc(g.weight||"–")} KG · ${esc(g.reps||"–")} WDH.`)}${summaryRatingBadge(g.rating)}`).join("")}</div>`
 }
 if(s.segments){
  const segs=e.setTechnique==="restpause"?s.segments.filter((g,i)=>i===0||g.completed||String(g.reps||"").trim()!==""):s.segments;
  const rating=s.rating&&s.rating!=="group"?s.rating:(segs.find(g=>g.rating)?.rating||"");
  return `<div class="summary-set-content"><div class="summary-segments">${segs.map(g=>summaryChip(`${esc(g.label||"Teil")} · ${esc(g.weight||"–")} KG · ${esc(g.reps||"–")} WDH.`)).join("")}</div>${summaryRatingBadge(rating)}</div>`
 }
 if(e.measureMode==="time"){
  const perf=String(s.level||s.performance||"").trim();
  return `<div class="summary-set-content">${summaryChip(`${formatTime(s.time||e.timeSeconds||0)}${perf?` · ${esc(perf)}`:""}`)}${summaryRatingBadge(s.rating)}</div>`
 }
 return `<div class="summary-set-content">${summaryChip(`${esc(s.weight||"–")} KG · ${esc(s.reps||"–")} WDH.`)}${summaryRatingBadge(s.rating)}</div>`
}
function summaryVisualGroups(exercises){
 const out=[];
 (exercises||[]).forEach((e,i)=>{
  const item={...e,_plannedSetCount:(e.liveSets||[]).length||Number(e.sets)||0,liveSets:completedSetsOfExercise(e)};
  if(groupMethod(e.setTechnique)&&e.techniqueGroup){const prev=out[out.length-1];if(prev&&prev.key===e.techniqueGroup)prev.items.push(item);else out.push({key:e.techniqueGroup,method:e.setTechnique,items:[item]})}
  else out.push({key:`hs_${i}`,method:e.setTechnique||"standard",items:[item]})
 });return out
}
function summaryExerciseBlock(e,label=""){
 const completed=e.liveSets||[],planned=Number(e._plannedSetCount||e.sets)||0;
 return `<div class="history-summary-exercise"><div class="history-exercise-title"><strong>${label?`<span class="history-group-letter">${label}</span> `:""}${esc(exerciseDisplayName(e))}</strong></div>${e.variant||e.perSide?`<div class="variant-line">${e.variant?esc(e.variant):""}${e.variant&&e.perSide?" · ":""}${e.perSide?"WDH. pro Seite":""}</div>`:""}${completed.length?completed.map((s,i)=>`<div class="summary-set ${e.measureMode==="time"?"summary-time-set":""}"><strong>Satz ${i+1}</strong><div>${summarySetText(e,s)}</div></div>`).join(""):'<div class="summary-empty">Keine abgeschlossenen Sätze</div>'}${planned&&completed.length<planned?`<div class="small summary-incomplete">${planned-completed.length} ${planned-completed.length===1?"Satz":"Sätze"} nicht abgeschlossen</div>`:""}</div>`
}
function openSummary(w){
 const p=plans.find(x=>String(x.id)===String(w.planId)),groups=summaryVisualGroups(w.exercises||[]),exCount=completedExerciseCount(w),setCount=completedSetCount(w),d=new Date(w.finishedAt||w.startedAt||Date.now());
 $("summaryTitle").textContent=`Training vom ${d.toLocaleDateString("de-DE")} · ${d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}`;
 $("summaryBody").innerHTML=`<div class="card summary-plan-card"><div class="space"><div><div class="small">PLAN</div><strong style="font-size:20px">${esc(w.planName||w.name||p?.name||"Training")}</strong></div>${p?`<button id="summaryTopPlay" class="icon-btn plus-btn" aria-label="Training starten">▶</button>`:""}</div><div class="small" style="margin-top:5px">${formatDuration((w.finishedAt||Date.now())-(w.startedAt||Date.now()))} · ${exCount} abgeschlossene Übung${exCount===1?"":"en"} · ${setCount} abgeschlossene Sätze</div>${w.note?`<div class="note-line">✎ ${esc(w.note)}</div>`:""}</div>${groups.map(g=>`<div class="method-card method-${g.method} ${groupMethod(g.method)?"connected-method-card history-connected-card":""}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="method-help">${esc(methodHelp(g.method))}</div>${g.items.map((e,j)=>summaryExerciseBlock(e,groupMethod(g.method)?String.fromCharCode(65+j):"")).join("")}</div>`).join("")}<div style="margin-top:18px">${p?`<button id="summaryEditPlan" class="secondary" style="width:100%">Plan bearbeiten</button><button id="summaryRestart" class="primary" style="width:100%;margin-top:8px">Training erneut starten</button>`:`<div class="card history-missing-plan-note">Der zugehörige Trainingsplan wurde gelöscht.</div>`}</div>`;
 openPage("summaryPage",()=>{if(p){$("summaryEditPlan").onclick=()=>{closePage();editPlan(p.id)};$("summaryRestart").onclick=()=>{closePage();openPreStart(p.id)};$("summaryTopPlay").onclick=()=>openPreStart(p.id)}})
}
function stretchSvg(){return`<svg class="stretch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="4" r="2"/><path d="M12 6.5v5m0-3L7.5 11M12 8.5l4.5 2.5M12 11.5l-4 6M12 11.5l4.5 5.5M8 17.5 5 20M16.5 17l2.5 3"/></svg>`}
function validWeekPlans(day){const ids=Array.isArray(weekPlan[day])?weekPlan[day]:weekPlan[day]!=null?[weekPlan[day]]:[];return ids.map(id=>plans.find(p=>String(p.id)===String(id))).filter(Boolean)}
function combinedWeekPlan(day){
 const ps=validWeekPlans(day);if(!ps.length)return null;
 const exercises=[];
 ps.forEach((p,pi)=>{
  const gidMap=new Map();
  clone(p.exercises||[]).forEach((e,ei)=>{
   if(e.techniqueGroup){
    if(!gidMap.has(e.techniqueGroup))gidMap.set(e.techniqueGroup,`week_${p.id}_${day}_${pi}_${uid()}`);
    e.techniqueGroup=gidMap.get(e.techniqueGroup)
   }
   e._weekSourcePlanId=p.id;e._weekSourceOrder=pi;e._weekSourceExerciseOrder=ei;
   exercises.push(e)
  })
 });
 return{id:`week_${weekKeyForOffset()}_${day}_${Date.now()}`,name:ps.map(x=>x.name).join(" + "),createdAt:Date.now(),updatedAt:Date.now(),weekSourceIds:ps.map(x=>x.id),weekDate:dateKeyLocal(weekDateAt(day)),exercises}
}
function weekCompletion(day){
 const date=weekDateAt(day).toISOString().slice(0,10),ids=validWeekPlans(day).map(p=>String(p.id));
 return history.some(w=>w.weekDate===date&&(w.finishedAt||0)>0&&(ids.length===0||ids.every(id=>(w.weekSourceIds||[]).map(String).includes(id))))
}
function openWeekPreview(day){
 const fresh=combinedWeekPlan(day);if(!fresh)return;
 $("previewTitle").textContent=fresh.name||"Workout Vorschau";
 const pp={...clone(fresh),exercises:clone(fresh.exercises).map(e=>{const x=normPlanEx(e);x.liveSets=Array.from({length:Number(x.sets)||defaultSetsForExerciseMethod(x,x.setTechnique||"standard")},(_,i)=>initSet(x,i));return x})};
 $("previewBody").innerHTML=`<div class="stat-grid"><div class="stat"><strong>${fresh.exercises.length}</strong><span>ÜBUNGEN</span></div><div class="stat"><strong>${countPlanSets(fresh)}</strong><span>SÄTZE</span></div><div class="stat"><strong>~${estimateMinutes(fresh)} Min.</strong><span>DAUER</span></div></div><div class="preview-live-shell">${previewVisualGroups(pp.exercises).map(previewMethodCard).join("")}</div><button id="weekPreviewStart" class="primary" style="width:100%;margin:14px 0 80px">Training starten</button>`;
 openPage("previewPage",()=>{$("weekPreviewStart").onclick=()=>confirmAndStartPlan(fresh)})
}
const WEEK_MOTIVATION=["Konstanz schlägt Perfektion. Eine gute Woche entsteht aus den Einheiten, die du wirklich machst.","Trainiere heute so, dass du morgen wiederkommen kannst.","Fortschritt ist selten spektakulär – aber konsequent sichtbar.","Jede geplante Einheit ist eine Entscheidung für dein nächstes Level.","Stärke entsteht nicht an einem Tag. Sie entsteht aus vielen guten Tagen.","Du musst nicht alles geben. Du musst wiederkommen.","Eine starke Woche beginnt mit der nächsten guten Entscheidung.","Kleine Schritte werden groß, wenn du sie oft genug gehst.","Training ist kein Test. Es ist ein Prozess.","Dein Plan gibt die Richtung vor – du gibst ihm Leben.","Ein guter Rhythmus schlägt einen perfekten Start.","Mach die Einheit, die heute möglich ist.","Fortschritt braucht Wiederholung, nicht Drama.","Dein zukünftiges Ich profitiert von der Einheit heute.","Qualität vor Ego. Kontrolle vor Gewicht.","Stärke wächst dort, wo Technik und Geduld zusammenkommen.","Du trainierst nicht nur Leistung, sondern Verlässlichkeit.","Eine Einheit zählt auch dann, wenn sie nicht perfekt war.","Bleib im Prozess. Ergebnisse folgen der Wiederholung.","Trainiere klug genug, um langfristig hart trainieren zu können.","Der wichtigste Satz ist oft der, den du sauber ausführst.","Nicht jede Woche muss stärker sein – aber jede kann dich weiterbringen.","Planen schafft Klarheit. Handeln schafft Fortschritt.","Ein guter Trainingstag beginnt mit dem ersten Satz.","Du brauchst keinen perfekten Moment. Du brauchst einen Anfang.","Mehr Kontrolle, mehr Qualität, mehr Fortschritt.","Leistung entsteht aus vielen unspektakulären Wiederholungen.","Deine Routine trägt dich auch an Tagen ohne Motivation.","Fokus auf das, was du heute beeinflussen kannst.","Stärke ist auch, rechtzeitig aufzuhören und morgen weiterzumachen.","Jede saubere Wiederholung ist eine Investition.","Trainiere mit Ziel, nicht nur mit Tempo.","Der Plan ist die Struktur. Du bist die Konstanz.","Fortschritt zeigt sich oft zuerst in besserer Kontrolle.","Ein Schritt nach dem anderen ist immer noch vorwärts.","Du musst nicht motiviert sein, um konsequent zu sein.","Mach es einfach genug, dass du es wiederholen kannst.","Dein Tempo darf variieren. Deine Richtung bleibt.","Die beste Woche ist die, die zu deinem Leben passt.","Heute trainieren. Morgen aufbauen. Langfristig wachsen."];
function weekMotivationText(){let sum=0;for(const c of weekKeyForOffset())sum+=c.charCodeAt(0);return WEEK_MOTIVATION[sum%WEEK_MOTIVATION.length]}
function renderWeek(){
 $("weekMotivation").innerHTML=`<div class="small">DIESE WOCHE</div><strong>${esc(weekMotivationText())}</strong>`;
 const days=["Mo","Di","Mi","Do","Fr","Sa","So"],from=weekDateAt(0),to=weekDateAt(6);
 $("weekRangeLabel").textContent=`${fmtShortDate(from)} – ${fmtShortDate(to)}`;
 $("weekOffsetLabel").textContent=weekOffset===0?"Diese Woche":weekOffset<0?`${Math.abs(weekOffset)} Woche${Math.abs(weekOffset)===1?"":"n"} zurück`:`${weekOffset} Woche${weekOffset===1?"":"n"} voraus`;
 $("weekPrevBtn").disabled=weekOffset<=-104;$("weekNextBtn").disabled=weekOffset>=104;
 let changed=false;weekPlan=weekPlan.map((ids,i)=>{const valid=validWeekPlans(i).map(p=>p.id);if(JSON.stringify(valid)!==JSON.stringify(Array.isArray(ids)?ids:[]))changed=true;return valid});if(changed)saveAll();
 $("weekList").innerHTML=days.map((d,i)=>{const ps=validWeekPlans(i),ex=ps.reduce((n,p)=>n+p.exercises.length,0),sets=ps.reduce((n,p)=>n+countPlanSets(p),0),date=weekDateAt(i),done=ps.length&&weekCompletion(i);return`<div class="week-row"><div class="week-day">${d}</div><div class="week-card ${done?"week-completed":(ps.length?"week-scheduled":"")}"><button class="week-card-main" ${ps.length?`data-week-preview="${i}"`:""}><div class="week-card-date">${date.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}</div>${ps.length?`<strong>${esc(ps.map(p=>p.name).join(" + "))}</strong><small>${ps.length} Plan${ps.length===1?"":"e"} · ${ex} Übungen · ${sets} Sätze${done?" · Abgeschlossen":""}</small>`:`<div class="week-pause-wrap">${stretchSvg()}<div><strong>Pause</strong><small>Freier Tag</small></div></div>`}</button><div class="week-actions">${ps.length?`${done?"":`<button class="week-plus week-play" data-wstart="${i}" aria-label="Training starten">▶</button>`}<button class="week-menu" data-wm="${i}">⋮</button>`:`<button class="week-plus" data-wa="${i}" aria-label="Plan hinzufügen">+</button>`}</div></div></div>`}).join("");
 document.querySelectorAll("[data-wa]").forEach(b=>b.onclick=()=>openWeekPicker(Number(b.dataset.wa)));
 document.querySelectorAll("[data-week-preview]").forEach(b=>b.onclick=()=>openWeekPreview(Number(b.dataset.weekPreview)));
 document.querySelectorAll("[data-wstart]").forEach(b=>b.onclick=e=>{e.stopPropagation();const fresh=combinedWeekPlan(Number(b.dataset.wstart));if(fresh)confirmAndStartPlan(fresh)});
 document.querySelectorAll("[data-wm]").forEach(b=>b.onclick=e=>{e.stopPropagation();weekMenu(Number(b.dataset.wm))})
}
$("weekPrevBtn").onclick=()=>{saveCurrentWeekRefs();loadWeekOffset(weekOffset-1)};$("weekNextBtn").onclick=()=>{saveCurrentWeekRefs();loadWeekOffset(weekOffset+1)};
function openWeekPicker(day){let selected=validWeekPlans(day).map(p=>p.id),q="";const render=()=>{const rows=sortedPlansForPicker(q);$("sheetBody").innerHTML=`<div class="plan-picker-tools"><div class="search"><input id="weekSearch" placeholder="Plan suchen" value="${esc(q)}"><button id="weekSearchClear">×</button></div><div class="chips">${[["name","A–Z"],["created","Hinzugefügt"],["updated","Geändert"],["used","Genutzt"]].map(([k,l])=>`<button class="chip ${planSort.key===k?"active":""}" data-week-sort="${k}">${l}${planSort.key===k?(planSort.dir>0?" ↑":" ↓"):""}</button>`).join("")}</div></div>${rows.map(p=>`<button class="plan-card week-select-card ${selected.includes(p.id)?"selected":""}" data-wpick="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span>${selected.includes(p.id)?"✓":"›"}</span></button>`).join("")}<div class="week-selection-footer"><div class="small" style="margin-bottom:8px">${selected.length?`${selected.length} Pläne gewählt · ${weekDateAt(day).toLocaleDateString("de-DE")}`:"Kein Plan gewählt"}</div><button id="weekApply" class="primary" style="width:100%">Übernehmen</button></div>`;$("weekSearch").oninput=()=>{q=$("weekSearch").value;const rows=sortedPlansForPicker(q),cards=Array.from(document.querySelectorAll("[data-wpick]"));cards.forEach(card=>{const id=Number(card.dataset.wpick);card.style.display=rows.some(p=>Number(p.id)===id)?"":"none"})};$("weekSearchClear").onclick=()=>{q="";render()};document.querySelectorAll("[data-week-sort]").forEach(b=>b.onclick=()=>{if(planSort.key===b.dataset.weekSort)planSort.dir*=-1;else{planSort.key=b.dataset.weekSort;planSort.dir=1}savePlanSort();render()});document.querySelectorAll("[data-wpick]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.wpick);selected.includes(id)?selected=selected.filter(x=>x!==id):selected.push(id);render()});$("weekApply").onclick=()=>{const hadPlans=validWeekPlans(day).length>0;weekPlan[day]=selected.filter(id=>plans.some(p=>String(p.id)===String(id)));if(hadPlans&&!weekPlan[day].length)clearWeekCompletionForDay(day);saveAll();closeSheet({all:true});renderWeek();if(typeof renderProfileProgress==="function")renderProfileProgress()}};openSheet("Trainingsplan auswählen","");render()}
function startWeekDay(day){
 const fresh=combinedWeekPlan(day);if(!fresh||!(fresh.exercises||[]).length)return;
 pendingStartPlan=fresh;
 $("preStartTitle").textContent=fresh.name;
 $("preStartBody").innerHTML=`<div class="stat-grid"><div class="stat"><strong>${fresh.exercises.length}</strong><span>ÜBUNGEN</span></div><div class="stat"><strong>${countPlanSets(fresh)}</strong><span>SÄTZE</span></div><div class="stat"><strong>~${estimateMinutes(fresh)} Min.</strong><span>DAUER</span></div></div>${fresh.exercises.map((e,i)=>`<div class="exercise-card"><div><strong>${i+1}. ${esc(e.name)}</strong><small>${esc(METHOD_LABEL[e.setTechnique||"standard"])} · ${esc(planPrescription(e))}</small></div></div>`).join("")}`;
 openPage("preStartPage")
}

function clearWeekCompletionForDay(day){
 const date=weekDateAt(day),key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
 const before=history.length;
 history=history.filter(w=>{
   if(!w?.finishedAt)return true;
   const weekly=!!w.isWeekCombined||!!w.weekDate||(Array.isArray(w.weekSourceIds)&&w.weekSourceIds.length>0);
   if(!weekly)return true;
   const wk=String(w.weekDate||dateKeyLocal(Number(w.finishedAt)));
   return wk!==key
 });
 if(history.length!==before){saveAll();renderTrainingHome();if(typeof renderProfileProgress==="function")renderProfileProgress()}
}
function weekMenu(day){
 const ps=validWeekPlans(day);
 if(!ps.length)return;
 openSheet(ps.map(p=>p.name).join(" + "),`<button id="weekReplace" class="secondary" style="width:100%">⇄ Auswahl bearbeiten</button><button id="weekDelete" class="secondary danger" style="width:100%;margin-top:8px">× Auswahl löschen</button>`);
 $("weekReplace").onclick=()=>{closeSheet({all:true});openWeekPicker(day)};
 $("weekDelete").onclick=()=>{if(confirm("Auswahl für diesen Tag wirklich löschen?")){clearWeekCompletionForDay(day);weekPlan[day]=[];saveAll();closeSheet({all:true});renderWeek();if(typeof renderProfileProgress==="function")renderProfileProgress()}}
}
const HYDRATION_LOG_KEY="rethink_hydration_log_v1";
function hydrationLog(){return read(HYDRATION_LOG_KEY,[])||[]}function saveHydrationLog(x){write(HYDRATION_LOG_KEY,x)}
function addDrinkEntry(drink,size=drink.size){const amount=Math.max(1,Math.min(1000,Number(size)||drink.size||250)),entry={id:uid(),drinkId:drink.id,name:drink.name,size:amount,hydration:Number(drink.hydration)||0,caloriesPer250:Number(drink.calories)||0,caffeinePerServing:Number(drink.caffeine)||0,protein:Number(drink.protein)||0,at:profileDayOffset===0?Date.now():profileDate().setHours(12,0,0,0)};const log=hydrationLog();log.push(entry);saveHydrationLog(log);drink.lastSize=amount;nutrition.lastDrinkSize=amount;recalcFoodTotals();saveAll();renderProfile()}
function removeHydrationEntry(id){const log=hydrationLog(),entry=log.find(x=>String(x.id)===String(id));if(!entry)return;saveHydrationLog(log.filter(x=>String(x.id)!==String(id)));recalcFoodTotals();saveAll();renderProfile()}
function todayHydrationEntries(){const {start,end}=profileDayBounds();return hydrationLog().filter(x=>Number(x.at)>=start&&Number(x.at)<end)}
function historicalDrinks(){const map=new Map();hydrationLog().slice().reverse().forEach(x=>{if(!map.has(x.name))map.set(x.name,{name:x.name,size:x.size,hydration:x.hydration,calories:x.caloriesPer250,caffeine:x.caffeinePerServing})});return[...map.values()]}
function sparklineMarkup(label,key,unit){
 const rows=measurements.filter(m=>Number(m[key])>0);
 if(!rows.length)return`<div class="profile-chart card always-chart"><div class="space"><strong>${label}</strong><span class="small">Noch keine Messung</span></div><div class="empty-chart-line"></div><div class="chart-range chart-dates"><span>Zu Beginn</span><span>–</span></div></div>`;
 const vals=rows.map(m=>Number(m[key])),target=key==="weight"?Number(profile.targetWeight)||0:0;
 const rangeVals=target?[...vals,target]:vals,min=Math.min(...rangeVals),max=Math.max(...rangeVals),span=Math.max(.001,max-min),w=280,h=94,pad=10,plotBottom=h-24,plotHeight=h-40;
 const yFor=v=>plotBottom-((v-min)/span)*plotHeight;
 const pts=vals.map((v,i)=>`${pad+(rows.length===1?0:(i/(rows.length-1))*(w-pad*2))},${yFor(v)}`).join(" ");
 const lastDate=new Date(rows.at(-1).date||Date.now()).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"2-digit"});
 const targetLine=target?`<line x1="${pad}" y1="${yFor(target)}" x2="${w-pad}" y2="${yFor(target)}" class="target-weight-line"/><text x="${w-pad}" y="${Math.max(10,yFor(target)-3)}" text-anchor="end" class="target-weight-label">Ziel ${target} kg</text>`:"";
 const graphic=rows.length===1?`<circle cx="${pad}" cy="${yFor(vals[0])}" r="3.5" fill="currentColor"/>`:`<polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
 return `<div class="profile-chart card always-chart"><div class="space"><strong>${label}</strong><span class="small">${vals.at(-1)} ${unit}</span></div><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} Verlauf">${targetLine}${graphic}</svg><div class="chart-range chart-dates"><span>Zu Beginn<br><b>${vals[0]} ${unit}</b></span><span>${lastDate}<br><b>${vals.at(-1)} ${unit}</b></span></div></div>`
}
function renderMeasurementCharts(){
 const el=$("measurementCharts");if(!el)return;
 const cards=[sparklineMarkup("Gewicht","weight","kg")];
 if(measurements.some(m=>Number(m.bodyfat)>0))cards.push(sparklineMarkup("Körperfett","bodyfat","%"));
 if(measurements.some(m=>Number(m.waist)>0))cards.push(sparklineMarkup("Taille","waist","cm"));
 el.innerHTML=`<div class="measurement-chart-stack">${cards.join("")}</div>`
}
function hasGoalBasis(){
 const w=profileWeight(),height=Number(profile.height),age=Number(profile.age),sex=profile.sex,goal=profile.goal;
 return !!(w&&height&&age&&sex&&goal)
}
let drinksReorderMode=false;
function moveDrink(id,dir){
 const i=nutrition.drinks.findIndex(d=>String(d.id)===String(id)),j=i+dir;
 if(i<0||j<0||j>=nutrition.drinks.length)return;
 [nutrition.drinks[i],nutrition.drinks[j]]=[nutrition.drinks[j],nutrition.drinks[i]];
 saveAll();renderProfile()
}
function dateKeyLocal(ts){const d=new Date(ts);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function hydrationGoalDaysReached(){
 const goal=hasGoalBasis()?hydrateGoal():0;if(!goal)return 0;
 const days=new Map();
 hydrationLog().forEach(x=>{const k=dateKeyLocal(Number(x.at));days.set(k,(days.get(k)||0)+(Number(x.size)||0)*(Number(x.hydration)||0)/100)});
 return [...days.values()].filter(v=>v>=goal).length
}
function selectedWeekInfo(){
 const d=profileDate(),day=d.getDay()||7,start=new Date(d);start.setDate(d.getDate()-day+1);start.setHours(0,0,0,0);
 const end=new Date(start);end.setDate(end.getDate()+7);
 const thursday=new Date(start);thursday.setDate(thursday.getDate()+3);
 const yearStart=new Date(thursday.getFullYear(),0,1),week=Math.ceil((((thursday-yearStart)/86400000)+yearStart.getDay()+1)/7);
 return{start,end,week,label:`KW ${String(week).padStart(2,"0")}`}
}
function currentWeekTrainingDays(){
 const {start,end}=selectedWeekInfo();
 return new Set(history.filter(w=>{const t=Number(w.finishedAt||0);return t>=start.getTime()&&t<end.getTime()}).map(w=>dateKeyLocal(w.finishedAt))).size
}
function weightTrend(){
 const rows=measurements.filter(m=>Number(m.weight)>0),target=Number(profile.targetWeight)||0;
 if(!rows.length)return null;
 const b=Number(rows.at(-1).weight),a=rows.length>1?Number(rows[rows.length-2].weight):b;
 return {delta:Math.round((b-a)*10)/10,current:b,target,distance:target?Math.round((target-b)*10)/10:null,from:new Date((rows.length>1?rows[rows.length-2]:rows[0]).date||Date.now()),to:new Date(rows.at(-1).date||Date.now()),hasTrend:rows.length>1}
}
function renderProfileProgress(){
 const el=$("profileProgressOverview");if(!el)return;
 const wt=weightTrend(),hyd=hydrationGoalDaysReached(),train=currentWeekTrainingDays();
 el.innerHTML=`<div class="section-head"><h2>Fortschritt</h2></div><div class="profile-progress-grid"><div class="card progress-stat"><div class="small">Gewichtstrend</div><strong>${wt&&wt.hasTrend?(wt.delta>0?"+":"")+wt.delta+" kg":wt?wt.current+" kg":"–"}</strong><div class="goal-line">${wt?.target?`Wunschgewicht ${wt.target} kg · ${Math.abs(wt.distance)} kg ${wt.distance<0?"darüber":"bis Ziel"}`:wt&&wt.hasTrend?`${wt.from.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})} → ${wt.to.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}`:"Wunschgewicht im Profil eintragen"}</div></div><div class="card progress-stat"><div class="small">Hydrierungsziel erreicht</div><strong>${hyd}</strong><div class="goal-line">Tage insgesamt</div></div><div class="card progress-stat training-week-stat"><div class="small">Trainingstage Woche</div><div class="week-calendar-label">${selectedWeekInfo().label}</div><strong>${train} / 7</strong><div class="goal-line">Trainingstage</div></div></div>`
}
function renderProfile(){ dailyReset();ensureDrinks();recalcFoodTotals();$("profileDayLabel").textContent=profileDayLabel();$("profileDayDate").textContent=profileDate().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});$("profilePrevDay").onclick=()=>changeProfileDay(-1);$("profileNextDay").onclick=()=>changeProfileDay(1);const latest=measurements.slice().reverse().find(m=>Number(m.weight)>0),currentWeight=Number(latest?.weight||profile.weight||0),basis=hasGoalBasis();$("profileSummary").textContent=[profile.age?profile.age+" J.":"",profile.height?profile.height+" cm":"",currentWeight?currentWeight+" kg":""].filter(Boolean).join(" · ")||"Noch nicht eingerichtet";$("profileGoalSummary").innerHTML=`<span>${profile.goal==="cut"?"Ziel: Gewicht reduzieren":profile.goal==="gain"?"Ziel: Muskelaufbau":profile.goal==="maintain"?"Ziel: Gewicht halten":"Persönliche Werte und Ziele"}</span>${profile.targetWeight?`<span class="target-weight-line-profile">Wunschgewicht ${esc(profile.targetWeight)} kg</span>`:""}`;if($("nutritionCalTarget"))$("nutritionCalTarget").textContent=basis&&nutrition.calories?nutrition.calories+" kcal":"–";if($("nutritionHydrationTarget"))$("nutritionHydrationTarget").textContent=basis&&hydrateGoal()?`${hydrateGoal()} ml`:"–";if($("goalCaloriesHome")&&document.activeElement!==$("goalCaloriesHome"))$("goalCaloriesHome").value=nutrition.calories||"";if($("goalProteinHome")&&document.activeElement!==$("goalProteinHome"))$("goalProteinHome").value=nutrition.protein||"";if($("goalWaterHome")&&document.activeElement!==$("goalWaterHome"))$("goalWaterHome").value=hydrateGoal()||"";
 const goal=basis?hydrateGoal():0,water=Number(nutrition.hydration)||0,cal=Number(nutrition.consumedCalories)||0,proteinToday=Number(nutrition.consumedProtein)||0;
 const calGoal=basis?Number(nutrition.calories)||0:0,proteinGoal=basis?Number(nutrition.protein)||0:0;
 $("foodCaloriesCounter").textContent=`${Math.round(cal)} / ${calGoal||"–"} kcal`;
 $("foodProteinCounter").textContent=`${Math.round(proteinToday*10)/10} / ${proteinGoal||"–"} g`;
 $("foodCaloriesProgress").style.width=calGoal?`${Math.min(100,cal/calGoal*100)}%`:"0%";
 $("foodProteinProgress").style.width=proteinGoal?`${Math.min(100,proteinToday/proteinGoal*100)}%`:"0%";
 const foodRows=todayFoodEntries().slice().reverse();$("todayFoodCount").textContent=foodRows.length;$("todayFoodList").innerHTML=foodRows.map(x=>`<div class="compact-log-row ${foodTone(x.category)}" data-edit-food-entry="${x.id}"><div class="compact-log-copy"><strong>${esc(x.name)}</strong><small>${x.grams} g · ${x.kcal} kcal · ${x.protein} g Protein · ${Math.round(Number(x.water)||0)} ml Wasser</small></div><button class="compact-delete" data-food-del="${x.id}">−</button></div>`).join("")||'<div class="small empty-food-note">Noch nichts eingetragen.</div>';
 document.querySelectorAll("[data-food-del]").forEach(b=>b.onclick=()=>deleteFoodEntry(b.dataset.foodDel));
 
 $("waterView").textContent=`${Math.round(water)} ml`;$("caffeineTodayView").textContent=`${Math.round(Number(nutrition.caffeineToday)||0)} mg`;$("hydrationCaloriesView").textContent=`${Math.round(todayHydrationEntries().reduce((s,x)=>s+(Number(x.caloriesPer250)||0)*Number(x.size||0)/250,0))} kcal`;$("waterGoalView").textContent=goal?`${goal} ml`:"–";$("waterProgress").style.width=goal?`${Math.min(100,water/goal*100)}%`:"0%";
 const drinkRows=todayHydrationEntries().slice().reverse();$("todayDrinkCount").textContent=drinkRows.length;$("todayDrinkList").innerHTML=drinkRows.map(x=>{const d=nutrition.drinks.find(d=>String(d.id)===String(x.drinkId))||{name:x.name,icon:"🥤",kind:"custom"};return`<div class="compact-log-row ${drinkTone(d)}" data-edit-drink-entry="${x.id}"><div class="drink-main compact-log-copy"><span class="drink-icon" aria-hidden="true">${d.icon||"🥤"}</span><div><strong>${esc(x.name)}</strong><small>${x.size} ml · ${Math.round(x.size*x.hydration/100)} ml netto${x.caloriesPer250?` · ${Math.round(x.caloriesPer250*x.size/250)} kcal`:""}${x.caffeinePerServing?` · ${x.caffeinePerServing} mg Koffein`:""}${x.protein?` · ${x.protein} g Protein`:""}</small></div></div><button class="compact-delete" data-hydration-del="${x.id}">−</button></div>`}).join("")||'<div class="small empty-drink-note">Noch nichts eingetragen.</div>';
 $("reorderDrinksBtn").textContent=drinksReorderMode?"↕":"⇅";$("reorderDrinksBtn").classList.toggle("active",drinksReorderMode);$("drinkList").innerHTML=nutrition.drinks.map((d,i)=>`<div class="card drink-card ${drinkTone(d)}" data-direct-drink="${d.id}"><div class="drink-main"><span class="drink-icon" aria-hidden="true">${d.icon||"🥤"}</span><div><strong>${esc(d.name)}</strong><div class="small">${d.lastSize||d.size} ml zuletzt · ${d.hydration}% Hydrierung${d.calories?` · ${d.calories} kcal/250 ml`:""}${d.caffeine?` · ${d.caffeine} mg Koffein`:""}${d.protein?` · ${d.protein} g Protein`:""}</div></div></div><div class="drink-actions">${drinksReorderMode?`<button class="icon-btn" data-drink-up="${d.id}" ${i===0?"disabled":""}>↑</button><button class="icon-btn" data-drink-down="${d.id}" ${i===nutrition.drinks.length-1?"disabled":""}>↓</button>`:`<button class="icon-btn plus-btn" data-drink-add="${d.id}">+</button>${String(d.id)==="water"?"":`<button class="icon-btn danger" data-drink-del="${d.id}">−</button>`}`}</div></div>`).join("");
 $("reorderDrinksBtn").onclick=()=>{drinksReorderMode=!drinksReorderMode;renderProfile()};
 document.querySelectorAll("[data-drink-up]").forEach(b=>b.onclick=()=>moveDrink(b.dataset.drinkUp,-1));
 document.querySelectorAll("[data-drink-down]").forEach(b=>b.onclick=()=>moveDrink(b.dataset.drinkDown,1));
 document.querySelectorAll("[data-drink-add]").forEach(b=>b.onclick=()=>{const d=nutrition.drinks.find(x=>String(x.id)===b.dataset.drinkAdd);if(!d)return;openSheet(d.name,`<div class="form-field"><label>MENGE ML</label><input id="quickDrinkAmount" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div><div class="small">${d.hydration}% Hydrierung${d.calories?` · ${d.calories} kcal/250 ml`:""}${d.caffeine?` · ${d.caffeine} mg Koffein`:""}${d.protein?` · ${d.protein} g Protein`:""}</div><button id="quickDrinkApply" class="primary" style="width:100%;margin-top:10px">Eintragen</button>`);requestAnimationFrame(()=>{const a=$("quickDrinkAmount");a?.scrollIntoView({block:"nearest",behavior:"auto"});a?.focus();a?.select()});$("quickDrinkApply").onclick=()=>{addDrinkEntry(d,$("quickDrinkAmount").value);closeSheet({all:true})}});
 document.querySelectorAll("[data-hydration-del]").forEach(b=>b.onclick=()=>{if(confirm("Diesen Hydrierungseintrag löschen?"))removeHydrationEntry(b.dataset.hydrationDel)});
 document.querySelectorAll("[data-drink-del]").forEach(b=>b.onclick=()=>{const id=b.dataset.drinkDel;if(String(id)==="water")return;if(!confirm("Getränk löschen?"))return;if(BUILTIN_DRINKS.some(x=>String(x.id)===String(id)))nutrition.deletedBuiltinDrinks=[...new Set([...(nutrition.deletedBuiltinDrinks||[]),id])];nutrition.drinks=nutrition.drinks.filter(x=>String(x.id)!==id);saveAll();renderProfile()});
 const selectedMeasurementKey=profileDateKey();
 const dailyMeasurements=measurements.map((m,idx)=>({m,idx})).filter(({m})=>dateKeyLocal(Number(m.date||0))===selectedMeasurementKey).reverse();
 $("measurementSuggestion").innerHTML=dailyMeasurements.length?"":`<button id="measurementSuggestionBtn" class="card measurement-suggestion"><div><strong>Heute messen?</strong><div class="small">Gewicht regelmäßig einzutragen macht den Verlauf aussagekräftiger.</div></div><span class="measurement-chevron">›</span></button>`;
 $("measurementList").innerHTML=dailyMeasurements.map(({m,idx})=>`<div class="card measurement-card"><button class="measurement-main" data-measurement-open="${idx}"><div class="space"><strong>${m.weight?m.weight+" kg":"Messung"}</strong><span class="small">${new Date(m.date||Date.now()).toLocaleDateString("de-DE")}</span></div><div class="measurement-values">${m.bodyfat?`<span>Körperfett ${m.bodyfat}%</span>`:""}${m.waist?`<span>Taille ${m.waist} cm</span>`:""}${m.chest?`<span>Brust ${m.chest} cm</span>`:""}${m.hip?`<span>Hüfte ${m.hip} cm</span>`:""}</div></button><button class="icon-btn danger measurement-delete" data-measurement-delete="${idx}">−</button></div>`).join("");
 renderMeasurementCharts();renderProfileProgress();
 if($("measurementSuggestionBtn"))$("measurementSuggestionBtn").onclick=openMeasurementEntry;
 document.querySelectorAll("[data-measurement-open]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.measurementOpen),m=measurements[i];if(!m)return;openSheet("Messung",`<div class="card"><div class="space"><strong>${m.weight?m.weight+" kg":"Messung"}</strong><span class="small">${new Date(m.date||Date.now()).toLocaleDateString("de-DE")}</span></div><div class="measurement-values">${m.bodyfat?`<span>Körperfett ${m.bodyfat}%</span>`:""}${m.waist?`<span>Taille ${m.waist} cm</span>`:""}${m.chest?`<span>Brust ${m.chest} cm</span>`:""}${m.hip?`<span>Hüfte ${m.hip} cm</span>`:""}</div></div><button id="deleteOpenedMeasurement" class="secondary danger" style="width:100%;margin-top:10px">Messung löschen</button>`);$("deleteOpenedMeasurement").onclick=()=>{if(confirm("Diese Messung wirklich löschen?")){measurements.splice(i,1);profile.weight=Number(measurements.at(-1)?.weight)||"";saveAll();closeSheet({all:true});renderProfile()}}});
 document.querySelectorAll("[data-measurement-delete]").forEach(b=>b.onclick=e=>{e.stopPropagation();const i=Number(b.dataset.measurementDelete);if(confirm("Diese Messung wirklich löschen?")){measurements.splice(i,1);profile.weight=Number(measurements.at(-1)?.weight)||"";saveAll();renderProfile()}})
}
function profileWeight(){const latest=measurements.slice().reverse().find(m=>Number(m.weight)>0);return Number(latest?.weight||profile.weight||0)}
function openProfileEditor(){openSheet("Profil bearbeiten",`<div class="profile-form-section"><h3>Persönliche Daten</h3><div class="grid2"><div class="form-field"><label>ALTER</label><input id="profileAgeEdit" class="field" inputmode="numeric" value="${esc(profile.age||"")}"></div><div class="form-field"><label>GRÖSSE CM</label><input id="profileHeightEdit" class="field" inputmode="numeric" value="${esc(profile.height||"")}"></div></div><div class="form-field"><label>GESCHLECHT FÜR ENERGIEBERECHNUNG</label><select id="profileSexEdit" class="field"><option value="">Nicht gewählt</option><option value="female" ${profile.sex==="female"?"selected":""}>Weiblich</option><option value="male" ${profile.sex==="male"?"selected":""}>Männlich</option></select></div></div><div class="profile-form-section"><h3>Ziel</h3><div class="form-field"><label>ZIEL</label><select id="profileGoalEdit" class="field"><option value="cut" ${profile.goal==="cut"?"selected":""}>Gewicht reduzieren</option><option value="maintain" ${!profile.goal||profile.goal==="maintain"?"selected":""}>Gewicht halten</option><option value="gain" ${profile.goal==="gain"?"selected":""}>Muskelaufbau</option></select></div><div class="form-field"><label>WUNSCHGEWICHT KG</label><input id="profileTargetWeightEdit" class="field" inputmode="decimal" placeholder="z. B. 70" value="${esc(profile.targetWeight||"")}"></div></div><button id="profileSaveEdit" class="primary" style="width:100%">Profil speichern</button>`);$("profileSaveEdit").onclick=()=>{const age=Number($("profileAgeEdit").value),height=Number($("profileHeightEdit").value);if(age&&(age<14||age>100))return alert("Bitte ein realistisches Alter eingeben.");if(height&&(height<120||height>230))return alert("Bitte eine realistische Körpergröße eingeben.");const targetWeight=Number(String($("profileTargetWeightEdit").value).replace(",","."));
 if(targetWeight&&(targetWeight<30||targetWeight>300))return alert("Bitte ein realistisches Wunschgewicht eingeben.");
 profile.age=age||"";profile.height=height||"";profile.sex=$("profileSexEdit").value;profile.goal=$("profileGoalEdit").value;profile.targetWeight=targetWeight||"";saveAll();closeSheet({all:true});renderProfile()}}
function openNutritionGoals(){openSheet("Ernährungsziele",`<div class="grid2"><div class="form-field"><label>KALORIEN / TAG</label><input id="goalCaloriesEdit" class="field" inputmode="numeric" value="${esc(nutrition.calories||"")}"></div><div class="form-field"><label>PROTEIN G / TAG</label><input id="goalProteinEdit" class="field" inputmode="numeric" value="${esc(nutrition.protein||"")}"></div></div><div class="form-field"><label>FLÜSSIGKEIT ML / TAG</label><input id="goalWaterEdit" class="field" inputmode="numeric" value="${esc(nutrition.waterGoal||"")}"></div><button id="goalSaveEdit" class="primary" style="width:100%">Ziele speichern</button>`);$("goalSaveEdit").onclick=()=>{nutrition.calories=Math.max(0,Number($("goalCaloriesEdit").value)||0)||"";nutrition.protein=Math.max(0,Number($("goalProteinEdit").value)||0)||"";nutrition.waterGoal=Math.max(0,Number($("goalWaterEdit").value)||0)||"";nutrition.waterGoalMode="manual";saveAll();closeSheet({all:true});renderProfile()}}
function openMeasurementEntry(){
 $("addMeasurementBtn").click()
}
function measurementTrendAdjustment(goal){
 const rows=measurements.filter(m=>Number(m.weight)>0).slice(-6);if(rows.length<2)return 0;
 const a=rows[0],b=rows[rows.length-1],days=Math.max(1,(Number(b.date)-Number(a.date))/86400000);if(days<7)return 0;
 const weekly=((Number(b.weight)-Number(a.weight))/Number(a.weight))*(7/days);
 if(goal==="cut"){if(weekly>-0.002)return-100;if(weekly<-0.01)return100}
 if(goal==="gain"){if(weekly<0.001)return100;if(weekly>0.006)return-100}
 return 0
}
function currentBodyFatPct(){
 const m=measurements.slice().reverse().find(x=>Number(x.bodyfat||x.bodyFat||x.fat)>0);
 return Number(m?.bodyfat||m?.bodyFat||m?.fat||0)
}
function energyBMR(weight,height,age,sex,bodyFat){
 if(bodyFat>2&&bodyFat<65){const lean=weight*(1-bodyFat/100);return 370+21.6*lean}
 return 10*weight+6.25*height-5*age+(sex==="male"?5:-161)
}
function activityWaterExtra(activity){
 const a=Number(activity)||1.2;
 return a>=1.9?1000:a>=1.725?750:a>=1.55?500:a>=1.375?250:0
}
function calculateProfileGoals(){
 const w=profileWeight(),age=Number(profile.age),height=Number(profile.height),sex=profile.sex,goal=profile.goal,activity=Number(profile.activity)||1.55,bf=currentBodyFatPct();
 if(!w){openMeasurementEntry();requestAnimationFrame(()=>{$("measureWeight")?.focus()});return}
 if(!age||!height||!sex||!goal){openProfileEditor();return}
 const bmr=energyBMR(w,height,age,sex,bf),tdee=bmr*activity,goalFactor=goal==="cut"?.80:goal==="gain"?1.03:.95;
 let kcal=Math.max(bmr*1.05,tdee*goalFactor)+measurementTrendAdjustment(goal);kcal=Math.round(kcal/25)*25;
 const protein=Math.round(w*1.6);
 const basePerKg=age>=51?30:35;
 let water=w*basePerKg+activityWaterExtra(activity);
 if(bf>0&&((sex==="male"&&bf<15)||(sex!=="male"&&bf<23)))water+=150;
 water=Math.max(1500,Math.min(5500,Math.round(water/50)*50));
 openSheet("Persönlicher Wert",`<div class="card"><div class="small">VORSCHLAG</div><strong style="font-size:22px">${kcal} kcal</strong><div class="measurement-values"><span>${protein} g Protein</span><span>${water} ml Flüssigkeit gesamt</span></div><div class="goal-line" style="margin-top:10px">Kalorien bewusst am unteren Rand der Zielorientierung. Flüssigkeit gewichtsabhängig als Gesamtwasser aus Getränken + Lebensmitteln berechnet; Aktivität erhöht den Bedarf.${bf?` Körperfett ${bf}% wurde berücksichtigt.`:""}</div></div><button id="applyCalculatedGoals" class="primary" style="width:100%">Als Ziele übernehmen</button>`);
 $("applyCalculatedGoals").onclick=()=>{nutrition.calories=kcal;nutrition.protein=protein;nutrition.waterGoal=water;nutrition.waterGoalMode="auto";nutrition.goalCalculatedAt=Date.now();saveAll();closeSheet({all:true});renderProfile()}
}
$("addFoodTodayBtn").onclick=()=>openFoodSearch("");
$("editProfileBtn").onclick=openProfileEditor;
function openQuickDrinkEntry(){
 ensureDrinks();let selectedId=nutrition.drinks[0]?.id||null;
 const render=()=>{const d=nutrition.drinks.find(x=>String(x.id)===String(selectedId))||nutrition.drinks[0];if(!d)return;
  $("sheetBody").innerHTML=`<div class="quick-drink-grid">${nutrition.drinks.map(x=>`<button class="quick-drink-choice ${String(x.id)===String(d.id)?"active":""} ${drinkTone(x)}" data-quick-drink="${x.id}"><span class="drink-icon">${x.icon||"🥤"}</span><span>${esc(x.name)}</span></button>`).join("")}</div><div class="form-field" style="margin-top:12px"><label>MENGE ML</label><input id="quickDrinkAmount" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div><div class="small quick-drink-meta">${d.hydration}% Hydrierung · ${d.calories||0} kcal/250 ml · ${d.caffeine||0} mg Koffein</div><button id="quickDrinkApply" class="primary" style="width:100%;margin-top:12px">Eintragen</button>`;
  document.querySelectorAll("[data-quick-drink]").forEach(b=>b.onclick=()=>{selectedId=b.dataset.quickDrink;render();requestAnimationFrame(()=>{const a=$("quickDrinkAmount");a?.scrollIntoView({block:"nearest",behavior:"auto"});a?.focus();a?.select()})});
  $("quickDrinkApply").onclick=()=>{addDrinkEntry(d,$("quickDrinkAmount").value);closeSheet({all:true})}
 };
 openSheet("Getränk eintragen","");render()
}
$("addWaterBtn").onclick=openQuickDrinkEntry;
$("newDrinkBtn").onclick=()=>{const hist=historicalDrinks();openSheet("Getränk erstellen",`${hist.length?`<div class="small" style="margin-bottom:8px">Aus Verlauf übernehmen</div><div class="chips">${hist.slice(0,12).map((d,i)=>`<button class="chip" data-hist-drink="${i}">${esc(d.name)}</button>`).join("")}</div>`:""}<div class="form-field"><label>Name</label><input id="drinkName" class="field" placeholder="z. B. Kaffee"></div><div class="grid2"><div class="form-field"><label>Größe ml</label><input id="drinkSize" class="field" inputmode="numeric" value="${nutrition.lastDrinkSize||250}"></div><div class="form-field"><label>Hydrierung %</label><input id="drinkHydration" class="field" inputmode="numeric" value="100"></div></div><div class="grid2"><div class="form-field"><label>Kalorien / 250 ml</label><input id="drinkCalories" class="field" inputmode="decimal" value="0"></div><div class="form-field"><label>Koffein mg</label><input id="drinkCaffeine" class="field" inputmode="numeric" value="0"></div></div><button id="drinkSave" class="primary" style="width:100%">Speichern</button>`);document.querySelectorAll("[data-hist-drink]").forEach(b=>b.onclick=()=>{const d=hist[Number(b.dataset.histDrink)];$("drinkName").value=d.name;$("drinkSize").value=d.size;$("drinkHydration").value=d.hydration;$("drinkCalories").value=d.calories;$("drinkCaffeine").value=d.caffeine})};
$("addMeasurementBtn").onclick=()=>openSheet("Heute messen",`<div class="grid2"><div class="form-field"><label>Gewicht KG</label><input id="measureWeight" class="field" inputmode="decimal"></div><div class="form-field"><label>Körperfett in %</label><input id="measureBodyfat" class="field" inputmode="decimal"></div></div><div class="grid2"><div class="form-field"><label>Taille cm</label><input id="measureWaist" class="field" inputmode="decimal"></div><div class="form-field"><label>Brust cm</label><input id="measureChest" class="field" inputmode="decimal"></div></div><div class="grid2"><div class="form-field"><label>Hüfte cm</label><input id="measureHip" class="field" inputmode="decimal"></div><div class="form-field"><label>AKTIVITÄT</label><select id="measureActivity" class="field"><option value="1.2" ${String(profile.activity)==="1.2"?"selected":""}>Wenig aktiv</option><option value="1.375" ${String(profile.activity)==="1.375"?"selected":""}>Leicht aktiv</option><option value="1.55" ${!profile.activity||String(profile.activity)==="1.55"?"selected":""}>Moderat aktiv</option><option value="1.725" ${String(profile.activity)==="1.725"?"selected":""}>Sehr aktiv</option><option value="1.9" ${String(profile.activity)==="1.9"?"selected":""}>Extrem aktiv</option></select></div></div><button id="measureSave" class="primary" style="width:100%">Speichern</button>`);
$("settingsBtn").onclick=()=>openSettingsPage();
function openMeasurementRecord(i){const m=measurements[i];if(!m)return;openSheet("Messung",`<div class="card"><strong>${m.weight||"–"} kg</strong><div class="small">${new Date(m.date||Date.now()).toLocaleString("de-DE")}</div><div class="measurement-values" style="margin-top:12px">${m.bodyfat?`<span>Körperfett ${m.bodyfat}%</span>`:""}${m.waist?`<span>Taille ${m.waist} cm</span>`:""}${m.chest?`<span>Brust ${m.chest} cm</span>`:""}${m.hip?`<span>Hüfte ${m.hip} cm</span>`:""}</div></div><button id="deleteMeasurementRecord" class="secondary danger" style="width:100%;margin-top:12px">Messung löschen</button>`);$("deleteMeasurementRecord").onclick=()=>{if(confirm("Diese Messung wirklich löschen?")){measurements.splice(i,1);saveAll();closeSheet({all:true});renderProfile();toast("Messung gelöscht")}}}
function openTrainingData(){
 const planRows=plans.map(p=>`<div class="card"><div class="space"><div><strong>${esc(p.name)}</strong><div class="small">Plan · ${p.exercises?.length||0} Übungen · ${countPlanSets(p)} Sätze</div></div><span>›</span></div></div>`).join("");
 const historyRows=history.slice().reverse().map((w,ri)=>{const i=history.length-1-ri;return`<div class="card"><div class="space"><div><strong>${esc(w.name||w.planName||"Training")}</strong><div class="small">${new Date(w.finishedAt||w.startedAt||Date.now()).toLocaleString("de-DE")} · ${w.exercises?.length||0} Übungen</div></div><button class="icon-btn danger" data-settings-history-del="${i}">−</button></div></div>`}).join("");
 openSheet("Trainingsdaten",`${planRows||'<div class="card small">Keine Trainingspläne gespeichert.</div>'}${historyRows||'<div class="card small">Noch keine abgeschlossenen Trainings.</div>'}`);
 document.querySelectorAll('[data-settings-history-del]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.settingsHistoryDel);if(confirm("Diesen Trainingseintrag wirklich löschen?")){history.splice(i,1);saveAll();openTrainingData();renderTrainingHome()}})
}
function openMeasurementData(){openSheet("Messungen",`${measurements.slice().reverse().map((m,ri)=>{const i=measurements.length-1-ri;return`<div class="card" data-settings-measure-open="${i}"><div class="space"><div><strong>${m.weight||"–"} kg</strong><div class="small">${new Date(m.date||Date.now()).toLocaleString("de-DE")}</div></div><span>›</span></div></div>`}).join("")||'<div class="card small">Noch keine Messungen.</div>'}`);document.querySelectorAll('[data-settings-measure-open]').forEach(b=>b.onclick=()=>openMeasurementRecord(Number(b.dataset.settingsMeasureOpen)))}
function openHydrationData(){openSheet("Hydrierungsdaten",`${hydrationLog().slice().reverse().map(x=>`<div class="card"><div class="space"><div><strong>${esc(x.name)}</strong><div class="small">${new Date(x.at).toLocaleString("de-DE")} · ${x.size} ml · ${Math.round(x.size*x.hydration/100)} ml netto</div></div><button class="icon-btn danger" data-settings-hydration-del="${x.id}">−</button></div></div>`).join("")||'<div class="card small">Noch keine Hydrierungsdaten.</div>'}`);document.querySelectorAll('[data-settings-hydration-del]').forEach(b=>b.onclick=()=>{if(confirm("Diesen Hydrierungseintrag wirklich löschen?")){removeHydrationEntry(b.dataset.settingsHydrationDel);openHydrationData()}})}
function openNutritionData(){
 const logs=(nutrition.foodLog||[]).slice().reverse().map(x=>`<div class="card"><strong>${esc(x.name||x.foodName||"Eintrag")}</strong><div class="small">${esc(x.date||"")} · ${Number(x.kcal||x.calories||0)} kcal · ${Number(x.protein||0)} g Protein</div></div>`).join("");
 const foods=(nutrition.foods||[]).map(x=>`<div class="card"><strong>${esc(x.name||"Lebensmittel")}</strong><div class="small">Eigenes Lebensmittel</div></div>`).join("");
 const meals=(nutrition.meals||[]).map(x=>`<div class="card"><strong>${esc(x.name||"Gericht")}</strong><div class="small">Gespeicherte Mahlzeit</div></div>`).join("");
 openSheet("Ernährungsdaten",`${logs||'<div class="card small">Kein Ernährungsverlauf.</div>'}${foods}${meals}`)
}
function clearTrainingData(){if(!confirm("Alle Trainingsdaten wirklich löschen? Pläne und Trainingsverlauf werden entfernt."))return;plans=[];history=[];activeWorkout=null;localStorage.removeItem(STORAGE.active);saveAll();renderPlans();renderTrainingHome();toast("Trainingsdaten gelöscht");openSettingsPage()}
function clearMeasurements(){if(!confirm("Alle Messungen wirklich löschen?"))return;measurements=[];saveAll();renderProfile();toast("Messungen gelöscht");openSettingsPage()}
function clearHydrationData(){if(!confirm("Alle Hydrierungsdaten wirklich löschen? Deine Getränkeliste bleibt erhalten."))return;saveHydrationLog([]);nutrition.hydration=0;nutrition.consumedCalories=0;nutrition.caffeineToday=0;saveAll();renderProfile();toast("Hydrierungsdaten gelöscht");openSettingsPage()}
function openSettingsPage(){openPage("settingsPage",()=>{
 $("settingsBody").innerHTML=`<div class="settings-section"><h3>Profil</h3><div class="settings-card">
  <div class="settings-row"><div><strong>Persönliche Daten</strong><small>Alter, Größe, Geschlecht, Aktivität, Ziel</small></div><button id="settingsProfileEdit" class="secondary compact-profile-edit">Bearbeiten</button></div>
  <div class="settings-row"><div><strong>Ernährungsziele</strong><small>Kalorien, Protein, Flüssigkeit</small></div><button id="settingsGoalsEdit" class="secondary compact-profile-edit">Bearbeiten</button></div>
 </div></div>
 <div class="settings-section"><h3>Training</h3><div class="settings-card">
  <div class="settings-row"><div><strong>Standardpause</strong><small>Für neue Übungen</small></div><select id="settingsRestSelect" class="field" style="width:120px">${[30,45,60,90,120,150,180,240,300].map(x=>`<option value="${x}" ${Number(localStorage.getItem(REST_DEFAULT_KEY)||90)===x?"selected":""}>${formatTime(x)}</option>`).join("")}</select></div>
 </div></div>
 <div class="settings-section"><h3>Daten & App</h3><div class="settings-card">
  <div class="settings-row" id="openTrainingData"><div><strong>Trainingsdaten</strong><small>Pläne und Trainingsverlauf · antippen zum Abrufen</small></div><button id="clearTrainingDataBtn" class="secondary danger compact-profile-edit">Löschen</button></div>
  <div class="settings-row" id="openMeasurementData"><div><strong>Messungen</strong><small>Gespeicherte Körpermessungen · antippen zum Abrufen</small></div><button id="clearMeasurementsBtn" class="secondary danger compact-profile-edit">Löschen</button></div>
  <div class="settings-row" id="openHydrationData"><div><strong>Hydrierungsdaten</strong><small>Gespeicherter Trinkverlauf · antippen zum Abrufen</small></div><button id="clearHydrationDataBtn" class="secondary danger compact-profile-edit">Löschen</button></div>
  <div class="settings-row" id="openNutritionData"><div><strong>Ernährungsdaten</strong><small>Verlauf, eigene Lebensmittel, Mahlzeiten und Ziele · antippen zum Abrufen</small></div><button id="clearNutritionDataBtn" class="secondary danger compact-profile-edit">Löschen</button></div>
  <div class="settings-row"><div><strong>Backup erstellen</strong><small>Persönliche App-Daten als Backup.json sichern</small></div><button id="settingsBackupExport" class="secondary compact-profile-edit">Sichern</button></div>
  <div class="settings-row"><div><strong>Backup wiederherstellen</strong><small>Persönliche Daten aus Backup.json wiederherstellen</small></div><button id="settingsBackupRestore" class="secondary compact-profile-edit">Wiederherstellen</button></div>
 </div></div>`;
 $("settingsProfileEdit").onclick=openProfileEditor;
 $("settingsGoalsEdit").onclick=openNutritionGoals;
 $("settingsRestSelect").onchange=()=>localStorage.setItem(REST_DEFAULT_KEY,$("settingsRestSelect").value);
 $("openTrainingData").onclick=e=>{if(!e.target.closest("#clearTrainingDataBtn"))openTrainingData()};
 $("openMeasurementData").onclick=e=>{if(!e.target.closest("#clearMeasurementsBtn"))openMeasurementData()};
 $("openHydrationData").onclick=e=>{if(!e.target.closest("#clearHydrationDataBtn"))openHydrationData()};
 $("openNutritionData").onclick=e=>{if(!e.target.closest("#clearNutritionDataBtn"))openNutritionData()};

 $("clearTrainingDataBtn").onclick=clearTrainingData;
 $("clearMeasurementsBtn").onclick=clearMeasurements;
 $("clearHydrationDataBtn").onclick=clearHydrationData;
 $("clearNutritionDataBtn").onclick=()=>window.rethinkDeleteAllNutrition?.();
 $("settingsBackupExport").onclick=()=>window.rethinkBackup?.export?.();
 $("settingsBackupRestore").onclick=()=>window.rethinkBackup?.restore?.()
})}
document.addEventListener("click",e=>{
 if(e.target.id==="drinkSave"){const size=Math.max(1,Math.min(1000,Number($("drinkSize").value)||250));ensureDrinks();nutrition.drinks.push({id:String(uid()),name:$("drinkName").value.trim()||"Getränk",icon:"🥤",kind:"custom",size,hydration:Number($("drinkHydration").value)||0,calories:Number($("drinkCalories").value)||0,caffeine:Number($("drinkCaffeine").value)||0});nutrition.lastDrinkSize=size;saveAll();closeSheet();renderProfile()}
 if(e.target.id==="measureSave"){const weight=Number(String($("measureWeight").value).replace(",","."));if(!weight||weight<20||weight>400){$("measureWeight").focus();return alert("Bitte Gewicht eintragen.")}const measurementDate=profileDayOffset===0?Date.now():profileDate().setHours(12,0,0,0);const m={date:measurementDate,weight,bodyfat:$("measureBodyfat").value,waist:$("measureWaist").value,chest:$("measureChest").value,hip:$("measureHip").value};measurements.push(m);measurements.sort((a,b)=>Number(a.date)-Number(b.date));profile.weight=Number(measurements.slice().reverse().find(x=>Number(x.weight)>0)?.weight)||weight;if($("measureActivity"))profile.activity=$("measureActivity").value;saveAll();closeSheet();renderProfile()}
 if(e.target.id==="settingsSave"){profile.weight=$("setWeight").value;profile.height=$("setHeight").value;nutrition.calories=$("setCalories").value;nutrition.protein=$("setProtein").value;localStorage.setItem(REST_DEFAULT_KEY,$("setRest").value||"90");saveAll();closeSheet();renderProfile()}
})
document.addEventListener("click",e=>{if(e.target.closest("button,input,select,textarea,a"))return;if(e.clientY>85)return;const p=document.querySelector(".page:not(.hidden)");if(p)p.scrollTo({top:0,behavior:"smooth"});else window.scrollTo({top:0,behavior:"smooth"})});
let currentSheetState=null;
function renderSheetState(state){currentSheetState=state;$("sheetTitle").textContent=state.title;$("sheetBody").innerHTML=state.body;$("sheetWrap").classList.remove("hidden");if(typeof state.bind==="function")state.bind();requestAnimationFrame(()=>{$("sheetBody").scrollTop=state.scroll||0})}
function openSheet(t,b,bind=null,{replace=false}={}){if(!replace&&!$("sheetWrap").classList.contains("hidden")&&currentSheetState)sheetStack.push({...currentSheetState,scroll:$("sheetBody").scrollTop||0});renderSheetState({title:t,body:b,scroll:0,bind})}
function closeSheet({all=false}={}){if(!all&&sheetStack.length){renderSheetState(sheetStack.pop());return}sheetStack=[];currentSheetState=null;$("sheetWrap").classList.add("hidden")}
function cancelTask(){planAddFlow=null;sheetStack=[];currentSheetState=null;$("sheetWrap").classList.add("hidden");exerciseDetailReturn=null}
$("sheetBack").onclick=()=>{if(planAddFlow)planAddBack();else closeSheet({all:false})};$("sheetClose").onclick=()=>{if(planAddFlow)cancelPlanAddFlow();else cancelTask()};
function formatTime(s){s=Math.max(0,Number(s)||0);return`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}function parseTime(v){const x=String(v).trim();if(x.includes(":")){const[m,s]=x.split(":").map(Number);return(m||0)*60+(s||0)}return(Number(x)||0)*60}function formatDuration(ms){const s=Math.max(0,Math.floor(ms/1000)),m=Math.floor(s/60),r=s%60;return`${m}:${String(r).padStart(2,"0")}`}
loadData();if(weekOffset!==0){const _dated=loadDatedWeeks();weekPlan=_dated[weekKeyForOffset()]||[[],[],[],[],[],[],[]];weekPlan=weekPlan.map(x=>Array.isArray(x)?x:(x!=null?[x]:[]))}dailyReset();ensureDrinks();renderExerciseLibrary();renderPlans();renderTrainingHome();renderWeek();renderProfile();restoreUI();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});