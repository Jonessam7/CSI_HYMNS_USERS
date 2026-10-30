import { LEVELS } from "../lib/core.jsx";
import { sortKeys, keyShort, keyTitle, isMinorKey } from "../lib/keys.js";

// Big, tappable key tiles for ONE hymn number: Major keys, then Minor keys.
// `group` = the display entries of that hymn (one per key; each may carry .variants for levels).
const KeyTiles = ({ group, addedIds = [], onPick }) => {
  const byKey = Object.fromEntries(group.map(h => [h.key || "D", h]));
  const keys = sortKeys(Object.keys(byKey));
  const majors = keys.filter(k => !isMinorKey(k)), minors = keys.filter(isMinorKey);
  const tile = (k) => {
    const h = byKey[k];
    const variants = h.variants?.length ? h.variants : [h];
    const lv = LEVELS.filter(l => variants.some(v => (v.level || "Easy") === l));
    const added = addedIds.includes(h.id);
    return (
      <button key={k} className={`ktile${isMinorKey(k) ? " minor" : ""}${added ? " added" : ""}`} onClick={() => onPick(h)} aria-label={`${keyTitle(k)}${added ? " (already added)" : ""}`}>
        <span className="kk">{keyShort(k)}</span>
        <span className="kt">{isMinorKey(k) ? "minor" : "major"}</span>
        {lv.length > 1 && <span className="kl">{lv.join(" · ")}</span>}
      </button>
    );
  };
  return (
    <div className="keypanel" data-testid="key-panel">
      {majors.length > 0 && <><h4>MAJOR KEYS</h4><div className="ktiles">{majors.map(tile)}</div></>}
      {minors.length > 0 && <><h4>MINOR KEYS</h4><div className="ktiles">{minors.map(tile)}</div></>}
    </div>
  );
};
export default KeyTiles;
