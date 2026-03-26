const LOGO_SRC = 'https://agenticlens-assets.vercel.app/agenticlens-logo.png';

const sizeMap = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-12 w-12 sm:h-14 sm:w-14',
  xl: 'h-16 w-16 sm:h-20 sm:w-20',
};

export default function BrandMark({ size = 'md', className = '', alt = 'AgenticLens' }) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      width={512}
      height={512}
      decoding="async"
      draggable={false}
      className={`shrink-0 rounded-lg object-cover ${sizeMap[size] ?? sizeMap.md} ${className}`}
    />
  );
}
