import { useAuth } from '@/app/providers/AuthProvider'
import { useOfflineAuth } from '@/app/providers/OfflineAuthProvider'
import { useOnlineStatus } from '@/app/providers/OnlineProvider'
import { AppShell } from '@/components/layout/AppShell'
import { useIsSessionRefreshRequired } from '@/features/auth/hooks'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    const { status, user } = useAuth()
    const { offlineUser, offlineStatus } = useOfflineAuth()
    const { isApiAvailable, isOnline } = useOnlineStatus()
    const { isLoading, data: hasSessionExpired } = useIsSessionRefreshRequired()

    if (status === 'offline' && offlineStatus !== 'loading') {

        if (!offlineUser && hasSessionExpired && !isLoading) {
            // console.log(offlineUser, offlineStatus, hasSessionExpired)
            // if users not verified via offline password login
            return <Navigate to="/verify-access" />
        }
        // if (offlineUser && !hasSessionExpired) {
        //     // if users is verified
        //     return <Navigate to="/" />
        // }
    } else {
        if (
            !user &&
            isApiAvailable &&
            isOnline &&
            (status === 'error' || status === 'notloggedin')
        ) {
            // not logged in via api
            return <Navigate to="/login" />
        }
    }
    return (
        <AppShell>
            <Outlet />
        </AppShell>
    )
}
