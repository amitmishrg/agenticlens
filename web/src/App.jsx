import { useEffect, useState } from 'react';
import useAgentStore from './store/useAgentStore';
import { parseJSONL } from './parser/parseJSONL';
import { buildTree } from './parser/buildTree';
import Toolbar from './components/Toolbar';
import TreeView from './components/TreeView';
import TimelineView from './components/TimelineView';
import CardView from './components/CardView';
import FlowView from './components/FlowView';
import SlidePane from './components/SlidePane';

export default function App() {
  const { view, setNodes, setTree, nodes } = useAgentStore();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data');
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const raw = await res.text();
        const parsed = parseJSONL(raw);
        setNodes(parsed);
        setTree(buildTree(parsed));
        setStatus('ready');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    }
    load();
  }, [setNodes, setTree]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#09090c' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs" style={{ color: '#33334a' }}>Loading agent logs…</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#09090c' }}>
        <div className="flex flex-col items-center gap-3 max-w-md text-center px-6">
          <span className="text-3xl">⚠️</span>
          <p className="font-semibold text-red-400 text-sm">Failed to load logs</p>
          <p className="text-xs font-mono text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#09090c' }}>
      <Toolbar />

      {/* Main content — always full width */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'flow'     && <FlowView />}
        {view === 'card'     && <CardView />}
        {view === 'tree'     && <PanelWrap label="Event Tree" count={nodes.length}><TreeView /></PanelWrap>}
        {view === 'timeline' && <PanelWrap label="Timeline" count={nodes.length}><TimelineView /></PanelWrap>}
      </div>

      {/* Inspector slide pane — single shared instance, overlays from the right */}
      <SlidePane />
    </div>
  );
}

/** Thin wrapper used for tree + timeline to keep their sub-header */
function PanelWrap({ label, count, children }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="px-4 py-1.5 shrink-0 flex items-center gap-2"
        style={{ borderBottom: '1px solid #1a1a28' }}
      >
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: '#33334a' }}
        >
          {label}
        </span>
        <span className="text-[10px] font-mono" style={{ color: '#22223a' }}>
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
