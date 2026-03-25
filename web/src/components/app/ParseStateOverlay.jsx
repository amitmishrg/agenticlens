import { WarningOctagonIcon } from '@phosphor-icons/react';

export default function ParseStateOverlay({ loading, error, fileName }) {
  if (!loading && !error) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: 'rgba(9,9,12,0.65)',
        zIndex: 5,
      }}
    >
      <div className="flex flex-col items-center max-w-md gap-3 px-6 text-center">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin" />
            <p className="text-xs" style={{ color: '#33334a' }}>
              Loading: {fileName}
            </p>
          </>
        ) : (
          <>
            <WarningOctagonIcon size={34} weight="duotone" color="#f87171" />
            <p className="text-sm font-semibold text-red-400">Failed to parse JSONL</p>
            <p className="font-mono text-xs text-red-600">{error}</p>
          </>
        )}
      </div>
    </div>
  );
}
