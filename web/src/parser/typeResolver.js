import { getContent } from './contentUtils';

/**
 * Resolve the semantic display type from a raw SDK log line.
 * Refines broad types like "assistant" down to "thinking" or "tool_use"
 * based on the actual content blocks.
 */
export function resolveType(raw) {
  const top = raw.type || raw.role || '';

  if (top === 'queue-operation') return 'queue-operation';
  if (top === 'last-prompt')     return 'last-prompt';
  if (top === 'progress')        return 'progress';
  if (top === 'result')          return 'result';
  if (top === 'system')          return 'system';

  if (top === 'user') {
    const content = getContent(raw);
    if (Array.isArray(content) && content[0]?.type === 'tool_result') {
      return 'tool_result';
    }
    return 'user';
  }

  if (top === 'assistant') {
    const content = getContent(raw);
    if (Array.isArray(content) && content.length > 0) {
      const types = content.map((b) => b.type);
      if (types.every((t) => t === 'tool_use'))  return 'tool_use';
      if (types.every((t) => t === 'thinking'))  return 'thinking';
    }
    return 'assistant';
  }

  return top || 'unknown';
}
