(()=>{"use strict";
function rgb(hex){hex=String(hex||"#777").replace("#","");const n=parseInt(hex,16)||0x777777;return[(n>>16)&255,(n>>8)&255,n&255]}
function color(hex,a){const [r,g,b]=rgb(hex);return"rgba("+r+","+g+","+b+","+a+")"}
function draw(ctx,n,p,hover,time=0){
 const r=Math.max(n.type==="trend"?2.8:5,n.r*p.scale);
 const g=ctx.createRadialGradient(p.x-r*.34,p.y-r*.42,r*.05,p.x,p.y,r);
 g.addColorStop(0,"rgba(255,255,255,.98)");g.addColorStop(.15,color(n.color,.98));g.addColorStop(.58,color(n.color,.74));g.addColorStop(.86,color(n.color,.34));g.addColorStop(1,color(n.color,.025));
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,r*.94,0,Math.PI*2);ctx.clip();ctx.strokeStyle="rgba(255,255,255,.09)";ctx.lineWidth=Math.max(.5,r*.045);
 const bands=n.type==="trend"?1:2;for(let i=0;i<bands;i++){const yy=p.y+r*(-.16+i*.28);ctx.beginPath();ctx.ellipse(p.x,yy,r*.78,r*.14,0,0,Math.PI*2);ctx.stroke()}
 const shade=ctx.createLinearGradient(p.x-r,p.y,p.x+r,p.y);shade.addColorStop(0,"rgba(0,0,0,.28)");shade.addColorStop(.45,"rgba(0,0,0,0)");shade.addColorStop(1,"rgba(0,0,0,.18)");ctx.fillStyle=shade;ctx.fillRect(p.x-r,p.y-r,r*2,r*2);ctx.restore();
 if(n.type!=="trend"){ctx.strokeStyle=color(n.color,hover?.78:.34);ctx.lineWidth=hover?2:1;ctx.beginPath();ctx.arc(p.x,p.y,r*1.34,0,Math.PI*2);ctx.stroke()}return r
}
window.FSINFO_PLANET={draw};
})();