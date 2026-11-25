const $ = id => document.getElementById(id);
const root = new URL('/2d/content/v1/', location.origin);
const version = new URL('.', import.meta.url);
const standard = {typing:true, images:true, relations:false, motion:true, theme:'night'};
const colors = ['#66dcc3','#7cbfff','#beabff','#71c6d9','#9ecd92','#edb48e','#70d7df'];
const storageKey = 'futurehawzah.atlas.preview.v1';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fa = new Intl.NumberFormat('fa-IR');
const story = $('story'), search = $('search'), admin = $('admin'), form = $('preferences');
const viewport = $('viewport'), scaler = $('scaler'), canvas = $('canvas');
const width = 2800, height = 1880;
let data, groups, ids, current, tour = false, generation = 0, animation = 0;
let published = standard, preferences = standard, approved = {}, documents = {};
let focused = null, overviewZoom = 1;
const mobileMedia = matchMedia('(max-width: 760px)');
function focusBranch(id) {
  if(id && !focused) overviewZoom=zoom;
  if(!id) {cancelAnimationFrame(cameraFrame);zoom=overviewZoom;resize();}
  focused = id;
  document.body.classList.toggle('branch-focus', Boolean(id));
  $('focus-bar').hidden = !id;
  $('focus-name').textContent = id ? data.nodes[id].title : '';
  for (const tile of document.querySelectorAll('.branch')) tile.classList.toggle('active', tile.dataset.node === id);
  for (const el of canvas.querySelectorAll('.map-node')) {
    el.classList.toggle('in-branch', Boolean(id && (el.dataset.node === id || group(el.dataset.node) === id)));
  }
  document.querySelector('.branch-frame')?.remove();
  if (id && !mobileMedia.matches) {
    const nodes = [id,...children(id)].map(key=>data.nodes[key]);
    const x1=Math.min(...nodes.map(n=>n.x-n.w/2))-17, x2=Math.max(...nodes.map(n=>n.x+n.w/2))+17;
    const y1=Math.min(...nodes.map(n=>n.y-n.h/2))-87, y2=Math.max(...nodes.map(n=>n.y+n.h/2))-53;
    canvas.querySelector('svg').prepend(svg('rect',{x:x1,y:y1,width:x2-x1,height:y2-y1,rx:22,class:'branch-frame'}));
    zoom=1;
    resize();
    const fit = Math.min(viewport.clientWidth/(x2-x1),viewport.clientHeight/(y2-y1));
    moveCamera(Math.min(2.35, fit*.85/scale),(x1+x2)/2,(y1+y2)/2);
  }
}
$('focus-info').onclick=()=>focused&&openStory(focused,{trigger:$('focus-info')});
$('focus-back').onclick=()=>{
  const old=focused;
  if(!story.hidden) closeStory();
  focusBranch(null);
  requestAnimationFrame(()=>{
    const el=mobileMedia.matches ? document.querySelector('.branch[data-node="'+old+'"] .read-branch') : canvas.querySelector('[data-node="'+old+'"]');
    el?.focus({preventScroll:true});
    if(mobileMedia.matches)el?.scrollIntoView({block:'nearest'});
  });
};
mobileMedia.addEventListener('change',()=>{if(focused)focusBranch(focused);});
let coreHits = 0, lastHit = 0, zoom = 1, scale = 1, trigger = null;
const textCache = new Map();

