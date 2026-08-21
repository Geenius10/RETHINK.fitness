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
  if($('paGiantCount'))$('paGiantCount').onchange=()=>{
    e.methodData=e.methodData||{};e.methodData.giantCount=Number($('paGiantCount').value)||3;
    if(planAddFlow.group&&planAddFlow.group.method==='giant')planAddFlow.group.target=e.methodData.giantCount
  };
  $('paConfirm').onclick=()=>{
    if($('paGiantCount')){e.methodData=e.methodData||{};e.methodData.giantCount=Number($('paGiantCount').value)||3;if(planAddFlow.group&&planAddFlow.group.method==='giant')planAddFlow.group.target=e.methodData.giantCount}
    confirmPlanAddDraft()
  }
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

 /* ---------- last screen survives a real app relaunch ---------- */
 restoreUI=function(){
   const sameSession=sessionStorage.getItem(SESSION_MARKER)==="1";
   sessionStorage.setItem(SESSION_MARKER,"1");
   if(!sameSession){
     profileDayOffset=0;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,"0");
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


/* v68 final integration */
(function(){
 const ANNUAL_CLEANUP_KEY='rethink_annual_cleanup_enabled_v1',ANNUAL_CLEANUP_YEAR='rethink_annual_cleanup_prompt_year_v1';

 function moveRestDockV68(){
   const bar=$('restBar');if(bar&&bar.parentElement!==document.body)document.body.appendChild(bar)
 }
 moveRestDockV68();
 const baseStartRestV68=startRest;
 startRest=function(sec,restored=false){moveRestDockV68();return baseStartRestV68(sec,restored)};

 /* Preview uses the same workout card renderer, but remains read-only. */
 window.openPreview=function(p){
   $('previewTitle').textContent=p.name||'Workout Vorschau';
   const pp={...clone(p),activeExerciseIndex:-1,exercises:clone(p.exercises||[]).map(e=>{const x=normPlanEx(e);x.liveSets=Array.from({length:x.sets||3},(_,i)=>initSet(x,i));return x})};
   const saved=activeWorkout;activeWorkout=pp;
   let markup='';
   try{markup=liveVisualGroups(pp.exercises).map(g=>g.group?renderLiveGroupCard(g):renderLiveSingleCard(g.members[0].e,g.members[0].i)).join('')}
   finally{activeWorkout=saved}
   $('previewBody').innerHTML=`<div class="preview-live-shell preview-exact">${markup}</div>`;
   $('previewBody').querySelectorAll('input,textarea,select').forEach(x=>{x.readOnly=true;x.tabIndex=-1});
   $('previewBody').querySelectorAll('[data-live-detail]').forEach(b=>b.onclick=()=>openExerciseDetail(b.dataset.liveDetail));
   openPage('previewPage')
 };

 function weekRunningV68(day){
   if(!activeWorkout?.weekDate)return false;
   return String(activeWorkout.weekDate)===String(dateKeyLocal(weekDateAt(day)))
 }
 renderWeek=function(){
   $('weekMotivation').innerHTML=`<div class="small">DIESE WOCHE</div><strong>${esc(weekMotivationText())}</strong>`;
   const days=['Mo','Di','Mi','Do','Fr','Sa','So'],from=weekDateAt(0),to=weekDateAt(6);
   $('weekRangeLabel').textContent=`${fmtShortDate(from)} – ${fmtShortDate(to)}`;
   $('weekOffsetLabel').textContent=weekOffset===0?'Diese Woche':weekOffset<0?`${Math.abs(weekOffset)} Woche${Math.abs(weekOffset)===1?'':'n'} zurück`:`${weekOffset} Woche${weekOffset===1?'':'n'} voraus`;
   $('weekPrevBtn').disabled=weekOffset<=-8;$('weekNextBtn').disabled=weekOffset>=8;
   let changed=false;weekPlan=weekPlan.map((ids,i)=>{const valid=validWeekPlans(i).map(p=>p.id);if(JSON.stringify(valid)!==JSON.stringify(Array.isArray(ids)?ids:[]))changed=true;return valid});if(changed)saveAll();
   $('weekList').innerHTML=days.map((d,i)=>{
     const ps=validWeekPlans(i),ex=ps.reduce((n,p)=>n+p.exercises.length,0),sets=ps.reduce((n,p)=>n+countPlanSets(p),0),date=weekDateAt(i),done=ps.length&&weekCompletion(i),running=ps.length&&weekRunningV68(i);
     const names=ps.map(p=>p.name).join(' + ');
     return`<div class="week-row"><div class="week-day">${d}</div><div class="week-card ${done?'week-completed':(running?'week-running':(ps.length?'week-scheduled':''))}">
       <button class="week-card-main" ${ps.length?`data-v68-week-main="${i}"`:''}><div class="week-card-date">${date.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</div>
       ${ps.length?`<strong>${esc(names)}</strong><small>${ps.length} Plan${ps.length===1?'':'e'} · ${ex} Übungen · ${sets} Sätze${done?' · Abgeschlossen':''}</small>${running?'<div class="week-running-label">WORKOUT LÄUFT</div>':''}`:`<div class="week-pause-wrap">${stretchSvg()}<div><strong>Pause</strong><small>Freier Tag</small></div></div>`}</button>
       <div class="week-actions">${ps.length?`${done?'':(running?`<button class="week-plus week-play" data-v68-week-resume="${i}" aria-label="Workout öffnen">▶</button>`:`<button class="week-plus week-play" data-v68-week-start="${i}" aria-label="Training starten">▶</button>`)}<button class="week-menu" data-wm="${i}">⋮</button>`:`<button class="week-plus" data-wa="${i}" aria-label="Plan hinzufügen">+</button>`}</div></div></div>`
   }).join('');
   document.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>openWeekPicker(Number(b.dataset.wa)));
   document.querySelectorAll('[data-v68-week-main]').forEach(b=>b.onclick=()=>{const day=Number(b.dataset.v68WeekMain);if(weekRunningV68(day))openLive(false);else openWeekPreview(day)});
   document.querySelectorAll('[data-v68-week-start]').forEach(b=>b.onclick=e=>{e.stopPropagation();const fresh=combinedWeekPlan(Number(b.dataset.v68WeekStart));if(fresh)confirmAndStartPlan(fresh)});
   document.querySelectorAll('[data-v68-week-resume]').forEach(b=>b.onclick=e=>{e.stopPropagation();openLive(false)});
   document.querySelectorAll('[data-wm]').forEach(b=>b.onclick=e=>{e.stopPropagation();weekMenu(Number(b.dataset.wm))})
 };

 /* Week picker: selected order is workout order and is always numbered. */
 window.openWeekPicker=function(day){
   let selected=validWeekPlans(day).map(p=>p.id),q='';
   const render=()=>{
     const rows=sortedPlansForPicker(q);
     $('sheetBody').innerHTML=`<div class="plan-picker-tools"><div class="search"><input id="weekSearch" placeholder="Plan suchen" value="${esc(q)}"><button id="weekSearchClear">×</button></div><div class="chips">${[['name','A–Z'],['created','Hinzugefügt'],['updated','Geändert'],['used','Genutzt']].map(([k,l])=>`<button class="chip ${planSort.key===k?'active':''}" data-week-sort="${k}">${l}${planSort.key===k?(planSort.dir>0?' ↑':' ↓'):''}</button>`).join('')}</div></div>
       ${rows.map(p=>{const order=selected.indexOf(p.id)+1;return`<button class="plan-card week-select-card ${order?'selected':''}" data-wpick="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span>${order?`<span class="week-order-badge">${order}</span>`:'›'}</span></button>`}).join('')}
       <div class="week-selection-footer"><div class="small" style="margin-bottom:8px">${selected.length?`Reihenfolge: ${selected.map((id,i)=>`${i+1}. ${esc(plans.find(p=>p.id===id)?.name||'Plan')}`).join(' · ')}`:'Kein Plan gewählt'}</div><button id="weekApply" class="primary" style="width:100%">Übernehmen</button></div>`;
     $('weekSearch').oninput=()=>{q=$('weekSearch').value;render()};
     $('weekSearchClear').onclick=()=>{q='';render()};
     document.querySelectorAll('[data-week-sort]').forEach(b=>b.onclick=()=>{if(planSort.key===b.dataset.weekSort)planSort.dir*=-1;else{planSort.key=b.dataset.weekSort;planSort.dir=1}render()});
     document.querySelectorAll('[data-wpick]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.wpick),i=selected.indexOf(id);if(i>=0)selected.splice(i,1);else selected.push(id);render()});
     $('weekApply').onclick=()=>{const had=validWeekPlans(day).length>0;weekPlan[day]=selected.filter(id=>plans.some(p=>String(p.id)===String(id)));if(had&&!weekPlan[day].length)clearWeekCompletionForDay(day);saveAll();closeSheet({all:true});renderWeek();renderProfileProgress?.()}
   };
   openSheet('Trainingsplan auswählen','');render()
 };

 /* Unified weekly plan-save question, identical order to normal workout. */
 function cleanPlanExerciseV68(x){const y=clone(x);delete y.liveSets;delete y._lastRatings;delete y._weekSourcePlanId;delete y._weekSourceOrder;delete y._weekSourceExerciseOrder;return y}
 function structureV68(ex){return clone(ex||[]).map(cleanPlanExerciseV68)}
 function changedV68(){return !!activeWorkout&&(livePlanEdited||JSON.stringify(structureV68(activeWorkout.exercises))!==JSON.stringify(structureV68(activeWorkout.structureBaseline||[])))}
 finishAndSaveWorkout=function(){
   if(!activeWorkout)return;
   if(changedV68()){
     const hasOriginal=activeWorkout.isWeekCombined?(activeWorkout.weekSourceIds||[]).some(id=>plans.some(p=>String(p.id)===String(id))):plans.some(p=>String(p.id)===String(activeWorkout.sourcePlanId||activeWorkout.planId));
     openSheet('Planänderungen speichern?',`<p class="small" style="margin:0 0 14px">Das Workout wird gespeichert. Was soll mit der veränderten Planstruktur passieren?</p><div class="save-choice-stack">${hasOriginal?'<button id="finishOverwritePlan" class="primary">Originalplan überschreiben</button>':''}<button id="finishWithPlanSave" class="secondary">Als neuen Plan speichern</button><button id="finishWithoutPlanSave" class="secondary danger">Planänderungen nicht speichern</button></div>`);
     if($('finishOverwritePlan'))$('finishOverwritePlan').onclick=()=>finalizeWorkout({saveChangedPlan:'overwrite'});
     $('finishWithPlanSave').onclick=()=>finalizeWorkout({saveChangedPlan:'new'});
     $('finishWithoutPlanSave').onclick=()=>finalizeWorkout({saveChangedPlan:false});
     return
   }
   finalizeWorkout({saveChangedPlan:false})
 };
 finalizeWorkout=function({saveChangedPlan=false}={}){
   if(!activeWorkout)return;
   activeWorkout.finishedAt=Date.now();
   const current=clone(activeWorkout.exercises||[]),structural=current.map(cleanPlanExerciseV68),sourceId=activeWorkout.sourcePlanId||activeWorkout.planId;
   if(saveChangedPlan==='overwrite'){
     if(activeWorkout.isWeekCombined){
       const sourceIds=(activeWorkout.weekSourceIds||[]).map(String);
       const grouped=new Map(sourceIds.map(id=>[id,[]]));
       current.forEach(e=>{let id=String(e._weekSourcePlanId||sourceIds[0]||'');if(!grouped.has(id))id=sourceIds[0];if(id&&grouped.has(id))grouped.get(id).push(cleanPlanExerciseV68(e))});
       grouped.forEach((ex,id)=>{const p=plans.find(x=>String(x.id)===id);if(p){p.exercises=ex;p.updatedAt=Date.now();p.lastUsedAt=Date.now()}})
     }else{
       const p=plans.find(x=>String(x.id)===String(sourceId));if(p){p.exercises=structural;p.updatedAt=Date.now();p.lastUsedAt=Date.now();activeWorkout.planId=p.id;activeWorkout.planName=p.name}
     }
   }else if(saveChangedPlan==='new'){
     const base=activeWorkout.isWeekCombined?(activeWorkout.name||'Wochenplan'):(activeWorkout.planName||activeWorkout.name||'Training');
     const np={id:uid(),name:nextPlanVersionName(base),createdAt:Date.now(),updatedAt:Date.now(),lastUsedAt:Date.now(),sourcePlanId:sourceId,sourcePlanIds:clone(activeWorkout.weekSourceIds||[]),exercises:structural};
     plans.push(np);activeWorkout.planId=np.id;activeWorkout.planName=np.name
   }
   activeWorkout.sourcePlanId=sourceId;history.push(clone(activeWorkout));const done=clone(activeWorkout);
   activeWorkout=null;livePlanEdited=false;restEnd=0;persistRestEnd();timeSetTimers.forEach(clearInterval);timeSetTimers.clear();saveAll();renderPlans();renderWeek();
   closeSheet({all:true});document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));pageStack=[];$('bottomNav').classList.remove('hidden');showTab('training',{reset:false});openSummary(done)
 };

 /* Food / meal search */
 function ensureVisibleV68(input){
   if(!input)return;const body=input.closest('.sheet-body');if(!body)return;
   requestAnimationFrame(()=>{const r=input.getBoundingClientRect(),vv=window.visualViewport,bottom=vv?vv.height+vv.offsetTop:innerHeight;if(r.bottom>bottom-12)body.scrollTop+=r.bottom-(bottom-12);else if(r.top<70)body.scrollTop=Math.max(0,body.scrollTop-(70-r.top))})
 }
 function mealTotalsProxyV68(m){return window.__mealTotalsV52?window.__mealTotalsV52(m.items||[]):{grams:0,kcal:0,protein:0,water:0}}
 function openMealLogV68(meal){
   const t=mealTotalsProxyV68(meal);
   openSheet(meal.name,`<div class="meal-builder-total"><strong>${esc(meal.name)}</strong><div>1 Portion · ${Math.round(t.grams)} g · ${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</div></div><div class="food-quick-portions v68"><button data-v68-meal=".125">⅛</button><button data-v68-meal=".25">¼</button><button data-v68-meal=".5">½</button><button data-v68-meal="1">1</button></div><div class="form-field"><label>PORTION / MENGE</label><input id="v68MealAmount" class="field" inputmode="decimal" value="1"></div><div id="v68MealPreview" class="small"></div><button id="v68MealAdd" class="primary" style="width:100%;margin-top:10px">Mahlzeit eintragen</button>`);
   const inp=$('v68MealAmount'),prev=$('v68MealPreview'),upd=()=>{const f=Math.max(.01,Number(String(inp.value).replace(',','.'))||1);prev.textContent=`${Math.round(t.grams*f)} g · ${Math.round(t.kcal*f)} kcal · ${Math.round(t.protein*f*10)/10} g Protein · ${Math.round(t.water*f)} g Wasser`};
   document.querySelectorAll('[data-v68-meal]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.v68Meal;upd();inp.focus();inp.select();ensureVisibleV68(inp)});
   inp.oninput=upd;upd();inp.focus();inp.select();ensureVisibleV68(inp);
   $('v68MealAdd').onclick=()=>{const f=Math.max(.01,Number(String(inp.value).replace(',','.'))||1);nutrition.foodLog=Array.isArray(nutrition.foodLog)?nutrition.foodLog:[];nutrition.foodLog.push({id:uid(),date:profileDateKey(),name:meal.name,category:'Mahlzeit',grams:Math.round(t.grams*f),kcal:Math.round(t.kcal*f),protein:Math.round(t.protein*f*10)/10,water:Math.round(t.water*f),mealId:meal.id,portions:f});recalcFoodTotals();saveAll();closeSheet({all:true});renderProfile()}
 }
 window.openFoodSearch=function(initialQuery='',options={}){
   let q=String(initialQuery||'').trim().toLowerCase();
   const foodList=()=>window.__allFoodsV52?window.__allFoodsV52():[];
   const score=(f,q)=>{const n=String(f.name||'').toLowerCase(),c=String(f.category||'').toLowerCase();if(!q)return 0;if(n===q)return 100;if(n.startsWith(q))return 90;if(n.split(/[\s\\-_/()]+/).some(w=>w.startsWith(q)))return 80;if(c.startsWith(q))return 75;if(c.includes(q))return 40;if(n.includes(q))return 45;return-1};
   const rows=()=>{
     const foods=foodList().map(f=>({type:'food',item:f,score:score(f,q),used:(nutrition.foodLog||[]).filter(x=>String(x.name).toLowerCase()===String(f.name).toLowerCase()).length}));
     const meals=(nutrition.meals||[]).map(m=>({type:'meal',item:m,score:score({name:m.name,category:'Mahlzeit'},q),used:(nutrition.foodLog||[]).filter(x=>String(x.mealId)===String(m.id)).length}));
     return [...foods,...meals].filter(x=>q?x.score>=0:x.used>0).sort((a,b)=>b.score-a.score||b.used-a.used||String(a.item.name).localeCompare(String(b.item.name),'de')).slice(0,100)
   };
   const markup=()=>rows().map((x,i)=>{
     if(x.type==='meal'){const t=mealTotalsProxyV68(x.item);return`<button class="food-result" data-v68-meal-result="${x.item.id}"><div class="food-result-copy"><strong>${esc(x.item.name)}</strong><small>Mahlzeit${x.used?` · ${x.used}× verwendet`:''}</small></div><span class="food-result-values">${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</span></button>`}
     const f=x.item,s=window.__foodServingV52(f);return`<button class="food-result ${foodTone(f.category)}" data-v68-food-result="${esc(String(f._customId?`custom:${f._customId}`:`builtin:${f.name}`))}"><div class="food-result-copy"><strong>${esc(f.name)}</strong><small>${esc(f.category||'Eigenes Lebensmittel')}${x.used?` · ${x.used}× verwendet`:''}</small><span class="food-serving">${esc(s.label)} ≈ ${s.grams} g</span></div><span class="food-result-values">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser<br><small>je 100 g</small></span></button>`
   }).join('')||(q?'<div class="small empty-food-note">Kein passender Treffer.</div>':'<div class="food-search-empty"><strong>Lebensmittel oder Mahlzeit suchen</strong></div>');
   const body=()=>`<div class="food-search-sticky"><div class="search food-search"><span class="search-loupe">⌕</span><input id="v68FoodSearch" class="field" type="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Lebensmittel, Mahlzeit oder Kategorie" value="${esc(q)}"><button id="v68FoodClear" class="${q?'':'hidden'}">×</button></div></div><div id="v68FoodRows" class="food-results-scroll">${markup()}</div>`;
   const bindRows=()=>{
     document.querySelectorAll('[data-v68-meal-result]').forEach(b=>b.onclick=()=>{const m=(nutrition.meals||[]).find(x=>String(x.id)===String(b.dataset.v68MealResult));if(options.selectOnly){toast('Für eine Mahlzeit bitte einzelne Zutaten wählen.');return}if(m)openMealLogV68(m)});
     document.querySelectorAll('[data-v68-food-result]').forEach(b=>b.onclick=()=>{
       const key=b.dataset.v68FoodResult,all=foodList(),f=key.startsWith('custom:')?all.find(x=>String(x._customId)===key.slice(7)):all.find(x=>String(x.name)===key.slice(8));if(!f)return;
       if(options.selectOnly&&typeof options.onSelect==='function'){options.onSelect(f);return}
       const s=window.__foodServingV52(f);
       openSheet(f.name,`<div class="food-selected ${foodTone(f.category)}"><strong>${esc(f.name)}</strong><div class="small">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser je 100 g</div><span class="food-serving">${esc(s.label)} ≈ ${s.grams} g</span></div><div class="food-quick-portions v68"><button data-v68-food-factor=".125">⅛</button><button data-v68-food-factor=".25">¼</button><button data-v68-food-factor=".5">½</button><button data-v68-food-factor="1">1</button></div><div class="form-field"><label>GRAMM</label><input id="v68FoodGrams" class="field" inputmode="decimal" value="${s.grams}"></div><div id="v68FoodPreview" class="small"></div><button id="v68FoodAdd" class="primary" style="width:100%;margin-top:10px">Hinzufügen</button>`);
       const inp=$('v68FoodGrams'),prev=$('v68FoodPreview'),upd=()=>{const n=window.__nutrientsForV52(f,Number(String(inp.value).replace(',','.')));prev.textContent=`${n.kcal} kcal · ${n.protein} g Protein · ${n.water} g Wasser`};
       document.querySelectorAll('[data-v68-food-factor]').forEach(btn=>btn.onclick=()=>{inp.value=Math.max(1,Math.round(s.grams*Number(btn.dataset.v68FoodFactor)));upd();inp.focus();inp.select();ensureVisibleV68(inp)});
       inp.oninput=upd;upd();inp.focus();inp.select();ensureVisibleV68(inp);
       $('v68FoodAdd').onclick=()=>{addFoodEntry(f,Number(String(inp.value).replace(',','.')));closeSheet({all:true})}
     })
   };
   const bind=()=>{
     const input=$('v68FoodSearch');input.oninput=()=>{q=input.value.trim().toLowerCase();$('v68FoodRows').innerHTML=markup();$('v68FoodClear').classList.toggle('hidden',!q);bindRows()};
     $('v68FoodClear').onclick=()=>{q='';input.value='';$('v68FoodRows').innerHTML=markup();bindRows();input.focus()};
     bindRows();input.focus()
   };
   openSheet(options.title||'Lebensmittel hinzufügen',body(),bind)
 };

 /* Drink choice focuses amount synchronously, which is required by iOS. */
 openQuickDrinkEntry=function(){
   ensureDrinks();let selectedId=nutrition.drinks[0]?.id||null;
   const render=(focus=false)=>{
     const d=nutrition.drinks.find(x=>String(x.id)===String(selectedId))||nutrition.drinks[0];if(!d)return;
     $('sheetBody').innerHTML=`<div class="quick-drink-grid">${nutrition.drinks.map(x=>`<button class="quick-drink-choice ${String(x.id)===String(d.id)?'active':''} ${drinkTone(x)}" data-v68-drink="${x.id}"><span class="drink-icon">${x.icon||'🥤'}</span><span>${esc(x.name)}</span></button>`).join('')}</div><div class="form-field" style="margin-top:12px"><label>MENGE ML</label><input id="v68DrinkAmount" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div><div class="small quick-drink-meta">${d.hydration}% Hydrierung · ${d.calories||0} kcal/250 ml · ${d.caffeine||0} mg Koffein</div><button id="v68DrinkApply" class="primary" style="width:100%;margin-top:12px">Eintragen</button>`;
     document.querySelectorAll('[data-v68-drink]').forEach(b=>b.onclick=()=>{selectedId=b.dataset.v68Drink;render(true)});
     $('v68DrinkApply').onclick=()=>{addDrinkEntry(d,$('v68DrinkAmount').value);closeSheet({all:true})};
     if(focus){const a=$('v68DrinkAmount');a.focus();a.select();ensureVisibleV68(a)}
   };
   openSheet('Getränk eintragen','');render(false)
 };
 if($('addWaterBtn'))$('addWaterBtn').onclick=openQuickDrinkEntry;

 /* Rebind saved meals to the new fraction picker after every profile render. */
 const profileBeforeV68=window.renderProfile||renderProfile;
 window.renderProfile=renderProfile=function(){
   profileBeforeV68();
   document.querySelectorAll('[data-meal-log]').forEach(b=>b.onclick=()=>{const m=(nutrition.meals||[]).find(x=>String(x.id)===String(b.dataset.mealLog));if(m)openMealLogV68(m)});
   if($('addFoodTodayBtn'))$('addFoodTodayBtn').onclick=()=>openFoodSearch('')
 };

 /* Safe annual cleanup: opt-in, never deletes silently. Keeps current + previous calendar year. */
 function annualCleanupV68(){
   if(localStorage.getItem(ANNUAL_CLEANUP_KEY)!=='1')return;
   const year=new Date().getFullYear(),last=Number(localStorage.getItem(ANNUAL_CLEANUP_YEAR)||year);
   if(last>=year)return;
   localStorage.setItem(ANNUAL_CLEANUP_YEAR,String(year));
   const cutoff=new Date(year-1,0,1).getTime();
   openSheet('Jährliche Datenbereinigung?',`<p class="small">Um lokalen Speicher zu sparen, können Verlaufs-, Ernährungs- und Hydrierungsdaten vor dem 01.01.${year-1} gelöscht werden. Pläne, eigene Lebensmittel, Mahlzeiten und Messungen bleiben erhalten.</p><button id="v68CleanupNow" class="secondary danger" style="width:100%">Alte Verlaufsdaten löschen</button><button id="v68CleanupLater" class="secondary" style="width:100%;margin-top:8px">Dieses Jahr behalten</button>`);
   $('v68CleanupNow').onclick=()=>{history=history.filter(w=>Number(w.finishedAt||w.startedAt||0)>=cutoff);nutrition.foodLog=(nutrition.foodLog||[]).filter(x=>new Date(x.date+'T12:00:00').getTime()>=cutoff);const hyd=hydrationLog().filter(x=>Number(x.at)>=cutoff);write(HYDRATION_LOG_KEY,hyd);saveAll();closeSheet({all:true});toast('Alte Verlaufsdaten gelöscht')};
   $('v68CleanupLater').onclick=()=>closeSheet({all:true})
 }
 const settingsBeforeV68=window.openSettingsPage||openSettingsPage;
 window.openSettingsPage=openSettingsPage=function(){
   settingsBeforeV68();
   requestAnimationFrame(()=>{
     const body=$('settingsBody');if(!body||$('v68CleanupSetting'))return;
     const sec=document.createElement('div');sec.className='settings-section';sec.id='v68CleanupSetting';
     sec.innerHTML=`<h3>Speicher</h3><div class="settings-card"><div class="settings-row"><div><strong>Jährliche Datenbereinigung</strong><small>Nur Erinnerung; gelöscht wird immer erst nach Bestätigung. Behält aktuelles + vorheriges Kalenderjahr.</small></div><label class="switch"><input id="v68CleanupToggle" type="checkbox" ${localStorage.getItem(ANNUAL_CLEANUP_KEY)==='1'?'checked':''}><span></span></label></div></div>`;
     body.appendChild(sec);$('v68CleanupToggle').onchange=()=>{localStorage.setItem(ANNUAL_CLEANUP_KEY,$('v68CleanupToggle').checked?'1':'0');if($('v68CleanupToggle').checked)localStorage.setItem(ANNUAL_CLEANUP_YEAR,String(new Date().getFullYear()))}
   })
 };
 setTimeout(annualCleanupV68,800)
})();


/* v69 hardening */
(function(){
 const CLEANUP_ENABLED='rethink_annual_cleanup_enabled_v1',CLEANUP_YEAR='rethink_annual_cleanup_prompt_year_v1';

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

 /* Exact read-only preview using live renderers. */
 openPreview=function(p){
   $('previewTitle').textContent=p.name||'Workout Vorschau';
   const pp={...clone(p),activeExerciseIndex:-1,exercises:clone(p.exercises||[]).map(e=>{const x=normPlanEx(e);x.liveSets=Array.from({length:x.sets||3},(_,i)=>initSet(x,i));return x})};
   const old=activeWorkout;activeWorkout=pp;
   let markup='';
   try{markup=liveVisualGroups(pp.exercises).map(g=>g.group?renderLiveGroupCard(g):renderLiveSingleCard(g.members[0].e,g.members[0].i)).join('')}
   finally{activeWorkout=old}
   $('previewBody').innerHTML=`<div class="preview-live-shell preview-exact">${markup}</div>`;
   $('previewBody').querySelectorAll('input,textarea,select').forEach(x=>{x.readOnly=true;x.disabled=true;x.tabIndex=-1});
   $('previewBody').querySelectorAll('[data-live-detail]').forEach(b=>b.onclick=()=>openExerciseDetail(b.dataset.liveDetail));
   openPage('previewPage')
 };

 /* Week running state + click back into running unit. */
 function v69WeekDate(day){return dateKeyLocal(weekDateAt(day))}
 function v69WeekRunning(day){return !!activeWorkout?.weekDate&&String(activeWorkout.weekDate)===String(v69WeekDate(day))}
 renderWeek=function(){
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
 openWeekPicker=function(day){
   let selected=validWeekPlans(day).map(p=>p.id),q='';
   const render=()=>{
     const rows=sortedPlansForPicker(q);
     $('sheetBody').innerHTML=`<div class="plan-picker-tools"><div class="search"><input id="weekSearch" placeholder="Plan suchen" value="${esc(q)}"><button id="weekSearchClear">×</button></div></div>
       ${rows.map(p=>{const order=selected.indexOf(p.id)+1;return`<button class="plan-card week-select-card ${order?'selected':''}" data-wpick="${p.id}"><div><strong>${esc(p.name)}</strong><small>${p.exercises.length} Übungen · ${countPlanSets(p)} Sätze</small></div><span>${order?`<span class="week-order-badge">${order}</span>`:'›'}</span></button>`}).join('')}
       <div class="small" style="margin:8px 0">${selected.length?`Reihenfolge: ${selected.map((id,i)=>`${i+1}. ${esc(plans.find(p=>p.id===id)?.name||'Plan')}`).join(' · ')}`:'Kein Plan gewählt'}</div>
       <button id="weekApply" class="primary" style="width:100%">Übernehmen</button>`;
     $('weekSearch').oninput=()=>{q=$('weekSearch').value;render()};
     $('weekSearchClear').onclick=()=>{q='';render()};
     document.querySelectorAll('[data-wpick]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.wpick),i=selected.indexOf(id);if(i>=0)selected.splice(i,1);else selected.push(id);render()});
     $('weekApply').onclick=()=>{const had=validWeekPlans(day).length>0;weekPlan[day]=selected.filter(id=>plans.some(p=>String(p.id)===String(id)));if(had&&!weekPlan[day].length)clearWeekCompletionForDay(day);saveAll();closeSheet({all:true});renderWeek();renderProfileProgress?.()}
   };
   openSheet('Trainingsplan auswählen','');render()
 };

 /* Stable food search + own foods + meals + requested portion units. */
 function v69FoodList(){return window.__allFoodsV52?window.__allFoodsV52():[]}
 function v69Serving(f){return window.__foodServingV52?window.__foodServingV52(f):{grams:100,label:'1 Portion'}}
 function v69Nutrients(f,g){return window.__nutrientsForV52?window.__nutrientsForV52(f,g):{kcal:0,protein:0,water:0}}
 function v69MealTotals(m){return window.__mealTotalsV52?window.__mealTotalsV52(m.items||[]):{grams:0,kcal:0,protein:0,water:0}}
 function v69Reveal(input){
   if(!input)return;
   const body=input.closest('.sheet-body');if(!body)return;
   const go=()=>{const vv=window.visualViewport,r=input.getBoundingClientRect(),bottom=vv?vv.offsetTop+vv.height:innerHeight;const delta=r.bottom-(bottom-12);if(delta>0)body.scrollTop+=delta+8};
   requestAnimationFrame(go);setTimeout(go,80);setTimeout(go,220)
 }
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
   const score=(f)=>{const n=String(f.name||'').toLowerCase(),c=String(f.category||'').toLowerCase();if(!q)return 0;if(n===q)return 100;if(n.startsWith(q))return 90;if(n.split(/[\s\-_/()]+/).some(w=>w.startsWith(q)))return 80;if(c.startsWith(q))return 75;if(n.includes(q))return 45;if(c.includes(q))return 40;return-1};
   const rows=()=>{
     const foods=v69FoodList().map(f=>({type:'food',item:f,score:score(f),used:(nutrition.foodLog||[]).filter(x=>String(x.name).toLowerCase()===String(f.name).toLowerCase()).length}));
     const meals=(nutrition.meals||[]).map(m=>({type:'meal',item:m,score:score({name:m.name,category:'Mahlzeit'}),used:(nutrition.foodLog||[]).filter(x=>String(x.mealId)===String(m.id)).length}));
     return [...foods,...meals].filter(x=>q?x.score>=0:x.used>0).sort((a,b)=>b.score-a.score||b.used-a.used||String(a.item.name).localeCompare(String(b.item.name),'de')).slice(0,100)
   };
   const markup=()=>rows().map(x=>{
     if(x.type==='meal'){const t=v69MealTotals(x.item);return`<button class="food-result" data-v69-meal-result="${x.item.id}"><div class="food-result-copy"><strong>${esc(x.item.name)}</strong><small>Mahlzeit${x.used?` · ${x.used}× verwendet`:''}</small></div><span class="food-result-values">${Math.round(t.kcal)} kcal · ${Math.round(t.protein*10)/10} g Protein · ${Math.round(t.water)} g Wasser</span></button>`}
     const f=x.item,s=v69Serving(f),key=f._customId?`custom:${f._customId}`:`builtin:${f.name}`;return`<button class="food-result ${foodTone(f.category)}" data-v69-food-result="${esc(key)}"><div class="food-result-copy"><strong>${esc(f.name)}</strong><small>${esc(f.category||'Eigenes Lebensmittel')}${x.used?` · ${x.used}× verwendet`:''}</small><span class="food-serving">${esc(s.label)} ≈ ${s.grams} g</span></div><span class="food-result-values">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser</span></button>`
   }).join('')||(q?'<div class="small empty-food-note">Kein passender Treffer.</div>':'<div class="food-search-empty"><strong>Lebensmittel oder Mahlzeit suchen</strong></div>');
   const body=()=>`<div class="food-search-sticky"><div class="search food-search"><span class="search-loupe">⌕</span><input id="v69FoodSearch" class="field" type="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Lebensmittel, Mahlzeit oder Kategorie" value="${esc(q)}"><button id="v69FoodClear" class="${q?'':'hidden'}">×</button></div></div><div id="v69FoodRows">${markup()}</div>`;
   const bindRows=()=>{
     document.querySelectorAll('[data-v69-meal-result]').forEach(b=>b.onclick=()=>{const m=(nutrition.meals||[]).find(x=>String(x.id)===String(b.dataset.v69MealResult));if(options.selectOnly){toast('Bitte einzelne Zutaten wählen.');return}if(m)v69MealEntry(m)});
     document.querySelectorAll('[data-v69-food-result]').forEach(b=>b.onclick=()=>{
       const key=b.dataset.v69FoodResult,all=v69FoodList(),f=key.startsWith('custom:')?all.find(x=>String(x._customId)===key.slice(7)):all.find(x=>String(x.name)===key.slice(8));if(!f)return;
       if(options.selectOnly&&typeof options.onSelect==='function'){options.onSelect(f);return}
       const s=v69Serving(f);
       openSheet(f.name,`<div class="food-selected ${foodTone(f.category)}"><strong>${esc(f.name)}</strong><div class="small">${f.kcal} kcal · ${f.protein} g Protein · ${Math.round(f.water||0)} g Wasser je 100 g</div><span class="food-serving">${esc(s.label)} ≈ ${s.grams} g</span></div>
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
     $('v69FoodClear').onclick=()=>{q='';input.value='';$('v69FoodRows').innerHTML=markup();bindRows();input.focus()};
     bindRows();input.focus()
   };
   openSheet(options.title||'Lebensmittel hinzufügen',body(),bind)
 };

 /* iOS requires focus directly in the user click event for the keyboard. */
 openQuickDrinkEntry=function(){
   ensureDrinks();let selectedId=nutrition.drinks[0]?.id||null;
   const render=()=>{
     const d=nutrition.drinks.find(x=>String(x.id)===String(selectedId))||nutrition.drinks[0];if(!d)return;
     $('sheetBody').innerHTML=`<div class="quick-drink-grid">${nutrition.drinks.map(x=>`<button class="quick-drink-choice ${String(x.id)===String(d.id)?'active':''} ${drinkTone(x)}" data-v69-drink="${x.id}"><span class="drink-icon">${x.icon||'🥤'}</span><span>${esc(x.name)}</span></button>`).join('')}</div>
     <div class="form-field" style="margin-top:12px"><label>MENGE ML</label><input id="v69DrinkAmount" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div>
     <div class="small quick-drink-meta">${d.hydration}% Hydrierung · ${d.calories||0} kcal/250 ml · ${d.caffeine||0} mg Koffein</div><button id="v69DrinkApply" class="primary" style="width:100%;margin-top:12px">Eintragen</button>`;
     document.querySelectorAll('[data-v69-drink]').forEach(b=>b.onpointerup=()=>{selectedId=b.dataset.v69Drink;render();const inp=$('v69DrinkAmount');inp.focus({preventScroll:true});inp.select();v69Reveal(inp)});
     $('v69DrinkApply').onclick=()=>{addDrinkEntry(d,$('v69DrinkAmount').value);closeSheet({all:true})}
   };
   openSheet('Getränk eintragen','');render()
 };
 if($('addWaterBtn'))$('addWaterBtn').onclick=openQuickDrinkEntry;

 /* Reset profile day to Today on a true PWA process start. */
 const restoreBeforeV69=restoreUI;
 restoreUI=function(){
   const same=sessionStorage.getItem(SESSION_MARKER)==='1';
   if(!same){profileDayOffset=0;localStorage.setItem(PROFILE_DAY_OFFSET_KEY,'0')}
   return restoreBeforeV69()
 };

 /* Safe yearly cleanup remains opt-in and confirm-before-delete. */
 if(localStorage.getItem(CLEANUP_ENABLED)==='1'&&!localStorage.getItem(CLEANUP_YEAR)){
   localStorage.setItem(CLEANUP_YEAR,String(new Date().getFullYear()))
 }
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
 renderLive=function(){
   if(activeWorkout?.exercises?.length){
     const idx=Math.max(0,Math.min(Number(activeWorkout.activeExerciseIndex)||0,activeWorkout.exercises.length-1));
     const current=activeWorkout.exercises[idx];
     if(exerciseDoneV69(current))activeWorkout.activeExerciseIndex=firstOpenInVisualOrderV69()
   }
   return renderBeforeV69Active()
 };
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
 const renderWeekBeforeV70=renderWeek;
 renderWeek=function(){
   renderWeekBeforeV70();
   document.querySelectorAll('[data-v69-week-main]').forEach(btn=>{
     const day=Number(btn.dataset.v69WeekMain),strong=btn.querySelector('strong');
     if(strong&&hasRecurringV70(day)&&!strong.querySelector('.week-repeat-badge'))strong.insertAdjacentHTML('beforeend',repeatMarkerV70(day))
   })
 };

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
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")saveTabUiSnapshots()});
 window.addEventListener("pagehide",saveTabUiSnapshots);
 const persistBeforeTabState=persistUI;
 persistUI=function(){saveTabUiSnapshots();return persistBeforeTabState()}
})();


/* Rethink_v3.1 — tab/input hardening */
(function(){
 function scrollContainerV31(el){return el.closest(".sheet-body")||el.closest(".page")||document.scrollingElement}
 function revealInputV31(el){
   if(!el?.isConnected)return;
   const vv=window.visualViewport;
   const viewportTop=vv?vv.offsetTop:0;
   const viewportBottom=vv?(vv.offsetTop+vv.height):window.innerHeight;
   const r=el.getBoundingClientRect();
   const targetBottom=viewportBottom-14;
   let delta=0;
   if(r.bottom>targetBottom)delta=r.bottom-targetBottom+8;
   else if(r.top<viewportTop+64)delta=r.top-(viewportTop+72);
   if(Math.abs(delta)<2)return;
   const c=scrollContainerV31(el);
   if(c===document.scrollingElement||c===document.documentElement||c===document.body)window.scrollBy({top:delta,behavior:"auto"});
   else c.scrollTop+=delta
 }
 function stabilizeV31(el){[0,60,140,260,380].forEach(ms=>setTimeout(()=>revealInputV31(el),ms))}
 window.revealInputV31=revealInputV31;
 document.addEventListener("focusin",e=>{
   const el=e.target;if(!el.matches?.(".sheet-body input,.sheet-body textarea,.sheet-body select"))return;
   stabilizeV31(el)
 },true);
 if(window.visualViewport){
   visualViewport.addEventListener("resize",()=>{
     const el=document.activeElement;
     if(el?.matches?.(".sheet-body input,.sheet-body textarea,.sheet-body select"))stabilizeV31(el)
   },true)
 }
 const oldOpenWeekPickerV31=openWeekPicker;
 openWeekPicker=function(day){
   oldOpenWeekPickerV31(day);
   const attach=()=>{
     const weeks=$("v70RepeatWeeks");
     if(weeks){
       const selectAll=()=>{try{weeks.select()}catch{};stabilizeV31(weeks)};
       weeks.onfocus=selectAll;weeks.onclick=selectAll;weeks.onpointerup=()=>setTimeout(selectAll,0)
     }
     const date=$("v70RepeatEnd");
     if(date){
       date.min=date.min||dateKeyLocal(weekDateAt(day));
       date.onfocus=()=>stabilizeV31(date);date.onclick=()=>stabilizeV31(date)
     }
   };
   requestAnimationFrame(attach);setTimeout(attach,40)
 };
 document.addEventListener("change",e=>{
   if(e.target?.id!=="v70RepeatMode")return;
   setTimeout(()=>{
     const weeks=$("v70RepeatWeeks");
     if(weeks){
       const selectAll=()=>{try{weeks.select()}catch{};stabilizeV31(weeks)};
       weeks.onfocus=selectAll;weeks.onclick=selectAll;weeks.onpointerup=()=>setTimeout(selectAll,0)
     }
     const date=$("v70RepeatEnd");if(date)date.onfocus=()=>stabilizeV31(date)
   },0)
 },true);

 const oldQuickDrinkV31=openQuickDrinkEntry;
 openQuickDrinkEntry=function(){
   oldQuickDrinkV31();
   const bind=()=>{
     document.querySelectorAll("[data-v69-drink],[data-quick-drink]").forEach(btn=>{
       const oldPointer=btn.onpointerup,oldClick=btn.onclick;
       btn.onpointerup=(ev)=>{
         if(typeof oldPointer==="function")oldPointer.call(btn,ev);
         else if(typeof oldClick==="function")oldClick.call(btn,ev);
         setTimeout(()=>{
           const input=$("v69DrinkAmount")||$("quickDrinkAmount");
           if(input){input.focus({preventScroll:true});input.select?.();stabilizeV31(input)}
         },0)
       }
     });
     const input=$("v69DrinkAmount")||$("quickDrinkAmount");if(input)input.onfocus=()=>stabilizeV31(input)
   };
   requestAnimationFrame(bind);setTimeout(bind,50)
 };
 if($("addWaterBtn"))$("addWaterBtn").onclick=openQuickDrinkEntry;
})();


/* Rethink_v3.1 repair — final active keyboard handlers */
(function(){
 function revealFieldFinal(el){
   if(!el?.isConnected)return;
   const body=el.closest(".sheet-body");if(!body)return;
   const adjust=()=>{
     const vv=window.visualViewport;
     const bottom=vv?(vv.offsetTop+vv.height):window.innerHeight;
     const top=vv?vv.offsetTop:0;
     const r=el.getBoundingClientRect();
     // Keep the field in the upper part of the visible keyboard-safe area.
     const desiredBottom=bottom-18;
     const desiredTop=Math.max(top+70,desiredBottom-Math.max(80,r.height+42));
     if(r.bottom>desiredBottom)body.scrollTop+=r.bottom-desiredBottom+10;
     else if(r.top<top+56)body.scrollTop-=Math.min(body.scrollTop,(top+70)-r.top);
   };
   adjust();requestAnimationFrame(adjust);[60,140,260,420].forEach(ms=>setTimeout(adjust,ms))
 }
 window.revealFieldFinal=revealFieldFinal;

 // Direct user-activation handler: tapping X-weeks focuses the number input and selects it synchronously.
 document.addEventListener("pointerdown",e=>{
   const el=e.target;
   if(el?.id==="v70RepeatWeeks"){
     try{el.focus({preventScroll:true})}catch{el.focus()}
     try{el.select()}catch{}
     revealFieldFinal(el)
   }
 },true);
 document.addEventListener("click",e=>{
   const el=e.target;
   if(el?.id==="v70RepeatWeeks"){
     try{el.focus({preventScroll:true})}catch{el.focus()}
     try{el.select()}catch{}
     revealFieldFinal(el)
   }else if(el?.id==="v70RepeatEnd"){
     revealFieldFinal(el)
   }
 },true);
 document.addEventListener("focusin",e=>{
   const el=e.target;
   if(el?.matches?.(".sheet-body input,.sheet-body textarea,.sheet-body select"))revealFieldFinal(el)
 },true);
 if(window.visualViewport){
   visualViewport.addEventListener("resize",()=>{
     const el=document.activeElement;
     if(el?.matches?.(".sheet-body input,.sheet-body textarea,.sheet-body select"))revealFieldFinal(el)
   },true)
 }

 // One final drink-entry implementation: click a drink -> recreate amount field -> focus it immediately.
 openQuickDrinkEntry=function(){
   ensureDrinks();let selectedId=nutrition.drinks[0]?.id||null;
   const render=(focusAmount=false)=>{
     const d=nutrition.drinks.find(x=>String(x.id)===String(selectedId))||nutrition.drinks[0];if(!d)return;
     $("sheetBody").innerHTML=`<div class="quick-drink-grid">${nutrition.drinks.map(x=>`<button class="quick-drink-choice ${String(x.id)===String(d.id)?"active":""} ${drinkTone(x)}" data-final-drink="${x.id}"><span class="drink-icon">${x.icon||"🥤"}</span><span>${esc(x.name)}</span></button>`).join("")}</div>
       <div class="form-field" style="margin-top:8px"><label>MENGE ML</label><input id="finalDrinkAmount" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div>
       <div class="small quick-drink-meta">${d.hydration}% Hydrierung · ${d.calories||0} kcal/250 ml · ${d.caffeine||0} mg Koffein</div>
       <button id="finalDrinkApply" class="primary" style="width:100%;margin-top:10px">Eintragen</button>`;
     document.querySelectorAll("[data-final-drink]").forEach(btn=>btn.onclick=()=>{
       selectedId=btn.dataset.finalDrink;
       render(true);
       const input=$("finalDrinkAmount");
       if(input){
         try{input.focus({preventScroll:true})}catch{input.focus()}
         input.select?.();revealFieldFinal(input)
       }
     });
     $("finalDrinkApply").onclick=()=>{addDrinkEntry(d,$("finalDrinkAmount").value);closeSheet({all:true})};
     if(focusAmount){
       const input=$("finalDrinkAmount");
       if(input){try{input.focus({preventScroll:true})}catch{input.focus()}input.select?.();revealFieldFinal(input)}
     }
   };
   openSheet("Getränk eintragen","");render(false)
 };
 if($("addWaterBtn"))$("addWaterBtn").onclick=openQuickDrinkEntry;
})();


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
   const r=e?._lastRatings?.[si];
   return r?`<span class="previous-rating-dot rating-${esc(r)}" title="Bewertung letztes passendes Workout"></span>`:""
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

 function combinedMemberControlsFinalV31(x,si,gi){
   const s=x.e.liveSets?.[si];if(!s)return"";
   const idx=`${si+1}${String.fromCharCode(97+gi)}`,dot=priorRatingDotV31(x.e,si);
   if(x.e.measureMode==="time"){
     return`<div class="combined-member-block combined-time-member">
       <div class="combined-member-title"><span class="combined-index combined-index-with-history">${idx}${dot}</span><button class="combined-name exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}">${esc(x.e.name)}</button></div>
       <div class="combined-time-controls"><input type="text" inputmode="numeric" autocomplete="off" data-time-field="1" data-input="${x.i}|${si}|time" value="${formatTime(s.time)}"><button class="time-play" data-time-play="${x.i}|${si}">▶</button><input type="text" inputmode="decimal" data-input="${x.i}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight||"")}"><input type="text" inputmode="decimal" data-input="${x.i}|${si}|level" placeholder="${esc(s._suggested?.level||"S/W")}" value="${esc(s.level||"")}"><button class="set-check ${s.completed?"done":""} ${ratingClass(s)} ${canRateSet(x.e,s)?"ready":""}" data-check="${x.i}|${si}">✓</button></div>
     </div>`
   }
   return`<div class="combined-member-row">
     <span class="combined-index combined-index-with-history">${idx}${dot}</span>
     <button class="combined-name exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}">${esc(x.e.name)}</button>
     <input type="text" inputmode="decimal" autocomplete="off" data-input="${x.i}|${si}|weight" placeholder="${esc(s._suggested?.weight||"KG")}" value="${esc(s.weight||"")}">
     <input type="text" inputmode="numeric" autocomplete="off" data-input="${x.i}|${si}|reps" placeholder="${esc(s._suggested?.reps||"WDH.")}" value="${esc(s.reps||"")}">
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
     g.members.forEach((x,gi)=>{rows+=combinedMemberControlsFinalV31(x,si,gi)});
     rows+=`</div>`
   }
   return`<div class="method-card live-exercise-card connected-live-card method-${g.method} ${active?"active-live-exercise":""} ${complete?"live-card-complete live-method-complete":""}" data-live-card="${first.i}">
     <div class="live-card-topline"><div class="method-name">${METHOD_LABEL[g.method]}</div>${complete?'<div class="live-complete-badge"><span class="tick">✓</span>Abgeschlossen</div>':""}</div>
     <div class="combined-series-head"><div>${g.members.map((x,gi)=>`<div class="combined-series-name live-group-member-head"><strong>${String.fromCharCode(65+gi)}</strong><button class="exercise-title-link" data-live-detail="${esc(x.e.name)}" data-live-index="${x.i}">${esc(x.e.name)}</button><button class="live-group-member-delete" data-delete-live-ex="${x.i}" aria-label="${esc(x.e.name)} löschen">−</button></div>`).join("")}</div>
     <button class="icon-btn" data-live-config="${first.i}" aria-label="Serie bearbeiten">✎</button></div>
     <div class="method-help">${esc(methodHelp(g.method))}</div>
     ${rows}
     <button class="secondary" data-add-group-set="${esc(g.key)}" style="margin-top:8px">Satz hinzufügen</button>
   </div>`
 }

 function singleSetRowsWithHistoryV31(markup,e){
   if(!e?._lastRatings?.length)return markup;
   let setIndex=0;
   return markup.replace(/(<span class="(?:set-index|advanced-index|time-index)[^"]*">)([^<]+)(<\/span>)/g,(all,a,b,c)=>{
     const dot=priorRatingDotV31(e,setIndex++);
     return`${a}<span class="set-index-with-history">${dot}${b}</span>${c}`
   })
 }
 function renderLiveSingleCardFinalV31(e,i){
   const complete=exerciseFullyRatedV31(e),active=!complete&&Number(activeWorkout.activeExerciseIndex||0)===i;
   const setsMarkup=singleSetRowsWithHistoryV31(renderSets(e,i),e);
   return`<div class="method-card live-exercise-card method-${e.setTechnique||"standard"} ${active?"active-live-exercise":""} ${complete?"live-card-complete live-method-complete":""}" data-live-card="${i}">
     <div class="live-card-topline"><div class="method-name">${METHOD_LABEL[e.setTechnique||"standard"]}</div>${complete?'<div class="live-complete-badge"><span class="tick">✓</span>Abgeschlossen</div>':""}</div>
     <div class="live-card-head"><div><button class="exercise-title-link" data-live-detail="${esc(e.name)}" data-live-index="${i}">${esc(e.name)}</button><div class="prescription">${esc(planPrescription(e))}</div></div><div class="live-card-actions"><button class="icon-btn" data-live-config="${i}" aria-label="Übung bearbeiten">✎</button><button class="live-delete-ex" data-delete-live-ex="${i}" aria-label="Übung löschen">−</button></div></div>
     <div class="method-help">${esc(methodHelp(e.setTechnique))}</div>${e.variant||e.perSide?`<div class="variant-line">${e.variant?esc(e.variant):""}${e.variant&&e.perSide?" · ":""}${e.perSide?"WDH. pro Seite":""}</div>`:""}
     <div class="recommendation">${esc(recommendationFor(e))}</div><button class="note-line" data-live-note="${i}" style="border:0;background:transparent;padding:0">✎ ${esc(e.note||"Notiz")}</button>
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
   livePlanEdited=true;saveAll();renderLive()
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
     x.onfocus=()=>{try{x.select?.()}catch{};if(window.revealFieldFinal)revealFieldFinal(x)};
     x.addEventListener("pointerdown",ev=>ev.stopPropagation());
     x.addEventListener("click",ev=>{ev.stopPropagation();if(window.revealFieldFinal)revealFieldFinal(x)})
   });
   document.querySelectorAll("[data-add-set]").forEach(b=>b.onclick=()=>{const e=activeWorkout.exercises[Number(b.dataset.addSet)];e.liveSets.push(initSet(e,e.liveSets.length));livePlanEdited=true;saveAll();renderLive()});
   document.querySelectorAll("[data-add-group-set]").forEach(b=>b.onclick=()=>{const gid=b.dataset.addGroupSet,members=activeWorkout.exercises.map((x,i)=>x.techniqueGroup===gid?i:-1).filter(i=>i>=0);members.forEach(i=>{const e=activeWorkout.exercises[i];e.liveSets.push(initSet(e,e.liveSets.length));e.sets=e.liveSets.length});livePlanEdited=true;saveAll();renderLive()});
   document.querySelectorAll("[data-remove-live-set]").forEach(b=>b.onclick=()=>removeLiveSet(b.dataset.removeLiveSet));
   document.querySelectorAll("[data-time-play]").forEach(b=>b.onclick=()=>toggleTimeTimer(b.dataset.timePlay,b))
 }

 renderLiveGroupCard=renderLiveGroupCardFinalV31;
 renderLiveSingleCard=renderLiveSingleCardFinalV31;
 const renderLiveCoreBeforeFinalV31=renderLive;
 renderLive=function(){
   normalizeActiveAfterRenderV31();
   $("workoutNoteText").textContent=activeWorkout.note||"Notiz";
   $("liveBody").innerHTML=liveVisualGroups(activeWorkout.exercises).map(g=>g.group?renderLiveGroupCardFinalV31(g):renderLiveSingleCardFinalV31(g.members[0].e,g.members[0].i)).join("");
   bindLiveFinalV31()
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

 // All live inputs, including dynamically re-rendered ones, remain above the software keyboard.
 document.addEventListener("focusin",e=>{
   const el=e.target;
   if(el?.matches?.("#livePage input,#livePage textarea,#livePage select")&&window.revealFieldFinal)revealFieldFinal(el)
 },true);

 // Hydration: amount control is above the drink grid, then the selectable drinks follow.
 openQuickDrinkEntry=function(){
   ensureDrinks();let selectedId=nutrition.drinks[0]?.id||null;
   const render=(focusAmount=false)=>{
     const d=nutrition.drinks.find(x=>String(x.id)===String(selectedId))||nutrition.drinks[0];if(!d)return;
     $("sheetBody").innerHTML=`
       <div class="final-drink-entry-top">
         <div class="final-drink-selected"><span class="drink-icon">${d.icon||"🥤"}</span><div><strong>${esc(d.name)}</strong><div class="small">${d.hydration}% Hydrierung · ${d.calories||0} kcal/250 ml · ${d.caffeine||0} mg Koffein</div></div></div>
         <div class="form-field" style="margin-bottom:0"><label>MENGE ML</label><input id="finalDrinkAmount" class="field" inputmode="numeric" value="${d.lastSize||d.size||250}"></div>
       </div>
       <div class="quick-drink-grid">${nutrition.drinks.map(x=>`<button class="quick-drink-choice ${String(x.id)===String(d.id)?"active":""} ${drinkTone(x)}" data-final-drink="${x.id}"><span class="drink-icon">${x.icon||"🥤"}</span><span>${esc(x.name)}</span></button>`).join("")}</div>
       <button id="finalDrinkApply" class="primary" style="width:100%;margin-top:10px">Eintragen</button>`;
     document.querySelectorAll("[data-final-drink]").forEach(btn=>btn.onclick=()=>{
       selectedId=btn.dataset.finalDrink;render(true)
     });
     $("finalDrinkApply").onclick=()=>{addDrinkEntry(d,$("finalDrinkAmount").value);closeSheet({all:true})};
     const input=$("finalDrinkAmount");
     if(input){
       input.onfocus=()=>window.revealFieldFinal?.(input);
       if(focusAmount){
         try{input.focus({preventScroll:true})}catch{input.focus()}
         input.select?.();window.revealFieldFinal?.(input)
       }
     }
   };
   openSheet("Getränk eintragen","");render(false)
 };
 if($("addWaterBtn"))$("addWaterBtn").onclick=openQuickDrinkEntry;
})();


