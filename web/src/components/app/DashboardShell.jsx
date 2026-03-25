import FileSidebar from '@/components/FileSidebar';
import SessionSummary from '@/components/SessionSummary';
import ParseStateOverlay from '@/components/app/ParseStateOverlay';
import MainFlowViews from '@/components/app/MainFlowViews';

export default function DashboardShell({
  view,
  nodes,
  activeFile,
  error,
  showOverlayLoading,
  showOverlayError,
}) {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <FileSidebar />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <SessionSummary />
        <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
          <ParseStateOverlay
            loading={showOverlayLoading}
            error={showOverlayError ? error : null}
            fileName={activeFile?.name}
          />

          <MainFlowViews view={view} nodeCount={nodes.length} />
        </div>
      </div>
    </div>
  );
}
