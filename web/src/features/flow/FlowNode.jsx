import { Handle, Position } from '@xyflow/react';
import TypeIcon  from '../../components/TypeIcon';
import MetaChip  from './MetaChip';
import { extractBodyText } from '../../parser/contentUtils';
import useAgentStore from '../../store/useAgentStore';

const BODY_LIMIT = 80;

/** Custom React Flow node that renders an agent event as a compact card. */
export default function FlowNode({ data }) {
  const { node, onSelect, accent: ac } = data;
  const selectedNode = useAgentStore((s) => s.selectedNode);
  const selected = selectedNode?.id === node.id;

  const body = extractBodyText(node);
  const preview = body.length > BODY_LIMIT ? body.slice(0, BODY_LIMIT) + '…' : body;

  return (
    <div
      onClick={() => onSelect(node)}
      style={{
        width: 252, background: '#0d0d11', borderRadius: 10,
        border: `1.5px solid ${selected ? ac : '#1e1e2e'}`,
        padding: '10px 13px', cursor: 'pointer',
        boxShadow: selected ? `0 0 0 3px ${ac}33, 0 4px 24px ${ac}22` : '0 2px 12px #00000066',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        animation: 'flowCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: 6,
          background: `${ac}22`, border: `1px solid ${ac}44`, flexShrink: 0,
        }}>
          <TypeIcon type={node.type} color={ac} size={13} />
        </span>
        <span style={{ fontSize: 10, color: ac, textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 600 }}>
          {node.type}
        </span>
      </div>

      {/* Label */}
      <p style={{ fontSize: 11, color: '#e5e7eb', margin: '0 0 6px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {node.label}
      </p>

      {/* Body preview */}
      {preview && (
        <p style={{ fontSize: 10, color: '#4b5563', margin: '0 0 7px',
          fontFamily: 'monospace', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {preview}
        </p>
      )}

      {/* Meta chips */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <MetaChip label="in"   value={node.meta?.inputTokens}  color={ac} />
        <MetaChip label="out"  value={node.meta?.outputTokens} color={ac} />
        <MetaChip label="tool" value={node.meta?.toolName}     color={ac} />
      </div>

      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
