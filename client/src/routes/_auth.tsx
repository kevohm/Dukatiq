import { useOnlineStatus } from '@/app/providers/OnlineProvider'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const {isOnline, isApiAvailable} = useOnlineStatus()

  if(!isOnline || !isApiAvailable){
    return <Navigate to="/verify-access"/>
  }
  return (
      <div>
          <Outlet />
      </div>
  )
}
