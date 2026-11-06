// © JSE7EN · Jones Samuel — CSI Hymns
// hooks/useChordDatabase.js — loads /data/chord-database.json once (the Admin publishes it with the site)
import { useEffect, useState } from "react";
export function useChordDatabase() {
  const [db, setDb] = useState(null);
  useEffect(() => {
    fetch(`/data/chord-database.json?v=${Date.now()}`).then(r => r.ok ? r.json() : null).then(setDb).catch(() => setDb(null));
  }, []);
  return db;
}
