
(() => {
'use strict';
const canvas=document.getElementById('galaxy'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){document.getElementById('errorBox').classList.add('show');document.getElementById('errorText').textContent='مرورگر Canvas 2D را پشتیبانی نمی‌کند.';return}

const {clusters,cross,presentation:PRESENTATION,reportPages:REPORT_PAGES,futuresIntro:FUTURES_INTRO,groupRecaps:GROUP_RECAPS}=window.FSINFO_BOOK_INDEX;

let W=innerWidth,H=innerHeight,DPR=Math.min(devicePixelRatio||1,2);
function resize(){W=innerWidth;H=innerHeight;DPR=Math.min(devicePixelRatio||1,2);canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0)}
resize();addEventListener('resize',resize);

const cfg={labels:true,edges:true,cross:true,stars:true,nebula:true,icons:true,rotate:true,reduced:!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)};
const camera={yaw:-.35,pitch:.18,targetYaw:-.35,targetPitch:.18,dist:92,targetDist:92,focus:{x:0,y:0,z:0},targetFocus:{x:0,y:0,z:0}};
let hovered=null,selected=null;
let presentation={active:false,step:0,paused:false,autoplay:true,typewriter:true,reduced:cfg.reduced,start:0,pauseStart:0,pauseAccum:0,reveal:0,snapshot:null,token:0,skipRecaps:false,textComplete:false,revealStart:Infinity,typingRun:0,typingText:'',typingDone:null};
let introState={active:false,step:0};

function hexRgb(hex){hex=hex.replace('#','');const n=parseInt(hex,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function rgba(hex,a){const [r,g,b]=hexRgb(hex);return 'rgba('+r+','+g+','+b+','+a+')'}
function rot(p){
  let x=p.x-camera.focus.x,y=p.y-camera.focus.y,z=p.z-camera.focus.z;
  const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
  const x1=x*cy-z*sy,z1=x*sy+z*cy;
  const y2=y*cp-z1*sp,z2=y*sp+z1*cp;
  return{x:x1,y:y2,z:z2}
}
function project(p){
  const r=rot(p),depth=camera.dist+r.z;if(depth<5)return null;
  const vr=window.FSINFO_VIEWPORT?.getRect?.()||{x:0,y:0,w:W,h:H};
  const focal=Math.max(180,Math.min(vr.w,vr.h)*1.28),scale=focal/depth;
  return{x:vr.x+vr.w/2+r.x*scale,y:vr.y+vr.h/2-r.y*scale,z:r.z,scale,depth}
}
function lerp(a,b,t){return a+(b-a)*t}
function lerp3(a,b,t){return{x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),z:lerp(a.z,b.z,t)}}

const stars=Array.from({length:1500},(_,i)=>{
  const r=100+Math.random()*210,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);
  return{x:r*Math.sin(ph)*Math.cos(th),y:r*Math.cos(ph),z:r*Math.sin(ph)*Math.sin(th),s:.25+Math.random()*1.4,a:.18+Math.random()*.8}
});
const nebulae=[
 {p:{x:-74,y:30,z:-95},r:58,c:'#655dff'},
 {p:{x:92,y:-30,z:-74},r:52,c:'#54e1d6'},
 {p:{x:48,y:55,z:46},r:45,c:'#ff6fae'}
];

const nodes=[],edges=[],macroMap=new Map();
nodes.push({id:'CORE',type:'core',title:'حوزه آینده',color:'#667cff',p:{x:0,y:0,z:0},r:4.5,detail:'هسته مرکزی شبکه آینده‌پژوهی حوزه'});
let cursor=-Math.PI,tw=clusters.reduce((s,c)=>s+1.7+Math.sqrt(c.trends.length),0);
clusters.forEach((c,ci)=>{
  const weight=1.7+Math.sqrt(c.trends.length),span=weight/tw*Math.PI*2,az=cursor+span/2;cursor+=span;
  const ring=34+(ci%3)*7+(ci%2)*2.8,elev=((ci%5)-2)*4.4;
  const p={x:Math.cos(az)*ring,y:elev,z:Math.sin(az)*ring};
  const m={id:c.id,type:'macro',title:c.title,color:c.color,p,r:2.55,icon:c.icon,detail:c.trends.length+' زیرروند'};
  nodes.push(m);macroMap.set(c.id,m);edges.push({a:'CORE',b:c.id,color:c.color,type:'hierarchy'});
  const tr=7.3+Math.min(6,c.trends.length*.25);
  c.trends.forEach((t,ti)=>{
    const a=ti/c.trends.length*Math.PI*2;
    const lp={x:Math.cos(a)*tr,y:Math.sin(a*1.8)*1.9,z:Math.sin(a)*tr};
    const tp={x:p.x+lp.x,y:p.y+lp.y,z:p.z+lp.z};
    const id=c.id+'-T'+String(ti+1).padStart(2,'0');
    nodes.push({id,type:'trend',title:t,color:c.color,p:tp,r:.72,parent:c.id,detail:'زیرروند مرتبط با «'+c.title+'»'});
    edges.push({a:c.id,b:id,color:c.color,type:'hierarchy'});
  });
});
cross.forEach(([a,b],i)=>edges.push({id:'X'+(i+1),a,b,color:'#ff6fae',type:'cross'}));
const byId=new Map(nodes.map(n=>[n.id,n]));
window.FSINFO_APP={
 focusById(id){const n=byId.get(id);if(n)focus(n)},
 getNode(id){return byId.get(id)||null},
 getContextNode(){if(selected)return selected;if(presentation.active&&presentation.step<14)return byId.get(PRESENTATION[presentation.step].id)||null;return null}
};

