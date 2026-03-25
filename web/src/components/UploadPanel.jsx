import { useCallback, useState } from 'react';
import JsonlDropzone from './JsonlDropzone';
import { readJsonlFiles } from '../utils/readJsonlFiles';

export default function UploadPanel({ onFilesReady }) {
  const [error, setError] = useState(null);

  const handleInput = useCallback(
    async (fileList) => {
      try {
        setError(null);
        const results = await readJsonlFiles(fileList);
        if (!results.length) {
          setError('No .jsonl files found.');
          return;
        }
        onFilesReady?.(results);
      } catch (err) {
        setError(err?.message || 'Failed to read files.');
      }
    },
    [onFilesReady]
  );

  return (
    <div className="w-full flex flex-col items-center px-4">
      <div
        className="w-full max-w-2xl rounded-xl border border-gray-800 bg-[#0a0a10] px-6 py-6"
        style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.08)' }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', color: '#33334a', textTransform: 'uppercase' }}>
          Upload JSONL (Workspace Mode)
        </div>

        <JsonlDropzone
          onFilesReady={onFilesReady}
          onError={(msg) => setError(msg)}
        />

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <label
            className="cursor-pointer rounded-lg border border-gray-800 bg-[#0a0a10] px-4 py-3 flex flex-col gap-1"
            style={{ color: '#cbd5e1' }}
          >
            <span className="text-[11px] font-bold" style={{ color: '#818cf8' }}>File Upload</span>
            <span className="text-[10px]" style={{ color: '#64748b' }}>Select multiple .jsonl</span>
            <input
              type="file"
              accept=".jsonl"
              multiple
              className="hidden"
              onChange={(e) => handleInput(e.target.files)}
            />
          </label>

          <label
            className="cursor-pointer rounded-lg border border-gray-800 bg-[#0a0a10] px-4 py-3 flex flex-col gap-1"
            style={{ color: '#cbd5e1' }}
          >
            <span className="text-[11px] font-bold" style={{ color: '#818cf8' }}>Folder Upload</span>
            <span className="text-[10px]" style={{ color: '#64748b' }}>Select a folder</span>
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              accept=".jsonl"
              className="hidden"
              onChange={(e) => handleInput(e.target.files)}
            />
          </label>

          <div className="rounded-lg border border-gray-800 bg-[#0a0a10] px-4 py-3">
            <div className="text-[11px] font-bold" style={{ color: '#818cf8' }}>Tip</div>
            <div className="text-[10px] mt-1" style={{ color: '#64748b' }}>
              Dropping works best in Chromium-based browsers.
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-[12px] font-semibold" style={{ color: '#f87171' }}>
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 text-[11px] font-mono" style={{ color: '#64748b' }}>
        After upload, switch files from the left sidebar.
      </div>
    </div>
  );
}

