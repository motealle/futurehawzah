
(() => {
'use strict';
const canvas=document.getElementById('galaxy'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){document.getElementById('errorBox').classList.add('show');document.getElementById('errorText').textContent='مرورگر Canvas 2D را پشتیبانی نمی‌کند.';return}

const {clusters,cross,presentation:PRESENTATION,reportPages:REPORT_PAGES,futuresIntro:FUTURES_INTRO,groupRecaps:GROUP_RECAPS}=window.FSINFO_BOOK_INDEX;

const compact=matchMedia('(max-width: 760px)');
let W=1,H=1,DPR=1,needsRender=true,scene={x:0,y:0,w:1,h:1};
function resize(){
 const bounds=canvas.getBoundingClientRect();
 const w=Math.max(1,Math.round(bounds.width)),h=Math.max(1,Math.round(bounds.height));
 const dpr=Math.min(devicePixelRatio||1,compact.matches?1.25:1.8);
 if(w===W&&h===H&&DPR===dpr&&canvas.width===Math.round(w*dpr))return;
 W=w;H=h;DPR=dpr;
 canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);needsRender=true;
}
resize();new ResizeObserver(resize).observe(canvas);
document.fonts.ready.then(()=>needsRender=true);
window.addEventListener("fsinfo:layout",()=>needsRender=true);

const cfg={labels:true,edges:true,cross:true,stars:true,nebula:true,icons:true,rotate:!compact.matches,reduced:!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)};
const camera={yaw:-.35,pitch:.18,targetYaw:-.35,targetPitch:.18,dist:92,targetDist:92,focus:{x:0,y:0,z:0},targetFocus:{x:0,y:0,z:0}};
let hovered=null,selected=null,pulse=null,audio=null;
let panX=0,panY=0,orbitClock=0,muted=false;
function feedback(n,sound=true){
 pulse={id:n.id,start:performance.now()};needsRender=true;
 if(!sound||muted)return;
 try{
  audio ||= new (window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended')audio.resume().catch(()=>{});
  const tone=audio.createOscillator(),amp=audio.createGain(),t=audio.currentTime;
  tone.type='sine';tone.frequency.setValueAtTime(490,t);tone.frequency.exponentialRampToValueAtTime(760,t+.075);
  amp.gain.setValueAtTime(.035,t);amp.gain.exponentialRampToValueAtTime(.0001,t+.12);
  tone.connect(amp).connect(audio.destination);tone.start(t);tone.stop(t+.13);
 }catch{}
}
function clearPan(){panX=panY=0;needsRender=true;}

let presentation={active:false,step:0,paused:false,autoplay:true,typewriter:true,reduced:cfg.reduced,deepTrends:false,start:0,pauseStart:0,pauseAccum:0,reveal:0,snapshot:null,token:0,skipRecaps:false,textComplete:false,revealStart:Infinity,macroAdvanceAt:Infinity,inTrend:false,trendIndex:-1,trendComplete:false,trendAdvanceAt:Infinity,typingRun:0,typingText:"",typingDone:null};
const PRESENTATION_TIMING=Object.freeze({cameraSettle:850,reducedCameraSettle:120,typeCharsPerTick:2,typeTickMs:24,postNarrationPause:320,tagCadence:850,postTagsHold:3800,trendHold:2200});
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
  const vr=scene;
  const featured=previewMacro && activeMacro()===previewMacro;
  const shift=featured?{x:Math.min(53,vr.w*.14),y:Math.min(48,vr.h*.16)}:{x:0,y:0};
  const focal=Math.max(72,Math.min(vr.w,vr.h)*1.23),scale=focal/depth;
  return{x:vr.x+vr.w/2+r.x*scale+panX+shift.x,y:vr.y+vr.h/2-r.y*scale+panY+shift.y,z:r.z,scale,depth}
}
function lerp(a,b,t){return a+(b-a)*t}
function lerp3(a,b,t){return{x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),z:lerp(a.z,b.z,t)}}

