import useAgentStore from '../store/useAgentStore';

const TYPE_HEADER_COLORS = {
  user:              'text-blue-400 border-blue-700',
  assistant:         'text-green-400 border-green-700',
  thinking:          'text-yellow-400 border-yellow-700',
  system:            'text-purple-400 border-purple-700',
  result:            'text-gray-400 border-gray-600',
  tool_use:          'text-orange-400 border-orange-700',
  tool_result:       'text-teal-400 border-teal-700',
  progress:          'text-cyan-400 border-cyan-700',
  'queue-operation': 'text-pink-400 border-pink-700',
  'last-prompt':     'text-indigo-400 border-indigo-700',
  unknown:           'text-gray-400 border-gray-600',
};

function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return String(ts);
  return d.toISOString().replace('T', ' ').replace('Z', '').slice(0, 23);
}

function MetaRow({ label, value }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-start gap-2 py-1" style={{ borderBottom: '1px solid #1a1a28' }}>
      <span className="text-[11px] w-28 shrink-0 font-medium" style={{ color: '#44445a' }}>{label}</span>
      <span className="text-[11px] font-mono break-all" style={{ color: '#9494aa' }}>{String(value)}</span>
    </div>
  );
}

export default function InspectorPanel() {
  const selectedNode = useAgentStore((s) => s.selectedNode);

  if (!selectedNode) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center"
        style={{ background: '#09090c' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#111118', border: '1px solid #1e1e2e' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#33334a" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p className="text-xs" style={{ color: '#33334a' }}>Select an event to inspect it</p>
      </div>
    );
  }

  const { type, label, timestamp, meta, data } = selectedNode;
  const headerColor = TYPE_HEADER_COLORS[type] || TYPE_HEADER_COLORS.unknown;

  const accentMap = {
    user:'#6366f1', assistant:'#22c55e', thinking:'#eab308', system:'#a855f7',
    result:'#94a3b8', tool_use:'#f97316', tool_result:'#14b8a6', progress:'#06b6d4',
    'queue-operation':'#ec4899', 'last-prompt':'#818cf8', unknown:'#6b7280',
  };
  const accent = accentMap[type] ?? '#6b7280';

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#09090c' }}>
      {/* Header */}
      <div
        className="px-4 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${accent}22`, background: `${accent}08` }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}28` }}
        >
          {type}
        </span>
        <p className="text-sm mt-2 break-words line-clamp-3 leading-relaxed" style={{ color: '#c4c4d4' }}>
          {label}
        </p>
      </div>

      {/* Metadata */}
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #1a1a28' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2a2a3e' }}>
          Metadata
        </p>
        <MetaRow label="Timestamp" value={formatTimestamp(timestamp)} />
        <MetaRow label="Model" value={meta?.model} />
        <MetaRow label="Duration" value={meta?.durationMs !== undefined ? `${meta.durationMs}ms` : undefined} />
        <MetaRow label="API duration" value={meta?.durationApiMs !== undefined ? `${meta.durationApiMs}ms` : undefined} />
        <MetaRow label="Turns" value={meta?.numTurns} />
        <MetaRow label="Input tokens" value={meta?.inputTokens} />
        <MetaRow label="Output tokens" value={meta?.outputTokens} />
        <MetaRow label="Cache read" value={meta?.cacheReadTokens} />
        <MetaRow label="Cache created" value={meta?.cacheCreationTokens} />
        <MetaRow label="Cost" value={meta?.costUsd !== undefined ? `$${Number(meta.costUsd).toFixed(6)}` : undefined} />
        <MetaRow label="Stop reason" value={meta?.stopReason} />
        <MetaRow label="Tool name" value={meta?.toolName} />
        <MetaRow label="Session ID" value={meta?.sessionId} />
        <MetaRow label="Git branch" value={meta?.gitBranch} />
        <MetaRow label="Entrypoint" value={meta?.entrypoint} />
        <MetaRow label="Version" value={meta?.version} />
        <MetaRow label="Slug" value={meta?.slug} />
        <MetaRow label="CWD" value={meta?.cwd} />
      </div>

      {/* Raw JSON */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2a2a3e' }}>
          Raw JSON
        </p>
        <pre
          className="text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed rounded-xl p-3"
            style={{ color: '#707090', background: '#111118', border: '1px solid #1a1a28' }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
