(()=>{"use strict";
const KEY="fsinfo-font-choice",root=document.documentElement;let userSet=false,current="vazirmatn";
try{const s=localStorage.getItem(KEY);if(s==="sahel"||s==="vazirmatn"){current=s;userSet=true}else current=matchMedia("(max-width:699px)").matches?"sahel":"vazirmatn"}catch(_){current=matchMedia("(max-width:699px)").matches?"sahel":"vazirmatn"}
function apply(name,persist=true){current=name==="sahel"?"sahel":"vazirmatn";root.dataset.font=current;if(persist){userSet=true;try{localStorage.setItem(KEY,current)}catch(_){}}const s=document.getElementById("fontSelect");if(s)s.value=current}
function init(){const s=document.getElementById("fontSelect");if(s){s.value=current;s.onchange=e=>apply(e.target.value)}apply(current,false);addEventListener("resize",()=>{if(!userSet)apply(matchMedia("(max-width:699px)").matches?"sahel":"vazirmatn",false)})}
function family(){return current==="sahel"?"Sahel, Tahoma, Arial":"Vazirmatn, Tahoma, Arial"}
window.FSINFO_FONT={init,apply,family,get current(){return current}};
document.addEventListener("DOMContentLoaded",init);
})();