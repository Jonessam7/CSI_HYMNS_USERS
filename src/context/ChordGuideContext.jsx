// © JSE7EN · Jones Samuel — CSI Hymns
// context/ChordGuideContext.jsx — gives every screen the chord database + the Admin's chord-guide settings
import { createContext, useContext } from "react";
export const ChordGuideContext = createContext({ db: null, settings: null, openGuide: () => {} });
export const useChordGuide = () => useContext(ChordGuideContext);
