export const styles = {
  overlay: 'fixed inset-0 z-40 bg-black/70 backdrop-blur-sm motion-safe:animate-enter',
  content:
    'fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[min(720px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-none border border-line bg-surface p-5 shadow-2xl outline-none md:p-7',
  header: 'mb-5 flex items-start justify-between gap-4',
  eyebrow: 'mb-2 text-[10px] uppercase tracking-[0.18em] text-muted',
  title: 'text-3xl font-semibold tracking-tight',
  description: 'mt-2 text-xs text-muted',
  close:
    'flex size-11 shrink-0 items-center justify-center rounded-none border border-line hover:bg-canvas',
  facts: 'my-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3',
  label: 'text-[10px] uppercase tracking-[0.1em] text-muted',
  value: 'mt-1.5 break-words text-sm',
  mono: 'mt-1.5 break-all font-mono text-xs',
  map: 'relative z-0 h-64 overflow-hidden rounded-none border border-line bg-canvas',
  mapEmpty:
    'flex h-64 items-center justify-center border border-line bg-canvas px-6 text-center text-sm text-muted',
  mapLoading:
    'flex h-64 items-center justify-center rounded-none bg-canvas text-sm text-muted motion-safe:animate-pulse',
  mapWarning:
    'absolute bottom-7 left-3 right-3 z-[400] rounded-none bg-surface/95 p-3 text-xs text-ink shadow',
  mapLink:
    'mt-3 inline-flex min-h-11 items-center gap-1 text-xs text-accent underline underline-offset-4',
  error: 'rounded-none bg-accent-soft p-5 text-sm text-ink',
  retry: 'mt-4 block min-h-11 rounded-none border border-current px-4 py-2 text-xs',
  skeleton: 'h-80 rounded-none bg-canvas motion-safe:animate-pulse',
  raw: 'mt-4 text-[10px] text-muted',
} as const;
