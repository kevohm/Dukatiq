import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'
import ThemeTrigger from '../theme/ThemeTrigger'
import SidebarNav from './SidebarNav'
import { mainNav, secondaryNav } from './navigation'
import { useAuth } from '@/app/providers/AuthProvider'

export default function DesktopSidebar() {
    const [compact, setCompact] = useState(false)

      const {user, lastLoginAt} = useAuth()
      console.log(user, lastLoginAt)
    return (
        <aside
            className={
                compact
                    ? 'hidden lg:flex h-screen w-20 flex-col justify-between border-r bg-background p-3 transition-all'
                    : 'hidden lg:flex h-screen w-64 flex-col justify-between border-r bg-background p-4 transition-all'
            }
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    {!compact && <h1 className="text-lg font-bold">Dukatiq</h1>}

                    <button
                        type="button"
                        onClick={() => setCompact(!compact)}
                        className={`${compact ? 'mx-auto' : ''} rounded-md p-2 hover:bg-accent`}
                    >
                        {compact ? (
                            <PanelLeftOpen size={18} />
                        ) : (
                            <PanelLeftClose size={18} />
                        )}
                    </button>
                </div>

                {!compact && (
                    <div className="rounded-xl border p-3">
                        <p className="font-medium">{user?.full_name}</p>
                        {
                            lastLoginAt &&
                        <p className="text-xs text-muted-foreground">
                            Last logged in at ({(new Date(lastLoginAt))?.toLocaleString()})
                        </p>
                        }
                    </div>
                )}

                <SidebarNav items={mainNav} compact={compact} />

                <div className="border-t pt-4">
                    <SidebarNav items={secondaryNav} compact={compact} />
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
                <ThemeTrigger />
                {/* {!compact && (
                    <span className="text-xs text-muted-foreground">
                        POS v1.0
                    </span>
                )} */}
            </div>
        </aside>
    )
}
