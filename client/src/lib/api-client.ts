import axios from 'axios'
import { networkEvents } from './network-events'

const BASE_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

apiClient.interceptors.response.use(
    (response) => {
        networkEvents.setApiAvailable(true)
        return response
    },
    (error) => {
        const status = error.response?.status
        if (!error.response) {
            networkEvents.setApiAvailable(false)
        }

        if (status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)
