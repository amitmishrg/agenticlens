import { memo } from 'react';
import { FlameIcon, TimerIcon, WarningOctagonIcon } from '@phosphor-icons/react';
import { formatDeltaMs } from '@/utils/formatDuration';
import TokenGlyph from '@/components/icons/TokenGlyph';
import { useThemeStore } from '@/store/useThemeStore';

/** React Flow parent node: step summary header + bounds for child events. */
function StepNode({ data }) {
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === 'light';
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
        border: '1px solid var(--app-step-border)',
        background: 'var(--app-step-bg)',
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
          borderBottom: '1px solid var(--app-step-header-divider)',
          background: 'var(--app-step-header-bg)',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--app-accent)' }}>
          STEP {step.index}
        </span>
        {dur != null && (
          <span
            style={{
              fontSize: 10,
              color: 'var(--app-fg-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <TimerIcon size={12} color="currentColor" weight="duotone" />
            {dur}
          </span>
        )}
        {isSlow && (
          <span
            className={[
              'text-[10px] inline-flex items-center px-2 py-0.5 rounded-md font-semibold border',
              isLight
                ? 'bg-red-500/10 border-red-600/40 text-red-700'
                : 'bg-red-500/20 border-red-500 text-red-200',
            ].join(' ')}
          >
            <WarningOctagonIcon size={12} weight="duotone" color="#f87171" />
            <span className="ml-1">Slow</span>
          </span>
        )}
        {hasHighTokens && (
          <span
            className={[
              'text-[10px] inline-flex items-center px-2 py-0.5 rounded-md font-semibold border',
              isLight
                ? 'bg-orange-500/10 border-orange-600/40 text-amber-900'
                : 'bg-orange-500/20 border-orange-500 text-orange-200',
            ].join(' ')}
          >
            <FlameIcon size={12} weight="duotone" color="#fb923c" />
            <span className="ml-1">High Tokens</span>
          </span>
        )}
        <span
          style={{
            fontSize: 10,
            color: 'var(--app-fg-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <TokenGlyph size={14} color="currentColor" />
          {step.totalTokens || 0} tokens
        </span>
        <span style={{ fontSize: 10, color: 'var(--app-label)' }}>{step.nodeCount} nodes</span>
      </div>
    </div>
  );
}

export default memo(StepNode);
