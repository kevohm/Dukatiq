import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'



/**
 * Central color map for badges/tags. Add a new module (e.g. "status",
 * "category") by mapping its values to one of these keys — never invent
 * new bg/text class pairs inline in a feature component.
 */
export const badgeColors = {
    green: 'bg-green-bg text-green-text',
    blue: 'bg-blue-bg text-blue-text',
    orange: 'bg-orange-bg text-orange-text',
    purple: 'bg-purple-bg text-purple-text',
    red: 'bg-red-bg text-red-text',
    gray: 'bg-gray-bg text-gray-text',
} as const


export type BadgeColor = keyof typeof badgeColors;


export const badgeSizes = {
    default: 'px-2.5 py-1 text-xs',
    sm: 'text-sm',
    lg: 'text-base',
} as const

export type BadgeSize = keyof typeof badgeSizes


type BadgeProps = {
    children: ReactNode
    color?: BadgeColor
    className?: string
    icon?: ReactNode
    size?:BadgeSize
}





/**
 * Generic tag/badge. Pass a `color` key (see badge-colors.ts) rather than
 * hand-writing bg/text classes — this is what makes it reusable across
 * PriorityBadge, StatusBadge, CategoryBadge, etc.
 */
export function Badge({
    children,
    color = 'gray',
    size = "default",
    className,
    icon,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1  font-medium',
                badgeColors[color],
                badgeSizes[size],
                className
            )}
        >
            {icon}
            {children}
        </span>
    )
}
