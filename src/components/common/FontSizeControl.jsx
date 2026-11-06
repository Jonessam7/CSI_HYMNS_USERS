// © JSE7EN · Jones Samuel — CSI Hymns
// components/common/FontSizeControl.jsx

// Small "-/+" control used on the user side to resize ONLY the lyrics+chords
// text in the hymn viewer (everything else on screen stays the same size).
export const FontSizeControl = ({ scale, onChange, min = 0.7, max = 1.9, step = 0.1 }) => {
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
