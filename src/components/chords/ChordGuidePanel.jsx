// © JSE7EN · Jones Samuel — CSI Hymns
// components/chords/ChordGuidePanel.jsx — 🎹 Chord Guide card in the top-left corner of a hymn (chords of THIS hymn's key)
import { useState } from "react";
import { useChordGuide } from "../../context/ChordGuideContext.jsx";
import { dbKeyName } from "../../lib/chords/dbKeys.js";
import { chordsForKey } from "../../lib/chords/chordsForKey.js";
import ChordSections from "./ChordSections.jsx";
import ChordDetail from "./ChordDetail.jsx";

export default function ChordGuidePanel({ hymnKey }) {
  const { db, settings, openGuide } = useChordGuide();
  const [open, setOpen] = useState(!!settings?.panelOpenByDefault);
  const [sel, setSel] = useState(null);
  if (!db || !settings?.showInHymn) return null;
  const keyName = dbKeyName(hymnKey);
  const info = chordsForKey(db, keyName, settings.groups);
  if (!info || !info.sections.length) return null;
  return (
    <div style={{ position: "absolute", left: 10, top: 10, zIndex: 30, width: open ? "min(340px, calc(100% - 20px))" : "auto" }} data-testid="chord-guide-panel">
      <button onClick={() => setOpen(o => !o)} data-testid="chord-guide-toggle"
        style={{ cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".04em", padding: "7px 14px", borderRadius: 20,
          border: "1.5px solid var(--gold)", background: open ? "var(--gold)" : "var(--surface)", color: open ? "#000" : "var(--gold2)", boxShadow: "0 2px 10px #0008" }}>
        🎹 Chord Guide · {keyName} {open ? "▴" : "▾"}
      </button>
      {open && (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border2)", boxShadow: "0 8px 30px #000a", maxHeight: "70vh", overflowY: "auto" }}>
          <ChordSections sections={info.sections} selected={sel} onSelect={setSel} />
          <ChordDetail info={info} chord={sel} compact />
          {!sel && <p style={{ textAlign: "center", fontSize: ".66rem", color: "var(--muted)", margin: "6px 0 0" }}>Tap a chord to see it on the piano</p>}
          {settings.showPage && <button onClick={() => openGuide(keyName)} style={{ marginTop: 10, width: "100%", cursor: "pointer", padding: "6px 0", borderRadius: 10, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--gold2)", fontSize: ".72rem" }}>Open full Chord Guide ›</button>}
        </div>
      )}
    </div>
  );
}
