export default function PanelWrap({ label, count, children }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="px-4 py-1.5 shrink-0 flex items-center gap-2 border-b border-app-border bg-[color-mix(in_oklab,var(--app-surface)_92%,var(--app-bg))]">
        <span className="text-[10px] font-bold tracking-widest uppercase text-app-label">
          {label}
        </span>
        <span className="text-[10px] font-mono text-app-label-muted">{count}</span>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto scroll-smooth">{children}</div>
    </div>
  );
}
