import { buildTree } from '@/parser/buildTree';

/** Extend id set with ancestors so tree/graph stays connected. */
export function addAncestorIds(ids, byId) {
  const out = new Set(ids);
  for (const id of ids) {
    let cur = byId.get(id);
    while (cur?.parentId) {
      out.add(cur.parentId);
      cur = byId.get(cur.parentId);
    }
  }
  return out;
}

/**
 * Compute which node ids should be shown given replay and type filter.
 */
export function computeVisibleNodeIds(nodes, opts) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  let ids = new Set(nodes.map((n) => n.id));

  const { replayIndex, chronNodeIds, filterType } = opts;

  if (replayIndex != null && replayIndex >= 0 && chronNodeIds?.length) {
    ids = new Set(chronNodeIds.slice(0, replayIndex + 1));
  }

  if (filterType && filterType !== 'all') {
    ids = new Set([...ids].filter((id) => byId.get(id)?.type === filterType));
  }

  return addAncestorIds(ids, byId);
}

/** Flat list → pruned tree roots for Tree / Flow layout. */
export function buildVisibleTree(nodes, visibleIds) {
  const sub = nodes.filter((n) => visibleIds.has(n.id));
  return buildTree(sub);
}
