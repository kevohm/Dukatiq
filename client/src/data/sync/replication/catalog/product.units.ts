import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '../sync.collections'
import type { RxReplicationWriteToMasterRow } from 'rxdb'
import { replicateCollection } from '../replicate.collection'
import type { ProductUnitDoc } from '@/data/models/product/product.unit'

const beforePush = async(db: BusinessDatabase, rows:RxReplicationWriteToMasterRow<ProductUnitDoc>[])=>{
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

     return transformed
}

export function replicateProductUnits(db: BusinessDatabase) {
    return  replicateCollection<ProductUnitDoc>({
        collection: db.brands,
        name: SyncCollections.BRAND,
        beforePush: (docs)=>beforePush(db, docs)
    })
}