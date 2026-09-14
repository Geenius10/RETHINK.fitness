"use strict";
/* Single render authorities. Feature blocks register pre/post hooks instead of replacing render functions. */
const __rt=window.__rt={
 live:{core:null,pre:[],post:[]},
 profile:{pre:[],post:[]},
 week:{core:null,pre:[],post:[]},
 profileProgress:{core:null,pre:[],post:[]}
};

/* ReThink current runtime — consolidated from audited legacy patches. */

/* Unified exercise add/edit/replace flow */
// v44: keep the familiar "Übung hinzufügen" configuration UI for creation AND editing.
// Confirmed edits of an existing non-running plan are permanent on that original plan.
(function(){
 const originalMarkEditorDirty=window.markEditorDirty;
 const originalCommitPlanAddFlow=window.commitPlanAddFlow;

 function persistExistingEditorPlan(){
  if(!currentPlan?._editingSourceId)return false;
  const src=plans.find(p=>p.id===currentPlan._editingSourceId);if(!src)return false;
  const saved=clone(currentPlan);
  saved.id=src.id;saved.name=String(currentPlan.name||src.name||'').trim()||src.name;
  saved.createdAt=src.createdAt;saved.updatedAt=Date.now();
  delete saved._editingSourceId;delete saved._originalName;delete saved._isNew;
  plans=plans.map(p=>p.id===src.id?saved:p);saveAll();renderPlans();return true
 }
 window.persistExistingEditorPlan=persistExistingEditorPlan;
 window.markEditorDirty=function(){
  editorDirty=true;persistUI();
  // Existing plans stay as an editor draft until the user explicitly decides to save.
  // This keeps the original plan reversible while leaving the familiar editor UI untouched.
 };

 function groupContextFor(collection,i){
  const old=collection?.[i];if(!old||!groupMethod(old.setTechnique)||!old.techniqueGroup)return null;
  const idx=collection.map((x,j)=>x.techniqueGroup===old.techniqueGroup&&x.setTechnique===old.setTechnique?j:-1).filter(j=>j>=0);
  return {id:old.techniqueGroup,method:old.setTechnique,indexes:idx,count:idx.length,originalIndex:i}
 }
 function baseEditFlow(context,i,seed){
  const collection=context==='live'?activeWorkout?.exercises:currentPlan?.exercises;if(!collection?.[i])return;
  const g=groupContextFor(collection,i),draft=clone(seed||collection[i]);delete draft.liveSets;
  // A single member of a connected series is configured like a normal single exercise.
  // The wrapper (Superset/Giant/Pre-Exhaust) is restored only on commit.
  if(g){draft.setTechnique='standard';draft.techniqueGroup=null;draft.linkedExerciseNames=[];draft.methodData={};if(!draft.reps||['20','30','20-30'].includes(String(draft.reps)))draft.reps='8-12'}
  planAddFlow={context,step:'config',q:exercisePickerState.q||'',type:exercisePickerState.type||'Alle',muscles:new Set(exercisePickerState.muscles||[]),drafts:[],history:[],methodScroll:0,editSourceIndexes:[i],memberGroup:g,memberMethodExplicit:false,current:draft,from:'edit'};
  renderPlanAddConfig()
 }
 function startReplacement(context,i,name){
  const collection=context==='live'?activeWorkout?.exercises:currentPlan?.exercises,old=collection?.[i];if(!old)return;
  const g=groupContextFor(collection,i),fresh=findExercise(name);
  const keep={measureMode:old.measureMode,reps:old.reps,timeSeconds:old.timeSeconds,sets:old.sets,rest:old.rest,variant:'',perSide:old.perSide,note:old.note};
  let seed=normPlanEx({...fresh,...keep,setTechnique:g?'standard':(old.setTechnique||'standard'),methodData:g?{}:clone(old.methodData||{})});
  baseEditFlow(context,i,seed)
 }
 window.configureExercise=function(i){baseEditFlow('plan',i)};
 window.replacePlanExercise=function(i){
  const old=currentPlan?.exercises?.[i];if(!old)return;
  openExercisePicker(name=>startReplacement('plan',i,name),{exclude:new Set([old.name]),title:'Übung austauschen',detailAdd:true})
 };
 window.configureLiveExercise=function(i){baseEditFlow('live',i)};

 // Reuse the same add flow for adding a new exercise during a running workout.
 function startUnifiedLiveAdd(name){
  const draft=normPlanEx({...findExercise(name),sets:3,setTechnique:'standard',reps:'8-12',rest:Number(localStorage.getItem(REST_DEFAULT_KEY)||90)});
  planAddFlow={context:'live',step:'config',q:exercisePickerState.q||'',type:exercisePickerState.type||'Alle',muscles:new Set(exercisePickerState.muscles||[]),drafts:[],history:[],methodScroll:0,current:draft,from:'picker'};
  renderPlanAddConfig()
 }
 if($('liveAddExercise'))$('liveAddExercise').onclick=()=>openExercisePicker(startUnifiedLiveAdd,{detailAdd:true});

 window.confirmPlanAddDraft=function(){
  if(!planAddFlow?.current)return;savePlanAddFormToDraft();
  const validation=validateExerciseDraft(planAddFlow.current);if(validation)return toast(validation);
  let e=clone(planAddFlow.current),method=e.setTechnique||'standard';
  // Editing one member of an existing connected series: configure it as a single exercise,
  // then put it back into exactly the same group slot on commit.
  if(planAddFlow.memberGroup&&!planAddFlow.memberMethodExplicit){
   const g=planAddFlow.memberGroup;e.setTechnique=g.method;e.techniqueGroup=g.id;e.linkedExerciseNames=[];
   if(g.method==='giant'){e.methodData=e.methodData||{};e.methodData.giantCount=g.count}
   planAddFlow.drafts=[e];commitPlanAddFlow();return
  }
  // If the user explicitly selects a different method while editing a group member,
  // that member leaves the old wrapper and follows the same universal target-method flow
  // as every other exercise, including partner selection for Superset/Giant/Pre-Exhaust.
  if(planAddFlow.memberGroup&&planAddFlow.memberMethodExplicit){e.techniqueGroup=null;e.linkedExerciseNames=[]}
  if(methodNeedsPartners(method)){
   if(!planAddFlow.group){const target=method==='giant'?(e.methodData.giantCount||3):2;planAddFlow.group={id:`tg_${uid()}`,method,target};e.techniqueGroup=planAddFlow.group.id}
   else e.techniqueGroup=planAddFlow.group.id;
   if(!Number.isFinite(Number(e._draftOrder)))e._draftOrder=planAddFlow.drafts.length;
   e.groupPosition=Number(e._draftOrder);
   planAddFlow.drafts.push(e);
   if(planAddFlow.drafts.length<planAddFlow.group.target){planAddFlow.current=null;renderPartnerExercisePicker();return}
   const master=planAddFlow.drafts[0],gid=planAddFlow.group.id;
   planAddFlow.drafts.forEach(d=>{d.setTechnique=planAddFlow.group.method;d.techniqueGroup=gid;d.sets=master.sets;d.rest=master.rest});
   commitPlanAddFlow();return
  }
  planAddFlow.drafts.push(e);commitPlanAddFlow()
 };

 window.commitPlanAddFlow=function(){
  if(!planAddFlow?.drafts?.length)return;
  let drafts=planAddFlow.drafts.map(clone);
  const detached=drafts.flatMap(d=>Array.isArray(d._detachedAfterConversion)?d._detachedAfterConversion.map(clone):[]);
  if(drafts.some(d=>Number.isFinite(Number(d.groupPosition))||Number.isFinite(Number(d._draftOrder))))drafts.sort((a,b)=>{const ap=Number.isFinite(Number(a.groupPosition))?Number(a.groupPosition):(Number.isFinite(Number(a._draftOrder))?Number(a._draftOrder):999),bp=Number.isFinite(Number(b.groupPosition))?Number(b.groupPosition):(Number.isFinite(Number(b._draftOrder))?Number(b._draftOrder):999);return ap-bp});
  if(drafts.length>1&&methodNeedsPartners(drafts[0]?.setTechnique||planAddFlow.group?.method))drafts.forEach((d,i)=>d.groupPosition=i);
  drafts.forEach(d=>{delete d._draftOrder;delete d._detachedAfterConversion});
  detached.forEach(d=>{d.techniqueGroup=null;d.linkedExerciseNames=[];d.setTechnique='standard';d.methodData={};if(!d.reps||['20','30','20-30'].includes(String(d.reps)))d.reps='8-12';delete d.liveSets});
  const memberGroup=planAddFlow.memberGroup;
  const preserveMemberGroup=!!memberGroup&&!planAddFlow.memberMethodExplicit;
  const method=preserveMemberGroup?memberGroup.method:(planAddFlow.group?.method||drafts[0]?.setTechnique||'standard');
  const target=preserveMemberGroup?1:(planAddFlow.group?.target||drafts.length);
  if(!preserveMemberGroup){const validation=validateDraftCollection(drafts,method,target);if(validation)return toast(validation)}
  const edited=Array.isArray(planAddFlow.editSourceIndexes)&&planAddFlow.editSourceIndexes.length,liveContext=planAddFlow.context==='live',collection=liveContext?activeWorkout.exercises:currentPlan.exercises;
  if(liveContext){
   const oldByIndex=new Map((planAddFlow.editSourceIndexes||[]).map(i=>[i,clone(collection[i]?.liveSets||[])]));
   drafts.forEach((d,k)=>{
     const old=oldByIndex.get((planAddFlow.editSourceIndexes||[])[k])||[];
     d.liveSets=rebuildLiveSetsForExercise(d,old)
   });
   detached.forEach(d=>d.liveSets=rebuildLiveSetsForExercise(d,[]));
   applyPreviousWorkoutSuggestions({exercises:[...drafts,...detached]})
  }
  let insertAt=collection.length;
  if(edited){const indexes=[...planAddFlow.editSourceIndexes].sort((a,b)=>a-b);insertAt=indexes[0];[...indexes].sort((a,b)=>b-a).forEach(i=>collection.splice(i,1));collection.splice(insertAt,0,...drafts,...detached)}
  else collection.push(...drafts);
  if(memberGroup){
   const source=collection[insertAt]||collection.find(x=>x.techniqueGroup===memberGroup.id);
   normalizeGroupCollection(collection,memberGroup.id,source);
   if(liveContext)collection.filter(x=>x.techniqueGroup===memberGroup.id).forEach(x=>x.liveSets=rebuildLiveSetsForExercise(x,x.liveSets||[]))
  }
  if(liveContext){markLiveStructureEdited();saveAll();renderLive()}else{markEditorDirty();renderEditorExercises();persistUI()}
  const wasEdit=edited;planAddFlow=null;sheetStack=[];currentSheetState=null;$('sheetWrap').classList.add('hidden');
  toast(wasEdit?'Änderung übernommen':(drafts.length>1?`${drafts.length} Übungen hinzugefügt`:'Übung hinzugefügt'))
 };

 // Existing plan outside a workout: ask exactly once on leaving/saving.
 // Save overwrites the original plan. Discard closes the editor and leaves the saved original untouched.
 function askExistingPlanSaveOrDiscard({toPlans=false}={}){
  openSheet('Plan speichern?',`<p class="muted">Möchtest du die Änderungen an diesem Plan speichern?</p><div class="save-choice-stack"><button id="confirmExistingPlanSave" class="primary">Plan speichern</button><button id="discardExistingPlanChanges" class="secondary danger">Änderungen verwerfen</button><button id="stayInExistingPlan" class="secondary">Weiter bearbeiten</button></div>`);
  $('confirmExistingPlanSave').onclick=()=>{if(persistExistingEditorPlan()){closeSheet({all:true});editorDirty=false;closePage();if(toPlans)showTab('plans');renderPlans()}};
  $('discardExistingPlanChanges').onclick=()=>{closeSheet({all:true});editorDirty=false;closePage();if(toPlans)showTab('plans');renderPlans()};
  $('stayInExistingPlan').onclick=()=>closeSheet({all:true});
 }
 if($('planEditorBack'))$('planEditorBack').onclick=()=>{
  if(currentPlan?._editingSourceId){if(!editorHasChanges()){closePage();renderPlans();return}askExistingPlanSaveOrDiscard({toPlans:false});return}
  if(!editorHasChanges()){closePage();return}
  openSheet('Planbearbeitung verlassen?',`<p class="muted">Du hast einen neuen, noch nicht gespeicherten Plan.</p><div class="save-choice-stack"><button id="backSavePlan" class="primary">Plan speichern</button><button id="discardPlanChanges" class="secondary danger">Plan verwerfen</button><button id="stayInPlan" class="secondary">Weiter bearbeiten</button></div>`);
  $('discardPlanChanges').onclick=()=>{closeSheet({all:true});editorDirty=false;closePage()};$('stayInPlan').onclick=()=>closeSheet({all:true});$('backSavePlan').onclick=()=>{closeSheet({all:true});if(saveCurrentPlan()){editorDirty=false;closePage();renderPlans()}}
 };
 if($('liveBackBtn'))$('liveBackBtn').onclick=()=>leaveLiveToTraining();

 if($('planSaveBtn'))$('planSaveBtn').onclick=()=>{
  if(currentPlan?._editingSourceId){if(!editorHasChanges()){closePage();showTab('plans');renderPlans();return}askExistingPlanSaveOrDiscard({toPlans:true});return}
  if(!editorHasChanges()){closePage();showTab('plans');return}
  openSheet('Plan wirklich speichern?',`<p class="muted">Möchtest du diesen Trainingsplan speichern?</p><div class="grid2"><button id="cancelPlanSave" class="secondary">Abbrechen</button><button id="confirmPlanSave" class="primary">Speichern</button></div>`);
  $('cancelPlanSave').onclick=()=>closeSheet({all:true});$('confirmPlanSave').onclick=()=>{if(saveCurrentPlan()){closeSheet({all:true});closePage();showTab('plans');renderPlans()}}
 };

 // Rebind current editor/list if visible after overriding handlers.
 if(currentPlan&&!$('planEditorPage')?.classList.contains('hidden'))renderEditorExercises();
 if(activeWorkout&&!$('livePage')?.classList.contains('hidden'))renderLive();
})();

/* Training-method configuration and pyramid rules */
(function(){
 const basePrepare=window.prepareDraftForTargetMethod;
 const baseValidate=window.validateExerciseDraft;
 const baseRenderSets=window.renderSets;
 const basePlanPrescription=window.planPrescription;
 const baseOpenSummary=window.openSummary;

 // Practical per-exercise / per-series working-set ranges. These are UI guardrails, not training prescriptions.
 const SET_OPTIONS=Array.from({length:10},(_,i)=>i+1);
 const DEFAULT_SETS={standard:3,superset:3,giant:3,preexhaust:3,dropset:3,restpause:1,cluster:1,pyramid:5,backoff:4};
 function optionsForMethod(){return SET_OPTIONS}
 function nearestSetCount(m,value){const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=10?n:(DEFAULT_SETS[m]||3)}
 function setOptionsMarkup(e){e.sets=nearestSetCount(e.setTechnique||'standard',e.sets);return SET_OPTIONS.map(n=>`<option value="${n}" ${Number(e.sets)===n?'selected':''}>${n}</option>`).join('')}
 window.methodSetOptions=optionsForMethod;

 // Pyramid: load up, load down, or up then down.
 function pyramidDirection(e){const d=e.methodData?.pyramidDirection;return ['loadUp','loadDown','peak'].includes(d)?d:'peak'}
 function pyramidRepStep(prev){const p=Math.max(1,Math.min(30,Number(prev)||1));if(p>=18)return 5;if(p>=12)return 4;if(p>=8)return 3;return 2}
 function nextPyramidRep(prev,travel){const p=Math.max(1,Math.min(30,Number(prev)||1)),step=pyramidRepStep(p);return travel==='up'?Math.min(30,p+step):Math.max(1,p-step)}
 function buildOneWayReps(first,sets,travel){const out=[Math.max(1,Math.min(30,Number(first)||(travel==='up'?6:20)))];while(out.length<sets)out.push(nextPyramidRep(out[out.length-1],travel));return out}
 function buildPeakReps(first,sets){sets=Math.max(1,Math.min(10,Number(sets)||5));const left=Math.ceil((sets+1)/2),down=buildOneWayReps(first||20,left,'down');if(sets===1)return down;return down.concat(down.slice(0,sets-left).reverse())}
 function buildPyramidReps(first,sets,dir){if(dir==='peak')return buildPeakReps(first,sets);return buildOneWayReps(first,sets,dir==='loadDown'?'up':'down')}
 window.pyramidPctForSets=function(sets,dir='loadUp'){sets=Math.max(1,Math.min(10,Number(sets)||3));if(sets===1)return[100];if(dir==='peak'){const mid=(sets-1)/2;return Array.from({length:sets},(_,i)=>Math.max(60,100-Math.round(Math.abs(mid-i))*10))}const low=sets===2?80:sets===3?80:sets===4?70:60,step=(100-low)/(sets-1),a=Array.from({length:sets},(_,i)=>Math.round((low+step*i)/5)*5);return dir==='loadDown'?a.reverse():a};
 window.resizePyramidForSetCount=function(e,newSets){e.methodData=e.methodData||{};const dir=pyramidDirection(e),old=Array.isArray(e.methodData.reps)?e.methodData.reps.map(Number).filter(Number.isFinite):[],first=old[0]||(dir==='loadDown'?6:20);e.sets=Math.max(1,Math.min(10,Number(newSets)||3));e.methodData.reps=buildPyramidReps(first,e.sets,dir);e.methodData.weightPct=window.pyramidPctForSets(e.sets,dir)};
 window.ensurePyramidData=function(e){e.methodData=e.methodData||{};e.measureMode='reps';e.sets=nearestSetCount('pyramid',e.sets);const dir=pyramidDirection(e);e.methodData.pyramidDirection=dir;const old=Array.isArray(e.methodData.reps)?e.methodData.reps.map(Number).filter(Number.isFinite):[];if(old.length!==e.sets)e.methodData.reps=buildPyramidReps(old[0]||(dir==='loadDown'?6:20),e.sets,dir);else e.methodData.reps=old.length?old:buildPyramidReps(dir==='loadDown'?6:20,e.sets,dir);e.methodData.weightPct=window.pyramidPctForSets(e.sets,dir)};
 window.prepareDraftForTargetMethod=function(e,method,oldGroupCount=1){
  const prev=e.setTechnique||'standard';basePrepare(e,method,oldGroupCount);
  e.sets=nearestSetCount(method,prev===method?e.sets:(DEFAULT_SETS[method]||e.sets));
  if(method==='pyramid'){e.measureMode='reps';e.methodData=e.methodData||{};e.methodData.pyramidDirection='peak';e.sets=5;e.methodData.reps=buildPyramidReps(12,e.sets,'peak');e.methodData.weightPct=window.pyramidPctForSets(e.sets,'peak')}
  if(method==='cluster'){e.methodData={blocks:4,clusterReps:2,intraRest:20};e.reps='10'}
  if(method==='restpause'){e.methodData={maxBlocks:6,intraRest:20};e.reps='20'}
  if(method==='dropset'){e.methodData={dropCount:2,dropPercent:20,intraRest:0}}
  if(method==='backoff'){e.methodData={topReps:5,backoffReps:8,backoffPercent:15}}
  return e
 };
 window.validateExerciseDraft=function(e){
  const m=e?.setTechnique||'standard';if(m==='pyramid'&&e.measureMode==='time')return 'Pyramidentraining wird über Wiederholungen konfiguriert, nicht über Zeit.';
  const n=Number(e?.sets);if(!Number.isInteger(n)||n<1||n>10)return 'Bitte eine Satzanzahl zwischen 1 und 10 wählen.';
  return baseValidate(e)
 };

 // Cleaner method explanations: the target number is shown in the prescription/progress, not repeated in the help text.
 METHOD_HELP.standard='Sätze nacheinander ausführen und dazwischen vollständig pausieren. Last und WDH. bleiben pro Satz anpassbar.';
 METHOD_HELP.superset='A direkt gefolgt von B mit keiner oder kurzer Zwischenpause. Pause erst nach B.';
 METHOD_HELP.giant='Drei oder mehr Übungen direkt nacheinander. Pause erst nach der letzten Übung der Runde.';
 METHOD_HELP.preexhaust='Isolationsübung A ermüdet den Zielmuskel vor Hauptübung B. Beide direkt nacheinander ausführen.';
 METHOD_HELP.dropset='Nach dem Ausgangssatz die Last direkt reduzieren und ohne reguläre Satzpause weiterarbeiten.';
 METHOD_HELP.restpause='Das WDH.-Gesamtziel in mehreren Teilblöcken mit sehr kurzen Pausen erreichen.';
 METHOD_HELP.cluster='Den Arbeitssatz in kleine WDH.-Blöcke teilen. Kurze Pausen helfen, Leistung und Ausführung zu halten.';
 METHOD_HELP.pyramid='Die Last verändert sich von Satz zu Satz; die WDH. verlaufen entgegengesetzt. Folge dem Ziel jedes Sätzes.';
 METHOD_HELP.backoff='Auf einen schweren Top-Satz folgen leichtere Sätze für zusätzliches Trainingsvolumen.';

 window.methodRepConfigMarkup=function(e,prefix){
  if(e.setTechnique==='pyramid'){ensurePyramidData(e);const dir=pyramidDirection(e);return `<div class="pyramid-config"><div class="pyramid-config-head"><div class="form-field"><label>PYRAMIDE</label><select id="${prefix}PyrDirection" class="field"><option value="loadUp" ${dir==='loadUp'?'selected':''}>Last steigern · WDH. sinken</option><option value="loadDown" ${dir==='loadDown'?'selected':''}>Last senken · WDH. steigen</option><option value="peak" ${dir==='peak'?'selected':''}>Steigern → Spitze → senken</option></select></div></div><div class="small">WDH. JE SATZ</div>${e.methodData.reps.map((r,i)=>`<div class="pyramid-config-row"><span>Satz ${i+1}</span><input id="${prefix}PyrRep${i}" class="field" inputmode="numeric" value="${r}"><span class="pyramid-recommendation">${e.methodData.weightPct[i]}%</span></div>`).join('')}</div>`}
  if(e.setTechnique==='backoff'){e.methodData=e.methodData||{};const top=Number(e.methodData.topReps)||5,back=Math.max(top+1,Number(e.methodData.backoffReps)||8),pct=Number(e.methodData.backoffPercent)||15;return`<div class="grid2"><div class="form-field"><label>TOP-SATZ WDH.</label><select id="${prefix}TopReps" class="field">${Array.from({length:10},(_,i)=>i+1).map(n=>`<option ${n===top?'selected':''}>${n}</option>`).join('')}</select></div><div class="form-field"><label>BACK-OFF WDH.</label><select id="${prefix}BackReps" class="field">${[6,7,8,9,10,11,12].filter(n=>n>top).map(n=>`<option ${n===back?'selected':''}>${n}</option>`).join('')}</select></div></div><div class="form-field"><label>GEWICHT REDUZIEREN %</label><select id="${prefix}BackPct" class="field">${[5,10,15,20,25,30].map(n=>`<option ${n===pct?'selected':''}>${n}</option>`).join('')}</select></div>`}
  return repPresetMarkup(e)
 };
 window.saveMethodRepConfig=function(e,prefix){
  e.methodData=e.methodData||{};
  if(e.setTechnique==='pyramid'){const oldDir=pyramidDirection(e),dir=$(`${prefix}PyrDirection`)?.value||oldDir,typed=Array.from({length:Number(e.sets)||3},(_,i)=>{const raw=$(`${prefix}PyrRep${i}`)?.value;return raw==null||String(raw).trim()===''?(Number(e.methodData.reps?.[i])||1):Math.max(1,Number(raw)||Number(e.methodData.reps?.[i])||1)});e.methodData.pyramidDirection=dir;e.methodData.reps=dir!==oldDir?buildPyramidReps(typed[0]||(dir==='loadDown'?6:20),e.sets,dir):typed;e.methodData.weightPct=window.pyramidPctForSets(e.sets,dir)}
  if(e.setTechnique==='backoff'){e.methodData.topReps=Math.max(1,Number($(`${prefix}TopReps`)?.value)||5);e.methodData.backoffReps=Math.min(12,Math.max(e.methodData.topReps+1,Number($(`${prefix}BackReps`)?.value)||8));e.methodData.backoffPercent=Math.max(0,Number($(`${prefix}BackPct`)?.value)||15)}
 };
 function bindPyramidCascade(e,prefix,rerender){
  if(e.setTechnique!=='pyramid')return;ensurePyramidData(e);
  const dirSel=$(`${prefix}PyrDirection`);if(dirSel)dirSel.onchange=()=>{if(prefix==='pa')capturePlanAddStateV6();const first=Number($(`${prefix}PyrRep0`)?.value)||e.methodData.reps[0];e.methodData.pyramidDirection=dirSel.value;e.methodData.reps=buildPyramidReps(first,e.sets,dirSel.value);e.methodData.weightPct=window.pyramidPctForSets(e.sets,dirSel.value);rerender()};
  e.methodData.reps.forEach((_,i)=>{const inp=$(`${prefix}PyrRep${i}`);if(!inp)return;inp.onchange=()=>{const val=Math.max(1,Math.min(30,Number(inp.value)||e.methodData.reps[i]||1));e.methodData.reps[i]=val;const dir=pyramidDirection(e);if(i===0){e.methodData.reps=buildPyramidReps(val,e.sets,dir);e.methodData.weightPct=window.pyramidPctForSets(e.sets,dir);rerender()}else{inp.value=val}}})
 }

 function capturePlanAddStateV6(){
  const e=planAddFlow?.current;if(!e)return;if($('paSets'))e.sets=Number($('paSets').value)||e.sets;if($('paRest'))e.rest=Number($('paRest').value);captureExerciseOptionFields(e,'pa');if($('paPerSide'))e.perSide=!!$('paPerSide').checked;if(e.setTechnique==='pyramid')saveMethodRepConfig(e,'pa')
 }
 // One familiar add/edit mask for all exercise actions, now with method-aware set counts.
 

 // Partner exercises keep their own reps/time/AMRAP; pyramid is never offered as time even inside a connected series.
 // Partner configuration is final in app-core; no second wrapper or duplicate event binding.

 // Core renderSets and planPrescription are authoritative.

 // Superset / Giant Set: large exercise links at the top; small repeated names beside 1a/1b/1c.

 // Preview mirrors the same connected-card hierarchy and exercise names open the execution card.

 function askRestart(p){pendingStartPlan=p;openSheet('Training erneut starten?',`<p class="muted" style="margin:0 0 16px">„${esc(p.name)}“ erneut starten?</p><button id="reallyRestartPlan" class="primary" style="width:100%">Training erneut starten</button>`);$('reallyRestartPlan').onclick=()=>{closeSheet({all:true});startWorkout(p)}}
 window.openSummary=function(w){baseOpenSummary(w)};

 // Legacy time exercises that visually default to 1:00 now actually carry 60 s as their selected value.
 const oldNormPlanEx=window.normPlanEx;window.normPlanEx=function(e){const x=oldNormPlanEx(e);if(x.measureMode==='time'&&!Number(x.timeSeconds))x.timeSeconds=60;if(x.setTechnique==='pyramid')x.measureMode='reps';return x};

 if(currentPlan&&!$('planEditorPage')?.classList.contains('hidden'))renderEditorExercises();
 if(activeWorkout&&!$('livePage')?.classList.contains('hidden'))renderLive();
})();

/* Exercise detail navigation from live workout */
(function(){
 const baseRenderLive=window.renderLive;
 if(activeWorkout&&!$('livePage')?.classList.contains('hidden'))renderLive();
})();

/* Theme, pause draft persistence, connected live controls, settings */
(function(){
 const THEME_KEY_V48="rethink_theme_mode";
 function themeModeV48(){return localStorage.getItem(THEME_KEY_V48)||"system"}
 function applyThemeV48(mode=themeModeV48()){
   const resolved=mode==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):mode;
   document.documentElement.dataset.theme=resolved;document.documentElement.dataset.themeMode=mode
 }
 window.applyThemeV48=applyThemeV48;applyThemeV48();
 if(window.matchMedia){
   const mq=window.matchMedia("(prefers-color-scheme: dark)");
   const sync=()=>{if(themeModeV48()==="system")applyThemeV48("system")};
   if(mq.addEventListener)mq.addEventListener("change",sync);else if(mq.addListener)mq.addListener(sync)
 }


 /* When history is deleted while progress is visible, recompute immediately. */
 document.addEventListener("click",e=>{
   if(e.target.closest("[data-history-delete]")||e.target.closest("[data-settings-history-del]")||e.target.closest("#clearHistoryBtn")){
     setTimeout(()=>{if(typeof renderProfileProgress==="function")renderProfileProgress()},30)
   }
 },true);

 /* Pause selection must survive every redraw of the unified add/edit flow. */
/* Remove generic coaching recommendation from live cards.
    Only previous actually completed values may appear grey as placeholders. */
 const baseRenderLiveSingleCard=window.renderLiveSingleCard;

 /* Connected-method controls are owned by app-core.js; no runtime replacement. */

 /* A grey prior value becomes real only when the user rates/completes the set;
    typing overwrites it because actual value remains empty until input. Existing promoteSuggested() keeps this rule. */

 /* Settings: add system / fixed light / fixed dark without touching any other settings. */
 const baseOpenSettingsPage=window.openSettingsPage;
 window.openSettingsPage=function(){
   baseOpenSettingsPage();
   const body=$("settingsBody");if(!body||$("themeSettingsV48"))return;
   const section=document.createElement("div");section.className="settings-section";section.id="themeSettingsV48";
   section.innerHTML=`<h3>Darstellung</h3><div class="settings-card"><div class="settings-row" style="display:block"><div><strong>Hell / Dunkel</strong></div><div class="theme-choice-row">${[["system","System"],["light","Hell"],["dark","Dunkel"]].map(([v,l])=>`<button class="theme-choice ${themeModeV48()===v?"active":""}" data-theme-v48="${v}">${l}</button>`).join("")}</div></div></div>`;
   const training=[...body.querySelectorAll(".settings-section")].find(x=>x.querySelector("h3")?.textContent==="Training");
   if(training)body.insertBefore(section,training);else body.appendChild(section);
   section.querySelectorAll("[data-theme-v48]").forEach(b=>b.onclick=()=>{localStorage.setItem(THEME_KEY_V48,b.dataset.themeV48);applyThemeV48(b.dataset.themeV48);section.querySelectorAll("[data-theme-v48]").forEach(x=>x.classList.toggle("active",x===b))})
 };

 if(activeWorkout&&!$("livePage")?.classList.contains("hidden"))renderLive();
 if(!$("tab-profile")?.classList.contains("hidden"))renderProfileProgress();
})();

/* Draggable bottom sheets */
(function(){
 const wrap=$("sheetWrap"),sheet=wrap?.querySelector(".sheet"),handle=wrap?.querySelector(".sheet-handle");
 if(!wrap||!sheet||!handle)return;
 let startY=0,lastY=0,startT=0,dragging=false,pointerId=null;
 function resetSheet(){sheet.classList.remove("sheet-dragging");sheet.style.transform="";wrap.style.backgroundColor=""}
 function dismissByDrag(){
   resetSheet();
   if(planAddFlow&&typeof cancelPlanAddFlow==="function")cancelPlanAddFlow();
   else if(typeof cancelTask==="function")cancelTask();
   else if(typeof closeSheet==="function")closeSheet({all:true})
 }
 handle.addEventListener("pointerdown",e=>{
   if(wrap.classList.contains("hidden"))return;
   dragging=true;pointerId=e.pointerId;startY=lastY=e.clientY;startT=performance.now();
   sheet.classList.add("sheet-dragging");handle.setPointerCapture?.(e.pointerId);e.preventDefault()
 });
 handle.addEventListener("pointermove",e=>{
   if(!dragging||e.pointerId!==pointerId)return;
   lastY=e.clientY;const dy=Math.max(0,lastY-startY);
   sheet.style.transform=`translateY(${dy}px)`;
   const fade=Math.min(.72,dy/Math.max(260,innerHeight*.55));wrap.style.backgroundColor=`rgba(0,0,0,${Math.max(.08,.48-fade*.42)})`;
   e.preventDefault()
 });
 function end(e){
   if(!dragging||(e.pointerId!=null&&e.pointerId!==pointerId))return;
   const dy=Math.max(0,lastY-startY),dt=Math.max(1,performance.now()-startT),velocity=dy/dt;
   dragging=false;pointerId=null;
   const threshold=Math.min(170,Math.max(105,innerHeight*.15));
   if(dy>=threshold||velocity>.75)dismissByDrag();else resetSheet()
 }
 handle.addEventListener("pointerup",end);handle.addEventListener("pointercancel",end);
 const baseRenderSheetState=window.renderSheetState;
 window.renderSheetState=function(state){baseRenderSheetState(state);resetSheet()}
 const baseCloseSheet=window.closeSheet;
 window.closeSheet=function(opts){resetSheet();return baseCloseSheet(opts||{})}
})();

/* Live set rendering is owned by app-core.js; no runtime replacement. */

