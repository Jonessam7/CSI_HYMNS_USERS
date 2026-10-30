import { useState } from "react";
import { BigBtn } from "../lib/core.jsx";
import KeyTiles from "./KeyTiles.jsx";
import { sortKeys, keyShort, isMinorKey } from "../lib/keys.js";

// Bottom sheet used by the flow builder: search a hymn → its keys appear → tap a key to add it.
// In add mode the sheet stays open so several hymns can be added in a row; in swap mode it closes after one pick.
const HymnPickerSheet = ({ groups, addedIds, startNumber = null, swap = false, onPick, onClose }) => {
  const [search, setSearch] = useState("");
  const [num, setNum] = useState(startNumber);
  const [toast, setToast] = useState("");
  const group = num != null ? groups.find(g => g[0].number === num) : null;
  const list = groups.filter(g => { const q = search.trim().toLowerCase(); return !q || g[0].title.toLowerCase().includes(q) || String(g[0].number).includes(q); });

  const pick = (h) => {
    onPick(h);
    if (swap) { onClose(); return; }
    setToast(`✓ Added #${h.number} ${h.title} in ${keyShort(h.key || "D")}`);
    setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="sheet-back" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-label="Choose hymn">
        <div className="sheet-head">
          {group && !swap && <button className="rowbtn" onClick={() => setNum(null)}>‹ All hymns</button>}
          <span className="ttl">{group ? `#${group[0].number} · ${group[0].title}` : "Add a hymn"}</span>
          <BigBtn variant="primary" onClick={onClose}>Done</BigBtn>
        </div>
        <div className="sheet-body">
          {!group && (<>
            <div className="searchbar" style={{ marginBottom: 12 }}><span>🔍</span>
              <input aria-label="Search hymn to add" autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Hymn number or title…" /></div>
            {list.map(g => {
              const keys = sortKeys(g.map(h => h.key || "D")); const added = g.filter(h => addedIds.includes(h.id)).length;
              return (
                <div key={g[0].number} className="hcard" style={{ marginBottom: 9 }} data-testid={`pick-${g[0].number}`}>
                  <div className="hcard-head" onClick={() => setNum(g[0].number)} style={{ padding: "11px 14px" }}>
                    <span className="num" style={{ minWidth: 44, height: 44, fontSize: ".85rem" }}>{g[0].number}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="htitle" style={{ fontSize: "1.05rem", marginBottom: 5 }}>{g[0].title}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{keys.slice(0, 7).map(k => <span key={k} className={`chip sm${isMinorKey(k) ? " minor" : ""}`} style={{ cursor: "inherit" }}>{keyShort(k)}</span>)}{keys.length > 7 && <span className="hmeta">+{keys.length - 7}</span>}</div>
                    </div>
                    {added > 0 && <span style={{ fontSize: ".68rem", color: "#7fe0a0" }}>✓ {added}</span>}
                    <span className="caret">›</span>
                  </div>
                </div>
              );
            })}
            {list.length === 0 && <div className="empty" style={{ padding: "30px 0" }}><p>{groups.length ? "No hymns match" : "No hymns published yet"}</p></div>}
          </>)}
          {group && (<>
            <p style={{ color: "var(--muted)", fontSize: ".9rem", fontStyle: "italic" }}>{swap ? "Pick the key to use instead:" : "Pick a key to add it to your flow:"}</p>
            <KeyTiles group={group} addedIds={addedIds} onPick={pick} />
          </>)}
          {toast && <div className="toast" data-testid="toast">{toast}</div>}
        </div>
      </div>
    </div>
  );
};
export default HymnPickerSheet;
