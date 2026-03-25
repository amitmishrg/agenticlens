import { ChartLineUpIcon, ListBulletsIcon, ShareNetworkIcon } from '@phosphor-icons/react';

/** View definitions for the Toolbar — each has an id, label, and Phosphor icon. */
export const VIEWS = [
  {
    id: 'flow',
    label: 'Flow',
    icon: <ShareNetworkIcon size={16} weight="duotone" className="shrink-0" />,
  },
  {
    id: 'tree',
    label: 'Tree',
    icon: <ListBulletsIcon size={16} weight="duotone" className="shrink-0" />,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <ChartLineUpIcon size={16} weight="duotone" className="shrink-0" />,
  },
];
