// © JSE7EN · Jones Samuel — CSI Hymns
// lib/storage.js — safe localStorage helpers
export function loadStorage(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
export function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
