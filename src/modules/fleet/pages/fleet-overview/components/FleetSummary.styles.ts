export const styles = {
  overview: 'mb-10 grid border-b border-line lg:grid-cols-[180px_1fr]',
  intro:
    'flex items-center gap-3 border-b border-line py-5 font-mono text-[10px] tracking-wide lg:border-b-0 lg:border-r lg:pr-5',
  dot: 'size-1.5 shrink-0 bg-accent motion-safe:animate-soft-pulse',
  index: 'text-[10px] text-muted',
  metrics: 'grid grid-cols-2 sm:grid-cols-4',
  metric: 'border-b border-r border-line p-5 last:border-r-0 sm:border-b-0 lg:px-7 lg:py-6',
  label: 'flex items-center gap-3 font-mono text-[10px] tracking-wide text-muted',
  value: 'mt-3 text-4xl font-medium tracking-[-0.06em]',
} as const;
