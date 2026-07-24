import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '../components/layout/AppShell'
import NotFound from '../errors/NotFound'
import { Providers } from '@/app/providers/Providers'
import { NetworkStatusToast } from '@/components/shared/NetworkStatusToast'

export const Route = createRootRoute({
    component: RouteComponent,
    notFoundComponent: NotFound,
})

function RouteComponent() {
    return (
        <Providers>
            <NetworkStatusToast />
            <Outlet />
        </Providers>
    )
}
