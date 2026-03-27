import TypeIcon from '@/components/TypeIcon';
import { getAccent, getAccentLabelColor } from '@/constants/typeConfig';
import useAgentStore from '@/store/useAgentStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function TimelineItem({ node, delta }) {
  const theme = useThemeStore((s) => s.theme);
  const steps = useAgentStore((s) => s.steps);
  const { selectedNode, selectedNodeId, setSelectedNode } = useAgentStore();
  const ac = getAccent(node.type);
  const typeFg = getAccentLabelColor(ac, theme);
  const inspectorSelected = selectedNode?.id === node.id;
  const issuesFocused = selectedNodeId === node.id && !inspectorSelected;
  const isSelected = inspectorSelected || issuesFocused;
  const slowNode = node.anomalies?.includes('slow_node');

  const iconBgAlpha = theme === 'light' ? '33' : '22';
  const iconBorderAlpha = theme === 'light' ? '66' : '55';
  const spineAlpha = theme === 'light' ? '44' : '33';
  const hasPositiveDelta = typeof delta === 'number' && delta > 0;
  const issueStep = steps?.find((s) => (s.nodes || []).some((n) => n.id === node.id));
  const slowIssueTarget = issueStep?.anomalyTargets?.slow === node.id;
  const tokenIssueTarget = issueStep?.anomalyTargets?.high_tokens === node.id;
  const issueFocusGlow = slowIssueTarget
    ? '0 0 16px rgba(239,68,68,0.5)'
    : tokenIssueTarget
      ? '0 0 16px rgba(249,115,22,0.45)'
      : '0 0 12px color-mix(in oklab, var(--app-fg) 18%, transparent)';

  return (
    <div
      id={`al-focus-${node.id}`}
      role="button"
      tabIndex={0}
      onClick={() => setSelectedNode(node)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedNode(node);
        }
      }}
      className="mb-1 flex cursor-pointer gap-3.5 rounded-lg px-3.5 py-2.5 outline-offset-2 transition-[background,border-color,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-(--app-focus-ring)"
      style={{
        background: inspectorSelected
          ? `${ac}20`
          : 'color-mix(in oklab, var(--app-surface) 82%, var(--app-bg))',
        border: inspectorSelected
          ? `1px solid ${ac}66`
          : '1px solid color-mix(in oklab, var(--app-fg) 12%, var(--app-border))',
        boxShadow: issuesFocused
          ? issueFocusGlow
          : '0 1px 0 color-mix(in oklab, var(--app-fg) 5%, transparent), 0 8px 16px -16px color-mix(in oklab, var(--app-fg) 24%, transparent)',
      }}
    >
      <div className="flex shrink-0 flex-col items-center pt-0.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8"
          style={{
            background: `${ac}${iconBgAlpha}`,
            border: `1.5px solid ${ac}${iconBorderAlpha}`,
          }}
        >
          <TypeIcon type={node.type} color={typeFg} size={15} />
        </div>
        <div className="mt-1 w-px flex-1" style={{ background: `${ac}${spineAlpha}` }} />
      </div>

      <div className="min-w-0 flex-1 pb-1.5">
        <div className="mb-1 flex flex-wrap items-baseline gap-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.06em] sm:text-xs"
            style={{ color: typeFg }}
          >
            {node.type}
          </span>
          {slowNode && (
            <span className="inline-flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
                style={{ boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-app-danger-fg">
                Slow
              </span>
            </span>
          )}
          {hasPositiveDelta && (
            <span className="inline-flex items-center rounded-md bg-[color-mix(in_oklab,var(--app-surface-2)_76%,transparent)] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-app-fg-muted ring-1 ring-inset ring-[color-mix(in_oklab,var(--app-fg)_8%,transparent)]">
              +{delta < 1000 ? `${delta}ms` : `${(delta / 1000).toFixed(2)}s`}
            </span>
          )}
        </div>
        <p className="m-0 whitespace-normal wrap-break-word text-[13px] leading-[1.35] text-app-fg-subtle">
          {node.label}
        </p>
        {node.meta?.model && (
          <span className="mt-1.5 inline-block rounded-md bg-[color-mix(in_oklab,var(--app-surface-2)_72%,transparent)] px-1.5 py-0.5 font-mono text-[10px] text-app-fg-muted ring-1 ring-inset ring-[color-mix(in_oklab,var(--app-fg)_8%,transparent)]">
            {node.meta.model}
          </span>
        )}

      </div>
    </div>
  );
}
