import { useState } from "react";
import { LEVELS } from "../lib/core.jsx";
import KeyTiles from "./KeyTiles.jsx";
import { sortKeys, keyShort, isMinorKey } from "../lib/keys.js";

// Browse page: pick a hymn number → its available keys open right under it → tap a key.
const HymnsPage = ({ groups, onOpen }) => {
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("all");        // all | major | minor
  const [keyFilter, setKeyFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [openNum, setOpenNum] = useState(null);

  const allKeys = sortKeys([...new Set(groups.flatMap(g => g.map(h => h.key || "D")))]);
  const levelsPresent = LEVELS.filter(l => groups.some(g => g.some(h => (h.variants || [h]).some(v => (v.level || "Easy") === l))));
  const shownKeys = allKeys.filter(k => family === "all" || (family === "minor") === isMinorKey(k));

  const list = groups.filter(g => {
    const rep = g[0];
    const q = search.trim().toLowerCase();
    if (q && !rep.title.toLowerCase().includes(q) && !String(rep.number).includes(q)) return false;
    if (family !== "all" && !g.some(h => (family === "minor") === isMinorKey(h.key || "D"))) return false;
    if (keyFilter && !g.some(h => (h.key || "D") === keyFilter)) return false;
    if (levelFilter && !g.some(h => (h.variants || [h]).some(v => (v.level || "Easy") === levelFilter))) return false;
    return true;
  });

  const open = (g) => {
    const keys = keyFilter ? g.filter(h => (h.key || "D") === keyFilter) : g;
    if (keys.length === 1) { onOpen(keys[0]); return; }
    setOpenNum(openNum === g[0].number ? null : g[0].number);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "22px 18px 60px" }}>
      <div className="searchbar"><span>🔍</span>
        <input aria-label="Search hymns" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by hymn number or title…" />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1rem" }}>✕</button>}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "14px 0 6px" }}>
        <div className="seg" role="tablist">
          {[["all", "All"], ["major", "Major"], ["minor", "Minor"]].map(([v, l]) => (
            <button key={v} className={family === v ? "on" : ""} onClick={() => { setFamily(v); setKeyFilter(""); }}>{l}</button>
          ))}
        </div>
        {levelsPresent.length > 1 && (
          <select aria-label="Level" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
            style={{ background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--cream)", padding: "8px 12px", borderRadius: 12, fontFamily: "'Cinzel',serif", fontSize: ".7rem", outline: "none" }}>
            <option value="">All levels</option>{levelsPresent.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        )}
      </div>
      {shownKeys.length > 1 && (
        <div className="chiprow" style={{ marginBottom: 10 }}>
          <span className={`chip${keyFilter === "" ? " on" : ""}`} onClick={() => setKeyFilter("")}>Any key</span>
          {shownKeys.map(k => <span key={k} className={`chip${isMinorKey(k) ? " minor" : ""}${keyFilter === k ? " on" : ""}`} onClick={() => setKeyFilter(keyFilter === k ? "" : k)}>{keyShort(k)}</span>)}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 8 }}>
        {list.map(g => {
          const rep = g[0]; const isOpen = openNum === rep.number;
          const keys = sortKeys(g.map(h => h.key || "D"));
          return (
            <div key={rep.number} className={`hcard${isOpen ? " open" : ""}`} data-testid={`hymn-${rep.number}`}>
              <div className="hcard-head" onClick={() => open(g)} role="button" tabIndex={0} onKeyDown={e => (e.key === "Enter" || e.key === " ") && open(g)}>
                <span className="num">{rep.number}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="htitle">{rep.title}</div>
                  {!isOpen && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                      {keys.slice(0, 8).map(k => <span key={k} className={`chip sm${isMinorKey(k) ? " minor" : ""}${k === keyFilter ? " on" : ""}`}
                        onClick={e => { e.stopPropagation(); onOpen(g.find(h => (h.key || "D") === k)); }}>{keyShort(k)}</span>)}
                      {keys.length > 8 && <span className="hmeta">+{keys.length - 8}</span>}
                    </div>
                  )}
                  {isOpen && <div className="hmeta">{keys.length} key{keys.length > 1 ? "s" : ""} available — choose one</div>}
                </div>
                {keys.length > 1 && <span className="caret">›</span>}
              </div>
              {isOpen && <KeyTiles group={g} onPick={onOpen} />}
            </div>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="empty">
          <div className="big">{groups.length === 0 ? "🙏" : "🔍"}</div>
          <h3>{groups.length === 0 ? "Hymns are being added" : "No hymns found"}</h3>
          <p>{groups.length === 0 ? "Please check back soon." : `Nothing matches${search ? ` “${search}”` : " those filters"}.`}</p>
        </div>
      )}
    </div>
  );
};
export default HymnsPage;
