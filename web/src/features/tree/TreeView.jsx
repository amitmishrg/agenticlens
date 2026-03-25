import { usePrunedTree } from '@/hooks/usePrunedTree';
import TreeNode from '@/features/tree/TreeNode';

export default function TreeView() {
  const tree = usePrunedTree();

  if (!tree.length) {
    return <div style={{ color: '#4b5563', fontSize: 13, padding: 24 }}>No events to display.</div>;
  }

  return (
    <div className="box-border w-max min-w-full p-3 px-2">
      {tree.map((root) => (
        <TreeNode key={root.id} node={root} depth={0} />
      ))}
    </div>
  );
}
