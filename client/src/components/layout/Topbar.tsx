import type { ReactNode } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '../ui/Button'

type TopbarProps = {
    title: string
    actions?: ReactNode // e.g. <Button>New Work Order</Button>
    toggles?: ReactNode // e.g. Auto Refresh switch
}

export function Topbar({ title, actions, toggles }: TopbarProps) {
    return (
        <header className="flex items-center justify-between px-6 py-5">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

            <div className="flex items-center gap-4">
                {toggles}
                <Button
                    type="button"
                    variant="secondary"
                    className="relative rounded-full p-2 "
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>
                {actions}
            </div>
        </header>
    )
}
