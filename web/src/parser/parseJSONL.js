/**
 * Parses a raw JSONL string into normalized node objects.
 *
 * Handles the real Claude Agent SDK log format where:
 *   - Top-level `type` field identifies the event (user, assistant, progress, result, ...)
 *   - For user/assistant events, actual content is nested under `message.content`
 *   - Tool use blocks live inside assistant `message.content`
 *   - Tool results arrive as `type:"user"` with `message.content[].type === "tool_result"`
 *   - Usage/model metadata lives under `message.usage` / `message.model`
 */

let _counter = 0;

function nextId() {
  return `node-${++_counter}`;
}

/** Get the message content array safely */
function getContent(raw) {
  return raw.message?.content ?? raw.content ?? null;
}

/**
 * Resolve the display type from a raw log line.
 * Uses the top-level `type` first, then refines based on message content.
 */
function resolveType(raw) {
  const topType = raw.type || raw.role || '';

  // Pass-through system-level event types
  if (topType === 'queue-operation') return 'queue-operation';
  if (topType === 'last-prompt') return 'last-prompt';
  if (topType === 'progress') return 'progress';
  if (topType === 'result') return 'result';
  if (topType === 'system') return 'system';

  if (topType === 'user') {
    // A user message wrapping a tool_result is more accurately shown as tool_result
    const content = getContent(raw);
    if (Array.isArray(content) && content[0]?.type === 'tool_result') {
      return 'tool_result';
    }
    return 'user';
  }

  if (topType === 'assistant') {
    const content = getContent(raw);
    if (Array.isArray(content)) {
      const types = content.map((b) => b.type);
      // Pure tool-use turn
      if (types.length > 0 && types.every((t) => t === 'tool_use')) return 'tool_use';
      // Pure thinking turn (streaming partial)
      if (types.length > 0 && types.every((t) => t === 'thinking')) return 'thinking';
    }
    return 'assistant';
  }

  return topType || 'unknown';
}

