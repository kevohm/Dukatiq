import AuthWrapper from '@/features/auth/components/AuthWrapper'
import RecoveryQuestionForm from '@/features/recovery-questions/components/RecoveryQuestionForm'

const SetRecoveryQuestions = () => {
    return (
       <AuthWrapper>

           <div className="text-center space-y-2">
               <h2 className="text-2xl font-bold dark:text-slate-300">
                   Set Recovery Questions
               </h2>

               <p className="text-sm text-gray-500 max-w-md dark:text-slate-500">
                   These recovery questions are usefull when you need to
                   recover your account.
               </p>
           </div>

           <RecoveryQuestionForm />
       </AuthWrapper>

    )
}

export default SetRecoveryQuestions
