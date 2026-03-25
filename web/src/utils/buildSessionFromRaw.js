import { parseJSONL } from '../parser/parseJSONL';
import { buildTree } from '../parser/buildTree';
import { enrichNodes } from '../parser/enrichNodes';
import { buildSteps } from '../parser/buildSteps';
import { detectAnomalies } from './anomalyDetector';
import { computeSessionSummary } from './sessionSummary';

/** Pure pipeline: JSONL text → graph data + steps + summary + chronological ids. */
export function buildSessionFromRaw(raw) {
  const parsed = parseJSONL(raw);
  const enriched = enrichNodes(parsed);
  const steps = buildSteps(enriched);
  const stepsWithAnomalies = detectAnomalies(steps);
  const summary = computeSessionSummary(stepsWithAnomalies);
  const chron = [...enriched]
    .filter((n) => n.timestamp)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((n) => n.id);

  return {
    enriched,
    tree: buildTree(enriched),
    stepsWithAnomalies,
    summary,
    chron,
  };
}
