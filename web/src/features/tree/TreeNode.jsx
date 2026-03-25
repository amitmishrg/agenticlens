import TypeIcon from '../../components/TypeIcon';
import { getAccent } from '../../constants/typeConfig';
import useAgentStore from '../../store/useAgentStore';

export default function TreeNode({ node, depth = 0 }) {
  const { selectedNode, setSelectedNode, collapsed, toggleCollapse } = useAgentStore();
  const ac         = getAccent(node.type);
  const isSelected = selectedNode?.id === node.id;
  const hasChildren = node.children?.length > 0;
  const isCollapsed = collapsed.has(node.id);

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 18 }}>
      <div
        onClick={() => setSelectedNode(node)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 2,
          background: isSelected ? `${ac}18` : 'transparent',
          border: `1px solid ${isSelected ? `${ac}55` : 'transparent'}`,
          transition: 'all 0.15s',
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); toggleCollapse(node.id); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4b5563', fontSize: 10, padding: 0, lineHeight: 1, flexShrink: 0,
            }}
          >
            {isCollapsed ? '▸' : '▾'}
          </button>
        ) : (
          <span style={{ width: 12, flexShrink: 0 }} />
        )}

        <TypeIcon type={node.type} color={ac} size={14} />

        <span style={{ fontSize: 11, color: ac, textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 }}>
          {node.type}
        </span>

        <span style={{ fontSize: 12, color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.label}
        </span>
      </div>

      {!isCollapsed && hasChildren && (
        <div style={{ borderLeft: `1px solid ${ac}22`, marginLeft: 16 }}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
