import AccountRecovery from '@/pages/recovery/AccountRecovery'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_account/recover')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountRecovery/>
}
