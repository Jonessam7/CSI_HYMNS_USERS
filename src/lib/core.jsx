// ═════════════════════════════════════════════════════════════
//  SHARED CORE — used by BOTH admin-app and user-app
//  (styles, constants, utilities, and small shared UI atoms)
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
//  GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --bg:         #080b14;
  --bg2:        #0d1120;
  --surface:    #111827;
  --surface2:   #1a2236;
  --surface3:   #243049;
  --border:     #1e2d4a;
  --border2:    #2a3f62;
  --gold:       #c9922a;
  --gold2:      #e8b84b;
  --gold3:      #f5d27a;
  --cream:      #f0e6d0;
  --cream2:     #d4c4a0;
  --muted:      #5a6a88;
  --blue:       #3b6fd4;
  --blue2:      #5a8fe8;
  --red:        #c45a2a;
  --green:      #2a9d6a;
  --r:          10px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--cream);
  font-family: 'Crimson Pro', Georgia, serif;
  min-height: 100vh;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

@keyframes fadeIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideInL  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
@keyframes slideInR  { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
@keyframes glow      { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }

.cross-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 50% 0%, #1a2a4a44 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 80% 80%, #c9922a0a 0%, transparent 60%);
}

/* ── Chord + Lyric columns ── */
.syl-col { display:inline-flex; flex-direction:column; align-items:center; padding:0 3px; }
.syl-chord {
  font-family:'JetBrains Mono',monospace; font-weight:700; color:var(--gold2);
  display:flex; align-items:flex-end; justify-content:center;
  white-space:nowrap; padding-bottom:1px;
}
.syl-lyric {
  font-family:'Noto Sans Kannada','Noto Sans','Arial Unicode MS',sans-serif;
  color:var(--cream); white-space:nowrap; text-align:center; line-height:1.4;
}

