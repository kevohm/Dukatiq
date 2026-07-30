import SetRecoveryQuestions from '@/pages/recovery/SetRecoveryQuestions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_account/set-recovery-questions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SetRecoveryQuestions/>
}
