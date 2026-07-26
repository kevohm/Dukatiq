import { useAuth } from '@/app/providers/AuthProvider'
import OfflinePasswordVerificationForm from '@/features/auth/components/OfflinePasswordVerificationForm'
import { Link } from '@tanstack/react-router'

const VerifyLocalAccess = () => {
    const { status } = useAuth()

    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Verify Local Access</h2>

                <p className="text-sm text-gray-500 max-w-md">
                    Enter your local password to access Dukatiq without an
                    internet connection.
                </p>
            </div>

            <OfflinePasswordVerificationForm />

            {status == 'loggedin' && (
                <span className="text-sm">
                    Need to use another account?{' '}
                    <Link
                        to="/login"
                        className="text-brand hover:underline font-semibold"
                    >
                        Login
                    </Link>
                </span>
            )}
        </div>
    )
}

export default VerifyLocalAccess
