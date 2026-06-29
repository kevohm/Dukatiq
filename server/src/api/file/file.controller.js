import { config } from "../../config/env.config.js"
import { FileService } from "./file.service.js"


const URL_EXPIRES_IN = config.b2.signedUrl.expiresIn

export async function uploadSingleFile(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file provided' })
    }

    const key = await FileService.upload(req.file, 'files')
    const url = await FileService.getSignedFileUrl(key, URL_EXPIRES_IN)

    res.status(201).json({
        key,
        url,
        expires_in: URL_EXPIRES_IN,
    })
}

export async function deleteSingleFile(req, res) {
        const { key } = req.body

        if (!key) {
            return res.status(400).json({ message: 'File key is required' })
        }

        await FileService.deleteFile(key)

        res.json({ message: 'File deleted successfully' })
}

export async function getFileUrl(req, res) {
        const { key, expiresIn } = req.body

        if (!key) {
            return res.status(400).json({ message: 'key is required' })
        }

        const url = await FileService.getSignedFileUrl(
            key,
            expiresIn ? Number(expiresIn) : URL_EXPIRES_IN
        )

        res.json({
            url,
            expires_in: expiresIn || URL_EXPIRES_IN,
        })

}