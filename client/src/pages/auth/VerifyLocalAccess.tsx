import { useOnlineStatus } from '@/app/providers/OnlineProvider'
import LoadingSection from '@/components/shared/LoadingSection'
import AuthWrapper from '@/features/auth/components/AuthWrapper'
import OfflinePasswordVerificationForm from '@/features/auth/components/OfflinePasswordVerificationForm'
import {
    useIsSessionRefreshRequired,
    useUserHasLocalAccess,
} from '@/features/auth/hooks'
import { Link, Navigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'

const VerifyLocalAccess = () => {
    const { isOnline, isApiAvailable } = useOnlineStatus()

    //  return boolen
    const sessionValidityQuery = useIsSessionRefreshRequired()
    // return boolean
    const offlineAvailabilityQuery = useUserHasLocalAccess()

    if (
        offlineAvailabilityQuery?.isLoading ||
        sessionValidityQuery?.isLoading
    ) {
        return <LoadingSection />
    }

    if (!offlineAvailabilityQuery?.data) {
        toast.error(
            'Oops! It seems you have not set offline password. Login first then we will guide you',
            {
                id: 'LOCAL_ACCESS_NOT_FOUND',
                duration: 5000,
            }
        )
        return <Navigate to="/login" />
    }

    if (sessionValidityQuery?.data) {
        toast.error(
            'Oops! Your session has expired or is corrupt. Please verify using your offline password to regain access to pos',
            {
                id: 'LOCAL_SESSION_EXPIRED',
                duration: 5000
            }
        )
    }

    return (
        <AuthWrapper>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold dark:text-slate-300">
                    Verify Local Access
                </h2>

                <p className="text-sm text-gray-500 dark:text-slate-500 max-w-md">
                    Enter your local password to access Dukatiq without an
                    internet connection.
                </p>
            </div>

            <OfflinePasswordVerificationForm />

            {isApiAvailable && isOnline && (
                <span className="text-sm dark:text-slate-500">
                    Need to use another account?{' '}
                    <Link
                        to="/login"
                        className="text-brand hover:underline font-semibold"
                    >
                        Login
                    </Link>
                </span>
            )}
        </AuthWrapper>
    )
}

export default VerifyLocalAccess
