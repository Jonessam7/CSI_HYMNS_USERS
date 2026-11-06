// © JSE7EN · Jones Samuel — CSI Hymns
// components/chords/ChordSections.jsx — chord chips grouped by the categories the Admin enabled
import { GROUP_META } from "../../lib/chords/chordGuideConfig.js";
import { DEGREE_COLORS } from "../../lib/chords/scaleColors.js";

export default function ChordSections({ sections, selected, onSelect }) {
  return (
    <div>
      {sections.map(sec => {
        const meta = GROUP_META.find(g => g.id === sec.id);
        return (
          <div key={sec.id} style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".08em", color: "var(--muted)", marginBottom: 5 }} title={meta?.hint}>{meta?.title.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sec.items.map(it => {
                const on = selected && selected.label === it.label && selected.chord === it.chord;
                return (
                  <button key={it.label} data-testid="chord-chip" onClick={() => onSelect(it)}
                    style={{ cursor: "pointer", padding: "5px 9px", borderRadius: 9, textAlign: "center", minWidth: 52,
                      border: `2px solid ${on ? "#fff" : it.degree ? DEGREE_COLORS[it.degree] : "var(--border2)"}`,
                      background: on ? (it.degree ? DEGREE_COLORS[it.degree] : "var(--gold)") : "var(--surface2)", color: on ? "#111" : "var(--cream)" }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: ".9rem" }}>{it.chord}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".58rem", opacity: .8 }}>{it.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
