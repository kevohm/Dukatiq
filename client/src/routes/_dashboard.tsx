import { AppShell } from '@/components/layout/AppShell'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppShell>
              <Outlet />
          </AppShell>
}
