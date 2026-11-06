// © JSE7EN · Jones Samuel — CSI Hymns
// components/common/SectionLabel.jsx

export const SectionLabel = ({ children }) => (
  <div style={{fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",color:"var(--muted)",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
    {children}<span style={{flex:1,height:1,background:"var(--border)"}}/>
  </div>
);
