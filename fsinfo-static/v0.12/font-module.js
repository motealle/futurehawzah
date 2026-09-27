(()=>{"use strict";
const KEY="fsinfo-v0.12-font",root=document.documentElement;
function preferred(){const x=localStorage.getItem(KEY);if(x==="sahel"||x==="vazirmatn")return x;return matchMedia("(max-width:699px)").matches?"sahel":"vazirmatn"}
let current=preferred();
function apply(v,persist=true){current=v==="sahel"?"sahel":"vazirmatn";root.dataset.font=current;if(persist)localStorage.setItem(KEY,current);const s=document.getElementById("fontSelect");if(s)s.value=current}
function init(){const s=document.getElementById("fontSelect");if(s)s.onchange=e=>apply(e.target.value);apply(current,false)}
function family(){return current==="sahel"?"Sahel, Tahoma, Arial":"Vazirmatn, Tahoma, Arial"}
window.FSINFO_FONT={apply,init,family,get current(){return current}};document.addEventListener("DOMContentLoaded",init);
})();