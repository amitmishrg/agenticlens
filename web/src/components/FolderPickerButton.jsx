import { useCallback, useRef } from 'react';
import { FolderOpenIcon } from '@phosphor-icons/react';
import { readJsonlFiles } from '@/utils/readJsonlFiles';

export default function FolderPickerButton({ onFilesReady, onError }) {
  const inputRef = useRef(null);

  const open = useCallback((e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    inputRef.current?.click();
  }, []);

  const onChange = useCallback(
    async (e) => {
      try {
        const list = e.target.files;
        const results = await readJsonlFiles(list);
        if (!results.length) {
          onError?.('No .jsonl files found in the selected folder.');
          return;
        }
        onFilesReady?.(results);
      } catch (err) {
        onError?.(err?.message || 'Failed to read folder files.');
      } finally {
        e.target.value = '';
      }
    },
    [onFilesReady, onError],
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        webkitdirectory="true"
        directory="true"
        multiple
        accept=".jsonl"
        onChange={onChange}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      />
      <button
        type="button"
        onClick={open}
        data-folder-picker-button="true"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-app-chrome-border bg-app-chrome-well-bg px-4 text-[13px] font-semibold text-app-fg-subtle shadow-sm transition-[background-color,border-color,color,transform] hover:border-app-border-strong hover:bg-app-surface hover:text-app-fg active:scale-[0.98] outline-offset-2"
      >
        <FolderOpenIcon size={18} weight="duotone" className="shrink-0 text-app-accent-fg" aria-hidden />
        Choose folder
      </button>
    </>
  );
}
