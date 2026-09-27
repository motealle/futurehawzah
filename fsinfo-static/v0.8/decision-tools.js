(()=>{"use strict";
const C=()=>window.FSINFO_CONTENT;
const DATA=window.FSINFO_DATA;
const STATE={selected:null,domain:null,knowledgeOpen:false,decisionOpen:false,depth:"L2",preparedness:{}};
try{STATE.preparedness=JSON.parse(localStorage.getItem("fsinfo-v0.8-preparedness")||"{}")}catch(_){}
const domains=["همه","آموزش","پژوهش","تبلیغ","فرهنگی/اجتماعی","منابع انسانی","حکمرانی","فناوری/زیرساخت"];
const byId=id=>C().getRecord(id);
function persist(){localStorage.setItem("fsinfo-v0.8-preparedness",JSON.stringify(STATE.preparedness))}
function resolveMacro(n){if(!n)return null;return byId(n.id)||byId(n.parent)}
function provenanceLabel(p){return p==="source_derived"?"برگرفته از گزارش":p==="editorial_summary"?"خلاصه تحریری":p==="decision_analysis"?"تحلیل تصمیم‌یار":p}
function renderKnowledge(){
 const drawer=document.getElementById("knowledgeDrawer");drawer.classList.toggle("open",STATE.knowledgeOpen);
 const r=resolveMacro(STATE.selected);
 if(!r){document.getElementById("knowledgeTitle").textContent="یک کلان‌روند انتخاب کنید";document.getElementById("knowledgeBody").textContent="روی یک کلان‌روند یا زیرروند کلیک کنید، سپس سطح مطالعه را انتخاب کنید.";return}
 document.getElementById("knowledgeTitle").textContent=r.title;
 document.querySelectorAll("[data-depth]").forEach(b=>b.classList.toggle("active",b.dataset.depth===STATE.depth));
 const out=C().get(r.id,{depth:STATE.depth});
 const box=document.getElementById("knowledgeBody");
 if(STATE.depth==="SOURCE"){
   box.innerHTML='<div class="knowledge-source"><b>بخش '+r.source.section+' گزارش</b><span>صفحه راهنما: '+r.source.page_hint+'</span><span>منشأ: '+provenanceLabel(r.source.provenance)+'</span><span>برای استناد، متن کامل گزارش و منابع همان بخش را مبنا قرار دهید.</span></div>';
 }else{
   box.innerHTML='<div class="knowledge-provenance">'+provenanceLabel(out.content.provenance)+'</div><p>'+escapeHtml(out.content.text)+'</p><div class="knowledge-meta">'+r.trends.length+' زیرروند · بخش '+r.source.section+' · صفحه '+r.source.page_hint+'</div>';
 }
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function renderDomains(){
 const host=document.getElementById("domainChips");host.innerHTML="";
 domains.forEach(d=>{const b=document.createElement("button");b.textContent=d;b.className="domain-chip"+((d==="همه"&&!STATE.domain)||d===STATE.domain?" active":"");b.onclick=()=>{STATE.domain=d==="همه"?null:d;renderDomains();renderImpactList()};host.appendChild(b)});
}
function renderImpactList(){
 const host=document.getElementById("impactList");host.innerHTML="";
 const list=Object.values(DATA.records).filter(r=>!STATE.domain||r.decision.domains.includes(STATE.domain));
 list.forEach(r=>{const b=document.createElement("button");b.className="impact-row";b.innerHTML='<span class="impact-dot" style="background:'+r.color+'"></span><b>'+r.title+'</b><small>'+r.decision.domains.join(" · ")+'</small>';b.onclick=()=>{window.FSINFO_MODULES.select({id:r.id,type:"macro"});window.FSINFO_APP?.focusById?.(r.id)};host.appendChild(b)});
}
function prepValue(id){return STATE.preparedness[id]||"unknown"}
function prepLabel(v){return ({unknown:"نامشخص",weak:"ضعیف",partial:"نسبی",strong:"قوی"})[v]||"نامشخص"}
function renderPreparedness(){
 const r=resolveMacro(STATE.selected),host=document.getElementById("prepControls"),title=document.getElementById("prepTitle");
 if(!r){title.textContent="آمادگی حوزه";host.innerHTML='<span class="decision-muted">یک کلان‌روند انتخاب کنید.</span>';return}
 title.textContent="آمادگی حوزه · "+r.title;host.innerHTML="";
 [["unknown","نامشخص"],["weak","ضعیف"],["partial","نسبی"],["strong","قوی"]].forEach(([v,label])=>{const b=document.createElement("button");b.textContent=label;b.className="prep-btn"+(prepValue(r.id)===v?" active":"");b.onclick=()=>{STATE.preparedness[r.id]=v;persist();renderPreparedness();renderCompare()};host.appendChild(b)})
}
function fillSelects(){
 ["compareA","compareB"].forEach((id,idx)=>{const s=document.getElementById(id);if(s.options.length)return;Object.values(DATA.records).forEach((r,i)=>{const o=document.createElement("option");o.value=r.id;o.textContent=r.id+" · "+r.title;s.appendChild(o)});s.selectedIndex=idx});
}
function compareCard(r){
 return '<article class="compare-card"><div class="compare-id">'+r.id+'</div><h4>'+r.title+'</h4><p>'+escapeHtml(r.levels.L1.text)+'</p><div class="compare-tags">'+r.decision.domains.map(d=>'<span>'+d+'</span>').join("")+'</div><dl><dt>زیرروند</dt><dd>'+r.trends.length+'</dd><dt>صفحه گزارش</dt><dd>'+r.source.page_hint+'</dd><dt>آمادگی ثبت‌شده</dt><dd>'+prepLabel(prepValue(r.id))+'</dd></dl></article>'
}
function renderCompare(){fillSelects();const a=byId(document.getElementById("compareA").value),b=byId(document.getElementById("compareB").value);document.getElementById("compareOutput").innerHTML=compareCard(a)+compareCard(b)}
function renderDecision(){document.getElementById("decisionPanel").classList.toggle("open",STATE.decisionOpen);renderDomains();renderImpactList();renderPreparedness();renderCompare()}
function toggleKnowledge(force){STATE.knowledgeOpen=typeof force==="boolean"?force:!STATE.knowledgeOpen;if(STATE.knowledgeOpen)STATE.decisionOpen=false;renderKnowledge();renderDecision()}
function toggleDecision(force){STATE.decisionOpen=typeof force==="boolean"?force:!STATE.decisionOpen;if(STATE.decisionOpen)STATE.knowledgeOpen=false;renderKnowledge();renderDecision()}
function select(n){STATE.selected=n;renderKnowledge();renderPreparedness()}
function closePanels(){STATE.knowledgeOpen=false;STATE.decisionOpen=false;renderKnowledge();renderDecision()}
function alphaFor(n){
 if(!STATE.domain)return 1;
 if(n.type==="core")return .18;
 const r=resolveMacro(n);if(!r)return .08;
 return r.decision.domains.includes(STATE.domain)?1:(n.type==="macro"?.09:.025)
}
function init(){
 document.getElementById("knowledgeBtn").onclick=()=>toggleKnowledge();
 document.getElementById("decisionBtn").onclick=()=>toggleDecision();
 document.getElementById("knowledgeClose").onclick=()=>toggleKnowledge(false);
 document.getElementById("decisionClose").onclick=()=>toggleDecision(false);
 document.querySelectorAll("[data-depth]").forEach(b=>b.onclick=()=>{STATE.depth=b.dataset.depth;renderKnowledge()});
 document.getElementById("compareA").onchange=renderCompare;document.getElementById("compareB").onchange=renderCompare;
 document.addEventListener("keydown",e=>{if(e.key==="k"||e.key==="K"){if(!e.ctrlKey&&!e.metaKey){e.preventDefault();toggleKnowledge()}}if(e.key==="d"||e.key==="D"){if(!e.ctrlKey&&!e.metaKey){e.preventDefault();toggleDecision()}}});
 renderKnowledge();renderDecision()
}
window.FSINFO_DECISION={alphaFor,get activeDomain(){return STATE.domain}};
window.FSINFO_MODULES={select,closePanels,toggleKnowledge,toggleDecision,init};
document.addEventListener("DOMContentLoaded",init);
})();