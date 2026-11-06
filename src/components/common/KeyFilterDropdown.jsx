// © JSE7EN · Jones Samuel — CSI Hymns
// components/common/KeyFilterDropdown.jsx

export const KeyFilterDropdown = ({ hymns, value, onChange, style={} }) => {
  const allKeys = [...new Set(hymns.map(h => h.key || "D"))].sort();
  return (
    <select className="key-dropdown" value={value} onChange={e => onChange(e.target.value)} style={style}>
      <option value="">All Keys</option>
      {allKeys.map(k => <option key={k} value={k}>{k}</option>)}
    </select>
  );
};
