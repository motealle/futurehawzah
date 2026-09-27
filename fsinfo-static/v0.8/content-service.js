(()=>{"use strict";
const data=window.FSINFO_DATA;
function rec(id){if(!id)return null;const n=data.records[id];if(n)return n;const m=/^(MT\d+)/.exec(id);return m?data.records[m[1]]||null:null}
const api={
 get(id,{depth="L2"}={}){const r=rec(id);if(!r)return null;return {record:r,content:r.levels[depth]||r.levels.L2,depth}},
 getRecord:rec,
 getEvidence(id){const r=rec(id);return r?{source:r.source,provenance:r.source.provenance}:null},
 getDomains(id){return rec(id)?.decision?.domains||[]},
 search(q,{limit=8}={}){q=String(q||"").trim();if(!q)return[];return Object.values(data.records).filter(r=>[r.title,...r.trends,r.levels.L1.text,r.levels.L2.text].join(" ").includes(q)).slice(0,limit)}
};
window.FSINFO_CONTENT=api;
})();