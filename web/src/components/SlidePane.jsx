import { useEffect } from 'react';
import useAgentStore from '../store/useAgentStore';
import InspectorPanel from '../features/inspector/InspectorPanel';
import { getAccent } from '../constants/typeConfig';
import SlidePaneHeader from './SlidePaneHeader';

export default function SlidePane() {
  const { selectedNode, setSelectedNode } = useAgentStore();
  const isOpen = !!selectedNode;

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isOpen) setSelectedNode(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setSelectedNode]);

  return (
    <>
      {/* Dimmed backdrop */}
      <div
        onClick={() => setSelectedNode(null)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Slide-in pane */}
      <div
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
          transition: 'transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease',
        }}
      >
        <SlidePaneHeader node={selectedNode} onClose={() => setSelectedNode(null)} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <InspectorPanel node={selectedNode} />
        </div>
      </div>
    </>
  );
}
