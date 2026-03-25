import { useState } from 'react';
import JsonlDropzone from '@/components/JsonlDropzone';
import FolderPickerButton from '@/components/FolderPickerButton';

export default function UploadPanel({ onFilesReady }) {
  const [error, setError] = useState(null);

  return (
    <div className="w-full flex flex-col items-center px-4">
      <JsonlDropzone
        onFilesReady={onFilesReady}
        onError={(msg) => setError(msg)}
        rootClassName="w-full max-w-2xl rounded-xl border border-app-border bg-app-surface-elevated px-6 py-6 cursor-pointer transition-[background,border-color] duration-150"
        rootStyle={{
          boxShadow: '0 0 0 1px rgb(99 102 241 / 0.08)',
        }}
      >
        <div className="text-xs font-extrabold tracking-widest uppercase text-app-label">
          Upload JSONL (Workspace Mode)
        </div>

        <div className="mt-3 text-xs text-app-fg-muted">
          Click to browse or drag & drop files/folders here
        </div>

        <div className="mt-3 flex items-center gap-3">
          <FolderPickerButton onFilesReady={onFilesReady} onError={(msg) => setError(msg)} />
        </div>

        {error && <div className="mt-3 text-xs font-semibold text-red-400">{error}</div>}
      </JsonlDropzone>
    </div>
  );
}
