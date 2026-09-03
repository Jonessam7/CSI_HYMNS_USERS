// ═════════════════════════════════════════════════════════════
//  ROOT APP — PUBLIC USER INTERFACE
//  Loads hymn data + site settings that the Admin published.
//  No login, no editing — pure read-only public experience.
// ═════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { injectStyles, ensureChords, sortHymns } from "./lib/core.jsx";
import UserDashboard from "./UserDashboard.jsx";

const DEFAULT_CONFIG = {
  siteTitle: "CSI HYMNS",
  tagline: "Sacred Songs & Chord Book",
  bannerMessage: "",
  bannerEnabled: false,
  maintenanceMode: false,
  maintenanceMessage: "We are updating the hymn book. Please check back shortly.",
  accentColor: "#c9922a",
  showFlows: true,
  hiddenHymnIds: [],
};

export default function App() {
  injectStyles();
  const [hymns, setHymns] = useState(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [error, setError] = useState(null);

  useEffect(() => {
    // cache-bust so visitors always get the Admin's latest published data
    const bust = `?v=${Date.now()}`;
    Promise.all([
      fetch(`/data/hymns.json${bust}`).then(r => r.ok ? r.json() : []),
      fetch(`/data/site-config.json${bust}`).then(r => r.ok ? r.json() : {}),
    ])
      .then(([hymnData, cfg]) => {
        const mergedConfig = { ...DEFAULT_CONFIG, ...(cfg || {}) };
        const hiddenSet = new Set(mergedConfig.hiddenHymnIds || []);
        const visible = (hymnData || []).filter(h => !hiddenSet.has(h.id));
        setHymns(sortHymns(visible.map(ensureChords)));
        setConfig(mergedConfig);
      })
      .catch(e => setError(e.message));
  }, []);

  if (config.accentColor) {
    document.documentElement.style.setProperty("--gold", config.accentColor);
  }

  if (error) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",color:"var(--cream)",flexDirection:"column",gap:10}}>
        <div style={{fontSize:"2rem"}}>⚠</div>
        <p>Couldn't load hymn data. Please refresh.</p>
      </div>
    );
  }

  if (config.maintenanceMode) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",color:"var(--cream)",flexDirection:"column",gap:14,textAlign:"center",padding:24}}>
        <div style={{fontSize:"2.6rem"}}>✝</div>
        <h1 style={{fontFamily:"'Cinzel',serif",color:"var(--gold2)"}}>{config.siteTitle}</h1>
        <p style={{color:"var(--muted)",maxWidth:420}}>{config.maintenanceMessage}</p>
      </div>
    );
  }

  if (!hymns) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",color:"var(--cream)"}}>
        Loading hymns…
      </div>
    );
  }

  return (
    <>
      {config.bannerEnabled && config.bannerMessage && (
        <div style={{background:"var(--gold)",color:"#000",textAlign:"center",padding:"8px 14px",fontFamily:"'Cinzel',serif",fontSize:".78rem",letterSpacing:".04em",fontWeight:700}}>
          {config.bannerMessage}
        </div>
      )}
      <UserDashboard hymns={hymns} config={config}/>
    </>
  );
}
