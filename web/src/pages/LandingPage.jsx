import {
  ArrowRightIcon,
  ChartLineUpIcon,
  ListBulletsIcon,
  LockKeyIcon,
  PlayIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react';
import BrandMark from '@/components/BrandMark';
import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

const features = [
  {
    icon: ShareNetworkIcon,
    title: 'Flow canvas',
    body: 'Step-aware graph from JSONL—edges and tool transitions you can follow instead of inferring from text.',
    spotlight: true,
  },
  {
    icon: ListBulletsIcon,
    title: 'Trace tree',
    body: 'Nested operations from one stream. Expand, collapse, and jump without losing parent context.',
  },
  {
    icon: ChartLineUpIcon,
    title: 'Timeline',
    body: 'Chronological readout with timing deltas. Slow spans surface in the sequence.',
  },
  {
    icon: PlayIcon,
    title: 'Replay',
    body: 'Step through execution. Pair with filters to isolate the slice that matters.',
  },
  {
    icon: LockKeyIcon,
    title: 'Inspector & privacy',
    body: 'Slide-over payloads and metadata. Parsing stays in the workspace—no trace upload required.',
  },
];

const galleryShots = [
  {
    id: 'flow',
    kicker: 'Flow canvas',
    chromeLabel: 'flow — session',
    headline: 'Every step is a node on the canvas',
    body: 'Queue ops, user turns, thinking blocks, tools, and results connect with clear edges. Slow and high-token steps badge themselves where they belong—on the card.',
    src: 'https://agenticlens-assets.vercel.app/gallery/flow-canvas.png',
    width: 1024,
    height: 429,
    alt: 'AgenticLens flow canvas: traced steps as connected cards with slow and high-token badges.',
  },
  {
    id: 'tree',
    kicker: 'Event tree',
    chromeLabel: 'tree — metrics',
    headline: 'Hierarchy for deep sessions',
    body: 'Expand branches, read per-step timing, and keep the metrics strip in view. Same JSONL, structural lens—ideal when the bug lives in nesting.',
    src: 'https://agenticlens-assets.vercel.app/gallery/event-tree.png',
    width: 1024,
    height: 398,
    alt: 'AgenticLens event tree with metrics and nested USER, THINKING, ASSISTANT rows.',
  },
  {
    id: 'timeline',
    kicker: 'Timeline',
    chromeLabel: 'timeline — ordered',
    headline: 'Clock-ordered, delta-first',
    body: 'A vertical feed with deltas, model attribution, and explicit SLOW signals. When order and gaps matter more than topology, start here.',
    src: 'https://agenticlens-assets.vercel.app/gallery/timeline.png',
    width: 1024,
    height: 491,
    alt: 'AgenticLens timeline with chronological events and SLOW labels.',
  },
  {
    id: 'inspector',
    kicker: 'Inspector',
    chromeLabel: 'flow — inspector',
    headline: 'Detail without losing the map',
    body: 'Select a node: timings, session fields, and raw JSON in a side drawer. The canvas stays visible so context and payload stay linked.',
    src: 'https://agenticlens-assets.vercel.app/gallery/flow-inspector.png',
    width: 1024,
    height: 541,
    alt: 'AgenticLens flow with inspector open showing metadata and JSON.',
  },
];

const pillars = [
  {
    title: 'Raw logs, no guesswork',
    body: 'JSONL hides branching, tools, and latency. AgenticLens turns one export into a structured session you can actually walk.',
  },
  {
    title: 'One trace, many lenses',
    body: 'Flow, tree, and timeline stay in sync. Change the view—not the file—when the question moves from graph to hierarchy to time.',
  },
  {
    title: 'Private by default',
    body: 'Workspace mode parses in the browser. Inspect payloads and replay without sending traces to another hosted stack.',
  },
];

const supportedNow = ['Claude Agent SDK JSONL logs'];

const supportedSoon = ['OpenAI Agents', 'Chrome DevTools extension', 'SDK-based integrations'];

const useCases = [
  'Debugging agent workflows',
  'Understanding reasoning and tool usage',
  'Optimizing latency and cost',
  'Comparing different runs',
  'Building reliable AI systems',
];

const roadmapItems = [
  'SDK integration',
  'Chrome DevTools extension',
  'Multi-provider support',
  'Run comparison',
  'Cloud dashboard',
];

const heroEyebrowPills = [
  { label: 'Observability', tone: 'teal' },
  { label: 'JSONL', tone: 'violet' },
  { label: 'In-browser', tone: 'emerald' },
];

function MarketingEyebrow({ children }) {
  return (
    <p className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.22em] text-app-label">
      {children}
    </p>
  );
}

