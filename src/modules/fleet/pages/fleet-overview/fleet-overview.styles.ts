import { cva } from 'class-variance-authority';
export const styles = {
  shell: 'min-h-dvh bg-canvas text-ink',
  topbar: 'border-b border-line bg-canvas',
  topbarInner: 'mx-auto flex h-16 max-w-[1440px] items-stretch justify-between px-5 md:px-10',
  brand:
    'flex items-center gap-2 whitespace-nowrap border-r border-line pr-3 text-base font-semibold tracking-tight md:pr-8',
  brandIcon: 'brand-symbol hidden sm:flex items-center text-accent',
  brandDot: 'text-ink',
  navFull: 'hidden sm:inline',
  navCompact: 'sm:hidden',
  nav: 'flex items-stretch font-mono text-[9px] uppercase tracking-[0.12em]',
  navActive: 'hidden sm:flex items-center border-r border-line px-3 text-ink md:px-6',
  navLink:
    'flex items-center border-r border-line px-2 text-muted transition sm:px-3 hover:text-ink md:px-6',
  network: 'hidden items-center gap-2 px-6 text-muted lg:flex',
  liveDot: 'inline-block size-1 bg-accent',
  main: 'mx-auto max-w-[1440px] px-5 pt-0 md:px-10 md:pt-0',
  heading: 'text-4xl font-semibold tracking-tight',
  eyebrow: 'mb-4 font-mono text-[10px] uppercase tracking-wider text-muted',
  subtitle: 'my-5 text-sm text-muted',
  refresh:
    'inline-flex min-h-11 items-center justify-center border border-line px-5 font-mono text-xs uppercase transition hover:bg-ink hover:text-canvas',
  sectionHeader: 'mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end',
  sectionMarker: 'mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-accent',
  sectionTitle:
    'flex items-start gap-5 text-[clamp(32px,4vw,52px)] font-medium leading-none tracking-[-0.05em]',
  count: 'mt-1 border border-line px-2 py-1 font-mono text-[11px] text-muted',
  sync: 'flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted',
  filters: 'mb-5 grid gap-3 border-y border-line py-4 sm:grid-cols-[1.5fr_1fr_1fr_auto]',
  searchWrap: 'relative flex items-center',
  searchIcon: 'pointer-events-none absolute left-3 text-muted',
  search:
    'h-12 w-full border border-line bg-surface pl-10 pr-3 text-base sm:text-sm text-ink placeholder:text-muted',
  reset:
    'inline-flex min-h-12 items-center justify-center gap-2 px-3 font-mono text-[10px] uppercase tracking-wider text-muted hover:text-ink disabled:opacity-35',
  toolbar: 'mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center',
  tabs: 'flex max-w-full flex-wrap gap-x-5 gap-y-1',
  tab: 'min-h-11 min-w-11 whitespace-nowrap border-b border-transparent py-2 font-mono text-[10px] uppercase tracking-wider text-muted transition hover:text-ink',
  tabActive: 'border-accent text-ink',
  toolbarNote: 'font-mono text-[10px] tracking-wide text-muted',
  grid: 'grid gap-x-7 gap-y-5 md:grid-cols-2',
  empty: 'flex min-h-72 flex-col items-start justify-center border-y border-line px-6 py-10',
  emptyIcon: 'mb-5 text-accent',
  emptyTitle: 'text-2xl font-medium',
  emptyText: 'my-4 max-w-md text-sm leading-relaxed text-muted',
  error:
    'mb-5 flex flex-wrap items-center justify-between gap-3 border border-accent/50 bg-accent-soft p-4 text-sm text-ink',
  errorCopy: 'flex items-center gap-3',
  retry: 'min-h-11 border border-current px-3 py-2 font-mono text-[10px] uppercase',
  footer: 'mt-16 border-t border-line pb-7 pt-6',
  footerTop:
    'flex flex-col justify-between gap-4 font-mono text-[9px] uppercase leading-relaxed tracking-wider text-muted sm:flex-row',
  footerLink: 'underline underline-offset-4 hover:text-ink',
  footerWord: 'mt-10 text-3xl font-medium tracking-tight text-muted',
  skeleton: 'h-[280px] border border-line bg-surface p-6 motion-safe:animate-pulse',
  skeletonShort: 'mb-5 h-5 w-1/3 bg-line',
  skeletonLong: 'mb-3 h-4 w-3/4 bg-line',
  skeletonBlock: 'mt-6 h-20 bg-line',
} as const;
export const statusStyles = cva(
  'inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-wider',
  {
    variants: {
      status: {
        IN_TRANSIT_TO: 'text-accent',
        STOPPED_AT: 'text-ink',
        INCOMING_AT: 'text-muted',
        unknown: 'text-muted',
      },
    },
    defaultVariants: { status: 'unknown' },
  },
);
