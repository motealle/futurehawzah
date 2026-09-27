(()=>{"use strict";
function bind(canvas,opt){
 const points=new Map();let drag=null,pinch=null,raf=0,vx=0,vy=0,lastTap=0;
 const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;vx=vy=0};
 function momentum(){
   vx*=.88;vy*=.88;
   if(Math.hypot(vx,vy)<.03){raf=0;vx=vy=0;return}
   opt.orbit?.(vx,vy,{inertia:true,pointerType:drag?.pointerType||"touch"});raf=requestAnimationFrame(momentum)
 }
 canvas.style.touchAction="none";
 canvas.addEventListener("pointerdown",e=>{
   if(e.pointerType!=="touch"&&e.button!==0)return;
   stop();points.set(e.pointerId,{x:e.clientX,y:e.clientY});try{canvas.setPointerCapture(e.pointerId)}catch(_){}
   opt.start?.(e);
   if(points.size===1)drag={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),sx:e.clientX,sy:e.clientY,moved:false,pointerType:e.pointerType||"mouse"};
   if(points.size===2){const a=[...points.values()];pinch={dist:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};drag=null}
 });
 canvas.addEventListener("pointermove",e=>{
   if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(points.size===2){
    const a=[...points.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch){opt.zoom?.((pinch.dist-d)*.18);pinch.dist=d}return
   }
   if(!drag||drag.id!==e.pointerId)return;
   const now=performance.now(),dt=Math.max(8,now-drag.t),dx=e.clientX-drag.x,dy=e.clientY-drag.y;
   if(Math.abs(e.clientX-drag.sx)+Math.abs(e.clientY-drag.sy)>4)drag.moved=true;
   opt.orbit?.(dx,dy,{inertia:false,pointerType:drag.pointerType});
   vx=Math.max(-7,Math.min(7,(dx/dt)*16));vy=Math.max(-5,Math.min(5,(dy/dt)*16));
   drag.x=e.clientX;drag.y=e.clientY;drag.t=now
 });
 function end(e){
   const d=drag&&drag.id===e.pointerId?{...drag}:null;points.delete(e.pointerId);pinch=null;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}
   if(d&&!d.moved){opt.tap?.(e.clientX,e.clientY);const now=performance.now();if(now-lastTap<320)opt.doubleTap?.(e.clientX,e.clientY);lastTap=now}
   else if(d&&!opt.reduced?.()){vx*=.34;vy*=.34;if(Math.hypot(vx,vy)>.07){drag={pointerType:d.pointerType};raf=requestAnimationFrame(momentum)}}
   if(!raf)drag=null
 }
 canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
 canvas.addEventListener("wheel",e=>{e.preventDefault();stop();opt.start?.(e);opt.zoom?.(e.deltaY)},{passive:false});
 return{stop}
}
window.FSINFO_GESTURES={bind};
})();