/* Rethink_v3.1 — previous-rating dots for every single-method layout */
(function(){
 function dotNodeV31(r){const dot=document.createElement("span");dot.className=`previous-rating-dot rating-${r}`;dot.title="Bewertung letztes passendes Workout";return dot}
 function addPreviousDotsToSinglesV31(){
   if(!activeWorkout)return;
   document.querySelectorAll(".live-exercise-card:not(.connected-live-card)[data-live-card]").forEach(card=>{
     const ei=Number(card.dataset.liveCard),e=activeWorkout.exercises[ei],ratings=e?._lastRatings||[];if(!ratings.length)return;
     [...card.querySelectorAll(".set-row,.time-row")].forEach((row,si)=>{
       const r=ratings[si],cell=row.firstElementChild;if(!r||!cell)return;
       cell.textContent=String(si+1);cell.classList.add("set-index-with-history");cell.append(dotNodeV31(r))
     });
     [...card.querySelectorAll(".advanced-head")].forEach((head,si)=>{
       const r=ratings[si],cell=head.firstElementChild;if(!r||!cell)return;
       cell.textContent=`SATZ ${si+1}`;cell.classList.add("set-index-with-history");cell.append(dotNodeV31(r))
     })
   })
 }
 const renderLiveBeforeHistoryDotsV31=renderLive;
 renderLive=function(){const result=renderLiveBeforeHistoryDotsV31();addPreviousDotsToSinglesV31();return result};
 window.addPreviousDotsToSinglesV31=addPreviousDotsToSinglesV31
})();


