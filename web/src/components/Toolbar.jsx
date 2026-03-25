import { useMemo } from 'react';
import useAgentStore from '@/store/useAgentStore';
import { ArrowsInIcon, ArrowsOutIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import BrandMark from '@/components/BrandMark';
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
  const { view, setView, tree, collapsedNodeIds, collapseAll, expandAll, openUploadPanel } =
    useAgentStore();

  const collapsibleIds = useMemo(() => getAllCollapsibleIds(tree), [tree]);
  const allTreeCollapsed =
    collapsibleIds.length > 0 && collapsibleIds.every((id) => collapsedNodeIds.has(id));
  const allTreeExpanded =
    collapsibleIds.length > 0 && collapsibleIds.every((id) => !collapsedNodeIds.has(id));

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center gap-x-2.5 gap-y-2 px-4 sm:px-5 py-2.5 border-b border-app-chrome-border shrink-0 bg-[var(--app-toolbar-scrim)] backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_0_0_color-mix(in_oklab,var(--app-fg)_6%,transparent)] supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--app-bg)_78%,transparent)]">
      <div className="flex h-9 items-center gap-2.5 mr-2 shrink-0">
        <BrandMark size="sm" className="rounded-md" />
        <span className="text-sm font-semibold leading-none text-app-fg tracking-tight">
          AgenticLens
        </span>
      </div>

      <div
        className="inline-flex h-9 items-stretch rounded-full border border-app-border bg-app-surface-2 p-0.5 shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--app-fg)_8%,transparent)] box-border"
        role="tablist"
        aria-label="Main view"
      >
        {VIEWS.map((v) => {
          const isActive = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setView(v.id)}
              className={[
                'flex items-center justify-center gap-1.5 rounded-full px-3 h-8 self-center text-[13px] font-medium leading-none transition-[color,background,box-shadow,transform] duration-200 ease-out',
                isActive
                  ? 'bg-app-surface text-app-fg shadow-sm ring-1 ring-[color-mix(in_oklab,var(--app-fg)_14%,transparent)]'
                  : 'text-app-fg-muted hover:text-app-fg active:scale-[0.98]',
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
        className="ml-1 inline-flex h-9 items-center justify-center gap-2 px-3.5 text-[13px] font-semibold leading-none rounded-full bg-app-accent text-white border border-transparent shadow-md shadow-indigo-500/20 transition-[transform,box-shadow,filter] duration-200 ease-out hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.97] outline-offset-[3px]"
        title="Upload JSONL files or folders"
      >
        <UploadSimpleIcon size={16} weight="bold" className="shrink-0" aria-hidden />
        Upload
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
                'flex items-center justify-center h-9 w-9 shrink-0 rounded-full border transition-[background-color,border-color,color,transform] duration-200 ease-out',
                isActive
                  ? 'bg-[var(--app-accent-soft-bg)] text-app-accent-bright border-[var(--app-accent-soft-border)] shadow-[inset_0_0_0_1px_var(--app-accent-inner-glow)]'
                  : 'bg-[var(--app-tree-btn-bg)] text-[var(--app-tree-btn-fg)] border-app-border hover:border-app-border-strong hover:text-app-fg-muted active:scale-95',
              ].join(' ')}
            >
              <Icon size={16} weight="duotone" color="currentColor" className="shrink-0" />
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center pl-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
