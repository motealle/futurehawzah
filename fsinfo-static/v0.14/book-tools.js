(()=>{"use strict";
const C=()=>window.FSINFO_CONTENT,B=window.FSINFO_BOOK;
const state={selected:null,bookOpen:false,decisionOpen:false,mode:"opening",percent:25,preparedness:{},notes:{}};
try{state.preparedness=JSON.parse(localStorage.getItem("fsinfo-v0.12-preparedness")||"{}")}catch(_){}
try{state.notes=JSON.parse(localStorage.getItem("fsinfo-v0.12-notes")||"{}")}catch(_){}
const $=id=>document.getElementById(id);
function macro(n){if(!n)return null;return C().getRecord(n.id)||C().getRecord(n.parent)}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function save(){localStorage.setItem("fsinfo-v0.12-preparedness",JSON.stringify(state.preparedness));localStorage.setItem("fsinfo-v0.12-notes",JSON.stringify(state.notes))}
function renderBook(){
 $("bookDrawer").classList.toggle("open",state.bookOpen);document.body.classList.toggle("book-open",state.bookOpen);
 const r=macro(state.selected);
 $("bookModeSentence").classList.toggle("active",state.mode==="sentence");
 $("bookModeOpening").classList.toggle("active",state.mode==="opening");
 $("bookModePercent").classList.toggle("active",state.mode==="percent");
 $("bookModeFull").classList.toggle("active",state.mode==="full");
 $("bookRangeWrap").hidden=state.mode!=="percent";
 if(!r){$("bookTitle").textContent="کتاب";$("bookMeta").textContent="یک کلان‌روند یا زیرروند را انتخاب کنید.";$("bookText").textContent="محتوای این پنل فقط از متن کتاب تغذیه می‌شود.";return}
 const out=C().get(r.id,{mode:state.mode,percent:state.percent});
 $("bookTitle").textContent=r.title;
 $("bookMeta").textContent="بخش "+r.section+" · صفحه راهنما "+r.page_hint+" · متن کتاب";
 $("bookText").textContent=out.text;
 $("bookRange").value=state.percent;$("bookRangeValue").textContent=state.percent+"٪";
}
function renderSearch(){
 const q=$("bookSearch").value,host=$("bookSearchResults");host.innerHTML="";
 for(const x of C().search(q)){const b=document.createElement("button");b.className="book-search-result";b.innerHTML="<b>"+esc(x.title)+"</b><span>"+esc(x.snippet)+"</span>";b.onclick=()=>{window.FSINFO_APP?.focusById?.(x.id);select({id:x.id,type:"macro"});host.innerHTML=""};host.appendChild(b)}
}
const prepLabels={unknown:"نامشخص",weak:"ضعیف",partial:"نسبی",strong:"قوی"};
function renderDecision(){
 $("decisionPanel").classList.toggle("open",state.decisionOpen);document.body.classList.toggle("decision-open",state.decisionOpen);fillSelects();renderCompare();
 const r=macro(state.selected);$("decisionSelected").textContent=r?r.title:"یک کلان‌روند را انتخاب کنید";
 const host=$("prepControls");host.innerHTML="";
 if(r){for(const [v,label] of Object.entries(prepLabels)){const b=document.createElement("button");b.className="prep-btn"+((state.preparedness[r.id]||"unknown")===v?" active":"");b.textContent=label;b.onclick=()=>{state.preparedness[r.id]=v;save();renderDecision()};host.appendChild(b)}
 $("decisionNote").value=state.notes[r.id]||"";$("decisionNote").disabled=false}
 else{$("decisionNote").value="";$("decisionNote").disabled=true}
}
function fillSelects(){for(const id of["compareA","compareB"]){const s=$(id);if(s.options.length)continue;for(const r of C().list()){const o=document.createElement("option");o.value=r.id;o.textContent=r.id+" · "+r.title;s.appendChild(o)}}if(!$("compareB").dataset.seeded){$("compareB").selectedIndex=1;$("compareB").dataset.seeded="1"}}
function card(r){return '<article class="compare-card"><small>'+r.id+'</small><h4>'+esc(r.title)+'</h4><p>'+esc(r.first_sentence)+'</p><div class="compare-meta">'+r.trends.length+' زیرروند · بخش '+r.section+' · صفحه '+r.page_hint+'</div><div class="compare-prep">آمادگی ثبت‌شده: '+prepLabels[state.preparedness[r.id]||"unknown"]+'</div></article>'}
function renderCompare(){if(!$("compareA")||!$("compareA").options.length)return;const a=C().getRecord($("compareA").value),b=C().getRecord($("compareB").value);$("compareOutput").innerHTML=card(a)+card(b)}
function select(n){state.selected=n;renderBook();renderDecision()}
function syncContext(){const n=window.FSINFO_APP?.getContextNode?.();if(n)state.selected=n}
function signal(panel,open){window.dispatchEvent(new CustomEvent("fsinfo:majorpanel",{detail:{panel,open}}))}
function openBookFor(n){if(n)state.selected=n;else syncContext();state.bookOpen=true;state.decisionOpen=false;renderBook();renderDecision();signal("decision",false);signal("book",true)}
function toggleBook(force){if(force!==false)syncContext();state.bookOpen=typeof force==="boolean"?force:!state.bookOpen;if(state.bookOpen)state.decisionOpen=false;renderBook();renderDecision();signal("decision",false);signal("book",state.bookOpen)}
function toggleDecision(force){syncContext();state.decisionOpen=typeof force==="boolean"?force:!state.decisionOpen;if(state.decisionOpen)state.bookOpen=false;renderBook();renderDecision();signal("book",false);signal("decision",state.decisionOpen)}
function closePanels(){state.bookOpen=false;state.decisionOpen=false;renderBook();renderDecision();signal("book",false);signal("decision",false)}
function init(){
 $("bookBtn").onclick=()=>toggleBook();$("decisionBtn").onclick=()=>toggleDecision();$("bookClose").onclick=()=>toggleBook(false);$("decisionClose").onclick=()=>toggleDecision(false);
 $("infoBookBtn").onclick=()=>openBookFor(window.FSINFO_APP?.getContextNode?.());$("presentBookBtn").onclick=()=>openBookFor(window.FSINFO_APP?.getContextNode?.());$("quickBook").onclick=()=>openBookFor(window.FSINFO_APP?.getContextNode?.());
 [["bookModeSentence","sentence"],["bookModeOpening","opening"],["bookModePercent","percent"],["bookModeFull","full"]].forEach(([id,m])=>$(id).onclick=()=>{state.mode=m;renderBook()});
 $("bookRange").oninput=e=>{state.percent=Number(e.target.value);state.mode="percent";renderBook()};
 $("bookSearch").oninput=renderSearch;
 $("compareA").onchange=renderCompare;$("compareB").onchange=renderCompare;
 $("decisionNote").oninput=e=>{const r=macro(state.selected);if(!r)return;state.notes[r.id]=e.target.value;save()};
 document.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==="KeyK"){e.preventDefault();toggleBook()}if(e.code==="KeyD"){e.preventDefault();toggleDecision()}if(e.code==="Slash"){e.preventDefault();openBookFor();$("bookSearch").focus()}});
 renderBook();renderDecision()
}
window.FSINFO_MODULES={select,openBookFor,toggleBook,toggleDecision,closePanels,init};
document.addEventListener("DOMContentLoaded",init);
})();