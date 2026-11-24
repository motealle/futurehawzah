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
      const response=await fetch('/3d/review/approved.json',{cache:'no-cache'});
      const items=await response.json();
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

  for(const panel of document.querySelectorAll('.info,.present,.knowledge-drawer,.decision-panel,.intro-panel,.recap-panel')){
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
      const x=Math.max(0,Math.min(innerWidth-r.width,e.clientX-drag.x));
      const y=Math.max(59,Math.min(innerHeight-95,e.clientY-drag.y));
      panel.style.setProperty('inset',y+'px auto auto '+x+'px','important');
      panel.style.setProperty('height',Math.min(r.height,innerHeight-y-8)+'px','important');
      window.FSINFO_VIEWPORT.reset();
    });
    for(const type of ['pointerup','pointercancel','lostpointercapture'])bar.addEventListener(type,()=>drag=null);
    desktop.addEventListener('change',()=>{panel.style.removeProperty('inset');panel.style.removeProperty('height');});
  }
})();
