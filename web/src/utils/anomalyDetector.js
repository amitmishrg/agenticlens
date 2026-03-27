/**
 * Detect slow/high-token anomalies on steps and slow nodes.
 *
 * Rules:
 * - step.duration > 3000ms => "slow"
 * - step.totalTokens > 500 => "high_tokens"
 * - node.deltaMs > 2000ms => "slow_node"
 */
export function detectAnomalies(steps) {
  return steps.map((step) => {
    const anomalies = [];
    const stepNodes = step.nodes || [];

    if (step.duration > 3000) anomalies.push('slow');
    if (step.totalTokens > 500) anomalies.push('high_tokens');

    // Mutate in-place to keep original node object identity
    // (so tree/timeline can read node.anomalies without extra wiring).
    step.anomalies = anomalies;
    const assistantNode = stepNodes.find((n) => n.type === 'assistant') || null;
    const slowTarget = assistantNode || stepNodes[stepNodes.length - 1] || null;
    const highTokensTarget =
      [...stepNodes].sort(
        (a, b) => (b.totalTokens ?? b.meta?.totalTokens ?? 0) - (a.totalTokens ?? a.meta?.totalTokens ?? 0),
      )[0] || assistantNode || stepNodes[0] || null;
    step.anomalyTargets = {
      slow: slowTarget?.id || null,
      high_tokens: highTokensTarget?.id || null,
    };

    step.nodes = stepNodes.map((node) => {
      const nodeAnomalies = [];
      const delta = node.delta ?? node.deltaMs;

      if (typeof delta === 'number' && delta > 2000) {
        nodeAnomalies.push('slow_node');
      }

      node.anomalies = nodeAnomalies;
      return node;
    });

    return step;
  });
}
