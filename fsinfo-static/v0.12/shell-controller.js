(()=>{"use strict";
const root=document.documentElement;
function size(){const h=window.visualViewport?.height||innerHeight;root.style.setProperty("--app-height",h+"px")}
async function toggleFullscreen(){
 const btn=document.getElementById("fullscreenBtn");
 try{
   if(document.fullscreenElement){await document.exitFullscreen?.();return}
   const el=document.documentElement;
   if(el.requestFullscreen)await el.requestFullscreen({navigationUI:"hide"});
   else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();
   else document.body.classList.toggle("pseudo-fullscreen");
 }catch(_){document.body.classList.toggle("pseudo-fullscreen")}
 finally{setTimeout(size,60);if(btn)btn.setAttribute("aria-pressed",String(!!document.fullscreenElement||document.body.classList.contains("pseudo-fullscreen")))}
}
function init(){size();const b=document.getElementById("fullscreenBtn");if(b)b.onclick=toggleFullscreen;document.addEventListener("fullscreenchange",size);window.visualViewport?.addEventListener("resize",size)}
window.FSINFO_SHELL={toggleFullscreen,size};document.addEventListener("DOMContentLoaded",init);
})();