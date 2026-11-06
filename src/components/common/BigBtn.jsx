// © JSE7EN · Jones Samuel — CSI Hymns
// components/common/BigBtn.jsx

export const BigBtn = ({ children, onClick, variant="default", style={}, disabled, icon }) => {
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
