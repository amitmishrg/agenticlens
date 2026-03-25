import {
  PlayIcon,
  PauseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ArrowsOutSimpleIcon,
} from '@phosphor-icons/react';
import useAgentStore from '@/store/useAgentStore';

const ICON_PX = 15;

function IconBtn({ title, onClick, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-0 transition-[background-color,color,transform] duration-150 outline-offset-2',
        disabled
          ? 'cursor-not-allowed text-app-label opacity-40'
          : 'cursor-pointer text-app-fg-muted hover:bg-[color-mix(in_oklab,var(--app-surface-2)_88%,var(--app-fg))] hover:text-app-fg active:scale-[0.94]',
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

  const ic = { size: ICON_PX, color: 'currentColor', className: 'shrink-0' };

  return (
    <div
      className="ml-2 flex h-9 items-center gap-0.5 rounded-full border border-app-chrome-border bg-app-chrome-well-bg px-1 shadow-sm box-border"
      role="group"
      aria-label="Replay controls"
    >
      <span className="select-none pl-2 pr-0.5 text-[13px] font-medium leading-none text-app-fg-muted">
        Replay
      </span>

      <IconBtn title="Show full session" onClick={resetReplay}>
        <ArrowsOutSimpleIcon {...ic} weight="duotone" />
      </IconBtn>

      <IconBtn title={isPlaying ? 'Pause' : 'Play'} onClick={() => (isPlaying ? pause() : play())}>
        {isPlaying ? <PauseIcon {...ic} weight="fill" /> : <PlayIcon {...ic} weight="fill" />}
      </IconBtn>

      <IconBtn title="Previous event" onClick={prevStep} disabled={idx < 0}>
        <CaretLeftIcon {...ic} weight="duotone" />
      </IconBtn>

      <IconBtn title="Next event" onClick={nextStep} disabled={atEnd}>
        <CaretRightIcon {...ic} weight="duotone" />
      </IconBtn>

      <span
        className={[
          'flex h-7 min-w-[3.25rem] items-center justify-center px-1 font-mono text-[13px] leading-none tabular-nums',
          idx < 0 ? 'text-app-label' : 'text-app-fg-subtle',
        ].join(' ')}
      >
        {idx < 0 ? '— / —' : `${idx + 1} / ${chronLen}`}
      </span>
    </div>
  );
}
