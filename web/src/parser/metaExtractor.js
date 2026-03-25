import { getContent } from '@/parser/contentUtils';

/** Pull all available metadata fields from a raw SDK log line. */
export function extractMeta(raw, type) {
  const meta = {};

  const usage = raw.message?.usage ?? raw.usage ?? null;
  if (usage) {
    if (usage.input_tokens != null) meta.inputTokens = usage.input_tokens;
    if (usage.output_tokens != null) meta.outputTokens = usage.output_tokens;
    if (usage.cache_read_input_tokens != null) meta.cacheReadTokens = usage.cache_read_input_tokens;
    if (usage.cache_creation_input_tokens != null)
      meta.cacheCreationTokens = usage.cache_creation_input_tokens;
  }

  const model = raw.message?.model ?? raw.message?.message?.model ?? null;
  if (model) meta.model = model;

  if (raw.duration_ms != null) meta.durationMs = raw.duration_ms;
  if (raw.duration_api_ms != null) meta.durationApiMs = raw.duration_api_ms;
  if (raw.num_turns != null) meta.numTurns = raw.num_turns;
  if (raw.stop_reason != null) meta.stopReason = raw.stop_reason;
  if (raw.total_cost_usd != null) meta.costUsd = raw.total_cost_usd;

  if (type === 'tool_use') {
    const content = getContent(raw);
    const b = Array.isArray(content) ? content.find((c) => c.type === 'tool_use') : null;
    if (b?.name) meta.toolName = b.name;
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
