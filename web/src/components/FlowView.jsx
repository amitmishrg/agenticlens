/**
 * FlowView — renders agent events as a pannable, zoomable tree graph
 * with animated SVG connection lines showing data flow step-by-step.
 *
 * Layout:  top-to-bottom tree (children below parents)
 * Controls: scroll-wheel to zoom, drag to pan, "Fit" button to reset
 */
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import useAgentStore from '../store/useAgentStore';

// ─── Layout constants ────────────────────────────────────────────────────────
const CW  = 248;   // card width
const CH  = 136;   // card layout height (cards may visually overflow, layout uses this)
const HG  = 64;    // horizontal gap between sibling subtrees
const VG  = 96;    // vertical gap between levels
const PAD = 80;    // canvas edge padding

// ─── Type → accent color ─────────────────────────────────────────────────────
const ACCENTS = {
  user:              '#6366f1',
  assistant:         '#22c55e',
  thinking:          '#eab308',
  tool_use:          '#f97316',
  tool_result:       '#14b8a6',
  system:            '#a855f7',
  progress:          '#06b6d4',
  result:            '#94a3b8',
  'queue-operation': '#ec4899',
  'last-prompt':     '#818cf8',
};
function getAccent(type) { return ACCENTS[type] ?? '#6b7280'; }

// ─── Compact SVG Icons ────────────────────────────────────────────────────────
function TypeIcon({ type, color, size = 16 }) {
  const s = { width: size, height: size };
  switch (type) {
    case 'user': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
      </svg>
    );
    case 'thinking': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/>
        <path d="M9 17v1a3 3 0 006 0v-1"/>
      </svg>
    );
    case 'tool_use': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    );
    case 'tool_result': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9"/>
      </svg>
    );
    case 'system': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <rect x="8" y="8" width="8" height="8" rx="1"/>
        <line x1="4" y1="12" x2="2" y2="12" strokeLinecap="round"/>
        <line x1="22" y1="12" x2="20" y2="12" strokeLinecap="round"/>
      </svg>
    );
    case 'progress': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <circle cx="12" cy="12" r="9" strokeDasharray="4 2"/>
        <path d="M12 7v5l3 3" strokeLinecap="round"/>
      </svg>
    );
    case 'result': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    );
    case 'queue-operation': return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <rect x="3" y="4" width="18" height="3.5" rx="1"/>
        <rect x="3" y="10" width="18" height="3.5" rx="1"/>
        <rect x="3" y="16" width="12" height="3.5" rx="1"/>
      </svg>
    );
    default: return (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
        <rect x="3" y="8" width="18" height="13" rx="3"/>
        <path d="M8 8V6a4 4 0 018 0v2"/>
        <circle cx="9" cy="14" r="1.5" fill={color} stroke="none"/>
        <circle cx="15" cy="14" r="1.5" fill={color} stroke="none"/>
        <path d="M9 17.5h6" strokeLinecap="round"/>
      </svg>
    );
  }
}

// ─── Tree layout ──────────────────────────────────────────────────────────────
function computeLayout(roots) {
  const widthCache = new Map();

  function subtreeW(node) {
    if (widthCache.has(node.id)) return widthCache.get(node.id);
    const kids = node.children ?? [];
    const w = kids.length === 0
      ? CW
      : Math.max(CW, kids.reduce((s, k) => s + subtreeW(k), 0) + HG * (kids.length - 1));
    widthCache.set(node.id, w);
    return w;
  }

  const pos = new Map(); // id → { x, y }

  function place(node, cx, y) {
    pos.set(node.id, { x: Math.round(cx - CW / 2), y: Math.round(y) });
    const kids = node.children ?? [];
    if (kids.length === 0) return;
    const totalW = kids.reduce((s, k) => s + subtreeW(k), 0) + HG * (kids.length - 1);
    let kx = cx - totalW / 2;
    for (const kid of kids) {
      const kw = subtreeW(kid);
      place(kid, kx + kw / 2, y + CH + VG);
      kx += kw + HG;
    }
  }

  let rx = PAD;
  for (const root of roots) {
    const rw = subtreeW(root);
    place(root, rx + rw / 2, PAD);
    rx += rw + HG;
  }
  return pos;
}

