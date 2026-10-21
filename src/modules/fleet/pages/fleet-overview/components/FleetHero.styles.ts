export const styles = {
  hero: 'border-b border-line pt-6 md:pt-8',
  masthead: 'flex items-center justify-between gap-4',
  eyebrow: 'font-mono text-[9px] uppercase tracking-[.16em] text-muted',
  refresh:
    'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap gap-2 text-xs text-muted transition hover:text-ink disabled:opacity-40',
  refreshing: 'motion-safe:animate-spin',
  titleRow: 'mb-6 mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end',
  title: 'text-[clamp(42px,6.7vw,96px)] font-medium leading-[1.02] tracking-[-.075em]',
  period: 'text-accent',
  copy: 'max-w-64 pb-1 text-xs leading-6 text-muted',
  lowerRail:
    'flex items-center justify-between gap-5 border-t border-line py-4 font-mono text-[9px] text-muted',
  jump: 'flex min-h-11 items-center gap-3 text-ink hover:text-accent',
} as const;