/* Food search, custom foods, meals */
(function(){
 function ensureNutritionV52(){
   nutrition.customFoods=Array.isArray(nutrition.customFoods)?nutrition.customFoods:[];
   nutrition.meals=Array.isArray(nutrition.meals)?nutrition.meals:[];
 }
 ensureNutritionV52();

 const servingMap={
   "ei":{grams:60,label:"1 Ei"},
   "apfel":{grams:150,label:"1 Apfel"},
   "banane":{grams:120,label:"1 Banane"},
   "orange":{grams:180,label:"1 Orange"},
   "mandarine":{grams:80,label:"1 Mandarine"},
   "birne":{grams:160,label:"1 Birne"},
   "kiwi":{grams:80,label:"1 Kiwi"},
   "avocado":{grams:150,label:"1 Avocado"},
   "brötchen":{grams:65,label:"1 Brötchen"},
   "toast":{grams:25,label:"1 Scheibe"},
   "brot":{grams:50,label:"1 Scheibe"},
   "vollkornbrot":{grams:50,label:"1 Scheibe"},
   "knäckebrot":{grams:12,label:"1 Scheibe"},
   "joghurt":{grams:150,label:"1 Becher"},
   "skyr":{grams:150,label:"1 Becher"},
   "quark":{grams:250,label:"1 Becher"},
   "mozzarella":{grams:125,label:"1 Kugel"},
   "tomate":{grams:120,label:"1 Tomate"},
   "gurke":{grams:300,label:"1/2 Gurke"},
   "paprika":{grams:150,label:"1 Paprika"},
   "kartoffel":{grams:150,label:"1 mittelgroße Kartoffel"},
   "süßkartoffel":{grams:200,label:"1 mittelgroße Süßkartoffel"},
   "reiswaffel":{grams:7,label:"1 Stück"},
   "proteinriegel":{grams:55,label:"1 Riegel"},
   "müsliriegel":{grams:30,label:"1 Riegel"},
   "croissant":{grams:60,label:"1 Stück"}
 };
 function foodServingV52(f){
   if(Number(f.servingGrams)>0)return{grams:Number(f.servingGrams),label:f.servingLabel||"1 Portion"};
   const n=String(f.name||"").toLowerCase();
   for(const [key,val] of Object.entries(servingMap)){if(key==="ei"){if(n==="ei"||n.startsWith("ei ")||n.startsWith("ei(")||n.includes("hühnerei"))return val;continue}if(n===key||n.startsWith(key+" ")||n.includes(key))return val}
   const cat=String(f.category||"").toLowerCase();
   if(cat.includes("obst"))return{grams:150,label:"1 Portion"};
   if(cat.includes("gemüse"))return{grams:150,label:"1 Portion"};
   if(cat.includes("fleisch")||cat.includes("fisch"))return{grams:150,label:"1 Portion"};
   if(cat.includes("milch"))return{grams:150,label:"1 Portion"};
   if(cat.includes("brot")||cat.includes("back"))return{grams:50,label:"1 Portion"};
   if(cat.includes("nüsse"))return{grams:30,label:"1 Handvoll"};
   return{grams:100,label:"1 Portion"};
 }
 function foodKeyV52(f){return String(f._customId?`custom:${f._customId}`:`builtin:${f.name}`)}
 function allFoodsV52(){
   ensureNutritionV52();
   const waterFood={name:"Wasser",category:"Getränke",kcal:0,protein:0,water:100,servingGrams:250,servingLabel:"250 ml",_source:"builtin"};
   return [
     waterFood,
     ...FOOD_DB.filter(f=>String(f.name||"").toLowerCase()!=="wasser").map(f=>({...f,_source:"builtin"})),
     ...nutrition.customFoods.map(f=>({...f,_source:"custom",_customId:f.id}))
   ]
 }
 function usageCountV52(name){
   const n=String(name||"").toLowerCase();
   return (nutrition.foodLog||[]).reduce((sum,x)=>sum+(String(x.name||"").toLowerCase()===n?1:0),0)
 }
 function wordStartsV52(text,q){return String(text||"").toLowerCase().split(/[\s\-_/()]+/).some(w=>w.startsWith(q))}
 function foodMatchScoreV52(f,q){
   if(!q)return usageCountV52(f.name)>0?10:0;
   const name=String(f.name||"").toLowerCase(),cat=String(f.category||"").toLowerCase();
   if(name===q)return 100;
   if(name.startsWith(q))return 90;
   if(wordStartsV52(name,q))return 80;
   if(cat.startsWith(q))return 75;
   if(wordStartsV52(cat,q))return 70;
   if(name.includes(q))return 45;
   if(cat.includes(q))return 35;
   return -1
 }
 function foodRowsV52(q){
   return allFoodsV52().map(f=>({f,score:foodMatchScoreV52(f,q),used:usageCountV52(f.name)}))
     .filter(x=>q?x.score>=0:x.used>0)
     .sort((a,b)=>b.score-a.score||b.used-a.used||a.f.name.localeCompare(b.f.name,"de"))
     .slice(0,80).map(x=>x.f)
 }
 function resolveFoodKeyV52(key){
   return allFoodsV52().find(f=>foodKeyV52(f)===key)||null
 }
 function nutrientsForV52(f,grams){
   const g=Math.max(0,Number(grams)||0),factor=g/100;
   return{kcal:Math.round(Number(f.kcal||0)*factor),protein:Math.round(Number(f.protein||0)*factor*10)/10,water:Math.round(Number(f.water||0)*factor)}
 }


 function openCustomFoodV52(existing=null){
   const f=existing||{id:uid(),name:"",category:"Eigene Lebensmittel",kcal:"",protein:"",water:"",servingGrams:100,servingLabel:"1 Portion"};
   openSheet(existing?"Lebensmittel bearbeiten":"Lebensmittel erstellen",`<div class="form-field"><label>Name</label><input id="cfName" class="field" value="${esc(f.name||"")}" placeholder="z. B. Mein Granola"></div><div class="form-field"><label>Kategorie</label><input id="cfCategory" class="field" value="${esc(f.category||"Eigene Lebensmittel")}" placeholder="z. B. Frühstück"></div><div class="grid2"><div class="form-field"><label>Kalorien / 100 g</label><input id="cfKcal" class="field" inputmode="decimal" value="${esc(f.kcal??"")}"></div><div class="form-field"><label>Protein g / 100 g</label><input id="cfProtein" class="field" inputmode="decimal" value="${esc(f.protein??"")}"></div></div><div class="grid2"><div class="form-field"><label>Wasser g / 100 g</label><input id="cfWater" class="field" inputmode="decimal" value="${esc(f.water??"")}"></div><div class="form-field"><label>Portion g</label><input id="cfServing" class="field" inputmode="decimal" value="${esc(f.servingGrams||100)}"></div></div><div class="form-field"><label>Portionsname</label><input id="cfServingLabel" class="field" value="${esc(f.servingLabel||"1 Portion")}" placeholder="z. B. 1 Riegel"></div><button id="cfSave" class="primary" style="width:100%">Speichern</button>`);
   $("cfSave").onclick=()=>{
     const name=$("cfName").value.trim(),kcal=Number(String($("cfKcal").value).replace(",",".")),protein=Number(String($("cfProtein").value).replace(",",".")),water=Number(String($("cfWater").value).replace(",","."));
     if(!name||!Number.isFinite(kcal)||!Number.isFinite(protein)||!Number.isFinite(water))return toast("Bitte Name und Nährwerte vollständig eintragen.");
     const out={id:f.id,name,category:$("cfCategory").value.trim()||"Eigene Lebensmittel",kcal,protein,water,servingGrams:Math.max(1,Number(String($("cfServing").value).replace(",","."))||100),servingLabel:$("cfServingLabel").value.trim()||"1 Portion"};
     const i=nutrition.customFoods.findIndex(x=>String(x.id)===String(out.id));if(i>=0)nutrition.customFoods[i]=out;else nutrition.customFoods.push(out);
     saveAll();closeSheet({all:true});renderProfile();toast("Lebensmittel gespeichert")
   }
 }

 let mealDraftV52=null;
 function mealTotalsV52(items){
   return(items||[]).reduce((a,x)=>{const n=nutrientsForV52(x.food,x.grams);a.grams+=Number(x.grams)||0;a.kcal+=n.kcal;a.protein+=n.protein;a.water+=n.water;return a},{grams:0,kcal:0,protein:0,water:0})
 }
 function renderMealBuilderV52(replace=false){
   const d=mealDraftV52;if(!d)return;
   const totals=mealTotalsV52(d.items);
   const body=`<div class="form-field"><label>Name der Mahlzeit</label><input id="mealName" class="field" value="${esc(d.name||"")}" placeholder="z. B. Frühstück Bowl"></div><div id="mealItems">${d.items.map((x,i)=>`<div class="meal-builder-item"><div><strong>${esc(x.food.name)}</strong><small>${esc(foodServingV52(x.food).label)}</small></div><input class="field" inputmode="decimal" data-meal-grams="${i}" value="${esc(x.grams)}"><button class="remove-mini" data-meal-remove="${i}">−</button></div>`).join("")||'<div class="small">Noch keine Lebensmittel hinzugefügt.</div>'}</div><button id="mealAddIngredient" class="secondary" style="width:100%;margin-top:8px">Lebensmittel hinzufügen</button><div class="meal-builder-total"><strong>Gesamt</strong><div>${Math.round(totals.grams)} g · ${Math.round(totals.kcal)} kcal · ${Math.round(totals.protein*10)/10} g Protein · ${Math.round(totals.water)} g Wasser</div></div><button id="mealSave" class="primary" style="width:100%">Mahlzeit speichern</button>`;
   const bind=()=>{
     $("mealName").oninput=()=>{d.name=$("mealName").value};
     document.querySelectorAll("[data-meal-grams]").forEach(inp=>inp.onchange=()=>{d.items[Number(inp.dataset.mealGrams)].grams=Math.max(1,Number(String(inp.value).replace(",","."))||1);renderMealBuilderV52(true)});
     document.querySelectorAll("[data-meal-remove]").forEach(b=>b.onclick=()=>{d.items.splice(Number(b.dataset.mealRemove),1);renderMealBuilderV52(true)});
     $("mealAddIngredient").onclick=()=>openFoodSearch("",{title:"Lebensmittel für Mahlzeit",selectOnly:true,onSelect:f=>{d.items.push({food:{name:f.name,category:f.category,kcal:f.kcal,protein:f.protein,water:f.water,servingGrams:foodServingV52(f).grams,servingLabel:foodServingV52(f).label},grams:foodServingV52(f).grams});closeSheet({all:false});renderMealBuilderV52(true)}});
     $("mealSave").onclick=()=>{d.name=$("mealName").value.trim();if(!d.name||!d.items.length)return toast("Bitte Name und mindestens ein Lebensmittel hinzufügen.");const saved={id:d.id||uid(),name:d.name,items:clone(d.items),updatedAt:Date.now()};const i=nutrition.meals.findIndex(x=>String(x.id)===String(saved.id));if(i>=0)nutrition.meals[i]=saved;else nutrition.meals.push(saved);mealDraftV52=null;saveAll();closeSheet({all:true});renderProfile();toast("Mahlzeit gespeichert")}
   };
   if(replace)renderSheetState({title:"Mahlzeit erstellen",body,scroll:0,bind});else openSheet("Mahlzeit erstellen",body,bind)
 }
 function openMealBuilderV52(existing=null){mealDraftV52=existing?clone(existing):{id:uid(),name:"",items:[]};renderMealBuilderV52(false)}
 function openMealLogV52(meal){
   const t=mealTotalsV52(meal.items);
   openSheet(meal.name,`<div class="meal-builder-total"><strong>${esc(meal.name)}</strong><div>1 Portion · ${Math.round(t.grams)} g · ${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</div></div><div class="food-quick-portions"><button data-meal-portion=".5">½ Portion</button><button data-meal-portion="1">1 Portion</button><button data-meal-portion="2">2 Portionen</button></div><div class="form-field"><label>PORTIONEN</label><input id="mealPortions" class="field" inputmode="decimal" value="1"></div><div id="mealLogPreview" class="small"></div><button id="mealLogAdd" class="primary" style="width:100%;margin-top:10px">Mahlzeit eintragen</button>`);
   const p=$("mealPortions"),preview=$("mealLogPreview");
   const upd=()=>{const factor=Math.max(.01,Number(String(p.value).replace(",","."))||1);preview.textContent=`${Math.round(t.grams*factor)} g · ${Math.round(t.kcal*factor)} kcal · ${Math.round(t.protein*factor*10)/10} g Protein · ${Math.round(t.water*factor)} g Wasser`};
   p.oninput=upd;document.querySelectorAll("[data-meal-portion]").forEach(b=>b.onclick=()=>{p.value=b.dataset.mealPortion;upd()});upd();
   $("mealLogAdd").onclick=()=>{const factor=Math.max(.01,Number(String(p.value).replace(",","."))||1);nutrition.foodLog=Array.isArray(nutrition.foodLog)?nutrition.foodLog:[];nutrition.foodLog.push({id:uid(),date:profileDateKey(),name:meal.name,category:"Mahlzeit",grams:Math.round(t.grams*factor),kcal:Math.round(t.kcal*factor),protein:Math.round(t.protein*factor*10)/10,water:Math.round(t.water*factor),mealId:meal.id,portions:factor});recalcFoodTotals();saveAll();closeSheet({all:true});renderProfile()}
 }

 function renderMyFoodsV52(){
   ensureNutritionV52();
   const foods=$("myFoodList"),meals=$("myMealList");if(!foods||!meals)return;
   foods.innerHTML=nutrition.customFoods.map(f=>{const s=foodServingV52(f);return`<div class="my-food-card"><div><strong>${esc(f.name)}</strong><small>${f.kcal} kcal · ${f.protein} g Protein / 100 g · ${esc(s.label)} ≈ ${s.grams} g</small></div><div class="food-card-actions"><button class="icon-btn" data-custom-food-add="${f.id}">+</button><button class="icon-btn" data-custom-food-edit="${f.id}">✎</button><button class="icon-btn danger" data-custom-food-del="${f.id}">−</button></div></div>`}).join("")||'<div class="small">Noch keine eigenen Lebensmittel.</div>';
   meals.innerHTML=nutrition.meals.map(m=>{const t=mealTotalsV52(m.items);return`<div class="meal-card"><button style="border:0;background:transparent;color:inherit;text-align:left;padding:0" data-meal-log="${m.id}"><strong>${esc(m.name)}</strong><small>${Math.round(t.grams)} g · ${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</small></button><div class="food-card-actions"><button class="icon-btn" data-meal-edit="${m.id}">✎</button><button class="icon-btn danger" data-meal-del="${m.id}">−</button></div></div>`}).join("")||'<div class="small">Noch keine gespeicherten Mahlzeiten.</div>';
   document.querySelectorAll("[data-custom-food-add]").forEach(b=>{b.onclick=()=>{const f=nutrition.customFoods.find(x=>String(x.id)===String(b.dataset.customFoodAdd));if(f){const s=foodServingV52(f);addFoodEntry(f,s.grams)}}});
   document.querySelectorAll("[data-custom-food-edit]").forEach(b=>b.onclick=()=>openCustomFoodV52(nutrition.customFoods.find(x=>String(x.id)===String(b.dataset.customFoodEdit))));
   document.querySelectorAll("[data-custom-food-del]").forEach(b=>b.onclick=()=>{if(confirm("Eigenes Lebensmittel wirklich löschen?")){nutrition.customFoods=nutrition.customFoods.filter(x=>String(x.id)!==String(b.dataset.customFoodDel));saveAll();renderProfile()}});
   document.querySelectorAll("[data-meal-log]").forEach(b=>b.onclick=()=>{const m=nutrition.meals.find(x=>String(x.id)===String(b.dataset.mealLog));if(m)openMealLogV52(m)});
   document.querySelectorAll("[data-meal-edit]").forEach(b=>b.onclick=()=>{const m=nutrition.meals.find(x=>String(x.id)===String(b.dataset.mealEdit));if(m)openMealBuilderV52(m)});
   document.querySelectorAll("[data-meal-del]").forEach(b=>b.onclick=()=>{if(confirm("Mahlzeit wirklich löschen?")){nutrition.meals=nutrition.meals.filter(x=>String(x.id)!==String(b.dataset.mealDel));saveAll();renderProfile()}})
 }

 __rt.profile.post.push(function(__result,...__args){
ensureNutritionV52();
   renderMyFoodsV52();
   if($("addFoodTodayBtn"))$("addFoodTodayBtn").onclick=()=>openFoodSearch("");
   if($("newCustomFoodBtn"))$("newCustomFoodBtn").onclick=()=>openCustomFoodV52();
   if($("newMealBtn"))$("newMealBtn").onclick=()=>openMealBuilderV52()
});



 window.__allFoodsV52=allFoodsV52;
 window.__foodServingV52=foodServingV52;
 window.__nutrientsForV52=nutrientsForV52;
 window.__mealTotalsV52=mealTotalsV52;
 window.__openCustomFoodV52=openCustomFoodV52;
 window.__openMealBuilderV52=openMealBuilderV52;
 window.__openMealLogV52=openMealLogV52;
 renderProfile();
})();

/* Session restore, workout plan commit, last-rating dots, direct quantity editing */
(function(){

 /* Restore/background behavior is authoritative in app-core.js. */
 restoreUI=window.__rethinkRestoreUIV24||restoreUI;

 /* Workout finish/save flow is authoritative in app-core.js. */

/* Previous rating dots are handled only once by addPreviousDotsToSinglesV31(). */

 /* ---------- partner masks: same card language as primary config ---------- */
/* ---------- direct amount editing ---------- */
 function editFoodEntryV53(id){
   const x=(nutrition.foodLog||[]).find(v=>String(v.id)===String(id));if(!x)return;
   const per100={kcal:Number(x.grams)?Number(x.kcal)*100/Number(x.grams):0,protein:Number(x.grams)?Number(x.protein)*100/Number(x.grams):0,water:Number(x.grams)?Number(x.water)*100/Number(x.grams):0};
   openSheet(x.name,`<div class="form-field"><label>MENGE G</label><input id="editFoodAmountV53" class="field" inputmode="decimal" value="${x.grams}"></div><div id="editFoodPreviewV53" class="small"></div><button id="saveFoodAmountV53" class="primary" style="width:100%">Menge übernehmen</button>`);
   const inp=$("editFoodAmountV53"),prev=$("editFoodPreviewV53"),upd=()=>{const g=Math.max(1,Number(String(inp.value).replace(",","."))||1);prev.textContent=`${Math.round(per100.kcal*g/100)} kcal · ${Math.round(per100.protein*g/100*10)/10} g Protein · ${Math.round(per100.water*g/100)} g Wasser`};
   inp.oninput=upd;upd();requestAnimationFrame(()=>{inp.focus();inp.select()});
   $("saveFoodAmountV53").onclick=()=>{const g=Math.max(1,Number(String(inp.value).replace(",","."))||1);x.grams=g;x.kcal=Math.round(per100.kcal*g/100);x.protein=Math.round(per100.protein*g/100*10)/10;x.water=Math.round(per100.water*g/100);recalcFoodTotals();saveAll();closeSheet({all:true});renderProfile()}
 }
 function editDrinkEntryV53(id){
   const log=hydrationLog(),x=log.find(v=>String(v.id)===String(id));if(!x)return;
   openSheet(x.name,`<div class="form-field"><label>MENGE ML</label><input id="editDrinkAmountV53" class="field" inputmode="decimal" value="${x.size}"></div><button id="saveDrinkAmountV53" class="primary" style="width:100%">Menge übernehmen</button>`);
   const inp=$("editDrinkAmountV53");requestAnimationFrame(()=>{inp.focus();inp.select()});
   $("saveDrinkAmountV53").onclick=()=>{x.size=Math.max(1,Number(String(inp.value).replace(",","."))||1);saveHydrationLog(log);recalcFoodTotals();saveAll();closeSheet({all:true});renderProfile()}
 }
 __rt.profile.post.push(function(__result,...__args){
renderProfileProgress();
   document.querySelectorAll("[data-edit-food-entry]").forEach(row=>row.onclick=e=>{if(e.target.closest("[data-food-del]"))return;editFoodEntryV53(row.dataset.editFoodEntry)});
   document.querySelectorAll("[data-edit-drink-entry]").forEach(row=>row.onclick=e=>{if(e.target.closest("[data-hydration-del]"))return;editDrinkEntryV53(row.dataset.editDrinkEntry)});
   document.querySelectorAll("[data-direct-drink]").forEach(card=>card.onclick=e=>{if(e.target.closest(".drink-actions"))return;const id=card.dataset.directDrink,d=nutrition.drinks.find(x=>String(x.id)===String(id));if(!d)return;openSheet(d.name,`<div class="form-field"><label>MENGE ML</label><input id="directDrinkAmountV53" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div><button id="directDrinkAddV53" class="primary" style="width:100%">Eintragen</button>`);const inp=$("directDrinkAmountV53");requestAnimationFrame(()=>{inp.focus();inp.select()});$("directDrinkAddV53").onclick=()=>{addDrinkEntry(d,inp.value);closeSheet({all:true})}})
});

 
})();

/* Weekly completion cleanup and streak counters */
(function(){
 function dateKeyV56(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
 function dayDataV56(date){
   const key=dateKeyV56(date),food=(nutrition.foodLog||[]).filter(x=>x.date===key);
   const drinks=hydrationLog().filter(x=>dateKeyLocal(Number(x.at))===key);
   const hydration=food.reduce((s,x)=>s+Number(x.water||0),0)+drinks.reduce((s,x)=>s+Number(x.size||0)*Number(x.hydration||0)/100,0);
   const calories=food.reduce((s,x)=>s+Number(x.kcal||0),0)+drinks.reduce((s,x)=>s+Number(x.caloriesPer250||0)*Number(x.size||0)/250,0);
   const waterGoal=hasGoalBasis()?hydrateGoal():Number(nutrition.waterGoal)||0;
   const calorieGoal=Number(nutrition.calories)||0;
   return{
     foodCount:food.length,drinkCount:drinks.length,hydration,calories,waterGoal,calorieGoal,
     hydrationDone:drinks.length>=3&&waterGoal>0&&hydration>=waterGoal,
     nutritionDone:food.length>=3&&calorieGoal>0&&calories<=calorieGoal
   }
 }
 function streakV56(kind){
   // Only completed calendar days count. Today is deliberately ignored.
   let d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-1);
   let count=0;
   for(let i=0;i<3660;i++){
     const x=dayDataV56(d);
     const ok=kind==="hydration"?x.hydrationDone:kind==="nutrition"?x.nutritionDone:(x.hydrationDone&&x.nutritionDone);
     if(!ok)break;
     count++;d=new Date(d);d.setDate(d.getDate()-1)
   }
   return count
 }
 window.goalStreakV50=function(){return streakV56("combined")};
 window.hydrationStreakV56=()=>streakV56("hydration");
 window.nutritionStreakV56=()=>streakV56("nutrition");

 __rt.profile.post.push(function(__result,...__args){
const hs=hydrationStreakV56(),ns=nutritionStreakV56();
   const hb=$("hydrationStreakBadge"),nb=$("nutritionStreakBadge");
   if(hb){hb.querySelector("strong").textContent=hs;hb.classList.toggle("active",hs>0)}
   if(nb){nb.querySelector("strong").textContent=ns;nb.classList.toggle("active",ns>0)}
   if(typeof renderProfileProgress==="function")renderProfileProgress()
});


})();

/* Existing-plan decision before direct workout start */
(function(){
/* Starting an edited existing plan must decide its fate BEFORE the workout starts. */
 function v57StartSavedPlan(p){if(p)confirmAndStartPlan(clone(p))}
 window.startCurrentEditorPlan=function(){
   if(!currentPlan)return;
   const entered=$("planName")?.value.trim();if(!entered)return alert("Bitte Planname eingeben.");
   if(!(currentPlan.exercises||[]).length)return alert("Ein Trainingsplan braucht mindestens eine Übung.");
   const sourceId=currentPlan._editingSourceId;
   if(sourceId){
     const source=plans.find(p=>String(p.id)===String(sourceId));
     if(!editorHasChanges()){
       v57StartSavedPlan(source||currentPlan);return
     }
     openSheet("Bearbeiteten Plan starten?",`<p class="muted" style="margin:0 0 14px">Der bestehende Plan wurde verändert. Was soll vor dem Trainingsstart mit diesen Änderungen passieren?</p><div class="save-choice-stack"><button id="v57OverwriteStart" class="primary">Originalplan überschreiben</button><button id="v57NewStart" class="secondary">Als neuen Plan speichern</button><button id="v57DiscardStart" class="secondary danger">Änderungen verwerfen</button><button id="v57CancelStart" class="secondary">Abbrechen</button></div>`);
     $("v57OverwriteStart").onclick=()=>{const saved=overwriteCurrentPlan();if(saved){closeSheet({all:true});v57StartSavedPlan(saved)}};
     $("v57NewStart").onclick=()=>{const saved=savePlanAsNew();if(saved){closeSheet({all:true});v57StartSavedPlan(saved)}};
     $("v57DiscardStart").onclick=()=>{if(!source)return toast("Originalplan nicht gefunden.");currentPlan=clone(source);setEditorBaseline();closeSheet({all:true});v57StartSavedPlan(source)};
     $("v57CancelStart").onclick=()=>closeSheet({all:true});
     return
   }
   const p=currentEditorTransientPlan();if(p)confirmAndStartPlan(p)
 };
 if($("planPlayBtn"))$("planPlayBtn").onclick=startCurrentEditorPlan;
 if($("editorStartTrainingBtn"))$("editorStartTrainingBtn").onclick=startCurrentEditorPlan;
})();



/* Apply final renderers after all current overrides are installed. */
try{renderProfile();renderPlans();if(activeWorkout&&!$("livePage").classList.contains("hidden"))renderLive()}catch(e){console.error("ReThink runtime init",e)}


/* v64: full catalog for partner exercises, compact progress, method-colour live focus */
(function(){
  function partnerCatalogRowsV64(rows){
    return rows.map(x=>`<div class="exercise-card picker-quick-card">
      <button class="picker-info" type="button" data-v64-partner-info="${esc(x.name)}">
        <div><strong>${esc(x.name)}</strong><small>${esc(x.category)} · ${esc((x.muscles||[]).join(", "))}</small></div>
      </button>
      <button class="picker-quick-add" type="button" data-v64-partner-pick="${esc(x.name)}" aria-label="${esc(x.name)} hinzufügen">+</button>
    </div>`).join("")
  }
  function bindPartnerCatalogRowsV64(){
    document.querySelectorAll("[data-v64-partner-pick]").forEach(b=>b.onclick=()=>startCompactPartnerConfig(b.dataset.v64PartnerPick));
    document.querySelectorAll("[data-v64-partner-info]").forEach(b=>b.onclick=()=>renderPartnerDetailV64(b.dataset.v64PartnerInfo))
  }
  function renderPartnerDetailV64(name){
    const f=planAddFlow;if(!f?.group)return;
    f.step="partnerDetail";f.detailName=name;
    f.partnerPickerScroll=$("sheetBody")?.scrollTop||Number(f.partnerPickerScroll)||0;
    f.partnerTypeScroll=$("v64PartnerTypeChips")?.scrollLeft||Number(f.partnerTypeScroll)||0;
    f.partnerMuscleScroll=$("v64PartnerMuscleChips")?.scrollLeft||Number(f.partnerMuscleScroll)||0;
    const e=findExercise(name),guide=executionText(e),pos=f.drafts.length+1,target=f.group.target,method=METHOD_LABEL[f.group.method]||f.group.method;
    renderSheetState({
      title:`${method} · Übung ${pos}/${target}`,
      scroll:0,
      body:`<div class="partner-catalog-detail">
        <div class="exercise-media-placeholder">+</div>
        <div class="detail-section"><div class="small">ÜBUNG</div><strong>${esc(e.name)}</strong></div>
        <div class="detail-section"><div class="small">TRAININGSART</div><strong>${esc(e.category)}</strong></div>
        <div class="detail-section"><div class="small">MUSKELGRUPPEN</div><div>${esc((e.muscles||[]).join(" · "))}</div></div>
        ${e.custom?"":`<div class="detail-section"><div class="small">AUSFÜHRUNG</div><div class="detail-copy">${esc(guide)}</div></div>`}
        <button id="v64PartnerFromDetail" class="primary" style="width:100%;margin-top:12px">+ Diese Übung wählen</button>
      </div>`,
      onBack:()=>renderPartnerExercisePicker(),
      onClose:cancelPlanAddFlow
    });
    $("v64PartnerFromDetail").onclick=()=>startCompactPartnerConfig(name)
  }

  

  /* Back from partner detail always returns to the same filtered catalog position. */
  const previousPlanAddBackV64=window.planAddBack||planAddBack;
  window.planAddBack=function(){
    if(planAddFlow?.step==="partnerDetail"){renderPartnerExercisePicker();return}
    return previousPlanAddBackV64()
  };

  function allExerciseSetsDoneV64(e){
    return !!e&&(e.liveSets||[]).length>0&&(e.liveSets||[]).every(s=>s.completed)
  }
  /* Live card rendering is owned by app-core.js. Legacy v64 renderer overrides removed. */
  const renderLiveV64BeforeActions=renderLive;


  /* Exact compact profile cards: no premise/explanation text. */
  function currentWeekV64(){
    const d=new Date(),day=d.getDay()||7,start=new Date(d);start.setDate(d.getDate()-day+1);start.setHours(0,0,0,0);
    const end=new Date(start);end.setDate(end.getDate()+7);
    const th=new Date(start);th.setDate(th.getDate()+3);const ys=new Date(th.getFullYear(),0,1);
    const week=Math.ceil((((th-ys)/86400000)+ys.getDay()+1)/7);
    return{start,end,week}
  }
  function weekDaysV64(){
    const {start,end}=currentWeekV64(),days=new Set();
    history.forEach(w=>{
      const t=Number(w?.finishedAt||w?.startedAt||0);if(!t||t<start.getTime()||t>=end.getTime())return;
      days.add(dateKeyLocal(t))
    });
    return days.size
  }

  try{renderProfileProgress();if(activeWorkout&&!$("livePage")?.classList.contains("hidden"))renderLive()}catch(e){console.error("v64 init",e)}
})();


