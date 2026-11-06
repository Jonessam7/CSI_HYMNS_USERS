// © JSE7EN · Jones Samuel — CSI Hymns
// components/chords/PianoKeyboard.jsx — 25-key piano (C..C). Scale tones show their degree colour; a chord lights its keys.
import { isBlackPc } from "../../lib/chords/noteMath.js";
import { DEGREE_COLORS, OUT_OF_SCALE_COLOR } from "../../lib/chords/scaleColors.js";

const WHITE_W = 40, WHITE_H = 150, BLACK_W = 24, BLACK_H = 92, TOTAL = 25;
const NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

export default function PianoKeyboard({ scalePcs, chordKeys, onKeyClick, compact }) {
  // chordKeys: [{ idx, pc }]  — keys currently pressed by the chosen chord
  const pressed = new Map((chordKeys || []).map(k => [k.idx, k]));
  const colorOf = (pc) => { const d = scalePcs?.get(pc); return d ? DEGREE_COLORS[d] : OUT_OF_SCALE_COLOR; };
  const keys = Array.from({ length: TOTAL }, (_, i) => ({ i, pc: i % 12 }));
  const whites = keys.filter(k => !isBlackPc(k.pc));
  const xOfWhite = new Map(whites.map((k, n) => [k.i, n * WHITE_W]));
  const width = whites.length * WHITE_W;
  const keyEl = (k, black) => {
    const d = scalePcs?.get(k.pc), p = pressed.get(k.i), col = colorOf(k.pc);
    const x = black ? xOfWhite.get(k.i - 1) + WHITE_W - BLACK_W / 2 : xOfWhite.get(k.i);
    const w = black ? BLACK_W : WHITE_W, h = black ? BLACK_H : WHITE_H;
    const fill = p ? col : d ? (black ? "#3a3340" : "#f3ead6") : (black ? "#17141a" : "#fbf8f1");
    return (
      <g key={k.i} onClick={() => onKeyClick && onKeyClick(k.pc, k.i)} style={{ cursor: onKeyClick ? "pointer" : "default" }} data-testid={"pk-" + k.i}>
        <rect x={x} y={0} width={w} height={h} rx={4} fill={fill} stroke={black ? "#000" : "#6b6258"} strokeWidth={1.2} />
        {d && !p && <rect x={x + 3} y={h - (black ? 9 : 11)} width={w - 6} height={5} rx={2.5} fill={col} />}
        {d && (
          <g>
            <circle cx={x + w / 2} cy={h - (black ? 26 : 34)} r={black ? 8 : 11} fill={col} stroke={p ? "#fff" : "none"} strokeWidth={2} />
            <text x={x + w / 2} y={h - (black ? 26 : 34) + 4.5} textAnchor="middle" fontSize={black ? 11 : 14} fontWeight={800} fill="#111" fontFamily="'JetBrains Mono',monospace">{d}</text>
          </g>
        )}
        {p && !d && <circle cx={x + w / 2} cy={h - (black ? 26 : 34)} r={black ? 7 : 9} fill={OUT_OF_SCALE_COLOR} stroke="#fff" strokeWidth={2} />}
        {!compact && !black && <text x={x + w / 2} y={h - 8 - (d ? 8 : 0)} textAnchor="middle" fontSize={10} fill="#6b6258" fontFamily="'JetBrains Mono',monospace">{NAMES[k.pc]}</text>}
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 ${width} ${WHITE_H + 2}`} style={{ width: "100%", maxWidth: compact ? 360 : 760, display: "block", margin: "0 auto" }} role="img" aria-label="Piano keyboard">
      {whites.map(k => keyEl(k, false))}
      {keys.filter(k => isBlackPc(k.pc)).map(k => keyEl(k, true))}
    </svg>
  );
}
