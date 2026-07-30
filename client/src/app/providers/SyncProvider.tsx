import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback, // <-- Added
    type ReactNode,
} from 'react'
import { syncService } from '@/data/sync'
import { useOnlineStatus } from './OnlineProvider'

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'

interface SyncContextType {
    status: SyncStatus
    lastSyncedAt: Date | null
    syncNow: () => Promise<void>
}

const SyncContext = createContext<SyncContextType | null>(null)

export function SyncProvider({ children }: { children: ReactNode }) {
    const { isApiAvailable, isOnline } = useOnlineStatus()
    const [status, setStatus] = useState<SyncStatus>('idle')
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

    const canSync = isOnline && isApiAvailable

    // 1. Memoize syncNow so it doesn't re-create when `status` changes
    const syncNow = useCallback(async () => {
        if (!canSync) {
            console.log(`
                ..................................................
                ...................|----------------|.............
                ...................| PAUSED SYNCING |.............
                ...................|----------------|.............
                ..................................................
                `)
            setStatus('offline')
            return
        }

        try {
            setStatus('syncing')
            await syncService.start()
            setStatus('synced')
            setLastSyncedAt(new Date())
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }, [canSync]) // Only changes if network state changes

    // 2. Safely trigger auto-sync
    useEffect(() => {
        if (canSync) {
            syncNow()
        } else {
            setStatus('offline')
        }
    }, [canSync])

    return (
        <SyncContext.Provider value={{ status, lastSyncedAt, syncNow }}>
            {children}
        </SyncContext.Provider>
    )
}

export function useSync() {
    const context = useContext(SyncContext)
    if (!context) throw new Error('useSync must be used inside SyncProvider')
    return context
}