function collectEdges(roots) {
  const edges = [];
  function walk(node) {
    for (const child of node.children ?? []) {
      edges.push({ from: node, to: child });
      walk(child);
    }
  }
  roots.forEach(walk);
  return edges;
}

function flattenTree(roots) {
  const all = [];
  function walk(n) { all.push(n); (n.children ?? []).forEach(walk); }
  roots.forEach(walk);
  return all;
}

// ─── Bezier path between two points ──────────────────────────────────────────
function makePath(sx, sy, tx, ty) {
  const my = sy + (ty - sy) * 0.5;
  return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
}

// ─── FlowCard ─────────────────────────────────────────────────────────────────
function FlowCard({ node, x, y, isSelected, onSelect, index, zoom }) {
  const [hovered, setHovered] = useState(false);
  const ac = getAccent(node.type);

  // Short body text for the card
  const bodyText = (() => {
    const content = node.data?.message?.content ?? node.data?.content;
    if (Array.isArray(content)) {
      const tb = content.find((b) => b.type === 'text');
      if (tb?.text) return tb.text.slice(0, 100) + (tb.text.length > 100 ? '…' : '');
      const thb = content.find((b) => b.type === 'thinking');
      if (thb?.thinking) return thb.thinking.slice(0, 100) + '…';
      const tub = content.find((b) => b.type === 'tool_use');
      if (tub) return `${tub.name}(${JSON.stringify(tub.input ?? {}).slice(0, 60)}…)`;
      const trb = content.find((b) => b.type === 'tool_result');
      if (trb) {
        const t = typeof trb.content === 'string' ? trb.content
          : Array.isArray(trb.content) ? trb.content.find((c) => c.type === 'text')?.text
          : null;
        return t ? t.slice(0, 100) : 'Tool result';
      }
    }
    if (node.type === 'result' && node.data?.result) return node.data.result.slice(0, 100) + '…';
    return node.label;
  })();

  const ts = (() => {
    if (!node.timestamp) return null;
    const d = new Date(node.timestamp);
    return isNaN(d) ? null : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  })();

  const usage = node.data?.message?.usage ?? node.data?.usage;
  const toolName = node.meta?.toolName;
  const cost = node.meta?.costUsd;

  const animDelay = `${Math.min(index * 60, 900)}ms`;

  return (
    <div
      className="flow-card-anim"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: CW,
        animationDelay: animDelay,
        zIndex: isSelected ? 10 : (hovered ? 5 : 1),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(node); }}
    >
      <div
        style={{
          background: isSelected
            ? `linear-gradient(145deg, #141428 0%, #18183a 100%)`
            : hovered
            ? `linear-gradient(145deg, #121220 0%, #151530 100%)`
            : '#0f0f18',
          border: `1.5px solid ${isSelected ? ac : hovered ? `${ac}55` : '#1e1e2e'}`,
          borderRadius: 16,
          padding: '14px 16px',
          cursor: 'pointer',
          transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
          boxShadow: isSelected
            ? `0 0 0 2px ${ac}30, 0 0 40px ${ac}25, 0 8px 32px rgba(0,0,0,0.6)`
            : hovered
            ? `0 0 25px ${ac}18, 0 6px 24px rgba(0,0,0,0.5)`
            : '0 2px 12px rgba(0,0,0,0.4)',
          transform: hovered && !isSelected ? 'translateY(-2px)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top shimmer */}
        <div style={{
          position: 'absolute', inset: 0, top: 0, height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${ac}70 50%, transparent 100%)`,
          opacity: hovered || isSelected ? 1 : 0,
          transition: 'opacity 0.25s',
        }} />

        {/* Selected left bar */}
        <div style={{
          position: 'absolute', left: 0, top: 12, bottom: 12, width: 2.5,
          borderRadius: 2, background: ac,
          opacity: isSelected ? 1 : 0,
          transform: isSelected ? 'scaleY(1)' : 'scaleY(0)',
          transition: 'opacity 0.2s, transform 0.2s',
          transformOrigin: 'center',
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Icon */}
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: `${ac}14`, border: `1px solid ${ac}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: (hovered || isSelected) ? `0 0 12px ${ac}35` : 'none',
              transition: 'box-shadow 0.25s',
            }}>
              <TypeIcon type={node.type} color={ac} size={15} />
            </div>
            {/* Badge */}
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 100,
              color: ac, background: `${ac}18`, border: `1px solid ${ac}25`,
            }}>
              {node.type}
            </span>
          </div>
          {ts && (
            <span style={{ fontSize: 9, color: '#33334a', fontFamily: 'monospace', flexShrink: 0 }}>
              {ts}
            </span>
          )}
        </div>

        {/* Body text */}
        <p style={{
          fontSize: 11, lineHeight: 1.55,
          color: isSelected ? '#c0c0d8' : '#5a5a72',
          marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.2s',
        }}>
          {bodyText}
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: (hovered || isSelected) ? `linear-gradient(90deg, ${ac}25, transparent)` : '#1a1a28',
          marginBottom: 10,
          transition: 'background 0.25s',
        }} />

        {/* Meta chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {usage?.input_tokens !== undefined && (
            <Chip ac={ac}>↑{usage.input_tokens} / ↓{usage.output_tokens ?? 0}</Chip>
          )}
          {toolName && <Chip ac={ac}>🔧 {toolName}</Chip>}
          {cost !== undefined && <Chip ac={ac}>${Number(cost).toFixed(4)}</Chip>}
          {node.meta?.numTurns !== undefined && <Chip ac={ac}>{node.meta.numTurns} turns</Chip>}
          {node.meta?.durationMs !== undefined && (
            <Chip ac={ac}>{node.meta.durationMs >= 1000 ? `${(node.meta.durationMs / 1000).toFixed(1)}s` : `${node.meta.durationMs}ms`}</Chip>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ ac, children }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: 'monospace',
      padding: '2px 6px', borderRadius: 100,
      background: `${ac}10`, border: `1px solid ${ac}1e`, color: `${ac}bb`,
    }}>
      {children}
    </span>
  );
}

// ─── Connection line ──────────────────────────────────────────────────────────
function EdgeLine({ from, to, positions, edgeIndex, totalEdges }) {
  const fp = positions.get(from.id);
  const tp = positions.get(to.id);
  if (!fp || !tp) return null;

  const sx = fp.x + CW / 2;
  const sy = fp.y + CH;
  const tx = tp.x + CW / 2;
  const ty = tp.y;
  const d  = makePath(sx, sy, tx, ty);

  const ac    = getAccent(from.type);
  const pathId = `fp-${from.id}-${to.id}`.replace(/[^a-z0-9-]/gi, '_');
  // Stagger the dot travel duration slightly per edge
  const dur   = (1.6 + (edgeIndex % 8) * 0.12).toFixed(2);
  const dash  = `${6 + (edgeIndex % 3) * 2} ${10 + (edgeIndex % 3) * 3}`;

  return (
    <g>
      {/* Hidden path for animateMotion reference */}
      <path id={pathId} d={d} fill="none" stroke="none" />

      {/* Glow halo */}
      <path d={d} stroke={ac} strokeWidth={8} fill="none" opacity={0.06} filter="url(#edge-glow)" />

      {/* Static base path */}
      <path d={d} stroke={ac} strokeWidth={1.2} fill="none" opacity={0.18} />

      {/* Animated flowing dashes */}
      <path
        d={d}
        stroke={ac}
        strokeWidth={1.5}
        fill="none"
        opacity={0.65}
        strokeDasharray={dash}
        style={{
          animation: `flowDash 1.8s linear infinite`,
          animationDelay: `${(edgeIndex * 0.11) % 1.8}s`,
        }}
      />

      {/* Traveling dot */}
      <circle r={3.5} fill={ac} opacity={0.95} filter="url(#dot-glow)">
        <animateMotion
          dur={`${dur}s`}
          repeatCount="indefinite"
          keyPoints="0;1"
          keyTimes="0;1"
          calcMode="linear"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>

      {/* Secondary smaller dot with offset */}
      <circle r={2} fill={ac} opacity={0.5}>
        <animateMotion
          dur={`${dur}s`}
          begin={`${(parseFloat(dur) * 0.5).toFixed(2)}s`}
          repeatCount="indefinite"
          keyPoints="0;1"
          keyTimes="0;1"
          calcMode="linear"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </g>
  );
}

