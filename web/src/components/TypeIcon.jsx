import * as Phosphor from '@phosphor-icons/react';

/** Renders a small Phosphor icon for each agent event type. */
export default function TypeIcon({ type, color = 'currentColor', size = 18 }) {
  const iconNameByType = {
    user: 'UserCircleIcon',
    thinking: 'BrainIcon',
    tool_use: 'WrenchIcon',
    tool_result: 'CheckCircleIcon',
    system: 'CpuIcon',
    progress: 'ClockIcon',
    result: 'ShieldCheckIcon',
    'queue-operation': 'RowsIcon',
  };

  const Icon = Phosphor[iconNameByType[type]] || Phosphor.RobotIcon;
  return <Icon size={size} color={color} weight="duotone" />;
}
