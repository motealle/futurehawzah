(() => {
  const root=document.documentElement;
  const phone=matchMedia('(max-width: 760px)');
  const canvas=document.getElementById('galaxy');
  const body=document.body;
  const panels=Array.from(document.querySelectorAll('.info,.knowledge-drawer,.decision-panel,.present,.intro-panel,.recap-panel,.hud'));
  let pending=0;
  function place(){
    pending=0;
    const active=panels.find(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
    const bounds=active?.getBoundingClientRect();
    root.style.setProperty('--scene-bottom',phone.matches&&bounds?Math.max(0,innerHeight-bounds.top)+'px':'0px');
    const leaveRight=!phone.matches&&bounds&&innerWidth-bounds.right>=bounds.left;
    root.style.setProperty('--scene-left',leaveRight?Math.ceil(bounds.right)+'px':'0px');
    root.style.setProperty('--scene-right',!phone.matches&&bounds&&!leaveRight?Math.ceil(innerWidth-bounds.left)+'px':'0px');
  }
  function schedule(){if(!pending)pending=requestAnimationFrame(place);}
  new MutationObserver(schedule).observe(body,{attributes:true,attributeFilter:['class']});
  const sizes=new ResizeObserver(schedule);
  for(const item of panels){sizes.observe(item);new MutationObserver(schedule).observe(item,{attributes:true,attributeFilter:["class","style"]});}
  window.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('resize',schedule);
  window.FSINFO_VIEWPORT={reset:schedule,getRect:()=>({x:0,y:0,w:canvas.clientWidth,h:canvas.clientHeight})};
  schedule();
})();
