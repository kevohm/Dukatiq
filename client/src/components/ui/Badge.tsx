import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

/**
 * Generic pill badge. Domain-specific badges (PriorityBadge, StatusBadge)
 * should wrap this rather than duplicating the pill styles.
 */
export function Badge({ children, className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
