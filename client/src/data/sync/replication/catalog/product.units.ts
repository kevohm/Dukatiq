import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '../sync.collections'
import { replicateRxCollection } from 'rxdb/plugins/replication'
import { syncApi } from '../../api'
import { baseConfig } from '../../config'

export function replicateProductUnits(db: BusinessDatabase) {
    const collection = db.productUnits
    const name = SyncCollections.PRODUCTUNIT

    return replicateRxCollection({
        collection,
        replicationIdentifier: `catalog/${name}`,
        ...baseConfig,
        push: {
            batchSize: 50,

            async handler(rows) {
                const unitIds = [
                    //@ts-ignore
                    ...new Set(rows.map((row) => row.newDocumentState?.unit_id)),
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