/* v68 final integration */
(function(){
 function moveRestDockV68(){
   const bar=$('restBar');if(bar&&bar.parentElement!==document.body)document.body.appendChild(bar)
 }
 moveRestDockV68();
 const baseStartRestV68=startRest;
 startRest=function(sec,restored=false){moveRestDockV68();return baseStartRestV68(sec,restored)};

 /* Preview uses the same workout card renderer, but remains read-only. */

 function weekRunningV68(day){
   if(!activeWorkout?.weekDate)return false;
   return String(activeWorkout.weekDate)===String(dateKeyLocal(weekDateAt(day)))
 }

 /* Week picker: selected order is workout order and is always numbered. */

 /* Workout finish/save flow is authoritative in app-core.js, including week-combined plans. */

/* Food / meal search */
 function ensureVisibleV68(input){window.rethinkKeepFieldVisibleV24?.(input)}
 function mealTotalsProxyV68(m){return window.__mealTotalsV52?window.__mealTotalsV52(m.items||[]):{grams:0,kcal:0,protein:0,water:0}}
 function openMealLogV68(meal){
   const t=mealTotalsProxyV68(meal);
   openSheet(meal.name,`<div class="meal-builder-total"><strong>${esc(meal.name)}</strong><div>1 Portion · ${Math.round(t.grams)} g · ${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</div></div><div class="food-quick-portions v68"><button data-v68-meal=".125">⅛</button><button data-v68-meal=".25">¼</button><button data-v68-meal=".5">½</button><button data-v68-meal="1">1</button></div><div class="form-field"><label>PORTION / MENGE</label><input id="v68MealAmount" class="field" inputmode="decimal" value="1"></div><div id="v68MealPreview" class="small"></div><button id="v68MealAdd" class="primary" style="width:100%;margin-top:10px">Mahlzeit eintragen</button>`);
   const inp=$('v68MealAmount'),prev=$('v68MealPreview'),upd=()=>{const f=Math.max(.01,Number(String(inp.value).replace(',','.'))||1);prev.textContent=`${Math.round(t.grams*f)} g · ${Math.round(t.kcal*f)} kcal · ${Math.round(t.protein*f*10)/10} g Protein · ${Math.round(t.water*f)} g Wasser`};
   document.querySelectorAll('[data-v68-meal]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.v68Meal;upd();inp.focus();inp.select();ensureVisibleV68(inp)});
   inp.oninput=upd;upd();inp.focus();inp.select();ensureVisibleV68(inp);
   $('v68MealAdd').onclick=()=>{const f=Math.max(.01,Number(String(inp.value).replace(',','.'))||1);nutrition.foodLog=Array.isArray(nutrition.foodLog)?nutrition.foodLog:[];nutrition.foodLog.push({id:uid(),date:profileDateKey(),name:meal.name,category:'Mahlzeit',grams:Math.round(t.grams*f),kcal:Math.round(t.kcal*f),protein:Math.round(t.protein*f*10)/10,water:Math.round(t.water*f),mealId:meal.id,portions:f});recalcFoodTotals();saveAll();closeSheet({all:true});renderProfile()}
 }

 /* Drink choice focuses amount synchronously, which is required by iOS. */
 if($('addWaterBtn'))$('addWaterBtn').onclick=openQuickDrinkEntry;

 /* Rebind saved meals to the new fraction picker after every profile render. */
 __rt.profile.post.push(function(__result,...__args){
document.querySelectorAll('[data-meal-log]').forEach(b=>b.onclick=()=>{const m=(nutrition.meals||[]).find(x=>String(x.id)===String(b.dataset.mealLog));if(m)openMealLogV68(m)});
   if($('addFoodTodayBtn'))$('addFoodTodayBtn').onclick=()=>openFoodSearch('')
});

 // Annual automatic cleanup was removed. User data is deleted only via explicit data-management actions.
})();


/* v69 hardening */
(function(){

 function v69MoveRestBar(){
   const bar=$('restBar');
   if(bar&&bar.parentElement!==document.body)document.body.appendChild(bar)
 }
 v69MoveRestBar();
 const startRestBeforeV69=startRest;
 startRest=function(sec,restored=false){v69MoveRestBar();return startRestBeforeV69(sec,restored)};

 /* Giant target remains authoritative through the entire partner flow. */
 const confirmBeforeV69=confirmPlanAddDraft;
 confirmPlanAddDraft=function(){
   const e=planAddFlow?.current;
   if(e?.setTechnique==='giant'){
     e.methodData=e.methodData||{};
     e.methodData.giantCount=Math.min(6,Math.max(3,Number($('paGiantCount')?.value||e.methodData.giantCount||planAddFlow.group?.target||3)));
     if(planAddFlow.group){planAddFlow.group.method='giant';planAddFlow.group.target=e.methodData.giantCount}
   }
   return confirmBeforeV69()
 };
 const advanceBeforeV69=advancePartnerDraftFlow;
 advancePartnerDraftFlow=function(){
   const f=planAddFlow;
   if(f?.group?.method==='giant'){
     const target=Math.min(6,Math.max(3,Number(f.drafts?.[0]?.methodData?.giantCount||f.group.target||3)));
     f.group.target=target
   }
   return advanceBeforeV69()
 };

 /* Exact read-only preview: use the dedicated preview renderer, not the live five-column controls. */

 /* Week running state + click back into running unit. */
 function v69WeekDate(day){return dateKeyLocal(weekDateAt(day))}
 function v69WeekRunning(day){return !!activeWorkout?.weekDate&&String(activeWorkout.weekDate)===String(v69WeekDate(day))}
 __rt.week.core=function(){
   $('weekMotivation').innerHTML=`<div class="small">DIESE WOCHE</div><strong>${esc(weekMotivationText())}</strong>`;
   const days=['Mo','Di','Mi','Do','Fr','Sa','So'],from=weekDateAt(0),to=weekDateAt(6);
   $('weekRangeLabel').textContent=`${fmtShortDate(from)} – ${fmtShortDate(to)}`;
   $('weekOffsetLabel').textContent=weekOffset===0?'Diese Woche':weekOffset<0?`${Math.abs(weekOffset)} Woche${Math.abs(weekOffset)===1?'':'n'} zurück`:`${weekOffset} Woche${weekOffset===1?'':'n'} voraus`;
   $('weekPrevBtn').disabled=weekOffset<=-104;$('weekNextBtn').disabled=weekOffset>=104;
   let changed=false;weekPlan=weekPlan.map((ids,i)=>{const valid=validWeekPlans(i).map(p=>p.id);if(JSON.stringify(valid)!==JSON.stringify(Array.isArray(ids)?ids:[]))changed=true;return valid});if(changed)saveAll();
   $('weekList').innerHTML=days.map((d,i)=>{
     const ps=validWeekPlans(i),ex=ps.reduce((n,p)=>n+p.exercises.length,0),sets=ps.reduce((n,p)=>n+countPlanSets(p),0),date=weekDateAt(i),done=ps.length&&weekCompletion(i),running=ps.length&&v69WeekRunning(i),names=ps.map(p=>p.name).join(' + ');
     return`<div class="week-row"><div class="week-day">${d}</div><div class="week-card ${done?'week-completed':running?'week-running':ps.length?'week-scheduled':''}">
       <button class="week-card-main" ${ps.length?`data-v69-week-main="${i}"`:''}><div class="week-card-date">${date.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</div>
       ${ps.length?`<strong>${esc(names)}</strong><small>${ps.length} Plan${ps.length===1?'':'e'} · ${ex} Übungen · ${sets} Sätze${done?' · Abgeschlossen':''}</small>${running?'<div class="week-running-label">WORKOUT LÄUFT</div>':''}`:`<div class="week-pause-wrap">${stretchSvg()}<div><strong>Pause</strong><small>Freier Tag</small></div></div>`}</button>
       <div class="week-actions">${ps.length?`${done?'':`<button class="week-plus week-play" data-v69-week-play="${i}" aria-label="${running?'Workout öffnen':'Training starten'}">▶</button>`}<button class="week-menu" data-wm="${i}">⋮</button>`:`<button class="week-plus" data-wa="${i}" aria-label="Plan hinzufügen">+</button>`}</div>
     </div></div>`
   }).join('');
   document.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>openWeekPicker(Number(b.dataset.wa)));
   document.querySelectorAll('[data-v69-week-main]').forEach(b=>b.onclick=()=>{const day=Number(b.dataset.v69WeekMain);if(v69WeekRunning(day))openLive(false);else openWeekPreview(day)});
   document.querySelectorAll('[data-v69-week-play]').forEach(b=>b.onclick=e=>{e.stopPropagation();const day=Number(b.dataset.v69WeekPlay);if(v69WeekRunning(day))openLive(false);else{const fresh=combinedWeekPlan(day);if(fresh)confirmAndStartPlan(fresh)}});
   document.querySelectorAll('[data-wm]').forEach(b=>b.onclick=e=>{e.stopPropagation();weekMenu(Number(b.dataset.wm))})
 };

 /* Selected week-plan order is explicit and is workout order. */

 /* Stable food search + own foods + meals + requested portion units. */
 function v69FoodList(){return window.__allFoodsV52?window.__allFoodsV52():[]}
 function v69Serving(f){return window.__foodServingV52?window.__foodServingV52(f):{grams:100,label:'1 Portion'}}
 function v69Nutrients(f,g){return window.__nutrientsForV52?window.__nutrientsForV52(f,g):{kcal:0,protein:0,water:0}}
 function v69MealTotals(m){return window.__mealTotalsV52?window.__mealTotalsV52(m.items||[]):{grams:0,kcal:0,protein:0,water:0}}
 function v69IngredientNames(x){const direct=Array.isArray(x?.ingredients)?x.ingredients:[],items=Array.isArray(x?.items)?x.items.map(it=>it?.food?.name||it?.name||''):[];return [...new Set([...direct,...items].map(v=>String(v||'').trim()).filter(Boolean))]}
 function v69Norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()}
 function v69IngredientLine(x){const a=v69IngredientNames(x);return a.length>1?`<span class=\"food-ingredients\">Zutaten: ${esc(a.slice(0,8).join(' · '))}${a.length>8?' …':''}</span>`:''}
 function v69Reveal(input){window.rethinkKeepFieldVisibleV24?.(input)}
 function v69MealEntry(meal){
   const t=v69MealTotals(meal);
   openSheet(meal.name,`<div class="meal-builder-total"><strong>${esc(meal.name)}</strong><div>1 Portion · ${Math.round(t.grams)} g · ${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</div></div>
   <div class="food-quick-portions v69"><button data-v69-meal=".125">⅛</button><button data-v69-meal=".25">¼</button><button data-v69-meal=".5">½</button><button data-v69-meal="1">1</button></div>
   <div class="form-field"><label>PORTIONEN</label><input id="v69MealAmount" class="field" inputmode="decimal" value="1"></div><div id="v69MealPreview" class="small"></div>
   <button id="v69MealAdd" class="primary" style="width:100%;margin-top:10px">Eintragen</button>`);
   const inp=$('v69MealAmount'),prev=$('v69MealPreview'),update=()=>{const f=Math.max(.01,Number(String(inp.value).replace(',','.'))||1);prev.textContent=`${Math.round(t.grams*f)} g · ${Math.round(t.kcal*f)} kcal · ${Math.round(t.protein*f*10)/10} g Protein · ${Math.round(t.water*f)} g Wasser`};
   document.querySelectorAll('[data-v69-meal]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.v69Meal;update();inp.focus();inp.select();v69Reveal(inp)});
   inp.oninput=update;update();inp.focus();inp.select();v69Reveal(inp);
   $('v69MealAdd').onclick=()=>{const f=Math.max(.01,Number(String(inp.value).replace(',','.'))||1);nutrition.foodLog=Array.isArray(nutrition.foodLog)?nutrition.foodLog:[];nutrition.foodLog.push({id:uid(),date:profileDateKey(),name:meal.name,category:'Mahlzeit',grams:Math.round(t.grams*f),kcal:Math.round(t.kcal*f),protein:Math.round(t.protein*f*10)/10,water:Math.round(t.water*f),mealId:meal.id,portions:f});recalcFoodTotals();saveAll();closeSheet({all:true});renderProfile()}
 }
 openFoodSearch=function(initialQuery='',options={}){
   let q=String(initialQuery||'').trim().toLowerCase();
   const score=(f)=>{const n=String(f.name||''),c=String(f.category||''),ingredients=[...v69IngredientNames(f),...(Array.isArray(f.searchTerms)?f.searchTerms:[])].join(' '),qn=v69Norm(q),nn=v69Norm(n),cn=v69Norm(c),inn=v69Norm(ingredients);if(!qn)return 0;if(nn===qn)return 100;if(nn.startsWith(qn))return 92;if(nn.split(' ').some(w=>w.startsWith(qn)))return 84;if(inn.split(' ').some(w=>w.startsWith(qn)))return 78;if(cn.startsWith(qn))return 72;if(nn.includes(qn))return 55;if(inn.includes(qn))return 52;if(cn.includes(qn))return 45;return-1};
   const rows=()=>{
     const foods=v69FoodList().map(f=>({type:'food',item:f,score:score(f),used:(nutrition.foodLog||[]).filter(x=>String(x.name).toLowerCase()===String(f.name).toLowerCase()).length}));
     const meals=(nutrition.meals||[]).map(m=>({type:'meal',item:m,score:score({...m,category:'Mahlzeit'}),used:(nutrition.foodLog||[]).filter(x=>String(x.mealId)===String(m.id)).length}));
     const sorted=[...foods,...meals].filter(x=>q?x.score>=0:x.used>0).sort((a,b)=>b.score-a.score||b.used-a.used||String(a.item.name).localeCompare(String(b.item.name),'de'));if(sorted.length<=300)return sorted;const head=sorted.slice(0,300),seen=new Set(head.map(x=>`${x.type}:${x.item.id||x.item.name}`));sorted.forEach(x=>{if((x.type==='meal'||x.item?.isMeal)&&!seen.has(`${x.type}:${x.item.id||x.item.name}`)){head.push(x);seen.add(`${x.type}:${x.item.id||x.item.name}`)}});return head
   };
   const markup=()=>rows().map(x=>{
     if(x.type==='meal'){const t=v69MealTotals(x.item);return`<button class="food-result" data-v69-meal-result="${x.item.id}"><div class="food-result-copy"><strong>${esc(x.item.name)}</strong><small>Mahlzeit${x.used?` · ${x.used}× verwendet`:''}</small>${v69IngredientLine(x.item)}</div><span class="food-result-values">${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</span></button>`}
     const f=x.item,s=v69Serving(f),key=f._customId?`custom:${f._customId}`:`builtin:${f.name}`,portion=f.isMeal?v69Nutrients(f,s.grams):null;return`<button class="food-result ${foodTone(f.category)}" data-v69-food-result="${esc(key)}"><div class="food-result-copy"><strong>${esc(f.name)}</strong><small>${esc(f.category||'Eigenes Lebensmittel')}${x.used?` · ${x.used}× verwendet`:''}</small>${v69IngredientLine(f)}<span class="food-serving">${esc(s.label)}${f.isMeal?'':` ≈ ${s.grams} g`}</span></div><span class="food-result-values">${f.isMeal?`${portion.kcal} kcal · ${portion.protein} g Protein / Portion`:`${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser`}</span></button>`
   }).join('')||(q?`<div class="food-search-empty food-search-no-result"><strong>Kein passender Treffer.</strong><button type="button" class="primary" data-v69-create-food style="width:100%;margin-top:10px">Lebensmittel/Mahlzeit erstellen</button></div>`:'<div class="food-search-empty"><strong>Lebensmittel oder Mahlzeit suchen</strong></div>');
   const body=()=>`<div class="food-search-sticky stable-entry-sticky"><div class="search food-search"><span class="search-loupe">⌕</span><input id="v69FoodSearch" class="field" type="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Lebensmittel, Mahlzeit oder Kategorie" value="${esc(q)}"><button id="v69FoodClear" class="${q?'':'hidden'}">×</button></div></div><div id="v69FoodRows" class="stable-search-results">${markup()}</div>`;
   const bindRows=()=>{
     document.querySelectorAll('[data-v69-create-food]').forEach(b=>b.onclick=()=>{
       openSheet('Lebensmittel/Mahlzeit erstellen',`<div class="food-create-choice"><button id="v72CreateFood" class="primary" style="width:100%">Lebensmittel erstellen</button><button id="v72CreateMeal" class="secondary" style="width:100%;margin-top:8px">Mahlzeit erstellen</button></div>`,()=>{if($('v72CreateFood'))$('v72CreateFood').onclick=()=>window.__openCustomFoodV52?.();if($('v72CreateMeal'))$('v72CreateMeal').onclick=()=>window.__openMealBuilderV52?.()})
     });
     document.querySelectorAll('[data-v69-meal-result]').forEach(b=>b.onclick=()=>{const m=(nutrition.meals||[]).find(x=>String(x.id)===String(b.dataset.v69MealResult));if(options.selectOnly){toast('Bitte einzelne Zutaten wählen.');return}if(m)v69MealEntry(m)});
     document.querySelectorAll('[data-v69-food-result]').forEach(b=>b.onclick=()=>{
       const key=b.dataset.v69FoodResult,all=v69FoodList(),f=key.startsWith('custom:')?all.find(x=>String(x._customId)===key.slice(7)):all.find(x=>String(x.name)===key.slice(8));if(!f)return;
       if(options.selectOnly&&typeof options.onSelect==='function'){options.onSelect(f);return}
       const s=v69Serving(f);
       const servingN=v69Nutrients(f,s.grams);openSheet(f.name,`<div class="food-selected ${foodTone(f.category)}"><strong>${esc(f.name)}</strong><div class="small">${f.isMeal?`${servingN.kcal} kcal · ${servingN.protein} g Protein · ${servingN.water} g Wasser pro Portion`:`${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser je 100 g`}</div>${v69IngredientNames(f).length>1?`<div class="food-selected-ingredients"><b>Zutaten</b><span>${esc(v69IngredientNames(f).join(' · '))}</span></div>`:''}<span class="food-serving">${esc(s.label)}${f.isMeal?` · ${s.grams} g`: ` ≈ ${s.grams} g`}</span></div>
       <div class="food-quick-portions v69"><button data-v69-food-factor=".125">⅛</button><button data-v69-food-factor=".25">¼</button><button data-v69-food-factor=".5">½</button><button data-v69-food-factor="1">1</button></div>
       <div class="form-field"><label>GRAMM</label><input id="v69FoodGrams" class="field" inputmode="decimal" value="${s.grams}"></div><div id="v69FoodPreview" class="small"></div>
       <button id="v69FoodAdd" class="primary" style="width:100%;margin-top:10px">Hinzufügen</button>`);
       const inp=$('v69FoodGrams'),prev=$('v69FoodPreview'),upd=()=>{const n=v69Nutrients(f,Number(String(inp.value).replace(',','.')));prev.textContent=`${n.kcal} kcal · ${n.protein} g Protein · ${n.water} g Wasser`};
       document.querySelectorAll('[data-v69-food-factor]').forEach(btn=>btn.onclick=()=>{inp.value=Math.max(1,Math.round(s.grams*Number(btn.dataset.v69FoodFactor)));upd();inp.focus();inp.select();v69Reveal(inp)});
       inp.oninput=upd;upd();inp.focus();inp.select();v69Reveal(inp);
       $('v69FoodAdd').onclick=()=>{addFoodEntry(f,Number(String(inp.value).replace(',','.')));closeSheet({all:true})}
     })
   };
   const bind=()=>{
     const input=$('v69FoodSearch');
     input.oninput=()=>{q=input.value.trim().toLowerCase();$('v69FoodRows').innerHTML=markup();$('v69FoodClear').classList.toggle('hidden',!q);bindRows()};
     $('v69FoodClear').onclick=()=>{q='';input.value='';$('v69FoodRows').innerHTML=markup();$('v69FoodClear').classList.add('hidden');bindRows();try{input.focus({preventScroll:true})}catch{input.focus()}};
     bindRows();requestAnimationFrame(()=>{try{input.focus({preventScroll:true})}catch{input.focus()}})
   };
   openSheet(options.title||'Lebensmittel hinzufügen',body(),bind)
 };

 /* iOS requires focus directly in the user click event for the keyboard. */
 if($('addWaterBtn'))$('addWaterBtn').onclick=openQuickDrinkEntry;

 /* Restore behavior remains authoritative in app-core v24. */

 /* Safe yearly cleanup remains opt-in and confirm-before-delete. */
})();


/* v69 active-exercise normalization */
(function(){
 function exerciseDoneV69(e){return !!e&&(e.liveSets||[]).length>0&&(e.liveSets||[]).every(s=>s.completed)}
 function firstOpenInVisualOrderV69(){
   if(!activeWorkout)return 0;
   const groups=liveVisualGroups(activeWorkout.exercises||[]);
   for(const g of groups){
     if(g.group){
       const open=g.members.find(x=>!exerciseDoneV69(x.e));
       if(open)return open.i
     }else if(!exerciseDoneV69(g.members[0].e))return g.members[0].i
   }
   return Math.max(0,(activeWorkout.exercises||[]).length-1)
 }
 const renderBeforeV69Active=renderLive;
})();


/* v70 recurring week-plan rules */
(function(){
 const RECUR_KEY='rethink_week_recurring_rules_v1';
 const EXCEPT_KEY='rethink_week_recurring_exceptions_v1';

 function loadRulesV70(){const x=read(RECUR_KEY,[]);return Array.isArray(x)?x:[]}
 function pruneOrphanRulesV70(){
   const ids=new Set(plans.map(p=>String(p.id))),rules=loadRulesV70(),clean=rules.filter(r=>ids.has(String(r.planId)));
   if(clean.length!==rules.length)saveRulesV70(clean)
 }
 function saveRulesV70(x){write(RECUR_KEY,Array.isArray(x)?x:[])}
 function loadExceptionsV70(){const x=read(EXCEPT_KEY,{});return x&&typeof x==='object'?x:{}}
 function saveExceptionsV70(x){write(EXCEPT_KEY,x&&typeof x==='object'?x:{})}
 function dateKeyV70(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
 function noonV70(key){const d=new Date(`${key}T12:00:00`);return Number.isFinite(d.getTime())?d:null}
 function weeksBetweenV70(a,b){const A=noonV70(a),B=noonV70(b);if(!A||!B)return 0;return Math.round((B-A)/604800000)}
 function ruleActiveV70(rule,date){
   const key=dateKeyV70(date),start=String(rule.startDate||'');
   if(!start||key<start||Number(date.getDay()||7)!==Number(rule.isoWeekday||7))return false;
   const diff=weeksBetweenV70(start,key);if(diff<0)return false;
   if(rule.endMode==='count'&&Number(rule.countWeeks)>0&&diff>=Number(rule.countWeeks))return false;
   if(rule.endMode==='date'&&rule.endDate&&key>String(rule.endDate))return false;
   if(rule.stopBefore&&key>=String(rule.stopBefore))return false;
   return true
 }
 function exceptionForV70(dateKey){const all=loadExceptionsV70();return all[dateKey]||{removedRuleIds:[],explicitPlanIds:null}}
 function setExceptionV70(dateKey,value){
   const all=loadExceptionsV70();
   const clean={removedRuleIds:[...new Set((value?.removedRuleIds||[]).map(String))],explicitPlanIds:Array.isArray(value?.explicitPlanIds)?value.explicitPlanIds.map(Number):null};
   if(!clean.removedRuleIds.length&&clean.explicitPlanIds===null)delete all[dateKey];else all[dateKey]=clean;
   saveExceptionsV70(all)
 }
 function recurringEntriesForV70(day){
   const date=weekDateAt(day),key=dateKeyV70(date),ex=exceptionForV70(key),removed=new Set((ex.removedRuleIds||[]).map(String));
   return loadRulesV70().filter(r=>!removed.has(String(r.id))&&ruleActiveV70(r,date)&&plans.some(p=>String(p.id)===String(r.planId)))
     .sort((a,b)=>Number(a.order||0)-Number(b.order||0)||Number(a.createdAt||0)-Number(b.createdAt||0))
 }
 function explicitIdsV70(day){
   const key=dateKeyV70(weekDateAt(day)),ex=exceptionForV70(key);
   if(Array.isArray(ex.explicitPlanIds))return ex.explicitPlanIds.filter(id=>plans.some(p=>String(p.id)===String(id)));
   const ids=Array.isArray(weekPlan[day])?weekPlan[day]:weekPlan[day]!=null?[weekPlan[day]]:[];
   return ids.filter(id=>plans.some(p=>String(p.id)===String(id)))
 }
 function effectiveIdsV70(day){
   const key=dateKeyV70(weekDateAt(day)),ex=exceptionForV70(key);
   if(Array.isArray(ex.explicitPlanIds))return ex.explicitPlanIds.filter(id=>plans.some(p=>String(p.id)===String(id)));
   const out=[],seen=new Set();
   recurringEntriesForV70(day).forEach(r=>{const id=Number(r.planId);if(!seen.has(String(id))){out.push(id);seen.add(String(id))}});
   explicitIdsV70(day).forEach(id=>{if(!seen.has(String(id))){out.push(id);seen.add(String(id))}});
   return out
 }
 window.validWeekPlans=function(day){return effectiveIdsV70(day).map(id=>plans.find(p=>String(p.id)===String(id))).filter(Boolean)};
 function recurringRuleIdsV70(day){return recurringEntriesForV70(day).map(r=>String(r.id))}
 function hasRecurringV70(day){return recurringRuleIdsV70(day).length>0}
 function repeatMarkerV70(day){return hasRecurringV70(day)?'<span class="week-repeat-badge">↻</span>':''}

 function upsertRecurrenceV70(day,selected,config){
   const date=weekDateAt(day),start=dateKeyV70(date),iso=Number(date.getDay()||7),rules=loadRulesV70();
   // From this start date, stop existing rules for this weekday/selected context so they do not overlap.
   rules.forEach(r=>{if(Number(r.isoWeekday)===iso&&ruleActiveV70(r,date)&&selected.map(String).includes(String(r.planId)))r.stopBefore=start});
   selected.forEach((planId,order)=>{
     rules.push({
       id:`wr_${uid()}`,planId:Number(planId),isoWeekday:iso,startDate:start,
       endMode:config.mode,countWeeks:config.mode==='count'?Number(config.countWeeks||1):null,
       endDate:config.mode==='date'?String(config.endDate||start):null,
       order,createdAt:Date.now()
     })
   });
   saveRulesV70(rules);
   // Current week should be derived from recurrence, not duplicated in dated storage.
   weekPlan[day]=[];
   setExceptionV70(start,{removedRuleIds:[],explicitPlanIds:null});
   saveAll()
 }
 function applyOnlyThisWeekV70(day,selected){
   const key=dateKeyV70(weekDateAt(day)),ruleIds=recurringRuleIdsV70(day);
   setExceptionV70(key,{removedRuleIds:ruleIds,explicitPlanIds:selected});
   weekPlan[day]=[];saveAll()
 }
 function replaceFromHereV70(day,selected,repeatConfig=null){
   const date=weekDateAt(day),key=dateKeyV70(date),iso=Number(date.getDay()||7),rules=loadRulesV70();
   rules.forEach(r=>{if(Number(r.isoWeekday)===iso&&ruleActiveV70(r,date))r.stopBefore=key});
   saveRulesV70(rules);
   setExceptionV70(key,{removedRuleIds:[],explicitPlanIds:null});
   if(repeatConfig&&repeatConfig.mode!=='once')upsertRecurrenceV70(day,selected,repeatConfig);
   else{weekPlan[day]=selected;saveAll()}
 }
 function stopRecurringFromV70(day){
   const date=weekDateAt(day),key=dateKeyV70(date),rules=loadRulesV70(),ids=new Set(recurringRuleIdsV70(day));
   rules.forEach(r=>{if(ids.has(String(r.id)))r.stopBefore=key});
   saveRulesV70(rules);setExceptionV70(key,{removedRuleIds:[...ids],explicitPlanIds:[]});weekPlan[day]=[];saveAll()
 }
 function removeOnlyOccurrenceV70(day){
   const key=dateKeyV70(weekDateAt(day)),ids=recurringRuleIdsV70(day);
   setExceptionV70(key,{removedRuleIds:ids,explicitPlanIds:[]});weekPlan[day]=[];saveAll()
 }

 /* Keep recurrence dynamic: never copy derived plans into dated-week storage. */
 const saveWeekBeforeV70=saveCurrentWeekRefs;
 saveCurrentWeekRefs=function(){
   const all=loadDatedWeeks();
   const explicit=weekPlan.map((ids,day)=>{
     const key=dateKeyV70(weekDateAt(day)),ex=exceptionForV70(key);
     if(Array.isArray(ex.explicitPlanIds))return []; // exception owns this occurrence
     return Array.isArray(ids)?ids:[]
   });
   all[weekKeyForOffset()]=explicit;write(WEEK_DATED_KEY,all)
 };

 /* Weekly picker with recurrence controls. */
 openWeekPicker=function(day){
   let selected=validWeekPlans(day).map(p=>p.id),q='',repeatMode='once',repeatWeeks=8;
   const start=weekDateAt(day),startKey=dateKeyV70(start),todayKey=dateKeyV70(new Date()),minRepeatEnd=startKey>todayKey?startKey:todayKey,defaultEnd=new Date(start);defaultEnd.setDate(defaultEnd.getDate()+7*7);
   let repeatEnd=dateKeyV70(defaultEnd);
   const activeRules=recurringEntriesForV70(day),existingRecurring=activeRules.length>0,firstRule=activeRules[0]||null;
   if(firstRule){
     repeatMode=firstRule.endMode||'count';
     if(repeatMode==='count'){
       const used=Math.max(0,weeksBetweenV70(firstRule.startDate,startKey));
       repeatWeeks=Math.max(2,Number(firstRule.countWeeks||8)-used)
     }
     if(repeatMode==='date'&&firstRule.endDate)repeatEnd=firstRule.endDate
   }
   const render=()=>{
     const rows=sortedPlansForPicker(q);
     $('sheetBody').innerHTML=`<div class="plan-picker-tools"><div class="search"><input id="weekSearch" placeholder="Plan suchen" value="${esc(q)}"><button id="weekSearchClear">×</button></div></div>
       ${rows.map(p=>{const order=selected.indexOf(p.id)+1;return`<button class="plan-card week-select-card ${order?'selected':''}" data-wpick="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span>${order?`<span class="week-order-badge">${order}</span>`:'›'}</span></button>`}).join('')}
       <div class="small" style="margin:8px 0">${selected.length?`Reihenfolge: ${selected.map((id,i)=>`${i+1}. ${esc(plans.find(p=>p.id===id)?.name||'Plan')}`).join(' · ')}`:'Kein Plan gewählt'}</div>
       <div class="repeat-config">
         <div class="repeat-choice-line"><strong>Wiederholen</strong><select id="v70RepeatMode" class="field">
           <option value="once" ${repeatMode==='once'?'selected':''}>Einmalig</option>
           <option value="count" ${repeatMode==='count'?'selected':''}>Für X Wochen</option>
           <option value="date" ${repeatMode==='date'?'selected':''}>Bis Datum</option>
         </select></div>
         ${repeatMode==='count'?`<div class="form-field"><label>ANZAHL WOCHEN</label><input id="v70RepeatWeeks" class="field" inputmode="numeric" min="2" max="104" value="${repeatWeeks}"></div>`:''}
         ${repeatMode==='date'?`<div class="form-field"><label>BIS EINSCHLIESSLICH</label><input id="v70RepeatEnd" class="field" type="date" min="${minRepeatEnd}" value="${repeatEnd<minRepeatEnd?minRepeatEnd:repeatEnd}"></div>`:''}
         <div class="repeat-rule-note">Die Wiederholung speichert nur eine Regel. Es werden keine Plan-Kopien für jede Woche angelegt.</div>
       </div>
       <button id="weekApply" class="primary" style="width:100%">Übernehmen</button>`;
     $('weekSearch').oninput=()=>{q=$('weekSearch').value;render()};
     $('weekSearchClear').onclick=()=>{q='';render()};
     document.querySelectorAll('[data-wpick]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.wpick),i=selected.indexOf(id);if(i>=0)selected.splice(i,1);else selected.push(id);render()});
     $('v70RepeatMode').onchange=()=>{repeatMode=$('v70RepeatMode').value;render()};
     if($('v70RepeatWeeks'))$('v70RepeatWeeks').oninput=()=>{repeatWeeks=Math.min(104,Math.max(2,Number($('v70RepeatWeeks').value)||2))};
     if($('v70RepeatEnd'))$('v70RepeatEnd').onchange=()=>{repeatEnd=$('v70RepeatEnd').value||dateKeyV70(start)};
     $('weekApply').onclick=()=>{
       const cfg={mode:repeatMode,countWeeks:repeatWeeks,endDate:repeatEnd};
       if(existingRecurring){
         openSheet('Wiederholung ändern?',`<div class="save-choice-stack">
           <button id="v70OnlyThis" class="primary">Nur diese Woche</button>
           <button id="v70ThisAndFollowing" class="secondary">Diese und folgende Wochen</button>
           <button id="v70CancelChange" class="secondary">Abbrechen</button>
         </div>`);
         $('v70OnlyThis').onclick=()=>{applyOnlyThisWeekV70(day,selected);closeSheet({all:true});renderWeek()};
         $('v70ThisAndFollowing').onclick=()=>{replaceFromHereV70(day,selected,cfg);closeSheet({all:true});renderWeek()};
         $('v70CancelChange').onclick=()=>closeSheet({all:true});
         return
       }
       if(repeatMode==='count'&&repeatWeeks<2)return toast('Bitte mindestens 2 Wochen wählen.');
       if(repeatMode==='date'&&repeatEnd<minRepeatEnd)return toast('Enddatum darf nicht in der Vergangenheit liegen.');
       if(repeatMode==='once'){weekPlan[day]=selected;saveAll()}
       else upsertRecurrenceV70(day,selected,cfg);
       closeSheet({all:true});renderWeek();renderProfileProgress?.()
     }
   };
   openSheet('Trainingsplan auswählen','');render()
 };

 /* Menu distinguishes one occurrence from the future series. */
 weekMenu=function(day){
   const ps=validWeekPlans(day);if(!ps.length)return;
   const recurring=hasRecurringV70(day);
   openSheet(ps.map(p=>p.name).join(' + '),`<button id="weekReplace" class="secondary" style="width:100%">⇄ Auswahl bearbeiten</button>
     <button id="weekDelete" class="secondary danger" style="width:100%;margin-top:8px">× Auswahl löschen</button>`);
   $('weekReplace').onclick=()=>{closeSheet({all:true});openWeekPicker(day)};
   $('weekDelete').onclick=()=>{
     if(!recurring){
       if(confirm('Auswahl für diesen Tag wirklich löschen?')){clearWeekCompletionForDay(day);weekPlan[day]=[];saveAll();closeSheet({all:true});renderWeek();renderProfileProgress?.()}
       return
     }
     openSheet('Wiederholung löschen?',`<div class="save-choice-stack">
       <button id="v70DeleteOnly" class="primary">Nur dieses Workout entfernen</button>
       <button id="v70DeleteFuture" class="secondary danger">Wiederholung ab hier beenden</button>
       <button id="v70DeleteCancel" class="secondary">Abbrechen</button>
     </div>`);
     $('v70DeleteOnly').onclick=()=>{clearWeekCompletionForDay(day);removeOnlyOccurrenceV70(day);closeSheet({all:true});renderWeek();renderProfileProgress?.()};
     $('v70DeleteFuture').onclick=()=>{stopRecurringFromV70(day);closeSheet({all:true});renderWeek();renderProfileProgress?.()};
     $('v70DeleteCancel').onclick=()=>closeSheet({all:true})
   }
 };

 /* Recurrence marker in week cards, while keeping v69 running/play behavior. */
 __rt.week.post.push(function(__result,...__args){
document.querySelectorAll('[data-v69-week-main]').forEach(btn=>{
     const day=Number(btn.dataset.v69WeekMain),strong=btn.querySelector('strong');
     if(strong&&hasRecurringV70(day)&&!strong.querySelector('.week-repeat-badge'))strong.insertAdjacentHTML('beforeend',repeatMarkerV70(day))
   })
});

 pruneOrphanRulesV70();
 window.__weekRecurringV70={
   rules:loadRulesV70,exceptions:loadExceptionsV70,active:(day)=>recurringEntriesForV70(day),effectiveIds:effectiveIdsV70,
   create:upsertRecurrenceV70,applyOnly:applyOnlyThisWeekV70,replaceFrom:replaceFromHereV70,
   removeOnly:removeOnlyOccurrenceV70,stopFrom:stopRecurringFromV70
 };
})();

/* Rethink_v3.1 — persistent five-tab UI state */
(function(){
 const TAB_UI_STORAGE="rethink_tab_ui_state_v31";
 function saveTabUiSnapshots(){
   try{
     if(typeof captureTabUiState==="function")captureTabUiState(currentTab);
     localStorage.setItem(TAB_UI_STORAGE,JSON.stringify(tabUiState))
   }catch{}
 }
 function loadTabUiSnapshots(){
   try{
     const saved=JSON.parse(localStorage.getItem(TAB_UI_STORAGE)||"null");
     if(saved&&typeof saved==="object")Object.keys(tabUiState).forEach(k=>{if(saved[k])tabUiState[k]=saved[k]})
   }catch{}
 }
 loadTabUiSnapshots();
 const persistBeforeTabState=persistUI;
 persistUI=function(){saveTabUiSnapshots();return persistBeforeTabState()}
})();


;


/* Rethink_v3.1 — live completion, group delete, history dots, keyboard */
(function(){
 function ratingExistsV31(s){
   if(!s)return false;
   if(s.rating)return true;
   if(Array.isArray(s.segments))return s.segments.some(g=>!!g.rating);
   return false
 }
 function setFullyRatedV31(s){
   if(!s||!s.completed)return false;
   if(Array.isArray(s.segments)&&s.segments.length){
     // Segment-based methods may store the final rating on the set OR on every completed segment.
     return !!s.rating || s.segments.filter(g=>g.completed).every(g=>!!g.rating)
   }
   return !!s.rating
 }
 function exerciseFullyRatedV31(e){
   const sets=e?.liveSets||[];
   return sets.length>0&&sets.every(setFullyRatedV31)
 }
 function groupFullyRatedV31(g){
   return !!g?.members?.length&&g.members.every(x=>exerciseFullyRatedV31(x.e))
 }
 function priorRatingDotV31(e,si){
   const set=e?.liveSets?.[si];
   let r=(set?.rating&&set.rating!=="group")?set.rating:"";
   if(!r&&Array.isArray(set?.segments)){const rs=set.segments.map(x=>x?.rating).filter(Boolean);if(rs.length)r=rs[0]}
   if(!r)r=typeof visibleRatingValue==="function"?visibleRatingValue(e,si):(e?._lastRatings?.[si]||"");
   return r?`<span class="previous-rating-dot rating-${esc(r)}" title="${set?.rating?"Bewertung dieses Satzes":"Bewertung des letzten passenden Trainings"}"></span>`:""
 }
 function nextIncompleteVisualIndexV31(){
   if(!activeWorkout)return 0;
   for(const g of liveVisualGroups(activeWorkout.exercises||[])){
     if(g.group){
       if(!groupFullyRatedV31(g)){
         const member=g.members.find(x=>!exerciseFullyRatedV31(x.e));
         return member?member.i:g.members[0].i
       }
     }else if(!exerciseFullyRatedV31(g.members[0].e))return g.members[0].i
   }
   return Math.max(0,(activeWorkout.exercises||[]).length-1)
 }
 function normalizeActiveAfterRenderV31(){
   if(!activeWorkout?.exercises?.length)return;
   const current=activeWorkout.exercises[Number(activeWorkout.activeExerciseIndex)||0];
   if(current&&exerciseFullyRatedV31(current))activeWorkout.activeExerciseIndex=nextIncompleteVisualIndexV31()
 }

 function combinedMemberControlsFinalV31(x,si,gi,showLabels=true){
   const s=x.e.liveSets?.[si];if(!s)return"";
   const idx=`${si+1}${String.fromCharCode(65+gi)}`,dot=priorRatingDotV31(x.e,si),lab=txt=>`<span class="${showLabels?"":"combined-label-hidden"}">${txt}</span>`;
   if(x.e.measureMode==="time"){
     return`<div class="combined-member-row unified-combined-time-row">
       <span class="combined-index combined-index-with-history">${idx}${dot}</span>
       <label class="combined-field unified-time-field">${lab("ZEIT")}<span class="time-input-shell unified-time-shell"><input type="text" inputmode="none" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="${s.completed?"rated-time-value":""}" data-time-field="1" data-input="${x.i}|${si}|time" placeholder="${liveTimeBoxPlaceholder(s)}" value="${liveTimeBoxValue(s)}"></span></label>
       <label class="combined-field">${lab("LEISTUNG")}<input class="unified-performance-input" type="text" autocomplete="off" data-input="${x.i}|${si}|level" placeholder="Leistung" value="${esc(s.level||"")}"></label>
       ${s.completed?`<button class="set-check time-rating-action done ${ratingClass(s)}" data-check="${x.i}|${si}" aria-label="Bewertung anzeigen">✓</button>`:`<button type="button" class="set-check time-rating-action ready" data-time-play="${x.i}|${si}" aria-label="Timer starten und anschließend bewerten">▶</button>`}
     </div>`
   }
   return`<div class="combined-member-row">
     <span class="combined-index combined-index-with-history">${idx}${dot}</span>
     <label class="combined-field">${lab("KG")}<input type="text" inputmode="decimal" autocomplete="off" data-input="${x.i}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight||"")}"></label>
     <label class="combined-field">${lab("WDH.")}<input type="text" inputmode="numeric" autocomplete="off" data-input="${x.i}|${si}|reps" placeholder="${esc(liveRepBoxSuggestion(x.e,s))}" value="${esc(s.reps||"")}"></label>
     <button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(x.e,s)?"ready":""}" data-check="${x.i}|${si}">✓</button>
   </div>`
 }

 function renderLiveGroupCardFinalV31(g){
   const first=g.members[0],complete=groupFullyRatedV31(g);
   const active=!complete&&g.members.some(x=>Number(activeWorkout.activeExerciseIndex||0)===x.i);
   const rounds=Math.max(...g.members.map(x=>x.e.liveSets?.length||x.e.sets||0));
   let rows="";
   for(let si=0;si<rounds;si++){
     rows+=`<div class="combined-round"><div class="group-round-title"><span>Satz ${si+1}</span><button class="remove-mini" data-remove-live-set="${first.i}|${si}">−</button></div>`;
     const seenModes=new Set();g.members.forEach((x,gi)=>{const mode=x.e.measureMode==="time"?"time":"reps",show=!seenModes.has(mode);seenModes.add(mode);rows+=combinedMemberControlsFinalV31(x,si,gi,show)});
     rows+=`</div>`
   }
   const memberHead=g.members.map((x,gi)=>`
     <div class="live-group-member-head">
       <div class="live-group-member-copy">
         <div class="live-group-title-row"><button class="exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}"><span class="group-letter">${String.fromCharCode(65+gi)}</span><span class="group-title-name">${esc(exerciseDisplayName(x.e))}</span></button></div>${exerciseInlineMeta(x.e)}
         <div class="prescription connected-prescription">${esc(planPrescription(x.e))}</div><button class="note-line connected-note-line" data-live-note="${x.i}" style="border:0;background:transparent;padding:0">✎ ${esc(x.e.note||"Notiz")}</button>
       </div>
       <button class="icon-btn live-group-member-edit" data-live-config="${x.i}" aria-label="${esc(x.e.name)} bearbeiten">✎</button>
       <button class="live-group-member-delete" data-delete-live-ex="${x.i}" aria-label="${esc(x.e.name)} löschen">−</button>
     </div>`).join("");
   return`<div class="method-card live-exercise-card connected-live-card method-${g.method} ${active?"active-live-exercise":""} ${complete?"live-card-complete live-method-complete":""}" data-live-card="${first.i}" data-live-members="${g.members.map(x=>x.i).join(",")}">
     <div class="live-card-topline"><div class="method-name">${METHOD_LABEL[g.method]}</div>${complete?'<div class="live-complete-badge"><span class="tick">✓</span>Abgeschlossen</div>':""}</div>
     <div class="method-help">${esc(methodHelp(g.method))}</div>
     <div class="combined-series-head">${memberHead}</div>
     ${rows}
     <button class="secondary" data-add-group-set="${esc(g.key)}" style="margin-top:8px">Satz hinzufügen</button>
   </div>`
 }

 function singleSetRowsWithHistoryV31(markup,e){
   /* Previous-rating dot is added only once, after the visible number. */
   return markup
 }
 function renderLiveSingleCardFinalV31(e,i){
   const complete=exerciseFullyRatedV31(e),active=!complete&&Number(activeWorkout.activeExerciseIndex||0)===i;
   const setsMarkup=singleSetRowsWithHistoryV31(renderSets(e,i),e);
   return`<div class="method-card live-exercise-card method-${e.setTechnique||"standard"} ${active?"active-live-exercise":""} ${complete?"live-card-complete live-method-complete":""}" data-live-card="${i}">
     <div class="live-card-topline"><div class="method-name">${METHOD_LABEL[e.setTechnique||"standard"]}</div>${complete?'<div class="live-complete-badge"><span class="tick">✓</span>Abgeschlossen</div>':""}</div>
     <div class="method-help">${esc(methodHelp(e.setTechnique))}</div>
     <div class="live-card-head"><div><div class="live-single-title-row"><button class="exercise-title-link" data-live-detail="${esc(e.name)}" data-live-index="${i}">${esc(exerciseDisplayName(e))}</button></div>${exerciseInlineMeta(e)}<div class="prescription">${esc(planPrescription(e))}</div></div><div class="live-card-actions"><button class="icon-btn" data-live-config="${i}" aria-label="Übung bearbeiten">✎</button><button class="live-delete-ex" data-delete-live-ex="${i}" aria-label="Übung löschen">−</button></div></div>
     <button class="note-line" data-live-note="${i}" style="border:0;background:transparent;padding:0">✎ ${esc(e.note||"Notiz")}</button>
     ${setsMarkup}<button class="secondary" data-add-set="${i}" style="margin-top:8px">Satz hinzufügen</button>
   </div>`
 }

 function dissolveGroupToStandardAfterDeleteV31(index){
   if(!activeWorkout?.exercises?.[index])return;
   const target=activeWorkout.exercises[index],gid=target.techniqueGroup,method=target.setTechnique;
   const wasGroup=groupMethod(method)&&!!gid;
   activeWorkout.exercises.splice(index,1);
   if(wasGroup){
     const remaining=activeWorkout.exercises.filter(e=>e.techniqueGroup===gid);
     if(method==="giant"){
       if(remaining.length>=3){
         remaining.forEach(e=>{e.setTechnique="giant";e.techniqueGroup=gid;e.methodData={...(e.methodData||{}),giantCount:remaining.length};e.linkedExerciseNames=remaining.filter(x=>x!==e).map(x=>x.name)})
       }else if(remaining.length===2){
         remaining.forEach(e=>{e.setTechnique="superset";e.techniqueGroup=gid;e.methodData={};e.linkedExerciseNames=remaining.filter(x=>x!==e).map(x=>x.name);e.liveSets=rebuildLiveSetsForExercise(e,e.liveSets||[])})
       }else{
         remaining.forEach(e=>{e.techniqueGroup=null;e.setTechnique="standard";e.linkedExerciseNames=[];e.methodData={};if(!e.reps||["20","30","20-30"].includes(String(e.reps)))e.reps="8-12";e.liveSets=rebuildLiveSetsForExercise(e,e.liveSets||[])})
       }
     }else{
       remaining.forEach(e=>{e.techniqueGroup=null;e.setTechnique="standard";e.linkedExerciseNames=[];e.methodData={};if(!e.reps||["20","30","20-30"].includes(String(e.reps)))e.reps="8-12";e.liveSets=rebuildLiveSetsForExercise(e,e.liveSets||[])})
     }
   }
   activeWorkout.activeExerciseIndex=Math.min(index,Math.max(0,activeWorkout.exercises.length-1));
   markLiveStructureEdited();saveAll();renderLive()
 }

 function bindLiveFinalV31(){
   document.querySelectorAll("[data-live-detail]").forEach(b=>b.onclick=()=>{const i=Number((b.dataset.liveIndex??b.closest("[data-live-card]")?.dataset.liveCard)||0);setActiveExercise(i);exerciseDetailReturn={type:"live",index:i};openExerciseDetail(b.dataset.liveDetail)});
   document.querySelectorAll("[data-live-config]").forEach(b=>b.onclick=()=>{setActiveExercise(Number(b.dataset.liveConfig));configureLiveExercise(Number(b.dataset.liveConfig))});
   document.querySelectorAll("[data-delete-live-ex]").forEach(b=>b.onclick=()=>{
     const i=Number(b.dataset.deleteLiveEx),e=activeWorkout.exercises[i];if(!e)return;
     if(confirm(`„${e.name}“ aus dem Training löschen?`))dissolveGroupToStandardAfterDeleteV31(i)
   });
   document.querySelectorAll("[data-live-note]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.liveNote),v=prompt("Notiz",activeWorkout.exercises[i].note||"");if(v!==null){activeWorkout.exercises[i].note=v.trim();saveAll();renderLive()}});
   document.querySelectorAll("[data-check]").forEach(b=>b.onclick=()=>toggleSet(b.dataset.check));
   document.querySelectorAll("[data-segment-check]").forEach(b=>b.onclick=()=>{const [ei,si,gi]=b.dataset.segmentCheck.split("|").map(Number),g=activeWorkout.exercises[ei].liveSets[si].segments[gi];if(g.completed){g.completed=false;g.rating="";activeWorkout.exercises[ei].liveSets[si].completed=false;saveAll();renderLive()}else openSegmentRating(ei,si,gi)});
   document.querySelectorAll("[data-input]").forEach(x=>{
     x.oninput=()=>{setActiveExercise(Number(x.dataset.input.split("|")[0]));touchInput(x);updateInput(x)};
     x.onchange=()=>updateInput(x);
     x.onblur=()=>{updateInput(x);setTimeout(()=>{const a=document.activeElement;if(!a||!a.matches("[data-input]"))renderLive()},0)};
     x.onfocus=()=>{try{x.select?.()}catch{};window.rethinkKeepFieldVisibleV24?.(x)};
     x.addEventListener("pointerdown",ev=>ev.stopPropagation());
     x.addEventListener("click",ev=>{ev.stopPropagation();window.rethinkKeepFieldVisibleV24?.(x)})
   });
   document.querySelectorAll("[data-add-set]").forEach(b=>b.onclick=()=>{const e=activeWorkout.exercises[Number(b.dataset.addSet)];e.liveSets.push(initSet(e,e.liveSets.length));markLiveStructureEdited();saveAll();renderLive()});
   document.querySelectorAll("[data-add-group-set]").forEach(b=>b.onclick=()=>{const gid=b.dataset.addGroupSet,members=activeWorkout.exercises.map((x,i)=>x.techniqueGroup===gid?i:-1).filter(i=>i>=0);members.forEach(i=>{const e=activeWorkout.exercises[i];e.liveSets.push(initSet(e,e.liveSets.length));e.sets=e.liveSets.length});markLiveStructureEdited();saveAll();renderLive()});
   document.querySelectorAll("[data-remove-live-set]").forEach(b=>b.onclick=()=>removeLiveSet(b.dataset.removeLiveSet));
   document.querySelectorAll("[data-time-play]").forEach(b=>b.onclick=()=>toggleTimeTimer(b.dataset.timePlay,b))
 }

 /* app-core.js owns renderLiveGroupCard/renderLiveSingleCard; no runtime reassignment. */
 __rt.live.core=function(){
   if(!activeWorkout)return;
   activeWorkout.exercises=Array.isArray(activeWorkout.exercises)?activeWorkout.exercises:[];
   activeWorkout.exercises=activeWorkout.exercises.map((raw,i)=>{
     const oldSets=Array.isArray(raw?.liveSets)?raw.liveSets:null;
     const e=normPlanEx(raw||{});
     if(!oldSets||!oldSets.length)e.liveSets=Array.from({length:Math.max(1,Number(e.sets)||defaultSetsForExerciseMethod(e,e.setTechnique||"standard"))},(_,si)=>initSet(e,si));
     else e.liveSets=oldSets;
     if(!Number.isFinite(Number(e.groupPosition))&&e.techniqueGroup)e.groupPosition=i;
     return e
   });
   normalizeActiveAfterRenderV31();
   $("workoutNoteText").textContent=activeWorkout.note||"Notiz";
   const groups=liveVisualGroups(activeWorkout.exercises);
   $("liveBody").innerHTML=groups.map(g=>{
     try{return g.group?renderLiveGroupCardFinalV31(g):renderLiveSingleCardFinalV31(g.members[0].e,g.members[0].i)}
     catch(err){
       console.error("Live card render",err,g);
       const x=g.members?.[0];if(!x)return"";
       return `<div class="method-card live-exercise-card method-standard" data-live-card="${x.i}"><div class="method-name">${esc(METHOD_LABEL[x.e?.setTechnique||"standard"]||"STANDARD")}</div><div class="live-card-head"><div><button class="exercise-title-link" data-live-detail="${esc(x.e?.name||"")}" data-live-index="${x.i}">${esc(exerciseDisplayName(x.e||{}))}</button><div class="prescription">${esc(planPrescription(x.e||{}))}</div></div></div>${renderSets(x.e,x.i)}</div>`
     }
   }).join("");
   bindLiveFinalV31();
   saveAll()
 };

 // After rating, renderLive() now advances the active highlight only when the whole exercise/group is fully rated.
 const applyRatingBeforeV31=applySetRating;
 applySetRating=function(r){
   applyRatingBeforeV31(r);
   setTimeout(()=>{
     if(!activeWorkout)return;
     activeWorkout.activeExerciseIndex=nextIncompleteVisualIndexV31();
     saveAll();renderLive()
   },0)
 };
 const applySegmentBeforeV31=applySegmentRating;
 applySegmentRating=function(r){
   applySegmentBeforeV31(r);
   setTimeout(()=>{
     if(!activeWorkout)return;
     activeWorkout.activeExerciseIndex=nextIncompleteVisualIndexV31();
     saveAll();renderLive()
   },0)
 };

 // Hydration: amount control is above the drink grid, then the selectable drinks follow.
 if($("addWaterBtn"))$("addWaterBtn").onclick=openQuickDrinkEntry;
})();


/* Rethink_v3.1 — previous-rating dots for every single-method layout */
(function(){
 function dotNodeV31(r){const dot=document.createElement("span");dot.className=`previous-rating-dot rating-${r}`;dot.title="Bewertung letztes passendes Workout";return dot}
 function addPreviousDotsToSinglesV31(){
   // Dots are rendered directly beside the set number by renderSets()/combinedMemberControlsFinalV31.
   // Do not move or duplicate them after render.
 }
 __rt.live.post.push(function(__result,...__args){
const result=__result;
addPreviousDotsToSinglesV31();return result
});
 window.addPreviousDotsToSinglesV31=addPreviousDotsToSinglesV31
})();


/* Rethink_v3.1 — units and week start */
(function(){
 const PREF_KEY="rethink_preferences_v31",defaults={weightUnit:"kg",distanceUnit:"km",measurementUnit:"cm",weekStart:"monday"};
 let prefs={...defaults,...read(PREF_KEY,{})};
 function savePrefsV31(){write(PREF_KEY,prefs)}
 function nV31(v){const x=Number(String(v??"").trim().replace(",","."));return Number.isFinite(x)?x:null}
 function roundV31(v,d=1){const p=10**d;return Math.round(v*p)/p}
 function weightLabelV31(){return prefs.weightUnit==="lb"?"LB":"KG"}function lengthLabelV31(){return prefs.measurementUnit==="in"?"IN":"CM"}function distanceLabelV31(){return prefs.distanceUnit==="mi"?"MI":"KM"}
 function weightDisplayV31(kg){const x=nV31(kg);return x==null?"":roundV31(prefs.weightUnit==="lb"?x*2.2046226218:x,1)}
 function weightStorageV31(v){const x=nV31(v);return x==null?"":roundV31(prefs.weightUnit==="lb"?x/2.2046226218:x,3)}
 function lengthDisplayV31(cm){const x=nV31(cm);return x==null?"":roundV31(prefs.measurementUnit==="in"?x/2.54:x,1)}
 function lengthStorageV31(v){const x=nV31(v);return x==null?"":roundV31(prefs.measurementUnit==="in"?x*2.54:x,2)}
 function distanceDisplayV31(km){const x=nV31(km);return x==null?"":roundV31(prefs.distanceUnit==="mi"?x*0.6213711922:x,2)}
 function distanceStorageV31(v){const x=nV31(v);return x==null?"":roundV31(prefs.distanceUnit==="mi"?x/0.6213711922:x,3)}
 function weekStartOfV31(date=new Date(),mode=prefs.weekStart){const d=new Date(date);d.setHours(12,0,0,0);const off=mode==="sunday"?d.getDay():(d.getDay()+6)%7;d.setDate(d.getDate()-off);return d}
 function weekDayLabelsV31(){return prefs.weekStart==="sunday"?["So","Mo","Di","Mi","Do","Fr","Sa"]:["Mo","Di","Mi","Do","Fr","Sa","So"]}
 function keyV31(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
 function migrateWeekStorageV31(oldMode,newMode){if(oldMode===newMode)return;const all=loadDatedWeeks(),byDate={};Object.entries(all).forEach(([startKey,arr])=>{const start=new Date(`${startKey}T12:00:00`);(Array.isArray(arr)?arr:[]).forEach((ids,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);if(Array.isArray(ids)&&ids.length)byDate[keyV31(d)]=ids})});const rebuilt={};Object.entries(byDate).forEach(([dateKey,ids])=>{const d=new Date(`${dateKey}T12:00:00`),start=weekStartOfV31(d,newMode),wk=keyV31(start),idx=Math.round((d-start)/86400000);if(!rebuilt[wk])rebuilt[wk]=[[],[],[],[],[],[],[]];if(idx>=0&&idx<7)rebuilt[wk][idx]=ids});write(WEEK_DATED_KEY,rebuilt)}
 weekKeyForOffset=function(offset=weekOffset){const d=weekStartOfV31();d.setDate(d.getDate()+Number(offset||0)*7);return keyV31(d)};
 weekDateAt=function(day,offset=weekOffset){const d=weekStartOfV31();d.setDate(d.getDate()+Number(offset||0)*7+Number(day||0));return d};
 selectedWeekInfo=function(){const d=profileDate(),start=weekStartOfV31(d),end=new Date(start);end.setDate(start.getDate()+7);const iso=new Date(d);iso.setHours(12,0,0,0);const id=(iso.getDay()+6)%7;iso.setDate(iso.getDate()-id+3);const y0=new Date(iso.getFullYear(),0,4,12),yd=(y0.getDay()+6)%7,yThu=new Date(y0);yThu.setDate(y0.getDate()-yd+3);const week=1+Math.round((iso-yThu)/604800000);return{start,end,week,label:`KW ${String(week).padStart(2,"0")}`}};
 function updateWeekLabelsV31(){document.querySelectorAll("#weekList .week-day").forEach((el,i)=>el.textContent=weekDayLabelsV31()[i]||"")}
 __rt.week.post.push(function(__result,...__args){
const x=__result;
updateWeekLabelsV31();return x
});
 function unitizeSheetV31(){const body=$("sheetBody");if(!body)return;const walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const t=node.nodeValue;if(t&&t.trim()==="KG")node.nodeValue=t.replace(/KG/g,weightLabelV31())}if((body.querySelector(".method-tabs")||body.querySelector("[id*='MethodTabs']"))&&!body.querySelector(".unit-context-chip")){const chip=document.createElement("div");chip.className="unit-context-chip";chip.textContent=`Gewicht ${weightLabelV31()}`;body.prepend(chip)}}
 const renderSheetBeforeUnitsV31=renderSheetState;renderSheetState=function(state){const x=renderSheetBeforeUnitsV31(state);requestAnimationFrame(unitizeSheetV31);return x};
 function weightFieldInfoV31(inp){const raw=inp?.dataset?.input;if(!raw)return null;const [ei,si,k,gi]=raw.split("|");return["weight","sw","gw"].includes(k)?{ei:Number(ei),si:Number(si),k,gi:Number(gi)}:null}
 function canonicalWeightForFieldV31(i){const e=activeWorkout?.exercises?.[i.ei],s=e?.liveSets?.[i.si];if(!s)return"";return i.k==="weight"?(s.weight??""):(s.segments?.[i.gi]?.weight??"")}
 function suggestedWeightForFieldV31(i){const e=activeWorkout?.exercises?.[i.ei],s=e?.liveSets?.[i.si];if(!s)return"";return i.k==="weight"?(s._suggested?.weight??""):(s.segments?.[i.gi]?._suggested?.weight??"")}
 function applyLiveUnitsV31(){document.querySelectorAll("#liveBody .set-head span,#liveBody .time-head span,#liveBody .advanced-head span,#liveBody .combined-value-head span").forEach(el=>{if(el.textContent.trim()==="KG")el.textContent=weightLabelV31()});document.querySelectorAll("#liveBody [data-input]").forEach(inp=>{const info=weightFieldInfoV31(inp);if(!info)return;const c=canonicalWeightForFieldV31(info),s=suggestedWeightForFieldV31(info);inp.value=String(c).trim()===""?"":String(weightDisplayV31(c));inp.placeholder=String(s).trim()===""?weightLabelV31():String(weightDisplayV31(s))})}
 const updateInputBeforeUnitsV31=updateInput;updateInput=function(inp){const info=weightFieldInfoV31(inp);if(!info||prefs.weightUnit==="kg")return updateInputBeforeUnitsV31(inp);const shown=inp.value,converted=weightStorageV31(shown);inp.value=converted===""?"":String(converted);const result=updateInputBeforeUnitsV31(inp);if(inp.isConnected)inp.value=shown;return result};
 __rt.live.post.push(function(__result,...__args){
const x=__result;
applyLiveUnitsV31();return x
});
 function unitizePreviewV31(){document.querySelectorAll("#previewBody .preview-value,#previewBody .set-head span,#previewBody .time-head span,#previewBody .advanced-head span,#previewBody .combined-value-head span").forEach(el=>{if(el.textContent.trim()==="KG")el.textContent=weightLabelV31()})}
 function formatMeasurementValuesV31(m){return `${m.bodyfat?`<span>Körperfett ${m.bodyfat}%</span>`:""}${m.waist?`<span>Taille ${lengthDisplayV31(m.waist)} ${lengthLabelV31().toLowerCase()}</span>`:""}${m.chest?`<span>Brust ${lengthDisplayV31(m.chest)} ${lengthLabelV31().toLowerCase()}</span>`:""}${m.hip?`<span>Hüfte ${lengthDisplayV31(m.hip)} ${lengthLabelV31().toLowerCase()}</span>`:""}`}
 function patchProfileUnitsV31(){const latest=measurements.slice().reverse().find(m=>Number(m.weight)>0),cw=Number(latest?.weight||profile.weight||0);if($("profileSummary"))$("profileSummary").textContent=[profile.age?profile.age+" J.":"",profile.height?`${lengthDisplayV31(profile.height)} ${lengthLabelV31().toLowerCase()}`:"",cw?`${weightDisplayV31(cw)} ${weightLabelV31().toLowerCase()}`:""].filter(Boolean).join(" · ")||"Noch nicht eingerichtet";if($("profileGoalSummary")){const base=profile.goal==="cut"?"Ziel: Gewicht reduzieren":profile.goal==="gain"?"Ziel: Muskelaufbau":profile.goal==="maintain"?"Ziel: Gewicht halten":"Persönliche Werte und Ziele";$("profileGoalSummary").innerHTML=`<span>${base}</span>${profile.targetWeight?`<span class="target-weight-line-profile">Wunschgewicht ${weightDisplayV31(profile.targetWeight)} ${weightLabelV31().toLowerCase()}</span>`:""}`}document.querySelectorAll("[data-measurement-open]").forEach(btn=>{const i=Number(btn.dataset.measurementOpen),m=measurements[i];if(!m)return;const strong=btn.querySelector("strong");if(strong)strong.textContent=m.weight?`${weightDisplayV31(m.weight)} ${weightLabelV31().toLowerCase()}`:"Messung";const vals=btn.querySelector(".measurement-values");if(vals)vals.innerHTML=formatMeasurementValuesV31(m);btn.onclick=()=>openMeasurementRecord(i)})}
 __rt.profile.post.push(function(__result,...__args){
const x=__result;
patchProfileUnitsV31();requestAnimationFrame(()=>{patchProfileUnitsV31();renderProfileProgress()});return x
});
 openMeasurementRecord=function(i){const m=measurements[i];if(!m)return;openSheet("Messung",`<div class="card"><strong>${m.weight?`${weightDisplayV31(m.weight)} ${weightLabelV31().toLowerCase()} · ${activityLabel(m.activity||profile.activity||1.55)}`:"–"}</strong><div class="small">${new Date(m.date||Date.now()).toLocaleString("de-DE")}</div><div class="measurement-values" style="margin-top:12px">${formatMeasurementValuesV31(m)}</div></div><button id="deleteMeasurementRecord" class="secondary danger" style="width:100%;margin-top:12px">Messung löschen</button>`);$("deleteMeasurementRecord").onclick=()=>{if(confirm("Diese Messung wirklich löschen?")){measurements.splice(i,1);saveAll();closeSheet({all:true});renderProfile();toast("Messung gelöscht")}}};
 openMeasurementData=function(){openSheet("Messungen",`${measurements.slice().reverse().map((m,ri)=>{const i=measurements.length-1-ri;return`<div class="card" data-settings-measure-open="${i}"><div class="space"><div><strong>${m.weight?weightDisplayV31(m.weight):"–"} ${weightLabelV31().toLowerCase()} · ${activityLabel(m.activity||profile.activity||1.55)}</strong><div class="small">${new Date(m.date||Date.now()).toLocaleString("de-DE")}</div></div><span>›</span></div></div>`}).join("")||'<div class="card small">Noch keine Messungen.</div>'}`);document.querySelectorAll("[data-settings-measure-open]").forEach(b=>b.onclick=()=>openMeasurementRecord(Number(b.dataset.settingsMeasureOpen)))};
 function openMeasurementEntryV31(){openSheet("Messung hinzufügen",`<div class="grid2"><div class="form-field"><label>GEWICHT ${weightLabelV31()}</label><input id="measureWeightUnits" class="field" inputmode="decimal"></div><div class="form-field"><label>KÖRPERFETT IN %</label><input id="measureBodyfatUnits" class="field" inputmode="decimal"></div></div><div class="grid2"><div class="form-field"><label>TAILLE ${lengthLabelV31()}</label><input id="measureWaistUnits" class="field" inputmode="decimal"></div><div class="form-field"><label>BRUST ${lengthLabelV31()}</label><input id="measureChestUnits" class="field" inputmode="decimal"></div></div><div class="grid2"><div class="form-field"><label>HÜFTE ${lengthLabelV31()}</label><input id="measureHipUnits" class="field" inputmode="decimal"></div><div class="form-field"><label>AKTIVITÄT</label><select id="measureActivityUnits" class="field"><option value="1.2" ${String(profile.activity)==="1.2"?"selected":""}>Wenig aktiv</option><option value="1.375" ${String(profile.activity)==="1.375"?"selected":""}>Leicht aktiv</option><option value="1.55" ${!profile.activity||String(profile.activity)==="1.55"?"selected":""}>Moderat aktiv</option><option value="1.725" ${String(profile.activity)==="1.725"?"selected":""}>Sehr aktiv</option><option value="1.9" ${String(profile.activity)==="1.9"?"selected":""}>Extrem aktiv</option></select></div></div><button id="measureSaveUnits" class="primary" style="width:100%">Speichern</button>`);$("measureSaveUnits").onclick=()=>{const weight=weightStorageV31($("measureWeightUnits").value);if(!weight||weight<20||weight>400){$("measureWeightUnits").focus();return alert("Bitte Gewicht eintragen.")}const md=profileDayOffset===0?Date.now():profileDate().setHours(12,0,0,0),m={date:md,weight,bodyfat:$("measureBodyfatUnits").value,waist:lengthStorageV31($("measureWaistUnits").value),chest:lengthStorageV31($("measureChestUnits").value),hip:lengthStorageV31($("measureHipUnits").value),activity:$("measureActivityUnits").value};measurements.push(m);measurements.sort((a,b)=>Number(a.date)-Number(b.date));profile.weight=weight;profile.activity=$("measureActivityUnits").value;saveAll();closeSheet({all:true});renderProfile()}}openMeasurementEntry=openMeasurementEntryV31;if($("addMeasurementBtn"))$("addMeasurementBtn").onclick=openMeasurementEntryV31;
 
 const openSettingsBeforePrefsV31=openSettingsPage;openSettingsPage=function(){openSettingsBeforePrefsV31();requestAnimationFrame(()=>{const body=$("settingsBody");if(!body||$("unitSettingsV31"))return;const sec=document.createElement("div");sec.className="settings-section";sec.id="unitSettingsV31";sec.innerHTML=`<h3>Einheiten & Ansicht</h3><div class="settings-card"><div class="settings-row"><div><strong>Gewicht</strong><small>Training, Verlauf und Körpergewicht</small></div><select id="prefWeightUnit" class="field settings-unit-select"><option value="kg" ${prefs.weightUnit==="kg"?"selected":""}>kg</option><option value="lb" ${prefs.weightUnit==="lb"?"selected":""}>lb</option></select></div><div class="settings-row"><div><strong>Distanz</strong><small>Cardio-/Distanzangaben</small></div><select id="prefDistanceUnit" class="field settings-unit-select"><option value="km" ${prefs.distanceUnit==="km"?"selected":""}>km</option><option value="mi" ${prefs.distanceUnit==="mi"?"selected":""}>mi</option></select></div><div class="settings-row"><div><strong>Messungen</strong><small>Größe, Taille, Brust und Hüfte</small></div><select id="prefMeasurementUnit" class="field settings-unit-select"><option value="cm" ${prefs.measurementUnit==="cm"?"selected":""}>cm</option><option value="in" ${prefs.measurementUnit==="in"?"selected":""}>in</option></select></div><div class="settings-row"><div><strong>Wochenstart</strong><small>Reihenfolge und Datumsbereich</small></div><select id="prefWeekStart" class="field settings-unit-select"><option value="monday" ${prefs.weekStart==="monday"?"selected":""}>Montag</option><option value="sunday" ${prefs.weekStart==="sunday"?"selected":""}>Sonntag</option></select></div>`;const training=[...body.querySelectorAll(".settings-section")].find(x=>x.querySelector("h3")?.textContent==="Training");if(training)body.insertBefore(sec,training);else body.appendChild(sec);$("prefWeightUnit").onchange=()=>{prefs.weightUnit=$("prefWeightUnit").value;savePrefsV31();if(activeWorkout)renderLive();renderProfile();unitizeSheetV31()};$("prefDistanceUnit").onchange=()=>{prefs.distanceUnit=$("prefDistanceUnit").value;savePrefsV31();unitizeSheetV31()};$("prefMeasurementUnit").onchange=()=>{prefs.measurementUnit=$("prefMeasurementUnit").value;savePrefsV31();renderProfile()};$("prefWeekStart").onchange=()=>{const old=prefs.weekStart,next=$("prefWeekStart").value;saveCurrentWeekRefs();migrateWeekStorageV31(old,next);prefs.weekStart=next;savePrefsV31();loadWeekOffset(weekOffset);renderProfileProgress()}})};
 window.rethinkPrefsV31={get:()=>({...prefs}),weightLabel:weightLabelV31,lengthLabel:lengthLabelV31,distanceLabel:distanceLabelV31,weightDisplay:weightDisplayV31,weightStorage:weightStorageV31,lengthDisplay:lengthDisplayV31,lengthStorage:lengthStorageV31,distanceDisplay:distanceDisplayV31,distanceStorage:distanceStorageV31,weekStartOf:weekStartOfV31,weekDayLabels:weekDayLabelsV31};
})();
/* Rethink_v3.1 — unit-aware measurement charts */
(function(){
 function chartV31(label,key,unit,convert){const rows=measurements.filter(m=>Number(m[key])>0);if(!rows.length)return`<div class="profile-chart card always-chart"><div class="space"><strong>${label}</strong><span class="small">Noch keine Messung</span></div><div class="empty-chart-line"></div><div class="chart-range chart-dates"><span>Zu Beginn</span><span>–</span></div></div>`;const vals=rows.map(m=>Number(convert(m[key]))),targetRaw=key==="weight"?Number(profile.targetWeight)||0:0,target=targetRaw?Number(convert(targetRaw)):0,range=target?[...vals,target]:vals,min=Math.min(...range),max=Math.max(...range),span=Math.max(.001,max-min),w=280,h=94,pad=10,bot=h-24,ph=h-40,y=v=>bot-((v-min)/span)*ph,pts=vals.map((v,i)=>`${pad+(rows.length===1?0:(i/(rows.length-1))*(w-pad*2))},${y(v)}`).join(" "),lastDate=new Date(rows.at(-1).date||Date.now()).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"2-digit"}),targetLine=target?`<line x1="${pad}" y1="${y(target)}" x2="${w-pad}" y2="${y(target)}" class="target-weight-line"/><text x="${w-pad}" y="${Math.max(10,y(target)-3)}" text-anchor="end" class="target-weight-label">Ziel ${target} ${unit}</text>`:"",graphic=rows.length===1?`<circle cx="${pad}" cy="${y(vals[0])}" r="3.5" fill="currentColor"/>`:`<polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;return`<div class="profile-chart card always-chart"><div class="space"><strong>${label}</strong><span class="small">${vals.at(-1)} ${unit}</span></div><svg viewBox="0 0 ${w} ${h}" role="img">${targetLine}${graphic}</svg><div class="chart-range chart-dates"><span>Zu Beginn<br><b>${vals[0]} ${unit}</b></span><span>${lastDate}<br><b>${vals.at(-1)} ${unit}</b></span></div></div>`}
 renderMeasurementCharts=function(){const el=$("measurementCharts");if(!el)return;const p=rethinkPrefsV31,cards=[chartV31("Gewicht","weight",p.weightLabel().toLowerCase(),p.weightDisplay)];if(measurements.some(m=>Number(m.bodyfat)>0))cards.push(chartV31("Körperfett","bodyfat","%",x=>Math.round(Number(x)*10)/10));if(measurements.some(m=>Number(m.waist)>0))cards.push(chartV31("Taille","waist",p.lengthLabel().toLowerCase(),p.lengthDisplay));el.innerHTML=`<div class="measurement-chart-stack">${cards.join("")}</div>`}
})();

/* Rethink_v3.1 — restart/standby semantics, stable active highlight, coaching recommendations */
(function(){
 const UI_KEY_V31=UI_KEY;

 function resetTransientUiForTrueRestartV31(){
   // Persistent preferences (units, theme, week start, text size, plans, history, nutrition...) are NOT touched.
   tabScroll={exercises:0,plans:0,training:0,week:0,profile:0};
   Object.keys(tabUiState||{}).forEach(k=>{
     tabUiState[k]={scroll:0,horizontal:[],details:[],inputs:{},logical:null}
   });
   exType="Alle";exMuscles=new Set();plansQuickEdit=false;
   weekOffset=0;localStorage.setItem(WEEK_VIEW_OFFSET_KEY,"0");
   profileDayOffset=0;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,"0");
   pageStack=[];sheetStack=[];currentSheetState=null;exerciseDetailReturn=null;
   localStorage.removeItem(UI_KEY_V31);
   currentTab="training"
 }

 // A true app/process start gets a fresh per-document boot token.
 // Standby/background does not recreate the document, so it keeps the current UI state untouched.

 // Startup/standby authority lives in app-core restoreUI()/visibility handlers.
 function lastMatchingExerciseV31(e){
   for(let hi=history.length-1;hi>=0;hi--){
     const candidates=(history[hi].exercises||[]).filter(x=>
       String(x.name||"")===String(e.name||"") &&
       String(x.setTechnique||"standard")===String(e.setTechnique||"standard") &&
       String(x.measureMode||"reps")===String(e.measureMode||"reps")
     );
     for(let ci=candidates.length-1;ci>=0;ci--){
       const x=candidates[ci],sets=(x.liveSets||[]).filter(s=>s.completed||s.segments?.some(g=>g.completed));
       if(sets.length)return{x,sets}
     }
   }
   return null
 }
 function avgV31(arr){const v=arr.map(Number).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null}
 function groupPositionV26(collection,e){
   if(!groupMethod(e?.setTechnique)||!e?.techniqueGroup)return-1;
   return collection.filter(x=>x.techniqueGroup===e.techniqueGroup&&x.setTechnique===e.setTechnique).indexOf(e)
 }
 function lastMatchingExerciseV26(e){
   const currentPos=groupPositionV26(activeWorkout?.exercises||[],e);let fallback=null;
   for(let hi=history.length-1;hi>=0;hi--){
     const all=history[hi].exercises||[];
     const base=all.filter(x=>
       String(x.name||'')===String(e.name||'')&&
       String(x.setTechnique||'standard')===String(e.setTechnique||'standard')&&
       String(x.measureMode||'reps')===String(e.measureMode||'reps')&&
       (currentPos<0||groupPositionV26(all,x)===currentPos)
     );
     const exact=base.filter(x=>String(x.variant||'')===String(e.variant||'')&&String(x.equipmentChoice||'')===String(e.equipmentChoice||''));
     for(const list of [exact,base]){
       for(let ci=list.length-1;ci>=0;ci--){
         const x=list[ci],sets=(x.liveSets||[]).filter(s=>s.completed||s.segments?.some(g=>g.completed));
         if(sets.length){const hit={x,sets,workout:history[hi]};if(list===exact)return hit;if(!fallback)fallback=hit;break}
       }
     }
   }
   return fallback
 }
 function ratingNumberV26(r){return({blue:0,green:1,yellow:2,red:3})[r]}
 function setRatingV26(s){
   if(s?.rating)return s.rating;
   const rs=(s?.segments||[]).map(g=>g.rating).filter(Boolean);
   if(!rs.length)return null;
   const a=avgV31(rs.map(ratingNumberV26));
   return a<.55?'blue':a<1.5?'green':a<2.45?'yellow':'red'
 }
 function weightedRatingV26(sets){
   let sum=0,w=0;
   sets.forEach((s,i)=>{const n=ratingNumberV26(setRatingV26(s));if(!Number.isFinite(n))return;const k=1+i*.18;sum+=n*k;w+=k});
   if(!w)return'green';
   const a=sum/w;
   return a<.55?'blue':a<1.45?'green':a<2.35?'yellow':'red'
 }
 function repRangeV26(e){
   const m=String(e?.reps||'').match(/(\d+)\s*-\s*(\d+)/);
   if(m)return{lo:Number(m[1]),hi:Number(m[2])};
   const n=Number(String(e?.reps||'').match(/\d+/)?.[0]);
   return Number.isFinite(n)&&n>0?{lo:n,hi:n}:null
 }
 function zoneV26(rep,range){
   if(!range||!Number.isFinite(rep))return null;
   if(rep<range.lo)return'below';
   if(rep>range.hi)return'over';
   if(range.lo===range.hi)return'upper';
   const mid=(range.lo+range.hi)/2;
   return rep<=mid?'lower':'upper'
 }
 function zoneRankV26(z){return({below:0,lower:1,upper:2,over:3})[z]}
 function overallZoneV26(reps,range){
   const zs=reps.map(r=>zoneV26(r,range)).filter(Boolean);
   if(!zs.length)return null;
   // Every set counts; later sets are slightly more important because they reveal sustainable load.
   let sum=0,w=0;zs.forEach((z,i)=>{const k=1+i*.12;sum+=zoneRankV26(z)*k;w+=k});
   const a=sum/w;
   if(a<.65)return'below'; if(a<1.55)return'lower'; if(a<2.55)return'upper'; return'over'
 }
 function simpleSetRepsV26(s){return Number(s?.reps)||0}
 function simpleSetWeightV26(s){const n=Number(String(s?.weight??'').replace(',','.'));return Number.isFinite(n)&&n>0?n:null}
 function fatigueDropV26(sets,range){
   if(!range||sets.length<3)return false;
   const weights=sets.map(simpleSetWeightV26),valid=weights.filter(Number.isFinite);
   if(valid.length<3||Math.max(...valid)-Math.min(...valid)>.01)return false;
   const reps=sets.map(simpleSetRepsV26),firstGood=reps.slice(0,Math.ceil(reps.length/2)).some(r=>r>=range.lo);
   const late=reps.slice(Math.floor(reps.length/2));
   return firstGood&&late.filter(r=>r>0&&r<range.lo).length>=Math.min(2,late.length)
 }
 function variableWeightPhraseV26(sets,action){
   if(action!=='Gewicht beibehalten')return action;
   const ws=sets.map(simpleSetWeightV26).filter(Number.isFinite);
   if(ws.length<2||Math.max(...ws)-Math.min(...ws)<.01)return action;
   let changes=0;for(let i=1;i<ws.length;i++)if(Math.abs(ws[i]-ws[i-1])>.01)changes++;
   const last=ws[ws.length-1],min=Math.min(...ws);
   if(changes>=2)return last===min?'Leichtestes Gewicht beibehalten':'Gewicht des letzten Sätzes beibehalten';
   if(ws[0]>last)return'Gewicht des letzten Sätzes beibehalten';
   return action
 }
 function standardTipV26(e,sets){
   const range=repRangeV26(e),reps=sets.map(simpleSetRepsV26).filter(v=>v>0);
   if(!range||!reps.length)return'Gewicht beibehalten · Wiederholung beibehalten';
   const zone=overallZoneV26(reps,range),rating=weightedRatingV26(sets),fatigue=fatigueDropV26(sets,range);
   let weight='Gewicht beibehalten',rep='Wiederholung beibehalten';
   if(fatigue){weight='Gewicht reduzieren';rep='Wiederholung steigern'}
   else if(zone==='below'){
     rep='Wiederholung steigern';weight=(rating==='yellow'||rating==='red')?'Gewicht reduzieren':'Gewicht beibehalten'
   }else if(zone==='lower'){
     rep=rating==='red'?'Wiederholung beibehalten':'Wiederholung steigern';weight=rating==='red'?'Gewicht reduzieren':'Gewicht beibehalten'
   }else if(zone==='upper'){
     rep='Wiederholung beibehalten';weight=(rating==='blue'||rating==='green')?'Gewicht erhöhen':rating==='red'?'Gewicht reduzieren':'Gewicht beibehalten'
   }else if(zone==='over'){
     // Above target: reps must come back down. Blue/green/yellow justify a higher load;
     // red signals that form/effort was already too demanding, so keep the load.
     weight=rating==='red'?'Gewicht beibehalten':'Gewicht erhöhen';
     rep='Wiederholung verringern'
   }
   weight=variableWeightPhraseV26(sets,weight);
   return`${weight} · ${rep}`
 }
 function pyramidTipV26(current,sets,previousExercise=null){
   // Judge the previous performance against the CURRENT pyramid prescription. Old plans may have used a different cascade.
   const targets=(current?.methodData?.reps||[]).map(Number).filter(n=>Number.isFinite(n)&&n>0),rating=weightedRatingV26(sets);
   if(!targets.length)return'Gewicht beibehalten · Wiederholung beibehalten';
   let valid=0,below=0,above=0,farAbove=0,farBelow=0,ratioSum=0,ratioWeight=0;
   sets.forEach((s,i)=>{
     const r=simpleSetRepsV26(s),t=targets[Math.min(i,targets.length-1)];
     if(!r||!t)return;
     const w=1+i*.12,ratio=r/t;valid++;ratioSum+=ratio*w;ratioWeight+=w;
     if(r<t){below++;if(r<=t*.8)farBelow++}
     else if(r>t){above++;if(r>=t*1.2)farAbove++}
   });
   if(!valid)return'Gewicht beibehalten · Wiederholung beibehalten';
   const avgRatio=ratioWeight?ratioSum/ratioWeight:1;
   // Objective prescription dominates: a clear overshoot means the pyramid is underloaded, even when later sets felt hard.
   if(avgRatio>=1.15||farAbove>=Math.ceil(valid/2)||above===valid)return'Gewicht erhöhen · Wiederholung beibehalten';
   if(avgRatio<=.85||farBelow>=Math.ceil(valid/2)||below===valid)return'Gewicht reduzieren · Wiederholung beibehalten';
   if(above>=Math.ceil(valid/2)&&(rating==='blue'||rating==='green'))return'Gewicht erhöhen · Wiederholung beibehalten';
   if(below>=Math.ceil(valid/2)&&(rating==='yellow'||rating==='red'))return'Gewicht reduzieren · Wiederholung beibehalten';
   return'Gewicht beibehalten · Wiederholung beibehalten'
 }
 function backoffTipV26(e,sets){
   const targets=sets.map((_,i)=>i===0?Number(e.methodData?.topReps||5):Number(e.methodData?.backoffReps||8));
   const misses=sets.filter((s,i)=>simpleSetRepsV26(s)<targets[i]).length,rating=weightedRatingV26(sets);
   let weight='Gewicht beibehalten';
   if(rating==='red'||misses>=2)weight='Gewicht reduzieren';
   else if((rating==='blue'||rating==='green')&&misses===0)weight='Gewicht erhöhen';
   return`${weight} · Wiederholung beibehalten`
 }
 function segmentTotalRepsV26(s){return(s?.segments||[]).reduce((a,g)=>a+(Number(g.reps)||0),0)}
 function dropTipV26(e,sets){
   // First judge each complete top+drop chain; then combine those set judgements.
   const range=repRangeV26(e),rating=weightedRatingV26(sets);
   const topProxy=sets.map(s=>({reps:Number(s.segments?.[0]?.reps)||0,weight:s.segments?.[0]?.weight,rating:setRatingV26(s)}));
   if(!range||!topProxy.some(s=>s.reps))return'Gewicht beibehalten · Wiederholung beibehalten';
   const base=standardTipV26(e,topProxy);
   let [weight,rep]=base.split(' · ');
   if(weight==='Gewicht beibehalten')weight=variableWeightPhraseV26(topProxy,weight);
   // Bad average execution across complete drop chains may lower the top reference, never raise it.
   if(rating==='red')weight='Gewicht reduzieren';
   return`${weight} · ${rep||'Wiederholung beibehalten'}`
 }
 function clusterTipV26(e,sets){
   const target=(Math.max(2,Number(e.methodData?.blocks)||4)*Math.max(1,Number(e.methodData?.clusterReps)||2)),rating=weightedRatingV26(sets);
   const totals=sets.map(segmentTotalRepsV26),met=totals.length&&totals.every(x=>x>=target);
   let weight;
   if(!met)weight=(rating==='yellow'||rating==='red')?'Gewicht reduzieren':'Gewicht beibehalten';
   else weight=rating==='red'?'Gewicht reduzieren':rating==='yellow'?'Gewicht beibehalten':'Gewicht erhöhen';
   return`${weight} · Wiederholung beibehalten`
 }
 function restPauseTipV26(e,sets){
   const target=Number(String(e.reps||'').match(/\d+/)?.[0])||20,rating=weightedRatingV26(sets);
   const totals=sets.map(segmentTotalRepsV26),met=totals.length&&totals.every(x=>x>=target);
   if(!met)return`${(rating==='yellow'||rating==='red')?'Gewicht reduzieren':'Gewicht beibehalten'} · Wiederholung steigern`;
   const weight=rating==='red'?'Gewicht reduzieren':rating==='yellow'?'Gewicht beibehalten':'Gewicht erhöhen';
   return`${weight} · Wiederholung beibehalten`
 }
 function averageTimeRatingV72(sets){return weightedRatingV26(sets)}
 function achievedTimeV72(s,target){
   const n=Number(s?.achievedTime);
   if(Number.isFinite(n)&&n>=0)return n;
   if(s?.completed)return Math.max(0,Number(s?.time)||Number(target)||0);
   return 0
 }
 function timeTipV72(e,prev){
   const target=Math.max(1,Number(prev?.x?.timeSeconds)||Number(e?.timeSeconds)||60),sets=prev?.sets||[];
   if(!sets.length)return'';
   const achieved=sets.map(s=>achievedTimeV72(s,target)).filter(n=>Number.isFinite(n)&&n>=0);
   const inTarget=achieved.length>0&&achieved.every(n=>n>=target),rating=averageTimeRatingV72(sets);
   if(inTarget&&(rating==='green'||rating==='blue'))return'Zeit erhöhen';
   return'Versuche dich zu steigern'
 }
 function recommendationTextV31(e){
   const prev=lastMatchingExerciseV26(e);
   // Recommendations are also useful during the current workout once at least one set was rated.
   // If a previous matching workout exists it remains the preferred reference; otherwise use
   // the already rated sets of this workout so the box appears immediately after rating.
   const currentSets=(e?.liveSets||[]).filter(s=>s?.completed&&(s?.rating||(s?.segments||[]).some(g=>g?.rating)));
   const source=prev||((currentSets.length)?{x:e,sets:currentSets,current:true}:null);
   if(!source)return'';
   if(/AMRAP/i.test(String(e.reps||'')))return'Versuche dich zu steigern';
   if(e.measureMode==='time')return timeTipV72(e,source);
   const sets=source.sets;
   switch(e.setTechnique||'standard'){
     case'pyramid':return pyramidTipV26(e,sets,source.x);
     case'backoff':return backoffTipV26(source.x,sets);
     case'dropset':return dropTipV26(source.x,sets);
     case'cluster':return clusterTipV26(source.x,sets);
     case'restpause':return restPauseTipV26(source.x,sets);
     default:return standardTipV26(source.x,sets)
   }
 }
 function recommendationHtmlV31(e){
   const text=recommendationTextV31(e);if(!text)return'';
   return`<div class="live-recommendation"><strong>Empfehlung</strong><span class="training-tip-text">${esc(text)}</span></div>`
 }
 function recommendationGroupHtmlV26(indexes){
   const members=indexes.map(i=>activeWorkout?.exercises?.[i]).filter(Boolean);
   const rows=members.map((e,gi)=>({letter:String.fromCharCode(65+gi),text:recommendationTextV31(e)})).filter(x=>x.text);
   if(!rows.length)return'';
   return`<div class="live-recommendation group-training-tip"><strong>Empfehlung</strong>${rows.map(x=>`<div class="training-tip-row"><strong>${x.letter}:</strong><span>${esc(x.text)}</span></div>`).join('')}</div>`
 }
 window.rethinkRecommendationText=recommendationTextV31;
 window.rethinkRecommendationHtml=recommendationHtmlV31;
 window.rethinkRecommendationGroupHtml=recommendationGroupHtmlV26;

 // Keep previous values as grey placeholders, restoring them every time a workout/exercise is created or edited.
 function ensureSuggestionsV31(){
   if(!activeWorkout)return;
   applyPreviousWorkoutSuggestions(activeWorkout);
 }

 // Compact time keypad: explicit colon, unchanged workout field size, no native full text keyboard.
 let timeKeypadTargetV31=null;
 function ensureTimeKeypadV31(){
   let k=document.getElementById('rethinkTimeKeypadV31');
   if(k)return k;
   k=document.createElement('div');k.id='rethinkTimeKeypadV31';k.className='time-keypad-v31 hidden';
   k.innerHTML='<div class="time-keypad-grid">'+['1','2','3','4','5','6','7','8','9',':','0','⌫'].map(x=>`<button type="button" data-time-key="${x}">${x}</button>`).join('')+'</div><button type="button" class="time-keypad-done" data-time-key="done">Fertig</button>';
   document.body.appendChild(k);k.addEventListener('pointerdown',e=>e.preventDefault());
   k.addEventListener('click',e=>{const b=e.target.closest('[data-time-key]');if(!b||!timeKeypadTargetV31)return;const key=b.dataset.timeKey;
     if(key==='done'){timeKeypadTargetV31.blur();k.classList.add('hidden');timeKeypadTargetV31=null;return}
     let v=String(timeKeypadTargetV31.value||'');if(key==='⌫')v=v.slice(0,-1);else if(key===':'){if(!v.includes(':'))v+=(v?'':'0')+':'}else v+=key;
     v=v.replace(/[^0-9:]/g,'').replace(/(:.*):/g,'$1');timeKeypadTargetV31.value=v;timeKeypadTargetV31.dispatchEvent(new Event('input',{bubbles:true}));
   });return k
 }
 function openTimeKeypadV31(inp){timeKeypadTargetV31=inp;ensureTimeKeypadV31().classList.remove('hidden');window.rethinkKeepFieldVisibleV24?.(inp)}
 function interceptTimeFieldV43(e){
   const play=e.target?.closest?.('#liveBody [data-time-play]');
   if(play)return false;
   const direct=e.target?.closest?.('#liveBody [data-time-field]');
   const shell=e.target?.closest?.('#liveBody .time-input-shell');
   const timeField=direct||shell?.querySelector?.('[data-time-field]');
   if(!timeField)return false;
   e.preventDefault();e.stopPropagation();
   openTimeKeypadV31(timeField);
   window.rethinkKeepFieldVisibleV24?.(timeField);
   return true
 }
 document.addEventListener('pointerdown',e=>{
   if(interceptTimeFieldV43(e))return;
   const k=document.getElementById('rethinkTimeKeypadV31');
   if(!k||k.classList.contains('hidden'))return;
   if(e.target.closest('#rethinkTimeKeypadV31'))return;
   k.classList.add('hidden');timeKeypadTargetV31=null
 },true);
 document.addEventListener('touchstart',e=>{interceptTimeFieldV43(e)},true);
 document.addEventListener('click',e=>{interceptTimeFieldV43(e)},true);

 // Do NOT let tapping or typing into KG/WDH/time fields change the highlighted training card.
 function rebindInputsWithoutHighlightV31(){
   document.querySelectorAll("#liveBody [data-input]").forEach(x=>{
     const isTime=x.matches("[data-time-field]");
     if(isTime){x.setAttribute("inputmode","none");x.setAttribute("readonly","readonly");x.classList.add("time-keypad-input")}
     x.oninput=()=>{touchInput(x);updateInput(x)};
     x.onchange=()=>updateInput(x);
     x.onblur=()=>{updateInput(x);setTimeout(()=>{const a=document.activeElement;if(!a||!a.matches("[data-input]"))renderLive()},0)};
     x.onfocus=()=>{
       if(isTime){openTimeKeypadV31(x);return}
       try{x.select?.()}catch{}
       window.rethinkKeepFieldVisibleV24?.(x)
     };
     x.onpointerdown=ev=>ev.stopPropagation();
     x.onclick=ev=>{ev.stopPropagation();if(isTime){openTimeKeypadV31(x);return}try{x.select?.()}catch{};window.revealLiveWorkoutFieldV31?.(x)}
   })
 }

 function injectRecommendationsV31(){
   if(!activeWorkout)return;
   document.querySelectorAll("#liveBody .live-exercise-card[data-live-card]").forEach(card=>{
     if(card.querySelector(".live-recommendation"))return;
     const idx=Number(card.dataset.liveCard),e=activeWorkout.exercises[idx];if(!e)return;
     const members=String(card.dataset.liveMembers||"").split(",").map(Number).filter(Number.isFinite);
     const html=members.length>1?recommendationGroupHtmlV26(members):recommendationHtmlV31(e);
     // Method help stays directly below the method label. Trainingstipp belongs below the exercise header(s), before work sets.
     const anchor=members.length>1
       ? (card.querySelector(".combined-series-head")||card.querySelector(".method-help"))
       : (card.querySelector(".note-line")||card.querySelector(".live-card-head")||card.querySelector(".method-help"));
     if(anchor&&html)anchor.insertAdjacentHTML("afterend",html)
   })
 }

 // Final active-card rule: only rating state determines completion/advance.
 function fullyRatedSetV31(s){
   if(!s?.completed)return false;
   if(Array.isArray(s.segments)&&s.segments.length){
     return !!s.rating || s.segments.filter(g=>g.completed).every(g=>!!g.rating)
   }
   return !!s.rating
 }
 function exerciseRatedV31(e){return !!e&&(e.liveSets||[]).length>0&&(e.liveSets||[]).every(fullyRatedSetV31)}
 function visualUnitForIndexV31(index){
   const groups=liveVisualGroups(activeWorkout?.exercises||[]);
   return groups.find(g=>g.members.some(x=>x.i===index))||null
 }
 function unitFullyRatedV31(unit){
   return !!unit&&unit.members.every(x=>exerciseRatedV31(x.e))
 }
 function firstIncompleteUnitIndexV31(){
   for(const g of liveVisualGroups(activeWorkout?.exercises||[])){
     if(!unitFullyRatedV31(g))return g.members[0].i
   }
   return Math.max(0,(activeWorkout?.exercises?.length||1)-1)
 }
 function stabilizeActiveByRatingsV31(){
   if(!activeWorkout?.exercises?.length)return;
   const unit=visualUnitForIndexV31(Number(activeWorkout.activeExerciseIndex)||0);
   if(!unit||unitFullyRatedV31(unit))activeWorkout.activeExerciseIndex=firstIncompleteUnitIndexV31()
 }

 __rt.live.pre.push(function(...__args){
ensureSuggestionsV31();
   stabilizeActiveByRatingsV31();
});
__rt.live.post.push(function(__result,...__args){
const result=__result;
// Earlier render wrappers may have used `completed`; force final classes from ratings only.
   document.querySelectorAll("#liveBody .live-exercise-card[data-live-card]").forEach(card=>{
     const idx=Number(card.dataset.liveCard),unit=visualUnitForIndexV31(idx),complete=unitFullyRatedV31(unit);
     const active=!complete&&unit?.members.some(x=>x.i===Number(activeWorkout.activeExerciseIndex||0));
     card.classList.toggle("live-card-complete",complete);
     card.classList.toggle("live-method-complete",complete);
     card.classList.toggle("active-live-exercise",!!active);
     const badge=card.querySelector(".live-complete-badge");
     if(complete&&!badge){
       const top=card.querySelector(".live-card-topline");
       if(top)top.insertAdjacentHTML("beforeend",'<div class="live-complete-badge"><span class="tick">✓</span>Abgeschlossen</div>')
     }else if(!complete&&badge)badge.remove()
   });
   injectRecommendationsV31();
   rebindInputsWithoutHighlightV31();
   return result
});

 // Advance only after a rating was actually committed.
 function advanceAfterRatingV31(){
   if(!activeWorkout)return;
   activeWorkout.activeExerciseIndex=firstIncompleteUnitIndexV31();
   saveAll();renderLive()
 }
 // Core applySetRating/applySegmentRating are authoritative. They advance A→B→C / next exercise
 // immediately after the committed rating and start the configured rest timer. Do not wrap them here.
 window.__restartHighlightTestV31={
   recommendationText:recommendationTextV31,
   exerciseRated:exerciseRatedV31,
   unitFullyRated:unitFullyRatedV31,
   firstIncomplete:firstIncompleteUnitIndexV31,
   resetTransient:resetTransientUiForTrueRestartV31
 };
})();


/* Rethink_v3.1 — zero-mutation field focus */
(function(){
 function setContextV31(inp){
   const p=inp?.dataset?.input?.split("|");if(!p||p.length<3)return null;
   const e=activeWorkout?.exercises?.[Number(p[0])],s=e?.liveSets?.[Number(p[1])];
   return e&&s?{e,s,p}:null
 }
 function cloneV31(x){return JSON.parse(JSON.stringify(x||{}))}
 function restoreV31(target,snap){
   Object.keys(target).forEach(k=>delete target[k]);
   Object.assign(target,cloneV31(snap))
 }
 function beginV31(inp){
   const c=setContextV31(inp);if(!c)return;
   inp.dataset.rethinkStartValue=String(inp.value??"");
   inp.dataset.rethinkChanged="0";
   inp._rethinkSnapshot=cloneV31(c.s)
 }
 function changedV31(inp){
   return inp?.dataset?.rethinkChanged==="1" &&
     String(inp.value??"")!==String(inp.dataset.rethinkStartValue??"")
 }
 function endV31(inp){
   const c=setContextV31(inp);if(!c)return false;
   const changed=changedV31(inp);
   if(!changed){
     restoreV31(c.s,inp._rethinkSnapshot);
     inp.value=String(inp.dataset.rethinkStartValue??"");
     saveAll()
   }
   delete inp._rethinkSnapshot;
   return changed
 }
 function bindStrictInputsV31(){
   document.querySelectorAll("#liveBody [data-input]").forEach(inp=>{
     const isTime=inp.matches("[data-time-field]");
     if(isTime){inp.setAttribute("inputmode","none");inp.setAttribute("readonly","readonly");inp.classList.add("time-keypad-input")}
     inp.onfocus=()=>{
       beginV31(inp);
       // Editing a field must not pin/switch the whole card. Advancement happens only after rating.
       if(isTime){openTimeKeypadV31(inp);return}
       try{inp.select?.()}catch{}
       window.rethinkKeepFieldVisibleV24?.(inp)
     };
     inp.onpointerdown=ev=>ev.stopPropagation();
     inp.onclick=ev=>{
       ev.stopPropagation();
       if(isTime){openTimeKeypadV31(inp);return}
       try{inp.select?.()}catch{};
       window.rethinkKeepFieldVisibleV24?.(inp)
     };
     inp.oninput=()=>{inp.dataset.rethinkChanged="1";updateInput(inp)};
     inp.onchange=()=>{if(changedV31(inp))updateInput(inp)};
     inp.onblur=()=>{
       const wasChanged=changedV31(inp);
       if(wasChanged)updateInput(inp);
       endV31(inp);
       if(isTime){/* v43: keypad remains open until Done or explicit outside tap */}
       // Do not re-render merely because focus moved between WDH/KG/time fields.
       if(wasChanged)saveAll()
     }
   })
 }
 window.bindStrictInputsV31=bindStrictInputsV31;

 __rt.live.post.push(function(__result,...__args){
const r=__result;
bindStrictInputsV31();
   return r
});

 window.__finalTextInputV31={bind:bindStrictInputsV31};
})();


/* Rethink_v3.1 — Metric/Imperial system, language, safe inputs, distance tracking */
(function(){
 const PREF_KEY="rethink_preferences_v31";
 const p0={weightUnit:"kg",distanceUnit:"km",measurementUnit:"cm",weekStart:"monday",unitSystem:"metric",language:"de"};
 let sysPrefs={...p0,...read(PREF_KEY,{})};
 // Backward-compatible inference from old individual selectors.
 if(!sysPrefs.unitSystem)sysPrefs.unitSystem=(sysPrefs.weightUnit==="lb"||sysPrefs.distanceUnit==="mi"||sysPrefs.measurementUnit==="in")?"imperial":"metric";
 if(!["de","en"].includes(sysPrefs.language))sysPrefs.language="de";

 function applySystemDerivedV31(){
   const imperial=sysPrefs.unitSystem==="imperial";
   sysPrefs.weightUnit=imperial?"lb":"kg";
   sysPrefs.distanceUnit=imperial?"mi":"km";
   sysPrefs.measurementUnit=imperial?"in":"cm";
   write(PREF_KEY,sysPrefs)
 }
 applySystemDerivedV31();

 const num=x=>{const n=Number(String(x??"").trim().replace(",","."));return Number.isFinite(n)?n:null};
 const round=(x,d=1)=>{const p=10**d;return Math.round(x*p)/p};

 function weightUnit(){return sysPrefs.unitSystem==="imperial"?"LB":"KG"}
 function distanceUnit(){return sysPrefs.unitSystem==="imperial"?"MI":"KM"}
 function lengthUnit(){return sysPrefs.unitSystem==="imperial"?"IN":"CM"}
 function volumeUnit(){return sysPrefs.unitSystem==="imperial"?"OZ":"ML"}
 function weightDisplay(kg){const x=num(kg);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x*2.2046226218:x,1)}
 function weightStore(v){const x=num(v);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x/2.2046226218:x,3)}
 function distanceDisplay(km){const x=num(km);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x*0.6213711922:x,2)}
 function distanceStore(v){const x=num(v);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x/0.6213711922:x,3)}
 function lengthDisplay(cm){const x=num(cm);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x/2.54:x,1)}
 function lengthStore(v){const x=num(v);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x*2.54:x,2)}
 function volumeDisplay(ml){const x=num(ml);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x/29.5735295625:x,sysPrefs.unitSystem==="imperial"?1:0)}
 function volumeStore(v){const x=num(v);return x==null?"":round(sysPrefs.unitSystem==="imperial"?x*29.5735295625:x,1)}
 function foodMassDisplay(g){
   const x=num(g);if(x==null)return{value:"",unit:sysPrefs.unitSystem==="imperial"?"oz":"g"};
   if(sysPrefs.unitSystem!=="imperial")return{value:round(x,0),unit:"g"};
   const oz=x/28.349523125;
   return oz>=16?{value:round(oz/16,2),unit:"lb"}:{value:round(oz,1),unit:"oz"}
 }
 function foodMassStore(v,unit){
   const x=num(v);if(x==null)return"";
   if(unit==="lb")return round(x*453.59237,1);
   if(unit==="oz")return round(x*28.349523125,1);
   return round(x,1)
 }
 function feetInches(cm){
   const inches=Number(cm)/2.54,ft=Math.floor(inches/12),inch=Math.round((inches-ft*12)*10)/10;
   return `${ft}′ ${inch}″`
 }

 // Safe empty-input semantics. Empty/untouched fields remain empty and NEVER become 0.
 const updateBeforeSafeV31=updateInput;
 updateInput=function(inp){
   if(!inp?.dataset?.input)return updateBeforeSafeV31(inp);
   const parts=inp.dataset.input.split("|"),k=parts[2],raw=String(inp.value??"");
   if(raw.trim()===""){
     const e=activeWorkout?.exercises?.[Number(parts[0])],s=e?.liveSets?.[Number(parts[1])],gi=Number(parts[3]);
     if(!s)return;
     if(k==="weight"||k==="reps"||k==="level"||k==="distance")s[k]="";
     else if(k==="time"){/* empty time field does not overwrite configured timer */}
     else if(k==="sw"||k==="gw")if(s.segments?.[gi])s.segments[gi].weight="";
     else if(k==="sr"||k==="gr")if(s.segments?.[gi])s.segments[gi].reps="";
     saveAll();return
   }
   return updateBeforeSafeV31(inp)
 };

 // Prevent focus itself from mutating data or accepting grey placeholders.
 document.addEventListener("focusin",e=>{
   const x=e.target;if(!x?.matches?.("#livePage [data-input]"))return;
   x.dataset.valueOnFocus=x.value??"";
 },true);
 document.addEventListener("blur",e=>{
   const x=e.target;if(!x?.matches?.("#livePage [data-input]"))return;
   if((x.dataset.valueOnFocus??"")===""&&String(x.value??"")===""){
     // Explicitly preserve empty canonical data.
     const [ei,si,k,gi]=x.dataset.input.split("|"),s=activeWorkout?.exercises?.[Number(ei)]?.liveSets?.[Number(si)];
     if(s){
       if(["weight","reps","level","distance"].includes(k))s[k]="";
       else if(["sw","gw"].includes(k)&&s.segments?.[Number(gi)])s.segments[Number(gi)].weight="";
       else if(["sr","gr"].includes(k)&&s.segments?.[Number(gi)])s.segments[Number(gi)].reps="";
       saveAll()
     }
   }
 },true);

 // Distance is useful for timed/cardio work only.
 function supportsDistanceV31(e){
   const cat=String(e?.category||"").toLowerCase(),tracking=String(findExercise?.(e?.name)?.tracking||e?.tracking||"").toLowerCase();
   return cat.includes("cardio")||e?.measureMode==="time"||tracking.includes("time")
 }
 function addDistanceFieldsV31(){
   if(!activeWorkout)return;
   document.querySelectorAll("#liveBody [data-time-play]").forEach(play=>{
     const [ei,si]=play.dataset.timePlay.split("|").map(Number),e=activeWorkout.exercises[ei],s=e?.liveSets?.[si];
     if(!e||!s||!supportsDistanceV31(e))return;
     const controls=play.closest(".time-controls,.combined-time-controls,.time-row")||play.parentElement;
     if(!controls||controls.querySelector(`[data-input="${ei}|${si}|distance"]`))return;
     const inp=document.createElement("input");
     inp.type="text";inp.inputMode="decimal";inp.className="distance-live-field";
     inp.dataset.input=`${ei}|${si}|distance`;
     inp.placeholder=distanceUnit();
     inp.value=String(s.distance??"").trim()===""?"":String(distanceDisplay(s.distance));
     controls.insertBefore(inp,controls.querySelector(".set-check")||null);
     inp.onfocus=()=>{inp.select();window.revealLiveWorkoutFieldV31?.(inp)};
     inp.oninput=()=>{const shown=inp.value;s.distance=shown.trim()===""?"":distanceStore(shown);saveAll()};
     inp.onblur=()=>{if(inp.value.trim()==="")s.distance="";saveAll()}
   })
 }
 __rt.live.post.push(function(__result,...__args){
const r=__result;
applyTranslationsV31();return r
});

 // Profile height in imperial is shown as feet + inches; circumferences stay inches.
 __rt.profile.post.push(function(__result,...__args){
const r=__result;
if(sysPrefs.unitSystem==="imperial"&&$("profileSummary")&&profile.height){
     const latest=measurements.slice().reverse().find(m=>Number(m.weight)>0),w=Number(latest?.weight||profile.weight||0);
     $("profileSummary").textContent=[profile.age?profile.age+" J.":"",profile.height?feetInches(profile.height):"",w?`${weightDisplay(w)} lb`:""].filter(Boolean).join(" · ")||"Noch nicht eingerichtet"
   }
   patchHydrationUnitsV31();patchFoodMassUnitsV31();applyTranslationsV31();return r
});

 // Hydration display/input: ml <-> fl oz.
 function patchHydrationUnitsV31(){
   const imperial=sysPrefs.unitSystem==="imperial";
   const current=todayHydrationEntries().reduce((sum,x)=>sum+(Number(x.size)||0)*(Number(x.hydration)||0)/100,0)+todayFoodEntries().reduce((sum,x)=>sum+Number(x.water||0),0);
   const goal=hasGoalBasis()?hydrateGoal():Number(nutrition.waterGoal)||0;
   if($("waterView"))$("waterView").textContent=`${volumeDisplay(current)} ${imperial?"oz":"ml"}`;
   if($("waterGoalView"))$("waterGoalView").textContent=goal?`${volumeDisplay(goal)} ${imperial?"oz":"ml"}`:"–";
   document.querySelectorAll("#todayDrinkList .compact-log-value").forEach(()=>{}); // retained for future card variants
 }
 function patchFoodMassUnitsV31(){
   document.querySelectorAll("[data-food-log-id]").forEach(row=>{});
 }

 // Quick-drink editor is implemented once in app-core.js.
 if($("addWaterBtn"))$("addWaterBtn").onclick=openQuickDrinkEntry;

 // Food quantity display: metric g; imperial oz, and >=16 oz automatically lb.
 function patchFoodSheetUnitsV31(){
   const body=$("sheetBody");if(!body)return;
   body.querySelectorAll(".food-serving").forEach(el=>{
     const m=el.textContent.match(/≈\s*([\d.,]+)\s*g/i);if(!m)return;
     const d=foodMassDisplay(Number(m[1].replace(",",".")));el.textContent=el.textContent.replace(/≈\s*[\d.,]+\s*g/i,`≈ ${d.value} ${d.unit}`)
   })
 }
 const openFoodBeforeSystemV31=openFoodSearch;
 openFoodSearch=function(...args){const r=openFoodBeforeSystemV31(...args);requestAnimationFrame(()=>{patchFoodSheetUnitsV31();applyTranslationsV31()});return r};

 // ---------- Language ----------
 const DE_EN={
  "Übungen":"Exercises","Trainingspläne":"Plans","Training":"Training","Woche":"Week","Profil":"Profile",
  "Einstellungen":"Settings","Darstellung":"Appearance","Hell / Dunkel":"Light / Dark","System":"System",
  "Einheiten & Ansicht":"Units & View","Einheitensystem":"Unit system","Metrisch":"Metric","Imperial":"Imperial",
  "Wochenstart":"Week starts","Montag":"Monday","Sonntag":"Sunday","Standard":"Standard",
  "Sprache":"Language","Deutsch":"German","Englisch":"English",
  "Heute":"Today","Gestern":"Yesterday","Morgen":"Tomorrow","Messungen":"Measurements","Messung hinzufügen":"Add measurement",
  "Hydrierung heute":"Hydration today","Ernährung heute":"Nutrition today","Menge":"Amount","Ziel":"Goal","Getränke heute":"Drinks today","Meine Getränke":"My drinks",
  "Getränk erstellen":"Create drink","Getränk eintragen":"Log drink","Eintragen":"Log","+ Eintragen":"+ Log","Hinzufügen":"Add","Übernehmen":"Apply","Speichern":"Save","Löschen":"Delete",
  "Bearbeiten":"Edit","Abbrechen":"Cancel","Zurück":"Back","Trainingsplan auswählen":"Choose plan","Plan suchen":"Search plans",
  "Hinzugefügt":"Added","Geändert":"Changed","Genutzt":"Used","Diese Woche":"This week","Wiederholen":"Repeat","Einmalig":"Once","Für X Wochen":"For X weeks",
  "Bis Datum":"Until date","ANZAHL WOCHEN":"NUMBER OF WEEKS","BIS EINSCHLIESSLICH":"UNTIL AND INCLUDING",
  "Übung hinzufügen":"Add exercise","Übung bearbeiten":"Edit exercise","Trainingsmethode":"Training method","Sätze":"Sets","Pause":"Rest",
  "Wiederholungen":"Repetitions","Zeit":"Time","Variante":"Variant","pro Seite":"per side","Abgeschlossen":"Completed",
  "Tipp nächstes Training":"Next workout tip","Perfekt":"Perfect","Limit":"Limit","Zu schwer":"Too heavy","Zu leicht":"Too easy",
  "Satz hinzufügen":"Add set","Training beenden":"Finish workout","Training verwerfen":"Discard workout","Workout läuft":"Workout running",
  "Lebensmittel hinzufügen":"Add food","Lebensmittel, Mahlzeit oder Kategorie":"Food, meal or category","Mahlzeit":"Meal","Kalorien":"Calories","Protein":"Protein","Wasser":"Water",
  "Gewicht":"Weight","Distanz":"Distance","Messungen":"Measurements","Größe":"Height","Wunschgewicht":"Target weight",
  "Meine Pläne":"My plans","Plan erstellen":"Create plan","Plan bearbeiten":"Edit plan","Vorschau":"Preview","Duplizieren":"Duplicate",
  "Reihenfolge":"Order","Zuletzt genutzt":"Recently used","Name":"Name","Suche":"Search","Suchen":"Search",
  "Trainingsart":"Training type","Muskelgruppe":"Muscle group","Alle":"All","Gewichte":"Weights","Körpergewicht":"Bodyweight",
  "Explosivität":"Explosiveness","Geräte":"Machines","Übungsdetails":"Exercise details","Ausführung":"Execution",
  "Pyramide":"Pyramid","Vorermüdung":"Pre-exhaust","Standard":"Standard","Satz":"Set","Runde":"Round",
  "Wiederholungsziel":"Rep target","Gesamtziel":"Total target","Pausenzeit":"Rest time","Gewichtsreduktion":"Weight reduction",
  "Training starten":"Start workout","Workout starten":"Start workout","Training erneut starten":"Restart workout",
  "Planänderungen speichern?":"Save plan changes?","Bestehenden Plan überschreiben":"Overwrite existing plan","Als neuen Plan speichern":"Save as new plan",
  "Änderungen verwerfen":"Discard changes","Plan wirklich speichern?":"Save plan?","Änderungen speichern oder verwerfen?":"Save or discard changes?",
  "Aktuelle Woche":"Current week","Diese und folgende Wochen":"This and following weeks","Nur diese Woche":"Only this week",
  "Nur dieses Workout entfernen":"Remove only this workout","Wiederholung ab hier beenden":"End recurrence from here",
  "Trainingstage":"Training days","Gewichtstrend":"Weight trend","Streak":"Streak","Wasser und Ernährung":"Water and nutrition",
  "Heute messen?":"Measure today?","Körperfett":"Body fat","Taille":"Waist","Brust":"Chest","Hüfte":"Hip",
  "Persönliche Daten":"Personal data","Aktivität & Ziel":"Activity & goal","Aktivität":"Activity","Geschlecht":"Sex",
  "Weiblich":"Female","Männlich":"Male","Nicht gewählt":"Not selected","Wenig aktiv":"Low activity","Leicht aktiv":"Light activity",
  "Moderat aktiv":"Moderately active","Sehr aktiv":"Very active","Extrem aktiv":"Extremely active",
  "Gewicht reduzieren":"Lose weight","Gewicht halten":"Maintain weight","Muskelaufbau":"Build muscle",
  "Ernährungsziele":"Nutrition goals","Hydrierung":"Hydration","Koffein":"Caffeine","Meine Lebensmittel":"My foods",
  "Lebensmittel erstellen":"Create food","Mahlzeit erstellen":"Create meal","Meine Mahlzeiten":"My meals",
  "Portion":"Serving","Portionen":"Servings","Gramm":"Grams","Kategorie":"Category","Eigene Lebensmittel":"Custom foods",
  "Keine Ergebnisse":"No results","Noch keine Messung":"No measurement yet","Noch keine Messungen.":"No measurements yet.",
  "Noch nicht eingerichtet":"Not set up yet","Pause beendet":"Rest finished","Pause überspringen":"Skip rest",
  "Bewertung":"Rating","Satz erledigt":"Set done","noch passend":"still suitable","genau richtig":"just right","zu anstrengend":"too hard",
  "Perfekt · 1–2 WDH. sauber übrig":"Perfect · 1–2 clean reps left",
  "Limit · 0 Wdh. mit guter Form übrig":"Limit · 0 reps with good form left",
  "Zu schwer · Form zu früh verloren":"Too heavy · form broke down too early",
  "Zu leicht · 3+ saubere WDH. wären möglich":"Too easy · 3+ reps still possible"
 };
 const EN_DE=Object.fromEntries(Object.entries(DE_EN).map(([a,b])=>[b,a]));
 function shouldSkipTranslationV31(el){
   return !!el.closest?.("[data-i18n-skip],.exercise-title-link,.combined-name,.combined-series-name,.plan-card strong,.week-card-main strong,.food-result-copy strong,.final-drink-selected strong,.quick-drink-choice span:last-child")
 }
 function translateTextV31(text){
   const dict=sysPrefs.language==="en"?DE_EN:EN_DE;
   const trim=text.trim();if(!trim)return text;
   if(dict[trim])return text.replace(trim,dict[trim]);
   return text
 }
 function applyTranslationsV31(root=document.body){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
   nodes.forEach(node=>{
     const p=node.parentElement;if(!p||shouldSkipTranslationV31(p)||["SCRIPT","STYLE"].includes(p.tagName))return;
     node.nodeValue=translateTextV31(node.nodeValue)
   });
   document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(el=>{
     if(shouldSkipTranslationV31(el))return;
     el.placeholder=translateTextV31(el.placeholder)
   })
 }
 let translating=false;
 const observer=new MutationObserver(()=>{
   if(translating)return;translating=true;requestAnimationFrame(()=>{applyTranslationsV31();translating=false})
 });
 observer.observe(document.body,{childList:true,subtree:true});
 applyTranslationsV31();

 // Final settings section: system-level units + language, replacing the individual unit selects visually.
 const openSettingsBeforeSystemV31=openSettingsPage;
 openSettingsPage=function(){
   openSettingsBeforeSystemV31();
   requestAnimationFrame(()=>{
     const body=$("settingsBody");if(!body)return;
     const old=$("unitSettingsV31");if(old)old.remove();
     let sec=$("systemSettingsV31");
     if(sec)sec.remove();
     sec=document.createElement("div");sec.id="systemSettingsV31";sec.className="settings-section";
     sec.innerHTML=`<h3>Einheiten & Ansicht</h3><div class="settings-card">
       <div class="settings-row"><div><strong>Einheitensystem</strong><small>kg / km / cm / ml / g oder lb / mi / in / oz / oz-lb</small></div><select id="prefUnitSystem" class="field settings-system-select"><option value="metric" ${sysPrefs.unitSystem==="metric"?"selected":""}>Metrisch</option><option value="imperial" ${sysPrefs.unitSystem==="imperial"?"selected":""}>Imperial</option></select></div>
       <div class="settings-row"><div><strong>Wochenstart</strong></div><select id="prefWeekStartFinal" class="field settings-system-select"><option value="monday" ${sysPrefs.weekStart==="monday"?"selected":""}>Montag</option><option value="sunday" ${sysPrefs.weekStart==="sunday"?"selected":""}>Sonntag</option></select></div>
       <div class="settings-row"><div><strong>Sprache</strong><small>Gesamte App-Oberfläche</small></div><select id="prefLanguage" class="field settings-system-select"><option value="de" ${sysPrefs.language!=="en"?"selected":""}>Deutsch</option><option value="en" ${sysPrefs.language==="en"?"selected":""}>English</option></select></div>
       </div>`;
     const training=[...body.querySelectorAll(".settings-section")].find(x=>x.querySelector("h3")?.textContent==="Training"||x.querySelector("h3")?.textContent==="Training");
     if(training)body.insertBefore(sec,training);else body.appendChild(sec);

     $("prefUnitSystem").onchange=()=>{
       sysPrefs.unitSystem=$("prefUnitSystem").value;applySystemDerivedV31();
       if(window.rethinkPrefsV31){
         // old helper reads the same persisted preference object on next render; current display is handled here.
       }
       renderProfile();if(activeWorkout)renderLive();applyTranslationsV31()
     };
     $("prefWeekStartFinal").onchange=()=>{
       const oldMode=sysPrefs.weekStart;sysPrefs.weekStart=$("prefWeekStartFinal").value;write(PREF_KEY,sysPrefs);
       const legacy=$("prefWeekStart");if(legacy){legacy.value=sysPrefs.weekStart;legacy.dispatchEvent(new Event("change",{bubbles:true}))}
       else{renderWeek();renderProfile()}
     };
     
     $("prefLanguage").onchange=()=>{sysPrefs.language=$("prefLanguage").value;write(PREF_KEY,sysPrefs);try{captureTabUiState(currentTab);persistUI({capture:false});saveAll()}catch{}location.reload()};
     applyTranslationsV31()
   })
 };

 // Expose.
 window.rethinkSystemV31={
   prefs:()=>({...sysPrefs}),weightUnit,distanceUnit,lengthUnit,volumeUnit,
   weightDisplay,weightStore,distanceDisplay,distanceStore,lengthDisplay,lengthStore,volumeDisplay,volumeStore,
   foodMassDisplay,foodMassStore,feetInches,translate:applyTranslationsV31
 };
})();


