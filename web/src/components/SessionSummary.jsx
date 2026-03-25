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

function MetricPill({ icon: Icon, label, value, valueClassName = '' }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-app-border bg-app-surface/70 px-3 py-2 shadow-sm backdrop-blur-sm min-w-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-app-surface-2 text-app-fg-muted">
        <Icon size={16} weight="duotone" color="currentColor" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-app-label">{label}</div>
        <div
          className={['truncate text-[13px] font-semibold tabular-nums text-app-fg-subtle', valueClassName].join(
            ' ',
          )}
        >
          {value}
        </div>
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

  return (
    <div className="session-summary-anim px-4 py-3 border-b border-app-border shrink-0 bg-[color-mix(in_oklab,var(--app-surface)_55%,transparent)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-app-label m-0">
          Session summary
        </h2>
        <span className="text-[10px] font-medium text-app-fg-muted">Visible range</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <MetricPill icon={TimerIcon} label="Total time" value={totalTime} />
        <MetricPill
          icon={CoinsIcon}
          label="Tokens"
          value={visibleSummary.totalTokens.toLocaleString()}
        />
        <MetricPill icon={SquaresFourIcon} label="Steps" value={String(visibleSummary.totalSteps)} />
        <MetricPill icon={PackageIcon} label="Nodes" value={String(visibleSummary.totalNodes)} />
        <div className="sm:col-span-2 lg:col-span-2">
          <MetricPill
            icon={WarningIcon}
            label="Issues"
            value={String(visibleSummary.anomalyCount)}
            valueClassName={hasIssues ? 'text-red-400' : ''}
          />
        </div>
      </div>
    </div>
  );
}
