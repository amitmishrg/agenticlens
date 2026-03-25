import { useState } from 'react';
import { FileArrowUpIcon } from '@phosphor-icons/react';
import JsonlDropzone from '@/components/JsonlDropzone';
import FolderPickerButton from '@/components/FolderPickerButton';

export default function UploadPanel({ onFilesReady }) {
  const [error, setError] = useState(null);

  return (
    <div className="w-full">
      <JsonlDropzone
        onFilesReady={onFilesReady}
        onError={(msg) => setError(msg)}
        rootClassName={[
          'group relative w-full cursor-pointer rounded-3xl border-2 border-dashed border-app-chrome-border',
          'bg-app-surface/90 px-6 py-10 backdrop-blur-md transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out',
          'shadow-[0_20px_56px_-28px_color-mix(in_oklab,var(--app-fg)_14%,transparent)]',
          'hover:border-app-accent/35 hover:bg-app-surface hover:shadow-[0_28px_64px_-24px_color-mix(in_oklab,var(--app-accent)_22%,transparent)]',
        ].join(' ')}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--app-accent-soft-bg)] ring-1 ring-[var(--app-accent-inner-ring)] transition-transform duration-300 group-hover:scale-[1.02]">
            <FileArrowUpIcon
              size={32}
              weight="duotone"
              className="text-app-accent-fg opacity-90"
              aria-hidden
            />
          </div>
          <p className="m-0 text-lg font-semibold tracking-tight text-app-fg">Drop files here</p>
          <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-app-fg-muted">
            Or click anywhere in this area to browse. Folders are scanned for{' '}
            <span className="font-mono text-[0.85em] text-app-fg-subtle">.jsonl</span>.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[13px] text-app-label">Prefer a folder?</span>
            <FolderPickerButton onFilesReady={onFilesReady} onError={(msg) => setError(msg)} />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-app-danger-fg">
            {error}
          </div>
        )}
      </JsonlDropzone>
    </div>
  );
}
