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
    <header className="sticky top-0 z-50 flex flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2.5 border-b border-app-border shrink-0 bg-[var(--app-toolbar-scrim)] backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_0_0_var(--app-border)] supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--app-bg)_78%,transparent)]">
      <div className="flex items-center gap-2.5 mr-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-app-accent to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/15">
          <SparkleIcon size={13} color="#ffffff" weight="fill" />
        </div>
        <span className="text-[13px] font-semibold text-app-fg tracking-tight">
          Agenticlens
        </span>
      </div>

      <div className="flex rounded-xl overflow-hidden border border-app-border bg-app-surface/90 shadow-sm">
        {VIEWS.map((v) => {
          const isActive = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              aria-pressed={isActive}
              className={[
                'flex items-center gap-1.5 px-3 py-2 min-h-9 text-[11px] font-medium transition-[color,background,box-shadow,transform] duration-200 ease-out border-r border-app-border last:border-r-0',
                isActive
                  ? 'bg-[var(--app-accent-soft-bg)] text-app-accent-fg shadow-[inset_0_0_0_1px_var(--app-accent-inner-ring)]'
                  : 'text-app-switch-inactive hover:bg-app-surface-2/80 hover:text-app-fg-muted active:scale-[0.98]',
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
        className="ml-1 px-3 py-2 min-h-9 text-[11px] font-semibold rounded-xl bg-app-accent text-white border border-transparent shadow-md shadow-indigo-500/20 transition-[transform,box-shadow,filter] duration-200 ease-out hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.97] [outline-offset:3px]"
        title="Upload JSONL files or folders"
      >
        <span className="inline-flex items-center gap-2">
          <UploadSimpleIcon size={15} weight="bold" />
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
                'flex items-center justify-center rounded-lg min-w-9 min-h-9 p-2 transition-[background-color,border-color,color,transform] duration-200 ease-out border',
                isActive
                  ? 'bg-[var(--app-accent-soft-bg)] text-app-accent-bright border-[var(--app-accent-soft-border)] shadow-[inset_0_0_0_1px_var(--app-accent-inner-glow)]'
                  : 'bg-[var(--app-tree-btn-bg)] text-[var(--app-tree-btn-fg)] border-app-border hover:border-app-border-strong hover:text-app-fg-muted active:scale-95',
              ].join(' ')}
            >
              <Icon size={16} weight="duotone" color="currentColor" />
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center gap-3 pl-2">
        <ThemeToggle />
        <div
          className="flex items-center gap-2 rounded-full border border-app-border bg-app-surface/80 px-2.5 py-1"
          title="Live session size"
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-app-live opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-app-live shadow-[0_0_8px_var(--app-live)]" />
          </span>
          <span className="text-[11px] font-mono tabular-nums text-app-fg-muted">
            {nodes.length} events
          </span>
        </div>
      </div>
    </header>
  );
}
