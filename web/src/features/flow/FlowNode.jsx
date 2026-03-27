import { Handle, Position } from '@xyflow/react';
import { CurrencyDollarIcon, FlameIcon, TimerIcon, WarningCircleIcon } from '@phosphor-icons/react';
import TypeIcon from '@/components/TypeIcon';
import MetaChip from '@/features/flow/MetaChip';
import TokenGlyph from '@/components/icons/TokenGlyph';
import { extractBodyText } from '@/parser/contentUtils';
import { formatDeltaMs } from '@/utils/formatDuration';
import useAgentStore from '@/store/useAgentStore';

const BODY_LIMIT = 80;

export default function FlowNode({ data }) {
  const { node, step, onSelect, accent: ac, replayActive } = data;
  const selectedNode = useAgentStore((s) => s.selectedNode);
  const selectedNodeId = useAgentStore((s) => s.selectedNodeId);
  const flashNodeId = useAgentStore((s) => s.flashNodeId);
  const inspectorSelected = selectedNode?.id === node.id;
  const issuesFocused = selectedNodeId === node.id && !inspectorSelected;

  const slowNode = node.anomalies?.includes('slow_node');
  const stepAnomalies = step?.anomalies || [];
  const hasStepSlow = stepAnomalies.includes('slow');
  const hasStepHighTokens = stepAnomalies.includes('high_tokens');
  const stepSlowTarget = hasStepSlow && step?.anomalyTargets?.slow === node.id;
  const stepTokensTarget = hasStepHighTokens && step?.anomalyTargets?.high_tokens === node.id;
  const flashActive = flashNodeId === node.id;

  const body = extractBodyText(node);
  const preview = body.length > BODY_LIMIT ? body.slice(0, BODY_LIMIT) + '…' : body;

  const sinceParent = formatDeltaMs(node.parentDeltaMs);
  const sincePrev = formatDeltaMs(node.deltaMs);
  const dur = formatDeltaMs(node.meta?.durationMs);
  const tokens = node.totalTokens ?? node.meta?.totalTokens;
  const cost = node.meta?.costUsd;

  const idleBorder = 'var(--app-flow-card-border-idle)';
  let borderCol = inspectorSelected || replayActive ? ac : idleBorder;
  if (stepSlowTarget) borderCol = '#ef4444';
  else if (stepTokensTarget) borderCol = '#f97316';

  const anomalyGlow = stepSlowTarget
    ? '0 0 20px rgba(239,68,68,0.5)'
    : stepTokensTarget
      ? '0 0 20px rgba(249,115,22,0.45)'
      : '';

  const cardShadow = inspectorSelected ? `0 4px 24px ${ac}22` : 'var(--app-flow-card-shadow)';
  const shadowParts = [];
  if (flashActive) {
    shadowParts.push('0 0 16px color-mix(in oklab, var(--app-fg) 16%, transparent)');
  } else if (replayActive) {
    shadowParts.push(`0 0 0 3px ${ac}66`, `0 0 18px ${ac}33`);
  } else if (inspectorSelected) {
    shadowParts.push(`0 0 0 3px ${ac}55`);
  } else if (issuesFocused) {
    shadowParts.push('0 0 12px color-mix(in oklab, var(--app-fg) 14%, transparent)');
  }
  if (anomalyGlow) shadowParts.push(anomalyGlow);
  shadowParts.push(cardShadow);
  const mergedShadow = shadowParts.join(', ');
  const borderWidth = stepSlowTarget || stepTokensTarget ? 2 : 1.5;
  const slowChipStyle = {
    color: 'var(--app-danger-fg)',
    background: 'color-mix(in oklab, var(--app-danger-fg) 14%, transparent)',
    boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--app-danger-fg) 42%, transparent)',
  };
  const tokenChipStyle = {
    color: 'color-mix(in oklab, #f97316 78%, var(--app-fg))',
    background: 'color-mix(in oklab, #f97316 14%, transparent)',
    boxShadow: 'inset 0 0 0 1px color-mix(in oklab, #f97316 45%, transparent)',
  };
  const metricsColor = 'var(--app-fg-muted)';
  const previewColor = 'var(--app-fg-subtle)';

  return (
    <div
      onClick={() => onSelect(node)}
      className="relative"
      style={{
        width: 252,
        background: 'var(--app-flow-card-bg)',
        borderRadius: 10,
        border: `${borderWidth}px solid ${borderCol}`,
        padding: '10px 13px',
        cursor: 'pointer',
        boxShadow: mergedShadow,
        transition: 'border-color 0.2s ease-out, box-shadow 0.2s ease-out, transform 0.2s ease-out',
        animation: 'flowCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: slowNode || stepTokensTarget ? 4 : 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: 6,
              background: `${ac}22`,
              border: `1px solid ${ac}44`,
              flexShrink: 0,
            }}
          >
            <TypeIcon type={node.type} color={ac} size={13} />
          </span>
          <span
            style={{
              fontSize: 10,
              color: ac,
              textTransform: 'uppercase',
              letterSpacing: 0.7,
              fontWeight: 600,
            }}
          >
            {node.type}
          </span>
        </div>
      </div>

      {(slowNode || stepTokensTarget) && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {slowNode && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-sm"
              style={slowChipStyle}
            >
              <WarningCircleIcon size={10} weight="fill" />
              Slow
            </span>
          )}
          {stepTokensTarget && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide animate-pulse shadow-sm"
              style={tokenChipStyle}
            >
              <FlameIcon size={10} weight="fill" />
              High Tokens
            </span>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 12px',
          marginBottom: 6,
          fontSize: 10,
          color: metricsColor,
          alignItems: 'center',
        }}
      >
        {sinceParent && (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            title="Time since parent node in tree"
          >
            <TimerIcon size={12} color="currentColor" weight="duotone" />
            {sinceParent}
          </span>
        )}
        {!sinceParent && sincePrev && (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            title="Time since previous log line (no parent timestamp)"
          >
            <TimerIcon size={12} color="currentColor" weight="duotone" />
            {sincePrev}
          </span>
        )}
        {dur && (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            title="duration_ms on this event"
          >
            <TimerIcon size={12} color="currentColor" weight="duotone" />
            {dur}
          </span>
        )}
        {tokens != null && (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            title="Input + output tokens (this event)"
          >
            <TokenGlyph size={13} color="currentColor" />
            {tokens}
          </span>
        )}
        {cost != null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="Cost USD">
            <CurrencyDollarIcon size={12} color="currentColor" weight="duotone" />
            {Number(cost).toFixed(4)}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: 11,
          color: 'var(--app-fg)',
          margin: '0 0 6px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {node.label}
      </p>

      {preview && (
        <p
          style={{
            fontSize: 11,
            color: previewColor,
            margin: '0 0 7px',
            fontFamily: 'monospace',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {preview}
        </p>
      )}

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
        <MetaChip label="in" value={node.meta?.inputTokens} color={ac} />
        <MetaChip label="out" value={node.meta?.outputTokens} color={ac} />
        <MetaChip label="tool" value={node.meta?.toolName} color={ac} />
      </div>

      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