/* Rethink_v3.1 — dedicated live-workout keyboard visibility */
(function(){
 function revealLiveWorkoutFieldV31(el){
   if(!el?.isConnected||!el.closest("#livePage"))return;
   const page=$("livePage");if(!page)return;
   const adjust=()=>{
     const vv=window.visualViewport;
     const viewportTop=vv?vv.offsetTop:0;
     const viewportBottom=vv?(vv.offsetTop+vv.height):window.innerHeight;
     const keyboardOcclusion=vv?Math.max(0,window.innerHeight-vv.height-vv.offsetTop):0;
     // Give the scroll container enough physical space to move the last input above the keyboard.
     page.style.paddingBottom=`${Math.max(150,keyboardOcclusion+150)}px`;
     const r=el.getBoundingClientRect();
     const safeTop=viewportTop+72;
     const safeBottom=viewportBottom-24;
     if(r.bottom>safeBottom)page.scrollTop+=r.bottom-safeBottom+14;
     else if(r.top<safeTop)page.scrollTop=Math.max(0,page.scrollTop-(safeTop-r.top+8))
   };
   adjust();requestAnimationFrame(adjust);[60,140,260,420].forEach(ms=>setTimeout(adjust,ms))
 }
 window.revealLiveWorkoutFieldV31=revealLiveWorkoutFieldV31;
 document.addEventListener("focusin",e=>{
   const el=e.target;
   if(el?.matches?.("#livePage input,#livePage textarea,#livePage select"))revealLiveWorkoutFieldV31(el)
 },true);
 if(window.visualViewport){
   visualViewport.addEventListener("resize",()=>{
     const el=document.activeElement;
     if(el?.matches?.("#livePage input,#livePage textarea,#livePage select"))revealLiveWorkoutFieldV31(el);
     else if($("livePage")){
       const vv=window.visualViewport,keyboardOcclusion=Math.max(0,window.innerHeight-vv.height-vv.offsetTop);
       $("livePage").style.paddingBottom=`${Math.max(150,keyboardOcclusion+150)}px`
     }
   },true)
 }
})();

