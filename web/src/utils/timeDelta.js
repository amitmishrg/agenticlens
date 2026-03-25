/** Parse ISO timestamps from logs; returns epoch ms or null. */
export function parseEventTime(node) {
  if (!node?.timestamp) return null;
  const t = Date.parse(node.timestamp);
  return Number.isNaN(t) ? null : t;
}

/** Wall-clock gap from parent node to child (for tree / graph edges). */
export function deltaParentToChild(parent, child) {
  const pt = parseEventTime(parent);
  const ct = parseEventTime(child);
  if (pt == null || ct == null) return null;
  return Math.max(0, ct - pt);
}
