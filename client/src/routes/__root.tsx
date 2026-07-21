import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '../components/layout/AppShell'
import NotFound from '../errors/NotFound'

export const Route = createRootRoute({
    component: RouteComponent,
    notFoundComponent: NotFound,
})

function RouteComponent() {

    return (
        <AppShell>
            <Outlet />
        </AppShell>
    )
}
