(()=>{"use strict";
let W=innerWidth,H=innerHeight,current={x:0,y:0,w:W,h:H},target={...current};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function visible(el){if(!el)return false;const cs=getComputedStyle(el);return cs.display!=="none"&&cs.visibility!=="hidden"&&Number(cs.opacity||1)>.02&&el.getBoundingClientRect().width>20&&el.getBoundingClientRect().height>20}
function compute(w,h,rects){
 let r={x:0,y:0,w,h},margin=w<700?8:12;
 const mobileish=w<700||(w<=1180&&h>w);
 for(const b of rects){
  if(!b||b.width<30||b.height<30)continue;
  const bottom=(mobileish&&b.top>h*.28)||(b.top>h*.42&&b.width>w*.72);
  const right=!bottom&&b.left>w*.48&&b.height>h*.38;
  const left=!bottom&&b.right<w*.52&&b.height>h*.38;
  if(bottom)r.h=Math.max(170,b.top-margin-r.y);
  else if(right)r.w=Math.max(220,b.left-margin-r.x);
  else if(left){const nx=b.right+margin;r.w=Math.max(220,(r.x+r.w)-nx);r.x=nx}
 }
 r.x=clamp(r.x,0,w-160);r.y=clamp(r.y,0,h-160);r.w=clamp(r.w,160,w-r.x);r.h=clamp(r.h,160,h-r.y);
 return r;
}
function measure(){
 W=innerWidth;H=innerHeight;
 const ids=["presentationPanel","bookDrawer","decisionPanel","introPanel","recapPanel","objectInfoPanel"];
 const rects=ids.map(id=>document.getElementById(id)).filter(visible).map(el=>el.getBoundingClientRect());
 return compute(W,H,rects);
}
function tick(){target=measure();const t=.14;current={x:lerp(current.x,target.x,t),y:lerp(current.y,target.y,t),w:lerp(current.w,target.w,t),h:lerp(current.h,target.h,t)};return current}
function getRect(){return current}
function reset(){W=innerWidth;H=innerHeight;current={x:0,y:0,w:W,h:H};target={...current}}
addEventListener("resize",reset);if(window.visualViewport)visualViewport.addEventListener("resize",reset);
window.FSINFO_VIEWPORT={getRect,tick,reset,compute};
})();