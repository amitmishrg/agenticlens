import {
  BrainIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuIcon,
  RobotIcon,
  RowsIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@phosphor-icons/react';

/** Renders a small Phosphor icon for each agent event type. */
export default function TypeIcon({ type, color = 'currentColor', size = 18 }) {
  const iconByType = {
    user: UserCircleIcon,
    thinking: BrainIcon,
    tool_use: WrenchIcon,
    tool_result: CheckCircleIcon,
    system: CpuIcon,
    progress: ClockIcon,
    result: ShieldCheckIcon,
    'queue-operation': RowsIcon,
  };

  const Icon = iconByType[type] || RobotIcon;
  return <Icon size={size} color={color} weight="duotone" />;
}
