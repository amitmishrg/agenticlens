import TypeIcon from '@/components/TypeIcon';
import { getAccent } from '@/constants/typeConfig';
import useAgentStore from '@/store/useAgentStore';

export default function TimelineItem({ node, delta }) {
  const { selectedNode, setSelectedNode } = useAgentStore();
  const ac = getAccent(node.type);
  const isSelected = selectedNode?.id === node.id;
  const slowNode = node.anomalies?.includes('slow_node');

  return (
    <div
      onClick={() => setSelectedNode(node)}
      style={{
        display: 'flex',
        gap: 14,
        padding: '10px 14px',
        cursor: 'pointer',
        borderRadius: 8,
        marginBottom: 4,
        background: isSelected ? `${ac}18` : 'transparent',
        border: `1px solid ${isSelected ? `${ac}55` : 'transparent'}`,
        transition: 'background 0.15s',
      }}
    >
      {/* Timeline spine */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: `${ac}22`,
            border: `1.5px solid ${ac}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TypeIcon type={node.type} color={ac} size={13} />
        </div>
        <div style={{ width: 1, flex: 1, background: `${ac}33`, marginTop: 4 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 11, color: ac, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {node.type}
          </span>
          {slowNode && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span
                className="w-1.5 h-1.5 rounded-full bg-red-500"
                style={{ boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }}
              />
              <span
                className="text-[9px] font-semibold"
                style={{ color: '#f87171', textTransform: 'uppercase', letterSpacing: 0.4 }}
              >
                Slow
              </span>
            </span>
          )}
          {delta != null && (
            <span style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
              +{delta < 1000 ? `${delta}ms` : `${(delta / 1000).toFixed(2)}s`}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: 12,
            color: '#d1d5db',
            margin: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.35,
          }}
        >
          {node.label}
        </p>
        {node.meta?.model && (
          <span style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
            {node.meta.model}
          </span>
        )}
      </div>
    </div>
  );
}
