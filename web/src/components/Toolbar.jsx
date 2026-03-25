import useAgentStore from '../store/useAgentStore';

const VIEWS = [
  {
    id: 'flow',
    label: 'Flow',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="2.5" r="1.5" />
        <circle cx="3" cy="13" r="1.5" />
        <circle cx="13" cy="13" r="1.5" />
        <path d="M8 4C8 7 3 8 3 11.5" strokeLinecap="round" />
        <path d="M8 4C8 7 13 8 13 11.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'card',
    label: 'Cards',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'tree',
    label: 'Tree',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="2" r="1.5" />
        <circle cx="3" cy="12" r="1.5" />
        <circle cx="13" cy="12" r="1.5" />
        <line x1="8" y1="3.5" x2="8" y2="7" />
        <line x1="8" y1="7" x2="3" y2="10.5" />
        <line x1="8" y1="7" x2="13" y2="10.5" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="2" y1="4" x2="14" y2="4" strokeLinecap="round" />
        <line x1="2" y1="8" x2="10" y2="8" strokeLinecap="round" />
        <line x1="2" y1="12" x2="12" y2="12" strokeLinecap="round" />
        <circle cx="14" cy="4" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Toolbar() {
  const { view, setView, nodes, tree, collapseAll, expandAll } = useAgentStore();

  function getAllIds(treeNodes) {
    const ids = [];
    for (const node of treeNodes) {
      if (node.children?.length > 0) {
        ids.push(node.id);
        ids.push(...getAllIds(node.children));
      }
    }
    return ids;
  }

  return (
    <header className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 shrink-0"
      style={{ background: '#09090c' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="2" fill="white" />
            <line x1="6" y1="1" x2="6" y2="3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="8.5" x2="6" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="6" x2="3.5" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8.5" y1="6" x2="11" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-indigo-400 tracking-wide">AgentScope</span>
      </div>

      {/* View switcher */}
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ border: '1px solid #1e1e2e', background: '#111118' }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all duration-200"
            style={
              view === v.id
                ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderRight: '1px solid #1e1e2e' }
                : { color: '#44445a', borderRight: '1px solid #1e1e2e' }
            }
          >
            {v.icon}
            {v.label}
          </button>
        ))}
      </div>

      {/* Tree-specific controls */}
      {view === 'tree' && (
        <div className="flex gap-1.5 ml-1">
          <button
            onClick={() => collapseAll(getAllIds(tree))}
            className="px-2.5 py-1 text-[11px] rounded-md transition-colors"
            style={{ background: '#1a1a28', color: '#55556a', border: '1px solid #1e1e2e' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#9494b0'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#55556a'; }}
          >
            Collapse all
          </button>
          <button
            onClick={expandAll}
            className="px-2.5 py-1 text-[11px] rounded-md transition-colors"
            style={{ background: '#1a1a28', color: '#55556a', border: '1px solid #1e1e2e' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#9494b0'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#55556a'; }}
          >
            Expand all
          </button>
        </div>
      )}

      {/* Event count */}
      <div className="ml-auto flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: '#22c55e' }}
        />
        <span className="text-[11px] font-mono" style={{ color: '#33334a' }}>
          {nodes.length} events
        </span>
      </div>
    </header>
  );
}
