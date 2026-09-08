import { Link } from '@tanstack/react-router'
import { cn } from '../../lib/cn'
import type { NavItem } from './types'
import { useIsActive } from '../../hooks/useIsActive'

type SidebarNavProps = {
    items: NavItem[]
    compact?: boolean
}

export default function SidebarNav({
    items,
    compact = false,
}: SidebarNavProps) {
    return (
        <nav className={cn('flex flex-col', compact ? 'gap-2' : 'gap-1')}>
            {items.map(({ name, path, icon: Icon }) => {
                const active = useIsActive(path)

                return (
                    <Link
                        key={path}
                        to={path}
                        title={compact ? name : undefined}
                        className={cn(
                            compact
                                ? 'flex items-center justify-center rounded-lg p-2.5 transition-colors'
                                : 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'bg-brand/10 text-brand'
                                : 'text-gray-600 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                        )}
                    >
                        <Icon size={18} />

                        {!compact && <span>{name}</span>}
                    </Link>
                )
            })}
        </nav>
    )
}
