import { createRootRoute, Outlet } from '@tanstack/react-router'
import NotFound from '../errors/NotFound'
import { Providers } from '@/app/providers/Providers'
import RootWrapper from '@/app/wrappers/RootWrapper'

export const Route = createRootRoute({
    component: RouteComponent,
    notFoundComponent: NotFound,
})

function RouteComponent() {

 
    return (
        <Providers>
            <RootWrapper>
                <Outlet/>
            </RootWrapper>
        </Providers>
    )
}


