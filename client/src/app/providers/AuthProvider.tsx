import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import type { User } from '@/features/auth/types'
import { useOnlineStatus } from './OnlineProvider'
import { api } from '@/lib/utils'
import { localSessionService } from '@/data/service'

type LoginStatus = 'loggedin' | 'notloggedin' | 'error' | 'offline' | 'loading'

interface AuthContextType {
    status: LoginStatus
    lastLoginAt: Date | null
    user: User | null
    getCurrentUser: () => Promise<void>
    logout: () => Promise<void>
}

const STORAGE_KEY_USER_ID = 'current_user_id'
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isApiAvailable, isOnline } = useOnlineStatus()
    const [status, setStatus] = useState<LoginStatus>('loading')
    const [lastLoginAt, setLastLoginAt] = useState<Date | null>(null)
    const [user, setUser] = useState<User | null>(null)


    const getCurrentUser = async () => {
        setStatus('loading')

        // ----------------------------------------------------
        // 1. ONLINE MODE: Fetch from Server API
        // ----------------------------------------------------
        if (isApiAvailable && isOnline) {
            try {
                const data = await api.getRaw<User>('/auth/me')
                const currentUser = data?.data ?? null

                if (currentUser) {
                    setUser(currentUser)
                    setStatus('loggedin')
                    setLastLoginAt(new Date())

                    // Persist user ID locally for offline lookups
                    localStorage.setItem(STORAGE_KEY_USER_ID, currentUser.id)
                } else {
                    setUser(null)
                    setStatus('notloggedin')
                }
            } catch (error: any) {
                if (error?.status === 401) {
                    await logout()
                    return
                }
                setUser(null)
                setStatus('error')
            }
            return
        }

        // ----------------------------------------------------
        // 2. OFFLINE MODE: Check Local RxDB Session
        // ----------------------------------------------------
        const storedUserId = localStorage.getItem(STORAGE_KEY_USER_ID)

        if (!storedUserId) {
            setUser(null)
            setStatus('offline')
            return
        }

        try {
            // Validate offline session in RxDB
            const activeSession = await localSessionService.getSession(storedUserId)

            if (activeSession) {
                setUser({ id: storedUserId } as User) // Basic offline user payload
                setStatus('loggedin')
                setLastLoginAt(new Date(activeSession.last_verified_at))
            } else {
                // Session expired or missing
                setUser(null)
                setStatus('offline')
            }
        } catch (error) {
            console.error('Failed to verify local offline session:', error)
            setUser(null)
            setStatus('error')
        }
    }

    const logout = async () => {
        const storedUserId = localStorage.getItem(STORAGE_KEY_USER_ID)

        // Clear local session in RxDB
        if (storedUserId) {
            await localSessionService.deleteSession(storedUserId)
        }

        // Clear local storage
        localStorage.removeItem(STORAGE_KEY_USER_ID)

        // Call backend logout if online
        if (isApiAvailable && isOnline) {
            try {
                await api.getRaw('/auth/logout')
            } catch {
                // Ignore API logout failures offline
            }
        }

        setUser(null)
        setStatus('notloggedin')
        // window.location.href = '/login'
    }

    useEffect(() => {
        getCurrentUser()
    }, [isApiAvailable, isOnline])

    return (
        <AuthContext.Provider
            value={{ status, lastLoginAt, user, getCurrentUser, logout }}
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
