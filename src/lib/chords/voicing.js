// © JSE7EN · Jones Samuel — CSI Hymns
// lib/chords/voicing.js — place a chord's notes on the 25-key keyboard (C..C), ascending from the root
import { noteToPc } from "./noteMath.js";
export function voiceChord(notes) {
  const out = []; let prev = null;
  notes.forEach(n => {
    const pc = noteToPc(n);
    let idx = pc;
    if (prev !== null) { while (idx <= prev) idx += 12; }
    out.push({ idx, pc, name: n }); prev = idx;
  });
  return out;
}
