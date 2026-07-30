import { api } from '../../lib/utils'
import type { IRecoveryQuestionsPayload } from './types'

export const recoveryApi = {
    add: (data: IRecoveryQuestionsPayload) =>
        api.post<IRecoveryQuestionsPayload>('/auth/local-access', data),
}
