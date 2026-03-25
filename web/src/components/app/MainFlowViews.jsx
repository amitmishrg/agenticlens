import FlowView from '../../features/flow/FlowView';
import TreeView from '../../features/tree/TreeView';
import TimelineView from '../../features/timeline/TimelineView';
import PanelWrap from '../PanelWrap';

export default function MainFlowViews({ view, nodeCount }) {
  if (view === 'flow') {
    return (
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <FlowView />
      </div>
    );
  }
  if (view === 'tree') {
    return (
      <PanelWrap label="Event Tree" count={nodeCount}>
        <TreeView />
      </PanelWrap>
    );
  }
  return (
    <PanelWrap label="Timeline" count={nodeCount}>
      <TimelineView />
    </PanelWrap>
  );
}
