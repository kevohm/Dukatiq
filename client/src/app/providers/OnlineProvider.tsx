// providers/OnlineProvider.tsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { networkEvents } from '../../lib/network-events'
import { apiClient, BASE_URL } from '../../lib/api-client'

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
            // reset from v1 to base
            await apiClient.get('/health', {
                baseURL: BASE_URL
            })
            setIsApiAvailable(true)
        } catch (error: any) {
            if (error?.message?.includes('You seem to be offline')) {
                setIsOnline(false)
            }
            setIsApiAvailable(false)
        }
    }

    useEffect(() => {
        // console.log(isApiAvailable, isOnline)
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
