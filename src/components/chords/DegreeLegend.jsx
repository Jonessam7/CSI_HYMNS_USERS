// © JSE7EN · Jones Samuel — CSI Hymns
// components/chords/DegreeLegend.jsx — the fixed colour legend: 1 red · 2 orange · 3 yellow · 4 green · 5 blue · 6 violet · 7 pink
import { DEGREE_COLORS } from "../../lib/chords/scaleColors.js";

export default function DegreeLegend({ scaleNotes, active, onPick }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }} data-testid="degree-legend">
      {[1, 2, 3, 4, 5, 6, 7].map(d => (
        <button key={d} onClick={() => onPick && onPick(d)} title={`Degree ${d}`}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 46, padding: "6px 4px", borderRadius: 10, cursor: onPick ? "pointer" : "default",
            border: `2px solid ${active === d ? "#fff" : "transparent"}`, background: DEGREE_COLORS[d] + "33" }}>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: DEGREE_COLORS[d], color: "#111", fontWeight: 800, fontSize: ".8rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace" }}>{d}</span>
          <span style={{ fontSize: ".66rem", color: "var(--cream2)", fontFamily: "'JetBrains Mono',monospace" }}>{scaleNotes ? scaleNotes[d - 1] : ""}</span>
        </button>
      ))}
    </div>
  );
}
