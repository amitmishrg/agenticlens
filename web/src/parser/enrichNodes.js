/**
 * Adds stepId, chronological deltaMs (global log order),
 * parentDeltaMs (tree parent → child), and token totals.
 */

import { parseEventTime, deltaParentToChild } from '@/utils/timeDelta';

function resolveStepId(node, byId) {
  let cur = node;
  for (let d = 0; d < 99 && cur; d++) {
    const r = cur.data || {};
    if (r.promptId) return `prompt:${r.promptId}`;
    cur = cur.parentId ? byId.get(cur.parentId) : null;
  }
  const raw = node.data || {};
  if (raw.requestId) return `req:${raw.requestId}`;
  cur = node;
  for (let d = 0; d < 99 && cur; d++) {
    const r = cur.data || {};
    if (r.requestId) return `req:${r.requestId}`;
    cur = cur.parentId ? byId.get(cur.parentId) : null;
  }
  cur = node;
  while (cur?.parentId && byId.has(cur.parentId)) {
    cur = byId.get(cur.parentId);
  }
  return `root:${cur?.id ?? node.id}`;
}

function tokenSum(meta) {
  if (!meta) return null;
  const i = meta.inputTokens ?? 0;
  const o = meta.outputTokens ?? 0;
  if (!i && !o) return null;
  return i + o;
}

export function enrichNodes(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const withStep = nodes.map((n) => {
    const meta = { ...n.meta };
    if (n.data?.duration_ms != null && meta.durationMs == null) {
      meta.durationMs = n.data.duration_ms;
    }
    const ttl = tokenSum(meta);
    if (ttl != null) meta.totalTokens = ttl;

    return {
      ...n,
      stepId: resolveStepId(n, byId),
      meta,
      totalTokens: ttl,
    };
  });

  const byIdEnriched = new Map(withStep.map((n) => [n.id, n]));

  const timed = withStep.filter((n) => parseEventTime(n) != null);
  timed.sort((a, b) => parseEventTime(a) - parseEventTime(b));

  const deltaById = new Map();
  for (let i = 1; i < timed.length; i++) {
    const prev = parseEventTime(timed[i - 1]);
    const cur = parseEventTime(timed[i]);
    if (prev != null && cur != null) {
      deltaById.set(timed[i].id, Math.max(0, cur - prev));
    }
  }

  return withStep.map((n) => {
    let parentDeltaMs = null;
    if (n.parentId && byIdEnriched.has(n.parentId)) {
      parentDeltaMs = deltaParentToChild(byIdEnriched.get(n.parentId), n);
    }
    return {
      ...n,
      deltaMs: deltaById.has(n.id) ? deltaById.get(n.id) : null,
      parentDeltaMs,
      totalTokens: n.totalTokens ?? tokenSum(n.meta),
    };
  });
}
