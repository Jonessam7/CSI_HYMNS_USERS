// © JSE7EN · Jones Samuel — CSI Hymns
// lib/chords/chordGuideConfig.js — what the Admin lets visitors see in the Chord Guide (published in site-config.json)
export const GROUP_META = [
  { id: "diatonic",  title: "In the scale",        hint: "The 7 chords that belong to the key" },
  { id: "borrowed",  title: "Borrowed chords",     hint: "Borrowed from the parallel major/minor key" },
  { id: "chromatic", title: "Chromatic chords",    hint: "Colour chords outside the scale" },
  { id: "secondary", title: "Secondary dominants", hint: "Dominant chords that lead to another chord" },
];

export const DEFAULT_CHORD_GUIDE = {
  showInHymn: true,          // 🎹 panel in the top-left corner of a hymn
  showPage: true,            // "Chord Guide" page / button in the menu
  panelOpenByDefault: false,
  groups: { diatonic: true, borrowed: false, chromatic: false, secondary: false },
  families: { major: true, minor: true },   // which keys the Chord Guide page lists
};

export function resolveChordGuide(config) {
  const c = (config && config.chordGuide) || {};
  return {
    ...DEFAULT_CHORD_GUIDE, ...c,
    groups: { ...DEFAULT_CHORD_GUIDE.groups, ...(c.groups || {}) },
    families: { ...DEFAULT_CHORD_GUIDE.families, ...(c.families || {}) },
  };
}
