import { useMemo } from 'react';
import { FlameIcon, WarningIcon, WarningOctagonIcon } from '@phosphor-icons/react';
import useAgentStore from '@/store/useAgentStore';

function formatStepSeconds(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '0.0';
  const s = ms / 1000;
  return s >= 10 ? String(Math.round(s)) : s.toFixed(1);
}

export default function IssuesPanel() {
  const steps = useAgentStore((s) => s.steps);
  const focusNode = useAgentStore((s) => s.focusNode);
  const focusStep = useAgentStore((s) => s.focusStep);

  const issues = useMemo(() => {
    const rows = [];
    for (const step of steps || []) {
      if (!step?.anomalies?.length) continue;
      const slowTarget = step.anomalyTargets?.slow;
      const tokenTarget = step.anomalyTargets?.high_tokens;
      if (step.anomalies.includes('slow') && slowTarget) {
        rows.push({
          key: `${step.stepId}-slow`,
          label: `Step ${step.index} — Slow (${formatStepSeconds(step.duration)}s)`,
          kind: 'slow',
          stepId: step.stepId,
          targetId: slowTarget,
        });
      }
      if (step.anomalies.includes('high_tokens') && tokenTarget) {
        rows.push({
          key: `${step.stepId}-tokens`,
          label: `Step ${step.index} — High Tokens`,
          kind: 'high_tokens',
          targetId: tokenTarget,
        });
      }
    }
    return rows;
  }, [steps]);

  if (!issues.length) return null;

  return (
    <div className="px-3 pb-4 border-t border-app-border/50 pt-4 mt-2">
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <WarningIcon size={16} weight="duotone" className="text-amber-500 shrink-0" aria-hidden />
        <h3 className="m-0 text-[12px] font-semibold text-app-fg tracking-tight">Issues</h3>
      </div>
      <ul className="m-0 p-0 list-none space-y-1.5">
        {issues.map((issue) => (
          <li key={issue.key}>
            <button
              type="button"
              onClick={() => {
                if (issue.kind === 'slow' && issue.stepId) {
                  focusStep(issue.stepId);
                  return;
                }
                if (issue.targetId) focusNode(issue.targetId);
              }}
              className="w-full text-left rounded-xl px-3 py-2 text-[12px] font-semibold text-app-fg transition-[background,transform] duration-200 ease-out hover:bg-app-surface/80 active:scale-[0.99] ring-1 ring-inset ring-app-border/40 bg-app-surface/35"
            >
              <span className="mr-1.5 inline-flex align-middle" aria-hidden>
                {issue.kind === 'slow' ? (
                  <WarningOctagonIcon size={13} weight="fill" className="text-red-500" />
                ) : (
                  <FlameIcon size={13} weight="fill" className="text-orange-500" />
                )}
              </span>
              {issue.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
