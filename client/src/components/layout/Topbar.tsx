import type { ReactNode } from 'react'
// import { Bell } from 'lucide-react'
// import { Button } from '../ui/Button'
import { SyncStatusButton } from '../shared/SyncStatusButton'

type TopbarProps = {
    title: string | ReactNode
    subTitle?: string
    actions?: ReactNode // e.g. <Button>New Work Order</Button>
    toggles?: ReactNode // e.g. Auto Refresh switchqw
}


export function Topbar({ title, subTitle, actions, toggles }: TopbarProps) {
    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 flex items-center justify-between px-6 py-4 border-b border-border dark:border-slate-800 mb-5">
            <div className="">
                <h1 className="text-2xl capitalize font-bold text-gray-900 dark:text-slate-300">
                    {title}
                </h1>
                {subTitle && (
                    <p className="text-sm text-gray-500 mt-1">{subTitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {toggles}
                <SyncStatusButton/>
                {/* <Button
                    type="button"
                    variant="secondary"
                    className="relative rounded-full p-2 "
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
                </Button> */}
                {actions}
            </div>
        </header>
    )
}
