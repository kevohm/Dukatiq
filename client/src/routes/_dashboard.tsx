import { useAuth } from '@/app/providers/AuthProvider'
import { AppShell } from '@/components/layout/AppShell'
import LoadingSection from '@/components/shared/LoadingSection'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const {user, status} = useAuth()
  
  if(status === "loading"){
    return <LoadingSection/>
  }

  if(!user ){
    return <Navigate to="/login" replace />
  }
  
  return <AppShell>
              <Outlet />
          </AppShell>
}
