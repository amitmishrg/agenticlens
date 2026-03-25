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
        rootClassName="group w-full max-w-2xl rounded-2xl border border-app-border bg-[color-mix(in_oklab,var(--app-surface)_88%,transparent)] px-8 py-8 cursor-pointer transition-[background,border-color,box-shadow,transform] duration-300 ease-out backdrop-blur-md hover:border-app-accent-soft-border hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0"
        rootStyle={{
          boxShadow:
            '0 0 0 1px rgb(99 102 241 / 0.1), 0 20px 50px -24px rgb(0 0 0 / 0.35)',
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
