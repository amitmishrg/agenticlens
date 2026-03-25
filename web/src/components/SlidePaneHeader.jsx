import { getAccent } from '@/constants/typeConfig';
import { XIcon } from '@phosphor-icons/react';

export default function SlidePaneHeader({ node, onClose }) {
  const ac = node ? getAccent(node.type) : null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 pl-4 border-b border-app-border bg-app-surface-elevated shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-widest uppercase text-app-label">
          Inspector
        </span>
        {node && (
          <span
            className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full border"
            style={{
              color: ac,
              background: `${ac}18`,
              borderColor: `${ac}28`,
            }}
          >
            {node.type}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-app-label-muted tracking-wide">ESC to close</span>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 border bg-[var(--app-close-bg)] border-[var(--app-close-border)] text-[var(--app-close-fg)] hover:bg-[var(--app-close-hover-bg)] hover:text-[var(--app-close-hover-fg)]"
        >
          <XIcon size={10} weight="bold" />
        </button>
      </div>
    </div>
  );
}
