
import AuthWrapper from '@/features/auth/components/AuthWrapper'
import RecoveryQuestionForm from '@/features/recovery-questions/components/RecoveryQuestionForm'
import { Link } from '@tanstack/react-router'

const AccountRecovery = () => {

    return (
        <AuthWrapper>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold dark:text-slate-300">
                    Recover your account
                </h2>

                <p className="text-sm text-gray-500 max-w-md dark:text-slate-500">
                    Answer the following recovery questions to recover your
                    account.
                </p>
            </div>

            <RecoveryQuestionForm />

            <span className="text-sm dark:text-slate-500">
                Do you remember your account details?{' '}
                <Link
                    to="/login"
                    className="text-brand hover:underline font-semibold"
                >
                    Login
                </Link>
            </span>
        </AuthWrapper>
    )
}

export default AccountRecovery
