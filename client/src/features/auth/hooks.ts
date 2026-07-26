import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { authApi } from './api'
import { localAccessService, localSessionService } from '@/data/service'

const AUTH_KEY = ['auth']

/* -----------------------------
   LOGIN
------------------------------*/
export function useLogin() {
    // const qc = useQueryClient()

    return useMutation({
        mutationFn: authApi.login,
        // onSuccess: () => {
        //     qc.invalidateQueries({ queryKey: AUTH_KEY })
        // },

        onSuccess: async (response) => {
            const data = response
            try {
                await localSessionService.createSession({
                    user_id: data?.id,
                })
            } catch (err) {
                console.error(err)
            }
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
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
        onError: (error) => {
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
            }
        },
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
        onError: (error) => {
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
            }
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
        onError: (error) => {
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
            }
        },
    })
}

export function useSetOfflinePassword() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: authApi.localAccess,
        onSuccess: async () => {
            // const data = response.data

            qc.invalidateQueries({
                queryKey: AUTH_KEY,
            })
        },
        onError: (error) => {
            console.log(error)
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
            }
        },
    })
}

export function useVerifyOfflinePassword() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: localAccessService.verifyLocalAccess,
        onSuccess: async () => {
            // const data = response
            
            // No need we do not extend time unless on login
            // try {
            //     await localSessionService.touchSession(data?.user_id)
            // } catch {}

            qc.invalidateQueries({
                queryKey: AUTH_KEY,
            })
        },
        onError: (error) => {
            console.log(error)
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
            }
        },
    })
}