const stars=Array.from({length:compact.matches?410:740},(_,i)=>{
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
    nodes.push({id,type:'trend',title:t,color:c.color,p:tp,origin:{x:lp.x,y:lp.y,z:lp.z},r:.72,parent:c.id,detail:'زیرروند مرتبط با «'+c.title+'»'});
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
  g.addColorStop(0,'#172e40');g.addColorStop(.56,'#0b1a2b');g.addColorStop(1,'#09111e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
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
      if(presentation.active&&presentation.step<14){const active=PRESENTATION[presentation.step].id;if(e.a!=='CORE'&&e.a!==active&&e.b!==active)return;if(e.a===active&&B.type==='trend'){const ti=Number(B.id.split('T').pop())-1;if(ti>=presentation.reveal&&!presentation.deepTrends)return}}
      const a=project(A.p),b=project(B.p);if(!a||!b)return;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=rgba(e.color,presentation.active?.34:(A.type==='core'?.22:.15));ctx.lineWidth=.8;ctx.stroke()
    }
  })
}
function drawSphere(n,p,hover){
  const boost=pulse?.id===n.id&&!cfg.reduced?1+.24*Math.sin(Math.PI*Math.min(1,(performance.now()-pulse.start)/340)):1;
  const r=boost*Math.max(n.type==='trend'?2.6:5,n.r*p.scale);
  const major=n.type!=='trend';
  const g=ctx.createRadialGradient(p.x-r*.39,p.y-r*.48,0,p.x,p.y,r);
  g.addColorStop(0,major?'#f5ebcd':rgba(n.color,.9));
  g.addColorStop(.25,rgba(n.color,.96));g.addColorStop(.77,major?rgba(n.color,.46):'#1a2935');g.addColorStop(1,'#111f2e');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=rgba(n.color,major?.72:.95);ctx.lineWidth=major?1.25:.85;ctx.stroke();
  if(major){
    ctx.strokeStyle=rgba(n.color,hover?.85:.33);ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(p.x,p.y,r*1.32,r*1.13,-.34,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='rgba(255,235,188,.55)';ctx.beginPath();ctx.arc(p.x,p.y,r*.94,Math.PI*1.1,Math.PI*1.6);ctx.stroke();
  }
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
    return ti<presentation.reveal||presentation.deepTrends?1:.48;
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
      important=n.id===active||(n.type==='trend'&&n.parent===active&&(presentation.deepTrends||Number(n.id.split('T').pop())-1<presentation.reveal));
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
    const hit=screenNodes.find(item=>item.n===n);if(hit)hit.label=rect;
    ctx.save();ctx.globalAlpha=Math.max(.35,alpha);
    ctx.fillStyle='rgba(6,8,14,.78)';ctx.strokeStyle=rgba(n.color,n.type==='macro'?.45:.22);ctx.lineWidth=.8;
    roundRect(rect.x,rect.y,rect.w,rect.h,7);ctx.fill();ctx.stroke();
    ctx.fillStyle=n.type==='core'?'#ffffff':'#eef1fb';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,p.x,y+height/2+.5);ctx.restore()
  })
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function pick(x,y){
 const bounds=canvas.getBoundingClientRect();x-=bounds.left;y-=bounds.top;
 const label=screenNodes.findLast(s=>s.label&&x>=s.label.x&&x<=s.label.x+s.label.w&&y>=s.label.y&&y<=s.label.y+s.label.h);
 if(label)return label.n;
 let best=null,bd=Infinity;
 for(const s of screenNodes){const d=Math.hypot(x-s.p.x,y-s.p.y);if(d<s.r+9&&d<bd){bd=d;best=s.n;}}
 return best;
}
function setInfo(n){
  document.body.classList.toggle('node-open',!!n&&n.type!=='core');
  needsRender=true;
  document.getElementById('nodeImageBox').hidden=true;
  document.getElementById('infoKind').textContent=n?.type==='trend'?'روند':n?.type==='macro'?'کلان‌روند':'توضیحات';
  const id=document.getElementById('infoId'),title=document.getElementById('infoTitle'),text=document.getElementById('infoText'),pills=document.getElementById('infoPills'),book=document.getElementById('infoBookBtn');
  if(!n){id.textContent='NONE';title.textContent='برای دیدن جزئیات روی یک گره بروید';text.textContent='با کشیدن، کهکشان را بچرخانید؛ Pinch یا Wheel برای زوم و Tap/Click برای تمرکز.';pills.innerHTML='<span class="pill">canvas 3D</span><span class="pill">interactive</span>';book.hidden=true;return}
  const r=window.FSINFO_CONTENT?.getRecord?.(n.id)||window.FSINFO_CONTENT?.getRecord?.(n.parent),out=r?window.FSINFO_CONTENT.get(r.id,{mode:'sentence'}):null;
  id.textContent=n.id;title.textContent=n.title;text.textContent=(n.type==='trend'?window.FSINFO_CONTENT?.nodeContext?.(n.id)?.trend?.context?.slice(0,420):out?.text)||n.detail||'';const kind=n.type==='core'?'هسته':n.type==='macro'?'کلان‌روند':'روند';pills.innerHTML='<span class="pill">'+kind+'</span><span class="pill">'+n.id+'</span>';book.hidden=!r
}
function focus(n){
 clearPan();selected=n;window.FSINFO_MODULES?.select?.(n);
 camera.targetFocus={...n.p};camera.targetDist=n.type==='trend'?(compact.matches?32:29):n.type==='macro'?38:48;
 camera.targetYaw=camera.yaw;camera.targetPitch=camera.pitch;setInfo(n)
}
function reset(){clearPan();selected=null;window.FSINFO_MODULES?.select?.(null);camera.targetFocus={x:0,y:0,z:0};camera.targetDist=92;camera.targetYaw=-.35;camera.targetPitch=.18;setInfo(null)}