/* Rethink_v3.1 — final profile/unit/language post-render authority */
(function(){
 function enforceProfileSystemV31(){
   const s=window.rethinkSystemV31;if(!s)return;
   const p=s.prefs(),latest=measurements.slice().reverse().find(m=>Number(m.weight)>0),w=Number(latest?.weight||profile.weight||0);
   if($("profileSummary")){
     $("profileSummary").textContent=[
       profile.age?`${profile.age} J.`:"",
       profile.height?(p.unitSystem==="imperial"?s.feetInches(profile.height):`${profile.height} cm`):"",
       w?`${s.weightDisplay(w)} ${p.unitSystem==="imperial"?"lb":"kg"}`:""
     ].filter(Boolean).join(" · ")||"Noch nicht eingerichtet"
   }
   s.translate?.()
 }
 __rt.profile.post.push(function(__result,...__args){
const r=__result;
enforceProfileSystemV31();
   requestAnimationFrame(enforceProfileSystemV31);
   setTimeout(enforceProfileSystemV31,40);
   return r
});

 // Translate the plans tab label as well; names inside plan cards remain protected.
 if(window.rethinkSystemV31){
   const old=window.rethinkSystemV31.translate;
   window.rethinkSystemV31.translate=(root=document.body)=>{
     old(root);
     const p=window.rethinkSystemV31.prefs();
     document.querySelectorAll('#bottomNav button[data-tab="plans"]').forEach(b=>{
       const icon=b.querySelector(".nav-icon");
       const label=p.language==="en"?"Plans":"Pläne";
       [...b.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>n.remove());
       b.append(document.createTextNode(label));
       if(icon && b.firstElementChild!==icon)b.prepend(icon)
     })
   }
 }
})();


