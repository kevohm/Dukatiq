import { useAuth } from '@/app/providers/AuthProvider'
import { useOfflineAuth } from '@/app/providers/OfflineAuthProvider'
import LoadingSection from '@/components/shared/LoadingSection'
import { Navigate } from '@tanstack/react-router'

const useProtectedAuth = () => {
        const { status, user } = useAuth()
        const { offlineUser, offlineStatus } = useOfflineAuth()

        const isLoading =
            status === 'loading' ||
            (status === 'offline' && offlineStatus === 'loading')

        if (isLoading) {
            return <LoadingSection />
        }

        if (status === 'offline') {
            if (offlineUser && offlineStatus === 'verified') {
                // if users is verified
                return <Navigate to="/" />
            }
        }

        /**
         *  online
         *  loggedin -> dashboard
         *  offline -> offline login
         *  error -> Display error
         *  notloggedin -> login
         */
        /**
         * offline
         * error -> no session created require login
         * loggedin -> dashboard
         * not logged in -> offline login
         */
        
  return {
    user: user ?? offlineUser,
    onlineStatus:status,
    offlineStatus, 
  }
}

export default useProtectedAuth