const PUI={
 panel:document.getElementById('presentationPanel'),state:document.getElementById('presentState'),index:document.getElementById('presentIndex'),
 source:document.getElementById('presentSource'),title:document.getElementById('presentTitle'),question:document.getElementById('presentQuestion'),
 copy:document.getElementById('presentCopy'),cursor:document.getElementById('typeCursor'),trends:document.getElementById('presentTrends'),
 takeaway:document.getElementById('presentTakeaway'),progress:document.getElementById('presentProgress'),dots:document.getElementById('presentDots'),
 prev:document.getElementById('presentPrev'),pause:document.getElementById('presentPause'),next:document.getElementById('presentNext'),
 overview:document.getElementById('presentOverview'),exit:document.getElementById('presentExit'),auto:document.getElementById('presentAuto'),type:document.getElementById('presentType'),
 sourceDrawer:document.getElementById('sourceDrawer'),sourceDetail:document.getElementById('sourceDetailText'),reduced:document.getElementById('presentReduced'),deep:document.getElementById('presentDeep'),backMacro:document.getElementById('presentBackMacro'),book:document.getElementById('presentBookBtn')
};
function savePresentationSnapshot(){
 return {yaw:camera.yaw,pitch:camera.pitch,targetYaw:camera.targetYaw,targetPitch:camera.targetPitch,dist:camera.dist,targetDist:camera.targetDist,focus:{...camera.focus},targetFocus:{...camera.targetFocus},rotate:cfg.rotate,selected};
}
function finishMacroNarration(){
 presentation.textComplete=true;presentation.revealStart=performance.now()+PRESENTATION_TIMING.postNarrationPause;presentation.macroAdvanceAt=Infinity;PUI.cursor.style.display='none';presentation.typingText='';presentation.typingDone=null;renderPresentationPanel()
}
function finishTrendNarration(){
 presentation.trendComplete=true;presentation.trendAdvanceAt=performance.now()+PRESENTATION_TIMING.trendHold;PUI.cursor.style.display='none';presentation.typingText='';presentation.typingDone=null;renderPresentationPanel()
}
function typewrite(text,token,done){
 presentation.typingRun++;const run=presentation.typingRun;presentation.typingText=text;presentation.typingDone=done||null;PUI.copy.classList.remove('quick-reveal');PUI.copy.textContent='';
 PUI.cursor.style.display=(presentation.typewriter&&!presentation.reduced)?'inline-block':'none';
 if(!presentation.typewriter||presentation.reduced){PUI.copy.textContent=text;const cb=presentation.typingDone;presentation.typingText='';presentation.typingDone=null;cb?.();return}
 const chars=Array.from(text);let i=0;
 function tick(){if(run!==presentation.typingRun||token!==presentation.token||!presentation.active)return;PUI.copy.textContent=chars.slice(0,i).join('');i+=PRESENTATION_TIMING.typeCharsPerTick;if(i<=chars.length)setTimeout(tick,PRESENTATION_TIMING.typeTickMs);else{PUI.cursor.style.display='none';const cb=presentation.typingDone;presentation.typingText='';presentation.typingDone=null;cb?.()}}
 tick()
}
function completeTypingFast(){
 if(!presentation.typingText)return;presentation.typingRun++;PUI.copy.classList.remove('quick-reveal');void PUI.copy.offsetWidth;PUI.copy.classList.add('quick-reveal');PUI.copy.textContent=presentation.typingText;
 const cb=presentation.typingDone;presentation.typingText='';presentation.typingDone=null;PUI.cursor.style.display='none';cb?.()
}
function trendIdAt(index){const macro=PRESENTATION[presentation.step]?.id;return macro?macro+'-T'+String(index+1).padStart(2,'0'):null}
function trendPayloadAt(index){return window.FSINFO_CONTENT?.trendPresentationText?.(trendIdAt(index))||null}
function restoreMacroNarration({pause=false}={}){
 if(presentation.step>=14)return;presentation.inTrend=false;presentation.trendIndex=-1;presentation.trendComplete=false;presentation.trendAdvanceAt=Infinity;presentation.macroAdvanceAt=performance.now()+PRESENTATION_TIMING.postTagsHold;
 const meta=PRESENTATION[presentation.step],macro=byId.get(meta.id);selected=macro;window.FSINFO_MODULES?.select?.(macro);camera.targetFocus={...macro.p};camera.targetDist=presentation.reduced?44:36;
 PUI.copy.classList.remove('quick-reveal');PUI.copy.textContent=meta.intro;PUI.cursor.style.display='none';PUI.backMacro.hidden=true;renderPresentationPanel();if(pause)togglePresentationPause(true)
}
function enterTrend(index){
 if(!presentation.active||presentation.step>=14)return;const cluster=clusters.find(c=>c.id===PRESENTATION[presentation.step].id);index=Math.max(0,Math.min(cluster.trends.length-1,index));
 const id=trendIdAt(index),node=byId.get(id),payload=trendPayloadAt(index);if(!node)return;
 presentation.reveal=cluster.trends.length;presentation.inTrend=true;presentation.trendIndex=index;presentation.trendComplete=false;presentation.trendAdvanceAt=Infinity;presentation.token++;selected=node;window.FSINFO_MODULES?.select?.(node);
 clearPan();camera.targetFocus={...node.p};camera.targetDist=compact.matches?35:32;PUI.copy.textContent='';PUI.cursor.style.display='none';PUI.backMacro.hidden=false;renderPresentationPanel();
 const token=presentation.token;typewrite(payload?.text||"متن مستقل این روند در کتاب در دسترس نیست. متن کلان‌روند را در بخش کتاب بخوانید.",token,finishTrendNarration)
}
function renderDots(){
 PUI.dots.innerHTML='';
 PRESENTATION.forEach((p,i)=>{const b=document.createElement('button');b.className='present-dot'+(i<presentation.step?' done':'')+(i===presentation.step?' active':'');b.title=p.id+' — '+byId.get(p.id).title;b.onclick=()=>goPresentationStep(i);PUI.dots.appendChild(b)})
}
function renderPresentationPanel(){
 if(!presentation.active)return;
 if(presentation.step===14){
  PUI.index.textContent='جمع‌بندی';PUI.source.textContent='جمع‌بندی تحریری';PUI.title.textContent='بازگشت به نمای کل';PUI.question.textContent='چه چیزی از این سفر ۱۴ مرحله‌ای باید در ذهن بماند؟';
  PUI.copy.textContent='چهارده کلان‌روند مستقل از هم نیستند؛ آن‌ها یک محیط درهم‌تنیده از تغییرات جمعیتی، فناورانه، دانشی، معنایی، اجتماعی و نهادی را می‌سازند.';
  PUI.cursor.style.display='none';PUI.trends.innerHTML='';PUI.takeaway.textContent='اکنون دوباره کل کهکشان را ببینید و به پیوند میان خوشه‌ها توجه کنید.';PUI.takeaway.classList.add('show');PUI.backMacro.hidden=true;
  PUI.sourceDetail.textContent='این جمع‌بندی، متن آموزشی تحریری برای مرور کل نقشه است و نقل مستقیم از گزارش نیست.';PUI.progress.style.width='100%';PUI.prev.disabled=false;PUI.next.textContent='از ابتدا';PUI.state.textContent=presentation.paused?'مکث':'مرور';renderDots();return
 }
 const meta=PRESENTATION[presentation.step],macro=byId.get(meta.id),cluster=clusters.find(c=>c.id===meta.id);PUI.progress.style.width=((presentation.step)/14*100)+'%';PUI.prev.disabled=!presentation.inTrend&&presentation.step===0;
 if(presentation.inTrend){
  const node=byId.get(trendIdAt(presentation.trendIndex));PUI.index.textContent=String(presentation.step+1).padStart(2,'0')+' / 14 · '+String(presentation.trendIndex+1).padStart(2,'0')+' / '+String(cluster.trends.length).padStart(2,'0');
  PUI.source.textContent=trendPayloadAt(presentation.trendIndex)?.exact?'متن کتاب':'متن مستقل در دسترس نیست';PUI.title.textContent=node?.title||cluster.trends[presentation.trendIndex];PUI.question.textContent='روند '+(presentation.trendIndex+1)+' از '+cluster.trends.length+' · '+macro.title;PUI.state.textContent=presentation.paused?'مکث':'روند';
  PUI.next.textContent=presentation.trendIndex===cluster.trends.length-1?'کلان‌روند بعدی':'روند بعدی';PUI.backMacro.hidden=false
 }else{
  PUI.index.textContent=String(presentation.step+1).padStart(2,'0')+' / 14';PUI.source.textContent=meta.source;PUI.title.textContent=macro.title;PUI.question.textContent=meta.question;PUI.state.textContent=presentation.paused?'مکث':presentation.autoplay?'خودکار':'دستی';
  PUI.next.textContent=presentation.deepTrends&&presentation.textComplete&&presentation.reveal>=cluster.trends.length?'ورود به روندها':'بعدی';PUI.backMacro.hidden=true
 }
 PUI.sourceDetail.textContent='محتوای این ارائه بر پایه بخش '+String(presentation.step+1)+' کتاب است. در عمق روند، متن مستقیماً از بلوک همان روند در کتاب استخراج می‌شود.';
 PUI.trends.innerHTML='';cluster.trends.forEach((t,i)=>{const span=document.createElement('button');span.type='button';span.onclick=()=>{const n=byId.get(trendIdAt(i));if(n)feedback(n);togglePresentationPause(true);enterTrend(i);};span.className='trend-chip'+(presentation.deepTrends||presentation.paused||i<presentation.reveal?' seen':'')+(presentation.inTrend&&i===presentation.trendIndex?' current':'');span.style.setProperty('--cluster',cluster.color);span.textContent=t;PUI.trends.appendChild(span)});
 PUI.takeaway.textContent=meta.takeaway;PUI.takeaway.classList.toggle('show',!presentation.inTrend&&presentation.reveal>=cluster.trends.length);renderDots()
}
function presentationElapsed(now=performance.now()){return now-presentation.start-presentation.pauseAccum-(presentation.paused?(now-presentation.pauseStart):0)}
function goPresentationStep(index){
 clearPan();if(index<0)index=0;if(index>14)index=14;presentation.step=index;presentation.reveal=0;presentation.textComplete=false;presentation.revealStart=Infinity;presentation.macroAdvanceAt=Infinity;presentation.inTrend=false;presentation.trendIndex=-1;presentation.trendComplete=false;presentation.trendAdvanceAt=Infinity;presentation.typingRun++;presentation.typingText='';presentation.typingDone=null;presentation.start=performance.now();presentation.pauseAccum=0;if(presentation.paused)presentation.pauseStart=presentation.start;presentation.token++;
 if(index===14){selected=null;camera.targetFocus={x:0,y:0,z:0};camera.targetDist=96;camera.targetYaw=-.08;camera.targetPitch=.13;renderPresentationPanel();return}
 const meta=PRESENTATION[index],macro=byId.get(meta.id);selected=macro;camera.targetFocus={...macro.p};camera.targetDist=presentation.reduced?44:36;camera.targetYaw=presentation.reduced?camera.yaw:(-.48+Math.sin(index*.73)*.18);camera.targetPitch=presentation.reduced?camera.pitch:(.12+Math.cos(index*.61)*.07);
 PUI.takeaway.classList.remove('show');PUI.copy.textContent='';PUI.cursor.style.display='none';PUI.backMacro.hidden=true;renderPresentationPanel();
 const token=presentation.token;setTimeout(()=>{if(token===presentation.token&&presentation.active)typewrite(meta.intro,token,finishMacroNarration)},presentation.reduced?PRESENTATION_TIMING.reducedCameraSettle:PRESENTATION_TIMING.cameraSettle)
}
function startGuidedTour(){
 if(presentation.active)return;window.FSINFO_MODULES?.closePanels?.();presentation.snapshot=savePresentationSnapshot();presentation.active=true;presentation.step=0;presentation.paused=false;presentation.autoplay=PUI.auto.checked;presentation.typewriter=PUI.type.checked;presentation.reduced=PUI.reduced.checked;presentation.deepTrends=PUI.deep.checked;cfg.rotate=false;document.getElementById('tgRotate').checked=false;document.body.classList.add('presenting');goPresentationStep(0)
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
 if(!presentation.active||presentation.step===14)return;const cluster=clusters.find(c=>c.id===PRESENTATION[presentation.step].id);
 if(presentation.inTrend){if(!presentation.paused&&presentation.autoplay&&presentation.deepTrends&&presentation.trendComplete&&now>presentation.trendAdvanceAt)presentationNext();return}
 if(!presentation.textComplete)return;
 const reveal=Math.max(0,Math.min(cluster.trends.length,Math.floor((now-presentation.revealStart)/PRESENTATION_TIMING.tagCadence)+1));
 if(reveal>presentation.reveal){presentation.reveal=reveal;renderPresentationPanel();if(reveal===cluster.trends.length)presentation.macroAdvanceAt=now+PRESENTATION_TIMING.postTagsHold}
 if(presentation.reveal===cluster.trends.length&&presentation.macroAdvanceAt===Infinity)presentation.macroAdvanceAt=now+PRESENTATION_TIMING.postTagsHold;
 if(!presentation.paused&&presentation.autoplay&&presentation.reveal===cluster.trends.length&&now>presentation.macroAdvanceAt){if(presentation.deepTrends)enterTrend(0);else advancePresentation()}
}
document.getElementById('startPresentation').onclick=startPresentation;
PUI.prev.onclick=presentationPrev;
PUI.next.onclick=presentationNext;
PUI.pause.onclick=()=>togglePresentationPause();
PUI.overview.onclick=()=>{camera.targetFocus={x:0,y:0,z:0};camera.targetDist=96;camera.targetYaw=-.08;camera.targetPitch=.13;togglePresentationPause(true)};
PUI.exit.onclick=exitPresentation;PUI.book.onclick=()=>window.FSINFO_MODULES?.openBookFor?.(window.FSINFO_APP.getContextNode());
PUI.auto.onchange=()=>{presentation.autoplay=PUI.auto.checked;renderPresentationPanel()};
PUI.type.onchange=()=>{presentation.typewriter=PUI.type.checked&&!presentation.reduced};
PUI.deep.onchange=()=>{presentation.deepTrends=PUI.deep.checked;if(!presentation.deepTrends&&presentation.inTrend)restoreMacroNarration({pause:true});else renderPresentationPanel();};
PUI.backMacro.onclick=()=>restoreMacroNarration({pause:true});
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
function presentationNext(){
 if(!presentation.active)return;if(presentation.step===14){goPresentationStep(0);return}
 const cluster=clusters.find(c=>c.id===PRESENTATION[presentation.step].id);
 if(presentation.inTrend){if(presentation.trendIndex+1<cluster.trends.length)enterTrend(presentation.trendIndex+1);else advancePresentation();return}
 if(presentation.deepTrends&&presentation.textComplete&&presentation.reveal>=cluster.trends.length){enterTrend(0);return}
 advancePresentation()
}
function presentationPrev(){
 if(!presentation.active)return;if(presentation.inTrend){if(presentation.trendIndex>0)enterTrend(presentation.trendIndex-1);else restoreMacroNarration({pause:true});return}
 goPresentationStep(Math.max(0,presentation.step-1))
}

