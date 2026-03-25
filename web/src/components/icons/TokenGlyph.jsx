import { CoinsIcon } from '@phosphor-icons/react';

/** Small icon for token counts (Phosphor Coin). */
export default function TokenGlyph({
  size = 13,
  color = 'currentColor',
  weight = 'duotone',
  style,
  className,
}) {
  return (
    <CoinsIcon
      size={size}
      color={color}
      weight={weight}
      className={className}
      style={{ flexShrink: 0, verticalAlign: 'middle', ...style }}
      aria-hidden
    />
  );
}
