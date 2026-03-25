/** Renders a small SVG icon for each agent event type. */
export default function TypeIcon({ type, color = 'currentColor', size = 18 }) {
  const s = { width: size, height: size };
  const p = { fill: 'none', stroke: color, strokeWidth: 1.6 };

  switch (type) {
    case 'user': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    );
    case 'thinking': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
        <path d="M9 17v1a3 3 0 006 0v-1" />
      </svg>
    );
    case 'tool_use': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    );
    case 'tool_result': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
    case 'system': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="8" y="8" width="8" height="8" rx="1" />
        <line x1="4" y1="12" x2="2" y2="12" strokeLinecap="round" />
        <line x1="22" y1="12" x2="20" y2="12" strokeLinecap="round" />
      </svg>
    );
    case 'progress': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
        <path d="M12 7v5l3 3" strokeLinecap="round" />
      </svg>
    );
    case 'result': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
    case 'queue-operation': return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <rect x="3" y="4" width="18" height="3.5" rx="1" />
        <rect x="3" y="10" width="18" height="3.5" rx="1" />
        <rect x="3" y="16" width="12" height="3.5" rx="1" />
      </svg>
    );
    default: return (
      <svg {...s} viewBox="0 0 24 24" {...p}>
        <rect x="3" y="8" width="18" height="13" rx="3" />
        <path d="M8 8V6a4 4 0 018 0v2" />
        <circle cx="9" cy="14" r="1.5" fill={color} stroke="none" />
        <circle cx="15" cy="14" r="1.5" fill={color} stroke="none" />
        <path d="M9 17.5h6" strokeLinecap="round" />
      </svg>
    );
  }
}
