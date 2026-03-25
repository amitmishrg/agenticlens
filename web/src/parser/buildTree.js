/**
 * Converts a flat array of nodes into a hierarchical tree.
 *
 * Nodes without a parentId (or with an unresolvable parentId) become roots.
 * Each node gets a `children` array.
 */
export function buildTree(nodes) {
  const nodeMap = new Map();

  // Clone nodes and add children arrays
  for (const node of nodes) {
    nodeMap.set(node.id, { ...node, children: [] });
  }

  const roots = [];

  for (const node of nodeMap.values()) {
    if (node.parentId && nodeMap.has(node.parentId)) {
      nodeMap.get(node.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
