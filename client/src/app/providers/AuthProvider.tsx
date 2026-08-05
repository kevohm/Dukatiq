import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import type { IUser, User } from '@/features/auth/types'
import { useOnlineStatus } from './OnlineProvider'
import { api } from '@/lib/utils'
import { userService } from '@/data/service'

type LoginStatus = 'loggedin' | 'notloggedin' | 'error' | 'offline' | 'loading'

interface AuthContextType {
    status: LoginStatus
    user: IUser | null
    getCurrentUser: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isApiAvailable, isOnline } = useOnlineStatus()
    const [status, setStatus] = useState<LoginStatus>('loading')
    const [user, setUser] = useState<IUser | null>(null)

    const getCurrentUser = async () => {
        setStatus('loading')
        // ----------------------------------------------------
        // 1. ONLINE MODE: Fetch from Server API
        // ----------------------------------------------------

        try {
            const data = await api.getRaw<User>('/auth/me')
            const currentUser = data?.data ?? null
            if (!currentUser) throw new Error('Invalid session')
            const activeUser = await userService.getActiveUser()

            setUser({
                ...currentUser,
                lastLoginAt: activeUser ? activeUser?.updated_at : null,
            })
            setStatus('loggedin')
        } catch (error: any) {
            if (error?.message === 'You seem to be offline') {
                setStatus('offline')
            } else {
                setUser(null)
                setStatus('error')
            }
            if (error?.status === 403) {
                
                try {
                    await api.postRaw('/auth/refresh')
                } catch {
                    // Ignore API logout failures offlines
                }
            }

            if(error?.status === 401){
                  try {
                      await api.postRaw('/auth/logout')
                  } catch {
                      // Ignore API logout failures offline
                  }
            }
        }
    }

    const logout = async () => {
        try {
            await api.getRaw('/auth/logout')
        } catch {
            // Ignore API logout failures offline
        }
        setUser(null)
        setStatus('notloggedin')
        // window.location.href = '/login'
    }
    useEffect(() => {
        if (!isApiAvailable || !isOnline) return
        getCurrentUser()
    }, [isApiAvailable, isOnline])

    return (
        <AuthContext.Provider
            value={{
                status,
                user,
                getCurrentUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}
