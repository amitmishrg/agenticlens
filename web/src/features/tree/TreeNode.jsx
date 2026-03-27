import TypeIcon from '@/components/TypeIcon';
import { getAccent, getAccentLabelColor } from '@/constants/typeConfig';
import useAgentStore from '@/store/useAgentStore';
import { useThemeStore } from '@/store/useThemeStore';
import { formatDeltaMs } from '@/utils/formatDuration';

export default function TreeNode({ node, depth = 0 }) {
  const theme = useThemeStore((s) => s.theme);
  const steps = useAgentStore((s) => s.steps);
  const { selectedNode, selectedNodeId, setSelectedNode, collapsedNodeIds, toggleNode } = useAgentStore();

  const ac = getAccent(node.type);
  const typeFg = getAccentLabelColor(ac, theme);
  const inspectorSelected = selectedNode?.id === node.id;
  const issuesFocused = selectedNodeId === node.id && !inspectorSelected;
  const isSelected = inspectorSelected || issuesFocused;
  const slowNode = node.anomalies?.includes('slow_node');
  const hasChildren = node.children?.length > 0;
  const isCollapsed = collapsedNodeIds.has(node.id);
  const rawEdgeDelay =
    typeof node.parentDeltaMs === 'number' ? node.parentDeltaMs : node.deltaMs;
  const edgeDelay = typeof rawEdgeDelay === 'number' && rawEdgeDelay > 0 ? formatDeltaMs(rawEdgeDelay) : null;

  const depthIndent = depth === 0 ? 0 : 10;
  const childrenGutter = 8;
  const branchAlpha = theme === 'light' ? '55' : '22';
  const issueStep = steps?.find((s) => (s.nodes || []).some((n) => n.id === node.id));
  const slowIssueTarget = issueStep?.anomalyTargets?.slow === node.id;
  const tokenIssueTarget = issueStep?.anomalyTargets?.high_tokens === node.id;
  const issueFocusGlow = slowIssueTarget
    ? '0 0 16px rgba(239,68,68,0.5)'
    : tokenIssueTarget
      ? '0 0 16px rgba(249,115,22,0.45)'
      : '0 0 12px color-mix(in oklab, var(--app-fg) 18%, transparent)';

  return (
    <div style={{ marginLeft: depthIndent }}>
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
        className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2.5 py-1.5 mb-0.5 transition-colors duration-150 outline-offset-2 focus-visible:outline-2 focus-visible:outline-(--app-focus-ring)"
        style={{
          background: inspectorSelected ? `${ac}24` : 'transparent',
          borderColor: inspectorSelected ? `${ac}66` : 'transparent',
          boxShadow: issuesFocused
            ? issueFocusGlow
            : 'none',
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(node.id);
            }}
            className="shrink-0 border-0 bg-transparent p-0 text-[12px] leading-none text-app-fg-muted hover:text-app-fg-subtle cursor-pointer"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        <TypeIcon type={node.type} color={typeFg} size={16} />

        <span
          className="shrink-0 text-[11px] font-semibold uppercase tracking-wide sm:text-xs"
          style={{ color: typeFg }}
        >
          {node.type}
        </span>
        {slowNode && (
          <span className="ml-1 inline-flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
              style={{ boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-app-danger-fg">
              Slow
            </span>
          </span>
        )}

        <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-[13px] leading-snug text-app-fg-subtle">
          {node.label}
        </span>

        {edgeDelay && (
          <span
            className="ml-auto shrink-0 self-start pt-0.5 font-mono text-[11px] tabular-nums text-app-fg-muted"
            title={
              node.parentDeltaMs != null ? 'Δ since parent in tree' : 'Δ since previous log line'
            }
          >
            +{edgeDelay}
          </span>
        )}
      </div>

      {!isCollapsed && hasChildren && (
        <div style={{ borderLeft: `1px solid ${ac}${branchAlpha}`, marginLeft: childrenGutter }}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
