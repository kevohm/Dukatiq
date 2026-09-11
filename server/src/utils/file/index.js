import { ulid } from 'ulid'

export const generateFileKey = (folder, fileName="") => {
    if (!folder || !fileName) {
        throw new Error(
            'Invalid data provided: folder and fileName are required'
        )
    }

    const safeFolder = folder.replace(/^\/+|\/+$/g, '')
    const safeFileName = fileName
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-_]/g, '')

    const id = ulid()

    return `${safeFolder}/${id}-${safeFileName}`
}
