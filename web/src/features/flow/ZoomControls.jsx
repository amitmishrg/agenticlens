import { Panel, useReactFlow, useViewport } from '@xyflow/react';

const btn =
  'text-xs px-2.5 py-1 rounded-md cursor-pointer transition-colors border bg-app-surface-2 border-app-border-strong text-app-fg-muted hover:text-app-fg hover:border-app-border';

/** Zoom controls panel displayed inside the React Flow canvas. */
export default function ZoomControls() {
  const { zoomIn, zoomOut, fitView, setViewport, getViewport, getNodes } = useReactFlow();
  const viewport = useViewport();
  const pct = Math.round(viewport.zoom * 100);

  const reset100 = () => {
    const nodes = getNodes();
    if (!nodes.length) {
      const vp = getViewport();
      setViewport({ x: vp.x, y: vp.y, zoom: 1.0 }, { duration: 300 });
      return;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    for (const n of nodes) {
      const x = n.positionAbsolute?.x ?? n.position?.x ?? 0;
      const styleW = Number(n.style?.width);
      const w = n.width ?? n.measured?.width ?? (Number.isFinite(styleW) ? styleW : 0);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + w);
    }

    const centerX = (minX + maxX) / 2;
    const pane = document.querySelector('.react-flow__renderer');
    const paneWidth = pane?.clientWidth ?? window.innerWidth;
    const vp = getViewport();
    const x = paneWidth / 2 - centerX;

    setViewport({ x, y: vp.y, zoom: 1.0 }, { duration: 320 });
  };

  const fitAll = () => fitView({ padding: 0.12, maxZoom: 1.0, duration: 400 });

  return (
    <Panel position="top-right">
      <div className="flex items-center gap-1.5 bg-app-bg p-1.5 rounded-lg border border-app-border">
        <button type="button" className={btn} onClick={() => zoomOut({ duration: 200 })}>
          −
        </button>

        <span className="text-[11px] text-app-fg-muted min-w-[38px] text-center font-mono">
          {pct}%
        </span>

        <button type="button" className={btn} onClick={() => zoomIn({ duration: 200 })}>
          +
        </button>

        <div className="w-px h-4 bg-app-border-strong" />

        <button type="button" className={btn} onClick={reset100} title="Reset to 100%">
          1:1
        </button>
        <button type="button" className={btn} onClick={fitAll} title="Fit all nodes">
          Fit
        </button>
      </div>
    </Panel>
  );
}
