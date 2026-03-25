import useAgentStore from '../store/useAgentStore';
import TreeNode from './TreeNode';

export default function TreeView() {
  const tree = useAgentStore((s) => s.tree);

  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
        <span className="text-3xl">🌿</span>
        <p>No events to display</p>
      </div>
    );
  }

  return (
    <div className="py-2 overflow-y-auto h-full">
      {tree.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
}
