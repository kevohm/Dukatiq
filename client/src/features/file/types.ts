export type FileUploadResult = {
    key: string
    url: string
    expires_in: number
}

export type FileUrlResult = {
    url: string
    expires_in: number
}

export type UploadFileInput = {
    file: File
    folder?: string
}
