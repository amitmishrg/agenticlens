import MetaRow from './MetaRow';

const LABELS = {
  model: 'Model',
  inputTokens: 'Input tokens',
  outputTokens: 'Output tokens',
  cacheReadTokens: 'Cache read',
  cacheCreationTokens: 'Cache write',
  costUsd: 'Cost (USD)',
  durationMs: 'Duration (ms)',
  durationApiMs: 'API latency (ms)',
  numTurns: 'Turns',
  stopReason: 'Stop reason',
  toolName: 'Tool name',
  sessionId: 'Session ID',
  gitBranch: 'Git branch',
  cwd: 'Working dir',
  entrypoint: 'Entrypoint',
  version: 'Version',
  slug: 'Slug',
  sidechain: 'Sidechain',
};

export default function MetaSection({ meta = {}, timestamp }) {
  const hasAny = timestamp || Object.keys(meta).some((k) => meta[k] != null);
  if (!hasAny) return null;

  return (
    <div
      style={{
        background: '#111116',
        border: '1px solid #1e1e2e',
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 12,
      }}
    >
      <p style={{ color: '#4b5563', fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>METADATA</p>
      {timestamp && <MetaRow label="Timestamp" value={new Date(timestamp).toLocaleString()} />}
      {Object.entries(LABELS).map(([key, label]) => (
        <MetaRow key={key} label={label} value={meta[key]} />
      ))}
    </div>
  );
}