function drawBackground(){
  const g=ctx.createRadialGradient(W*.5,H*.46,20,W*.5,H*.5,Math.max(W,H)*.7);
  g.addColorStop(0,'#0d1224');g.addColorStop(.48,'#080b14');g.addColorStop(1,'#030407');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(cfg.nebula)nebulae.forEach(n=>{const p=project(n.p);if(!p)return;const rr=n.r*p.scale*.58;const gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr);gr.addColorStop(0,rgba(n.c,.12));gr.addColorStop(.45,rgba(n.c,.045));gr.addColorStop(1,rgba(n.c,0));ctx.fillStyle=gr;ctx.beginPath();ctx.arc(p.x,p.y,rr,0,Math.PI*2);ctx.fill()});
  if(cfg.stars){ctx.save();stars.forEach(s=>{const p=project(s);if(!p)return;const alpha=Math.max(.03,Math.min(.85,s.a*(1.2-p.depth/300)));ctx.fillStyle='rgba(210,220,255,'+alpha+')';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.25,s.s*p.scale*.06),0,Math.PI*2);ctx.fill()});ctx.restore()}
}
function sampleOrbit(radius,tilt,spin,color){
  ctx.beginPath();let started=false;
  for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;let p={x:Math.cos(a)*radius,y:Math.sin(a)*radius*Math.sin(tilt),z:Math.sin(a)*radius*Math.cos(tilt)};const cs=Math.cos(spin),ss=Math.sin(spin);p={x:p.x*cs-p.z*ss,y:p.y,z:p.x*ss+p.z*cs};const q=project(p);if(!q)continue;if(!started){ctx.moveTo(q.x,q.y);started=true}else ctx.lineTo(q.x,q.y)}
  ctx.strokeStyle=rgba(color,.1);ctx.lineWidth=1;ctx.stroke()
}
function drawOrbits(){
  sampleOrbit(31,.22,.1,'#8c86ff');sampleOrbit(45,-.34,.5,'#57ded5');sampleOrbit(59,.58,-.18,'#8c86ff');
}
function quadPoint(a,c,b,t){const u=1-t;return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y,z:u*u*a.z+2*u*t*c.z+t*t*b.z}}
function drawEdges(){
  if(!cfg.edges)return;
  edges.forEach(e=>{
    if(e.type==='cross'&&!cfg.cross)return;
    const A=byId.get(e.a),B=byId.get(e.b);if(!A||!B)return;
    if(e.type==='cross'){
      if(presentation.active&&presentation.step<14){const active=PRESENTATION[presentation.step].id;if(e.a!==active&&e.b!==active)return}
      const mid={x:(A.p.x+B.p.x)/2,y:(A.p.y+B.p.y)/2+16,z:(A.p.z+B.p.z)/2};
      ctx.beginPath();let started=false;
      for(let i=0;i<=26;i++){const p=project(quadPoint(A.p,mid,B.p,i/26));if(!p)continue;if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y)}
      ctx.strokeStyle=rgba(e.color,presentation.active?.5:.42);ctx.lineWidth=presentation.active?1.8:1.35;ctx.setLineDash([5,7]);ctx.stroke();ctx.setLineDash([])
    }else{
      if(presentation.active&&presentation.step<14){const active=PRESENTATION[presentation.step].id;if(e.a!=='CORE'&&e.a!==active&&e.b!==active)return;if(e.a===active&&B.type==='trend'){const ti=Number(B.id.split('T').pop())-1;if(ti>=presentation.reveal)return}}
      const a=project(A.p),b=project(B.p);if(!a||!b)return;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=rgba(e.color,presentation.active?.34:(A.type==='core'?.22:.15));ctx.lineWidth=.8;ctx.stroke()
    }
  })
}
function drawSphere(n,p,hover){
  const r=Math.max(n.type==='trend'?2.6:5,n.r*p.scale);
  const g=ctx.createRadialGradient(p.x-r*.35,p.y-r*.4,r*.08,p.x,p.y,r);
  g.addColorStop(0,'rgba(255,255,255,.98)');g.addColorStop(.18,rgba(n.color,.95));g.addColorStop(.7,rgba(n.color,.72));g.addColorStop(1,rgba(n.color,.04));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
  if(n.type!=='trend'){ctx.strokeStyle=rgba(n.color,hover?.75:.35);ctx.lineWidth=hover?2:1;ctx.beginPath();ctx.arc(p.x,p.y,r*1.35,0,Math.PI*2);ctx.stroke()}
  return r
}
function drawIcon(kind,x,y,size,color){
  if(!cfg.icons||!kind)return;ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.lineCap='round';ctx.lineJoin='round';const s=size/24;ctx.scale(s,s);
  const C=(x,y,r)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()},L=(...pts)=>{ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.stroke()};
  if(kind==='people'){C(9,8,3);C(16,10,2);L(4,19,5,15,9,13,13,15,14,19)}
  else if(kind==='power'){C(12,12,8);L(12,4,12,20);L(4,12,20,12);L(9,15,12,7,15,9)}
  else if(kind==='chip'){ctx.strokeRect(6,6,12,12);C(10,11,1);C(14,11,1);L(9,15,15,15)}
  else if(kind==='book'){L(4,6,8,5,12,7,12,19,8,17,4,18,4,6);L(20,6,16,5,12,7,12,19,16,17,20,18,20,6)}
  else if(kind==='spark'){L(12,2,14,8,20,10,14,12,12,19,10,12,4,10,10,8,12,2)}
  else if(kind==='network'){C(7,8,2.5);C(17,8,2.5);C(12,17,2.5);L(9,9.5,11,14);L(15,9.5,13,14)}
  else if(kind==='city'){L(3,21,3,10,9,10,9,21);L(9,21,9,5,17,5,17,21);L(17,21,17,13,21,13,21,21)}
  else if(kind==='female'){C(12,8,4);L(12,12,12,21);L(8.5,17,15.5,17)}
  else if(kind==='waves'){L(3,7,7,4,11,8,15,4,21,7);L(3,13,7,10,11,14,15,10,21,13);L(3,19,7,16,11,20,15,16,21,19)}
  else if(kind==='arrow'){L(5,19,14,10,19,10);L(14,5,19,10,14,15)}
  else if(kind==='health'){C(12,12,8);L(8,12,16,12);L(12,8,12,16)}
  else if(kind==='shield'){L(12,3,20,6,20,12,17,18,12,21,7,18,4,12,4,6,12,3);L(8,12,11,15,16,9)}
  else if(kind==='nodes'){C(12,5,2);C(5,18,2);C(19,18,2);L(12,7,12,12);L(12,12,5,16);L(12,12,19,16)}
  else if(kind==='dna'){L(7,3,17,21);L(17,3,7,21);L(9,7,15,7);L(9,17,15,17)}
  ctx.restore()
}
let screenNodes=[];
function presentationAlpha(n){
  if(!presentation.active)return 1;
  if(presentation.step===14)return n.type==='trend'?.68:1;
  const active=PRESENTATION[presentation.step].id;
  if(n.id==='CORE')return .2;
  if(n.id===active)return 1;
  if(n.type==='trend'&&n.parent===active){
    const ti=Number(n.id.split('T').pop())-1;
    return ti<presentation.reveal?1:0;
  }
  return n.type==='macro'?.1:.025;
}
function drawNodes(){
  const projected=nodes.map(n=>({n,p:project(n.p)})).filter(x=>x.p).sort((a,b)=>b.p.depth-a.p.depth);
  screenNodes=[];const labelRects=[];
  projected.forEach(({n,p})=>{
    const alpha=presentationAlpha(n);if(alpha<.02)return;
    ctx.save();ctx.globalAlpha=alpha;
    const isCurrent=presentation.active&&presentation.step<14&&n.type==='trend'&&n.parent===PRESENTATION[presentation.step].id&&(Number(n.id.split('T').pop())-1===presentation.reveal-1);
    const isHover=hovered&&hovered.id===n.id,isSel=selected&&selected.id===n.id;
    const rr=drawSphere(n,p,isHover||isSel||isCurrent);
    if(isCurrent){ctx.strokeStyle=rgba(n.color,.85);ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,rr*1.9+Math.sin(performance.now()*.006)*2,0,Math.PI*2);ctx.stroke()}
    if(n.type==='macro')drawIcon(n.icon,p.x,p.y,Math.min(25,rr*1.25),'rgba(255,255,255,.88)');
    ctx.restore();
    if(alpha>.2)screenNodes.push({n,p,r:Math.max(rr,8)});
  });
  if(!cfg.labels)return;
  projected.reverse().forEach(({n,p})=>{
    const alpha=presentationAlpha(n);if(alpha<.2)return;
    let important=n.type!=='trend'||(hovered&&hovered.id===n.id)||(selected&&selected.id===n.id)||camera.dist<62;
    if(presentation.active&&presentation.step<14){
      const active=PRESENTATION[presentation.step].id;
      important=n.id===active||(n.type==='trend'&&n.parent===active&&Number(n.id.split('T').pop())-1<presentation.reveal);
    }
    if(!important)return;
    const fs=n.type==='core'?15:n.type==='macro'?12:10;
    ctx.font=(n.type==='trend'?'600 ':'800 ')+fs+'px '+(window.FSINFO_FONT?.family?.()||'Vazirmatn, Tahoma, Arial');
    const text=n.title.length>44&&n.type==='trend'?n.title.slice(0,42)+'…':n.title;
    const width=ctx.measureText(text).width+12,height=fs+10,x=p.x-width/2,y=p.y-(n.r*p.scale)-height-3;
    const rect={x,y,w:width,h:height};
    const collision=labelRects.some(r=>!(rect.x+rect.w<r.x||rect.x>r.x+r.w||rect.y+rect.h<r.y||rect.y>r.y+r.h));
    if(collision&&n.type==='trend'&&!(presentation.active||hovered&&hovered.id===n.id||selected&&selected.id===n.id))return;
    labelRects.push(rect);
    ctx.save();ctx.globalAlpha=Math.max(.35,alpha);
    ctx.fillStyle='rgba(6,8,14,.78)';ctx.strokeStyle=rgba(n.color,n.type==='macro'?.45:.22);ctx.lineWidth=.8;
    roundRect(rect.x,rect.y,rect.w,rect.h,7);ctx.fill();ctx.stroke();
    ctx.fillStyle=n.type==='core'?'#ffffff':'#eef1fb';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,p.x,y+height/2+.5);ctx.restore()
  })
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function pick(x,y){let best=null,bd=Infinity;for(const s of screenNodes){const d=Math.hypot(x-s.p.x,y-s.p.y);if(d<s.r+7&&d<bd){bd=d;best=s.n}}return best}
function setInfo(n){
  const id=document.getElementById('infoId'),title=document.getElementById('infoTitle'),text=document.getElementById('infoText'),pills=document.getElementById('infoPills'),book=document.getElementById('infoBookBtn');
  if(!n){id.textContent='NONE';title.textContent='برای دیدن جزئیات روی یک گره بروید';text.textContent='با کشیدن، کهکشان را بچرخانید؛ Pinch یا Wheel برای زوم و Tap/Click برای تمرکز.';pills.innerHTML='<span class="pill">canvas 3D</span><span class="pill">interactive</span>';book.hidden=true;return}
  const r=window.FSINFO_CONTENT?.getRecord?.(n.id)||window.FSINFO_CONTENT?.getRecord?.(n.parent),out=r?window.FSINFO_CONTENT.get(r.id,{mode:'sentence'}):null;
  id.textContent=n.id;title.textContent=n.title;text.textContent=out?.text||n.detail||'';const kind=n.type==='core'?'هسته':n.type==='macro'?'کلان‌روند':'روند';pills.innerHTML='<span class="pill">'+kind+'</span><span class="pill">'+n.id+'</span>';book.hidden=!r
}
function focus(n){selected=n;window.FSINFO_MODULES?.select?.(n);if(n.type==='trend'&&n.parent){const p=byId.get(n.parent);camera.targetFocus={...p.p};camera.targetDist=29}else{camera.targetFocus={...n.p};camera.targetDist=n.type==='macro'?38:48}camera.targetYaw=camera.yaw;camera.targetPitch=camera.pitch;setInfo(n)}
function reset(){selected=null;window.FSINFO_MODULES?.select?.(null);camera.targetFocus={x:0,y:0,z:0};camera.targetDist=92;camera.targetYaw=-.35;camera.targetPitch=.18;setInfo(null)}