/* Rethink_v3.1 — units, week start and text size */
(function(){
 const PREF_KEY="rethink_preferences_v31",defaults={weightUnit:"kg",distanceUnit:"km",measurementUnit:"cm",weekStart:"monday",textScale:"normal"};
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
 function applyTextScaleV31(){document.documentElement.dataset.textScale=prefs.textScale||"normal"}applyTextScaleV31();
 function weekStartOfV31(date=new Date(),mode=prefs.weekStart){const d=new Date(date);d.setHours(12,0,0,0);const off=mode==="sunday"?d.getDay():(d.getDay()+6)%7;d.setDate(d.getDate()-off);return d}
 function weekDayLabelsV31(){return prefs.weekStart==="sunday"?["So","Mo","Di","Mi","Do","Fr","Sa"]:["Mo","Di","Mi","Do","Fr","Sa","So"]}
 function keyV31(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
 function migrateWeekStorageV31(oldMode,newMode){if(oldMode===newMode)return;const all=loadDatedWeeks(),byDate={};Object.entries(all).forEach(([startKey,arr])=>{const start=new Date(`${startKey}T12:00:00`);(Array.isArray(arr)?arr:[]).forEach((ids,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);if(Array.isArray(ids)&&ids.length)byDate[keyV31(d)]=ids})});const rebuilt={};Object.entries(byDate).forEach(([dateKey,ids])=>{const d=new Date(`${dateKey}T12:00:00`),start=weekStartOfV31(d,newMode),wk=keyV31(start),idx=Math.round((d-start)/86400000);if(!rebuilt[wk])rebuilt[wk]=[[],[],[],[],[],[],[]];if(idx>=0&&idx<7)rebuilt[wk][idx]=ids});write(WEEK_DATED_KEY,rebuilt)}
 weekKeyForOffset=function(offset=weekOffset){const d=weekStartOfV31();d.setDate(d.getDate()+Number(offset||0)*7);return keyV31(d)};
 weekDateAt=function(day,offset=weekOffset){const d=weekStartOfV31();d.setDate(d.getDate()+Number(offset||0)*7+Number(day||0));return d};
 selectedWeekInfo=function(){const d=profileDate(),start=weekStartOfV31(d),end=new Date(start);end.setDate(start.getDate()+7);const iso=new Date(d);iso.setHours(12,0,0,0);const id=(iso.getDay()+6)%7;iso.setDate(iso.getDate()-id+3);const y0=new Date(iso.getFullYear(),0,4,12),yd=(y0.getDay()+6)%7,yThu=new Date(y0);yThu.setDate(y0.getDate()-yd+3);const week=1+Math.round((iso-yThu)/604800000);return{start,end,week,label:`KW ${String(week).padStart(2,"0")}`}};
 function updateWeekLabelsV31(){document.querySelectorAll("#weekList .week-day").forEach((el,i)=>el.textContent=weekDayLabelsV31()[i]||"")}
 const renderWeekBeforePrefsV31=renderWeek;renderWeek=function(){const x=renderWeekBeforePrefsV31();updateWeekLabelsV31();return x};
 function unitizeSheetV31(){const body=$("sheetBody");if(!body)return;const walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const t=node.nodeValue;if(t&&t.trim()==="KG")node.nodeValue=t.replace(/KG/g,weightLabelV31())}if((body.querySelector(".method-tabs")||body.querySelector("[id*='MethodTabs']"))&&!body.querySelector(".unit-context-chip")){const chip=document.createElement("div");chip.className="unit-context-chip";chip.textContent=`Gewicht ${weightLabelV31()} · Distanz ${distanceLabelV31()}`;body.prepend(chip)}}
 const renderSheetBeforeUnitsV31=renderSheetState;renderSheetState=function(state){const x=renderSheetBeforeUnitsV31(state);requestAnimationFrame(unitizeSheetV31);return x};
 function weightFieldInfoV31(inp){const raw=inp?.dataset?.input;if(!raw)return null;const [ei,si,k,gi]=raw.split("|");return["weight","sw","gw"].includes(k)?{ei:Number(ei),si:Number(si),k,gi:Number(gi)}:null}
 function canonicalWeightForFieldV31(i){const e=activeWorkout?.exercises?.[i.ei],s=e?.liveSets?.[i.si];if(!s)return"";return i.k==="weight"?(s.weight??""):(s.segments?.[i.gi]?.weight??"")}
 function suggestedWeightForFieldV31(i){const e=activeWorkout?.exercises?.[i.ei],s=e?.liveSets?.[i.si];if(!s)return"";return i.k==="weight"?(s._suggested?.weight??""):(s.segments?.[i.gi]?._suggested?.weight??"")}
 function applyLiveUnitsV31(){document.querySelectorAll("#liveBody .set-head span,#liveBody .time-head span,#liveBody .advanced-head span,#liveBody .combined-value-head span").forEach(el=>{if(el.textContent.trim()==="KG")el.textContent=weightLabelV31()});document.querySelectorAll("#liveBody [data-input]").forEach(inp=>{const info=weightFieldInfoV31(inp);if(!info)return;const c=canonicalWeightForFieldV31(info),s=suggestedWeightForFieldV31(info);inp.value=String(c).trim()===""?"":String(weightDisplayV31(c));inp.placeholder=String(s).trim()===""?weightLabelV31():String(weightDisplayV31(s))})}
 const updateInputBeforeUnitsV31=updateInput;updateInput=function(inp){const info=weightFieldInfoV31(inp);if(!info||prefs.weightUnit==="kg")return updateInputBeforeUnitsV31(inp);const shown=inp.value,converted=weightStorageV31(shown);inp.value=converted===""?"":String(converted);const result=updateInputBeforeUnitsV31(inp);if(inp.isConnected)inp.value=shown;return result};
 const renderLiveBeforeUnitsV31=renderLive;renderLive=function(){const x=renderLiveBeforeUnitsV31();applyLiveUnitsV31();return x};
 function unitizePreviewV31(){document.querySelectorAll("#previewBody .preview-value,#previewBody .set-head span,#previewBody .time-head span,#previewBody .advanced-head span,#previewBody .combined-value-head span").forEach(el=>{if(el.textContent.trim()==="KG")el.textContent=weightLabelV31()})}
 const openPreviewBeforeUnitsV31=openPreview;openPreview=function(p){const x=openPreviewBeforeUnitsV31(p);requestAnimationFrame(unitizePreviewV31);return x};
 function formatMeasurementValuesV31(m){return `${m.bodyfat?`<span>Körperfett ${m.bodyfat}%</span>`:""}${m.waist?`<span>Taille ${lengthDisplayV31(m.waist)} ${lengthLabelV31().toLowerCase()}</span>`:""}${m.chest?`<span>Brust ${lengthDisplayV31(m.chest)} ${lengthLabelV31().toLowerCase()}</span>`:""}${m.hip?`<span>Hüfte ${lengthDisplayV31(m.hip)} ${lengthLabelV31().toLowerCase()}</span>`:""}`}
 function patchProfileUnitsV31(){const latest=measurements.slice().reverse().find(m=>Number(m.weight)>0),cw=Number(latest?.weight||profile.weight||0);if($("profileSummary"))$("profileSummary").textContent=[profile.age?profile.age+" J.":"",profile.height?`${lengthDisplayV31(profile.height)} ${lengthLabelV31().toLowerCase()}`:"",cw?`${weightDisplayV31(cw)} ${weightLabelV31().toLowerCase()}`:""].filter(Boolean).join(" · ")||"Noch nicht eingerichtet";if($("profileGoalSummary")){const base=profile.goal==="cut"?"Ziel: Gewicht reduzieren":profile.goal==="gain"?"Ziel: Muskelaufbau":profile.goal==="maintain"?"Ziel: Gewicht halten":"Persönliche Werte und Ziele";$("profileGoalSummary").innerHTML=`<span>${base}</span>${profile.targetWeight?`<span class="target-weight-line-profile">Wunschgewicht ${weightDisplayV31(profile.targetWeight)} ${weightLabelV31().toLowerCase()}</span>`:""}`}document.querySelectorAll("[data-measurement-open]").forEach(btn=>{const i=Number(btn.dataset.measurementOpen),m=measurements[i];if(!m)return;const strong=btn.querySelector("strong");if(strong)strong.textContent=m.weight?`${weightDisplayV31(m.weight)} ${weightLabelV31().toLowerCase()}`:"Messung";const vals=btn.querySelector(".measurement-values");if(vals)vals.innerHTML=formatMeasurementValuesV31(m);btn.onclick=()=>openMeasurementRecord(i)})}
 const renderProfileBeforeUnitsV31=renderProfile;renderProfile=function(){const x=renderProfileBeforeUnitsV31();patchProfileUnitsV31();requestAnimationFrame(()=>{patchProfileUnitsV31();renderProfileProgress()});return x};
 const renderProfileProgressBeforeUnitsV31=renderProfileProgress;renderProfileProgress=function(){const x=renderProfileProgressBeforeUnitsV31(),wt=weightTrend(),card=$("profileProgressOverview")?.querySelector(".profile-progress-grid .progress-stat:first-child");if(card&&wt){const strong=card.querySelector("strong"),goal=card.querySelector(".goal-line"),delta=prefs.weightUnit==="lb"?roundV31(wt.delta*2.2046226218,1):wt.delta;if(strong)strong.textContent=wt.hasTrend?`${delta>0?"+":""}${delta} ${weightLabelV31().toLowerCase()}`:`${weightDisplayV31(wt.current)} ${weightLabelV31().toLowerCase()}`;if(goal&&wt.target)goal.textContent=`Wunschgewicht ${weightDisplayV31(wt.target)} ${weightLabelV31().toLowerCase()} · ${weightDisplayV31(Math.abs(wt.distance))} ${weightLabelV31().toLowerCase()} ${wt.distance<0?"darüber":"bis Ziel"}`}return x};
 openMeasurementRecord=function(i){const m=measurements[i];if(!m)return;openSheet("Messung",`<div class="card"><strong>${m.weight?`${weightDisplayV31(m.weight)} ${weightLabelV31().toLowerCase()}`:"–"}</strong><div class="small">${new Date(m.date||Date.now()).toLocaleString("de-DE")}</div><div class="measurement-values" style="margin-top:12px">${formatMeasurementValuesV31(m)}</div></div><button id="deleteMeasurementRecord" class="secondary danger" style="width:100%;margin-top:12px">Messung löschen</button>`);$("deleteMeasurementRecord").onclick=()=>{if(confirm("Diese Messung wirklich löschen?")){measurements.splice(i,1);saveAll();closeSheet({all:true});renderProfile();toast("Messung gelöscht")}}};
 openMeasurementData=function(){openSheet("Messungen",`${measurements.slice().reverse().map((m,ri)=>{const i=measurements.length-1-ri;return`<div class="card" data-settings-measure-open="${i}"><div class="space"><div><strong>${m.weight?weightDisplayV31(m.weight):"–"} ${weightLabelV31().toLowerCase()}</strong><div class="small">${new Date(m.date||Date.now()).toLocaleString("de-DE")}</div></div><span>›</span></div></div>`}).join("")||'<div class="card small">Noch keine Messungen.</div>'}`);document.querySelectorAll("[data-settings-measure-open]").forEach(b=>b.onclick=()=>openMeasurementRecord(Number(b.dataset.settingsMeasureOpen)))};
 function openMeasurementEntryV31(){openSheet("Messung hinzufügen",`<div class="grid2"><div class="form-field"><label>GEWICHT ${weightLabelV31()}</label><input id="measureWeightUnits" class="field" inputmode="decimal"></div><div class="form-field"><label>KÖRPERFETT IN %</label><input id="measureBodyfatUnits" class="field" inputmode="decimal"></div></div><div class="grid2"><div class="form-field"><label>TAILLE ${lengthLabelV31()}</label><input id="measureWaistUnits" class="field" inputmode="decimal"></div><div class="form-field"><label>BRUST ${lengthLabelV31()}</label><input id="measureChestUnits" class="field" inputmode="decimal"></div></div><div class="form-field"><label>HÜFTE ${lengthLabelV31()}</label><input id="measureHipUnits" class="field" inputmode="decimal"></div><button id="measureSaveUnits" class="primary" style="width:100%">Speichern</button>`);$("measureSaveUnits").onclick=()=>{const weight=weightStorageV31($("measureWeightUnits").value);if(!weight||weight<20||weight>400){$("measureWeightUnits").focus();return alert("Bitte Gewicht eintragen.")}const md=profileDayOffset===0?Date.now():profileDate().setHours(12,0,0,0),m={date:md,weight,bodyfat:$("measureBodyfatUnits").value,waist:lengthStorageV31($("measureWaistUnits").value),chest:lengthStorageV31($("measureChestUnits").value),hip:lengthStorageV31($("measureHipUnits").value)};measurements.push(m);measurements.sort((a,b)=>Number(a.date)-Number(b.date));profile.weight=weight;saveAll();closeSheet({all:true});renderProfile()}}openMeasurementEntry=openMeasurementEntryV31;if($("addMeasurementBtn"))$("addMeasurementBtn").onclick=openMeasurementEntryV31;
 openProfileEditor=function(){openSheet("Profil bearbeiten",`<div class="profile-form-section"><h3>Persönliche Daten</h3><div class="grid2"><div class="form-field"><label>ALTER</label><input id="profileAgeEdit" class="field" inputmode="numeric" value="${esc(profile.age||"")}"></div><div class="form-field"><label>GRÖSSE ${lengthLabelV31()}</label><input id="profileHeightEdit" class="field" inputmode="decimal" value="${esc(profile.height?lengthDisplayV31(profile.height):"")}"></div></div><div class="form-field"><label>GESCHLECHT FÜR ENERGIEBERECHNUNG</label><select id="profileSexEdit" class="field"><option value="">Nicht gewählt</option><option value="female" ${profile.sex==="female"?"selected":""}>Weiblich</option><option value="male" ${profile.sex==="male"?"selected":""}>Männlich</option></select></div></div><div class="profile-form-section"><h3>Aktivität & Ziel</h3><div class="form-field"><label>AKTIVITÄT</label><select id="profileActivityEdit" class="field"><option value="1.2" ${String(profile.activity)==="1.2"?"selected":""}>Wenig aktiv</option><option value="1.375" ${String(profile.activity)==="1.375"?"selected":""}>Leicht aktiv</option><option value="1.55" ${!profile.activity||String(profile.activity)==="1.55"?"selected":""}>Moderat aktiv</option><option value="1.725" ${String(profile.activity)==="1.725"?"selected":""}>Sehr aktiv</option><option value="1.9" ${String(profile.activity)==="1.9"?"selected":""}>Extrem aktiv</option></select></div><div class="form-field"><label>ZIEL</label><select id="profileGoalEdit" class="field"><option value="cut" ${profile.goal==="cut"?"selected":""}>Gewicht reduzieren</option><option value="maintain" ${!profile.goal||profile.goal==="maintain"?"selected":""}>Gewicht halten</option><option value="gain" ${profile.goal==="gain"?"selected":""}>Muskelaufbau</option></select></div><div class="form-field"><label>WUNSCHGEWICHT ${weightLabelV31()}</label><input id="profileTargetWeightEdit" class="field" inputmode="decimal" value="${esc(profile.targetWeight?weightDisplayV31(profile.targetWeight):"")}"></div></div><button id="profileSaveEdit" class="primary" style="width:100%">Profil speichern</button>`);$("profileSaveEdit").onclick=()=>{const age=Number($("profileAgeEdit").value),height=lengthStorageV31($("profileHeightEdit").value),target=weightStorageV31($("profileTargetWeightEdit").value);if(age&&(age<14||age>100))return alert("Bitte ein realistisches Alter eingeben.");if(height&&(height<120||height>230))return alert("Bitte eine realistische Körpergröße eingeben.");if(target&&(target<30||target>300))return alert("Bitte ein realistisches Wunschgewicht eingeben.");profile.age=age||"";profile.height=height||"";profile.sex=$("profileSexEdit").value;profile.activity=$("profileActivityEdit").value;profile.goal=$("profileGoalEdit").value;profile.targetWeight=target||"";saveAll();closeSheet({all:true});renderProfile()}};
 const openSettingsBeforePrefsV31=openSettingsPage;openSettingsPage=function(){openSettingsBeforePrefsV31();requestAnimationFrame(()=>{const body=$("settingsBody");if(!body||$("unitSettingsV31"))return;const sec=document.createElement("div");sec.className="settings-section";sec.id="unitSettingsV31";sec.innerHTML=`<h3>Einheiten & Ansicht</h3><div class="settings-card"><div class="settings-row"><div><strong>Gewicht</strong><small>Training, Verlauf und Körpergewicht</small></div><select id="prefWeightUnit" class="field settings-unit-select"><option value="kg" ${prefs.weightUnit==="kg"?"selected":""}>kg</option><option value="lb" ${prefs.weightUnit==="lb"?"selected":""}>lb</option></select></div><div class="settings-row"><div><strong>Distanz</strong><small>Cardio-/Distanzangaben</small></div><select id="prefDistanceUnit" class="field settings-unit-select"><option value="km" ${prefs.distanceUnit==="km"?"selected":""}>km</option><option value="mi" ${prefs.distanceUnit==="mi"?"selected":""}>mi</option></select></div><div class="settings-row"><div><strong>Messungen</strong><small>Größe, Taille, Brust und Hüfte</small></div><select id="prefMeasurementUnit" class="field settings-unit-select"><option value="cm" ${prefs.measurementUnit==="cm"?"selected":""}>cm</option><option value="in" ${prefs.measurementUnit==="in"?"selected":""}>in</option></select></div><div class="settings-row"><div><strong>Wochenstart</strong><small>Reihenfolge und Datumsbereich</small></div><select id="prefWeekStart" class="field settings-unit-select"><option value="monday" ${prefs.weekStart==="monday"?"selected":""}>Montag</option><option value="sunday" ${prefs.weekStart==="sunday"?"selected":""}>Sonntag</option></select></div><div class="settings-row"><div><strong>Textgröße</strong><small>Darstellung der App-Schrift</small></div><select id="prefTextScale" class="field settings-unit-select"><option value="normal" ${prefs.textScale==="normal"?"selected":""}>Standard</option><option value="large" ${prefs.textScale==="large"?"selected":""}>Groß</option><option value="xlarge" ${prefs.textScale==="xlarge"?"selected":""}>Sehr groß</option></select></div></div>`;const training=[...body.querySelectorAll(".settings-section")].find(x=>x.querySelector("h3")?.textContent==="Training");if(training)body.insertBefore(sec,training);else body.appendChild(sec);$("prefWeightUnit").onchange=()=>{prefs.weightUnit=$("prefWeightUnit").value;savePrefsV31();if(activeWorkout)renderLive();renderProfile();unitizeSheetV31()};$("prefDistanceUnit").onchange=()=>{prefs.distanceUnit=$("prefDistanceUnit").value;savePrefsV31();unitizeSheetV31()};$("prefMeasurementUnit").onchange=()=>{prefs.measurementUnit=$("prefMeasurementUnit").value;savePrefsV31();renderProfile()};$("prefTextScale").onchange=()=>{prefs.textScale=$("prefTextScale").value;savePrefsV31();applyTextScaleV31()};$("prefWeekStart").onchange=()=>{const old=prefs.weekStart,next=$("prefWeekStart").value;saveCurrentWeekRefs();migrateWeekStorageV31(old,next);prefs.weekStart=next;savePrefsV31();loadWeekOffset(weekOffset);renderProfileProgress()}})};
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
 const BOOT_TOKEN="rethink_boot_token_v31";
 const thisBoot=`${Date.now()}_${Math.random().toString(36).slice(2)}`;
 const priorBoot=sessionStorage.getItem(BOOT_TOKEN);
 sessionStorage.setItem(BOOT_TOKEN,thisBoot);
 const trueBoot=!priorBoot;

 if(trueBoot)resetTransientUiForTrueRestartV31();

 // Final restore semantics:
 // - active workout still wins functionally, but UI transient state is fresh on a true boot;
 // - same document / resumed standby keeps current DOM exactly where it was;
 // - same session re-render restores the saved transient state.
 const restoreBeforeFinalV31=restoreUI;
 restoreUI=function(){
   if(trueBoot){
     resetTransientUiForTrueRestartV31();
     document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
     pageStack=[];$("bottomNav").classList.remove("hidden");
     currentTab="training";showTab("training",{reset:true});
     if(activeWorkout){
       // Keep workout data, but do not restore old scroll/subpage.
       // User can resume from the Training card.
       renderTrainingHome?.()
     }
     return
   }
   return restoreBeforeFinalV31()
 };

 // Standby/background: capture exact transient UI state, without changing it.
 document.addEventListener("visibilitychange",()=>{
   if(document.visibilityState==="hidden"){
     captureTabUiState(currentTab);persistUI({capture:false});saveAll()
   }
 },true);
 window.addEventListener("pagehide",()=>{
   captureTabUiState(currentTab);persistUI({capture:false});saveAll()
 },true);

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
 function recommendationTextV31(e){
   const prev=lastMatchingExerciseV31(e);
   if(!prev)return"Erstes Training in dieser Methode – starte kontrolliert im vorgegebenen Wiederholungsbereich.";
   const ratings=prev.sets.map(s=>s.rating||s.segments?.find(g=>g.rating)?.rating).filter(Boolean);
   const weights=prev.sets.map(s=>Number(s.weight)||Number(s.segments?.[0]?.weight)||0).filter(v=>v>0);
   const reps=prev.sets.map(s=>Number(s.reps)||Number(s.segments?.[0]?.reps)||0).filter(v=>v>0);
   const lastWeight=weights.length?weights.at(-1):null;
   const lastReps=reps.length?Math.round(avgV31(reps)):null;
   const top=repTop(e.reps);

   let coaching="";
   if(ratings.includes("red")){
     coaching="Letztes Mal zu schwer: Gewicht beibehalten oder leicht reduzieren.";
   }else if(ratings.length&&ratings.every(r=>r==="blue")){
     coaching="Letztes Mal deutlich zu leicht: Gewicht moderat erhöhen.";
   }else if(top&&reps.length&&reps.every(r=>r>=top)&&!ratings.includes("yellow")){
     coaching=`Oberes Wiederholungslimit ${top} erreicht: kleine Gewichtssteigerung sinnvoll.`;
   }else if(ratings.length&&ratings.every(r=>r==="green")){
     coaching="Sehr passend: Gewicht zunächst beibehalten und Ziel-WDH. wieder anpeilen.";
   }else if(ratings.includes("yellow")){
     coaching="Am Limit: Gewicht eher beibehalten und saubere Wiederholungen bestätigen.";
   }else{
     coaching="Letzte Werte als Orientierung nutzen und nach Tagesform anpassen.";
   }

   const values=[];
   if(lastWeight!=null){
     const shown=window.rethinkPrefsV31?.weightDisplay?window.rethinkPrefsV31.weightDisplay(lastWeight):lastWeight;
     const unit=window.rethinkPrefsV31?.weightLabel?window.rethinkPrefsV31.weightLabel().toLowerCase():"kg";
     values.push(`${shown} ${unit}`)
   }
   if(lastReps!=null)values.push(`${lastReps} WDH`);
   return`${values.length?`Zuletzt etwa ${values.join(" · ")}. `:""}${coaching}`
 }
 function recommendationHtmlV31(e){
   return`<div class="live-recommendation"><strong>Tipp nächstes Training</strong><br>${esc(recommendationTextV31(e))}</div>`
 }

 // Keep previous values as grey placeholders, restoring them every time a workout/exercise is created or edited.
 function ensureSuggestionsV31(){
   if(!activeWorkout)return;
   applyPreviousWorkoutSuggestions(activeWorkout);
 }

 // Do NOT let tapping or typing into KG/WDH/time fields change the highlighted training card.
 function rebindInputsWithoutHighlightV31(){
   document.querySelectorAll("#liveBody [data-input]").forEach(x=>{
     x.oninput=()=>{touchInput(x);updateInput(x)};
     x.onchange=()=>updateInput(x);
     x.onblur=()=>{updateInput(x);setTimeout(()=>{const a=document.activeElement;if(!a||!a.matches("[data-input]"))renderLive()},0)};
     x.onfocus=()=>{
       try{x.select?.()}catch{}
       window.revealLiveWorkoutFieldV31?.(x);window.revealFieldFinal?.(x)
     };
     x.onpointerdown=ev=>ev.stopPropagation();
     x.onclick=ev=>{ev.stopPropagation();try{x.select?.()}catch{};window.revealLiveWorkoutFieldV31?.(x)}
   })
 }

 function injectRecommendationsV31(){
   if(!activeWorkout)return;
   document.querySelectorAll("#liveBody .live-exercise-card[data-live-card]").forEach(card=>{
     if(card.querySelector(".live-recommendation"))return;
     const idx=Number(card.dataset.liveCard),e=activeWorkout.exercises[idx];if(!e)return;
     const anchor=card.querySelector(".method-help")||card.querySelector(".live-card-head")||card.firstElementChild;
     if(anchor)anchor.insertAdjacentHTML("afterend",recommendationHtmlV31(e))
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

 const renderBeforeFinalRecommendationsV31=renderLive;
 renderLive=function(){
   ensureSuggestionsV31();
   stabilizeActiveByRatingsV31();
   const result=renderBeforeFinalRecommendationsV31();
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
 };

 // Advance only after a rating was actually committed.
 function advanceAfterRatingV31(){
   if(!activeWorkout)return;
   activeWorkout.activeExerciseIndex=firstIncompleteUnitIndexV31();
   saveAll();renderLive()
 }
 const applySetRatingBeforeStableV31=applySetRating;
 applySetRating=function(r){
   applySetRatingBeforeStableV31(r);
   setTimeout(advanceAfterRatingV31,0)
 };
 const applySegmentRatingBeforeStableV31=applySegmentRating;
 applySegmentRating=function(r){
   applySegmentRatingBeforeStableV31(r);
   setTimeout(advanceAfterRatingV31,0)
 };

 window.__restartHighlightTestV31={
   recommendationText:recommendationTextV31,
   exerciseRated:exerciseRatedV31,
   unitFullyRated:unitFullyRatedV31,
   firstIncomplete:firstIncompleteUnitIndexV31,
   resetTransient:resetTransientUiForTrueRestartV31
 };
})();


/* Rethink_v3.1 — final global text scaling and zero-mutation field focus */
(function(){
 const SCALE={normal:1,large:1.12,xlarge:1.24};
 let applyingFonts=false;

 function currentTextModeV31(){
   // UI/dataset wins immediately; persisted prefs are fallback.
   const ds=document.documentElement.dataset.textScale;
   if(ds&&SCALE[ds])return ds;
   try{return window.rethinkPrefsV31?.get?.().textScale||"normal"}catch{return"normal"}
 }
 function textFactorV31(){return SCALE[currentTextModeV31()]||1}
 function scalableV31(el){
   if(!(el instanceof Element))return false;
   if(el.matches("svg,svg *,canvas,script,style,link,meta"))return false;
   return !!(el.textContent?.trim()||el.matches("input,textarea,select,button,label,option"))
 }
 function baseFontV31(el){
   const c=Number(el.dataset.rethinkBaseFont);
   if(Number.isFinite(c)&&c>0)return c;
   const prev=document.documentElement.dataset.textScale;
   document.documentElement.dataset.textScale="normal";
   const n=parseFloat(getComputedStyle(el).fontSize);
   document.documentElement.dataset.textScale=prev||"normal";
   if(Number.isFinite(n)&&n>0){el.dataset.rethinkBaseFont=String(n);return n}
   return null
 }
 function applyGlobalTextScaleV31(root=document){
   if(applyingFonts)return;
   applyingFonts=true;
   try{
     const f=textFactorV31(),nodes=[];
     if(root instanceof Element)nodes.push(root);
     if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
     [...new Set(nodes)].forEach(el=>{
       if(!scalableV31(el))return;
       const b=baseFontV31(el);if(!b)return;
       el.style.setProperty("font-size",`${Math.round(b*f*100)/100}px`,"important")
     })
   }finally{applyingFonts=false}
 }
 window.applyGlobalTextScaleV31=applyGlobalTextScaleV31;

 document.addEventListener("change",e=>{
   if(e.target?.id!=="prefTextScale")return;
   document.documentElement.dataset.textScale=e.target.value||"normal";
   requestAnimationFrame(()=>applyGlobalTextScaleV31(document))
 },true);

 const mo=new MutationObserver(ms=>{
   if(applyingFonts)return;
   const roots=[];
   ms.forEach(m=>m.addedNodes.forEach(n=>{if(n instanceof Element)roots.push(n)}));
   if(roots.length)requestAnimationFrame(()=>roots.forEach(r=>applyGlobalTextScaleV31(r)))
 });
 mo.observe(document.body,{childList:true,subtree:true});
 requestAnimationFrame(()=>applyGlobalTextScaleV31(document));

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
     inp.onfocus=()=>{
       beginV31(inp);
       try{inp.select?.()}catch{}
       window.revealLiveWorkoutFieldV31?.(inp);
       window.revealFieldFinal?.(inp)
     };
     inp.onpointerdown=ev=>ev.stopPropagation();
     inp.onclick=ev=>{
       ev.stopPropagation();
       try{inp.select?.()}catch{}
       window.revealLiveWorkoutFieldV31?.(inp)
     };
     inp.oninput=()=>{
       inp.dataset.rethinkChanged="1";
       updateInput(inp)
     };
     inp.onchange=()=>{if(changedV31(inp))updateInput(inp)};
     inp.onblur=()=>{
       const wasChanged=changedV31(inp);
       if(wasChanged)updateInput(inp);
       endV31(inp);
       if(wasChanged)setTimeout(()=>{
         const a=document.activeElement;
         if(!a||!a.matches("#liveBody [data-input]"))renderLive()
       },0)
     }
   })
 }
 window.bindStrictInputsV31=bindStrictInputsV31;

 const before=renderLive;
 renderLive=function(){
   const r=before();
   bindStrictInputsV31();
   requestAnimationFrame(()=>applyGlobalTextScaleV31($("liveBody")||document));
   return r
 };

 window.__finalTextInputV31={apply:applyGlobalTextScaleV31,factor:textFactorV31,bind:bindStrictInputsV31};
})();


