// ═════════════════════════════════════════════════════════════
//  USER DASHBOARD — the public-facing hymn interface
//  (original UserDashboard, unchanged behaviour)
// ═════════════════════════════════════════════════════════════
import { useState } from "react";
import { BigBtn, loadStorage, saveStorage } from "./lib/core.jsx";
import FlowSlideViewer from "./components/FlowSlideViewer.jsx";
import FlowsPage from "./components/FlowsPage.jsx";
import HymnSlideViewer from "./components/HymnSlideViewer.jsx";
import HymnsPage from "./components/HymnsPage.jsx";

//  USER DASHBOARD
// ─────────────────────────────────────────────────────────────
const UserDashboard = ({ hymns, config, onLogout }) => {
  const [flows, setFlows] = useState(() => loadStorage("csiFlows", []));
  const [fontScale, setFontScaleState] = useState(() => loadStorage("csiFontScale", 1));
  const setFontScale = (v) => { setFontScaleState(v); saveStorage("csiFontScale", v); };
  const [page, setPage] = useState("home");
  const [viewHymnId, setViewHymnId] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);

  // Step 1 — collapse chord-level variations (same number + same key, e.g. a
  // Beginner and an Advanced arrangement of the same hymn) into ONE display
  // entry carrying all its `.variants`, so the browse list and prev/next
  // navigation never show/step through the same hymn twice.
  const variantBuckets = {};
  hymns.forEach(h => {
    const vkey = `${h.number}|${(h.key||"D").toUpperCase()}`;
    if (!variantBuckets[vkey]) variantBuckets[vkey] = [];
    variantBuckets[vkey].push(h);
  });
  const displayHymns = Object.values(variantBuckets).map(variants => {
    const sorted = [...variants].sort((a,b) => (a.version||1) - (b.version||1));
    return { ...sorted[0], variants: sorted };
  });

  // Step 2 — group those by hymn number, same as before, for the existing
  // "this hymn comes in multiple keys" picker.
  const hymnGroups = {};
  displayHymns.forEach(h => { if (!hymnGroups[h.number]) hymnGroups[h.number] = []; hymnGroups[h.number].push(h); });

  const groups = Object.values(hymnGroups).sort((a,b) => a[0].number - b[0].number);
  const openHymn = (h) => { setViewHymnId(h.id); setPage("slide"); };

  if (page==="slide") return <HymnSlideViewer hymns={displayHymns} initialHymnId={viewHymnId} onBack={()=>setPage("hymns")} fontScale={fontScale} setFontScale={setFontScale}/>;
  if (page==="flows") return <FlowsPage hymns={displayHymns} flows={flows} setFlows={setFlows} onStartFlow={f=>{setActiveFlow(f);setPage("flowSlide");}} onBack={()=>setPage("home")}/>;
  if (page==="flowSlide") return <FlowSlideViewer flow={activeFlow} hymns={displayHymns} onBack={()=>setPage("flows")} fontScale={fontScale} setFontScale={setFontScale}
    onDeleteFlow={() => { setFlows(prev => prev.filter(f => f.id !== activeFlow.id)); setActiveFlow(null); setPage("flows"); }}/>;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      <div className="cross-bg"/>
      <header style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 20px",height:58,display:"flex",alignItems:"center",gap:12,flexShrink:0,boxShadow:"0 2px 20px #0008",zIndex:10,position:"sticky",top:0}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:".95rem",fontWeight:900,color:"var(--gold2)",letterSpacing:".08em"}}>✝ CSI HYMNS</span>
        <nav style={{display:"flex",gap:6,flex:1}}>
          {[["home","🏠 Home"],["hymns","🎵 Hymns"],["flows","📋 Flows"]].map(([p,label])=>(
            <button key={p} onClick={()=>setPage(p)} style={{
              background:page===p?"var(--gold)":"transparent",
              border:`1.5px solid ${page===p?"var(--gold)":"var(--border2)"}`,
              color:page===p?"#000":"var(--cream2)",
              fontFamily:"'Cinzel',serif", fontSize:".72rem", fontWeight:700,
              padding:"7px 16px", borderRadius:10, cursor:"pointer", transition:"all .15s",
              letterSpacing:".04em",
            }}>{label}</button>
          ))}
        </nav>
        {onLogout && <BigBtn variant="ghost" onClick={onLogout} icon="←">Exit</BigBtn>}
      </header>

      {page==="home" && (
        <div style={{flex:1,overflowY:"auto",position:"relative",zIndex:1}}>
          <div className="hero">
            <div className="cross">✝</div>
            <h1>{config?.siteTitle || "CSI HYMNS"}</h1>
            <p>{config?.tagline || "Sacred Songs & Chord Book"}</p>
          </div>
          <div style={{display:"flex",gap:18,padding:"0 28px 40px",flexWrap:"wrap",maxWidth:720,margin:"0 auto",justifyContent:"center"}}>
            {[
              {icon:"🎵",title:"Browse Hymns",sub:hymns.length ? `${Object.keys(hymnGroups).length} hymn${Object.keys(hymnGroups).length!==1?"s":""} · pick a number, then a key` : "Hymns are being added",action:()=>setPage("hymns")},
              {icon:"📋",title:"Service Flows",sub:`${flows.length} flow${flows.length!==1?"s":""} saved · build your order of worship`,action:()=>setPage("flows")},
            ].map(card=>(
              <div key={card.title} className="home-card" onClick={card.action} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&card.action()}>
                <div className="ic">{card.icon}</div>
                <div className="tt">{card.title}</div>
                <div className="st">{card.sub}</div>
              </div>
            ))}
          </div>
          {flows.length > 0 && (
            <div style={{maxWidth:720,margin:"0 auto",padding:"0 28px 40px"}}>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:".78rem",letterSpacing:".1em",color:"var(--muted)",marginBottom:16}}>RECENT FLOWS</h2>
              {flows.slice(0,3).map(f=>(
                <div key={f.id}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,cursor:"pointer",marginBottom:10,transition:"border-color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border2)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
                  onClick={()=>{setActiveFlow(f);setPage("flowSlide");}}>
                  <div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:".9rem",color:"var(--gold2)"}}>{f.name}</div>
                    {f.label && <div style={{fontSize:".75rem",color:"var(--muted)",fontStyle:"italic",marginTop:2}}>{f.label}</div>}
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:"var(--muted)",marginTop:3}}>{f.hymnIds.length} hymns</div>
                  </div>
                  <BigBtn variant="primary" icon="▶">Start</BigBtn>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page==="hymns" && (
        <div style={{flex:1,overflowY:"auto",position:"relative",zIndex:1}}>
          <HymnsPage groups={groups} onOpen={openHymn}/>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default UserDashboard;
