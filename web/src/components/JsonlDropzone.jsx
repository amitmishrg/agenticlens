import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { readJsonlFiles } from '../utils/readJsonlFiles';
import { readJsonlFilesFromDataTransfer } from '../utils/readJsonlFilesFromDataTransfer';

export default function JsonlDropzone({
  onFilesReady,
  onError,
  children,
  rootClassName,
  rootStyle,
}) {
  const onDrop = useCallback(
    async (acceptedFiles, _fileRejections, event) => {
      try {
        let results = [];
        const dataTransfer = event?.dataTransfer;

        // If a folder was dropped and the browser provides directory entries,
        // read recursively using webkitGetAsEntry.
        if (dataTransfer) {
          results = await readJsonlFilesFromDataTransfer(dataTransfer);
        }

        // Fallback to whatever react-dropzone extracted as File objects.
        if (!results.length) {
          results = await readJsonlFiles(acceptedFiles);
        }

        if (!results.length) {
          onError?.('No .jsonl files found in the dropped content.');
          return;
        }
        onFilesReady?.(results);
      } catch (err) {
        onError?.(err?.message || 'Failed to read dropped files.');
      }
    },
    [onFilesReady, onError],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/json': ['.jsonl'],
      'text/plain': ['.jsonl'],
    },
  });

  const onRootClick = (e) => {
    const target = e?.target;
    // Ignore clicks that originate from the folder input in FolderPickerButton.
    if (target?.closest?.('[data-folder-picker-button="true"]')) return;
    if (target?.tagName === 'INPUT') {
      const isDir = target.getAttribute?.('webkitdirectory') || target.getAttribute?.('directory');
      if (isDir) return;
    }
    open();
  };

  return (
    <div
      {...getRootProps({ style: undefined })}
      onClick={onRootClick}
      className={rootClassName}
      style={{
        ...(rootStyle || {}),
        borderColor: isDragActive ? '#6366f1' : undefined,
        background: isDragActive ? 'rgba(99,102,241,0.08)' : rootStyle?.background,
      }}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  );
}