/* Rethink_v3.1 — Metric/Imperial system, language, safe inputs, distance tracking */
(function(){
 const PREF_KEY="rethink_preferences_v31";
 const p0={weightUnit:"kg",distanceUnit:"km",measurementUnit:"cm",weekStart:"monday",textScale:"normal",unitSystem:"metric",language:"de"};
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
 const renderLiveBeforeDistV31=renderLive;
 renderLive=function(){const r=renderLiveBeforeDistV31();addDistanceFieldsV31();applyTranslationsV31();return r};

 // Profile height in imperial is shown as feet + inches; circumferences stay inches.
 const renderProfileBeforeSystemV31=renderProfile;
 renderProfile=function(){
   const r=renderProfileBeforeSystemV31();
   if(sysPrefs.unitSystem==="imperial"&&$("profileSummary")&&profile.height){
     const latest=measurements.slice().reverse().find(m=>Number(m.weight)>0),w=Number(latest?.weight||profile.weight||0);
     $("profileSummary").textContent=[profile.age?profile.age+" J.":"",profile.height?feetInches(profile.height):"",w?`${weightDisplay(w)} lb`:""].filter(Boolean).join(" · ")||"Noch nicht eingerichtet"
   }
   patchHydrationUnitsV31();patchFoodMassUnitsV31();applyTranslationsV31();return r
 };

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

 // Final quick-drink editor with system volume unit.
 openQuickDrinkEntry=function(){
   ensureDrinks();let selectedId=nutrition.drinks[0]?.id||null;
   const render=(focusAmount=false)=>{
     const d=nutrition.drinks.find(x=>String(x.id)===String(selectedId))||nutrition.drinks[0];if(!d)return;
     const shown=volumeDisplay(d.lastSize||d.size||250);
     $("sheetBody").innerHTML=`
       <div class="final-drink-entry-top">
        <div class="final-drink-selected"><span class="drink-icon">${d.icon||"🥤"}</span><div><strong data-i18n-skip>${esc(d.name)}</strong><div class="small">${d.hydration}% Hydrierung · ${d.calories||0} kcal/250 ml · ${d.caffeine||0} mg Koffein</div></div></div>
        <div class="form-field"><label>MENGE ${volumeUnit()}</label>
          <div class="drink-amount-inline">
            <input id="finalDrinkAmount" class="field" inputmode="decimal" enterkeyhint="done" value="${shown}">
            <button id="finalDrinkApplyInline" class="drink-amount-submit" type="button">+ Eintragen</button>
          </div>
        </div>
       </div>
       <div class="quick-drink-grid">${nutrition.drinks.map(x=>`<button class="quick-drink-choice ${String(x.id)===String(d.id)?"active":""} ${drinkTone(x)}" data-final-drink="${x.id}"><span class="drink-icon">${x.icon||"🥤"}</span><span data-i18n-skip>${esc(x.name)}</span></button>`).join("")}</div>`;
     const submit=()=>{
       const input=$("finalDrinkAmount"),raw=String(input?.value??"").trim();
       if(!raw){input?.focus();return}
       const amount=volumeStore(raw);
       if(!amount||Number(amount)<=0){input?.focus();input?.select?.();return}
       addDrinkEntry(d,amount);closeSheet({all:true})
     };
     document.querySelectorAll("[data-final-drink]").forEach(btn=>btn.onclick=()=>{selectedId=btn.dataset.finalDrink;render(true)});
     $("finalDrinkApplyInline").onclick=submit;
     const input=$("finalDrinkAmount");
     if(input){
       input.onkeydown=e=>{
         if(e.key==="Enter"){
           e.preventDefault();e.stopPropagation();submit()
         }
       };
       if(focusAmount){
         try{input.focus({preventScroll:true})}catch{input.focus()}
         input.select?.();window.revealFieldFinal?.(input)
       }
     }
     applyTranslationsV31()
   };
   openSheet("Getränk eintragen","");render(false)
 };
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
  "Wochenstart":"Week starts","Montag":"Monday","Sonntag":"Sunday","Textgröße":"Text size","Standard":"Standard","Groß":"Large","Sehr groß":"Extra large",
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
  "Pyramide":"Pyramid","Vorermüdung":"Pre-exhaust","Normal":"Standard","Satz":"Set","Runde":"Round",
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
  "Perfekt · 1–3 Wdh. mit guter Form übrig":"Perfect · 1–3 reps with good form left",
  "Limit · 0 Wdh. mit guter Form übrig":"Limit · 0 reps with good form left",
  "Zu schwer · Form zu früh verloren":"Too heavy · form broke down too early",
  "Zu leicht · problemlos noch 3+ Wdh.":"Too easy · 3+ reps still possible"
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
       <div class="settings-row"><div><strong>Textgröße</strong></div><select id="prefTextScaleFinal" class="field settings-system-select"><option value="normal" ${sysPrefs.textScale==="normal"?"selected":""}>Standard</option><option value="large" ${sysPrefs.textScale==="large"?"selected":""}>Groß</option><option value="xlarge" ${sysPrefs.textScale==="xlarge"?"selected":""}>Sehr groß</option></select></div>
       <div class="settings-row"><div><strong>Sprache</strong></div><select id="prefLanguage" class="field settings-system-select"><option value="de" ${sysPrefs.language==="de"?"selected":""}>Deutsch</option><option value="en" ${sysPrefs.language==="en"?"selected":""}>Englisch</option></select></div>
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
     $("prefTextScaleFinal").onchange=()=>{sysPrefs.textScale=$("prefTextScaleFinal").value;write(PREF_KEY,sysPrefs);try{captureTabUiState(currentTab);persistUI({capture:false});saveAll()}catch{}location.reload()};
     $("prefLanguage").onchange=()=>{sysPrefs.language=$("prefLanguage").value;write(PREF_KEY,sysPrefs);try{captureTabUiState(currentTab);persistUI({capture:false});saveAll()}catch{}location.reload()};
     document.documentElement.dataset.textScale=sysPrefs.textScale;
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
 const renderProfileBeforeFinalSystemV31=renderProfile;
 renderProfile=function(){
   const r=renderProfileBeforeFinalSystemV31();
   enforceProfileSystemV31();
   requestAnimationFrame(enforceProfileSystemV31);
   setTimeout(enforceProfileSystemV31,40);
   return r
 };

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
     "rethink_annual_cleanup_enabled_v1",   // persönliche Datenaufbewahrungswahl
     "rethink_annual_cleanup_prompt_year_v1"
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
 function filename(){const d=new Date(),p=n=>String(n).padStart(2,"0");return `ReThink_Fitness_FullSafe_${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}.json`}
 async function exportBackup(){
   const blob=new Blob([JSON.stringify(payload(),null,2)],{type:"application/json"});
   const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename();a.style.display="none";
   document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(a.href),1200);
   try{toast("Backup erstellt")}catch{}
 }
 async function restore(file){
   const x=JSON.parse(await file.text());
   if(!x||x.schema!==BACKUP_SCHEMA||!x.localStorage||typeof x.localStorage!=="object")
     throw new Error("Keine gültige ReThink. Fitness Backupdatei.");

   if(!confirm("Full Safe Backup wirklich wiederherstellen? Alle persönlichen ReThink. Fitness Daten werden durch den Backup-Stand ersetzt. App-Code, integrierter Übungskatalog und technische Oberfläche bleiben auf dem aktuellen Stand."))return;

   const allowed=personalBackupKeysV31();

   // Full Safe bedeutet: alle persönlichen persistenten Daten ersetzen,
   // aber niemals App-Code, DEFAULT_EXERCISES, Cache, Filter-/Scrollzustände
   // oder sonstige technische UI-Zustände.
   allowed.forEach(k=>localStorage.removeItem(k));
   allowed.forEach(k=>{
     const v=x.localStorage[k];
     if(typeof v==="string")localStorage.setItem(k,v)
   });

   try{toast("Full Safe Backup wiederhergestellt")}catch{}
   setTimeout(()=>location.reload(),300)
 }
 function chooseRestore(){
   let i=document.getElementById("rethinkBackupRestoreInput");
   if(!i){i=document.createElement("input");i.type="file";i.accept=".json,application/json";i.hidden=true;i.id="rethinkBackupRestoreInput";document.body.appendChild(i);
     i.onchange=async()=>{const f=i.files?.[0];i.value="";if(!f)return;try{await restore(f)}catch(e){alert(e?.message||"Backup konnte nicht gelesen werden.")}}
   }i.click()
 }
 window.rethinkBackup={export:exportBackup,restore:chooseRestore,payload};
 const before=openSettingsPage;
 openSettingsPage=function(){
   const r=before();
   requestAnimationFrame(()=>{
     const body=$("settingsBody");if(!body||$("rethinkBackupSection"))return;
     const sec=document.createElement("div");sec.className="settings-section";sec.id="rethinkBackupSection";
     sec.innerHTML=`<h3>Daten & Full Safe Backup</h3><div class="settings-card">
       <div class="settings-row"><div><strong>Backup erstellen</strong><small>Full Safe sichert alle persönlichen Daten: Profil, Messungen, Ernährung, Hydrierung, Trainingspläne, Wochenplan, eigene Übungen, abgeschlossene Trainings und ein laufendes Workout.</small></div><button id="rethinkBackupExport" class="secondary compact-profile-edit">Sichern</button></div>
       <div class="settings-row"><div><strong>Backup wiederherstellen</strong><small>Full Safe wiederherstellen – App-Code und integrierter Übungskatalog bleiben immer aktuell.</small></div><button id="rethinkBackupRestore" class="secondary compact-profile-edit">Wiederherstellen</button></div>
       </div><div class="small" style="margin-top:10px">Full Safe sichert ausschließlich persönliche Nutzerdaten. Code, Standard-Übungskatalog, Cache sowie Scroll-/Filter-/UI-Zustände werden niemals aus einem Backup zurückgeschrieben.</div>`;
     body.appendChild(sec);$("rethinkBackupExport").onclick=exportBackup;$("rethinkBackupRestore").onclick=chooseRestore;window.rethinkSystemV31?.translate?.(sec)
   });return r
 }
})();