function BulletList({ items, muted = false }) {
  return (
    <ul className="p-0 m-0 space-y-3 list-none">
      {items.map((text) => (
        <li key={text} className="flex gap-3 text-[15px] leading-snug">
          <span
            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-app-accent shadow-[0_0_10px_color-mix(in_oklab,var(--app-accent)_60%,transparent)]"
            aria-hidden
          />
          <span className={muted ? 'text-app-fg-muted' : 'text-app-fg'}>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function ShowcaseRow({
  kicker,
  chromeLabel,
  headline,
  body,
  src,
  width,
  height,
  alt,
  reverse,
  imagePriority,
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:gap-y-0">
      <div className={['min-w-0', reverse ? 'lg:order-2' : ''].join(' ')}>
        <MarketingEyebrow>{kicker}</MarketingEyebrow>
        <h3 className="mt-4 m-0 text-[1.65rem] font-semibold tracking-[-0.02em] leading-tight text-app-fg sm:text-3xl">
          {headline}
        </h3>
        <p className="mt-5 m-0 max-w-xl text-[17px] leading-[1.65] text-app-fg-muted">{body}</p>
      </div>
      <div className={['min-w-0', reverse ? 'lg:order-1' : ''].join(' ')}>
        <div className="overflow-hidden landing-showcase-shell">
          <div className="landing-showcase-chrome">
            <div className="landing-showcase-dots" aria-hidden>
              <span className="landing-showcase-dot" />
              <span className="landing-showcase-dot" />
              <span className="landing-showcase-dot" />
            </div>
            <span className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-app-fg-muted sm:text-left">
              {chromeLabel}
            </span>
          </div>
          <div className="flex justify-center bg-[color-mix(in_oklab,var(--app-fg)_6%,var(--app-bg))]">
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 1024px) 100vw, min(1024px, calc(100vw - 3rem))"
              loading={imagePriority === 'high' ? 'eager' : 'lazy'}
              fetchPriority={imagePriority === 'high' ? 'high' : undefined}
              decoding="async"
              className="landing-gallery-img m-0 block h-auto w-full max-w-[1024px] object-contain object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onOpenWorkspace }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const prevThemeRef = useRef(theme);

  // Landing page is dark-mode only. We still restore the previous theme when leaving `/`.
  useEffect(() => {
    if (prevThemeRef.current !== 'dark') setTheme('dark');
    return () => setTheme(prevThemeRef.current);
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-app-bg text-app-fg">
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-app-bg"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse 85% 55% at 50% -25%, var(--app-glow-1), transparent 58%), radial-gradient(ellipse 55% 45% at 100% -5%, var(--app-glow-2), transparent 50%)',
        }}
      />

      <header className="sticky top-0 z-50 border-b border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)] bg-[color-mix(in_oklab,var(--app-bg)_82%,transparent)] backdrop-blur-xl backdrop-saturate-150">
        <div className="flex items-center justify-between max-w-6xl gap-3 px-5 mx-auto h-14 sm:h-16 sm:px-8">
          <div className="flex items-center min-w-0 gap-3">
            <BrandMark size="md" className="rounded-lg" />
            <span className="truncate text-[15px] font-semibold tracking-tight text-app-fg">
              AgenticLens
            </span>
          </div>
          <nav className="items-center hidden gap-6 lg:flex" aria-label="Page sections">
            <a
              href="#why"
              className="text-[13px] font-medium text-app-fg-muted transition-colors hover:text-app-fg"
            >
              Why
            </a>
            <a
              href="#showcase"
              className="text-[13px] font-medium text-app-fg-muted transition-colors hover:text-app-fg"
            >
              Product
            </a>
            <a
              href="#integrations"
              className="text-[13px] font-medium text-app-fg-muted transition-colors hover:text-app-fg"
            >
              Logs
            </a>
            <a
              href="#roadmap"
              className="text-[13px] font-medium text-app-fg-muted transition-colors hover:text-app-fg"
            >
              Roadmap
            </a>
            <a
              href="#start"
              className="text-[13px] font-medium text-app-fg-muted transition-colors hover:text-app-fg"
            >
              Get started
            </a>
          </nav>
          <div className="flex items-center gap-2 shrink-0 sm:gap-3">
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="inline-flex h-9 items-center justify-center rounded-full bg-app-accent px-4 text-[13px] font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98] sm:h-10 sm:px-5"
            >
              Open workspace
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — Turborepo-scale headline + Vercel-style snippet */}
        <section className="relative max-w-6xl px-5 pt-16 pb-24 mx-auto overflow-hidden sm:px-8 sm:pb-32 sm:pt-20 md:pt-28">
          <div className="landing-hero-pattern" aria-hidden />
          <div className="relative max-w-4xl mx-auto text-center z-1">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {heroEyebrowPills.map((pill) => (
                <span
                  key={pill.label}
                  className={[
                    'inline-flex items-center rounded-full px-3 py-1',
                    'font-mono text-[11px] font-semibold uppercase tracking-[0.14em]',
                    pill.tone === 'teal'
                      ? 'bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-300/35'
                      : pill.tone === 'violet'
                        ? 'bg-violet-400/12 text-violet-200 ring-1 ring-violet-300/35'
                        : 'bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/35',
                  ].join(' ')}
                >
                  {pill.label}
                </span>
              ))}
            </div>
            <h1 className="mt-6 m-0 text-[2.75rem] font-semibold tracking-[-0.045em] leading-[1.05] text-app-fg sm:text-6xl sm:font-bold sm:leading-[1.02] md:text-[3.75rem] [font-variation-settings:'opsz'_28] md:[font-variation-settings:'opsz'_32]">
              Make agent runs legible.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.65] text-app-fg-muted sm:text-xl">
              AgenticLens turns Claude Agent SDK exports into a live workspace—flow, tree, timeline,
              replay, and inspector—so you see what happened before you reread the file.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 mt-14 sm:flex-row sm:gap-4 sm:mt-16">
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-app-accent px-8 text-[15px] font-semibold text-white shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--app-accent)_55%,transparent)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] sm:w-auto"
              >
                Open workspace
                <ArrowRightIcon size={18} weight="bold" className="shrink-0" aria-hidden />
              </button>
              <a
                href="#showcase"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--app-fg)_14%,transparent)] bg-[color-mix(in_oklab,var(--app-surface)_40%,transparent)] px-8 text-[15px] font-semibold text-app-fg transition-colors hover:border-app-accent/35 hover:bg-app-accent-soft-bg sm:w-auto"
              >
                See the UI
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mx-auto mt-10">
              {['Claude Agent SDK', 'JSONL', 'Client-side parse'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[color-mix(in_oklab,var(--app-fg)_10%,transparent)] bg-[color-mix(in_oklab,var(--app-surface)_80%,transparent)] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-app-fg-muted"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="max-w-lg px-5 py-4 mx-auto text-left landing-hero-snippet mt-14">
              <p className="m-0 font-mono text-[11px] font-medium uppercase tracking-wider text-app-label">
                One file → every lens
              </p>
              <p className="mt-3 m-0 font-mono text-[13px] leading-relaxed text-app-fg-subtle">
                <span className="text-app-accent-fg">●</span>{' '}
                <span className="text-app-fg">trace</span>
                <span className="text-app-fg-muted">.jsonl</span>
                <span className="text-app-label"> · </span>
                <span className="text-app-fg-muted">flow</span>
                <span className="text-app-label"> · </span>
                <span className="text-app-fg-muted">tree</span>
                <span className="text-app-label"> · </span>
                <span className="text-app-fg-muted">timeline</span>
                <span className="text-app-label"> · </span>
                <span className="text-app-fg-muted">replay</span>
              </p>
            </div>
          </div>
        </section>

        {/* Pillars — Turborepo "Scale your workflows" density */}
        <section
          id="why"
          className="border-y border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)] py-20 sm:py-28"
        >
          <div className="max-w-6xl px-5 mx-auto sm:px-8">
            <div className="max-w-3xl">
              <MarketingEyebrow>Why AgenticLens</MarketingEyebrow>
              <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                Built for opaque agent runs
              </h2>
              <p className="mt-5 m-0 max-w-2xl text-[17px] leading-relaxed text-app-fg-muted">
                Three things we optimize for: structure, multiple views, and privacy—without a
                hosted pipeline.
              </p>
            </div>
            <div className="grid gap-6 mt-16 md:grid-cols-3">
              {pillars.map(({ title, body }) => (
                <div key={title} className="p-8 marketing-feature-card sm:p-9">
                  <h3 className="m-0 text-lg font-semibold tracking-tight text-app-fg">{title}</h3>
                  <p className="mt-4 m-0 text-[15px] leading-relaxed text-app-fg-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase — alternating copy + framed screenshots (Vercel AI Gateway rhythm) */}
        <section id="showcase" className="py-20 sm:py-28">
          <div className="max-w-6xl px-5 mx-auto sm:px-8">
            <div className="max-w-3xl">
              <MarketingEyebrow>Product</MarketingEyebrow>
              <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                The workspace, in stills
              </h2>
              <p className="mt-5 m-0 max-w-2xl text-[17px] leading-relaxed text-app-fg-muted">
                Each capture is the same session—different lens. That is how AgenticLens maps JSONL
                to navigable UI.
              </p>
            </div>
            <div className="mt-20 space-y-28 sm:space-y-32">
              {galleryShots.map((shot, i) => (
                <ShowcaseRow
                  key={shot.id}
                  {...shot}
                  reverse={i % 2 === 1}
                  imagePriority={i === 0 ? 'high' : 'low'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section
          id="product"
          className="border-t border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)] py-20 sm:py-28"
        >
          <div className="max-w-6xl px-5 mx-auto sm:px-8">
            <div className="max-w-3xl">
              <MarketingEyebrow>Surface area</MarketingEyebrow>
              <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                Everything in one workspace
              </h2>
            </div>
            <div className="grid gap-5 mt-14 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, body, spotlight }) => (
                <article
                  key={title}
                  className={[
                    'flex flex-col p-8 transition-[transform,box-shadow] duration-300',
                    spotlight
                      ? 'md:col-span-2 lg:col-span-2 lg:flex-row lg:items-start lg:gap-10 lg:p-10 rounded-2xl border border-white/10 bg-linear-to-br from-app-accent to-app-marketing-deep text-white shadow-[0_20px_60px_-24px_color-mix(in_oklab,var(--app-accent)_45%,transparent)] hover:brightness-[1.03]'
                      : 'marketing-feature-card',
                  ].join(' ')}
                >
                  <Icon
                    size={24}
                    weight="regular"
                    className={
                      spotlight ? 'mt-1 shrink-0 text-white/90' : 'shrink-0 text-app-fg-muted'
                    }
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={[
                        'mt-5 m-0 text-lg font-semibold tracking-tight lg:mt-0',
                        spotlight ? 'text-white' : 'text-app-fg md:text-xl',
                      ].join(' ')}
                    >
                      {title}
                    </h3>
                    <p
                      className={[
                        'mt-3 m-0 text-[15px] leading-relaxed',
                        spotlight ? 'text-white/88' : 'text-app-fg-muted',
                      ].join(' ')}
                    >
                      {body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="integrations"
          className="border-y border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)] bg-[color-mix(in_oklab,var(--app-surface)_20%,var(--app-bg))] py-20 sm:py-24"
        >
          <div className="max-w-6xl px-5 mx-auto sm:px-8">
            <div className="max-w-3xl">
              <MarketingEyebrow>Interop</MarketingEyebrow>
              <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl">
                Supported logs
              </h2>
              <p className="mt-5 m-0 max-w-2xl text-[17px] leading-relaxed text-app-fg-muted">
                Start with today&apos;s exports. We expand formats as frameworks ship.
              </p>
            </div>
            <div className="grid gap-6 mt-12 md:grid-cols-2">
              <div className="p-8 marketing-feature-card sm:p-10">
                <p className="m-0 font-mono text-xs font-semibold tracking-wider uppercase text-app-live">
                  Now
                </p>
                <div className="mt-6">
                  <BulletList items={supportedNow} muted />
                </div>
              </div>
              <div className="p-8 marketing-feature-card sm:p-10">
                <p className="m-0 font-mono text-xs font-semibold tracking-wider uppercase text-app-label">
                  Next
                </p>
                <div className="mt-6">
                  <BulletList items={supportedSoon} muted />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="max-w-6xl px-5 py-20 mx-auto sm:px-8 sm:py-28">
          <div className="max-w-3xl">
            <MarketingEyebrow>Use cases</MarketingEyebrow>
            <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl">
              When teams reach for AgenticLens
            </h2>
          </div>
          <div className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((title) => (
              <div key={title} className="px-5 py-4 marketing-feature-card sm:px-6 sm:py-5">
                <p className="m-0 text-[15px] font-medium leading-snug text-app-fg">{title}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="roadmap"
          className="border-t border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)] py-20 sm:py-28"
        >
          <div className="max-w-6xl px-5 mx-auto sm:px-8">
            <div className="max-w-3xl">
              <MarketingEyebrow>Roadmap</MarketingEyebrow>
              <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl">
                Where we are headed
              </h2>
            </div>
            <div className="marketing-feature-card mt-12 max-w-3xl divide-y divide-[color-mix(in_oklab,var(--app-fg)_10%,transparent)] px-2 py-2 sm:px-4">
              {roadmapItems.map((item, i) => (
                <div key={item} className="flex gap-5 px-4 py-5 sm:px-5">
                  <span className="font-mono text-sm font-bold tabular-nums text-app-accent-fg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[16px] leading-snug text-app-fg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="start"
          className="border-t border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)] py-20 sm:py-28"
        >
          <div className="grid max-w-6xl px-5 mx-auto gap-14 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <MarketingEyebrow>Get started</MarketingEyebrow>
              <h2 className="mt-4 m-0 text-3xl font-semibold tracking-[-0.03em] text-app-fg sm:text-4xl">
                Three steps
              </h2>
              <ol className="mt-12 space-y-10">
                {[
                  'Export JSONL from your agent or tracing hook.',
                  'Open the workspace and drop a file or folder.',
                  'Switch views, filter types, replay, and inspect.',
                ].map((text, i) => (
                  <li key={text} className="flex gap-6">
                    <span className="font-mono text-sm font-bold tabular-nums text-app-label">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="m-0 text-[17px] leading-relaxed text-app-fg-muted">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="p-10 marketing-feature-card lg:p-12">
              <p className="m-0 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-app-label">
                Workspace
              </p>
              <p className="m-0 mt-5 text-lg font-medium leading-relaxed text-app-fg">
                No account required for browser mode. Load a trace and ship the next fix with
                confidence.
              </p>
              <div className="mt-6 rounded-xl border border-[color-mix(in_oklab,var(--app-fg)_10%,transparent)] bg-[color-mix(in_oklab,var(--app-surface)_75%,var(--app-bg))] px-4 py-3">
                <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-app-label">
                  Run with npx
                </p>
                <code className="mt-2 block font-mono text-[13px] text-app-fg-subtle">
                  npx agenticlens path/to/logs.jsonl
                </code>
              </div>
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-app-accent px-6 text-[14px] font-semibold text-white transition-[filter] hover:brightness-110"
              >
                Open workspace
                <ArrowRightIcon size={16} weight="bold" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl px-5 pt-6 mx-auto pb-28 sm:px-8 sm:pb-36">
          <div className="rounded-3xl bg-linear-to-br from-app-accent to-app-marketing-deep px-8 py-16 text-center text-white shadow-[0_24px_80px_-28px_color-mix(in_oklab,var(--app-accent)_55%,transparent)] sm:px-16 sm:py-20">
            <h2 className="m-0 text-2xl font-semibold tracking-tight sm:text-4xl sm:leading-tight">
              Ship the next run with clarity
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[17px] leading-relaxed text-white/85">
              Open the workspace—load JSONL—and let the graph do the reading.
            </p>
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-[15px] font-semibold text-app-accent transition-[filter] hover:brightness-95"
            >
              Open workspace
              <ArrowRightIcon size={18} weight="bold" aria-hidden />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color-mix(in_oklab,var(--app-fg)_8%,transparent)]">
        <div className="grid max-w-6xl gap-12 px-5 py-16 mx-auto sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-16">
          <div>
            <div className="font-semibold text-app-fg">AgenticLens</div>
            <p className="mt-4 m-0 max-w-xs text-[14px] leading-relaxed text-app-fg-muted">
              Observability for agent JSONL—in your browser.
            </p>
          </div>
          <div>
            <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-app-label">
              Product
            </p>
            <ul className="mt-5 space-y-3 text-[14px] text-app-fg-muted">
              <li>
                <a href="#why" className="transition-colors hover:text-app-fg">
                  Why AgenticLens
                </a>
              </li>
              <li>
                <a href="#showcase" className="transition-colors hover:text-app-fg">
                  Showcase
                </a>
              </li>
              <li>
                <a href="#product" className="transition-colors hover:text-app-fg">
                  Features
                </a>
              </li>
              <li>
                <a href="#integrations" className="transition-colors hover:text-app-fg">
                  Supported logs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-app-label">
              More
            </p>
            <ul className="mt-5 space-y-3 text-[14px] text-app-fg-muted">
              <li>
                <a href="#use-cases" className="transition-colors hover:text-app-fg">
                  Use cases
                </a>
              </li>
              <li>
                <a href="#roadmap" className="transition-colors hover:text-app-fg">
                  Roadmap
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="text-left transition-colors hover:text-app-fg"
                >
                  Workspace
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-app-label">
              Build
            </p>
            <ul className="mt-5 space-y-3 text-[14px] text-app-fg-muted">
              <li>
                <a href="#start" className="transition-colors hover:text-app-fg">
                  Get started
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
