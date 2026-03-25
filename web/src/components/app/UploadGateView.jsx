import UploadPanel from '@/components/UploadPanel';

export default function UploadGateView({ onFilesReady, showEmptyHint }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 overflow-hidden">
      <div className="w-full max-w-3xl">
        <UploadPanel onFilesReady={onFilesReady} />
        {showEmptyHint && (
          <div
            className="mt-4 text-[12px] font-mono"
            style={{ color: '#64748b', textAlign: 'center' }}
          >
            Upload a JSONL file or folder to begin
          </div>
        )}
      </div>
    </div>
  );
}
