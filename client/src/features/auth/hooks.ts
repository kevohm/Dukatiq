import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { authApi } from './api'

const AUTH_KEY = ['auth']

/* -----------------------------
   LOGIN
------------------------------*/
export function useLogin() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: authApi.login,
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
        queryFn: () => authApi.me,
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
