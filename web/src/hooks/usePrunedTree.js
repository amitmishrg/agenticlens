import { useMemo } from 'react';
import useAgentStore from '../store/useAgentStore';
import { computeVisibleNodeIds, buildVisibleTree } from '../utils/visibility';

/** Tree roots respecting type filter and replay window. */
export function usePrunedTree() {
  const nodes = useAgentStore((s) => s.nodes);
  const filterType = useAgentStore((s) => s.filterType);
  const currentStepIndex = useAgentStore((s) => s.currentStepIndex);
  const chronNodeIds = useAgentStore((s) => s.chronNodeIds);

  return useMemo(() => {
    const visible = computeVisibleNodeIds(nodes, {
      replayIndex: currentStepIndex,
      chronNodeIds,
      filterType,
    });
    return buildVisibleTree(nodes, visible);
  }, [nodes, filterType, currentStepIndex, chronNodeIds]);
}
