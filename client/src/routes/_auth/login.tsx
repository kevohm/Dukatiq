import Login from '@/pages/auth/Login'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Login />
}
