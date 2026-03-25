import useAgentStore from '@/store/useAgentStore';
import { formatSessionDisplay } from '@/utils/formatSessionDisplay';
import { StackIcon } from '@phosphor-icons/react';

function SectionTitle({ title, children }) {
  return (
    <div className="px-1 mb-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="m-0 text-[13px] font-semibold text-app-fg tracking-tight leading-tight">{title}</h2>
          <p className="mt-1 m-0 text-[12px] text-app-fg-muted leading-snug">{children}</p>
        </div>
        <StackIcon size={18} weight="duotone" className="shrink-0 text-app-label opacity-80" aria-hidden />
      </div>
    </div>
  );
}

export default function FileSidebar() {
  const workspaceFiles = useAgentStore((s) => s.workspaceFiles);
  const activeFileIndex = useAgentStore((s) => s.activeFileIndex);
  const setActiveFile = useAgentStore((s) => s.setActiveFile);

  return (
    <aside className="w-[280px] shrink-0 border-r border-app-border/80 overflow-hidden bg-[color-mix(in_oklab,var(--app-bg)_82%,var(--app-surface))] min-h-0 flex flex-col">
      <div className="px-4 pt-5 pb-4 border-b border-app-border/60">
        <SectionTitle title="Sessions">
          {workspaceFiles.length === 0
            ? 'Load traces to switch between runs'
            : `${workspaceFiles.length} trace file${workspaceFiles.length === 1 ? '' : 's'}`}
        </SectionTitle>
      </div>

      <div className="overflow-y-auto px-3 pt-2 pb-4 flex-1 min-h-0 space-y-2">
        {workspaceFiles.map((f, idx) => {
          const isActive = idx === activeFileIndex;
          const { title, subtitle, fullLabel } = formatSessionDisplay(f.name);
          return (
            <button
              key={`${f.name}-${idx}`}
              type="button"
              onClick={() => setActiveFile(idx)}
              className={[
                'w-full text-left rounded-2xl px-3.5 py-3 min-h-[52px] transition-[background,box-shadow,transform,ring-color] duration-200 ease-out cursor-pointer outline-offset-2',
                'ring-1 ring-inset',
                isActive
                  ? 'bg-app-surface shadow-[0_1px_0_0_rgba(255,255,255,0.06),0_12px_40px_-24px_rgba(0,0,0,0.85)] ring-white/10 text-app-fg dark:shadow-[0_1px_0_0_rgba(255,255,255,0.08),0_18px_48px_-28px_rgba(0,0,0,0.9)]'
                  : 'bg-transparent shadow-none ring-transparent hover:bg-app-surface/45 hover:ring-app-border/50 text-app-fg-muted hover:text-app-fg active:scale-[0.99]',
              ].join(' ')}
              title={fullLabel}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="text-[13px] font-medium tracking-tight leading-snug line-clamp-2">{title}</div>
              {subtitle ? (
                <div className="mt-1 font-mono text-[10px] tabular-nums text-app-label truncate opacity-90">
                  {subtitle}
                </div>
              ) : (
                <div className="mt-1 text-[11px] text-app-label">JSONL trace</div>
              )}
            </button>
          );
        })}

        {!workspaceFiles.length && (
          <div className="rounded-2xl border border-dashed border-app-border/80 bg-app-surface/30 px-4 py-8 text-center">
            <p className="m-0 text-[13px] font-medium text-app-fg-subtle">No sessions yet</p>
            <p className="mt-2 m-0 text-xs text-app-fg-muted leading-relaxed">
              Drop a JSONL trace or open a folder from the upload dialog.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
