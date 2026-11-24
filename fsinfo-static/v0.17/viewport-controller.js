(() => {
 const root=document.documentElement, phone=matchMedia('(max-width: 760px)');
 const canvas=document.getElementById('galaxy'), body=document.body;
 const panels=[...document.querySelectorAll('.info,.knowledge-drawer,.decision-panel,.present,.intro-panel,.recap-panel,.hud')];
 let pending=0, obstruction=null, signature='';
 function place(){
  pending=0;
  const active=panels.find(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  obstruction=active?.getBoundingClientRect()||null;
  root.style.setProperty('--scene-bottom',phone.matches&&obstruction?Math.max(0,innerHeight-obstruction.top)+'px':'0px');
  root.style.setProperty('--scene-left','0px');
  root.style.setProperty('--scene-right','0px');
  const next=[innerWidth,innerHeight,obstruction?.left,obstruction?.top,obstruction?.right,obstruction?.bottom].join('|');
  if(signature!==next){signature=next;window.dispatchEvent(new Event('fsinfo:layout'));}
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(place);}
 new MutationObserver(schedule).observe(body,{attributes:true,attributeFilter:['class']});
 const sizes=new ResizeObserver(schedule);
 for(const panel of panels){sizes.observe(panel);new MutationObserver(schedule).observe(panel,{attributes:true,attributeFilter:['class','style']});}
 window.addEventListener('resize',schedule);
 window.visualViewport?.addEventListener('resize',schedule);
 function getRect(){
  const full={x:0,y:0,w:canvas.clientWidth,h:canvas.clientHeight};
  if(phone.matches||!obstruction)return full;
  const c=canvas.getBoundingClientRect();
  const left=Math.max(0,obstruction.left-c.left-12),right=Math.max(0,c.right-obstruction.right-12);
  const top=Math.max(0,obstruction.top-c.top-12),bottom=Math.max(0,c.bottom-obstruction.bottom-12);
  const candidates=[
   {x:0,y:0,w:left,h:full.h},{x:full.w-right,y:0,w:right,h:full.h},
   {x:0,y:0,w:full.w,h:top},{x:0,y:full.h-bottom,w:full.w,h:bottom}
  ].filter(rect=>rect.w>=230&&rect.h>=190);
  return candidates.sort((a,b)=>b.w*b.h-a.w*a.h)[0]||full;
 }
 window.FSINFO_VIEWPORT={reset:schedule,getRect};
 schedule();
})();
