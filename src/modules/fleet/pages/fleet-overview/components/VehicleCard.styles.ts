export const styles = {
  card: 'vehicle-ticket group relative border border-line bg-surface transition-colors duration-300 hover:border-ink/40',
  top: 'flex items-center justify-between gap-3 border-b border-line px-5 py-3',
  mode: 'flex min-w-0 items-center gap-2 truncate font-mono text-[10px] tracking-wide text-muted',
  dot: 'size-1 bg-current',
  body: 'grid min-h-32 grid-cols-[1fr_auto] items-start gap-4 px-4 py-5 sm:grid-cols-[1fr_1.2fr_auto] sm:items-center sm:px-5',
  identity: 'min-w-0',
  eyebrow: 'mb-2 font-mono text-[10px] tracking-wide text-muted',
  title: 'break-all text-3xl font-semibold leading-none tracking-[-0.04em] sm:text-4xl',
  journey:
    'col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:border-l sm:border-line sm:pl-4',
  destination: 'break-words text-sm font-medium leading-relaxed lg:text-base',
  routeName: 'mt-1 break-words text-xs leading-relaxed text-muted',
  button:
    'col-start-2 row-start-1 flex size-12 flex-col sm:col-start-3 items-center justify-center gap-1 border border-line text-ink transition duration-200 group-hover:border-accent hover:bg-accent hover:text-canvas active:scale-95',
  buttonLabel: 'font-mono text-[10px] tracking-wide',
  coordinates: 'grid grid-cols-3 border-t border-dashed border-line px-4 py-4 sm:px-5',
  label: 'font-mono text-[10px] tracking-wide text-muted',
  value: 'mt-1.5 font-mono text-[11px] text-ink',
} as const;
