import { useState, useEffect } from "react";
import { BigBtn, ensureChords, FontSizeControl, makeSwipeHandlers, LEVELS } from "../lib/core.jsx";
import HymnViewer from "./HymnViewer.jsx";

//  USER — HYMN SLIDE VIEWER
// ─────────────────────────────────────────────────────────────
const HymnSlideViewer = ({ hymns, initialHymnId, onBack, fontScale = 1, setFontScale }) => {
  const idx = hymns.findIndex(h=>h.id===initialHymnId);
  const [current, setCurrent] = useState(idx >= 0 ? idx : 0);
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const go = (d) => { const next=current+d; if(next<0||next>=hymns.length) return; setDir(d); setCurrent(next); setAnimKey(k=>k+1); };
  const swipeHandlers = makeSwipeHandlers(() => go(1), () => go(-1));
  const entry = hymns[current];
  const variants = (entry?.variants && entry.variants.length ? entry.variants : [entry]).filter(Boolean);

  // Which chord variation (skill level) is currently showing for this hymn.
  const [variantId, setVariantId] = useState(entry?.id);
  useEffect(() => { setVariantId(entry?.id); }, [current]); // eslint-disable-line

  const hymn = ensureChords(variants.find(v => v.id === variantId) || entry);
  if (!hymn) return null;

  // Build the level tabs: one per distinct level found across this hymn's
  // variants, plus a single "Standard" tab covering any variant with no
  // level tag at all (e.g. the original, untagged arrangement).
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
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"var(--surface)",borderBottom:"1px solid var(--border)",flexShrink:0,zIndex:10,gap:10,flexWrap:"wrap",rowGap:8}}>
        <BigBtn onClick={onBack} variant="ghost" icon="←">Back</BigBtn>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:".78rem",color:"var(--gold2)",letterSpacing:".06em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220,flex:1}}>{hymn.number}. {hymn.title}</span>
        {setFontScale && <FontSizeControl scale={fontScale} onChange={setFontScale}/>}
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",padding:"3px 10px",borderRadius:20,background:"#c4922a22",border:"1px solid var(--gold)",color:"var(--gold2)",flexShrink:0}}>Key: {hymn.key||"D"}</span>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",zIndex:20}}>
          <div className={`slide-arrow${current===0?" disabled":""}`} onClick={()=>go(-1)}>‹</div>
        </div>
        <div key={animKey} {...swipeHandlers} className="hymn-slide-content" style={{flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",height:"100%",animation:`${dir>0?"slideInR":"slideInL"} .3s ease`}}>
          <div style={{maxWidth:860,width:"100%"}}>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"1.6rem",color:"var(--gold2)",textAlign:"center",marginBottom:10,letterSpacing:".08em"}}>{hymn.title}</h2>
            <p style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",color:"var(--muted)",marginBottom:levelTabs.length>1?14:30}}>Key: {hymn.key||"D"}</p>
            {levelTabs.length > 1 && (
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:26,flexWrap:"wrap"}}>
                {levelTabs.map(t => (
                  <button key={t.id} onClick={() => setVariantId(t.id)} style={{
                    fontFamily:"'Cinzel',serif", fontSize:".72rem", fontWeight:700, letterSpacing:".03em",
                    padding:"6px 16px", borderRadius:20, cursor:"pointer", transition:"all .15s",
                    border:`1.5px solid ${variantId===t.id?"var(--gold)":"var(--border2)"}`,
                    background:variantId===t.id?"var(--gold)":"var(--surface2)",
                    color:variantId===t.id?"#000":"var(--cream2)",
                  }}>{t.label}</button>
                ))}
              </div>
            )}
            <p className="swipe-hint" style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:"var(--muted)",marginTop:-20,marginBottom:20}}>⟵ swipe to change hymn ⟶</p>
            <HymnViewer hymn={hymn} lyricSize={Math.round(24*fontScale)} chordSize={Math.round(16*fontScale)} lineGap={Math.round(22*fontScale)}/>
          </div>
        </div>
        <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",zIndex:20}}>
          <div className={`slide-arrow${current===hymns.length-1?" disabled":""}`} onClick={()=>go(1)}>›</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 28px",background:"var(--surface)",borderTop:"1px solid var(--border)",flexShrink:0}}>
        <BigBtn onClick={()=>go(-1)} disabled={current===0} variant={current===0?"ghost":"default"} icon="←">Prev</BigBtn>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",flex:1,margin:"0 12px"}}>
          {hymns.map((_,i)=>(
            <div key={i} onClick={()=>{setDir(i>current?1:-1);setCurrent(i);setAnimKey(k=>k+1);}}
              style={{width:i===current?22:8,height:8,borderRadius:4,cursor:"pointer",transition:"all .25s",background:i===current?"var(--gold)":"var(--border2)"}}/>
          ))}
        </div>
        <BigBtn onClick={()=>go(1)} disabled={current===hymns.length-1} variant={current===hymns.length-1?"ghost":"primary"} icon="→">Next</BigBtn>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default HymnSlideViewer;
