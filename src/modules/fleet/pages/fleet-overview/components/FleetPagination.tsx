import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { cn } from '@/shared/utils';
import { styles as s } from './FleetPagination.styles';
interface IFleetPaginationProps {
  pagination: { page: number; totalPages: number; start: number; end: number; total: number };
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
export function FleetPagination({
  pagination,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: IFleetPaginationProps) {
  const pages = [
    ...new Set([
      1,
      pagination.page - 1,
      pagination.page,
      pagination.page + 1,
      pagination.totalPages,
    ]),
  ]
    .filter((value) => value >= 1 && value <= pagination.totalPages)
    .sort((a, b) => a - b);
  return (
    <div className={s.pagination}>
      <div className={s.summary}>
        <p role="status" aria-live="polite" aria-atomic="true">
          Showing{' '}
          <strong>
            {pagination.start}–{pagination.end}
          </strong>{' '}
          of <strong>{pagination.total}</strong> vehicles
        </p>
        <label className={s.sizeLabel}>
          Per page
          <select
            className={s.pageSize}
            aria-label="Vehicles per page"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {[6, 12, 24].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <nav className={s.pageControls} aria-label="Vehicle pagination">
        <button
          className={s.pageButton}
          aria-label="Previous page"
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <CaretLeftIcon size={16} />
        </button>
        <label className={s.mobilePage}>
          Page
          <select
            className={s.pageSize}
            aria-label="Page number"
            value={pagination.page}
            disabled={pagination.total === 0}
            onChange={(event) => onPageChange(Number(event.target.value))}
          >
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span>of {pagination.totalPages}</span>
        </label>
        <div className={s.numbered}>
          {pages.map((value, index) => (
            <span key={value} className="page-slot">
              {index > 0 && value - pages[index - 1] > 1 && (
                <span className={s.pageEllipsis}>…</span>
              )}
              <button
                className={cn(s.pageButton, value === pagination.page && s.pageCurrent)}
                aria-label={`Page ${value}`}
                aria-current={value === pagination.page ? 'page' : undefined}
                onClick={() => onPageChange(value)}
              >
                {value}
              </button>
            </span>
          ))}
        </div>
        <button
          className={s.pageButton}
          aria-label="Next page"
          disabled={pagination.page === pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <CaretRightIcon size={16} />
        </button>
        <span className={s.desktopTotal}>of {pagination.totalPages} pages</span>
      </nav>
    </div>
  );
}
