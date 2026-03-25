import { Handle, Position } from '@xyflow/react';
import { CurrencyDollarIcon, TimerIcon } from '@phosphor-icons/react';
import TypeIcon from '@/components/TypeIcon';
import MetaChip from '@/features/flow/MetaChip';
import TokenGlyph from '@/components/icons/TokenGlyph';
import { extractBodyText } from '@/parser/contentUtils';
import { formatDeltaMs } from '@/utils/formatDuration';
import useAgentStore from '@/store/useAgentStore';

const BODY_LIMIT = 80;

export default function FlowNode({ data }) {
  const { node, onSelect, accent: ac, replayActive } = data;
  const selectedNode = useAgentStore((s) => s.selectedNode);
  const selected = selectedNode?.id === node.id;

  const slowNode = node.anomalies?.includes('slow_node');

  const body = extractBodyText(node);
  const preview = body.length > BODY_LIMIT ? body.slice(0, BODY_LIMIT) + '…' : body;

  const sinceParent = formatDeltaMs(node.parentDeltaMs);
  const sincePrev = formatDeltaMs(node.deltaMs);
  const dur = formatDeltaMs(node.meta?.durationMs);
  const tokens = node.totalTokens ?? node.meta?.totalTokens;
  const cost = node.meta?.costUsd;

  const idleBorder = 'var(--app-flow-card-border-idle)';
  const borderCol = selected || replayActive ? ac : idleBorder;
  const ring = replayActive
    ? `0 0 0 3px ${ac}66, 0 0 18px ${ac}33`
    : selected
      ? `0 0 0 3px ${ac}55`
      : 'none';
  const cardShadow = selected ? `0 4px 24px ${ac}22` : 'var(--app-flow-card-shadow)';

  return (
    <div
      onClick={() => onSelect(node)}
      style={{
        width: 252,
        background: 'var(--app-flow-card-bg)',
        borderRadius: 10,
        border: `1.5px solid ${borderCol}`,
        padding: '10px 13px',
        cursor: 'pointer',
        boxShadow: `${ring}, ${cardShadow}`,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        animation: 'flowCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 6,
        }}
      >
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
        {slowNode && (
          <span
            style={{
              marginLeft: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500"
              style={{ boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }}
            />
            <span
              className="text-[9px] font-semibold"
              style={{
                color: '#f87171',
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              Slow
            </span>
          </span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 12px',
          marginBottom: 6,
          fontSize: 10,
          color: 'var(--app-fg-muted)',
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
            fontSize: 10,
            color: 'var(--app-flow-preview)',
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

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <MetaChip label="in" value={node.meta?.inputTokens} color={ac} />
        <MetaChip label="out" value={node.meta?.outputTokens} color={ac} />
        <MetaChip label="tool" value={node.meta?.toolName} color={ac} />
      </div>

      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
