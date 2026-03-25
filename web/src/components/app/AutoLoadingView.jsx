export default function AutoLoadingView() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 overflow-hidden">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-app-spinner rounded-full border-t-transparent animate-spin" />
        <p className="text-xs text-app-label">Loading agent logs…</p>
      </div>
    </div>
  );
}
