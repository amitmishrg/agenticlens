import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import useAgentStore from './store/useAgentStore';
import { parseJSONL } from './parser/parseJSONL';
import { buildTree } from './parser/buildTree';
import { enrichNodes } from './parser/enrichNodes';
import { buildSteps } from './parser/buildSteps';
import { detectAnomalies } from './utils/anomalyDetector';
import { computeSessionSummary } from './utils/sessionSummary';
import Toolbar from './components/Toolbar';
import SessionSummary from './components/SessionSummary';
import UploadPanel from './components/UploadPanel';
import FileSidebar from './components/FileSidebar';
import SlidePane from './components/SlidePane';
import ReplayTicker from './components/ReplayTicker';
import FlowView from './features/flow/FlowView';
import TreeView from './features/tree/TreeView';
import TimelineView from './features/timeline/TimelineView';
import { WarningOctagonIcon } from '@phosphor-icons/react';

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

  const [status, setStatus] = useState('auto_loading'); // auto_loading | parsing | ready | upload | error
  const [error, setError] = useState(null);

  const activeFile = workspaceFiles?.[activeFileIndex] || null;
  const loadedSignatureRef = useRef(null);

  const onFilesReady = useCallback(
    (filesArray) => {
      setError(null);
      loadedSignatureRef.current = null;
      setWorkspaceFiles(filesArray || []);
      setActiveFile(0);
      setStatus('parsing');
      closeUploadPanel();
    },
    [setWorkspaceFiles, setActiveFile, closeUploadPanel],
  );

  // Auto mode detection: try CLI `/data` first, fall back to upload UI.
  useEffect(() => {
    let cancelled = false;

    async function autoLoad() {
      try {
        // Workspace mode: list jsonl files from folder input.
        const workspaceRes = await fetch('/workspace');
        if (workspaceRes.ok) {
          const workspace = await workspaceRes.json();
          const files = workspace?.files || [];
          if (Array.isArray(files) && files.length) {
            if (cancelled) return;
            loadedSignatureRef.current = null;
            setWorkspaceFiles(
              files.map((f) => ({ name: f.name, content: null })),
            );
            setActiveFile(0);
            setStatus('parsing');
            return;
          }
        }

        // Backward compatible fallback: single file.
        const res = await fetch('/data');
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const raw = await res.text();
        if (cancelled) return;
        loadedSignatureRef.current = null;
        setWorkspaceFiles([{ name: 'CLI Session', content: raw }]);
        setActiveFile(0);
        setStatus('parsing');
      } catch (err) {
        if (cancelled) return;
        setError(null);
        setStatus('upload');
      }
    }

    autoLoad();
    return () => {
      cancelled = true;
    };
  }, [setWorkspaceFiles, setActiveFile]);

  // Parse only the active file contents.
  useEffect(() => {
    if (!activeFile) return;

    const name = activeFile.name;
    const currentLen = activeFile.content?.length;
    const signature = `${activeFileIndex}:${name}:${Number.isFinite(currentLen) ? currentLen : 'empty'}`;
    if (loadedSignatureRef.current === signature) return;
    loadedSignatureRef.current = signature;

    let cancelled = false;

    async function parseActive() {
      try {
        setError(null);
        setStatus('parsing');

        // Yield to the browser to keep UI responsive.
        await new Promise((r) => setTimeout(r, 0));

        let raw = activeFile.content;
        if (!raw) {
          const res = await fetch(`/data?index=${activeFileIndex}`);
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          raw = await res.text();
          if (cancelled) return;

          const finalSignature = `${activeFileIndex}:${name}:${raw.length}`;
          loadedSignatureRef.current = finalSignature;
          setWorkspaceFileContent(activeFileIndex, raw);
        }

        const parsed = parseJSONL(raw);
        const enriched = enrichNodes(parsed);
        const steps = buildSteps(enriched);
        const stepsWithAnomalies = detectAnomalies(steps);
        const summary = computeSessionSummary(stepsWithAnomalies);

        const chron = [...enriched]
          .filter((n) => n.timestamp)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((n) => n.id);

        if (cancelled) return;
        setNodes(enriched);
        setTree(buildTree(enriched));
        setSteps(stepsWithAnomalies);
        setSessionSummary(summary);
        setChronNodeIds(chron);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Failed to parse JSONL.');
        setStatus('error');
      }
    }

    parseActive();
    return () => {
      cancelled = true;
    };
  }, [
    activeFile,
    activeFileIndex,
    setNodes,
    setTree,
    setSteps,
    setSessionSummary,
    setChronNodeIds,
    setWorkspaceFileContent,
  ]);

  const showEmptyUpload = !workspaceFiles?.length;
  const showOverlayLoading = status === 'parsing' && !!workspaceFiles?.length;
  const showOverlayError = status === 'error' && !!workspaceFiles?.length;
  const showAutoLoading = status === 'auto_loading' && showEmptyUpload;
  const showUploadPanel =
    isUploadPanelOpen || (showEmptyUpload && status === 'upload');

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: '#09090c' }}
    >
      <Toolbar />

      {showAutoLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4 overflow-hidden">
          <div className="flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin" />
            <p className="text-xs" style={{ color: '#33334a' }}>
              Loading agent logs…
            </p>
          </div>
        </div>
      ) : showUploadPanel ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4 overflow-hidden">
          <div className="w-full max-w-3xl">
            <UploadPanel onFilesReady={onFilesReady} />
            {showEmptyUpload && (
              <div
                className="mt-4 text-[12px] font-mono"
                style={{ color: '#64748b', textAlign: 'center' }}
              >
                Upload a JSONL file or folder to begin
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <FileSidebar />

          <div className="flex flex-col flex-1 overflow-hidden">
            <SessionSummary />
            <div className="relative flex-1 overflow-hidden">
              {(showOverlayLoading || showOverlayError) && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: 'rgba(9,9,12,0.65)',
                    zIndex: 5,
                  }}
                >
                  <div className="flex flex-col items-center max-w-md gap-3 px-6 text-center">
                    {showOverlayLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                        <p className="text-xs" style={{ color: '#33334a' }}>
                          Loading: {activeFile?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <WarningOctagonIcon
                          size={34}
                          weight="duotone"
                          color="#f87171"
                        />
                        <p className="text-sm font-semibold text-red-400">
                          Failed to parse JSONL
                        </p>
                        <p className="font-mono text-xs text-red-600">
                          {error}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {view === 'flow' && <FlowView />}
              {view === 'tree' && (
                <PanelWrap label="Event Tree" count={nodes.length}>
                  <TreeView />
                </PanelWrap>
              )}
              {view === 'timeline' && (
                <PanelWrap label="Timeline" count={nodes.length}>
                  <TimelineView />
                </PanelWrap>
              )}
            </div>
          </div>
        </div>
      )}

      <ReplayTicker />

      {/* Inspector slide pane — single shared instance, overlays from the right */}
      <SlidePane />

      <Analytics />
    </div>
  );
}

/** Thin wrapper used for tree + timeline to keep their sub-header */
function PanelWrap({ label, count, children }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="px-4 py-1.5 shrink-0 flex items-center gap-2"
        style={{ borderBottom: '1px solid #1a1a28' }}
      >
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: '#33334a' }}
        >
          {label}
        </span>
        <span className="text-[10px] font-mono" style={{ color: '#22223a' }}>
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
