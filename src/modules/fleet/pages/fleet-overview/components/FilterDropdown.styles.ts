export const styles = {
  trigger:
    'flex h-12 w-full items-center justify-between gap-3 rounded-none border border-line bg-surface px-3 text-xs transition hover:border-accent data-[state=open]:border-accent',
  triggerLabel: 'flex min-w-0 items-center gap-2 text-muted',
  count: 'rounded bg-accent-soft px-1.5 text-xs text-accent',
  content:
    'z-30 flex max-h-[var(--radix-popover-content-available-height)] w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-none border border-line bg-surface p-2 shadow-xl shadow-black/30 motion-safe:animate-enter',
  search:
    'mb-2 h-11 w-full shrink-0 rounded-none border border-line bg-canvas px-3 text-base sm:text-sm',
  list: 'min-h-0 max-h-60 flex-1 overflow-y-auto overscroll-contain',
  option:
    'flex cursor-pointer items-start gap-3 rounded-none px-2 py-3 hover:bg-canvas has-[:checked]:bg-accent-soft',
  checkbox: 'mt-1 size-4 shrink-0 accent-accent',
  label: 'block text-xs font-medium',
  description: 'mt-1 block break-all text-[10px] text-muted',
  hint: 'px-2 py-3 text-xs leading-relaxed text-muted',
  footnote: 'filter-help px-2 py-3 text-xs leading-relaxed text-muted',
  bottom:
    'flex shrink-0 items-center justify-between gap-2 border-t border-line px-2 pt-2 text-[10px] text-muted',
  clear: 'min-h-11 min-w-11 rounded px-2 text-accent hover:bg-accent-soft',
  more: 'my-2 min-h-11 w-full rounded-none bg-canvas text-xs text-accent disabled:opacity-50',
  error: 'p-3 text-xs text-accent',
  loading: 'm-2 h-10 rounded bg-canvas motion-safe:animate-pulse',
} as const;
