import { useMemo } from 'react';
import useAgentStore from '@/store/useAgentStore';
import { ArrowsInIcon, ArrowsOutIcon, SparkleIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import { VIEWS } from '@/components/toolbarViews.jsx';
import ToolbarTypeFilter from '@/components/ToolbarTypeFilter';
import ToolbarReplay from '@/components/ToolbarReplay';

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
  const { view, setView, nodes, tree, collapsedNodeIds, collapseAll, expandAll, openUploadPanel } =
    useAgentStore();

  const collapsibleIds = useMemo(() => getAllCollapsibleIds(tree), [tree]);
  const allTreeCollapsed =
    collapsibleIds.length > 0 && collapsibleIds.every((id) => collapsedNodeIds.has(id));
  const allTreeExpanded =
    collapsibleIds.length > 0 && collapsibleIds.every((id) => !collapsedNodeIds.has(id));

  return (
    <header
      className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 shrink-0"
      style={{ background: '#09090c' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
          <SparkleIcon size={11} color="#ffffff" weight="fill" />
        </div>
        <span className="text-xs font-semibold text-indigo-400 tracking-wide">Agenticlens</span>
      </div>

      {/* View switcher */}
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ border: '1px solid #1e1e2e', background: '#111118' }}
      >
        {VIEWS.map((v) => {
          const isActive = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              aria-pressed={isActive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all duration-200"
              style={
                isActive
                  ? {
                      background: 'rgba(99,102,241,0.28)',
                      color: '#a5b4fc',
                      borderRight: '1px solid #1e1e2e',
                      boxShadow: 'inset 0 0 0 1px rgba(129, 140, 248, 0.35)',
                    }
                  : { color: '#44445a', borderRight: '1px solid #1e1e2e' }
              }
            >
              {v.icon}
              {v.label}
            </button>
          );
        })}
      </div>

      <ToolbarTypeFilter />
      <ToolbarReplay />

      {/* Workspace upload entrypoint */}
      <button
        type="button"
        onClick={openUploadPanel}
        className="ml-2 px-2.5 py-1 text-[11px] rounded-md"
        style={{ background: '#1a1a28', color: '#818cf8', border: '1px solid #2a2a44' }}
        title="Upload JSONL files or folders"
      >
        <span className="inline-flex items-center gap-2">
          <UploadSimpleIcon size={14} weight="bold" />
          Upload
        </span>
      </button>

      {/* Tree-specific: collapse / expand controls */}
      {view === 'tree' && (
        <div className="flex gap-1 ml-1">
          {[
            {
              title: 'Collapse all',
              action: () => collapseAll(getAllCollapsibleIds(tree)),
              icon: ArrowsInIcon,
              isActive: allTreeCollapsed,
            },
            {
              title: 'Expand all',
              action: expandAll,
              icon: ArrowsOutIcon,
              isActive: allTreeExpanded,
            },
          ].map(({ title, action, icon: Icon, isActive }) => (
            <button
              key={title}
              type="button"
              onClick={action}
              title={title}
              aria-label={title}
              aria-pressed={isActive}
              className="flex items-center justify-center rounded-md p-1.5 transition-colors duration-200"
              style={
                isActive
                  ? {
                      background: 'rgba(99,102,241,0.28)',
                      color: '#c7d2fe',
                      border: '1px solid rgba(129, 140, 248, 0.45)',
                      boxShadow: 'inset 0 0 0 1px rgba(165, 180, 252, 0.15)',
                    }
                  : {
                      background: '#1a1a28',
                      color: '#64748b',
                      border: '1px solid #1e1e2e',
                    }
              }
            >
              <Icon size={16} weight="duotone" color="currentColor" />
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
