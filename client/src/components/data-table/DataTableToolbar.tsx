import type { ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from '../../lib/cn'

export type FilterOption = {
  id: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  onClick: () => void;
};

type DataTableToolbarProps = {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  /** Config-driven filter buttons — e.g. Assigned to, Location, Date, Priority. */
  filters?: FilterOption[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  /** Called when the trailing funnel icon (more filters) is clicked. */
  onMoreFilters?: () => void;
  /**
   * Anything extra for the right side of the bar — a view switcher
   * (Board/List/Calendar), an export button, whatever a specific page
   * needs. Keeps this component generic instead of hardcoding one page's
   * extra controls.
   */
  actions?: ReactNode;
};

/**
 * Domain-agnostic toolbar for any DataTable. A feature page supplies its
 * own filter config (see features/work-orders/components/FilterBar.tsx
 * for an example) — this component only renders and reports clicks.
 */
export function DataTableToolbar({
  search,
  filters = [],
  onClearFilters,
  hasActiveFilters,
  onMoreFilters,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        {search && (
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? "Search"}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        )}

        {filters.map(({ id, label, icon: Icon, active, onClick }) => (
          <button
            key={id}
            onClick={onClick}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              active
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted hover:bg-hover"
            )}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}

        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-muted hover:text-heading"
          >
            <X size={14} />
            Clear filters
          </button>
        )}

        {onMoreFilters && (
          <button
            onClick={onMoreFilters}
            className="rounded-lg border border-border p-2 text-muted hover:bg-hover"
            aria-label="More filters"
          >
            <SlidersHorizontal size={16} />
          </button>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
