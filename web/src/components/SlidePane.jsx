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
        className="fixed inset-0 z-40 backdrop-blur-[2px] transition-opacity duration-[250ms]"
        style={{
          background: 'var(--app-backdrop)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-[440px] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border-l border-app-border bg-app-surface-elevated"
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
