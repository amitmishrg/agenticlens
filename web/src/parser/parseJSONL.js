import { resolveType }  from './typeResolver';
import { extractLabel } from './labelExtractor';
import { extractMeta }  from './metaExtractor';
import { getContent, truncate } from './contentUtils';

let _counter = 0;
const nextId = () => `node-${++_counter}`;

/** Expand thinking blocks from a mixed assistant turn into separate child nodes. */
function expandThinkingChildren(raw, parentId, timestamp) {
  const content = getContent(raw);
  if (!Array.isArray(content)) return [];

  return content
    .filter((b) => b.type === 'thinking' && b.thinking)
    .map((b) => ({
      id:        nextId(),
      parentId,
      type:      'thinking',
      label:     truncate(b.thinking),
      timestamp,
      data:      b,
      meta:      {},
    }));
}

export function parseJSONL(rawText) {
  _counter = 0;

  const lines = rawText.split('\n').filter((l) => l.trim());
  const parsed = [];

  for (const line of lines) {
    try { parsed.push(JSON.parse(line)); }
    catch { /* skip malformed lines */ }
  }

  // Pre-register UUIDs so parent references resolve correctly
  const idMap = new Map();
  for (const raw of parsed) {
    if (raw.uuid) idMap.set(raw.uuid, nextId());
  }

  const nodes = [];

  for (const raw of parsed) {
    const type      = resolveType(raw);
    const label     = extractLabel(raw, type);
    const timestamp = raw.timestamp ?? raw.created_at ?? null;
    const meta      = extractMeta(raw, type);
    const id        = raw.uuid ? idMap.get(raw.uuid) : nextId();
    const parentId  = raw.parentUuid && idMap.has(raw.parentUuid)
      ? idMap.get(raw.parentUuid)
      : null;

    nodes.push({ id, parentId, type, label, timestamp, data: raw, meta });

    if (type === 'assistant') {
      nodes.push(...expandThinkingChildren(raw, id, timestamp));
    }
  }

  return nodes;
}
