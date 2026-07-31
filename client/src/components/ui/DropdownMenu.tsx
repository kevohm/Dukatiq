import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export const DropdownMenu = DropdownMenuPrimitive.Root

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) => (
    <DropdownMenuPrimitive.Content
        sideOffset={6}
        className={cn(
            'z-50 min-w-[180px] rounded-lg border border-border dark:border-slate-900 bg-surface dark:bg-slate-950 p-1 shadow-lg',
            className
        )}
        {...props}
    />
)

export const DropdownMenuItem = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item>) => (
    <DropdownMenuPrimitive.Item
        className={cn(
            'flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-heading dark:text-gray-500 outline-none transition-colors',
            'focus:bg-hover dark:hover:text-gray-400',
            className
        )}
        {...props}
    />
)

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
