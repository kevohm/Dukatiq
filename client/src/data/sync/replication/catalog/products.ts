import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '../sync.collections'
import type { ProductDoc } from '@/data/models/product/product'
import type { RxCollection, RxReplicationWriteToMasterRow } from 'rxdb'
import { replicateCollection } from '../replicate.collection'


const beforePush = async (
    db: BusinessDatabase,
    rows: RxReplicationWriteToMasterRow<ProductDoc>[]
) => {
    const categoryIds = [
        ...new Set(
            rows.map((row) => row.newDocumentState?.category_id).filter(Boolean)
        ),
    ]

    const brandIds = [
        ...new Set(
            rows.map((row) => row.newDocumentState?.brand_id).filter(Boolean)
        ),
    ]

    const [categories, brands] = await Promise.all([
        db.productCategories
            .find({
                selector: {
                    id: {
                        $in: categoryIds,
                    },
                },
            })
            .exec(),

        db.brands
            .find({
                selector: {
                    id: {
                        $in: brandIds,
                    },
                },
            })
            .exec(),
    ])

    const categoryMap = new Map(
        categories.map((category) => [category.id, category])
    )

    const brandMap = new Map(brands.map((brand) => [brand.id, brand]))

    const transformed = rows.map((row) => {
        const doc = row.newDocumentState

        return {
            ...row,
            newDocumentState: {
                ...doc,

                category_name: categoryMap.get(doc.category_id)?.name ?? null,

                brand_name: brandMap.get(doc.brand_id)?.name ?? null,
            },
        }
    })

    return transformed
}


export function replicateProducts(db: BusinessDatabase) {
    const collection = db.products as RxCollection<ProductDoc>
    const name = SyncCollections.PRODUCT

    return replicateCollection<ProductDoc>({
        name,
        collection,
        beforePush: (docs)=>beforePush(db,docs)
    })
}
