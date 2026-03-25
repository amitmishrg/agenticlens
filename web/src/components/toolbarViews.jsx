/** View definitions for the Toolbar — each has an id, label, and SVG icon. */
export const VIEWS = [
  {
    id: 'flow',
    label: 'Flow',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="2.5" r="1.5" />
        <circle cx="3" cy="13"  r="1.5" />
        <circle cx="13" cy="13" r="1.5" />
        <path d="M8 4C8 7 3 8 3 11.5"   strokeLinecap="round" />
        <path d="M8 4C8 7 13 8 13 11.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'tree',
    label: 'Tree',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="2"  r="1.5" />
        <circle cx="3" cy="12" r="1.5" />
        <circle cx="13" cy="12" r="1.5" />
        <line x1="8"  y1="3.5" x2="8"  y2="7" />
        <line x1="8"  y1="7"   x2="3"  y2="10.5" />
        <line x1="8"  y1="7"   x2="13" y2="10.5" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="2" y1="4"  x2="14" y2="4"  strokeLinecap="round" />
        <line x1="2" y1="8"  x2="10" y2="8"  strokeLinecap="round" />
        <line x1="2" y1="12" x2="12" y2="12" strokeLinecap="round" />
        <circle cx="14" cy="4"  r="1.5" fill="currentColor" stroke="none" />
        <circle cx="10" cy="8"  r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];
