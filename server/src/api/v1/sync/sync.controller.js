import { SyncService } from "./sync.service.js"

export const pull = async (req, res) => {
    const { collection, checkpoint, limit } = req.body

    const result = await SyncService.pull(collection, checkpoint, limit)

    res.json(result)
}

export const push = async (req, res) => {
    const { collection, docs } = req.body

    const result = await SyncService.push(collection, docs)

    res.json(result)
}
