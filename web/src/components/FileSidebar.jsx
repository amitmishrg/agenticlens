import useAgentStore from '../store/useAgentStore';

export default function FileSidebar() {
  const workspaceFiles = useAgentStore((s) => s.workspaceFiles);
  const activeFileIndex = useAgentStore((s) => s.activeFileIndex);
  const setActiveFile = useAgentStore((s) => s.setActiveFile);

  return (
    <aside
      className="w-[250px] border-r border-gray-800 overflow-hidden"
      style={{ background: '#09090c' }}
    >
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1a1a28' }}>
        <div
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: '#33334a' }}
        >
          Sessions
        </div>
        <div className="text-[10px] font-mono" style={{ color: '#64748b', marginTop: 2 }}>
          {workspaceFiles.length} file{workspaceFiles.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="overflowY-auto" style={{ padding: '8px 8px 10px 8px' }}>
        {workspaceFiles.map((f, idx) => {
          const isActive = idx === activeFileIndex;
          return (
            <button
              key={`${f.name}-${idx}`}
              type="button"
              onClick={() => setActiveFile(idx)}
              className="w-full px-3 py-2 mb-2 text-left rounded-lg"
              style={{
                background: isActive ? 'rgba(99,102,241,0.16)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(129,140,248,0.55)' : '#1e1e2e'}`,
                color: isActive ? '#c7d2fe' : '#94a3b8',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={f.name}
            >
              <div
                className="text-[11px] font-semibold"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {f.name}
              </div>
            </button>
          );
        })}

        {!workspaceFiles.length && (
          <div style={{ color: '#64748b', fontSize: 12, padding: 16 }}>
            Upload a JSONL file or folder
          </div>
        )}
      </div>
    </aside>
  );
}
