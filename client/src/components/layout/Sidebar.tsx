import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Wrench,
  BarChart2,
  Inbox,
  Share2,
  MapPin,
  Package,
  Boxes,
  ShoppingCart,
  Gauge,
  Users,
  Store,
  ListChecks,
  FolderOpen,
  Network,
  Database,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

// Add a new module by adding one entry here — no other layout code changes.
const primaryNav: NavItem[] = [
  { label: "Work Orders", path: "/work-orders", icon: ClipboardList },
  { label: "Preventive Maintenance", path: "/preventive-maintenance", icon: Wrench },
  { label: "Analytics", path: "/analytics", icon: BarChart2 },
  { label: "Requests", path: "/requests", icon: Inbox },
  { label: "Shared Work Orders", path: "/shared-work-orders", icon: Share2 },
];

const secondaryNav: NavItem[] = [
  { label: "Locations", path: "/locations", icon: MapPin },
  { label: "Assets", path: "/assets", icon: Package },
  { label: "Parts & Inventory", path: "/inventory", icon: Boxes },
  { label: "Purchase Orders", path: "/purchase-orders", icon: ShoppingCart },
  { label: "Meters", path: "/meters", icon: Gauge },
  { label: "People & Teams", path: "/people", icon: Users },
  { label: "Vendors & Customers", path: "/vendors", icon: Store },
  { label: "Tasks", path: "/tasks", icon: ListChecks },
  { label: "Files & Documents", path: "/files", icon: FolderOpen },
  { label: "Edge", path: "/edge", icon: Network },
  { label: "Datahub", path: "/datahub", icon: Database },
];

function NavGroup({ items }: { items: NavItem[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map(({ label, path, icon: Icon }) => {
        const active = pathname.startsWith(path);
        return (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand/10 text-brand"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-sidebar px-3 py-4">
      <div className="flex flex-col gap-6 overflow-y-auto">
        <div className="px-2">
          {/* Replace with your logo */}
          <div className="h-8 w-32 rounded bg-gray-200" />
        </div>

        <NavGroup items={primaryNav} />
        <div className="h-px bg-border" />
        <NavGroup items={secondaryNav} />
      </div>

      <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-100">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
        <span className="text-sm font-medium text-gray-800">Royal Parvej</span>
      </div>
    </aside>
  );
}
