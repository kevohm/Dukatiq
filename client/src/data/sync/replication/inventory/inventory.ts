import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '@/data/sync/replication/sync.collections'
import type { RxReplicationWriteToMasterRow } from 'rxdb'
import type { InventoryDoc } from '@/data/models/inventory/inventory'
import { replicateCollection } from '../replicate.collection'

const beforePush = async (
    db: BusinessDatabase,
    rows: RxReplicationWriteToMasterRow<InventoryDoc>[]
) => {
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
    return transformed
}

export function replicateInventory(db: BusinessDatabase) {
    const collection = db.inventory
    const name = SyncCollections.INVENTORY

    return replicateCollection<InventoryDoc>({
        collection,
        name,
        beforePush: (docs) => beforePush(db, docs),
    })
}
