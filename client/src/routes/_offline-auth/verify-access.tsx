import VerifyLocalAccess from '@/pages/auth/VerifyLocalAccess'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_offline-auth/verify-access')({
  component: RouteComponent,
})

function RouteComponent() {
  return <VerifyLocalAccess/>
}