let theater=false;
function setTheater(on){theater=on;document.body.classList.toggle('theater',on);document.getElementById('theaterBtn').textContent=on?'بازگرداندن پنل‌ها':'حالت خلوت'}
document.getElementById('theaterBtn').onclick=()=>setTheater(!theater);
document.getElementById('theaterToggle').onclick=()=>setTheater(!theater);
document.getElementById('theaterRestore').onclick=()=>setTheater(false);
const quickTheater=document.getElementById('quickTheater');if(quickTheater)quickTheater.onclick=()=>setTheater(!theater);

function setReduced(on){
 cfg.reduced=on;needsRender=true;presentation.reduced=on;document.body.classList.toggle('reduced-motion',on);
 document.getElementById('tgReduced').checked=on;PUI.reduced.checked=on;
 if(on){cfg.rotate=false;document.getElementById('tgRotate').checked=false;presentation.typewriter=false;PUI.type.checked=false}
}
document.getElementById('tgReduced').onchange=e=>setReduced(e.target.checked);
PUI.reduced.onchange=e=>setReduced(e.target.checked);
setReduced(cfg.reduced);
document.getElementById('tgRotate').checked=cfg.rotate;
window.addEventListener('fsinfo:majorpanel',e=>{if(presentation.active&&e.detail?.open&&(e.detail.panel==='book'||e.detail.panel==='decision'))togglePresentationPause(true)});

