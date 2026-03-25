import { useCallback, useRef } from 'react';
import { readJsonlFiles } from '../utils/readJsonlFiles';

export default function FolderPickerButton({ onFilesReady, onError }) {
  const inputRef = useRef(null);

  const open = useCallback((e) => {
    // Prevent the surrounding dropzone click handler from firing too.
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
        // allow re-selecting the same folder
        e.target.value = '';
      }
    },
    [onFilesReady, onError]
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
        className="text-[11px] rounded-md px-2.5 py-1"
        style={{ background: '#1a1a28', color: '#818cf8', border: '1px solid #2a2a44' }}
      >
        Choose folder
      </button>
    </>
  );
}

