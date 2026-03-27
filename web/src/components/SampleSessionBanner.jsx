import useAgentStore from '@/store/useAgentStore';

export default function SampleSessionBanner() {
  const isSampleSession = useAgentStore((s) => s.isSampleSession);
  if (!isSampleSession) return null;

  return (
    <div
      className="shrink-0 border-b border-app-border/70 bg-[color-mix(in_oklab,var(--app-accent)_12%,var(--app-bg))] px-4 py-2 text-center"
      role="status"
    >
      <p className="m-0 text-[11px] font-medium text-app-fg-subtle tracking-tight">
        Showing sample session — upload your own logs to explore
      </p>
    </div>
  );
}
