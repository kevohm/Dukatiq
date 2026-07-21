import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '@/data/sync/replication/sync.collections'
import { replicateRxCollection } from 'rxdb/plugins/replication'
import { syncApi } from '../../api'

export function replicateInventory(db: BusinessDatabase) {
    const collection = db.inventory
    const name = SyncCollections.INVENTORY

    return replicateRxCollection({
        collection,
        replicationIdentifier: `catalog/${name}`,
        autoStart: false,
        waitForLeadership: true,
        live: false,
        retryTime: 10000,
        push: {
            batchSize: 50,

            async handler(rows) {
                const unitIds = [
                    ...new Set(
                        //@ts-ignore
                        rows.map((row) => row.newDocumentState?.unit_id)
                    ),
                ]

                const units = await db.units
                    .find({
                        selector: {
                            id: {
                                $in: unitIds,
                            },
                        },
                    })
                    .exec()

                const unitMap = new Map(units.map((unit) => [unit.id, unit]))

                const transformed = rows.map((row) => {
                    const doc = row.newDocumentState
                    //@ts-ignore
                    const unit = unitMap.get(doc.unit_id)

                    return {
                        ...row,
                        newDocumentState: {
                            ...doc,
                            unit_name: unit?.name ?? null,
                        },
                    }
                })

                return syncApi.push(name, transformed)
            },

            modifier(doc) {
                return doc
            },
        },

        pull: {
            batchSize: 100,

            handler(checkpoint, batchSize) {
                return syncApi.pull(name, checkpoint, batchSize)
            },

            modifier(doc) {
                return doc
            },
        },
    })
}
