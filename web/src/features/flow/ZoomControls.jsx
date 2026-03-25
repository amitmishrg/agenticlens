import { Panel, useReactFlow, useViewport } from '@xyflow/react';

const btn = {
  background: '#111116', border: '1px solid #2d2d3d', color: '#9ca3af',
  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
  transition: 'color 0.15s, border-color 0.15s',
};

/** Zoom controls panel displayed inside the React Flow canvas. */
export default function ZoomControls() {
  const { zoomIn, zoomOut, fitView, setViewport, getViewport } = useReactFlow();
  const viewport = useViewport();
  const pct = Math.round(viewport.zoom * 100);

  const reset100 = () => {
    const vp = getViewport();
    setViewport({ x: vp.x, y: vp.y, zoom: 1.0 }, { duration: 300 });
  };

  const fitAll = () => fitView({ padding: 0.12, maxZoom: 1.0, duration: 400 });

  return (
    <Panel position="top-right">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#09090c', padding: 6, borderRadius: 8, border: '1px solid #1e1e2e' }}>
        <button style={btn} onClick={() => zoomOut({ duration: 200 })}>−</button>

        <span style={{ fontSize: 11, color: '#6b7280', minWidth: 38, textAlign: 'center', fontFamily: 'monospace' }}>
          {pct}%
        </span>

        <button style={btn} onClick={() => zoomIn({ duration: 200 })}>+</button>

        <div style={{ width: 1, height: 16, background: '#2d2d3d' }} />

        <button style={btn} onClick={reset100} title="Reset to 100%">1:1</button>
        <button style={btn} onClick={fitAll}   title="Fit all nodes">Fit</button>
      </div>
    </Panel>
  );
}
