import { Search, User, MapPin, Calendar, Flag, Bookmark, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FilterButton = { label: string; icon: LucideIcon };

// Config-driven so other modules (Assets, Inventory) can reuse this bar
// with a different set of filters without rewriting the layout.
const filters: FilterButton[] = [
  { label: "Assigned to", icon: User },
  { label: "Location", icon: MapPin },
  { label: "Date", icon: Calendar },
  { label: "Priority", icon: Flag },
  { label: "Bookmarked", icon: Bookmark },
];

export function FilterBar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
      <div className="relative min-w-[220px] flex-1 max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {filters.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Icon size={16} />
          {label}
        </button>
      ))}

      <button
        className="rounded-lg border border-border p-2 text-gray-500 hover:bg-gray-50"
        aria-label="More filters"
      >
        <SlidersHorizontal size={16} />
      </button>
    </div>
  );
}
