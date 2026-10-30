import { useState } from "react";
import { BigBtn } from "../lib/core.jsx";
import HymnPickerSheet from "./HymnPickerSheet.jsx";
import { keyShort } from "../lib/keys.js";

//  USER — FLOW EDITOR
// ─────────────────────────────────────────────────────────────
const FlowEditor = ({ flow, hymns, onSave, onClose }) => {
  const [name, setName] = useState(flow.name);
  const [label, setLabel] = useState(flow.label || "");
  const [items, setItems] = useState([...flow.hymnIds]);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [swapIdx, setSwapIdx] = useState(null);       // index of the flow item whose key is being changed

  const hymnById = Object.fromEntries(hymns.map(h=>[h.id,h]));
  const hymnGroups = {};
  hymns.forEach(h => { if (!hymnGroups[h.number]) hymnGroups[h.number] = []; hymnGroups[h.number].push(h); });
  const groups = Object.values(hymnGroups).sort((a,b)=>a[0].number-b[0].number);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (e, i) => {
    e.preventDefault();
    if (dragIdx===null||dragIdx===i) { setDragIdx(null); setOverIdx(null); return; }
    const next = [...items]; const [moved] = next.splice(dragIdx,1); next.splice(i,0,moved);
    setItems(next); setDragIdx(null); setOverIdx(null);
  };
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null); };
  const remove = (i) => setItems(it=>it.filter((_,idx)=>idx!==i));
  const moveItem = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems(it => {
      const next = [...it];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const onPick = (h) => {
    if (swapIdx !== null) { setItems(it => it.map((id, i) => i === swapIdx ? h.id : id)); return; }
    if (!items.includes(h.id)) setItems(it => [...it, h.id]);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"var(--bg)"}}>
      <div className="cross-bg"/>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",background:"var(--surface)",borderBottom:"1px solid var(--border)",zIndex:10}}>
        <BigBtn onClick={onClose} variant="ghost" icon="←">Back</BigBtn>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Flow Name…"
            className="inline-edit-label"
            style={{fontSize:"1rem",width:"100%"}}
          />
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. Sunday Morning, Christmas Service…)"
            className="inline-edit-label"
            style={{fontSize:".72rem",color:"var(--muted)",width:"100%"}}
          />
        </div>
        <BigBtn variant="green" onClick={() => onSave({...flow, name, label, hymnIds:items})} icon="💾">Save Flow</BigBtn>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 32px",position:"relative",zIndex:1}}>
        <div style={{maxWidth:620,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"1rem",color:"var(--gold2)"}}>
              {items.length} hymn{items.length!==1?"s":""} in flow
            </h2>
            <BigBtn variant="primary" onClick={() => setShowPicker(true)} icon="＋">Add Hymn</BigBtn>
          </div>
          {items.length===0 && (
            <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}>
              <div style={{fontSize:"2rem",opacity:.3,marginBottom:12}}>🎵</div>
              <p>No hymns yet — click Add Hymn</p>
            </div>
          )}
          {items.map((id,i) => {
            const h = hymnById[id]; if(!h) return null;
            const isDragging=dragIdx===i, isOver=overIdx===i&&dragIdx!==null&&dragIdx!==i;
            return (
              <div key={`${id}-${i}`} draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDrop={e=>onDrop(e,i)} onDragEnd={onDragEnd}
                style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderRadius:12,marginBottom:8,background:isDragging?"var(--surface3)":"var(--surface)",border:`2px solid ${isOver?"var(--gold)":isDragging?"var(--gold)":"var(--border)"}`,opacity:isDragging?.55:1,cursor:"grab",transition:"border-color .15s"}}>
                <span className="drag-handle" style={{fontSize:"1.1rem",color:"var(--muted)"}}>⠿</span>
                <div style={{width:28,height:28,borderRadius:"50%",background:"var(--surface2)",border:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",fontWeight:700,color:"var(--muted)"}}>{i+1}</span>
                </div>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:".65rem",color:"var(--gold)",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:20,padding:"2px 10px",minWidth:38,textAlign:"center",flexShrink:0}}>#{h.number}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:".92rem",color:"var(--cream)"}}>{h.title}</div>
                  <button className="rowbtn" style={{marginTop:5}} title="Change key" onClick={()=>setSwapIdx(i)}>Key {keyShort(h.key||"D")} ⇅</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  <button onClick={()=>moveItem(i,-1)} disabled={i===0}
                    style={{width:26,height:22,borderRadius:6,border:"1px solid var(--border2)",background:"var(--surface2)",color:i===0?"var(--muted)":"var(--gold2)",cursor:i===0?"not-allowed":"pointer",opacity:i===0?.4:1,fontSize:".7rem",lineHeight:1}}>▲</button>
                  <button onClick={()=>moveItem(i,1)} disabled={i===items.length-1}
                    style={{width:26,height:22,borderRadius:6,border:"1px solid var(--border2)",background:"var(--surface2)",color:i===items.length-1?"var(--muted)":"var(--gold2)",cursor:i===items.length-1?"not-allowed":"pointer",opacity:i===items.length-1?.4:1,fontSize:".7rem",lineHeight:1}}>▼</button>
                </div>
                <BigBtn variant="danger" onClick={()=>remove(i)}>✕</BigBtn>
              </div>
            );
          })}
        </div>
      </div>

      {(showPicker || swapIdx !== null) && (
        <HymnPickerSheet groups={groups} addedIds={items} swap={swapIdx !== null}
          startNumber={swapIdx !== null ? hymnById[items[swapIdx]]?.number : null}
          onPick={onPick} onClose={() => { setShowPicker(false); setSwapIdx(null); }}/>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default FlowEditor;
