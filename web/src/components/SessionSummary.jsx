import { useMemo } from 'react';
import useAgentStore from '@/store/useAgentStore';
import { computeVisibleNodeIds } from '@/utils/visibility';
import { computeSessionSummary } from '@/utils/sessionSummary';
import {
  CoinsIcon,
  PackageIcon,
  SquaresFourIcon,
  TimerIcon,
  WarningIcon,
} from '@phosphor-icons/react';

function formatSeconds(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0.0s';
  const s = ms / 1000;
  return `${s >= 10 ? Math.round(s) : s.toFixed(1)}s`;
}

function Chip({ children, tone = 'neutral' }) {
  const tones = {
    neutral:
      'bg-app-surface-2/90 text-app-fg-muted ring-black/[0.06] dark:bg-app-surface-2/60 dark:ring-white/[0.07]',
    accent: 'bg-[var(--app-accent-soft-bg)] text-app-accent-fg ring-[var(--app-accent-inner-ring)]/35',
  };
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        tones[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}

function MetricTile({ icon: Icon, label, value, highlight = false }) {
  return (
    <div
      className={[
        'group relative min-w-[7.5rem] flex-1 rounded-2xl px-4 py-3',
        'bg-app-surface/35 ring-1 ring-inset ring-black/[0.04] shadow-[0_1px_0_0_rgba(255,255,255,0.04)]',
        'dark:bg-app-surface/40 dark:ring-white/[0.06] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]',
        'transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:shadow-md',
        highlight ? 'ring-amber-400/25 dark:ring-amber-400/20' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 text-app-fg-muted">
        <Icon size={15} weight="duotone" className="opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="text-[11px] font-medium tracking-tight">{label}</span>
      </div>
      <div className="mt-1.5 text-[22px] font-semibold tabular-nums tracking-tight text-app-fg leading-none">
        {value}
      </div>
    </div>
  );
}

export default function SessionSummary() {
  const nodes = useAgentStore((s) => s.nodes);
  const steps = useAgentStore((s) => s.steps);
  const filterType = useAgentStore((s) => s.filterType);
  const chronNodeIds = useAgentStore((s) => s.chronNodeIds);
  const currentStepIndex = useAgentStore((s) => s.currentStepIndex);

  const visibleSummary = useMemo(() => {
    if (!steps?.length) return null;

    const visibleIds = computeVisibleNodeIds(nodes, {
      replayIndex: currentStepIndex,
      chronNodeIds,
      filterType,
    });

    const visibleSteps = steps.filter((step) => (step.nodes || []).some((n) => visibleIds.has(n.id)));
    return computeSessionSummary(visibleSteps);
  }, [steps, nodes, filterType, chronNodeIds, currentStepIndex]);

  if (!visibleSummary) return null;

  const totalTime = formatSeconds(visibleSummary.totalDuration);
  const hasIssues = visibleSummary.anomalyCount > 0;
  const chronLen = chronNodeIds.length;
  const replayActive = currentStepIndex >= 0 && chronLen > 0;

  return (
    <div className="session-summary-anim shrink-0 border-b border-app-border/70 bg-[color-mix(in_oklab,var(--app-bg)_88%,var(--app-surface))]">
      <div className="px-4 sm:px-5 pt-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="m-0 text-[13px] font-semibold text-app-fg tracking-tight">Metrics</h2>
            <p className="mt-0.5 m-0 text-[12px] text-app-fg-muted">
              Totals for what you can see right now — filters and replay narrow the window.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {replayActive ? (
              <Chip tone="accent">
                Replay · event {currentStepIndex + 1} of {chronLen}
              </Chip>
            ) : chronLen > 0 ? (
              <Chip tone="neutral">Full timeline</Chip>
            ) : null}
            {filterType !== 'all' ? <Chip tone="neutral">Type · {filterType}</Chip> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <MetricTile icon={TimerIcon} label="Total time" value={totalTime} />
          <MetricTile
            icon={CoinsIcon}
            label="Tokens"
            value={visibleSummary.totalTokens.toLocaleString()}
          />
          <MetricTile icon={SquaresFourIcon} label="Steps" value={String(visibleSummary.totalSteps)} />
          <MetricTile icon={PackageIcon} label="Nodes" value={String(visibleSummary.totalNodes)} />
          <MetricTile
            icon={WarningIcon}
            label="Issues"
            value={hasIssues ? String(visibleSummary.anomalyCount) : 'None'}
            highlight={hasIssues}
          />
        </div>
      </div>
    </div>
  );
}
