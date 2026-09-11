import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from './api'
import {
    localAccessService,
    localSessionService,
    userService,
} from '@/data/service'

const AUTH_KEY = ['auth']

/**
 * It logs user in and creates record of user for offline use and also creates a session linked to that user record.
 * @returns {@type UseMutationResult<User, Error, ILoginPayload, unknown>}
 */
export function useLogin() {
    // const qc = useQueryClient()

    return useMutation({
        mutationFn: authApi.login,
        // onSuccess: () => {
        //     qc.invalidateQueries({ queryKey: AUTH_KEY })
        // },

        onSuccess: async (response) => {
            try {
                await userService.createOrFind({
                    ...response,
                    is_active: true,
                })
            } catch (err) {
                console.error(err)
            }
        },
    })
}

/* -----------------------------
   SIGN UP
------------------------------*/
export function useSignup() {
    return useMutation({
        mutationFn: authApi.signup,
    })
}
/* -----------------------------
   ME
------------------------------*/
export function useMe() {
    return useQuery({
        queryKey: [AUTH_KEY, 'me'],
        queryFn: authApi.me,
    })
}

/* -----------------------------
   LOGOUT
------------------------------*/
export function useLogout() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: AUTH_KEY })
        },
    })
}

/* -----------------------------
   REFRESH
------------------------------*/
export function useRefresh() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: authApi.refresh,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: AUTH_KEY })
        },
    })
}

/*--------------------------------

    OFFLINE FUNCTIONALITY

 --------------------------------*/

const OFFLINE_KEY = 'OFFLINE'

export function useSetOfflinePassword() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: localAccessService.setLocalAccess,
        onSuccess: async () => {
            // const data = response.data

            qc.invalidateQueries({
                queryKey: [OFFLINE_KEY, 'local-access', 'create'],
            })
        },
    })
}

export function useSetRecoveryQeustions() {
    return useMutation({
        mutationFn: authApi.localAccess,
    })
}

export function useVerifyOfflinePassword() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: localAccessService.verifyLocalAccess,
        onSuccess: async (_) => {
            // const data = response
            // console.log(reponse)

            // No need we do not extend time unless on login
            // try {
            //     await localSessionService.touchSession(data?.user_id)
            // } catch {}

            qc.invalidateQueries({
                queryKey: [OFFLINE_KEY, 'local-access', 'verify'],
            })
        },
    })
}

export function useUserHasLocalAccess() {
    return useQuery({
        queryFn: ()=>localAccessService.checkForUserLocalAccess(),
        queryKey: [OFFLINE_KEY, 'local-access', 'status'],
    })
}

export function useIsSessionRefreshRequired() {
    return useQuery({
        queryFn: ()=>localSessionService.hasSessionExpired(),
        queryKey: [OFFLINE_KEY, 'local-session', 'status'],
    })
}



export function useGetActiveUser() {
    return useQuery({
        queryFn: userService.getActiveUser,
        queryKey: [OFFLINE_KEY, 'user', "status"],
    })
}
