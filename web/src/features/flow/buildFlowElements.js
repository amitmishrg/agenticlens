import { buildTree } from '../../parser/buildTree';
import { layoutStepInterior } from './flowLayoutStep';
import { getAccent } from '../../constants/typeConfig';
import { collectFlowEdges } from './collectFlowEdges';

const STEP_HEADER       = 50;
const STEP_GAP_X        = 40;
const STEP_PAD_BOTTOM   = 20;
const GLOBAL_X0         = 40;
const GLOBAL_Y0         = 40;

export function buildFlowElements({
  steps,
  nodes,
  visibleIds,
  replayActiveId,
  setSelectedNode,
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const rfNodes    = [];
  const rfEdges    = [];
  const agentRfIds = new Set();
  let cursorX      = GLOBAL_X0;

  for (const step of steps) {
    const stepOnly = step.nodes.filter((n) => visibleIds.has(n.id));
    if (!stepOnly.length) continue;

    const subRoots  = buildTree(stepOnly);
    const stepIdBag = new Set(stepOnly.map((n) => n.id));
    const { positions, width: iw, height: ih } = layoutStepInterior(subRoots, stepIdBag);

    const stepW    = Math.max(iw + 24, 280);
    const stepH    = STEP_HEADER + ih + STEP_PAD_BOTTOM;
    const rfStepId = `rf-step:${encodeURIComponent(step.stepId)}`;
    const hPad     = Math.max(0, (stepW - iw) / 2);

    rfNodes.push({
      id:       rfStepId,
      type:     'stepNode',
      position: { x: cursorX, y: GLOBAL_Y0 },
      data:     { step },
      style:    { width: stepW, height: stepH },
      zIndex:   0,
      selectable: false,
      draggable:  false,
    });

    for (const n of stepOnly) {
      const pos = positions.get(n.id);
      if (!pos) continue;
      rfNodes.push({
        id:         n.id,
        type:       'agentNode',
        parentId:   rfStepId,
        extent:     'parent',
        position:   { x: pos.x + hPad, y: STEP_HEADER + pos.y },
        data: {
          node:         n,
          onSelect:     setSelectedNode,
          accent:       getAccent(n.type),
          replayActive: !!(replayActiveId && n.id === replayActiveId),
        },
        zIndex: 1,
      });
      agentRfIds.add(n.id);
    }
    cursorX += stepW + STEP_GAP_X;
  }

  const visRoots = buildTree(nodes.filter((n) => visibleIds.has(n.id)));
  visRoots.forEach((r) => collectFlowEdges(r, agentRfIds, rfEdges, byId));

  return { rfNodes, rfEdges };
}
