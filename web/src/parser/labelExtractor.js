import { getContent, truncate } from './contentUtils';

export function extractLabel(raw, type) {
  const content = getContent(raw);

  switch (type) {
    case 'user': {
      const tb = Array.isArray(content) ? content.find((b) => b.type === 'text') : null;
      return truncate(tb?.text ?? (typeof content === 'string' ? content : null) ?? 'User message');
    }

    case 'assistant': {
      if (Array.isArray(content)) {
        const tb = content.find((b) => b.type === 'text');
        if (tb?.text) return truncate(tb.text);
        const thb = content.find((b) => b.type === 'thinking');
        if (thb?.thinking) return truncate(thb.thinking);
      }
      return 'Assistant message';
    }

    case 'thinking': {
      if (Array.isArray(content)) {
        const b = content.find((b) => b.type === 'thinking');
        if (b?.thinking) return truncate(b.thinking);
      }
      return truncate(raw.thinking || 'Thinking…');
    }

    case 'tool_use': {
      if (Array.isArray(content)) {
        const b = content.find((b) => b.type === 'tool_use');
        if (b) return `${b.name || 'tool'}(${truncate(JSON.stringify(b.input ?? {}), 60)})`;
      }
      return raw.data?.hookName || 'Tool call';
    }

    case 'tool_result': {
      if (Array.isArray(content)) {
        const b = content.find((b) => b.type === 'tool_result');
        if (b) {
          const rt = Array.isArray(b.content)
            ? b.content.find((c) => c.type === 'text')?.text
            : typeof b.content === 'string' ? b.content : null;
          return truncate(rt ?? `Result for ${b.tool_use_id ?? '?'}`);
        }
      }
      return 'Tool result';
    }

    case 'progress':
      return (raw.data || {}).hookName || (raw.data || {}).hookEvent || raw.message || 'Progress';

    case 'result': {
      const sub   = raw.subtype   ? ` (${raw.subtype})`         : '';
      const turns = raw.num_turns != null ? ` · ${raw.num_turns} turns` : '';
      return `Session result${sub}${turns}`;
    }

    case 'queue-operation': return `Queue: ${raw.operation ?? '?'}`;
    case 'last-prompt':     return truncate(raw.lastPrompt ?? 'Last prompt');

    case 'system': {
      const tb = Array.isArray(content) ? content.find((b) => b.type === 'text') : null;
      return truncate(tb?.text ?? 'System prompt');
    }

    default: return truncate(raw.type || raw.role || 'Event');
  }
}
