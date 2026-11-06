// © JSE7EN · Jones Samuel — CSI Hymns
// lib/chords/chordsForKey.js — read the chord database for one key and shape it for the screens
import { noteToPc } from "./noteMath.js";

// → { scaleNotes[], scalePcs: Map(pc → degree 1-7), sections: [{id, items:[{label, chord, notes, degree|null}]}] }
export function chordsForKey(db, keyName, groups) {
  if (!db || !keyName) return null;
  const isMajor = keyName.endsWith("Major");
  const scaleNotes = (isMajor ? db.majorScaleNotes : db.minorScaleNotes)?.[keyName];
  const diatonic = (isMajor ? db.majorScales : db.minorScales)?.[keyName];
  if (!scaleNotes || !diatonic) return null;
  const scalePcs = new Map(scaleNotes.map((n, i) => [noteToPc(n), i + 1]));
  const oos = db.outOfScaleChords?.[keyName] || {};
  const pack = (obj) => Object.entries(obj || {}).map(([label, v]) => ({ label, chord: v.chord, notes: v.notes, degree: null, note: v.source || v.target || "" }));
  const sections = [];
  if (groups.diatonic) sections.push({ id: "diatonic", items: Object.entries(diatonic).map(([label, v], i) => ({ label, chord: v.chord, notes: v.notes, degree: i + 1 })) });
  if (groups.borrowed) sections.push({ id: "borrowed", items: pack(oos.borrowedChords) });
  if (groups.chromatic) sections.push({ id: "chromatic", items: pack(oos.chromaticChords) });
  if (groups.secondary) sections.push({ id: "secondary", items: pack(oos.secondaryDominants) });
  return { keyName, scaleNotes, scalePcs, diatonic: Object.entries(diatonic).map(([label, v], i) => ({ label, chord: v.chord, notes: v.notes, degree: i + 1 })), sections: sections.filter(s => s.items.length) };
}
