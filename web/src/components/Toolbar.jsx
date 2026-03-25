import useAgentStore from '../store/useAgentStore';
import { VIEWS } from './toolbarViews.jsx';

function getAllCollapsibleIds(treeNodes) {
  const ids = [];
  for (const node of treeNodes) {
    if (node.children?.length > 0) {
      ids.push(node.id, ...getAllCollapsibleIds(node.children));
    }
  }
  return ids;
}

export default function Toolbar() {
  const { view, setView, nodes, tree, collapseAll, expandAll } = useAgentStore();

  return (
    <header
      className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 shrink-0"
      style={{ background: '#09090c' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="2" fill="white" />
            <line x1="6" y1="1"   x2="6"  y2="3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="8.5" x2="6"  y2="11"  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="6"   x2="3.5" y2="6"  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8.5" y1="6" x2="11"  y2="6"  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
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

      {/* Tree-specific: collapse / expand controls */}
      {view === 'tree' && (
        <div className="flex gap-1.5 ml-1">
          {[
            { label: 'Collapse all', action: () => collapseAll(getAllCollapsibleIds(tree)) },
            { label: 'Expand all',   action: expandAll },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="px-2.5 py-1 text-[11px] rounded-md"
              style={{ background: '#1a1a28', color: '#55556a', border: '1px solid #1e1e2e' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Event counter */}
      <div className="ml-auto flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
        <span className="text-[11px] font-mono" style={{ color: '#33334a' }}>
          {nodes.length} events
        </span>
      </div>
    </header>
  );
}
