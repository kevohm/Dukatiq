import axios from 'axios'
import { networkEvents } from './network-events'
import { parseError } from '../errors/error'

const BASE_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials:true
})

// apiClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token')

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
// })

apiClient.interceptors.response.use(
    (response) => {
        networkEvents.setApiAvailable(true)
        return response
    },
    async (error) => {
        // const status = error.response?.status
        const isOffline =
            !error.response &&
            (!error.response?.status || !error?.status) &&
            error?.message?.includes('Network Error')
       
        if (isOffline) {
            networkEvents.setApiAvailable(false)
        }

        const err = parseError(error, isOffline)
        return Promise.reject(err)
    }
)
