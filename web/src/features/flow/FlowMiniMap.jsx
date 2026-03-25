import { MiniMap } from '@xyflow/react';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * Bird's-eye overview of the flow. Drag to pan, scroll to zoom.
 */
export default function FlowMiniMap() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <MiniMap
      position="bottom-right"
      pannable
      zoomable
      zoomStep={10}
      nodeColor={(n) =>
        n.type === 'stepNode'
          ? isDark
            ? 'rgba(99, 102, 241, 0.88)'
            : 'rgba(79, 70, 229, 0.82)'
          : isDark
            ? 'rgba(71, 85, 105, 0.92)'
            : 'rgba(100, 116, 139, 0.9)'
      }
      nodeStrokeWidth={0}
      nodeBorderRadius={3}
      maskColor={isDark ? 'rgba(9, 9, 12, 0.74)' : 'rgba(248, 250, 252, 0.78)'}
      maskStrokeColor={isDark ? 'rgba(129, 140, 248, 0.9)' : 'rgba(79, 70, 229, 0.75)'}
      maskStrokeWidth={2}
      bgColor={isDark ? '#111116' : '#e2e8f0'}
      style={{
        borderRadius: 12,
        width: 160,
        height: 100,
        margin: 12,
        border: '1px solid var(--app-border)',
      }}
      ariaLabel="Flow overview: frame shows the visible area; drag to pan, scroll wheel to zoom"
    />
  );
}
