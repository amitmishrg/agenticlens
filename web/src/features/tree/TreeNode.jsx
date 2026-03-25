import TypeIcon from '../../components/TypeIcon';
import { getAccent } from '../../constants/typeConfig';
import useAgentStore from '../../store/useAgentStore';
import { formatDeltaMs } from '../../utils/formatDuration';

export default function TreeNode({ node, depth = 0 }) {
  const { selectedNode, setSelectedNode, collapsedNodeIds, toggleNode } = useAgentStore();

  const ac = getAccent(node.type);
  const isSelected = selectedNode?.id === node.id;
  const slowNode = node.anomalies?.includes('slow_node');
  const hasChildren = node.children?.length > 0;
  const isCollapsed = collapsedNodeIds.has(node.id);
  const edgeDelay = formatDeltaMs(node.parentDeltaMs) ?? formatDeltaMs(node.deltaMs);

  const depthIndent = depth === 0 ? 0 : 10;
  const childrenGutter = 8;

  return (
    <div style={{ marginLeft: depthIndent }}>
      <div
        onClick={() => setSelectedNode(node)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '6px 10px',
          borderRadius: 7,
          cursor: 'pointer',
          marginBottom: 2,
          background: isSelected ? `${ac}18` : 'transparent',
          border: `1px solid ${isSelected ? `${ac}55` : 'transparent'}`,
          transition: 'all 0.15s',
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(node.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4b5563',
              fontSize: 10,
              padding: 0,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        ) : (
          <span style={{ width: 12, flexShrink: 0 }} />
        )}

        <TypeIcon type={node.type} color={ac} size={14} />

        <span
          style={{
            fontSize: 11,
            color: ac,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            flexShrink: 0,
          }}
        >
          {node.type}
        </span>
        {slowNode && (
          <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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

        <span
          style={{
            fontSize: 12,
            color: '#d1d5db',
            flex: 1,
            minWidth: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.35,
          }}
        >
          {node.label}
        </span>

        {edgeDelay && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              color: '#4b5563',
              fontFamily: 'monospace',
              flexShrink: 0,
              alignSelf: 'flex-start',
              paddingTop: 1,
            }}
            title={
              node.parentDeltaMs != null ? 'Δ since parent in tree' : 'Δ since previous log line'
            }
          >
            +{edgeDelay}
          </span>
        )}
      </div>

      {!isCollapsed && hasChildren && (
        <div style={{ borderLeft: `1px solid ${ac}22`, marginLeft: childrenGutter }}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
