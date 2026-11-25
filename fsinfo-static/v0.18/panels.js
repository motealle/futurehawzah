(() => {
  const desktop=matchMedia('(min-width:761px)');
  const cards=document.getElementById('reviewCards');
  const status=document.getElementById('reviewStatus');
  const note=document.getElementById('decisionNote');
  const share=document.getElementById('reviewShare');
  const create=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;};
  let likes={};
  try{likes=JSON.parse(localStorage.getItem('futurehawzah-review-likes')||'{}')||{};}catch{}
  async function loadCards(){
    try{
      const [response,live]=await Promise.all([
        fetch('/3d/review/approved.json',{cache:'no-cache'}).then(r=>r.json()).catch(()=>[]),
        fetch('/3d/review/account.php?view=approved',{cache:'no-cache'}).then(r=>r.json()).catch(()=>({}))
      ]);
      const items=[...(Array.isArray(live.items)?live.items:[]),...(Array.isArray(response)?response:[])];
      cards.replaceChildren();
      if(!Array.isArray(items))throw Error();
      for(const item of items.slice(0,100)){
        if(!item||!/^[a-z0-9-]{1,50}$/.test(item.id)||typeof item.text!=='string'||item.text.length>2000)continue;
        const card=create('article');card.className='review-card';
        const title=create('strong',typeof item.title==='string'?item.title.slice(0,100):'نظر تأییدشده');
        const body=create('p',item.text);
        const like=create('button');like.type='button';
        const update=()=>{like.textContent=likes[item.id]?'♥ پسندیده‌ام':'♡ پسندیدن';like.setAttribute('aria-pressed',String(Boolean(likes[item.id])));};
        like.onclick=()=>{likes[item.id]=!likes[item.id];try{localStorage.setItem('futurehawzah-review-likes',JSON.stringify(likes));}catch{}update();};
        update();card.append(title,body,like);cards.append(card);
      }
      if(!cards.children.length)cards.append(create('p','هنوز نظری برای نمایش تأیید نشده است.'));
    }catch{cards.append(create('p','فهرست نظرها در دسترس نیست.'));}
  }
  const file=()=>{
    const text=note.value.trim();
    if(!text||text.length>2000){status.textContent='یادداشت را بنویسید. حداکثر ۲۰۰۰ نویسه.';return null;}
    return new File([JSON.stringify({topic:document.getElementById('decisionSelected').textContent,text},null,2)],'futurehawzah-review.json',{type:'application/json'});
  };
  document.getElementById('reviewExport').onclick=()=>{
    const output=file();if(!output)return;
    const href=URL.createObjectURL(output),a=create('a');a.download=output.name;a.href=href;a.click();
    setTimeout(()=>URL.revokeObjectURL(href),1000);
    status.textContent='فایل آماده شد. آن را از مسیر ارتباطی تیم برای بازبینی بفرستید.';
  };
  share.hidden=!navigator.canShare?.({files:[new File(['{}'],'review.json',{type:'application/json'})]});
  share.onclick=async()=>{const output=file();if(output)try{await navigator.share({files:[output]});}catch{}};
  loadCards();
  window.addEventListener('fsinfo:reviews-change',loadCards);

  const selectors='.info,.present,.knowledge-drawer,.decision-panel,.intro-panel,.recap-panel';
  const panels=[...document.querySelectorAll(selectors)];
  const sizes={};
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function fit(panel,w,h){
    const width=clamp(w,235,Math.min(1500,innerWidth-18)),height=clamp(h,148,Math.min(1400,innerHeight-76));
    panel.style.setProperty('width',width+'px','important');
    panel.style.setProperty('height',height+'px','important');
  }
  function position(panel,left,top){
    panel.style.setProperty('inset',top+'px auto auto '+left+'px','important');
  }
  function resetDesktop(){
    for(const panel of panels){
      for(const prop of ['width','height','inset'])panel.style.removeProperty(prop);
      if(desktop.matches&&sizes[panel.id])fit(panel,...sizes[panel.id]);
    }
    window.FSINFO_VIEWPORT.reset();
  }
  window.FSINFO_PANEL_SIZES={
    get:()=>({...sizes}),
    set(prefs){for(const panel of panels){const size=prefs?.[panel.id];if(Array.isArray(size)&&size.length===2&&size.every(Number.isInteger)&&!sizes[panel.id])sizes[panel.id]=size;}resetDesktop();}
  };
  for(const panel of panels){
    const bar=panel.querySelector('.head');if(!bar)continue;
    let drag=null;
    bar.addEventListener('pointerdown',e=>{
      if(!desktop.matches||e.button!==0||e.target.closest('button,input,label,a'))return;
      const r=panel.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top,id:e.pointerId};
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove',e=>{
      if(drag?.id!==e.pointerId)return;
      const r=panel.getBoundingClientRect();
      position(panel,clamp(e.clientX-drag.x,0,innerWidth-r.width),clamp(e.clientY-drag.y,59,innerHeight-r.height-8));
      window.FSINFO_VIEWPORT.reset();
    });
    for(const type of ['pointerup','pointercancel','lostpointercapture'])bar.addEventListener(type,()=>drag=null);
    for(const side of ['n','s','e','w','se']){
      const handle=create('span');handle.className='resize-edge';handle.dataset.edge=side;handle.setAttribute('aria-hidden','true');panel.append(handle);
      let active=null;
      handle.addEventListener('pointerdown',e=>{
        if(!desktop.matches||e.button!==0)return;
        e.preventDefault();e.stopPropagation();
        const rect=panel.getBoundingClientRect();
        active={id:e.pointerId,x:e.clientX,y:e.clientY,rect,changed:false};
        handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener('pointermove',e=>{
        if(active?.id!==e.pointerId)return;
        const {rect,x,y}=active,dx=e.clientX-x,dy=e.clientY-y;
        let left=rect.left,top=rect.top,right=rect.right,bottom=rect.bottom;
        if(side.includes('w'))left=clamp(left+dx,Math.max(0,right-1500),right-235);
        if(side.includes('e'))right=clamp(right+dx,left+235,Math.min(innerWidth-4,left+1500));
        if(side.includes('n'))top=clamp(top+dy,Math.max(59,bottom-1400),bottom-148);
        if(side.includes('s'))bottom=clamp(bottom+dy,top+148,Math.min(innerHeight-5,top+1400));
        if(right-left===rect.width&&bottom-top===rect.height)return;
        active.changed=true;
        const w=Math.round(right-left),h=Math.round(bottom-top);
        position(panel,left,top);fit(panel,w,h);
        sizes[panel.id]=[w,h];window.FSINFO_VIEWPORT.reset();
      });
      for(const type of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(type,()=>{
        if(active?.changed)window.dispatchEvent(new Event('fsinfo:defaults-change'));
        active=null;
      });
    }
  }
  desktop.addEventListener('change',resetDesktop);
  window.addEventListener('resize',()=>{
    for(const panel of panels){
      if(!desktop.matches||!panel.getClientRects().length)continue;
      const r=panel.getBoundingClientRect();
      if(r.width>innerWidth-8||r.height>innerHeight-65){fit(panel,r.width,r.height);}
      const next=panel.getBoundingClientRect();
      if(next.right>innerWidth||next.bottom>innerHeight)position(panel,Math.max(0,innerWidth-next.width-4),Math.max(59,innerHeight-next.height-5));
    }
    window.FSINFO_VIEWPORT.reset();
  });
})();
