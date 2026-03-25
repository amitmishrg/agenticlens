import useAgentStore, { FILTER_TYPES } from '@/store/useAgentStore';

export default function ToolbarTypeFilter() {
  const filterType = useAgentStore((s) => s.filterType);
  const setFilter = useAgentStore((s) => s.setFilterType);

  return (
    <div className="flex items-center gap-2 ml-2">
      <label
        htmlFor="agent-type-filter"
        className="text-[10px] uppercase tracking-wider text-app-label-muted"
      >
        Type
      </label>
      <select
        id="agent-type-filter"
        value={filterType}
        onChange={(e) => setFilter(e.target.value)}
        className="w-[150px] min-h-9 text-xs py-2 px-2.5 rounded-xl border border-app-border bg-app-surface/90 text-app-fg-subtle cursor-pointer shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-app-border-strong focus-visible:ring-2 focus-visible:ring-app-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg [outline-offset:2px]"
      >
        {FILTER_TYPES.map((t) => (
          <option key={t} value={t}>
            {t === 'all' ? 'All types' : t}
          </option>
        ))}
      </select>
    </div>
  );
}
