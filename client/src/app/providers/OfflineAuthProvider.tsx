import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import type { IUser } from '@/features/auth/types'
import { useOnlineStatus } from './OnlineProvider'
import { localSessionService, userService } from '@/data/service'

type LoginStatus = 'loggedin' | 'notloggedin' | 'error' | 'loading' | 'verified'

interface OfflineAuthContextType {
    offlineStatus: LoginStatus
    offlineUser: IUser | null
    getCurrentOfflineUser: () => Promise<void>
    offlineLogout: () => Promise<void>
}

const OfflineAuthContext = createContext<OfflineAuthContextType | null>(null)

export function OfflineAuthProvider({ children }: { children: ReactNode }) {
    const { isApiAvailable, isOnline } = useOnlineStatus()
    const [user, setUser] = useState<IUser | null>(null)
    const [status, setStatus] = useState<LoginStatus>('loading')

    const getCurrentOfflineUser = async () => {
        setStatus('loading')
        try {
            // Validate offline session in RxDB
            const activeUser = await userService.getActiveUser()
            const storedUserId = activeUser?.id


            if (!storedUserId)
                throw Error('Invalid offline session', {
                    cause: 'offline provider',
                })

            const activeSession =
                await localSessionService.getSession(storedUserId)



            if (!activeSession) {
                setStatus('error')
                setUser(null)
                return
            }


            setUser({
                id: storedUserId,
                email: activeUser?.email,
                full_name: activeUser?.full_name,
                lastLoginAt: activeSession?.last_verified_at
            } ) // Basic offline user payload
            setStatus('loggedin')
        } catch (error) {
            console.error('Failed to verify local offline session:', error)
            try {
                await localSessionService.deleteActiveSession()
            } catch {}
            
            setStatus('error')
            setUser(null)
        }
    }

    const offlineLogout = async () => {
        try {
            await localSessionService.deleteActiveSession()
        } catch {}
        setUser(null)
        setStatus('notloggedin')
    }

    useEffect(() => {
        if (isApiAvailable && isOnline) return
        getCurrentOfflineUser()
    }, [isApiAvailable, isOnline])

    return (
        <OfflineAuthContext.Provider
            value={{
                offlineLogout,
                getCurrentOfflineUser,
                offlineUser: user,
                offlineStatus: status,
            }}
        >
            {children}
        </OfflineAuthContext.Provider>
    )
}

export function useOfflineAuth() {
    const context = useContext(OfflineAuthContext)
    if (!context)
        throw new Error(
            'useOfflineAuth must be used inside OfflineAuthProvider'
        )
    return context
}
