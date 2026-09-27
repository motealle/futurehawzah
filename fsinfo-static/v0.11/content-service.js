(()=>{"use strict";
const B=window.FSINFO_BOOK;if(!B||!B.records)throw new Error("FSInfo book data failed to load");
function macroId(id){if(!id)return null;if(B.records[id])return id;const m=/^(MT\d+)/.exec(id);return m?m[1]:null}
function rec(id){const k=macroId(id);return k?B.records[k]||null:null}
function nodeContext(id){
 const r=rec(id);if(!r)return null;
 if(B.records[id])return {depth:1,macro:r,trend:null,id:r.id};
 const m=/^(MT\d+)-T(\d+)$/.exec(id||"");
 if(!m)return {depth:1,macro:r,trend:null,id:r.id};
 const ti=Math.max(0,Number(m[2])-1),title=r.trends[ti]||id,ctx=r.trend_contexts?.[id]||{title,text:"",found:false};
 return {depth:2,macro:r,trend:{id,title,index:ti,context:ctx.text||"",found:!!ctx.found},id};
}
function takeByPercent(text,pct){
 const ps=String(text||"").split(/\n+/).map(x=>x.trim()).filter(Boolean);if(!ps.length)return"";
 const n=Math.max(1,Math.min(ps.length,Math.ceil(ps.length*Math.max(1,Math.min(100,pct))/100)));
 return ps.slice(0,n).join("\n\n");
}
function sourceFor(ctx){
 if(ctx.depth===2&&ctx.trend?.found)return ctx.trend.context;
 return ctx.macro.full_text;
}
const api={
 getRecord:rec,nodeContext,
 get(id,{mode="opening",percent=25}={}){
  const ctx=nodeContext(id);if(!ctx)return null;let text="",scope=ctx.depth===2?"trend":"macro";
  const source=sourceFor(ctx);
  if(ctx.depth===2&&ctx.trend&&!ctx.trend.found)scope="macro_fallback";
  if(mode==="sentence"){
    text=ctx.depth===2&&ctx.trend?.found?ctx.trend.context.split(/\n+/).filter(Boolean).slice(0,2).join(" "):ctx.macro.first_sentence;
    text=(text.match(/^(.+?[.!؟])(?:\s|$)/)||[])[1]||text.slice(0,360);
  }else if(mode==="opening"){
    text=ctx.depth===2&&ctx.trend?.found?ctx.trend.context.split(/\n+/).filter(Boolean).slice(0,3).join("\n\n"):ctx.macro.opening_paragraph;
  }else if(mode==="percent")text=takeByPercent(source,percent);
  else if(mode==="full")text=source;
  else text=ctx.macro.opening_paragraph;
  return {record:ctx.macro,context:ctx,text,mode,percent,origin:"book_content",scope};
 },
 search(q,{limit=12}={}){
  q=String(q||"").trim();if(!q)return[];const out=[];
  for(const r of Object.values(B.records)){
   const hay=[r.title,...r.trends,r.full_text].join("\n"),at=hay.indexOf(q);if(at<0)continue;
   const start=Math.max(0,at-70),end=Math.min(hay.length,at+q.length+150);
   out.push({id:r.id,title:r.title,snippet:(start?"…":"")+hay.slice(start,end)+(end<hay.length?"…":"")});
   if(out.length>=limit)break;
  }return out;
 },
 list(){return Object.values(B.records)}
};
window.FSINFO_CONTENT=api;
})();