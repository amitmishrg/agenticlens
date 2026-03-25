import { getBezierPath } from '@xyflow/react';

/**
 * Animated connection edge for the Flow view.
 * Draws a glowing bezier curve with flowing dashes and a traveling dot.
 */
export default function FlowEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data,
}) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const ac      = data?.accent ?? '#6366f1';
  const pathId  = `motion-${id}`;

  return (
    <>
      {/* Hidden path for animateMotion reference */}
      <path id={pathId} d={path} fill="none" stroke="none" />

      {/* Soft glow halo */}
      <path d={path} stroke={ac} strokeWidth={7} fill="none" opacity={0.07} />

      {/* Static base line */}
      <path d={path} stroke={ac} strokeWidth={1.2} fill="none" opacity={0.25} />

      {/* Flowing dashes */}
      <path
        d={path} stroke={ac} strokeWidth={1.6} fill="none" opacity={0.75}
        strokeDasharray="6 10"
        style={{ animation: 'flowDash 1.6s linear infinite' }}
      />

      {/* Traveling dot */}
      <circle r="3.5" fill={ac} opacity={0.95}>
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </>
  );
}
