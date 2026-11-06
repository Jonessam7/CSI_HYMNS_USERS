// © JSE7EN · Jones Samuel — CSI Hymns
// lib/ui/swipe.js — touch swipe handlers for slide viewers
// Returns onTouchStart/onTouchMove/onTouchEnd handlers that call
// onSwipeLeft() / onSwipeRight() once a deliberate horizontal swipe is
// detected — used so mobile users can swipe instead of tapping small
// arrow buttons, freeing the full screen width for lyrics.
export function makeSwipeHandlers(onSwipeLeft, onSwipeRight, { threshold = 50 } = {}) {
  let startX = 0, startY = 0, tracking = false;
  return {
    onTouchStart: (e) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; tracking = true;
    },
    onTouchEnd: (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return; // not a real horizontal swipe
      if (dx < 0) onSwipeLeft && onSwipeLeft();
      else onSwipeRight && onSwipeRight();
    },
  };
}