/* Rethink_v3.1 — vollständiges Backup / Wiederherstellung */
(function(){
 const BACKUP_SCHEMA="rethink-v3.1-backup",BACKUP_VERSION=1;
 const SKIP=["rethink_ui","rethink_tab_ui","rethink_boot","rethink_session"];
 function personalBackupKeysV31(){
   return [...new Set([
     STORAGE.plans,                         // Trainingspläne
     STORAGE.custom,                        // selbst hinzugefügte Übungen
     STORAGE.library,                       // persönliche Katalogausblendungen/-einstellungen
     STORAGE.history,                       // abgeschlossene Trainings / Verlauf
     STORAGE.active,                        // laufendes Workout, falls vorhanden
     STORAGE.measurements,                  // Gewicht und sämtliche Körpermaße
     STORAGE.nutrition,                     // Ernährung, Lebensmittel, Mahlzeiten, Ziele, Getränkedefinitionen
     STORAGE.profile,                       // vollständiger Profilbereich
     HYDRATION_LOG_KEY,                     // kompletter Trink-/Hydrierungsverlauf
     WEEK_KEY,                              // Wochenplan
     WEEK_DATED_KEY,                        // datumsbasierte Wochenpläne
     "rethink_week_recurring_rules_v1",     // wiederkehrende Wochenpläne
     "rethink_week_recurring_exceptions_v1",// Wochenplan-Ausnahmen
     REST_DEFAULT_KEY,                      // Standardpause
     "rethink_preferences_v31",            // Einheiten, Wochenstart, Sprache/system preferences
     "rethink_theme_mode",                 // Theme
     "rethink_reminders_v32",              // Erinnerungen
     "rethink_profile_state_history_v49",  // Profil-Tageshistorie
     "rethink_profile_chart_metric_v72",   // gewählte Messkurve
     "rethink_plan_sort_v31",              // Plan-Sortierung
     "rethink_rest_dock_position_v1",      // Position des Pausentimers
     "rethink_tab_ui_state_v31",          // eingeklappte/ausgeklappte Profil- und Tab-Bereiche
     "rethink_ui_state_v2",               // letzter Tab, Seite, Scrollposition und UI-Zustand
   ].filter(Boolean))]
 }
 function payload(){
   try{saveAll()}catch{}
   const data={};
   personalBackupKeysV31().forEach(k=>{
     const v=localStorage.getItem(k);
     if(v!==null)data[k]=v
   });
   return {
     schema:BACKUP_SCHEMA,
     version:4,
     mode:"full-safe",
     scope:"all-personal-data",
     createdAt:new Date().toISOString(),
     app:"ReThink. Fitness",
     localStorage:data
   }
 }
 function filename(){return "Backup.json"}
 async function exportBackup(){
   try{saveAll()}catch{}
   const text=JSON.stringify(payload(),null,2);
   const file=new File([text],filename(),{type:"application/json"});
   // iPhone/iPad local previews are much more reliable with the native share sheet than a blob navigation.
   try{
     if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
       await navigator.share({files:[file],title:"ReThink. Fitness Backup"});
       try{toast("Backup erstellt")}catch{}
       return
     }
   }catch(err){
     if(err?.name==="AbortError")return;
   }
   const blob=new Blob([text],{type:"application/json"});
   const url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download=filename();a.rel="noopener";a.style.display="none";
   document.body.appendChild(a);a.click();
   setTimeout(()=>{try{a.remove()}catch{};URL.revokeObjectURL(url)},2500);
   try{toast("Backup erstellt")}catch{}
 }
 function backupValueStringV19(v){
   if(typeof v==="string")return v;
   if(v===undefined)return undefined;
   try{return JSON.stringify(v)}catch{return undefined}
 }
 function normalizeBackupV19(x){
   const allowed=personalBackupKeysV31(),out={};
   const parseMaybe=v=>{if(typeof v!=="string")return v;const t=v.trim();if(!t||(!t.startsWith("{")&&!t.startsWith("[")))return v;try{return JSON.parse(t)}catch{return v}};
   const put=(key,val)=>{
     if(!key||!allowed.includes(key))return;
     const s=backupValueStringV19(val);
     if(typeof s==="string")out[key]=s
   };
   const logicalMap={
     plans:STORAGE.plans,trainingPlans:STORAGE.plans,savedPlans:STORAGE.plans,workoutPlans:STORAGE.plans,
     customExercises:STORAGE.custom,custom:STORAGE.custom,exercisesCustom:STORAGE.custom,
     exerciseLibrary:STORAGE.library,library:STORAGE.library,catalogState:STORAGE.library,
     history:STORAGE.history,workoutHistory:STORAGE.history,workouts:STORAGE.history,completedWorkouts:STORAGE.history,
     activeWorkout:STORAGE.active,active:STORAGE.active,currentWorkout:STORAGE.active,
     measurements:STORAGE.measurements,bodyMeasurements:STORAGE.measurements,metrics:STORAGE.measurements,
     nutrition:STORAGE.nutrition,food:STORAGE.nutrition,foods:STORAGE.nutrition,
     profile:STORAGE.profile,userProfile:STORAGE.profile,
     weekPlan:WEEK_KEY,week:WEEK_KEY,weeklyPlan:WEEK_KEY,
     datedWeeks:WEEK_DATED_KEY,weekDated:WEEK_DATED_KEY,datedWeekPlans:WEEK_DATED_KEY,
     hydrationLog:HYDRATION_LOG_KEY,hydration:HYDRATION_LOG_KEY,waterLog:HYDRATION_LOG_KEY
   };
   const absorbObject=obj=>{
     obj=parseMaybe(obj);
     if(!obj||typeof obj!=="object")return;
     if(Array.isArray(obj)){
       // Historical exports sometimes stored localStorage as [[key,value], ...]
       // or [{key,value}, ...].
       obj.forEach(item=>{
         if(Array.isArray(item)&&item.length>=2)put(String(item[0]),item[1]);
         else if(item&&typeof item==="object"&&"key" in item&&"value" in item)put(String(item.key),item.value)
       });
       return
     }
     allowed.forEach(k=>{if(Object.prototype.hasOwnProperty.call(obj,k))put(k,obj[k])});
     Object.entries(logicalMap).forEach(([oldKey,newKey])=>{if(Object.prototype.hasOwnProperty.call(obj,oldKey))put(newKey,obj[oldKey])})
   };
   const seen=new Set();
   const walk=(node,depth=0)=>{
     node=parseMaybe(node);
     if(!node||typeof node!=="object"||depth>6||seen.has(node))return;
     seen.add(node);absorbObject(node);
     if(Array.isArray(node)){node.forEach(v=>walk(v,depth+1));return}
     // Known wrappers plus generic recursion make restores tolerant of every older app wrapper used so far.
     ["localStorage","storage","data","backup","payload","state","appState","store","snapshot","values","entries"].forEach(k=>{
       if(Object.prototype.hasOwnProperty.call(node,k))walk(node[k],depth+1)
     });
     Object.values(node).forEach(v=>{if(v&&typeof parseMaybe(v)==="object")walk(v,depth+1)})
   };
   x=parseMaybe(x);
   if(!x||typeof x!=="object")throw new Error("Keine gültige ReThink. Fitness Backupdatei.");
   walk(x);
   if(!Object.keys(out).length)throw new Error("Die Backupdatei enthält keine wiederherstellbaren ReThink. Fitness Daten.");
   return out
 }
 async function restore(file){
   const raw=JSON.parse(await file.text());
   const normalized=normalizeBackupV19(raw);

   if(!confirm("Backup wiederherstellen?\n\nWiederhergestellt werden – soweit im Backup enthalten – Trainingspläne, eigene Übungen, Trainingsverlauf, laufendes Workout, Körpermessungen, Ernährung und Lebensmittel, Profil, Hydrierung sowie Wochenpläne.\n\nDie aktuellen persönlichen Daten werden durch den Stand des Backups ersetzt. App-Code und integrierter Übungskatalog bleiben aktuell."))return;

   const allowed=personalBackupKeysV31();
   allowed.forEach(k=>localStorage.removeItem(k));
   Object.entries(normalized).forEach(([k,v])=>{
     if(allowed.includes(k)&&typeof v==="string")localStorage.setItem(k,v)
   });

   try{toast("Backup wiederhergestellt")}catch{}
   setTimeout(()=>location.reload(),300)
 }
 function chooseRestore(){
   // Always create a fresh picker. Reusing the old iOS file input can leave it inert after one export/restore cycle.
   const old=document.getElementById("rethinkBackupRestoreInput");if(old)old.remove();
   const i=document.createElement("input");
   i.type="file";i.accept=".json,.txt,application/json,text/json,text/plain";i.id="rethinkBackupRestoreInput";
   i.setAttribute("aria-label","ReThink Backup auswählen");
   Object.assign(i.style,{position:"fixed",left:"-10000px",top:"0",width:"1px",height:"1px",opacity:"0",zIndex:"-1"});
   document.body.appendChild(i);
   i.addEventListener("change",async()=>{
     const f=i.files?.[0];
     try{if(f)await restore(f)}
     catch(e){alert(e?.message||"Backup konnte nicht gelesen werden.")}
     finally{setTimeout(()=>i.remove(),0)}
   },{once:true});
   try{i.click()}catch(e){i.remove();throw e}
 }
 window.rethinkBackup={export:exportBackup,restore:chooseRestore,payload};

})();