document.addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.isComposing||
    document.querySelector('dialog[open]')||e.target.closest?.('input:not([type=checkbox]),select,textarea,[contenteditable]'))return;
 const key=e.key.toLowerCase(), code=e.code;
 if(document.body.matches(".book-open,.decision-open,.tools-open")&&/^(Arrow|Key[JKL]$|Space$)/.test(code))return;
 const body=document.body;
 const run=id=>document.getElementById(id).click();
 const forward=()=>{
  if(introState.active)run('introNext');
  else if(recapPanel.classList.contains('show'))run('recapContinue');
  else presentationNext();
 };
 const back=()=>{
  if(introState.active)run('introPrev');
  else {recapPanel.classList.remove('show');presentationPrev();}
 };
 switch(code){
  case 'KeyB': run('quickBook');break;
  case 'KeyD': run('quickDecision');break;
  case 'KeyF': run('fullscreenBtn');break;
  case 'KeyP': if(presentation.active)exitPresentation();else run('quickPresent');break;
  case 'KeyM': muted=!muted;break;
  case 'KeyR': case 'Home':run('quickHome');break;
  case 'KeyJ':back();break;
  case 'KeyL':forward();break;
  case 'KeyK':if(presentation.active)togglePresentationPause();else run('quickPresent');break;
  case 'Space':if(e.target.closest?.('button,input,a,summary')||!presentation.active)return;togglePresentationPause();break;
  case 'Escape':
   if(body.classList.contains('tools-open'))run('quickSettings');
   else if(body.classList.contains('book-open'))run('bookClose');
   else if(body.classList.contains('decision-open'))run('decisionClose');
   else if(introState.active)closeIntro(false);
   else if(presentation.active)exitPresentation();
   else if(body.classList.contains('node-open'))run('dismissInfo');
   else return;
   break;
  case 'ArrowLeft':case 'ArrowRight':
   if(presentation.active||introState.active){if(code==='ArrowLeft')forward();else back();}
   else camera.targetYaw+=code==='ArrowLeft'?-.15:.15;
   break;
  case 'ArrowUp':case 'ArrowDown':
   if(body.matches('.book-open,.decision-open,.tools-open,.presenting'))return;
   camera.targetPitch=Math.max(-1.18,Math.min(1.18,camera.targetPitch+(code==='ArrowUp'?.11:-.11)));break;
  default:
   if(key==='?')run('keyHelp');
   else if(key==='+'||key==='='||key==='-')camera.targetDist=Math.max(24,Math.min(160,camera.targetDist+(key==='-'?8:-8)));
   else return;
 }
 e.preventDefault();
});

