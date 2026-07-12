import { useState } from 'react'
import DesktopSidebar from './DesktopSidebar'
import TabletSidebar from './TabletSidebar'
import MobileBottomNav from './MobileBottomNav'
import MobileDrawer from './MobileDrawer'

export function Sidebar() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            <DesktopSidebar />

            <TabletSidebar />

            <MobileBottomNav onMoreClick={() => setDrawerOpen(true)} />

            <MobileDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    )
}
