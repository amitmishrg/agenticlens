import { usePrunedTree } from '../../hooks/usePrunedTree';
import TreeNode from './TreeNode';

export default function TreeView() {
  const tree = usePrunedTree();

  if (!tree.length) {
    return (
      <div style={{ color: '#4b5563', fontSize: 13, padding: 24 }}>
        No events to display.
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 8px', overflowY: 'auto', height: '100%' }}>
      {tree.map((root) => (
        <TreeNode key={root.id} node={root} depth={0} />
      ))}
    </div>
  );
}
