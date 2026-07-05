import { useState } from "react";
import { cn } from "../../lib/utils";

export type ColumnDef<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T) => string;
  selectable?: boolean;
};

/**
 * Domain-agnostic table shell. Any feature (work orders, assets, inventory)
 * plugs in its own column config + row data — the table itself never
 * changes when a new module is added.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  selectable = true,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-gray-500">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.id} className="whitespace-nowrap px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const id = getRowId(row);
            return (
              <tr
                key={id}
                className="border-b border-border last:border-0 hover:bg-gray-50"
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(id)}
                      onChange={() => toggleRow(id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn("whitespace-nowrap px-4 py-3", col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
