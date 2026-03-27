/** A single label / value row inside the Inspector metadata section. */
export default function MetaRow({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex gap-2 text-xs py-0.5">
      <span style={{ color: 'var(--app-fg-muted)', minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span
        style={{ color: 'var(--app-fg)', wordBreak: 'break-all', fontFamily: 'monospace' }}
        title={String(value)}
      >
        {String(value)}
      </span>
    </div>
  );
}
