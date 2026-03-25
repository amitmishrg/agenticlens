export default function PanelWrap({ label, count, children }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        className="px-4 py-1.5 shrink-0 flex items-center gap-2"
        style={{ borderBottom: '1px solid #1a1a28' }}
      >
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: '#33334a' }}
        >
          {label}
        </span>
        <span className="text-[10px] font-mono" style={{ color: '#22223a' }}>
          {count}
        </span>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
