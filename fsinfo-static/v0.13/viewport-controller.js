(()=>{"use strict";
let current={x:0,y:0,w:innerWidth,h:innerHeight};
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function shown(el){if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=="none"&&cs.visibility!=="hidden"&&r.width>20&&r.height>20}
function target(){
 const W=innerWidth,H=window.visualViewport?.height||innerHeight,r={x:0,y:0,w:W,h:H},margin=10;
 const els=["presentationPanel","bookDrawer","decisionPanel","introPanel","recapPanel"].map(id=>document.getElementById(id)).filter(shown);
 for(const el of els){
   const b=el.getBoundingClientRect(),bottomSheet=b.width>W*.72&&b.top>H*.34,rightSide=b.left>W*.5&&b.height>H*.42,leftSide=b.right<W*.5&&b.height>H*.42;
   if(bottomSheet)r.h=Math.max(170,b.top-margin);
   else if(rightSide)r.w=Math.max(220,b.left-margin);
   else if(leftSide){r.x=b.right+margin;r.w=Math.max(220,W-r.x)}
 }
 r.x=clamp(r.x,0,W-160);r.y=0;r.w=clamp(r.w,160,W-r.x);r.h=clamp(r.h,160,H);return r
}
function getRect(){const t=target(),e=.16;current={x:lerp(current.x,t.x,e),y:0,w:lerp(current.w,t.w,e),h:lerp(current.h,t.h,e)};return current}
function reset(){current={x:0,y:0,w:innerWidth,h:window.visualViewport?.height||innerHeight}}
addEventListener("resize",reset);addEventListener("orientationchange",reset);document.addEventListener("fullscreenchange",reset);document.addEventListener("webkitfullscreenchange",reset);window.visualViewport?.addEventListener("resize",reset);
window.FSINFO_VIEWPORT={getRect,reset};
})();