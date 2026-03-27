import { useCallback } from 'react';

export function useFilesReadyHandler({
  setError,
  loadedSignatureRef,
  setWorkspaceFiles,
  setActiveFile,
  closeUploadPanel,
  setStatus,
  setIsSampleSession,
}) {
  return useCallback(
    (filesArray) => {
      setError(null);
      loadedSignatureRef.current = null;
      setIsSampleSession(false);
      setWorkspaceFiles(filesArray || []);
      setActiveFile(0);
      setStatus('parsing');
      closeUploadPanel();
    },
    [
      setError,
      loadedSignatureRef,
      setWorkspaceFiles,
      setActiveFile,
      closeUploadPanel,
      setStatus,
      setIsSampleSession,
    ],
  );
}
