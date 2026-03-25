import TypeIcon from '@/components/TypeIcon';
import { getAccent, getAccentLabelColor } from '@/constants/typeConfig';
import useAgentStore from '@/store/useAgentStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function TimelineItem({ node, delta }) {
  const theme = useThemeStore((s) => s.theme);
  const { selectedNode, setSelectedNode } = useAgentStore();
  const ac = getAccent(node.type);
  const typeFg = getAccentLabelColor(ac, theme);
  const isSelected = selectedNode?.id === node.id;
  const slowNode = node.anomalies?.includes('slow_node');

  const iconBgAlpha = theme === 'light' ? '33' : '22';
  const iconBorderAlpha = theme === 'light' ? '66' : '55';
  const spineAlpha = theme === 'light' ? '44' : '33';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setSelectedNode(node)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedNode(node);
        }
      }}
      className="mb-1 flex cursor-pointer gap-3.5 rounded-lg px-3.5 py-2.5 outline-offset-2 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--app-focus-ring)]"
      style={{
        background: isSelected ? `${ac}24` : 'transparent',
        border: `1px solid ${isSelected ? `${ac}66` : 'transparent'}`,
      }}
    >
      <div className="flex shrink-0 flex-col items-center pt-0.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8"
          style={{
            background: `${ac}${iconBgAlpha}`,
            border: `1.5px solid ${ac}${iconBorderAlpha}`,
          }}
        >
          <TypeIcon type={node.type} color={typeFg} size={15} />
        </div>
        <div className="mt-1 w-px flex-1" style={{ background: `${ac}${spineAlpha}` }} />
      </div>

      <div className="min-w-0 flex-1 pb-2">
        <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-wide sm:text-xs"
            style={{ color: typeFg }}
          >
            {node.type}
          </span>
          {slowNode && (
            <span className="inline-flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
                style={{ boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-app-danger-fg">
                Slow
              </span>
            </span>
          )}
          {delta != null && (
            <span className="font-mono text-[11px] tabular-nums text-app-fg-muted">
              +{delta < 1000 ? `${delta}ms` : `${(delta / 1000).toFixed(2)}s`}
            </span>
          )}
        </div>
        <p className="m-0 whitespace-normal break-words text-[13px] leading-snug text-app-fg-subtle">
          {node.label}
        </p>
        {node.meta?.model && (
          <span className="mt-1 inline-block font-mono text-[11px] text-app-fg-muted">{node.meta.model}</span>
        )}
      </div>
    </div>
  );
}
