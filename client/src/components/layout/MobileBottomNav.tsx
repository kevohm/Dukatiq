import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useIsActive } from '../../hooks/useIsActive'
import { mainNav } from './navigation'

type Props = {
    onMoreClick(): void
}

export default function MobileBottomNav({ onMoreClick }: Props) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t dark:border-slate-900 bg-white dark:bg-slate-950 md:hidden">
            <div className="flex">
                {mainNav.slice(0, 4).map(({ name, path, icon: Icon }) => {
                    const active = useIsActive(path)

                    return (
                        <Link
                            key={path}
                            to={path}
                            className={cn(
                                'flex flex-1 flex-col items-center py-2 text-[11px]',
                                active ? 'text-brand' : 'text-muted-foreground dark:text-slate-500'
                            )}
                        >
                            <Icon size={20} />
                            <span className="mt-1">{name}</span>
                        </Link>
                    )
                })}

                <button
                    onClick={onMoreClick}
                    className="flex flex-1 flex-col items-center py-2 text-[11px] text-muted-foreground dark:text-slate-500"
                >
                    <Menu size={20} />
                    <span className="mt-1">More</span>
                </button>
            </div>
        </div>
    )
}
