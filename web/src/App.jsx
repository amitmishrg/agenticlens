import { useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

import useAgentStore from '@/store/useAgentStore';
import Toolbar from '@/components/Toolbar';
import MinimalAppHeader from '@/components/app/MinimalAppHeader';
import SlidePane from '@/components/SlidePane';
import ReplayTicker from '@/components/ReplayTicker';
import AutoLoadingView from '@/components/app/AutoLoadingView';
import UploadGateView from '@/components/app/UploadGateView';
import DashboardShell from '@/components/app/DashboardShell';
import { useWorkspaceAutoLoad } from '@/hooks/useWorkspaceAutoLoad';
import { useParseActiveFile } from '@/hooks/useParseActiveFile';
import { useFilesReadyHandler } from '@/hooks/useFilesReadyHandler';

export default function App() {
  const {
    view,
    setNodes,
    setTree,
    setSteps,
    setSessionSummary,
    setChronNodeIds,
    nodes,
    workspaceFiles,
    activeFileIndex,
    setWorkspaceFiles,
    setActiveFile,
    isUploadPanelOpen,
    closeUploadPanel,
    setWorkspaceFileContent,
  } = useAgentStore();

  const [status, setStatus] = useState('auto_loading');
  const [error, setError] = useState(null);
  const loadedSignatureRef = useRef(null);

  const activeFile = workspaceFiles?.[activeFileIndex] || null;

  useWorkspaceAutoLoad({
    setWorkspaceFiles,
    setActiveFile,
    setStatus,
    setError,
    loadedSignatureRef,
  });

  useParseActiveFile({
    activeFile,
    activeFileIndex,
    setError,
    setStatus,
    setNodes,
    setTree,
    setSteps,
    setSessionSummary,
    setChronNodeIds,
    setWorkspaceFileContent,
    loadedSignatureRef,
  });

  const onFilesReady = useFilesReadyHandler({
    setError,
    loadedSignatureRef,
    setWorkspaceFiles,
    setActiveFile,
    closeUploadPanel,
    setStatus,
  });

  const showEmptyUpload = !workspaceFiles?.length;
  const showOverlayLoading = status === 'parsing' && !!workspaceFiles?.length;
  const showOverlayError = status === 'error' && !!workspaceFiles?.length;
  const showAutoLoading = status === 'auto_loading' && showEmptyUpload;
  const showUploadPanel = isUploadPanelOpen || (showEmptyUpload && status === 'upload');
  const useMinimalChrome =
    showAutoLoading || (showUploadPanel && showEmptyUpload);

  return (
    <div className="relative isolate flex flex-col h-screen min-h-0 overflow-hidden bg-transparent text-app-fg">
      {useMinimalChrome ? <MinimalAppHeader /> : <Toolbar />}

      {showAutoLoading ? (
        <AutoLoadingView />
      ) : showUploadPanel ? (
        <UploadGateView onFilesReady={onFilesReady} showEmptyHint={showEmptyUpload} />
      ) : (
        <DashboardShell
          view={view}
          nodes={nodes}
          activeFile={activeFile}
          error={error}
          showOverlayLoading={showOverlayLoading}
          showOverlayError={showOverlayError}
        />
      )}

      <ReplayTicker />
      <SlidePane />
      <Analytics />
    </div>
  );
}
