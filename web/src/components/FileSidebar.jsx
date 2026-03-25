import useAgentStore from '@/store/useAgentStore';

export default function FileSidebar() {
  const workspaceFiles = useAgentStore((s) => s.workspaceFiles);
  const activeFileIndex = useAgentStore((s) => s.activeFileIndex);
  const setActiveFile = useAgentStore((s) => s.setActiveFile);

  return (
    <aside className="w-[250px] border-r border-app-border overflow-hidden bg-app-bg">
      <div className="px-4 py-3 border-b border-app-border">
        <div className="text-[11px] font-bold tracking-widest uppercase text-app-label">
          Sessions
        </div>
        <div className="text-[10px] font-mono text-app-fg-muted mt-0.5">
          {workspaceFiles.length} file{workspaceFiles.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="overflow-y-auto px-2 pt-2 pb-2.5">
        {workspaceFiles.map((f, idx) => {
          const isActive = idx === activeFileIndex;
          return (
            <button
              key={`${f.name}-${idx}`}
              type="button"
              onClick={() => setActiveFile(idx)}
              className={[
                'w-full px-3 py-2 mb-2 text-left rounded-lg transition-[background,border-color] duration-150 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-[var(--app-list-active-bg)] border border-[var(--app-list-active-border)] text-[var(--app-list-active-fg)]'
                  : 'bg-transparent border border-app-border text-app-fg-muted',
              ].join(' ')}
              title={f.name}
            >
              <div className="text-[11px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                {f.name}
              </div>
            </button>
          );
        })}

        {!workspaceFiles.length && (
          <div className="text-app-fg-muted text-xs p-4">Upload a JSONL file or folder</div>
        )}
      </div>
    </aside>
  );
}
