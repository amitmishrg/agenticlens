import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import useAgentStore, { FILTER_TYPES } from '@/store/useAgentStore';

function typeMenuLabel(value) {
  if (value === 'all') return 'All types';
  return value
    .split(/[-_]/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
}

const TRIGGER_W = 'w-[11rem]';

export default function ToolbarTypeFilter() {
  const filterType = useAgentStore((s) => s.filterType);
  const setFilterType = useAgentStore((s) => s.setFilterType);
  const listId = useId();
  const labelId = useId();
  const valueId = useId();
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const idx = FILTER_TYPES.indexOf(filterType);
  const safeIdx = idx >= 0 ? idx : 0;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const select = useCallback(
    (value) => {
      setFilterType(value);
      close();
    },
    [setFilterType, close],
  );

  useEffect(() => {
    if (!open) return;
    setHighlight(safeIdx);
  }, [open, safeIdx]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e) {
      if (!containerRef.current?.contains(e.target)) close();
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, FILTER_TYPES.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const v = FILTER_TYPES[highlight];
        if (v != null) select(v);
        return;
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setHighlight(0);
        return;
      }
      if (e.key === 'End') {
        e.preventDefault();
        setHighlight(FILTER_TYPES.length - 1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, highlight, select, close]);

  return (
    <div ref={containerRef} className="ml-1 box-border flex h-9 items-center gap-1.5">
      <span id={labelId} className="shrink-0 text-[13px] font-medium leading-none text-app-fg-subtle">
        Type
      </span>

      <div className={`relative shrink-0 ${TRIGGER_W}`}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${valueId}`}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className="flex h-9 w-full cursor-pointer items-center justify-between gap-1 rounded-full border border-app-chrome-border bg-app-chrome-well-bg pl-3 pr-2 text-left shadow-sm outline-offset-2 transition-[border-color,box-shadow] hover:border-app-border-strong focus-visible:ring-2 focus-visible:ring-app-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
        >
          <span id={valueId} className="min-w-0 truncate text-[13px] font-medium text-app-fg">
            {typeMenuLabel(filterType)}
          </span>
          <CaretDownIcon
            size={14}
            weight="bold"
            className={[
              'shrink-0 text-app-fg-muted transition-transform duration-200',
              open ? 'rotate-180' : '',
            ].join(' ')}
            aria-hidden
          />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`${listId}-opt-${highlight}`}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] max-h-60 overflow-auto rounded-xl border border-app-chrome-border bg-app-surface py-1 shadow-lg shadow-black/10 dark:shadow-black/40"
          >
            {FILTER_TYPES.map((t, i) => {
              const selected = filterType === t;
              const active = i === highlight;
              return (
                <li
                  key={t}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  className={[
                    'cursor-pointer px-3 py-2 text-[13px] font-medium transition-colors',
                    selected
                      ? 'bg-[var(--app-accent-soft-bg)] text-app-accent-fg'
                      : 'text-app-fg',
                    active && !selected ? 'bg-app-surface-2/90' : '',
                    !active && !selected ? 'hover:bg-app-surface-elevated' : '',
                  ].join(' ')}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(t)}
                >
                  {typeMenuLabel(t)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
