// © JSE7EN · Jones Samuel — CSI Hymns
// lib/chords/noteMath.js — note names ↔ pitch classes (handles b, #, bb, ##, E#, Cb …)
const BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteToPc(name) {
  const m = /^([A-G])([#b]*)/.exec(name || "");
  if (!m) return null;
  let pc = BASE[m[1]];
  for (const ch of m[2]) pc += ch === "#" ? 1 : -1;
  return ((pc % 12) + 12) % 12;
}
export const isBlackPc = (pc) => [1, 3, 6, 8, 10].includes(pc);
