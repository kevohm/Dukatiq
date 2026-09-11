import { useEffect, useRef } from 'react'
import { useOnlineStatus } from '../../app/providers/OnlineProvider'
import toast, { type ToastPosition } from 'react-hot-toast'

const opts = {
    duration: 5000,
    position: 'bottom-right' as ToastPosition,
}

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
                id: 'INTERNET-CONNECTION-LOST',
                ...opts
            })
        }
        // API became unavailable
        else if (
            isOnline &&
            !isApiAvailable &&
            previous.current.isApiAvailable
        ) {
            toast.error('Cannot connect to the server.', {
                id: 'API-CONNECTION-LOST',
                ...opts,
            })
        }
        // Only notify when recovering from an actual issue
        else if (isOnline && isApiAvailable && (wasOffline || wasApiDown)) {
            toast.success('Connection restored.', {
                id: 'CONNECTED-RESTORED',
                ...opts,
            })
        }

        previous.current = {
            isOnline,
            isApiAvailable,
        }
    }, [isOnline, isApiAvailable])

    return null
}
