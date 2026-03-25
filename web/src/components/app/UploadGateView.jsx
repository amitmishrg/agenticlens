import UploadPanel from '@/components/UploadPanel';

export default function UploadGateView({ onFilesReady, showEmptyHint }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-auto app-viewport-dots">
      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-5 py-12 sm:max-w-lg sm:py-20">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-app-fg sm:text-[1.75rem]">
            Open a trace
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-app-fg-muted">
            Drop <span className="font-mono text-[0.9em] text-app-fg-subtle">.jsonl</span> files or
            a folder.
          </p>
        </div>

        <UploadPanel onFilesReady={onFilesReady} />

        {showEmptyHint && (
          <p className="mt-8 text-center text-[13px] text-app-fg-muted">
            Tip: you can also open a folder that contains multiple traces.
          </p>
        )}
      </div>
    </div>
  );
}
