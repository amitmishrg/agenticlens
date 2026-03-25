import { useMemo } from 'react';
import useAgentStore     from '../../store/useAgentStore';
import { computeLayout } from './flowLayout';
import { getAccent }     from '../../constants/typeConfig';

/**
 * Converts the Zustand tree into React Flow nodes + edges.
 * Selection state is NOT included here — FlowNode reads the store directly
 * so re-selecting doesn't recompute the entire graph.
 */
export function useFlowData() {
  const tree           = useAgentStore((s) => s.tree);
  const setSelectedNode = useAgentStore((s) => s.setSelectedNode);

  return useMemo(() => {
    const positions = computeLayout(tree);
    const rfNodes   = [];
    const rfEdges   = [];

    function walk(node) {
      const pos = positions.get(node.id);
      if (pos) {
        rfNodes.push({
          id:       node.id,
          type:     'agentNode',
          position: pos,
          data:     { node, onSelect: setSelectedNode, accent: getAccent(node.type) },
        });
      }

      for (const child of node.children ?? []) {
        rfEdges.push({
          id:     `e-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type:   'agentEdge',
          data:   { accent: getAccent(node.type) },
        });
        walk(child);
      }
    }

    tree.forEach(walk);
    return { rfNodes, rfEdges };
  }, [tree, setSelectedNode]);
}
