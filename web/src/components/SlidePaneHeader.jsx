import { getAccent } from '@/constants/typeConfig';
import { XIcon } from '@phosphor-icons/react';

const closeBtn = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: '#141420',
  border: '1px solid #222230',
  color: '#44445a',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s',
  flexShrink: 0,
};

/** Header bar shown at the top of the inspector slide pane. */
export default function SlidePaneHeader({ node, onClose }) {
  const ac = node ? getAccent(node.type) : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px 10px 16px',
        borderBottom: '1px solid #1a1a28',
        background: '#0a0a10',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#33334a',
          }}
        >
          Inspector
        </span>
        {node && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '2px 7px',
              borderRadius: 100,
              color: ac,
              background: `${ac}18`,
              border: `1px solid ${ac}28`,
            }}
          >
            {node.type}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 9, color: '#2a2a3a', letterSpacing: '0.06em' }}>ESC to close</span>
        <button
          onClick={onClose}
          style={closeBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1e1e2e';
            e.currentTarget.style.color = '#8888a8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#141420';
            e.currentTarget.style.color = '#44445a';
          }}
        >
          <XIcon size={10} weight="bold" />
        </button>
      </div>
    </div>
  );
}
