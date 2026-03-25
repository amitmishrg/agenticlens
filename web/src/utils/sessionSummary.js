/**
 * Compute high-level session stats for the UI summary bar.
 */
export function computeSessionSummary(steps) {
  let totalDuration = 0;
  let totalTokens = 0;
  let totalNodes = 0;
  let anomalyCount = 0;

  steps.forEach((step) => {
    totalDuration += step.duration || 0;
    totalTokens += step.totalTokens || 0;
    totalNodes += step.nodes?.length || 0;

    if (step.anomalies?.length) {
      anomalyCount += step.anomalies.length;
    }
  });

  return {
    totalDuration,
    totalTokens,
    totalNodes,
    totalSteps: steps.length,
    anomalyCount,
  };
}
