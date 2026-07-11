// ═════════════════════════════════════════════════════════════
//  USER DASHBOARD — the public-facing hymn interface
//  (original UserDashboard, unchanged behaviour)
// ═════════════════════════════════════════════════════════════
import { useState } from "react";
import { BigBtn, Modal, KeyFilterDropdown, loadStorage, saveStorage } from "./lib/core.jsx";
import FlowSlideViewer from "./components/FlowSlideViewer.jsx";
import FlowsPage from "./components/FlowsPage.jsx";
import HymnSlideViewer from "./components/HymnSlideViewer.jsx";
import KeySelectionModal from "./components/KeySelectionModal.jsx";

//  USER DASHBOARD
// ─────────────────────────────────────────────────────────────
const UserDashboard = ({ hymns, onLogout }) => {
  const [flows, setFlows] = useState(() => loadStorage("csiFlows", []));
  const [fontScale, setFontScaleState] = useState(() => loadStorage("csiFontScale", 1));
  const setFontScale = (v) => { setFontScaleState(v); saveStorage("csiFontScale", v); };
  const [page, setPage] = useState("home");
  const [viewHymnId, setViewHymnId] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);
  const [search, setSearch] = useState("");
  const [keyFilter, setKeyFilter] = useState("");
  const [keyModalData, setKeyModalData] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const hymnGroups = {};
  hymns.forEach(h => { if (!hymnGroups[h.number]) hymnGroups[h.number] = []; hymnGroups[h.number].push(h); });

  const groupedList = Object.values(hymnGroups)
    .sort((a,b) => a[0].number - b[0].number)
    .filter(group => {
      const matchSearch = !search || group[0].title.toLowerCase().includes(search.toLowerCase()) || String(group[0].number).includes(search);
      const matchKey = !keyFilter || group.some(h => (h.key||"D") === keyFilter);
      return matchSearch && matchKey;
    });

  const handleHymnClick = (group) => {
    if (keyFilter) {
      const matched = group.find(h => (h.key||"D") === keyFilter);
      if (matched) { setViewHymnId(matched.id); setPage("slide"); return; }
    }
    if (group.length===1) { setViewHymnId(group[0].id); setPage("slide"); }
    else { setKeyModalData({number:group[0].number, title:group[0].title, hymns:group}); setShowKeyModal(true); }
  };
  const handleKeySelected = (h) => { setViewHymnId(h.id); setShowKeyModal(false); setKeyModalData(null); setPage("slide"); };

  if (page==="slide") return <HymnSlideViewer hymns={hymns} initialHymnId={viewHymnId} onBack={()=>setPage("hymns")} fontScale={fontScale} setFontScale={setFontScale}/>;
  if (page==="flows") return <FlowsPage hymns={hymns} flows={flows} setFlows={setFlows} onStartFlow={f=>{setActiveFlow(f);setPage("flowSlide");}} onBack={()=>setPage("home")}/>;
  if (page==="flowSlide") return <FlowSlideViewer flow={activeFlow} hymns={hymns} onBack={()=>setPage("flows")} fontScale={fontScale} setFontScale={setFontScale}/>;

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
          <div style={{padding:"60px 24px 48px",textAlign:"center",background:"linear-gradient(to bottom,var(--surface) 0%,transparent 100%)"}}>
            <div style={{fontSize:"3rem",marginBottom:12,animation:"glow 3s infinite"}}>✝</div>
            <h1 style={{fontFamily:"'Cinzel',serif",fontSize:"2.2rem",fontWeight:900,color:"var(--gold2)",letterSpacing:".1em",marginBottom:10}}>Praise & Worship</h1>
            <p style={{color:"var(--muted)",fontSize:"1.05rem",fontFamily:"'Crimson Pro',serif",fontStyle:"italic"}}>Church of South India — Sacred Hymns & Chords</p>
          </div>
          <div style={{display:"flex",gap:18,padding:"0 28px 40px",flexWrap:"wrap",maxWidth:720,margin:"0 auto",justifyContent:"center"}}>
            {[
              {icon:"🎵",title:"Browse Hymns",sub:`${Object.keys(hymnGroups).length} hymns · ${hymns.length} versions`,action:()=>setPage("hymns"),color:"var(--gold)"},
              {icon:"📋",title:"Service Flows",sub:`${flows.length} flow${flows.length!==1?"s":""} saved`,action:()=>setPage("flows"),color:"var(--blue2)"},
            ].map(card=>(
              <div key={card.title} onClick={card.action}
                style={{flex:"1 1 260px",padding:"32px 28px",borderRadius:16,cursor:"pointer",background:"var(--surface)",border:"1px solid var(--border)",transition:"all .22s",textAlign:"center",boxShadow:"0 8px 30px #0005"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{fontSize:"2.8rem",marginBottom:14}}>{card.icon}</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.05rem",color:card.color,marginBottom:8}}>{card.title}</div>
                <div style={{fontSize:".85rem",color:"var(--muted)"}}>{card.sub}</div>
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
        <div style={{flex:1,overflowY:"auto",padding:"24px",position:"relative",zIndex:1}}>
          <div style={{maxWidth:720,margin:"0 auto"}}>
            <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search hymns by name or number…"
                style={{flex:1,minWidth:160,background:"var(--surface)",border:"1.5px solid var(--border2)",color:"var(--cream)",padding:"11px 16px",borderRadius:10,fontFamily:"'Crimson Pro',serif",fontSize:"1.05rem",outline:"none",transition:"border-color .15s"}}
                onFocus={e=>e.target.style.borderColor="var(--gold)"} onBlur={e=>e.target.style.borderColor="var(--border2)"}
              />
              <KeyFilterDropdown hymns={hymns} value={keyFilter} onChange={setKeyFilter} style={{fontSize:".8rem",padding:"10px 14px"}}/>
            </div>
            {keyFilter && (
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <span style={{fontSize:".78rem",color:"var(--muted)"}}>Filtering by key:</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem",fontWeight:700,padding:"2px 10px",borderRadius:20,background:"#c4922a22",border:"1px solid var(--gold)",color:"var(--gold2)"}}>{keyFilter}</span>
                <button onClick={()=>setKeyFilter("")} style={{background:"transparent",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:".8rem"}}>✕ clear</button>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {groupedList.map(group => {
                const rep=group[0];
                const keys = group.map(h=>h.key||"D");
                const multi = group.length > 1;
                return (
                  <div key={rep.number} onClick={()=>handleHymnClick(group)}
                    style={{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,cursor:"pointer",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="var(--surface2)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--surface)";}}>
                    <span style={{fontFamily:"'Cinzel',serif",fontSize:".72rem",color:"var(--gold)",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:20,padding:"4px 12px",flexShrink:0,minWidth:48,textAlign:"center"}}>#{rep.number}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"1.05rem",color:"var(--cream)",fontFamily:"'Crimson Pro',serif",marginBottom:6}}>{rep.title}</div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                        {keys.map((k,ki)=>(
                          <span key={ki} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",fontWeight:700,padding:"3px 10px",borderRadius:10,background:k===keyFilter?"#c4922a33":"var(--bg2)",border:`1px solid ${k===keyFilter?"var(--gold)":"var(--border2)"}`,color:k===keyFilter?"var(--gold2)":"var(--muted)"}}>{k}</span>
                        ))}
                        {multi && !keyFilter && <span style={{fontSize:".65rem",color:"var(--muted)",fontFamily:"'Cinzel',serif"}}>· tap to choose key</span>}
                      </div>
                    </div>
                    <span style={{color:"var(--muted)",fontSize:"1rem",fontWeight:700}}>→</span>
                  </div>
                );
              })}
              {groupedList.length===0 && (
                <div style={{textAlign:"center",padding:"56px 0",color:"var(--muted)"}}>
                  <div style={{fontSize:"2rem",opacity:.25,marginBottom:12}}>🔍</div>
                  <p style={{fontSize:".9rem"}}>No hymns found{search?` for "${search}"`:""}{ keyFilter ? ` in key ${keyFilter}`:""}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {keyModalData && (
        <KeySelectionModal open={showKeyModal} onClose={()=>{setShowKeyModal(false);setKeyModalData(null);}}
          hymnNumber={keyModalData.number} hymnTitle={keyModalData.title} availableHymns={keyModalData.hymns} onSelect={handleKeySelected}/>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default UserDashboard;
