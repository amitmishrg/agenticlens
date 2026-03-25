import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useThemeStore } from '@/store/useThemeStore';

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group flex items-center justify-center min-w-9 min-h-9 rounded-xl p-2 transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out border border-app-border bg-app-surface/90 text-app-fg-muted shadow-sm hover:text-app-accent-fg hover:border-app-accent-soft-border hover:bg-[var(--app-accent-soft-bg)]/30 hover:shadow-md active:scale-95 [outline-offset:3px]"
    >
      <span
        className="transition-transform duration-300 ease-out group-hover:rotate-12 motion-reduce:group-hover:rotate-0"
        aria-hidden
      >
        {isDark ? <SunIcon size={18} weight="duotone" /> : <MoonIcon size={18} weight="duotone" />}
      </span>
    </button>
  );
}
