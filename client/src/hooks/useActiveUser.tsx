import { useAuth } from '@/app/providers/AuthProvider'
import { useOfflineAuth } from '@/app/providers/OfflineAuthProvider'
import { useOnlineStatus } from '@/app/providers/OnlineProvider'

const useActiveUser = () => {
    const { user: onlineUser, status: OnlineStatus } = useAuth()
    const { offlineStatus, offlineUser } = useOfflineAuth()
    const { isApiAvailable, isOnline } = useOnlineStatus()

    return isApiAvailable && isOnline
        ? { user: onlineUser, isLoading: OnlineStatus === 'loading' }
        : { user: offlineUser, isLoading: offlineStatus === 'loading' }
}

export default useActiveUser
