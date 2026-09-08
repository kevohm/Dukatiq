import LogoutButton from '../shared/LogoutButton'
import ThemeTrigger from '../theme/ThemeTrigger'
import SidebarNav from './SidebarNav'
import { mainNav, secondaryNav } from './navigation'

export default function TabletSidebar() {
    return (
        <aside className="hidden md:flex lg:hidden h-screen w-20 flex-col justify-between dark:border-r dark:border-slate-900 bg-background p-3">
            <div className="space-y-6">
                <div className="flex justify-center">
                    <h1 className="text-lg font-bold">DQ</h1>
                </div>

                <SidebarNav items={mainNav} compact />

                <div className="dark:border-t dark:border-slate-900 pt-3">
                    <SidebarNav items={secondaryNav} compact />
                </div>
            </div>

            <div className="flex flex-col gap-6 justify-center">
                <ThemeTrigger />
                <LogoutButton />
            </div>
        </aside>
    )
}
