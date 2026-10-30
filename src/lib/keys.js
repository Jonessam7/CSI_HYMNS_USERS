// Key helpers for the public site: ordering and friendly names.
const CHROMA = { C:0, "C#":1, Db:1, D:2, "D#":3, Eb:3, E:4, F:5, "F#":6, Gb:6, G:7, "G#":8, Ab:8, A:9, "A#":10, Bb:10, B:11 };
const MINOR_ALIAS = { Dbm: "C#m", Gbm: "F#m", Abm: "G#m" };   // minor keys are shown with sharps
export const isMinorKey = (k) => /m$/.test(k || "");
export const keyRank = (k) => (CHROMA[(k || "C").replace(/m$/, "")] ?? 50) + (isMinorKey(k) ? 100 : 0);
export const sortKeys = (keys) => [...keys].sort((a, b) => keyRank(a) - keyRank(b));
export const keyShort = (k) => (isMinorKey(k) ? (MINOR_ALIAS[k] || k) : (k || "C"));
export const keyTitle = (k) => `${keyShort(k).replace(/m$/, "")} ${isMinorKey(k) ? "Minor" : "Major"}`;