function truncate(str, max = 90) {
  if (str === null || str === undefined) return '';
  const s = typeof str === 'string' ? str : JSON.stringify(str);
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function extractLabel(raw, type) {
  const content = getContent(raw);

  switch (type) {
    case 'user': {
      const textBlock = Array.isArray(content)
        ? content.find((b) => b.type === 'text')
        : null;
      const text = textBlock?.text ?? (typeof content === 'string' ? content : null);
      return truncate(text || 'User message');
    }

    case 'assistant': {
      if (Array.isArray(content)) {
        const textBlock = content.find((b) => b.type === 'text');
        if (textBlock?.text) return truncate(textBlock.text);
        const thinkingBlock = content.find((b) => b.type === 'thinking');
        if (thinkingBlock?.thinking) return truncate(thinkingBlock.thinking);
      }
      return 'Assistant message';
    }

    case 'thinking': {
      if (Array.isArray(content)) {
        const block = content.find((b) => b.type === 'thinking');
        if (block?.thinking) return truncate(block.thinking);
      }
      return truncate(raw.thinking || raw.data?.type || 'Thinking…');
    }

    case 'tool_use': {
      if (Array.isArray(content)) {
        const block = content.find((b) => b.type === 'tool_use');
        if (block) return `${block.name || 'tool'}(${truncate(JSON.stringify(block.input ?? {}), 60)})`;
      }
      return raw.data?.hookName || 'Tool call';
    }

    case 'tool_result': {
      if (Array.isArray(content)) {
        const block = content.find((b) => b.type === 'tool_result');
        if (block) {
          const resultText = Array.isArray(block.content)
            ? block.content.find((c) => c.type === 'text')?.text
            : typeof block.content === 'string'
            ? block.content
            : null;
          return truncate(resultText || `Result for ${block.tool_use_id || '?'}`);
        }
      }
      return 'Tool result';
    }

    case 'progress': {
      const d = raw.data || {};
      return d.hookName || d.hookEvent || d.message || raw.message || 'Progress';
    }

    case 'result': {
      const sub = raw.subtype ? ` (${raw.subtype})` : '';
      const turns = raw.num_turns !== undefined ? ` · ${raw.num_turns} turns` : '';
      return `Session result${sub}${turns}`;
    }

    case 'queue-operation':
      return `Queue: ${raw.operation || '?'}`;

    case 'last-prompt':
      return truncate(raw.lastPrompt || 'Last prompt');

    case 'system': {
      const textBlock = Array.isArray(content)
        ? content.find((b) => b.type === 'text')
        : null;
      return truncate(textBlock?.text || 'System prompt');
    }

    default:
      return truncate(raw.type || raw.role || 'Event');
  }
}

function extractMeta(raw, type) {
  const meta = {};

  // Usage can be at raw.usage (result events) or raw.message.usage (user/assistant)
  const usage = raw.message?.usage ?? raw.usage ?? null;
  if (usage) {
    if (usage.input_tokens !== undefined) meta.inputTokens = usage.input_tokens;
    if (usage.output_tokens !== undefined) meta.outputTokens = usage.output_tokens;
    if (usage.cache_read_input_tokens !== undefined) meta.cacheReadTokens = usage.cache_read_input_tokens;
    if (usage.cache_creation_input_tokens !== undefined) meta.cacheCreationTokens = usage.cache_creation_input_tokens;
  }

  const model = raw.message?.model ?? raw.message?.message?.model ?? null;
  if (model) meta.model = model;

  if (raw.duration_ms !== undefined) meta.durationMs = raw.duration_ms;
  if (raw.duration_api_ms !== undefined) meta.durationApiMs = raw.duration_api_ms;
  if (raw.num_turns !== undefined) meta.numTurns = raw.num_turns;
  if (raw.stop_reason !== undefined) meta.stopReason = raw.stop_reason;

  if (raw.total_cost_usd !== undefined) meta.costUsd = raw.total_cost_usd;

  if (type === 'tool_use') {
    const content = getContent(raw);
    const block = Array.isArray(content) ? content.find((b) => b.type === 'tool_use') : null;
    if (block?.name) meta.toolName = block.name;
  }

  if (raw.isSidechain) meta.sidechain = true;
  if (raw.sessionId) meta.sessionId = raw.sessionId;
  if (raw.gitBranch) meta.gitBranch = raw.gitBranch;
  if (raw.entrypoint) meta.entrypoint = raw.entrypoint;
  if (raw.cwd) meta.cwd = raw.cwd;
  if (raw.version) meta.version = raw.version;
  if (raw.slug) meta.slug = raw.slug;

  return meta;
}

/**
 * Expand assistant messages that contain both thinking + text blocks into
 * separate child nodes so the tree is more readable.
 */
function expandAssistantBlocks(raw, parentId, timestamp) {
  const content = getContent(raw);
  if (!Array.isArray(content)) return [];

  const extras = [];

  for (const block of content) {
    if (block.type === 'thinking' && block.thinking) {
      extras.push({
        id: nextId(),
        parentId,
        type: 'thinking',
        label: truncate(block.thinking),
        timestamp,
        data: block,
        meta: {},
      });
    }
  }

  return extras;
}

export function parseJSONL(rawText) {
  _counter = 0;

  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  const nodes = [];

  // First pass: collect all UUIDs so parent references can be resolved
  const parsed = [];
  const idMap = new Map(); // uuid → generated id

  for (const line of lines) {
    try {
      const raw = JSON.parse(line);
      parsed.push(raw);
    } catch {
      // skip invalid / incomplete JSON lines silently
    }
  }

  // Pre-register all UUIDs
  for (const raw of parsed) {
    if (raw.uuid) {
      idMap.set(raw.uuid, nextId());
    }
  }

  for (const raw of parsed) {
    const type = resolveType(raw);
    const label = extractLabel(raw, type);
    const timestamp = raw.timestamp ?? raw.created_at ?? null;
    const meta = extractMeta(raw, type);

    const id = raw.uuid ? idMap.get(raw.uuid) : nextId();

    let parentId = null;
    if (raw.parentUuid && idMap.has(raw.parentUuid)) {
      parentId = idMap.get(raw.parentUuid);
    }

    const node = { id, parentId, type, label, timestamp, data: raw, meta };
    nodes.push(node);

    // Expand thinking blocks out of mixed assistant turns into children
    if (type === 'assistant') {
      const children = expandAssistantBlocks(raw, id, timestamp);
      nodes.push(...children);
    }
  }

  return nodes;
}
