import { useRouterState } from '@tanstack/react-router'

export function useIsActive(path: string) {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    })

    if (path === '/') {
        return pathname === '/'
    }

    return pathname.startsWith(path)
}
