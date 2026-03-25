import { useEffect } from 'react';

/**
 * On mount: try /workspace (CLI folder mode), else /data (single file), else open upload UI.
 */
export function useWorkspaceAutoLoad({
  setWorkspaceFiles,
  setActiveFile,
  setStatus,
  setError,
  loadedSignatureRef,
}) {
  useEffect(() => {
    let cancelled = false;

    async function autoLoad() {
      try {
        const workspaceRes = await fetch('/workspace');
        if (workspaceRes.ok) {
          const workspace = await workspaceRes.json();
          const files = workspace?.files || [];
          if (Array.isArray(files) && files.length) {
            if (cancelled) return;
            loadedSignatureRef.current = null;
            setWorkspaceFiles(files.map((f) => ({ name: f.name, content: null })));
            setActiveFile(0);
            setStatus('parsing');
            return;
          }
        }

        const res = await fetch('/data');
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const raw = await res.text();
        if (cancelled) return;
        loadedSignatureRef.current = null;
        setWorkspaceFiles([{ name: 'CLI Session', content: raw }]);
        setActiveFile(0);
        setStatus('parsing');
      } catch {
        if (cancelled) return;
        setError(null);
        setStatus('upload');
      }
    }

    autoLoad();
    return () => {
      cancelled = true;
    };
  }, [setWorkspaceFiles, setActiveFile, setStatus, setError, loadedSignatureRef]);
}
