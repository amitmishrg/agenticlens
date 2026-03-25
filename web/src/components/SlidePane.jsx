import { useEffect } from 'react';
import useAgentStore from '@/store/useAgentStore';
import InspectorPanel from '@/features/inspector/InspectorPanel';
import SlidePaneHeader from '@/components/SlidePaneHeader';

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
      <div
        onClick={() => setSelectedNode(null)}
        className="fixed inset-0 z-40 backdrop-blur-[3px] transition-[opacity,backdrop-filter] duration-[320ms] ease-out"
        style={{
          background: 'var(--app-backdrop)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-[min(440px,100vw)] transition-[transform,box-shadow] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-app-border bg-app-surface-elevated/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--app-surface-elevated)_92%,transparent)]"
        style={{
          boxShadow: isOpen ? 'var(--app-pane-shadow)' : 'none',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <SlidePaneHeader node={selectedNode} onClose={() => setSelectedNode(null)} />
        <div className="flex-1 min-h-0 overflow-hidden">
          <InspectorPanel node={selectedNode} />
        </div>
      </div>
    </>
  );
}
