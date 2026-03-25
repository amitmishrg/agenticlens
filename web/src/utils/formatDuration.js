/** Format milliseconds for compact UI ("120ms", "5.2s"). */
export function formatDeltaMs(ms) {
  if (ms == null || Number.isNaN(ms)) return null;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  return `${s >= 10 ? Math.round(s) : s.toFixed(1)}s`;
}
