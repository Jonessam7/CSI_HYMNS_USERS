// © JSE7EN · Jones Samuel — CSI Hymns
// components/chords/ChordGuidePage.jsx — "Chord Guide" page: pick a key, see its scale in colours on a piano, learn every chord
import { useState } from "react";
import { useChordGuide } from "../../context/ChordGuideContext.jsx";
import { MAJOR_DB_KEYS, MINOR_DB_KEYS } from "../../lib/chords/dbKeys.js";
import { chordsForKey } from "../../lib/chords/chordsForKey.js";
import { DEGREE_COLORS, DEGREE_NAMES } from "../../lib/chords/scaleColors.js";
import ChordSections from "./ChordSections.jsx";
import ChordDetail from "./ChordDetail.jsx";
import DegreeLegend from "./DegreeLegend.jsx";

export default function ChordGuidePage({ initialKey }) {
  const { db, settings } = useChordGuide();
  const keys = [...(settings.families.major ? MAJOR_DB_KEYS : []), ...(settings.families.minor ? MINOR_DB_KEYS : [])];
  const [keyName, setKeyName] = useState(keys.includes(initialKey) ? initialKey : keys[0]);
  const [sel, setSel] = useState(null);
  const [degree, setDegree] = useState(null);
  if (!db) return <p style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>Loading chord guide…</p>;
  const info = chordsForKey(db, keyName, settings.groups);
  const pickKey = (k) => { setKeyName(k); setSel(null); setDegree(null); };
  const pickDegree = (d) => { setDegree(d); setSel(info.diatonic[d - 1]); };
  const row = (list, title) => list.length > 0 && (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".1em", color: "var(--muted)", marginBottom: 5 }}>{title}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {list.map(k => (
          <button key={k} data-testid="key-btn" onClick={() => pickKey(k)} style={{ cursor: "pointer", padding: "6px 11px", borderRadius: 9, fontFamily: "'JetBrains Mono',monospace", fontSize: ".74rem", fontWeight: 700,
            border: `1.5px solid ${keyName === k ? "var(--gold)" : "var(--border2)"}`, background: keyName === k ? "var(--gold)" : "var(--surface2)", color: keyName === k ? "#000" : "var(--cream2)" }}>{k.replace(" Major", "").replace(" Minor", "m")}</button>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "22px 18px 50px" }}>
      <h2 style={{ fontFamily: "'Cinzel',serif", color: "var(--gold2)", fontSize: "1.2rem", marginBottom: 4 }}>🎹 Chord Guide</h2>
      <p style={{ color: "var(--muted)", fontSize: ".78rem", marginBottom: 16 }}>Pick a key. Every scale uses the same colours — <b style={{ color: DEGREE_COLORS[1] }}>1</b> <b style={{ color: DEGREE_COLORS[2] }}>2</b> <b style={{ color: DEGREE_COLORS[3] }}>3</b> <b style={{ color: DEGREE_COLORS[4] }}>4</b> <b style={{ color: DEGREE_COLORS[5] }}>5</b> <b style={{ color: DEGREE_COLORS[6] }}>6</b> <b style={{ color: DEGREE_COLORS[7] }}>7</b> — so you can learn them by colour. Tap a coloured key to see the chord built on it.</p>
      {row(keys.filter(k => k.endsWith("Major")), "MAJOR KEYS")}
      {row(keys.filter(k => k.endsWith("Minor")), "MINOR KEYS")}
      {info ? (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border2)" }}>
          <div style={{ textAlign: "center", fontFamily: "'Cinzel',serif", color: "var(--gold2)", fontSize: "1rem", marginBottom: 10 }} data-testid="guide-key">{keyName} scale</div>
          <DegreeLegend scaleNotes={info.scaleNotes} active={degree} onPick={pickDegree} />
          <div style={{ height: 12 }} />
          <ChordDetail info={info} chord={sel} onKeyClick={(pc) => { const d = info.scalePcs.get(pc); if (d) pickDegree(d); }} />
          {degree && <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--muted)", margin: "8px 0 0" }}>Degree {degree} — {DEGREE_NAMES[degree]}</p>}
          <div style={{ height: 14 }} />
          <ChordSections sections={info.sections} selected={sel} onSelect={(it) => { setSel(it); setDegree(it.degree); }} />
        </div>
      ) : <p style={{ color: "var(--muted)" }}>No chord data for this key.</p>}
    </div>
  );
}
