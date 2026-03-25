import { CodeIcon } from '@phosphor-icons/react';

/** Phosphor “token count” affordance — replaces ad-hoc emoji. See https://phosphoricons.com/ */
export default function TokenGlyph({ size = 13, color = 'currentColor', weight = 'duotone', style, className }) {
  return (
    <CodeIcon
      size={size}
      color={color}
      weight={weight}
      className={className}
      style={{ flexShrink: 0, verticalAlign: 'middle', ...style }}
      aria-hidden
    />
  );
}
