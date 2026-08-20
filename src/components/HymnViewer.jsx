import { ensureChords } from "../lib/core.jsx";

//  HYMN VIEWER
// ─────────────────────────────────────────────────────────────
const HymnViewer = ({ hymn, lyricSize = 22, chordSize = 15, lineGap = 18 }) => {
  const safe = ensureChords(hymn);
  if (!safe) return null;
  const chordH = Math.round(chordSize * 1.8);
  const wordGap = Math.round(lyricSize * 0.9);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
      {safe.lines.map((line, li) => {
        if (!line || !line.length) return <div key={li} style={{height:lineGap*2}}/>;

        // Group syllables into whole words first. Only the gap *between* words
        // is allowed to wrap to the next line — a single word (its syllables +
        // chords) always stays together, so it never splits mid-word.
        const words = [];
        line.forEach((sylObj, si) => {
          const isBreak = typeof sylObj==="object" ? (sylObj?.wordBreak || false) : false;
          if (si===0 || isBreak || words.length===0) words.push([]);
          words[words.length-1].push(si);
        });

        return (
          <div key={li} style={{display:"flex",flexDirection:"row",flexWrap:"wrap",alignItems:"flex-end",justifyContent:"center",marginBottom:lineGap}}>
            {words.map((word, wi) => (
              <span key={wi} style={{display:"inline-flex",flexDirection:"row",whiteSpace:"nowrap",marginLeft:wi>0?wordGap:0}}>
                {word.map(si => {
                  const sylObj = line[si];
                  const syl = typeof sylObj==="string" ? sylObj : (sylObj?.syl || "");
                  const chord = (safe.chords[li] && safe.chords[li][si]) || "";
                  return (
                    <span key={si} className="syl-col">
                      <span className="syl-chord" style={{fontSize:chordSize,minHeight:chordH}}>{chord}</span>
                      <span className="syl-lyric" style={{fontSize:lyricSize}}>{syl}</span>
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default HymnViewer;
