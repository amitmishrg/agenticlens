import {
  PlayIcon,
  PauseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ArrowsOutSimpleIcon,
} from '@phosphor-icons/react';
import useAgentStore from '@/store/useAgentStore';

function IconBtn({ title, onClick, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-150 border',
        disabled
          ? 'border-app-border bg-app-surface text-app-label cursor-not-allowed opacity-50'
          : 'border-app-border-strong bg-app-surface-2 text-app-accent-bright cursor-pointer hover:border-app-accent',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export default function ToolbarReplay() {
  const chronLen = useAgentStore((s) => s.chronNodeIds.length);
  const idx = useAgentStore((s) => s.currentStepIndex);
  const isPlaying = useAgentStore((s) => s.isPlaying);
  const play = useAgentStore((s) => s.play);
  const pause = useAgentStore((s) => s.pause);
  const nextStep = useAgentStore((s) => s.nextStep);
  const prevStep = useAgentStore((s) => s.prevStep);
  const resetReplay = useAgentStore((s) => s.resetReplay);

  if (!chronLen) return null;

  const atEnd = idx >= chronLen - 1;

  return (
    <div className="flex items-center gap-1 ml-2.5 py-0.5 pl-2 pr-1.5 rounded-lg border border-app-border bg-app-surface">
      <span className="text-[9px] font-bold tracking-widest uppercase text-app-accent-fg mr-1 whitespace-nowrap">
        Replay
      </span>

      <IconBtn title="Show full session" onClick={resetReplay}>
        <ArrowsOutSimpleIcon size={15} weight="bold" />
      </IconBtn>

      <IconBtn title={isPlaying ? 'Pause' : 'Play'} onClick={() => (isPlaying ? pause() : play())}>
        {isPlaying ? <PauseIcon size={15} weight="fill" /> : <PlayIcon size={15} weight="fill" />}
      </IconBtn>

      <IconBtn title="Previous event" onClick={prevStep} disabled={idx < 0}>
        <CaretLeftIcon size={15} weight="bold" />
      </IconBtn>

      <IconBtn title="Next event" onClick={nextStep} disabled={atEnd}>
        <CaretRightIcon size={15} weight="bold" />
      </IconBtn>

      <span
        className={[
          'text-[11px] font-mono min-w-[48px] text-center',
          idx < 0 ? 'text-app-label' : 'text-app-fg-muted',
        ].join(' ')}
      >
        {idx < 0 ? '— / —' : `${idx + 1} / ${chronLen}`}
      </span>
    </div>
  );
}
