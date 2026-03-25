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
      className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-chrome-border bg-app-chrome-well-bg text-app-fg-muted shadow-sm transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out hover:text-app-accent-fg hover:border-app-accent-soft-border hover:bg-[var(--app-accent-soft-bg)]/30 hover:shadow-md active:scale-95 outline-offset-[3px]"
    >
      <span
        className="flex items-center justify-center transition-transform duration-300 ease-out group-hover:rotate-12 motion-reduce:group-hover:rotate-0"
        aria-hidden
      >
        {isDark ? (
          <SunIcon size={16} weight="duotone" className="shrink-0" />
        ) : (
          <MoonIcon size={16} weight="duotone" className="shrink-0" />
        )}
      </span>
    </button>
  );
}
