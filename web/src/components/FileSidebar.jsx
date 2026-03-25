import useAgentStore from '@/store/useAgentStore';

export default function FileSidebar() {
  const workspaceFiles = useAgentStore((s) => s.workspaceFiles);
  const activeFileIndex = useAgentStore((s) => s.activeFileIndex);
  const setActiveFile = useAgentStore((s) => s.setActiveFile);

  return (
    <aside className="w-[260px] border-r border-app-border overflow-hidden bg-[color-mix(in_oklab,var(--app-surface-elevated)_40%,transparent)] min-h-0 flex flex-col">
      <div className="px-4 py-3.5 border-b border-app-border bg-app-surface/30">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-app-label">
          Sessions
        </div>
        <div className="text-[11px] font-mono tabular-nums text-app-fg-muted mt-1">
          {workspaceFiles.length} file{workspaceFiles.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="overflow-y-auto px-2.5 pt-2.5 pb-3 flex-1 min-h-0 space-y-1.5">
        {workspaceFiles.map((f, idx) => {
          const isActive = idx === activeFileIndex;
          return (
            <button
              key={`${f.name}-${idx}`}
              type="button"
              onClick={() => setActiveFile(idx)}
              className={[
                'w-full px-3 py-2.5 min-h-[44px] text-left rounded-xl transition-[background,border-color,box-shadow,transform] duration-200 ease-out overflow-hidden cursor-pointer [outline-offset:2px]',
                isActive
                  ? 'bg-[var(--app-list-active-bg)] border border-[var(--app-list-active-border)] text-[var(--app-list-active-fg)] shadow-sm'
                  : 'bg-app-surface/50 border border-transparent text-app-fg-muted hover:bg-app-surface/90 hover:border-app-border hover:text-app-fg-subtle active:scale-[0.99]',
              ].join(' ')}
              title={f.name}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="text-[12px] font-medium overflow-hidden text-ellipsis whitespace-nowrap leading-snug">
                {f.name}
              </div>
            </button>
          );
        })}

        {!workspaceFiles.length && (
          <div className="text-app-fg-muted text-xs px-3 py-6 text-center leading-relaxed rounded-xl border border-dashed border-app-border bg-app-surface/40">
            Upload a JSONL file or folder to get started
          </div>
        )}
      </div>
    </aside>
  );
}
