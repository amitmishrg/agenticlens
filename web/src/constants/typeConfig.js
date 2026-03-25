/**
 * Single source of truth for event-type colours and display labels.
 * Used by every feature (flow, cards, timeline, tree, inspector).
 */
export const TYPE_ACCENTS = {
  user:              '#6366f1',
  assistant:         '#22c55e',
  thinking:          '#eab308',
  tool_use:          '#f97316',
  tool_result:       '#14b8a6',
  system:            '#a855f7',
  progress:          '#06b6d4',
  result:            '#94a3b8',
  'queue-operation': '#ec4899',
  'last-prompt':     '#818cf8',
};

/** Returns the accent colour for a node type, with a safe fallback. */
export const getAccent = (type) => TYPE_ACCENTS[type] ?? '#6b7280';
