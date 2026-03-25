import { useEffect, useRef } from 'react';
import useAgentStore from '../store/useAgentStore';
import InspectorPanel from './InspectorPanel';

export default function SlidePane() {
  const { selectedNode, setSelectedNode } = useAgentStore();
  const isOpen = !!selectedNode;
  const paneRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isOpen) setSelectedNode(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setSelectedNode]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSelectedNode(null)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Slide pane */}
      <div
        ref={paneRef}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: 440,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a10',
          borderLeft: '1px solid #1e1e2e',
          boxShadow: isOpen ? '-24px 0 80px rgba(0,0,0,0.7)' : 'none',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s ease',
        }}
      >
        {/* Pane header */}
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
            {selectedNode && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: 100,
                  color: getAccent(selectedNode.type),
                  background: `${getAccent(selectedNode.type)}18`,
                  border: `1px solid ${getAccent(selectedNode.type)}28`,
                }}
              >
                {selectedNode.type}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* ESC hint */}
            <span style={{ fontSize: 9, color: '#2a2a3a', letterSpacing: '0.06em' }}>ESC to close</span>

            {/* Close button */}
            <button
              onClick={() => setSelectedNode(null)}
              style={{
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
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1e1e2e';
                e.currentTarget.style.color = '#8888a8';
                e.currentTarget.style.borderColor = '#333346';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#141420';
                e.currentTarget.style.color = '#44445a';
                e.currentTarget.style.borderColor = '#222230';
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="1" y1="1" x2="9" y2="9" />
                <line x1="9" y1="1" x2="1" y2="9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Inspector content — always mounted so transitions are smooth */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <InspectorPanel />
        </div>
      </div>
    </>
  );
}

function getAccent(type) {
  const map = {
    user: '#6366f1', assistant: '#22c55e', thinking: '#eab308',
    tool_use: '#f97316', tool_result: '#14b8a6', system: '#a855f7',
    progress: '#06b6d4', result: '#94a3b8', 'queue-operation': '#ec4899',
    'last-prompt': '#818cf8',
  };
  return map[type] ?? '#6b7280';
}
