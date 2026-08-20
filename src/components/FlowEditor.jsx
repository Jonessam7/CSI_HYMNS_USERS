import { useState } from "react";
import { BigBtn, Modal, KeyFilterDropdown } from "../lib/core.jsx";
import KeySelectionModal from "./KeySelectionModal.jsx";

//  USER — FLOW EDITOR
// ─────────────────────────────────────────────────────────────
const FlowEditor = ({ flow, hymns, onSave, onClose }) => {
  const [name, setName] = useState(flow.name);
  const [label, setLabel] = useState(flow.label || "");
  const [items, setItems] = useState([...flow.hymnIds]);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pendingGroup, setPendingGroup] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [pickerKeyFilter, setPickerKeyFilter] = useState("");
  const [pickerSearch, setPickerSearch] = useState("");

  const hymnById = Object.fromEntries(hymns.map(h=>[h.id,h]));
  const hymnGroups = {};
  hymns.forEach(h => { if (!hymnGroups[h.number]) hymnGroups[h.number] = []; hymnGroups[h.number].push(h); });

  const uniqueNumbers = Object.keys(hymnGroups).map(Number).sort((a,b)=>a-b).filter(num => {
    const group = hymnGroups[num];
    const matchKey = !pickerKeyFilter || group.some(h => (h.key||"D") === pickerKeyFilter);
    const matchSearch = !pickerSearch || group[0].title.toLowerCase().includes(pickerSearch.toLowerCase()) || String(num).includes(pickerSearch);
    return matchKey && matchSearch;
  });

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

  const handlePickerSelect = (num) => {
    const group = hymnGroups[num];
    if (!group) return;
    if (pickerKeyFilter) {
      const matched = group.find(h => (h.key||"D") === pickerKeyFilter);
      if (matched) {
        if (!items.includes(matched.id)) setItems(it=>[...it, matched.id]);
        setShowPicker(false); return;
      }
    }
    if (group.length === 1) {
      if (!items.includes(group[0].id)) setItems(it=>[...it, group[0].id]);
      setShowPicker(false);
    } else {
      setPendingGroup({number:num, title:group[0].title, hymns:group});
      setShowPicker(false); setShowKeyModal(true);
    }
  };

  const handleKeySelected = (h) => {
    if (!items.includes(h.id)) setItems(it=>[...it, h.id]);
    setPendingGroup(null); setShowKeyModal(false);
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
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:"var(--gold2)",marginTop:2}}>Key: {h.key||"D"}</div>
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

      {showPicker && (
        <div onClick={e=>e.target===e.currentTarget&&setShowPicker(false)}
          style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}>
          <div style={{background:"var(--surface)",borderTop:"1px solid var(--border2)",borderRadius:"16px 16px 0 0",width:"100%",maxWidth:640,maxHeight:"70vh",display:"flex",flexDirection:"column",boxShadow:"0 -12px 40px #0008"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:".85rem",color:"var(--gold2)"}}>Select Hymn</span>
              <div style={{display:"flex",gap:8,flex:1,justifyContent:"flex-end",flexWrap:"wrap"}}>
                <input value={pickerSearch} onChange={e=>setPickerSearch(e.target.value)} placeholder="Search…"
                  style={{background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--cream)",padding:"5px 10px",borderRadius:8,fontSize:".75rem",fontFamily:"'JetBrains Mono',monospace",outline:"none",width:130}}/>
                <KeyFilterDropdown hymns={hymns} value={pickerKeyFilter} onChange={setPickerKeyFilter}/>
              </div>
              <BigBtn onClick={()=>setShowPicker(false)} variant="ghost">✕</BigBtn>
            </div>
            <div style={{overflowY:"auto",padding:12}}>
              {uniqueNumbers.map(num => {
                const group=hymnGroups[num], firstHymn=group[0];
                const keysAvailable=group.map(h=>h.key||"D");
                const alreadyAdded=group.some(h=>items.includes(h.id));
                return (
                  <div key={num} onClick={()=>!alreadyAdded&&handlePickerSelect(num)}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,marginBottom:6,cursor:alreadyAdded?"not-allowed":"pointer",background:alreadyAdded?"var(--surface2)":"var(--surface)",border:`1px solid ${alreadyAdded?"var(--border)":"var(--border2)"}`,opacity:alreadyAdded?.5:1,transition:"border-color .12s"}}
                    onMouseEnter={e => { if(!alreadyAdded) e.currentTarget.style.borderColor="var(--gold)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=alreadyAdded?"var(--border)":"var(--border2)"; }}>
                    <span style={{fontFamily:"'Cinzel',serif",fontSize:".65rem",color:"var(--gold)",minWidth:38}}>#{num}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:".9rem",marginBottom:4}}>{firstHymn.title}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {keysAvailable.map(k=><span key={k} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".58rem",padding:"2px 8px",borderRadius:8,background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--gold2)"}}>{k}</span>)}
                      </div>
                    </div>
                    {group.length>1 && <span style={{fontSize:".68rem",color:"var(--muted)",whiteSpace:"nowrap"}}>{group.length} keys →</span>}
                    {alreadyAdded && <span style={{fontSize:".68rem",color:"var(--green)"}}>✓ added</span>}
                  </div>
                );
              })}
              {uniqueNumbers.length===0 && <p style={{textAlign:"center",color:"var(--muted)",padding:"30px 0",fontSize:".82rem"}}>No hymns match</p>}
            </div>
          </div>
        </div>
      )}
      {pendingGroup && (
        <KeySelectionModal open={showKeyModal} onClose={()=>{setShowKeyModal(false);setPendingGroup(null);setShowPicker(true);}}
          hymnNumber={pendingGroup.number} hymnTitle={pendingGroup.title} availableHymns={pendingGroup.hymns} onSelect={handleKeySelected}/>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default FlowEditor;
