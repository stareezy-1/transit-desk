export const styles = {
  pagination:
    'mt-6 flex flex-col justify-between gap-4 border-t border-line pt-5 text-xs text-muted xl:flex-row xl:items-center',
  summary: 'flex flex-wrap items-center justify-between gap-3 xl:gap-8',
  sizeLabel: 'flex items-center gap-2',
  pageControls: 'flex items-center justify-center gap-2 sm:justify-start',
  pageSize:
    'min-h-11 min-w-12 rounded-none border border-line bg-surface px-2 text-base text-ink sm:text-sm',
  pageButton:
    'flex min-h-11 min-w-11 items-center justify-center rounded-none border border-line bg-surface px-2 text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-35',
  pageCurrent: 'border-ink bg-ink text-canvas',
  pageEllipsis: 'px-1',
  numbered: 'hidden items-center gap-2 sm:flex',
  mobilePage: 'flex items-center gap-3 sm:hidden',
  desktopTotal: 'hidden sm:inline',
} as const;
