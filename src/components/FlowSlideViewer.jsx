import { useState, useEffect } from "react";
import { BigBtn, ensureChords, FontSizeControl, makeSwipeHandlers, LEVELS } from "../lib/core.jsx";
import HymnViewer from "./HymnViewer.jsx";

const FlowSlideViewer = ({ flow, hymns, onBack, onEditName, fontScale = 1, setFontScale }) => {
  const hymnById = Object.fromEntries(hymns.map(h=>[h.id,h]));
  const flowHymns = flow.hymnIds.map(id=>hymnById[id]).filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  // Start with the song list hidden on phones so lyrics get the full width;
  // desktop keeps it open since there's room to spare.
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === "undefined" || window.innerWidth > 700 ? true : false);

  const go = (d) => {
    const next = current + d;
    if (next < 0 || next >= flowHymns.length) return;
    setDir(d); setCurrent(next); setAnimKey(k=>k+1);
  };
  const swipeHandlers = makeSwipeHandlers(() => go(1), () => go(-1));

  const jumpTo = (i) => {
    setDir(i > current ? 1 : -1); setCurrent(i); setAnimKey(k=>k+1);
  };

  const entry = flowHymns[current];
  const variants = (entry?.variants && entry.variants.length ? entry.variants : [entry]).filter(Boolean);
  const [variantId, setVariantId] = useState(entry?.id);
  useEffect(() => { setVariantId(entry?.id); }, [current]); // eslint-disable-line

  const hymn = ensureChords(variants.find(v => v.id === variantId) || entry);
  if (!hymn) return <div style={{color:"var(--cream)",padding:40}}>Flow is empty.</div>;

  const levelTabs = [];
  LEVELS.forEach(lv => {
    const match = variants.find(v => (v.levels||[]).includes(lv));
    if (match) levelTabs.push({ label: lv, id: match.id });
  });
  const untagged = variants.find(v => !(v.levels||[]).length);
  if (untagged && !levelTabs.some(t => t.id === untagged.id)) levelTabs.push({ label: "Standard", id: untagged.id });

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",position:"relative"}}>
      <div className="cross-bg"/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"var(--surface)",borderBottom:"1px solid var(--border)",zIndex:10,flexShrink:0,flexWrap:"wrap",rowGap:8,gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <BigBtn onClick={onBack} variant="ghost" icon="←">Back</BigBtn>
          <button onClick={() => setSidebarOpen(s=>!s)}
            style={{background:"var(--surface2)",border:"1px solid var(--border2)",color:"var(--gold2)",fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",fontWeight:600,padding:"7px 14px",borderRadius:8,cursor:"pointer",transition:"all .15s"}}>
            {sidebarOpen ? "◀ Hide List" : "▶ Show List"}
          </button>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:".7rem",color:"var(--muted)"}}>{flow.name}</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:".85rem",color:"var(--gold2)",maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{hymn.number}. {hymn.title}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {setFontScale && <FontSizeControl scale={fontScale} onChange={setFontScale}/>}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".72rem",padding:"4px 12px",borderRadius:20,background:"#c4922a22",border:"1px solid var(--gold)",color:"var(--gold2)"}}>{current+1}/{flowHymns.length}</span>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {sidebarOpen && (
          <div style={{width:240,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",zIndex:5,animation:"slideInL .2s ease"}}>
            <div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:".62rem",letterSpacing:".1em",color:"var(--muted)"}}>FLOW SONGS</span>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:6}}>
              {flowHymns.map((h, i) => (
                <div key={`${h.id}-${i}`} onClick={() => jumpTo(i)}
                  style={{padding:"9px 11px",borderRadius:"var(--r)",marginBottom:4,cursor:"pointer",border:`1px solid ${i===current?"var(--gold)":"transparent"}`,background:i===current?"#c4922a18":"transparent",transition:"all .14s",display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:i===current?"var(--gold)":"var(--surface2)",border:`1px solid ${i===current?"var(--gold)":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".58rem",fontWeight:700,color:i===current?"#000":"var(--muted)"}}>{i+1}</span>
                  </div>
                  <div style={{flex:1,overflow:"hidden"}}>
                    <div style={{fontSize:".78rem",color:i===current?"var(--gold2)":"var(--cream)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",color:"var(--muted)",marginTop:1}}>#{h.number} · {h.key||"D"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{flex:1,display:"flex",alignItems:"center",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",zIndex:20}}>
            <div className={`slide-arrow${current===0?" disabled":""}`} onClick={() => go(-1)} title="Previous">‹</div>
          </div>

          <div key={animKey} {...swipeHandlers} className="hymn-slide-content"
            style={{flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",height:"100%",animation:`${dir>0?"slideInR":"slideInL"} .3s ease`}}>
            <div style={{maxWidth:820,width:"100%"}}>
              <div style={{textAlign:"center",marginBottom:8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",padding:"3px 10px",borderRadius:20,background:"#c4922a22",border:"1px solid var(--gold)",color:"var(--gold2)"}}>Key: {hymn.key||"D"}</span>
              </div>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"1.5rem",color:"var(--gold2)",textAlign:"center",marginBottom:levelTabs.length>1?10:8,letterSpacing:".08em",lineHeight:1.3}}>{hymn.title}</h2>
              {levelTabs.length > 1 && (
                <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                  {levelTabs.map(t => (
                    <button key={t.id} onClick={() => setVariantId(t.id)} style={{
                      fontFamily:"'Cinzel',serif", fontSize:".7rem", fontWeight:700, letterSpacing:".03em",
                      padding:"5px 14px", borderRadius:20, cursor:"pointer", transition:"all .15s",
                      border:`1.5px solid ${variantId===t.id?"var(--gold)":"var(--border2)"}`,
                      background:variantId===t.id?"var(--gold)":"var(--surface2)",
                      color:variantId===t.id?"#000":"var(--cream2)",
                    }}>{t.label}</button>
                  ))}
                </div>
              )}
              <p className="swipe-hint" style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:"var(--muted)",marginBottom:20}}>⟵ swipe to change hymn ⟶</p>
              <HymnViewer hymn={hymn} lyricSize={Math.round(24*fontScale)} chordSize={Math.round(16*fontScale)} lineGap={Math.round(22*fontScale)}/>
            </div>
          </div>

          <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",zIndex:20}}>
            <div className={`slide-arrow${current===flowHymns.length-1?" disabled":""}`} onClick={() => go(1)} title="Next">›</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 20px",background:"var(--surface)",borderTop:"1px solid var(--border)",flexShrink:0,gap:6,flexWrap:"wrap"}}>
        {flowHymns.map((h,i)=>(
          <div key={`dot-${i}`} onClick={()=>jumpTo(i)} title={`${h.number}. ${h.title}`}
            style={{width:i===current?24:8,height:8,borderRadius:4,cursor:"pointer",transition:"all .25s",background:i===current?"var(--gold)":"var(--border2)",flexShrink:0}}/>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default FlowSlideViewer;
