import { RefreshCw, Check, WifiOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSync } from '@/app/providers/SyncProvider'

export function SyncStatusButton() {
    const { status, lastSyncedAt, syncNow } = useSync()


    const icon = {
        syncing: <RefreshCw className="animate-spin" size={16} />,
        synced: <Check size={16} />,
        offline: <WifiOff size={16} />,
        error: <AlertCircle size={16} />,
        idle: null,
    }[status]

    const label = {
        syncing: 'Syncing...',
        synced: 'Synced',
        offline: 'Offline',
        error: 'Sync failed',
        idle: 'Sync',
    }[status]

    return (
        <Button onClick={syncNow} disabled={status === 'syncing'} icon={icon}>
            {label}

            {lastSyncedAt && status === 'synced' && (
                <span className="text-xs opacity-70">
                    {lastSyncedAt.toLocaleTimeString()}
                </span>
            )}
        </Button>
    )
}
