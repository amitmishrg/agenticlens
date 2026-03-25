import useAgentStore from '../../store/useAgentStore';
import TimelineItem from './TimelineItem';

/** Compute ms delta between consecutive timestamped nodes. */
function computeDeltas(nodes) {
  const deltas = new Array(nodes.length).fill(null);
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1].timestamp;
    const curr = nodes[i].timestamp;
    if (prev && curr) {
      deltas[i] = Math.max(0, new Date(curr) - new Date(prev));
    }
  }
  return deltas;
}

export default function TimelineView() {
  const nodes = useAgentStore((s) => s.nodes);
  const sorted = [...nodes].sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  const deltas = computeDeltas(sorted);

  if (!sorted.length) {
    return <div style={{ color: '#4b5563', fontSize: 13, padding: 24 }}>No events.</div>;
  }

  return (
    <div style={{ padding: '12px 8px', overflowY: 'auto', height: '100%' }}>
      {sorted.map((node, i) => (
        <TimelineItem key={node.id} node={node} delta={deltas[i]} />
      ))}
    </div>
  );
}
