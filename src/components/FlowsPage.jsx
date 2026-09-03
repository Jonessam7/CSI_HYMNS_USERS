import { useState } from "react";
import { BigBtn, saveStorage, uid } from "../lib/core.jsx";
import FlowEditor from "./FlowEditor.jsx";

//  USER — FLOW LIST PAGE
// ─────────────────────────────────────────────────────────────
const FlowsPage = ({ hymns, flows, setFlows, onStartFlow, onBack }) => {
  const [editFlow, setEditFlow] = useState(null);
  const newFlow = () => {
    const f = { id:uid(), name:"New Flow", label:"", hymnIds:[], createdAt:Date.now() };
    const next = [...flows, f]; setFlows(next); saveStorage("csiFlows", next); setEditFlow(f);
  };
  const saveFlow = (updated) => {
    const next = flows.map(f=>f.id===updated.id?updated:f);
    setFlows(next); saveStorage("csiFlows", next); setEditFlow(null);
  };
  const deleteFlow = (id) => {
    if(!confirm("Delete this flow?")) return;
    const next = flows.filter(f=>f.id!==id); setFlows(next); saveStorage("csiFlows", next);
  };
  if (editFlow) return <FlowEditor flow={editFlow} hymns={hymns} onSave={saveFlow} onClose={()=>setEditFlow(null)}/>;
  const hymnById = Object.fromEntries(hymns.map(h=>[h.id,h]));

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      <div className="cross-bg"/>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",background:"var(--surface)",borderBottom:"1px solid var(--border)",zIndex:10}}>
        <BigBtn onClick={onBack} variant="ghost" icon="←">Back</BigBtn>
        <h1 style={{fontFamily:"'Cinzel',serif",fontSize:"1.05rem",color:"var(--gold2)",flex:1}}>✝ My Service Flows</h1>
        <BigBtn variant="primary" onClick={newFlow} icon="＋">New Flow</BigBtn>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"28px",position:"relative",zIndex:1}}>
        {flows.length===0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"50vh",gap:18,color:"var(--muted)"}}>
            <div style={{fontSize:"3rem",opacity:.25}}>🙏</div>
            <p style={{textAlign:"center",fontSize:".95rem"}}>No flows yet. Create one to organize hymns.</p>
            <BigBtn variant="primary" onClick={newFlow} icon="＋">Create Flow</BigBtn>
          </div>
        ) : (
          <div style={{maxWidth:720,margin:"0 auto",display:"grid",gap:16}}>
            {flows.map(f => {
              const hymnList = f.hymnIds.map(id=>hymnById[id]).filter(Boolean);
              return (
                <div key={f.id} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",transition:"border-color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border2)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:hymnList.length?"1px solid var(--border)":"none"}}>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:"1rem",color:"var(--gold2)",marginBottom:2}}>{f.name}</div>
                      {f.label && <div style={{fontSize:".78rem",color:"var(--muted)",fontStyle:"italic",marginBottom:3}}>{f.label}</div>}
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:"var(--muted)"}}>{f.hymnIds.length} hymn{f.hymnIds.length!==1?"s":""}</div>
                    </div>
                    <BigBtn onClick={()=>setEditFlow(f)} icon="✏">Edit</BigBtn>
                    <BigBtn variant="primary" onClick={()=>onStartFlow(f)} disabled={f.hymnIds.length===0} icon="▶">Start</BigBtn>
                    <BigBtn variant="danger" onClick={()=>deleteFlow(f.id)} icon="🗑">Delete</BigBtn>
                  </div>
                  {hymnList.length > 0 && (
                    <div style={{padding:"10px 20px",display:"flex",flexWrap:"wrap",gap:6}}>
                      {hymnList.map(h=>(
                        <span key={h.id} style={{display:"inline-flex",alignItems:"center",gap:5,fontFamily:"'Crimson Pro',serif",fontSize:".82rem",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:20,padding:"3px 12px",color:"var(--cream2)"}}>
                          <span style={{fontFamily:"'Cinzel',serif",fontSize:".6rem",color:"var(--gold)"}}>#{h.number}</span>
                          {h.title}
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".54rem",color:"var(--muted)"}}>{h.key||"D"}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default FlowsPage;
