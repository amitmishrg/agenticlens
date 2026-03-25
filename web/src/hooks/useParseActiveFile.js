import { useEffect } from 'react';
import { buildSessionFromRaw } from '../utils/buildSessionFromRaw';

/** Loads / parses only the active workspace file and hydrates the Zustand store. */
export function useParseActiveFile({
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
}) {
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

        const { enriched, tree, stepsWithAnomalies, summary, chron } = buildSessionFromRaw(raw);

        if (cancelled) return;
        setNodes(enriched);
        setTree(tree);
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
    setError,
    setStatus,
    setNodes,
    setTree,
    setSteps,
    setSessionSummary,
    setChronNodeIds,
    setWorkspaceFileContent,
    loadedSignatureRef,
  ]);
}
