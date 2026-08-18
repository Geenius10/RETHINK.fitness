"use strict";
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
  if(drafts.some(d=>Number.isFinite(Number(d._draftOrder))))drafts.sort((a,b)=>(Number.isFinite(Number(a._draftOrder))?Number(a._draftOrder):999)-(Number.isFinite(Number(b._draftOrder))?Number(b._draftOrder):999));
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
  if(memberGroup){normalizeGroupCollection(collection,memberGroup.id);if(liveContext){collection.filter(x=>x.techniqueGroup===memberGroup.id).forEach(x=>x.liveSets=rebuildLiveSetsForExercise(x,x.liveSets||[]))}}
  if(liveContext){livePlanEdited=true;saveAll();renderLive()}else{markEditorDirty();renderEditorExercises();persistUI()}
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
 const SET_OPTIONS={
  standard:[1,2,3,4,5,6],
  superset:[2,3,4,5],
  giant:[2,3,4],
  preexhaust:[2,3,4],
  dropset:[1,2,3,4],
  restpause:[1,2,3],
  cluster:[2,3,4,5,6],
  pyramid:[3,4,5,6,7],
  backoff:[2,3,4,5]
 };
 const DEFAULT_SETS={standard:3,superset:3,giant:3,preexhaust:3,dropset:2,restpause:1,cluster:3,pyramid:4,backoff:3};
 function optionsForMethod(m){return SET_OPTIONS[m]||SET_OPTIONS.standard}
 function nearestSetCount(m,value){const a=optionsForMethod(m),n=Number(value);if(a.includes(n))return n;const d=DEFAULT_SETS[m]||3;return a.includes(d)?d:a[0]}
 function setOptionsMarkup(e){e.sets=nearestSetCount(e.setTechnique||'standard',e.sets);return optionsForMethod(e.setTechnique||'standard').map(n=>`<option value="${n}" ${Number(e.sets)===n?'selected':''}>${n}</option>`).join('')}
 window.methodSetOptions=optionsForMethod;

 // Pyramid = repetitions only. Direction means LOAD up/down; reps move inversely.
 function pyramidDirection(e){return e.methodData?.pyramidDirection==='loadDown'?'loadDown':'loadUp'}
 function nextPyramidRep(prev,dir){const p=Math.max(1,Math.min(30,Number(prev)||1));return dir==='loadDown'?Math.min(30,p+2):Math.max(1,p-2)}
 function buildPyramidReps(first,sets,dir){const out=[Math.max(1,Math.min(30,Number(first)||(dir==='loadDown'?6:12)))];while(out.length<sets)out.push(nextPyramidRep(out[out.length-1],dir));return out}
 window.pyramidPctForSets=function(sets,dir='loadUp'){
  sets=Math.max(3,Number(sets)||4);const low=sets<=3?80:sets===4?70:60,step=(100-low)/(sets-1);
  const a=Array.from({length:sets},(_,i)=>Math.round((low+step*i)/5)*5);return dir==='loadDown'?a.reverse():a
 };
 window.ensurePyramidData=function(e){
  e.methodData=e.methodData||{};e.measureMode='reps';e.sets=nearestSetCount('pyramid',e.sets);
  let dir=e.methodData.pyramidDirection;
  const old=Array.isArray(e.methodData.reps)?e.methodData.reps.map(Number).filter(Number.isFinite):[];
  if(!dir){dir=old.length>1&&old[1]>old[0]?'loadDown':'loadUp';e.methodData.pyramidDirection=dir;e.methodData.reps=buildPyramidReps(old[0]||(dir==='loadDown'?6:12),e.sets,dir)}
  else if(old.length!==e.sets){const seed=old[0]||(dir==='loadDown'?6:12);e.methodData.reps=buildPyramidReps(seed,e.sets,dir)}
  else e.methodData.reps=old.length?old:buildPyramidReps(dir==='loadDown'?6:12,e.sets,dir);
  e.methodData.weightPct=window.pyramidPctForSets(e.sets,dir)
 };
 window.prepareDraftForTargetMethod=function(e,method,oldGroupCount=1){
  const prev=e.setTechnique||'standard';basePrepare(e,method,oldGroupCount);
  e.sets=nearestSetCount(method,prev===method?e.sets:(DEFAULT_SETS[method]||e.sets));
  if(method==='pyramid'){e.measureMode='reps';e.methodData=e.methodData||{};e.methodData.pyramidDirection='loadUp';e.methodData.reps=buildPyramidReps(12,e.sets,'loadUp');e.methodData.weightPct=window.pyramidPctForSets(e.sets,'loadUp')}
  return e
 };
 window.validateExerciseDraft=function(e){
  const m=e?.setTechnique||'standard';if(m==='pyramid'&&e.measureMode==='time')return 'Pyramidentraining wird über Wiederholungen konfiguriert, nicht über Zeit.';
  const n=Number(e?.sets),allowed=optionsForMethod(m);if(!allowed.includes(n))return `Für ${METHOD_LABEL[m]||m} bitte ${allowed[0]}–${allowed[allowed.length-1]} Sätze wählen.`;
  return baseValidate(e)
 };

 // Cleaner method explanations: the target number is shown in the prescription/progress, not repeated in the help text.
 METHOD_HELP.restpause='Gesamtwiederholungen in kurzen Teilblöcken sammeln. Sobald das Ziel erreicht ist, entfallen weitere Rest-Pause-Blöcke.';
 METHOD_HELP.cluster='Gesamtwiederholungen in kurzen Clustern sammeln. Leere Folgefelder können aus der ersten Eingabe übernommen werden.';
 METHOD_HELP.pyramid='Satzweise steigt oder sinkt die Last; die Wiederholungen verlaufen gegenläufig. Jeder Satz bleibt manuell anpassbar.';
 METHOD_HELP.backoff='Auf einen schweren Top-Satz folgen leichtere Back-off-Sätze mit höherer Wiederholungszahl.';

 window.methodRepConfigMarkup=function(e,prefix){
  if(e.setTechnique==='pyramid'){
   ensurePyramidData(e);const dir=pyramidDirection(e);
   return `<div class="pyramid-config"><div class="pyramid-config-head"><div class="form-field"><label>PYRAMIDE</label><select id="${prefix}PyrDirection" class="field"><option value="loadUp" ${dir==='loadUp'?'selected':''}>Last steigern · WDH. sinken</option><option value="loadDown" ${dir==='loadDown'?'selected':''}>Last senken · WDH. steigen</option></select></div></div><div class="small">WDH. JE SATZ</div>${e.methodData.reps.map((r,i)=>`<div class="pyramid-config-row"><span>Satz ${i+1}</span><input id="${prefix}PyrRep${i}" class="field" inputmode="numeric" value="${r}"><span>${e.methodData.weightPct[i]}%</span></div>`).join('')}</div>`
  }
  if(e.setTechnique==='backoff'){e.methodData=e.methodData||{};const top=Number(e.methodData.topReps)||5,back=Math.max(top+1,Number(e.methodData.backoffReps)||8),pct=Number(e.methodData.backoffPercent)||15;return`<div class="grid2"><div class="form-field"><label>TOP-SATZ WDH.</label><select id="${prefix}TopReps" class="field">${Array.from({length:10},(_,i)=>i+1).map(n=>`<option ${n===top?'selected':''}>${n}</option>`).join('')}</select></div><div class="form-field"><label>BACK-OFF WDH.</label><select id="${prefix}BackReps" class="field">${[6,7,8,9,10,11,12].filter(n=>n>top).map(n=>`<option ${n===back?'selected':''}>${n}</option>`).join('')}</select></div></div><div class="form-field"><label>GEWICHT REDUZIEREN %</label><select id="${prefix}BackPct" class="field">${[5,10,15,20,25,30].map(n=>`<option ${n===pct?'selected':''}>${n}</option>`).join('')}</select></div>`}
  return repPresetMarkup(e)
 };
 window.saveMethodRepConfig=function(e,prefix){
  e.methodData=e.methodData||{};
  if(e.setTechnique==='pyramid'){
   const dir=$(`${prefix}PyrDirection`)?.value||pyramidDirection(e);e.methodData.pyramidDirection=dir;
   e.methodData.reps=Array.from({length:Number(e.sets)||3},(_,i)=>Math.max(1,Number($(`${prefix}PyrRep${i}`)?.value)||Number(e.methodData.reps?.[i])||1));
   e.methodData.weightPct=window.pyramidPctForSets(e.sets,dir)
  }
  if(e.setTechnique==='backoff'){e.methodData.topReps=Math.max(1,Number($(`${prefix}TopReps`)?.value)||5);e.methodData.backoffReps=Math.min(12,Math.max(e.methodData.topReps+1,Number($(`${prefix}BackReps`)?.value)||8));e.methodData.backoffPercent=Math.max(0,Number($(`${prefix}BackPct`)?.value)||15)}
 };
 function bindPyramidCascade(e,prefix,rerender){
  if(e.setTechnique!=='pyramid')return;ensurePyramidData(e);
  const dirSel=$(`${prefix}PyrDirection`);if(dirSel)dirSel.onchange=()=>{e.methodData.pyramidDirection=dirSel.value;e.methodData.reps=buildPyramidReps(Number($(`${prefix}PyrRep0`)?.value)||e.methodData.reps[0],e.sets,dirSel.value);e.methodData.weightPct=window.pyramidPctForSets(e.sets,dirSel.value);rerender()};
  e.methodData.reps.forEach((_,i)=>{const inp=$(`${prefix}PyrRep${i}`);if(!inp)return;inp.oninput=()=>{const val=Math.max(1,Math.min(30,Number(inp.value)||1));e.methodData.reps[i]=val;for(let j=i+1;j<e.sets;j++){e.methodData.reps[j]=nextPyramidRep(e.methodData.reps[j-1],pyramidDirection(e));const follow=$(`${prefix}PyrRep${j}`);if(follow)follow.value=e.methodData.reps[j]}}})
 }

 // One familiar add/edit mask for all exercise actions, now with method-aware set counts.
 window.renderPlanAddConfig=function(){
  if(!planAddFlow?.current)return;const e=planAddFlow.current;if(e.setTechnique==='pyramid')ensurePyramidData(e);if(e.measureMode==='time'&&!Number(e.timeSeconds))e.timeSeconds=60;e.sets=nearestSetCount(e.setTechnique||'standard',e.sets);
  renderSheetState({title:e.name,scroll:0,body:`<div class="method-tabs" id="paMethodTabs">${METHOD_KEYS.map(k=>`<button class="chip ${e.setTechnique===k?'active':''}" data-pa-method="${k}">${METHOD_LABEL[k]}</button>`).join('')}</div><div class="method-help">${esc(methodHelp(e.setTechnique))}</div><div class="mode-switch"><button type="button" class="chip ${e.measureMode!=='time'?'active':''}" id="paModeReps">Wiederholungen</button><button type="button" class="chip ${e.measureMode==='time'?'active':''}" id="paModeTime" ${e.setTechnique==='pyramid'?'disabled':''}>Zeit</button></div><div class="grid2"><div class="form-field"><label>SÄTZE</label><select id="paSets" class="field">${setOptionsMarkup(e)}</select></div><div class="form-field"><label>PAUSE</label><select id="paRest" class="field">${[0,30,45,60,90,120,150,180,240,300].map(v=>`<option value="${v}" ${Number(e.rest)===v?'selected':''}>${v?formatTime(v):'Keine'}</option>`).join('')}</select></div></div><div class="form-field"><label>${e.measureMode==='time'?'ZEIT':'WDH.-VORGABE'}</label>${e.measureMode==='time'?timePresetMarkup(e,'pa'):methodRepConfigMarkup(e,'pa')}</div>${(findExercise(e.name).variants||[]).length?`<div class="form-field"><label>VARIANTE</label><select id="paVariant" class="field"><option value="">Standard</option>${(findExercise(e.name).variants||[]).map(v=>`<option ${e.variant===v?'selected':''}>${esc(v)}</option>`).join('')}</select></div>`:''}<div class="form-field"><label><input id="paPerSide" type="checkbox" ${e.perSide?'checked':''}> Wiederholungen pro Seite</label></div>${planAddMethodExtra(e)}<button id="paConfirm" class="primary" style="width:100%">Übernehmen</button>`});
  requestAnimationFrame(()=>{const tabs=$('paMethodTabs');if(tabs)tabs.scrollLeft=planAddFlow.methodScroll||0});
  $('paModeReps').onclick=()=>{e.measureMode='reps';renderPlanAddConfig()};
  if($('paModeTime')&&!$('paModeTime').disabled)$('paModeTime').onclick=()=>{e.measureMode='time';e.timeSeconds=Math.min(180,Math.max(15,Number(e.timeSeconds)||60));renderPlanAddConfig()};
  document.querySelectorAll('[data-pa-method]').forEach(b=>b.onclick=()=>{const tabs=$('paMethodTabs');planAddFlow.methodScroll=tabs?.scrollLeft||0;if(planAddFlow.memberGroup)planAddFlow.memberMethodExplicit=true;prepareDraftForTargetMethod(e,b.dataset.paMethod,1);renderPlanAddConfig()});
  $('paSets').onchange=()=>{e.sets=Number($('paSets').value);if(e.setTechnique==='pyramid')ensurePyramidData(e);renderPlanAddConfig()};
  document.querySelectorAll('[data-rep-preset]').forEach(b=>b.onclick=()=>{e.reps=b.dataset.repPreset;renderPlanAddConfig()});
  document.querySelectorAll('[data-time-preset]').forEach(b=>b.onclick=()=>{e.timeSeconds=Number(b.dataset.timePreset);renderPlanAddConfig()});
  bindPyramidCascade(e,'pa',renderPlanAddConfig);
  $('paConfirm').onclick=()=>confirmPlanAddDraft()
 };

 // Partner exercises keep their own reps/time/AMRAP; pyramid is never offered as time even inside a connected series.
 const baseCompact=window.renderCompactPartnerConfig;
 window.renderCompactPartnerConfig=function(){
  const e=planAddFlow?.current;if(e?.measureMode==='time'&&!Number(e.timeSeconds))e.timeSeconds=60;
  baseCompact();
  if(!e)return;
  if(e.setTechnique==='pyramid'){e.measureMode='reps';const btn=$('partnerModeTime');if(btn){btn.disabled=true;btn.classList.remove('active')}}
  bindPyramidCascade(e,'partner',renderCompactPartnerConfig)
 };

 // Remove the repeated Cluster/Rest-Pause target hint above every block; progress stays visible once.
 window.renderSets=function(e,ei){let html=baseRenderSets(e,ei);if(['cluster','restpause'].includes(e.setTechnique))html=html.replace(/^<div class="note-line">[\s\S]*?<\/div>/,'');return html};
 window.planPrescription=function(e){
  if(e.setTechnique==='cluster'&&e.measureMode!=='time')return`${esc(e.reps||'10')} WDH. Gesamtziel · ${e.methodData?.blocks||5} Cluster`;
  if(e.setTechnique==='restpause'&&e.measureMode!=='time')return`${Number(e.reps)||20} WDH. Gesamtziel`;
  if(e.setTechnique==='pyramid'){ensurePyramidData(e);return`${e.methodData.reps.join(' · ')} WDH. · ${e.methodData.weightPct.join(' · ')}%`}
  return basePlanPrescription(e)
 };

 // Superset / Giant Set: large exercise links at the top; small repeated names beside 1a/1b/1c.
 window.renderLiveGroupCard=function(g){
  const first=g.members[0],active=g.members.some(x=>Number(activeWorkout.activeExerciseIndex||0)===x.i),rounds=Math.max(...g.members.map(x=>x.e.liveSets?.length||x.e.sets||0));let rows='';
  for(let si=0;si<rounds;si++){rows+=`<div class="combined-round"><div class="group-round-title"><span>Satz ${si+1}</span><button class="remove-mini" data-remove-live-set="${first.i}|${si}">−</button></div>`;g.members.forEach((x,gi)=>{rows+=combinedMemberControls(x,si,gi)});rows+='</div>'}
  return`<div class="method-card live-exercise-card connected-live-card method-${g.method} ${active?'active-live-exercise':''}" data-live-card="${first.i}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="combined-series-head"><div>${g.members.map((x,gi)=>`<div class="combined-series-name"><button class="exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}"><strong>${String.fromCharCode(65+gi)}</strong> ${esc(x.e.name)}</button></div>`).join('')}</div><button class="icon-btn" data-live-config="${first.i}" aria-label="Serie bearbeiten">✎</button></div><div class="method-help">${esc(methodHelp(g.method))}</div>${rows}<button class="secondary" data-add-group-set="${esc(g.key)}" style="margin-top:8px">Satz hinzufügen</button></div>`
 };

 // Preview mirrors the same connected-card hierarchy and exercise names open the execution card.
 window.openPreview=function(p){
  $('previewTitle').textContent=p.name||'Workout Vorschau';const pp={...clone(p),exercises:clone(p.exercises).map(e=>{const x=normPlanEx(e);x.liveSets=Array.from({length:x.sets||3},(_,i)=>initSet(x,i));return x})};
  const groups=previewVisualGroups(pp.exercises);
  $('previewBody').innerHTML=`<div class="preview-live-shell">${groups.map(g=>{if(!groupMethod(g.method))return`<div class="method-card method-${g.method}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="method-help">${esc(methodHelp(g.method))}</div>${g.items.map(e=>`<div class="preview-group-member"><div class="live-card-head"><div><button class="exercise-title-link" data-preview-detail="${esc(e.name)}">${esc(e.name)}</button><div class="prescription">${esc(planPrescription(e))}</div></div></div>${renderPreviewSets(e)}</div>`).join('')}</div>`;
   const rounds=Math.max(...g.items.map(e=>Number(e.sets)||0));return`<div class="method-card connected-method-card method-${g.method}"><div class="method-name">${METHOD_LABEL[g.method]}</div><div class="preview-connected-top">${g.items.map((e,j)=>`<button class="exercise-title-link" data-preview-detail="${esc(e.name)}"><strong>${String.fromCharCode(65+j)}</strong> ${esc(e.name)}</button>`).join('')}</div><div class="method-help" style="margin-top:8px">${esc(methodHelp(g.method))}</div>${Array.from({length:rounds},(_,si)=>`<div class="preview-combined-round"><div class="group-round-title">Satz ${si+1}</div>${g.items.map((e,j)=>`<div class="preview-combined-row"><span>${si+1}${String.fromCharCode(97+j)}</span><span class="preview-mini-name">${esc(e.name)}</span><span class="preview-value">${e.measureMode==='time'?formatTime(e.timeSeconds||60):'KG'}</span><span class="preview-value">${e.measureMode==='time'?'ZEIT':(amrapText(e.reps||'WDH.'))}</span></div>`).join('')}</div>`).join('')}</div>`}).join('')}</div>`;
  openPage('previewPage');document.querySelectorAll('[data-preview-detail]').forEach(b=>b.onclick=()=>openExerciseDetail(b.dataset.previewDetail))
 };

 function askRestart(p){pendingStartPlan=p;openSheet('Training erneut starten?',`<p class="muted" style="margin:0 0 16px">„${esc(p.name)}“ erneut starten?</p><button id="reallyRestartPlan" class="primary" style="width:100%">Training erneut starten</button>`);$('reallyRestartPlan').onclick=()=>{closeSheet({all:true});startWorkout(p)}}
 window.openSummary=function(w){baseOpenSummary(w);const p=plans.find(x=>String(x.id)===String(w.planId));if(!p)return;requestAnimationFrame(()=>{if($('summaryTopPlay'))$('summaryTopPlay').onclick=()=>askRestart(p);if($('summaryRestart'))$('summaryRestart').onclick=()=>askRestart(p)})};

 // Legacy time exercises that visually default to 1:00 now actually carry 60 s as their selected value.
 const oldNormPlanEx=window.normPlanEx;window.normPlanEx=function(e){const x=oldNormPlanEx(e);if(x.measureMode==='time'&&!Number(x.timeSeconds))x.timeSeconds=60;if(x.setTechnique==='pyramid')x.measureMode='reps';return x};

 if(currentPlan&&!$('planEditorPage')?.classList.contains('hidden'))renderEditorExercises();
 if(activeWorkout&&!$('livePage')?.classList.contains('hidden'))renderLive();
})();

/* Exercise detail navigation from live workout */
(function(){
 const baseRenderLive=window.renderLive;
 window.renderLive=function(){
  baseRenderLive();
  document.querySelectorAll('[data-live-detail]').forEach(b=>b.onclick=()=>{
   const i=Number((b.dataset.liveIndex ?? b.closest('[data-live-card]')?.dataset.liveCard)||0);
   setActiveExercise(i);exerciseDetailReturn=null;openExerciseDetail(b.dataset.liveDetail)
  })
 };
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
 const baseRenderPlanAddConfig=window.renderPlanAddConfig;
 window.renderPlanAddConfig=function(){
   baseRenderPlanAddConfig();
   const e=planAddFlow?.current,rest=$("paRest");if(e&&rest)rest.onchange=()=>{e.rest=Number(rest.value)}
 };

 /* Remove generic coaching recommendation from live cards.
    Only previous actually completed values may appear grey as placeholders. */
 const baseRenderLiveSingleCard=window.renderLiveSingleCard;
 window.renderLiveSingleCard=function(e,i){
   let out=baseRenderLiveSingleCard(e,i);
   out=out.replace(/<div class="recommendation">[\s\S]*?<\/div>/,"");
   return out
 };

 /* Connected methods: same input styling and explicit KG / WDH labels.
    Plan target reps are never used as an input placeholder. */
 window.combinedMemberControls=function(x,si,gi){
   const s=x.e.liveSets?.[si];if(!s)return"";
   const idx=`${si+1}${String.fromCharCode(97+gi)}`;
   if(x.e.measureMode==="time"){
     return`<div class="combined-member-block combined-time-member">
       <div class="combined-member-title"><span class="combined-index">${idx}</span><button class="combined-name exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}">${esc(x.e.name)}</button></div>
       <div class="combined-time-controls"><input type="text" inputmode="numeric" autocomplete="off" data-time-field="1" data-input="${x.i}|${si}|time" value="${formatTime(s.time)}"><button class="time-play" data-time-play="${x.i}|${si}">▶</button><input type="text" inputmode="decimal" data-input="${x.i}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight||"")}"><input type="text" inputmode="decimal" data-input="${x.i}|${si}|level" placeholder="${esc(s._suggested?.level||"S/W")}" value="${esc(s.level||"")}"><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(x.e,s)?"ready":""}" data-check="${x.i}|${si}">✓</button></div>
     </div>${ratingMarkup(x.i,si,s)}`
   }
   return`<div class="combined-value-head"><span></span><span></span><span>KG</span><span>WDH.</span><span></span></div>
   <div class="combined-member-row">
    <span class="combined-index">${idx}</span>
    <button class="combined-name exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}">${esc(x.e.name)}</button>
    <input type="text" inputmode="decimal" autocomplete="off" data-input="${x.i}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight||"")}">
    <input type="text" inputmode="numeric" autocomplete="off" data-input="${x.i}|${si}|reps" placeholder="${esc(s._suggested?.reps||"WDH.")}" value="${esc(s.reps||"")}">
    <button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(x.e,s)?"ready":""}" data-check="${x.i}|${si}">✓</button>
   </div>${ratingMarkup(x.i,si,s)}`
 };

 /* A grey prior value becomes real only when the user rates/completes the set;
    typing overwrites it because actual value remains empty until input. Existing promoteSuggested() keeps this rule. */

 /* Settings: add system / fixed light / fixed dark without touching any other settings. */
 const baseOpenSettingsPage=window.openSettingsPage;
 window.openSettingsPage=function(){
   baseOpenSettingsPage();
   const body=$("settingsBody");if(!body||$("themeSettingsV48"))return;
   const section=document.createElement("div");section.className="settings-section";section.id="themeSettingsV48";
   section.innerHTML=`<h3>Darstellung</h3><div class="settings-card"><div class="settings-row" style="display:block"><div><strong>Hell / Dunkel</strong><small>System folgt automatisch der Darstellung des Geräts. Hell verwendet bewusst ein farbiges Grau statt Weiß.</small></div><div class="theme-choice-row">${[["system","System"],["light","Hell"],["dark","Dunkel"]].map(([v,l])=>`<button class="theme-choice ${themeModeV48()===v?"active":""}" data-theme-v48="${v}">${l}</button>`).join("")}</div></div></div>`;
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

/* Drop-set live row layout */
(function(){
 const previousRenderSets=window.renderSets;
 window.renderSets=function(e,ei){
   if(e?.setTechnique!=="dropset")return previousRenderSets(e,ei);
   return (e.liveSets||[]).map((s,si)=>{
     const segs=s.segments||[];
     return `<div class="advanced-head"><span>SATZ ${si+1}</span><span></span><span>KG</span><span>WDH.</span><span></span><span></span></div>`+
       segs.map((g,gi)=>{
         const last=gi===segs.length-1;
         return `<div class="advanced-row ${last?"drop-final-row":""}"><span>${gi+1}</span><span class="small">${esc(g.label)}</span><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sw|${gi}" placeholder="${esc(g._suggested?.weight||"KG")}" value="${esc(g.weight)}"><input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" data-input="${ei}|${si}|sr|${gi}" placeholder="${esc(g._suggested?.reps||"WDH.")}" value="${esc(g.reps)}">${last?`<button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(e,s)?"ready":""}" data-check="${ei}|${si}">✓</button><button class="remove-mini" data-remove-live-set="${ei}|${si}">−</button>`:`<span></span><span></span>`}</div>`
       }).join("")+ratingMarkup(ei,si,s)
   }).join("")
 };
 if(activeWorkout&&!$("livePage")?.classList.contains("hidden"))renderLive();
})();

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
   return [
     ...FOOD_DB.map(f=>({...f,_source:"builtin"})),
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

 window.openFoodSearch=function(initialQuery="",options={}){
   ensureNutritionV52();
   let q=String(initialQuery||"").trim().toLowerCase();
   const rows=()=>foodRowsV52(q);
   const markup=()=>{
     const r=rows();
     if(!r.length)return q?'<div class="small empty-food-note">Kein passendes Lebensmittel gefunden.</div>':'<div class="food-search-empty"><strong>Lebensmittel suchen</strong><div class="small">Häufig verwendete Lebensmittel erscheinen hier automatisch weiter oben.</div></div>';
     return r.map(f=>{
       const s=foodServingV52(f),used=usageCountV52(f.name);
       return`<button class="food-result ${foodTone(f.category)}" data-food-v52="${esc(foodKeyV52(f))}"><div class="food-result-copy"><strong>${esc(f.name)}</strong><small>${esc(f.category||"Eigenes Lebensmittel")}${used?` · ${used}× verwendet`:""}</small><span class="food-serving">${esc(s.label)} ≈ ${s.grams} g</span></div><span class="food-result-values">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser<br><small>je 100 g</small></span></button>`
     }).join("")
   };
   const body=()=>`<div class="search food-search"><span class="search-loupe" aria-hidden="true">⌕</span><input id="foodSearchInput" class="field" type="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Lebensmittel oder Kategorie" value="${esc(q)}"><button id="foodSearchClear" class="${q?"":"hidden"}">×</button></div><div class="small food-source-note">${allFoodsV52().length} Lebensmittel · Suche priorisiert Wort- und Kategoriebeginn</div><div id="foodSearchRows">${markup()}</div>`;
   const selectFood=f=>{
     if(options.selectOnly&&typeof options.onSelect==="function"){options.onSelect(f);return}
     const serving=foodServingV52(f);
     currentSheetState={title:"Lebensmittel hinzufügen",body:body(),scroll:$("sheetBody").scrollTop||0,bind};
     openSheet(f.name,`<div class="food-selected ${foodTone(f.category)}"><strong>${esc(f.name)}</strong><div class="small">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser je 100 g</div><span class="food-serving">${esc(serving.label)} ≈ ${serving.grams} g</span></div><div class="food-quick-portions"><button data-food-portion="${Math.max(1,Math.round(serving.grams/2))}">½ Portion</button><button data-food-portion="${serving.grams}">${esc(serving.label)}</button><button data-food-portion="${Math.round(serving.grams*2)}">2 Portionen</button></div><div class="form-field"><label>MENGE G</label><input id="foodGramInput" class="field" inputmode="decimal" value="${serving.grams}"></div><div id="foodAmountPreview" class="small"></div><button id="foodAddConfirm" class="primary" style="width:100%;margin-top:10px">Hinzufügen</button>`,()=>{
       const grams=$("foodGramInput"),preview=$("foodAmountPreview");
       const update=()=>{const n=nutrientsForV52(f,Number(String(grams.value).replace(",",".")));preview.textContent=`${n.kcal} kcal · ${n.protein} g Protein · ${n.water} g Wasser`};
       grams.oninput=update;grams.onfocus=()=>grams.select();grams.onclick=()=>grams.select();
       document.querySelectorAll("[data-food-portion]").forEach(b=>b.onclick=()=>{grams.value=b.dataset.foodPortion;update()});
       update();
       $("foodAddConfirm").onclick=()=>{addFoodEntry(f,Number(String(grams.value).replace(",",".")));closeSheet({all:true})}
     })
   };
   const bindRows=()=>document.querySelectorAll("[data-food-v52]").forEach(b=>b.onclick=()=>{const f=resolveFoodKeyV52(b.dataset.foodV52);if(f)selectFood(f)});
   const bind=()=>{
     const input=$("foodSearchInput");
     const refresh=()=>{$("foodSearchRows").innerHTML=markup();$("foodSearchClear").classList.toggle("hidden",!q);bindRows();currentSheetState={title:options.title||"Lebensmittel hinzufügen",body:body(),scroll:$("sheetBody").scrollTop||0,bind}};
     input.oninput=()=>{q=input.value.trim().toLowerCase();refresh()};
     $("foodSearchClear").onclick=()=>{q="";input.value="";refresh();input.focus();input.setSelectionRange(0,0)};
     bindRows();
     requestAnimationFrame(()=>{input.focus();if(!q)input.setSelectionRange(0,0)})
   };
   openSheet(options.title||"Lebensmittel hinzufügen",body(),bind)
 };

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

 const baseRenderProfileV52=window.renderProfile;
 window.renderProfile=function(){
   baseRenderProfileV52();
   ensureNutritionV52();
   renderMyFoodsV52();
   if($("addFoodTodayBtn"))$("addFoodTodayBtn").onclick=()=>openFoodSearch("");
   if($("newCustomFoodBtn"))$("newCustomFoodBtn").onclick=()=>openCustomFoodV52();
   if($("newMealBtn"))$("newMealBtn").onclick=()=>openMealBuilderV52()
 };



 renderProfile();
})();

/* Session restore, workout plan commit, last-rating dots, direct quantity editing */
(function(){

 /* ---------- last screen survives a real app relaunch ---------- */
 restoreUI=function(){
   const sameSession=sessionStorage.getItem(SESSION_MARKER)==="1";
   sessionStorage.setItem(SESSION_MARKER,"1");
   if(!sameSession){
     document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));pageStack=[];$("bottomNav").classList.remove("hidden");
     currentTab="training";showTab("training",{reset:true});
     return
   }
   const s=read(UI_KEY,null);
   if(!s){showTab("training",{reset:false});return}
   tabScroll=Object.assign(tabScroll,s.tabScroll||{});
   currentTab=s.tab||"training";showTab(currentTab,{reset:false});
   if(s.page==="livePage"&&activeWorkout){openLive(false);requestAnimationFrame(()=>{$("livePage").scrollTop=s.pageScroll||0});return}
   if(s.page==="planEditorPage"&&s.currentPlan){currentPlan=s.currentPlan;setEditorBaseline();openPlanEditor();requestAnimationFrame(()=>{$("planEditorPage").scrollTop=s.pageScroll||0});return}
   if(s.page==="previewPage"&&s.currentPlan){currentPlan=s.currentPlan;openPreview(currentPlan);requestAnimationFrame(()=>{$("previewPage").scrollTop=s.pageScroll||0});return}
   if(s.page==="settingsPage"){openSettingsPage();requestAnimationFrame(()=>{$("settingsPage").scrollTop=s.pageScroll||0});return}
   if(s.page==="exerciseDetailPage"&&s.currentExerciseName){const f=allExercises().find(x=>x.name===s.currentExerciseName);if(f){openExerciseDetail(f.name);requestAnimationFrame(()=>{$("exerciseDetailPage").scrollTop=s.pageScroll||0})}}
 };
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")persistUI()});
 window.addEventListener("pagehide",persistUI);


 /* ---------- plan-save choice after changed workout: structural compare, reliable overwrite/new ---------- */
 function structureOnlyV53(exercises){return clone(exercises||[]).map(x=>{const y=clone(x);delete y.liveSets;delete y._lastRatings;return y})}
 function workoutStructureChangedV53(){
   if(!activeWorkout)return false;
   return livePlanEdited||JSON.stringify(structureOnlyV53(activeWorkout.exercises))!==JSON.stringify(structureOnlyV53(activeWorkout.structureBaseline||[]))
 }
 finishAndSaveWorkout=function(){
   if(!activeWorkout)return;
   const changed=workoutStructureChangedV53();
   if(changed&&!activeWorkout.isWeekCombined){
     const sourceId=activeWorkout.sourcePlanId||activeWorkout.planId,existing=plans.find(p=>String(p.id)===String(sourceId));
     openSheet("Planänderungen speichern?",`<p class="small" style="margin:0 0 14px">Das Workout wird gespeichert. Was soll mit der veränderten Planstruktur passieren?</p><div class="save-choice-stack">${existing?`<button id="finishOverwritePlan" class="primary">Originalplan überschreiben</button>`:""}<button id="finishWithPlanSave" class="secondary">Als neuen Plan speichern</button><button id="finishWithoutPlanSave" class="secondary danger">Planänderungen nicht speichern</button></div>`);
     if($("finishOverwritePlan"))$("finishOverwritePlan").onclick=()=>finalizeWorkout({saveChangedPlan:"overwrite"});
     $("finishWithPlanSave").onclick=()=>finalizeWorkout({saveChangedPlan:"new"});
     $("finishWithoutPlanSave").onclick=()=>finalizeWorkout({saveChangedPlan:false});
     return
   }
   finalizeWorkout({saveChangedPlan:false})
 };
 finalizeWorkout=function({saveChangedPlan=false}={}){
   if(!activeWorkout)return;
   activeWorkout.finishedAt=Date.now();
   const structural=structureOnlyV53(activeWorkout.exercises),sourceId=activeWorkout.sourcePlanId||activeWorkout.planId;
   if(activeWorkout.isWeekCombined){
     const requested=activeWorkout.name||"Wochenplan",finalName=plans.some(p=>planBaseName(p.name)===planBaseName(requested))?nextPlanVersionName(requested):requested;
     const np={id:uid(),name:finalName,createdAt:Date.now(),updatedAt:Date.now(),lastUsedAt:Date.now(),fromWeek:true,sourcePlanIds:clone(activeWorkout.weekSourceIds||[]),exercises:structural};
     plans.push(np);activeWorkout.planId=np.id;activeWorkout.planName=np.name;activeWorkout.savedWeekPlanId=np.id
   }else if(saveChangedPlan){
     const src=plans.find(p=>String(p.id)===String(sourceId));
     if(saveChangedPlan==="overwrite"&&src){
       src.exercises=structural;src.updatedAt=Date.now();src.lastUsedAt=Date.now();activeWorkout.planId=src.id;activeWorkout.planName=src.name
     }else{
       const base=activeWorkout.planName||activeWorkout.name||"Training",np={id:uid(),name:nextPlanVersionName(base),createdAt:Date.now(),updatedAt:Date.now(),lastUsedAt:Date.now(),sourcePlanId:sourceId,exercises:structural};
       plans.push(np);activeWorkout.planId=np.id;activeWorkout.planName=np.name
     }
   }
   activeWorkout.sourcePlanId=sourceId;history.push(clone(activeWorkout));const done=clone(activeWorkout);
   activeWorkout=null;livePlanEdited=false;restEnd=0;persistRestEnd();timeSetTimers.forEach(clearInterval);timeSetTimers.clear();saveAll();renderPlans();
   closeSheet({all:true});document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));pageStack=[];$("bottomNav").classList.remove("hidden");showTab("training",{reset:false});openSummary(done)
 };

 /* ---------- last rating dot in live planned set front ---------- */
 const oldRenderSetsV53=window.renderSets||renderSets;
 window.renderSets=function(e,ei){
   let out=oldRenderSetsV53(e,ei);
   const ratings=e._lastRatings||[];
   if(!ratings.length)return out;
   let n=0;
   out=out.replace(/(<div class="set-row[^"]*">|<div class="time-row[^"]*">)/g,m=>{
     const r=ratings[n++]||"";return m+(r?`<span class="last-rating-dot rating-${r}" title="Letzte Bewertung"></span>`:"")
   });
   return out
 };

 /* ---------- partner masks: same card language as primary config ---------- */
 const oldPartnerConfigV53=window.renderCompactPartnerConfig||renderCompactPartnerConfig;
 window.renderCompactPartnerConfig=function(){
   oldPartnerConfigV53();
   const e=planAddFlow?.current;if(!e)return;
   const body=$("sheetBody"),card=body?.querySelector(".compact-partner-card");
   if(card){card.classList.add("partner-unified-card");card.insertAdjacentHTML("afterbegin",`<div class="partner-step-kicker">Partnerübung vollständig konfigurieren</div>`)}
 };


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
 const oldRenderProfileV53=window.renderProfile||renderProfile;
 window.renderProfile=function(){
   oldRenderProfileV53();renderProfileProgress();
   document.querySelectorAll("[data-edit-food-entry]").forEach(row=>row.onclick=e=>{if(e.target.closest("[data-food-del]"))return;editFoodEntryV53(row.dataset.editFoodEntry)});
   document.querySelectorAll("[data-edit-drink-entry]").forEach(row=>row.onclick=e=>{if(e.target.closest("[data-hydration-del]"))return;editDrinkEntryV53(row.dataset.editDrinkEntry)});
   document.querySelectorAll("[data-direct-drink]").forEach(card=>card.onclick=e=>{if(e.target.closest(".drink-actions"))return;const id=card.dataset.directDrink,d=nutrition.drinks.find(x=>String(x.id)===String(id));if(!d)return;openSheet(d.name,`<div class="form-field"><label>MENGE ML</label><input id="directDrinkAmountV53" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div><button id="directDrinkAddV53" class="primary" style="width:100%">Eintragen</button>`);const inp=$("directDrinkAmountV53");requestAnimationFrame(()=>{inp.focus();inp.select()});$("directDrinkAddV53").onclick=()=>{addDrinkEntry(d,inp.value);closeSheet({all:true})}})
 };

 
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
   let d=profileDate(),count=0;
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

 const priorProfileV56=window.renderProfile||renderProfile;
 window.renderProfile=function(){
   priorProfileV56();
   const hs=hydrationStreakV56(),ns=nutritionStreakV56();
   const hb=$("hydrationStreakBadge"),nb=$("nutritionStreakBadge");
   if(hb){hb.querySelector("strong").textContent=hs;hb.classList.toggle("active",hs>0)}
   if(nb){nb.querySelector("strong").textContent=ns;nb.classList.toggle("active",ns>0)}
   if(typeof renderProfileProgress==="function")renderProfileProgress()
 };


 /* Standby/background: persist the exact current position.
    True process/session restart: SESSION_MARKER is gone and restoreUI sends the user to Training. */
 document.addEventListener("visibilitychange",()=>{
   if(document.visibilityState==="hidden")persistUI();
   else if(document.visibilityState==="visible"){
     const s=read(UI_KEY,null);
     if(s&&sessionStorage.getItem(SESSION_MARKER)==="1"){
       /* Do not navigate anywhere on resume; the DOM stayed alive. Only restore scroll if iOS shifted it. */
       if(!document.querySelector(".page:not(.hidden)"))requestAnimationFrame(()=>window.scrollTo({top:tabScroll[currentTab]||0,behavior:"auto"}))
     }
   }
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

/* Final compact progress cards */
(function(){
  function v61CurrentWeek(){
    const d=new Date(),day=d.getDay()||7,start=new Date(d);start.setDate(d.getDate()-day+1);start.setHours(0,0,0,0);
    const end=new Date(start);end.setDate(end.getDate()+7);
    const th=new Date(start);th.setDate(th.getDate()+3);const ys=new Date(th.getFullYear(),0,1);
    const week=Math.ceil((((th-ys)/86400000)+ys.getDay()+1)/7);
    return{start,end,week}
  }
  function v61WeekDays(){
    const {start,end}=v61CurrentWeek(),days=new Set();
    history.forEach(w=>{
      if(!w?.finishedAt)return;
      const weekly=!!w.isWeekCombined||!!w.weekDate||(Array.isArray(w.weekSourceIds)&&w.weekSourceIds.length>0);
      if(!weekly)return;
      const t=Number(w.finishedAt);if(t<start.getTime()||t>=end.getTime())return;
      days.add(String(w.weekDate||dateKeyLocal(t)))
    });
    return days.size
  }
  window.renderProfileProgress=function(){
    const el=$("profileProgressOverview");if(!el)return;
    const wt=weightTrend(),current=wt?.current!=null?Number(wt.current):null,target=wt?.target!=null?Number(wt.target):null;
    const distance=(current!=null&&target!=null)?Math.max(0,Math.abs(Math.round((target-current)*10)/10)):null;
    const wk=v61CurrentWeek(),train=v61WeekDays(),streak=typeof goalStreakV50==="function"?(Number(goalStreakV50())||0):0;
    el.innerHTML=`<div class="section-head"><h2>Fortschritt</h2></div><div class="profile-progress-grid">
      <div class="card progress-stat"><div class="small">Gewichtstrend</div><strong>${current!=null?`${current} kg`:"–"}</strong><span class="progress-sub-label">Wunschgewicht</span><span class="progress-sub-value">${target!=null?`${target} kg${distance!=null?` · ${distance} kg bis Ziel`:""}`:"–"}</span></div>
      <div class="card progress-stat"><div class="small">Streak</div><strong>${streak}</strong><span class="progress-sub-value">Wasser und Ernährung</span></div>
      <div class="card progress-stat training-week-stat"><div class="small">Trainingstage</div><span class="progress-sub-label">KW ${wk.week}</span><strong>${train}/7</strong></div>
    </div>`
  };
})();

(function(){
 let token=0;
 function containerFor(el){return el.closest(".sheet-body")||el.closest(".page")||document.scrollingElement}
 function positionField(el){
  if(!el?.isConnected)return;const vv=window.visualViewport;if(!vv)return;
  const bottom=vv.offsetTop+vv.height-12,r=el.getBoundingClientRect(),delta=r.bottom-bottom;
  if(Math.abs(delta)<3)return;const c=containerFor(el);
  if(c===document.scrollingElement||c===document.documentElement||c===document.body)window.scrollBy({top:delta,behavior:"auto"});else c.scrollTop+=delta
 }
 function stabilize(el){const t=++token;[60,150,280].forEach(ms=>setTimeout(()=>{if(t===token)positionField(el)},ms))}
 document.addEventListener("focusin",e=>{if(e.target.matches?.("input,textarea,select"))stabilize(e.target)},true);
 if(window.visualViewport){visualViewport.addEventListener("resize",()=>{const e=document.activeElement;if(e?.matches?.("input,textarea,select"))stabilize(e)},true)}
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
        <div class="detail-section"><div class="small">AUSFÜHRUNG</div><div class="detail-copy">${esc(guide)}</div></div>
        <button id="v64PartnerFromDetail" class="primary" style="width:100%;margin-top:12px">+ Diese Übung wählen</button>
      </div>`,
      onBack:()=>renderPartnerExercisePicker(),
      onClose:cancelPlanAddFlow
    });
    $("v64PartnerFromDetail").onclick=()=>startCompactPartnerConfig(name)
  }

  window.renderPartnerExercisePicker=function(){
    const f=planAddFlow;if(!f?.group)return renderPlanAddPicker();
    const all=allExercises(),rows=planAddFiltered(),types=planAddTypes(all),muscles=planAddMuscles(all);
    f.step="partnerPicker";
    const pos=f.drafts.length+1,target=f.group.target,method=METHOD_LABEL[f.group.method]||f.group.method;
    renderSheetState({
      title:`${method} · Übung ${pos}/${target}`,
      scroll:Number(f.partnerPickerScroll)||0,
      body:`<div class="partner-catalog-note">Wähle die nächste Übung wie im normalen Übungskatalog. Tippe auf den Namen, um die Ausführung vorher zu prüfen.</div>
        <div class="search"><input id="v64PartnerSearch" class="field" placeholder="Übung suchen" value="${esc(f.q||"")}"><button id="v64PartnerClear">×</button></div>
        <div class="chips" id="v64PartnerTypeChips">${types.map(x=>`<button class="chip ${f.type===x?"active":""}" data-v64-partner-type="${esc(x)}">${esc(x)}</button>`).join("")}</div>
        <div class="chips" id="v64PartnerMuscleChips">${muscles.map(x=>`<button class="chip ${(x==="Alle"&&!f.muscles.size)||f.muscles.has(x)?"active":""}" data-v64-partner-muscle="${esc(x)}">${esc(x)}</button>`).join("")}</div>
        <div class="small" id="v64PartnerCount" style="margin:2px 0 8px">${rows.length} Übungen</div>
        <div id="v64PartnerRows">${partnerCatalogRowsV64(rows)}</div>`,
      onBack:()=>{
        if(f.drafts.length){const prev=f.drafts.pop();f.current=prev;f.step="config";renderPlanAddConfig()}
        else renderPlanAddPicker()
      },
      onClose:cancelPlanAddFlow
    });
    const search=$("v64PartnerSearch");
    const remember=()=>{
      f.partnerPickerScroll=$("sheetBody")?.scrollTop||0;
      f.partnerTypeScroll=$("v64PartnerTypeChips")?.scrollLeft||0;
      f.partnerMuscleScroll=$("v64PartnerMuscleChips")?.scrollLeft||0
    };
    const refresh=()=>{
      const r=planAddFiltered();
      $("v64PartnerCount").textContent=`${r.length} Übungen`;
      $("v64PartnerRows").innerHTML=partnerCatalogRowsV64(r);
      bindPartnerCatalogRowsV64()
    };
    search.oninput=()=>{f.q=search.value.toLowerCase();exercisePickerState.q=f.q;refresh()};
    $("v64PartnerClear").onclick=()=>{f.q="";search.value="";exercisePickerState.q="";refresh();search.focus()};
    document.querySelectorAll("[data-v64-partner-type]").forEach(b=>b.onclick=()=>{
      remember();f.type=(f.type===b.dataset.v64PartnerType&&f.type!=="Alle")?"Alle":b.dataset.v64PartnerType;
      exercisePickerState.type=f.type;renderPartnerExercisePicker()
    });
    document.querySelectorAll("[data-v64-partner-muscle]").forEach(b=>b.onclick=()=>{
      remember();const m=b.dataset.v64PartnerMuscle;
      if(m==="Alle")f.muscles.clear();else f.muscles.has(m)?f.muscles.delete(m):f.muscles.add(m);
      exercisePickerState.muscles=[...f.muscles];renderPartnerExercisePicker()
    });
    bindPartnerCatalogRowsV64();
    requestAnimationFrame(()=>{
      if($("v64PartnerTypeChips"))$("v64PartnerTypeChips").scrollLeft=Number(f.partnerTypeScroll)||0;
      if($("v64PartnerMuscleChips"))$("v64PartnerMuscleChips").scrollLeft=Number(f.partnerMuscleScroll)||0;
      $("sheetBody").scrollTop=Number(f.partnerPickerScroll)||0
    })
  };

  /* Back from partner detail always returns to the same filtered catalog position. */
  const previousPlanAddBackV64=window.planAddBack||planAddBack;
  window.planAddBack=function(){
    if(planAddFlow?.step==="partnerDetail"){renderPartnerExercisePicker();return}
    return previousPlanAddBackV64()
  };

  function allExerciseSetsDoneV64(e){
    return !!e&&(e.liveSets||[]).length>0&&(e.liveSets||[]).every(s=>s.completed)
  }
  window.renderLiveSingleCard=function(e,i){
    const complete=allExerciseSetsDoneV64(e),active=Number(activeWorkout.activeExerciseIndex||0)===i&&!complete;
    return`<div class="method-card live-exercise-card method-${e.setTechnique||"standard"} ${active?"active-live-exercise":""} ${complete?"live-method-complete":""}" data-live-card="${i}">
      <div class="method-name">${METHOD_LABEL[e.setTechnique||"standard"]}</div>
      <div class="live-card-head"><div><button class="exercise-title-link" data-live-detail="${esc(e.name)}" data-live-index="${i}">${esc(e.name)}</button><div class="prescription">${esc(planPrescription(e))}</div></div>
      <div class="live-card-actions"><button class="icon-btn" data-live-config="${i}" aria-label="Übung bearbeiten">✎</button><button class="live-delete-ex" data-delete-live-ex="${i}" aria-label="Übung löschen">−</button></div></div>
      <div class="method-help">${esc(methodHelp(e.setTechnique))}</div>
      ${e.variant||e.perSide?`<div class="variant-line">${e.variant?esc(e.variant):""}${e.variant&&e.perSide?" · ":""}${e.perSide?"WDH. pro Seite":""}</div>`:""}
      <button class="note-line" data-live-note="${i}" style="border:0;background:transparent;padding:0">✎ ${esc(e.note||"Notiz")}</button>
      ${renderSets(e,i)}
      <button class="secondary" data-add-set="${i}" style="margin-top:8px">Satz hinzufügen</button>
    </div>`
  };

  window.renderLiveGroupCard=function(g){
    const first=g.members[0],complete=g.members.every(x=>allExerciseSetsDoneV64(x.e));
    const active=g.members.some(x=>Number(activeWorkout.activeExerciseIndex||0)===x.i)&&!complete;
    const rounds=Math.max(...g.members.map(x=>x.e.liveSets?.length||x.e.sets||0));let rows="";
    for(let si=0;si<rounds;si++){
      rows+=`<div class="combined-round"><div class="group-round-title"><span>Satz ${si+1}</span><button class="remove-mini" data-remove-live-set="${first.i}|${si}">−</button></div>`;
      g.members.forEach((x,gi)=>{rows+=combinedMemberControls(x,si,gi)});rows+=`</div>`
    }
    return`<div class="method-card live-exercise-card connected-live-card method-${g.method} ${active?"active-live-exercise":""} ${complete?"live-method-complete":""}" data-live-card="${first.i}">
      <div class="method-name">${METHOD_LABEL[g.method]}</div>
      <div class="combined-series-head"><div>${g.members.map((x,gi)=>`<div class="combined-series-name"><button class="exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}"><strong>${String.fromCharCode(65+gi)}</strong> ${esc(x.e.name)}</button></div>`).join("")}</div>
      <button class="icon-btn" data-live-config="${first.i}" aria-label="Serie bearbeiten">✎</button></div>
      <div class="method-help">${esc(methodHelp(g.method))}</div>${rows}
      <button class="secondary" data-add-group-set="${esc(g.key)}" style="margin-top:8px">Satz hinzufügen</button>
    </div>`
  };

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
      if(!w?.finishedAt)return;
      const weekly=!!w.isWeekCombined||!!w.weekDate||(Array.isArray(w.weekSourceIds)&&w.weekSourceIds.length>0);
      if(!weekly)return;
      const t=Number(w.finishedAt);if(t<start.getTime()||t>=end.getTime())return;
      days.add(String(w.weekDate||dateKeyLocal(t)))
    });
    return days.size
  }
  window.renderProfileProgress=function(){
    const el=$("profileProgressOverview");if(!el)return;
    const wt=weightTrend(),current=wt?.current!=null?Number(wt.current):null,target=wt?.target!=null?Number(wt.target):null;
    const distance=(current!=null&&target!=null)?Math.max(0,Math.round(Math.abs(target-current)*10)/10):null;
    const wk=currentWeekV64(),train=weekDaysV64(),streak=typeof goalStreakV50==="function"?(Number(goalStreakV50())||0):0;
    el.innerHTML=`<div class="section-head"><h2>Fortschritt</h2></div><div class="profile-progress-grid">
      <div class="card progress-stat"><div class="small">Gewichtstrend</div><strong>${current!=null?`${current} kg`:"–"}</strong><span class="progress-sub-label">Wunschgewicht</span><span class="progress-sub-value">${target!=null?`${target} kg${distance!=null?` · ${distance} kg bis Ziel`:""}`:"–"}</span></div>
      <div class="card progress-stat"><div class="small">Streak</div><strong>${streak}</strong><span class="progress-sub-value">Wasser und Ernährung</span></div>
      <div class="card progress-stat training-week-stat"><div class="small">Trainingstage</div><span class="progress-sub-label">KW ${wk.week}</span><strong>${train}/7</strong></div>
    </div>`
  };

  try{renderProfileProgress();if(activeWorkout&&!$("livePage")?.classList.contains("hidden"))renderLive()}catch(e){console.error("v64 init",e)}
})();
