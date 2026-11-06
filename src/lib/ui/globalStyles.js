// © JSE7EN · Jones Samuel — CSI Hymns
// lib/ui/globalStyles.js — global CSS string and injectStyles()
// ─────────────────────────────────────────────────────────────
//  GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
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

export function injectStyles() {
  if (document.getElementById("csi-global")) return;
  const s = document.createElement("style");
  s.id = "csi-global";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}
