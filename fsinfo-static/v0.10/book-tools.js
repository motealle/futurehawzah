(()=>{"use strict";
const C=()=>window.FSINFO_CONTENT,B=window.FSINFO_BOOK,$=id=>document.getElementById(id);
const state={selected:null,bookOpen:false,decisionOpen:false,mode:"opening",percent:25,preparedness:{},notes:{}};
try{state.preparedness=JSON.parse(localStorage.getItem("fsinfo-v0.10-preparedness")||"{}")}catch(_){}
try{state.notes=JSON.parse(localStorage.getItem("fsinfo-v0.10-notes")||"{}")}catch(_){}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function ctx(){return C().nodeContext(state.selected?.id||window.FSINFO_APP?.getContextNode?.()?.id)}
function sync(){const n=window.FSINFO_APP?.getContextNode?.();if(n)state.selected=n}
function save(){localStorage.setItem("fsinfo-v0.10-preparedness",JSON.stringify(state.preparedness));localStorage.setItem("fsinfo-v0.10-notes",JSON.stringify(state.notes))}
function renderBook(){
 $("bookDrawer").classList.toggle("open",state.bookOpen);const x=ctx();
 [["Sentence","sentence"],["Opening","opening"],["Percent","percent"],["Full","full"]].forEach(([a,m])=>$("bookMode"+a).classList.toggle("active",state.mode===m));
 $("bookRangeWrap").hidden=state.mode!=="percent";$("bookBackDepth").hidden=!x||x.depth!==2;
 if(!x){$("bookTitle").textContent="کتاب";$("bookMeta").textContent="یک کلان‌روند یا زیرروند را انتخاب کنید.";$("bookBreadcrumb").textContent="";$("bookText").textContent="محتوای این پنل فقط از متن کتاب تغذیه می‌شود.";return}
 const out=C().get(x.id,{mode:state.mode,percent:state.percent});
 $("bookTitle").textContent=x.depth===2?x.trend.title:x.macro.title;
 $("bookBreadcrumb").textContent=x.depth===2?x.macro.title+" ← "+x.trend.title:x.macro.title;
 $("bookMeta").textContent="بخش "+x.macro.section+" · صفحه راهنما "+x.macro.page_hint+(out.scope==="macro_fallback"?" · متن مستقل زیرروند با همین عنوان در استخراج فعلی پیدا نشد؛ متن بخش مادر نمایش داده می‌شود":" · متن کتاب");
 $("bookText").textContent=out.text;$("bookRange").value=state.percent;$("bookRangeValue").textContent=state.percent+"٪";
}
function renderSearch(){const q=$("bookSearch").value,host=$("bookSearchResults");host.innerHTML="";for(const x of C().search(q)){const b=document.createElement("button");b.className="book-search-result";b.innerHTML="<b>"+esc(x.title)+"</b><span>"+esc(x.snippet)+"</span>";b.onclick=()=>{window.FSINFO_APP?.focusById?.(x.id);select({id:x.id,type:"macro"});host.innerHTML=""};host.appendChild(b)}}
const prepLabels={unknown:"نامشخص",weak:"ضعیف",partial:"نسبی",strong:"قوی"};
function renderDecision(){
 $("decisionPanel").classList.toggle("open",state.decisionOpen);fillSelects();renderCompare();const x=ctx(),r=x?.macro;
 $("decisionSelected").textContent=r?r.title:"یک کلان‌روند را انتخاب کنید";const host=$("prepControls");host.innerHTML="";
 if(r){for(const [v,label] of Object.entries(prepLabels)){const b=document.createElement("button");b.className="prep-btn"+((state.preparedness[r.id]||"unknown")===v?" active":"");b.textContent=label;b.onclick=()=>{state.preparedness[r.id]=v;save();renderDecision()};host.appendChild(b)}$("decisionNote").value=state.notes[r.id]||"";$("decisionNote").disabled=false}
 else{$("decisionNote").value="";$("decisionNote").disabled=true}
}
function fillSelects(){for(const id of["compareA","compareB"]){const s=$(id);if(s.options.length)continue;for(const r of C().list()){const o=document.createElement("option");o.value=r.id;o.textContent=r.id+" · "+r.title;s.appendChild(o)}}if(!$("compareB").dataset.seeded){$("compareB").selectedIndex=1;$("compareB").dataset.seeded="1"}}
function card(r){return '<article class="compare-card"><small>'+r.id+'</small><h4>'+esc(r.title)+'</h4><p>'+esc(r.first_sentence)+'</p><div class="compare-meta">'+r.trends.length+' زیرروند · بخش '+r.section+' · صفحه '+r.page_hint+'</div><div class="compare-prep">آمادگی ثبت‌شده: '+prepLabels[state.preparedness[r.id]||"unknown"]+'</div></article>'}
function renderCompare(){if(!$("compareA")||!$("compareA").options.length)return;const a=C().getRecord($("compareA").value),b=C().getRecord($("compareB").value);$("compareOutput").innerHTML=card(a)+card(b)}
function select(n){state.selected=n;renderBook();renderDecision()}
function openBookFor(n){if(n)state.selected=n;else sync();state.bookOpen=true;state.decisionOpen=false;renderBook();renderDecision()}
function toggleBook(force){if(force!==false)sync();state.bookOpen=typeof force==="boolean"?force:!state.bookOpen;if(state.bookOpen)state.decisionOpen=false;renderBook();renderDecision()}
function toggleDecision(force){sync();state.decisionOpen=typeof force==="boolean"?force:!state.decisionOpen;if(state.decisionOpen)state.bookOpen=false;renderBook();renderDecision()}
function closePanels(){state.bookOpen=false;state.decisionOpen=false;renderBook();renderDecision()}
function backDepth(){const x=ctx();if(x?.depth===2){window.FSINFO_APP?.focusById?.(x.macro.id);select({id:x.macro.id,type:"macro"})}}
function physical(e,code){return e.code===code&&!e.ctrlKey&&!e.metaKey&&!e.altKey}
function init(){
 $("bookBtn").onclick=()=>toggleBook();$("decisionBtn").onclick=()=>toggleDecision();$("bookClose").onclick=()=>toggleBook(false);$("decisionClose").onclick=()=>toggleDecision(false);
 $("infoBookBtn").onclick=()=>openBookFor(window.FSINFO_APP?.getContextNode?.());$("presentBookBtn").onclick=()=>openBookFor(window.FSINFO_APP?.getContextNode?.());$("quickBook").onclick=()=>openBookFor(window.FSINFO_APP?.getContextNode?.());
 $("infoBackBtn").onclick=backDepth;$("bookBackDepth").onclick=backDepth;
 [["bookModeSentence","sentence"],["bookModeOpening","opening"],["bookModePercent","percent"],["bookModeFull","full"]].forEach(([id,m])=>$(id).onclick=()=>{state.mode=m;renderBook()});
 $("bookRange").oninput=e=>{state.percent=Number(e.target.value);state.mode="percent";renderBook()};$("bookSearch").oninput=renderSearch;
 $("compareA").onchange=renderCompare;$("compareB").onchange=renderCompare;$("decisionNote").oninput=e=>{const r=ctx()?.macro;if(!r)return;state.notes[r.id]=e.target.value;save()};
 document.addEventListener("keydown",e=>{if(physical(e,"KeyK")){e.preventDefault();toggleBook()}if(physical(e,"KeyD")){e.preventDefault();toggleDecision()}if(physical(e,"Slash")){e.preventDefault();openBookFor();$("bookSearch").focus()}});
 renderBook();renderDecision()
}
window.FSINFO_MODULES={select,openBookFor,toggleBook,toggleDecision,closePanels,backDepth,init};
document.addEventListener("DOMContentLoaded",init);
})();