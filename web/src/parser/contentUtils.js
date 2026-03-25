/**
 * Shared content-extraction helpers used by the parser and UI features.
 */

/** Safely reach into a raw SDK event and return the content array/string. */
export function getContent(raw) {
  return raw.message?.content ?? raw.content ?? null;
}

/** Truncate a string to `max` chars, appending "…" when cut. */
export function truncate(str, max = 90) {
  if (str == null) return '';
  const s = typeof str === 'string' ? str : JSON.stringify(str);
  return s.length > max ? s.slice(0, max) + '…' : s;
}

/**
 * Extract a human-readable body text snippet from a normalised node.
 * Used in card previews, flow nodes, and the timeline.
 */
export function extractBodyText(node) {
  const raw = node.data;
  const content = getContent(raw);

  if (node.type === 'thinking') {
    if (Array.isArray(content)) {
      const b = content.find((c) => c.type === 'thinking');
      if (b?.thinking) return b.thinking;
    }
    return raw.thinking || '';
  }

  if (Array.isArray(content)) {
    const textBlock = content.find((b) => b.type === 'text');
    if (textBlock?.text) return textBlock.text;

    const toolBlock = content.find((b) => b.type === 'tool_use');
    if (toolBlock) return JSON.stringify(toolBlock.input ?? {}, null, 2);

    const resultBlock = content.find((b) => b.type === 'tool_result');
    if (resultBlock) {
      const rc = resultBlock.content;
      if (Array.isArray(rc)) return rc.find((c) => c.type === 'text')?.text ?? '';
      if (typeof rc === 'string') return rc;
    }
  }

  if (raw.lastPrompt) return raw.lastPrompt;
  return '';
}
