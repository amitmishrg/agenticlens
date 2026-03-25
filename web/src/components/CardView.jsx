import { useEffect, useRef, useState } from 'react';
import useAgentStore from '../store/useAgentStore';

// ─── Type config ────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  user: {
    bg: 'card-bg-user',
    border: 'card-border-user',
    badge: 'badge-user',
    dot: 'dot-user',
    icon: IconUser,
    accent: '#6366f1',
    glow: 'rgba(99,102,241,0.18)',
  },
  assistant: {
    bg: 'card-bg-assistant',
    border: 'card-border-assistant',
    badge: 'badge-assistant',
    dot: 'dot-assistant',
    icon: IconBot,
    accent: '#22c55e',
    glow: 'rgba(34,197,94,0.15)',
  },
  thinking: {
    bg: 'card-bg-thinking',
    border: 'card-border-thinking',
    badge: 'badge-thinking',
    dot: 'dot-thinking',
    icon: IconThinking,
    accent: '#eab308',
    glow: 'rgba(234,179,8,0.15)',
  },
  tool_use: {
    bg: 'card-bg-tool',
    border: 'card-border-tool',
    badge: 'badge-tool',
    dot: 'dot-tool',
    icon: IconTool,
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
  },
  tool_result: {
    bg: 'card-bg-result',
    border: 'card-border-result',
    badge: 'badge-result',
    dot: 'dot-result',
    icon: IconResult,
    accent: '#14b8a6',
    glow: 'rgba(20,184,166,0.15)',
  },
  system: {
    bg: 'card-bg-system',
    border: 'card-border-system',
    badge: 'badge-system',
    dot: 'dot-system',
    icon: IconSystem,
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
  },
  progress: {
    bg: 'card-bg-progress',
    border: 'card-border-progress',
    badge: 'badge-progress',
    dot: 'dot-progress',
    icon: IconProgress,
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
  },
  result: {
    bg: 'card-bg-final',
    border: 'card-border-final',
    badge: 'badge-final',
    dot: 'dot-final',
    icon: IconFinal,
    accent: '#94a3b8',
    glow: 'rgba(148,163,184,0.12)',
  },
  'queue-operation': {
    bg: 'card-bg-queue',
    border: 'card-border-queue',
    badge: 'badge-queue',
    dot: 'dot-queue',
    icon: IconQueue,
    accent: '#ec4899',
    glow: 'rgba(236,72,153,0.15)',
  },
  'last-prompt': {
    bg: 'card-bg-lastprompt',
    border: 'card-border-lastprompt',
    badge: 'badge-lastprompt',
    dot: 'dot-lastprompt',
    icon: IconUser,
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.15)',
  },
};

function getConfig(type) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG['result'];
}

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconBot({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="3" y="8" width="18" height="13" rx="3" />
      <path d="M8 8V6a4 4 0 018 0v2" />
      <circle cx="9" cy="14" r="1.5" fill={color} stroke="none" />
      <circle cx="15" cy="14" r="1.5" fill={color} stroke="none" />
      <path d="M9 17.5h6" strokeLinecap="round" />
    </svg>
  );
}

