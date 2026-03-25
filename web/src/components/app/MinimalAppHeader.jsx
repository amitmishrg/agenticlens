import BrandMark from '@/components/BrandMark';
import ThemeToggle from '@/components/ThemeToggle';

/** Shown when there is no session data yet — brand + theme only. */
export default function MinimalAppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-app-chrome-border px-4 backdrop-blur-xl backdrop-saturate-150 sm:px-6 bg-[var(--app-toolbar-scrim)] supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--app-bg)_88%,transparent)] shadow-[0_1px_0_0_color-mix(in_oklab,var(--app-fg)_6%,transparent)]">
      <div className="flex items-center gap-3">
        <BrandMark size="md" className="rounded-xl" />
        <span className="text-base font-semibold leading-none tracking-tight text-app-fg">AgenticLens</span>
      </div>
      <ThemeToggle />
    </header>
  );
}
