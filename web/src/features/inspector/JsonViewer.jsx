import { useState } from 'react';

/** Collapsible raw JSON block inside the Inspector. */
export default function JsonViewer({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid color-mix(in oklab, var(--app-fg) 10%, var(--app-border))',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 14px',
          background: 'color-mix(in oklab, var(--app-surface) 88%, var(--app-bg))',
          color: 'var(--app-label)',
          fontSize: 11,
          letterSpacing: 1,
          cursor: 'pointer',
          border: 'none',
        }}
      >
        {open ? '▾' : '▸'} RAW JSON
      </button>
      {open && (
        <pre
          style={{
            margin: 0,
            padding: '12px 14px',
            maxHeight: 300,
            overflowY: 'auto',
            fontSize: 11,
            lineHeight: 1.6,
            color: 'var(--app-fg-muted)',
            background: 'color-mix(in oklab, var(--app-surface) 84%, var(--app-bg))',
            fontFamily: 'monospace',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
