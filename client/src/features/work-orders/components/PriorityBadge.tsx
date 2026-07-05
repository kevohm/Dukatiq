import { Flag } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import type { Priority } from "../types";

const config: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-priority-low-bg text-priority-low-text" },
  medium: {
    label: "Medium",
    className: "bg-priority-medium-bg text-priority-medium-text",
  },
  high: { label: "High", className: "bg-priority-high-bg text-priority-high-text" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = config[priority];
  return (
    <Badge className={className} icon={<Flag size={12} fill="currentColor" />}>
      {label}
    </Badge>
  );
}
