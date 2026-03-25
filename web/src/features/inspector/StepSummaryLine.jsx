import useAgentStore from '../../store/useAgentStore';
import { formatDeltaMs } from '../../utils/formatDuration';
import TokenGlyph from '../../components/icons/TokenGlyph';
import { TimerIcon } from '@phosphor-icons/react';

/** Shows aggregate stats for the agent step that contains this node. */
export default function StepSummaryLine({ stepId }) {
  const steps = useAgentStore((s) => s.steps);
  if (!stepId) return null;
  const step = steps.find((st) => st.stepId === stepId);
  if (!step) return null;
  const dur = formatDeltaMs(step.duration);

  return (
    <div
      style={{
        marginBottom: 12,
        padding: '10px 12px',
        borderRadius: 8,
        background: '#14141f',
        border: '1px solid #2a2a44',
        fontSize: 11,
        color: '#94a3b8',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '6px 12px',
      }}
    >
      <span style={{ fontWeight: 700, color: '#818cf8', letterSpacing: 1 }}>STEP {step.index}</span>
      {dur != null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <TimerIcon size={12} weight="duotone" color="#94a3b8" />
          {dur}
        </span>
      )}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <TokenGlyph size={14} color="#94a3b8" />
        {step.totalTokens || 0} tokens
      </span>
      <span style={{ color: '#64748b' }}>{step.nodeCount} nodes</span>
    </div>
  );
}
