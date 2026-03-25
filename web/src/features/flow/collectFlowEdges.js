import { getAccent } from '../../constants/typeConfig';
import { formatDeltaMs } from '../../utils/formatDuration';
import { deltaParentToChild } from '../../utils/timeDelta';

export function collectFlowEdges(parentNode, agentIds, rfEdges, byId) {
  for (const child of parentNode.children || []) {
    if (agentIds.has(parentNode.id) && agentIds.has(child.id)) {
      const parent = byId.get(parentNode.id);
      const gap    = parent ? deltaParentToChild(parent, child) : null;
      rfEdges.push({
        id:     `e-${parentNode.id}-${child.id}`,
        source: parentNode.id,
        target: child.id,
        type:   'agentEdge',
        data: {
          accent: getAccent(parent?.type || child.type),
          label:  formatDeltaMs(gap ?? child.deltaMs),
        },
      });
    }
    collectFlowEdges(child, agentIds, rfEdges, byId);
  }
}
