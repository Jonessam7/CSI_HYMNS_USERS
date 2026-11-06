// © JSE7EN · Jones Samuel — CSI Hymns
// components/common/Btn.jsx

export const Btn = ({ children, onClick, variant="default", small, style={}, disabled }) => {
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
