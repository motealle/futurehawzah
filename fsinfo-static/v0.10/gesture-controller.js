(()=>{"use strict";
function bind(canvas,opt){
 const points=new Map();let drag=null,lastTap=0,raf=0,vx=0,vy=0,pinch=null;
 const stopInertia=()=>{if(raf)cancelAnimationFrame(raf);raf=0;vx=vy=0};
 function inertia(){
   vx*=.90;vy*=.90;
   const mag=Math.hypot(vx,vy);
   if(mag<.035){raf=0;vx=vy=0;return}
   opt.orbit(vx,vy,true);raf=requestAnimationFrame(inertia)
 }
 canvas.style.touchAction="none";
 canvas.addEventListener("pointerdown",e=>{
   if(e.button!=null&&e.button!==0&&e.pointerType!=="touch")return;
   stopInertia();points.set(e.pointerId,{x:e.clientX,y:e.clientY});
   try{canvas.setPointerCapture(e.pointerId)}catch(_){}
   opt.start?.();
   if(points.size===1)drag={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),sx:e.clientX,sy:e.clientY,moved:false};
   if(points.size===2){const a=[...points.values()];pinch={dist:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};drag=null}
 });
 canvas.addEventListener("pointermove",e=>{
   if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(points.size===2){
     const a=[...points.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
     if(pinch){opt.zoom?.((pinch.dist-d)*.18);pinch.dist=d}return
   }
   if(!drag||drag.id!==e.pointerId)return;
   const now=performance.now(),dt=Math.max(8,now-drag.t),dx=e.clientX-drag.x,dy=e.clientY-drag.y;
   if(Math.abs(e.clientX-drag.sx)+Math.abs(e.clientY-drag.sy)>4)drag.moved=true;
   opt.orbit(dx,dy,false);
   vx=Math.max(-8,Math.min(8,(dx/dt)*16));vy=Math.max(-6,Math.min(6,(dy/dt)*16));
   drag.x=e.clientX;drag.y=e.clientY;drag.t=now
 });
 function end(e){
   const was=drag&&drag.id===e.pointerId?{...drag}:null;points.delete(e.pointerId);pinch=null;
   try{canvas.releasePointerCapture(e.pointerId)}catch(_){}
   if(was&&!was.moved){opt.tap?.(e.clientX,e.clientY);const now=performance.now();if(now-lastTap<320)opt.doubleTap?.(e.clientX,e.clientY);lastTap=now}
   else if(was&&!opt.reduced?.()){vx*=.42;vy*=.42;if(Math.hypot(vx,vy)>.08)raf=requestAnimationFrame(inertia)}
   drag=null
 }
 canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
 canvas.addEventListener("wheel",e=>{e.preventDefault();stopInertia();opt.start?.();opt.zoom?.(e.deltaY)},{passive:false});
 return {stop:stopInertia}
}
function bindSwipe(el,{next,prev}){
 let s=null;
 el.addEventListener("touchstart",e=>{if(e.touches.length!==1)return;if(e.target.closest("button,input,select,textarea,summary,a"))return;const t=e.touches[0];s={x:t.clientX,y:t.clientY}},{passive:true});
 el.addEventListener("touchend",e=>{if(!s||!e.changedTouches.length)return;const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;s=null;if(Math.abs(dx)<58||Math.abs(dx)<Math.abs(dy)*1.35)return;dx<0?next?.():prev?.()},{passive:true});
}
window.FSINFO_GESTURES={bind,bindSwipe};
})();