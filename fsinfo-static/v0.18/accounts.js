(() => {
  const $ = id => document.getElementById(id);
  const endpoint = '/3d/review/account.php';
  const dialog = $('accountDialog'), form = $('accountForm');
  const status = $('reviewStatus'), defaultsStatus = $('defaultsStatus');
  const submit = $('accountSubmit'), password = $('accountPassword');
  const name = $('accountName'), activation = $('activationCode');
  let role = null, activated = true, token = '', mode = 'login';
  let sequence = 0, previousKey = 0, toastTime, pendingSave, revision = 0;
  let saving = Promise.resolve();

  async function call(view = '', action = '', data = {}) {
    const options = action ? {
      method:'POST', headers:{'Content-Type':'application/json','X-Atlas-Token':token},
      body:JSON.stringify({action,...data})
    } : {};
    const response = await fetch(endpoint+(view?'?view='+view:''),{...options,cache:'no-store'});
    const item = await response.json().catch(()=>({}));
    if(!response.ok || !item || typeof item !== 'object')throw Error(item?.error||'ارتباط با سرویس برقرار نشد.');
    return item;
  }
  function toast(text){
    const item = $('atlasToast');
    clearTimeout(toastTime);
    item.textContent=text;item.hidden=false;
    toastTime=setTimeout(()=>{item.hidden=true;},3400);
  }
  function readSession(item){
    role=item.role||null;token=item.csrf||'';
    if(typeof item.activated==='boolean')activated=item.activated;
    $('adminDefaults').hidden=role!=='admin';
    $('sendReview').hidden=!role;
    $('reviewLogin').textContent=role?'خروج از حساب':'ورود یا ساخت حساب';
    $('reviewPending').hidden=role!=='admin';
    if(role==='admin')loadPending();
  }
  let sessionRequest=null;
  function session(){
    if(!sessionRequest)sessionRequest=call().then(readSession).finally(()=>sessionRequest=null);
    return sessionRequest;
  }
  function configure(next){
    mode=next;
    const admin=['admin','activate'].includes(mode), setup=mode==='activate', signup=mode==='signup';
    $('accountTitle').textContent=setup?'فعال‌سازی حساب مدیر':admin?'ورود مدیر اطلس':signup?'ساخت حساب':'ورود به حساب';
    $('accountNameRow').hidden=admin;name.required=!admin;
    $('activationRow').hidden=!setup;activation.required=setup;
    password.minLength=admin?12:8;
    password.autocomplete=signup||setup?'new-password':'current-password';
    $('accountSwitch').hidden=admin&&activated;
    $('accountSwitch').textContent=setup?'ورود مدیر':admin?'فعال‌سازی حساب مدیر':signup?'حساب دارم':'ساخت حساب';
    submit.textContent=setup?'فعال‌سازی':signup?'ساخت حساب':'ورود';
    $('accountStatus').textContent='';
  }
  async function open(next){
    if(dialog.open)return;
    form.reset();configure(next);
    dialog.showModal();
    submit.disabled=true;
    try{
      await session();
      if(!dialog.open)return;
      if(next==='admin'&&role==='admin'){dialog.close();toast('خوش آمدید!');if(!document.body.classList.contains('tools-open'))$('quickSettings').click();return;}
      configure(next);
    }catch(e){$('accountStatus').textContent=e.message;}
    finally{submit.disabled=false;}
  }
  $('accountClose').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>form.reset());
  $('accountSwitch').onclick=()=>configure({admin:'activate',activate:'admin',login:'signup',signup:'login'}[mode]);
  form.onsubmit=async e=>{
    e.preventDefault();submit.disabled=true;
    try{
      if(!token)await session();
      const result=await call('',mode,{name:name.value,password:password.value,code:activation.value.trim()});
      if(mode==='activate')activated=true;
      readSession(result);
      dialog.close();
      if(role==='admin'){
        if(!document.body.classList.contains('tools-open'))$('quickSettings').click();
        toast('خوش آمدید!');
      }else{
        status.textContent='وارد شدید. حالا می‌توانید نکته را ارسال کنید.';
        $('decisionNote').focus();
      }
    }catch(e){$('accountStatus').textContent=e.message;}
    finally{submit.disabled=false;}
  };
  $('reviewLogin').onclick=async()=>{
    if(!role){open('login');return;}
    try{clearTimeout(pendingSave);await saving;await call('','logout');await session();status.textContent='از حساب خارج شدید.';}
    catch(e){status.textContent=e.message;}
  };
  $('sendReview').onclick=async e=>{
    const btn=e.currentTarget,text=$('decisionNote').value.trim();
    if(!text){status.textContent='ابتدا نکتهٔ خود را بنویسید.';return;}
    btn.disabled=true;
    try{
      await call('','submit',{text,topic:$('decisionSelected').textContent});
      status.textContent='نکتهٔ شما برای بازبینی ثبت شد.';
      if(role==='admin')loadPending();
    }catch(e){status.textContent=e.message;}
    finally{btn.disabled=false;}
  };
  async function loadPending(){
    const area=$('reviewPending');
    try{
      const {items}=await call('pending');
      if(role!=='admin')return;
      area.replaceChildren();
      const head=document.createElement('h3');head.textContent='در انتظار بازبینی';area.append(head);
      for(const item of items){
        const card=document.createElement('article'), title=document.createElement('strong'),note=document.createElement('p');
        card.className='review-card';title.textContent=item.topic;note.textContent=item.text;card.append(title,note);
        for(const approve of [true,false]){
          const btn=document.createElement('button');btn.type='button';btn.textContent=approve?'تأیید و انتشار':'رد';
          btn.onclick=async()=>{
            const controls=card.querySelectorAll('button');controls.forEach(b=>b.disabled=true);
            try{await call('','moderate',{id:item.id,approve});card.remove();window.dispatchEvent(new Event('fsinfo:reviews-change'));}
            catch(e){toast(e.message);controls.forEach(b=>b.disabled=false);}
          };
          card.append(btn);
        }
        area.append(card);
      }
      if(!items.length){const p=document.createElement('p');p.textContent='نکته‌ای در صف بازبینی نیست.';area.append(p);}
    }catch(e){if(role==='admin')area.textContent=e.message;}
  }
  function saveDefaults(includeNotice=false){
    clearTimeout(pendingSave);
    if(role!=='admin')return;
    const prefs={...window.FSINFO_APPEARANCE.get(),sizes:window.FSINFO_PANEL_SIZES.get()};
    saving=saving.then(async()=>{
      if(role!=='admin')return;
      defaultsStatus.textContent='در حال ذخیره…';
      try{await call('','defaults',{defaults:prefs});defaultsStatus.textContent='پیش‌فرض سایت ذخیره شد.';if(includeNotice)toast('پیش‌فرض سایت ذخیره شد.');}
      catch(e){defaultsStatus.textContent=e.message;toast(e.message);}
    });
  }
  $('saveDefaults').onclick=()=>saveDefaults(true);
  window.addEventListener('fsinfo:defaults-change',()=>{
    revision++;
    if(role!=='admin')return;
    clearTimeout(pendingSave);
    pendingSave=setTimeout(saveDefaults,550);
  });
  document.addEventListener('keydown',e=>{
    if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable]')||document.querySelector('dialog[open]'))return;
    if(e.code!=='Digit5'&&e.code!=='Numpad5'){sequence=0;return;}
    const now=performance.now();sequence=(now-previousKey<1200?sequence:0)+1;previousKey=now;
    if(sequence!==5)return;
    sequence=0;
    if(role==='admin'){
      if(!document.body.classList.contains('tools-open'))$('quickSettings').click();
      toast('خوش آمدید!');
    }else open('admin');
  });
  call('defaults').then(({defaults})=>{
    if(!defaults||revision)return;
    window.FSINFO_APPEARANCE.set(defaults);window.FSINFO_PANEL_SIZES.set(defaults.sizes);
  }).catch(()=>{});
  session().catch(()=>{});
})();