function element(tag, name, value) {
  const node = document.createElement(tag);
  if (name) node.className = name;
  if (value != null) node.textContent = value;
  if (tag === 'button') node.type = 'button';
  return node;
}
function svg(tag, attributes) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}
async function json(url, fallback, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw Error(response.status);
    return await response.json();
  } catch (error) {
    if (fallback === undefined) throw error;
    return fallback;
  }
}
function cleanPrefs(input) {
  return {
    typing:typeof input?.typing === 'boolean' ? input.typing : published.typing,
    images:typeof input?.images === 'boolean' ? input.images : published.images,
    relations:typeof input?.relations === 'boolean' ? input.relations : published.relations,
    motion:typeof input?.motion === 'boolean' ? input.motion : published.motion,
    theme:['night','light'].includes(input?.theme) ? input.theme : published.theme
  };
}
function storePreview(value) {
  try {
    if (value) localStorage.setItem(storageKey, JSON.stringify(value));
    else localStorage.removeItem(storageKey);
    return true;
  } catch { return false; }
}
function applyPrefs(value) {
  preferences = cleanPrefs(value);
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.motion = preferences.motion ? 'on' : 'off';
  for (const line of canvas.querySelectorAll('.relation')) line.style.display = preferences.relations ? '' : 'none';
}
function accent(id) {
  return colors[((data.nodes[id].g || 0) + colors.length) % colors.length];
}
function group(id) { return data.parent[id] === 'core' ? id : data.parent[id]; }
function children(id) { return ids.filter(k => data.parent[k] === id); }
function hitCore() {
  const now = performance.now();
  coreHits = now - lastHit > 2600 ? 1 : coreHits + 1;
  lastHit = now;
  if (coreHits !== 20) return;
  coreHits = 0;
  fillForm(preferences);
  $('admin-status').textContent = '';
  admin.showModal();
}
function button(label, action, css = '') {
  const node = element('button', css, label);
  node.addEventListener('click', action);
  return node;
}
function drawMap() {
  const layer = svg('svg',{class:'edges',width,height,viewBox:`0 0 ${width} ${height}`,'aria-hidden':'true'});
  const {nodes, links, relations} = data;
  const defs=svg('defs',{});
  const mask=svg('mask',{id:'edges-outside-nodes',maskUnits:'userSpaceOnUse',x:0,y:0,width,height});
  mask.append(svg('rect',{x:0,y:0,width,height,fill:'white'}));
  for(const id of ['core',...groups]){
    const n=nodes[id], x=n.x, y=n.y-70;
    mask.append(id==='core'
      ? svg('ellipse',{cx:x,cy:y,rx:n.w/2-1,ry:n.h/2-1,fill:'black'})
      : svg('rect',{x:x-n.w/2+1,y:y-n.h/2+1,width:n.w-2,height:n.h-2,rx:29,fill:'black'}));
  }
  defs.append(mask);layer.append(defs);
  const lines=svg('g',{mask:'url(#edges-outside-nodes)'});
  layer.append(lines);
  const curve = (a,b,relation=false) => {
    const left = nodes[a], right = nodes[b];
    if (!left || !right) return;
    const x = left.x, y = left.y - 70, xx = right.x, yy = right.y - 70;
    const dx = (xx - x) * .55;
    const line = svg('path',{class:'edge'+(relation?' relation':''),d:`M ${x} ${y} C ${x+dx} ${y}, ${xx-dx} ${yy}, ${xx} ${yy}`});
    if (!relation) line.style.setProperty('--edge',accent(b));
    lines.append(line);
  };
  links.forEach(([a,b])=>curve(a,b));
  relations.forEach(([a,b])=>curve('t'+a,'t'+b,true));
  for (const r of [189,219,256,301]) lines.append(svg('circle',{class:'rings',cx:nodes.core.x,cy:nodes.core.y-70,r}));
  canvas.append(layer);
  document.fonts.ready.then(()=>{
    const measure = document.createElement('canvas').getContext('2d');
    if (!measure) return;
    measure.font = '26px Sahel';
    for (const el of canvas.querySelectorAll('.trend')) {
      const label = data.nodes[el.dataset.node];
      const size = (label.w-15)*26/Math.max(measure.measureText(label.title).width,1);
      el.style.fontSize = Math.max(17,Math.min(26,size))+'px';
    }
  });
  const mobile = $('mobile');
  const core = button('آیندهٔ حوزه‌های علمیه',hitCore,'mobile-core');
  mobile.append(core);
  for (const [id,n] of Object.entries(nodes)) {
    const kind = id === 'core' ? 'core' : id[0] === 'm' ? 'macro' : 'trend';
    const node = button(n.title, id === 'core' ? hitCore : e=>kind==='macro' && focused!==id ? focusBranch(id) : openStory(id,{trigger:e.currentTarget}), 'map-node '+kind);
    node.dataset.node = id;
    node.style.cssText = `left:${n.x}px;top:${n.y-70}px;width:${n.w}px;height:${n.h}px;--branch:${accent(id)}`;
    node.title = n.title;
    canvas.append(node);
    if (kind !== 'macro') continue;
    const branch = element('section','branch');
    branch.style.setProperty('--branch',accent(id));
    branch.dataset.node = id;
    const head = element('div','branch-head');
    const read = button('',e=>focused===id ? openStory(id,{trigger:e.currentTarget}) : focusBranch(id),'read-branch');
    read.append(element('span','branch-number',fa.format(Number(id.slice(1)))),element('span','',n.title));
    const list = element('ul','child-list');
    list.id = 'branch-'+id;
    const descendants = children(id);
    const info = button('ⓘ',e=>{focusBranch(id);openStory(id,{trigger:e.currentTarget});},'expand');
    info.setAttribute('aria-label','توضیحات '+n.title);
    for (const child of descendants) {
      const row = document.createElement('li');
      row.append(button(nodes[child].title,e=>openStory(child,{trigger:e.currentTarget})));
      list.append(row);
    }
    head.append(read,info);
    branch.append(head,list);
    mobile.append(branch);
  }
}
let cameraFrame=0;
function metrics(){
  const vw=viewport.clientWidth,vh=viewport.clientHeight;
  const fit=Math.min((vw-2)/width,(vh-2)/height,.78);
  return {vw,vh,fit};
}
function midpoint(){
  const view=viewport.getBoundingClientRect(), map=canvas.getBoundingClientRect();
  return [(view.left+viewport.clientWidth/2-map.left)/scale,(view.top+viewport.clientHeight/2-map.top)/scale];
}
function place(x,y){
  viewport.scrollLeft=x*scale-viewport.clientWidth/2;
  viewport.scrollTop=y*scale-viewport.clientHeight/2;
}
function resize(keep = false) {
  const {vw,vh,fit}=metrics();
  if(vw<=2||vh<=2)return;
  const [x,y]=keep?midpoint():[width/2,height/2];
  scale=fit*zoom;
  scaler.style.width=width*scale+'px';
  scaler.style.height=height*scale+'px';
  canvas.style.transform=`scale(${scale})`;
  place(x,y);
}
function moveCamera(next,x,y){
  if(mobileMedia.matches)return;
  cancelAnimationFrame(cameraFrame);
  const [sx,sy]=midpoint(), from=zoom, start=performance.now();
  const target=Math.max(.8,Math.min(2.8,next));
  function frame(now){
    const t=reduced.matches||!preferences.motion?1:Math.min(1,(now-start)/340);
    const ease=1-Math.pow(1-t,3);
    zoom=from+(target-from)*ease;
    resize();
    place(sx+(x-sx)*ease,sy+(y-sy)*ease);
    if(t<1)cameraFrame=requestAnimationFrame(frame);
  }
  cameraFrame=requestAnimationFrame(frame);
}
function adjust(factor){
  const [x,y]=midpoint();
  moveCamera(zoom*factor,x,y);
}
let pan=null;
viewport.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||![0,1].includes(event.button)||event.target.closest('button'))return;
  event.preventDefault();
  cancelAnimationFrame(cameraFrame);
  viewport.setPointerCapture(event.pointerId);
  pan={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop,moved:false};
});
viewport.addEventListener('pointermove',event=>{
  if(pan?.id!==event.pointerId)return;
  const dx=event.clientX-pan.x,dy=event.clientY-pan.y;
  if(!pan.moved&&Math.hypot(dx,dy)<5)return;
  pan.moved=true;
  viewport.scrollLeft=pan.left-dx;
  viewport.scrollTop=pan.top-dy;
});
viewport.addEventListener('pointerup',event=>{
  if(pan?.id!==event.pointerId)return;
  if(!pan.moved&&event.button===0){
    const rect=canvas.getBoundingClientRect();
    moveCamera(Math.max(1.65,zoom),(event.clientX-rect.left)/scale,(event.clientY-rect.top)/scale);
  }
  pan=null;
});
for(const name of ['pointercancel','lostpointercapture'])viewport.addEventListener(name,()=>pan=null);
$('zoom-in').onclick=()=>adjust(1.23);
$('zoom-out').onclick=()=>adjust(1/1.23);
$('fit').onclick=()=>{if(!story.hidden)closeStory();if(focused)focusBranch(null);moveCamera(1,width/2,height/2);};
new ResizeObserver(()=>resize(true)).observe(viewport);

