// © JSE7EN · Jones Samuel — CSI Hymns
// lib/music/keys.js — key ordering, friendly names, chromatic scale, palettes, chord transposition
const CHROMA = { C:0, "C#":1, Db:1, D:2, "D#":3, Eb:3, E:4, F:5, "F#":6, Gb:6, G:7, "G#":8, Ab:8, A:9, "A#":10, Bb:10, B:11 };
const MINOR_ALIAS = { Dbm: "C#m", Gbm: "F#m", Abm: "G#m" };   // minor keys are shown with sharps
export const isMinorKey = (k) => /m$/.test(k || "");
export const keyRank = (k) => (CHROMA[(k || "C").replace(/m$/, "")] ?? 50) + (isMinorKey(k) ? 100 : 0);
export const sortKeys = (keys) => [...keys].sort((a, b) => keyRank(a) - keyRank(b));
export const keyShort = (k) => (isMinorKey(k) ? (MINOR_ALIAS[k] || k) : (k || "C"));
export const keyTitle = (k) => `${keyShort(k).replace(/m$/, "")} ${isMinorKey(k) ? "Minor" : "Major"}`;

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
export const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
export const PALETTES = {
  standard: ["D","G","A","E","B","C","F"],
  minor:    ["D","Dm","G","Gm","A","Am","E","Em","B","Bm","C","Cm","F","Fm"],
  extended: ["D","D7","Dsus4","G","G7","A","A7","Am","E","E7","Em","B","B7","C","Cmaj7","F","Fm"],
};

export function transposeChord(chord, steps) {
  const m = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!m) return chord;
  let root = m[1]
    .replace("Db","C#").replace("Eb","D#").replace("Fb","E")
    .replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb","B");
  const idx = CHROMATIC.indexOf(root);
  if (idx < 0) return chord;
  return CHROMATIC[(idx + steps + 12) % 12] + m[2];
}
