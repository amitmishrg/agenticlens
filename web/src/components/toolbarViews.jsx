import { ChartLineUpIcon, ListBulletsIcon, ShareNetworkIcon } from '@phosphor-icons/react';

/** View definitions for the Toolbar — each has an id, label, and Phosphor icon. */
export const VIEWS = [
  {
    id: 'flow',
    label: 'Flow',
    icon: <ShareNetworkIcon size={13} weight="duotone" />,
  },
  {
    id: 'tree',
    label: 'Tree',
    icon: <ListBulletsIcon size={13} weight="duotone" />,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <ChartLineUpIcon size={13} weight="duotone" />,
  },
];
