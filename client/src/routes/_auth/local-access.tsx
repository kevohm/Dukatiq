
import SetLocalAccess from '@/pages/auth/SetLocalAccess'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/local-access')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SetLocalAccess/>
}
