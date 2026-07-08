import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useOnlineStatus } from '../../app/providers/OnlineProvider'

const TOAST_ID = 'network-status'

export function NetworkStatusToast() {
    const { isOnline, isApiAvailable } = useOnlineStatus()

    const mounted = useRef(false)
    const previous = useRef({
        isOnline,
        isApiAvailable,
    })

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            previous.current = { isOnline, isApiAvailable }
            return
        }

        const wasOffline = !previous.current.isOnline
        const wasApiDown = !previous.current.isApiAvailable

        // Internet lost
        if (!isOnline && previous.current.isOnline) {
            toast.error("You're offline.", {
                id: TOAST_ID,
                duration: Infinity,
            })
        }
        // API became unavailable
        else if (
            isOnline &&
            !isApiAvailable &&
            previous.current.isApiAvailable
        ) {
            toast.error('Cannot connect to the server.', {
                id: TOAST_ID,
                duration: Infinity,
            })
        }
        // Only notify when recovering from an actual issue
        else if (isOnline && isApiAvailable && (wasOffline || wasApiDown)) {
            toast.success('Connection restored.', {
                id: TOAST_ID,
                duration: 3000,
            })
        }

        previous.current = {
            isOnline,
            isApiAvailable,
        }
    }, [isOnline, isApiAvailable])

    return null
}
