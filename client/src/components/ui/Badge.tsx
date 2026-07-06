import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'



/**
 * Central color map for badges/tags. Add a new module (e.g. "status",
 * "category") by mapping its values to one of these keys — never invent
 * new bg/text class pairs inline in a feature component.
 */
export const badgeColors = {
  green: "bg-green-bg text-green-text",
  orange: "bg-orange-bg text-orange-text",
  red: "bg-red-bg text-red-text",
  gray: "bg-hover text-muted",
} as const;

export type BadgeColor = keyof typeof badgeColors;

type BadgeProps = {
    children: ReactNode
    color?: BadgeColor
    className?: string
    icon?: ReactNode
}


/**
 * Generic tag/badge. Pass a `color` key (see badge-colors.ts) rather than
 * hand-writing bg/text classes — this is what makes it reusable across
 * PriorityBadge, StatusBadge, CategoryBadge, etc.
 */
export function Badge({
    children,
    color = 'gray',
    className,
    icon,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium',
                badgeColors[color],
                className
            )}
        >
            {icon}
            {children}
        </span>
    )
}
