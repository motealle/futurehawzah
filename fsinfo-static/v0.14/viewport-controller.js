(()=>{"use strict";
let current={x:0,y:0,w:innerWidth,h:window.visualViewport?.height||innerHeight};
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function shown(el){if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=="none"&&cs.visibility!=="hidden"&&Number(cs.opacity)!==0&&r.width>20&&r.height>20}
function activeMajorPanels(){
 const out=["bookDrawer","decisionPanel","presentationPanel"].map(id=>document.getElementById(id)).filter(shown);
 if(innerWidth<=900&&!out.length){const info=document.querySelector(".info");if(shown(info))out.push(info)}
 return out
}
function target(){
 const W=innerWidth,H=window.visualViewport?.height||innerHeight,margin=12,r={x:0,y:0,w:W,h:H},els=activeMajorPanels();
 if(W<=900){
  const el=els[0];if(el){const b=el.getBoundingClientRect();r.h=Math.max(150,Math.min(H,b.top-margin))}
 }else{
  for(const el of els){
   const b=el.getBoundingClientRect(),bottomSheet=b.width>W*.62&&b.top>H*.35,rightSide=b.left>W*.43&&b.width>W*.18,leftSide=b.right<W*.57&&b.width>W*.18;
   if(bottomSheet)r.h=Math.min(r.h,Math.max(180,b.top-margin));
   else if(rightSide)r.w=Math.min(r.w,Math.max(260,b.left-margin-r.x));
   else if(leftSide){const nx=Math.max(r.x,b.right+margin);r.w=Math.max(260,W-nx);r.x=nx}
  }
 }
 r.x=clamp(r.x,0,Math.max(0,W-160));r.w=clamp(r.w,160,Math.max(160,W-r.x));r.h=clamp(r.h,150,H);return r
}
function getRect(){const t=target(),e=.18;current={x:lerp(current.x,t.x,e),y:0,w:lerp(current.w,t.w,e),h:lerp(current.h,t.h,e)};return current}
function reset(){current={x:0,y:0,w:innerWidth,h:window.visualViewport?.height||innerHeight}}
addEventListener("resize",reset);addEventListener("orientationchange",reset);document.addEventListener("fullscreenchange",reset);document.addEventListener("webkitfullscreenchange",reset);window.visualViewport?.addEventListener("resize",reset);
window.FSINFO_VIEWPORT={getRect,reset,target};
})();