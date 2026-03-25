import {
  PlayIcon,
  PauseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ArrowsOutSimpleIcon,
} from '@phosphor-icons/react';
import useAgentStore from '../store/useAgentStore';

const shell = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginLeft: 10,
  padding: '3px 6px 3px 8px',
  borderRadius: 8,
  border: '1px solid #2d2d3f',
  background: '#12121b',
};

function IconBtn({ title, onClick, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 8,
        border: disabled ? '1px solid #222232' : '1px solid #3f3f5c',
        background: disabled ? '#12121a' : '#1a1a28',
        color: disabled ? '#3f3f50' : '#bfc3ff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  );
}

export default function ToolbarReplay() {
  const chronLen    = useAgentStore((s) => s.chronNodeIds.length);
  const idx         = useAgentStore((s) => s.currentStepIndex);
  const isPlaying   = useAgentStore((s) => s.isPlaying);
  const play        = useAgentStore((s) => s.play);
  const pause       = useAgentStore((s) => s.pause);
  const nextStep    = useAgentStore((s) => s.nextStep);
  const prevStep    = useAgentStore((s) => s.prevStep);
  const resetReplay = useAgentStore((s) => s.resetReplay);

  if (!chronLen) return null;

  const atEnd = idx >= chronLen - 1;

  return (
    <div style={shell}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#a5b4fc',
          textTransform: 'uppercase',
          marginRight: 4,
          whiteSpace: 'nowrap',
        }}
      >
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
        style={{
          fontSize: 11,
          fontFamily: 'ui-monospace, monospace',
          color: idx < 0 ? '#5c5c78' : '#94a3b8',
          minWidth: 48,
          textAlign: 'center',
        }}
      >
        {idx < 0 ? '— / —' : `${idx + 1} / ${chronLen}`}
      </span>
    </div>
  );
}