const PUI={
 panel:document.getElementById('presentationPanel'),state:document.getElementById('presentState'),index:document.getElementById('presentIndex'),
 source:document.getElementById('presentSource'),title:document.getElementById('presentTitle'),question:document.getElementById('presentQuestion'),
 copy:document.getElementById('presentCopy'),cursor:document.getElementById('typeCursor'),trends:document.getElementById('presentTrends'),
 takeaway:document.getElementById('presentTakeaway'),progress:document.getElementById('presentProgress'),dots:document.getElementById('presentDots'),
 prev:document.getElementById('presentPrev'),pause:document.getElementById('presentPause'),next:document.getElementById('presentNext'),
 overview:document.getElementById('presentOverview'),exit:document.getElementById('presentExit'),auto:document.getElementById('presentAuto'),type:document.getElementById('presentType'),
 sourceDrawer:document.getElementById('sourceDrawer'),sourceDetail:document.getElementById('sourceDetailText'),reduced:document.getElementById('presentReduced'),book:document.getElementById('presentBookBtn')
};
function savePresentationSnapshot(){
 return {yaw:camera.yaw,pitch:camera.pitch,targetYaw:camera.targetYaw,targetPitch:camera.targetPitch,dist:camera.dist,targetDist:camera.targetDist,focus:{...camera.focus},targetFocus:{...camera.targetFocus},rotate:cfg.rotate,selected};
}
function finishNarration(){
 presentation.textComplete=true;presentation.revealStart=performance.now()+320;PUI.cursor.style.display='none';presentation.typingText='';presentation.typingDone=null;renderPresentationPanel()
}
function typewrite(text,token){
 presentation.typingRun++;const run=presentation.typingRun;presentation.typingText=text;presentation.typingDone=finishNarration;
 PUI.copy.classList.remove('quick-reveal');PUI.copy.textContent='';presentation.textComplete=false;presentation.reveal=0;presentation.revealStart=Infinity;
 PUI.cursor.style.display=(presentation.typewriter&&!presentation.reduced)?'inline-block':'none';
 if(!presentation.typewriter||presentation.reduced){PUI.copy.textContent=text;finishNarration();return}
 const chars=Array.from(text);let i=0;
 function tick(){if(run!==presentation.typingRun||token!==presentation.token||!presentation.active)return;PUI.copy.textContent=chars.slice(0,i).join('');i+=2;if(i<=chars.length)setTimeout(tick,24);else finishNarration()}
 tick()
}
function completeTypingFast(){
 if(!presentation.typingText)return;
 presentation.typingRun++;PUI.copy.classList.remove('quick-reveal');void PUI.copy.offsetWidth;PUI.copy.classList.add('quick-reveal');
 PUI.copy.textContent=presentation.typingText;finishNarration()
}
function renderDots(){
 PUI.dots.innerHTML='';
 PRESENTATION.forEach((p,i)=>{const b=document.createElement('button');b.className='present-dot'+(i<presentation.step?' done':'')+(i===presentation.step?' active':'');b.title=p.id+' — '+byId.get(p.id).title;b.onclick=()=>goPresentationStep(i);PUI.dots.appendChild(b)})
}
function renderPresentationPanel(){
 if(!presentation.active)return;
 if(presentation.step===14){
   PUI.index.textContent='جمع‌بندی';PUI.source.textContent='جمع‌بندی تحریری';PUI.title.textContent='بازگشت به نمای کل';
   PUI.question.textContent='چه چیزی از این سفر ۱۴ مرحله‌ای باید در ذهن بماند؟';
   PUI.copy.textContent='چهارده کلان‌روند مستقل از هم نیستند؛ آن‌ها یک محیط درهم‌تنیده از تغییرات جمعیتی، فناورانه، دانشی، معنایی، اجتماعی و نهادی را می‌سازند.';
   PUI.cursor.style.display='none';PUI.trends.innerHTML='';PUI.takeaway.textContent='اکنون دوباره کل کهکشان را ببینید و به پیوند میان خوشه‌ها توجه کنید.';PUI.takeaway.classList.add('show');
   PUI.sourceDetail.textContent='این جمع‌بندی، متن آموزشی تحریری برای مرور کل نقشه است و نقل مستقیم از گزارش نیست.';
   PUI.progress.style.width='100%';PUI.prev.disabled=false;PUI.next.textContent='از ابتدا';PUI.state.textContent=presentation.paused?'PAUSED':'RECAP';renderDots();return
 }
 const meta=PRESENTATION[presentation.step],macro=byId.get(meta.id),cluster=clusters.find(c=>c.id===meta.id);
 PUI.index.textContent=String(presentation.step+1).padStart(2,'0')+' / 14';
 PUI.source.textContent=meta.source;PUI.title.textContent=macro.title;PUI.question.textContent=meta.question;
 PUI.sourceDetail.textContent='خلاصه آموزشی برگرفته از بخش '+String(presentation.step+1)+' گزارش. آغاز این بخش در فهرست سند: صفحه '+REPORT_PAGES[meta.id]+'. متن کارت برای ارائه کوتاه و بازنویسی شده است؛ برای استناد علمی باید به متن کامل گزارش و منابع آن مراجعه شود.';
 PUI.progress.style.width=((presentation.step)/14*100)+'%';PUI.prev.disabled=presentation.step===0;PUI.next.textContent='بعدی';
 PUI.state.textContent=presentation.paused?'PAUSED':presentation.autoplay?'AUTO':'MANUAL';
 PUI.trends.innerHTML='';cluster.trends.forEach((t,i)=>{const span=document.createElement('span');span.className='trend-chip'+(i<presentation.reveal?' seen':'')+(i===presentation.reveal-1?' current':'');span.style.setProperty('--cluster',cluster.color);span.textContent=t;PUI.trends.appendChild(span)});
 PUI.takeaway.textContent=meta.takeaway;PUI.takeaway.classList.toggle('show',presentation.reveal>=cluster.trends.length);
 renderDots()
}
function presentationElapsed(now=performance.now()){return now-presentation.start-presentation.pauseAccum-(presentation.paused?(now-presentation.pauseStart):0)}
function goPresentationStep(index){
 if(index<0)index=0;if(index>14)index=14;presentation.step=index;presentation.reveal=0;presentation.textComplete=false;presentation.revealStart=Infinity;presentation.typingRun++;presentation.typingText='';presentation.typingDone=null;presentation.start=performance.now();presentation.pauseAccum=0;if(presentation.paused)presentation.pauseStart=presentation.start;presentation.token++;
 if(index===14){
   selected=null;camera.targetFocus={x:0,y:0,z:0};camera.targetDist=96;camera.targetYaw=-.08;camera.targetPitch=.13;renderPresentationPanel();return
 }
 const meta=PRESENTATION[index],macro=byId.get(meta.id);selected=macro;camera.targetFocus={...macro.p};camera.targetDist=presentation.reduced?44:36;camera.targetYaw=presentation.reduced?camera.yaw:(-.48+Math.sin(index*.73)*.18);camera.targetPitch=presentation.reduced?camera.pitch:(.12+Math.cos(index*.61)*.07);
 PUI.takeaway.classList.remove('show');PUI.copy.textContent='';PUI.cursor.style.display='none';renderPresentationPanel();
 const token=presentation.token;setTimeout(()=>{if(token===presentation.token&&presentation.active)typewrite(meta.intro,token)},presentation.reduced?120:850)
}
function startGuidedTour(){
 if(presentation.active)return;window.FSINFO_MODULES?.closePanels?.();presentation.snapshot=savePresentationSnapshot();presentation.active=true;presentation.step=0;presentation.paused=false;presentation.autoplay=PUI.auto.checked;presentation.typewriter=PUI.type.checked;presentation.reduced=PUI.reduced.checked;cfg.rotate=false;document.getElementById('tgRotate').checked=false;document.body.classList.add('presenting');goPresentationStep(0)
}
function renderIntro(){
 const item=FUTURES_INTRO[introState.step];document.getElementById('introIndex').textContent=(introState.step+1)+' / '+FUTURES_INTRO.length;
 document.getElementById('introTitle').textContent=item.title;document.getElementById('introText').textContent=item.text;
 const dots=document.getElementById('introDots');dots.innerHTML='';FUTURES_INTRO.forEach((_,i)=>{const d=document.createElement('i');d.className='intro-dot'+(i===introState.step?' active':'');dots.appendChild(d)});
 document.getElementById('introPrev').disabled=introState.step===0;document.getElementById('introNext').textContent=introState.step===FUTURES_INTRO.length-1?'ورود به نقشه':'بعدی'
}
function startPresentation(){
 if(presentation.active||introState.active)return;introState.active=true;introState.step=0;document.body.classList.add('introing');renderIntro()
}
function closeIntro(startTour){
 introState.active=false;document.body.classList.remove('introing');if(startTour)startGuidedTour()
}
function exitPresentation(){
 if(!presentation.active)return;presentation.token++;const snap=presentation.snapshot;presentation.active=false;recapPanel.classList.remove('show');document.body.classList.remove('presenting');
 if(snap){camera.yaw=snap.yaw;camera.pitch=snap.pitch;camera.targetYaw=snap.targetYaw;camera.targetPitch=snap.targetPitch;camera.dist=snap.dist;camera.targetDist=snap.targetDist;camera.focus={...snap.focus};camera.targetFocus={...snap.targetFocus};cfg.rotate=snap.rotate;document.getElementById('tgRotate').checked=cfg.rotate;selected=snap.selected}
 PUI.cursor.style.display='none';setInfo(selected)
}
function togglePresentationPause(force){
 if(!presentation.active)return;const next=typeof force==='boolean'?force:!presentation.paused;
 if(next===presentation.paused)return;
 if(next){presentation.paused=true;presentation.pauseStart=performance.now()}else{const d=performance.now()-presentation.pauseStart;presentation.pauseAccum+=d;if(Number.isFinite(presentation.revealStart))presentation.revealStart+=d;presentation.paused=false}
 PUI.pause.textContent=presentation.paused?'ادامه':'توقف';renderPresentationPanel()
}
function updatePresentation(now){
 if(!presentation.active||presentation.paused||presentation.step===14)return;
 const cluster=clusters.find(c=>c.id===PRESENTATION[presentation.step].id);
 if(!presentation.textComplete)return;
 const reveal=Math.max(0,Math.min(cluster.trends.length,Math.floor((now-presentation.revealStart)/330)+1));
 if(reveal!==presentation.reveal){presentation.reveal=reveal;renderPresentationPanel()}
 const doneAt=presentation.revealStart+cluster.trends.length*330+3200;
 if(presentation.autoplay&&now>doneAt)advancePresentation()
}
document.getElementById('startPresentation').onclick=startPresentation;
PUI.prev.onclick=()=>goPresentationStep(Math.max(0,presentation.step-1));
PUI.next.onclick=advancePresentation;
PUI.pause.onclick=()=>togglePresentationPause();
PUI.overview.onclick=()=>{camera.targetFocus={x:0,y:0,z:0};camera.targetDist=96;camera.targetYaw=-.08;camera.targetPitch=.13;togglePresentationPause(true)};
PUI.exit.onclick=exitPresentation;PUI.book.onclick=()=>window.FSINFO_MODULES?.openBookFor?.(window.FSINFO_APP.getContextNode());
PUI.auto.onchange=()=>{presentation.autoplay=PUI.auto.checked;renderPresentationPanel()};
PUI.type.onchange=()=>{presentation.typewriter=PUI.type.checked&&!presentation.reduced};
PUI.copy.parentElement.onclick=()=>{if(presentation.typingText)completeTypingFast()};

