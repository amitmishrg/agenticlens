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
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center rounded-md p-1.5 transition-colors border border-app-border bg-app-surface-2 text-app-fg-muted hover:text-app-accent-fg hover:border-app-border-strong"
    >
      {isDark ? <SunIcon size={18} weight="duotone" /> : <MoonIcon size={18} weight="duotone" />}
    </button>
  );
}
