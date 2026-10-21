import { useEffect, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CaretDownIcon, PathIcon, SignpostIcon } from '@phosphor-icons/react';
import { useFilterOptions } from '../../../hooks/useFleetQueries';
import { styles as s } from './FilterDropdown.styles';
interface IFilterDropdownProps {
  kind: 'routes' | 'trips';
  selected: string[];
  routeIds: string[];
  onChange: (ids: string[]) => void;
}
export function FilterDropdown({ kind, selected, routeIds, onChange }: IFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const query = useFilterOptions(kind, routeIds, open);
  const viewport = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const options = [
    ...new Map(
      (query.data?.pages.flatMap((page) => page.options) ?? []).map((option) => [
        option.id,
        option,
      ]),
    ).values(),
  ];
  const visible = options.filter((option) =>
    `${option.label} ${option.description}`.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    if (
      !open ||
      !sentinel.current ||
      !query.hasNextPage ||
      query.isFetchingNextPage ||
      query.isFetchNextPageError ||
      search
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void query.fetchNextPage();
      },
      { root: viewport.current, rootMargin: '40px' },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [
    open,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.isFetchNextPageError,
    query.fetchNextPage,
    options.length,
    search,
  ]);
  useEffect(() => {
    if (search) viewport.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [search, query.data?.pages.length]);
  const label = kind === 'routes' ? 'Routes' : 'Trips';
  const Icon = kind === 'routes' ? PathIcon : SignpostIcon;
  return (
    <Popover.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setSearch('');
      }}
    >
      <Popover.Trigger
        id={`filter-${kind}-trigger`}
        className={s.trigger}
        aria-label={`Filter ${label.toLowerCase()}`}
        aria-describedby={`filter-${kind}-selection`}
      >
        <span className={s.triggerLabel}>
          <Icon size={17} />
          {selected.length ? label : `All ${label.toLowerCase()}`}
          {selected.length > 0 && <span className={s.count}>{selected.length}</span>}
        </span>
        <CaretDownIcon size={14} />
      </Popover.Trigger>
      <span id={`filter-${kind}-selection`} className="sr-only">
        {selected.length} {label.toLowerCase()} selected
      </span>
      <Popover.Portal>
        <Popover.Content
          className={s.content}
          align="start"
          sideOffset={8}
          collisionPadding={12}
          onOpenAutoFocus={(event) => {
            if (window.matchMedia('(pointer: coarse)').matches) {
              event.preventDefault();
              viewport.current?.focus();
            }
          }}
          aria-label={`${label} filter`}
        >
          <input
            className={s.search}
            aria-label={`Search loaded ${label.toLowerCase()}`}
            placeholder={`Search loaded ${label.toLowerCase()}…`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {query.isFetching && !query.isPending && !query.isFetchingNextPage && (
            <p role="status" className={s.hint}>
              Refreshing {label.toLowerCase()}…
            </p>
          )}
          <div
            ref={viewport}
            className={s.list}
            tabIndex={-1}
            aria-label={`${label} options`}
            aria-busy={query.isFetching}
          >
            {query.isPending ? (
              <div role="status" aria-label={`Loading ${label.toLowerCase()}`}>
                <div className={s.loading} />
                <div className={s.loading} />
                <div className={s.loading} />
              </div>
            ) : null}
            {visible.map((option) => (
              <label key={option.id} className={s.option}>
                <input
                  className={s.checkbox}
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={() =>
                    onChange(
                      selected.includes(option.id)
                        ? selected.filter((id) => id !== option.id)
                        : [...selected, option.id],
                    )
                  }
                />
                <span>
                  <span className={s.label}>{option.label}</span>
                  <span className={s.description}>{option.description}</span>
                </span>
              </label>
            ))}
            {!query.isPending && !query.isError && !visible.length && (
              <p className={s.hint}>
                No matches in the {options.length} loaded {label.toLowerCase()}.
                {query.hasNextPage
                  ? ' Load more to check additional options.'
                  : ' Try a different search.'}
              </p>
            )}
            {query.isError && (
              <div className={s.error} role="alert">
                {query.error.message}
                <button
                  className={s.more}
                  onClick={() =>
                    query.isFetchNextPageError ? void query.fetchNextPage() : void query.refetch()
                  }
                >
                  Retry {label.toLowerCase()}
                </button>
              </div>
            )}
            <div ref={sentinel} />
            {query.hasNextPage && (
              <button
                className={s.more}
                disabled={query.isFetchingNextPage}
                onClick={() => void query.fetchNextPage()}
              >
                {query.isFetchingNextPage ? 'Loading more…' : `Load more ${label.toLowerCase()}`}
              </button>
            )}
          </div>
          <p className={s.footnote}>
            {kind === 'trips' ? 'Scheduled trips may not have an active vehicle. ' : ''}Scroll to
            load more. Search applies to loaded options.
          </p>
          <div className={s.bottom}>
            <span>
              {selected.length} selected · {options.length} loaded
            </span>
            <button className={s.clear} onClick={() => onChange([])}>
              Clear selection
            </button>
            <Popover.Close className={s.clear}>Done</Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
