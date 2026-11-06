// © JSE7EN · Jones Samuel — CSI Hymns
// lib/chords/audio.js — tiny WebAudio helper so learners can HEAR the chord (no files needed)
let ctx = null;
export function playIndices(indices, baseMidi = 48) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    indices.forEach((i, n) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle"; o.frequency.value = 440 * Math.pow(2, (baseMidi + i - 69) / 12);
      g.gain.setValueAtTime(0.0001, now + n * 0.04);
      g.gain.exponentialRampToValueAtTime(0.18, now + n * 0.04 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      o.connect(g).connect(ctx.destination); o.start(now + n * 0.04); o.stop(now + 1.5);
    });
  } catch { /* audio not available */ }
}
