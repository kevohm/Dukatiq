
type Listener = (online: boolean) => void

const listeners = new Set<Listener>()

export const networkEvents = {
    subscribe(listener: Listener) {
        listeners.add(listener)

        return () => {
            listeners.delete(listener)
        }
    },

    setApiAvailable(value: boolean) {
        listeners.forEach((listener) => listener(value))
    },
}