document.getElementById('introPrev').onclick=()=>{introState.step=Math.max(0,introState.step-1);renderIntro()};
document.getElementById('introNext').onclick=()=>{if(introState.step>=FUTURES_INTRO.length-1)closeIntro(true);else{introState.step++;renderIntro()}};
document.getElementById('introSkip').onclick=()=>closeIntro(true);

const recapPanel=document.getElementById('recapPanel'),recapTitle=document.getElementById('recapTitle'),recapList=document.getElementById('recapList');
function showGroupRecap(nextStep){
 if(presentation.skipRecaps){goPresentationStep(nextStep);return}
 const r=GROUP_RECAPS.find(x=>x.after===presentation.step);if(!r){goPresentationStep(nextStep);return}
 togglePresentationPause(true);recapTitle.textContent=r.title;recapList.innerHTML='';r.items.forEach(t=>{const d=document.createElement('div');d.className='recap-item';d.textContent=t;recapList.appendChild(d)});
 recapPanel.dataset.next=String(nextStep);recapPanel.classList.add('show')
}
document.getElementById('recapContinue').onclick=()=>{const next=Number(recapPanel.dataset.next||0);recapPanel.classList.remove('show');togglePresentationPause(false);goPresentationStep(next)};
document.getElementById('recapSkip').onclick=()=>{presentation.skipRecaps=true;document.getElementById('recapContinue').click()};
function advancePresentation(){
 if(presentation.step===14){goPresentationStep(0);return}
 if([3,7,11].includes(presentation.step)){showGroupRecap(presentation.step+1);return}
 goPresentationStep(presentation.step+1)
}