/* Rethink_v3.1 — vollständige UI-Übersetzung DE/EN
   Ausgenommen: Übungsnamen, Plannamen sowie freie Nutzertexte/Notizen. */
(function(){
 const EXTRA_DE_EN = {
  "Dein Training beginnt hier.":"Your training starts here.",
  "Erstelle deinen ersten Trainingsplan und stelle Übungen, Sätze und Trainingsmethoden passend zu deinem Training zusammen.":"Create your first training plan and combine exercises, sets and training methods to match your training.",
  "Pläne":"Plans","Meine Pläne":"My plans","Trainingsplan":"Training plan","Trainingspläne":"Training plans",
  "Trainingsplan erstellen":"Create training plan","Plan erstellen":"Create plan","Plan bearbeiten":"Edit plan",
  "Plan speichern":"Save plan","Plan speichern?":"Save plan?","Plan wirklich speichern?":"Save plan?",
  "Plan hinzufügen":"Add plan","Plan auswählen":"Choose plan","Kein Plan gewählt":"No plan selected",
  "Training starten":"Start workout","Workout starten":"Start workout","Training erneut starten?":"Restart workout?",
  "Training erneut starten":"Restart workout","Workout öffnen":"Open workout","Workout läuft":"Workout running",
  "Training beenden":"Finish workout","Training verwerfen":"Discard workout","Bearbeiteten Plan starten?":"Start edited plan?",
  "Übung":"Exercise","Übungen":"Exercises","Übung hinzufügen":"Add exercise","Übung bearbeiten":"Edit exercise",
  "Übung austauschen":"Replace exercise","Übung löschen":"Delete exercise","Übung suchen":"Search exercise",
  "Übungsdetails":"Exercise details","Übung hinzugefügt":"Exercise added","Änderung übernommen":"Change applied",
  "Serie bearbeiten":"Edit series","Trainingsmethode":"Training method","Methode":"Method",
  "Satz":"Set","Sätze":"Sets","Satz hinzufügen":"Add set","Satz löschen":"Delete set",
  "Satz erledigt":"Set done","Runde":"Round","Pause":"Rest","Pausenzeit":"Rest time",
  "Wiederholungen":"Reps","Wiederholungsziel":"Rep target","Gesamtziel":"Total target","Zeit":"Time",
  "Gewicht":"Weight","Distanz":"Distance","Variante":"Variant","pro Seite":"per side","Notiz":"Note",
  "Bewertung":"Rating","Letzte Bewertung":"Last rating","Bewertung letztes passendes Workout":"Last matching workout rating",
  "Perfekt":"Perfect","Limit":"Limit","Zu schwer":"Too heavy","Zu leicht":"Too easy","Abgeschlossen":"Completed",
  "Tipp nächstes Training":"Next workout tip","Versuche dich zu steigern":"Try to improve","Zeit erhöhen":"Increase time","Lebensmittel/Mahlzeit erstellen":"Create food/meal","Gemeinsamer Streak":"Combined streak","Hydrierung + Ernährung":"Hydration + nutrition","Messverlauf":"Measurement trend",
  "Erstes Training in dieser Methode – starte kontrolliert im vorgegebenen Wiederholungsbereich.":"First workout with this method – start conservatively within the prescribed rep range.",
  "Letztes Mal zu schwer: Gewicht beibehalten oder leicht reduzieren.":"Last time was too heavy: keep the weight or reduce it slightly.",
  "Letztes Mal deutlich zu leicht: Gewicht moderat erhöhen.":"Last time was clearly too easy: increase the weight moderately.",
  "Sehr passend: Gewicht zunächst beibehalten und Ziel-WDH. wieder anpeilen.":"Very suitable: keep the weight for now and aim for the target reps again.",
  "Am Limit: Gewicht eher beibehalten und saubere Wiederholungen bestätigen.":"At the limit: keep the weight and confirm clean reps.",
  "Letzte Werte als Orientierung nutzen und nach Tagesform anpassen.":"Use the previous values as guidance and adjust to how you feel today.",
  "Pyramidentraining wird über Wiederholungen konfiguriert, nicht über Zeit.":"Pyramid training is configured with reps, not time.",
  "Gesamtwiederholungen in kurzen Teilblöcken sammeln. Sobald das Ziel erreicht ist, entfallen weitere Rest-Pause-Blöcke.":"Accumulate total reps in short blocks. Once the target is reached, remaining rest-pause blocks are removed.",
  "Gesamtwiederholungen in kurzen Clustern sammeln. Leere Folgefelder können aus der ersten Eingabe übernommen werden.":"Accumulate total reps in short clusters. Empty following fields can inherit the first entry.",
  "Auf einen schweren Top-Satz folgen leichtere Back-off-Sätze mit höherer Wiederholungszahl.":"A heavy top set is followed by lighter back-off sets with more reps.",
  "Woche":"Week","Aktuelle Woche":"Current week","Diese Woche":"This week","Wiederholen":"Repeat",
  "Einmalig":"Once","Für X Wochen":"For X weeks","Bis Datum":"Until date","Wiederholung ändern?":"Change recurrence?",
  "Wiederholung löschen?":"Delete recurrence?","Nur diese Woche":"Only this week","Diese und folgende Wochen":"This and following weeks",
  "Auswahl für diesen Tag wirklich löschen?":"Really delete the selection for this day?","Bitte mindestens 2 Wochen wählen.":"Please select at least 2 weeks.",
  "Profil":"Profile","Profil bearbeiten":"Edit profile","Persönliche Daten":"Personal data","Aktivität & Ziel":"Activity & goal",
  "Alter":"Age","Größe":"Height","Geschlecht":"Sex","Aktivität":"Activity","Ziel":"Goal",
  "Nicht gewählt":"Not selected","Weiblich":"Female","Männlich":"Male","Wenig aktiv":"Low activity",
  "Leicht aktiv":"Light activity","Moderat aktiv":"Moderately active","Sehr aktiv":"Very active","Extrem aktiv":"Extremely active",
  "Gewicht reduzieren":"Lose weight","Gewicht halten":"Maintain weight","Muskelaufbau":"Build muscle",
  "Wunschgewicht":"Target weight","Persönliche Werte und Ziele":"Personal values and goals",
  "Gewichtstrend":"Weight trend","Trainingstage":"Training days","Streak":"Streak","Wasser und Ernährung":"Water and nutrition",
  "Heute messen?":"Measure today?","Messung":"Measurement","Messungen":"Measurements","Messung hinzufügen":"Add measurement",
  "Messung gelöscht":"Measurement deleted","Diese Messung wirklich löschen?":"Really delete this measurement?",
  "Körperfett":"Body fat","Taille":"Waist","Brust":"Chest","Hüfte":"Hips","darüber":"above","bis Ziel":"to goal",
  "Bitte Gewicht eintragen.":"Please enter a weight.","Bitte eine realistische Körpergröße eingeben.":"Please enter a realistic height.",
  "Hydrierung heute":"Hydration today","Hydrierung":"Hydration","Getränke heute":"Drinks today","Meine Getränke":"My drinks",
  "Getränk erstellen":"Create drink","Getränk eintragen":"Log drink","Getränke verwalten":"Manage drinks",
  "Menge":"Amount","Eintragen":"Log","+ Eintragen":"+ Log","Wasser":"Water","Koffein":"Caffeine",
  "Ernährung heute":"Nutrition today","Ernährung":"Nutrition","Lebensmittel heute":"Food today",
  "Meine Lebensmittel & Mahlzeiten":"My foods & meals","Meine Lebensmittel":"My foods","Meine Mahlzeiten":"My meals",
  "Eigenes Lebensmittel":"Custom food","Lebensmittel erstellen":"Create food","Lebensmittel bearbeiten":"Edit food",
  "Mahlzeit erstellen":"Create meal","Mahlzeit":"Meal","Lebensmittel oder Kategorie":"Food or category",
  "Lebensmittel, Mahlzeit oder Kategorie":"Food, meal or category","Kategorie":"Category","Portion":"Serving","Portionen":"Servings",
  "Kalorien":"Calories","Protein":"Protein","Kalorienziel":"Calorie target","Flüssigkeitsziel":"Hydration target",
  "Persönlichen Wert berechnen":"Calculate personal target","Eigenes Lebensmittel wirklich löschen?":"Really delete this custom food?",
  "Mahlzeit wirklich löschen?":"Really delete this meal?","Bitte Name und Nährwerte vollständig eintragen.":"Please enter name and nutrition values completely.",
  "Lebensmittel gespeichert":"Food saved","Bitte Name und mindestens ein Lebensmittel hinzufügen.":"Please enter a name and add at least one food.",
  "Für eine Mahlzeit bitte einzelne Zutaten wählen.":"For a meal, please select individual ingredients.",
  "Bitte einzelne Zutaten wählen.":"Please select individual ingredients.",
  "Einstellungen":"Settings","Darstellung":"Appearance","Hell / Dunkel":"Light / Dark","Hell":"Light","Dunkel":"Dark","System":"System",
  "Einheiten & Ansicht":"Units & View","Einheitensystem":"Unit system","Metrisch":"Metric","Imperial":"Imperial",
  "Wochenstart":"Week starts","Montag":"Monday","Sonntag":"Sunday","Standard":"Standard",
  "Groß":"Large","Sehr groß":"Extra large","Sprache":"Language","Deutsch":"German","Englisch":"English",
  "Daten & Backup":"Data & Backup","Backup erstellen":"Create backup","Backup wiederherstellen":"Restore backup",
  "Sichern":"Back up","Wiederherstellen":"Restore","Keine gültige ReThink-Backupdatei.":"Not a valid ReThink backup file.",
  "Backup wirklich wiederherstellen? Die aktuellen Daten dieser ReThink-Installation werden durch den Backup-Stand ersetzt.":"Really restore this backup? The current data in this ReThink installation will be replaced by the backup.",
  "Speichern":"Save","Löschen":"Delete","Bearbeiten":"Edit","Fertig":"Done","Abbrechen":"Cancel","Zurück":"Back",
  "Hinzufügen":"Add","Übernehmen":"Apply","Duplizieren":"Duplicate","Vorschau":"Preview","Reihenfolge":"Order",
  "Suchen":"Search","Suche":"Search","Alle":"All","Keine Ergebnisse":"No results","Noch nicht eingerichtet":"Not set up yet",
  "Noch keine Messung":"No measurement yet","Noch keine Messungen.":"No measurements yet.","Pause beendet":"Rest finished",
  "Pause überspringen":"Skip rest","Ein Trainingsplan braucht mindestens eine Übung.":"A training plan needs at least one exercise.",
  "Planänderungen speichern?":"Save plan changes?","Bestehenden Plan überschreiben":"Overwrite existing plan",
  "Als neuen Plan speichern":"Save as new plan","Änderungen verwerfen":"Discard changes",
  "Änderungen speichern oder verwerfen?":"Save or discard changes?","Plan wirklich speichern?":"Save plan?",
  "Trainingsart":"Training type","Muskelgruppe":"Muscle group","Gewichte":"Weights","Körpergewicht":"Bodyweight",
  "Explosivität":"Explosiveness","Geräte":"Machines","Ausführung":"Execution","Pyramide":"Pyramid",
  "Vorermüdung":"Pre-exhaust","Drop-Satz":"Drop set","Back-off":"Back-off","Cluster":"Cluster","Rest-Pause":"Rest-pause",
  "Superset":"Superset","Giant Set":"Giant set","AMRAP":"AMRAP",
  "Lebensmittel hinzufügen":"Add food","Eigene Lebensmittel":"Custom foods",
  "Plan suchen":"Search plans","Trainingsplan auswählen":"Choose training plan",
  "Hinzugefügt":"Added","Geändert":"Changed","Genutzt":"Used",
  "Bitte Planname eingeben.":"Please enter a plan name.",
  "Bitte ein realistisches Alter eingeben.":"Please enter a realistic age.",
  "Bitte ein realistisches Wunschgewicht eingeben.":"Please enter a realistic target weight.",
  "Ernährungsziele":"Nutrition goals",
  "Perfekt · 1–2 WDH. sauber übrig":"Perfect · 1–2 clean reps left",
  "Limit · 0 Wdh. mit guter Form übrig":"Limit · 0 reps with good form left",
  "Zu schwer · Form zu früh verloren":"Too heavy · form broke down too early",
  "Zu leicht · 3+ saubere WDH. wären möglich":"Too easy · 3+ reps still possible",
  "1 Stück":"1 piece","1 Brötchen":"1 roll","1 mittelgroße Kartoffel":"1 medium potato",
  "1 mittelgroße Süßkartoffel":"1 medium sweet potato","z. B. Frühstück":"e.g. breakfast",
  "z. B. Frühstück Bowl":"e.g. breakfast bowl",
  "Kalorien/Tag":"Calories/day","Protein/Tag":"Protein/day","Flüssigkeit/Tag":"Fluids/day",
  "Kalorien / Tag":"Calories/day","Protein / Tag":"Protein/day","Flüssigkeit / Tag":"Fluids/day",
  "Gewichte":"Weights","Sprünge":"Jumps","Explosivität":"Explosiveness","Geräte":"Machines","Körpergewicht":"Bodyweight",
  "Arme/Hände":"Arms/Hands","Beine/Füße":"Legs/Feet","Gesäß/Hüfte":"Glutes/Hips","Rücken":"Back",
  "Schultern":"Shoulders","Schulter":"Shoulder","Brust":"Chest","Ganzkörper":"Full body",
  "Ausdauer":"Endurance","Beweglichkeit":"Mobility","Mobilität":"Mobility","Athletik":"Athletic training",
  "Empfehlung":"Recommendation","Empfehlungen":"Recommendations","Zitat":"Quote",
  "Trainingstage":"Training days","Trainingstage Woche":"Training days this week","Aktuelle Woche":"Current week",
  "Wochenzusammenfassung":"Weekly summary","Gewichtsveränderung":"Weight change","Beide Ziele":"Both goals",
  "Hydrierungsziel":"Hydration goal","Ernährungsziel":"Nutrition goal","Hydrierungs-Streak":"Hydration streak","Ernährungs-Streak":"Nutrition streak",
  "Gewichtstrend":"Weight trend","Wunschgewicht":"Target weight","bis Ziel":"to target","darüber":"above target",
  "Persönliche Werte und Ziele":"Personal values and goals","Persönlicher Wert":"Personal target",
  "Dein Plan gibt die Richtung vor – du gibst ihm Leben.":"Your plan sets the direction — you bring it to life.",
  "Dein zukünftiges Ich profitiert von der Einheit heute.":"Your future self benefits from today's workout.",
  "Deine Routine trägt dich auch an Tagen ohne Motivation.":"Your routine carries you even on days without motivation.",
  "Der Plan ist die Struktur. Du bist die Konstanz.":"The plan provides the structure. You provide the consistency.",
  "Der wichtigste Satz ist oft der, den du sauber ausführst.":"The most important set is often the one you perform with good form.",
  "Die beste Woche ist die, die zu deinem Leben passt.":"The best week is the one that fits your life.",
  "Du trainierst nicht nur Leistung, sondern Verlässlichkeit.":"You are training not only performance, but consistency.",
  "Ein Schritt nach dem anderen ist immer noch vorwärts.":"One step at a time is still forward.",
  "Ein guter Rhythmus schlägt einen perfekten Start.":"A good rhythm beats a perfect start.",
  "Eine Einheit zählt auch dann, wenn sie nicht perfekt war.":"A workout still counts even when it was not perfect.",
  "Eine starke Woche beginnt mit der nächsten guten Entscheidung.":"A strong week starts with the next good decision.",
  "Fokus auf das, was du heute beeinflussen kannst.":"Focus on what you can influence today.",
  "Fortschritt braucht Wiederholung, nicht Drama.":"Progress needs repetition, not drama.",
  "Fortschritt ist selten spektakulär – aber konsequent sichtbar.":"Progress is rarely spectacular — but consistency makes it visible.",
  "Fortschritt zeigt sich oft zuerst in besserer Kontrolle.":"Progress often shows up first as better control.",
  "Jede geplante Einheit ist eine Entscheidung für dein nächstes Level.":"Every planned workout is a decision for your next level.",
  "Kleine Schritte werden groß, wenn du sie oft genug gehst.":"Small steps become big when you take them often enough.",
  "Konstanz schlägt Perfektion. Eine gute Woche entsteht aus den Einheiten, die du wirklich machst.":"Consistency beats perfection. A good week is built from the workouts you actually do.",
  "Leistung entsteht aus vielen unspektakulären Wiederholungen.":"Performance is built from many unspectacular repetitions.",
  "Mach die Einheit, die heute möglich ist.":"Do the workout that is possible today.",
  "Mehr Kontrolle, mehr Qualität, mehr Fortschritt.":"More control, more quality, more progress.",
  "Nicht jede Woche muss stärker sein – aber jede kann dich weiterbringen.":"Not every week has to be stronger — but every week can move you forward.",
  "Letzte Werte als Orientierung nutzen und nach Tagesform anpassen.":"Use your previous values as a guide and adjust for how you feel today.",
  "Letztes Mal deutlich zu leicht: Gewicht moderat erhöhen.":"Last time was clearly too easy: increase the weight moderately.",
  "Letztes Mal zu anstrengend: Last zunächst beibehalten oder leicht reduzieren.":"Last time was too demanding: keep the load the same or reduce it slightly.",
  "Letztes Mal zu leicht: Widerstand moderat erhöhen.":"Last time was too easy: increase resistance moderately.",
  "Letztes Mal zu schwer: Gewicht beibehalten oder leicht reduzieren.":"Last time was too heavy: keep the weight the same or reduce it slightly.",
  "Genau passend: Last und Zielbereich zunächst beibehalten.":"Just right: keep the load and target range for now.",
  "Im Zielbereich bleiben und nach Tagesform fein anpassen.":"Stay within the target range and fine-tune based on how you feel today.",
  "Am Limit: Gewicht eher beibehalten und saubere Wiederholungen bestätigen.":"At your limit: keep the weight and confirm clean repetitions.",
  "Erstes Training":"First workout",
  "Erstes Training in dieser Methode – starte kontrolliert im vorgegebenen Wiederholungsbereich.":"First workout with this method — start conservatively within the prescribed rep range.",
  "Erstes protokolliertes Training – starte kontrolliert im vorgegebenen Bereich.":"First recorded workout — start conservatively within the prescribed range."
 };

 function langV31(){return window.rethinkSystemV31?.prefs?.().language||"de"}
 function protectedV31(el){
   return !!el?.closest?.(
     '[data-i18n-skip],.exercise-title-link,.combined-name,.combined-series-name,'+
     '.plan-card strong,[data-plan-name],.exercise-card strong,[data-exercise-name],'+
     '.food-result-copy strong,.final-drink-selected strong,.quick-drink-choice span:last-child,'+
     '.user-note,.note-text'
   )
 }
 function translateExactV31(text){
   if(langV31()!=="en")return text;
   const lead=(text.match(/^\s*/)||[""])[0],tail=(text.match(/\s*$/)||[""])[0],core=text.trim();
   if(!core)return text;
   if(EXTRA_DE_EN[core])return lead+EXTRA_DE_EN[core]+tail;

   // Dynamic fixed UI phrases.
   let x=core;
   const replacements=[
    [/^(\d+)\s+Übungen$/, "$1 exercises"],
    [/^(\d+)\s+Sätze$/, "$1 sets"],
    [/^(\d+)\s+Übungen\s+·\s+(\d+)\s+Sätze$/, "$1 exercises · $2 sets"],
    [/^Übung\s+(\d+)\/(\d+)$/, "Exercise $1/$2"],
    [/^Satz\s+(\d+)$/i, "Set $1"],
    [/^SATZ\s+(\d+)$/, "SET $1"],
    [/^Für\s+(.+)\s+bitte\s+(\d+)–(\d+)\s+Sätze wählen\.$/, "For $1, choose $2–$3 sets."],
    [/^(\d+)\s+Wochen$/, "$1 weeks"],
    [/^KW\s+(\d+)$/, "CW $1"],
    [/^Ziel:\s*Gewicht reduzieren$/, "Goal: lose weight"],
    [/^Ziel:\s*Muskelaufbau$/, "Goal: build muscle"],
    [/^Ziel:\s*Gewicht halten$/, "Goal: maintain weight"],
    [/^([^·]+)\s+·\s+(\d+)\s+Übungen\s+·\s+(\d+)\s+Sätze$/, "$1 · $2 exercises · $3 sets"]
   ];
   for(const [rx,repl] of replacements){if(rx.test(x))return lead+x.replace(rx,repl)+tail}

   // Last UI fallback: translate common German interface vocabulary even inside mixed/dynamic labels.
   // Exercise and plan names never reach this function because their DOM containers are protected.
   const phrases=[
    ["Kalorien/Tag","Calories/day"],["Protein/Tag","Protein/day"],["Flüssigkeit/Tag","Fluids/day"],
    ["Persönliche Werte und Ziele","Personal values and goals"],["Persönlichen Wert berechnen","Calculate personal target"],
    ["Lebensmittel und Mahlzeiten","Foods and meals"],["Meine Lebensmittel & Mahlzeiten","My foods & meals"],
    ["Wiederholungen pro Seite","Reps per side"],["Trainingsmethode","Training method"],["Übung hinzufügen","Add exercise"],
    ["Training starten","Start workout"],["Training beenden","Finish workout"],["Plan suchen","Search plans"],
    ["Keine Pause","No rest"],["Keine Daten","No data"],["Keine Einträge","No entries"],
    ["Diese Woche","This week"],["Letzte Woche","Last week"],["Aktuelle Woche","Current week"],
    ["Hydrierung heute","Hydration today"],["Ernährung heute","Nutrition today"]
   ];
   for(const [de,en] of phrases)x=x.split(de).join(en);
   const words={
    "Überschrift":"Heading","Übersicht":"Overview","Zusammenfassung":"Summary","Woche":"Week","Wochen":"Weeks",
    "Tag":"Day","Tage":"Days","Heute":"Today","Gestern":"Yesterday","Morgen":"Tomorrow",
    "Kalorien":"Calories","Protein":"Protein","Koffein":"Caffeine","Hydrierung":"Hydration","Ernährung":"Nutrition",
    "Gewicht":"Weight","Gewichte":"Weights","Sprünge":"Jumps","Explosivität":"Explosiveness","Geräte":"Machines",
    "Körpergewicht":"Bodyweight","Mobilität":"Mobility","Beweglichkeit":"Mobility","Ausdauer":"Endurance","Kraft":"Strength",
    "Kategorie":"Category","Kategorien":"Categories","Muskelgruppe":"Muscle group","Muskelgruppen":"Muscle groups",
    "Arme":"Arms","Hände":"Hands","Beine":"Legs","Füße":"Feet","Gesäß":"Glutes","Hüfte":"Hips","Rücken":"Back",
    "Schulter":"Shoulder","Schultern":"Shoulders","Brust":"Chest","Ganzkörper":"Full body","Athletik":"Athletic training",
    "Übung":"Exercise","Übungen":"Exercises","Training":"Workout","Trainings":"Workouts","Satz":"Set","Sätze":"Sets",
    "Wiederholung":"Rep","Wiederholungen":"Reps","Pause":"Rest","Zeit":"Time","Leistung":"Performance",
    "Menge":"Amount","Ziel":"Goal","Ziele":"Goals","Fortschritt":"Progress","Messung":"Measurement","Messungen":"Measurements",
    "Empfehlung":"Recommendation","Empfehlungen":"Recommendations","Hinweis":"Note","Hinweise":"Notes",
    "Getränk":"Drink","Getränke":"Drinks","Lebensmittel":"Food","Mahlzeit":"Meal","Mahlzeiten":"Meals","Wasser":"Water",
    "Anzahl":"Number","Reihenfolge":"Order","Ausführung":"Instructions","Variante":"Variant","Varianten":"Variants",
    "Größe":"Height","Taille":"Waist","Körperfett":"Body fat","Alter":"Age","Aktivität":"Activity",
    "Persönlich":"Personal","Persönliche":"Personal","persönlich":"personal","persönliche":"personal",
    "Speichern":"Save","Löschen":"Delete","Bearbeiten":"Edit","Fertig":"Done","Abbrechen":"Cancel","Zurück":"Back",
    "Hinzufügen":"Add","Übernehmen":"Apply","Auswählen":"Select","auswählen":"select","Wählen":"Choose","wählen":"choose",
    "Erstellen":"Create","erstellen":"create","Entfernen":"Remove","entfernen":"remove","Eintragen":"Log","eintragen":"log",
    "Berechnen":"Calculate","berechnen":"calculate","Ändern":"Change","ändern":"change","Starten":"Start","starten":"start",
    "Beenden":"Finish","beenden":"finish","Keine":"No","keine":"no","Kein":"No","kein":"no","Bereits":"Already","bereits":"already",
    "Aktuell":"Current","aktuell":"current","Nächster":"Next","Nächste":"Next","Vorheriger":"Previous","Vorherige":"Previous",
    "pro":"per","Zielbereich":"target range","Wert":"value","Werte":"values","Streak":"Streak"
   };
   x=x.replace(/[A-Za-zÄÖÜäöüß]+/g,w=>words[w]||w);
   return lead+x+tail
 }

 function translateTreeV31(root=document.body){
   if(langV31()!=="en")return;
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);
   nodes.forEach(n=>{
     const p=n.parentElement;
     if(!p||protectedV31(p)||["SCRIPT","STYLE","TEXTAREA"].includes(p.tagName))return;
     n.nodeValue=translateExactV31(n.nodeValue)
   });
   root.querySelectorAll?.("[placeholder]").forEach(el=>{
     if(!protectedV31(el))el.placeholder=translateExactV31(el.placeholder)
   });
   root.querySelectorAll?.("[aria-label]").forEach(el=>{
     if(!protectedV31(el))el.setAttribute("aria-label",translateExactV31(el.getAttribute("aria-label")))
   })
 }

 const oldTranslate=window.rethinkSystemV31?.translate;
 if(window.rethinkSystemV31){
   window.rethinkSystemV31.translate=(root=document.body)=>{
     try{oldTranslate?.(root)}catch{}
     translateTreeV31(root)
   }
 }

 // Translate browser dialogs without touching injected exercise/plan names.
 const oldAlert=window.alert.bind(window), oldConfirm=window.confirm.bind(window), oldPrompt=window.prompt.bind(window);
 window.alert=(msg)=>oldAlert(translateExactV31(String(msg)));
 window.confirm=(msg)=>oldConfirm(translateExactV31(String(msg)));
 window.prompt=(msg,def)=>oldPrompt(translateExactV31(String(msg)),def);

 // All newly rendered fixed UI gets translated as well.
 const mo=new MutationObserver(records=>{
   if(langV31()!=="en")return;
   const roots=new Set();
   records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)roots.add(n)}));
   roots.forEach(n=>translateTreeV31(n))
 });
 mo.observe(document.body,{childList:true,subtree:true});

 window.rethinkTranslateAllV31=()=>translateTreeV31(document.body);
 requestAnimationFrame(()=>translateTreeV31(document.body))
})();


