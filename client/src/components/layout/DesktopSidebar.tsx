import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'
import ThemeTrigger from '../theme/ThemeTrigger'
import SidebarNav from './SidebarNav'
import { mainNav, secondaryNav } from './navigation'
import LogoutButton from '../shared/LogoutButton'
import useActiveUser from '@/hooks/useActiveUser'
import { Button } from '../ui/Button'

export default function DesktopSidebar() {
    const [compact, setCompact] = useState(false)

    const { user } = useActiveUser()

    return (
        <aside
            className={
                compact
                    ? 'hidden lg:flex h-screen w-20 flex-col justify-between dark:border-r dark:border-slate-900  bg-background  p-3 transition-all'
                    : 'hidden lg:flex h-screen w-64 flex-col justify-between dark:border-r dark:border-slate-900 bg-background p-4 transition-all'
            }
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    {!compact && (
                        <h1 className="text-xl font-bold text-brand-hover">
                            Dukatiq
                        </h1>
                    )}

                    <Button
                        type="button"
                        onClick={() => setCompact(!compact)}
                        variant="ghost"
                        className={`${compact ? 'mx-auto' : ''} `}
                    >
                        {compact ? (
                            <PanelLeftOpen size={18} />
                        ) : (
                            <PanelLeftClose size={18} />
                        )}
                    </Button>
                </div>

                {!compact && (
                    <div className="rounded-xl border border-slate-500/20 dark:border-slate-800  p-3">
                        <p className="font-semibold text-sm dark:text-slate-400 capitalize ">
                            {user?.full_name}
                        </p>
                        {user?.lastLoginAt && (
                            <div className="flex flex-col space-y-1 text-xs text-muted">
                                <p>Last logged in at</p>
                                <p>
                                    {new Date(
                                        user?.lastLoginAt
                                    )?.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <SidebarNav items={mainNav} compact={compact} />

                <div className="border-t dark:border-slate-800  pt-4">
                    <SidebarNav items={secondaryNav} compact={compact} />
                </div>
            </div>

            <div className="flex items-center justify-between border-t dark:border-slate-800 pt-3">
                <ThemeTrigger />
                <LogoutButton />
                {/* {!compact && (
                    <span className="text-xs text-muted-foreground">
                        POS v1.0
                    </span>
                )} */}
            </div>
        </aside>
    )
}
