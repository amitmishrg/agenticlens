/**
 * Computes absolute { x, y } positions for every node in a tree,
 * using a simple top-down recursive layout.
 * Returns a Map<nodeId, { x, y }>.
 */
const NODE_W = 252;
const NODE_H = 130;
const H_GAP = 60;
const V_GAP = 90;
const PAD = 80;

function subtreeWidth(node) {
  if (!node.children?.length) return NODE_W;
  const childrenW = node.children.reduce((sum, c) => sum + subtreeWidth(c) + H_GAP, -H_GAP);
  return Math.max(NODE_W, childrenW);
}

function place(node, x, y, positions) {
  positions.set(node.id, { x, y });

  if (!node.children?.length) return;

  const totalW = node.children.reduce((sum, c) => sum + subtreeWidth(c) + H_GAP, -H_GAP);
  let cx = x + NODE_W / 2 - totalW / 2;

  for (const child of node.children) {
    const cw = subtreeWidth(child);
    place(child, cx, y + NODE_H + V_GAP, positions);
    cx += cw + H_GAP;
  }
}

export function computeLayout(roots) {
  const positions = new Map();
  let cursorX = PAD;

  for (const root of roots) {
    place(root, cursorX, PAD, positions);
    cursorX += subtreeWidth(root) + H_GAP * 2;
  }

  return positions;
}
