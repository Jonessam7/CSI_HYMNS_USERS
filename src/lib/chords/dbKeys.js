// © JSE7EN · Jones Samuel — CSI Hymns
// lib/chords/dbKeys.js — map a hymn's key ("Eb", "F#m", "Dbm") to the name used in the chord database ("Eb Major", "F# Minor")
import { noteToPc } from "./noteMath.js";
const MAJOR_NAMES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const MINOR_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
export const MAJOR_DB_KEYS = MAJOR_NAMES.map(n => n + " Major");
export const MINOR_DB_KEYS = MINOR_NAMES.map(n => n + " Minor");

export function dbKeyName(hymnKey) {
  const k = (hymnKey || "C").trim();
  const minor = /m$/.test(k) && !/maj$/i.test(k);
  const pc = noteToPc(k.replace(/m$/, ""));
  if (pc === null) return null;
  return minor ? MINOR_NAMES[pc] + " Minor" : MAJOR_NAMES[pc] + " Major";
}
