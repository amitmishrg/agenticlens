import useAgentStore, { FILTER_TYPES } from '../store/useAgentStore';

const sel = {
  width: 150,
  fontSize: 12,
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid #2d2d3f',
  background: '#15151f',
  color: '#cbd5e1',
  cursor: 'pointer',
};

export default function ToolbarTypeFilter() {
  const filterType = useAgentStore((s) => s.filterType);
  const setFilter = useAgentStore((s) => s.setFilterType);

  return (
    <div className="flex items-center gap-2 ml-2">
      <label
        htmlFor="agent-type-filter"
        className="text-[10px] uppercase tracking-wider"
        style={{ color: '#52527a' }}
      >
        Type
      </label>
      <select
        id="agent-type-filter"
        value={filterType}
        onChange={(e) => setFilter(e.target.value)}
        style={sel}
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
