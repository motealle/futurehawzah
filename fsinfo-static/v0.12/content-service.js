(()=>{"use strict";
const I=window.FSINFO_BOOK_INDEX,S=window.FSINFO_SECTIONS;
function macroId(id){if(!id)return null;if(I.records[id])return id;const m=/^(MT\d+)/.exec(id);return m?m[1]:null}
function rec(id){const k=macroId(id);if(!k)return null;const meta=I.records[k],sec=S[k];return meta&&sec?Object.assign({},meta,sec):null}
function takeByPercent(r,pct){const ps=r.paragraphs||[];if(!ps.length)return"";const n=Math.max(1,Math.min(ps.length,Math.ceil(ps.length*Math.max(1,Math.min(100,pct))/100)));return ps.slice(0,n).join("\n\n")}
const api={
 getRecord:rec,
 get(id,{mode="opening",percent=25}={}){
  const r=rec(id);if(!r)return null;let text="";
  if(mode==="sentence")text=r.first_sentence;
  else if(mode==="opening")text=r.opening_paragraph;
  else if(mode==="percent")text=takeByPercent(r,percent);
  else if(mode==="full")text=(r.paragraphs||[]).join("\n\n");
  else text=r.opening_paragraph;
  return{record:r,text,mode,percent,origin:"book_content"}
 },
 search(q,{limit=12}={}){
  q=String(q||"").trim();if(!q)return[];const out=[];
  for(const id of Object.keys(I.records)){const r=rec(id);if(!r)continue;const hay=[r.title,...r.trends,...r.paragraphs].join("\n"),at=hay.indexOf(q);if(at<0)continue;const start=Math.max(0,at-70),end=Math.min(hay.length,at+q.length+130);out.push({id:r.id,title:r.title,snippet:(start?"…":"")+hay.slice(start,end)+(end<hay.length?"…":"")});if(out.length>=limit)break}
  return out
 },
 list(){return Object.keys(I.records).map(rec).filter(Boolean)}
};
window.FSINFO_CONTENT=api;
})();