let theater=false;
function setTheater(on){theater=on;document.body.classList.toggle('theater',on);document.getElementById('theaterBtn').textContent=on?'بازگرداندن پنل‌ها':'حالت خلوت'}
document.getElementById('theaterBtn').onclick=()=>setTheater(!theater);
document.getElementById('theaterToggle').onclick=()=>setTheater(!theater);
document.getElementById('theaterRestore').onclick=()=>setTheater(false);
const quickTheater=document.getElementById('quickTheater');if(quickTheater)quickTheater.onclick=()=>setTheater(!theater);

function setReduced(on){
 cfg.reduced=on;presentation.reduced=on;document.body.classList.toggle('reduced-motion',on);
 document.getElementById('tgReduced').checked=on;PUI.reduced.checked=on;
 if(on){cfg.rotate=false;document.getElementById('tgRotate').checked=false;presentation.typewriter=false;PUI.type.checked=false}
}
document.getElementById('tgReduced').onchange=e=>setReduced(e.target.checked);
PUI.reduced.onchange=e=>setReduced(e.target.checked);
setReduced(cfg.reduced);

document.addEventListener('keydown',e=>{
 if(e.code==='KeyH'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();setTheater(!theater);return}
 if(introState.active){if(e.key==='Escape')closeIntro(false);if(e.key==='ArrowLeft')document.getElementById('introNext').click();if(e.key==='ArrowRight')document.getElementById('introPrev').click();return}
 if(!presentation.active)return;
 if(e.key==='Escape'){exitPresentation();return}
 if(e.key===' '){e.preventDefault();togglePresentationPause();return}
 if(e.key==='ArrowLeft'){goPresentationStep(Math.min(14,presentation.step+1));return}
 if(e.key==='ArrowRight'){goPresentationStep(Math.max(0,presentation.step-1));return}
 if(e.key==='Home'){PUI.overview.click()}
});