/* Rethink_v3.1 — Plannamen müssen eindeutig sein */
(function(){
 function normalizedPlanNameV31(name){
   return String(name||"").trim().replace(/\s+/g," ").toLocaleLowerCase("de-DE")
 }
 function duplicatePlanNameV31(name,excludeId=null){
   const n=normalizedPlanNameV31(name);
   return !!n && (plans||[]).some(p=>String(p.id)!==String(excludeId??"") && normalizedPlanNameV31(p.name)===n)
 }
 function duplicateMessageV31(){
   const en=window.rethinkSystemV31?.prefs?.().language==="en";
   return en?"A plan with this name already exists. Please choose a different name.":"Ein Plan mit diesem Namen existiert bereits. Bitte wähle einen anderen Namen."
 }
 function guardEditorNameV31(){
   const input=$("planName"),name=input?.value?.trim();
   const exclude=currentPlan?._editingSourceId||currentPlan?.id||null;
   if(name&&duplicatePlanNameV31(name,exclude)){
     alert(duplicateMessageV31());
     try{input.focus();input.select()}catch{}
     return false
   }
   return true
 }
 window.rethinkPlanNameExistsV31=duplicatePlanNameV31;

 // Intercept plan-editor save/start actions before any existing mutation can occur.
 ["planSaveBtn","planPlayBtn"].forEach(id=>{
   const el=$(id);if(!el)return;
   el.addEventListener("click",e=>{
     if(!guardEditorNameV31()){e.preventDefault();e.stopImmediatePropagation()}
   },true)
 });

 // New-plan name field is checked on change/blur as early feedback too.
 document.addEventListener("change",e=>{
   if(e.target?.id!=="planName")return;
   const name=e.target.value.trim(),exclude=currentPlan?._editingSourceId||currentPlan?.id||null;
   if(name&&duplicatePlanNameV31(name,exclude)){
     alert(duplicateMessageV31());
     e.target.focus();e.target.select()
   }
 },true);

 // Final persistence guard: if legacy/new code attempts to append an exact duplicate,
 // remove only the newly appended duplicate and leave the existing plan untouched.
 let lastPlanIdsV31=new Set((plans||[]).map(p=>String(p.id)));
 const oldSaveAllV31=saveAll;
 saveAll=function(){
   if(Array.isArray(plans)){
     const seen=new Map(),remove=new Set();
     plans.forEach(p=>{
       const key=normalizedPlanNameV31(p.name);if(!key)return;
       if(!seen.has(key)){seen.set(key,p);return}
       const first=seen.get(key);
       // Prefer the pre-existing ID over a just-created duplicate.
       const firstOld=lastPlanIdsV31.has(String(first.id)),thisOld=lastPlanIdsV31.has(String(p.id));
       if(firstOld&&!thisOld)remove.add(String(p.id));
       else if(!firstOld&&thisOld){remove.add(String(first.id));seen.set(key,p)}
       else remove.add(String(p.id))
     });
     if(remove.size){
       plans=plans.filter(p=>!remove.has(String(p.id)));
       try{toast(duplicateMessageV31())}catch{}
     }
     lastPlanIdsV31=new Set(plans.map(p=>String(p.id)))
   }
   return oldSaveAllV31()
 }
})();


/* Rethink_v3.1 — Ernährungsziele direkt im Profil */
(function(){
 function calculateNutritionGoalsHomeV31(){
   const w=profileWeight(),age=Number(profile.age),height=Number(profile.height),sex=profile.sex,goal=profile.goal,activity=Number(profile.activity)||1.55,bf=currentBodyFatPct();
   if(!w){openMeasurementEntry();requestAnimationFrame(()=>{$("measureWeight")?.focus()});return}
   if(!age||!height||!sex||!goal){openProfileEditor();return}
   const bmr=energyBMR(w,height,age,sex,bf),tdee=bmr*activity,goalFactor=goal==="cut"?.80:goal==="gain"?1.03:.95;
   let kcal=Math.max(bmr*1.05,tdee*goalFactor)+measurementTrendAdjustment(goal);kcal=Math.round(kcal/25)*25;
   const protein=Math.round(w*1.6);
   // Weight-driven total-water target. Base = common minimum (~30 ml/kg) + realistic food-water share (~5 ml/kg).
   // For adults 51+ the DGE reference is closer to 30 ml/kg total, so do not add the extra 5 ml/kg there.
   const basePerKg=age>=51?30:35;
   let water=w*basePerKg+activityWaterExtra(activity);
   if(bf>0&&((sex==="male"&&bf<15)||(sex!=="male"&&bf<23)))water+=150;
   water=Math.max(1500,Math.min(5500,Math.round(water/50)*50));

   nutrition.calories=kcal;
   nutrition.protein=protein;
   nutrition.waterGoal=water;
   nutrition.waterGoalMode="auto";
   nutrition.goalCalculatedAt=Date.now();
   saveAll();
   renderProfile();
   const details=$("nutritionGoalsHome");
   if(details)details.open=true;
   try{toast("Ernährungsziele berechnet")}catch{}
 }
 function saveNutritionGoalsHomeV31(){
   nutrition.calories=Math.max(0,Number($("goalCaloriesHome")?.value)||0)||"";
   nutrition.protein=Math.max(0,Number($("goalProteinHome")?.value)||0)||"";
   nutrition.waterGoal=Math.max(0,Number($("goalWaterHome")?.value)||0)||"";
   nutrition.waterGoalMode="manual";
   saveAll();renderProfile();
   try{toast("Ernährungsziele gespeichert")}catch{}
 }
 function bindNutritionGoalsHomeV31(){
   const details=$("nutritionGoalsHome"),summaryCalc=$("calculateGoalsBtn"),expandedCalc=$("calculateGoalsExpanded"),save=$("goalSaveHome");
   if(summaryCalc){
     summaryCalc.onclick=e=>{e.preventDefault();e.stopPropagation();calculateNutritionGoalsHomeV31()}
   }
   if(expandedCalc)expandedCalc.onclick=e=>{e.preventDefault();calculateNutritionGoalsHomeV31()};
   if(save)save.onclick=e=>{e.preventDefault();saveNutritionGoalsHomeV31()};
   if(details){
     details.addEventListener("toggle",()=>{
       if(details.open){
         if($("goalCaloriesHome"))$("goalCaloriesHome").value=nutrition.calories||"";
         if($("goalProteinHome"))$("goalProteinHome").value=nutrition.protein||"";
         if($("goalWaterHome"))$("goalWaterHome").value=nutrition.waterGoal||"";
       }
     })
   }
 }
 document.addEventListener("DOMContentLoaded",bindNutritionGoalsHomeV31,{once:true});
 requestAnimationFrame(bindNutritionGoalsHomeV31);
})();


/* ReThink v3.1 — visible runtime correction M */
(function(){
 const migrationKey="rethink_v31_visible_catalog_20260821m";
 if(localStorage.getItem(migrationKey)!=="1"){
   try{
     const lib=read(STORAGE.library,{hidden:[]})||{hidden:[]};
     if(Array.isArray(lib.hidden)){
       lib.hidden=lib.hidden.filter(n=>!["Dead Hang","Calf Raises"].includes(String(n)));
       write(STORAGE.library,lib)
     }
   }catch{}
   localStorage.setItem(migrationKey,"1")
 }

 function normalizeMethodLabels(root=document){
   root.querySelectorAll?.(".method-name").forEach(el=>{
     if(String(el.textContent||"").trim().toLowerCase()==="normal")el.textContent="Standard"
   })
 }
 const mo=new MutationObserver(rs=>rs.forEach(r=>r.addedNodes.forEach(n=>{
   if(n.nodeType===1)normalizeMethodLabels(n)
 })));
 mo.observe(document.body,{childList:true,subtree:true});
 requestAnimationFrame(()=>normalizeMethodLabels(document));


})();

/* ReThink — final completed-day streak display */
(function(){
 function refreshCompletedStreaks(){
   const hs=window.hydrationStreakV56?.()||0,ns=window.nutritionStreakV56?.()||0;
   const hb=$("hydrationStreakBadge"),nb=$("nutritionStreakBadge");
   if(hb){const n=hb.querySelector("strong");if(n)n.textContent=String(hs);hb.classList.toggle("active",hs>0)}
   if(nb){const n=nb.querySelector("strong");if(n)n.textContent=String(ns);nb.classList.toggle("active",ns>0)}
   if(typeof renderProfileProgress==="function")renderProfileProgress()
 }
 window.refreshCompletedStreaks=refreshCompletedStreaks;
 __rt.profile.post.push(function(__result,...__args){
const r=__result;
refreshCompletedStreaks();return r
});
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(refreshCompletedStreaks,0)});
})();

