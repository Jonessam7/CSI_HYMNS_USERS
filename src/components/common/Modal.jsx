// © JSE7EN · Jones Samuel — CSI Hymns
// components/common/Modal.jsx
import { Btn } from "./Btn.jsx";

export const Modal = ({ open, onClose, title, children, footer, wide }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(4px)"}}>
      <div style={{
        background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,
        width: wide ? 700 : 560, maxWidth:"96vw", maxHeight:"90vh",
        display:"flex",flexDirection:"column",boxShadow:"0 32px 80px #0009",
        animation:"fadeIn .2s ease",
      }}>
        <div style={{padding:"15px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:".88rem",color:"var(--gold2)",letterSpacing:".06em"}}>{title}</span>
          <Btn onClick={onClose} variant="ghost" small>✕</Btn>
        </div>
        <div style={{padding:18,overflowY:"auto",flex:1}}>{children}</div>
        {footer && <div style={{padding:"12px 18px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:8}}>{footer}</div>}
      </div>
    </div>
  );
};
