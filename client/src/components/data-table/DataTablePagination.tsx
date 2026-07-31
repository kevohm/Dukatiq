import { ChevronLeft, ChevronRight } from "lucide-react";

type DataTablePaginationProps = {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function DataTablePagination({
  pageSize,
  onPageSizeChange,
  rangeStart,
  rangeEnd,
  total,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: DataTablePaginationProps) {
  return (
      <div className="flex items-center justify-between px-4 py-3 text-sm text-muted dark:text-slate-500">
          <label className="flex items-center gap-2">
              <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-border dark:border-slate-900 dark:outline-none bg-surface dark:bg-slate-950 px-2 py-1"
              >
                  {[10, 25, 50].map((size) => (
                      <option key={size} value={size}>
                          {size} results
                      </option>
                  ))}
              </select>
          </label>

          <div className="flex items-center gap-4">
              <span>
                  {rangeStart} - {rangeEnd} of {total} results
              </span>
              <div className="flex items-center gap-1">
                  <button
                      onClick={onPrev}
                      disabled={!canPrev}
                      className="rounded-lg p-1.5 hover:bg-hover dark:hover:bg-slate-800 disabled:opacity-40"
                      aria-label="Previous page"
                  >
                      <ChevronLeft size={16} />
                  </button>
                  <button
                      onClick={onNext}
                      disabled={!canNext}
                      className="rounded-lg p-1.5 hover:bg-hover dark:hover:bg-slate-800 disabled:opacity-40"
                      aria-label="Next page"
                  >
                      <ChevronRight size={16} />
                  </button>
              </div>
          </div>
      </div>
  )
}
