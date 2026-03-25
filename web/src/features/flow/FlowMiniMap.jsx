import { MiniMap } from '@xyflow/react';

/**
 * Bird's-eye overview of the full flow. The cut-out rectangle is the current viewport;
 * dimmed regions are off-screen. Drag inside the map to pan; scroll to zoom.
 */
export default function FlowMiniMap() {
  return (
    <MiniMap
      position="bottom-right"
      pannable
      zoomable
      zoomStep={10}
      nodeColor={(n) =>
        n.type === 'stepNode' ? 'rgba(99, 102, 241, 0.88)' : 'rgba(71, 85, 105, 0.92)'
      }
      nodeStrokeWidth={0}
      nodeBorderRadius={3}
      maskColor="rgba(9, 9, 12, 0.74)"
      maskStrokeColor="rgba(129, 140, 248, 0.9)"
      maskStrokeWidth={2}
      bgColor="#111116"
      style={{
        borderRadius: 20,
        width: 160,
        height: 100,
      }}
      ariaLabel="Flow overview: frame shows the visible area; drag to pan, scroll wheel to zoom"
    />
  );
}
