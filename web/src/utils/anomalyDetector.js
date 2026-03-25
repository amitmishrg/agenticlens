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

    if (step.duration > 3000) anomalies.push('slow');
    if (step.totalTokens > 500) anomalies.push('high_tokens');

    // Mutate in-place to keep original node object identity
    // (so tree/timeline can read node.anomalies without extra wiring).
    step.anomalies = anomalies;

    step.nodes = (step.nodes || []).map((node) => {
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