// ─── Zoom controls ────────────────────────────────────────────────────────────
function ZoomControls({ zoom, onZoom, onReset, onFitAll, nodeCount }) {
  const btnStyle = {
    height: 24, borderRadius: 6, background: '#1a1a28',
    border: '1px solid #2a2a38', color: '#6b6b80', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s', padding: '0 8px',
    fontSize: 11, fontWeight: 600,
  };
  const hover = { background: '#252535', color: '#9494b0' };

  return (
    <div
      style={{
        position: 'absolute', top: 12, right: 12, zIndex: 30,
        display: 'flex', alignItems: 'center', gap: 5,
        background: '#111118', border: '1px solid #1e1e2e',
        borderRadius: 12, padding: '6px 10px',
      }}
    >
      {/* − */}
      <button style={{ ...btnStyle, width: 24, fontSize: 14 }}
        onClick={() => onZoom(-0.1)}
        onMouseEnter={e => Object.assign(e.currentTarget.style, hover)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background: '#1a1a28', color: '#6b6b80' })}
      >−</button>

      {/* % readout — click to reset to 100% */}
      <button
        title="Reset to 100%"
        onClick={onReset}
        style={{ ...btnStyle, minWidth: 40, textAlign: 'center', fontFamily: 'monospace', fontSize: 10 }}
        onMouseEnter={e => Object.assign(e.currentTarget.style, hover)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background: '#1a1a28', color: '#6b6b80' })}
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* + */}
      <button style={{ ...btnStyle, width: 24, fontSize: 14 }}
        onClick={() => onZoom(+0.1)}
        onMouseEnter={e => Object.assign(e.currentTarget.style, hover)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background: '#1a1a28', color: '#6b6b80' })}
      >+</button>

      <div style={{ width: 1, height: 16, background: '#1e1e2e' }} />

      {/* Fit all — zoom out to see entire tree */}
      <button style={btnStyle}
        onClick={onFitAll}
        onMouseEnter={e => Object.assign(e.currentTarget.style, hover)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background: '#1a1a28', color: '#6b6b80' })}
      >Fit all</button>

      <div style={{ width: 1, height: 16, background: '#1e1e2e' }} />
      <span style={{ fontSize: 10, color: '#2a2a3e', fontFamily: 'monospace' }}>{nodeCount} nodes</span>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend({ types }) {
  if (!types.length) return null;
  return (
    <div
      style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 30,
        background: '#111118', border: '1px solid #1e1e2e',
        borderRadius: 12, padding: '8px 12px',
        display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 360,
      }}
    >
      {types.map((type) => {
        const ac = getAccent(type);
        return (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: 50, background: ac }} />
            <span style={{ fontSize: 9, color: '#44445a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {type}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#33334a' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111118', border: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2a3e" strokeWidth="1.5">
          <circle cx="5" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="12" r="2"/>
          <line x1="7" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="17" y2="12"/>
          <line x1="12" y1="8" x2="5" y2="11"/><line x1="12" y1="8" x2="19" y2="11"/>
        </svg>
      </div>
      <p style={{ fontSize: 12 }}>No events to display</p>
    </div>
  );
}

// ─── Main FlowView ────────────────────────────────────────────────────────────
export default function FlowView() {
  const { tree, selectedNode, setSelectedNode } = useAgentStore();

  const [zoom, setZoom]     = useState(1.0);
  const [pan, setPan]       = useState({ x: 0, y: 0 });
  const dragging            = useRef(null);
  const containerRef        = useRef(null);
  const autoFitted          = useRef(false);

  // Memoised layout computation
  const positions = useMemo(() => computeLayout(tree), [tree]);
  const edges     = useMemo(() => collectEdges(tree), [tree]);
  const allNodes  = useMemo(() => flattenTree(tree), [tree]);
  const typeSet   = useMemo(() => [...new Set(allNodes.map((n) => n.type))], [allNodes]);

  // Canvas content bounding box
  const { canvasW, canvasH } = useMemo(() => {
    let maxX = 0, maxY = 0;
    for (const [, p] of positions) {
      maxX = Math.max(maxX, p.x + CW + PAD);
      maxY = Math.max(maxY, p.y + CH + PAD);
    }
    return { canvasW: Math.max(maxX, 400), canvasH: Math.max(maxY, 300) };
  }, [positions]);

  // ── Reset to 100% centered on top of tree ────────────────────────────────
  const fitToView = useCallback(() => {
    const el = containerRef.current;
    if (!el || canvasW === 0) return;
    const { clientWidth: cw } = el;
    setZoom(1.0);
    // Center horizontally; always start from the top
    setPan({
      x: Math.max((cw - canvasW) / 2, PAD),
      y: PAD,
    });
  }, [canvasW]);

  // ── Fit all (zoom-to-fit) — used when user explicitly wants to see everything
  const fitAll = useCallback(() => {
    const el = containerRef.current;
    if (!el || canvasW === 0) return;
    const { clientWidth: cw, clientHeight: ch } = el;
    const z = Math.min((cw - 40) / canvasW, (ch - 40) / canvasH, 1.0);
    setZoom(Math.max(z, 0.15));
    setPan({ x: Math.max((cw - canvasW * z) / 2, 20), y: 20 });
  }, [canvasW, canvasH]);

  // Auto-position on first load at 100%
  useEffect(() => {
    if (!autoFitted.current && canvasW > 0) {
      autoFitted.current = true;
      requestAnimationFrame(fitToView);
    }
  }, [canvasW, fitToView]);

  // ── Wheel zoom ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom((z) => Math.max(0.2, Math.min(2.5, z + delta)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // ── Pan (drag) ───────────────────────────────────────────────────────────
  function onMouseDown(e) {
    if (e.button !== 0) return;
    dragging.current = { sx: e.clientX - pan.x, sy: e.clientY - pan.y };
  }
  function onMouseMove(e) {
    if (!dragging.current) return;
    setPan({ x: e.clientX - dragging.current.sx, y: e.clientY - dragging.current.sy });
  }
  function onMouseUp() { dragging.current = null; }

  if (allNodes.length === 0) return <EmptyState />;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        background: '#09090c',
        cursor: dragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Background dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #1e1e2e 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.6,
      }} />

      {/* Zoom / controls overlay */}
      <ZoomControls
        zoom={zoom}
        onZoom={(d) => setZoom((z) => Math.max(0.2, Math.min(2.5, z + d)))}
        onReset={fitToView}
        onFitAll={fitAll}
        nodeCount={allNodes.length}
      />

      {/* Legend */}
      <Legend types={typeSet} />

      {/* ── Transformed canvas ── */}
      <div
        style={{
          position: 'absolute',
          transformOrigin: '0 0',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: canvasW,
          height: canvasH,
        }}
      >
        {/* ── SVG edges ── */}
        <svg
          style={{
            position: 'absolute', inset: 0,
            width: canvasW, height: canvasH,
            overflow: 'visible', pointerEvents: 'none',
          }}
        >
          <defs>
            <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {edges.map((edge, i) => (
            <EdgeLine
              key={`${edge.from.id}→${edge.to.id}`}
              from={edge.from}
              to={edge.to}
              positions={positions}
              edgeIndex={i}
              totalEdges={edges.length}
            />
          ))}
        </svg>

        {/* ── Cards ── */}
        {allNodes.map((node, i) => {
          const p = positions.get(node.id);
          if (!p) return null;
          return (
            <FlowCard
              key={node.id}
              node={node}
              x={p.x}
              y={p.y}
              isSelected={selectedNode?.id === node.id}
              onSelect={setSelectedNode}
              index={i}
              zoom={zoom}
            />
          );
        })}
      </div>
    </div>
  );
}
