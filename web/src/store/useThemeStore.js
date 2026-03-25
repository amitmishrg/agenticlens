import { create } from 'zustand';

const THEME_KEY = 'agenticlens-theme';

/** @returns {'light' | 'dark'} */
export function getStoredTheme() {
  if (typeof window === 'undefined') return 'dark';
  const v = localStorage.getItem(THEME_KEY);
  return v === 'light' || v === 'dark' ? v : 'dark';
}

const THEME_COLOR = { dark: '#0a0a0e', light: '#f8fafc' };

export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[theme] ?? THEME_COLOR.dark);
}

export const useThemeStore = create((set) => ({
  theme: getStoredTheme(),

  setTheme: (theme) => {
    if (theme !== 'light' && theme !== 'dark') return;
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToDocument(theme);
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyThemeToDocument(next);
      return { theme: next };
    }),
}));
