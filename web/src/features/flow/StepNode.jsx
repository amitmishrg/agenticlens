import { memo } from 'react';
import { FlameIcon, TimerIcon, WarningOctagonIcon } from '@phosphor-icons/react';
import { formatDeltaMs } from '../../utils/formatDuration';
import TokenGlyph from '../../components/icons/TokenGlyph';

/** React Flow parent node: step summary header + bounds for child events. */
function StepNode({ data }) {
  const { step } = data;
  const dur = formatDeltaMs(step.duration);
  const stepAnomalies = step.anomalies || [];
  const isSlow = stepAnomalies.includes('slow');
  const hasHighTokens = stepAnomalies.includes('high_tokens');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 14,
        border: '1px solid #2a2a4a',
        background: 'linear-gradient(165deg, rgba(30,30,55,0.92) 0%, rgba(12,12,20,0.85) 100%)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          minHeight: 50,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#6366f1' }}>
          STEP {step.index}
        </span>
        {dur != null && (
          <span style={{ fontSize: 10, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <TimerIcon size={12} color="#94a3b8" weight="duotone" />
            {dur}
          </span>
        )}
        {isSlow && (
          <span className="text-[10px] inline-flex items-center px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500 text-red-200 font-semibold">
            <WarningOctagonIcon size={12} weight="duotone" color="#f87171" />
            <span className="ml-1">Slow</span>
          </span>
        )}
        {hasHighTokens && (
          <span className="text-[10px] inline-flex items-center px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500 text-orange-200 font-semibold">
            <FlameIcon size={12} weight="duotone" color="#fb923c" />
            <span className="ml-1">High Tokens</span>
          </span>
        )}
        <span style={{ fontSize: 10, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <TokenGlyph size={14} color="#94a3b8" />
          {step.totalTokens || 0} tokens
        </span>
        <span style={{ fontSize: 10, color: '#475569' }}>
          {step.nodeCount} nodes
        </span>
      </div>
    </div>
  );
}

export default memo(StepNode);
