import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { readJsonlFiles } from '../utils/readJsonlFiles';

export default function JsonlDropzone({ onFilesReady, onError }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        const results = await readJsonlFiles(acceptedFiles);
        if (!results.length) {
          onError?.('No .jsonl files found in the dropped content.');
          return;
        }
        onFilesReady?.(results);
      } catch (err) {
        onError?.(err?.message || 'Failed to read dropped files.');
      }
    },
    [onFilesReady, onError]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className="mt-4 rounded-lg p-4"
      style={{
        border: `1px dashed ${isDragActive ? '#6366f1' : '#1e1e2e'}`,
        background: isDragActive ? 'rgba(99,102,241,0.08)' : 'transparent',
        transition: 'background 0.15s, border-color 0.15s',
        cursor: 'pointer',
      }}
    >
      <div className="text-[12px]" style={{ color: '#94a3b8' }}>
        Drag & drop files or folders here
      </div>
      <div className="text-[10px] mt-1 font-mono" style={{ color: '#64748b' }}>
        Accepts only <span style={{ color: '#a5b4fc' }}>.jsonl</span>
      </div>
    </div>
  );
}

