/**
 * Group enriched nodes into Agent Steps for summaries and flow grouping.
 * Step duration = wall time from earliest to latest timestamp in the step.
 * totalTokens = sum of (input + output) usage on each node in the step.
 */

import { parseEventTime } from '../utils/timeDelta';

function stepTimes(nodes) {
  const sorted = [...nodes]
    .filter((n) => parseEventTime(n) != null)
    .sort((a, b) => parseEventTime(a) - parseEventTime(b));
  if (!sorted.length) return { startTime: null, endTime: null, duration: 0 };
  const lo = parseEventTime(sorted[0]);
  const hi = parseEventTime(sorted[sorted.length - 1]);
  return {
    startTime: sorted[0].timestamp,
    endTime: sorted[sorted.length - 1].timestamp,
    duration: hi - lo,
  };
}

function aggregateTokens(nodes) {
  let sum = 0;
  for (const n of nodes) {
    const m = n.meta || {};
    sum += (m.inputTokens ?? 0) + (m.outputTokens ?? 0);
  }
  return sum;
}

/** @param {object[]} enrichedNodes — output of enrichNodes() */
export function buildSteps(enrichedNodes) {
  const byStep = new Map();
  for (const n of enrichedNodes) {
    const sid = n.stepId;
    if (!byStep.has(sid)) byStep.set(sid, []);
    byStep.get(sid).push(n);
  }

  const steps = [];
  for (const [stepId, arr] of byStep) {
    const { startTime, endTime, duration } = stepTimes(arr);
    steps.push({
      stepId,
      nodes: arr,
      startTime,
      endTime,
      duration,
      totalTokens: aggregateTokens(arr),
      nodeCount: arr.length,
    });
  }

  steps.sort((a, b) => {
    const ta = a.startTime ? (parseEventTime({ timestamp: a.startTime }) ?? 0) : 0;
    const tb = b.startTime ? (parseEventTime({ timestamp: b.startTime }) ?? 0) : 0;
    return ta - tb;
  });

  steps.forEach((s, i) => {
    s.index = i + 1;
  });

  return steps;
}
