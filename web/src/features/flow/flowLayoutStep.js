/**
 * Tree layout scoped to a set of node ids (one agent step), plus bounding box.
 * NODE_H should match ~FlowNode rendered height so rows align visually.
 */
const NODE_W = 252;
const NODE_H = 124;
const H_GAP = 60;
const V_GAP = 88;

function subtreeWidth(node, inStep) {
  const kids = (node.children || []).filter((c) => inStep.has(c.id));
  if (!kids.length) return NODE_W;
  const w = kids.reduce((sum, c) => sum + subtreeWidth(c, inStep) + H_GAP, -H_GAP);
  return Math.max(NODE_W, w);
}

function place(node, x, y, positions, inStep) {
  positions.set(node.id, { x, y });
  const kids = (node.children || []).filter((c) => inStep.has(c.id));
  if (!kids.length) return;
  const totalW = kids.reduce((sum, c) => sum + subtreeWidth(c, inStep) + H_GAP, -H_GAP);
  let cx = x + NODE_W / 2 - totalW / 2;
  for (const c of kids) {
    const cw = subtreeWidth(c, inStep);
    place(c, cx, y + NODE_H + V_GAP, positions, inStep);
    cx += cw + H_GAP;
  }
}

/** @returns {{ positions: Map<string, {x,y}>, width: number, height: number }} */
export function layoutStepInterior(stepRoots, stepNodeIds) {
  const positions = new Map();
  const inStep = stepNodeIds;

  let cursorX = 0;
  for (const root of stepRoots) {
    place(root, cursorX, 0, positions, inStep);
    cursorX += subtreeWidth(root, inStep) + H_GAP * 2;
  }

  if (!positions.size) {
    return { positions, width: 320, height: 200 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of positions.values()) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + NODE_W);
    maxY = Math.max(maxY, y + NODE_H);
  }

  const PAD = 16;
  const shiftX = -minX + PAD;
  const shiftY = -minY + PAD;

  const adj = new Map();
  for (const [id, pos] of positions) {
    adj.set(id, { x: pos.x + shiftX, y: pos.y + shiftY });
  }

  return {
    positions: adj,
    width: maxX - minX + PAD * 2,
    height: maxY - minY + PAD * 2,
  };
}
