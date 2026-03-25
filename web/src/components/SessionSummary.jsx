import { useMemo } from 'react';
import useAgentStore from '../store/useAgentStore';
import { computeVisibleNodeIds } from '../utils/visibility';
import { computeSessionSummary } from '../utils/sessionSummary';
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

    // Count only steps that include at least one visible node.
    const visibleSteps = steps.filter((step) =>
      (step.nodes || []).some((n) => visibleIds.has(n.id)),
    );
    return computeSessionSummary(visibleSteps);
  }, [steps, nodes, filterType, chronNodeIds, currentStepIndex]);

  if (!visibleSummary) return null;

  const totalTime = formatSeconds(visibleSummary.totalDuration);

  return (
    <div className="px-4 py-2 border-b border-gray-800 shrink-0" style={{ background: '#09090c' }}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: '#33334a' }}
        >
          SESSION SUMMARY
        </div>
        <div className="text-[11px] font-mono" style={{ color: '#22223a' }}>
          {/* keeps line-height consistent */}
          &nbsp;
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1 overflow-hidden">
        <span className="text-[12px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
          <TimerIcon size={14} weight="duotone" color="#94a3b8" className="inline-block mr-1" />
          Total Time: <span className="text-[#cbd5e1] font-semibold">{totalTime}</span>
        </span>
        <span className="text-[12px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
          <CoinsIcon size={14} weight="duotone" color="#94a3b8" className="inline-block mr-1" />
          Tokens: <span className="text-[#cbd5e1] font-semibold">{visibleSummary.totalTokens}</span>
        </span>
        <span className="text-[12px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
          <SquaresFourIcon
            size={14}
            weight="duotone"
            color="#94a3b8"
            className="inline-block mr-1"
          />
          Steps: <span className="text-[#cbd5e1] font-semibold">{visibleSummary.totalSteps}</span>
        </span>
        <span className="text-[12px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
          <PackageIcon size={14} weight="duotone" color="#94a3b8" className="inline-block mr-1" />
          Nodes: <span className="text-[#cbd5e1] font-semibold">{visibleSummary.totalNodes}</span>
        </span>
        <span className="text-[12px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
          <WarningIcon size={14} weight="duotone" color="#f87171" className="inline-block mr-1" />
          Issues:{' '}
          <span className="text-[#cbd5e1] font-semibold">{visibleSummary.anomalyCount}</span>
        </span>
      </div>
    </div>
  );
}
