/** A single label / value row inside the Inspector metadata section. */
export default function MetaRow({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex gap-2 text-xs py-0.5">
      <span style={{ color: '#6b7280', minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span
        style={{ color: '#e5e7eb', wordBreak: 'break-all', fontFamily: 'monospace' }}
        title={String(value)}
      >
        {String(value)}
      </span>
    </div>
  );
}