/* ── Admin chord slot ── */
.chord-slot {
  font-family:'JetBrains Mono',monospace; font-size:.68rem; font-weight:700;
  color:var(--gold2); min-width:22px; min-height:20px;
  display:flex; align-items:center; justify-content:center;
  border-radius:3px; padding:1px 3px; cursor:text; white-space:nowrap;
  transition:background .12s;
}
.chord-slot.has-chord { background:#c4922a22; border:1px solid #c4922a66; }
.chord-slot.focused   { background:#c4922a18; border:1px solid var(--gold); }

.syl-text-editor {
  font-size:1.1rem; color:var(--cream); padding:0 1px;
  white-space:nowrap; line-height:1.6; transition:color .12s;
  font-family:'Noto Sans Kannada','Noto Sans',serif;
}

.drag-handle { cursor:grab; opacity:.4; transition:opacity .15s; }
.drag-handle:hover { opacity:1; }

/* ── Big nav buttons for user side ── */
.nav-btn-big {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-family:'Cinzel',serif; font-weight:700; letter-spacing:.06em;
  font-size:.82rem; padding:11px 22px; border-radius:12px; cursor:pointer;
  border:1.5px solid transparent; transition:all .18s; white-space:nowrap;
  user-select:none;
}
.nav-btn-big:active { transform:scale(.97); }

/* ── Side slide arrow buttons ── */
.slide-arrow {
  display:flex; align-items:center; justify-content:center;
  width:52px; height:52px; border-radius:50%; cursor:pointer;
  border:2px solid var(--border2); background:var(--surface2);
  color:var(--gold2); font-size:1.3rem; font-weight:700;
  transition:all .18s; user-select:none; flex-shrink:0;
}
.slide-arrow:hover:not(.disabled) { background:var(--gold); border-color:var(--gold); color:#000; transform:scale(1.08); }
.slide-arrow.disabled { opacity:.3; cursor:not-allowed; }
.slide-arrow:active:not(.disabled) { transform:scale(.95); }

/* ── Hymn slide content wrapper: generous side padding on desktop
     (room for the floating arrow buttons), full-width on phones where
     the arrows are hidden and swipe takes over instead ── */
.hymn-slide-content { padding: 36px 80px; touch-action: pan-y; }
.swipe-hint { display:none; }
@media (max-width: 700px) {
  .slide-arrow { display:none; }
  .hymn-slide-content { padding: 20px 14px; }
  .swipe-hint { display:block; }
}

/* ── Key filter dropdown ── */
.key-dropdown {
  background:var(--surface2); border:1.5px solid var(--border2);
  color:var(--gold2); font-family:'JetBrains Mono',monospace;
  font-size:.72rem; font-weight:700; padding:6px 10px;
  border-radius:8px; outline:none; cursor:pointer;
  transition:border-color .15s;
}
.key-dropdown:focus, .key-dropdown:hover { border-color:var(--gold); }

/* ── Editable inline label ── */
.inline-edit-label {
  background:transparent; border:none; border-bottom:1.5px dashed var(--border2);
  color:var(--gold2); font-family:'Cinzel',serif; font-weight:700;
  outline:none; transition:border-color .15s;
}
.inline-edit-label:focus { border-bottom-color:var(--gold); }
`;

function injectStyles() {
  if (document.getElementById("csi-global")) return;
  const s = document.createElement("style");
  s.id = "csi-global";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const PALETTES = {
  standard: ["D","G","A","E","B","C","F"],
  minor:    ["D","Dm","G","Gm","A","Am","E","Em","B","Bm","C","Cm","F","Fm"],
  extended: ["D","D7","Dsus4","G","G7","A","A7","Am","E","E7","Em","B","B7","C","Cmaj7","F","Fm"],
};
const DEMO_HYMN = {
  id: "demo1", number: 1, title: "Hymns of Praise", key: "D",
  lines: [
    [{syl:"ಭೂ",wordBreak:false},{syl:"ಲೋ",wordBreak:false},{syl:"ಕ",wordBreak:false},{syl:"ವೆ",wordBreak:false},{syl:"ಲ್ಲಾ",wordBreak:false},{syl:"ಕ",wordBreak:true},{syl:"ರ್ತ",wordBreak:false},{syl:"ನ",wordBreak:false},{syl:"ಗೆ",wordBreak:false}],
    [{syl:"ಉ",wordBreak:false},{syl:"ತ್ಸಾ",wordBreak:false},{syl:"ಹ",wordBreak:false},{syl:"ಧ್ವ",wordBreak:false},{syl:"ನಿ",wordBreak:false},{syl:"ಎ",wordBreak:true},{syl:"ತ್ತ",wordBreak:false},{syl:"ಲಿ",wordBreak:false}],
    [],
    [{syl:"ಸಂ",wordBreak:false},{syl:"ತೋ",wordBreak:false},{syl:"ಷ",wordBreak:false},{syl:"ಹ",wordBreak:true},{syl:"ರ್ಷ",wordBreak:false},{syl:"ದೊ",wordBreak:false},{syl:"ಡ",wordBreak:false},{syl:"ನೆ",wordBreak:false}],
    [{syl:"ಸ್ತೋ",wordBreak:false},{syl:"ತ್ರ",wordBreak:false},{syl:"ದಿ",wordBreak:false},{syl:"ಸೇ",wordBreak:true},{syl:"ವೆ",wordBreak:false},{syl:"ಮಾ",wordBreak:false},{syl:"ಡ",wordBreak:false},{syl:"ಲಿ",wordBreak:false}],
  ],
  chords: [
    ["D","D","G","","D","A","","","D"],
    ["","","","","","","",""],
    [],
    ["G","","","A","","","","D"],
    ["","","","","","","",""],
  ],
};

// ─────────────────────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10); }

function transposeChord(chord, steps) {
  const m = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!m) return chord;
  let root = m[1]
    .replace("Db","C#").replace("Eb","D#").replace("Fb","E")
    .replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb","B");
  const idx = CHROMATIC.indexOf(root);
  if (idx < 0) return chord;
  return CHROMATIC[(idx + steps + 12) % 12] + m[2];
}

function sortHymns(hymns) {
  return [...hymns].sort((a, b) => {
    if (a.number !== b.number) return a.number - b.number;
    return (a.key || "").localeCompare(b.key || "");
  });
}

function isDuplicate(existing, incoming) {
  return existing.number === incoming.number &&
    existing.title.trim() === incoming.title.trim() &&
    (existing.key || "D").trim().toUpperCase() === (incoming.key || "D").trim().toUpperCase();
}

function ensureChords(hymn) {
  if (!hymn) return hymn;
  const lines = hymn.lines || [];
  const existingChords = hymn.chords || [];
  const chords = lines.map((line, li) => {
    const lineLen = (line || []).length;
    const existing = existingChords[li];
    if (!line || line.length === 0) return [];
    if (Array.isArray(existing) && existing.length === lineLen) return existing;
    const base = Array.isArray(existing) ? existing : [];
    return Array.from({ length: lineLen }, (_, si) => base[si] || "");
  });
  return { ...hymn, chords };
}

function loadStorage(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─────────────────────────────────────────────────────────────
//  SHARED UI ATOMS
// ─────────────────────────────────────────────────────────────
// Returns onTouchStart/onTouchMove/onTouchEnd handlers that call
// onSwipeLeft() / onSwipeRight() once a deliberate horizontal swipe is
// detected — used so mobile users can swipe instead of tapping small
// arrow buttons, freeing the full screen width for lyrics.
function makeSwipeHandlers(onSwipeLeft, onSwipeRight, { threshold = 50 } = {}) {
  let startX = 0, startY = 0, tracking = false;
  return {
    onTouchStart: (e) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; tracking = true;
    },
    onTouchEnd: (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return; // not a real horizontal swipe
      if (dx < 0) onSwipeLeft && onSwipeLeft();
      else onSwipeRight && onSwipeRight();
    },
  };
}

const Btn = ({ children, onClick, variant="default", small, style={}, disabled }) => {
  const base = {
    fontFamily:"'JetBrains Mono',monospace", fontWeight:600,
    fontSize: small ? ".68rem" : ".75rem",
    padding: small ? "3px 9px" : "6px 14px",
    borderRadius: "var(--r)", cursor: disabled ? "not-allowed" : "pointer",
    border:"1px solid transparent", transition:"all .15s", whiteSpace:"nowrap",
    opacity: disabled ? .5 : 1, ...style,
  };
  const variants = {
    default:  { background:"var(--surface2)", borderColor:"var(--border2)", color:"var(--cream2)" },
    primary:  { background:"var(--gold)", borderColor:"var(--gold)", color:"#000" },
    ghost:    { background:"transparent", borderColor:"transparent", color:"var(--muted)" },
    danger:   { background:"transparent", borderColor:"transparent", color:"var(--red)" },
    blue:     { background:"var(--blue)", borderColor:"var(--blue)", color:"#fff" },
    green:    { background:"var(--green)", borderColor:"var(--green)", color:"#fff" },
  };
  return <button onClick={disabled ? undefined : onClick} style={{...base,...variants[variant]}}>{children}</button>;
};

const BigBtn = ({ children, onClick, variant="default", style={}, disabled, icon }) => {
  const variants = {
    default: { background:"var(--surface2)", borderColor:"var(--border2)", color:"var(--cream2)" },
    primary: { background:"var(--gold)", borderColor:"var(--gold2)", color:"#000" },
    ghost:   { background:"transparent", borderColor:"var(--border2)", color:"var(--muted)" },
    blue:    { background:"var(--blue)", borderColor:"var(--blue)", color:"#fff" },
    green:   { background:"var(--green)", borderColor:"var(--green)", color:"#fff" },
    danger:  { background:"transparent", borderColor:"var(--red)", color:"var(--red)" },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="nav-btn-big"
      style={{ ...variants[variant], opacity: disabled ? .4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}
    >
      {icon && <span style={{fontSize:"1.1em"}}>{icon}</span>}
      {children}
    </button>
  );
};

const Modal = ({ open, onClose, title, children, footer, wide }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(4px)"}}>
      <div style={{
        background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,
        width: wide ? 700 : 560, maxWidth:"96vw", maxHeight:"90vh",
        display:"flex",flexDirection:"column",boxShadow:"0 32px 80px #0009",
        animation:"fadeIn .2s ease",
      }}>
        <div style={{padding:"15px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:".88rem",color:"var(--gold2)",letterSpacing:".06em"}}>{title}</span>
          <Btn onClick={onClose} variant="ghost" small>✕</Btn>
        </div>
        <div style={{padding:18,overflowY:"auto",flex:1}}>{children}</div>
        {footer && <div style={{padding:"12px 18px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:8}}>{footer}</div>}
      </div>
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <div style={{fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",color:"var(--muted)",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
    {children}<span style={{flex:1,height:1,background:"var(--border)"}}/>
  </div>
);

const KeyFilterDropdown = ({ hymns, value, onChange, style={} }) => {
  const allKeys = [...new Set(hymns.map(h => h.key || "D"))].sort();
  return (
    <select className="key-dropdown" value={value} onChange={e => onChange(e.target.value)} style={style}>
      <option value="">All Keys</option>
      {allKeys.map(k => <option key={k} value={k}>{k}</option>)}
    </select>
  );
};

// Small "-/+" control used on the user side to resize ONLY the lyrics+chords
// text in the hymn viewer (everything else on screen stays the same size).
const FontSizeControl = ({ scale, onChange, min = 0.7, max = 1.9, step = 0.1 }) => {
  const dec = () => onChange(Math.max(min, Math.round((scale - step) * 100) / 100));
  const inc = () => onChange(Math.min(max, Math.round((scale + step) * 100) / 100));
  const btnStyle = (disabled) => ({
    width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--border2)",
    background: "var(--surface2)", color: disabled ? "var(--muted)" : "var(--gold2)",
    cursor: disabled ? "not-allowed" : "pointer", fontSize: "1rem", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0,
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 6px" }}>
      <button onClick={dec} disabled={scale <= min} style={btnStyle(scale <= min)} title="Smaller text">−</button>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".64rem", color: "var(--muted)", minWidth: 34, textAlign: "center" }}>{Math.round(scale * 100)}%</span>
      <button onClick={inc} disabled={scale >= max} style={btnStyle(scale >= max)} title="Bigger text">+</button>
    </div>
  );
};

export {
  GLOBAL_CSS, injectStyles,
  CHROMATIC, PALETTES, DEMO_HYMN,
  uid, transposeChord, sortHymns, isDuplicate, ensureChords,
  loadStorage, saveStorage,
  Btn, BigBtn, Modal, SectionLabel, KeyFilterDropdown, FontSizeControl, makeSwipeHandlers,
};
