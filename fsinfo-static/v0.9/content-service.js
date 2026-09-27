(()=>{"use strict";
const B=window.FSINFO_BOOK;
function macroId(id){if(!id)return null;if(B.records[id])return id;const m=/^(MT\d+)/.exec(id);return m?m[1]:null}
function rec(id){const k=macroId(id);return k?B.records[k]||null:null}
function takeByPercent(r,pct){
 const ps=r.paragraphs||[];if(!ps.length)return"";
 const n=Math.max(1,Math.min(ps.length,Math.ceil(ps.length*Math.max(1,Math.min(100,pct))/100)));
 return ps.slice(0,n).join("\n\n");
}
const api={
 getRecord:rec,
 get(id,{mode="opening",percent=25}={}){
  const r=rec(id);if(!r)return null;
  let text="";
  if(mode==="sentence")text=r.first_sentence;
  else if(mode==="opening")text=r.opening_paragraph;
  else if(mode==="percent")text=takeByPercent(r,percent);
  else if(mode==="full")text=(r.paragraphs||[]).join("\n\n");
  else text=r.opening_paragraph;
  return {record:r,text,mode,percent,origin:"book_content"};
 },
 search(q,{limit=12}={}){
  q=String(q||"").trim();if(!q)return[];
  const out=[];
  for(const r of Object.values(B.records)){
    const hay=[r.title,...r.trends,...r.paragraphs].join("\n");
    const at=hay.indexOf(q);if(at<0)continue;
    const start=Math.max(0,at-70),end=Math.min(hay.length,at+q.length+130);
    out.push({id:r.id,title:r.title,snippet:(start?"…":"")+hay.slice(start,end)+(end<hay.length?"…":"")});
    if(out.length>=limit)break;
  }
  return out;
 },
 list(){return Object.values(B.records)}
};
window.FSINFO_CONTENT=api;
})();