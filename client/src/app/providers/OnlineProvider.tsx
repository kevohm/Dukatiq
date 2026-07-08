// providers/OnlineProvider.tsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { networkEvents } from '../../lib/network-events'
import { apiClient } from '../../lib/api-client'

type OnlineContextType = {
    isOnline: boolean
    isApiAvailable: boolean
}

const OnlineContext = createContext<OnlineContextType>({
    isOnline: true,
    isApiAvailable: true,
})

export const OnlineProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [isApiAvailable, setIsApiAvailable] = useState(true)

    const checkApi = async () => {
        try {
            await apiClient.get('/health')
            setIsApiAvailable(true)
        } catch {
            setIsApiAvailable(false)
        }
    }

    useEffect(() => {
        if (!isOnline) {
            setIsApiAvailable(false)
            return
        }

        // Initial check
        checkApi()

        // Poll every 30 seconds
        const interval = setInterval(checkApi, 30_000)

        return () => clearInterval(interval)
    }, [isOnline])

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => {
            setIsOnline(false)
            setIsApiAvailable(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        return networkEvents.subscribe((value) => {
            setIsApiAvailable(value)
        })
    }, [])

    const value = useMemo(
        () => ({
            isOnline,
            isApiAvailable,
            setIsApiAvailable,
        }),
        [isOnline, isApiAvailable]
    )

    return (
        <OnlineContext.Provider value={value as any}>
            {children}
        </OnlineContext.Provider>
    )
}

export const useOnlineStatus = () => useContext(OnlineContext)