/* ReThink v3.2 — Data & App hub, weekly summary and reminders */
(function(){
 const DATA_HUB_ID='rethinkDataAppHubV32';
 const WEEKLY_SEEN='rethink_weekly_summary_seen_v32_';
 const REMINDER_KEY='rethink_reminders_v32';
 const lang=()=>window.rethinkSystemV31?.prefs?.().language==='en'?'en':'de';
 const T=(de,en)=>lang()==='en'?en:de;
 const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 function monday(d){const x=new Date(d);x.setHours(0,0,0,0);const wd=x.getDay();x.setDate(x.getDate()-(wd===0?6:wd-1));return x}
 function summaryPeriod(now=new Date()){
   const wd=now.getDay();
   // Sunday = the week currently ending; Monday = the week that ended yesterday.
   const start=monday(now);if(wd===1)start.setDate(start.getDate()-7);
   const end=new Date(start);end.setDate(end.getDate()+7);return{start,end,id:key(start)}
 }
 function dayStatus(d){
   const k=key(d),food=(nutrition.foodLog||[]).filter(x=>x.date===k),drinks=hydrationLog().filter(x=>dateKeyLocal(Number(x.at))===k);
   const hydration=food.reduce((s,x)=>s+Number(x.water||0),0)+drinks.reduce((s,x)=>s+Number(x.size||0)*Number(x.hydration||0)/100,0);
   const calories=food.reduce((s,x)=>s+Number(x.kcal||0),0)+drinks.reduce((s,x)=>s+Number(x.caloriesPer250||0)*Number(x.size||0)/250,0);
   const waterGoal=hasGoalBasis()?hydrateGoal():Number(nutrition.waterGoal)||0,calGoal=Number(nutrition.calories)||0;
   return{hyd:drinks.length>=3&&waterGoal>0&&hydration>=waterGoal,nut:food.length>=3&&calGoal>0&&calories<=calGoal}
 }
 function weeklyData(period=summaryPeriod()){
   const workouts=(history||[]).filter(w=>{const t=Number(w.finishedAt||w.startedAt||0);return t>=period.start.getTime()&&t<period.end.getTime()});
   const trainingDays=new Set(workouts.map(w=>dateKeyLocal(Number(w.finishedAt||w.startedAt)))).size;
   let hyd=0,nut=0,both=0;for(let i=0;i<7;i++){const d=new Date(period.start);d.setDate(d.getDate()+i);const s=dayStatus(d);if(s.hyd)hyd++;if(s.nut)nut++;if(s.hyd&&s.nut)both++}
   const ms=(measurements||[]).filter(m=>Number(m.date)>=period.start.getTime()&&Number(m.date)<period.end.getTime()&&Number(m.weight)>0).sort((a,b)=>Number(a.date)-Number(b.date));
   const weight=ms.length>=2?Math.round((Number(ms.at(-1).weight)-Number(ms[0].weight))*10)/10:null;
   return{...period,workouts:workouts.length,trainingDays,hyd,nut,both,weight}
 }
 function weeklyHtml(d){
   const range=`${d.start.toLocaleDateString(lang()==='en'?'en-GB':'de-DE',{day:'2-digit',month:'2-digit'})} – ${new Date(d.end.getTime()-1).toLocaleDateString(lang()==='en'?'en-GB':'de-DE',{day:'2-digit',month:'2-digit',year:'numeric'})}`;
   return `<div class="card"><div class="small">${range}</div><div class="profile-progress-grid" style="margin-top:12px">
    <div class="progress-stat"><div class="small">${T('Trainingstage','Training days')}</div><strong>${d.trainingDays}/7</strong></div>
    <div class="progress-stat"><div class="small">${T('Workouts','Workouts')}</div><strong>${d.workouts}</strong></div>
    <div class="progress-stat"><div class="small">${T('Hydrierungsziel','Hydration goal')}</div><strong>${d.hyd}/7</strong></div>
    <div class="progress-stat"><div class="small">${T('Ernährungsziel','Nutrition goal')}</div><strong>${d.nut}/7</strong></div>
    <div class="progress-stat"><div class="small">${T('Beide Ziele','Both goals')}</div><strong>${d.both}/7</strong></div>
    <div class="progress-stat"><div class="small">${T('Gewicht','Weight')}</div><strong>${d.weight===null?'–':`${d.weight>0?'+':''}${d.weight} kg`}</strong></div>
   </div></div>`
 }
 function openWeeklySummary(){const d=weeklyData();openSheet(T('Wochenzusammenfassung','Weekly summary'),weeklyHtml(d));}
 window.openWeeklySummaryV32=openWeeklySummary;
 function maybeWeekly(){const now=new Date(),wd=now.getDay();if(wd!==0&&wd!==1)return;const p=summaryPeriod(now),seen=WEEKLY_SEEN+p.id;if(localStorage.getItem(seen)==='1')return;localStorage.setItem(seen,'1');setTimeout(openWeeklySummary,650)}

 function reminders(){return read(REMINDER_KEY,{drink:false,drinkTime:'10:00',food:false,foodTime:'12:00'})||{drink:false,drinkTime:'10:00',food:false,foodTime:'12:00'}}
 function saveReminders(x){write(REMINDER_KEY,x)}
 async function askNotifications(){
   if(!('Notification'in window))return alert(T('Mitteilungen werden von diesem Browser nicht unterstützt.','Notifications are not supported by this browser.'));
   if(Notification.permission==='granted')return toast(T('Mitteilungen sind erlaubt.','Notifications are enabled.'));
   const p=await Notification.requestPermission();toast(p==='granted'?T('Mitteilungen sind erlaubt.','Notifications are enabled.'):T('Mitteilungen wurden nicht erlaubt.','Notifications were not enabled.'))
 }
 function notify(title,body){if('Notification'in window&&Notification.permission==='granted'&&document.visibilityState==='visible'){try{new Notification(title,{body,icon:'./icons/icon-192.png'})}catch{}}}
 function reminderTick(){const r=reminders(),now=new Date(),hm=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,today=key(now);
   [['drink','drinkTime',T('Trinken','Hydration'),T('Zeit, etwas zu trinken.','Time to have a drink.')],['food','foodTime',T('Essen','Nutrition'),T('Zeit, an deine Ernährung zu denken.','Time to check in with your nutrition.')]].forEach(([on,tm,title,body])=>{
    const sent=`rethink_reminder_sent_${on}_${today}_${hm}`;if(r[on]&&r[tm]===hm&&!sessionStorage.getItem(sent)){sessionStorage.setItem(sent,'1');notify(title,body);try{toast(body)}catch{}}
   })
 }
 setInterval(reminderTick,30000);

 function deleteNutritionLog(){if(!confirm(T('Den gesamten Ernährungsverlauf wirklich löschen? Gespeicherte Lebensmittel, Mahlzeiten und Ziele bleiben erhalten.','Really delete the entire nutrition history? Saved foods, meals and goals will remain.')))return;nutrition.foodLog=[];nutrition.consumedCalories=0;nutrition.consumedProtein=0;saveAll();renderProfile();toast(T('Ernährungsverlauf gelöscht','Nutrition history deleted'));window.openSettingsPage?.()}
 function deleteAllNutrition(){if(!confirm(T('Alle Ernährungsdaten wirklich löschen? Verlauf, eigene Lebensmittel, Mahlzeiten und Ernährungsziele werden entfernt.','Really delete all nutrition data? History, custom foods, meals and nutrition goals will be removed.')))return;
   const drinks=nutrition.drinks||[];nutrition={calories:'',protein:'',waterGoal:'',hydration:0,consumedCalories:0,consumedProtein:0,foodLog:[],foods:[],meals:[],drinks};saveAll();renderProfile();toast(T('Ernährungsdaten gelöscht','Nutrition data deleted'));window.openSettingsPage?.()}
 window.rethinkDeleteAllNutrition=deleteAllNutrition;
 function deleteHydration(){if(!confirm(T('Den gesamten Hydrierungsverlauf wirklich löschen?','Really delete the entire hydration history?')))return;write(HYDRATION_LOG_KEY,[]);nutrition.hydration=0;saveAll();renderProfile();toast(T('Hydrierungsverlauf gelöscht','Hydration history deleted'));window.openSettingsPage?.()}


 // Weekly popup only once for the same week, on the first Sunday/Monday opening.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(maybeWeekly,900),{once:true});else setTimeout(maybeWeekly,900);
})();

/* Lean v6: an active workout never shows the start-training card. */
(function(){
 const old=window.renderTrainingHome||renderTrainingHome;
 
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){const c=document.getElementById('startTrainingCard');if(c)c.classList.toggle('hidden',!!activeWorkout)}})
})();


;

/* ReThink v24 — single input visibility controller */
(function(){
 const vv=window.visualViewport;
 const selector='input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="button"]):not([type="submit"]),textarea,select';
 let focused=null;
 function host(el){return el?.closest(".sheet-body")||el?.closest(".page")||document.scrollingElement}
 function keyboardOpen(){return !!vv && (window.innerHeight-vv.height-vv.offsetTop)>100}
 function keep(el){
   if(!el?.isConnected||document.activeElement!==el||!keyboardOpen())return;
   const h=host(el);if(!h)return;
   if(h!==document.scrollingElement&&h!==document.documentElement&&h!==document.body)h.style.paddingBottom=`${Math.max(120,window.innerHeight-vv.height+72)}px`;
   if(el.closest?.('.stable-entry-sticky')){if(h?.classList?.contains('sheet-body'))h.scrollTop=0;return}
   const r=el.getBoundingClientRect(),top=vv.offsetTop+70,bottom=vv.offsetTop+vv.height-18;let d=0;
   if(r.bottom>bottom)d=r.bottom-bottom+12;else if(r.top<top)d=r.top-top-8;
   if(Math.abs(d)<2)return;
   if(h===document.scrollingElement||h===document.documentElement||h===document.body)window.scrollBy(0,d);else h.scrollTop+=d
 }
 function settle(el){requestAnimationFrame(()=>keep(el));setTimeout(()=>keep(el),70);setTimeout(()=>keep(el),180)}
 window.rethinkKeepFieldVisibleV24=el=>{if(!el?.matches?.(selector))return;focused=el;if(keyboardOpen())settle(el)};
 document.addEventListener("focusin",e=>{const el=e.target?.closest?.(selector);if(el)focused=el},true);
 document.addEventListener("focusout",e=>{const old=e.target;setTimeout(()=>{const n=document.activeElement?.closest?.(selector);if(n){focused=n;if(keyboardOpen())settle(n)}else{const h=host(old);if(h?.style)h.style.paddingBottom="";focused=null}},50)},true);
 if(vv){
   vv.addEventListener("resize",()=>{const el=document.activeElement?.closest?.(selector)||focused;if(el&&keyboardOpen())settle(el)},true);
   vv.addEventListener("scroll",()=>{const el=document.activeElement?.closest?.(selector)||focused;if(el&&keyboardOpen())keep(el)},true)
 }
})();

/* ReThink v25 — tap workout header background to return to the top. */
(function(){
 const page=document.getElementById("livePage");if(!page)return;
 const top=page.querySelector(".page-top");if(!top)return;
 top.addEventListener("click",e=>{if(e.target.closest("button,input,a"))return;page.scrollTo({top:0,behavior:"smooth"})});
})();


/* ReThink v31 — keep sheets within the visible viewport, including iOS keyboard. */
(function(){const vv=window.visualViewport;function sync(){document.documentElement.style.setProperty('--rethink-vvh',`${Math.round(vv?.height||window.innerHeight)}px`)}sync();vv?.addEventListener('resize',sync);vv?.addEventListener('scroll',sync);window.addEventListener('resize',sync)})();



/* ReThink v49 — profile timeline: selected day is a complete read-only historical state */
(function(){
 const STATE_KEY='rethink_profile_state_history_v49';
 const activityLabel=v=>{
   const n=Number(v);if(n<=1.21)return'wenig aktiv';if(n<=1.38)return'leicht aktiv';if(n<=1.56)return'moderat aktiv';if(n<=1.73)return'sehr aktiv';return'extrem aktiv'
 };
 const dayEnd=()=>{const d=profileDate();d.setHours(23,59,59,999);return d.getTime()};
 const dayStart=()=>{const d=profileDate();d.setHours(0,0,0,0);return d.getTime()};
 const selectedKey=()=>profileDateKey();
 const isPast=()=>profileDayOffset<0;
 function loadStates(){const x=read(STATE_KEY,[]);return Array.isArray(x)?x:[]}
 function stateSignature(){return JSON.stringify({
   age:profile.age||'',height:profile.height||'',sex:profile.sex||'',goal:profile.goal||'',targetWeight:profile.targetWeight||'',activity:profile.activity||'',
   calories:nutrition.calories||'',protein:nutrition.protein||'',waterGoal:nutrition.waterGoal||'',waterGoalMode:nutrition.waterGoalMode||''
 })}
 function recordState(){
   if(profileDayOffset!==0)return;
   const list=loadStates(),sig=stateSignature(),last=list.at(-1);
   if(last?.sig===sig)return;
   list.push({at:Date.now(),sig,state:JSON.parse(sig)});
   write(STATE_KEY,list.slice(-500))
 }
 function historicalSettings(cutoff){
   const list=loadStates().filter(x=>Number(x.at)<=cutoff);
   if(list.length)return list.at(-1).state||{};
   return {age:profile.age||'',height:profile.height||'',sex:profile.sex||'',goal:profile.goal||'',targetWeight:profile.targetWeight||'',activity:profile.activity||'',calories:nutrition.calories||'',protein:nutrition.protein||'',waterGoal:nutrition.waterGoal||'',waterGoalMode:nutrition.waterGoalMode||''}
 }
 function measurementAt(cutoff){return measurements.filter(m=>Number(m.date||0)<=cutoff).slice().sort((a,b)=>Number(a.date)-Number(b.date)).at(-1)||null}
 function measurementRows(cutoff,key='weight'){return measurements.filter(m=>Number(m.date||0)<=cutoff&&Number(m[key])>0).slice().sort((a,b)=>Number(a.date)-Number(b.date))}
 function historicalActivity(cutoff,settings){
   const m=measurementAt(cutoff);if(m?.activity)return m.activity;
   const states=loadStates().slice().sort((a,b)=>Number(a.at)-Number(b.at));
   const before=states.filter(x=>Number(x.at)<=Number(cutoff)&&x.state?.activity).at(-1);
   const earliest=states.find(x=>x.state?.activity);
   return before?.state?.activity||settings.activity||earliest?.state?.activity||profile.activity||1.55
 }
 function historicalWeight(cutoff){const m=measurementRows(cutoff,'weight').at(-1);return Number(m?.weight||0)}
 function weekInfoAtSelected(){
   const d=profileDate(),wd=d.getDay()||7,start=new Date(d);start.setDate(d.getDate()-wd+1);start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+7);
   const th=new Date(start);th.setDate(th.getDate()+3);const ys=new Date(th.getFullYear(),0,1),week=Math.ceil((((th-ys)/86400000)+ys.getDay()+1)/7);return{start,end,week}
 }
 function workoutDaysForSelectedWeek(){const {start,end}=weekInfoAtSelected();return new Set((history||[]).filter(w=>{const t=Number(w.finishedAt||w.startedAt||0);return t>=start.getTime()&&t<end.getTime()&&t<=dayEnd()}).map(w=>dateKeyLocal(Number(w.finishedAt||w.startedAt)))).size}
 function dayData(date,settings){
   const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
   const foods=(nutrition.foodLog||[]).filter(x=>x.date===key),drinks=hydrationLog().filter(x=>dateKeyLocal(Number(x.at))===key);
   const hydration=foods.reduce((s,x)=>s+Number(x.water||0),0)+drinks.reduce((s,x)=>s+Number(x.size||0)*Number(x.hydration||0)/100,0);
   const calories=foods.reduce((s,x)=>s+Number(x.kcal||0),0)+drinks.reduce((s,x)=>s+Number(x.caloriesPer250||0)*Number(x.size||0)/250,0);
   const waterGoal=Number(settings.waterGoal||nutrition.waterGoal||0),calorieGoal=Number(settings.calories||nutrition.calories||0),goal=String(settings.goal||profile.goal||'cut');
   // Nutrition streak only starts after at least three food/meal entries. Caloric drinks still count toward calories, but not toward the minimum entry count.
   const nutritionLogged=foods.length>=3;
   let nutritionDone=false;
   if(nutritionLogged&&calorieGoal>0){
     if(goal==='gain')nutritionDone=calories>=calorieGoal;
     else if(goal==='maintain')nutritionDone=Math.abs(calories-calorieGoal)<=calorieGoal*.05;
     else nutritionDone=calories<=calorieGoal;
   }
   return{hydrationDone:drinks.length>=3&&waterGoal>0&&hydration>=waterGoal,nutritionDone}
 }
 function streakAt(kind){
   let d=profileDate();d.setHours(12,0,0,0);if(profileDayOffset===0)d.setDate(d.getDate()-1);
   let count=0;
   for(let i=0;i<3660;i++){
     const settings=historicalSettings(new Date(d).setHours(23,59,59,999)),x=dayData(d,settings),ok=kind==='hydration'?x.hydrationDone:kind==='nutrition'?x.nutritionDone:(x.hydrationDone&&x.nutritionDone);
     if(!ok)break;count++;d=new Date(d);d.setDate(d.getDate()-1)
   }return count
 }
 let profileChartMetricV72=localStorage.getItem('rethink_profile_chart_metric_v72')||'weight';
 function renderHistoricalCharts(cutoff){
   const el=$('measurementCharts');if(!el)return;
   const defs={weight:{label:'Gewicht',unit:'kg',stroke:'#cdb0e8'},bodyFat:{label:'Körperfett',unit:'%',stroke:'#e7a8c8'},waist:{label:'Taille',unit:'cm',stroke:'#9ac7e8'},chest:{label:'Brust',unit:'cm',stroke:'#a9d7b1'},hip:{label:'Hüfte',unit:'cm',stroke:'#e6c48f'}};
   if(!defs[profileChartMetricV72])profileChartMetricV72='weight';
   const d=defs[profileChartMetricV72],rows=measurementRows(cutoff,profileChartMetricV72),tabs=Object.entries(defs).map(([k,v])=>`<button type="button" class="profile-chart-chip ${k===profileChartMetricV72?'active':''}" data-profile-chart="${k}" style="--chart-color:${v.stroke}">${v.label}</button>`).join('');
   let graph='<div class="empty-chart-line"></div><div class="chart-range chart-dates"><span>Noch keine Messung</span><span>–</span></div>';
   let latest='Noch keine Messung';
   if(rows.length){
     const vals=rows.map(x=>Number(x[profileChartMetricV72])).filter(Number.isFinite),min=Math.min(...vals),max=Math.max(...vals),span=Math.max(.001,max-min),w=280,h=82,pad=10,bottom=h-20,ph=h-34;
     const y=v=>bottom-((v-min)/span)*ph,pts=vals.map((v,i)=>`${pad+(vals.length===1?0:(i/(vals.length-1))*(w-pad*2))},${y(v)}`).join(' '),last=rows.at(-1),graphic=vals.length===1?`<circle cx="${pad}" cy="${y(vals[0])}" r="3.5" fill="${d.stroke}"/>`:`<polyline points="${pts}" fill="none" stroke="${d.stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
     latest=`${vals.at(-1)} ${d.unit}`;graph=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${d.label} Verlauf">${graphic}</svg><div class="chart-range chart-dates"><span>Zu Beginn<br><b>${vals[0]} ${d.unit}</b></span><span>${new Date(last.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'2-digit'})}<br><b>${vals.at(-1)} ${d.unit}</b></span></div>`
   }
   el.innerHTML=`<div class="profile-chart card compact-profile-chart"><div class="space"><strong>Messverlauf</strong><span class="small">${d.label}: ${latest}</span></div><div class="profile-chart-tabs">${tabs}</div>${graph}</div>`;
   el.querySelectorAll('[data-profile-chart]').forEach(b=>b.onclick=()=>{profileChartMetricV72=b.dataset.profileChart;localStorage.setItem('rethink_profile_chart_metric_v72',profileChartMetricV72);renderHistoricalCharts(cutoff)})
 }
 function renderHistoricalProgress(){
   const el=$('profileProgressOverview');if(!el)return;const cutoff=dayEnd(),settings=historicalSettings(cutoff),rows=measurementRows(cutoff,'weight'),cur=rows.length?Number(rows.at(-1).weight):null,target=Number(settings.targetWeight||profile.targetWeight||0)||null,distance=cur!=null&&target!=null?Math.round(Math.abs(target-cur)*10)/10:null,wk=weekInfoAtSelected(),train=workoutDaysForSelectedWeek(),streak=streakAt('combined');
   el.innerHTML=`<div class="section-head"><h2>Fortschritt</h2></div><div class="profile-progress-grid"><div class="card progress-stat"><div class="small">Gewichtstrend</div><strong>${cur!=null?`${cur} kg`:'–'}</strong><span class="progress-sub-value">${distance!=null?`${distance} kg bis Ziel`:'–'}</span></div><div class="card progress-stat"><div class="small">Gemeinsamer Streak</div><strong>${streak}</strong></div><div class="card progress-stat training-week-stat"><div class="small">Trainingstage</div><span class="progress-sub-label">KW ${wk.week}</span><strong>${train}/7</strong></div></div>`
 }
 function annotateMeasurements(cutoff){
   let changed=false;
   (measurements||[]).forEach(m=>{if(!m.activity){m.activity=String(historicalActivity(Number(m.date||cutoff),historicalSettings(Number(m.date||cutoff))));changed=true}});
   if(changed)try{saveAll()}catch{}
   document.querySelectorAll('[data-measurement-open]').forEach(btn=>{
     const idx=Number(btn.dataset.measurementOpen),m=measurements[idx];if(!m)return;const strong=btn.querySelector('strong');if(strong&&m.weight){const a=activityLabel(m.activity||historicalActivity(Number(m.date||cutoff),historicalSettings(Number(m.date||cutoff))));const u=window.rethinkPrefsV31;strong.textContent=`${u?.weightDisplay?u.weightDisplay(m.weight):m.weight} ${u?.weightLabel?u.weightLabel().toLowerCase():'kg'} · ${a}`}
   })
 }
 function lockPastProfile(){
   const root=$('tab-profile');if(!root)return;root.classList.toggle('profile-history-readonly',isPast());
   // Undo only the controls that the history view disabled itself.
   root.querySelectorAll('[data-profile-history-locked="1"]').forEach(el=>{el.removeAttribute('disabled');el.removeAttribute('aria-disabled');delete el.dataset.profileHistoryLocked});
   root.querySelectorAll('[data-profile-history-pointer="1"]').forEach(el=>{el.style.pointerEvents='';delete el.dataset.profileHistoryPointer});
   const next=$('profileNextDay');if(next)next.disabled=profileDayOffset>=0;
   if(!isPast())return;
   root.querySelectorAll('button,input,select,textarea,details').forEach(el=>{if(el.id==='profilePrevDay'||el.id==='profileNextDay'||el.disabled)return;el.dataset.profileHistoryLocked='1';el.setAttribute('disabled','disabled');el.setAttribute('aria-disabled','true')});
   root.querySelectorAll('[data-edit-food-entry],[data-edit-drink-entry],[data-measurement-open]').forEach(el=>{el.dataset.profileHistoryPointer='1';el.style.pointerEvents='none'})
 }
 function patchHistoricalState(){
   recordState();const cutoff=dayEnd();
   const settings=profileDayOffset===0?{age:profile.age||'',height:profile.height||'',sex:profile.sex||'',goal:profile.goal||'',targetWeight:profile.targetWeight||'',activity:profile.activity||'',calories:nutrition.calories||'',protein:nutrition.protein||'',waterGoal:nutrition.waterGoal||'',waterGoalMode:nutrition.waterGoalMode||''}:historicalSettings(cutoff);
   const m=measurementAt(cutoff),weight=profileDayOffset===0?Number(measurements.slice().sort((a,b)=>Number(a.date)-Number(b.date)).at(-1)?.weight||profile.weight||0):historicalWeight(cutoff),activity=profileDayOffset===0?(profile.activity||m?.activity||1.55):historicalActivity(cutoff,settings);
   const uHist=window.rethinkPrefsV31;if($('profileSummary'))$('profileSummary').textContent=[settings.age?settings.age+' J.':'',settings.height?`${uHist?.lengthDisplay?uHist.lengthDisplay(settings.height):settings.height} ${uHist?.lengthLabel?uHist.lengthLabel().toLowerCase():'cm'}`:'',weight?`${uHist?.weightDisplay?uHist.weightDisplay(weight):weight} ${uHist?.weightLabel?uHist.weightLabel().toLowerCase():'kg'} · ${activityLabel(activity)}`:''].filter(Boolean).join(' · ')||'Noch nicht eingerichtet';
   const goal=settings.goal||profile.goal,target=settings.targetWeight||profile.targetWeight;
   if($('profileGoalSummary'))$('profileGoalSummary').innerHTML=`<span>${goal==='cut'?'Ziel: Gewicht reduzieren':goal==='gain'?'Ziel: Muskelaufbau':goal==='maintain'?'Ziel: Gewicht halten':'Persönliche Werte und Ziele'}</span>${target?`<span class="target-weight-line-profile">Wunschgewicht ${esc(uHist?.weightDisplay?uHist.weightDisplay(target):target)} ${uHist?.weightLabel?uHist.weightLabel().toLowerCase():'kg'}</span>`:''}`;
   if($('nutritionCalTarget'))$('nutritionCalTarget').textContent=settings.calories?`${settings.calories} kcal`:'–';
   if($('nutritionHydrationTarget'))$('nutritionHydrationTarget').textContent=settings.waterGoal?`${settings.waterGoal} ml`:'–';
   const hb=$('hydrationStreakBadge'),nb=$('nutritionStreakBadge'),hs=streakAt('hydration'),ns=streakAt('nutrition');if(hb){hb.querySelector('strong').textContent=hs;hb.classList.toggle('active',hs>0)}if(nb){nb.querySelector('strong').textContent=ns;nb.classList.toggle('active',ns>0)}
   const heads=document.querySelectorAll('#tab-profile .section-head h2');heads.forEach(h=>{if(h.textContent.startsWith('Hydrierung'))h.textContent=isPast()?'Hydrierung':'Hydrierung heute';if(h.textContent.startsWith('Ernährung'))h.textContent=isPast()?'Ernährung':'Ernährung heute'});
   renderHistoricalCharts(cutoff);renderHistoricalProgress();annotateMeasurements(cutoff);lockPastProfile()
 }
 // Do not allow browsing into the future; past days are snapshots, not editors.
 changeProfileDay=function(delta){profileDayOffset=Math.min(0,profileDayOffset+delta);localStorage.setItem(PROFILE_DAY_OFFSET_KEY,String(profileDayOffset));renderProfile();requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}))};
 __rt.profile.post.push(function(__result,...__args){
const r=__result;
patchHistoricalState();return r
});
 // Any caller that redraws only progress must still respect the selected profile date.
 __rt.profileProgress.core=function(){renderHistoricalProgress()};
 const saveBefore=saveAll;
 saveAll=function(){const r=saveBefore();try{recordState()}catch{}return r};
 try{recordState();renderProfile()}catch(e){console.error('v49 profile timeline',e)}
})();


/* ReThink v51 — settings interaction reliability on iOS/local preview. */
(function(){
 document.addEventListener('click',e=>{
   const t=e.target.closest?.('#settingsBackupExport,#settingsBackupRestore,#openHydrationData');if(!t)return;
   if(t.id==='openHydrationData'&&e.target.closest('#clearHydrationDataBtn'))return;
   e.preventDefault();e.stopPropagation();
   if(t.id==='settingsBackupExport')window.rethinkBackup?.export?.();
   else if(t.id==='settingsBackupRestore')window.rethinkBackup?.restore?.();
   else if(t.id==='openHydrationData')openHydrationData();
 },true);
})();


/* RETHINK 2026-09-12F — single authoritative reliability layer.
   Important: no overrides of workout finish or custom-exercise editor live here.
   Those are owned by app-core.js so their handlers cannot fight duplicate patches. */
(()=>{
 const el=id=>document.getElementById(id);
 const same=(a,b)=>String(a)===String(b);
 const stop=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()};

 // Plan save/delete reliability only. One handler, independent of numeric/string ids.
 function planSave(){
   if(!currentPlan)return false;
   const name=String(el('planName')?.value||currentPlan.name||'').trim();
   if(!name){alert('Bitte Planname eingeben.');return false}
   if(!(currentPlan.exercises||[]).length){alert('Ein Trainingsplan braucht mindestens eine Übung.');return false}
   currentPlan.name=name;
   const source=currentPlan._editingSourceId;
   let saved=clone(currentPlan);saved.updatedAt=Date.now();delete saved._isNew;delete saved._editingSourceId;delete saved._originalName;
   if(source!=null){
     const i=plans.findIndex(p=>same(p.id,source));
     if(i>=0){saved.id=plans[i].id;saved.createdAt=plans[i].createdAt||saved.createdAt||Date.now();plans[i]=clone(saved)}
     else{saved.id=uid();saved.createdAt=Date.now();plans.push(clone(saved))}
   }else{
     const i=plans.findIndex(p=>same(p.id,saved.id));
     if(i>=0)plans[i]=clone(saved);else plans.push(clone(saved));
   }
   currentPlan=clone(saved);editorDirty=false;saveAll();try{setEditorBaseline()}catch{};renderPlans();renderWeek();toast('Plan gespeichert');return true
 }
 function closeEditorToPlans(){
   try{closeSheet({all:true})}catch{}
   document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));pageStack=[];
   el('bottomNav')?.classList.remove('hidden');showTab('plans',{reset:true});renderPlans();renderWeek();
 }
 function planDelete(id){
   const p=plans.find(x=>same(x.id,id));if(!p)return false;
   if(!confirm(`„${p.name}“ wirklich löschen?`))return false;
   plans=plans.filter(x=>!same(x.id,id));
   weekPlan=(weekPlan||[]).map(day=>Array.isArray(day)?day.filter(x=>!same(x,id)):(same(day,id)?[]:day));
   saveAll();renderPlans();renderWeek();renderTrainingHome();toast('Plan gelöscht');return true
 }
 document.addEventListener('click',e=>{
   const b=e.target.closest?.('button');if(!b)return;
   if(b.id==='planSaveBtn'||b.id==='confirmPlanSave'||b.id==='confirmExistingPlanSave'||b.id==='backSavePlan'){
     stop(e);if(planSave())closeEditorToPlans();return
   }
   if(b.matches('[data-quick-delete],[data-swipe-delete]')){
     stop(e);planDelete(b.dataset.quickDelete||b.dataset.swipeDelete);return
   }
 },true);

 // Profile must visibly reflect saved data after every render. Core owns saving and buttons.
 function refreshProfileVisible(){
   try{
     const u=window.rethinkPrefsV31||{};
     const wDisp=v=>u.weightDisplay?u.weightDisplay(v):v;
     const wLabel=()=>u.weightLabel?u.weightLabel().toLowerCase():'kg';
     const lDisp=v=>u.lengthDisplay?u.lengthDisplay(v):v;
     const lLabel=()=>u.lengthLabel?u.lengthLabel().toLowerCase():'cm';
     const box=el('profileInputOverview');
     if(box){
       const latest=(measurements||[]).slice().sort((a,b)=>Number(a.date)-Number(b.date)).at(-1);
       const w=Number(latest?.weight||profile.weight||0);
       const a=profile.activity?activityLabel(profile.activity):'–';
       const sex=profile.sex==='male'?'Männlich':profile.sex==='female'?'Weiblich':'–';
       const goal=profile.goal==='cut'?'Abnehmen':profile.goal==='gain'?'Zunehmen':profile.goal==='maintain'?'Halten':'–';
       const h=profile.height?lDisp(profile.height):'';
       const tw=profile.targetWeight?wDisp(profile.targetWeight):'';
       box.innerHTML=`<div><span>Alter</span><strong>${profile.age?`${profile.age} J.`:'–'}</strong></div><div><span>Größe</span><strong>${h?`${h} ${lLabel()}`:'–'}</strong></div><div><span>Gewicht</span><strong>${w?`${wDisp(w)} ${wLabel()}`:'–'}</strong></div><div><span>Geschlecht</span><strong>${sex}</strong></div><div><span>Ziel</span><strong>${goal}</strong></div><div><span>Wunschgewicht</span><strong>${tw?`${tw} ${wLabel()}`:'–'}</strong></div><div><span>Aktivität</span><strong>${esc(a)}</strong></div>`;
     }
     const drinks=typeof todayHydrationEntries==='function'?todayHydrationEntries():[];
     const foods=typeof todayFoodEntries==='function'?todayFoodEntries():[];
     if(typeof renderMeasurementCharts==='function')renderMeasurementCharts();
   }catch(err){console.error('profile refresh',err)}
 }
 if(window.__rt?.profile?.post)window.__rt.profile.post.push(()=>refreshProfileVisible());
 requestAnimationFrame(()=>{try{refreshProfileVisible()}catch{}});
})();


/* VERIFIED FIX 2026-09-12: stable current profile + live recommendation integrity. */
(function(){
  if(window.__rt?.live?.post){
    window.__rt.live.post.push(function(result){
      try{
        if(!activeWorkout)return result;
        document.querySelectorAll('#liveBody .live-exercise-card[data-live-card]').forEach(card=>{
          if(card.querySelector('.live-recommendation'))return;
          const members=String(card.dataset.liveMembers||'').split(',').filter(Boolean).map(Number).filter(Number.isFinite);
          const idx=Number(card.dataset.liveCard);
          let html='';
          if(members.length>1&&window.rethinkRecommendationGroupHtml)html=window.rethinkRecommendationGroupHtml(members);
          else if(activeWorkout.exercises?.[idx]&&window.rethinkRecommendationHtml)html=window.rethinkRecommendationHtml(activeWorkout.exercises[idx]);
          if(!html)return;
          const anchor=members.length>1?(card.querySelector('.combined-series-head')||card.querySelector('.method-help')):(card.querySelector('.note-line')||card.querySelector('.live-card-head')||card.querySelector('.method-help'));
          anchor?.insertAdjacentHTML('afterend',html);
        });
      }catch(err){console.error('verified live recommendation',err)}
      return result;
    });
  }
})();

/* RETHINK 2026-09-13 — profile controls: one capture-level interaction authority. */
(()=>{
 const actions={
  editProfileBtn:()=>openProfileEditor(), addMeasurementBtn:()=>openMeasurementEntry(), addWaterBtn:()=>openQuickDrinkEntry(),
  addFoodTodayBtn:()=>openFoodSearch(""), settingsBtn:()=>openSettingsPage(), calculateGoalsBtn:()=>calculateProfileGoals(),
  profilePrevDay:()=>changeProfileDay(-1), profileNextDay:()=>{if(profileDayOffset<0)changeProfileDay(1)}
 };
 document.addEventListener('click',ev=>{
  const el=ev.target?.closest?.('#editProfileBtn,#addMeasurementBtn,#addWaterBtn,#addFoodTodayBtn,#settingsBtn,#calculateGoalsBtn,#profilePrevDay,#profileNextDay');
  if(!el||!el.closest('#tab-profile')||el.disabled)return;
  const fn=actions[el.id];if(!fn)return;ev.preventDefault();ev.stopImmediatePropagation();fn();
 },true);
})();
