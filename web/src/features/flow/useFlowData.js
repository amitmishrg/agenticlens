import { useMemo } from 'react';
import useAgentStore from '@/store/useAgentStore';
import { computeVisibleNodeIds } from '@/utils/visibility';
import { buildFlowElements } from '@/features/flow/buildFlowElements';

/**
 * Converts store data into React Flow nodes + edges (grouped steps, filters, replay).
 */
export function useFlowData() {
  const nodes = useAgentStore((s) => s.nodes);
  const steps = useAgentStore((s) => s.steps);
  const filterType = useAgentStore((s) => s.filterType);
  const currentStepIndex = useAgentStore((s) => s.currentStepIndex);
  const chronNodeIds = useAgentStore((s) => s.chronNodeIds);
  const setSelectedNode = useAgentStore((s) => s.setSelectedNode);

  return useMemo(() => {
    const visibleIds = computeVisibleNodeIds(nodes, {
      replayIndex: currentStepIndex,
      chronNodeIds,
      filterType,
    });

    const replayActiveId =
      currentStepIndex >= 0 && chronNodeIds[currentStepIndex]
        ? chronNodeIds[currentStepIndex]
        : null;

    return buildFlowElements({
      steps,
      nodes,
      visibleIds,
      replayActiveId,
      setSelectedNode,
    });
  }, [nodes, steps, filterType, currentStepIndex, chronNodeIds, setSelectedNode]);
}
