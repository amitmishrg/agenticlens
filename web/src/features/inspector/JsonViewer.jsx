import { useState } from 'react';

/** Collapsible raw JSON block inside the Inspector. */
export default function JsonViewer({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid #1e1e2e', borderRadius: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 14px',
          background: '#111116',
          color: '#6b7280',
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
            color: '#9ca3af',
            background: '#0d0d11',
            fontFamily: 'monospace',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
