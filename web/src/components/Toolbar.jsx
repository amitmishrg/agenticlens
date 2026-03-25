import { useMemo } from 'react';
import useAgentStore from '@/store/useAgentStore';
import { ArrowsInIcon, ArrowsOutIcon, SparkleIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import { VIEWS } from '@/components/toolbarViews.jsx';
import ToolbarTypeFilter from '@/components/ToolbarTypeFilter';
import ToolbarReplay from '@/components/ToolbarReplay';
import ThemeToggle from '@/components/ThemeToggle';

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
    <header className="flex items-center gap-2 px-4 py-2.5 border-b border-app-border shrink-0 bg-app-bg">
      <div className="flex items-center gap-2 mr-3">
        <div className="w-5 h-5 rounded-md bg-app-accent flex items-center justify-center">
          <SparkleIcon size={11} color="#ffffff" weight="fill" />
        </div>
        <span className="text-xs font-semibold text-app-accent-logo tracking-wide">
          Agenticlens
        </span>
      </div>

      <div className="flex rounded-lg overflow-hidden border border-app-border bg-app-surface">
        {VIEWS.map((v) => {
          const isActive = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              aria-pressed={isActive}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all duration-200 border-r border-app-border last:border-r-0',
                isActive
                  ? 'bg-[var(--app-accent-soft-bg)] text-app-accent-fg shadow-[inset_0_0_0_1px_var(--app-accent-inner-ring)]'
                  : 'text-app-switch-inactive',
              ].join(' ')}
            >
              {v.icon}
              {v.label}
            </button>
          );
        })}
      </div>

      <ToolbarTypeFilter />
      <ToolbarReplay />

      <button
        type="button"
        onClick={openUploadPanel}
        className="ml-2 px-2.5 py-1 text-[11px] rounded-md bg-app-surface-2 text-app-accent border border-app-border-strong"
        title="Upload JSONL files or folders"
      >
        <span className="inline-flex items-center gap-2">
          <UploadSimpleIcon size={14} weight="bold" />
          Upload
        </span>
      </button>

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
              className={[
                'flex items-center justify-center rounded-md p-1.5 transition-colors duration-200 border',
                isActive
                  ? 'bg-[var(--app-accent-soft-bg)] text-app-accent-bright border-[var(--app-accent-soft-border)] shadow-[inset_0_0_0_1px_var(--app-accent-inner-glow)]'
                  : 'bg-[var(--app-tree-btn-bg)] text-[var(--app-tree-btn-fg)] border-app-border',
              ].join(' ')}
            >
              <Icon size={16} weight="duotone" color="currentColor" />
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-app-live" />
        <span className="text-[11px] font-mono text-app-label">{nodes.length} events</span>
      </div>
    </header>
  );
}
