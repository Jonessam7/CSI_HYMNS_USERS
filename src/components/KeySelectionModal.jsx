import { Modal, LEVELS } from "../lib/core.jsx";

//  USER — KEY SELECTION MODAL
// ─────────────────────────────────────────────────────────────
const KeySelectionModal = ({ open, onClose, hymnNumber, hymnTitle, availableHymns, onSelect }) => {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={`🎵 Select Key — Hymn #${hymnNumber}`}>
      <p style={{fontSize:".9rem",color:"var(--cream2)",marginBottom:6,fontFamily:"'Crimson Pro',serif",fontStyle:"italic"}}>{hymnTitle}</p>
      <p style={{fontSize:".78rem",color:"var(--muted)",marginBottom:20}}>This hymn is available in multiple keys. Choose one:</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
        {availableHymns.map(h => {
          // Each key button previews which difficulty levels it has —
          // same Key -> Level info the admin panel shows, just surfaced
          // as a quick label here instead of a separate nested tree.
          const variants = h.variants && h.variants.length ? h.variants : [h];
          const availableLevels = LEVELS.filter(lv => variants.some(v => (v.level||"Easy") === lv));
          return (
            <button key={h.id} onClick={() => { onSelect(h); onClose(); }}
              style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, padding:"14px 30px", borderRadius:14, border:"1.5px solid var(--border2)", background:"var(--surface2)", color:"var(--gold2)", cursor:"pointer", transition:"all .18s", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}
              onMouseEnter={e => { e.currentTarget.style.background="#c4922a22"; e.currentTarget.style.borderColor="var(--gold)"; e.currentTarget.style.transform="scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.transform="scale(1)"; }}>
              <span style={{fontSize:"1.3rem"}}>{h.key || "D"}</span>
              {availableLevels.length > 1 && (
                <span style={{fontSize:".58rem",color:"var(--muted)",fontWeight:400,letterSpacing:".02em"}}>{availableLevels.join(" · ")}</span>
              )}
            </button>
          );
        })}
      </div>
      <p style={{textAlign:"center",fontSize:".7rem",color:"var(--muted)",marginTop:18}}>{availableHymns.length} key{availableHymns.length!==1?"s":""} available</p>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────
//  USER — FLOW SLIDE VIEWER
// ─────────────────────────────────────────────────────────────
export default KeySelectionModal;
