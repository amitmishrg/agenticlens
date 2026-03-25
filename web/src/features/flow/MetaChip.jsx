/** A compact metadata badge shown on flow node cards. */
export default function MetaChip({ label, value, color }) {
  if (value == null || value === '') return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 7px',
        borderRadius: 99,
        fontSize: 10,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color: color,
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: '#6b7280' }}>{label}</span>
      {String(value)}
    </span>
  );
}
