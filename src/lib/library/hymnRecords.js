// © JSE7EN · Jones Samuel — CSI Hymns
// lib/library/hymnRecords.js — hymn record helpers (ids, sorting, duplicates, chord defaults, levels)
// ─────────────────────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────────────────────
export function uid() { return Math.random().toString(36).slice(2, 10); }

export function sortHymns(hymns) {
  return [...hymns].sort((a, b) => {
    if (a.number !== b.number) return a.number - b.number;
    return (a.key || "").localeCompare(b.key || "");
  });
}

export function isDuplicate(existing, incoming) {
  return existing.number === incoming.number &&
    existing.title.trim() === incoming.title.trim() &&
    (existing.key || "D").trim().toUpperCase() === (incoming.key || "D").trim().toUpperCase();
}

export function ensureChords(hymn) {
  if (!hymn) return hymn;
  const lines = hymn.lines || [];
  const existingChords = hymn.chords || [];
  const chords = lines.map((line, li) => {
    const lineLen = (line || []).length;
    const existing = existingChords[li];
    if (!line || line.length === 0) return [];
    if (Array.isArray(existing) && existing.length === lineLen) return existing;
    const base = Array.isArray(existing) ? existing : [];
    return Array.from({ length: lineLen }, (_, si) => base[si] || "");
  });
  return { ...hymn, chords };
}

export const LEVELS = ["Easy", "Intermediate", "Hard"];
