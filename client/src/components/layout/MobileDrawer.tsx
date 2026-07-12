import { X } from 'lucide-react'
import ThemeTrigger from '../theme/ThemeTrigger'
import SidebarNav from './SidebarNav'
import { secondaryNav } from './navigation'

type MobileDrawerProps = {
    open: boolean
    onClose: () => void
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={onClose}
        >
            <div
                className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-background p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">More</h2>
                        <p className="text-sm text-muted-foreground">
                            Settings & preferences
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-2 hover:bg-accent"
                    >
                        <X size={18} />
                    </button>
                </div>

                <SidebarNav items={secondaryNav} />

                <div className="mt-6 border-t pt-4">
                    <ThemeTrigger />
                </div>
            </div>
        </div>
    )
}
