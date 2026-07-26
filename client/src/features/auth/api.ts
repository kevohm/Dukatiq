import { api } from '../../lib/utils'
import type { ILocalAccessPayload, ILocalAccessResponse, ILoginPayload,  ISignupPayload, IVerifyLocalAccessPayload, User } from './types'



export const authApi = {
    me: () => api.getRaw<User>('/auth/me'),

    login: (data: ILoginPayload) => api.post<User>('/auth/login', data),

    signup: (data: ISignupPayload) => api.post<User>('/auth/signup', data),

    logout: () => api.post(`/auth/logout`),

    refresh: () => api.post(`/auth/refresh`),

    localAccess: (data: ILocalAccessPayload) =>
        api.postRaw<ILocalAccessResponse>('/auth/local-access', data)
}
