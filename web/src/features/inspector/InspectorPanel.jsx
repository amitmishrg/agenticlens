import TypeIcon from '@/components/TypeIcon';
import MetaSection from '@/features/inspector/MetaSection';
import JsonViewer from '@/features/inspector/JsonViewer';
import StepSummaryLine from '@/features/inspector/StepSummaryLine';
import { getAccent } from '@/constants/typeConfig';
import { formatDeltaMs } from '@/utils/formatDuration';
import { ClockClockwiseIcon, HourglassLowIcon, TimerIcon } from '@phosphor-icons/react';

export default function InspectorPanel({ node }) {
  if (!node) return null;
  const ac = getAccent(node.type);

  return (
    <div
      style={{ padding: '16px 18px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `${ac}22`,
            border: `1.5px solid ${ac}55`,
            marginTop: 1,
            flexShrink: 0,
          }}
        >
          <TypeIcon type={node.type} color={ac} size={18} />
        </span>
        <div>
          <p style={{ color: 'var(--app-fg)', fontWeight: 600, fontSize: 14, margin: 0 }}>{node.label}</p>
          <p
            style={{
              color: ac,
              fontSize: 11,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {node.type}
          </p>
        </div>
      </div>

      <StepSummaryLine stepId={node.stepId} />

      {(node.parentDeltaMs != null || node.deltaMs != null || node.meta?.durationMs != null) && (
        <p
          style={{
            fontSize: 11,
            color: 'var(--app-fg-muted)',
            margin: '0 0 12px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px 10px',
          }}
        >
          {node.parentDeltaMs != null && (
            <span
              title="Wall time since parent node in the event tree (same as graph edges)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <TimerIcon size={12} weight="duotone" color="currentColor" />
              parent: {formatDeltaMs(node.parentDeltaMs)}
            </span>
          )}
          {node.deltaMs != null && (
            <span
              title="Time since previous line when all events are sorted by timestamp"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <ClockClockwiseIcon size={12} weight="duotone" color="currentColor" />
              log order: {formatDeltaMs(node.deltaMs)}
            </span>
          )}
          {node.meta?.durationMs != null && (
            <span
              title="duration_ms from this event payload"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <HourglassLowIcon size={12} weight="duotone" color="currentColor" />
              payload: {formatDeltaMs(node.meta.durationMs)}
            </span>
          )}
        </p>
      )}

      <MetaSection meta={node.meta} timestamp={node.timestamp} />
      <JsonViewer data={node.data} />
    </div>
  );
}
