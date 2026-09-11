import { useAuth } from '@/app/providers/AuthProvider'
import { useOfflineAuth } from '@/app/providers/OfflineAuthProvider'
import { useOnlineStatus } from '@/app/providers/OnlineProvider'
import { useNavigate } from '@tanstack/react-router'

export const useCommonLogout = () => {
    const { logout: onlineLogout } = useAuth()
    const { offlineLogout } = useOfflineAuth()
    const { isApiAvailable, isOnline } = useOnlineStatus()
    const navigate = useNavigate()

    const logout = async () => {
        if (isApiAvailable && isOnline) {
            // console.log('Using online logout')
            await onlineLogout()
            navigate({
                to: '/login',
            })
        } else {
            // console.log('Using offline logout')
            await offlineLogout()
            navigate({
                to: '/verify-access',
            })
        }
    }

    return { logout }
}