const gesture=window.FSINFO_GESTURES.bind(canvas,{
 start(){if(presentation.active)togglePresentationPause(true)},
 reduced(){return cfg.reduced},
 orbit(dx,dy,meta){
   const touch=meta?.pointerType==='touch',inertia=!!meta?.inertia;
   const sx=touch?-1:1,sy=touch?-1:1;
   camera.targetYaw+=sx*dx*(inertia?.0031:.0056);
   camera.targetPitch=Math.max(-1.18,Math.min(1.18,camera.targetPitch+sy*dy*(inertia?.0027:.0048)))
 },
 zoom(delta){camera.targetDist=Math.max(24,Math.min(160,camera.targetDist+delta*.045))},
 tap(x,y){const n=pick(x,y);if(n)focus(n)},
 doubleTap(x,y){if(!pick(x,y))reset()}
});
document.getElementById('resetCam').onclick=()=>{if(presentation.active)exitPresentation();reset()};
document.getElementById('focusCore').onclick=()=>{if(presentation.active)togglePresentationPause(true);focus(byId.get('CORE'))};
document.getElementById('exportPng').onclick=()=>{render();const a=document.createElement('a');a.download='fsinfo-v0.12-stable-core.png';a.href=canvas.toDataURL('image/png');a.click()};
['Labels','Edges','Cross','Stars','Nebula','Icons','Rotate'].forEach(k=>{const el=document.getElementById('tg'+k);el.onchange=()=>cfg[k.toLowerCase()]=el.checked});
let last=performance.now();
function render(){
  try{
    const now=performance.now(),dt=Math.min(.04,(now-last)/1000);last=now;
    if(cfg.rotate&&!selected&&!presentation.active){camera.targetYaw+=dt*.055}
    const ease=cfg.reduced?.18:.065,zoomEase=cfg.reduced?.18:.07;
    camera.yaw=lerp(camera.yaw,camera.targetYaw,ease);camera.pitch=lerp(camera.pitch,camera.targetPitch,ease);
    camera.dist=lerp(camera.dist,camera.targetDist,zoomEase);
    camera.focus=lerp3(camera.focus,camera.targetFocus,zoomEase);
    updatePresentation(now);
    drawBackground();drawOrbits();drawEdges();drawNodes()
  }catch(err){
    document.getElementById('errorBox').classList.add('show');document.getElementById('errorText').textContent=err&&err.message?err.message:String(err);throw err
  }
}
function loop(){render();requestAnimationFrame(loop)}
setInfo(null);loop();
})();
