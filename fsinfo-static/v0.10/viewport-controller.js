(()=>{"use strict";
let W=innerWidth,H=innerHeight,current={x:0,y:0,w:W,h:H},target={...current};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function visible(el){if(!el)return false;const cs=getComputedStyle(el);return cs.display!=="none"&&cs.visibility!=="hidden"&&Number(cs.opacity||1)>.02&&el.getBoundingClientRect().width>20&&el.getBoundingClientRect().height>20}
function targetRect(){
 W=innerWidth;H=innerHeight;let r={x:0,y:0,w:W,h:H};
 const margin=10;
 const candidates=["presentationPanel","bookDrawer","decisionPanel","introPanel","recapPanel"].map(id=>document.getElementById(id)).filter(visible);
 for(const el of candidates){
   const b=el.getBoundingClientRect();if(b.width<40||b.height<40)continue;
   const isBottom=b.top>H*.38&&b.width>W*.72;
   const isRight=b.left>W*.48&&b.height>H*.45;
   const isLeft=b.right<W*.52&&b.height>H*.45;
   if(isBottom){r.h=Math.max(170,b.top-margin-r.y)}
   else if(isRight){r.w=Math.max(220,b.left-margin-r.x)}
   else if(isLeft){const nx=b.right+margin;r.w=Math.max(220,(r.x+r.w)-nx);r.x=nx}
 }
 // reserve minimal safe margins without treating small HUDs as major panels
 r.x=clamp(r.x,0,W-160);r.y=clamp(r.y,0,H-160);r.w=clamp(r.w,160,W-r.x);r.h=clamp(r.h,160,H-r.y);
 return r;
}
function update(){
 target=targetRect();const t=.12;
 current={x:lerp(current.x,target.x,t),y:lerp(current.y,target.y,t),w:lerp(current.w,target.w,t),h:lerp(current.h,target.h,t)};
 return current;
}
function getRect(){return update()}
function reset(){W=innerWidth;H=innerHeight;current={x:0,y:0,w:W,h:H};target={...current}}
addEventListener("resize",reset);
window.FSINFO_VIEWPORT={getRect,reset};
})();