window.FSINFO_GESTURES.bindSwipe?.(recapPanel,{
 next:()=>document.getElementById('recapContinue').click(),
 prev:()=>{recapPanel.classList.remove('show');presentationPrev();}
});
window.FSINFO_GESTURES.bindSwipe?.(PUI.panel,{next:presentationNext,prev:presentationPrev});
window.FSINFO_GESTURES.bindSwipe?.(document.getElementById('introPanel'),{next:()=>document.getElementById('introNext').click(),prev:()=>document.getElementById('introPrev').click()});
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
 pan(dx,dy){panX=Math.max(-W,Math.min(W,panX+dx));panY=Math.max(-H,Math.min(H,panY+dy));needsRender=true;},
 tap(x,y){const n=pick(x,y);if(!n)return;feedback(n);if(presentation.active)presentSelection(n);else focus(n)},
 doubleTap(x,y){if(!pick(x,y))reset()}
});
document.getElementById('resetCam').onclick=()=>{if(presentation.active)exitPresentation();reset()};
document.getElementById('focusCore').onclick=()=>{if(presentation.active)togglePresentationPause(true);focus(byId.get('CORE'))};
document.getElementById('exportPng').onclick=()=>{render();const a=document.createElement('a');a.download='futurehawzah-galaxy-15.png';a.href=canvas.toDataURL('image/png');a.click()};
['Labels','Edges','Cross','Stars','Nebula','Icons','Rotate'].forEach(k=>{const el=document.getElementById('tg'+k);el.onchange=()=>{cfg[k.toLowerCase()]=el.checked;needsRender=true;}});
let last=performance.now();
function render(){
  try{
    const now=performance.now(),dt=Math.min(.04,(now-last)/1000);last=now;
    if(cfg.rotate&&!selected&&!presentation.active){camera.targetYaw+=dt*.055}
    const ease=cfg.reduced?.18:.065,zoomEase=cfg.reduced?.18:.07;
    camera.yaw=lerp(camera.yaw,camera.targetYaw,ease);camera.pitch=lerp(camera.pitch,camera.targetPitch,ease);
    camera.dist=lerp(camera.dist,camera.targetDist,zoomEase);
    camera.focus=lerp3(camera.focus,camera.targetFocus,zoomEase);
    if(!cfg.reduced){
      orbitClock+=dt;
      for(const n of nodes)if(n.origin&&n.parent!==(selected?.parent||selected?.id)){
        const parent=byId.get(n.parent).p,angle=orbitClock*(.046+Number(n.parent.slice(2))*.002);
        const c=Math.cos(angle),s=Math.sin(angle),o=n.origin;
        n.p.x=parent.x+o.x*c-o.z*s;n.p.z=parent.z+o.x*s+o.z*c;
      }
    }
    scene=window.FSINFO_VIEWPORT.getRect();
    updatePresentation(now);
    drawBackground();drawOrbits();drawEdges();drawNodes();updatePreview()
  }catch(err){
    document.getElementById('errorBox').classList.add('show');document.getElementById('errorText').textContent=err&&err.message?err.message:String(err);throw err
  }
}
function loop(){
 const unsettled=Math.abs(camera.yaw-camera.targetYaw)+Math.abs(camera.pitch-camera.targetPitch)+Math.abs(camera.dist-camera.targetDist)/30+
   Math.abs(camera.focus.x-camera.targetFocus.x)+Math.abs(camera.focus.y-camera.targetFocus.y)+Math.abs(camera.focus.z-camera.targetFocus.z);
 if(!document.hidden&&(needsRender||unsettled>.002||presentation.active||(cfg.rotate&&!selected)||pulse&&performance.now()-pulse.start<350||!cfg.reduced&&performance.now()-last>30)){
  needsRender=false;render();
 }else if(document.hidden)last=performance.now();
 requestAnimationFrame(loop);
}
const closeTools=()=>document.body.classList.remove('tools-open');
const stopPanels=()=>window.FSINFO_MODULES?.closePanels?.();
document.getElementById('quickHome').onclick=()=>{closeTools();stopPanels();document.getElementById('resetCam').click();};
document.getElementById('quickPresent').onclick=()=>{closeTools();stopPanels();document.getElementById('startPresentation').click();};
document.getElementById('quickDecision').onclick=()=>{closeTools();window.FSINFO_MODULES?.toggleDecision?.();};
document.getElementById('quickSettings').onclick=e=>{
 const open=!document.body.classList.contains('tools-open');
 if(open){stopPanels();if(presentation.active)exitPresentation();}
 document.body.classList.toggle('tools-open',open);e.currentTarget.setAttribute('aria-expanded',String(open));
};
document.getElementById('dismissInfo').onclick=()=>{document.body.classList.remove('node-open');needsRender=true;};
function presentSelection(n){
 if(!n||n.type==='core')return;
 const index=PRESENTATION.findIndex(entry=>entry.id===(n.parent||n.id));
 if(index<0)return;
 if(!presentation.active)startGuidedTour();
 recapPanel.classList.remove('show');
 togglePresentationPause(true);
 if(presentation.step!==index||n.type==='macro')goPresentationStep(index);
 if(n.type==='trend')enterTrend(Number(n.id.split('-T')[1])-1);
}
document.getElementById('infoPresent').onclick=()=>presentSelection(selected);
document.getElementById('infoDecision').onclick=()=>window.FSINFO_MODULES?.toggleDecision?.(true);
const preview=document.getElementById('cluster-preview'),previewDialog=document.getElementById('preview-dialog');
const previewImage=preview.querySelector('img'),previewLabel=preview.querySelector('span');
let previewMacro=null;
function activeMacro(){
 const n=selected;
 if(!n||n.type==='core')return null;
 return byId.get(n.parent||n.id)||null;
}
function updatePreview(){
 const n=activeMacro(),bounds=canvas.getBoundingClientRect();
 const frame=scene;
 if(!n||selected!==n||frame.w<185||frame.h<193||document.body.matches('.tools-open,.book-open,.decision-open')){
  preview.hidden=true;previewMacro=null;return;
 }
 const p=project(n.p);
 if(!p||p.x<frame.x||p.y<frame.y||p.x>frame.x+frame.w||p.y>frame.y+frame.h){preview.hidden=true;return;}
 if(previewMacro!==n){
  previewMacro=n;
  previewImage.src='v0.17/thumbs/m'+n.id.slice(2)+'.webp';
  previewLabel.textContent=n.title;
  preview.setAttribute('aria-label','نمایش تصویر '+n.title);
  preview.classList.remove('reveal');void preview.offsetWidth;preview.classList.add('reveal');
 }
 const w=Math.min(148,Math.max(85,frame.w*.34)),h=w*.66+24,rad=Math.min(50,n.r*p.scale);
 const x=Math.max(frame.x+5,Math.min(frame.x+frame.w-w-5,p.x-w-rad*.55));
 const y=Math.max(frame.y+5,Math.min(frame.y+frame.h-h-5,p.y-rad-h-12));
 preview.style.width=w+'px';
 preview.style.left=bounds.left+x+'px';preview.style.top=bounds.top+y+'px';preview.hidden=false;
}
function showMacroImage(){
 const n=activeMacro();if(!n)return;
 const img=previewDialog.querySelector('img');
 img.src='/2d/content/v1/images/m'+n.id.slice(2)+'.webp';img.alt=n.title;
 if(!previewDialog.open)previewDialog.showModal();
}
preview.onclick=showMacroImage;
document.getElementById('infoImage').onclick=showMacroImage;
document.getElementById('keyHelp').onclick=()=>document.getElementById('key-guide').showModal();
window.addEventListener('fsinfo:majorpanel',e=>{if(e.detail?.open){closeTools();if(introState.active)closeIntro(false);}needsRender=true;});
setInfo(null);loop();
})();
