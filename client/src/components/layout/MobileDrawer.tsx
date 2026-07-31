import { X } from 'lucide-react'
import ThemeTrigger from '../theme/ThemeTrigger'
import SidebarNav from './SidebarNav'
import { secondaryNav } from './navigation'
import LogoutButton from '../shared/LogoutButton'
import { Button } from '../ui/Button'

type MobileDrawerProps = {
    open: boolean
    onClose: () => void
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 !z-[100] bg-black/40 md:hidden"
            onClick={onClose}
        >
            <div
                className="absolute bg-white  dark:text-slate-500  dark:bg-slate-950 bottom-0 left-0 right-0 rounded-t-2xl p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">More</h2>
                        <p className="text-sm text-muted-foreground">
                            Settings & preferences
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={onClose}
                        variant='ghost'
                    >
                        <X size={18} />
                    </Button>
                </div>

                <SidebarNav items={secondaryNav} />

                <div className="mt-6 flex items-center justify-between border-t dark:border-slate-900 pt-4">
                    <ThemeTrigger />
                    <LogoutButton/>
                    
                </div>
            </div>
        </div>
    )
}
