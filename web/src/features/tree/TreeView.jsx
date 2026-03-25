import { usePrunedTree } from '@/hooks/usePrunedTree';
import TreeNode from '@/features/tree/TreeNode';

export default function TreeView() {
  const tree = usePrunedTree();

  if (!tree.length) {
    return (
      <div className="p-6 text-[13px] text-app-fg-muted">No events to display.</div>
    );
  }

  return (
    <div className="box-border w-max min-w-full p-3 px-2 sm:px-3">
      {tree.map((root) => (
        <TreeNode key={root.id} node={root} depth={0} />
      ))}
    </div>
  );
}
