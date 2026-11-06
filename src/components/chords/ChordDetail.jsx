// © JSE7EN · Jones Samuel — CSI Hymns
// components/chords/ChordDetail.jsx — piano + note list for the chosen chord (with a 🔊 button)
import PianoKeyboard from "./PianoKeyboard.jsx";
import { voiceChord } from "../../lib/chords/voicing.js";
import { playIndices } from "../../lib/chords/audio.js";
import { DEGREE_COLORS, OUT_OF_SCALE_COLOR } from "../../lib/chords/scaleColors.js";

export default function ChordDetail({ info, chord, compact, onKeyClick }) {
  const voiced = chord ? voiceChord(chord.notes) : [];
  return (
    <div>
      {chord && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
          <b style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "1.05rem", color: "var(--gold2)" }} data-testid="chord-name">{chord.chord}</b>
          {chord.notes.map(n => {
            const d = info.scalePcs.get(voiceChord([n])[0].pc);
            return <span key={n} style={{ padding: "2px 8px", borderRadius: 12, background: d ? DEGREE_COLORS[d] : OUT_OF_SCALE_COLOR, color: "#111", fontWeight: 800, fontSize: ".72rem", fontFamily: "'JetBrains Mono',monospace" }}>{n}{d ? ` · ${d}` : ""}</span>;
          })}
          <button onClick={() => playIndices(voiced.map(v => v.idx))} title="Hear it" style={{ cursor: "pointer", border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--cream)", borderRadius: 20, padding: "3px 10px" }}>🔊</button>
        </div>
      )}
      <PianoKeyboard scalePcs={info.scalePcs} chordKeys={voiced} compact={compact} onKeyClick={onKeyClick} />
    </div>
  );
}