function IconUser({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}

function IconThinking({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
      <path d="M9 17v1a3 3 0 006 0v-1" />
      <line x1="9" y1="13" x2="15" y2="13" strokeLinecap="round" />
    </svg>
  );
}

function IconTool({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconResult({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
    </svg>
  );
}

function IconSystem({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <line x1="4" y1="9" x2="2" y2="9" strokeLinecap="round" />
      <line x1="4" y1="15" x2="2" y2="15" strokeLinecap="round" />
      <line x1="20" y1="9" x2="22" y2="9" strokeLinecap="round" />
      <line x1="20" y1="15" x2="22" y2="15" strokeLinecap="round" />
    </svg>
  );
}

function IconProgress({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFinal({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconQueue({ color = 'currentColor' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="11" width="18" height="4" rx="1" />
      <rect x="3" y="18" width="11" height="4" rx="1" />
    </svg>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatTs(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d)) return null;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function extractBodyText(node) {
  if (node.type === 'thinking') {
    const b = node.data?.thinking ?? node.data?.content;
    if (typeof b === 'string') return b;
    const block = Array.isArray(node.data?.message?.content)
      ? node.data.message.content.find((c) => c.type === 'thinking')
      : null;
    return block?.thinking ?? node.label;
  }

  if (node.type === 'user' || node.type === 'assistant') {
    const content = node.data?.message?.content ?? node.data?.content;
    if (Array.isArray(content)) {
      const tb = content.find((b) => b.type === 'text');
      if (tb?.text) return tb.text;
    }
  }

  if (node.type === 'tool_use') {
    const content = node.data?.message?.content ?? node.data?.content;
    if (Array.isArray(content)) {
      const block = content.find((b) => b.type === 'tool_use');
      if (block) return JSON.stringify(block.input ?? {}, null, 2);
    }
  }

  if (node.type === 'tool_result') {
    const content = node.data?.message?.content ?? node.data?.content;
    if (Array.isArray(content)) {
      const block = content.find((b) => b.type === 'tool_result');
      if (block) {
        if (typeof block.content === 'string') return block.content;
        if (Array.isArray(block.content)) {
          const tb = block.content.find((c) => c.type === 'text');
          if (tb?.text) return tb.text;
        }
      }
    }
    if (node.data?.toolUseResult) {
      const r = node.data.toolUseResult;
      return typeof r === 'string' ? r : r.stdout ?? JSON.stringify(r);
    }
  }

  if (node.type === 'result') return node.data?.result ?? node.label;

  return node.label;
}

// ─── Individual card ────────────────────────────────────────────────────────
function AgentCard({ node, index, isSelected, onSelect }) {
  const cfg = getConfig(node.type);
  const IconComp = cfg.icon;
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);

  const bodyText = extractBodyText(node);
  const truncated = bodyText?.length > 220;
  const displayText = expanded ? bodyText : bodyText?.slice(0, 220);

  const usage = node.data?.message?.usage ?? node.data?.usage ?? null;
  const toolName = node.meta?.toolName ?? null;
  const cost = node.meta?.costUsd ?? null;
  const durationMs = node.meta?.durationMs ?? null;
  const model = node.meta?.model ?? null;

  // Staggered entrance delay
  const delay = `${Math.min(index * 55, 700)}ms`;

  return (
    <div
      ref={cardRef}
      className="agent-card-anim"
      style={{ animationDelay: delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={() => onSelect(node)}
        className={`
          relative rounded-2xl border cursor-pointer select-none
          transition-all duration-300 ease-out overflow-hidden
          ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''}
        `}
        style={{
          background: isSelected
            ? `linear-gradient(135deg, #13131f 0%, #16162a 100%)`
            : hovered
            ? `linear-gradient(135deg, #131320 0%, #141428 100%)`
            : '#111118',
          borderColor: isSelected
            ? cfg.accent
            : hovered
            ? `${cfg.accent}66`
            : '#222230',
          boxShadow: isSelected
            ? `0 0 0 2px ${cfg.accent}40, 0 8px 40px ${cfg.glow}, 0 0 60px ${cfg.glow}`
            : hovered
            ? `0 4px 30px ${cfg.glow}, 0 0 40px ${cfg.glow}`
            : '0 2px 12px rgba(0,0,0,0.3)',
          transform: hovered && !isSelected ? 'translateY(-3px)' : 'translateY(0)',
          ringColor: cfg.accent,
        }}
      >
        {/* Top shimmer on hover */}
        <div
          className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.accent}80, transparent)`,
            opacity: hovered || isSelected ? 1 : 0,
          }}
        />

        <div className="p-4">
          {/* ── Header row ── */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Icon circle */}
              <div
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${cfg.accent}22, ${cfg.accent}0a)`,
                  border: `1px solid ${cfg.accent}30`,
                  boxShadow: (hovered || isSelected) ? `0 0 14px ${cfg.accent}40` : 'none',
                }}
              >
                <IconComp color={cfg.accent} />
              </div>

              {/* Type badge */}
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: `${cfg.accent}18`,
                  color: cfg.accent,
                  border: `1px solid ${cfg.accent}28`,
                }}
              >
                {node.type}
              </span>
            </div>

            {/* Timestamp */}
            {formatTs(node.timestamp) && (
              <span className="text-[10px] text-gray-600 font-mono shrink-0 mt-0.5">
                {formatTs(node.timestamp)}
              </span>
            )}
          </div>

          {/* ── Body text ── */}
          {displayText && (
            <div className="mb-3">
              <p
                className="text-xs leading-relaxed"
                style={{ color: isSelected ? '#d4d4e4' : '#9494aa' }}
              >
                {displayText}
                {truncated && !expanded && (
                  <span
                    className="ml-1 cursor-pointer font-medium transition-colors"
                    style={{ color: cfg.accent }}
                    onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                  >
                    show more
                  </span>
                )}
                {expanded && (
                  <span
                    className="ml-1 cursor-pointer font-medium transition-colors"
                    style={{ color: cfg.accent }}
                    onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                  >
                    show less
                  </span>
                )}
              </p>
            </div>
          )}

          {/* ── Divider ── */}
          <div
            className="mb-3 h-px transition-all duration-300"
            style={{
              background: (hovered || isSelected)
                ? `linear-gradient(90deg, ${cfg.accent}30, transparent)`
                : '#1e1e2e',
            }}
          />

          {/* ── Metadata chips row ── */}
          <div className="flex flex-wrap gap-1.5">
            {model && (
              <MetaChip accent={cfg.accent}>
                <span className="opacity-60">model</span> {model.replace('claude-', '').slice(0, 18)}
              </MetaChip>
            )}
            {toolName && (
              <MetaChip accent={cfg.accent}>
                <span className="opacity-60">tool</span> {toolName}
              </MetaChip>
            )}
            {usage?.input_tokens !== undefined && (
              <MetaChip accent={cfg.accent}>
                ↑{usage.input_tokens.toLocaleString()} / ↓{usage.output_tokens?.toLocaleString() ?? 0}
              </MetaChip>
            )}
            {usage?.cache_read_input_tokens > 0 && (
              <MetaChip accent={cfg.accent}>
                <span className="opacity-60">cache</span> {usage.cache_read_input_tokens.toLocaleString()}
              </MetaChip>
            )}
            {durationMs !== undefined && (
              <MetaChip accent={cfg.accent}>
                {durationMs >= 1000
                  ? `${(durationMs / 1000).toFixed(1)}s`
                  : `${durationMs}ms`}
              </MetaChip>
            )}
            {cost !== undefined && (
              <MetaChip accent={cfg.accent}>
                ${Number(cost).toFixed(4)}
              </MetaChip>
            )}
            {node.meta?.numTurns !== undefined && (
              <MetaChip accent={cfg.accent}>
                {node.meta.numTurns} turns
              </MetaChip>
            )}
            {node.meta?.gitBranch && (
              <MetaChip accent={cfg.accent}>
                <span className="opacity-60">⎇</span> {node.meta.gitBranch}
              </MetaChip>
            )}
          </div>
        </div>

        {/* Selected indicator bar on left edge */}
        <div
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-300"
          style={{
            background: cfg.accent,
            opacity: isSelected ? 1 : 0,
            transform: isSelected ? 'scaleY(1)' : 'scaleY(0)',
          }}
        />
      </div>
    </div>
  );
}

function MetaChip({ accent, children }) {
  return (
    <span
      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
      style={{
        background: `${accent}10`,
        border: `1px solid ${accent}20`,
        color: `${accent}cc`,
      }}
    >
      {children}
    </span>
  );
}

// ─── Group header ────────────────────────────────────────────────────────────
function GroupHeader({ type, count, accent }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
      <div className="h-px flex-1" style={{ background: `${accent}25` }} />
      <span
        className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
        style={{
          color: accent,
          background: `${accent}12`,
          border: `1px solid ${accent}25`,
        }}
      >
        {type} · {count}
      </span>
      <div className="h-px flex-1" style={{ background: `${accent}25` }} />
    </div>
  );
}

// ─── Main CardView ────────────────────────────────────────────────────────────
export default function CardView() {
  const { nodes, selectedNode, setSelectedNode } = useAgentStore();
  const [filter, setFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none'); // none | type
  const scrollRef = useRef(null);

  // Available type filters
  const typesPresent = [...new Set(nodes.map((n) => n.type))];

  const filtered = filter === 'all'
    ? nodes
    : nodes.filter((n) => n.type === filter);

  // Group by type
  const grouped = (() => {
    if (groupBy !== 'type') return null;
    const map = new Map();
    for (const node of filtered) {
      if (!map.has(node.type)) map.set(node.type, []);
      map.get(node.type).push(node);
    }
    return map;
  })();

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
        <div className="text-4xl">🃏</div>
        <p className="text-sm">No events to display</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090c]">
      {/* ── Filter bar ── */}
      <div className="shrink-0 px-4 py-2.5 border-b border-[#1a1a28] flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-200"
          style={{
            background: filter === 'all' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            color: filter === 'all' ? '#818cf8' : '#44445a',
            border: filter === 'all' ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
          }}
        >
          All ({nodes.length})
        </button>

        {typesPresent.map((type) => {
          const cfg = getConfig(type);
          const count = nodes.filter((n) => n.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-200"
              style={{
                background: filter === type ? `${cfg.accent}20` : 'rgba(255,255,255,0.04)',
                color: filter === type ? cfg.accent : '#44445a',
                border: filter === type ? `1px solid ${cfg.accent}40` : '1px solid transparent',
              }}
            >
              {type} ({count})
            </button>
          );
        })}

        {/* Group toggle */}
        <button
          onClick={() => setGroupBy(g => g === 'type' ? 'none' : 'type')}
          className="ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-200"
          style={{
            background: groupBy === 'type' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            color: groupBy === 'type' ? '#818cf8' : '#44445a',
            border: groupBy === 'type' ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Group by type
        </button>
      </div>

      {/* ── Card grid ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a3e transparent' }}
      >
        {grouped ? (
          // Grouped view
          Array.from(grouped.entries()).map(([type, typeNodes]) => {
            const cfg = getConfig(type);
            return (
              <div key={type}>
                <GroupHeader type={type} count={typeNodes.length} accent={cfg.accent} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {typeNodes.map((node, i) => (
                    <AgentCard
                      key={node.id}
                      node={node}
                      index={i}
                      isSelected={selectedNode?.id === node.id}
                      onSelect={setSelectedNode}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Flat grid
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filtered.map((node, i) => (
              <AgentCard
                key={node.id}
                node={node}
                index={i}
                isSelected={selectedNode?.id === node.id}
                onSelect={setSelectedNode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