/* v3.1 plans empty-state */
(function(){
 const base=renderPlans;
 renderPlans=function(){
   const out=base();
   const list=$("planList");
   if(list && plans.length===0){
     list.innerHTML=`<div class="plan-welcome-card card"><div class="plan-welcome-mark">R.</div><h2>Dein Training beginnt hier.</h2><p>Erstelle deinen ersten Trainingsplan und stelle Übungen, Sätze und Trainingsmethoden passend zu deinem Training zusammen.</p><button id="planWelcomeCreate" class="primary plan-welcome-create">Trainingsplan erstellen</button></div>`;
     $("planWelcomeCreate").onclick=()=>$("newPlanBtn").click();
     try{window.rethinkSystemV31?.translate?.(list)}catch{}
   }
   return out
 }
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
  "Tipp nächstes Training":"Next workout tip","Erstes Training in dieser Methode – starte kontrolliert im vorgegebenen Wiederholungsbereich.":"First workout with this method – start conservatively within the prescribed rep range.",
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
  "Wochenstart":"Week starts","Montag":"Monday","Sonntag":"Sunday","Textgröße":"Text size","Standard":"Standard",
  "Groß":"Large","Sehr groß":"Extra large","Sprache":"Language","Deutsch":"German","Englisch":"English",
  "Daten & Backup":"Data & Backup","Backup erstellen":"Create backup","Backup wiederherstellen":"Restore backup",
  "Sichern":"Back up","Wiederherstellen":"Restore","Keine gültige ReThink-Backupdatei.":"Not a valid ReThink backup file.",
  "Backup wirklich wiederherstellen? Die aktuellen Daten dieser ReThink-Installation werden durch den Backup-Stand ersetzt.":"Really restore this backup? The current data in this ReThink installation will be replaced by the backup.",
  "Jährliche Datenbereinigung?":"Annual data cleanup?","Alte Verlaufsdaten löschen":"Delete old history data","Alte Verlaufsdaten gelöscht":"Old history data deleted",
  "Dieses Jahr behalten":"Keep this year",
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
  "Perfekt · 1–3 Wdh. mit guter Form übrig":"Perfect · 1–3 reps with good form left",
  "Limit · 0 Wdh. mit guter Form übrig":"Limit · 0 reps with good form left",
  "Zu schwer · Form zu früh verloren":"Too heavy · form broke down too early",
  "Zu leicht · problemlos noch 3+ Wdh.":"Too easy · 3+ reps still possible",
  "1 Stück":"1 piece","1 Brötchen":"1 roll","1 mittelgroße Kartoffel":"1 medium potato",
  "1 mittelgroße Süßkartoffel":"1 medium sweet potato","z. B. Frühstück":"e.g. breakfast",
  "z. B. Frühstück Bowl":"e.g. breakfast bowl"
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
   return text
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
   const sexFloor=sex==="male"?3700:2700;
   let water=Math.max(sexFloor,w*35)+activityWaterExtra(activity);
   if(bf>0&&((sex==="male"&&bf<15)||(sex!=="male"&&bf<23)))water+=150;
   water=Math.min(5500,Math.round(water/50)*50);

   nutrition.calories=kcal;
   nutrition.protein=protein;
   nutrition.waterGoal=water;
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

/* ReThink v3.1 — Ernährung: aktive Eingabe bleibt über der iOS-Tastatur sichtbar */
(function(){
 const selector='#sheetBody #v69FoodSearch,#sheetBody #v69FoodGrams,#sheetBody #v69MealAmount,#sheetBody [data-meal-grams],#sheetBody #mealName,#sheetBody #cfName,#sheetBody #cfCategory,#sheetBody #cfKcal,#sheetBody #cfProtein,#sheetBody #cfWater,#sheetBody #cfServing,#sheetBody #cfServingLabel,#goalCaloriesHome,#goalProteinHome,#goalWaterHome';
 function isNutritionInput(el){return !!el?.matches?.(selector)}
 function reveal(el){
   if(!isNutritionInput(el))return;
   const body=el.closest('.sheet-body')||el.closest('.tab-screen')||document.scrollingElement;
   const adjust=()=>{
     const vv=window.visualViewport,bottom=vv?vv.offsetTop+vv.height:innerHeight,top=vv?vv.offsetTop:0,r=el.getBoundingClientRect();
     if(r.bottom>bottom-18){
       const d=r.bottom-(bottom-18)+12;
       if(body===document.scrollingElement)window.scrollBy(0,d);else body.scrollTop+=d
     }else if(r.top<top+62){
       const d=(top+62)-r.top;
       if(body===document.scrollingElement)window.scrollBy(0,-d);else body.scrollTop=Math.max(0,body.scrollTop-d)
     }
   };
   adjust();requestAnimationFrame(adjust);[60,140,260,420].forEach(ms=>setTimeout(adjust,ms))
 }
 document.addEventListener('focusin',e=>{if(isNutritionInput(e.target))reveal(e.target)},true);
 document.addEventListener('input',e=>{if(isNutritionInput(e.target))reveal(e.target)},true);
 if(window.visualViewport){
   visualViewport.addEventListener('resize',()=>reveal(document.activeElement),true);
   visualViewport.addEventListener('scroll',()=>reveal(document.activeElement),true)
 }
})();

/* ReThink v3.1 — globaler iOS-Tastatur-/Eingabefeld-Schutz
   Gilt für alle Text-, Zahlen-, Such- und Textarea-Felder der App:
   Planeditor, Übungen hinzufügen/bearbeiten, laufendes Training,
   Ernährung, Profil, Wochenplan und weitere Sheets. */
(function(){
 const editable='input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="file"]),textarea,[contenteditable="true"]';
 let active=null,token=0;

 function scrollContainer(el){
   return el.closest('.sheet-body')||el.closest('.page')||el.closest('.tab-screen')||document.scrollingElement
 }
 function reveal(el){
   if(!el?.isConnected||!el.matches?.(editable))return;
   active=el;const mine=++token;
   const adjust=()=>{
     if(mine!==token||!el.isConnected)return;
     const vv=window.visualViewport;
     const top=vv?vv.offsetTop:0,bottom=vv?(vv.offsetTop+vv.height):window.innerHeight;
     const r=el.getBoundingClientRect();
     const safeTop=top+64,safeBottom=bottom-18;
     const c=scrollContainer(el);
     let delta=0;
     if(r.bottom>safeBottom)delta=r.bottom-safeBottom+12;
     else if(r.top<safeTop)delta=r.top-safeTop-12;
     if(!delta)return;
     if(c===document.scrollingElement||c===document.documentElement||c===document.body)window.scrollBy({top:delta,behavior:'auto'});
     else c.scrollTop+=delta
   };
   adjust();requestAnimationFrame(adjust);
   [50,120,220,360,520].forEach(ms=>setTimeout(adjust,ms))
 }

 // pointerdown happens inside the user gesture, important for iOS keyboard activation.
 document.addEventListener('pointerdown',e=>{
   const el=e.target?.closest?.(editable);
   if(!el)return;
   active=el;
   requestAnimationFrame(()=>reveal(el))
 },true);

 document.addEventListener('focusin',e=>{
   if(e.target?.matches?.(editable))reveal(e.target)
 },true);

 document.addEventListener('input',e=>{
   if(e.target?.matches?.(editable))reveal(e.target)
 },true);

 if(window.visualViewport){
   const sync=()=>{const el=document.activeElement?.matches?.(editable)?document.activeElement:active;if(el)reveal(el)};
   visualViewport.addEventListener('resize',sync,true);
   visualViewport.addEventListener('scroll',sync,true)
 }
})();

/* ReThink v3.1 — authoritative iOS VisualViewport keyboard layout
   Previous fixes only scrolled the input. This one resizes the actual visible
   sheet/page so a card cannot remain underneath the keyboard. */
(function(){
 const vv=window.visualViewport;
 if(!vv)return;

 const editable='input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="file"]),textarea,[contenteditable="true"]';
 let raf=0;

 function keyboardIsVisible(){
   // Compare visual viewport with the layout viewport. The generous threshold
   // avoids treating address-bar movement as a keyboard.
   return vv.height < Math.min(window.innerHeight,document.documentElement.clientHeight)-110;
 }

 function containerFor(el){
   return el?.closest?.('.sheet-body')||el?.closest?.('.page')||document.scrollingElement
 }

 function revealInVisibleViewport(el){
   if(!el?.isConnected||!el.matches?.(editable))return;
   const top=vv.offsetTop,bottom=vv.offsetTop+vv.height;
   const r=el.getBoundingClientRect();
   const safeTop=top+68,safeBottom=bottom-22;
   let delta=0;
   if(r.bottom>safeBottom)delta=r.bottom-safeBottom+12;
   else if(r.top<safeTop)delta=r.top-safeTop-10;
   if(!delta)return;
   const c=containerFor(el);
   if(c===document.scrollingElement||c===document.documentElement||c===document.body){
     window.scrollBy({top:delta,behavior:'auto'})
   }else{
     c.scrollTop+=delta
   }
 }

 function syncViewport(){
   cancelAnimationFrame(raf);
   raf=requestAnimationFrame(()=>{
     const open=keyboardIsVisible() && document.activeElement?.matches?.(editable);
     document.documentElement.style.setProperty('--rethink-vv-top',`${vv.offsetTop}px`);
     document.documentElement.style.setProperty('--rethink-vv-height',`${vv.height}px`);
     document.documentElement.classList.toggle('rethink-keyboard-visible',!!open);

     if(open){
       const el=document.activeElement;
       revealInVisibleViewport(el);
       // iOS often settles keyboard geometry over several frames.
       [40,100,180,300].forEach(ms=>setTimeout(()=>{
         if(document.documentElement.classList.contains('rethink-keyboard-visible')&&document.activeElement===el){
           revealInVisibleViewport(el)
         }
       },ms))
     }
   })
 }

 document.addEventListener('focusin',e=>{
   if(e.target?.matches?.(editable)){
     syncViewport();
     setTimeout(syncViewport,40);
     setTimeout(syncViewport,140)
   }
 },true);

 document.addEventListener('focusout',()=>{
   setTimeout(syncViewport,80)
 },true);

 document.addEventListener('input',e=>{
   if(e.target?.matches?.(editable))revealInVisibleViewport(e.target)
 },true);

 vv.addEventListener('resize',syncViewport,true);
 vv.addEventListener('scroll',syncViewport,true);
 window.addEventListener('orientationchange',()=>setTimeout(syncViewport,120),true);

 syncViewport()
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

 const vv=window.visualViewport;
 if(vv){
   const editable='input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="file"]),textarea,[contenteditable="true"]';
   function keyboardOpen(){return vv.height<Math.min(innerHeight,document.documentElement.clientHeight)-110}
   function reveal(el){
     if(!el?.isConnected||!el.matches?.(editable))return;
     const top=vv.offsetTop,bottom=vv.offsetTop+vv.height,r=el.getBoundingClientRect(),c=el.closest(".sheet-body")||el.closest(".page")||document.scrollingElement;
     let d=0;if(r.bottom>bottom-20)d=r.bottom-(bottom-20)+12;else if(r.top<top+64)d=r.top-(top+64)-10;
     if(!d)return;
     if(c===document.scrollingElement||c===document.documentElement||c===document.body)window.scrollBy({top:d,behavior:"auto"});else c.scrollTop+=d
   }
   function sync(){
     const el=document.activeElement,open=keyboardOpen()&&el?.matches?.(editable);
     document.documentElement.style.setProperty("--rethink-vv-top",vv.offsetTop+"px");
     document.documentElement.style.setProperty("--rethink-vv-height",vv.height+"px");
     document.documentElement.classList.toggle("rethink-keyboard-visible",!!open);
     if(open){reveal(el);[50,120,220,360].forEach(ms=>setTimeout(()=>document.activeElement===el&&reveal(el),ms))}
   }
   document.addEventListener("focusin",e=>{if(e.target?.matches?.(editable)){sync();setTimeout(sync,60);setTimeout(sync,160)}},true);
   document.addEventListener("input",e=>{if(e.target?.matches?.(editable))reveal(e.target)},true);
   document.addEventListener("focusout",()=>setTimeout(sync,80),true);
   vv.addEventListener("resize",sync,true);vv.addEventListener("scroll",sync,true);sync()
 }
})();
