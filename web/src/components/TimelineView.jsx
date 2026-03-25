import useAgentStore from '../store/useAgentStore';

const TYPE_COLORS = {
  user:              'bg-blue-500',
  assistant:         'bg-green-500',
  thinking:          'bg-yellow-500',
  system:            'bg-purple-500',
  result:            'bg-gray-500',
  tool_use:          'bg-orange-500',
  tool_result:       'bg-teal-500',
  progress:          'bg-cyan-500',
  'queue-operation': 'bg-pink-500',
  'last-prompt':     'bg-indigo-400',
  unknown:           'bg-gray-600',
};

const TYPE_TEXT = {
  user:              'text-blue-300',
  assistant:         'text-green-300',
  thinking:          'text-yellow-300',
  system:            'text-purple-300',
  result:            'text-gray-300',
  tool_use:          'text-orange-300',
  tool_result:       'text-teal-300',
  progress:          'text-cyan-300',
  'queue-operation': 'text-pink-300',
  'last-prompt':     'text-indigo-300',
  unknown:           'text-gray-400',
};

function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return String(ts);
  return d.toISOString().replace('T', ' ').replace('Z', '').slice(0, 23);
}

function getDeltaMs(prev, curr) {
  if (!prev?.timestamp || !curr?.timestamp) return null;
  const a = new Date(prev.timestamp);
  const b = new Date(curr.timestamp);
  if (isNaN(a) || isNaN(b)) return null;
  return b - a;
}

function formatDelta(ms) {
  if (ms === null) return '';
  if (ms < 1000) return `+${ms}ms`;
  return `+${(ms / 1000).toFixed(2)}s`;
}

export default function TimelineView() {
  const { nodes, selectedNode, setSelectedNode } = useAgentStore();

  const sorted = [...nodes].sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
        <span className="text-3xl">⏱</span>
        <p>No events to display</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full py-2">
      {sorted.map((node, idx) => {
        const prev = sorted[idx - 1] || null;
        const delta = getDeltaMs(prev, node);
        const isSelected = selectedNode?.id === node.id;
        const color = TYPE_COLORS[node.type] || TYPE_COLORS.unknown;
        const textColor = TYPE_TEXT[node.type] || TYPE_TEXT.unknown;

        return (
          <div key={node.id}>
            {/* Delta row */}
            {delta !== null && (
              <div className="flex items-center gap-2 pl-[52px] py-0.5">
                <div className="h-4 w-px bg-gray-700 ml-[3px]" />
                <span className="text-[10px] text-gray-600 font-mono">{formatDelta(delta)}</span>
              </div>
            )}

            {/* Event row */}
            <div
              onClick={() => setSelectedNode(node)}
              className={`flex items-start gap-3 px-4 py-2 cursor-pointer rounded mx-2 transition-colors ${
                isSelected
                  ? 'bg-indigo-700/40 ring-1 ring-indigo-500'
                  : 'hover:bg-gray-700/40'
              }`}
            >
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-mono uppercase font-semibold ${textColor}`}>
                    {node.type}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {formatTimestamp(node.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-300 truncate">{node.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