function content(id) {
  const original = data.nodes[id];
  if (documents[id] !== true) return Promise.resolve(original);
  if (!textCache.has(id)) {
    textCache.set(id,json(new URL(`text/${id}.json`,root),null,{cache:'no-cache'}).then(file=>{
      if (!file || typeof file.body !== 'string' || !file.body.trim() || file.body.length > 20000) return original;
      return {...original, desc:file.body.trim(), deck:typeof file.summary === 'string' && file.summary.length<=600 ? file.summary : original.deck,
        question:typeof file.question === 'string' && file.question.length<=500 ? file.question : original.question};
    }));
  }
  return textCache.get(id);
}
function artFor(id) {
  const key = group(id);
  const record = approved[id];
  const permitted = id[0]==='t' && record?.reviewed === true && record.file === id+'.webp';
  const image = $('art'), figure = $('story-image');
  figure.classList.remove('hologram');
  image.removeAttribute('src');
  image.removeAttribute('data-pair');
  figure.hidden = !preferences.images || !key;
  image.alt = '';
  if (figure.hidden) return;
  const fallback = new URL(`images/${key}.webp`,root).href;
  const source = permitted ? new URL(`images/${record.file}`,root).href : fallback;
  image.onload = ()=>{
    figure.hidden=!preferences.images;
    figure.classList.remove('hologram');
    void figure.offsetWidth;
    figure.classList.add('hologram');
  };
  image.onerror = ()=>{
    if (image.src !== fallback) image.src = fallback;
    else figure.hidden = true;
  };
  if (key === 'm08') image.dataset.pair = '';
  image.alt = permitted ? 'تصویر روند '+data.nodes[id].title : 'تصویر کلان‌روند '+data.nodes[key].title;
  image.src = source;
}
function finishTyping() {
  cancelAnimationFrame(animation);
  $('story-ghost').classList.remove('is-typing');
  $('story-typed').textContent = '';
  $('story-skip').hidden = true;
  $('story-details').hidden = false;
}
function typeText(value, ticket) {
  const ghost = $('story-ghost'), typed = $('story-typed');
  ghost.textContent = value;
  if (!preferences.typing || !preferences.motion || reduced.matches || value.length > 1000 || !value) {
    finishTyping();
    return;
  }
  const chars = 'Segmenter' in Intl ? [...new Intl.Segmenter('fa').segment(value)].map(s=>s.segment) : Array.from(value);
  const start = performance.now(), duration = Math.min(5100,Math.max(950,chars.length*11));
  ghost.classList.add('is-typing');
  typed.textContent = '';
  $('story-skip').hidden = false;
  function frame(now) {
    if (ticket !== generation || story.hidden) return;
    const count = Math.floor(Math.min(1,(now-start)/duration)*chars.length);
    if (count === chars.length) return finishTyping();
    typed.textContent = chars.slice(0,count).join('');
    animation = requestAnimationFrame(frame);
  }
  animation = requestAnimationFrame(frame);
}
function storySequence() { return tour || current?.[0] === 'm' ? groups : children(group(current)); }
async function openStory(id, options = {}) {
  if (!data?.nodes[id] || id === 'core') return;
  if (options.trigger) trigger = options.trigger;
  if (options.tour !== undefined) tour = options.tour;
  else if (!options.keepTour) tour = false;
  const ticket = ++generation;
  cancelAnimationFrame(animation);
  current = id;
  if (search.open) search.close();
  if(!focused || group(id)!==focused) focusBranch(group(id));
  story.hidden=false;
  document.body.classList.add('story-open');
  if(mobileMedia.matches) $('story-close').focus({preventScroll:true});
  $('story-scroll').scrollTop = 0;
  history.replaceState(null,'','#'+id);
  const n = data.nodes[id], key = group(id), isMega = id[0] === 'm';
  $('story-title').textContent = n.title;
  $('story-kind').textContent = isMega ? 'کلان‌روند' : 'روند وابسته';
  $('story-share').textContent = 'پیوند';
  $('story-parent').hidden = isMega;
  $('story-parent').textContent = isMega ? '' : '↳ '+data.nodes[key].title;
  const seq = storySequence(), pos = seq.indexOf(id);
  $('story-position').textContent = `${fa.format(pos+1)} از ${fa.format(seq.length)}`;
  $('story-prev').disabled = pos<=0;
  $('story-next').disabled = pos<0 || pos===seq.length-1;
  $('story-ghost').textContent = documents[id] === true ? 'در حال دریافت متن…' : '';
  $('story-ghost').classList.remove('is-typing');
  $('story-typed').textContent = '';
  $('story-deck').hidden = $('story-details').hidden = $('story-skip').hidden = true;
  artFor(id);
  const item = await content(id);
  if (ticket !== generation || story.hidden) return;
  $('story-deck').hidden = !item.deck;
  $('story-deck').textContent = item.deck || '';
  $('story-question').hidden = !item.question;
  $('story-question').textContent = item.question || '';
  $('story-notes').replaceChildren(...(item.notes || []).flatMap(([title, text])=>[
    element('dt','',title.replace(/^[۰-۹]+ · /,'')),element('dd','',text)
  ]));
  $('story-trends').replaceChildren(...(isMega ? children(id).map(child=>button(data.nodes[child].title,()=>openStory(child))) : []));
  const links = [];
  if (preferences.relations) for (const [a,b,label,why] of data.relations) {
    const other = 't'+a===id ? 't'+b : 't'+b===id ? 't'+a : null;
    if (!other) continue;
    const node = button(label+' · '+data.nodes[other].title,()=>openStory(other));
    node.title = why;
    links.push(node);
  }
  $('story-relations').replaceChildren(...links);
  typeText(item.desc, ticket);
}
$('story-close').onclick = closeStory;
$('story-skip').onclick = finishTyping;
$('story-parent').onclick = ()=>openStory(group(current));
for (const [id,delta] of [['story-prev',-1],['story-next',1]]) $(id).onclick = ()=>{
  const sequence = storySequence(), next = sequence[sequence.indexOf(current)+delta];
  if (next) openStory(next,{keepTour:true});
};
$('story-share').onclick = async()=>{
  const link = new URL('/2d/t/09/#'+current,location.origin).href;
  try { await navigator.clipboard.writeText(link); $('story-share').textContent = 'کپی شد'; }
  catch { prompt('پیوند این روایت',link); }
};
function closeStory(){
  story.hidden=true;
  document.body.classList.remove('story-open');
  generation++;
  cancelAnimationFrame(animation);
  if (location.hash.slice(1)===current) history.replaceState(null,'',location.pathname+location.search);
  current = null;
  tour = false;
  if (trigger?.isConnected && !search.open) trigger.focus({preventScroll:true});
  trigger = null;
  resize();
}
const keyGuide=$('key-guide');
$('key-help').onclick=()=>keyGuide.showModal();
document.addEventListener('keydown',e=>{
  if(!groups||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.isComposing||document.querySelector('dialog[open]')||e.target.closest('input,select,textarea,[contenteditable]'))return;
  const code=e.code, key=e.key.toLowerCase(), reading=!story.hidden;
  if(code==='Tab'&&!e.target.closest('a,button:not(.map-node,.read-branch)')){
    const pos=groups.indexOf(focused), delta=e.shiftKey?-1:1;
    const id=groups[((pos<0?(e.shiftKey?0:-1):pos)+delta+groups.length)%groups.length];
    if(reading)openStory(id,{keepTour:true});
    else focusBranch(id);
    const node=mobileMedia.matches?document.querySelector('.branch[data-node="'+id+'"] .read-branch'):canvas.querySelector('[data-node="'+id+'"]');
    node?.focus({preventScroll:true});
  }else if(code==='PageUp'||code==='Home'||code==='KeyR')$('fit').click();
  else if(code==='Escape'){
    if(reading)closeStory();
    else if(focused)$('focus-back').click();
    else return;
  }else if(code==='KeyF'){
    if(document.fullscreenElement)document.exitFullscreen()?.catch(()=>{});
    else document.documentElement.requestFullscreen?.()?.catch(()=>{});
  }else if(code==='KeyP'||code==='KeyB'){
    if(reading)closeStory();
    else if(focused)openStory(focused,{tour:code==='KeyP'});
    else $('tour').click();
  }else if(code==='KeyD'){
    if(!reading&&focused)openStory(focused);
    else if(!reading)return;
    requestAnimationFrame(()=>$('story-question').scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'}));
  }else if(code==='KeyJ'||code==='KeyL'||reading&&zoom<=1.01&&(code==='ArrowLeft'||code==='ArrowRight')){
    if(!reading)return;
    $(code==='KeyJ'||code==='ArrowRight'?'story-prev':'story-next').click();
  }else if(code==='KeyK'||code==='Space'){
    if(!reading||code==='Space'&&e.target.closest('button,a'))return;
    finishTyping();
  }else if(code==='KeyM'&&reading){finishTyping();
  }else if(key==='?')keyGuide.showModal();
  else if(key==='+'||key==='='||key==='-')adjust(key==='-'?1/1.23:1.23);
  else if(zoom>1.01&&code.startsWith('Arrow')){
    const dx={ArrowLeft:-1,ArrowRight:1}[code]||0,dy={ArrowUp:-1,ArrowDown:1}[code]||0;
    viewport.scrollBy({left:dx*viewport.clientWidth*.22,top:dy*viewport.clientHeight*.22,behavior:reduced.matches||!preferences.motion?'instant':'smooth'});
  }else return;
  e.preventDefault();
});
$('tour').onclick = e=>openStory(groups[0],{tour:true,trigger:e.currentTarget});
function normalized(value) {
  return value.normalize('NFKD').replace(/[\u064b-\u065f\u200c\s]/g,'').replace(/ي/g,'ی').replace(/ك/g,'ک').toLowerCase();
}
function query() {
  const q = normalized($('query').value);
  const hits = q ? ids.filter(id=>normalized(data.nodes[id].title).includes(q)) : groups;
  $('matches').textContent = fa.format(hits.length)+' نتیجه';
  $('results').replaceChildren(...hits.map(id=>{
    const li = element('li'), select = button(data.nodes[id].title,()=>openStory(id,{trigger:$('find')}));
    if (id[0]==='t') select.append(element('small','',data.nodes[group(id)].title));
    li.append(select);
    return li;
  }));
}
$('find').onclick = ()=>{query();search.showModal();$('query').focus();};
$('query').addEventListener('input',query);
$('search-close').onclick = ()=>search.close();
$('admin-close').onclick = ()=>admin.close();
function fillForm(value) {
  for (const [name,v] of Object.entries(value)) {
    const control = form.elements.namedItem(name);
    if (control.type==='checkbox') control.checked = v;
    else control.value = v;
  }
}
function readForm() {
  const entries = new FormData(form);
  return {typing:entries.has('typing'),images:entries.has('images'),relations:entries.has('relations'),
    motion:entries.has('motion'),theme:entries.get('theme')};
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const value = readForm();
  applyPrefs(value);
  $('admin-status').textContent = storePreview(value) ? 'پیش‌نمایش در این مرورگر ذخیره شد.' : 'پیش‌نمایش برای همین بازدید فعال است.';
});
$('restore').onclick = ()=>{
  storePreview(null);applyPrefs(published);fillForm(published);
  $('admin-status').textContent = 'پیش‌فرض سایت بازیابی شد.';
};
$('export').onclick = ()=>{
  const url = URL.createObjectURL(new Blob([JSON.stringify(readForm(),null,2)+'\n'],{type:'application/json'}));
  const a = element('a');a.href=url;a.download='defaults.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};
function fromHash() {
  const id = location.hash.slice(1);
  if (data?.nodes[id] && id!=='core') openStory(id);
  else if (!story.hidden) closeStory();
}
window.addEventListener('hashchange',fromHash);
async function boot() {
  for (const id of ['find','tour','fit','zoom-in','zoom-out']) $(id).disabled = true;
  try {
    const [map, defaults, approvals, index] = await Promise.all([
      json(new URL('map-data.json',version)),
      json(new URL('defaults.json',root),standard,{cache:'no-cache'}),
      json(new URL('images/approved-trends.json',root),{}, {cache:'no-cache'}),
      json(new URL('text/index.json',root),{}, {cache:'no-cache'})
    ]);
    data = map;
    published = cleanPrefs(defaults);
    approved = approvals || {};
    documents = index || {};
    let preview = {};
    try {preview = JSON.parse(localStorage.getItem(storageKey)||'{}');} catch {}
    ids = Object.keys(data.nodes).filter(id=>id!=='core');
    groups = ids.filter(id=>id[0]==='m');
    drawMap();
    applyPrefs(preview);
    viewport.hidden = $('mobile').hidden = false;
    $('status').hidden = true;
    for (const id of ['find','tour','fit','zoom-in','zoom-out']) $(id).disabled = false;
    resize();
    fromHash();
  } catch {
    const status = $('status');
    status.textContent = 'نقشه بارگیری نشد. ';
    status.append(button('تلاش دوباره',()=>location.reload()));
  }
}
boot();
