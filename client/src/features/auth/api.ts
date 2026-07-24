import { api } from '../../lib/utils'
import type { ILoginPayload, ISignupPayload, User } from './types'



export const authApi = {
    me: () => api.get<User>('/auth/me'),

    login: (data: ILoginPayload) => api.post<User>('/auth/login', data),

    signup: (data: ISignupPayload) => api.post<User>('/auth/signup', data),

    logout: () => api.post(`/auth/logout`),

    refresh: () => api.post(`/auth/refresh`),

}
