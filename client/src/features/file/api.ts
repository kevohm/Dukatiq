import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../lib/utils'
import type { FileUploadResult, FileUrlResult, UploadFileInput } from './types'

export const fileApi = {
    upload: async ({ file, folder }: UploadFileInput) => {
        const formData = new FormData()
        formData.append('file', file)

        if (folder) {
            formData.append('folder', folder)
        }

        const response = await apiClient.post<ApiResponse<FileUploadResult>>(
            '/file/upload',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        return response.data.data
    },

    remove: async (key: string) => {
        await apiClient.delete('/file/delete', { data: { key } })
    },

    getUrl: async (key: string, expiresIn = 3600) => {
        const response = await apiClient.get<ApiResponse<FileUrlResult>>(
            '/file/url',
            { params: { key, expiresIn } }
        )

        return response.data.data
    },
}
