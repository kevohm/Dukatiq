import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from '../../lib/cn'
import type { ColumnDef, DataTableProps, SortDirection, SortState } from "./types";




export function DataTable<T>({
  columns,
  data,
  getRowId,
  selectable = true,
  sort: controlledSort,
  onSortChange,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [internalSort, setInternalSort] = useState<SortState>({
    columnId: "",
    direction: null,
  });

  const sort = controlledSort ?? internalSort;
  const isControlled = controlledSort !== undefined || onSortChange !== undefined;

  const allSelected = data.length > 0 && selected.size === data.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(data.map(getRowId)));
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSortClick(col: ColumnDef<T>) {
    if (!col.sortable) return;
    const direction: SortDirection =
      sort.columnId !== col.id
        ? "asc"
        : sort.direction === "asc"
        ? "desc"
        : sort.direction === "desc"
        ? null
        : "asc";
    const next: SortState = { columnId: direction ? col.id : "", direction };
    onSortChange ? onSortChange(next) : setInternalSort(next);
  }

  const sortedData = useMemo(() => {
    if (isControlled) return data; // parent owns ordering
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col?.sortValue || !sort.direction) return data;
    const sign = sort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return -1 * sign;
      if (av > bv) return 1 * sign;
      return 0;
    });
  }, [data, sort, columns, isControlled]);

  return (
      <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
              <thead>
                  <tr className="border-b border-border dark:border-slate-900 text-left text-muted dark:text-slate-500">
                      {selectable && (
                          <th className="w-10 px-4 py-3">
                              <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={toggleAll}
                                  className="h-4 w-4 rounded border-border dark:border-slate-900"
                              />
                          </th>
                      )}
                      {columns.map((col) => {
                          const active =
                              sort.columnId === col.id && sort.direction
                          return (
                              <th
                                  key={col.id}
                                  className="whitespace-nowrap px-4 py-3 font-medium"
                              >
                                  {col.sortable ? (
                                      <button
                                          type="button"
                                          onClick={() => handleSortClick(col)}
                                          className={cn(
                                              'inline-flex items-center gap-1 hover:text-heading dark:text-slate-600 dark:hover:text-slate-400',
                                              active &&
                                                  'text-heading dark:text-slate-400 dark:hover:text-slate-300'
                                          )}
                                      >
                                          {col.header}
                                          {sort.columnId === col.id &&
                                          sort.direction === 'asc' ? (
                                              <ChevronUp size={14} />
                                          ) : sort.columnId === col.id &&
                                            sort.direction === 'desc' ? (
                                              <ChevronDown size={14} />
                                          ) : (
                                              <ChevronsUpDown
                                                  size={14}
                                                  className="text-muted/60"
                                              />
                                          )}
                                      </button>
                                  ) : (
                                      col.header
                                  )}
                              </th>
                          )
                      })}
                  </tr>
              </thead>
              <tbody>
                  {sortedData.map((row) => {
                      const id = getRowId(row)
                      return (
                          <tr
                              key={id}
                              className="border-b border-border dark:border-slate-900 last:border-0 hover:bg-hover"
                          >
                              {selectable && (
                                  <td className="px-4 py-3">
                                      <input
                                          type="checkbox"
                                          checked={selected.has(id)}
                                          onChange={() => toggleRow(id)}
                                          className="h-4 w-4 rounded border-border dark:border-slate-900"
                                      />
                                  </td>
                              )}
                              {columns.map((col) => (
                                  <td
                                      key={col.id}
                                      className={cn(
                                          'whitespace-nowrap px-4 py-3 dark:text-slate-500',
                                          col.className
                                      )}
                                  >
                                      {col.cell(row)}
                                  </td>
                              ))}
                          </tr>
                      )
                  })}
              </tbody>
          </table>

          {sortedData.length === 0 && (
              <div className="py-12 text-center text-sm text-muted dark:text-slate-500">
                  No results found.
              </div>
          )}
      </div>
  )
}
