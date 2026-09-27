(()=>{"use strict";
const root=document.documentElement;
const fullscreenElement=()=>document.fullscreenElement||document.webkitFullscreenElement||null;
function size(){
 const h=Math.round(window.visualViewport?.height||innerHeight),w=Math.round(window.visualViewport?.width||innerWidth);
 root.style.setProperty("--app-height",h+"px");root.style.setProperty("--app-width",w+"px")
}
function syncButton(){
 const btn=document.getElementById("fullscreenBtn");if(!btn)return;
 const active=!!fullscreenElement()||document.body.classList.contains("pseudo-fullscreen");
 btn.setAttribute("aria-pressed",String(active));btn.title=active?"خروج از تمام‌صفحه":"تمام‌صفحه"
}
async function toggleFullscreen(){
 try{
   if(fullscreenElement()){
     if(document.exitFullscreen)await document.exitFullscreen();
     else if(document.webkitExitFullscreen)document.webkitExitFullscreen()
   }else{
     const el=document.documentElement;
     if(el.requestFullscreen)await el.requestFullscreen({navigationUI:"hide"});
     else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();
     else document.body.classList.toggle("pseudo-fullscreen")
   }
 }catch(_){document.body.classList.toggle("pseudo-fullscreen")}
 finally{setTimeout(()=>{size();syncButton()},60)}
}
function onFullscreenChange(){if(fullscreenElement())document.body.classList.remove("pseudo-fullscreen");size();syncButton()}
function init(){
 size();syncButton();
 const b=document.getElementById("fullscreenBtn");if(b)b.onclick=toggleFullscreen;
 document.addEventListener("fullscreenchange",onFullscreenChange);document.addEventListener("webkitfullscreenchange",onFullscreenChange);
 addEventListener("resize",size);addEventListener("orientationchange",size);window.visualViewport?.addEventListener("resize",size)
}
window.FSINFO_SHELL={toggleFullscreen,size};document.addEventListener("DOMContentLoaded",init);
})();