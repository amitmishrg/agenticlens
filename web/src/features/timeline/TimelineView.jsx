import useAgentStore from '@/store/useAgentStore';
import { computeVisibleNodeIds } from '@/utils/visibility';
import TimelineItem from '@/features/timeline/TimelineItem';

export default function TimelineView() {
  const nodes = useAgentStore((s) => s.nodes);
  const filterType = useAgentStore((s) => s.filterType);
  const currentStepIndex = useAgentStore((s) => s.currentStepIndex);
  const chronNodeIds = useAgentStore((s) => s.chronNodeIds);

  const visible = computeVisibleNodeIds(nodes, {
    replayIndex: currentStepIndex,
    chronNodeIds,
    filterType,
  });

  const sorted = [...nodes]
    .filter((n) => visible.has(n.id))
    .sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

  if (!sorted.length) {
    return <div className="p-6 text-[13px] text-app-fg-muted">No events.</div>;
  }

  return (
    <div className="box-border min-w-full p-3 px-2 sm:px-3">
      {sorted.map((node) => (
        <TimelineItem key={node.id} node={node} delta={node.deltaMs} />
      ))}
    </div>
  );
}
