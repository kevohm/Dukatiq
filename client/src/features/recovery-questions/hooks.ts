import {  useMutation, } from '@tanstack/react-query'
import {  recoveryApi } from './api'

const RECOVERY_KEY = 'recovery-questions'

export function useSetRecoveryQeustions() {
    return useMutation({
        mutationFn: recoveryApi.add,
        mutationKey: [RECOVERY_KEY]
    })
}
