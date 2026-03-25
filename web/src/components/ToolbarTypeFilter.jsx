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
        className="w-[150px] text-xs py-1.5 px-2.5 rounded-lg border border-app-border bg-app-surface-2 text-app-fg-subtle cursor-pointer"
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
