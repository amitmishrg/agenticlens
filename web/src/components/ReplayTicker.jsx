import { useEffect, useRef } from 'react';
import useAgentStore from '../store/useAgentStore';

/** Advances replay while isPlaying is true. */
export default function ReplayTicker() {
  const isPlaying = useAgentStore((s) => s.isPlaying);
  const nextStep = useAgentStore((s) => s.nextStep);
  const nextRef = useRef(nextStep);

  nextRef.current = nextStep;

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => nextRef.current(), 820);
    return () => clearInterval(id);
  }, [isPlaying]);

  return null;
}
