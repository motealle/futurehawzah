(()=>{"use strict";
const KEY="fsinfo-font-choice",root=document.documentElement;
function preferred(){const saved=localStorage.getItem(KEY);if(saved==="sahel"||saved==="vazirmatn")return saved;return matchMedia("(max-width: 699px)").matches?"sahel":"vazirmatn"}
let current=preferred();
function apply(name,persist=true){current=name==="sahel"?"sahel":"vazirmatn";root.dataset.font=current;if(persist)localStorage.setItem(KEY,current);const s=document.getElementById("fontSelect");if(s)s.value=current}
function init(){const s=document.getElementById("fontSelect");if(s){s.value=current;s.onchange=e=>apply(e.target.value)}apply(current,false)}
function family(){return current==="sahel"?"Sahel, Tahoma, Arial":"Vazirmatn, Tahoma, Arial"}
window.FSINFO_FONT={init,apply,family,get current(){return current}};
document.addEventListener("DOMContentLoaded",init);
})();