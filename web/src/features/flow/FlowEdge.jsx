import { getBezierPath } from '@xyflow/react';

/**
 * Animated edge with optional center label (inter-node latency).
 */
export default function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const ac = data?.accent ?? '#6366f1';
  const pathId = `motion-${id}`;
  const label = data?.label;

  return (
    <g className="react-flow__edge">
      <path id={pathId} d={path} fill="none" stroke="none" />
      <path d={path} stroke={ac} strokeWidth={7} fill="none" opacity={0.07} />
      <path d={path} stroke={ac} strokeWidth={1.2} fill="none" opacity={0.25} />
      <path
        d={path}
        stroke={ac}
        strokeWidth={1.6}
        fill="none"
        opacity={0.75}
        strokeDasharray="6 10"
        style={{ animation: 'flowDash 1.6s linear infinite' }}
      />
      <circle r="3.5" fill={ac} opacity={0.95}>
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
      {label ? (
        <g
          transform={`translate(${labelX}, ${labelY})`}
          className="nodrag nopan"
          style={{ pointerEvents: 'none' }}
        >
          <text
            x={0}
            y={0}
            dy="0.35em"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={10}
            style={{ fontFamily: 'monospace' }}
          >
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
}
