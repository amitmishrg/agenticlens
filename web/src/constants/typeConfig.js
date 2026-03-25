/**
 * Single source of truth for event-type colours and display labels.
 * Used by every feature (flow, cards, timeline, tree, inspector).
 */
export const TYPE_ACCENTS = {
  user: '#6366f1',
  assistant: '#22c55e',
  thinking: '#eab308',
  tool_use: '#f97316',
  tool_result: '#14b8a6',
  system: '#a855f7',
  progress: '#06b6d4',
  result: '#94a3b8',
  'queue-operation': '#ec4899',
  'last-prompt': '#818cf8',
};

/** Returns the accent colour for a node type, with a safe fallback. */
export const getAccent = (type) => TYPE_ACCENTS[type] ?? '#6b7280';

/**
 * Colour for type labels & icons: full accent on dark UI, blended toward slate for WCAG on white.
 * @param {string} accentHex
 * @param {'light' | 'dark'} theme
 */
export function getAccentLabelColor(accentHex, theme) {
  if (theme !== 'light') return accentHex;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(accentHex);
  if (!m) return accentHex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  const t = 0.58;
  const tgt = { r: 15, g: 23, b: 42 };
  const R = Math.round(r * (1 - t) + tgt.r * t);
  const G = Math.round(g * (1 - t) + tgt.g * t);
  const B = Math.round(b * (1 - t) + tgt.b * t);
  return `rgb(${R},${G},${B})`;
}
