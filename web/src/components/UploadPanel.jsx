import { useCallback, useState } from 'react';
import JsonlDropzone from '@/components/JsonlDropzone';
import FolderPickerButton from '@/components/FolderPickerButton';

export default function UploadPanel({ onFilesReady }) {
  const [error, setError] = useState(null);

  return (
    <div className="w-full flex flex-col items-center px-4">
      <JsonlDropzone
        onFilesReady={onFilesReady}
        onError={(msg) => setError(msg)}
        rootClassName="w-full max-w-2xl rounded-xl border border-gray-800 bg-[#0a0a10] px-6 py-6 cursor-pointer"
        rootStyle={{
          boxShadow: '0 0 0 1px rgba(99,102,241,0.08)',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#33334a',
            textTransform: 'uppercase',
          }}
        >
          Upload JSONL (Workspace Mode)
        </div>

        <div className="mt-3 text-[12px]" style={{ color: '#94a3b8' }}>
          Click to browse or drag & drop files/folders here
        </div>

        <div className="mt-3 flex items-center gap-3">
          <FolderPickerButton onFilesReady={onFilesReady} onError={(msg) => setError(msg)} />
        </div>

        {error && (
          <div className="mt-3 text-[12px] font-semibold" style={{ color: '#f87171' }}>
            {error}
          </div>
        )}
      </JsonlDropzone>
    </div>
  );
}
